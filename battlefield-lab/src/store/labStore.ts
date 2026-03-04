import { create } from 'zustand';
import { Formation } from '@src/types';
import {
  createEngagement,
  effectiveRange,
  moraleToGrade,
} from '../engagement';
import type {
  EngagementState,
  Order,
  Doctrine,
} from '../engagement';
import type { FormationShape } from '@src/components/line/BattlefieldView';
import { FORMATION_SHAPES, toFormationShape } from '@src/core/formations';
import type { ScenarioId } from './scenarios';
import { SCENARIOS } from './scenarios';

// === Types ===

type Triple<T> = [T, T, T];

export type VisualTier = 1 | 2 | 3;

export type LabRank =
  | 'private'
  | 'corporal'
  | 'sergeant'
  | 'sergeant_major'
  | 'sous_lieutenant'
  | 'lieutenant'
  | 'captain';

export interface RankInfo {
  id: LabRank;
  label: string;
  french: string;
  tier: VisualTier;
  agency: string;
}

export interface TierInfo {
  tier: VisualTier;
  label: string;
  description: string;
  ranks: RankInfo[];
}

export type LabMode = 'single' | 'comparison';

export type VolleyStyle = 'streaks' | 'tracers' | 'wave' | 'cascade' | 'spray' | 'bands';

export const VOLLEY_STYLES: { id: VolleyStyle; label: string; description: string }[] = [
  { id: 'streaks',  label: 'Streaks',  description: 'Thin lines from firer to target' },
  { id: 'tracers',  label: 'Tracers',  description: 'Dots that travel from firer to target' },
  { id: 'wave',     label: 'Wave',     description: 'Expanding band sweeps across the gap' },
  { id: 'cascade',  label: 'Cascade',  description: 'Flash origin → flash impact, no connecting element' },
  { id: 'spray',    label: 'Spray',    description: 'Cone of particles fans out from firing edge' },
  { id: 'bands',    label: 'Bands',    description: 'Wide ribbons sweep from firer to target' },
];

export interface VisualParams {
  rowHeight: number;
  colWidth: number;
  smokeOpacity: number;
  animationSpeed: number;
  volleyStyle: VolleyStyle;
}

// === Constants ===

export const ALL_RANKS: RankInfo[] = [
  { id: 'private',          label: 'Private',         french: 'Soldat',           tier: 1, agency: 'No agency — pure auto-play' },
  { id: 'corporal',         label: 'Corporal',        french: 'Caporal',          tier: 1, agency: 'Squad choices — fire & endure' },
  { id: 'sergeant',         label: 'Sergeant',        french: 'Sergent',          tier: 2, agency: 'Fire direction, line dressing' },
  { id: 'sergeant_major',   label: 'Sgt-Major',       french: 'Sergent-major',    tier: 2, agency: 'Senior company NCO — full endure/load' },
  { id: 'sous_lieutenant',  label: 'Sous-lieutenant', french: 'Sous-lieutenant',  tier: 3, agency: 'Platoon command — movement orders' },
  { id: 'lieutenant',       label: 'Lieutenant',      french: 'Lieutenant',       tier: 3, agency: 'Broader tactical control' },
  { id: 'captain',          label: 'Captain',         french: 'Capitaine',        tier: 3, agency: 'Full company command' },
];

export const TIERS: TierInfo[] = [
  {
    tier: 1,
    label: 'In the Ranks',
    description: 'Narrow, claustrophobic — your section of the line and the enemy through smoke.',
    ranks: ALL_RANKS.filter(r => r.tier === 1),
  },
  {
    tier: 2,
    label: 'Behind the Line',
    description: 'Wider view — your formation\'s shape, gaps forming, adjacent units at the edges.',
    ranks: ALL_RANKS.filter(r => r.tier === 2),
  },
  {
    tier: 3,
    label: 'The Field',
    description: 'Full command view — multiple formations, the whole engagement.',
    ranks: ALL_RANKS.filter(r => r.tier === 3),
  },
];

