import { CampActivityId, CampEventCategory } from './enums';
import type { NumericStatKey } from './player';
import type { VNScene } from './vnTypes';

export type RestSubActivity = 'lay_about' | 'bathe' | 'pray';

export type ExerciseSubActivity = 'haul' | 'wrestle' | 'run';

export type ArmsTrainingSubActivity =
  | 'solo_musketry'
  | 'solo_elan'
  | 'comrades_musketry'
  | 'comrades_elan'
  | 'officers_musketry'
  | 'officers_elan';

export type DutySubActivity = 'forage' | 'volunteer' | 'check_equipment' | 'tend_wounded';

interface ArmsTrainingTierConfig {
  cap: number;
  repRequired: number;
  repField: 'soldierRep' | 'officerRep';
  maxChance: number;
}

export const ARMS_TRAINING_TIERS: Record<
  'solo' | 'comrades' | 'officers',
  ArmsTrainingTierConfig
> = {
  solo: { cap: 50, repRequired: 0, repField: 'soldierRep', maxChance: 80 },
  comrades: { cap: 70, repRequired: 20, repField: 'soldierRep', maxChance: 85 },
  officers: { cap: 85, repRequired: 50, repField: 'officerRep', maxChance: 90 },
};

export interface CampActivity {
  id: CampActivityId;
  name: string;
  description: string;
  staminaCost: number;
  available: boolean;
  requiresTarget?: boolean; // e.g. Socialize requires NPC target
}

export interface CampActivityResult {
  log: CampLogEntry[];
  statChanges: Partial<Record<NumericStatKey, number>>;
  npcChanges?: { npcId: string; relationship: number }[];
  staminaChange: number;
  moraleChange: number;
  healthChange?: number; // positive = healing
  sousChange?: number;
  virtueChange?: number;
  /** Camp flags to set (merged into CampState.flags) */
  flagChanges?: Record<string, boolean>;
}

export interface CampLogEntry {
  day: number;
  text: string;
  type: 'narrative' | 'activity' | 'event' | 'result';
}

export interface CampEventChoice {
  id: string;
  label: string;
  description: string;
  statCheck?: { stat: NumericStatKey; difficulty: number };
  locked?: boolean;
}

export interface CampEventResult {
  log: CampLogEntry[];
  statChanges: Partial<Record<NumericStatKey, number>>;
  moraleChange: number;
  staminaChange?: number;
  healthChange?: number;
  sousChange?: number;
  virtueChange?: number;
  npcChanges?: { npcId: string; relationship: number }[];
  rollDisplay?: { stat: string; roll: number; target: number; passed: boolean };
  /** Camp flags to set (merged into CampState.flags) */
  flagChanges?: Record<string, boolean>;
}

export interface CampEvent {
  id: string;
  category: CampEventCategory;
  title: string;
  narrative: string;
  choices: CampEventChoice[];
  resolved: boolean;
}

export interface CampConditions {
  weather: 'clear' | 'rain' | 'snow' | 'cold';
  supplyLevel: 'abundant' | 'adequate' | 'scarce' | 'critical';
  campMorale: 'high' | 'steady' | 'low' | 'mutinous';
  location: string;
}

export interface CampState {
  day: number; // kept for log entries (always 1)
  actionsTotal: number;
  actionsRemaining: number;
  conditions: CampConditions;
  log: CampLogEntry[];
  pendingEvent?: CampEvent;
  /** A VN scene waiting to be played (exclusive with pendingEvent) */
  pendingVnScene?: {
    sceneId: string;
    scene: VNScene;
    configId: string;
    title?: string;
  };
  completedActivities: CampActivityId[];
  triggeredEvents: string[]; // Event IDs already shown this camp
  batheCooldown: number; // 0 = available, decrements each activity
  prayedThisCamp: boolean; // true after first pray, blocks further use
  campId: string;
  /** Persistent flags set by camp events (e.g. gambling_accepted, ligurian_girl_saved) */
  flags: Record<string, boolean>;
}
