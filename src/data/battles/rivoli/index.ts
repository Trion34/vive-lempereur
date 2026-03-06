import type { BattleConfig, BattleLabels, BattleSegment } from '../types';
import {
  ActionId,
  ChargeEncounterId,
  DrillStep,
  MeleeContext,
  MoraleThreshold,
  WAGON_DAMAGE_CAP,
} from '../../../types';
import type { Action, BattleState } from '../../../types';
import { RIVOLI_VOLLEYS } from './volleys';
import { RIVOLI_STORY_BEATS } from './storyBeats';
import { RIVOLI_ENCOUNTERS } from './encounters';
import {
  RIVOLI_META,
  RIVOLI_OPENING,
  RIVOLI_OUTCOMES,
  RIVOLI_STORY_LABELS,
  RIVOLI_PHASE_LABELS,
} from './text';
import { registerBattleConfig } from '../registry';
import { createNPCsFromTemplates } from '../../../core/npcs';
import { ITALY_NPC_TEMPLATES } from '../../campaigns/italy';

// ============================================================
// RIVOLI BATTLE SCRIPT — ordered sequence of battle phases
// ============================================================

const RIVOLI_SCRIPT: BattleSegment[] = [
  // Part 1: Opening volleys
  { type: 'volleys', startIdx: 0, endIdx: 1, mode: 'standard' },
  // Wounded Sergeant interruption
  { type: 'story_beat', id: ChargeEncounterId.WoundedSergeant },
  // Part 1 continued: volleys 3-4
  { type: 'volleys', startIdx: 2, endIdx: 3, mode: 'standard' },
  // Battery overrun choice
  { type: 'story_beat', id: ChargeEncounterId.Battery },
  // Terrain melee
  { type: 'melee', encounterKey: 'terrain', meleeContext: MeleeContext.Terrain },
  // Fix Bayonets (melee transition to battery)
  { type: 'story_beat', id: ChargeEncounterId.FixBayonets },
  // Battery skirmish melee (with allies)
  { type: 'melee', encounterKey: 'battery_skirmish', meleeContext: MeleeContext.Battery },
  // Transition to Part 2
  { type: 'setup', apply: (state) => { state.ext.battlePart = 2; } },
  // Part 2: Hold the line
  { type: 'volleys', startIdx: 4, endIdx: 6, mode: 'standard' },
  // Masséna's arrival
  { type: 'story_beat', id: ChargeEncounterId.Massena },
  // Transition to Part 3
  { type: 'setup', apply: (state) => { state.ext.battlePart = 3; } },
  // The Gorge setup
  { type: 'story_beat', id: ChargeEncounterId.Gorge },
  // Gorge volleys (target selection mode)
  { type: 'volleys', startIdx: 7, endIdx: 10, mode: 'gorge' },
  // The Aftermath
  { type: 'story_beat', id: ChargeEncounterId.Aftermath },
];

// ============================================================
// RIVOLI LABELS — derived from existing text constants
// ============================================================

const RIVOLI_LABELS: BattleLabels = {
  storyBeats: RIVOLI_STORY_LABELS,
  linePhases: RIVOLI_PHASE_LABELS.line,
  meleePhases: RIVOLI_PHASE_LABELS.melee,
  volleyMaxes: RIVOLI_PHASE_LABELS.volleyMaxes,
};

// ============================================================
// RIVOLI GORGE ACTIONS — target selection for Part 3
// ============================================================

function rivoliGetAvailableActions(state: BattleState): Action[] {
  if (state.ext.battlePart !== 3) return [];
  if (state.drillStep === DrillStep.Present) {
    return [
      {
        id: ActionId.TargetColumn,
        name: 'Target the Column',
        description: 'Fire into the packed ranks below. Easy target. Devastating.',
        minThreshold: MoraleThreshold.Breaking,
        available: true,
        drillStep: DrillStep.Present,
      },
      {
        id: ActionId.TargetOfficers,
        name: 'Target an Officer',
        description: 'Pick out the man with the gorget and sash. Harder shot \u2014 bigger effect.',
        minThreshold: MoraleThreshold.Shaken,
        available: true,
        drillStep: DrillStep.Present,
      },
      {
        id: ActionId.TargetWagon,
        name: 'Target the Ammo Wagon',
        description: 'The powder wagon, tilted on the gorge road. One good hit...',
        minThreshold: MoraleThreshold.Shaken,
        available: state.ext.wagonDamage < WAGON_DAMAGE_CAP,
        drillStep: DrillStep.Present,
      },
      {
        id: ActionId.ShowMercy,
        name: 'Show Mercy',
        description: 'Lower your musket. These men are already beaten. The line fires without you.',
        minThreshold: MoraleThreshold.Breaking,
        available: true,
        drillStep: DrillStep.Present,
      },
    ];
  }
  if (state.drillStep === DrillStep.Fire) {
    return [
      {
        id: ActionId.Fire,
        name: 'Fire',
        description: 'Fire into the gorge.',
        minThreshold: MoraleThreshold.Breaking,
        available: true,
        drillStep: DrillStep.Fire,
      },
    ];
  }
  return [];
}

// ============================================================
// RIVOLI CONFIG — assembled from sub-modules
// ============================================================

const RIVOLI_CONFIG: BattleConfig = {
  id: 'rivoli',
  meta: RIVOLI_META,

  npcs: createNPCsFromTemplates(ITALY_NPC_TEMPLATES),
  roles: {
    leftNeighbour: 'pierre',
    rightNeighbour: 'jean-baptiste',
    officer: 'leclerc',
    nco: 'duval',
  },

  script: RIVOLI_SCRIPT,
  init: {
    enemy: {
      range: 120,
      strength: 100,
      quality: 'line',
      morale: 'advancing',
      lineIntegrity: 100,
      artillery: true,
      cavalryThreat: false,
    },
    ext: {
      battlePart: 1,
      batteryCharged: false,
      meleeStage: 0,
      wagonDamage: 0,
      gorgeTarget: '',
      gorgeMercyCount: 0,
    },
    startingVolley: 1,
    lineMorale: 'resolute',
  },

  volleys: RIVOLI_VOLLEYS,
  encounters: RIVOLI_ENCOUNTERS,
  storyBeats: RIVOLI_STORY_BEATS,

  outcomes: RIVOLI_OUTCOMES,
  opening: RIVOLI_OPENING,

  labels: RIVOLI_LABELS,
  getAvailableActions: rivoliGetAvailableActions,
};

// Register on import
registerBattleConfig(RIVOLI_CONFIG);
