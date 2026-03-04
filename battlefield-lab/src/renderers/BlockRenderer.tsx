import React, { useMemo, useRef, useState, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import type { FormationShape } from '@src/components/line/BattlefieldView';
import type { MoraleGrade, Order } from '../engagement';
import type { RendererProps, RendererHandle, EditableParam } from './types';
import { registerRenderer } from './registry';
import { Formation } from '@src/types';
import type { VolleyStyle } from '../store/labStore';

// --- Constants ---
const SVG_W = 1200;
const SVG_H = 600;
const SLOT_W = 360;
const SLOT_MARGIN = 60;

const DEFAULT_ROW_H = 6;
const DEFAULT_COL_W = 2;
const MIN_BLOCK_W = 30;
const MIN_BLOCK_H = 18;
const MAX_BLOCK_H = 120;

const FRENCH_LABELS = ['1ST COMPANY', '2ND COMPANY', '3RD COMPANY'];
const AUSTRIAN_LABELS = ['1ST AUSTRIAN CO.', '2ND AUSTRIAN CO.', '3RD AUSTRIAN CO.'];

const MARCH_STEPS = 5;
const MARCH_STEP_MS = 160;
const MARCH_WOBBLE = 0.8;

// --- Block layout ---
interface BlockLayout {
  cx: number;
  w: number;
  h: number;
  x: number;
  y: number;
  rows: number;
  cols: number;
  pattern: 'solid' | 'hollow' | 'scattered';
  wallThickness: number;
  label: string;
  facingY: number;
  rearY: number;
}

function slotCenterX(index: number): number {
  return SLOT_MARGIN + SLOT_W / 2 + index * SLOT_W;
}

function computeBlockLayout(
  shape: FormationShape,
  slotIndex: number,
  side: 'french' | 'austrian',
  label: string,
  rowH: number = DEFAULT_ROW_H,
  colW: number = DEFAULT_COL_W,
): BlockLayout {
  const pattern = shape.pattern ?? 'solid';
  const rows = shape.rows;
  const cols = shape.cols;

  const w = Math.max(MIN_BLOCK_W, cols * colW + (pattern === 'scattered' ? cols * (shape.gap ?? 0) : 0));
  const h = Math.max(MIN_BLOCK_H, Math.min(MAX_BLOCK_H, rows * rowH));

  const cx = slotCenterX(slotIndex);
  const x = cx - w / 2;

  let y: number, facingY: number, rearY: number;

  if (side === 'french') {
    y = 530 - h;
    facingY = y;
    rearY = y + h;
  } else {
    y = 0;
    facingY = y + h;
    rearY = y;
  }

  return { cx, w, h, x, y, rows, cols, pattern, wallThickness: shape.wallThickness ?? 0, label, facingY, rearY };
}

function rangeToY(range: number, atYMax: number): number {
  const clamped = Math.max(25, Math.min(200, range));
  const t = (200 - clamped) / 175;
  return (t * t) * atYMax;
}

function spawnDustParticles(layer: SVGGElement, baseY: number, count: number, atX: number, atW: number): void {
  for (let i = 0; i < count; i++) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', String(atX + Math.random() * atW));
    circle.setAttribute('cy', String(baseY + Math.random() * 6 - 3));
    circle.setAttribute('r', '1');
    circle.setAttribute('fill', 'rgba(180,170,140,0.4)');
    circle.setAttribute('class', 'dust-particle');
    layer.appendChild(circle);
    setTimeout(() => circle.remove(), 900);
  }
}

function spawnSmokeParticles(
  layer: SVGGElement,
  baseX: number, baseY: number, baseW: number,
  count: number,
  opacityMod: number,
): void {
  for (let i = 0; i < count; i++) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    const cx = baseX + Math.random() * baseW;
    const cy = baseY + (Math.random() * 12 - 6);
    const rx = 8 + Math.random() * 16;
    const ry = 4 + Math.random() * 8;
    const opacity = (0.15 + Math.random() * 0.2) * opacityMod;
    // Dark grey-brown palette for realistic black powder smoke
    const shade = 55 + Math.floor(Math.random() * 35);
    el.setAttribute('cx', String(cx));
    el.setAttribute('cy', String(cy));
    el.setAttribute('rx', String(rx));
    el.setAttribute('ry', String(ry));
    el.setAttribute('fill', `rgba(${shade},${shade - 8},${shade - 15},${opacity})`);
    el.setAttribute('class', 'smoke-particle');
    el.style.animationDelay = `${Math.random() * 300}ms`;
    // Slight random duration for organic feel
    el.style.animationDuration = `${3.5 + Math.random() * 2}s`;
    layer.appendChild(el);
    // Self-remove after animation
    setTimeout(() => el.remove(), 5500);
  }
}

