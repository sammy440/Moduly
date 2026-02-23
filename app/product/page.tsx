"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Hexagon, Github, ArrowUpRight, ArrowLeft, ChevronRight } from "lucide-react";
import { ProductFeaturesSection } from "./components/FeaturesSection";
import { CLISection } from "./components/CLISection";
import { DocsSection } from "./components/DocsSection";
import { fadeUp } from "./components/SectionHeader";

export default function ProductPage() {
    return (
        <div className="min-h-screen bg-background text-white relative overflow-hidden">
            {/* Floating background */}
            <div className="fixed inset-0 -z-10 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-primary/5 blur-[200px] rounded-full" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-secondary/5 blur-[200px] rounded-full" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-white/5" style={{ background: 'rgba(11,15,25,0.8)', backdropFilter: 'blur(16px)' }}>
                <div className="max-w-7xl mx-auto px-9 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="flex items-center gap-3 text-white group">
                            <div className="relative flex items-center justify-center w-8 h-8">
                                <Hexagon className="absolute text-primary animate-[spin_10s_linear_infinite]" size={20} />
                            </div>
                            <span className="text-xl font-bold tracking-wider font-serif">Moduly</span>
                        </Link>

                        <nav className="hidden md:flex items-center gap-1 ml-4">
                            {[
                                { label: "Features", href: "#features" },
                                { label: "CLI", href: "#cli" },
                                { label: "Docs", href: "#docs" },
                            ].map(link => (
                                <a key={link.href} href={link.href} className="px-3 py-1.5 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all">
                                    {link.label}
                                </a>
                            ))}
                        </nav>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="https://github.com/sammy440/Moduly"
                            target="_blank"
                            className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all"
                        >
                            <Github size={18} />
                        </Link>
                        <Link
                            href="/dashboard"
                            className="px-4 py-2 rounded-lg bg-primary text-background text-sm font-bold hover:bg-primary/90 transition-all flex items-center gap-2"
                        >
                            Dashboard <ArrowUpRight size={14} />
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="relative py-32 px-6 text-center overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full -z-10" />

                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-primary transition-colors mb-8 group">
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>

                    <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight">
                        Product <span className="text-primary italic">&</span> Docs
                    </h1>
                    <p className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed">
                        Explore every feature, learn the CLI commands, and understand the full analysis pipeline — all in one place.
                    </p>

                    <div className="flex items-center justify-center gap-4 mt-10">
                        {[
                            { label: "Features", href: "#features" },
                            { label: "CLI Tool", href: "#cli" },
                            { label: "Documentation", href: "#docs" },
                        ].map(btn => (
                            <a
                                key={btn.href}
                                href={btn.href}
                                className="px-5 py-2.5 rounded-full border border-white/10 text-sm font-medium text-white/60 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all"
                            >
                                {btn.label}
                            </a>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* Sections */}
            <ProductFeaturesSection />
            <CLISection />
            <DocsSection />

            {/* CTA */}
            <section className="relative py-32 px-6 border-t border-white/5 text-center">
                <div className="absolute inset-0 bg-primary/5 blur-[150px] -z-10" />
                <motion.div {...fadeUp} className="max-w-2xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-serif mb-6">
                        Ready to <span className="text-primary italic">analyze?</span>
                    </h2>
                    <p className="text-white/50 text-lg mb-10">
                        Install the CLI, run your first analysis, and see your architecture come alive.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <Link href="/dashboard" className="px-8 py-3 rounded-full bg-primary text-background font-bold text-lg hover:bg-primary/90 transition-all flex items-center gap-2">
                            Open Dashboard <ChevronRight size={18} />
                        </Link>
                        <Link href="https://github.com/sammy440/Moduly" target="_blank" className="px-8 py-3 rounded-full border border-white/10 text-white/70 font-bold text-lg hover:border-white/30 hover:bg-white/5 transition-all flex items-center gap-2">
                            <Github size={18} /> GitHub
                        </Link>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
