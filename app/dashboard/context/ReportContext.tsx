"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { mockReport } from '../data/mockReport';

export type ReportData = typeof mockReport;

export type TabType = 'arch' | 'deps' | 'perf' | 'sec';

interface ReportContextType {
    report: ReportData | null;
    loadReport: (data: ReportData) => void;
    clearReport: () => void;
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export function ReportProvider({ children }: { children: ReactNode }) {
    const [report, setReport] = useState<ReportData | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>('arch');

    const loadReport = (data: ReportData) => {
        setReport(data);
    };

    const clearReport = async () => {
        try {
            await fetch('/api/report', { method: 'DELETE' });
            setReport(null);
        } catch (err) {
            console.error('Failed to clear report', err);
        }
    };

    useEffect(() => {
        // Fetch report on mount
        const checkReport = async () => {
            try {
                const res = await fetch('/api/report');
                if (res.ok) {
                    const data = await res.json();
                    if (data.success && data.data) {
                        setReport(prev => {
                            if (JSON.stringify(data.data) !== JSON.stringify(prev)) {
                                return data.data;
                            }
                            return prev;
                        });
                    }
                }
            } catch (err) {
                // Ignore API errors, fallback to manual if server is not up
            }
        };

        checkReport();

        // Listen for real-time updates without polling
        const eventSource = new EventSource('/api/report/stream');
        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'update') {
                checkReport();
            }
        };

        return () => {
            eventSource.close();
        };
    }, []);

    return (
        <ReportContext.Provider value={{ report, loadReport, clearReport, activeTab, setActiveTab }}>
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
