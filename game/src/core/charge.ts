import {
  BattleState,
  ChargeChoiceId,
  ChargeChoice,
  LogEntry,
  MoraleChange,
} from '../types';
import type { StoryBeatConfig } from '../data/battles/types';
import { getBattleConfig } from '../data/battles/registry';

// ============================================================
// STORY BEAT SYSTEM — thin adapter delegating to config
// ============================================================

interface ChargeEncounterResult {
  log: LogEntry[];
  moraleChanges: MoraleChange[];
  healthDelta: number;
  staminaDelta: number;
  nextEncounter: number;
  virtueChange?: number;
}

function resolveStoryBeats(
  state: BattleState,
  explicit?: Record<number, StoryBeatConfig>,
): Record<number, StoryBeatConfig> {
  if (explicit) return explicit;
  return getBattleConfig(state.configId).storyBeats;
}

// ============================================================
// GET STORY BEAT
// ============================================================

export function getChargeEncounter(
  state: BattleState,
  storyBeats?: Record<number, StoryBeatConfig>,
): {
  narrative: string;
  choices: ChargeChoice[];
} {
  const beats = resolveStoryBeats(state, storyBeats);
  const beat = beats[state.chargeEncounter];
  if (!beat) {
    // Default to first available beat
    const firstBeat = beats[Object.keys(beats).map(Number)[0]];
    if (!firstBeat) return { narrative: '', choices: [] };
    return { narrative: firstBeat.getNarrative(state), choices: firstBeat.getChoices(state) };
  }
  return { narrative: beat.getNarrative(state), choices: beat.getChoices(state) };
}

// ============================================================
// RESOLVE STORY BEAT CHOICE
// ============================================================

export function resolveChargeChoice(
  state: BattleState,
  choiceId: ChargeChoiceId,
  storyBeats?: Record<number, StoryBeatConfig>,
): ChargeEncounterResult {
  const beats = resolveStoryBeats(state, storyBeats);
  const beat = beats[state.chargeEncounter];
  if (!beat) {
    return { log: [], moraleChanges: [], healthDelta: 0, staminaDelta: 0, nextEncounter: 0 };
  }
  const result = beat.resolveChoice(state, choiceId);
  return { ...result, nextEncounter: 0 };
}
