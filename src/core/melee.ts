import {
  BattleState, MeleeState, MeleeOpponent, MeleeStance, MeleeActionId, BodyPart,
  LogEntry, MoraleChange, MoraleThreshold,
} from '../types';
import { getStaminaDebuff } from './stats';

// ============================================================
// OPPONENT DEFINITIONS
// ============================================================

interface OpponentTemplate {
  name: string;
  type: 'conscript' | 'line' | 'veteran' | 'sergeant';
  health: [number, number];
  stamina: [number, number];
  strength: number;
  description: string;
}

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

// Battery melee opponents (charging the overrun battery)
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
    name: 'Austrian infantry guard',
    type: 'line',
    health: [80, 95],
    stamina: [180, 240],
    strength: 50,
    description: 'Infantry assigned to guard the captured battery. He stands between you and the guns, bayonet level. Professional. Determined.',
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
    strength: t.strength,
    stunned: false, stunnedTurns: 0, feinted: false,
    armInjured: false, legInjured: false, description: t.description,
  };
}

// ============================================================
// CREATE MELEE STATE
// ============================================================

export function createMeleeState(
  state: BattleState,
  context: 'terrain' | 'battery' = 'terrain'
): MeleeState {
  const roster = context === 'battery' ? BATTERY_ROSTER : TERRAIN_ROSTER;
  const opponents = roster.map(t => makeOpponent(t));
  const maxExchanges = context === 'battery' ? 10 : 12;

  return {
    opponents, currentOpponent: 0,
    playerStance: MeleeStance.Balanced,
    playerFeinted: false, playerRiposte: false, playerStunned: 0,
    exchangeCount: 0, selectingStance: false, selectingTarget: false,
    killCount: 0, valorTempBonus: 0,
    maxExchanges,
    meleeContext: context,
    lastOppAttacked: false,
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
  [MeleeActionId.AggressiveLunge]:{ stamina: 38,  hitBonus: 0.15, damageMod: 1.5, isAttack: true,  stunBonus: 0    },
  [MeleeActionId.ButtStrike]:     { stamina: 26,  hitBonus: 0.10, damageMod: 0.6, isAttack: true,  stunBonus: 0.20 },
  [MeleeActionId.Feint]:          { stamina: 14,  hitBonus: 0,    damageMod: 0,   isAttack: false, stunBonus: 0    },
  [MeleeActionId.Guard]:          { stamina: 12,  hitBonus: 0,    damageMod: 0,   isAttack: false, stunBonus: 0    },
  [MeleeActionId.Dodge]:          { stamina: 16,  hitBonus: 0,    damageMod: 0,   isAttack: false, stunBonus: 0    },
  [MeleeActionId.Respite]:        { stamina: -35, hitBonus: 0,    damageMod: 0,   isAttack: false, stunBonus: 0    },
  [MeleeActionId.Shoot]:          { stamina: 8,   hitBonus: 0,    damageMod: 2.0, isAttack: true,  stunBonus: 0    },
};

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
    { id: MeleeActionId.AggressiveLunge,  label: 'Aggressive Lunge', description: 'Commit everything. +15% hit, 1.5x damage.',             available: stamina >= 38, staminaCost: 38 },
    { id: MeleeActionId.ButtStrike,       label: 'Butt Strike',      description: 'Musket butt. Less damage but high stun chance.',         available: stamina >= 26, staminaCost: 26 },
    { id: MeleeActionId.Feint,            label: 'Feint',            description: 'Fake attack. Drains opponent stamina (-45).',            available: stamina >= 14, staminaCost: 14 },
    { id: MeleeActionId.Guard,            label: 'Guard',            description: 'Block chance (élan-based). Failed blocks reduce damage.',available: true,          staminaCost: 12 },
    { id: MeleeActionId.Dodge,            label: 'Dodge',            description: 'Evade chance (élan-based). Success grants riposte.',     available: stamina >= 16, staminaCost: 16 },
    { id: MeleeActionId.Respite,          label: 'Catch Breath',     description: 'Recover 35 stamina. Opponent gets a free attack.',       available: true,          staminaCost: -35 },
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

  // At 0 stamina: forced respite only
  if (stamina <= 0) return actions.filter(a => a.id === MeleeActionId.Respite);

  // Morale gating — low morale restricts aggressive actions
  if (morale === MoraleThreshold.Shaken) {
    // Shaken: no Aggressive Lunge
    for (const a of actions) {
      if (a.id === MeleeActionId.AggressiveLunge) a.available = false;
    }
  } else if (morale === MoraleThreshold.Wavering) {
    // Wavering: only Thrust, Guard, Dodge, Respite
    for (const a of actions) {
      if (![MeleeActionId.BayonetThrust, MeleeActionId.Guard, MeleeActionId.Dodge, MeleeActionId.Respite, MeleeActionId.Shoot].includes(a.id)) {
        a.available = false;
      }
    }
  } else if (morale === MoraleThreshold.Breaking) {
    // Breaking: only Guard, Dodge, Respite (survival instinct)
    for (const a of actions) {
      if (![MeleeActionId.Guard, MeleeActionId.Dodge, MeleeActionId.Respite].includes(a.id)) {
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
  if (r < 0.75) return { action: MeleeActionId.Guard, bodyPart: BodyPart.Torso };
  return { action: MeleeActionId.Dodge, bodyPart: BodyPart.Torso };
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
  if (r < 0.85) return { action: MeleeActionId.Guard, bodyPart: BodyPart.Torso };
  return { action: MeleeActionId.Dodge, bodyPart: BodyPart.Torso };
}

function veteranAI(opp: MeleeOpponent, state: BattleState): AIDecision {
  const r = Math.random();
  const recent = playerHistory.slice(-3);
  const defCount = recent.filter(a => a === MeleeActionId.Guard || a === MeleeActionId.Dodge).length;
  const atkCount = recent.filter(a => a === MeleeActionId.AggressiveLunge || a === MeleeActionId.BayonetThrust).length;

  // Exploit feint setup
  if (opp.feinted) return { action: MeleeActionId.AggressiveLunge, bodyPart: BodyPart.Head };

  // Pattern reading: counter repeated actions
  if (recent.length >= 2 && recent[recent.length - 1] === recent[recent.length - 2]) {
    const repeated = recent[recent.length - 1];
    if (repeated === MeleeActionId.Guard) return { action: MeleeActionId.Feint, bodyPart: BodyPart.Head };
    if (repeated === MeleeActionId.BayonetThrust || repeated === MeleeActionId.AggressiveLunge) return { action: MeleeActionId.Dodge, bodyPart: BodyPart.Torso };
    if (repeated === MeleeActionId.Dodge) return { action: MeleeActionId.ButtStrike, bodyPart: BodyPart.Legs };
  }

  // Adapt to patterns
  if (defCount >= 2) return { action: MeleeActionId.Feint, bodyPart: BodyPart.Head };
  if (atkCount >= 2) {
    return r < 0.5
      ? { action: MeleeActionId.Dodge, bodyPart: BodyPart.Torso }
      : { action: MeleeActionId.Guard, bodyPart: BodyPart.Torso };
  }

  const targets: BodyPart[] = [BodyPart.Head, BodyPart.Torso, BodyPart.Arms];
  const target = targets[Math.floor(Math.random() * targets.length)];

  if (r < 0.25) return { action: MeleeActionId.BayonetThrust, bodyPart: target };
  if (r < 0.45) return { action: MeleeActionId.AggressiveLunge, bodyPart: target };
  if (r < 0.55) return { action: MeleeActionId.Feint, bodyPart: target };
  if (r < 0.70) return { action: MeleeActionId.ButtStrike, bodyPart: target };
  if (r < 0.85) return { action: MeleeActionId.Guard, bodyPart: BodyPart.Torso };
  return { action: MeleeActionId.Dodge, bodyPart: BodyPart.Torso };
}

function sergeantAI(opp: MeleeOpponent, state: BattleState): AIDecision {
  const r = Math.random();
  const recent = playerHistory.slice(-4); // 4-move window (wider than veteran)
  const defCount = recent.filter(a => a === MeleeActionId.Guard || a === MeleeActionId.Dodge).length;
  const atkCount = recent.filter(a => a === MeleeActionId.AggressiveLunge || a === MeleeActionId.BayonetThrust).length;

  // Exploit feint setup
  if (opp.feinted) return { action: MeleeActionId.AggressiveLunge, bodyPart: BodyPart.Head };

  // Pattern reading: counter repeated actions (same as veteran)
  if (recent.length >= 2 && recent[recent.length - 1] === recent[recent.length - 2]) {
    const repeated = recent[recent.length - 1];
    if (repeated === MeleeActionId.Guard) return { action: MeleeActionId.Feint, bodyPart: BodyPart.Head };
    if (repeated === MeleeActionId.BayonetThrust || repeated === MeleeActionId.AggressiveLunge) return { action: MeleeActionId.Dodge, bodyPart: BodyPart.Torso };
    if (repeated === MeleeActionId.Dodge) return { action: MeleeActionId.ButtStrike, bodyPart: BodyPart.Legs };
  }

  // Reads stance patterns: if player always Defensive, Feint→Lunge combo
  if (state.meleeState?.playerStance === MeleeStance.Defensive && defCount >= 2) {
    return r < 0.6
      ? { action: MeleeActionId.Feint, bodyPart: BodyPart.Head }
      : { action: MeleeActionId.AggressiveLunge, bodyPart: BodyPart.Torso };
  }

  // Adapt to patterns
  if (defCount >= 2) return { action: MeleeActionId.Feint, bodyPart: BodyPart.Head };
  if (atkCount >= 2) {
    return r < 0.5
      ? { action: MeleeActionId.Dodge, bodyPart: BodyPart.Torso }
      : { action: MeleeActionId.Guard, bodyPart: BodyPart.Torso };
  }

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
  if (r < 0.86) return { action: MeleeActionId.Guard, bodyPart: BodyPart.Torso };
  return { action: MeleeActionId.Dodge, bodyPart: BodyPart.Torso };
}

// ============================================================
// HIT / DAMAGE CALCULATION
// ============================================================

function calcHitChance(
  skillStat: number, morale: number, maxMorale: number,
  stance: MeleeStance, action: MeleeActionId,
  bodyPart: BodyPart, riposte: boolean, stamina: number, maxStamina: number,
): number {
  const moralePenalty = (1 - morale / maxMorale) * 0.15;
  const staminaDebuffPct = getStaminaDebuff(stamina, maxStamina) / 100; // 0 / -0.05 / -0.15 / -0.25
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

function calcDamage(action: MeleeActionId, bodyPart: BodyPart, stamina: number, maxStamina: number, strength: number = 40): number {
  const [lo, hi] = BODY_PART_DEFS[bodyPart].damageRange;
  const strengthMod = action === MeleeActionId.Shoot ? 1.0 : 0.75 + strength / 200;
  const staminaPct = maxStamina > 0 ? stamina / maxStamina : 1;
  let dmg = Math.round(randRange(lo, hi) * ACTION_DEFS[action].damageMod * strengthMod);
  if (staminaPct < 0.25) dmg = Math.round(dmg * 0.75);
  return Math.max(1, dmg);
}

// ============================================================
// RESOLVE MELEE EXCHANGE
// ============================================================

interface MeleeExchangeResult {
  log: LogEntry[];
  moraleChanges: MoraleChange[];
  healthDelta: number;
  staminaDelta: number;
  opponentDefeated: boolean;
  battleEnd?: 'victory' | 'defeat' | 'survived';
}

export function resolveMeleeExchange(
  state: BattleState,
  playerAction: MeleeActionId,
  bodyPart?: BodyPart,
): MeleeExchangeResult {
  const ms = state.meleeState!;
  const opp = ms.opponents[ms.currentOpponent];
  const turn = state.turn;
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];
  let healthDelta = 0;
  let staminaDelta = 0;
  let opponentDefeated = false;
  let battleEnd: 'victory' | 'defeat' | 'survived' | undefined;
  ms.lastOppAttacked = false;

  playerHistory.push(playerAction);

  const pDef = ACTION_DEFS[playerAction];
  const sDef = STANCE_MODS[ms.playerStance];

  // Player stamina cost (action + stance base)
  staminaDelta -= (pDef.stamina + sDef.staminaCost);

  // Tick down opponent stun (always, regardless of player action)
  if (opp.stunned) {
    opp.stunnedTurns -= 1;
    if (opp.stunnedTurns <= 0) opp.stunned = false;
  }

  // AI picks
  const ai = chooseMeleeAI(opp, state);
  const aiDef = ACTION_DEFS[ai.action];

  // Reset opponent feint after AI uses it (one-turn bonus only)
  opp.feinted = false;

  // ── PLAYER STUNNED ──
  if (ms.playerStunned > 0) {
    log.push({ turn, type: 'result', text: 'Stunned. Can\'t act.' });
    staminaDelta = -sDef.staminaCost; // Only stance cost
    const oppResult = resolveOpponentAttack(opp, ai, aiDef, true, false, false, 0, turn, log, moraleChanges, ms, state);
    healthDelta += oppResult.healthDelta;
    ms.playerStunned -= 1;
    return finalize(state, ms, opp, log, moraleChanges, healthDelta, staminaDelta, opponentDefeated, battleEnd, state.player.health + healthDelta);
  }

  // ── PLAYER RESPITE ──
  if (playerAction === MeleeActionId.Respite) {
    log.push({ turn, type: 'action', text: 'Catching breath.' });
    const oppResult = resolveOpponentAttack(opp, ai, aiDef, true, false, false, 0, turn, log, moraleChanges, ms, state);
    healthDelta += oppResult.healthDelta;
    return finalize(state, ms, opp, log, moraleChanges, healthDelta, staminaDelta, opponentDefeated, battleEnd, state.player.health + healthDelta);
  }

  // ── PLAYER SHOOT ──
  if (playerAction === MeleeActionId.Shoot) {
    state.player.musketLoaded = false;
    const target = bodyPart || BodyPart.Torso;
    // Shoot has high base hit, cannot be blocked
    const hitChance = calcHitChance(
      state.player.musketry, state.player.morale, state.player.maxMorale,
      ms.playerStance, playerAction, target, ms.playerRiposte, state.player.stamina, state.player.maxStamina,
    );
    const hit = Math.random() < Math.max(0.10, hitChance);

    if (hit) {
      const dmg = calcDamage(playerAction, target, state.player.stamina, state.player.maxStamina, state.player.strength);
      opp.health -= dmg;
      moraleChanges.push({ amount: dmg / 3, reason: 'Musket ball found its mark', source: 'action' });

      let special = '';
      // Head shot: 25% instant kill
      if (target === BodyPart.Head && Math.random() < 0.25) {
        opp.health = 0;
        special = ' Killed.';
      }

      log.push({ turn, type: 'result', text: `Shot hits. ${PART_NAMES[target]}.${special}` });
    } else {
      log.push({ turn, type: 'result', text: 'Shot misses.' });
    }

    ms.playerRiposte = false;

    // Opponent counter-attacks if still alive
    if (opp.health > 0) {
      const oppResult = resolveOpponentAttack(opp, ai, aiDef, false, false, false, 0, turn, log, moraleChanges, ms, state);
      healthDelta += oppResult.healthDelta;
    }

    return finalize(state, ms, opp, log, moraleChanges, healthDelta, staminaDelta, opponentDefeated, battleEnd, state.player.health + healthDelta);
  }

  // ── PLAYER FEINT ──
  if (playerAction === MeleeActionId.Feint) {
    // Feint drains opponent stamina instead of granting hit bonus
    const staminaDrain = 45;
    opp.stamina = Math.max(0, opp.stamina - staminaDrain);
    log.push({ turn, type: 'action', text: 'Feint.' });
    const oppResult = resolveOpponentAttack(opp, ai, aiDef, false, false, false, 0, turn, log, moraleChanges, ms, state);
    healthDelta += oppResult.healthDelta;
    return finalize(state, ms, opp, log, moraleChanges, healthDelta, staminaDelta, opponentDefeated, battleEnd, state.player.health + healthDelta);
  }

  // ── PLAYER GUARD ──
  if (playerAction === MeleeActionId.Guard) {
    const staminaDebuffPct = getStaminaDebuff(state.player.stamina, state.player.maxStamina) / 100;
    const blockChance = Math.max(0.05, Math.min(0.95, 0.10 + sDef.defense + state.player.elan / 85 + staminaDebuffPct));
    const oppResult = resolveOpponentAttack(opp, ai, aiDef, false, true, false, blockChance, turn, log, moraleChanges, ms, state);
    healthDelta += oppResult.healthDelta;
    return finalize(state, ms, opp, log, moraleChanges, healthDelta, staminaDelta, opponentDefeated, battleEnd, state.player.health + healthDelta);
  }

  // ── PLAYER DODGE ──
  if (playerAction === MeleeActionId.Dodge) {
    const staminaDebuffPct = getStaminaDebuff(state.player.stamina, state.player.maxStamina) / 100;
    const evadeChance = Math.max(0.05, Math.min(0.95, 0.00 + sDef.defense + state.player.elan / 85 + staminaDebuffPct));
    const dodged = Math.random() < evadeChance;
    if (dodged) {
      ms.playerRiposte = true;
      log.push({ turn, type: 'action', text: 'Dodged. Opening!' });
    }
    const oppResult = resolveOpponentAttack(opp, ai, aiDef, false, false, dodged, 0, turn, log, moraleChanges, ms, state);
    healthDelta += oppResult.healthDelta;
    return finalize(state, ms, opp, log, moraleChanges, healthDelta, staminaDelta, opponentDefeated, battleEnd, state.player.health + healthDelta);
  }

  // ── PLAYER ATTACK ──
  if (pDef.isAttack && bodyPart) {
    const hitChance = calcHitChance(
      state.player.elan, state.player.morale, state.player.maxMorale,
      ms.playerStance, playerAction, bodyPart,
      ms.playerRiposte, state.player.stamina, state.player.maxStamina,
    );

    const hit = Math.random() < Math.max(0.05, hitChance);

    if (hit) {
      const dmg = calcDamage(playerAction, bodyPart, state.player.stamina, state.player.maxStamina, state.player.strength);
      opp.health -= dmg;
      moraleChanges.push({ amount: dmg / 4, reason: 'Your strike connects', source: 'action' });

      let special = '';
      // Head: stun + instant kill chance
      if (bodyPart === BodyPart.Head) {
        if (Math.random() < 0.10) {
          opp.health = 0;
          special = ' Killed.';
        } else if (Math.random() < 0.35 + pDef.stunBonus) {
          opp.stunned = true; opp.stunnedTurns = 1;
          special = ' Stunned!';
          moraleChanges.push({ amount: 3, reason: 'Stunned opponent', source: 'action' });
        }
      }
      // Butt Strike stun
      if (playerAction === MeleeActionId.ButtStrike && !special && Math.random() < pDef.stunBonus) {
        opp.stunned = true; opp.stunnedTurns = 1;
        special = ' Stunned!';
        moraleChanges.push({ amount: 3, reason: 'Stunned opponent', source: 'action' });
      }
      // Arms
      if (bodyPart === BodyPart.Arms && Math.random() < 0.15) {
        opp.armInjured = true;
        special = ' Arm injured.';
      }
      // Legs
      if (bodyPart === BodyPart.Legs && Math.random() < 0.10) {
        opp.legInjured = true;
        special = ' Leg injured.';
      }

      log.push({ turn, type: 'result', text: playerHitText(playerAction, bodyPart, dmg) + special });
    } else {
      log.push({ turn, type: 'result', text: playerMissText(playerAction, bodyPart) });
    }

    ms.playerRiposte = false;
  }

  // Opponent counter-attacks if still alive
  if (opp.health > 0) {
    const oppResult = resolveOpponentAttack(opp, ai, aiDef, false, false, false, 0, turn, log, moraleChanges, ms, state);
    healthDelta += oppResult.healthDelta;
  }

  return finalize(state, ms, opp, log, moraleChanges, healthDelta, staminaDelta, opponentDefeated, battleEnd, state.player.health + healthDelta);
}

// ── Opponent attack sub-routine ──

function resolveOpponentAttack(
  opp: MeleeOpponent, ai: AIDecision, aiDef: ActionDef,
  freeAttack: boolean, playerGuarding: boolean, playerDodged: boolean, blockChance: number,
  turn: number, log: LogEntry[], moraleChanges: MoraleChange[],
  ms: MeleeState, state: BattleState,
): { healthDelta: number } {
  let healthDelta = 0;

  // Opponent stunned (stun already decremented at start of exchange)
  if (opp.stunned) {
    log.push({ turn, type: 'result', text: `${opp.name.split(' — ')[0]} stunned.` });
    return { healthDelta };
  }

  // Non-attack actions
  if (ai.action === MeleeActionId.Respite) {
    opp.stamina = Math.min(opp.maxStamina, opp.stamina + 30);
    log.push({ turn, type: 'result', text: `${opp.name.split(' — ')[0]} catches breath.` });
    return { healthDelta };
  }
  if (ai.action === MeleeActionId.Feint) {
    opp.feinted = true;
    log.push({ turn, type: 'result', text: `${opp.name.split(' — ')[0]} feints.` });
    return { healthDelta };
  }
  if (ai.action === MeleeActionId.Guard) {
    log.push({ turn, type: 'result', text: `${opp.name.split(' — ')[0]} guards.` });
    return { healthDelta };
  }
  if (ai.action === MeleeActionId.Dodge) {
    log.push({ turn, type: 'result', text: `${opp.name.split(' — ')[0]} dodges.` });
    return { healthDelta };
  }

  // Opponent attacks
  if (!aiDef.isAttack) return { healthDelta };
  ms.lastOppAttacked = true;

  // Player blocked
  if (playerGuarding) {
    const blocked = Math.random() < blockChance;
    if (blocked) {
      log.push({ turn, type: 'result', text: 'Blocked!' });
      oppSpendStamina(opp, aiDef);
      return { healthDelta };
    }
    log.push({ turn, type: 'action', text: 'Guard broken.' });
    // Even a failed block reduces incoming damage by 30%
  }

  // Player dodged
  if (playerDodged) {
    log.push({ turn, type: 'result', text: 'Dodged!' });
    oppSpendStamina(opp, aiDef);
    return { healthDelta };
  }

  // Calculate opponent hit — tier-differentiated base hit
  const BASE_OPP_HIT: Record<string, number> = {
    conscript: 0.35, line: 0.45, veteran: 0.55, sergeant: 0.60,
  };
  const baseHit = BASE_OPP_HIT[opp.type] ?? 0.45;
  const armPen = opp.armInjured ? 0.10 : 0;
  const feintBonus = opp.feinted ? 0.25 : 0;
  const oppHitRaw = baseHit + aiDef.hitBonus + BODY_PART_DEFS[ai.bodyPart].hitMod + feintBonus - armPen;
  const oppHit = Math.random() < Math.max(0.15, Math.min(0.85, oppHitRaw));

  if (oppHit) {
    let dmg = calcDamage(ai.action, ai.bodyPart, opp.stamina, opp.maxStamina, opp.strength);
    // Free attacks (during Respite/stunned) deal 70% damage — catching breath is dangerous
    if (freeAttack) dmg = Math.round(dmg * 0.7);
    // Failed guard still deflects 15% damage
    if (playerGuarding) dmg = Math.round(dmg * 0.85);
    healthDelta -= dmg;
    moraleChanges.push({ amount: -(dmg / 3), reason: `Hit by ${opp.name}`, source: 'event' });

    // Stun check
    const stunRoll = (ai.bodyPart === BodyPart.Head ? 0.30 : 0) + aiDef.stunBonus;
    if (stunRoll > 0 && Math.random() < stunRoll) {
      ms.playerStunned = 1;
      moraleChanges.push({ amount: -5, reason: 'Stunned!', source: 'event' });
      log.push({ turn, type: 'event', text: oppHitText(opp.name, ai.action, ai.bodyPart, dmg) + ' Stunned!' });
    } else {
      log.push({ turn, type: 'event', text: oppHitText(opp.name, ai.action, ai.bodyPart, dmg) });
    }
  } else {
    log.push({ turn, type: 'result', text: oppMissText(opp.name, ai.bodyPart) });
  }

  oppSpendStamina(opp, aiDef);
  return { healthDelta };
}

function oppSpendStamina(opp: MeleeOpponent, def: ActionDef) {
  const legMult = opp.legInjured ? 1.5 : 1.0;
  opp.stamina = Math.max(0, opp.stamina - Math.round(def.stamina * legMult));
}

function finalize(
  state: BattleState, ms: MeleeState, opp: MeleeOpponent,
  log: LogEntry[], moraleChanges: MoraleChange[],
  healthDelta: number, staminaDelta: number,
  opponentDefeated: boolean, battleEnd: string | undefined,
  _finalHP: number,
): MeleeExchangeResult {
  // Check opponent defeated — tier-specific break thresholds
  const breakPct = opp.type === 'conscript' ? 0.35 : opp.type === 'line' ? 0.25 : opp.type === 'veteran' ? 0.15 : 0;
  if (!opponentDefeated && (opp.health <= 0 || (breakPct > 0 && opp.health / opp.maxHealth <= breakPct))) {
    opponentDefeated = true;
    const killed = opp.health <= 0;
    log.push({
      turn: state.turn, type: 'event',
      text: killed
        ? `${opp.name.split(' — ')[0]} down.`
        : `${opp.name.split(' — ')[0]} breaks.`,
    });
    // No morale boost from defeating opponents — melee is grim, not glorious
    ms.killCount += 1;
    if (ms.currentOpponent >= ms.opponents.length - 1) battleEnd = 'victory';
  }

  const finalHP = state.player.health + healthDelta;
  if (finalHP <= 0) battleEnd = 'defeat';
  else if (opponentDefeated && finalHP < 25 && ms.killCount >= 2 && ms.currentOpponent < ms.opponents.length - 1) {
    battleEnd = 'survived';
  }

  ms.exchangeCount += 1;
  return {
    log, moraleChanges, healthDelta, staminaDelta, opponentDefeated,
    battleEnd: battleEnd as MeleeExchangeResult['battleEnd'],
  };
}

// ============================================================
// ADVANCE TO NEXT OPPONENT
// ============================================================

export function advanceToNextOpponent(state: BattleState): LogEntry[] {
  const ms = state.meleeState!;
  const log: LogEntry[] = [];
  const turn = state.turn;

  ms.currentOpponent += 1;
  ms.playerRiposte = false;
  ms.selectingStance = false;
  ms.selectingTarget = false;
  ms.selectedAction = undefined;

  const next = ms.opponents[ms.currentOpponent];
  log.push({
    turn, type: 'narrative',
    text: `Next: ${next.name}.`,
  });

  return log;
}

// ============================================================
// NARRATIVE HELPERS
// ============================================================

const PART_NAMES: Record<BodyPart, string> = {
  [BodyPart.Head]: 'face', [BodyPart.Torso]: 'chest', [BodyPart.Arms]: 'arm', [BodyPart.Legs]: 'thigh',
};

function playerHitText(_action: MeleeActionId, part: BodyPart, _dmg: number): string {
  return `Hit. ${PART_NAMES[part]}.`;
}

function playerMissText(_action: MeleeActionId, _part: BodyPart): string {
  return 'Miss.';
}

function oppHitText(name: string, _action: MeleeActionId, part: BodyPart, _dmg: number): string {
  const shortName = name.split(' — ')[0];
  return `${shortName} hits. ${PART_NAMES[part]}.`;
}

function oppMissText(name: string, _part: BodyPart): string {
  const shortName = name.split(' — ')[0];
  return `${shortName} misses.`;
}