export const ALL_DOCTRINES: Doctrine[] = [
  'steady_advance', 'aggressive_assault', 'holding_action', 'concentrated_strike',
];

export const MORALE_COLORS: Record<string, string> = {
  resolute: '#4ecdc4',
  steady: '#7db856',
  shaken: '#c8a832',
  wavering: '#c85a3a',
  routing: '#aa2222',
};

export const SLOT_LABELS_FR = ['1ST CO.', '2ND CO.', '3RD CO.'];
export const SLOT_LABELS_AT = ['1ST CO.', '2ND CO.', '3RD CO.'];

// === Store Interface ===

export interface LabState {
  // Engagement
  engagement: EngagementState;
  isRunning: boolean;

  // Formations
  frenchFormations: Triple<Formation>;
  austrianFormations: Triple<Formation>;
  playerIndex: 0 | 1 | 2;

  // Rank
  selectedRank: LabRank;

  // Orders (manual mode)
  frenchOrders: Triple<Order>;

  // Mode & visual
  mode: LabMode;
  visualParams: VisualParams;
  activeRenderers: string[];

  // Scenario
  activeScenario: ScenarioId | null;

  // Volley log
  volleyLog: string[];

  // Actions
  setEngagement: (eng: EngagementState) => void;
  updateEngagement: (updater: (eng: EngagementState) => Partial<EngagementState>) => void;
  setIsRunning: (running: boolean) => void;
  setFrenchFormation: (index: number, f: Formation) => void;
  setAustrianFormation: (index: number, f: Formation) => void;
  setPlayerIndex: (index: 0 | 1 | 2) => void;
  setSelectedRank: (rank: LabRank) => void;
  setFrenchOrder: (index: number, order: Order) => void;
  setMode: (mode: LabMode) => void;
  setVisualParams: (params: Partial<VisualParams>) => void;
  setActiveRenderers: (renderers: string[]) => void;
  addVolleyLog: (entry: string) => void;
  clearVolleyLog: () => void;

  // Complex actions
  reset: () => void;
  loadScenario: (id: ScenarioId) => void;
}

// === Helpers ===

export function formationToShape(f: Formation, side: 'french' | 'austrian'): FormationShape {
  const config = FORMATION_SHAPES[f];
  const label = side === 'french'
    ? config.label
    : config.label.replace('FRENCH', 'AUSTRIAN');
  return toFormationShape(config, label);
}

export function getFormationShapes(
  frenchFormations: Triple<Formation>,
  austrianFormations: Triple<Formation>,
): { french: Triple<FormationShape>; austrian: Triple<FormationShape> } {
  return {
    french: frenchFormations.map((f) => formationToShape(f, 'french')) as Triple<FormationShape>,
    austrian: austrianFormations.map((f) => formationToShape(f, 'austrian')) as Triple<FormationShape>,
  };
}

export function getEffectiveRange(engagement: EngagementState, index: number): number {
  return effectiveRange(
    engagement.range,
    engagement.french[index]?.rangeOffset ?? 0,
    engagement.austrian[index]?.rangeOffset ?? 0,
  );
}

// === Store ===

const DEFAULT_VISUAL_PARAMS: VisualParams = {
  rowHeight: 6,
  colWidth: 2,
  smokeOpacity: 1.0,
  animationSpeed: 1.0,
  volleyStyle: 'streaks',
};

