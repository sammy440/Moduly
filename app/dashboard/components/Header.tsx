"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Trash2, FileCode, Package, Shield, Layers, X, CornerDownLeft, ArrowUp, ArrowDown, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReport } from '../context/ReportContext';

// ─── Search result types ─────────────────────────────────────────────────────

type ResultCategory = 'module' | 'file' | 'package' | 'security' | 'hotspot';

interface SearchResult {
    id: string;
    label: string;
    sublabel: string;
    category: ResultCategory;
    route: string;
    icon: React.ElementType;
    color: string;
}

const CATEGORY_META: Record<ResultCategory, { label: string; icon: React.ElementType; color: string }> = {
    module: { label: 'Modules', icon: Layers, color: '#5B9CFF' },
    file: { label: 'Files', icon: FileCode, color: '#9F7AEA' },
    package: { label: 'Packages', icon: Package, color: '#CCFF00' },
    security: { label: 'Security', icon: Shield, color: '#FF6B6B' },
    hotspot: { label: 'Hotspots', icon: Zap, color: '#FFB84C' },
};

// ─── Component ───────────────────────────────────────────────────────────────

export function Header() {
    const { report, clearReport } = useReport();
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIdx, setSelectedIdx] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // ── Build searchable index from report ───────────────────────────────

    const allItems = useMemo<SearchResult[]>(() => {
        if (!report) return [];
        const items: SearchResult[] = [];

        // Modules (dependency graph nodes)
        report.dependencies.nodes.forEach((n: any) => {
            const name = n.id.split('/').pop() || n.id;
            items.push({
                id: `mod-${n.id}`,
                label: name,
                sublabel: n.id,
                category: 'module',
                route: '/dashboard',
                icon: Layers,
                color: '#5B9CFF',
            });
        });

        // Files
        report.stats.fileList?.forEach((f: any) => {
            const name = f.path.split('/').pop() || f.path;
            items.push({
                id: `file-${f.path}`,
                label: name,
                sublabel: `${f.path}  ·  ${f.linesOfCode || 0} LOC`,
                category: 'file',
                route: '/dashboard/performance',
                icon: FileCode,
                color: '#9F7AEA',
            });
        });

        // Packages (used + unused)
        const pkgDeps = report.packageDependencies;
        const allPkgs = [
            ...Object.keys(pkgDeps.dependencies || {}),
            ...Object.keys(pkgDeps.devDependencies || {}),
        ];
        const uniquePkgs = Array.from(new Set(allPkgs));
        uniquePkgs.forEach((name) => {
            const isUnused = pkgDeps.unused?.includes(name);
            const version = (pkgDeps.dependencies as any)?.[name] || (pkgDeps.devDependencies as any)?.[name] || '';
            items.push({
                id: `pkg-${name}`,
                label: name,
                sublabel: `${version}${isUnused ? '  ·  unused' : '  ·  active'}`,
                category: 'package',
                route: '/dashboard/dependencies',
                icon: Package,
                color: isUnused ? '#FF6B6B' : '#CCFF00',
            });
        });

        // Security issues
        report.security?.forEach((v: any, i: number) => {
            items.push({
                id: `sec-${i}`,
                label: v.name,
                sublabel: `${v.severity} · ${v.source}${v.file ? ` · ${v.file}` : ''}`,
                category: 'security',
                route: '/dashboard/security',
                icon: Shield,
                color: v.severity === 'high' || v.severity === 'critical' ? '#FF6B6B' : v.severity === 'medium' ? '#FFB84C' : '#5B9CFF',
            });
        });

        // Hotspots
        report.hotspots?.forEach((h: any) => {
            const name = h.file.split('/').pop() || h.file;
            items.push({
                id: `hot-${h.file}`,
                label: name,
                sublabel: `${h.file}  ·  ${h.commits} commits`,
                category: 'hotspot',
                route: '/dashboard',
                icon: Zap,
                color: '#FFB84C',
            });
        });

        return items;
    }, [report]);

    // ── Filter ───────────────────────────────────────────────────────────

    const results = useMemo(() => {
        if (!query.trim()) return [];
        const q = query.toLowerCase().trim();
        return allItems.filter(item =>
            item.label.toLowerCase().includes(q) ||
            item.sublabel.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q)
        ).slice(0, 20);
    }, [query, allItems]);

    // Group results by category
    const grouped = useMemo(() => {
        const groups: Record<string, SearchResult[]> = {};
        results.forEach(r => {
            if (!groups[r.category]) groups[r.category] = [];
            groups[r.category].push(r);
        });
        return groups;
    }, [results]);

    const flatResults = results;

    // ── Keyboard handling ────────────────────────────────────────────────

    const handleSelect = useCallback((result: SearchResult) => {
        router.push(result.route);
        setQuery('');
        setIsOpen(false);
    }, [router]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIdx(prev => Math.min(prev + 1, flatResults.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIdx(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter' && flatResults[selectedIdx]) {
            e.preventDefault();
            handleSelect(flatResults[selectedIdx]);
        } else if (e.key === 'Escape') {
            setIsOpen(false);
            inputRef.current?.blur();
        }
    }, [flatResults, selectedIdx, handleSelect]);

    // Reset selection on query change
    useEffect(() => {
        setSelectedIdx(0);
    }, [query]);

    // Scroll selected item into view
    useEffect(() => {
        const el = resultsRef.current?.querySelector(`[data-idx="${selectedIdx}"]`);
        if (el) el.scrollIntoView({ block: 'nearest' });
    }, [selectedIdx]);

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    // Ctrl+K shortcut
    useEffect(() => {
        function handleGlobalKey(e: KeyboardEvent) {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
                setIsOpen(true);
            }
        }
        document.addEventListener('keydown', handleGlobalKey);
        return () => document.removeEventListener('keydown', handleGlobalKey);
    }, []);

    const showResults = isOpen && query.trim().length > 0;

    // ── Render ───────────────────────────────────────────────────────────

    return (
        <header
            className="h-20 flex items-center justify-between px-10 animate-fade-in transition-colors duration-500 relative z-40"
            style={{ borderBottom: '1px solid var(--dash-divider)' }}
        >
            <div className="flex items-center gap-6">
                {/* Search */}
                <div className="relative z-50" ref={containerRef}>
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors z-10" style={{ color: 'var(--dash-text-muted)' }} size={18} />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search modules, files, packages..."
                            value={query}
                            onChange={e => { setQuery(e.target.value); setIsOpen(true); }}
                            onFocus={() => setIsOpen(true)}
                            onKeyDown={handleKeyDown}
                            className="rounded-full py-2.5 pl-10 pr-16 outline-none transition-all w-80 text-sm"
                            style={{
                                background: 'var(--dash-input-bg)',
                                border: '1px solid var(--dash-input-border)',
                                color: 'var(--dash-text)',
                            }}
                        />
                        {/* Shortcut hint */}
                        {!query && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                                <kbd className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider" style={{
                                    background: 'var(--dash-hover)',
                                    color: 'var(--dash-text-muted)',
                                    border: '1px solid var(--dash-border)',
                                }}>
                                    Ctrl
                                </kbd>
                                <kbd className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider" style={{
                                    background: 'var(--dash-hover)',
                                    color: 'var(--dash-text-muted)',
                                    border: '1px solid var(--dash-border)',
                                }}>
                                    K
                                </kbd>
                            </div>
                        )}
                        {/* Clear button */}
                        {query && (
                            <button
                                onClick={() => { setQuery(''); inputRef.current?.focus(); }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors"
                                style={{ color: 'var(--dash-text-muted)' }}
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    {/* ── Search Results Dropdown ───────────────────────────── */}
                    <AnimatePresence>
                        {showResults && (
                            <motion.div
                                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                                transition={{ duration: 0.18, ease: 'easeOut' }}
                                className="absolute top-full left-0 mt-2 w-[480px] max-h-[420px] rounded-2xl border overflow-hidden shadow-2xl z-[100]"
                                style={{
                                    background: 'var(--dash-surface)',
                                    borderColor: 'var(--dash-border)',
                                    backdropFilter: 'blur(24px)',
                                    WebkitBackdropFilter: 'blur(24px)',
                                    boxShadow: '0 25px 60px rgba(0,0,0,0.3), 0 0 0 1px var(--dash-border)',
                                }}
                            >
                                {/* Results list */}
                                <div ref={resultsRef} className="overflow-y-auto max-h-[360px] p-2">
                                    {flatResults.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12">
                                            <Search size={32} style={{ color: 'var(--dash-text-faint)' }} />
                                            <p className="mt-3 text-sm font-medium" style={{ color: 'var(--dash-text-muted)' }}>
                                                No results for &ldquo;{query}&rdquo;
                                            </p>
                                            <p className="text-xs mt-1" style={{ color: 'var(--dash-text-faint)' }}>
                                                Try searching for a file name or package
                                            </p>
                                        </div>
                                    ) : (
                                        Object.entries(grouped).map(([category, items]) => {
                                            const meta = CATEGORY_META[category as ResultCategory];
                                            return (
                                                <div key={category} className="mb-1">
                                                    {/* Category header */}
                                                    <div className="flex items-center gap-2 px-3 py-2">
                                                        <meta.icon size={12} style={{ color: meta.color }} />
                                                        <span className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: 'var(--dash-text-muted)' }}>
                                                            {meta.label}
                                                        </span>
                                                        <span className="text-[10px] font-mono" style={{ color: 'var(--dash-text-faint)' }}>
                                                            {items.length}
                                                        </span>
                                                    </div>

                                                    {/* Items */}
                                                    {items.map((result) => {
                                                        const globalIdx = flatResults.indexOf(result);
                                                        const isSelected = globalIdx === selectedIdx;

                                                        return (
                                                            <button
                                                                key={result.id}
                                                                data-idx={globalIdx}
                                                                onClick={() => handleSelect(result)}
                                                                onMouseEnter={() => setSelectedIdx(globalIdx)}
                                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group"
                                                                style={{
                                                                    background: isSelected ? 'var(--dash-hover)' : 'transparent',
                                                                    borderLeft: isSelected ? `2px solid ${result.color}` : '2px solid transparent',
                                                                }}
                                                            >
                                                                <div
                                                                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                                                                    style={{ background: `${result.color}15`, border: `1px solid ${result.color}25` }}
                                                                >
                                                                    <result.icon size={14} style={{ color: result.color }} />
                                                                </div>
                                                                <div className="min-w-0 flex-1">
                                                                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--dash-text)' }}>
                                                                        {highlightMatch(result.label, query)}
                                                                    </p>
                                                                    <p className="text-[11px] truncate" style={{ color: 'var(--dash-text-muted)' }}>
                                                                        {highlightMatch(result.sublabel, query)}
                                                                    </p>
                                                                </div>
                                                                {isSelected && (
                                                                    <div className="shrink-0 flex items-center gap-1 opacity-60">
                                                                        <CornerDownLeft size={12} style={{ color: 'var(--dash-text-muted)' }} />
                                                                    </div>
                                                                )}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                                {/* Footer with keyboard hints */}
                                {flatResults.length > 0 && (
                                    <div
                                        className="flex items-center justify-between px-4 py-2.5"
                                        style={{ borderTop: '1px solid var(--dash-divider)' }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1">
                                                <kbd className="p-0.5 rounded" style={{ background: 'var(--dash-hover)', border: '1px solid var(--dash-border)' }}>
                                                    <ArrowUp size={10} style={{ color: 'var(--dash-text-muted)' }} />
                                                </kbd>
                                                <kbd className="p-0.5 rounded" style={{ background: 'var(--dash-hover)', border: '1px solid var(--dash-border)' }}>
                                                    <ArrowDown size={10} style={{ color: 'var(--dash-text-muted)' }} />
                                                </kbd>
                                                <span className="text-[9px] ml-1" style={{ color: 'var(--dash-text-faint)' }}>Navigate</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <kbd className="px-1 py-0.5 rounded text-[8px] font-bold" style={{ background: 'var(--dash-hover)', color: 'var(--dash-text-muted)', border: '1px solid var(--dash-border)' }}>
                                                    Enter
                                                </kbd>
                                                <span className="text-[9px] ml-1" style={{ color: 'var(--dash-text-faint)' }}>Select</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <kbd className="px-1 py-0.5 rounded text-[8px] font-bold" style={{ background: 'var(--dash-hover)', color: 'var(--dash-text-muted)', border: '1px solid var(--dash-border)' }}>
                                                    Esc
                                                </kbd>
                                                <span className="text-[9px] ml-1" style={{ color: 'var(--dash-text-faint)' }}>Close</span>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-medium" style={{ color: 'var(--dash-text-faint)' }}>
                                            {flatResults.length} result{flatResults.length !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {report && (
                    <div className="flex items-center gap-2 text-xs font-medium" style={{ color: 'var(--dash-text-muted)' }}>
                        <span>PROJECT:</span>
                        <span className="tracking-wide uppercase" style={{ color: 'var(--dash-text-secondary)' }}>{report.projectName}</span>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-6">
                {report && (
                    <button
                        onClick={clearReport}
                        className="text-xs font-medium px-4 py-2 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/10 transition flex items-center gap-2"
                    >
                        <Trash2 size={14} /> Clear Report
                    </button>
                )}
            </div>
        </header>
    );
}

// ─── Highlight matching text ─────────────────────────────────────────────────

function highlightMatch(text: string, query: string): React.ReactNode {
    if (!query.trim()) return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;

    return (
        <>
            {text.slice(0, idx)}
            <span style={{ color: '#5B9CFF', fontWeight: 700 }}>{text.slice(idx, idx + query.length)}</span>
            {text.slice(idx + query.length)}
        </>
    );
}
