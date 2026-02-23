"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { SecurityPanel } from '../components/SecurityPanel';
import { UploadSection } from '../components/UploadSection';
import { useReport } from '../context/ReportContext';

export default function SecurityPage() {
    const { report } = useReport();

    if (!report) {
        return <UploadSection />;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col mt-4 overflow-y-auto"
        >
            <SecurityPanel />
        </motion.div>
    );
}
