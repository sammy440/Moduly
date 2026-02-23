"use client";

import { motion } from "framer-motion";
import { Zap, BookOpen, Lock, BarChart3, AlertTriangle, ArrowRight } from "lucide-react";
import { SectionHeader, fadeUp, stagger } from "./SectionHeader";

// ─── Data ────────────────────────────────────────────────────────────────────

const quickStartSteps = [
    { step: "1", title: "Install globally", code: "npm i -g moduly", desc: "One command, zero config — installs everywhere." },
    { step: "2", title: "Navigate to project", code: "cd my-project", desc: "Point to any JavaScript or TypeScript codebase." },
    { step: "3", title: "Run analysis", code: "moduly analyze --report", desc: "Scans files, deps, security, and performance." },
    { step: "4", title: "Open dashboard", code: "localhost:3000/dashboard", desc: "Report syncs live to the visual dashboard." },
];

const configOptions = [
    { option: "Ignored Dirs", desc: "node_modules, dist, .git, .moduly, .next, build, coverage", scope: "Auto" },
    { option: "Languages", desc: ".ts, .tsx, .js, .jsx, .mjs, .cjs, .json, .css, .scss, .html", scope: "Auto" },
    { option: "Git Integration", desc: "Reads git log for hotspot analysis. Requires git.", scope: "Auto" },
    { option: "AI Mode", desc: "Enable/disable AI commit detection via moduly ai on|off", scope: "Persistent" },
    { option: "Dashboard Sync", desc: "Auto-pushes report to localhost:3000 with --report flag", scope: "API" },
];

const securityPatterns = [
    { pattern: "eval()", severity: "critical", category: "Code Injection" },
    { pattern: "new Function()", severity: "high", category: "Code Injection" },
    { pattern: "child_process.exec()", severity: "high", category: "Command Injection" },
    { pattern: "innerHTML", severity: "medium", category: "XSS" },
    { pattern: "dangerouslySetInnerHTML", severity: "medium", category: "XSS" },
    { pattern: "document.write()", severity: "medium", category: "XSS" },
    { pattern: "Hardcoded secrets", severity: "high", category: "Sensitive Data" },
];

const scoreFactors = [
    { factor: "Large codebase (>200 files)", impact: -10, max: 100 },
    { factor: "High LOC (>10,000 lines)", impact: -10, max: 100 },
    { factor: "Active hotspots (>10 commits)", impact: -3, max: 100 },
    { factor: "High coupling ratio (>3x)", impact: -20, max: 100 },
    { factor: "Unused dependencies", impact: -2, max: 15 },
    { factor: "Critical vulnerabilities", impact: -10, max: 100 },
    { factor: "High vulnerabilities", impact: -5, max: 100 },
    { factor: "Low comment ratio (<5%)", impact: -5, max: 100 },
];

const severityColors: Record<string, string> = {
    critical: '#EF4444',
    high: '#FF6B6B',
    medium: '#FFB84C',
    low: '#5B9CFF',
};

// ─── Component ───────────────────────────────────────────────────────────────

