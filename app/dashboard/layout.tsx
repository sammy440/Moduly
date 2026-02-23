"use client";

import React from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ReportProvider } from './context/ReportContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

function DashboardShell({ children }: { children: React.ReactNode }) {
    const { isDark } = useTheme();

    return (
        <div className={`flex h-screen overflow-hidden transition-colors duration-500 ${isDark ? '' : 'dashboard-light'}`} style={{ background: 'var(--dash-bg)' }}>
            <Sidebar />

            <main className="flex-1 flex flex-col relative">
                <Header />

                {children}

                {/* Decorative Background Elements */}
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] -z-10 animate-pulse" style={{ background: 'var(--dash-glow-1)' }} />
                <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] rounded-full blur-[100px] -z-10" style={{ background: 'var(--dash-glow-2)' }} />
            </main>
        </div>
    );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <ReportProvider>
                <DashboardShell>
                    {children}
                </DashboardShell>
            </ReportProvider>
        </ThemeProvider>
    );
}
