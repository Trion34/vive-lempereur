import type { OpponentTemplate, EncounterConfig } from '../../../types';
import { MeleeContext } from '../../../types';

// ============================================================
// PEGLI HILLS SKIRMISH (tutorial melee — hilltop fighting)
// ============================================================

export const PEGLI_ROSTER: OpponentTemplate[] = [
  {
    name: 'Austrian conscript',
    type: 'conscript',
    health: [55, 70],
    stamina: [140, 180],
    strength: 35,
    description:
      'A young Austrian stumbles through the olive grove, white coat snagged on branches. Wide-eyed, bayonet wavering. This is his first fight too.',
  },
  {
    name: 'Austrian conscript',
    type: 'conscript',
    health: [50, 65],
    stamina: [130, 170],
    strength: 33,
    description:
      'Another white coat scrambles over the stone wall. He\'s breathing hard from the climb. His musket is almost as tall as he is.',
  },
  {
    name: 'Austrian line infantryman',
    type: 'line',
    health: [70, 85],
    stamina: [160, 210],
    strength: 45,
    description:
      'A steadier man pushes through the scrub. Not a conscript — a professional. He plants his feet among the olive roots and levels his bayonet.',
  },
];

// ============================================================
// VOLTRI ENCOUNTER CONFIGS
// ============================================================

export const VOLTRI_ENCOUNTERS: Record<string, EncounterConfig> = {
  pegli_hills: {
    context: MeleeContext.Skirmish,
    opponents: PEGLI_ROSTER,
    allies: [],
    maxExchanges: 8,
    initialActiveEnemies: 1,
    maxActiveEnemies: 1,
  },
};
