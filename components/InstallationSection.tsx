"use client";

import { motion } from "framer-motion";
import { Copy, Terminal } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const TERMINAL_STEPS = [
    { type: "input", text: "npm i -g moduly" },
    { type: "output", text: "added 1 package, and audited 2 packages in 3s", delay: 800, color: "text-green-400" },
    { type: "input", text: "moduly analyze --report" },
    { type: "output", text: "⠋ Analyzing project architecture...", delay: 600, color: "text-primary/70" },
    { type: "output", text: "⠙ Scanning files and dependencies...", delay: 800, color: "text-primary/70", replaceLast: true },
    { type: "output", text: "⠹ Generating interactive dashboard...", delay: 600, color: "text-primary/70", replaceLast: true },
    { type: "output", text: "ℹ Report saved to .moduly/report.json", delay: 400, color: "text-cyan-400", replaceLast: true },
    { type: "output", text: "ℹ Dashboard synced dynamically.", delay: 300, color: "text-white/70" },
    { type: "output", text: "✔ Analysis complete!", delay: 400, color: "text-green-400" },
    { type: "input", text: "moduly ai on" },
    { type: "output", text: "✔ AI-assisted commit detection enabled.", delay: 500, color: "text-green-400" },
];

function AnimatedTerminal() {
    const [lines, setLines] = useState<{ type: string; text: string; color?: string; id: string }[]>([]);
    const [currentTyping, setCurrentTyping] = useState("");
    const [step, setStep] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [lines, currentTyping]);

    useEffect(() => {
        if (step >= TERMINAL_STEPS.length) {
            const timeout = setTimeout(() => {
                setLines([]);
                setCurrentTyping("");
                setStep(0);
            }, 6000); // Wait 6 seconds before restarting loop
            return () => clearTimeout(timeout);
        }

        const currentStep = TERMINAL_STEPS[step];

        if (currentStep.type === "input") {
            let i = 0;
            const typeInterval = setInterval(() => {
                setCurrentTyping(currentStep.text.slice(0, i + 1));
                i++;
                if (i === currentStep.text.length) {
                    clearInterval(typeInterval);
                    setTimeout(() => {
                        setLines((prev) => [...prev, { type: "input", text: currentStep.text, id: `${step}-${Date.now()}` }]);
                        setCurrentTyping("");
                        setStep((s) => s + 1);
                    }, 400);
                }
            }, 50);

            return () => clearInterval(typeInterval);
        } else {
            const timeout = setTimeout(() => {
                setLines((prev) => {
                    if (currentStep.replaceLast && prev.length > 0 && prev[prev.length - 1].type === "output") {
                        const newLines = [...prev];
                        newLines[newLines.length - 1] = { type: "output", text: currentStep.text, color: currentStep.color, id: `${step}-${Date.now()}` };
                        return newLines;
                    }
                    return [...prev, { type: "output", text: currentStep.text, color: currentStep.color, id: `${step}-${Date.now()}` }];
                });
                setStep((s) => s + 1);
            }, currentStep.delay);
            return () => clearTimeout(timeout);
        }
    }, [step]);

    return (
        <div ref={containerRef} className="p-6 font-mono text-sm md:text-base leading-relaxed overflow-x-auto text-white/70 h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {lines.map((line) => (
                <div key={line.id} className="mb-1">
                    {line.type === "input" ? (
                        <>
                            <span className="text-primary mr-2">$</span>
                            <span className="text-white/90">{line.text}</span>
                        </>
                    ) : (
                        <span className={line.color}>{line.text}</span>
                    )}
                </div>
            ))}
            {step < TERMINAL_STEPS.length && TERMINAL_STEPS[step].type === "input" && (
                <div className="mb-1">
                    <span className="text-primary mr-2">$</span>
                    <span className="text-white/90">{currentTyping}</span>
                    <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="inline-block w-2.5 h-4 bg-primary ml-1 align-middle"
                    />
                </div>
            )}
            {step === TERMINAL_STEPS.length && (
                <div className="mb-1 mt-2">
                    <span className="text-primary mr-2">$</span>
                    <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="inline-block w-2.5 h-4 bg-primary ml-1 align-middle"
                    />
                </div>
            )}
        </div>
    );
}

export function InstallationSection() {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText("npm i moduly");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="w-full max-w-6xl mx-auto py-24 px-6 relative z-10 flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="relative perspective-[1000px]"
                >
                    <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full -z-10" />
                    <div className="glass p-1 md:p-2 rounded-2xl border border-white/10 shadow-2xl relative rotate-y-[-10deg] rotate-x-[5deg] scale-95 hover:rotate-0 hover:scale-100 transition-all duration-700">
                        <div className="bg-[#0f111a] rounded-xl overflow-hidden border border-white/5">
                            <div className="flex items-center px-4 py-3 bg-white/5 border-b border-white/5 gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                <span className="ml-4 text-xs text-white/40 font-mono tracking-widest">MODULY TERMINAL</span>
                            </div>
                            <AnimatedTerminal />
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="w-full md:w-1/2">
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl md:text-6xl font-serif mb-6">
                        Start in <span className="text-primary italic">seconds</span>
                    </h2>
                    <p className="text-white/50 text-lg mb-8 leading-relaxed">
                        Adding Moduly to your workflow is frictionless. You don't need to rebuild your projects, change dependencies or install complex systems.
                        Just run the install command and launch perfectly integrated analysis.
                    </p>

                    <div
                        onClick={handleCopy}
                        className="glass flex items-center justify-between p-4 rounded-xl border border-white/10 hover:border-primary/50 cursor-pointer group transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                <Terminal size={20} />
                            </div>
                            <span className="font-mono text-lg text-white/90">npm i -g moduly</span>
                        </div>
                        <div className="p-3 bg-white/5 rounded-lg text-white/40 group-hover:text-primary transition-colors">
                            {copied ? <span className="text-xs font-bold px-2">COPIED!</span> : <Copy size={20} />}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
