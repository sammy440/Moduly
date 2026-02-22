"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Target, FileCode, GitBranch, Cpu } from 'lucide-react';
import { useReport } from '../context/ReportContext';

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
                    className="glass rounded-3xl p-6 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <stat.icon size={80} style={{ color: stat.color }} />
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-white/5">
                            <stat.icon size={18} style={{ color: stat.color }} />
                        </div>
                        <span className="text-sm font-medium text-white/40 uppercase tracking-widest">{stat.label}</span>
                    </div>

                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold tracking-tighter" style={{ color: stat.color }}>
                            {stat.value}
                        </span>
                        <span className="text-sm font-medium text-white/20">{stat.suffix}</span>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