export function DocsSection() {
    return (
        <section id="docs" className="relative py-32 px-6 border-t border-white/5 bg-white/[0.01]">
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/6 blur-[200px] rounded-full -z-10 pointer-events-none" />

            <SectionHeader
                badge="Documentation"
                title="Complete"
                highlight="reference"
                description="Everything you need to get started, configure the analyzer, and understand the output."
            />

            <div className="max-w-5xl mx-auto space-y-32">

                {/* ── Quick Start — Horizontal journey ─────────────────────── */}
                <div>
                    <motion.h3 {...fadeUp} className="text-3xl font-bold text-white/90 mb-12 flex items-center gap-3">
                        <Zap size={28} className="text-primary" />
                        Quick Start
                    </motion.h3>

                    <div className="relative">
                        {/* Connecting line */}
                        <div className="hidden md:block absolute top-[20px] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0" />

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                            {quickStartSteps.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                                    className="relative group block"
                                >
                                    {/* Step number orb */}
                                    <div className="flex justify-center mb-6 relative">
                                        <motion.div
                                            whileHover={{ scale: 1.2 }}
                                            className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/40 flex items-center justify-center relative z-10"
                                            style={{ background: 'rgba(11,15,25,1)' }}
                                        >
                                            <span className="text-primary font-bold font-mono text-sm">{item.step}</span>
                                        </motion.div>

                                        {/* Arrow between steps */}
                                        {i < 3 && (
                                            <div className="hidden md:block absolute top-1/2 -translate-y-1/2 -right-3 z-20 bg-background/80 px-1 rounded-full">
                                                <ArrowRight size={18} className="text-primary/60" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Content card */}
                                    <motion.div
                                        whileHover={{ y: -6 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                        className="p-5 rounded-2xl border border-white/[0.06] text-center group-hover:border-primary/20 transition-colors"
                                        style={{ background: 'rgba(15,23,42,0.3)' }}
                                    >
                                        <h4 className="text-base font-bold text-white/80 mb-2">{item.title}</h4>
                                        <code className="text-xs font-mono text-primary/70 bg-primary/5 px-2.5 py-1 rounded-lg inline-block mb-3">{item.code}</code>
                                        <p className="text-xs text-white/30 leading-relaxed">{item.desc}</p>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Configuration — Floating cards ──────────────────────── */}
                <div>
                    <motion.h3 {...fadeUp} className="text-3xl font-bold text-white/90 mb-2 flex items-center gap-3">
                        <BookOpen size={28} className="text-[#9F7AEA]" />
                        Configuration
                    </motion.h3>
                    <motion.p {...fadeUp} className="text-white/40 text-sm mb-10">Zero-config by default. These behaviors are automatic.</motion.p>

                    <div className="space-y-3">
                        {configOptions.map((opt, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.08 }}
                                whileHover={{ x: i % 2 === 0 ? 8 : -8 }}
                                className="flex items-center gap-6 p-5 rounded-2xl border border-white/[0.04] hover:border-white/[0.1] transition-all"
                                style={{ background: 'rgba(15,23,42,0.25)' }}
                            >
                                <div className="w-36 shrink-0">
                                    <span className="text-sm font-bold text-white/70">{opt.option}</span>
                                </div>
                                <div className="flex-1 text-sm text-white/35">{opt.desc}</div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#9F7AEA]/70 bg-[#9F7AEA]/10 px-3 py-1.5 rounded-lg shrink-0 border border-[#9F7AEA]/15">
                                    {opt.scope}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* ── Security Patterns — Severity visualization ──────────── */}
                <div>
                    <motion.h3 {...fadeUp} className="text-3xl font-bold text-white/90 mb-2 flex items-center gap-3">
                        <Lock size={28} className="text-[#FF6B6B]" />
                        Security Scan Patterns
                    </motion.h3>
                    <motion.p {...fadeUp} className="text-white/40 text-sm mb-10">AST-based code scanner checks for these dangerous patterns.</motion.p>

                    <div className="space-y-3">
                        {securityPatterns.map((p, i) => {
                            const color = severityColors[p.severity] || '#5B9CFF';
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scaleX: 0.9, originX: 0 }}
                                    whileInView={{ opacity: 1, scaleX: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.06 }}
                                    whileHover={{ x: 8 }}
                                    className="flex items-center gap-5 p-5 rounded-2xl border border-white/[0.04] hover:border-white/[0.08] transition-all relative overflow-hidden group"
                                    style={{ background: 'rgba(15,23,42,0.25)' }}
                                >
                                    {/* Severity bar */}
                                    <motion.div
                                        className="absolute left-0 top-0 bottom-0 w-[3px]"
                                        style={{ background: color }}
                                        initial={{ scaleY: 0, originY: 0 }}
                                        whileInView={{ scaleY: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: i * 0.06 + 0.2 }}
                                    />

                                    <AlertTriangle size={18} style={{ color }} className="shrink-0" />

                                    <div className="flex-1 min-w-0">
                                        <code className="font-mono text-base text-white/80">{p.pattern}</code>
                                        <span className="text-xs text-white/20 ml-3">{p.category}</span>
                                    </div>

                                    <motion.span
                                        initial={{ scale: 0 }}
                                        whileInView={{ scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ type: "spring", stiffness: 500, damping: 25, delay: i * 0.06 + 0.3 }}
                                        className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg shrink-0"
                                        style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}
                                    >
                                        {p.severity}
                                    </motion.span>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* ── Health Score — Animated bars ────────────────────────── */}
                <div>
                    <motion.h3 {...fadeUp} className="text-3xl font-bold text-white/90 mb-2 flex items-center gap-3">
                        <BarChart3 size={28} className="text-[#CCFF00]" />
                        Health Score
                    </motion.h3>
                    <motion.p {...fadeUp} className="text-white/40 text-sm mb-10">Starts at 100 — penalties deducted per factor.</motion.p>

                    {/* Infinite 3D Scroll Container */}
                    <div
                        className="w-full h-[600px] relative mx-auto max-w-3xl overflow-hidden rounded-3xl group"
                        style={{ perspective: "1200px" }}
                    >
                        {/* Fade masks for top and bottom limits to transition into the background cleanly */}
                        <div className="absolute inset-0 z-20 pointer-events-none bg-[linear-gradient(to_bottom,var(--background)_0%,transparent_20%,transparent_80%,var(--background)_100%)]" />

                        <motion.div
                            className="flex flex-col gap-5 absolute w-full left-0 right-0 py-8 px-6 md:px-12"
                            style={{ rotateX: "10deg", transformStyle: "preserve-3d" }}
                            animate={{
                                y: ["0%", "-50%"] // Infinite loop since array is doubled
                            }}
                            transition={{
                                duration: 25, // Smooth slow pacing
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        >
                            {[...scoreFactors, ...scoreFactors].map((f, i) => {
                                const isHeavy = Math.abs(f.impact) >= 10;
                                const colorClass = isHeavy ? 'text-red-400' : 'text-yellow-400';

                                return (
                                    <div
                                        key={i}
                                        style={{
                                            transform: `translateZ(${Math.abs((i % scoreFactors.length) - 3) * 15}px)`,
                                            background: 'rgba(15,23,42,0.4)',
                                            backdropFilter: 'blur(16px)'
                                        }}
                                        className="w-full p-5 rounded-2xl border border-white/5 flex items-center justify-between gap-6 hover:bg-white/5 transition-all duration-300 shadow-2xl hover:scale-[1.02] hover:border-white/20 group relative overflow-hidden"
                                    >
                                        {/* Hover glow line */}
                                        <div className={`absolute top-0 bottom-0 left-0 w-1 ${isHeavy ? 'bg-red-500' : 'bg-yellow-400'} opacity-0 group-hover:opacity-100 transition-opacity`} />

                                        <div className="flex-1">
                                            <p className="text-white/40 text-[10px] uppercase font-mono tracking-widest mb-1">
                                                Deduction // {f.max < 100 ? `MAX ${f.max}` : 'GLOBAL'}
                                            </p>
                                            <h4 className="text-lg font-bold text-white/90 group-hover:text-white transition-colors">{f.factor}</h4>
                                        </div>

                                        <div className={`shrink-0 flex items-center justify-center w-16 h-16 rounded-xl border border-white/10 ${isHeavy ? 'bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'bg-yellow-400/10 shadow-[0_0_20px_rgba(250,204,21,0.2)]'}`}>
                                            <span className={`font-mono text-xl font-bold ${colorClass}`}>
                                                {f.impact}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
