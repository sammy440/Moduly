"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Share2, Activity, ShieldAlert, Settings, ChevronLeft, ChevronRight, Sun, Moon, X, Hexagon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useTheme } from '../context/ThemeContext';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const navItems = [
    { icon: LayoutDashboard, label: 'Architecture', href: '/dashboard' },
    { icon: Share2, label: 'Dependencies', href: '/dashboard/dependencies' },
    { icon: Activity, label: 'Performance', href: '/dashboard/performance' },
    { icon: ShieldAlert, label: 'Security', href: '/dashboard/security' },
];

export function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const { theme, toggleTheme, isDark } = useTheme();
    const pathname = usePathname();
    const settingsRef = useRef<HTMLDivElement>(null);

    // Close settings when clicking outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
                setIsSettingsOpen(false);
            }
        }
        if (isSettingsOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isSettingsOpen]);

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) setIsCollapsed(true);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    function isActive(href: string) {
        if (href === '/dashboard') return pathname === '/dashboard';
        return pathname.startsWith(href);
    }

    return (
        <>
            {/* Mobile backdrop */}
            {isMobile && !isCollapsed && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                    onClick={() => setIsCollapsed(true)}
                />
            )}
            <motion.aside
                initial={false}
                animate={{ width: isCollapsed ? (isMobile ? 64 : 80) : 260 }}
                className={cn(
                    "h-screen flex flex-col p-2 md:p-4 z-50 transition-colors duration-500 border-r shrink-0",
                    isMobile && "fixed left-0 top-0 bottom-0 shadow-2xl"
                )}
                style={{
                    background: 'var(--dash-surface)',
                    borderColor: 'var(--dash-border)',
                    backdropFilter: 'blur(16px)',
                    ...(isMobile && isCollapsed ? { transform: 'translateX(-100%)' } : {})
                }}
            >
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} mb-6 md:mb-10 px-2`}>
                    {!isCollapsed && (
                        <Link href="/" className="flex ml-2 md:ml-4 items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity cursor-pointer">
                            <Hexagon className="absolute text-primary animate-[spin_10s_linear_infinite]" size={isMobile ? 20 : 24} />
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="ml-6 md:ml-8 text-xl md:text-2xl font-serif font-bold tracking-tighter text-primary"
                            >
                                Moduly
                            </motion.span>
                        </Link>
                    )}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-2 rounded-lg transition-colors"
                        style={{ color: 'var(--dash-text-secondary)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--dash-hover)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "w-full flex items-center gap-4 p-3 rounded-xl transition-all group",
                                    active && "text-primary bg-primary/5"
                                )}
                                style={{
                                    color: active ? undefined : 'var(--dash-text-secondary)',
                                }}
                                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--dash-hover)'; }}
                                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                            >
                                <item.icon size={22} className={cn(
                                    "transition-transform group-hover:scale-110",
                                    active && "text-primary"
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
                            </Link>
                        );
                    })}
                </nav>

                {/* ── Settings ────────────────────────────────────────────────── */}
                <div className="pt-4 space-y-2 relative" style={{ borderTop: '1px solid var(--dash-divider)' }} ref={settingsRef}>
                    <button
                        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                        className={cn(
                            "w-full flex items-center gap-4 p-3 rounded-xl transition-all",
                            isSettingsOpen && "bg-primary/5 text-primary"
                        )}
                        style={{ color: isSettingsOpen ? undefined : 'var(--dash-text-secondary)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--dash-hover)'}
                        onMouseLeave={e => { if (!isSettingsOpen) e.currentTarget.style.background = 'transparent'; }}
                    >
                        <Settings size={22} className={cn("transition-transform", isSettingsOpen && "rotate-90")} />
                        {!isCollapsed && <span className="font-medium">Settings</span>}
                    </button>

                    {/* Settings popover */}
                    <AnimatePresence>
                        {isSettingsOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="absolute bottom-full mb-3 rounded-2xl border shadow-2xl overflow-hidden"
                                style={{
                                    left: '0',
                                    width: isCollapsed ? '240px' : '100%',
                                    background: 'var(--dash-surface)',
                                    borderColor: 'var(--dash-border)',
                                    backdropFilter: 'blur(20px)',
                                }}
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--dash-divider)' }}>
                                    <div className="flex items-center gap-2.5">
                                        <Settings size={15} style={{ color: 'var(--dash-text-muted)' }} />
                                        <span className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: 'var(--dash-text-muted)' }}>Settings</span>
                                    </div>
                                    <button
                                        onClick={() => setIsSettingsOpen(false)}
                                        className="p-1 rounded-md transition-colors"
                                        style={{ color: 'var(--dash-text-muted)' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'var(--dash-hover)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <X size={14} />
                                    </button>
                                </div>

                                {/* Theme toggle */}
                                <div className="p-4">
                                    <div className="flex items-center justify-between p-3 rounded-xl transition-colors" style={{ background: 'var(--dash-hover)' }}>
                                        <div className="flex items-center gap-3">
                                            {isDark ? (
                                                <Moon size={18} className="text-[#5B9CFF]" />
                                            ) : (
                                                <Sun size={18} className="text-[#FFB84C]" />
                                            )}
                                            <div>
                                                <div className="text-sm font-semibold" style={{ color: 'var(--dash-text)' }}>
                                                    {isDark ? 'Dark Mode' : 'Light Mode'}
                                                </div>
                                                <div className="text-[10px]" style={{ color: 'var(--dash-text-muted)' }}>
                                                    Switch appearance
                                                </div>
                                            </div>
                                        </div>

                                        {/* Toggle switch */}
                                        <button
                                            onClick={toggleTheme}
                                            className="relative w-12 h-7 rounded-full transition-colors duration-300 focus:outline-none"
                                            style={{
                                                background: isDark
                                                    ? 'linear-gradient(135deg, #5B9CFF, #9F7AEA)'
                                                    : 'linear-gradient(135deg, #FFB84C, #FF6B6B)',
                                            }}
                                        >
                                            <motion.div
                                                className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center"
                                                animate={{ left: isDark ? '4px' : '26px' }}
                                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                            >
                                                {isDark ? (
                                                    <Moon size={10} className="text-[#5B9CFF]" />
                                                ) : (
                                                    <Sun size={10} className="text-[#FFB84C]" />
                                                )}
                                            </motion.div>
                                        </button>
                                    </div>

                                    {/* Visual mode indicators */}
                                    <div className="grid grid-cols-2 gap-2 mt-3">
                                        <button
                                            onClick={() => { if (!isDark) toggleTheme(); }}
                                            className={cn(
                                                "p-3 rounded-xl border transition-all text-center",
                                                isDark ? "border-primary/30" : "border-transparent"
                                            )}
                                            style={{
                                                background: isDark ? 'rgba(91,156,255,0.08)' : 'var(--dash-hover)',
                                                borderColor: isDark ? undefined : 'var(--dash-border)',
                                            }}
                                        >
                                            <div className="w-full h-8 rounded-lg bg-[#0B0F19] mb-2 border border-white/10" />
                                            <span className={cn("text-[10px] font-bold uppercase tracking-wider", isDark ? "text-primary" : "")} style={{ color: isDark ? undefined : 'var(--dash-text-muted)' }}>
                                                Dark
                                            </span>
                                        </button>
                                        <button
                                            onClick={() => { if (isDark) toggleTheme(); }}
                                            className={cn(
                                                "p-3 rounded-xl border transition-all text-center",
                                                !isDark ? "border-[#FFB84C]/30" : "border-transparent"
                                            )}
                                            style={{
                                                background: !isDark ? 'rgba(255,184,76,0.08)' : 'var(--dash-hover)',
                                                borderColor: !isDark ? undefined : 'var(--dash-border)',
                                            }}
                                        >
                                            <div className="w-full h-8 rounded-lg bg-[#f0f2f7] mb-2 border border-black/10" />
                                            <span className={cn("text-[10px] font-bold uppercase tracking-wider", !isDark ? "text-[#FFB84C]" : "")} style={{ color: !isDark ? undefined : 'var(--dash-text-muted)' }}>
                                                Light
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Mobile open toggle (when collapsed) */}
                {isMobile && isCollapsed && (
                    <button
                        onClick={() => setIsCollapsed(false)}
                        className="fixed bottom-6 right-6 p-4 rounded-full shadow-2xl z-50 bg-primary text-background"
                    >
                        <LayoutDashboard size={24} />
                    </button>
                )}
            </motion.aside>
        </>
    );
}
