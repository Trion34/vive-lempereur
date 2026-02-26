import type { BattleConfig, BattleSegment } from '../types';
import { RIVOLI_VOLLEYS } from './volleys';
import { RIVOLI_STORY_BEATS } from './storyBeats';
import { RIVOLI_ENCOUNTERS } from './encounters';
import {
  RIVOLI_META,
  RIVOLI_OPENING,
  RIVOLI_OUTCOMES,
} from './text';
import { registerBattleConfig } from '../registry';
import { createCampaignNPCs } from '../../../core/npcs';

// ============================================================
// RIVOLI BATTLE SCRIPT — ordered sequence of battle phases
// ============================================================

const RIVOLI_SCRIPT: BattleSegment[] = [
  // Part 1: Opening volleys
  { type: 'volleys', startIdx: 0, endIdx: 1, mode: 'standard' },
  // Wounded Sergeant interruption
  { type: 'story_beat', id: 5 },
  // Part 1 continued: volleys 3-4
  { type: 'volleys', startIdx: 2, endIdx: 3, mode: 'standard' },
  // Battery overrun choice
  { type: 'story_beat', id: 1 },
  // Terrain melee
  { type: 'melee', encounterKey: 'terrain', meleeContext: 'terrain' },
  // Fix Bayonets (melee transition to battery)
  { type: 'story_beat', id: 6 },
  // Battery skirmish melee (with allies)
  { type: 'melee', encounterKey: 'battery_skirmish', meleeContext: 'battery' },
  // Transition to Part 2
  { type: 'setup', apply: (state) => { state.ext.battlePart = 2; } },
  // Part 2: Hold the line
  { type: 'volleys', startIdx: 4, endIdx: 6, mode: 'standard' },
  // Masséna's arrival
  { type: 'story_beat', id: 2 },
  // Transition to Part 3
  { type: 'setup', apply: (state) => { state.ext.battlePart = 3; } },
  // The Gorge setup
  { type: 'story_beat', id: 3 },
  // Gorge volleys (target selection mode)
  { type: 'volleys', startIdx: 7, endIdx: 10, mode: 'gorge' },
  // The Aftermath
  { type: 'story_beat', id: 4 },
];

// ============================================================
// RIVOLI CONFIG — assembled from sub-modules
// ============================================================

const RIVOLI_CONFIG: BattleConfig = {
  id: 'rivoli',
  meta: RIVOLI_META,

  npcs: createCampaignNPCs(),
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
};

// Register on import
registerBattleConfig(RIVOLI_CONFIG);
