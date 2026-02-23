import * as THREE from 'three';
import { GLOW_INTENSITY, IDLE_OPACITY, DIM_OPACITY } from './graphConstants';

// ─── Text label sprite ───────────────────────────────────────────────────────

export function createTextSprite(text: string, color: string): THREE.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;

    ctx.font = 'bold 28px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.85;
    ctx.fillText(text.length > 24 ? text.slice(0, 22) + '…' : text, 256, 32);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(32, 4, 1);
    return sprite;
}

// ─── Glow halo sprite ────────────────────────────────────────────────────────

export function createGlowSprite(color: string, size: number): THREE.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, color + 'AA');
    gradient.addColorStop(0.3, color + '44');
    gradient.addColorStop(1, color + '00');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });

    const sprite = new THREE.Sprite(material);
    sprite.scale.set(size * 4, size * 4, 1);
    return sprite;
}

// ─── Build a complete node Three.js object ───────────────────────────────────

interface NodeObjectOptions {
    node: any;
    isSelected: boolean;
    isActive: boolean;
    isDimmed: boolean;
}

function createGeometry(type: string, size: number): THREE.BufferGeometry {
    switch (type) {
        case 'entry': return new THREE.OctahedronGeometry(size, 1);
        case 'ui': return new THREE.BoxGeometry(size * 1.4, size * 1.4, size * 1.4);
        case 'logic': return new THREE.IcosahedronGeometry(size, 0);
        case 'command': return new THREE.TetrahedronGeometry(size * 1.2, 0);
        case 'data': return new THREE.CylinderGeometry(size * 0.8, size * 0.8, size * 1.2, 6);
        case 'config': return new THREE.TorusGeometry(size * 0.7, size * 0.25, 8, 16);
        default: return new THREE.SphereGeometry(size, 16, 16);
    }
}

export function buildNodeObject({ node, isSelected, isActive, isDimmed }: NodeObjectOptions): THREE.Group {
    const baseSize = 6 + Math.min(10, (node.loc || 0) / 60);
    const size = isActive ? baseSize * 1.3 : baseSize;
    const color: string = node.color || '#8892B0';
    const opacity = isDimmed ? DIM_OPACITY : IDLE_OPACITY;

    const group = new THREE.Group();

    // ── Text label ───────────────────────────────────────────────────────
    if (!isDimmed) {
        const label = createTextSprite(node.name || '', isActive ? '#ffffff' : (color + 'CC'));
        label.position.set(0, size + 6, 0);
        group.add(label);
    }

    // ── Core geometry ────────────────────────────────────────────────────
    const geometry = createGeometry(node.type, size);

    const coreMaterial = new THREE.MeshPhysicalMaterial({
        color: isSelected ? '#ffffff' : color,
        transparent: true,
        opacity: isSelected ? 1 : opacity,
        roughness: 0.15,
        metalness: 0.6,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        emissive: isSelected ? '#ffffff' : color,
        emissiveIntensity: isActive ? 0.6 : GLOW_INTENSITY,
    });
    group.add(new THREE.Mesh(geometry, coreMaterial));

    // ── Wireframe overlay ────────────────────────────────────────────────
    if (!isDimmed) {
        const wireframeMat = new THREE.MeshBasicMaterial({
            color: isSelected ? '#ffffff' : color,
            wireframe: true,
            transparent: true,
            opacity: isActive ? 0.5 : 0.12,
        });
        const wireframe = new THREE.Mesh(geometry.clone(), wireframeMat);
        wireframe.scale.set(1.08, 1.08, 1.08);
        group.add(wireframe);
    }

    // ── Glow sprite ──────────────────────────────────────────────────────
    if (!isDimmed) {
        const glow = createGlowSprite(color, size);
        glow.material.opacity = isActive ? 0.7 : 0.25;
        group.add(glow);
    }

    // ── Selection ring ───────────────────────────────────────────────────
    if (isSelected) {
        const ringGeo = new THREE.RingGeometry(size * 1.8, size * 2, 32);
        const ringMat = new THREE.MeshBasicMaterial({
            color: '#CCFF00',
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        group.add(ring);
    }

    return group;
}

// ─── Node tooltip HTML ───────────────────────────────────────────────────────

export function buildNodeTooltip(node: any): string {
    return `
        <div style="
            background: var(--dash-surface);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid var(--dash-border);
            padding: 10px 16px;
            border-radius: 12px;
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 11px;
            color: var(--dash-text);
            pointer-events: none;
            max-width: 260px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.25);
        ">
            <div style="font-weight:700; margin-bottom: 4px; color: ${node.color};">${node.name}</div>
            <div style="color: var(--dash-text-muted); font-size: 9px; font-family: monospace;">${node.id}</div>
            ${node.loc ? `<div style="margin-top: 6px; color: var(--dash-text-secondary); font-size: 9px;">${node.loc} LOC</div>` : ''}
        </div>
    `;
}