/** Create the connecting projectile FX between firing and receiving formations. */
function createProjectileFX(
  style: VolleyStyle,
  fxLayer: SVGGElement,
  elements: SVGElement[],
  fireX: number, fireY: number, fireW: number,
  targetX: number, targetY: number, targetW: number, targetH: number,
  color: string,
  isUp: boolean,
): void {
  const NS = 'http://www.w3.org/2000/svg';

  // Base delay so projectiles start after muzzle flashes
  const BASE = 150;

  if (style === 'streaks') {
    const count = 5 + Math.floor(Math.random() * 4);
    for (let i = 0; i < count; i++) {
      const line = document.createElementNS(NS, 'line');
      line.setAttribute('x1', String(fireX + Math.random() * fireW));
      line.setAttribute('y1', String(fireY));
      line.setAttribute('x2', String(targetX + Math.random() * targetW));
      line.setAttribute('y2', String(targetY));
      line.setAttribute('stroke', color);
      line.setAttribute('stroke-width', '1.5');
      line.setAttribute('stroke-linecap', 'round');
      line.setAttribute('opacity', '0');
      line.setAttribute('class', isUp ? 'volley-streak-up' : 'volley-streak-down');
      const stagger = isUp
        ? (i < 3 ? Math.random() * 40 : 60 + (i - 3) * 50 + Math.random() * 80)
        : i * 30 + Math.random() * 120;
      line.style.animationDelay = `${BASE + stagger}ms`;
      fxLayer.appendChild(line);
      elements.push(line);
    }
  } else if (style === 'tracers') {
    const count = 6 + Math.floor(Math.random() * 4);
    const travelDist = targetY - fireY;
    for (let i = 0; i < count; i++) {
      const dot = document.createElementNS(NS, 'circle');
      const sx = fireX + Math.random() * fireW;
      const drift = (Math.random() - 0.5) * 30;
      dot.setAttribute('cx', String(sx));
      dot.setAttribute('cy', String(fireY));
      dot.setAttribute('r', '2');
      dot.setAttribute('fill', color);
      dot.setAttribute('class', 'tracer-dot');
      dot.style.setProperty('--travel-y', `${travelDist}px`);
      dot.style.setProperty('--drift-x', `${drift}px`);
      dot.style.animationDelay = `${BASE + i * 40 + Math.random() * 60}ms`;
      fxLayer.appendChild(dot);
      elements.push(dot);
    }
  } else if (style === 'wave') {
    const waveRect = document.createElementNS(NS, 'rect');
    const padding = 15;
    waveRect.setAttribute('x', String(fireX - padding));
    waveRect.setAttribute('y', String(fireY));
    waveRect.setAttribute('width', String(fireW + padding * 2));
    waveRect.setAttribute('height', '8');
    waveRect.setAttribute('rx', '4');
    waveRect.setAttribute('fill', color);
    waveRect.setAttribute('class', 'volley-wave');
    const travelDist = targetY - fireY;
    waveRect.style.setProperty('--travel-y', `${travelDist}px`);
    waveRect.style.animationDelay = `${BASE}ms`;
    fxLayer.appendChild(waveRect);
    elements.push(waveRect);
  } else if (style === 'cascade') {
    // No connecting element — just the firing stripe + impact flash (already added outside this fn)
    // Add extra emphasis: bigger impact sparks after a longer delay
    const sparkCount = 5 + Math.floor(Math.random() * 4);
    for (let s = 0; s < sparkCount; s++) {
      const spark = document.createElementNS(NS, 'circle');
      spark.setAttribute('cx', String(targetX + Math.random() * targetW));
      spark.setAttribute('cy', String(targetY + Math.random() * targetH));
      spark.setAttribute('r', '3');
      spark.setAttribute('fill', color);
      spark.setAttribute('class', 'impact-spark');
      spark.style.animationDelay = `${350 + Math.random() * 200}ms`;
      fxLayer.appendChild(spark);
      elements.push(spark);
    }
  } else if (style === 'spray') {
    const count = 12 + Math.floor(Math.random() * 8);
    const maxDist = Math.abs(targetY - fireY);
    for (let i = 0; i < count; i++) {
      const dot = document.createElementNS(NS, 'circle');
      const sx = fireX + Math.random() * fireW;
      dot.setAttribute('cx', String(sx));
      dot.setAttribute('cy', String(fireY));
      dot.setAttribute('r', String(1 + Math.random() * 1.5));
      dot.setAttribute('fill', color);
      dot.setAttribute('class', 'spray-particle');
      // Fan out: random angle within a cone
      const spread = (Math.random() - 0.5) * fireW * 0.8;
      const dist = (0.4 + Math.random() * 0.6) * maxDist;
      const dy = isUp ? -dist : dist;
      dot.style.setProperty('--spray-x', `${spread}px`);
      dot.style.setProperty('--spray-y', `${dy}px`);
      dot.style.animationDelay = `${BASE + Math.random() * 100}ms`;
      dot.style.animationDuration = `${0.4 + Math.random() * 0.3}s`;
      fxLayer.appendChild(dot);
      elements.push(dot);
    }
  } else if (style === 'bands') {
    const bandCount = 2 + Math.floor(Math.random() * 2);
    const travelDist = targetY - fireY;
    for (let b = 0; b < bandCount; b++) {
      const band = document.createElementNS(NS, 'rect');
      const offset = (Math.random() - 0.5) * fireW * 0.3;
      const bandW = fireW * (0.5 + Math.random() * 0.3);
      band.setAttribute('x', String(fireX + fireW / 2 - bandW / 2 + offset));
      band.setAttribute('y', String(fireY));
      band.setAttribute('width', String(bandW));
      band.setAttribute('height', '14');
      band.setAttribute('rx', '3');
      band.setAttribute('fill', color);
      band.setAttribute('class', 'volley-band');
      band.style.setProperty('--travel-y', `${travelDist}px`);
      band.style.animationDelay = `${BASE + b * 80 + Math.random() * 40}ms`;
      fxLayer.appendChild(band);
      elements.push(band);
    }
  }
}

function getRankLineCount(rows: number, blockH: number): number {
  if (rows <= 1) return 0;
  return Math.min(rows - 1, Math.floor(blockH / 7));
}

const FR = {
  fill: 'rgba(58,90,139,0.2)',
  stroke: 'rgba(58,90,139,0.6)',
  facing: 'rgba(58,90,139,0.9)',
  rank: 'rgba(58,90,139,0.25)',
  flag: 'rgba(58,90,139,0.35)',
  flagStroke: 'rgba(58,90,139,0.5)',
};
const AT = {
  fill: 'rgba(200,185,154,0.15)',
  stroke: 'rgba(200,185,154,0.5)',
  facing: 'rgba(200,185,154,0.85)',
  rank: 'rgba(200,185,154,0.2)',
  flag: 'rgba(200,185,154,0.35)',
  flagStroke: 'rgba(200,185,154,0.5)',
};

const MORALE_FILLS: Record<MoraleGrade, string> = {
  resolute: '#4ecdc4',
  steady: '#7db856',
  shaken: '#c8a832',
  wavering: '#c85a3a',
  routing: '#aa2222',
};

// =============================================
// Block Renderer Component
// =============================================

interface PopupState {
  side: 'french' | 'austrian';
  index: number;
  x: number;
  y: number;
}

interface RangePopupState {
  x: number;
  y: number;
}

const FORMATION_OPTIONS: { id: Formation; icon: string; label: string }[] = [
  { id: Formation.Line, icon: '═', label: 'Line' },
  { id: Formation.Column, icon: '║', label: 'Column' },
  { id: Formation.Square, icon: '□', label: 'Square' },
  { id: Formation.Skirmish, icon: '∷', label: 'Skirmish' },
];

