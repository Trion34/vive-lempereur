import {
  BattleState,
  ChargeChoiceId,
  ChargeChoice,
  LogEntry,
  MoraleChange,
} from '../types';
import { RIVOLI_STORY_BEATS } from '../data/battles/rivoli/storyBeats';

// ============================================================
// STORY BEAT SYSTEM — thin adapter delegating to config
// ============================================================

interface ChargeEncounterResult {
  log: LogEntry[];
  moraleChanges: MoraleChange[];
  healthDelta: number;
  staminaDelta: number;
  nextEncounter: number;
}

// ============================================================
// GET STORY BEAT
// ============================================================

export function getChargeEncounter(state: BattleState): {
  narrative: string;
  choices: ChargeChoice[];
} {
  const beat = RIVOLI_STORY_BEATS[state.chargeEncounter];
  if (!beat) {
    // Default to battery (id=1)
    const battery = RIVOLI_STORY_BEATS[1];
    return { narrative: battery.getNarrative(state), choices: battery.getChoices(state) };
  }
  return { narrative: beat.getNarrative(state), choices: beat.getChoices(state) };
}

// ============================================================
// RESOLVE STORY BEAT CHOICE
// ============================================================

export function resolveChargeChoice(
  state: BattleState,
  choiceId: ChargeChoiceId,
): ChargeEncounterResult {
  const beat = RIVOLI_STORY_BEATS[state.chargeEncounter];
  if (!beat) {
    return { log: [], moraleChanges: [], healthDelta: 0, staminaDelta: 0, nextEncounter: 0 };
  }
  const result = beat.resolveChoice(state, choiceId);
  return { ...result, nextEncounter: 0 };
}
