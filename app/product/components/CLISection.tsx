"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
    Terminal, Package, Shield, Activity, GitBranch, FileCode, Code2,
    Layers, Copy, CheckCircle, ChevronRight,
} from "lucide-react";
import { SectionHeader, fadeUp, stagger } from "./SectionHeader";

// ─── Data ────────────────────────────────────────────────────────────────────

const cliCommands = [
    {
        command: "moduly analyze",
        description: "Scans the entire project: files, LOC, imports, dependencies, security, and performance. Generates an interactive HTML dashboard at .moduly/index.html.",
        flags: [
            { flag: "--open", desc: "Launch the HTML dashboard in your browser" },
            { flag: "--report", desc: "Save report.json and push to live dashboard" },
        ],
    },
    {
        command: "moduly ai <on|off>",
        description: "Toggles AI-assisted commit detection. When enabled, Moduly uses machine learning to identify semantically significant commits and hotspot patterns.",
        flags: [],
    },
];

const analyzerModules = [
    { icon: FileCode, name: "Project Scanner", file: "analyzer/project.ts", desc: "Walks the file tree, builds stats, orchestrates all sub-analyzers", color: "#5B9CFF" },
    { icon: Code2, name: "LOC Analyzer", file: "analyzer/loc.ts", desc: "Counts code, comment, and blank lines per file with language-aware parsing", color: "#9F7AEA" },
    { icon: Layers, name: "Dependency Analyzer", file: "analyzer/dependencies.ts", desc: "AST-based import/export detection, builds file-to-file dependency graph", color: "#4ECDC4" },
    { icon: Package, name: "Package Analyzer", file: "analyzer/dependencies.ts", desc: "Detects used vs unused packages, checks npm for outdated versions", color: "#CCFF00" },
    { icon: Shield, name: "Security Scanner", file: "analyzer/security.ts", desc: "npm audit + 6 AST code patterns (eval, exec, innerHTML, secrets)", color: "#FF6B6B" },
    { icon: Activity, name: "Performance Profiler", file: "analyzer/performance.ts", desc: "Bundle size estimation, large file detection, heavy dependency flagging", color: "#FFB84C" },
    { icon: GitBranch, name: "Git Hotspot Engine", file: "analyzer/git.ts", desc: "Parses git log --name-only to rank files by commit frequency", color: "#E879F9" },
];

// ─── Component ───────────────────────────────────────────────────────────────

