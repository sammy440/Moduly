"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useReport } from '../context/ReportContext';
import { ShieldAlert, ShieldCheck, Bug, Package, FileCode, Shield, AlertOctagon } from 'lucide-react';
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

// ─── Severity helpers ────────────────────────────────────────────────────────

const SEVERITY_CONFIG: Record<string, { color: string; bg: string; border: string }> = {
    critical: { color: '#DC2626', bg: 'rgba(220,38,38,0.12)', border: 'rgba(220,38,38,0.2)' },
    high: { color: '#FF6B6B', bg: 'rgba(255,107,107,0.12)', border: 'rgba(255,107,107,0.2)' },
    medium: { color: '#FFB84C', bg: 'rgba(255,184,76,0.12)', border: 'rgba(255,184,76,0.2)' },
    low: { color: '#5B9CFF', bg: 'rgba(91,156,255,0.12)', border: 'rgba(91,156,255,0.2)' },
};

const CHART_COLORS = [
    { name: 'Critical', color: '#DC2626' },
    { name: 'High', color: '#FF6B6B' },
    { name: 'Medium', color: '#FFB84C' },
    { name: 'Low', color: '#5B9CFF' },
];

// ─── Component ───────────────────────────────────────────────────────────────

export function SecurityPanel() {
    const { report } = useReport();

    if (!report?.security) return (
        <div className="flex-1 mx-10 mb-10 flex items-center justify-center text-white/40">
            <div className="text-center">
                <Shield size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">No security data available</p>
            </div>
        </div>
    );

    const { security } = report;

    const riskCounts = security.reduce((acc: Record<string, number>, vuln: any) => {
        acc[vuln.severity] = (acc[vuln.severity] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const chartData = CHART_COLORS
        .map(c => ({ ...c, value: riskCounts[c.name.toLowerCase()] || 0 }))
        .filter(d => d.value > 0);

    const npmAuditCount = security.filter((v: any) => v.source === 'npm-audit').length;
    const codeScanCount = security.filter((v: any) => v.source === 'code-scan').length;
    const highestSeverity = riskCounts['critical'] ? 'critical' : riskCounts['high'] ? 'high' : riskCounts['medium'] ? 'medium' : 'low';
    const scoreColor = SEVERITY_CONFIG[highestSeverity]?.color || '#5B9CFF';

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex-1 mx-10 mb-10 flex flex-col gap-5"
        >
            {/* ── Summary cards ────────────────────────────────────────────── */}
            <div className="grid grid-cols-3 gap-5">
                {[
                    { label: 'Total Issues', value: security.length, icon: ShieldAlert, color: security.length > 0 ? '#FF6B6B' : '#4ECDC4', gradient: security.length > 0 ? 'linear-gradient(to right, #FF6B6B00, #FF6B6B, #FF6B6B00)' : 'linear-gradient(to right, #4ECDC400, #4ECDC4, #4ECDC400)' },
                    { label: 'Dependency CVEs', value: npmAuditCount, icon: Package, color: '#9F7AEA', gradient: 'linear-gradient(to right, #9F7AEA00, #9F7AEA, #9F7AEA00)' },
                    { label: 'Code Issues', value: codeScanCount, icon: Bug, color: '#FFB84C', gradient: 'linear-gradient(to right, #FFB84C00, #FFB84C, #FFB84C00)' },
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

            {/* ── Main content ─────────────────────────────────────────────── */}
            {security.length === 0 ? (
                <motion.div
                    variants={scaleIn}
                    className="flex-1 rounded-2xl border border-white/[0.06] flex flex-col items-center justify-center py-20"
                    style={{ background: 'var(--dash-surface)', backdropFilter: 'blur(16px)' }}
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                        className="w-20 h-20 rounded-full bg-[#4ECDC4]/10 flex items-center justify-center mb-6"
                    >
                        <ShieldCheck size={40} className="text-[#4ECDC4]" />
                    </motion.div>
                    <h4 className="text-2xl font-bold text-white mb-2">All Clear</h4>
                    <p className="text-sm text-white/40 max-w-sm text-center">No active vulnerabilities found. Your codebase is currently free of known security issues.</p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-5 gap-5 flex-1">
                    {/* Donut chart */}
                    <motion.div
                        variants={scaleIn}
                        className="col-span-2 rounded-2xl border border-white/[0.06] p-6 flex flex-col"
                        style={{ background: 'var(--dash-surface)', backdropFilter: 'blur(16px)' }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${scoreColor}15`, border: `1px solid ${scoreColor}25` }}>
                                <AlertOctagon size={16} style={{ color: scoreColor }} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">Severity Breakdown</h3>
                                <p className="text-[10px] text-white/30">Distribution by risk level</p>
                            </div>
                        </div>

                        <div className="flex-1 relative min-h-[220px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={chartData} innerRadius="60%" outerRadius="85%" paddingAngle={4} dataKey="value" strokeWidth={0}>
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
                                    <div className="text-4xl font-black text-white">{security.length}</div>
                                    <div className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-semibold mt-1">Issues</div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex justify-center flex-wrap gap-4 mt-4">
                            {chartData.map(d => (
                                <div key={d.name} className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color, boxShadow: `0 0 6px ${d.color}` }} />
                                    <span className="text-[10px] text-white/40 font-semibold uppercase tracking-wider">{d.name}: {d.value}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Vulnerability list */}
                    <motion.div
                        variants={scaleIn}
                        className="col-span-3 rounded-2xl border border-white/[0.06] p-6 flex flex-col"
                        style={{ background: 'var(--dash-surface)', backdropFilter: 'blur(16px)' }}
                    >
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-8 h-8 rounded-lg bg-[#FF6B6B]/10 flex items-center justify-center border border-[#FF6B6B]/20">
                                <ShieldAlert size={16} className="text-[#FF6B6B]" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">Vulnerability Details</h3>
                                <p className="text-[10px] text-white/30">All detected issues sorted by severity</p>
                            </div>
                        </div>

                        <div className="flex-1 space-y-2.5 overflow-y-auto pr-1 max-h-[420px]">
                            {security.map((vuln: any, i: number) => {
                                const sev = SEVERITY_CONFIG[vuln.severity] || SEVERITY_CONFIG.low;

                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: 15 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 + i * 0.04 }}
                                        className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] hover:border-white/[0.08] transition-all group"
                                    >
                                        {/* Top row */}
                                        <div className="flex items-start justify-between gap-3 mb-2">
                                            <div className="flex items-start gap-3 min-w-0 flex-1">
                                                <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: sev.color, boxShadow: `0 0 8px ${sev.color}` }} />
                                                <div className="font-semibold text-sm text-white/90 group-hover:text-white transition-colors truncate">{vuln.name}</div>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                {/* Source badge */}
                                                {vuln.source && (
                                                    <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] rounded-md ${vuln.source === 'npm-audit'
                                                        ? 'bg-[#9F7AEA]/10 text-[#9F7AEA] border border-[#9F7AEA]/15'
                                                        : 'bg-[#4ECDC4]/10 text-[#4ECDC4] border border-[#4ECDC4]/15'
                                                        }`}>
                                                        {vuln.source === 'npm-audit' ? 'AUDIT' : 'SCAN'}
                                                    </span>
                                                )}
                                                {/* Severity badge */}
                                                <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] rounded-md" style={{
                                                    background: sev.bg,
                                                    color: sev.color,
                                                    border: `1px solid ${sev.border}`,
                                                }}>
                                                    {vuln.severity}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div className="text-xs text-white/45 leading-relaxed pl-4 mb-1">{vuln.description}</div>

                                        {/* File reference */}
                                        {vuln.file && (
                                            <div className="flex items-center gap-2 pl-4 mt-2">
                                                <FileCode size={11} className="text-white/20" />
                                                <span className="text-[10px] text-white/25 font-mono">{vuln.file}{vuln.line ? `:${vuln.line}` : ''}</span>
                                            </div>
                                        )}

                                        {/* Category */}
                                        {vuln.category && (
                                            <div className="pl-4 mt-2">
                                                <span className="text-[9px] font-medium px-2 py-0.5 rounded-md bg-white/[0.03] text-white/25 uppercase tracking-wider border border-white/[0.04]">
                                                    {vuln.category}
                                                </span>
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
}
