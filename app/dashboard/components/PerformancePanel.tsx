"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useReport } from '../context/ReportContext';
import { Activity, Zap, Box } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export function PerformancePanel() {
    const { report } = useReport();

    if (!report?.performance) return <div className="p-10 text-white/50">No performance data available</div>;

    const { performance } = report;

    // Mock historical data for recharts
    const histData = [
        { name: 'Jan', bundleSize: 810 },
        { name: 'Feb', bundleSize: 830 },
        { name: 'Mar', bundleSize: parseInt(performance.bundleSize) || 850 },
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 mx-10 mb-10 flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="glass rounded-3xl p-8 flex items-center justify-between">
                    <div>
                        <div className="text-sm font-mono text-white/40 mb-2 uppercase tracking-widest">Estimated Bundle Size</div>
                        <div className="text-4xl font-bold text-primary">{performance.bundleSize}</div>
                    </div>
                    <Box size={40} className="text-primary/20" />
                </div>
                <div className="glass rounded-3xl p-8 flex items-center justify-between">
                    <div>
                        <div className="text-sm font-mono text-white/40 mb-2 uppercase tracking-widest">Initial Load Time</div>
                        <div className="text-4xl font-bold text-accent">{performance.loadTime}</div>
                    </div>
                    <Zap size={40} className="text-accent/20" />
                </div>
            </div>

            <div className="glass rounded-3xl p-8 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Activity size={20} className="text-white/60" /> Bundle Size Over Time (KB)
                </h3>
                <div className="flex-1 min-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={histData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} />
                            <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ backgroundColor: '#0f111a', border: '1px solid rgba(255,255,255,0.1)' }} />
                            <Bar dataKey="bundleSize" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </motion.div>
    );
}
