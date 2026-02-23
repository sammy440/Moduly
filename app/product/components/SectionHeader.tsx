"use client";

import { motion } from "framer-motion";

// ─── Shared animation variants ───────────────────────────────────────────────

export const fadeUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as any },
} as any;

export const stagger = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
} as any;

// ─── Section Header ──────────────────────────────────────────────────────────

export function SectionHeader({ badge, title, highlight, description }: {
    badge: string;
    title: string;
    highlight: string;
    description: string;
}) {
    return (
        <div className="text-center max-w-3xl mx-auto mb-20">
            <motion.div {...fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{badge}</span>
            </motion.div>
            <motion.h2 {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }} className="text-4xl md:text-6xl font-serif mb-6">
                {title} <span className="text-primary italic">{highlight}</span>
            </motion.h2>
            <motion.p {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.2 }} className="text-white/50 text-lg leading-relaxed">
                {description}
            </motion.p>
        </div>
    );
}