export const BlockRenderer = forwardRef<RendererHandle, RendererProps>(
  function BlockRenderer({ engagement, formations, playerFormationIndex, visualParams, onCompanyUpdate, onRangeUpdate }, ref) {
    const fxLayerRef = useRef<SVGGElement>(null);
    const smokeParticleLayerRef = useRef<SVGGElement>(null);
    const austrianGroupRef = useRef<SVGGElement>(null);
    const austrianCurrentYRef = useRef<number | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const frenchOrderLabelsRef = useRef<SVGElement[]>([]);
    const austrianOrderLabelsRef = useRef<SVGElement[]>([]);
    const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
    const [popup, setPopup] = useState<PopupState | null>(null);
    const [rangePopup, setRangePopup] = useState<RangePopupState | null>(null);

    const closePopup = useCallback(() => setPopup(null), []);
    const closeRangePopup = useCallback(() => setRangePopup(null), []);
    const closeAllPopups = useCallback(() => { setPopup(null); setRangePopup(null); }, []);

    useEffect(() => {
      if (!popup && !rangePopup) return;
      const handleKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') closeAllPopups();
      };
      window.addEventListener('keydown', handleKey);
      return () => window.removeEventListener('keydown', handleKey);
    }, [popup, rangePopup, closeAllPopups]);

    const rowH = visualParams?.rowHeight ?? DEFAULT_ROW_H;
    const colW = visualParams?.colWidth ?? DEFAULT_COL_W;

    const frenchLayouts = useMemo(() =>
      formations.french.map((shape, i) =>
        computeBlockLayout(shape, i, 'french', FRENCH_LABELS[i], rowH, colW)
      ), [formations.french, rowH, colW],
    );

    const austrianLayouts = useMemo(() =>
      formations.austrian.map((shape, i) =>
        computeBlockLayout(shape, i, 'austrian', AUSTRIAN_LABELS[i], rowH, colW)
      ), [formations.austrian, rowH, colW],
    );

    const frenchLayoutsRef = useRef(frenchLayouts);
    frenchLayoutsRef.current = frenchLayouts;
    const austrianLayoutsRef = useRef(austrianLayouts);
    austrianLayoutsRef.current = austrianLayouts;

    // Derive from engagement
    const range = engagement.range;
    const frenchStrength: [number, number, number] = [
      engagement.french[0].strength, engagement.french[1].strength, engagement.french[2].strength,
    ];
    const austrianStrength: [number, number, number] = [
      engagement.austrian[0].strength, engagement.austrian[1].strength, engagement.austrian[2].strength,
    ];
    const frenchMorales = engagement.french.map(f => f.moraleGrade) as [MoraleGrade, MoraleGrade, MoraleGrade];
    const austrianMorales = engagement.austrian.map(f => f.moraleGrade) as [MoraleGrade, MoraleGrade, MoraleGrade];
    const frenchStatuses = engagement.french.map(f => f.status) as [string, string, string];
    const austrianStatuses = engagement.austrian.map(f => f.status) as [string, string, string];
    const frenchQualities = engagement.french.map(f => f.quality) as [number, number, number];
    const austrianQualities = engagement.austrian.map(f => f.quality) as [number, number, number];
    const rangeOffsets = {
      french: engagement.french.map(f => f.rangeOffset) as [number, number, number],
      austrian: engagement.austrian.map(f => f.rangeOffset) as [number, number, number],
    };
    const volleyCount = engagement.volleyCount;

    const maxAustrianH = Math.max(...austrianLayouts.map(l => l.h));
    const minFrenchY = Math.min(...frenchLayouts.map(l => l.y));
    const atYMax = minFrenchY - maxAustrianH - 30;
    const austrianY = rangeToY(range, atYMax);

    if (austrianCurrentYRef.current === null) {
      austrianCurrentYRef.current = austrianY;
    }

    // === Imperative handle ===
    useImperativeHandle(ref, () => ({
      async playVolley(direction: 'french' | 'austrian', index?: number): Promise<void> {
        const fxLayer = fxLayerRef.current;
        if (!fxLayer) return;
        const frLayouts = frenchLayoutsRef.current;
        const atLayouts = austrianLayoutsRef.current;
        const currentAustrianY = austrianCurrentYRef.current ?? austrianY;
        const indices = index !== undefined ? [index] : [0, 1, 2];
        const style = visualParams?.volleyStyle ?? 'streaks';
        const NS = 'http://www.w3.org/2000/svg';

        return new Promise((resolve) => {
          const elements: SVGElement[] = [];

          for (const idx of indices) {
            const fr = frLayouts[idx];
            const at = atLayouts[idx];

            const isFrench = direction === 'french';
            const firerColor = isFrench ? '#f0d060' : '#e07040';
            const impactColor = isFrench ? '#d4a843' : '#c85a3a';
            const sparkColor = isFrench ? '#d4a843' : '#ff6633';

            // Firing edge coordinates
            const fireEdgeX = isFrench ? fr.x : at.x;
            const fireEdgeY = isFrench ? fr.facingY : currentAustrianY + at.h;
            const fireEdgeW = isFrench ? fr.w : at.w;

            // Target coordinates
            const targetEdgeX = isFrench ? at.x : fr.x;
            const targetEdgeY = isFrench ? currentAustrianY + at.h : fr.facingY;
            const targetEdgeW = isFrench ? at.w : fr.w;
            const targetBlockX = isFrench ? at.x : fr.x;
            const targetBlockY = isFrench ? currentAustrianY : fr.y;
            const targetBlockW = isFrench ? at.w : fr.w;
            const targetBlockH = isFrench ? at.h : fr.h;

            // 1. Firing stripe along firing edge (directional)
            const stripe = document.createElementNS(NS, 'rect');
            stripe.setAttribute('x', String(fireEdgeX - 8));
            stripe.setAttribute('y', String(fireEdgeY - 2));
            stripe.setAttribute('width', String(fireEdgeW + 16));
            stripe.setAttribute('height', '4');
            stripe.setAttribute('fill', firerColor);
            stripe.setAttribute('class', isFrench ? 'firing-stripe-up' : 'firing-stripe-down');
            fxLayer.appendChild(stripe);
            elements.push(stripe);

            // 2. Impact flash overlay on target block (subtle)
            const impactFlash = document.createElementNS(NS, 'rect');
            impactFlash.setAttribute('x', String(targetBlockX));
            impactFlash.setAttribute('y', String(targetBlockY));
            impactFlash.setAttribute('width', String(targetBlockW));
            impactFlash.setAttribute('height', String(targetBlockH));
            impactFlash.setAttribute('fill', '#6b1a1a');
            impactFlash.setAttribute('class', 'impact-flash-overlay');
            impactFlash.style.animationDelay = '280ms';
            fxLayer.appendChild(impactFlash);
            elements.push(impactFlash);

            // 3. Muzzle flashes along firing edge
            const flashCount = 6 + Math.floor(Math.random() * 4);
            for (let f = 0; f < flashCount; f++) {
              const flash = document.createElementNS(NS, 'circle');
              flash.setAttribute('cx', String(fireEdgeX + Math.random() * fireEdgeW));
              flash.setAttribute('cy', String(fireEdgeY + (isFrench ? -1 : 1)));
              flash.setAttribute('r', '2.5');
              flash.setAttribute('fill', firerColor);
              flash.setAttribute('class', 'muzzle-flash');
              flash.style.animationDelay = `${Math.random() * 80}ms`;
              fxLayer.appendChild(flash);
              elements.push(flash);
            }

            // 4. Smoke band at firing edge
            const smokeRect = document.createElementNS(NS, 'rect');
            smokeRect.setAttribute('x', String(fireEdgeX - 10));
            smokeRect.setAttribute('y', String(fireEdgeY - 5));
            smokeRect.setAttribute('width', String(fireEdgeW + 20));
            smokeRect.setAttribute('height', '12');
            smokeRect.setAttribute('fill', 'rgba(180,170,140,0.35)');
            smokeRect.setAttribute('class', 'volley-smoke');
            fxLayer.appendChild(smokeRect);
            elements.push(smokeRect);

            // 5. Smoke particles
            const smokeLayer = smokeParticleLayerRef.current;
            if (smokeLayer) {
              const particleCount = 8 + Math.floor(Math.random() * 5);
              spawnSmokeParticles(smokeLayer, fireEdgeX - 10, fireEdgeY, fireEdgeW + 20, particleCount, visualParams?.smokeOpacity ?? 1.0);
            }

            // 6. Style-specific projectile FX
            createProjectileFX(
              style, fxLayer, elements,
              fireEdgeX, fireEdgeY, fireEdgeW,
              targetEdgeX, targetEdgeY, targetEdgeW, targetBlockH,
              impactColor, isFrench,
            );

            // 7. Impact sparks on target (skip for cascade — it adds its own bigger ones)
            if (style !== 'cascade') {
              const sparkCount = 3 + Math.floor(Math.random() * 4);
              for (let s = 0; s < sparkCount; s++) {
                const spark = document.createElementNS(NS, 'circle');
                spark.setAttribute('cx', String(targetBlockX + Math.random() * targetBlockW));
                spark.setAttribute('cy', String(targetBlockY + Math.random() * targetBlockH));
                spark.setAttribute('r', '2');
                spark.setAttribute('fill', sparkColor);
                spark.setAttribute('class', 'impact-spark');
                spark.style.animationDelay = `${300 + Math.random() * 150}ms`;
                fxLayer.appendChild(spark);
                elements.push(spark);
              }
            }
          }

          // Screen shake on every volley
          const svg = svgRef.current;
          if (svg) {
            svg.classList.add('battlefield-shake');
            setTimeout(() => svg.classList.remove('battlefield-shake'), 300);
          }

          setTimeout(() => {
            elements.forEach(el => el.remove());
            resolve();
          }, 1000);
        });
      },

      async playCharge(side: 'french' | 'austrian', index: number): Promise<void> {
        const fxLayer = fxLayerRef.current;
        const svg = svgRef.current;
        if (!fxLayer || !svg) return;
        const frLayouts = frenchLayoutsRef.current;
        const atLayouts = austrianLayoutsRef.current;
        const currentAustrianY = austrianCurrentYRef.current ?? austrianY;
        const NS = 'http://www.w3.org/2000/svg';

        const isFrench = side === 'french';
        const chargerLayout = isFrench ? frLayouts[index] : atLayouts[index];
        const defenderLayout = isFrench ? atLayouts[index] : frLayouts[index];

        // Charger and defender edge positions
        const chargerEdgeY = isFrench ? chargerLayout.facingY : currentAustrianY + chargerLayout.h;
        const defenderEdgeY = isFrench ? currentAustrianY + defenderLayout.h : defenderLayout.facingY;
        const contactY = (chargerEdgeY + defenderEdgeY) / 2;

        return new Promise((resolve) => {
          const elements: SVGElement[] = [];

          // 1. Impact flash at contact point
          const flashRect = document.createElementNS(NS, 'rect');
          flashRect.setAttribute('x', String(chargerLayout.cx - chargerLayout.w / 2 - 15));
          flashRect.setAttribute('y', String(contactY - 8));
          flashRect.setAttribute('width', String(chargerLayout.w + 30));
          flashRect.setAttribute('height', '16');
          flashRect.setAttribute('fill', '#f0d060');
          flashRect.setAttribute('class', 'impact-flash-overlay');
          fxLayer.appendChild(flashRect);
          elements.push(flashRect);

          // 2. Clash sparks at contact
          const sparkCount = 12 + Math.floor(Math.random() * 8);
          for (let s = 0; s < sparkCount; s++) {
            const spark = document.createElementNS(NS, 'circle');
            spark.setAttribute('cx', String(chargerLayout.cx - chargerLayout.w / 2 + Math.random() * chargerLayout.w));
            spark.setAttribute('cy', String(contactY + (Math.random() * 20 - 10)));
            spark.setAttribute('r', String(1.5 + Math.random() * 2));
            spark.setAttribute('fill', Math.random() > 0.5 ? '#f0d060' : '#ff6633');
            spark.setAttribute('class', 'impact-spark');
            spark.style.animationDelay = `${Math.random() * 200}ms`;
            fxLayer.appendChild(spark);
            elements.push(spark);
          }

          // 3. Bayonet streaks (short aggressive lines)
          const streakCount = 6 + Math.floor(Math.random() * 4);
          for (let s = 0; s < streakCount; s++) {
            const line = document.createElementNS(NS, 'line');
            const sx = chargerLayout.cx - chargerLayout.w / 2 + Math.random() * chargerLayout.w;
            const dir = isFrench ? -1 : 1;
            line.setAttribute('x1', String(sx));
            line.setAttribute('y1', String(contactY + dir * 5));
            line.setAttribute('x2', String(sx + (Math.random() - 0.5) * 10));
            line.setAttribute('y2', String(contactY - dir * (10 + Math.random() * 15)));
            line.setAttribute('stroke', '#d4a843');
            line.setAttribute('stroke-width', '1.5');
            line.setAttribute('stroke-linecap', 'round');
            line.setAttribute('class', isFrench ? 'volley-streak-up' : 'volley-streak-down');
            line.style.animationDelay = `${50 + Math.random() * 150}ms`;
            fxLayer.appendChild(line);
            elements.push(line);
          }

          // 4. Heavy screen shake
          svg.classList.add('battlefield-shake');
          setTimeout(() => svg.classList.remove('battlefield-shake'), 500);

          setTimeout(() => {
            elements.forEach(el => el.remove());
            resolve();
          }, 1200);
        });
      },

      async advanceAustrians(targetRange: number): Promise<void> {
        const group = austrianGroupRef.current;
        const fxLayer = fxLayerRef.current;
        if (!group) return;
        const atLayouts = austrianLayoutsRef.current;

        const startY = austrianCurrentYRef.current ?? 0;
        const targetY = rangeToY(targetRange, atYMax);
        const deltaY = targetY - startY;

        if (Math.abs(deltaY) < 0.5) {
          austrianCurrentYRef.current = targetY;
          return;
        }

        return new Promise((resolve) => {
          let step = 0;
          function marchStep() {
            step++;
            const progress = step / MARCH_STEPS;
            const currentY = startY + deltaY * progress;
            const wobble = (step % 2 === 0 ? 1 : -1) * MARCH_WOBBLE * (1 - progress);
            austrianCurrentYRef.current = currentY;
            group!.style.transform = `translateY(${currentY}px) translateX(${wobble}px)`;
            if (fxLayer && step % 2 === 0) {
              for (const at of atLayouts) {
                spawnDustParticles(fxLayer, currentY + at.h, 2, at.x, at.w);
              }
            }
            if (step < MARCH_STEPS) {
              setTimeout(marchStep, MARCH_STEP_MS);
            } else {
              austrianCurrentYRef.current = targetY;
              group!.style.transform = `translateY(${targetY}px)`;
              resolve();
            }
          }
          marchStep();
        });
      },

      showOrderLabels(side: 'french' | 'austrian', orders: [Order, Order, Order]): void {
        const fxLayer = fxLayerRef.current;
        if (!fxLayer) return;
        const labelsRef = side === 'french' ? frenchOrderLabelsRef : austrianOrderLabelsRef;
        // Clear any existing labels for this side
        for (const el of labelsRef.current) el?.remove();
        labelsRef.current = [];

        const layouts = side === 'french' ? frenchLayoutsRef.current : austrianLayoutsRef.current;
        const currentAustY = austrianCurrentYRef.current ?? austrianY;

        const frenchLabelMap: Record<Order, (slot: number) => string> = {
          fire: () => 'FIRE',
          hold_fire: () => 'HOLD',
          crossfire: (slot) => slot === 0 ? 'CROSSFIRE \u2192' : slot === 2 ? '\u2190 CROSSFIRE' : 'CROSSFIRE',
          advance: () => '\u2191 ADVANCE',
          charge: () => '\u2694 CHARGE!',
          fall_back: () => '\u2193 FALL BACK',
        };
        const austrianLabelMap: Record<Order, (slot: number) => string> = {
          fire: () => 'FIRE',
          hold_fire: () => 'HOLD',
          crossfire: (slot) => slot === 0 ? '\u2190 CROSSFIRE' : slot === 2 ? 'CROSSFIRE \u2192' : 'CROSSFIRE',
          advance: () => '\u2193 ADVANCE',
          charge: () => '\u2694 CHARGE!',
          fall_back: () => '\u2191 FALL BACK',
        };
        const labelMap = side === 'french' ? frenchLabelMap : austrianLabelMap;

        for (let i = 0; i < 3; i++) {
          const order = orders[i];
          const layout = layouts[i];
          const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          text.setAttribute('x', String(layout.cx));
          // French: above the formation block; Austrian: below the block (into the gap)
          const labelY = side === 'french'
            ? layout.y - 22
            : currentAustY + layout.h + 22;
          text.setAttribute('y', String(labelY));
          text.setAttribute('class', `order-label order-label-${order}`);
          text.textContent = labelMap[order](i);
          fxLayer.appendChild(text);
          labelsRef.current.push(text);
        }
      },

      hideOrderLabels(side?: 'french' | 'austrian'): void {
        const refs = side === 'french' ? [frenchOrderLabelsRef]
          : side === 'austrian' ? [austrianOrderLabelsRef]
          : [frenchOrderLabelsRef, austrianOrderLabelsRef];

        for (const labelsRef of refs) {
          const labels = labelsRef.current;
          if (labels.length === 0) continue;
          for (const el of labels) {
            el?.classList.add('order-label-exiting');
          }
          const captured = [...labels];
          labelsRef.current = [];
          setTimeout(() => {
            for (const el of captured) el?.remove();
          }, 400);
        }
      },

      hideOrderLabel(side: 'french' | 'austrian', index: number): void {
        const labelsRef = side === 'french' ? frenchOrderLabelsRef : austrianOrderLabelsRef;
        const el = labelsRef.current[index];
        if (!el) return;
        el.classList.add('order-label-exiting');
        // Null out the slot so hideOrderLabels won't double-process it
        labelsRef.current[index] = null as unknown as SVGElement;
        setTimeout(() => el.remove(), 400);
      },

      clearSmoke(): void {
        const layer = smokeParticleLayerRef.current;
        if (!layer) return;
        const children = Array.from(layer.children) as SVGElement[];
        for (const child of children) {
          child.classList.add('smoke-particle-clearing');
          setTimeout(() => child.remove(), 800);
        }
      },
    }));

    // === Rendering helpers ===

    function renderCompanyBlock(layout: BlockLayout, side: 'french' | 'austrian', slotIndex: number, strengthPct: number): React.ReactElement {
      const pal = side === 'french' ? FR : AT;
      const isPlayerSlot = side === 'french' && slotIndex === playerFormationIndex;
      const { x, y, w, h, pattern, wallThickness, rows } = layout;
      const strengthOpacity = 0.3 + 0.7 * (strengthPct / 100);

      const rankLineCount = getRankLineCount(rows, h);
      const rankLines: React.ReactElement[] = [];
      if (pattern !== 'scattered') {
        for (let i = 1; i <= rankLineCount; i++) {
          const ly = y + (i / (rankLineCount + 1)) * h;
          rankLines.push(
            <line key={`rank-${side}-${slotIndex}-${i}`} x1={x + 1} y1={ly} x2={x + w - 1} y2={ly} stroke={pal.rank} strokeWidth={0.5} />
          );
        }
      }

      if (pattern === 'hollow') {
        const wallPx = Math.max(3, wallThickness * (h / rows));
        return (
          <g key={`block-${side}-${slotIndex}`} opacity={strengthOpacity}>
            <rect x={x} y={y} width={w} height={h} fill={pal.fill} stroke={pal.stroke} strokeWidth={1} />
            <rect x={x + wallPx} y={y + wallPx} width={w - wallPx * 2} height={h - wallPx * 2} fill="#0a0908" />
            {rankLines}
            <rect x={x} y={y} width={w} height={h} fill="none" stroke={pal.facing} strokeWidth={2.5} />
            {renderFlag(layout, side, pal)}
            {isPlayerSlot && renderPlayerMarker(layout, side)}
          </g>
        );
      }

      if (pattern === 'scattered') {
        const dots: React.ReactElement[] = [];
        const dotCount = Math.min(40, rows * Math.floor(w / 8));
        for (let i = 0; i < dotCount; i++) {
          const hash1 = ((i * 7919 + slotIndex * 104729) & 0xFFFF) / 0xFFFF;
          const hash2 = ((i * 104729 + slotIndex * 7919) & 0xFFFF) / 0xFFFF;
          dots.push(<circle key={`dot-${side}-${slotIndex}-${i}`} cx={x + 4 + hash1 * (w - 8)} cy={y + 3 + hash2 * (h - 6)} r={1} fill={pal.stroke} />);
        }
        return (
          <g key={`block-${side}-${slotIndex}`} opacity={strengthOpacity}>
            <rect x={x} y={y} width={w} height={h} fill="none" stroke={pal.stroke} strokeWidth={1} strokeDasharray="4,3" />
            {dots}
            {side === 'french'
              ? <line x1={x} y1={y} x2={x + w} y2={y} stroke={pal.facing} strokeWidth={1.5} strokeDasharray="2,4" />
              : <line x1={x} y1={y + h} x2={x + w} y2={y + h} stroke={pal.facing} strokeWidth={1.5} strokeDasharray="2,4" />}
            {isPlayerSlot && renderPlayerMarker(layout, side)}
          </g>
        );
      }

      return (
        <g key={`block-${side}-${slotIndex}`} opacity={strengthOpacity}>
          <rect x={x} y={y} width={w} height={h} fill={pal.fill} stroke={pal.stroke} strokeWidth={1} />
          {rankLines}
          {side === 'french'
            ? <line x1={x} y1={y} x2={x + w} y2={y} stroke={pal.facing} strokeWidth={2.5} />
            : <line x1={x} y1={y + h} x2={x + w} y2={y + h} stroke={pal.facing} strokeWidth={2.5} />}
          {renderFlag(layout, side, pal)}
          {isPlayerSlot && renderPlayerMarker(layout, side)}
        </g>
      );
    }

    function renderFlag(layout: BlockLayout, side: 'french' | 'austrian', pal: typeof FR): React.ReactElement {
      const { cx } = layout;
      if (side === 'french') {
        const flagY = layout.y + layout.h;
        return (
          <g>
            <line x1={cx} y1={flagY} x2={cx} y2={flagY + 10} stroke={pal.flagStroke} strokeWidth={0.8} />
            <rect x={cx - 4} y={flagY + 7} width={8} height={5} fill={pal.flag} stroke={pal.flagStroke} strokeWidth={0.5} />
          </g>
        );
      }
      return (
        <g>
          <line x1={cx} y1={layout.y} x2={cx} y2={layout.y - 10} stroke={pal.flagStroke} strokeWidth={0.8} />
          <rect x={cx} y={layout.y - 12} width={8} height={5} fill={pal.flag} stroke={pal.flagStroke} strokeWidth={0.5} />
        </g>
      );
    }

    function renderPlayerMarker(layout: BlockLayout, side: 'french' | 'austrian'): React.ReactElement {
      const { cx } = layout;
      const markerY = side === 'french' ? layout.y : layout.y + layout.h;
      const labelY = side === 'french' ? markerY - 8 : markerY + 12;
      return (
        <g>
          <circle cx={cx} cy={markerY} r={3} fill="none" stroke="#d4af37" strokeWidth={1} />
          <circle cx={cx} cy={markerY} r={1} fill="#d4af37" />
          <text x={cx} y={labelY} textAnchor="middle" className="token-label player-label">YOU</text>
        </g>
      );
    }

    function renderCompanyMeter(layout: BlockLayout, side: 'french' | 'austrian', slotIndex: number, strength: number, morale: MoraleGrade): React.ReactElement {
      const BAR_W = 80;
      const BAR_H = 5;
      const barX = layout.cx - BAR_W / 2;
      const meterY = side === 'french' ? layout.y + layout.h + 40 : layout.y - 36;
      const fillW = (strength / 100) * BAR_W;
      const moraleColor = MORALE_FILLS[morale];
      const barColor = side === 'french'
        ? `rgba(58,90,139,${0.4 + 0.5 * (strength / 100)})`
        : `rgba(200,185,154,${0.3 + 0.5 * (strength / 100)})`;

      return (
        <g key={`meter-${side}-${slotIndex}`} className="company-meter">
          <rect x={barX} y={meterY} width={BAR_W} height={BAR_H} rx={1} fill="rgba(255,255,255,0.06)" />
          <rect x={barX} y={meterY} width={fillW} height={BAR_H} rx={1} fill={strength > 30 ? barColor : moraleColor} />
          <text x={barX - 4} y={meterY + BAR_H / 2 + 1} textAnchor="end" dominantBaseline="middle" className="meter-pct">{Math.round(strength)}%</text>
          <text x={barX + BAR_W + 4} y={meterY + BAR_H / 2 + 1} textAnchor="start" dominantBaseline="middle" className="meter-morale" fill={moraleColor}>{morale.toUpperCase()}</text>
        </g>
      );
    }

    function renderQualityChevrons(layout: BlockLayout, side: 'french' | 'austrian', slotIndex: number, quality: number): React.ReactElement | null {
      // Tiered chevrons: 1-3 bronze, 4-6 silver, 7-9 gold. Max 3 chevrons visible.
      const count = ((quality - 1) % 3) + 1;
      const color = quality >= 7 ? '#d4af37' : quality >= 4 ? '#b0b0b0' : '#cd7f32';
      const tierLabel = quality >= 7 ? 'Gold' : quality >= 4 ? 'Silver' : 'Bronze';
      const tooltipText = `Quality ${quality} (${tierLabel})`;

      // Chevrons in a horizontal row, centered under/over the company label
      const chevronW = 9, chevronH = 6, gap = 3;
      const totalW = count * chevronW + (count - 1) * gap;
      const cx = layout.cx;

      // French: below company label (label is at y+h+28). Austrian: above company label (label is at y-18).
      const chevronY = side === 'french'
        ? layout.y + layout.h + 38
        : layout.y - 38;

      const chevrons: React.ReactElement[] = [];
      for (let i = 0; i < count; i++) {
        const px = cx - totalW / 2 + i * (chevronW + gap) + chevronW / 2;
        const d = `M${px - chevronW / 2},${chevronY + chevronH} L${px},${chevronY} L${px + chevronW / 2},${chevronY + chevronH}`;
        chevrons.push(
          <path key={`chev-${side}-${slotIndex}-${i}`} d={d} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        );
      }

      // Invisible hit rect for mouse events
      const hitX = cx - totalW / 2 - 10;
      const hitY = chevronY - 6;
      const hitW = totalW + 20;
      const hitH = chevronH + 12;

      return (
        <g
          className="quality-badge"
          style={{ cursor: 'help' }}
          onMouseEnter={(e) => setTooltip({ text: tooltipText, x: e.clientX, y: e.clientY })}
          onMouseMove={(e) => setTooltip({ text: tooltipText, x: e.clientX, y: e.clientY })}
          onMouseLeave={() => setTooltip(null)}
        >
          <rect x={hitX} y={hitY} width={hitW} height={hitH} fill="#000" fillOpacity={0} />
          {chevrons}
        </g>
      );
    }

    const handleCompanyClick = useCallback((side: 'french' | 'austrian', index: number, e: React.MouseEvent) => {
      e.stopPropagation();
      setRangePopup(null);
      setPopup({ side, index, x: e.clientX, y: e.clientY });
    }, []);

    const handleRangeClick = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
      setPopup(null);
      setRangePopup({ x: e.clientX, y: e.clientY });
    }, []);

    const showMeters = volleyCount > 0;
    const gapCenter = (austrianY + Math.max(...austrianLayouts.map(l => l.h)) + minFrenchY) / 2;

    return (
      <div className="battlefield-view" id="multi-battlefield-view">
        <svg ref={svgRef} viewBox={`0 0 ${SVG_W} ${SVG_H}`} preserveAspectRatio="xMidYMid meet" className="battlefield-svg">
          <defs>
            <linearGradient id="bf-bg-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0a0908" />
              <stop offset="100%" stopColor="#141210" />
            </linearGradient>
          </defs>

          <rect width={SVG_W} height={SVG_H} fill="url(#bf-bg-grad)" onClick={closeAllPopups} />

          {/* Austrian formations */}
          <g ref={austrianGroupRef} className="austrian-tokens-group" data-testid="austrian-group" style={{ transform: `translateY(${austrianY}px)` }}>
            <g className="austrian-sway-group">
              {austrianLayouts.map((layout, i) => {
                const isRouted = austrianStatuses[i] === 'routing' || austrianStatuses[i] === 'destroyed';
                const atVisualOffset = rangeOffsets.austrian[i] * -0.3;
                return (
                  <g key={`at-group-${i}`} opacity={isRouted ? 0.15 : 1} transform={atVisualOffset ? `translate(0,${atVisualOffset})` : undefined} style={{ cursor: onCompanyUpdate ? 'pointer' : undefined }} onClick={onCompanyUpdate ? (e) => handleCompanyClick('austrian', i, e) : undefined}>
                    {renderCompanyBlock(layout, 'austrian', i, austrianStrength[i])}
                    <text className="company-label" x={layout.cx} y={layout.y - 18} textAnchor="middle" style={{ fontFamily: "'Georgia',serif", fontStyle: 'italic' }}>{layout.label}</text>
                    {isRouted && <text className="lab-routed-label" x={layout.cx} y={layout.y + layout.h / 2} textAnchor="middle" dominantBaseline="middle">ROUTED</text>}
                    {showMeters && renderCompanyMeter(layout, 'austrian', i, austrianStrength[i], austrianMorales[i])}
                    {renderQualityChevrons(layout, 'austrian', i, austrianQualities[i])}
                  </g>
                );
              })}
            </g>
          </g>

          <g ref={smokeParticleLayerRef} className="smoke-particle-layer" />

          <text className={`range-label${onRangeUpdate ? ' range-clickable' : ''}`} x={SVG_W / 2} y={gapCenter} textAnchor="middle" dominantBaseline="middle" style={{ fontFamily: "'Georgia',serif", fontStyle: 'italic', cursor: onRangeUpdate ? 'pointer' : undefined }} onClick={onRangeUpdate ? handleRangeClick : undefined}>{Math.round(range)}</text>
          <text className={`range-unit${onRangeUpdate ? ' range-clickable' : ''}`} x={SVG_W / 2} y={gapCenter + 20} textAnchor="middle" dominantBaseline="middle" style={{ fontFamily: "'Georgia',serif", fontStyle: 'italic', cursor: onRangeUpdate ? 'pointer' : undefined }} onClick={onRangeUpdate ? handleRangeClick : undefined}>PACES</text>

          {/* French formations */}
          {frenchLayouts.map((layout, i) => {
            const isRouted = frenchStatuses[i] === 'routing' || frenchStatuses[i] === 'destroyed';
            const frVisualOffset = rangeOffsets.french[i] * 0.3;
            return (
              <g key={`fr-group-${i}`} className={`french-tokens-group${i === playerFormationIndex ? ' player-formation' : ''}`} data-testid={`french-group-${i}`} opacity={isRouted ? 0.15 : 1} transform={frVisualOffset ? `translate(0,${frVisualOffset})` : undefined} style={{ cursor: onCompanyUpdate ? 'pointer' : undefined }} onClick={onCompanyUpdate ? (e) => handleCompanyClick('french', i, e) : undefined}>
                {renderCompanyBlock(layout, 'french', i, frenchStrength[i])}
                <text className="company-label" x={layout.cx} y={layout.y + layout.h + 28} textAnchor="middle" style={{ fontFamily: "'Georgia',serif", fontStyle: 'italic' }}>{layout.label}</text>
                {isRouted && <text className="lab-routed-label" x={layout.cx} y={layout.y + layout.h / 2} textAnchor="middle" dominantBaseline="middle">ROUTED</text>}
                {showMeters && renderCompanyMeter(layout, 'french', i, frenchStrength[i], frenchMorales[i])}
                {renderQualityChevrons(layout, 'french', i, frenchQualities[i])}
              </g>
            );
          })}

          <g ref={fxLayerRef} className="fx-layer" />
        </svg>
        {tooltip && (
          <div className="quality-tooltip" style={{ left: tooltip.x + 12, top: tooltip.y - 8 }}>
            {tooltip.text}
          </div>
        )}
        {popup && onCompanyUpdate && (() => {
          const co = engagement[popup.side][popup.index];
          const label = popup.side === 'french' ? FRENCH_LABELS[popup.index] : AUSTRIAN_LABELS[popup.index];
          return (
            <div className="company-popup" style={{ left: popup.x + 16, top: popup.y - 40 }}>
              <div className="company-popup-header">
                <span>{label}</span>
                <button className="company-popup-close" onClick={closePopup}>&times;</button>
              </div>
              <div className="company-popup-row">
                <span className="company-popup-label">Formation</span>
                <div className="company-popup-formations">
                  {FORMATION_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      className={`company-popup-fm-btn${co.formation === opt.id ? ' active' : ''}`}
                      title={opt.label}
                      onClick={() => onCompanyUpdate(popup.side, popup.index, 'formation', Object.values(Formation).indexOf(opt.id))}
                    >
                      {opt.icon}
                    </button>
                  ))}
                </div>
              </div>
              <div className="company-popup-row">
                <span className="company-popup-label">Quality</span>
                <input
                  type="range"
                  min={1}
                  max={9}
                  value={co.quality}
                  className="company-popup-slider"
                  onChange={(e) => onCompanyUpdate(popup.side, popup.index, 'quality', Number(e.target.value))}
                />
                <span className="company-popup-qval" style={{ color: co.quality >= 7 ? '#d4af37' : co.quality >= 4 ? '#b0b0b0' : '#cd7f32' }}>{co.quality}</span>
              </div>
              <div className="company-popup-row">
                <span className="company-popup-label">Strength</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={co.strength}
                  className="company-popup-slider"
                  onChange={(e) => onCompanyUpdate(popup.side, popup.index, 'strength', Number(e.target.value))}
                />
                <span className="company-popup-qval">{Math.round(co.strength)}</span>
              </div>
              <div className="company-popup-row">
                <span className="company-popup-label">Morale</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={co.morale}
                  className="company-popup-slider"
                  onChange={(e) => onCompanyUpdate(popup.side, popup.index, 'morale', Number(e.target.value))}
                />
                <span className="company-popup-qval">{Math.round(co.morale)}</span>
              </div>
              <div className="company-popup-row">
                <span className="company-popup-label">Integrity</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={co.integrity}
                  className="company-popup-slider"
                  onChange={(e) => onCompanyUpdate(popup.side, popup.index, 'integrity', Number(e.target.value))}
                />
                <span className="company-popup-qval">{Math.round(co.integrity)}</span>
              </div>
            </div>
          );
        })()}
        {rangePopup && onRangeUpdate && (
          <div className="range-popup" style={{ left: rangePopup.x + 16, top: rangePopup.y - 40 }}>
            <div className="company-popup-header">
              <span>RANGE</span>
              <button className="company-popup-close" onClick={closeRangePopup}>&times;</button>
            </div>
            <div className="company-popup-row">
              <input
                type="range"
                min={25}
                max={200}
                step={5}
                value={range}
                className="company-popup-slider"
                onChange={(e) => onRangeUpdate(Number(e.target.value))}
              />
              <span className="company-popup-qval">{Math.round(range)}</span>
            </div>
          </div>
        )}
      </div>
    );
  },
);

// === Editable params ===
export const BLOCK_RENDERER_PARAMS: EditableParam[] = [
  { key: 'rowHeight', label: 'Row Height', min: 2, max: 12, step: 1, defaultValue: 6 },
  { key: 'colWidth', label: 'Col Width', min: 1, max: 6, step: 0.5, defaultValue: 2 },
  { key: 'smokeOpacity', label: 'Smoke Opacity', min: 0, max: 2, step: 0.1, defaultValue: 1.0 },
];

// === Self-register ===
registerRenderer({
  id: 'block',
  label: 'Block Renderer',
  description: 'Formation blocks with rank lines, flags, and company meters.',
  tiers: [],
  Component: BlockRenderer,
  editableParams: BLOCK_RENDERER_PARAMS,
});
