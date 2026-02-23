"use client";

import React from 'react';
import { ChevronDown, ChevronUp, Maximize2, RotateCcw, Layers } from 'lucide-react';
import { LAYOUTS, NODE_COLORS } from './graphConstants';

// ─── Top bar (title + controls) ──────────────────────────────────────────────

interface GraphToolbarProps {
    nodeCount: number;
    linkCount: number;
    layoutStyle: string;
    isDropdownOpen: boolean;
    onToggleDropdown: () => void;
    onSelectLayout: (id: string) => void;
    onZoomToFit: () => void;
    onResetCamera: () => void;
}

export function GraphToolbar({
    nodeCount, linkCount,
    layoutStyle, isDropdownOpen,
    onToggleDropdown, onSelectLayout,
    onZoomToFit, onResetCamera,
}: GraphToolbarProps) {
    const currentLayout = LAYOUTS.find(l => l.id === layoutStyle) || LAYOUTS[0];

    return (
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-8 py-5">
            {/* Title */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#5B9CFF]/20 to-[#9F7AEA]/20 flex items-center justify-center border border-white/10">
                    <Layers size={27} className="text-[#5B9CFF]" />
                </div>
                <div>
                    <h3 className="text-xl font-bold tracking-tight text-white">Architecture Map</h3>
                    <p className="text-[10px] text-white/30 font-medium tracking-wide">
                        {nodeCount} modules · {linkCount} connections
                    </p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
                <button onClick={onZoomToFit} className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white/50 hover:text-white" title="Zoom to fit">
                    <Maximize2 size={14} />
                </button>
                <button onClick={onResetCamera} className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white/50 hover:text-white" title="Reset view">
                    <RotateCcw size={14} />
                </button>

                {/* Layout dropdown */}
                <div className="relative ml-2">
                    <button onClick={onToggleDropdown} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-xs font-medium text-white/60 hover:text-white">
                        <span className="text-sm">{currentLayout.icon}</span>
                        <span className="hidden sm:inline">{currentLayout.label}</span>
                        {isDropdownOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute top-full right-0 mt-2 w-48 rounded-xl overflow-hidden border border-white/10 shadow-2xl animate-fade-in" style={{ background: 'rgba(10,14,26,0.95)', backdropFilter: 'blur(20px)' }}>
                            {LAYOUTS.map(layout => (
                                <button
                                    key={layout.id}
                                    onClick={() => onSelectLayout(layout.id)}
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
    );
}

// ─── Color legend ────────────────────────────────────────────────────────────

export function GraphLegend() {
    return (
        <div className="absolute bottom-6 left-6 z-10 flex flex-wrap gap-x-5 gap-y-2 px-4 py-3 rounded-xl border border-white/5" style={{ background: 'rgba(6,9,18,0.7)', backdropFilter: 'blur(12px)' }}>
            {Object.entries(NODE_COLORS).filter(([k]) => k !== 'unknown').map(([type, color]) => (
                <span key={type} className="text-[10px] text-white/40 uppercase tracking-wider font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }} />
                    {type}
                </span>
            ))}
        </div>
    );
}

// ─── Selection info card ─────────────────────────────────────────────────────

interface GraphNodeInfoProps {
    selectedNode: any | null;
    inboundCount: number;
    outboundCount: number;
    onDeselect: () => void;
}

export function GraphNodeInfo({ selectedNode, inboundCount, outboundCount, onDeselect }: GraphNodeInfoProps) {
    return (
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

                        {/* LOC bar */}
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

                        <button onClick={onDeselect} className="w-full text-[10px] text-white/30 hover:text-white/60 transition-colors py-1 uppercase tracking-widest font-bold">
                            Click to deselect
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
