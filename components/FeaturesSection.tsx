"use client";

import { motion } from "framer-motion";
import { Box, Shield, Zap } from "lucide-react";

function ArchitectureBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center">
            {/* Perspective Grid */}
            <motion.div
                animate={{ rotateZ: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="absolute w-[200%] h-[200%] bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black_30%,transparent_70%)]"
            />
            {/* 3D Nodes Network */}
            <div className="relative w-full h-full perspective-[800px] flex items-center justify-center">
                <motion.div
                    animate={{ rotateY: 360, rotateX: [10, -10, 10] }}
                    transition={{ rotateY: { duration: 20, repeat: Infinity, ease: "linear" }, rotateX: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
                    className="relative w-64 h-64 transform-style-[preserve-3d]"
                >
                    {/* Connecting SVG Lines */}
                    <svg className="absolute inset-0 w-full h-full overflow-visible opacity-40">
                        <line x1="25%" y1="25%" x2="75%" y2="25%" stroke="currentColor" className="text-primary" strokeWidth="2" strokeDasharray="4" />
                        <line x1="75%" y1="25%" x2="75%" y2="75%" stroke="currentColor" className="text-white/40" strokeWidth="1" />
                        <line x1="75%" y1="75%" x2="25%" y2="75%" stroke="currentColor" className="text-white/40" strokeWidth="1" />
                        <line x1="25%" y1="75%" x2="25%" y2="25%" stroke="currentColor" className="text-white/40" strokeWidth="1" />
                        <line x1="25%" y1="25%" x2="50%" y2="50%" stroke="currentColor" className="text-primary" strokeWidth="2" />
                        <line x1="75%" y1="75%" x2="50%" y2="50%" stroke="currentColor" className="text-white/40" strokeWidth="1" />
                    </svg>

                    {/* Nodes */}
                    {[
                        { left: "25%", top: "25%", translateZ: 50, color: "bg-primary text-primary" },
                        { left: "75%", top: "25%", translateZ: -50, color: "bg-blue-400 text-blue-400" },
                        { left: "75%", top: "75%", translateZ: 50, color: "bg-cyan-400 text-cyan-400" },
                        { left: "25%", top: "75%", translateZ: -50, color: "bg-white text-white" },
                        { left: "50%", top: "50%", translateZ: 0, color: "bg-primary text-primary" }
                    ].map((node, i) => (
                        <div
                            key={i}
                            className={`absolute w-3 h-3 -mx-1.5 -my-1.5 rounded-full ${node.color} shadow-[0_0_15px_currentColor]`}
                            style={{ left: node.left, top: node.top, transform: `translateZ(${node.translateZ}px)` }}
                        >
                            <div className="absolute inset-0 rounded-full animate-ping opacity-50 bg-inherit" />
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}

function InsightsBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center">
            {/* Radar concentric circles */}
            <div className="absolute w-[150%] h-[150%] rounded-full border border-white/5" />
            <div className="absolute w-[100%] h-[100%] rounded-full border border-white/5" />
            <div className="absolute w-[50%] h-[50%] rounded-full border border-primary/20 border-dashed" />

            {/* Spinning Radar Sweep */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute w-full h-full rounded-full"
                style={{ background: "conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(61, 68, 165, 0.15) 360deg)" }}
            />

            {/* Detected Anomalies (Red dots bursting and turning green) */}
            {[
                { top: "25%", left: "35%", delay: 0 },
                { top: "65%", left: "75%", delay: 1.5 },
                { top: "45%", left: "80%", delay: 3 },
            ].map((dot, i) => (
                <motion.div
                    key={i}
                    initial={{ scale: 0, backgroundColor: "#ef4444" }} // Red initially
                    animate={{ scale: [0, 1.5, 1], backgroundColor: ["#ef4444", "#ef4444", "#CCFF00"] }} // Pops, stays red, turns primary
                    transition={{ duration: 3, delay: dot.delay, repeat: Infinity, repeatDelay: 1 }}
                    className="absolute w-3 h-3 -mx-1.5 -my-1.5 rounded-full shadow-[0_0_15px_currentColor]"
                    style={{ top: dot.top, left: dot.left }}
                />
            ))}
        </div>
    );
}

function HealthBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30 group-hover:opacity-100 transition-opacity duration-700 pb-12">
            {/* Code lines representation resolving/healing */}
            <div className="absolute inset-0 pt-16 px-8 flex flex-col gap-4 opacity-50">
                {[
                    { w: "80%", initialColor: "#1a155fff" }, // Red
                    { w: "60%", initialColor: "#544cc4ff" }, // Yellow
                    { w: "90%", initialColor: "#181235ff" },
                    { w: "40%", initialColor: "#7363ceff" }, // Red
                    { w: "70%", initialColor: "#5834bdff" }
                ].map((line, i) => (
                    <div key={i} className="h-1.5 rounded-full overflow-hidden w-full bg-white/5">
                        <motion.div
                            initial={{ x: "-100%", backgroundColor: line.initialColor }}
                            animate={{ x: "0%", backgroundColor: [line.initialColor, "#2f1aa7ff"] }}
                            transition={{ duration: 2, delay: i * 0.3, repeat: Infinity, repeatType: "reverse", repeatDelay: 2 }}
                            className="h-full shadow-[0_0_10px_currentColor]"
                            style={{ width: line.w }}
                        />
                    </div>
                ))}
            </div>

            {/* Glowing Score overlay */}
            <motion.div
                animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-10 -bottom-10 w-64 h-64 bg-primary/10 rounded-full blur-[40px]"
            />
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: [0, 1, 0], y: [10, 0, -10] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                className="absolute right-8 bottom-8 text-6xl font-serif font-bold text-primary/30 italic"
            >
                A+
            </motion.div>
        </div>
    );
}

const features = [
    {
        icon: Box,
        title: "3D Architecture",
        description: "Navigate your file system in a fully immersive 3D space.",
        className: "md:col-span-2 md:row-span-1",
        Background: ArchitectureBackground
    },
    {
        icon: Zap,
        title: "Instant Insights",
        description: "Find circular dependencies and bottlenecks in seconds.",
        className: "md:col-span-1 md:row-span-2",
        Background: InsightsBackground
    },
    {
        icon: Shield,
        title: "Health Scoring",
        description: "Unified score based on modularity, test coverage and churn.",
        className: "md:col-span-2 md:row-span-1",
        Background: HealthBackground
    }
];

export function FeaturesSection() {
    return (
        <div className="w-full max-w-5xl mx-auto mt-32 mb-20 px-6 z-10 relative">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/10 blur-[120px] rounded-full -z-10 pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
                {features.map((feature, idx) => (
                    <FeatureCard key={idx} {...feature} index={idx} />
                ))}
            </div>
        </div>
    );
}

function FeatureCard({ icon: Icon, title, description, index, className, Background }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9, rotateX: 15 }}
            whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: index * 0.15, type: "spring", bounce: 0.35, damping: 20 }}
            whileHover={{ scale: 1.02 }}
            style={{ perspective: 1200 }}
            className={`group relative p-8 rounded-[3rem] glass bg-gradient-to-br from-white/[0.08] to-transparent border border-white/10 overflow-hidden flex flex-col justify-between hover:border-white/30 transition-all duration-500 shadow-xl ${className || ''}`}
        >
            {Background && <Background />}

            {/* Subtle Gradient Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />

            <div className="p-5 rounded-full bg-white/10 border border-white/5 w-fit group-hover:scale-110 transition-all duration-500 group-hover:bg-white/20 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] relative z-10">
                <Icon size={32} className="text-primary group-hover:text-white transition-colors duration-500 drop-shadow-md" />
            </div>

            <div className="mt-8 z-10 w-full md:w-4/5 pt-4 relative">
                <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-white transition-colors">{title}</h3>
                <p className="text-white/60 leading-relaxed text-base group-hover:text-white/80 transition-colors">
                    {description}
                </p>
            </div>
        </motion.div>
    );
}
