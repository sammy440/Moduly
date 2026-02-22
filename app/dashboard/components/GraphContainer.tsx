"use client";

import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useReport } from '../context/ReportContext';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import { ChevronDown, ChevronUp } from 'lucide-react';

const LAYOUTS = [
    { id: 'force', label: 'Force Directed (Default)', dag: null },
    { id: 'td', label: 'Top-Down Directory', dag: 'td' },
    { id: 'lr', label: 'Left-Right Flow', dag: 'lr' },
    { id: 'zout', label: '3D Z-Layers', dag: 'zout' },
    { id: 'radialout', label: 'Radial Outward', dag: 'radialout' }
];

export function GraphContainer() {
    const { report } = useReport();
    const [layoutStyle, setLayoutStyle] = useState<string>('force');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const fgRef = useRef<any>();

    // Auto-resize graph when window resizes
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight
                });
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const graphData = useMemo(() => {
        if (!report) return { nodes: [], links: [] };

        // Deep copy mapping to ensure force-graph can attach x,y,z coordinates
        const nodes = report.dependencies.nodes.map(n => {
            let derivedType = n.type || 'unknown';
            if (derivedType === 'unknown' || !n.type) {
                if (n.id.includes('components/')) {
                    derivedType = 'ui';
                } else if (n.id.includes('api/') || n.id.includes('utils/') || n.id.includes('hooks/')) {
                    derivedType = 'logic';
                } else if (n.id.endsWith('page.tsx') || n.id.endsWith('layout.tsx') || n.id.endsWith('index.ts') || n.id.endsWith('route.ts')) {
                    derivedType = 'entry';
                } else if (n.id.includes('commands/')) {
                    derivedType = 'command';
                }
            }

            return {
                ...n,
                type: derivedType,
                name: n.id.split('/').pop(),
                color: getNodeColor(derivedType)
            }
        });

        const links = report.dependencies.links.map(l => ({ ...l }));

        return { nodes, links };
    }, [report]);

    const handleNodeClick = (node: any) => {
        setSelectedNodeId(node.id === selectedNodeId ? null : node.id);

        if (node && fgRef.current) {
            // Calculate a camera pos slightly offset from the node
            // Aim at node from outside it
            const distance = 40;
            const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
            fgRef.current.cameraPosition(
                { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
                node, // lookAt
                1000  // ms transition duration
            );
        }
    };

    if (!report) return null;

    const { nodes } = report.dependencies;
    // Map nodes to infer types for selectedNode display too
    const mappedNodes = graphData.nodes as any[];
    const selectedNode = mappedNodes.find(n => n.id === selectedNodeId);

    function getNodeColor(type: string) {
        switch (type) {
            case 'entry': return '#5B9CFF';
            case 'logic': return '#9F7AEA';
            case 'command': return '#CCFF00';
            case 'ui': return '#FF6B6B';
            default: return '#F8FAFC'; // Default fallback color
        }
    }

    return (
        <div ref={containerRef} className="flex-1 relative glass rounded-[3rem] overflow-hidden group">
            <div className="absolute top-10 right-10 z-10 flex flex-col p-2 glass rounded-2xl w-52 transition-all">
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center justify-between w-full px-2 py-1 outline-none"
                >
                    <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Visual Structure</p>
                    {isDropdownOpen ? <ChevronUp size={14} className="text-white/40" /> : <ChevronDown size={14} className="text-white/40" />}
                </button>

                {isDropdownOpen && (
                    <div className="flex flex-col gap-2 mt-3 overflow-hidden animate-fade-in">
                        {LAYOUTS.map(layout => (
                            <button
                                key={layout.id}
                                onClick={() => {
                                    setLayoutStyle(layout.id);
                                    setIsDropdownOpen(false);
                                }}
                                className={`text-xs px-4 py-2 rounded-xl text-left transition-all overflow-hidden text-ellipsis whitespace-nowrap ${layoutStyle === layout.id ? 'bg-primary text-[#060810] font-bold shadow-[0_0_15px_rgba(204,255,0,0.5)]' : 'text-white/60 hover:bg-white/5 hover:text-white font-medium'}`}
                            >
                                {layout.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="absolute top-10 left-10 z-10 pointer-events-none">
                <h2 className="text-2xl font-bold tracking-tight mb-2 text-white">3D Architecture Map</h2>
                <div className="flex flex-col gap-2 mt-4">
                    <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#5B9CFF] rounded-full shadow-[0_0_10px_#5B9CFF]"></span>
                        Entry Point
                    </span>
                    <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#9F7AEA] rounded-full shadow-[0_0_10px_#9F7AEA]"></span>
                        Logic Modules
                    </span>
                    <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#CCFF00] rounded-full shadow-[0_0_10px_#CCFF00]"></span>
                        Commands / Core
                    </span>
                    <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#FF6B6B] rounded-full shadow-[0_0_10px_#FF6B6B]"></span>
                        UI Components
                    </span>
                </div>
            </div>

            <div className={`absolute bottom-10 left-10 z-10 px-6 py-4 glass rounded-2xl transition-opacity duration-500 max-w-[280px] pointer-events-none ${selectedNode ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                <p className="text-[10px] text-white/20 uppercase font-black mb-2">Selection details</p>
                {selectedNode ? (
                    <>
                        <p className="text-sm font-bold text-primary tracking-tight break-words">{selectedNode.id}</p>
                        <div className="flex gap-4 mt-3">
                            <div className="flex flex-col">
                                <span className="text-[9px] text-white/30 uppercase font-bold">TYPE</span>
                                <span className="text-xs font-mono text-white/90">{selectedNode.type}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] text-white/30 uppercase font-bold">INBOUND SIG</span>
                                <span className="text-xs font-mono text-white/90">
                                    {report.dependencies.links.filter(l => l.target === selectedNode.id).length}
                                </span>
                            </div>
                        </div>
                    </>
                ) : (
                    <p className="text-sm font-bold text-primary tracking-tight">Click on a node to focus and view exact info.</p>
                )}
            </div>

            <div className="absolute inset-0 bg-[#060810] -z-20" />

            {(dimensions.width > 0 && typeof window !== 'undefined') && (
                <ForceGraph3D
                    ref={fgRef}
                    graphData={graphData}
                    width={dimensions.width}
                    height={dimensions.height}
                    nodeThreeObject={(node: any) => {
                        const isSelected = node.id === selectedNodeId;
                        let geometry;

                        // Distinct 3D shapes for different architectural components
                        if (node.type === 'ui') {
                            geometry = new THREE.BoxGeometry(10, 10, 10);
                        } else if (node.type === 'logic') {
                            geometry = new THREE.CylinderGeometry(6, 6, 12, 16);
                        } else if (node.type === 'entry') {
                            geometry = new THREE.OctahedronGeometry(8);
                        } else if (node.type === 'command') {
                            geometry = new THREE.TetrahedronGeometry(8);
                        } else {
                            geometry = new THREE.SphereGeometry(6, 16, 16);
                        }

                        const material = new THREE.MeshPhongMaterial({
                            color: isSelected ? '#ffffff' : (node.color || '#5B9CFF'),
                            transparent: true,
                            opacity: isSelected ? 1 : 0.8,
                            shininess: 100,
                            emissive: isSelected ? '#ffffff' : (node.color || '#5B9CFF'),
                            emissiveIntensity: isSelected ? 0.8 : 0.2, // Gives a nice neon glow
                            wireframe: !isSelected && node.type === 'logic' // Add some futuristic wireframe feels
                        });

                        return new THREE.Mesh(geometry, material);
                    }}
                    linkColor={(link: any) => (link.source.id === selectedNodeId || link.target.id === selectedNodeId) ? 'rgba(204,255,0,0.8)' : 'rgba(255,255,255,0.1)'}
                    linkWidth={(link: any) => (link.source.id === selectedNodeId || link.target.id === selectedNodeId) ? 2.5 : 0.5}
                    linkOpacity={0.4}
                    onNodeClick={handleNodeClick}
                    dagMode={LAYOUTS.find(l => l.id === layoutStyle)?.dag as any}
                    dagLevelDistance={40}
                    d3AlphaDecay={0.02}
                    d3VelocityDecay={0.3}
                    backgroundColor="#00000000" // transparent so our gradient shows through
                    showNavInfo={false}
                    enableNodeDrag={false}
                />
            )}
        </div>
    );
}
