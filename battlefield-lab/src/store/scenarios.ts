import { Formation } from '@src/types';
import type { Doctrine } from '../engagement';

export interface CompanyOverride {
  strength?: number;
  morale?: number;
  integrity?: number;
  quality?: number;
}

export interface Scenario {
  id: ScenarioId;
  label: string;
  description: string;
  range: number;
  frenchFormations: [Formation, Formation, Formation];
  austrianFormations: [Formation, Formation, Formation];
  french?: [CompanyOverride?, CompanyOverride?, CompanyOverride?];
  austrian?: [CompanyOverride?, CompanyOverride?, CompanyOverride?];
  doctrine?: Doctrine;
}

export type ScenarioId =
  | 'opening_volley'
  | 'close_range'
  | 'column_assault'
  | 'french_column_assault'
  | 'routing_cascade'
  | 'mixed_formations'
  | 'quality_mismatch';

export const SCENARIOS: Record<ScenarioId, Scenario> = {
  opening_volley: {
    id: 'opening_volley',
    label: 'Opening Volley',
    description: 'Both sides at 200 paces, full strength. Classic opening engagement.',
    range: 200,
    frenchFormations: [Formation.Line, Formation.Line, Formation.Line],
    austrianFormations: [Formation.Line, Formation.Line, Formation.Line],
  },

  close_range: {
    id: 'close_range',
    label: 'Close Range',
    description: 'Deadly 40-pace firefight. Casualties will be severe.',
    range: 40,
    frenchFormations: [Formation.Line, Formation.Line, Formation.Line],
    austrianFormations: [Formation.Line, Formation.Line, Formation.Line],
  },

  column_assault: {
    id: 'column_assault',
    label: 'Column Assault',
    description: 'Austrian columns advance under fire. Can they close the gap?',
    range: 160,
    frenchFormations: [Formation.Line, Formation.Line, Formation.Line],
    austrianFormations: [Formation.Column, Formation.Column, Formation.Column],
    doctrine: 'aggressive_assault',
  },

  french_column_assault: {
    id: 'french_column_assault',
    label: 'French Column Assault',
    description: 'French columns advance against Austrian line. Test the charge mechanic.',
    range: 160,
    frenchFormations: [Formation.Column, Formation.Column, Formation.Column],
    austrianFormations: [Formation.Line, Formation.Line, Formation.Line],
    doctrine: 'holding_action',
  },

  routing_cascade: {
    id: 'routing_cascade',
    label: 'Routing Cascade',
    description: 'Austrian center is wavering. One more volley could break the line.',
    range: 80,
    frenchFormations: [Formation.Line, Formation.Line, Formation.Line],
    austrianFormations: [Formation.Line, Formation.Line, Formation.Line],
    austrian: [
      { strength: 60, morale: 35 },
      { strength: 40, morale: 20 },
      { strength: 55, morale: 30 },
    ],
  },

  mixed_formations: {
    id: 'mixed_formations',
    label: 'Mixed Formations',
    description: 'French line with skirmish screen vs Austrian column with square anchor.',
    range: 120,
    frenchFormations: [Formation.Skirmish, Formation.Line, Formation.Line],
    austrianFormations: [Formation.Column, Formation.Line, Formation.Square],
    doctrine: 'steady_advance',
  },

  quality_mismatch: {
    id: 'quality_mismatch',
    label: 'Quality Mismatch',
    description: 'Elite French grenadiers vs conscript Austrians. Quality over quantity.',
    range: 100,
    frenchFormations: [Formation.Line, Formation.Line, Formation.Line],
    austrianFormations: [Formation.Line, Formation.Line, Formation.Line],
    french: [
      { quality: 7 },
      { quality: 9 },
      { quality: 7 },
    ],
    austrian: [
      { quality: 2, strength: 100, morale: 55 },
      { quality: 1, strength: 100, morale: 50 },
      { quality: 2, strength: 100, morale: 55 },
    ],
  },
};

export const SCENARIO_IDS = Object.keys(SCENARIOS) as ScenarioId[];