export function CLISection() {
    const [copied, setCopied] = useState("");

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(text);
        setTimeout(() => setCopied(""), 2000);
    };

    return (
        <section id="cli" className="relative py-32 px-6 border-t border-white/5">
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-secondary/8 blur-[200px] rounded-full -z-10 pointer-events-none" />

            <SectionHeader
                badge="CLI Tool"
                title="Power in your"
                highlight="terminal"
                description="Moduly's CLI is built with Commander.js and uses Babel AST parsing under the hood. One command scans your entire project and generates a comprehensive analysis report."
            />

            <div className="max-w-5xl mx-auto space-y-24">
                {/* Installation — floating card */}
                <motion.div {...fadeUp} className="flex justify-center">
                    <motion.div
                        whileHover={{ scale: 1.04, y: -4 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className="inline-flex items-center gap-4 p-5 pr-7 rounded-2xl border border-white/10 hover:border-primary/40 transition-colors cursor-pointer group relative overflow-hidden"
                        style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(20px)' }}
                        onClick={() => handleCopy("npm i -g moduly")}
                    >
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        />
                        <div className="p-3 bg-primary/10 rounded-xl text-primary relative z-10 group-hover:scale-110 transition-transform">
                            <Terminal size={24} />
                        </div>
                        <code className="font-mono text-xl text-white/90 relative z-10">npm i -g moduly</code>
                        <div className="p-2 bg-white/5 rounded-lg text-white/40 group-hover:text-primary transition-colors ml-3 relative z-10">
                            {copied === "npm i -g moduly" ? <CheckCircle size={18} className="text-green-400" /> : <Copy size={18} />}
                        </div>
                    </motion.div>
                </motion.div>

                {/* Commands — stacked editorial layout */}
                <div className="space-y-8">
                    <motion.h3 {...fadeUp} className="text-3xl font-bold text-white/90">Commands</motion.h3>
                    {cliCommands.map((cmd, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                            className={`relative p-8 rounded-3xl border border-white/[0.06] overflow-hidden group ${i % 2 === 0 ? 'md:ml-0 md:mr-16' : 'md:ml-16 md:mr-0'
                                }`}
                            style={{ background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(12px)' }}
                        >
                            {/* Accent line */}
                            <div className={`absolute ${i % 2 === 0 ? 'left-0' : 'right-0'} top-0 bottom-0 w-[3px] bg-gradient-to-b from-primary via-primary/50 to-transparent`} />

                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-3">
                                    <motion.span
                                        className="text-primary font-mono font-bold text-xl"
                                        animate={{ opacity: [1, 0.4, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        $
                                    </motion.span>
                                    <code className="font-mono text-xl text-white/90">{cmd.command}</code>
                                </div>
                                <button
                                    onClick={() => handleCopy(cmd.command)}
                                    className="p-2.5 rounded-xl bg-white/5 text-white/30 hover:text-primary hover:bg-primary/10 transition-all"
                                >
                                    {copied === cmd.command ? <CheckCircle size={16} className="text-green-400" /> : <Copy size={16} />}
                                </button>
                            </div>
                            <p className="text-sm text-white/45 leading-relaxed mb-5 max-w-2xl">{cmd.description}</p>
                            {cmd.flags.length > 0 && (
                                <div className="flex flex-wrap gap-3">
                                    {cmd.flags.map((f, j) => (
                                        <motion.div
                                            key={j}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.3 + j * 0.1 }}
                                            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/[0.04] bg-white/[0.02]"
                                        >
                                            <code className="font-mono text-primary/80 text-xs font-bold">{f.flag}</code>
                                            <span className="text-white/30 text-xs">—</span>
                                            <span className="text-white/35 text-xs">{f.desc}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Analyzer Modules — staggered cascade */}
                <div>
                    <motion.h3 {...fadeUp} className="text-3xl font-bold text-white/90 mb-2">Under the Hood</motion.h3>
                    <motion.p {...fadeUp} className="text-white/40 mb-10 text-sm">7 specialized analyzer modules that work together.</motion.p>

                    <div className="relative">
                        {/* Connecting line */}
                        <div className="hidden md:block absolute left-8 top-0 bottom-0 w-[1px] bg-gradient-to-b from-[#5B9CFF]/30 via-[#CCFF00]/20 to-[#FF6B6B]/30" />

                        <div className="space-y-4">
                            {analyzerModules.map((mod, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -40 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                                    whileHover={{ x: 12 }}
                                    className="flex items-start gap-5 p-5 rounded-2xl border border-white/[0.04] hover:border-white/[0.1] transition-all group cursor-default md:ml-16"
                                    style={{ background: 'rgba(15,23,42,0.25)' }}
                                >
                                    {/* Dot on the timeline */}
                                    <div className="hidden md:block absolute left-[29px] w-3 h-3 rounded-full border-2 transition-colors"
                                        style={{ borderColor: mod.color, background: 'rgba(11,15,25,1)' }}
                                    />

                                    <div className="p-3 rounded-xl shrink-0 group-hover:scale-110 transition-transform duration-300"
                                        style={{ background: `${mod.color}15`, border: `1px solid ${mod.color}30` }}
                                    >
                                        <mod.icon size={20} style={{ color: mod.color }} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h4 className="text-lg font-bold text-white/90">{mod.name}</h4>
                                            <ChevronRight size={14} className="text-white/20 group-hover:text-white/40 group-hover:translate-x-1 transition-all" />
                                        </div>
                                        <p className="text-sm text-white/35 leading-relaxed mb-2">{mod.desc}</p>
                                        <code className="text-[13px] font-mono" style={{ color: `${mod.color}80` }}>{mod.file}</code>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Report structure */}
                <motion.div {...fadeUp}>
                    <h3 className="text-3xl font-bold text-white/90 mb-2">Output Format</h3>
                    <p className="text-white/40 mb-8 text-sm">Running <code className="font-mono text-primary/70">moduly analyze --report</code> generates a structured JSON report.</p>

                    <motion.div
                        whileHover={{ scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-black/20"
                        style={{ background: 'rgba(15,23,42,0.5)' }}
                    >
                        <div className="bg-[#0f111a] overflow-hidden">
                            <div className="flex items-center px-5 py-3.5 bg-white/[0.03] border-b border-white/5 gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                <span className="ml-4 text-xs text-white/40 font-mono tracking-widest">.moduly/report.json</span>
                            </div>
                            <pre className="p-6 font-mono text-sm text-white/50 overflow-x-auto leading-relaxed">
                                {`{
  "projectName": "my-app",
  "timestamp": "2026-02-23T18:00:00.000Z",
  "score": 87,
  "stats": {
    "totalFiles": 42,
    "totalLOC": 12450,
    "languages": { ".ts": 28, ".tsx": 10, ".js": 4 },
    "fileList": [...]
  },
  "hotspots": [
    { "file": "src/core/engine.ts", "commits": 24 }
  ],
  "dependencies": {
    "nodes": [...],
    "links": [...]
  },
  "packageDependencies": {
    "used": [...], "unused": [...],
    "outdated": [...], "suggestions": [...]
  },
  "security": [...],
  "performance": {
    "bundleSize": "1.2MB",
    "largeFiles": [...],
    "heavyDependencies": [...]
  }
}`}
                            </pre>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
