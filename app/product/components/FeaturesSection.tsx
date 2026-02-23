"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { Box, Shield, Zap, Activity, Layers, Eye, GitBranch, Cpu, BarChart3 } from "lucide-react";
import { SectionHeader, stagger } from "./SectionHeader";

// ─── 3D Tilt Card ────────────────────────────────────────────────────────────

function TiltCard({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

    const handleMouse = (e: React.MouseEvent) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
    };

    const handleLeave = () => { x.set(0); y.set(0); };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={handleLeave}
            style={{ rotateX, rotateY, transformPerspective: 800, ...style }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// ─── Data ────────────────────────────────────────────────────────────────────

const features = [
    {
        icon: Box,
        title: "3D Architecture Map",
        description: "Explore your entire codebase in an interactive, force-directed 3D graph. Each node is a file — shaped and colored by type.",
        gradient: "from-[#5B9CFF] to-[#9F7AEA]",
        span: "md:col-span-2 md:row-span-2",
        size: "large",
    },
    {
        icon: Layers,
        title: "Dependency Graph",
        description: "AST-based import scanning detects used, unused, and outdated packages automatically.",
        gradient: "from-[#5B9CFF] to-[#9F7AEA]",
        span: "md:col-span-1 md:row-span-1",
        size: "small",
    },
    {
        icon: Shield,
        title: "Security Scanning",
        description: "npm audit + AST-level code analysis for eval(), innerHTML, hardcoded secrets, and more.",
        gradient: "from-[#5B9CFF] to-[#9F7AEA]",
        span: "md:col-span-1 md:row-span-1",
        size: "small",
    },
    {
        icon: Activity,
        title: "Performance Analysis",
        description: "Bundle size, load time estimation, large file detection, and heavy dependency flagging with recommendations.",
        gradient: "from-[#5B9CFF] to-[#9F7AEA]",
        span: "md:col-span-1 md:row-span-2",
        size: "tall",
    },
    {
        icon: Cpu,
        title: "AI Insights",
        description: "AI-powered analysis detects anti-patterns and provides actionable architectural recommendations.",
        gradient: "from-[#5B9CFF] to-[#9F7AEA]",
        span: "md:col-span-1 md:row-span-1",
        size: "small",
    },
    {
        icon: BarChart3,
        title: "Health Score",
        description: "Unified 0–100 score based on modularity, coupling, vulnerabilities, and Git volatility.",
        gradient: "from-[#5B9CFF] to-[#9F7AEA]",
        span: "md:col-span-1 md:row-span-1",
        size: "small",
    },
    {
        icon: Eye,
        title: "Real-Time Sync",
        description: "Live dashboard updates via SSE — zero manual refresh after CLI analysis.",
        gradient: "from-[#5B9CFF] to-[#9F7AEA]",
        span: "md:col-span-1 md:row-span-1",
        size: "small",
    },
    {
        icon: GitBranch,
        title: "Git Hotspots",
        description: "Identifies the most frequently changed files that may need refactoring or better test coverage.",
        gradient: "from-[#5B9CFF] to-[#9F7AEA]",
        span: "md:col-span-2 md:row-span-1",
        size: "wide",
    },
];

// ─── Component ───────────────────────────────────────────────────────────────

export function ProductFeaturesSection() {
    return (
        <section id="features" className="relative py-32 px-6">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/8 blur-[200px] rounded-full -z-10 pointer-events-none" />

            <SectionHeader
                badge="Features"
                title="Everything you need to"
                highlight="understand your code"
                description="From 3D architecture visualization to AI-powered insights — all from a single CLI command."
            />

            {/* Bento Grid Layout */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-[180px]">
                {features.map((feature, i) => (
                    <TiltCard
                        key={i}
                        className={`${feature.span}`}
                    >
                        <motion.div
                            {...stagger}
                            transition={{ duration: 0.7, delay: i * 0.07 }}
                            className={`group relative h-full rounded-3xl border border-white/[0.06] overflow-hidden cursor-default ${feature.size === 'large' ? 'p-10' : feature.size === 'wide' ? 'p-8' : 'p-6'
                                }`}
                            style={{ background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(16px)' }}
                        >
                            {/* Animated gradient border on top */}
                            <motion.div
                                className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${feature.gradient}`}
                                initial={{ scaleX: 0, originX: 0 }}
                                whileInView={{ scaleX: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: i * 0.07 + 0.3 }}
                            />

                            {/* Hover glow */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-700`} />

                            {/* Floating orb */}
                            <motion.div
                                className={`absolute -right-12 -bottom-12 w-40 h-40 rounded-full bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.08] blur-[60px] transition-opacity duration-700`}
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            />

                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div>
                                    {/* Icon with gradient ring */}
                                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${feature.gradient} p-[1px] mb-4 group-hover:scale-110 transition-transform duration-500`}>
                                        <div className="w-full h-full rounded-2xl bg-[#0B0F19] flex items-center justify-center">
                                            <feature.icon size={20} className="text-white/80" />
                                        </div>
                                    </div>

                                    <h3 className={`font-bold text-white mb-2 ${feature.size === 'large' ? 'text-3xl' : feature.size === 'wide' ? 'text-2xl' : 'text-lg'}`}>
                                        {feature.title}
                                    </h3>
                                </div>

                                <p className={`text-white/40 leading-relaxed ${feature.size === 'large' ? 'text-base max-w-md' : 'text-sm'}`}>
                                    {feature.description}
                                </p>
                            </div>

                            {/* Corner accent for large cards */}
                            {feature.size === 'large' && (
                                <div className="absolute bottom-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <feature.icon size={120} className="text-white" />
                                </div>
                            )}
                        </motion.div>
                    </TiltCard>
                ))}
            </div>
        </section>
    );
}
