"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { MetricsPanel } from './components/MetricsPanel';
import { AISuggestionsPanel } from './components/AISuggestionsPanel';
import { UploadSection } from './components/UploadSection';
import { useReport } from './context/ReportContext';
import dynamic from 'next/dynamic';

const GraphContainer = dynamic(() => import("./components/GraphContainer").then(mod => mod.GraphContainer), { ssr: false });

export default function DashboardPage() {
    const { report } = useReport();

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
            <div className="flex flex-1 mx-10 mb-10 gap-6">
                <GraphContainer />
                <AISuggestionsPanel />
            </div>
        </motion.div>
    );
}
