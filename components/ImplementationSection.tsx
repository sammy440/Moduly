"use client";

import { motion } from "framer-motion";
import { Search, BrainCircuit, Activity } from "lucide-react";

import { AnimatedAnalyzerGraphics } from "./AnimatedAnalyzerGraphics";

export function ImplementationSection() {
    return (
        <section className="w-full max-w-6xl mx-auto py-32 px-6 relative z-10 flex flex-col md:flex-row-reverse items-center gap-16">
            <div className="w-full md:w-1/2 relative">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative w-full aspect-square flex items-center justify-center"
                >
                    <AnimatedAnalyzerGraphics />
                </motion.div>
            </div>

            <div className="w-full md:w-1/2">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl md:text-6xl font-serif mb-6">
                        How it <span className="text-primary italic">Works</span>
                    </h2>
                    <p className="text-white/50 text-lg mb-10 leading-relaxed">
                        Under the hood, Moduly uses sophisticated algorithms to parse your TypeScript, JavaScript, and other file types, creating an Abstract Syntax Tree (AST). It then maps these structures to calculate dependencies and architectural depth.
                    </p>

                    <div className="space-y-6 flex flex-col">
                        {[
                            {
                                icon: Search,
                                title: "1. Scanner Engine",
                                desc: "Locally scans your directories and reads imports/exports securely."
                            },
                            {
                                icon: BrainCircuit,
                                title: "2. Analysis Core",
                                desc: "Processes relationships to flag tight coupling and calculate modularity scores."
                            },
                            {
                                icon: Activity,
                                title: "3. 3D WebGL Engine",
                                desc: "Renders the structured data into an immersive force-directed 3D landscape."
                            }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-6 items-start">
                                <div className="mt-1 p-3 bg-white/5 rounded-xl text-primary border border-white/5 shadow-[0_0_15px_transparent] hover:shadow-[0_0_15px_rgba(var(--primary),0.2)] transition-shadow">
                                    <item.icon size={24} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-white/90 mb-2">{item.title}</h4>
                                    <p className="text-white/40 leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
