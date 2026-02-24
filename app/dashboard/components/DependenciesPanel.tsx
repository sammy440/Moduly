"use client";

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useReport } from '../context/ReportContext';
import { PackageOpen, AlertTriangle, Lightbulb, PackageCheck, PackageX, ArrowUpRight, Check, X, RefreshCw } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

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

// ─── Component ───────────────────────────────────────────────────────────────

export function DependenciesPanel() {
    const { report } = useReport();

    if (!report?.packageDependencies) return (
        <div className="flex-1 mx-10 mb-10 flex items-center justify-center text-white/40">
            <div className="text-center">
                <PackageOpen size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">No dependency data available</p>
            </div>
        </div>
    );

    const { packageDependencies } = report;

    const usedCount = packageDependencies.used.length;
    const unusedCount = packageDependencies.unused.length;
    const totalDeps = usedCount + unusedCount;
    const healthPct = totalDeps > 0 ? Math.round((usedCount / totalDeps) * 100) : 100;

    const chartData = [
        { name: 'Used', value: usedCount, color: '#5B9CFF' },
        { name: 'Unused', value: unusedCount, color: '#FF6B6B' },
    ].filter(d => d.value > 0);

    // Split deps and devDeps for display
    const deps = Object.entries(packageDependencies.dependencies || {});
    const devDeps = Object.entries(packageDependencies.devDependencies || {});

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex-1 mx-4 md:mx-10 mb-6 md:mb-10 flex flex-col gap-5"
        >
            {/* ── Summary cards ────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
                {[
                    { label: 'Total Packages', value: totalDeps, icon: PackageCheck, color: '#5B9CFF', gradient: 'linear-gradient(to right, #5B9CFF00, #5B9CFF, #5B9CFF00)' },
                    { label: 'Actively Used', value: usedCount, icon: Check, color: '#4ECDC4', gradient: 'linear-gradient(to right, #4ECDC400, #4ECDC4, #4ECDC400)' },
                    { label: 'Unused', value: unusedCount, icon: PackageX, color: unusedCount > 0 ? '#FF6B6B' : '#4ECDC4', gradient: unusedCount > 0 ? 'linear-gradient(to right, #FF6B6B00, #FF6B6B, #FF6B6B00)' : 'linear-gradient(to right, #4ECDC400, #4ECDC4, #4ECDC400)' },
                    { label: 'Outdated', value: packageDependencies.outdated.length, icon: RefreshCw, color: packageDependencies.outdated.length > 0 ? '#FFB84C' : '#4ECDC4', gradient: packageDependencies.outdated.length > 0 ? 'linear-gradient(to right, #FFB84C00, #FFB84C, #FFB84C00)' : 'linear-gradient(to right, #4ECDC400, #4ECDC4, #4ECDC400)' },
                ].map((card, i) => (
                    <motion.div
                        key={i}
                        variants={itemVariants}
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="relative overflow-hidden rounded-2xl border border-white/[0.06] p-6 group cursor-default"
                        style={{ background: 'var(--dash-surface)', backdropFilter: 'blur(16px)' }}
                    >
                        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: card.gradient }} />
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{
                            background: `radial-gradient(circle at 50% 0%, ${card.color}10 0%, transparent 70%)`,
                        }} />
                        <div className="flex items-center justify-between relative z-10">
                            <div>
                                <div className="text-[10px] font-semibold text-white/35 mb-2 uppercase tracking-[0.15em]">{card.label}</div>
                                <div className="text-3xl font-black tracking-tight" style={{ color: card.color }}>{card.value}</div>
                            </div>
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${card.color}12`, border: `1px solid ${card.color}20` }}>
                                <card.icon size={20} style={{ color: card.color }} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* ── Middle row — Chart + Used/Unused lists ───────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-5">
                {/* Usage donut */}
                <motion.div
                    variants={scaleIn}
                    className="md:col-span-2 rounded-2xl border border-white/[0.06] p-6 flex flex-col"
                    style={{ background: 'var(--dash-surface)', backdropFilter: 'blur(16px)' }}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-[#5B9CFF]/10 flex items-center justify-center border border-[#5B9CFF]/20">
                            <PackageCheck size={16} className="text-[#5B9CFF]" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white">Usage Health</h3>
                            <p className="text-[10px] text-white/30">Used vs unused dependency ratio</p>
                        </div>
                    </div>

                    <div className="flex-1 relative min-h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={chartData} innerRadius="55%" outerRadius="80%" paddingAngle={4} dataKey="value" strokeWidth={0}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={index} fill={entry.color} />
                                    ))}
                                </Pie>
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: 'var(--dash-surface)', border: '1px solid var(--dash-border)', borderRadius: '10px', fontSize: '11px', color: 'var(--dash-text)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5, type: 'spring' }}
                                className="text-center"
                            >
                                <div className="text-3xl font-black" style={{ color: healthPct > 80 ? '#4ECDC4' : healthPct > 50 ? '#FFB84C' : '#FF6B6B' }}>{healthPct}%</div>
                                <div className="text-[9px] uppercase tracking-[0.2em] text-white/30 font-semibold mt-0.5">Healthy</div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex justify-center gap-6 mt-3">
                        {chartData.map(d => (
                            <div key={d.name} className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color, boxShadow: `0 0 6px ${d.color}` }} />
                                <span className="text-[10px] text-white/40 font-semibold uppercase tracking-wider">{d.name}: {d.value}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Used + Unused lists */}
                <motion.div
                    variants={scaleIn}
                    className="md:col-span-3 rounded-2xl border border-white/[0.06] p-6 flex flex-col"
                    style={{ background: 'var(--dash-surface)', backdropFilter: 'blur(16px)' }}
                >
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-8 h-8 rounded-lg bg-[#9F7AEA]/10 flex items-center justify-center border border-[#9F7AEA]/20">
                            <PackageOpen size={16} className="text-[#9F7AEA]" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white">Package Registry</h3>
                            <p className="text-[10px] text-white/30">All detected packages and their status</p>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto max-h-[300px] pr-1 space-y-1.5">
                        {/* Used deps */}
                        {packageDependencies.used.map((name: string, i: number) => (
                            <motion.div
                                key={`used-${name}`}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.15 + i * 0.03 }}
                                className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-white/[0.02] border border-white/[0.03] hover:bg-white/[0.05] hover:border-white/[0.07] transition-all group"
                            >
                                <div className="flex items-center gap-2.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#4ECDC4]" />
                                    <span className="text-xs font-mono text-white/70 group-hover:text-white/90 transition-colors">{name}</span>
                                </div>
                                <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] rounded-md bg-[#4ECDC4]/8 text-[#4ECDC4] border border-[#4ECDC4]/12">
                                    used
                                </span>
                            </motion.div>
                        ))}

                        {/* Unused deps */}
                        {packageDependencies.unused.map((name: string, i: number) => (
                            <motion.div
                                key={`unused-${name}`}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.15 + (usedCount + i) * 0.03 }}
                                className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-[#FF6B6B]/[0.02] border border-[#FF6B6B]/[0.04] hover:bg-[#FF6B6B]/[0.06] hover:border-[#FF6B6B]/10 transition-all group"
                            >
                                <div className="flex items-center gap-2.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B6B]" />
                                    <span className="text-xs font-mono text-white/70 group-hover:text-white/90 transition-colors">{name}</span>
                                </div>
                                <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] rounded-md bg-[#FF6B6B]/8 text-[#FF6B6B] border border-[#FF6B6B]/12">
                                    unused
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* ── Bottom row — Outdated + Suggestions ─────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                {/* Outdated deps */}
                <motion.div
                    variants={itemVariants}
                    className="rounded-2xl border border-white/[0.06] p-6 flex flex-col"
                    style={{ background: 'var(--dash-surface)', backdropFilter: 'blur(16px)' }}
                >
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-8 h-8 rounded-lg bg-yellow-400/10 flex items-center justify-center border border-yellow-400/20">
                            <AlertTriangle size={16} className="text-yellow-400" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white">Outdated Packages</h3>
                            <p className="text-[10px] text-white/30">Dependencies with newer versions available</p>
                        </div>
                    </div>

                    {packageDependencies.outdated.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center py-8">
                            <div className="w-12 h-12 rounded-full bg-[#4ECDC4]/10 flex items-center justify-center mb-3">
                                <Check size={20} className="text-[#4ECDC4]/60" />
                            </div>
                            <p className="text-sm text-white/40 font-medium">All packages up to date</p>
                            <p className="text-[10px] text-white/20 mt-1">No version bumps needed</p>
                        </div>
                    ) : (
                        <div className="space-y-2 overflow-y-auto max-h-[280px] pr-1">
                            {packageDependencies.outdated.map((pkg: any, i: number) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + i * 0.06 }}
                                    className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] hover:border-yellow-400/10 transition-all flex items-center justify-between group"
                                >
                                    <div>
                                        <span className="text-sm font-bold text-white group-hover:text-yellow-400 transition-colors">{pkg.name}</span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] font-mono text-white/30">{pkg.current}</span>
                                            <ArrowUpRight size={10} className="text-yellow-400/50" />
                                            <span className="text-[10px] font-mono text-yellow-400">{pkg.latest}</span>
                                        </div>
                                    </div>
                                    <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] rounded-md bg-yellow-400/10 text-yellow-400 border border-yellow-400/15 shrink-0">
                                        update
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* AI Suggestions */}
                <motion.div
                    variants={itemVariants}
                    className="rounded-2xl border border-white/[0.06] p-6 flex flex-col"
                    style={{ background: 'var(--dash-surface)', backdropFilter: 'blur(16px)' }}
                >
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-8 h-8 rounded-lg bg-[#CCFF00]/10 flex items-center justify-center border border-[#CCFF00]/20">
                            <Lightbulb size={16} className="text-[#CCFF00]" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white">AI Suggestions</h3>
                            <p className="text-[10px] text-white/30">Recommended packages for your project</p>
                        </div>
                    </div>

                    {packageDependencies.suggestions.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center py-8">
                            <div className="w-12 h-12 rounded-full bg-[#CCFF00]/10 flex items-center justify-center mb-3">
                                <Lightbulb size={20} className="text-[#CCFF00]/60" />
                            </div>
                            <p className="text-sm text-white/40 font-medium">No suggestions right now</p>
                            <p className="text-[10px] text-white/20 mt-1">Your setup looks comprehensive</p>
                        </div>
                    ) : (
                        <div className="space-y-2 overflow-y-auto max-h-[280px] pr-1">
                            {packageDependencies.suggestions.map((sug: string, i: number) => {
                                const [name, ...descParts] = sug.split(' - ');
                                const desc = descParts.join(' - ');

                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + i * 0.06 }}
                                        className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] hover:border-[#CCFF00]/10 transition-all group"
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#CCFF00]" />
                                            <span className="text-sm font-bold text-white group-hover:text-[#CCFF00] transition-colors">{name.trim()}</span>
                                        </div>
                                        {desc && <p className="text-[11px] text-white/35 leading-relaxed pl-3.5">{desc.trim()}</p>}
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
}
