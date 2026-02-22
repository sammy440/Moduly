"use client";

import React from 'react';
import { Search, Bell, User } from 'lucide-react';

export function Header() {
    return (
        <header className="h-20 flex items-center justify-between px-10 border-b border-white/5 animate-fade-in">
            <div className="flex items-center gap-6">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search modules..."
                        className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-6 outline-none focus:border-primary/50 focus:bg-white/10 transition-all w-64 text-sm"
                    />
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-white/40">
                    <span>PROJECT:</span>
                    <span className="text-white/80 tracking-wide uppercase">MODULY-CLI</span>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <button className="relative p-2 rounded-full hover:bg-white/5 transition-all text-white/60 hover:text-white">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-hotspot rounded-full border-2 border-[#0B0F19]"></span>
                </button>
                <div className="h-10 w-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold">
                    JD
                </div>
            </div>
        </header>
    );
}
