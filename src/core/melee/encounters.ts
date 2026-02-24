import {
  BattleState,
  MeleeState,
  MeleeOpponent,
  MeleeAlly,
  MeleeStance,
  OpponentTemplate,
  AllyTemplate,
  EncounterConfig,
} from '../../types';

// ============================================================
// OPPONENT DEFINITIONS
// ============================================================

const CONSCRIPT_NAMES = ['Hans Vogl', 'Stefan Brenner', 'Josef Leitner', 'Friedrich Mayer'];
const LINE_NAMES = ['Karl Wenger', 'Johann Huber', 'Franz Egger', 'Heinrich Moser'];
const SERGEANT_NAMES = [
  'Feldwebel Gruber',
  'Feldwebel Steinbach',
  'Feldwebel Pichler',
  'Feldwebel Rainer',
];

// Terrain melee opponents (first melee — broken ground fighting)
const TERRAIN_ROSTER: OpponentTemplate[] = [
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
      'Another white coat scrambles over the low wall. Young — impossibly young. His musket is longer than he is tall. He screams as he comes.',
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

// Battery melee opponents (retaking overrun French battery — 4-man pool)
// Austrian infantry who captured the position, not artillerists
const BATTERY_ROSTER: OpponentTemplate[] = [
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

export function randRange(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function pickName(type: string): string {
  const pool =
    type === 'conscript' ? CONSCRIPT_NAMES : type === 'line' ? LINE_NAMES : SERGEANT_NAMES;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function makeOpponent(t: OpponentTemplate, usedNames?: Set<string>): MeleeOpponent {
  const health = randRange(t.health[0], t.health[1]);
  const stamina = randRange(t.stamina[0], t.stamina[1]);
  // Pick a unique personal name to avoid card lookup collisions
  let personalName: string;
  let fullName: string;
  let attempts = 0;
  do {
    personalName = pickName(t.type);
    fullName = `${t.name} — ${personalName}`;
    attempts++;
  } while (usedNames?.has(fullName) && attempts < 20);
  usedNames?.add(fullName);
  return {
    name: fullName,
    type: t.type,
    health,
    maxHealth: health,
    stamina,
    maxStamina: stamina,
    fatigue: 0,
    maxFatigue: stamina,
    strength: t.strength,
    stunned: false,
    stunnedTurns: 0,
    armInjured: false,
    legInjured: false,
    description: t.description,
  };
}

export function makeAlly(t: AllyTemplate): MeleeAlly {
  const health = randRange(t.health[0], t.health[1]);
  const stamina = randRange(t.stamina[0], t.stamina[1]);
  return {
    id: t.id,
    name: t.name,
    type: t.type,
    npcId: t.npcId,
    health,
    maxHealth: health,
    stamina,
    maxStamina: stamina,
    fatigue: 0,
    maxFatigue: stamina,
    strength: t.strength,
    elan: t.elan,
    alive: true,
    stunned: false,
    stunnedTurns: 0,
    armInjured: false,
    legInjured: false,
    description: t.description,
    personality: t.personality,
  };
}

// ============================================================
// ENCOUNTER CONFIGS
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
  description: 'Pierre fights beside you — blood on his sleeve, bayonet steady. An Arcole veteran.',
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
  description: 'Jean-Baptiste is pale, bayonet shaking — but here. He came.',
};

const ENCOUNTERS: Record<string, EncounterConfig> = {
  terrain: {
    context: 'terrain',
    opponents: TERRAIN_ROSTER,
    allies: [],
    maxExchanges: 12,
    initialActiveEnemies: 1,
    maxActiveEnemies: 1,
  },
  battery: {
    context: 'battery',
    opponents: BATTERY_ROSTER,
    allies: [],
    maxExchanges: 10,
    initialActiveEnemies: 1,
    maxActiveEnemies: 1,
  },
  battery_skirmish: {
    context: 'battery',
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
          'Jean-Baptiste appears at your shoulder, pale-faced, bayonet shaking — but here. He came.',
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

// ============================================================
// CREATE MELEE STATE
// ============================================================

export function createMeleeState(
  state: BattleState,
  context: 'terrain' | 'battery' = 'terrain',
  encounterKey?: string,
): MeleeState {
  const config = ENCOUNTERS[encounterKey ?? context];
  const roster = config
    ? config.opponents
    : context === 'battery'
      ? BATTERY_ROSTER
      : TERRAIN_ROSTER;
  const usedNames = new Set<string>();
  const opponents = roster.map((t) => makeOpponent(t, usedNames));
  const maxExchanges = config ? config.maxExchanges : context === 'battery' ? 10 : 12;
  const allies = config ? config.allies.map((t) => makeAlly(t)) : [];

  // Wave system: initial active enemies vs pool (all modes use this now)
  const initActive = config?.initialActiveEnemies ?? opponents.length;
  const activeEnemies = opponents.slice(0, initActive).map((_, i) => i);
  const enemyPool = opponents.slice(initActive).map((_, i) => i + initActive);
  const maxActiveEnemies = config?.maxActiveEnemies ?? opponents.length;

  return {
    opponents,
    currentOpponent: 0,
    playerStance: MeleeStance.Balanced,
    playerRiposte: false,
    playerStunned: 0,
    exchangeCount: 0,
    selectingStance: false,
    selectingTarget: false,
    killCount: 0,
    valorTempBonus: 0,
    maxExchanges,
    meleeContext: config ? config.context : context,
    lastOppAttacked: false,
    playerGuarding: false,
    oppGuarding: false,
    // Combat field state
    allies,
    activeEnemies,
    roundNumber: 0,
    playerTargetIndex: 0,
    roundLog: [],
    maxActiveEnemies,
    enemyPool,
    processedWaves: [],
    waveEvents: config?.waveEvents ?? [],
    reloadProgress: 0,
  };
}
