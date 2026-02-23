import * as THREE from 'three';

// ─── Layout presets ──────────────────────────────────────────────────────────

export const LAYOUTS = [
    { id: 'force', label: 'Force Directed', dag: null, icon: '◎' },
    { id: 'td', label: 'Top-Down', dag: 'td', icon: '↓' },
    { id: 'lr', label: 'Left → Right', dag: 'lr', icon: '→' },
    { id: 'zout', label: 'Z-Layers', dag: 'zout', icon: '◈' },
    { id: 'radialout', label: 'Radial', dag: 'radialout', icon: '◉' },
] as const;

// ─── Color palette ───────────────────────────────────────────────────────────

export const NODE_COLORS: Record<string, string> = {
    entry: '#5B9CFF',
    logic: '#9F7AEA',
    command: '#CCFF00',
    ui: '#FF6B6B',
    data: '#FFB84C',
    config: '#4ECDC4',
    unknown: '#8892B0',
};

// ─── Constants ───────────────────────────────────────────────────────────────

export const GLOW_INTENSITY = 0.35;
export const IDLE_OPACITY = 0.85;
export const DIM_OPACITY = 0.15;

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function inferNodeType(id: string): string {
    if (id.includes('components/') || id.includes('ui/')) return 'ui';
    if (id.includes('api/') || id.includes('utils/') || id.includes('hooks/') || id.includes('lib/') || id.includes('analyzer/')) return 'logic';
    if (id.endsWith('page.tsx') || id.endsWith('layout.tsx') || id.endsWith('index.ts') || id.endsWith('index.js') || id.endsWith('route.ts')) return 'entry';
    if (id.includes('commands/') || id.includes('cmd/')) return 'command';
    if (id.includes('types') || id.includes('data/') || id.includes('models/') || id.includes('schema')) return 'data';
    if (id.endsWith('.json') || id.endsWith('.config.ts') || id.endsWith('.config.js')) return 'config';
    return 'unknown';
}

export function getNodeColor(type: string): string {
    return NODE_COLORS[type] || NODE_COLORS.unknown;
}

/**
 * Resolve the ID from a link endpoint (handles both string and object forms).
 */
export function resolveLinkId(endpoint: any): string {
    return typeof endpoint === 'string' ? endpoint : endpoint?.id ?? '';
}
