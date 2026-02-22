"use client";

import { motion } from "framer-motion";
import { Cpu, Eye, Workflow, Search, Activity, Share2 } from "lucide-react";

const aboutFeatures = [
    {
        icon: Eye,
        title: "Visual Clarity",
        desc: "See the hidden structure of your monolithic codebases. Track dependencies instantly."
    },
    {
        icon: Cpu,
        title: "AI Analysis",
        desc: "Automated insights that flag circular dependencies and architectural bottlenecks."
    },
    {
        icon: Workflow,
        title: "Seamless Flow",
        desc: "Designed explicitly to fit within a modern developer's natural workflows without any configuration."
    },
    {
        icon: Search,
        title: "Deep Scanning",
        desc: "Perform comprehensive AST parsing across your entire project locally and securely."
    },
    {
        icon: Activity,
        title: "Real-time Metrics",
        desc: "Monitor codebase health with live updating modularity, test coverage, and churn scores."
    },
    {
        icon: Share2,
        title: "Easy Collaboration",
        desc: "Export generated 3D maps and architecture reports to share with your engineering team."
    }
];

export function AboutSection() {
    // Duplicate the array to create a seamless infinite scrolling loop
    const scrollItems = [...aboutFeatures, ...aboutFeatures];

    return (
        <section className="w-full max-w-6xl mx-auto py-24 px-6 relative z-10">
            <div className="text-center mb-16">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-6xl font-serif mb-6"
                >
                    What is <span className="text-primary italic">Moduly</span>?
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-white/50 max-w-2xl mx-auto text-lg"
                >
                    Moduly is an advanced architecture analysis tool that automatically scans your codebase and visualizes it in an interactive 3D environment. It transforms messy directory structures into intuitive, navigable graph networks.
                </motion.p>
            </div>

            <div
                className="w-full h-[600px] relative mx-auto max-w-3xl overflow-hidden rounded-3xl group"
                style={{ perspective: "1200px" }}
            >
                {/* Fade masks for top and bottom limits to transition into the background cleanly */}
                <div className="absolute inset-0 z-20 pointer-events-none bg-[linear-gradient(to_bottom,var(--background)_0%,transparent_20%,transparent_80%,var(--background)_100%)]" />

                <motion.div
                    className="flex flex-col gap-6 absolute w-full left-0 right-0 py-10"
                    style={{ rotateX: "15deg", transformStyle: "preserve-3d" }}
                    animate={{
                        y: ["0%", "-50%"] // Since the array is doubled, -50% perfectly aligns the loop
                    }}
                    transition={{
                        duration: 30, // Smooth & slow infinite scroll pacing
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    {scrollItems.map((item, i) => (
                        <div
                            key={i}
                            style={{ transform: `translateZ(${Math.abs(i % aboutFeatures.length - 2) * 10}px)` }}
                            className="glass w-full p-6 rounded-3xl border border-white/5 bg-white/[0.02] flex items-center gap-6 hover:bg-white/10 hover:border-primary/40 transition-all duration-300 shadow-xl cursor-default hover:scale-[1.02]"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 shadow-[0_0_15px_transparent] transition-all">
                                <item.icon className="text-primary" size={28} />
                            </div>
                            <div className="text-left flex-1">
                                <h3 className="text-xl font-bold mb-2 text-white/90">{item.title}</h3>
                                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
