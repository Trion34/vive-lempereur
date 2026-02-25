import type { CampEvent, PlayerCharacter, NPC } from '../types';
import { CampEventCategory } from '../types';

// ============================================================
// Camp event definitions — narrative + choices only
// Resolve functions live in core/preBattleCamp.ts (state mutations)
// ============================================================

// === Forced events (triggered at specific action counts) ===

export function getBriefingEvent(): CampEvent {
  return {
    id: 'prebattle_briefing',
    category: CampEventCategory.Orders,
    title: "Officer's Briefing",
    narrative:
      'Your section is drawing cartridges from the supply wagon when Sergeant Duval appears. "Dawn. Austrians from the north. Three columns at least." He looks along the line. "Front rank needs filling." The section goes quiet.',
    choices: [
      {
        id: 'volunteer',
        label: 'Volunteer for front rank',
        description: 'Step forward. Where the danger is greatest. [Valor check]',
        statCheck: { stat: 'valor', difficulty: 0 },
      },
      {
        id: 'stay_quiet',
        label: 'Stay quiet',
        description: 'The front rank is for the brave or the foolish.',
      },
    ],
    resolved: false,
  };
}

export function getBonaparteEvent(): CampEvent {
  return {
    id: 'prebattle_bonaparte',
    category: CampEventCategory.Orders,
    title: 'Bonaparte Rides Past',
    narrative:
      'A stir runs through the camp. Hooves on frozen ground. Bonaparte himself rides past the fires of the 14th, grey coat, plain hat, that sharp profile lit by the flames. He does not stop. He does not speak. But every man straightens as he passes. The general sees everything. Everyone knows it.',
    choices: [
      {
        id: 'stand_tall',
        label: 'Continue',
        description: '',
        statCheck: { stat: 'valor', difficulty: 0 },
      },
    ],
    resolved: false,
  };
}

export function getCampfiresEvent(): CampEvent {
  return {
    id: 'prebattle_campfires',
    category: CampEventCategory.Rumour,
    title: 'Austrian Campfires',
    narrative:
      'A thick fog has settled over the plateau, rolling up from the Adige gorge, obscuring your surroundings.\n\nBut out there, on the ridges to the north — Austrian campfires, bleeding through the fog like dim orange ghosts.',
    choices: [
      {
        id: 'steady_men',
        label: 'Steady the nervous',
        description: 'Find the right words. Keep the fear from spreading. [Charisma check]',
        statCheck: { stat: 'charisma', difficulty: 15 },
      },
      {
        id: 'count_them',
        label: 'Try to count them',
        description: 'Study the fires. How many columns? [Awareness check]',
        statCheck: { stat: 'awareness', difficulty: -15 },
      },
    ],
    resolved: false,
  };
}

// === Random events ===

export function getAllPreBattleEvents(_player: PlayerCharacter, _npcs: NPC[]): CampEvent[] {
  return [
    {
      id: 'prebattle_pierre_story',
      category: CampEventCategory.Interpersonal,
      title: "Pierre's Story",
      narrative:
        'Pierre is sitting apart from the others, staring into the fire. His face is unreadable. He has been at Arcole, at Lodi, at a dozen fights whose names you barely know. He has not spoken all evening. But there is something in his silence tonight that is different. Heavier.',
      choices: [
        { id: 'listen', label: 'Listen', description: 'Sit beside him. Wait for him to speak.' },
        {
          id: 'ask_arcole',
          label: 'Ask about Arcole',
          description: 'Draw him out. [Charisma check]',
          statCheck: { stat: 'charisma', difficulty: 0 },
        },
      ],
      resolved: false,
    },
    {
      id: 'prebattle_rations',
      category: CampEventCategory.Supply,
      title: 'Short Rations',
      narrative:
        'The quartermaster distributes what passes for supper: a quarter-loaf of hard bread, a sliver of cheese, a cup of thin broth. It is not enough. It was never going to be enough. Jean-Baptiste stares at your portion. He has already finished his own.',
      choices: [
        {
          id: 'accept',
          label: 'Accept your share',
          description: 'Eat what you are given. A soldier endures.',
        },
        {
          id: 'share_jb',
          label: 'Share with Jean-Baptiste',
          description: 'Give him half your bread. [Constitution check]',
          statCheck: { stat: 'constitution', difficulty: 0 },
        },
      ],
      resolved: false,
    },
    {
      id: 'prebattle_jb_fear',
      category: CampEventCategory.Interpersonal,
      title: "Jean-Baptiste's Fear",
      narrative:
        'You find Jean-Baptiste behind the supply wagon, sitting in the dark. His hands are shaking.\n\n"I can\'t do it," he whispers. "Tomorrow. The line. I can\'t."\n\nHe\'s not the only one thinking it. He\'s just the only one saying it out loud.',
      choices: [
        {
          id: 'reassure',
          label: 'Reassure him',
          description: '"You can. You will. Stay beside me." [Charisma check]',
          statCheck: { stat: 'charisma', difficulty: 0 },
        },
        {
          id: 'truth',
          label: 'Tell him the truth',
          description: '"Everyone\'s afraid. The brave ones just march anyway." [Valor check]',
          statCheck: { stat: 'valor', difficulty: 0 },
        },
        {
          id: 'silence',
          label: 'Say nothing',
          description: 'Sit with him in the dark. Sometimes presence is enough.',
        },
      ],
      resolved: false,
    },
  ];
}

// === Activity narrative strings ===

export const FORAGE_SUCCESS = [
  'You find a root cellar half-buried in snow behind an abandoned farmhouse. Frozen turnips, a sack of chestnuts, a clay jug of vinegar. Not much — but the men cheer when you come back.',
  'A skinny chicken, hiding in the ruins of a barn. You wring its neck before it can squawk. Tonight, the section eats.',
  'Firewood. Real firewood — dry oak, stacked under a collapsed shed roof. You drag back as much as you can carry. The fire burns properly for the first time in days.',
];

export const FORAGE_FAIL = [
  'Nothing. Frozen fields picked clean by every army that has passed this way. You come back empty-handed, boots soaked through, fingers blue.',
  'You range further than you should, alone on the mountainside. The wind cuts through your coat. There is nothing here. There was never anything here.',
  'An abandoned village, already stripped. Every cupboard bare, every root cellar emptied. You kick through the snow for an hour and find nothing but frozen mud.',
];

export const SOCIALIZE_NARRATIVES: Record<string, string> = {
  pierre: `Pierre is quiet as always, but tonight he shares his tobacco. "You did well today," he says. From him, that's a speech.`,
  'jean-baptiste': `Jean-Baptiste talks rapidly about home \u2014 the bakery, the river, his sister's cat. You listen. Sometimes listening is enough.`,
  duval: `Sergeant Duval grumbles about the rations, the officers, the war. But there's a grudging warmth underneath. "At least you're not useless," he says.`,
  leclerc: `Captain Leclerc speaks of glory and promotion. His eyes shine in the firelight. "We'll make captain yet," he says. He means himself, but includes you in the dream.`,
};
