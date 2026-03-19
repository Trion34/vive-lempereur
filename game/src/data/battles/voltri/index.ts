import type { BattleConfig, BattleSegment } from '../types';
import { ChargeEncounterId, MeleeContext, isVoltriExt } from '../../../types';
import type { BattleState, VoltriExt } from '../../../types';
import { VOLTRI_VOLLEYS } from './volleys';
import { VOLTRI_STORY_BEATS } from './storyBeats';
import { VOLTRI_ENCOUNTERS } from './encounters';
import {
  VOLTRI_META,
  VOLTRI_OPENING,
  VOLTRI_OUTCOMES,
  VOLTRI_LABELS,
} from './text';
import { registerBattleConfig } from '../registry';
import { createNPCsFromTemplates } from '../../../core/npcs';
import { VOLTRI_NPC_TEMPLATES } from '../../campaigns/italy';

// ============================================================
// VOLTRI BATTLE SCRIPT
// ============================================================

const VOLTRI_SCRIPT: BattleSegment[] = [
  // 2 tutorial volleys on the Pegli heights
  { type: 'volleys', startIdx: 0, endIdx: 1, mode: 'standard' },
  // Fix Bayonets — transition to melee
  { type: 'story_beat', id: ChargeEncounterId.VoltriFixBayonets },
  // Hilltop skirmish
  { type: 'melee', encounterKey: 'pegli_hills', meleeContext: MeleeContext.Skirmish },
  // The Line Breaks — withdrawal choice
  { type: 'story_beat', id: ChargeEncounterId.VoltriLineBreaks },
  // The Coastal Road — branches via resolveChoice:
  //   HelpStragglers → separated path (wounded soldier → canteen → homestead → dawn)
  //   KeepMoving → column path (cavalry scare → dawn)
  { type: 'story_beat', id: ChargeEncounterId.VoltriCoastalRoad },
  // These are reachable via chargeEncounter transitions in story beat resolvers:
  { type: 'story_beat', id: ChargeEncounterId.VoltriCavalryScare },
  { type: 'story_beat', id: ChargeEncounterId.VoltriWoundedSoldier },
  { type: 'story_beat', id: ChargeEncounterId.VoltriWoundedCanteen },
  { type: 'story_beat', id: ChargeEncounterId.VoltriHomestead },
  // Dawn at Savona — battle ends (reached from either path)
  { type: 'story_beat', id: ChargeEncounterId.VoltriDawnSavona },
];

// ============================================================
// VOLTRI CONFIG
// ============================================================

const VOLTRI_CONFIG: BattleConfig = {
  id: 'voltri',
  meta: VOLTRI_META,

  npcs: createNPCsFromTemplates(VOLTRI_NPC_TEMPLATES),
  roles: {
    officer: 'vidal',
    nco: 'morin',
  },

  script: VOLTRI_SCRIPT,
  init: {
    enemy: {
      range: 150,
      strength: 100,
      quality: 'line',
      morale: 'advancing',
      lineIntegrity: 100,
      artillery: false,
      cavalryThreat: false,
    },
    ext: {
      battlePart: 1,
      meleeStage: 0,
      separated: false,
      felixSurvived: false,
      felixMet: false,
      ligurianGirlSaved: false,
      felixTendScore: 0,
    } as VoltriExt,
    startingVolley: 1,
    lineMorale: 'nervous',
  },

  volleys: VOLTRI_VOLLEYS,
  encounters: VOLTRI_ENCOUNTERS,
  storyBeats: VOLTRI_STORY_BEATS,

  outcomes: VOLTRI_OUTCOMES,
  opening: VOLTRI_OPENING,

  labels: VOLTRI_LABELS,

  syncCampFlags: (battleState: BattleState, campFlags: Record<string, boolean>) => {
    if (isVoltriExt(battleState.ext)) {
      battleState.ext.felixMet = campFlags.gambling_accepted === true;
      battleState.ext.ligurianGirlSaved = campFlags.ligurian_girl_saved === true;
    }
  },
};

// Register on import
registerBattleConfig(VOLTRI_CONFIG);
