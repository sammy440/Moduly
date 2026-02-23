"use client";

import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { useReport } from '../context/ReportContext';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import { ChevronDown, ChevronUp, Maximize2, RotateCcw, Focus, Layers } from 'lucide-react';

// ─── Layout presets ──────────────────────────────────────────────────────────

const LAYOUTS = [
    { id: 'force', label: 'Force Directed', dag: null, icon: '◎' },
    { id: 'td', label: 'Top-Down', dag: 'td', icon: '↓' },
    { id: 'lr', label: 'Left → Right', dag: 'lr', icon: '→' },
    { id: 'zout', label: 'Z-Layers', dag: 'zout', icon: '◈' },
    { id: 'radialout', label: 'Radial', dag: 'radialout', icon: '◉' }
];

// ─── Color palette ───────────────────────────────────────────────────────────

const NODE_COLORS: Record<string, string> = {
    entry: '#5B9CFF',
    logic: '#9F7AEA',
    command: '#CCFF00',
    ui: '#FF6B6B',
    data: '#FFB84C',
    config: '#4ECDC4',
    unknown: '#8892B0',
};

const GLOW_INTENSITY = 0.35;
const IDLE_OPACITY = 0.85;
const DIM_OPACITY = 0.15;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function inferNodeType(id: string): string {
    if (id.includes('components/') || id.includes('ui/')) return 'ui';
    if (id.includes('api/') || id.includes('utils/') || id.includes('hooks/') || id.includes('lib/') || id.includes('analyzer/')) return 'logic';
    if (id.endsWith('page.tsx') || id.endsWith('layout.tsx') || id.endsWith('index.ts') || id.endsWith('index.js') || id.endsWith('route.ts')) return 'entry';
    if (id.includes('commands/') || id.includes('cmd/')) return 'command';
    if (id.includes('types') || id.includes('data/') || id.includes('models/') || id.includes('schema')) return 'data';
    if (id.endsWith('.json') || id.endsWith('.config.ts') || id.endsWith('.config.js')) return 'config';
    return 'unknown';
}

function getNodeColor(type: string): string {
    return NODE_COLORS[type] || NODE_COLORS.unknown;
}

function createTextSprite(text: string, color: string): THREE.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;

    ctx.font = 'bold 28px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.85;
    ctx.fillText(text.length > 24 ? text.slice(0, 22) + '…' : text, 256, 32);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(32, 4, 1);
    return sprite;
}

