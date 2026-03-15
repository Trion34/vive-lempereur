import React, { useMemo, useRef, useImperativeHandle, forwardRef } from 'react';
import type { BattleState, FormationShape } from '../../types';
import { isHollowTokenVisible, getScatteredOffset } from '../../core/formations';

export type { FormationShape } from '../../types';

export interface NarrativeEntry {
  type: string;
  text: string;
}

export interface BattlefieldViewHandle {
  playVolley: (direction: 'french' | 'austrian') => Promise<void>;
  advanceAustrians: (range: number) => Promise<void>;
  clearSmoke: () => void;
  crossFade: (entries: NarrativeEntry[]) => void;
  appendEntry: (entry: NarrativeEntry) => void;
  scrollToTop: () => void;
  scrollToBottom: () => void;
}

interface BattlefieldViewProps {
  battleState: BattleState;
  formations?: {
    french: FormationShape;
    austrian: FormationShape;
  };
}

// --- SVG and token constants ---
const SVG_W = 800;
const SVG_H = 500;
const TOKEN = 2;   // 2px squares — historical-scale pixel blocks
const GAP = 0;     // no gaps — dense mass look
const STEP = TOKEN + GAP; // 2px per token

// --- Default formations (historical Rivoli) ---
const DEFAULT_FRENCH: FormationShape = { cols: 200, rows: 3, label: '14e DEMI-BRIGADE' };
const DEFAULT_AUSTRIAN: FormationShape = { cols: 40, rows: 80, label: 'AUSTRIAN COL.' };

// --- Layout computation ---
interface Layout {
  frCols: number; frRows: number; frW: number; frH: number; frX: number; frY: number;
  frStep: number;
  frPattern: 'solid' | 'hollow' | 'scattered';
  frWallThickness: number;
  atCols: number; atRows: number; atW: number; atH: number; atX: number;
  atStep: number;
  atPattern: 'solid' | 'hollow' | 'scattered';
  atWallThickness: number;
  atYMin: number; atYMax: number;
  playerCol: number; playerRow: number; pierreCol: number; jbCol: number;
  frLabel: string; atLabel: string;
}

function computeLayout(french: FormationShape, austrian: FormationShape): Layout {
  const frStep = TOKEN + (french.gap ?? 0);
  const frCols = french.cols;
  const frRows = french.rows;
  const frW = frCols * frStep;
  const frH = frRows * frStep;
  const frX = (SVG_W - frW) / 2;
  const frY = SVG_H - frH - 50;

  const atStep = TOKEN + (austrian.gap ?? 0);
  const atCols = austrian.cols;
  const atRows = austrian.rows;
  const atW = atCols * atStep;
  const atH = atRows * atStep;
  const atX = (SVG_W - atW) / 2;

  const atYMin = 0;
  const atYMax = frY - atH - 20;

  return {
    frCols, frRows, frW, frH, frX, frY, frStep,
    frPattern: french.pattern ?? 'solid',
    frWallThickness: french.wallThickness ?? 0,
    atCols, atRows, atW, atH, atX, atStep,
    atPattern: austrian.pattern ?? 'solid',
    atWallThickness: austrian.wallThickness ?? 0,
    atYMin, atYMax,
    playerCol: Math.floor(frCols / 2),
    playerRow: 0,
    pierreCol: Math.floor(frCols / 2) - 1,
    jbCol: Math.floor(frCols / 2) + 1,
    frLabel: french.label,
    atLabel: austrian.label,
  };
}

function rangeToY(range: number, atYMin: number, atYMax: number): number {
  const clamped = Math.max(25, Math.min(200, range));
  const t = (200 - clamped) / 175; // 0 at max range, 1 at min range
  return atYMin + (t * t) * (atYMax - atYMin);
}

// March animation constants
const MARCH_STEPS = 5;
const MARCH_STEP_MS = 160;
const MARCH_WOBBLE = 0.8; // px horizontal wobble per step

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

