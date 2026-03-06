// Re-export encounter definitions from Rivoli config for backward compatibility.
// Tests and components that import ENCOUNTER_DEFS continue to work.
import type { BattleState, ChargeChoice } from '../types';
import { RIVOLI_STORY_BEATS } from './battles/rivoli/storyBeats';

interface EncounterDef {
  id: number;
  getNarrative: (state: BattleState) => string;
  getChoices: (state: BattleState) => ChargeChoice[];
}

export const ENCOUNTER_DEFS: EncounterDef[] = Object.values(RIVOLI_STORY_BEATS)
  .sort((a, b) => a.id - b.id)
  .map((beat) => ({
    id: beat.id,
    getNarrative: beat.getNarrative,
    getChoices: beat.getChoices,
  }));
