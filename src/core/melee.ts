import {
  BattleState, MeleeState, MeleeOpponent, MeleeAlly, MeleeStance, MeleeActionId, BodyPart,
  LogEntry, MoraleChange, MoraleThreshold, RoundAction, WaveEvent,
  OpponentTemplate, AllyTemplate, EncounterConfig,
} from '../types';
import { getFatigueDebuff } from './stats';
import { FatigueTier, getFatigueTier } from '../types';

// ============================================================
// OPPONENT DEFINITIONS
// ============================================================

const CONSCRIPT_NAMES = ['Hans Vogl', 'Stefan Brenner', 'Josef Leitner', 'Friedrich Mayer'];
const LINE_NAMES = ['Karl Wenger', 'Johann Huber', 'Franz Egger', 'Heinrich Moser'];
const SERGEANT_NAMES = ['Feldwebel Gruber', 'Feldwebel Steinbach', 'Feldwebel Pichler', 'Feldwebel Rainer'];

// Terrain melee opponents (first melee — broken ground fighting)
const TERRAIN_ROSTER: OpponentTemplate[] = [
  {
    name: 'Austrian conscript',
    type: 'conscript',
    health: [70, 85],
    stamina: [160, 200],
    strength: 40,
    description: 'He stumbles through the vineyard wall, white coat torn on the stones. Wide-eyed, shaking. His bayonet weaves like a drunk\'s sword.',
  },
  {
    name: 'Austrian conscript',
    type: 'conscript',
    health: [65, 80],
    stamina: [150, 190],
    strength: 40,
    description: 'Another white coat scrambles over the low wall. Young — impossibly young. His musket is longer than he is tall. He screams as he comes.',
  },
  {
    name: 'Austrian line infantryman',
    type: 'line',
    health: [80, 95],
    stamina: [180, 240],
    strength: 50,
    description: 'A career soldier pushes through the gap in the stone wall. Calm enough. Steel levelled, feet planted among the vines. He knows the drill.',
  },
  {
    name: 'Austrian veteran',
    type: 'veteran',
    health: [95, 115],
    stamina: [200, 260],
    strength: 65,
    description: 'This one is different. Steady hands, dead eyes, a scar across his jaw from some forgotten battle. He steps over the vineyard wall without hurrying.',
  },
];

// Battery melee opponents (charging the overrun battery — 6-man pool)
const BATTERY_ROSTER: OpponentTemplate[] = [
  {
    name: 'Austrian artillerist',
    type: 'conscript',
    health: [60, 75],
    stamina: [140, 180],
    strength: 40,
    description: 'An artillerist pressed into close combat, sponge-staff discarded for a short sword. He doesn\'t know how to fight like this. His eyes dart to the gun behind him.',
  },
  {
    name: 'Austrian gun crewman',
    type: 'conscript',
    health: [55, 70],
    stamina: [130, 170],
    strength: 35,
    description: 'A loader, powder-stained and half-deaf from the guns. He swings a rammer like a club — clumsy, desperate, dangerous only by weight.',
  },
  {
    name: 'Austrian infantry guard',
    type: 'line',
    health: [80, 95],
    stamina: [180, 240],
    strength: 50,
    description: 'Infantry assigned to guard the captured battery. He stands between you and the guns, bayonet level. Professional. Determined.',
  },
  {
    name: 'Austrian grenadier',
    type: 'veteran',
    health: [90, 110],
    stamina: [200, 260],
    strength: 60,
    description: 'A grenadier from the battery escort. Tall, bearskin cap, sabre-bayonet. He fights with the economy of a man who has done this many times before.',
  },
  {
    name: 'Austrian infantry guard',
    type: 'line',
    health: [75, 90],
    stamina: [170, 220],
    strength: 48,
    description: 'Another white-coat, fighting to hold the redoubt. Younger than the first. Just as stubborn.',
  },
  {
    name: 'Austrian battery sergeant',
    type: 'sergeant',
    health: [100, 125],
    stamina: [220, 280],
    strength: 75,
    description: 'The battery commander. A big man with powder-blackened hands and the calm of someone who has loaded cannon under fire for twenty years. He holds a cavalry sabre. He will not give up these guns.',
  },
];

