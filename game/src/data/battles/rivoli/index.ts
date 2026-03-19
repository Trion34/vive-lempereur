import type { BattleConfig, BattleLabels, BattleSegment } from '../types';
import {
  ActionId,
  BattlePhase,
  ChargeEncounterId,
  DrillStep,
  MeleeContext,
  MoraleThreshold,
  WAGON_DAMAGE_CAP,
} from '../../../types';
import type { Action, BattleState, RivoliExt } from '../../../types';
import { getChargeEncounter } from '../../../core/charge';
import { resolveRivoliGorgeFire, resolveRivoliGorgePresent } from './gorge';
import { RIVOLI_VOLLEYS } from './volleys';
import { RIVOLI_STORY_BEATS } from './storyBeats';
import { RIVOLI_ENCOUNTERS } from './encounters';
import {
  RIVOLI_META,
  RIVOLI_OPENING,
  RIVOLI_OUTCOMES,
  RIVOLI_STORY_LABELS,
  RIVOLI_ENCOUNTER_TITLES,
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
  // Melee transition (fix bayonets)
  { type: 'story_beat', id: ChargeEncounterId.FixBayonets },
  // Terrain melee
  { type: 'melee', encounterKey: 'terrain', meleeContext: MeleeContext.Terrain },
  // Battery overrun choice
  { type: 'story_beat', id: ChargeEncounterId.Battery },
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
  encounterTitles: RIVOLI_ENCOUNTER_TITLES,
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
        available: (state.ext as RivoliExt).wagonDamage < WAGON_DAMAGE_CAP,
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
// RIVOLI POST-MELEE TRANSITIONS
// ============================================================

function rivoliPostMeleeTransition(s: BattleState, meleeContext: MeleeContext): boolean {
  if (meleeContext === MeleeContext.Battery) {
    // Battery melee concluded → transition narrative + Masséna story beat
    const ms = s.meleeState;
    const pierreAlly = ms?.allies.find((a) => a.npcId === s.roles.leftNeighbour);
    const pierreAlive = pierreAlly ? pierreAlly.alive : (s.line.leftNeighbour?.alive ?? true);
    const pierreClause = pierreAlive
      ? 'Pierre is beside you, blood on his sleeve, bayonet dripping. Still alive. Still standing.'
      : 'Pierre is gone. You saw him fall in the press. Another name for the list.';

    s.log.push({
      turn: s.turn,
      type: 'narrative',
      text: `\n--- THE BATTERY IS YOURS ---\n\nThe last defender falls. The guns are yours again \u2014 French guns, retaken by French soldiers. ${pierreClause}\n\nCaptain Leclerc's voice carries across the redoubt: "Turn them! Turn the guns!"\n\nMen scramble to the pieces. Rammers are found. Powder charges. Within minutes, the captured battery roars again \u2014 this time firing in the right direction. Austrian canister tears into the white-coated columns still pressing the plateau.\n\nThe 14th took back its guns. The cost is written in the bodies around the redoubt. But the guns are yours.`,
    });
    s.phase = BattlePhase.StoryBeat;
    s.chargeEncounter = ChargeEncounterId.Massena;
    const storyBeat = getChargeEncounter(s);
    s.log.push({ turn: s.turn, text: storyBeat.narrative, type: 'narrative' });
    s.availableActions = [];
    return true;
  }

  if (meleeContext === MeleeContext.Terrain) {
    // Terrain melee concluded → transition to Battery story beat
    s.log.push({
      turn: s.turn,
      type: 'narrative',
      text: 'The fighting ebbs. Not a victory \u2014 not a defeat. The Austrians pull back through the broken ground, regrouping. You lean on your musket, gasping. Around you, the survivors of the 14th do the same.\n\nBut the battle is not over. Not even close.',
    });
    s.phase = BattlePhase.StoryBeat;
    s.chargeEncounter = ChargeEncounterId.Battery;
    const storyBeat = getChargeEncounter(s);
    s.log.push({ turn: s.turn, text: storyBeat.narrative, type: 'narrative' });
    s.availableActions = [];
    return true;
  }

  return false;
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
    } as RivoliExt,
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
  postMeleeTransition: rivoliPostMeleeTransition,
  resolveCustomFire: resolveRivoliGorgeFire,
  resolveCustomPresent: resolveRivoliGorgePresent,
};

// Register on import
registerBattleConfig(RIVOLI_CONFIG);
