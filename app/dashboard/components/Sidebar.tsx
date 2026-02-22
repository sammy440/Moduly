"use client";

import React from 'react';
import { LayoutDashboard, Share2, Activity, ShieldAlert, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const navItems = [
    { icon: LayoutDashboard, label: 'Architecture', id: 'arch' },
    { icon: Share2, label: 'Dependencies', id: 'deps' },
    { icon: Activity, label: 'Performance', id: 'perf' },
    { icon: ShieldAlert, label: 'Security', id: 'sec' },
];

export function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? 80 : 260 }}
            className="h-screen glass flex flex-col p-4 z-50 transition-colors"
        >
            <div className="flex items-center justify-between mb-10 px-2">
                {!isCollapsed && (
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-2xl font-bold tracking-tighter text-primary neon-glow-blue"
                    >
                        MODULY
                    </motion.span>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                    {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        className={cn(
                            "w-full flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all group",
                            item.id === 'arch' && "text-primary bg-primary/5"
                        )}
                    >
                        <item.icon size={22} className={cn(
                            "transition-transform group-hover:scale-110",
                            item.id === 'arch' && "text-primary"
                        )} />
                        {!isCollapsed && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="font-medium"
                            >
                                {item.label}
                            </motion.span>
                        )}
                    </button>
                ))}
            </nav>

            <div className="pt-4 border-t border-white/5 space-y-2">
                <button className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all">
                    <Settings size={22} />
                    {!isCollapsed && <span>Settings</span>}
                </button>
            </div>
        </motion.aside>
    );
}
