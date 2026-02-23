"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useReport } from '../context/ReportContext';
import { Activity, Zap, Box, FileWarning, AlertTriangle, Package } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export function PerformancePanel() {
    const { report } = useReport();

    if (!report?.performance) return <div className="p-10 text-white/50">No performance data available</div>;

    const { performance, stats } = report;

    // Build chart data from top 10 largest files for visualization
    const fileChartData = stats?.fileList
        ?.slice(0, 10)
        .map(f => ({
            name: f.path.split('/').pop() || f.path,
            size: Math.round(f.size / 1024),
            lines: f.linesOfCode,
        })) || [];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 mx-10 mb-10 flex flex-col gap-6">
            {/* Top metric cards */}
            <div className="grid grid-cols-4 gap-6">
                <div className="glass rounded-3xl p-6 flex items-center justify-between">
                    <div>
                        <div className="text-xs font-mono text-white/40 mb-1 uppercase tracking-widest">Bundle Size</div>
                        <div className="text-3xl font-bold text-primary">{performance.bundleSize}</div>
                    </div>
                    <Box size={32} className="text-primary/20" />
                </div>
                <div className="glass rounded-3xl p-6 flex items-center justify-between">
                    <div>
                        <div className="text-xs font-mono text-white/40 mb-1 uppercase tracking-widest">Source Size</div>
                        <div className="text-3xl font-bold text-[#5B9CFF]">{performance.sourceSize}</div>
                    </div>
                    <Activity size={32} className="text-[#5B9CFF]/20" />
                </div>
                <div className="glass rounded-3xl p-6 flex items-center justify-between">
                    <div>
                        <div className="text-xs font-mono text-white/40 mb-1 uppercase tracking-widest">Est. Load Time</div>
                        <div className="text-3xl font-bold text-accent">{performance.loadTime}</div>
                    </div>
                    <Zap size={32} className="text-accent/20" />
                </div>
                <div className="glass rounded-3xl p-6 flex items-center justify-between">
                    <div>
                        <div className="text-xs font-mono text-white/40 mb-1 uppercase tracking-widest">Dependencies</div>
                        <div className="text-3xl font-bold text-[#9F7AEA]">{performance.dependencyCount}</div>
                    </div>
                    <Package size={32} className="text-[#9F7AEA]/20" />
                </div>
            </div>

            {/* File Size Distribution Chart */}
            <div className="glass rounded-3xl p-8 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Activity size={20} className="text-white/60" /> File Size Distribution (KB) — Top 10
                </h3>
                <div className="min-h-[300px]">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={fileChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} axisLine={false} angle={-20} textAnchor="end" height={60} />
                            <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} />
                            <RechartsTooltip
                                cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                contentStyle={{ backgroundColor: '#0f111a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                labelStyle={{ color: '#fff' }}
                            />
                            <Bar dataKey="size" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={30} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* Large Files Warning */}
                <div className="glass rounded-3xl p-8 flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <FileWarning size={20} className="text-yellow-400" /> Large Files
                    </h3>
                    {performance.largeFiles && performance.largeFiles.length > 0 ? (
                        <div className="space-y-3 overflow-y-auto max-h-[300px] pr-2">
                            {performance.largeFiles.map((f: any, i: number) => (
                                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                                    <div className="font-mono text-sm text-white/80 truncate flex-1 mr-4">{f.path}</div>
                                    <div className="flex items-center gap-4 shrink-0">
                                        <span className="text-xs text-white/40">{f.lines} lines</span>
                                        <span className="px-2 py-1 text-xs font-bold rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
                                            {f.size}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-white/30 text-sm py-10">
                            No files over the size threshold detected. Nice! 🎉
                        </div>
                    )}
                </div>

                {/* Heavy Dependencies Warning */}
                <div className="glass rounded-3xl p-8 flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <AlertTriangle size={20} className="text-[#FF6B6B]" /> Heavy Dependencies
                    </h3>
                    {performance.heavyDependencies && performance.heavyDependencies.length > 0 ? (
                        <div className="space-y-3 overflow-y-auto max-h-[300px] pr-2">
                            {performance.heavyDependencies.map((dep: any, i: number) => (
                                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="font-bold text-[#FF6B6B] mb-1">{dep.name}</div>
                                    <div className="text-xs text-white/50">{dep.reason}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-white/30 text-sm py-10">
                            No bloated dependencies detected. Great job! ✅
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