export const BattlefieldView = forwardRef<BattlefieldViewHandle, BattlefieldViewProps>(
  function BattlefieldView({ battleState, formations }, ref) {
    const fxLayerRef = useRef<SVGGElement>(null);
    const smokeLayerRef = useRef<SVGGElement>(null);
    const smokeLevelRef = useRef(0);
    const austrianGroupRef = useRef<SVGGElement>(null);
    const austrianCurrentYRef = useRef<number | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    // Compute layout from formations (stable unless formations prop changes)
    const L = useMemo(
      () => computeLayout(
        formations?.french ?? DEFAULT_FRENCH,
        formations?.austrian ?? DEFAULT_AUSTRIAN,
      ),
      [formations?.french, formations?.austrian],
    );
    // Keep a ref for imperative methods (always current)
    const layoutRef = useRef(L);
    layoutRef.current = L;

    const { enemy, line } = battleState;
    const range = enemy.range;
    const austrianY = rangeToY(range, L.atYMin, L.atYMax);

    // Initialize imperative Y from first render
    if (austrianCurrentYRef.current === null) {
      austrianCurrentYRef.current = austrianY;
    }

    const frenchTotal = L.frCols * L.frRows;
    const austrianTotal = L.atCols * L.atRows;

    // French: hide tokens from edges inward as integrity drops
    const frenchVisible = Math.max(3, Math.round((line.lineIntegrity / 100) * frenchTotal));

    // Austrian: hide tokens from back rows as strength drops
    const austrianVisible = Math.max(1, Math.round((enemy.strength / 100) * austrianTotal));

    useImperativeHandle(ref, () => ({
      async playVolley(direction: 'french' | 'austrian'): Promise<void> {
        const fxLayer = fxLayerRef.current;
        if (!fxLayer) return;
        const lo = layoutRef.current;

        return new Promise((resolve) => {
          const count = 6 + Math.floor(Math.random() * 5);
          const elements: SVGElement[] = [];
          const currentAustrianY = austrianCurrentYRef.current ?? austrianY;

          if (direction === 'french') {
            // --- Muzzle flashes along French front line ---
            const flashCount = 8 + Math.floor(Math.random() * 5);
            for (let f = 0; f < flashCount; f++) {
              const flash = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
              flash.setAttribute('cx', String(lo.frX + Math.random() * lo.frW));
              flash.setAttribute('cy', String(lo.frY - 1));
              flash.setAttribute('r', '2.5');
              flash.setAttribute('fill', '#f0d060');
              flash.setAttribute('class', 'muzzle-flash');
              flash.style.animationDelay = `${Math.random() * 80}ms`;
              fxLayer.appendChild(flash);
              elements.push(flash);
            }

            // --- Transient smoke flash ---
            const smokeRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            smokeRect.setAttribute('x', String(lo.frX - 20));
            smokeRect.setAttribute('y', String(lo.frY - 5));
            smokeRect.setAttribute('width', String(lo.frW + 40));
            smokeRect.setAttribute('height', '12');
            smokeRect.setAttribute('fill', 'rgba(180,170,140,0.35)');
            smokeRect.setAttribute('class', 'volley-smoke');
            fxLayer.appendChild(smokeRect);
            elements.push(smokeRect);

            // --- Lingering smoke (cumulative) ---
            const smokeLayer = smokeLayerRef.current;
            if (smokeLayer) {
              smokeLevelRef.current = Math.min(6, smokeLevelRef.current + 1);
              const lingering = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
              lingering.setAttribute('x', String(lo.frX - 40));
              lingering.setAttribute('y', String(lo.frY - 15));
              lingering.setAttribute('width', String(lo.frW + 80));
              lingering.setAttribute('height', '50');
              lingering.setAttribute('fill', `rgba(180,170,140,${0.06 * smokeLevelRef.current})`);
              lingering.setAttribute('class', 'lingering-smoke');
              smokeLayer.appendChild(lingering);
            }

            // --- Volley streaks (staggered fire) ---
            for (let i = 0; i < count; i++) {
              const streakLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
              const xStart = lo.frX + Math.random() * lo.frW;
              const xEnd = lo.atX + Math.random() * lo.atW;
              const yStart = lo.frY;
              const yEnd = currentAustrianY + lo.atH;
              streakLine.setAttribute('x1', String(xStart));
              streakLine.setAttribute('y1', String(yStart));
              streakLine.setAttribute('x2', String(xEnd));
              streakLine.setAttribute('y2', String(yEnd));
              streakLine.setAttribute('stroke', '#d4a843');
              streakLine.setAttribute('stroke-width', '1.5');
              streakLine.setAttribute('opacity', '0');
              streakLine.setAttribute('class', 'volley-streak-up');
              streakLine.style.animationDelay = `${i * 60 + Math.random() * 100}ms`;
              fxLayer.appendChild(streakLine);
              elements.push(streakLine);
            }
          } else {
            // --- Austrian muzzle flashes (red-orange, at formation front) ---
            const atFlashCount = 6 + Math.floor(Math.random() * 4);
            for (let f = 0; f < atFlashCount; f++) {
              const flash = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
              flash.setAttribute('cx', String(lo.atX + Math.random() * lo.atW));
              flash.setAttribute('cy', String(currentAustrianY + lo.atH + 1));
              flash.setAttribute('r', '2');
              flash.setAttribute('fill', '#e07040');
              flash.setAttribute('class', 'muzzle-flash');
              flash.style.animationDelay = `${Math.random() * 60}ms`;
              fxLayer.appendChild(flash);
              elements.push(flash);
            }

            // --- Austrian smoke puff at muzzles ---
            const atSmoke = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            atSmoke.setAttribute('x', String(lo.atX - 10));
            atSmoke.setAttribute('y', String(currentAustrianY + lo.atH - 2));
            atSmoke.setAttribute('width', String(lo.atW + 20));
            atSmoke.setAttribute('height', '10');
            atSmoke.setAttribute('fill', 'rgba(160,150,130,0.3)');
            atSmoke.setAttribute('class', 'volley-smoke');
            fxLayer.appendChild(atSmoke);
            elements.push(atSmoke);

            // --- Austrian fire: streaks downward ---
            for (let i = 0; i < count; i++) {
              const streakLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
              const xStart = lo.atX + Math.random() * lo.atW;
              const xEnd = lo.frX - 20 + Math.random() * (lo.frW + 40);
              const yStart = currentAustrianY + lo.atH;
              const yEnd = lo.frY;
              streakLine.setAttribute('x1', String(xStart));
              streakLine.setAttribute('y1', String(yStart));
              streakLine.setAttribute('x2', String(xEnd));
              streakLine.setAttribute('y2', String(yEnd));
              streakLine.setAttribute('stroke', '#c85a3a');
              streakLine.setAttribute('stroke-width', '1.5');
              streakLine.setAttribute('stroke-linecap', 'round');
              streakLine.setAttribute('opacity', '0');
              streakLine.setAttribute('class', 'volley-streak-down');
              streakLine.style.animationDelay = `${i * 30 + Math.random() * 120}ms`;
              fxLayer.appendChild(streakLine);
              elements.push(streakLine);
            }

            // --- Impact sparks along French line ---
            const sparkCount = 6 + Math.floor(Math.random() * 6);
            for (let s = 0; s < sparkCount; s++) {
              const spark = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
              spark.setAttribute('cx', String(lo.frX + Math.random() * lo.frW));
              spark.setAttribute('cy', String(lo.frY + Math.random() * lo.frH));
              spark.setAttribute('r', '2');
              spark.setAttribute('fill', '#ff6633');
              spark.setAttribute('class', 'impact-spark');
              spark.style.animationDelay = `${150 + Math.random() * 150}ms`;
              fxLayer.appendChild(spark);
              elements.push(spark);
            }

            // --- Screen shake ---
            const svg = svgRef.current;
            if (svg) {
              svg.classList.add('battlefield-shake');
              setTimeout(() => svg.classList.remove('battlefield-shake'), 300);
            }

            // --- Flash French tokens briefly ---
            const frenchGroup = fxLayer.ownerSVGElement?.querySelector('.french-tokens-group');
            if (frenchGroup) {
              frenchGroup.classList.add('token-flash-hit');
              setTimeout(() => frenchGroup.classList.remove('token-flash-hit'), 300);
            }
          }

          // Clean up after animation
          setTimeout(() => {
            elements.forEach((el) => el.remove());
            resolve();
          }, 600);
        });
      },

      async advanceAustrians(targetRange: number): Promise<void> {
        const group = austrianGroupRef.current;
        const fxLayer = fxLayerRef.current;
        if (!group) return;
        const lo = layoutRef.current;

        const startY = austrianCurrentYRef.current ?? 0;
        const targetY = rangeToY(targetRange, lo.atYMin, lo.atYMax);
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

            // Spawn dust at formation front (bottom = currentY + atH)
            if (fxLayer && step % 2 === 0) {
              spawnDustParticles(fxLayer, currentY + lo.atH, 3, lo.atX, lo.atW);
            }

            if (step < MARCH_STEPS) {
              setTimeout(marchStep, MARCH_STEP_MS);
            } else {
              // Final position: no wobble
              austrianCurrentYRef.current = targetY;
              group!.style.transform = `translateY(${targetY}px)`;
              resolve();
            }
          }

          marchStep();
        });
      },

      clearSmoke(): void {
        const smokeLayer = smokeLayerRef.current;
        if (!smokeLayer) return;

        // Fade out all smoke children
        const children = Array.from(smokeLayer.children) as SVGElement[];
        for (const child of children) {
          child.style.transition = 'opacity 2s ease-out';
          child.style.opacity = '0';
          setTimeout(() => child.remove(), 2100);
        }
        smokeLevelRef.current = 0;
      },

      // Caption methods are no-ops for now (narrative overlay removed)
      crossFade() {},
      appendEntry() {},
      scrollToTop() {},
      scrollToBottom() {},
    }));

    // --- Render French tokens ---
    const frenchTokens: React.ReactElement[] = [];
    let frIdx = 0;
    for (let row = 0; row < L.frRows; row++) {
      for (let col = 0; col < L.frCols; col++) {
        frIdx++;
        let x = L.frX + col * L.frStep;
        let y = L.frY + row * L.frStep;
        let visible = frIdx <= frenchVisible;
        const isPlayer = row === L.playerRow && col === L.playerCol;
        const isPierre = row === L.playerRow && col === L.pierreCol && line.leftNeighbour?.alive;
        const isJB = row === L.playerRow && col === L.jbCol && line.rightNeighbour?.alive;

        // Pattern-based visibility
        if (L.frPattern === 'hollow' && visible) {
          if (!isHollowTokenVisible(row, col, L.frRows, L.frCols, L.frWallThickness)) {
            visible = false;
          }
        }
        if (L.frPattern === 'scattered') {
          const offset = getScatteredOffset(row, col);
          x += offset.dx;
          y += offset.dy;
        }

        let cls = 'french-token';
        if (isPlayer) cls += ' player-token';
        if (isPierre) cls += ' pierre-token';
        if (isJB) cls += ' jb-token';
        if (!visible) cls += ' token-hidden';

        frenchTokens.push(
          <rect
            key={`fr-${row}-${col}`}
            className={cls}
            x={x}
            y={y}
            width={TOKEN}
            height={TOKEN}
            rx={1}
          />
        );

        // Labels for special tokens (above the front row)
        if (isPlayer && visible) {
          frenchTokens.push(
            <text key="player-label" className="token-label player-label" x={x + TOKEN / 2} y={L.frY - 4} textAnchor="middle">
              YOU
            </text>
          );
        }
        if (isPierre && visible) {
          frenchTokens.push(
            <text key="pierre-label" className="token-label" x={x + TOKEN / 2} y={L.frY - 4} textAnchor="middle">
              P
            </text>
          );
        }
        if (isJB && visible) {
          frenchTokens.push(
            <text key="jb-label" className="token-label" x={x + TOKEN / 2} y={L.frY - 4} textAnchor="middle">
              JB
            </text>
          );
        }
      }
    }

    // --- Render Austrian tokens ---
    // Tokens use local coordinates (0,0 = top-left of formation);
    // the parent <g> handles Y-positioning via transform.
    const austrianTokens: React.ReactElement[] = [];
    let atIdx = 0;
    for (let row = 0; row < L.atRows; row++) {
      for (let col = 0; col < L.atCols; col++) {
        atIdx++;
        let x = L.atX + col * L.atStep;
        let y = row * L.atStep; // local Y within the group
        let visible = atIdx <= austrianVisible;

        // Pattern-based visibility
        if (L.atPattern === 'hollow' && visible) {
          if (!isHollowTokenVisible(row, col, L.atRows, L.atCols, L.atWallThickness)) {
            visible = false;
          }
        }
        if (L.atPattern === 'scattered') {
          const offset = getScatteredOffset(row, col);
          x += offset.dx;
          y += offset.dy;
        }

        austrianTokens.push(
          <rect
            key={`at-${row}-${col}`}
            className={`austrian-token${visible ? '' : ' token-hidden'}`}
            x={x}
            y={y}
            width={TOKEN}
            height={TOKEN}
            rx={1}
          />
        );
      }
    }

    // --- Range label (centered between the two formations) ---
    const gapCenter = (austrianY + L.atH + L.frY) / 2;

    return (
      <div className="battlefield-view" id="battlefield-view">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          preserveAspectRatio="xMidYMid meet"
          className="battlefield-svg"
        >
          <defs>
            <linearGradient id="bf-bg-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0a0908" />
              <stop offset="100%" stopColor="#141210" />
            </linearGradient>
            <filter id="smoke-blur">
              <feGaussianBlur stdDeviation="8" />
            </filter>
          </defs>

          {/* Background */}
          <rect width={SVG_W} height={SVG_H} fill="url(#bf-bg-grad)" />

          {/* Austrian formation — imperative Y via ref, nested sway group for CSS idle */}
          <g
            ref={austrianGroupRef}
            className="austrian-tokens-group"
            data-testid="austrian-group"
            style={{ transform: `translateY(${austrianY}px)` }}
          >
            <g className="austrian-sway-group">
              {austrianTokens}
              <text className="formation-label" x={L.atX + L.atW / 2} y={-6} textAnchor="middle">
                {L.atLabel}
              </text>
            </g>
          </g>

          {/* Smoke layer — between Austrian and French, blurred */}
          <g ref={smokeLayerRef} className="smoke-layer" filter="url(#smoke-blur)" />

          {/* Range label */}
          <text className="range-label" x={SVG_W / 2} y={gapCenter} textAnchor="middle" dominantBaseline="middle">
            {Math.round(range)}
          </text>
          <text className="range-unit" x={SVG_W / 2} y={gapCenter + 14} textAnchor="middle" dominantBaseline="middle">
            PACES
          </text>

          {/* French line */}
          <g className="french-tokens-group" data-testid="french-group">
            {frenchTokens}
            <text className="formation-label" x={L.frX + L.frW / 2} y={L.frY + L.frH + 12} textAnchor="middle">
              {L.frLabel}
            </text>
          </g>

          {/* FX layer for imperative volley animations */}
          <g ref={fxLayerRef} className="fx-layer" />
        </svg>
      </div>
    );
  },
);