function randRange(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function pickName(type: string): string {
  const pool = type === 'conscript' ? CONSCRIPT_NAMES : type === 'line' ? LINE_NAMES : SERGEANT_NAMES;
  return pool[Math.floor(Math.random() * pool.length)];
}

function makeOpponent(t: OpponentTemplate): MeleeOpponent {
  const health = randRange(t.health[0], t.health[1]);
  const stamina = randRange(t.stamina[0], t.stamina[1]);
  const personalName = pickName(t.type);
  return {
    name: `${personalName} — ${t.name}`, type: t.type,
    health, maxHealth: health, stamina, maxStamina: stamina,
    fatigue: 0, maxFatigue: stamina,
    strength: t.strength,
    stunned: false, stunnedTurns: 0,
    armInjured: false, legInjured: false, description: t.description,
  };
}

function makeAlly(t: AllyTemplate): MeleeAlly {
  const health = randRange(t.health[0], t.health[1]);
  const stamina = randRange(t.stamina[0], t.stamina[1]);
  return {
    id: t.id, name: t.name, type: t.type, npcId: t.npcId,
    health, maxHealth: health, stamina, maxStamina: stamina,
    fatigue: 0, maxFatigue: stamina,
    strength: t.strength, elan: t.elan,
    alive: true, stunned: false, stunnedTurns: 0,
    armInjured: false, legInjured: false,
    description: t.description, personality: t.personality,
  };
}

// ============================================================
// ENCOUNTER CONFIGS
// ============================================================

const PIERRE_TEMPLATE: AllyTemplate = {
  id: 'pierre', name: 'Pierre', type: 'named', npcId: 'pierre',
  health: [75, 90], stamina: [180, 220],
  strength: 50, elan: 45,
  personality: 'aggressive',
  description: 'Pierre fights beside you — blood on his sleeve, bayonet steady. An Arcole veteran.',
};

const JB_TEMPLATE: AllyTemplate = {
  id: 'jean-baptiste', name: 'Jean-Baptiste', type: 'named', npcId: 'jean-baptiste',
  health: [60, 75], stamina: [140, 180],
  strength: 38, elan: 30,
  personality: 'cautious',
  description: 'Jean-Baptiste is pale, bayonet shaking — but here. He came.',
};

export const ENCOUNTERS: Record<string, EncounterConfig> = {
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
        narrative: 'Pierre crashes through the smoke beside you, bayonet levelled. "Didn\'t think I\'d let you have all the fun?"',
        conditionNpcAlive: 'pierre',
      },
      {
        atRound: 5,
        action: 'add_ally',
        allyTemplate: JB_TEMPLATE,
        narrative: 'Jean-Baptiste appears at your shoulder, pale-faced, bayonet shaking — but here. He came.',
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
  const roster = config ? config.opponents : (context === 'battery' ? BATTERY_ROSTER : TERRAIN_ROSTER);
  const opponents = roster.map(t => makeOpponent(t));
  const maxExchanges = config ? config.maxExchanges : (context === 'battery' ? 10 : 12);
  const allies = config ? config.allies.map(t => makeAlly(t)) : [];

  // Wave system: initial active enemies vs pool (all modes use this now)
  const initActive = config?.initialActiveEnemies ?? opponents.length;
  const activeEnemies = opponents.slice(0, initActive).map((_, i) => i);
  const enemyPool = opponents.slice(initActive).map((_, i) => i + initActive);
  const maxActiveEnemies = config?.maxActiveEnemies ?? opponents.length;

  return {
    opponents, currentOpponent: 0,
    playerStance: MeleeStance.Balanced,
    playerRiposte: false, playerStunned: 0,
    exchangeCount: 0, selectingStance: false, selectingTarget: false,
    killCount: 0, valorTempBonus: 0,
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

// ============================================================
// CONSTANTS
// ============================================================

const STANCE_MODS: Record<MeleeStance, { attack: number; defense: number; staminaCost: number }> = {
  [MeleeStance.Aggressive]: { attack: 0.20, defense: -0.15, staminaCost: 14 },
  [MeleeStance.Balanced]:   { attack: 0,    defense: 0,     staminaCost: 10 },
  [MeleeStance.Defensive]:  { attack: -0.15, defense: 0.20, staminaCost: 8 },
};

interface ActionDef {
  stamina: number;
  hitBonus: number;
  damageMod: number;
  isAttack: boolean;
  stunBonus: number;
}

const ACTION_DEFS: Record<MeleeActionId, ActionDef> = {
  [MeleeActionId.BayonetThrust]:  { stamina: 20,  hitBonus: 0,    damageMod: 1.0, isAttack: true,  stunBonus: 0    },
  [MeleeActionId.AggressiveLunge]:{ stamina: 38,  hitBonus: -0.10, damageMod: 1.5, isAttack: true,  stunBonus: 0    },
  [MeleeActionId.ButtStrike]:     { stamina: 26,  hitBonus: 0.15, damageMod: 0,   isAttack: true,  stunBonus: 0.25 },
  [MeleeActionId.Feint]:          { stamina: 14,  hitBonus: 0.10, damageMod: 0,   isAttack: true,  stunBonus: 0    },
  [MeleeActionId.Guard]:          { stamina: 12,  hitBonus: 0,    damageMod: 0,   isAttack: false, stunBonus: 0    },
  [MeleeActionId.Respite]:        { stamina: -35, hitBonus: 0,    damageMod: 0,   isAttack: false, stunBonus: 0    },
  [MeleeActionId.Shoot]:          { stamina: 8,   hitBonus: 0,    damageMod: 2.0, isAttack: true,  stunBonus: 0    },
  [MeleeActionId.Reload]:         { stamina: 14,  hitBonus: 0,    damageMod: 0,   isAttack: false, stunBonus: 0    },
  [MeleeActionId.SecondWind]:     { stamina: 0,   hitBonus: 0,    damageMod: 0,   isAttack: false, stunBonus: 0    },
  [MeleeActionId.UseCanteen]:    { stamina: 0,   hitBonus: 0,    damageMod: 0,   isAttack: false, stunBonus: 0    },
};

/** Fraction of damage taken that accumulates as fatigue (getting hit wears you down) */
const DAMAGE_FATIGUE_RATE = 0.25;

const BODY_PART_DEFS: Record<BodyPart, { hitMod: number; damageRange: [number, number] }> = {
  [BodyPart.Head]:  { hitMod: -0.25, damageRange: [25, 35] },
  [BodyPart.Torso]: { hitMod: 0,     damageRange: [15, 25] },
  [BodyPart.Arms]:  { hitMod: -0.10, damageRange: [10, 15] },
  [BodyPart.Legs]:  { hitMod: -0.15, damageRange: [10, 20] },
};

// ============================================================
// AVAILABLE ACTIONS
// ============================================================

interface MeleeActionChoice {
  id: MeleeActionId;
  label: string;
  description: string;
  available: boolean;
  staminaCost: number;
}

export function getMeleeActions(state: BattleState): MeleeActionChoice[] {
  const stamina = state.player.stamina;
  const musketLoaded = state.player.musketLoaded;
  const morale = state.player.moraleThreshold;

  const actions: MeleeActionChoice[] = [
    { id: MeleeActionId.BayonetThrust,   label: 'Bayonet Thrust',   description: 'Standard thrust. Reliable.',                             available: stamina >= 20, staminaCost: 20 },
    { id: MeleeActionId.AggressiveLunge,  label: 'Aggressive Lunge', description: 'Wild lunge. 1.5x damage but harder to land.',            available: stamina >= 38, staminaCost: 38 },
    { id: MeleeActionId.ButtStrike,       label: 'Butt Strike',      description: 'Musket stock. Drains stamina, chance to stun. Strength scales both.', available: stamina >= 26, staminaCost: 26 },
    { id: MeleeActionId.Feint,            label: 'Feint',            description: 'Fake out. No wound, but drains stamina and exhausts.',   available: stamina >= 14, staminaCost: 14 },
    { id: MeleeActionId.Guard,            label: 'Guard',            description: 'Block chance (élan-based). Failed blocks reduce damage.',available: true,          staminaCost: 12 },
    { id: MeleeActionId.Respite,          label: 'Catch Breath',     description: 'Recover 35 stamina. Opponent gets a free attack.',       available: true,          staminaCost: -35 },
    { id: MeleeActionId.SecondWind,        label: 'Second Wind',      description: 'Endurance roll to reduce fatigue. Opponent gets a free attack.', available: state.player.fatigue > 0, staminaCost: 0 },
  ];

  // Add Shoot action only when musket is loaded
  if (musketLoaded) {
    actions.splice(0, 0, {
      id: MeleeActionId.Shoot,
      label: 'Shoot',
      description: 'Fire your loaded musket. 2x damage, 25% head crit. Cannot be blocked.',
      available: true,
      staminaCost: 8,
    });
  }

  // Add Reload when musket is empty
  if (!musketLoaded) {
    const ms = state.meleeState;
    const progress = ms ? ms.reloadProgress : 0;
    actions.push({
      id: MeleeActionId.Reload,
      label: progress === 0 ? 'Reload (1/2)' : 'Reload (2/2)',
      description: progress === 0
        ? 'Bite cartridge, pour powder. Opponent gets a free attack.'
        : 'Ram ball, prime pan. Opponent gets a free attack. Musket ready.',
      available: stamina >= 14,
      staminaCost: 14,
    });
  }

  // At 0 stamina: forced respite only
  if (stamina <= 0) return actions.filter(a => a.id === MeleeActionId.Respite);

  // Morale gating — low morale restricts aggressive actions
  if (morale === MoraleThreshold.Shaken) {
    // Shaken: no Aggressive Lunge
    for (const a of actions) {
      if (a.id === MeleeActionId.AggressiveLunge) a.available = false;
    }
  } else if (morale === MoraleThreshold.Wavering) {
    // Wavering: only Thrust, Guard, Respite, SecondWind, Shoot, Reload
    for (const a of actions) {
      if (![MeleeActionId.BayonetThrust, MeleeActionId.Guard, MeleeActionId.Respite, MeleeActionId.SecondWind, MeleeActionId.Shoot, MeleeActionId.Reload].includes(a.id)) {
        a.available = false;
      }
    }
  } else if (morale === MoraleThreshold.Breaking) {
    // Breaking: only Guard, Respite, SecondWind, Reload (survival instinct)
    for (const a of actions) {
      if (![MeleeActionId.Guard, MeleeActionId.Respite, MeleeActionId.SecondWind, MeleeActionId.Reload].includes(a.id)) {
        a.available = false;
      }
    }
  }

  return actions;
}

// ============================================================
// AI
// ============================================================

interface AIDecision { action: MeleeActionId; bodyPart: BodyPart; }

let playerHistory: MeleeActionId[] = [];
export function resetMeleeHistory() { playerHistory = []; }

function chooseMeleeAI(opp: MeleeOpponent, state: BattleState): AIDecision {
  if (opp.stunned) return { action: MeleeActionId.Guard, bodyPart: BodyPart.Torso };
  if (opp.stamina <= 15) return { action: MeleeActionId.Respite, bodyPart: BodyPart.Torso };

  // Fatigue-driven Second Wind: conscripts desperate earlier, veterans push harder
  const fatiguePct = opp.maxFatigue > 0 ? opp.fatigue / opp.maxFatigue : 0;
  const swThreshold = opp.type === 'conscript' ? 0.40 : 0.50;
  if (fatiguePct >= swThreshold && Math.random() < 0.35) {
    return { action: MeleeActionId.SecondWind, bodyPart: BodyPart.Torso };
  }

  switch (opp.type) {
    case 'conscript': return conscriptAI(opp);
    case 'line':      return lineAI(opp, state);
    case 'veteran':   return veteranAI(opp, state);
    case 'sergeant':  return sergeantAI(opp, state);
  }
}

function conscriptAI(opp: MeleeOpponent): AIDecision {
  const r = Math.random();
  const hPct = opp.health / opp.maxHealth;
  if (hPct < 0.3) {
    // Panic: 60% flee instinct (respite), 40% desperate lunge
    return r < 0.60
      ? { action: MeleeActionId.Respite, bodyPart: BodyPart.Torso }
      : { action: MeleeActionId.AggressiveLunge, bodyPart: BodyPart.Torso };
  }
  if (r < 0.45) return { action: MeleeActionId.BayonetThrust, bodyPart: BodyPart.Torso };
  return { action: MeleeActionId.Guard, bodyPart: BodyPart.Torso };
}

function lineAI(opp: MeleeOpponent, state: BattleState): AIDecision {
  const r = Math.random();
  const sPct = opp.stamina / opp.maxStamina;
  // 60% torso, 20% arms, 15% legs, 5% head
  const tRoll = Math.random();
  const target = tRoll < 0.60 ? BodyPart.Torso : tRoll < 0.80 ? BodyPart.Arms : tRoll < 0.95 ? BodyPart.Legs : BodyPart.Head;

  // Punish player respite with lunge
  const recent = playerHistory.slice(-2);
  if (recent.length > 0 && recent[recent.length - 1] === MeleeActionId.Respite) {
    return { action: MeleeActionId.AggressiveLunge, bodyPart: target };
  }

  if (sPct < 0.3) {
    return r < 0.5
      ? { action: MeleeActionId.BayonetThrust, bodyPart: target }
      : { action: MeleeActionId.Respite, bodyPart: BodyPart.Torso };
  }
  if (r < 0.35) return { action: MeleeActionId.BayonetThrust, bodyPart: target };
  if (r < 0.55) return { action: MeleeActionId.AggressiveLunge, bodyPart: target };
  if (r < 0.70) return { action: MeleeActionId.ButtStrike, bodyPart: target };
  return { action: MeleeActionId.Guard, bodyPart: BodyPart.Torso };
}

function veteranAI(opp: MeleeOpponent, state: BattleState): AIDecision {
  const r = Math.random();
  const recent = playerHistory.slice(-3);
  const defCount = recent.filter(a => a === MeleeActionId.Guard).length;
  const atkCount = recent.filter(a => a === MeleeActionId.AggressiveLunge || a === MeleeActionId.BayonetThrust).length;

  // Pattern reading: counter repeated actions
  if (recent.length >= 2 && recent[recent.length - 1] === recent[recent.length - 2]) {
    const repeated = recent[recent.length - 1];
    if (repeated === MeleeActionId.Guard) return { action: MeleeActionId.Feint, bodyPart: BodyPart.Head };
    if (repeated === MeleeActionId.BayonetThrust || repeated === MeleeActionId.AggressiveLunge) return { action: MeleeActionId.Guard, bodyPart: BodyPart.Torso };
  }

  // Adapt to patterns
  if (defCount >= 2) return { action: MeleeActionId.Feint, bodyPart: BodyPart.Head };
  if (atkCount >= 2) return { action: MeleeActionId.Guard, bodyPart: BodyPart.Torso };

  const targets: BodyPart[] = [BodyPart.Head, BodyPart.Torso, BodyPart.Arms];
  const target = targets[Math.floor(Math.random() * targets.length)];

  if (r < 0.25) return { action: MeleeActionId.BayonetThrust, bodyPart: target };
  if (r < 0.45) return { action: MeleeActionId.AggressiveLunge, bodyPart: target };
  if (r < 0.55) return { action: MeleeActionId.Feint, bodyPart: target };
  if (r < 0.70) return { action: MeleeActionId.ButtStrike, bodyPart: target };
  return { action: MeleeActionId.Guard, bodyPart: BodyPart.Torso };
}

function sergeantAI(opp: MeleeOpponent, state: BattleState): AIDecision {
  const r = Math.random();
  const recent = playerHistory.slice(-4); // 4-move window (wider than veteran)
  const defCount = recent.filter(a => a === MeleeActionId.Guard).length;
  const atkCount = recent.filter(a => a === MeleeActionId.AggressiveLunge || a === MeleeActionId.BayonetThrust).length;

  // Pattern reading: counter repeated actions (same as veteran)
  if (recent.length >= 2 && recent[recent.length - 1] === recent[recent.length - 2]) {
    const repeated = recent[recent.length - 1];
    if (repeated === MeleeActionId.Guard) return { action: MeleeActionId.Feint, bodyPart: BodyPart.Head };
    if (repeated === MeleeActionId.BayonetThrust || repeated === MeleeActionId.AggressiveLunge) return { action: MeleeActionId.Guard, bodyPart: BodyPart.Torso };
  }

  // Reads stance patterns: if player always Defensive, Feint→Lunge combo
  if (state.meleeState?.playerStance === MeleeStance.Defensive && defCount >= 2) {
    return r < 0.6
      ? { action: MeleeActionId.Feint, bodyPart: BodyPart.Head }
      : { action: MeleeActionId.AggressiveLunge, bodyPart: BodyPart.Torso };
  }

  // Adapt to patterns
  if (defCount >= 2) return { action: MeleeActionId.Feint, bodyPart: BodyPart.Head };
  if (atkCount >= 2) return { action: MeleeActionId.Guard, bodyPart: BodyPart.Torso };

  // Never uses Respite until <10% stamina (discipline/pride)
  if (opp.stamina / opp.maxStamina < 0.10) {
    return { action: MeleeActionId.Respite, bodyPart: BodyPart.Torso };
  }

  const targets: BodyPart[] = [BodyPart.Head, BodyPart.Torso, BodyPart.Arms];
  const target = targets[Math.floor(Math.random() * targets.length)];

  // Higher lunge usage (30% vs veteran's 20%)
  if (r < 0.20) return { action: MeleeActionId.BayonetThrust, bodyPart: target };
  if (r < 0.50) return { action: MeleeActionId.AggressiveLunge, bodyPart: target };
  if (r < 0.60) return { action: MeleeActionId.Feint, bodyPart: target };
  if (r < 0.72) return { action: MeleeActionId.ButtStrike, bodyPart: target };
  return { action: MeleeActionId.Guard, bodyPart: BodyPart.Torso };
}

// ============================================================
// ALLY AI (personality-driven action selection)
// ============================================================

interface AllyAIDecision {
  action: MeleeActionId;
  bodyPart: BodyPart;
  targetIndex: number;
}

function chooseAllyAI(
  ally: MeleeAlly,
  enemies: MeleeOpponent[],
  liveEnemyIndices: number[],
): AllyAIDecision {
  if (liveEnemyIndices.length === 0) {
    return { action: MeleeActionId.Guard, bodyPart: BodyPart.Torso, targetIndex: 0 };
  }

  // Stunned allies guard
  if (ally.stunned) {
    return { action: MeleeActionId.Guard, bodyPart: BodyPart.Torso, targetIndex: liveEnemyIndices[0] };
  }

  // Low stamina: catch breath
  if (ally.stamina <= 15) {
    return { action: MeleeActionId.Respite, bodyPart: BodyPart.Torso, targetIndex: liveEnemyIndices[0] };
  }

  // High fatigue: attempt Second Wind
  const allyFatiguePct = ally.maxFatigue > 0 ? ally.fatigue / ally.maxFatigue : 0;
  if (allyFatiguePct >= 0.50 && Math.random() < 0.30) {
    return { action: MeleeActionId.SecondWind, bodyPart: BodyPart.Torso, targetIndex: liveEnemyIndices[0] };
  }

  const hPct = ally.health / ally.maxHealth;
  const r = Math.random();

  // Random body part weighted toward torso
  const tRoll = Math.random();
  const bp = tRoll < 0.55 ? BodyPart.Torso : tRoll < 0.75 ? BodyPart.Arms : tRoll < 0.90 ? BodyPart.Legs : BodyPart.Head;

  switch (ally.personality) {
    case 'aggressive': {
      // Pierre-type: prefers attacks, Lunge when healthy, focuses weakest enemy
      const weakestIdx = findWeakestEnemy(enemies, liveEnemyIndices);
      if (hPct > 0.5 && r < 0.40) return { action: MeleeActionId.AggressiveLunge, bodyPart: bp, targetIndex: weakestIdx };
      if (r < 0.75) return { action: MeleeActionId.BayonetThrust, bodyPart: bp, targetIndex: weakestIdx };
      if (r < 0.85) return { action: MeleeActionId.ButtStrike, bodyPart: bp, targetIndex: weakestIdx };
      return { action: MeleeActionId.Guard, bodyPart: BodyPart.Torso, targetIndex: weakestIdx };
    }
    case 'balanced': {
      // Mix attack and guard, target weakest
      const weakestIdx = findWeakestEnemy(enemies, liveEnemyIndices);
      if (hPct < 0.3) {
        return r < 0.5
          ? { action: MeleeActionId.Guard, bodyPart: BodyPart.Torso, targetIndex: weakestIdx }
          : { action: MeleeActionId.BayonetThrust, bodyPart: bp, targetIndex: weakestIdx };
      }
      if (r < 0.35) return { action: MeleeActionId.BayonetThrust, bodyPart: bp, targetIndex: weakestIdx };
      if (r < 0.55) return { action: MeleeActionId.AggressiveLunge, bodyPart: bp, targetIndex: weakestIdx };
      if (r < 0.75) return { action: MeleeActionId.Guard, bodyPart: BodyPart.Torso, targetIndex: weakestIdx };
      return { action: MeleeActionId.ButtStrike, bodyPart: bp, targetIndex: weakestIdx };
    }
    case 'cautious': {
      // JB-type: more guards, targets whoever seems safest
      const weakestIdx = findWeakestEnemy(enemies, liveEnemyIndices);
      if (hPct < 0.4 || r < 0.35) {
        return { action: MeleeActionId.Guard, bodyPart: BodyPart.Torso, targetIndex: weakestIdx };
      }
      if (r < 0.60) return { action: MeleeActionId.BayonetThrust, bodyPart: bp, targetIndex: weakestIdx };
      if (r < 0.75) return { action: MeleeActionId.Guard, bodyPart: BodyPart.Torso, targetIndex: weakestIdx };
      return { action: MeleeActionId.ButtStrike, bodyPart: bp, targetIndex: weakestIdx };
    }
  }
}

function findWeakestEnemy(enemies: MeleeOpponent[], liveIndices: number[]): number {
  let weakest = liveIndices[0];
  let lowestHpPct = 1;
  for (const idx of liveIndices) {
    const pct = enemies[idx].health / enemies[idx].maxHealth;
    if (pct < lowestHpPct) { lowestHpPct = pct; weakest = idx; }
  }
  return weakest;
}

// ============================================================
// ENEMY TARGET SELECTION (type-based priority)
// ============================================================

interface EnemyTargetRef {
  type: 'player' | 'ally';
  id: string;
  name: string;
}

function chooseEnemyTarget(
  opp: MeleeOpponent,
  player: BattleState['player'],
  allies: MeleeAlly[],
): EnemyTargetRef {
  const playerRef: EnemyTargetRef = { type: 'player', id: 'player', name: player.name };
  const liveAllies = allies.filter(a => a.alive && a.health > 0);
  if (liveAllies.length === 0) return playerRef;

  const allTargets: (EnemyTargetRef & { hpPct: number })[] = [
    { ...playerRef, hpPct: player.health / player.maxHealth },
    ...liveAllies.map(a => ({
      type: 'ally' as const, id: a.id, name: a.name, hpPct: a.health / a.maxHealth,
    })),
  ];

  switch (opp.type) {
    case 'conscript': {
      // Biased toward weakest target (easy kill instinct)
      allTargets.sort((a, b) => a.hpPct - b.hpPct);
      return Math.random() < 0.65 ? allTargets[0] : allTargets[Math.floor(Math.random() * allTargets.length)];
    }
    case 'line': {
      // Random target, slight bias toward player
      return Math.random() < 0.45 ? playerRef : allTargets[Math.floor(Math.random() * allTargets.length)];
    }
    case 'veteran': {
      // Targets most dangerous (highest HP = most threatening)
      allTargets.sort((a, b) => b.hpPct - a.hpPct);
      return Math.random() < 0.60 ? allTargets[0] : allTargets[Math.floor(Math.random() * allTargets.length)];
    }
    case 'sergeant': {
      // Prioritizes the player (break the leader)
      return Math.random() < 0.70 ? playerRef : allTargets[Math.floor(Math.random() * allTargets.length)];
    }
    default:
      return playerRef;
  }
}

// ============================================================
// HIT / DAMAGE CALCULATION
// ============================================================

export function calcHitChance(
  skillStat: number, morale: number, maxMorale: number,
  stance: MeleeStance, action: MeleeActionId,
  bodyPart: BodyPart, riposte: boolean, fatigue: number, maxFatigue: number,
): number {
  const moralePenalty = (1 - morale / maxMorale) * 0.15;
  const staminaDebuffPct = getFatigueDebuff(fatigue, maxFatigue) / 100; // 0 / -0.05 / -0.15 / -0.25
  const raw = 0.35
    + STANCE_MODS[stance].attack
    + ACTION_DEFS[action].hitBonus
    + BODY_PART_DEFS[bodyPart].hitMod
    + (riposte ? 0.15 : 0)
    + skillStat / 120
    - moralePenalty
    + staminaDebuffPct; // negative values reduce hit chance
  return Math.max(0.05, Math.min(0.95, raw));
}

function calcDamage(action: MeleeActionId, bodyPart: BodyPart, fatigue: number, maxFatigue: number, strength: number = 40): number {
  const [lo, hi] = BODY_PART_DEFS[bodyPart].damageRange;
  const strengthMod = action === MeleeActionId.Shoot ? 1.0 : 0.75 + strength / 200;
  const fatigueTier = getFatigueTier(fatigue, maxFatigue);
  let dmg = Math.round(randRange(lo, hi) * ACTION_DEFS[action].damageMod * strengthMod);
  if (fatigueTier === FatigueTier.Fatigued || fatigueTier === FatigueTier.Exhausted) dmg = Math.round(dmg * 0.75);
  return Math.max(1, dmg);
}

function oppSpendStamina(opp: MeleeOpponent, def: ActionDef) {
  const legMult = opp.legInjured ? 1.5 : 1.0;
  const cost = Math.round(def.stamina * legMult);
  opp.stamina = Math.max(0, opp.stamina - cost);
  if (cost > 0) opp.fatigue = Math.min(opp.maxFatigue, opp.fatigue + Math.round(cost * 0.5));
}

// ============================================================
// GENERIC ATTACK RESOLUTION
// ============================================================

// Unified combatant interface for generic attack resolution
interface CombatantRef {
  name: string;
  health: number;
  maxHealth: number;
  stamina: number;
  maxStamina: number;
  fatigue: number;
  maxFatigue: number;
  strength: number;
  elan: number;
  type: string; // 'player' | 'conscript' | 'line' | 'veteran' | 'sergeant' | 'ally'
  stunned: boolean;
  stunnedTurns: number;
  armInjured: boolean;
  legInjured: boolean;
}

interface GenericAttackResult {
  hit: boolean;
  damage: number;
  staminaDrain: number;  // stamina drained from target (butt strike)
  fatigueDrain: number;  // fatigue added to target (butt strike)
  special: string; // e.g. ' Stunned!', ' Arm injured.'
  targetKilled: boolean;
  log: LogEntry[];
  roundAction: RoundAction;
}

// Map player to CombatantRef
function playerToCombatant(p: BattleState['player']): CombatantRef {
  return {
    name: p.name, health: p.health, maxHealth: p.maxHealth,
    stamina: p.stamina, maxStamina: p.maxStamina,
    fatigue: p.fatigue, maxFatigue: p.maxFatigue,
    strength: p.strength, elan: p.elan, type: 'player',
    stunned: false, stunnedTurns: 0,
    armInjured: false, legInjured: false,
  };
}

// Map opponent to CombatantRef
function oppToCombatant(o: MeleeOpponent): CombatantRef {
  return {
    name: o.name, health: o.health, maxHealth: o.maxHealth,
    stamina: o.stamina, maxStamina: o.maxStamina,
    fatigue: o.fatigue, maxFatigue: o.maxFatigue,
    strength: o.strength, elan: 35, type: o.type,
    stunned: o.stunned, stunnedTurns: o.stunnedTurns,
    armInjured: o.armInjured, legInjured: o.legInjured,
  };
}

// Map ally to CombatantRef
function allyToCombatant(a: MeleeAlly): CombatantRef {
  return {
    name: a.name, health: a.health, maxHealth: a.maxHealth,
    stamina: a.stamina, maxStamina: a.maxStamina,
    fatigue: a.fatigue, maxFatigue: a.maxFatigue,
    strength: a.strength, elan: a.elan, type: 'ally',
    stunned: a.stunned, stunnedTurns: a.stunnedTurns,
    armInjured: a.armInjured, legInjured: a.legInjured,
  };
}

// Base hit rates for different combatant types when attacking
const BASE_HIT_RATES: Record<string, number> = {
  player: 0.35,    // player uses calcHitChance instead
  ally: 0.45,      // allies use elan-based calculation
  conscript: 0.35,
  line: 0.45,
  veteran: 0.55,
  sergeant: 0.60,
};

/**
 * Generic attack resolution: any combatant attacks any other.
 * Player attacks still use the player-specific calcHitChance.
 */
export function resolveGenericAttack(
  attacker: CombatantRef,
  target: CombatantRef,
  targetRef: MeleeOpponent | MeleeAlly | null, // mutable ref for applying status effects
  action: MeleeActionId,
  bodyPart: BodyPart,
  turn: number,
  opts: {
    side: 'player' | 'ally' | 'enemy';
    stance?: MeleeStance;
    riposte?: boolean;
    freeAttack?: boolean;
    targetGuarding?: boolean;
    targetBlockChance?: number;
  },
): GenericAttackResult {
  const log: LogEntry[] = [];
  const aDef = ACTION_DEFS[action];
  const shortName = attacker.name.split(' — ')[0];
  const targetShort = target.name.split(' — ')[0];

  // Non-attack actions
  if (action === MeleeActionId.Respite) {
    log.push({ turn, type: 'result', text: `${shortName} catches breath.` });
    return {
      hit: false, damage: 0, staminaDrain: 0, fatigueDrain: 0, special: '', targetKilled: false, log,
      roundAction: { actorName: attacker.name, actorSide: opts.side, targetName: target.name, action, hit: false, damage: 0 },
    };
  }
  if (action === MeleeActionId.Guard) {
    log.push({ turn, type: 'result', text: `${shortName} guards.` });
    return {
      hit: false, damage: 0, staminaDrain: 0, fatigueDrain: 0, special: '', targetKilled: false, log,
      roundAction: { actorName: attacker.name, actorSide: opts.side, targetName: target.name, action, hit: false, damage: 0 },
    };
  }
  if (!aDef.isAttack) {
    return {
      hit: false, damage: 0, staminaDrain: 0, fatigueDrain: 0, special: '', targetKilled: false, log,
      roundAction: { actorName: attacker.name, actorSide: opts.side, targetName: target.name, action, hit: false, damage: 0 },
    };
  }

  // Calculate hit
  let hitChance: number;
  if (attacker.type === 'player' && opts.stance) {
    // Player uses the full calcHitChance with stance
    const skillStat = action === MeleeActionId.Shoot ? attacker.elan : attacker.elan;
    hitChance = calcHitChance(
      skillStat, attacker.health, attacker.maxHealth, // use health as proxy for morale in generic context
      opts.stance, action, bodyPart, opts.riposte || false,
      attacker.stamina, attacker.maxStamina,
    );
  } else if (attacker.type === 'ally') {
    // Ally: elan-based hit
    const baseHit = 0.40 + attacker.elan / 200;
    const armPen = attacker.armInjured ? 0.10 : 0;
    hitChance = Math.max(0.10, Math.min(0.80, baseHit + aDef.hitBonus + BODY_PART_DEFS[bodyPart].hitMod - armPen));
  } else {
    // Enemy: type-based hit
    const baseHit = BASE_HIT_RATES[attacker.type] ?? 0.45;
    const armPen = attacker.armInjured ? 0.10 : 0;
    hitChance = Math.max(0.15, Math.min(0.85, baseHit + aDef.hitBonus + BODY_PART_DEFS[bodyPart].hitMod - armPen));
  }

  const hit = Math.random() < hitChance;

  if (!hit) {
    const missText = opts.side === 'player'
      ? `Miss.`
      : `${shortName} misses ${targetShort}.`;
    log.push({ turn, type: 'result', text: missText });
    return {
      hit: false, damage: 0, staminaDrain: 0, fatigueDrain: 0, special: '', targetKilled: false, log,
      roundAction: { actorName: attacker.name, actorSide: opts.side, targetName: target.name, action, bodyPart, hit: false, damage: 0 },
    };
  }

  // Hit connects — check if target blocks (Guard only)
  if (opts.targetGuarding && opts.targetBlockChance) {
    if (Math.random() < opts.targetBlockChance) {
      log.push({ turn, type: 'result', text: `${shortName} attacks ${targetShort} — blocked!` });
      return {
        hit: false, damage: 0, staminaDrain: 0, fatigueDrain: 0, special: '', targetKilled: false, log,
        roundAction: { actorName: attacker.name, actorSide: opts.side, targetName: target.name, action, bodyPart, hit: false, damage: 0, blocked: true },
      };
    }
    log.push({ turn, type: 'action', text: 'Guard broken.' });
    // Failed block — damage reduced by 15% (applied below)
  }

  // === BUTT STRIKE: stamina drain + stun chance, no HP damage ===
  if (action === MeleeActionId.ButtStrike) {
    const stDrain = Math.round(randRange(10, 15) * (0.75 + attacker.strength / 200));
    let special = '';
    const stunChance = aDef.stunBonus + attacker.strength / 400;
    if (Math.random() < stunChance && targetRef) {
      special = ' Stunned!';
      targetRef.stunned = true; targetRef.stunnedTurns = 1;
    }

    const hitText = opts.side === 'player'
      ? `Butt strike connects.${special}`
      : `${shortName} smashes ${targetShort} with the stock.${special}`;
    log.push({ turn, type: opts.side === 'enemy' ? 'event' : 'result', text: hitText });

    return {
      hit: true, damage: 0, staminaDrain: stDrain, fatigueDrain: 0, special, targetKilled: false, log,
      roundAction: {
        actorName: attacker.name, actorSide: opts.side, targetName: target.name,
        action, bodyPart, hit: true, damage: 0, special: special || undefined,
      },
    };
  }

  // === FEINT: stamina/fatigue drain, no HP damage ===
  if (action === MeleeActionId.Feint) {
    const stDrain = Math.round(randRange(25, 35));
    const ftDrain = Math.round(randRange(20, 30));

    const hitText = opts.side === 'player'
      ? `Feint connects. ${targetShort} reacts to the fake.`
      : `${shortName} feints — ${targetShort} falls for it.`;
    log.push({ turn, type: opts.side === 'enemy' ? 'event' : 'result', text: hitText });

    return {
      hit: true, damage: 0, staminaDrain: stDrain, fatigueDrain: ftDrain, special: '', targetKilled: false, log,
      roundAction: {
        actorName: attacker.name, actorSide: opts.side, targetName: target.name,
        action, bodyPart, hit: true, damage: 0,
      },
    };
  }

  // === NORMAL ATTACKS: HP damage ===
  let dmg = calcDamage(action, bodyPart, attacker.fatigue, attacker.maxFatigue, attacker.strength);
  if (opts.freeAttack) dmg = Math.round(dmg * 0.7);
  if (opts.targetGuarding) dmg = Math.round(dmg * 0.85);

  let special = '';
  // Head effects
  if (bodyPart === BodyPart.Head) {
    if (Math.random() < 0.10) {
      special = ' Killed.';
    } else if (Math.random() < 0.35 + aDef.stunBonus) {
      special = ' Stunned!';
      if (targetRef) {
        targetRef.stunned = true; targetRef.stunnedTurns = 1;
      }
    }
  }
  // Arm injury
  if (bodyPart === BodyPart.Arms && Math.random() < 0.15 && targetRef) {
    targetRef.armInjured = true;
    special = ' Arm injured.';
  }
  // Legs injury
  if (bodyPart === BodyPart.Legs && Math.random() < 0.10 && targetRef) {
    targetRef.legInjured = true;
    special = ' Leg injured.';
  }

  const targetKilled = special === ' Killed.';

  const hitText = opts.side === 'player'
    ? `Hit. ${PART_NAMES[bodyPart]}.${special}`
    : `${shortName} hits ${targetShort}. ${PART_NAMES[bodyPart]}.${special}`;
  log.push({ turn, type: opts.side === 'enemy' ? 'event' : 'result', text: hitText });

  return {
    hit: true, damage: dmg, staminaDrain: 0, fatigueDrain: 0, special, targetKilled, log,
    roundAction: {
      actorName: attacker.name, actorSide: opts.side, targetName: target.name,
      action, bodyPart, hit: true, damage: dmg, special: special || undefined,
    },
  };
}

// ============================================================
// SKIRMISH ROUND RESOLUTION
// ============================================================

export interface MeleeRoundResult {
  log: LogEntry[];
  moraleChanges: MoraleChange[];
  playerHealthDelta: number;
  playerStaminaDelta: number;
  allyDeaths: { name: string; npcId?: string; isNamed: boolean }[];
  enemyDefeats: number;
  battleEnd?: 'victory' | 'defeat' | 'survived';
}

/** Check if an opponent is defeated (dead or broken) */
function isOpponentDefeated(opp: MeleeOpponent): boolean {
  if (opp.health <= 0) return true;
  const breakPct = opp.type === 'conscript' ? 0.35 : opp.type === 'line' ? 0.25 : opp.type === 'veteran' ? 0.15 : 0;
  return breakPct > 0 && opp.health / opp.maxHealth <= breakPct;
}

/**
 * Process wave events for the current round.
 * Adds allies, increases max enemies, backfills from pool.
 * Returns log entries for narrative beats.
 */
function processWaveEvents(
  ms: MeleeState,
  turn: number,
  npcs: BattleState['line'],
): LogEntry[] {
  const log: LogEntry[] = [];

  for (let i = 0; i < ms.waveEvents.length; i++) {
    if (ms.processedWaves.includes(i)) continue;
    const wave = ms.waveEvents[i];
    if (ms.roundNumber < wave.atRound) continue;

    // Check NPC alive condition
    if (wave.conditionNpcAlive) {
      const npcId = wave.conditionNpcAlive;
      let alive = true;
      if (npcId === 'pierre') alive = npcs.leftNeighbour?.alive ?? false;
      else if (npcId === 'jean-baptiste') alive = npcs.rightNeighbour?.alive ?? false;
      if (!alive) {
        ms.processedWaves.push(i);
        continue;
      }
    }

    ms.processedWaves.push(i);

    if (wave.action === 'add_ally' && wave.allyTemplate) {
      const ally = makeAlly(wave.allyTemplate);
      ms.allies.push(ally);
      log.push({ turn, type: 'event', text: wave.narrative });
    } else if (wave.action === 'increase_max_enemies' && wave.newMaxEnemies) {
      ms.maxActiveEnemies = wave.newMaxEnemies;
      log.push({ turn, type: 'event', text: wave.narrative });
    }
  }

  // Backfill active enemies from pool (when enemies die or max increases)
  backfillEnemies(ms, turn, log);

  return log;
}

/** Pull enemies from pool into active combat up to maxActiveEnemies */
function backfillEnemies(ms: MeleeState, turn: number, log: LogEntry[]) {
  const liveActiveCount = ms.activeEnemies.filter(i => {
    const o = ms.opponents[i];
    return o.health > 0 && !isOpponentDefeated(o);
  }).length;

  let toFill = ms.maxActiveEnemies - liveActiveCount;
  while (toFill > 0 && ms.enemyPool.length > 0) {
    const nextIdx = ms.enemyPool.shift()!;
    ms.activeEnemies.push(nextIdx);
    const opp = ms.opponents[nextIdx];
    const shortName = opp.name.split(' — ')[0];
    log.push({ turn, type: 'event', text: `${shortName} joins the fight.` });
    toFill--;
  }
}

/**
 * Resolve one round of melee combat.
 * Turn order: Player → each alive ally → each alive enemy.
 */
export function resolveMeleeRound(
  state: BattleState,
  playerAction: MeleeActionId,
  playerBodyPart: BodyPart | undefined,
  playerTargetIdx: number,
): MeleeRoundResult {
  const ms = state.meleeState!;
  const turn = state.turn;
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];
  let playerHealthDelta = 0;
  let playerStaminaDelta = 0;
  const allyDeaths: MeleeRoundResult['allyDeaths'] = [];
  let enemyDefeats = 0;
  let battleEnd: MeleeRoundResult['battleEnd'];

  ms.roundLog = [];
  ms.roundNumber += 1;

  // Process wave events (reinforcements, enemy escalation)
  const waveLogs = processWaveEvents(ms, turn, state.line);
  log.push(...waveLogs);

  const pDef = ACTION_DEFS[playerAction];
  const sDef = STANCE_MODS[ms.playerStance];

  // Tick stuns on all combatants (before action resolution)
  if (ms.playerStunned > 0) ms.playerStunned -= 1;
  for (const opp of ms.opponents) {
    if (opp.stunned) {
      opp.stunnedTurns -= 1;
      if (opp.stunnedTurns <= 0) opp.stunned = false;
    }
  }
  for (const ally of ms.allies) {
    if (ally.stunned) {
      ally.stunnedTurns -= 1;
      if (ally.stunnedTurns <= 0) ally.stunned = false;
    }
  }

  const playerStunned = ms.playerStunned > 0;

  // Player stamina cost + fatigue accumulation (stunned = stance cost only, applied immediately)
  const playerStamCost = playerStunned ? sDef.staminaCost : (pDef.stamina + sDef.staminaCost);
  playerStaminaDelta = -playerStamCost;
  state.player.stamina = Math.max(0, Math.min(state.player.maxStamina, state.player.stamina - playerStamCost));
  if (playerStamCost > 0) {
    state.player.fatigue = Math.min(state.player.maxFatigue, state.player.fatigue + Math.round(playerStamCost * 0.5));
  }

  // Track guard state for UI overlay
  ms.playerGuarding = playerAction === MeleeActionId.Guard && !playerStunned;

  // Track player defensive state for this round
  let playerGuarding = playerAction === MeleeActionId.Guard && !playerStunned;
  let playerBlockChance = 0;

  if (playerGuarding) {
    const fatigueDebuffPct = getFatigueDebuff(state.player.fatigue, state.player.maxFatigue) / 100;
    playerBlockChance = Math.max(0.05, Math.min(0.95, 0.10 + sDef.defense + state.player.elan / 85 + fatigueDebuffPct));
  }

  // Track ally defensive states
  const allyGuarding = new Map<string, number>(); // id → block chance

  // Get list of live active enemies (only those on the field, not in pool)
  const liveEnemyIndices = ms.activeEnemies
    .filter(i => {
      const o = ms.opponents[i];
      return o.health > 0 && !isOpponentDefeated(o);
    });

  const liveAllies = ms.allies.filter(a => a.alive && a.health > 0);

  // === PLAYER ACTS ===
  if (playerStunned) {
    log.push({ turn, type: 'result', text: 'Stunned. Can\'t act.' });
  } else if (playerAction === MeleeActionId.Respite) {
    log.push({ turn, type: 'action', text: 'Catching breath.' });
    ms.roundLog.push({ actorName: state.player.name, actorSide: 'player', targetName: state.player.name, action: playerAction, hit: true, damage: 0 });
  } else if (playerAction === MeleeActionId.Feint && liveEnemyIndices.length > 0) {
    const targetIdx = liveEnemyIndices.includes(playerTargetIdx) ? playerTargetIdx : liveEnemyIndices[0];
    const target = ms.opponents[targetIdx];
    const result = resolveGenericAttack(
      playerToCombatant(state.player), oppToCombatant(target), target,
      playerAction, BodyPart.Torso, turn,
      { side: 'player', stance: ms.playerStance, riposte: ms.playerRiposte },
    );
    log.push(...result.log);
    if (result.hit) {
      target.stamina = Math.max(0, target.stamina - result.staminaDrain);
      target.fatigue = Math.min(target.maxFatigue, target.fatigue + result.fatigueDrain);
      moraleChanges.push({ amount: 2, reason: 'You wrong-foot your opponent', source: 'action' });
    }
    ms.roundLog.push(result.roundAction);
    ms.playerRiposte = false;
  } else if (playerAction === MeleeActionId.Reload) {
    ms.reloadProgress += 1;
    if (ms.reloadProgress >= 2) {
      state.player.musketLoaded = true;
      ms.reloadProgress = 0;
      log.push({ turn, type: 'action', text: 'Ram ball home. Prime the pan. Musket loaded.' });
    } else {
      log.push({ turn, type: 'action', text: 'Bite cartridge. Pour powder. Half loaded.' });
    }
    ms.roundLog.push({ actorName: state.player.name, actorSide: 'player', targetName: state.player.name, action: playerAction, hit: false, damage: 0 });
  } else if (playerAction === MeleeActionId.SecondWind) {
    // Second Wind: endurance roll to reduce fatigue
    const endRoll = state.player.endurance + Math.random() * 50;
    const success = endRoll > 60;
    if (success) {
      const reduction = Math.round(state.player.maxFatigue * 0.25);
      state.player.fatigue = Math.max(0, state.player.fatigue - reduction);
      log.push({ turn, type: 'action', text: 'Second wind. The burning eases. You can breathe again.' });
    } else {
      log.push({ turn, type: 'action', text: 'You try to steady your breathing — but the exhaustion won\'t release its grip.' });
    }
    ms.roundLog.push({ actorName: state.player.name, actorSide: 'player', targetName: state.player.name, action: playerAction, hit: success, damage: 0 });
  } else if (playerAction === MeleeActionId.UseCanteen) {
    // Drink from canteen: restore HP, increment uses
    const hpRestore = 20;
    state.player.health = Math.min(state.player.maxHealth, state.player.health + hpRestore);
    state.player.canteenUses += 1;
    log.push({ turn, type: 'action', text: 'You uncork the canteen and drink. The water is warm and tastes of tin, but it steadies you.' });
    ms.roundLog.push({ actorName: state.player.name, actorSide: 'player', targetName: state.player.name, action: playerAction, hit: true, damage: hpRestore });
  } else if (playerAction === MeleeActionId.Shoot && state.player.musketLoaded) {
    state.player.musketLoaded = false;
    ms.reloadProgress = 0;
    const target = liveEnemyIndices.includes(playerTargetIdx) ? ms.opponents[playerTargetIdx] : ms.opponents[liveEnemyIndices[0]];
    const bp = playerBodyPart || BodyPart.Torso;
    const hitChance = calcHitChance(
      state.player.musketry, state.player.morale, state.player.maxMorale,
      ms.playerStance, playerAction, bp, ms.playerRiposte, state.player.fatigue, state.player.maxFatigue,
    );
    const hit = Math.random() < Math.max(0.10, hitChance);
    if (hit) {
      const dmg = calcDamage(playerAction, bp, state.player.fatigue, state.player.maxFatigue, state.player.strength);
      target.health -= dmg;
      target.fatigue = Math.min(target.maxFatigue, target.fatigue + Math.round(dmg * DAMAGE_FATIGUE_RATE));
      moraleChanges.push({ amount: dmg / 3, reason: 'Musket ball found its mark', source: 'action' });
      let special = '';
      if (bp === BodyPart.Head && Math.random() < 0.25) { target.health = 0; special = ' Killed.'; }
      log.push({ turn, type: 'result', text: `Shot hits ${target.name.split(' — ')[0]}. ${PART_NAMES[bp]}.${special}` });
      ms.roundLog.push({ actorName: state.player.name, actorSide: 'player', targetName: target.name, action: playerAction, bodyPart: bp, hit: true, damage: dmg, special: special || undefined });
    } else {
      log.push({ turn, type: 'result', text: 'Shot misses.' });
      ms.roundLog.push({ actorName: state.player.name, actorSide: 'player', targetName: target.name, action: playerAction, bodyPart: bp, hit: false, damage: 0 });
    }
    ms.playerRiposte = false;
  } else if (playerAction === MeleeActionId.ButtStrike && liveEnemyIndices.length > 0) {
    const targetIdx = liveEnemyIndices.includes(playerTargetIdx) ? playerTargetIdx : liveEnemyIndices[0];
    const target = ms.opponents[targetIdx];
    const result = resolveGenericAttack(
      playerToCombatant(state.player), oppToCombatant(target), target,
      playerAction, BodyPart.Torso, turn,
      { side: 'player', stance: ms.playerStance, riposte: ms.playerRiposte },
    );
    log.push(...result.log);
    if (result.hit) {
      target.stamina = Math.max(0, target.stamina - result.staminaDrain);
      target.fatigue = Math.min(target.maxFatigue, target.fatigue + result.fatigueDrain);
      moraleChanges.push({ amount: 2, reason: 'You stagger your opponent', source: 'action' });
    }
    ms.roundLog.push(result.roundAction);
    ms.playerRiposte = false;
  } else if (pDef.isAttack && playerBodyPart && liveEnemyIndices.length > 0) {
    const targetIdx = liveEnemyIndices.includes(playerTargetIdx) ? playerTargetIdx : liveEnemyIndices[0];
    const target = ms.opponents[targetIdx];
    const result = resolveGenericAttack(
      playerToCombatant(state.player), oppToCombatant(target), target,
      playerAction, playerBodyPart, turn,
      { side: 'player', stance: ms.playerStance, riposte: ms.playerRiposte },
    );
    log.push(...result.log);
    if (result.hit) {
      target.health -= result.damage;
      target.stamina = Math.max(0, target.stamina - result.staminaDrain);
      target.fatigue = Math.min(target.maxFatigue, target.fatigue + result.fatigueDrain + Math.round(result.damage * DAMAGE_FATIGUE_RATE));
      if (result.damage > 0) moraleChanges.push({ amount: result.damage / 4, reason: 'Your strike connects', source: 'action' });
      if (result.staminaDrain > 0) moraleChanges.push({ amount: 2, reason: 'You stagger your opponent', source: 'action' });
      if (result.targetKilled) target.health = 0;
    }
    ms.roundLog.push(result.roundAction);
    ms.playerRiposte = false;
  } else if (playerAction === MeleeActionId.Guard) {
    // Already handled above (defensive state tracked)
    log.push({ turn, type: 'action', text: 'You raise your guard.' });
    const guardTarget = ms.opponents[liveEnemyIndices.includes(playerTargetIdx) ? playerTargetIdx : liveEnemyIndices[0]];
    ms.roundLog.push({ actorName: state.player.name, actorSide: 'player', targetName: guardTarget?.name ?? '', action: MeleeActionId.Guard, hit: false, damage: 0 });
  }

  // Check for enemy defeats after player acts
  for (const idx of liveEnemyIndices) {
    const opp = ms.opponents[idx];
    if (isOpponentDefeated(opp)) {
      const killed = opp.health <= 0;
      log.push({ turn, type: 'event', text: killed ? `${opp.name.split(' — ')[0]} down.` : `${opp.name.split(' — ')[0]} breaks.` });
      ms.killCount += 1;
      enemyDefeats += 1;
    }
  }

  // Backfill enemies from pool after player kills
  backfillEnemies(ms, turn, log);

  // === ALLIES ACT ===
  for (const ally of liveAllies) {
    if (ally.stunned || ally.health <= 0 || !ally.alive) continue;

    // Refresh live enemy list each iteration so allies don't target dead enemies
    const currentLiveEnemies = ms.activeEnemies
      .filter(i => {
        const o = ms.opponents[i];
        return o.health > 0 && !isOpponentDefeated(o);
      });
    if (currentLiveEnemies.length === 0) break;

    const aiChoice = chooseAllyAI(ally, ms.opponents, currentLiveEnemies);
    const targetIdx = aiChoice.targetIndex;
    const target = ms.opponents[targetIdx];

    // Ally stamina cost + fatigue
    const allyActionDef = ACTION_DEFS[aiChoice.action];
    const legMult = ally.legInjured ? 1.5 : 1.0;
    const allyCost = Math.round(allyActionDef.stamina * legMult);
    ally.stamina = Math.max(0, ally.stamina - allyCost);
    if (allyCost > 0) ally.fatigue = Math.min(ally.maxFatigue, ally.fatigue + Math.round(allyCost * 0.5));

    if (aiChoice.action === MeleeActionId.Guard) {
      allyGuarding.set(ally.id, Math.max(0.05, Math.min(0.80, 0.10 + ally.elan / 85)));
      log.push({ turn, type: 'result', text: `${ally.name} raises guard.` });
      ms.roundLog.push({ actorName: ally.name, actorSide: 'ally', targetName: target.name, action: aiChoice.action, hit: false, damage: 0 });
      continue;
    }

    if (aiChoice.action === MeleeActionId.Respite) {
      ally.stamina = Math.min(ally.maxStamina, ally.stamina + 30);
      log.push({ turn, type: 'result', text: `${ally.name} catches breath.` });
      ms.roundLog.push({ actorName: ally.name, actorSide: 'ally', targetName: target.name, action: aiChoice.action, hit: true, damage: 0 });
      continue;
    }

    if (aiChoice.action === MeleeActionId.SecondWind) {
      const allyEndRoll = ally.elan + Math.random() * 50;
      const allySwSuccess = allyEndRoll > 60;
      if (allySwSuccess) {
        const reduction = Math.round(ally.maxFatigue * 0.25);
        ally.fatigue = Math.max(0, ally.fatigue - reduction);
        log.push({ turn, type: 'result', text: `${ally.name} finds a second wind.` });
      } else {
        log.push({ turn, type: 'result', text: `${ally.name} gasps for breath.` });
      }
      ms.roundLog.push({ actorName: ally.name, actorSide: 'ally', targetName: target.name, action: aiChoice.action, hit: allySwSuccess, damage: 0 });
      continue;
    }

    const result = resolveGenericAttack(
      allyToCombatant(ally), oppToCombatant(target), target,
      aiChoice.action, aiChoice.bodyPart, turn,
      { side: 'ally' },
    );
    log.push(...result.log);
    if (result.hit) {
      target.health -= result.damage;
      target.stamina = Math.max(0, target.stamina - result.staminaDrain);
      target.fatigue = Math.min(target.maxFatigue, target.fatigue + result.fatigueDrain + Math.round(result.damage * DAMAGE_FATIGUE_RATE));
      if (result.targetKilled) target.health = 0;
    }
    ms.roundLog.push(result.roundAction);

    // Check defeat
    if (isOpponentDefeated(target)) {
      const killed = target.health <= 0;
      log.push({ turn, type: 'event', text: killed ? `${target.name.split(' — ')[0]} down.` : `${target.name.split(' — ')[0]} breaks.` });
      ms.killCount += 1;
      enemyDefeats += 1;
    }
  }

  // Backfill enemies from pool after ally kills
  backfillEnemies(ms, turn, log);

  // Refresh live active enemy list
  const liveEnemiesAfterAllies = ms.activeEnemies
    .filter(i => {
      const o = ms.opponents[i];
      return o.health > 0 && !isOpponentDefeated(o);
    });

  // === ENEMIES ACT ===
  for (const idx of liveEnemiesAfterAllies) {
    // Stop if player is already dead
    if (state.player.health <= 0) break;

    const opp = ms.opponents[idx];
    if (opp.stunned) {
      log.push({ turn, type: 'result', text: `${opp.name.split(' — ')[0]} stunned.` });
      continue;
    }

    const ai = chooseMeleeAI(opp, state);
    const aiDef = ACTION_DEFS[ai.action];

    // Enemy target selection
    const enemyTarget = chooseEnemyTarget(opp, state.player, ms.allies);

    // Enemy stamina cost
    oppSpendStamina(opp, aiDef);

    if (ai.action === MeleeActionId.Respite) {
      opp.stamina = Math.min(opp.maxStamina, opp.stamina + 30);
      log.push({ turn, type: 'result', text: `${opp.name.split(' — ')[0]} catches breath.` });
      ms.roundLog.push({ actorName: opp.name, actorSide: 'enemy', targetName: enemyTarget.name, action: ai.action, hit: true, damage: 0 });
      continue;
    }
    if (ai.action === MeleeActionId.SecondWind) {
      // Opponent Second Wind: use strength as proxy for endurance
      const oppEndRoll = opp.strength + Math.random() * 50;
      const oppSwSuccess = oppEndRoll > 60;
      if (oppSwSuccess) {
        const reduction = Math.round(opp.maxFatigue * 0.25);
        opp.fatigue = Math.max(0, opp.fatigue - reduction);
        log.push({ turn, type: 'result', text: `${opp.name.split(' — ')[0]} catches a second wind.` });
      } else {
        log.push({ turn, type: 'result', text: `${opp.name.split(' — ')[0]} gasps for breath.` });
      }
      ms.roundLog.push({ actorName: opp.name, actorSide: 'enemy', targetName: enemyTarget.name, action: ai.action, hit: oppSwSuccess, damage: 0 });
      continue;
    }
    if (ai.action === MeleeActionId.Guard) {
      log.push({ turn, type: 'result', text: `${opp.name.split(' — ')[0]} guards.` });
      ms.roundLog.push({ actorName: opp.name, actorSide: 'enemy', targetName: enemyTarget.name, action: ai.action, hit: false, damage: 0 });
      continue;
    }

    if (!aiDef.isAttack) continue;

    // Attacking the player
    if (enemyTarget.type === 'player') {
      ms.lastOppAttacked = true;
      const result = resolveGenericAttack(
        oppToCombatant(opp), playerToCombatant(state.player), null,
        ai.action, ai.bodyPart, turn,
        {
          side: 'enemy',
          targetGuarding: playerGuarding,
          targetBlockChance: playerBlockChance,
          freeAttack: playerAction === MeleeActionId.Respite || playerAction === MeleeActionId.Reload || playerAction === MeleeActionId.SecondWind || playerAction === MeleeActionId.UseCanteen || playerStunned,
        },
      );
      log.push(...result.log);
      if (result.hit) {
        // Apply health damage immediately
        state.player.health = Math.max(0, state.player.health - result.damage);
        state.player.stamina = Math.max(0, state.player.stamina - result.staminaDrain);
        state.player.fatigue = Math.min(state.player.maxFatigue, state.player.fatigue + result.fatigueDrain + Math.round(result.damage * DAMAGE_FATIGUE_RATE));
        playerHealthDelta -= result.damage;
        if (result.damage > 0) moraleChanges.push({ amount: -(result.damage / 3), reason: `Hit by ${opp.name.split(' — ')[0]}`, source: 'event' });
        if (result.staminaDrain > 0) moraleChanges.push({ amount: -3, reason: `Staggered by ${opp.name.split(' — ')[0]}`, source: 'event' });
        // Stun check on player
        const stunRoll = (ai.bodyPart === BodyPart.Head ? 0.30 : 0) + aiDef.stunBonus;
        if (stunRoll > 0 && Math.random() < stunRoll) {
          ms.playerStunned = 1;
          moraleChanges.push({ amount: -5, reason: 'Stunned!', source: 'event' });
        }
      }
      ms.roundLog.push(result.roundAction);

      // Player death check — stop remaining enemies from attacking
      if (state.player.health <= 0) {
        battleEnd = 'defeat';
        break;
      }
    } else {
      // Attacking an ally
      const targetAlly = ms.allies.find(a => a.id === enemyTarget.id);
      if (!targetAlly || !targetAlly.alive || targetAlly.health <= 0) continue;

      const allyBlockChance = allyGuarding.get(targetAlly.id) || 0;
      const result = resolveGenericAttack(
        oppToCombatant(opp), allyToCombatant(targetAlly), targetAlly,
        ai.action, ai.bodyPart, turn,
        {
          side: 'enemy',
          targetGuarding: allyBlockChance > 0,
          targetBlockChance: allyBlockChance,
        },
      );
      log.push(...result.log);
      if (result.hit) {
        targetAlly.health -= result.damage;
        targetAlly.stamina = Math.max(0, targetAlly.stamina - result.staminaDrain);
        targetAlly.fatigue = Math.min(targetAlly.maxFatigue, targetAlly.fatigue + result.fatigueDrain + Math.round(result.damage * DAMAGE_FATIGUE_RATE));
        if (result.targetKilled) targetAlly.health = 0;
      }
      ms.roundLog.push(result.roundAction);

      // Ally death check
      if (targetAlly.health <= 0 && targetAlly.alive) {
        targetAlly.alive = false;
        const isNamed = targetAlly.type === 'named';
        allyDeaths.push({ name: targetAlly.name, npcId: targetAlly.npcId, isNamed });
        if (isNamed) {
          log.push({ turn, type: 'event', text: `${targetAlly.name} goes down! The loss hits you like a physical blow.` });
          moraleChanges.push({ amount: -8, reason: `${targetAlly.name} fell`, source: 'event' });
        } else {
          log.push({ turn, type: 'event', text: `${targetAlly.name} falls.` });
          moraleChanges.push({ amount: -3, reason: 'Ally fell', source: 'event' });
        }
      }
    }
  }

  // === END-OF-ROUND CHECKS ===
  ms.exchangeCount += 1;

  // All enemies defeated? (active ones dead/broken AND pool is empty)
  const anyActiveAlive = ms.activeEnemies.some(i => {
    const o = ms.opponents[i];
    return o.health > 0 && !isOpponentDefeated(o);
  });
  if (!anyActiveAlive && ms.enemyPool.length === 0) battleEnd = 'victory';

  // Player dead? (health already applied in-place during enemy attacks)
  if (state.player.health <= 0) battleEnd = 'defeat';

  // Survived check (low HP, fought hard, more enemies remain)
  if (!battleEnd && enemyDefeats > 0 && state.player.health < 25 && ms.killCount >= 2 &&
      (anyActiveAlive || ms.enemyPool.length > 0)) {
    battleEnd = 'survived';
  }

  // Sync currentOpponent to first live active enemy
  const firstLiveActive = ms.activeEnemies.find(i => {
    const o = ms.opponents[i];
    return o.health > 0 && !isOpponentDefeated(o);
  });
  if (firstLiveActive !== undefined) {
    ms.currentOpponent = firstLiveActive;
  }

  return { log, moraleChanges, playerHealthDelta, playerStaminaDelta, allyDeaths, enemyDefeats, battleEnd };
}

// ============================================================
// NARRATIVE HELPERS
// ============================================================

const PART_NAMES: Record<BodyPart, string> = {
  [BodyPart.Head]: 'face', [BodyPart.Torso]: 'chest', [BodyPart.Arms]: 'arm', [BodyPart.Legs]: 'thigh',
};
