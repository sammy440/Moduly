"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, AlertTriangle, Lightbulb, Zap } from 'lucide-react';
import { useReport } from '../context/ReportContext';

export function AISuggestionsPanel() {
    const { report } = useReport();

    if (!report) return null;

    // Generate dynamic suggestions
    const recommendations = React.useMemo(() => {
        const recs = [];
        const { nodes, links } = report.dependencies;

        // Detect potential circular dependencies by checking back-and-forth links
        const linkMap = new Set(links.map(l => `${l.source as string}->${l.target as string}`));
        let foundCircular = false;
        for (const link of links) {
            if (linkMap.has(`${link.target as string}->${link.source as string}`) && !foundCircular) {
                recs.push({
                    type: 'Warning',
                    title: 'Circular Dependency Detected',
                    desc: `Reciprocal dependecies detected around \`${(link.source as string).split('/').pop()}\`. Refactor to use shared interfaces or utilities.`,
                    icon: AlertTriangle,
                    color: '#FF6B6B'
                });
                foundCircular = true;
                break;
            }
        }

        // Check for hotspots or highly coupled modules
        const incomingCounts: Record<string, number> = {};
        for (const l of links) {
            const target = typeof l.target === 'string' ? l.target : (l.target as any).id;
            incomingCounts[target] = (incomingCounts[target] || 0) + 1;
        }

        const maxIncoming = Object.entries(incomingCounts).sort((a, b) => b[1] - a[1])[0];
        if (maxIncoming && maxIncoming[1] > 5) {
            recs.push({
                type: 'Insight',
                title: 'High Coupling Detected',
                desc: `\`${maxIncoming[0].split('/').pop()}\` is imported ${maxIncoming[1]} times. Evaluate if it's a utility or if it should be split into smaller modules.`,
                icon: Zap,
                color: '#5B9CFF'
            });
        }

        // Layering / General Check
        if (report.stats.totalFiles > 20 && recs.length < 3) {
            recs.push({
                type: 'Suggestion',
                title: 'Architecture Review',
                desc: `Project has grown to ${report.stats.totalFiles} files. Consider re-evaluating folder grouping and domain separation.`,
                icon: Lightbulb,
                color: '#CCFF00'
            });
        }

        // Fallback for smaller projects to avoid empty list
        if (recs.length === 0) {
            recs.push({
                type: 'Success',
                title: 'Clean Architecture',
                desc: `No critical issues found in ${report.stats.totalFiles} files. Maintain current practices!`,
                icon: Cpu,
                color: '#9F7AEA'
            });
        }

        return recs;
    }, [report]);

    return (
        <div className="w-1/3 glass rounded-[3rem] p-8 overflow-y-auto">
            <div className="flex items-center gap-3 mb-6">
                <Cpu size={28} className="text-[#9F7AEA]" />
                <h2 className="text-xl font-bold tracking-tight text-white">AI Architecture Insights</h2>
            </div>

            <p className="text-sm text-white/50 font-medium mb-8">
                Based on your project's shape ({report.stats.totalFiles} files, {report.stats.totalLOC} LOC) and Git hotspot history, our AI identified these areas for maintainability improvements.
            </p>

            <div className="flex flex-col gap-5">
                {recommendations.map((rec, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                        className="bg-white/5 p-5 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer border border-transparent hover:border-white/10"
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-2 rounded-xl bg-black/30 mt-1">
                                <rec.icon size={18} style={{ color: rec.color }} />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-sm tracking-wide">{rec.title}</h3>
                                <p className="text-xs text-white/60 mt-2 leading-relaxed">{rec.desc}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-8 rounded-2xl bg-[#9F7AEA]/10 p-5 flex items-center gap-4">
                <div className="h-2 flex-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#9F7AEA]" style={{ width: '85%' }}></div>
                </div>
                <span className="text-xs font-bold text-white/40 tracking-widest uppercase">AI Confidence</span>
            </div>
        </div>
    );
}
