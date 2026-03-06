import {
  BattleState,
  ChargeChoiceId,
  ChargeChoice,
  LogEntry,
  MoraleChange,
} from '../types';
import type { StoryBeatConfig } from '../data/battles/types';
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

export function getChargeEncounter(
  state: BattleState,
  storyBeats: Record<number, StoryBeatConfig> = RIVOLI_STORY_BEATS,
): {
  narrative: string;
  choices: ChargeChoice[];
} {
  const beat = storyBeats[state.chargeEncounter];
  if (!beat) {
    // Default to battery (id=1)
    const battery = storyBeats[1];
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
  storyBeats: Record<number, StoryBeatConfig> = RIVOLI_STORY_BEATS,
): ChargeEncounterResult {
  const beat = storyBeats[state.chargeEncounter];
  if (!beat) {
    return { log: [], moraleChanges: [], healthDelta: 0, staminaDelta: 0, nextEncounter: 0 };
  }
  const result = beat.resolveChoice(state, choiceId);
  return { ...result, nextEncounter: 0 };
}
