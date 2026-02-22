"use client";

import { motion } from "framer-motion";
import { Box, Shield, Zap } from "lucide-react";

function ArchitectureBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity duration-700">
            {/* Smooth moving gradient orb */}
            <motion.div
                animate={{
                    x: [0, 50, -50, 0],
                    y: [0, -50, 50, 0],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute -top-32 -left-32 w-64 h-64 bg-primary/30 blur-[60px] rounded-full"
            />
            {/* Animated Grid that is always moving safely */}
            <motion.div
                animate={{ backgroundPosition: ["0px 0px", "40px 40px"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:40px_40px] [transform:rotateX(60deg)_scale(2)] origin-top [mask-image:linear-gradient(to_bottom,black_20%,transparent_70%)]"
            />
            {/* Scanning line */}
            <motion.div
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-[100px] bg-gradient-to-b from-transparent via-primary/20 to-transparent"
                style={{ top: 0 }}
            />
        </div>
    );
}

function InsightsBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity duration-700">
            {/* Glowing Aurora Blob */}
            <motion.div
                animate={{
                    rotate: 360,
                    scale: [1, 1.2, 1],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute -right-20 -bottom-20 w-80 h-80 bg-accent/20 blur-[80px] rounded-[40%_60%_70%_30%]"
            />
            {/* Data particles flying diagonally */}
            <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ x: "-20%", y: "120%", opacity: 0 }}
                        animate={{ x: "120%", y: "-20%", opacity: [0, 1, 0] }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 3,
                            ease: "linear"
                        }}
                        className="absolute w-32 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent rotate-[-45deg]"
                        style={{ left: `${Math.random() * 50}%` }}
                    />
                ))}
            </div>
        </div>
    );
}

function HealthBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity duration-700">
            {/* Multi-layered organic blobs intersecting */}
            <motion.div
                animate={{
                    rotate: [0, 180, 360],
                    borderRadius: ["40% 60% 70% 30%", "60% 40% 30% 70%", "40% 60% 70% 30%"],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute top-10 right-10 w-64 h-64 bg-secondary/30 blur-[60px]"
            />
            <motion.div
                animate={{
                    rotate: [360, 180, 0],
                    borderRadius: ["60% 40% 30% 70%", "40% 60% 70% 30%", "60% 40% 30% 70%"],
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-10 left-10 w-48 h-48 bg-primary/20 blur-[50px]"
            />
            {/* Slow breathing pulse */}
            <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                    animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.2, 0, 0.2] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-[150%] h-[150%] border-[4px] border-secondary/30 rounded-full"
                />
            </div>
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
                <Icon size={32} className="text-white group-hover:text-primary transition-colors duration-500 drop-shadow-md" />
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
