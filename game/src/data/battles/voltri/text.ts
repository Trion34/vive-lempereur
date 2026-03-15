import type { BattleMeta, OpeningConfig, OutcomeConfig, BattleLabels } from '../types';
import { ChargeEncounterId } from '../../../types';

// ============================================================
// VOLTRI BATTLE METADATA
// ============================================================

export const VOLTRI_META: BattleMeta = {
  title: 'BATTLE OF VOLTRI',
  date: '10 April 1796',
  playerUnit: '14th Demi-Brigade de Ligne',
  enemyUnit: 'Austrian Advance Guard (Beaulieu)',
  historicalNote:
    'On 10 April 1796, Austrian General Beaulieu launched a diversionary attack against the French garrison at Voltri on the Ligurian coast. The outnumbered garrison fought a brief afternoon action on the heights above the town before withdrawing along the coastal road toward Savona — a gruelling 40km night march that tested the endurance of every man in the column.',
};

// ============================================================
// OPENING CINEMATIC
// ============================================================

export const VOLTRI_OPENING: OpeningConfig = {
  narrative: `The alarm sounds at midday. Drums beat the g\u00e9n\u00e9rale — the call to arms that every soldier dreads.

Austrian columns have been spotted on the heights above Voltri. White coats moving through the olive groves, too many to count. The garrison scrambles.

Sergeant Morin is already bellowing: "FALL IN! Fall in, you useless layabouts! Form by sections!"

You check your flint, check your cartridge box. Your hands are steady. Or steady enough.

The company forms on the Pegli heights above the town. The road to Genoa is behind you. The Austrians are coming from the north.

Lieutenant Vidal draws his sword. "Hold this ground, Fourteenth. Buy time for the baggage train."`,
  splashText: 'Fate Beckons...',
  choiceLabel: 'Take your place in the line',
  choiceDesc: 'The drums are beating. The Austrians are coming.',
};

// ============================================================
// OUTCOME TEXT
// ============================================================

export const VOLTRI_OUTCOMES: Record<string, OutcomeConfig> = {
  survived: {
    title: 'Dawn at Savona',
    narrative:
      'You made it. Forty kilometres of coastal road, stumbling through the dark, and you made it.\n\nThe garrison at Savona opens its gates as the first grey light touches the sea. Men collapse where they stand — in doorways, against walls, in the middle of the road. Officers stop trying to maintain order. There is no order. There is only exhaustion.\n\nVoltri is lost. The supplies, the position, the illusion of safety — all gone. But the 14th is intact. Battered, footsore, half-dead with fatigue, but intact.\n\nSomewhere to the north, in the mountains, Bonaparte is planning something. The campaign has not even begun.',
  },
  defeat_melee: {
    title: 'Killed in Action',
    narrative:
      'The steel finds you on the heights above Voltri. A brief, ugly skirmish in the olive groves — and then nothing.\n\nYour war ends on a sunny April afternoon, within sight of the sea, before the campaign has even begun. The garrison retreats without you.\n\nThe 10th of April, 1796. This is where your war ends.',
  },
  defeat_line: {
    title: 'Killed in Action',
    narrative:
      'The ball finds you during the exchange on the Pegli heights. No time to duck, no warning — just the impact and the fall.\n\nThe company fires on without you. The retreat sounds an hour later. By then, it no longer matters.\n\nThe 10th of April, 1796. This is where your war ends.',
  },
  rout: {
    title: 'Broke',
    narrative:
      'You ran before the withdrawal was ordered. Dropped your musket somewhere on the heights and scrambled down toward the coast road, legs moving before your mind could catch up.\n\nYou reach Savona with the stragglers, hours after the main body. Sergeant Morin finds you. He says nothing. The look is enough.\n\nYou survived Voltri. That word will taste like ashes.',
  },
};

// ============================================================
// LABELS
// ============================================================

const VOLTRI_STORY_LABELS: Record<number, string> = {
  [ChargeEncounterId.VoltriFixBayonets]: 'FIX BAYONETS',
  [ChargeEncounterId.VoltriLineBreaks]: 'THE LINE BREAKS',
  [ChargeEncounterId.VoltriCoastalRoad]: 'THE COASTAL ROAD',
  [ChargeEncounterId.VoltriCavalryScare]: 'CAVALRY SCARE',
  [ChargeEncounterId.VoltriWoundedSoldier]: 'THE WOUNDED SOLDIER',
  [ChargeEncounterId.VoltriWoundedCanteen]: 'THE WOUNDED SOLDIER',
  [ChargeEncounterId.VoltriHomestead]: 'THE HOMESTEAD',
  [ChargeEncounterId.VoltriDawnSavona]: 'DAWN AT SAVONA',
};

const VOLTRI_ENCOUNTER_TITLES: Record<number, string> = {
  [ChargeEncounterId.VoltriFixBayonets]: 'Fix Bayonets',
  [ChargeEncounterId.VoltriLineBreaks]: 'The Withdrawal',
  [ChargeEncounterId.VoltriCoastalRoad]: 'Night March',
  [ChargeEncounterId.VoltriCavalryScare]: 'Uhlans in the Dark',
  [ChargeEncounterId.VoltriWoundedSoldier]: 'The Wounded Soldier',
  [ChargeEncounterId.VoltriWoundedCanteen]: 'The Wounded Soldier',
  [ChargeEncounterId.VoltriHomestead]: 'The Homestead',
  [ChargeEncounterId.VoltriDawnSavona]: 'Dawn at Savona',
};

const VOLTRI_PHASE_LABELS = {
  line: {
    1: 'THE PEGLI HEIGHTS',
  } as Record<number, string>,
  melee: {
    1: 'HILLTOP SKIRMISH',
  } as Record<number, string>,
  volleyMaxes: {
    1: 2,
  } as Record<number, number>,
};

export const VOLTRI_LABELS: BattleLabels = {
  storyBeats: VOLTRI_STORY_LABELS,
  encounterTitles: VOLTRI_ENCOUNTER_TITLES,
  linePhases: VOLTRI_PHASE_LABELS.line,
  meleePhases: VOLTRI_PHASE_LABELS.melee,
  volleyMaxes: VOLTRI_PHASE_LABELS.volleyMaxes,
};
