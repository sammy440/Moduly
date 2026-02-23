"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Target, FileCode, Cpu } from 'lucide-react';
import { useReport } from '../context/ReportContext';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, LineChart, Line } from 'recharts';

export function MetricsPanel() {
    const { report } = useReport();

    if (!report) return null;

    const stats = [
        { label: 'Health Score', value: report.score, suffix: '/100', icon: Target, color: '#CCFF00' },
        { label: 'Lines of Code', value: (report.stats.totalLOC / 1000).toFixed(1) + 'k', suffix: '', icon: FileCode, color: '#5B9CFF' },
        { label: 'AI Insights', value: 'Ready', suffix: '', icon: Cpu, color: '#9F7AEA' },
        { label: 'Hotspots', value: report.hotspots?.length || 0, suffix: 'files', icon: Zap, color: '#FF6B6B' },
    ];

    return (
        <div className="grid grid-cols-4 gap-6 p-10">
            {stats.map((stat, i) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="rounded-3xl p-6 relative overflow-hidden group transition-colors duration-500"
                    style={{
                        background: 'var(--dash-surface)',
                        border: '1px solid var(--dash-border)',
                        backdropFilter: 'blur(12px)',
                    }}
                >
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <stat.icon size={80} style={{ color: stat.color }} />
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg" style={{ background: 'var(--dash-hover)' }}>
                            <stat.icon size={18} style={{ color: stat.color }} />
                        </div>
                        <span className="text-sm font-medium uppercase tracking-widest" style={{ color: 'var(--dash-text-muted)' }}>{stat.label}</span>
                    </div>

                    <div className="flex items-end justify-between h-[60px]">
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-bold tracking-tighter" style={{ color: stat.color }}>
                                {stat.value}
                            </span>
                            <span className="text-sm font-medium" style={{ color: 'var(--dash-text-faint)' }}>{stat.suffix}</span>
                        </div>

                        {/* Mini Recharts Inline */}
                        <div className="w-[100px] h-full opacity-60">
                            {stat.label === 'Health Score' && (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={[{ value: report.score }, { value: 100 - report.score }]} innerRadius={20} outerRadius={25} dataKey="value" startAngle={90} endAngle={-270}>
                                            <Cell fill={stat.color} />
                                            <Cell fill="var(--dash-hover)" />
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                            {stat.label === 'Lines of Code' && (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={[{ v: 2 }, { v: 4 }, { v: 3 }, { v: 7 }, { v: 5 }, { v: 8 }]}>
                                        <Bar dataKey="v" fill={stat.color} radius={[2, 2, 0, 0]} barSize={8} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                            {stat.label === 'AI Insights' && (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={[{ v: 1 }, { v: 3 }, { v: 2 }, { v: 5 }, { v: 4 }, { v: 6 }]}>
                                        <Line type="monotone" dataKey="v" stroke={stat.color} strokeWidth={2} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                            {stat.label === 'Hotspots' && (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={[{ v: report.hotspots?.length || 0 }, { v: 2 }, { v: 5 }]}>
                                        <Bar dataKey="v" fill={stat.color} radius={[2, 2, 0, 0]} barSize={8} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
