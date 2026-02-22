"use client";

import { useEffect } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";

export function InteractiveBackground() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <>
            <motion.div
                className="pointer-events-none absolute inset-0 z-0"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              600px circle at ${springX}px ${springY}px,
              rgba(91, 156, 255, 0.15),
              transparent 80%
            )
          `,
                }}
            />
            {/* Abstract Background */}
            <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
            <div className="absolute w-[1000px] h-[1000px] border border-white/[0.04] rounded-full -top-[500px] -left-[200px] animate-[spin_60s_linear_infinite]"></div>
            <div className="absolute w-[600px] h-[600px] border border-white/[0.04] rounded-full top-[200px] -right-[100px] animate-[spin_40s_linear_infinite_reverse]"></div>
        </>
    );
}
