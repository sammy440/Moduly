"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { mockReport } from '../data/mockReport';

export type ReportData = typeof mockReport;

interface ReportContextType {
    report: ReportData | null;
    loadReport: (data: ReportData) => void;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export function ReportProvider({ children }: { children: ReactNode }) {
    const [report, setReport] = useState<ReportData | null>(null);

    const loadReport = (data: ReportData) => {
        setReport(data);
    };

    useEffect(() => {
        // Poll for automated report injection
        const checkReport = async () => {
            try {
                const res = await fetch('/api/report');
                if (res.ok) {
                    const data = await res.json();
                    if (data.success && data.data && JSON.stringify(data.data) !== JSON.stringify(report)) {
                        setReport(data.data);
                    }
                }
            } catch (err) {
                // Ignore API errors, fallback to manual if server is not up
            }
        };

        const interval = setInterval(checkReport, 2000);
        checkReport(); // initial check

        return () => clearInterval(interval);
    }, [report]);

    return (
        <ReportContext.Provider value={{ report, loadReport }}>
            {children}
        </ReportContext.Provider>
    );
}

export function useReport() {
    const context = useContext(ReportContext);
    if (context === undefined) {
        throw new Error('useReport must be used within a ReportProvider');
    }
    return context;
}
