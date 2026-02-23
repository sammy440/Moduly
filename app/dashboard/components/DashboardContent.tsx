"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { MetricsPanel } from './MetricsPanel';
import dynamic from 'next/dynamic';
import { useReport } from '../context/ReportContext';
import { UploadSection } from '@/app/dashboard/components/UploadSection';
import { AISuggestionsPanel } from '@/app/dashboard/components/AISuggestionsPanel';
import { DependenciesPanel } from '@/app/dashboard/components/DependenciesPanel';
import { PerformancePanel } from '@/app/dashboard/components/PerformancePanel';
import { SecurityPanel } from '@/app/dashboard/components/SecurityPanel';

const GraphContainer = dynamic(() => import("./GraphContainer").then(mod => mod.GraphContainer), { ssr: false });

export function DashboardContent() {
    const { report, activeTab } = useReport();

    if (!report) {
        return <UploadSection />;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col overflow-y-auto"
        >
            <MetricsPanel />
            {activeTab === 'arch' && (
                <div className="flex flex-1 mx-10 mb-10 gap-6">
                    <GraphContainer />
                    <AISuggestionsPanel />
                </div>
            )}
            {activeTab === 'deps' && <DependenciesPanel />}
            {activeTab === 'perf' && <PerformancePanel />}
            {activeTab === 'sec' && <SecurityPanel />}
        </motion.div>
    );
}