export const useLabStore = create<LabState>((set, get) => ({
  // Initial state
  engagement: createEngagement(),
  isRunning: false,
  frenchFormations: [Formation.Line, Formation.Line, Formation.Line],
  austrianFormations: [Formation.Line, Formation.Line, Formation.Line],
  playerIndex: 1,
  selectedRank: 'captain',
  frenchOrders: ['fire', 'fire', 'fire'],
  mode: 'single',
  visualParams: { ...DEFAULT_VISUAL_PARAMS },
  activeRenderers: ['block'],
  activeScenario: null,
  volleyLog: [],

  // Simple setters
  setEngagement: (eng) => set({ engagement: eng }),
  updateEngagement: (updater) => set((state) => ({
    engagement: { ...state.engagement, ...updater(state.engagement) },
  })),
  setIsRunning: (running) => set({ isRunning: running }),
  setFrenchFormation: (index, f) => set((state) => {
    const next = [...state.frenchFormations] as Triple<Formation>;
    next[index] = f;
    return { frenchFormations: next };
  }),
  setAustrianFormation: (index, f) => set((state) => {
    const next = [...state.austrianFormations] as Triple<Formation>;
    next[index] = f;
    return { austrianFormations: next };
  }),
  setPlayerIndex: (index) => set({ playerIndex: index }),
  setSelectedRank: (rank) => set({ selectedRank: rank }),
  setFrenchOrder: (index, order) => set((state) => {
    const next = [...state.frenchOrders] as Triple<Order>;
    next[index] = order;
    return { frenchOrders: next };
  }),
  setMode: (mode) => set({ mode }),
  setVisualParams: (params) => set((state) => ({
    visualParams: { ...state.visualParams, ...params },
  })),
  setActiveRenderers: (renderers) => set({ activeRenderers: renderers }),
  addVolleyLog: (entry) => set((state) => ({
    volleyLog: [...state.volleyLog.slice(-49), entry],
  })),
  clearVolleyLog: () => set({ volleyLog: [] }),

  // Complex actions
  reset: () => {
    const state = get();
    const eng = createEngagement();
    eng.french.forEach((f, i) => { f.formation = state.frenchFormations[i]; });
    eng.austrian.forEach((f, i) => { f.formation = state.austrianFormations[i]; });
    set({
      engagement: eng,
      frenchOrders: ['fire', 'fire', 'fire'],
      isRunning: false,
      volleyLog: [],
      activeScenario: null,
    });
  },

  loadScenario: (id) => {
    const scenario = SCENARIOS[id];
    if (!scenario) return;

    const eng = createEngagement(scenario.range);

    // Apply formations
    scenario.frenchFormations.forEach((f, i) => {
      eng.french[i].formation = f;
    });
    scenario.austrianFormations.forEach((f, i) => {
      eng.austrian[i].formation = f;
    });

    // Apply per-company overrides
    for (let i = 0; i < 3; i++) {
      const frOverride = scenario.french?.[i];
      if (frOverride) {
        if (frOverride.strength !== undefined) eng.french[i].strength = frOverride.strength;
        if (frOverride.morale !== undefined) {
          eng.french[i].morale = frOverride.morale;
          eng.french[i].moraleGrade = moraleToGrade(frOverride.morale);
        }
        if (frOverride.integrity !== undefined) eng.french[i].integrity = frOverride.integrity;
        if (frOverride.quality !== undefined) eng.french[i].quality = frOverride.quality;
      }

      const atOverride = scenario.austrian?.[i];
      if (atOverride) {
        if (atOverride.strength !== undefined) eng.austrian[i].strength = atOverride.strength;
        if (atOverride.morale !== undefined) {
          eng.austrian[i].morale = atOverride.morale;
          eng.austrian[i].moraleGrade = moraleToGrade(atOverride.morale);
        }
        if (atOverride.integrity !== undefined) eng.austrian[i].integrity = atOverride.integrity;
        if (atOverride.quality !== undefined) eng.austrian[i].quality = atOverride.quality;
      }
    }

    if (scenario.doctrine) {
      eng.austrianDoctrine = scenario.doctrine;
    }

    set({
      engagement: eng,
      frenchFormations: [...scenario.frenchFormations] as Triple<Formation>,
      austrianFormations: [...scenario.austrianFormations] as Triple<Formation>,
      frenchOrders: ['fire', 'fire', 'fire'],
      isRunning: false,
      volleyLog: [],
      activeScenario: id,
    });
  },
}));
