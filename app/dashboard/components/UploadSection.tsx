"use client";

import React, { useEffect, useState } from 'react';
import { Terminal, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export function UploadSection() {
    const [dots, setDots] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.');
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-1 items-center justify-center m-10 glass rounded-[3rem] p-10 flex-col relative overflow-hidden">
            <div className="z-10 text-center max-w-xl flex flex-col items-center">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 relative"
                >
                    <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
                    <div className="bg-[#0d1323] border border-white/10 p-6 rounded-3xl relative z-10 flex items-center justify-center">
                        <Activity size={48} className="text-primary animate-pulse" />
                    </div>
                </motion.div>

                <h2 className="text-3xl font-bold tracking-tight mb-4 text-white">Listening for Moduly CLI</h2>
                <p className="text-[#a0a0a0] mb-8 leading-relaxed max-w-md">
                    We've automated the workflow. The dashboard is live and listening on <span className="text-white font-mono">localhost:3000</span>.
                </p>

                <div className="bg-black/50 border border-white/10 p-6 rounded-2xl w-full text-left flex flex-col gap-3">
                    <div className="flex items-center gap-3 text-white/50 mb-2">
                        <Terminal size={16} />
                        <span className="text-xs uppercase tracking-widest font-bold">Terminal</span>
                    </div>
                    <p className="text-white/80 font-mono text-sm">
                        <span className="text-primary">~</span> <span className="text-white/50">❯</span> moduly analyze --report
                    </p>
                    <p className="text-xs text-white/40 mt-2 italic flex items-center h-4">
                        Waiting for analysis payload{dots}
                    </p>
                </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-tr from-[#131b2c] to-[#0A0D18] opacity-50 pointer-events-none -z-10" />
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#5B9CFF]/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#9F7AEA]/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>
        </div>
    );
}
