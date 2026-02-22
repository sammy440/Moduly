"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { FolderOpen, FolderClosed, FileCode, FileJson, FileText, Package, LayoutTemplate, Layers, Code2, CheckCircle2 } from "lucide-react";

// Representing a messy file explorer tree
const FILE_TREE = [
    { id: 1, type: "folder", icon: FolderOpen, label: "src", color: "text-blue-400", depth: 0, r: -5, x: -10, y: -5 },
    { id: 2, type: "folder", icon: FolderOpen, label: "components", color: "text-blue-400", depth: 1, r: 4, x: 15, y: -10 },
    { id: 3, type: "file", icon: LayoutTemplate, label: "Button.tsx", color: "text-cyan-400", depth: 2, r: -8, x: -20, y: 5 },
    { id: 4, type: "file", icon: FileCode, label: "index.tsx", color: "text-blue-400", depth: 2, r: 6, x: 25, y: 15 },
    { id: 5, type: "folder", icon: FolderClosed, label: "utils", color: "text-purple-400", depth: 1, r: -3, x: -5, y: 8 },
    { id: 6, type: "file", icon: Layers, label: "api.ts", color: "text-purple-400", depth: 2, r: 8, x: 10, y: -15 },
    { id: 7, type: "file", icon: FileCode, label: "App.tsx", color: "text-cyan-500", depth: 0, r: -6, x: -15, y: -5 },
    { id: 8, type: "file", icon: FileJson, label: "package.json", color: "text-yellow-400", depth: 0, r: 5, x: 10, y: 10 },
];

const ANALYZED_STATS = [
    { label: "Total Dependencies", value: "1,245", color: "text-green-400" },
    { label: "Languages", value: "TS, JS, CSS", color: "text-blue-400" },
    { label: "UI Components", value: "128", color: "text-cyan-400" },
    { label: "Total Libraries", value: "42", color: "text-purple-400" },
    { label: "Circular Deps", value: "0", color: "text-red-400" },
    { label: "Modularity Score", value: "98%", color: "text-primary" },
];

export function AnimatedAnalyzerGraphics() {
    const [phase, setPhase] = useState<"messy" | "scanning" | "analyzed">("messy");

    useEffect(() => {
        let timer1: NodeJS.Timeout;
        let timer2: NodeJS.Timeout;
        let timer3: NodeJS.Timeout;

        const startSequence = () => {
            setPhase("messy");

            timer1 = setTimeout(() => {
                setPhase("scanning");
            }, 3000); // Messy for 3s

            timer2 = setTimeout(() => {
                setPhase("analyzed");
            }, 6000); // Scanning for 3s

            timer3 = setTimeout(() => {
                startSequence();
            }, 12000); // Analyzed for 6s, then loop
        };

        startSequence();

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, []);

    return (
        <div className="relative w-full aspect-[4/5] sm:aspect-square max-w-[500px] mx-auto overflow-hidden rounded-3xl border border-white/10 bg-[#0f111a] shadow-2xl flex flex-col">
            <div className="absolute inset-0 bg-primary/5 blur-[80px]" />

            {/* Header / Top Bar */}
            <div className="w-full h-10 border-b border-white/10 bg-white/5 flex items-center px-4 gap-2 z-20 shrink-0">
                <div className="flex gap-1.5 border-r border-white/10 pr-4">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="text-xs font-mono text-white/40 flex-1 text-center pr-12">
                    {phase === "messy" ? "Raw Codebase Explorer" : phase === "scanning" ? "Moduly Scanner Running..." : "Moduly Analysis Report"}
                </div>
            </div>

            <div className="relative w-full flex-1 flex flex-col items-center justify-center p-6 pb-12">

                {/* MESSY / SCANNING PHASE: Tree Layout */}
                <AnimatePresence>
                    {(phase === "messy" || phase === "scanning") && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                            transition={{ duration: 0.8 }}
                            className="w-full max-w-[280px] h-full flex flex-col justify-center gap-1.5"
                        >
                            {FILE_TREE.map((item) => (
                                <motion.div
                                    key={item.id}
                                    className="flex items-center gap-3 bg-white/5 border border-white/5 shadow-md p-2 rounded-lg relative overflow-hidden"
                                    style={{ marginLeft: `${item.depth * 24}px` }}
                                    animate={
                                        phase === "messy"
                                            ? {
                                                x: [item.x, item.x + (Math.random() * 6 - 3), item.x],
                                                y: [item.y, item.y + (Math.random() * 6 - 3), item.y],
                                                rotate: [item.r, item.r + (Math.random() * 4 - 2), item.r]
                                            }
                                            : {
                                                x: 0, y: 0, rotate: 0
                                            }
                                    }
                                    transition={
                                        phase === "messy"
                                            ? { duration: 2 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" }
                                            : { duration: 1, type: "spring", bounce: 0.4 } // Snapping back together
                                    }
                                >
                                    {/* Small connecting dots/lines when organized */}
                                    {item.depth > 0 && (
                                        <motion.div
                                            animate={{ opacity: phase === "scanning" ? 1 : 0.1 }}
                                            className="absolute -left-3 top-1/2 w-2 border-t border-white/10"
                                        />
                                    )}

                                    <item.icon size={18} className={item.color} />
                                    <span className="text-sm font-mono text-white/80">{item.label}</span>

                                    {/* Scanner glow sliding across organized files */}
                                    {phase === "scanning" && (
                                        <motion.div
                                            initial={{ left: "-50%" }}
                                            animate={{ left: "150%" }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                            className="absolute top-0 bottom-0 w-8 bg-primary/20 blur-sm skew-x-12"
                                        />
                                    )}
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* THE OVERALL SCANNER BEAM */}
                <AnimatePresence>
                    {phase === "scanning" && (
                        <motion.div
                            initial={{ top: "0%", opacity: 0 }}
                            animate={{ top: "100%", opacity: [0, 1, 1, 0] }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 2.5, ease: "linear", times: [0, 0.2, 0.8, 1] }}
                            className="absolute left-0 w-full h-[2px] bg-primary z-30 shadow-[0_0_20px_var(--primary)] pointer-events-none"
                        >
                            <div className="absolute -top-10 left-0 w-full h-10 bg-gradient-to-t from-primary/30 to-transparent" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ANALYZED STATS PHASE */}
                <AnimatePresence>
                    {phase === "analyzed" && (
                        <motion.div
                            initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.8, type: "spring" }}
                            className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-center gap-4 sm:gap-6 bg-[#0f111a]/80 backdrop-blur-sm"
                        >
                            <div className="flex items-center gap-3 sm:gap-4 border-b border-white/10 pb-4 sm:pb-6">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-2xl bg-primary/20 border border-primary/50 flex items-center justify-center">
                                    <CheckCircle2 size={24} className="text-primary sm:w-8 sm:h-8" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-0.5 sm:mb-1 truncate">Project Mapped</h3>
                                    <div className="text-xs sm:text-sm font-mono text-white/50 truncate">Analysis completed in 1.2s</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                {ANALYZED_STATS.map((stat, i) => (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 + (i * 0.1) }}
                                        className="glass p-3 rounded-xl border border-white/5 bg-white/5"
                                    >
                                        <div className="text-[10px] sm:text-xs font-mono text-white/40 mb-1 uppercase tracking-wider truncate">{stat.label}</div>
                                        <div className={`text-base sm:text-lg font-bold ${stat.color} truncate`}>{stat.value}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}
