"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl z-10"
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center mt-[100px] gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full mb-5"
            >
                <span className="w-1 h-1 rounded-full bg-accent animate-pulse"></span>
                <span className="text-xs font-bold tracking-widest text-white/60">Open Source</span>
            </motion.div>

            <h1 className="text-7xl md:text-9xl font-serif mb-8 leading-tight tracking-tighter">
                See your <span className="text-primary italic">code</span> differently.
            </h1>

            <p className="text-lg md:text-xl text-white/50 mb-12 max-w-2xl mx-auto leading-relaxed">
                High-end architecture analysis with interactive 3D graphs for messy codebases.
                The ultimate graph for engineering teams.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <Link href="/dashboard">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-primary text-white px-10 py-5 rounded-2xl font-bold flex items-center gap-3 neon-glow-blue"
                    >
                        Enter Dashboard
                        <ArrowRight size={20} />
                    </motion.button>
                </Link>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="glass text-white/80 px-8 py-5 rounded-2xl font-mono flex items-center justify-between gap-6 cursor-pointer hover:border-white/20 transition-colors"
                    onClick={() => navigator.clipboard.writeText("npm i moduly")}
                >
                    <div className="flex items-center gap-3">
                        <span className="text-primary/60">$</span>
                        <span>npm i moduly</span>
                    </div>
                    <div className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
