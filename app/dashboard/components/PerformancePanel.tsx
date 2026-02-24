"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useReport } from '../context/ReportContext';
import { Activity, Zap, Box, FileWarning, AlertTriangle, Package, TrendingUp, Gauge } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts';

// ─── Animation variants ──────────────────────────────────────────────────────

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" as const } },
};

// ─── Metric card component ───────────────────────────────────────────────────

function MetricCard({ label, value, icon: Icon, color, gradient, delay = 0 }: {
    label: string; value: string | number; icon: any; color: string; gradient: string; delay?: number;
}) {
    return (
        <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -2 }}
            className="relative overflow-hidden rounded-2xl border border-white/[0.06] p-6 group cursor-default"
            style={{ background: 'var(--dash-surface)', backdropFilter: 'blur(16px)' }}
        >
            {/* Gradient accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: gradient }} />

            {/* Hover glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{
                background: `radial-gradient(circle at 50% 0%, ${color}10 0%, transparent 70%)`,
            }} />

            <div className="flex items-center justify-between relative z-10">
                <div>
                    <div className="text-[10px] font-semibold text-white/35 mb-2 uppercase tracking-[0.15em]">{label}</div>
                    <div className="text-3xl font-black tracking-tight" style={{ color }}>{value}</div>
                </div>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${color}12`, border: `1px solid ${color}20` }}>
                    <Icon size={20} style={{ color }} />
                </div>
            </div>
        </motion.div>
    );
}

// ─── Component ───────────────────────────────────────────────────────────────

export function PerformancePanel() {
    const { report } = useReport();

    if (!report?.performance) return (
        <div className="flex-1 mx-10 mb-10 flex items-center justify-center text-white/40">
            <div className="text-center">
                <Gauge size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">No performance data available</p>
            </div>
        </div>
    );

    const { performance, stats } = report;

    // File chart data — top 10 by size
    const fileChartData = stats?.fileList
        ?.sort((a: any, b: any) => b.size - a.size)
        .slice(0, 10)
        .map((f: any) => ({
            name: f.path.split('/').pop() || f.path,
            size: Math.round(f.size / 1024 * 10) / 10,
            lines: f.linesOfCode,
        })) || [];

    // Simulated area data for load-time visual
    const loadTimeData = [
        { t: '0ms', value: 0 },
        { t: '200ms', value: 15 },
        { t: '500ms', value: 40 },
        { t: '800ms', value: 65 },
        { t: '1s', value: 80 },
        { t: '1.5s', value: 92 },
        { t: '2s', value: 97 },
        { t: '3s', value: 100 },
    ];

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex-1 mx-4 md:mx-10 mb-6 md:mb-10 flex flex-col gap-5"
        >
            {/* ── Metric cards ────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                <MetricCard label="Bundle Size" value={performance.bundleSize} icon={Box} color="#CCFF00" gradient="linear-gradient(to right, #CCFF0000, #CCFF00, #CCFF0000)" />
                <MetricCard label="Source Size" value={performance.sourceSize} icon={Activity} color="#5B9CFF" gradient="linear-gradient(to right, #5B9CFF00, #5B9CFF, #5B9CFF00)" />
                <MetricCard label="Est. Load Time" value={performance.loadTime} icon={Zap} color="#FFB84C" gradient="linear-gradient(to right, #FFB84C00, #FFB84C, #FFB84C00)" />
                <MetricCard label="Dependencies" value={performance.dependencyCount} icon={Package} color="#9F7AEA" gradient="linear-gradient(to right, #9F7AEA00, #9F7AEA, #9F7AEA00)" />
            </div>

            {/* ── Charts row ──────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-5">
                {/* File Size Distribution */}
                <motion.div
                    variants={scaleIn}
                    className="lg:col-span-3 rounded-2xl border border-white/[0.06] p-6 flex flex-col"
                    style={{ background: 'var(--dash-surface)', backdropFilter: 'blur(16px)' }}
                >
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#5B9CFF]/10 flex items-center justify-center border border-[#5B9CFF]/20">
                                <Activity size={16} className="text-[#5B9CFF]" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">File Size Distribution</h3>
                                <p className="text-[10px] text-white/30">Top 10 largest files (KB)</p>
                            </div>
                        </div>
                    </div>
                    <div className="h-[260px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={fileChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                                <XAxis dataKey="name" stroke="rgba(255,255,255,0.15)" fontSize={10} tickLine={false} axisLine={false} angle={-25} textAnchor="end" height={55} />
                                <YAxis stroke="rgba(255,255,255,0.15)" fontSize={10} tickLine={false} axisLine={false} />
                                <RechartsTooltip
                                    cursor={{ fill: 'rgba(91,156,255,0.04)' }}
                                    contentStyle={{ backgroundColor: 'var(--dash-surface)', border: '1px solid var(--dash-border)', borderRadius: '10px', fontSize: '11px', backdropFilter: 'blur(12px)', color: 'var(--dash-text)' }}
                                    labelStyle={{ color: 'var(--dash-text)', fontWeight: 700 }}
                                />
                                <Bar dataKey="size" radius={[6, 6, 0, 0]} barSize={24}>
                                    {fileChartData.map((_: any, i: number) => (
                                        <motion.rect key={i} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.3 + i * 0.05 }} />
                                    ))}
                                </Bar>
                                <defs>
                                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#5B9CFF" />
                                        <stop offset="100%" stopColor="#9F7AEA" />
                                    </linearGradient>
                                </defs>
                                <Bar dataKey="size" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Load Time Curve */}
                <motion.div
                    variants={scaleIn}
                    className="lg:col-span-2 rounded-2xl border border-white/[0.06] p-6 flex flex-col"
                    style={{ background: 'var(--dash-surface)', backdropFilter: 'blur(16px)' }}
                >
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-8 h-8 rounded-lg bg-[#FFB84C]/10 flex items-center justify-center border border-[#FFB84C]/20">
                            <TrendingUp size={16} className="text-[#FFB84C]" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white">Load Progression</h3>
                            <p className="text-[10px] text-white/30">Estimated % loaded over time</p>
                        </div>
                    </div>
                    <div className="h-[260px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={loadTimeData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="loadGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#FFB84C" stopOpacity={0.3} />
                                        <stop offset="100%" stopColor="#FFB84C" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                                <XAxis dataKey="t" stroke="rgba(255,255,255,0.15)" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="rgba(255,255,255,0.15)" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: 'var(--dash-surface)', border: '1px solid var(--dash-border)', borderRadius: '10px', fontSize: '11px', color: 'var(--dash-text)' }}
                                    labelStyle={{ color: 'var(--dash-text)', fontWeight: 700 }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#FFB84C" strokeWidth={2} fill="url(#loadGradient)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* ── Bottom cards row ────────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
                {/* Large Files */}
                <motion.div
                    variants={itemVariants}
                    className="rounded-2xl border border-white/[0.06] p-6 flex flex-col"
                    style={{ background: 'var(--dash-surface)', backdropFilter: 'blur(16px)' }}
                >
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-8 h-8 rounded-lg bg-yellow-400/10 flex items-center justify-center border border-yellow-400/20">
                            <FileWarning size={16} className="text-yellow-400" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white">Large Files</h3>
                            <p className="text-[10px] text-white/30">Files exceeding 500 LOC or 20KB</p>
                        </div>
                    </div>

                    {performance.largeFiles && performance.largeFiles.length > 0 ? (
                        <div className="space-y-2.5 overflow-y-auto max-h-[240px] pr-1">
                            {performance.largeFiles.map((f: any, i: number) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + i * 0.06 }}
                                    className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.04] flex items-center justify-between hover:bg-white/[0.06] hover:border-white/[0.08] transition-all group"
                                >
                                    <div className="font-mono text-xs text-white/70 truncate flex-1 mr-4 group-hover:text-white/90 transition-colors">{f.path}</div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <span className="text-[10px] text-white/30 font-mono">{f.lines} LOC</span>
                                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-yellow-400/10 text-yellow-400 border border-yellow-400/15">
                                            {f.size}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center py-8">
                            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-3">
                                <FileWarning size={20} className="text-green-400/60" />
                            </div>
                            <p className="text-sm text-white/40 font-medium">No oversized files detected</p>
                            <p className="text-[10px] text-white/20 mt-1">All files are within size thresholds</p>
                        </div>
                    )}
                </motion.div>

                {/* Heavy Dependencies */}
                <motion.div
                    variants={itemVariants}
                    className="rounded-2xl border border-white/[0.06] p-6 flex flex-col"
                    style={{ background: 'var(--dash-surface)', backdropFilter: 'blur(16px)' }}
                >
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-8 h-8 rounded-lg bg-[#FF6B6B]/10 flex items-center justify-center border border-[#FF6B6B]/20">
                            <AlertTriangle size={16} className="text-[#FF6B6B]" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white">Heavy Dependencies</h3>
                            <p className="text-[10px] text-white/30">Known bloated packages in your tree</p>
                        </div>
                    </div>

                    {performance.heavyDependencies && performance.heavyDependencies.length > 0 ? (
                        <div className="space-y-2.5 overflow-y-auto max-h-[240px] pr-1">
                            {performance.heavyDependencies.map((dep: any, i: number) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + i * 0.06 }}
                                    className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.04] hover:bg-white/[0.06] hover:border-[#FF6B6B]/10 transition-all"
                                >
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B6B]" />
                                        <div className="font-bold text-sm text-white">{dep.name}</div>
                                    </div>
                                    <div className="text-[11px] text-white/40 leading-relaxed pl-3.5">{dep.reason}</div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center py-8">
                            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-3">
                                <Package size={20} className="text-green-400/60" />
                            </div>
                            <p className="text-sm text-white/40 font-medium">No bloated dependencies</p>
                            <p className="text-[10px] text-white/20 mt-1">Your dependency tree looks healthy</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
}
