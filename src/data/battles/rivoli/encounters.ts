import type { OpponentTemplate, AllyTemplate, EncounterConfig } from '../../../types';
import { MeleeContext } from '../../../types';

// ============================================================
// NAME POOLS
// ============================================================

export const CONSCRIPT_NAMES = ['Hans Vogl', 'Stefan Brenner', 'Josef Leitner', 'Friedrich Mayer'];
export const LINE_NAMES = ['Karl Wenger', 'Johann Huber', 'Franz Egger', 'Heinrich Moser'];
export const SERGEANT_NAMES = [
  'Feldwebel Gruber',
  'Feldwebel Steinbach',
  'Feldwebel Pichler',
  'Feldwebel Rainer',
];

// ============================================================
// TERRAIN MELEE (first melee — broken ground fighting)
// ============================================================

export const TERRAIN_ROSTER: OpponentTemplate[] = [
  {
    name: 'Austrian conscript',
    type: 'conscript',
    health: [70, 85],
    stamina: [160, 200],
    strength: 40,
    description:
      "He stumbles through the vineyard wall, white coat torn on the stones. Wide-eyed, shaking. His bayonet weaves like a drunk's sword.",
  },
  {
    name: 'Austrian conscript',
    type: 'conscript',
    health: [65, 80],
    stamina: [150, 190],
    strength: 40,
    description:
      'Another white coat scrambles over the low wall. Young \u2014 impossibly young. His musket is longer than he is tall. He screams as he comes.',
  },
  {
    name: 'Austrian line infantryman',
    type: 'line',
    health: [80, 95],
    stamina: [180, 240],
    strength: 50,
    description:
      'A career soldier pushes through the gap in the stone wall. Calm enough. Steel levelled, feet planted among the vines. He knows the drill.',
  },
  {
    name: 'Austrian veteran',
    type: 'veteran',
    health: [95, 115],
    stamina: [200, 260],
    strength: 65,
    description:
      'This one is different. Steady hands, dead eyes, a scar across his jaw from some forgotten battle. He steps over the vineyard wall without hurrying.',
  },
];

// ============================================================
// BATTERY MELEE (retaking overrun French battery)
// ============================================================

export const BATTERY_ROSTER: OpponentTemplate[] = [
  {
    name: 'Austrian infantry guard',
    type: 'line',
    health: [80, 95],
    stamina: [180, 240],
    strength: 50,
    description:
      'Infantry assigned to hold the captured battery. He stands between you and the guns, bayonet level. Professional. Determined.',
  },
  {
    name: 'Austrian grenadier',
    type: 'veteran',
    health: [90, 110],
    stamina: [200, 260],
    strength: 60,
    description:
      'A grenadier from the assault column. Tall, bearskin cap, sabre-bayonet. He fights with the economy of a man who has done this many times before.',
  },
  {
    name: 'Austrian infantry guard',
    type: 'line',
    health: [75, 90],
    stamina: [170, 220],
    strength: 48,
    description:
      'Another white-coat, fighting to hold the redoubt. Younger than the first. Just as stubborn.',
  },
  {
    name: 'Austrian battery sergeant',
    type: 'sergeant',
    health: [100, 125],
    stamina: [220, 280],
    strength: 75,
    description:
      'The sergeant who led the assault. A big man with the calm of someone who has stormed positions before. He holds a cavalry sabre. He will not give up these guns.',
  },
];

// ============================================================
// ALLY TEMPLATES
// ============================================================

const PIERRE_TEMPLATE: AllyTemplate = {
  id: 'pierre',
  name: 'Pierre',
  type: 'named',
  npcId: 'pierre',
  health: [75, 90],
  stamina: [180, 220],
  strength: 50,
  elan: 45,
  personality: 'aggressive',
  description: 'Pierre fights beside you \u2014 blood on his sleeve, bayonet steady. An Arcole veteran.',
};

const JB_TEMPLATE: AllyTemplate = {
  id: 'jean-baptiste',
  name: 'Jean-Baptiste',
  type: 'named',
  npcId: 'jean-baptiste',
  health: [60, 75],
  stamina: [140, 180],
  strength: 38,
  elan: 30,
  personality: 'cautious',
  description: 'Jean-Baptiste is pale, bayonet shaking \u2014 but here. He came.',
};

// ============================================================
// RIVOLI ENCOUNTER CONFIGS
// ============================================================

export const RIVOLI_ENCOUNTERS: Record<string, EncounterConfig> = {
  terrain: {
    context: MeleeContext.Terrain,
    opponents: TERRAIN_ROSTER,
    allies: [],
    maxExchanges: 12,
    initialActiveEnemies: 1,
    maxActiveEnemies: 1,
  },
  battery: {
    context: MeleeContext.Battery,
    opponents: BATTERY_ROSTER,
    allies: [],
    maxExchanges: 10,
    initialActiveEnemies: 1,
    maxActiveEnemies: 1,
  },
  battery_skirmish: {
    context: MeleeContext.Battery,
    opponents: BATTERY_ROSTER,
    allies: [],
    maxExchanges: 20,
    initialActiveEnemies: 2,
    maxActiveEnemies: 2,
    waveEvents: [
      {
        atRound: 3,
        action: 'add_ally',
        allyTemplate: PIERRE_TEMPLATE,
        narrative:
          'Pierre crashes through the smoke beside you, bayonet levelled. "Didn\'t think I\'d let you have all the fun?"',
        conditionNpcAlive: 'pierre',
      },
      {
        atRound: 5,
        action: 'add_ally',
        allyTemplate: JB_TEMPLATE,
        narrative:
          'Jean-Baptiste appears at your shoulder, pale-faced, bayonet shaking \u2014 but here. He came.',
        conditionNpcAlive: 'jean-baptiste',
      },
      {
        atRound: 7,
        action: 'increase_max_enemies',
        newMaxEnemies: 3,
        narrative: 'More Austrians pour in from the far side of the redoubt. The fight thickens.',
      },
    ],
  },
};
