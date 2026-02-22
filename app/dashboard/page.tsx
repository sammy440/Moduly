"use client";

import React from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardContent } from './components/DashboardContent';
import { ReportProvider } from './context/ReportContext';

export default function Dashboard() {
    return (
        <ReportProvider>
            <div className="flex h-screen bg-[#060912] overflow-hidden">
                <Sidebar />

                <main className="flex-1 flex flex-col relative">
                    <Header />

                    <DashboardContent />

                    {/* Decorative Background Elements */}
                    <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-secondary/10 rounded-full blur-[100px] -z-10"></div>
                </main>
            </div>
        </ReportProvider>
    );
}
