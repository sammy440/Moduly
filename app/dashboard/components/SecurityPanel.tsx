"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useReport } from '../context/ReportContext';
import { ShieldAlert, ShieldCheck, Bug, Package, FileCode } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

export function SecurityPanel() {
    const { report } = useReport();
    if (!report?.security) return <div className="p-10 text-white/50">No security data available</div>;

    const { security } = report;

    const riskCounts = security.reduce((acc, vuln) => {
        acc[vuln.severity] = (acc[vuln.severity] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const chartData = [
        { name: 'Low', value: riskCounts['low'] || 0, color: '#5B9CFF' },
        { name: 'Medium', value: riskCounts['medium'] || 0, color: '#FFB84C' },
        { name: 'High', value: riskCounts['high'] || 0, color: '#FF6B6B' },
        { name: 'Critical', value: riskCounts['critical'] || 0, color: '#DC2626' }
    ].filter(d => d.value > 0);

    const npmAuditCount = security.filter(v => v.source === 'npm-audit').length;
    const codeScanCount = security.filter(v => v.source === 'code-scan').length;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 mx-10 mb-10 flex flex-col gap-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-6">
                <div className="glass rounded-3xl p-6 flex items-center justify-between">
                    <div>
                        <div className="text-xs font-mono text-white/40 uppercase tracking-widest mb-1">Total Issues</div>
                        <div className="text-3xl font-bold text-white">{security.length}</div>
                    </div>
                    <ShieldAlert size={32} className={security.length > 0 ? "text-red-500/40" : "text-green-500/40"} />
                </div>
                <div className="glass rounded-3xl p-6 flex items-center justify-between">
                    <div>
                        <div className="text-xs font-mono text-white/40 uppercase tracking-widest mb-1">Dependency CVEs</div>
                        <div className="text-3xl font-bold text-[#FF6B6B]">{npmAuditCount}</div>
                    </div>
                    <Package size={32} className="text-[#FF6B6B]/40" />
                </div>
                <div className="glass rounded-3xl p-6 flex items-center justify-between">
                    <div>
                        <div className="text-xs font-mono text-white/40 uppercase tracking-widest mb-1">Code Issues</div>
                        <div className="text-3xl font-bold text-[#FFB84C]">{codeScanCount}</div>
                    </div>
                    <Bug size={32} className="text-[#FFB84C]/40" />
                </div>
            </div>

            <div className="glass rounded-3xl p-8 flex flex-col">
                <h3 className="text-2xl font-bold text-white mb-6 w-full flex items-center gap-3">
                    <ShieldAlert size={26} className={security.length > 0 ? "text-red-500" : "text-green-500"} />
                    Vulnerability Scan
                </h3>

                {security.length === 0 ? (
                    <div className="flex flex-col items-center py-20 text-green-400">
                        <ShieldCheck size={80} className="mb-6 opacity-30" />
                        <h4 className="text-xl font-bold">All Good!</h4>
                        <p className="text-white/40 mt-2">No active vulnerabilities found in your codebase.</p>
                    </div>
                ) : (
                    <div className="flex w-full gap-10 items-start">
                        <div className="w-[300px] h-[300px] shrink-0 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={chartData} innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value">
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip contentStyle={{ backgroundColor: '#0f111a', border: '1px solid rgba(255,255,255,0.1)' }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                                <div className="text-4xl font-bold text-white">{security.length}</div>
                                <div className="text-xs uppercase tracking-widest text-white/40">Issues</div>
                            </div>
                        </div>

                        <div className="flex-1 space-y-4 pt-4 max-h-[500px] overflow-y-auto pr-2">
                            {security.map((vuln, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="p-5 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-2 hover:bg-white/[0.07] transition-colors"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="font-bold text-lg text-white flex-1 truncate">{vuln.name}</div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            {/* Source badge */}
                                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-full ${vuln.source === 'npm-audit'
                                                    ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                                    : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                                                }`}>
                                                {vuln.source === 'npm-audit' ? 'NPM AUDIT' : 'CODE SCAN'}
                                            </span>
                                            {/* Severity badge */}
                                            <span className={`px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full ${vuln.severity === 'critical' ? 'bg-red-500/20 text-red-500 border border-red-500/20' :
                                                vuln.severity === 'high' ? 'bg-[#FF6B6B]/20 text-[#FF6B6B] border border-[#FF6B6B]/20' :
                                                    vuln.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/20' :
                                                        'bg-blue-500/20 text-blue-500 border border-blue-500/20'
                                                }`}>
                                                {vuln.severity}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-white/60 text-sm">{vuln.description}</div>

                                    {/* File and line info for code-scan results */}
                                    {vuln.file && (
                                        <div className="flex items-center gap-2 mt-1 text-xs text-white/30 font-mono">
                                            <FileCode size={12} />
                                            <span>{vuln.file}{vuln.line ? `:${vuln.line}` : ''}</span>
                                        </div>
                                    )}

                                    {/* Category tag */}
                                    {vuln.category && (
                                        <div className="mt-1">
                                            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-white/5 text-white/30 uppercase tracking-wider">
                                                {vuln.category}
                                            </span>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
