"use client";

import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { useReport } from '../context/ReportContext';
import ForceGraph3D from 'react-force-graph-3d';
import { LAYOUTS, inferNodeType, getNodeColor, resolveLinkId } from './graph/graphConstants';
import { buildNodeObject, buildNodeTooltip } from './graph/graphThreeUtils';
import { GraphToolbar, GraphLegend, GraphNodeInfo } from './graph/GraphOverlay';

// ─── Component ───────────────────────────────────────────────────────────────

export function GraphContainer() {
    const { report } = useReport();
    const [layoutStyle, setLayoutStyle] = useState<string>('force');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
    const fgRef = useRef<any>();

    // ─── Auto-resize ─────────────────────────────────────────────────────────

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

    // ─── Auto-rotate + zoom to fit ──────────────────────────────────────────

    useEffect(() => {
        if (fgRef.current) {
            const controls = fgRef.current.controls();
            if (controls) {
                controls.autoRotate = true;
                controls.autoRotateSpeed = 0.4;
            }
            fgRef.current.d3Force('charge')?.strength(-40);
            fgRef.current.d3Force('link')?.distance(20);

            const t1 = setTimeout(() => fgRef.current?.zoomToFit(500, 40), 800);
            const t2 = setTimeout(() => fgRef.current?.zoomToFit(600, 50), 2500);
            return () => { clearTimeout(t1); clearTimeout(t2); };
        }
    }, [dimensions]);

    // ─── Graph data ─────────────────────────────────────────────────────────

    const graphData = useMemo(() => {
        if (!report) return { nodes: [], links: [] };

        const nodes = report.dependencies.nodes.map((n: any) => {
            const derivedType = n.type && n.type !== 'unknown' ? n.type : inferNodeType(n.id);
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

        return { nodes, links: report.dependencies.links.map((l: any) => ({ ...l })) };
    }, [report]);

    // ─── Connected nodes (for hover/selection dimming) ──────────────────────

    const connectedNodes = useMemo(() => {
        const active = selectedNodeId || hoveredNodeId;
        if (!active) return null;
        const set = new Set<string>([active]);
        graphData.links.forEach((l: any) => {
            const src = resolveLinkId(l.source);
            const tgt = resolveLinkId(l.target);
            if (src === active) set.add(tgt);
            if (tgt === active) set.add(src);
        });
        return set;
    }, [selectedNodeId, hoveredNodeId, graphData]);

    // ─── Handlers ───────────────────────────────────────────────────────────

    const handleNodeClick = useCallback((node: any) => {
        setSelectedNodeId(node.id === selectedNodeId ? null : node.id);
        if (node && fgRef.current) {
            const d = 60;
            const r = 1 + d / Math.hypot(node.x || 1, node.y || 1, node.z || 1);
            fgRef.current.cameraPosition({ x: node.x * r, y: node.y * r, z: node.z * r }, node, 1200);
        }
    }, [selectedNodeId]);

    const handleResetCamera = useCallback(() => {
        fgRef.current?.cameraPosition({ x: 0, y: 0, z: 300 }, { x: 0, y: 0, z: 0 }, 1000);
        setSelectedNodeId(null);
    }, []);

    const handleZoomToFit = useCallback(() => {
        fgRef.current?.zoomToFit(800, 60);
    }, []);

    // ─── Derived selection info ─────────────────────────────────────────────

    if (!report) return null;

    const selectedNode = (graphData.nodes as any[]).find(n => n.id === selectedNodeId) || null;

    const inboundCount = selectedNode
        ? report.dependencies.links.filter((l: any) => resolveLinkId(l.target) === selectedNode.id).length
        : 0;
    const outboundCount = selectedNode
        ? report.dependencies.links.filter((l: any) => resolveLinkId(l.source) === selectedNode.id).length
        : 0;

    const activeId = selectedNodeId || hoveredNodeId;
    const currentLayout = LAYOUTS.find(l => l.id === layoutStyle) || LAYOUTS[0];

    // ─── Render ─────────────────────────────────────────────────────────────

    return (
        <div ref={containerRef} className="flex-1 relative rounded-[2rem] overflow-hidden" style={{ minHeight: 500 }}>
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#060912] via-[#0a0e1a] to-[#0d1225] -z-20" />
            <div className="absolute inset-0 -z-10" style={{
                background: 'radial-gradient(ellipse at 30% 20%, rgba(91,156,255,0.06) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(159,122,234,0.05) 0%, transparent 60%)',
            }} />

            {/* Overlays */}
            <GraphToolbar
                nodeCount={graphData.nodes.length}
                linkCount={graphData.links.length}
                layoutStyle={layoutStyle}
                isDropdownOpen={isDropdownOpen}
                onToggleDropdown={() => setIsDropdownOpen(prev => !prev)}
                onSelectLayout={(id) => { setLayoutStyle(id); setIsDropdownOpen(false); }}
                onZoomToFit={handleZoomToFit}
                onResetCamera={handleResetCamera}
            />
            <GraphLegend />
            <GraphNodeInfo
                selectedNode={selectedNode}
                inboundCount={inboundCount}
                outboundCount={outboundCount}
                onDeselect={() => setSelectedNodeId(null)}
            />

            {/* 3D Graph */}
            {(dimensions.width > 0 && typeof window !== 'undefined') && (
                <ForceGraph3D
                    ref={fgRef}
                    graphData={graphData}
                    width={dimensions.width}
                    height={dimensions.height}
                    nodeThreeObject={(node: any) => buildNodeObject({
                        node,
                        isSelected: node.id === selectedNodeId,
                        isActive: node.id === selectedNodeId || node.id === hoveredNodeId,
                        isDimmed: !!connectedNodes && !connectedNodes.has(node.id),
                    })}
                    nodeLabel={(node: any) => buildNodeTooltip(node)}
                    linkColor={(link: any) => {
                        const src = resolveLinkId(link.source);
                        const tgt = resolveLinkId(link.target);
                        if (activeId && (src === activeId || tgt === activeId)) return 'rgba(204,255,0,0.7)';
                        if (connectedNodes && activeId) return 'rgba(255,255,255,0.03)';
                        return 'rgba(255,255,255,0.08)';
                    }}
                    linkWidth={(link: any) => {
                        const src = resolveLinkId(link.source);
                        const tgt = resolveLinkId(link.target);
                        return (activeId && (src === activeId || tgt === activeId)) ? 2 : 0.4;
                    }}
                    linkDirectionalParticles={(link: any) => {
                        const src = resolveLinkId(link.source);
                        const tgt = resolveLinkId(link.target);
                        return (activeId && (src === activeId || tgt === activeId)) ? 3 : 0;
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