function createGlowSprite(color: string, size: number): THREE.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, color + 'AA');
    gradient.addColorStop(0.3, color + '44');
    gradient.addColorStop(1, color + '00');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });

    const sprite = new THREE.Sprite(material);
    sprite.scale.set(size * 4, size * 4, 1);
    return sprite;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function GraphContainer() {
    const { report } = useReport();
    const [layoutStyle, setLayoutStyle] = useState<string>('force');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
    const fgRef = useRef<any>();

    // Auto-resize
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight,
                });
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Auto-rotate on load + zoom to fit
    useEffect(() => {
        if (fgRef.current) {
            const controls = fgRef.current.controls();
            if (controls) {
                controls.autoRotate = true;
                controls.autoRotateSpeed = 0.4;
            }
            // Tighten force simulation — less repulsion = tighter cluster
            fgRef.current.d3Force('charge')?.strength(-40);
            fgRef.current.d3Force('link')?.distance(20);

            // Auto zoom-to-fit: fire twice to catch simulation settling
            const timer1 = setTimeout(() => {
                fgRef.current?.zoomToFit(500, 40);
            }, 800);
            const timer2 = setTimeout(() => {
                fgRef.current?.zoomToFit(600, 50);
            }, 2500);

            return () => { clearTimeout(timer1); clearTimeout(timer2); };
        }
    }, [dimensions]);

    // ─── Graph data ──────────────────────────────────────────────────────────

    const graphData = useMemo(() => {
        if (!report) return { nodes: [], links: [] };

        const nodes = report.dependencies.nodes.map((n: any) => {
            const derivedType = n.type && n.type !== 'unknown' ? n.type : inferNodeType(n.id);
            // Match file info for LOC sizing
            const fileInfo = report.stats.fileList.find((f: any) => f.path === n.id);

            return {
                ...n,
                type: derivedType,
                name: n.id.split('/').pop(),
                color: getNodeColor(derivedType),
                loc: fileInfo?.linesOfCode || 0,
                fileSize: fileInfo?.size || 0,
            };
        });

        const links = report.dependencies.links.map((l: any) => ({ ...l }));
        return { nodes, links };
    }, [report]);

    // ─── Connected nodes set for highlighting ────────────────────────────────

    const connectedNodes = useMemo(() => {
        const active = selectedNodeId || hoveredNodeId;
        if (!active) return null;
        const set = new Set<string>();
        set.add(active);
        graphData.links.forEach((l: any) => {
            const src = typeof l.source === 'string' ? l.source : l.source?.id;
            const tgt = typeof l.target === 'string' ? l.target : l.target?.id;
            if (src === active) set.add(tgt);
            if (tgt === active) set.add(src);
        });
        return set;
    }, [selectedNodeId, hoveredNodeId, graphData]);

    // ─── Interaction handlers ────────────────────────────────────────────────

    const handleNodeClick = useCallback((node: any) => {
        setSelectedNodeId(node.id === selectedNodeId ? null : node.id);

        if (node && fgRef.current) {
            const distance = 60;
            const distRatio = 1 + distance / Math.hypot(node.x || 1, node.y || 1, node.z || 1);
            fgRef.current.cameraPosition(
                { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
                node,
                1200
            );
        }
    }, [selectedNodeId]);

    const handleResetCamera = useCallback(() => {
        if (fgRef.current) {
            fgRef.current.cameraPosition({ x: 0, y: 0, z: 300 }, { x: 0, y: 0, z: 0 }, 1000);
        }
        setSelectedNodeId(null);
    }, []);

    const handleZoomToFit = useCallback(() => {
        if (fgRef.current) {
            fgRef.current.zoomToFit(800, 60);
        }
    }, []);

    if (!report) return null;

    const mappedNodes = graphData.nodes as any[];
    const selectedNode = mappedNodes.find((n: any) => n.id === selectedNodeId);

    // Connections summary
    const inboundCount = selectedNode ? report.dependencies.links.filter((l: any) => {
        const tgt = typeof l.target === 'string' ? l.target : l.target?.id;
        return tgt === selectedNode.id;
    }).length : 0;
    const outboundCount = selectedNode ? report.dependencies.links.filter((l: any) => {
        const src = typeof l.source === 'string' ? l.source : l.source?.id;
        return src === selectedNode.id;
    }).length : 0;

    const currentLayout = LAYOUTS.find(l => l.id === layoutStyle) || LAYOUTS[0];

    return (
        <div ref={containerRef} className="flex-1 relative rounded-[2rem] overflow-hidden" style={{ minHeight: 500 }}>
            {/* ── Frosted background ─────────────────────────────────────────── */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#060912] via-[#0a0e1a] to-[#0d1225] -z-20" />
            <div className="absolute inset-0 -z-10" style={{
                background: 'radial-gradient(ellipse at 30% 20%, rgba(91,156,255,0.06) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(159,122,234,0.05) 0%, transparent 60%)',
            }} />

            {/* ── Top Bar ────────────────────────────────────────────────────── */}
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-8 py-5">
                {/* Title + stats */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#5B9CFF]/20 to-[#9F7AEA]/20 flex items-center justify-center border border-white/10">
                            <Layers size={27} className="text-[#5B9CFF]" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold tracking-tight text-white">Architecture Map</h3>
                            <p className="text-[10px] text-white/30 font-medium tracking-wide">
                                {graphData.nodes.length} modules · {graphData.links.length} connections
                            </p>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2">
                    {/* Camera controls */}
                    <button
                        onClick={handleZoomToFit}
                        className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white/50 hover:text-white"
                        title="Zoom to fit"
                    >
                        <Maximize2 size={14} />
                    </button>
                    <button
                        onClick={handleResetCamera}
                        className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white/50 hover:text-white"
                        title="Reset view"
                    >
                        <RotateCcw size={14} />
                    </button>

                    {/* Layout dropdown */}
                    <div className="relative ml-2">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-xs font-medium text-white/60 hover:text-white"
                        >
                            <span className="text-sm">{currentLayout.icon}</span>
                            <span className="hidden sm:inline">{currentLayout.label}</span>
                            {isDropdownOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute top-full right-0 mt-2 w-48 rounded-xl overflow-hidden border border-white/10 shadow-2xl animate-fade-in" style={{ background: 'rgba(10,14,26,0.95)', backdropFilter: 'blur(20px)' }}>
                                {LAYOUTS.map(layout => (
                                    <button
                                        key={layout.id}
                                        onClick={() => { setLayoutStyle(layout.id); setIsDropdownOpen(false); }}
                                        className={`w-full text-left px-4 py-3 text-xs transition-all flex items-center gap-3 ${layoutStyle === layout.id
                                            ? 'bg-primary/10 text-primary font-bold'
                                            : 'text-white/50 hover:bg-white/5 hover:text-white font-medium'
                                            }`}
                                    >
                                        <span className="text-base w-5 text-center">{layout.icon}</span>
                                        {layout.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Legend ──────────────────────────────────────────────────────── */}
            <div className="absolute bottom-6 left-6 z-10 flex flex-wrap gap-x-5 gap-y-2 px-4 py-3 rounded-xl border border-white/5" style={{ background: 'rgba(6,9,18,0.7)', backdropFilter: 'blur(12px)' }}>
                {Object.entries(NODE_COLORS).filter(([k]) => k !== 'unknown').map(([type, color]) => (
                    <span key={type} className="text-[10px] text-white/40 uppercase tracking-wider font-semibold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }} />
                        {type}
                    </span>
                ))}
            </div>

            {/* ── Selection Info Card ─────────────────────────────────────────── */}
            <div className={`absolute bottom-6 right-6 z-10 w-72 transition-all duration-500 ${selectedNode ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                <div className="rounded-2xl border border-white/10 p-5 space-y-4" style={{ background: 'rgba(6,9,18,0.85)', backdropFilter: 'blur(20px)' }}>
                    {selectedNode && (
                        <>
                            {/* Header */}
                            <div className="flex items-start gap-3">
                                <div className="w-3 h-3 rounded-full mt-1 shrink-0" style={{ backgroundColor: selectedNode.color, boxShadow: `0 0 12px ${selectedNode.color}` }} />
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-white truncate">{selectedNode.name}</p>
                                    <p className="text-[10px] text-white/30 font-mono truncate">{selectedNode.id}</p>
                                </div>
                            </div>

                            {/* Stats grid */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="p-2.5 rounded-lg bg-white/5">
                                    <div className="text-[9px] text-white/30 uppercase font-bold mb-1">Type</div>
                                    <div className="text-xs font-semibold capitalize" style={{ color: selectedNode.color }}>{selectedNode.type}</div>
                                </div>
                                <div className="p-2.5 rounded-lg bg-white/5">
                                    <div className="text-[9px] text-white/30 uppercase font-bold mb-1">In</div>
                                    <div className="text-xs font-semibold text-white">{inboundCount}</div>
                                </div>
                                <div className="p-2.5 rounded-lg bg-white/5">
                                    <div className="text-[9px] text-white/30 uppercase font-bold mb-1">Out</div>
                                    <div className="text-xs font-semibold text-white">{outboundCount}</div>
                                </div>
                            </div>

                            {/* LOC Bar */}
                            {selectedNode.loc > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[9px] text-white/30 uppercase font-bold">Lines of Code</span>
                                        <span className="text-[10px] text-white/60 font-mono">{selectedNode.loc}</span>
                                    </div>
                                    <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                                        <div className="h-full rounded-full transition-all duration-700" style={{
                                            width: `${Math.min(100, (selectedNode.loc / 500) * 100)}%`,
                                            background: `linear-gradient(to right, ${selectedNode.color}88, ${selectedNode.color})`,
                                        }} />
                                    </div>
                                </div>
                            )}

                            {/* Deselect */}
                            <button
                                onClick={() => setSelectedNodeId(null)}
                                className="w-full text-[10px] text-white/30 hover:text-white/60 transition-colors py-1 uppercase tracking-widest font-bold"
                            >
                                Click to deselect
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* ── 3D Graph ────────────────────────────────────────────────────── */}
            {(dimensions.width > 0 && typeof window !== 'undefined') && (
                <ForceGraph3D
                    ref={fgRef}
                    graphData={graphData}
                    width={dimensions.width}
                    height={dimensions.height}
                    nodeThreeObject={(node: any) => {
                        const isSelected = node.id === selectedNodeId;
                        const isHovered = node.id === hoveredNodeId;
                        const isActive = isSelected || isHovered;
                        const isDimmed = connectedNodes && !connectedNodes.has(node.id);

                        // Scale based on LOC (more code = bigger node)
                        const baseSize = 6 + Math.min(10, (node.loc || 0) / 60);
                        const size = isActive ? baseSize * 1.3 : baseSize;

                        const group = new THREE.Group();
                        const color = node.color || '#8892B0';

                        // ── Text label ───────────────────────────────────────
                        if (!isDimmed) {
                            const label = createTextSprite(node.name || '', isActive ? '#ffffff' : (color + 'CC'));
                            label.position.set(0, size + 6, 0);
                            group.add(label);
                        }

                        // ── Core geometry ────────────────────────────────────
                        let geometry: THREE.BufferGeometry;
                        switch (node.type) {
                            case 'entry':
                                geometry = new THREE.OctahedronGeometry(size, 1);
                                break;
                            case 'ui':
                                geometry = new THREE.BoxGeometry(size * 1.4, size * 1.4, size * 1.4);
                                break;
                            case 'logic':
                                geometry = new THREE.IcosahedronGeometry(size, 0);
                                break;
                            case 'command':
                                geometry = new THREE.TetrahedronGeometry(size * 1.2, 0);
                                break;
                            case 'data':
                                geometry = new THREE.CylinderGeometry(size * 0.8, size * 0.8, size * 1.2, 6);
                                break;
                            case 'config':
                                geometry = new THREE.TorusGeometry(size * 0.7, size * 0.25, 8, 16);
                                break;
                            default:
                                geometry = new THREE.SphereGeometry(size, 16, 16);
                        }

                        const opacity = isDimmed ? DIM_OPACITY : IDLE_OPACITY;

                        // ── Filled core ──────────────────────────────────────
                        const coreMaterial = new THREE.MeshPhysicalMaterial({
                            color: isSelected ? '#ffffff' : color,
                            transparent: true,
                            opacity: isSelected ? 1 : opacity,
                            roughness: 0.15,
                            metalness: 0.6,
                            clearcoat: 1,
                            clearcoatRoughness: 0.1,
                            emissive: isSelected ? '#ffffff' : color,
                            emissiveIntensity: isActive ? 0.6 : GLOW_INTENSITY,
                        });
                        const coreMesh = new THREE.Mesh(geometry, coreMaterial);
                        group.add(coreMesh);

                        // ── Wireframe overlay (sleek edge highlight) ──────────
                        if (!isDimmed) {
                            const wireframeMaterial = new THREE.MeshBasicMaterial({
                                color: isSelected ? '#ffffff' : color,
                                wireframe: true,
                                transparent: true,
                                opacity: isActive ? 0.5 : 0.12,
                            });
                            const wireframe = new THREE.Mesh(geometry.clone(), wireframeMaterial);
                            wireframe.scale.set(1.08, 1.08, 1.08);
                            group.add(wireframe);
                        }

                        // ── Glow sprite (halo) ───────────────────────────────
                        if (!isDimmed) {
                            const glow = createGlowSprite(color, size);
                            glow.material.opacity = isActive ? 0.7 : 0.25;
                            group.add(glow);
                        }

                        // ── Orbiting ring for selected node ──────────────────
                        if (isSelected) {
                            const ringGeo = new THREE.RingGeometry(size * 1.8, size * 2, 32);
                            const ringMat = new THREE.MeshBasicMaterial({
                                color: '#CCFF00',
                                transparent: true,
                                opacity: 0.4,
                                side: THREE.DoubleSide,
                            });
                            const ring = new THREE.Mesh(ringGeo, ringMat);
                            ring.rotation.x = Math.PI / 2;
                            group.add(ring);
                        }

                        return group;
                    }}
                    nodeLabel={(node: any) => `
                        <div style="
                            background: rgba(6,9,18,0.92);
                            backdrop-filter: blur(12px);
                            border: 1px solid rgba(255,255,255,0.1);
                            padding: 8px 14px;
                            border-radius: 10px;
                            font-family: system-ui, -apple-system, sans-serif;
                            font-size: 11px;
                            color: #fff;
                            pointer-events: none;
                            max-width: 260px;
                        ">
                            <div style="font-weight:700; margin-bottom: 4px; color: ${node.color};">${node.name}</div>
                            <div style="color: rgba(255,255,255,0.35); font-size: 9px; font-family: monospace;">${node.id}</div>
                            ${node.loc ? `<div style="margin-top: 6px; color: rgba(255,255,255,0.5); font-size: 9px;">${node.loc} LOC</div>` : ''}
                        </div>
                    `}
                    linkColor={(link: any) => {
                        const src = typeof link.source === 'string' ? link.source : link.source?.id;
                        const tgt = typeof link.target === 'string' ? link.target : link.target?.id;
                        const active = selectedNodeId || hoveredNodeId;

                        if (active && (src === active || tgt === active)) {
                            return 'rgba(204,255,0,0.7)';
                        }
                        if (connectedNodes && active) {
                            return 'rgba(255,255,255,0.03)';
                        }
                        return 'rgba(255,255,255,0.08)';
                    }}
                    linkWidth={(link: any) => {
                        const src = typeof link.source === 'string' ? link.source : link.source?.id;
                        const tgt = typeof link.target === 'string' ? link.target : link.target?.id;
                        const active = selectedNodeId || hoveredNodeId;
                        return (active && (src === active || tgt === active)) ? 2 : 0.4;
                    }}
                    linkDirectionalParticles={(link: any) => {
                        const src = typeof link.source === 'string' ? link.source : link.source?.id;
                        const tgt = typeof link.target === 'string' ? link.target : link.target?.id;
                        const active = selectedNodeId || hoveredNodeId;
                        return (active && (src === active || tgt === active)) ? 3 : 0;
                    }}
                    linkDirectionalParticleWidth={1.5}
                    linkDirectionalParticleColor={() => '#CCFF00'}
                    linkDirectionalParticleSpeed={0.006}
                    linkOpacity={0.4}
                    onNodeClick={handleNodeClick}
                    onNodeHover={(node: any) => setHoveredNodeId(node?.id || null)}
                    dagMode={currentLayout.dag as any}
                    dagLevelDistance={45}
                    d3AlphaDecay={0.015}
                    d3VelocityDecay={0.4}
                    warmupTicks={80}
                    cooldownTicks={200}
                    backgroundColor="#00000000"
                    showNavInfo={false}
                    enableNodeDrag={true}
                />
            )}
        </div>
    );
}
