import { Formation } from '../types';
import type { FormationShape } from '../components/line/BattlefieldView';

// Extended shape config with rendering hints
export interface FormationShapeConfig extends FormationShape {
  pattern: 'solid' | 'hollow' | 'scattered';
  gap: number;
  wallThickness: number;
}

// 4 formation presets
export const FORMATION_SHAPES: Record<Formation, FormationShapeConfig> = {
  [Formation.Line]: {
    cols: 120, rows: 3, label: 'FRENCH LINE',
    pattern: 'solid', gap: 0, wallThickness: 0,
  },
  [Formation.Column]: {
    cols: 12, rows: 30, label: 'FRENCH COLUMN',
    pattern: 'solid', gap: 0, wallThickness: 0,
  },
  [Formation.Square]: {
    cols: 20, rows: 18, label: 'FRENCH SQUARE',
    pattern: 'hollow', gap: 0, wallThickness: 3,
  },
  [Formation.Skirmish]: {
    cols: 60, rows: 2, label: 'FRENCH SKIRMISH',
    pattern: 'scattered', gap: 4, wallThickness: 0,
  },
};

// UI display data for picker cards
export interface FormationInfo {
  id: Formation;
  name: string;
  description: string;
  icon: string;
}

export const FORMATION_INFO: FormationInfo[] = [
  {
    id: Formation.Line,
    name: 'Line',
    description: 'Maximum firepower. 3 ranks, shoulder to shoulder.',
    icon: '\u2550',  // ═
  },
  {
    id: Formation.Column,
    name: 'Column',
    description: 'Rapid movement and bayonet shock. Minimal firepower.',
    icon: '\u2551',  // ║
  },
  {
    id: Formation.Square,
    name: 'Square',
    description: 'Anti-cavalry fortress. Immobile, artillery bait.',
    icon: '\u25A1',  // □
  },
  {
    id: Formation.Skirmish,
    name: 'Skirmish',
    description: 'Dispersed pairs. Harass and screen. Helpless vs formed troops.',
    icon: '\u2237',  // ∷
  },
];

/** Look up shape config for a formation */
export function getFormationShape(formation: Formation): FormationShapeConfig {
  return FORMATION_SHAPES[formation];
}

/** True if token at (row, col) is within the hollow wall of a formation */
export function isHollowTokenVisible(
  row: number,
  col: number,
  rows: number,
  cols: number,
  wallThickness: number,
): boolean {
  return (
    row < wallThickness ||
    row >= rows - wallThickness ||
    col < wallThickness ||
    col >= cols - wallThickness
  );
}

/** Deterministic jitter for scattered formation tokens (no Math.random) */
export function getScatteredOffset(row: number, col: number): { dx: number; dy: number } {
  // Simple hash: mix row and col to get a pseudo-random but deterministic offset
  const hash = ((row * 7919 + col * 104729) & 0xFFFF) / 0xFFFF; // 0-1
  const hash2 = ((row * 104729 + col * 7919) & 0xFFFF) / 0xFFFF;
  // Map to -1.5 .. +1.5 range
  const dx = (hash - 0.5) * 3;
  const dy = (hash2 - 0.5) * 3;
  return { dx, dy };
}

/** Convert a FormationShapeConfig to a FormationShape for BattlefieldView */
export function toFormationShape(config: FormationShapeConfig, label?: string): FormationShape {
  return {
    cols: config.cols,
    rows: config.rows,
    label: label ?? config.label,
    pattern: config.pattern,
    gap: config.gap,
    wallThickness: config.wallThickness,
  };
}
