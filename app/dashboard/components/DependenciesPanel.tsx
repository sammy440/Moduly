"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useReport } from '../context/ReportContext';
import { PackageOpen, AlertTriangle, Lightbulb, PackageCheck } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';

export function DependenciesPanel() {
    const { report } = useReport();
    if (!report?.packageDependencies) return <div className="p-10 text-white/50">No dependency data available</div>;

    const { packageDependencies } = report;

    const depData = [
        { name: 'Used', value: packageDependencies.used.length },
        { name: 'Unused', value: packageDependencies.unused.length }
    ];

    const COLORS = ['#5B9CFF', '#FF6B6B'];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 mx-10 mb-10 flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-6">
                {/* Dependency Usage Chart */}
                <div className="glass rounded-3xl p-6 flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <PackageCheck size={20} className="text-primary" /> Dependency Usage
                    </h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={depData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                    {depData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip contentStyle={{ backgroundColor: '#0f111a', border: '1px solid rgba(255,255,255,0.1)' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-4 mt-2">
                        {depData.map((d, i) => (
                            <div key={d.name} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                                <span className="text-sm text-white/60">{d.name}: {d.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Suggestions List */}
                <div className="glass rounded-3xl p-6 flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Lightbulb size={20} className="text-accent" /> AI Suggestions
                    </h3>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                        {packageDependencies.suggestions.length === 0 ? (
                            <div className="text-white/40 text-sm">No suggestions right now.</div>
                        ) : packageDependencies.suggestions.map((sug, i) => (
                            <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-accent/10 mt-0.5">
                                    <PackageOpen size={16} className="text-accent" />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-white mb-1">Consider adding: {sug}</div>
                                    <div className="text-xs text-white/40">This module appears missing based on your codebase imports.</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Outdated Table */}
            <div className="glass rounded-3xl p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <AlertTriangle size={20} className="text-yellow-400" /> Outdated Dependencies
                </h3>
                <div className="w-full overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="p-4 text-xs font-mono text-white/40 uppercase tracking-widest">Package</th>
                                <th className="p-4 text-xs font-mono text-white/40 uppercase tracking-widest">Current</th>
                                <th className="p-4 text-xs font-mono text-white/40 uppercase tracking-widest">Latest</th>
                                <th className="p-4 text-xs font-mono text-white/40 uppercase tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {packageDependencies.outdated.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-4 text-sm text-white/40 text-center">All packages are up to date!</td>
                                </tr>
                            ) : packageDependencies.outdated.map((pkg, i) => (
                                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-bold text-white/90">{pkg.name}</td>
                                    <td className="p-4 font-mono text-white/60">{pkg.current}</td>
                                    <td className="p-4 font-mono text-primary">{pkg.latest}</td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">Update available</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
}
