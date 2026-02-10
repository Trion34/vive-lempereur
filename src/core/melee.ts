import {
  BattleState, MeleeState, MeleeOpponent, MeleeStance, MeleeActionId, BodyPart,
  LogEntry, MoraleChange, MoraleThreshold,
} from '../types';

// ============================================================
// OPPONENT DEFINITIONS
// ============================================================

interface OpponentTemplate {
  name: string;
  type: 'conscript' | 'line' | 'veteran' | 'sergeant';
  health: [number, number];
  fatigue: [number, number];
  description: string;
}

const CONSCRIPT_NAMES = ['Hans Vogl', 'Stefan Brenner', 'Josef Leitner', 'Friedrich Mayer'];
const LINE_NAMES = ['Karl Wenger', 'Johann Huber', 'Franz Egger', 'Heinrich Moser'];
const SERGEANT_NAMES = ['Feldwebel Gruber', 'Feldwebel Steinbach', 'Feldwebel Pichler', 'Feldwebel Rainer'];

const OPPONENT_ROSTER: OpponentTemplate[] = [
  {
    name: 'Austrian conscript',
    type: 'conscript',
    health: [60, 75],
    fatigue: [50, 65],
    description: 'Wide-eyed, shaking. His Habsburg uniform is stained with mud and powder. The point of his musket weaves in front of him like a drunk\'s sword.',
  },
  {
    name: 'Austrian line infantryman',
    type: 'line',
    health: [60, 75],
    fatigue: [55, 75],
    description: 'Calm enough. A career soldier of the Deutschmeister regiment — he knows the drill. Steel levelled, feet planted, eyes on you.',
  },
  {
    name: 'Austrian Feldwebel',
    type: 'sergeant',
    health: [80, 100],
    fatigue: [65, 85],
    description: 'Old. Scarred. The gold lace on his uniform is faded from a dozen campaigns. His eyes are dead calm. He\'s done this before — at Neerwinden, at Fleurus, at Arcole. Many times.',
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
  const fatigue = randRange(t.fatigue[0], t.fatigue[1]);
  const personalName = pickName(t.type);
  return {
    name: `${personalName} — ${t.name}`, type: t.type,
    health, maxHealth: health, fatigue, maxFatigue: fatigue,
    stunned: false, stunnedTurns: 0, feinted: false,
    armInjured: false, legInjured: false, description: t.description,
  };
}

// ============================================================
// CREATE MELEE STATE
// ============================================================

export function createMeleeState(state: BattleState): MeleeState {
  const opponents = OPPONENT_ROSTER.map(t => makeOpponent(t));
  const jbAlive = !!state.line.rightNeighbour?.alive && !state.line.rightNeighbour.routing;

  return {
    opponents, currentOpponent: 0,
    playerStance: MeleeStance.Balanced,
    playerFeinted: false, playerRiposte: false, playerStunned: 0,
    exchangeCount: 0, selectingStance: false, selectingTarget: false,
    killCount: 0, jbAliveInMelee: jbAlive, valorTempBonus: 0,
    maxExchanges: 12,
  };
}

// ============================================================
// CONSTANTS
// ============================================================

const STANCE_MODS: Record<MeleeStance, { attack: number; defense: number; fatigueCost: number }> = {
  [MeleeStance.Aggressive]: { attack: 0.20, defense: -0.15, fatigueCost: 6 },
  [MeleeStance.Balanced]:   { attack: 0,    defense: 0,     fatigueCost: 4 },
  [MeleeStance.Defensive]:  { attack: -0.15, defense: 0.20, fatigueCost: 2 },
};

interface ActionDef {
  fatigue: number;
  hitBonus: number;
  damageMod: number;
  isAttack: boolean;
  stunBonus: number;
}

const ACTION_DEFS: Record<MeleeActionId, ActionDef> = {
  [MeleeActionId.BayonetThrust]:  { fatigue: 6,   hitBonus: 0,    damageMod: 1.0, isAttack: true,  stunBonus: 0    },
  [MeleeActionId.AggressiveLunge]:{ fatigue: 12,  hitBonus: 0.15, damageMod: 1.5, isAttack: true,  stunBonus: 0    },
  [MeleeActionId.ButtStrike]:     { fatigue: 8,   hitBonus: 0.10, damageMod: 0.6, isAttack: true,  stunBonus: 0.20 },
  [MeleeActionId.Feint]:          { fatigue: 4,   hitBonus: 0,    damageMod: 0,   isAttack: false, stunBonus: 0    },
  [MeleeActionId.Guard]:          { fatigue: 2,   hitBonus: 0,    damageMod: 0,   isAttack: false, stunBonus: 0    },
  [MeleeActionId.Dodge]:          { fatigue: 4,   hitBonus: 0,    damageMod: 0,   isAttack: false, stunBonus: 0    },
  [MeleeActionId.Respite]:        { fatigue: -15, hitBonus: 0,    damageMod: 0,   isAttack: false, stunBonus: 0    },
  [MeleeActionId.Shoot]:          { fatigue: 3,   hitBonus: 0,    damageMod: 2.0, isAttack: true,  stunBonus: 0    },
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

export interface MeleeActionChoice {
  id: MeleeActionId;
  label: string;
  description: string;
  available: boolean;
  fatigueCost: number;
}

export function getMeleeActions(state: BattleState): MeleeActionChoice[] {
  const fatigue = state.player.fatigue;
  const musketLoaded = state.player.musketLoaded;

  const actions: MeleeActionChoice[] = [
    { id: MeleeActionId.BayonetThrust,   label: 'Bayonet Thrust',   description: 'Standard thrust. Reliable.',                             available: fatigue >= 6,  fatigueCost: 6  },
    { id: MeleeActionId.AggressiveLunge,  label: 'Aggressive Lunge', description: 'Commit everything. +15% hit, 1.5x damage.',             available: fatigue >= 12, fatigueCost: 12 },
    { id: MeleeActionId.ButtStrike,       label: 'Butt Strike',      description: 'Musket butt. Less damage but high stun chance.',         available: fatigue >= 8,  fatigueCost: 8  },
    { id: MeleeActionId.Feint,            label: 'Feint',            description: 'Fake attack. Drains opponent fatigue (-15).',            available: fatigue >= 4,  fatigueCost: 4  },
    { id: MeleeActionId.Guard,            label: 'Guard',            description: '60% block chance. Blocked attacks deal no damage.',       available: true,          fatigueCost: 2  },
    { id: MeleeActionId.Dodge,            label: 'Dodge',            description: '50% evade. Success grants riposte (+15% next hit).',     available: fatigue >= 4,  fatigueCost: 4  },
    { id: MeleeActionId.Respite,          label: 'Catch Breath',     description: 'Recover 15 fatigue. Opponent gets a free attack.',       available: true,          fatigueCost: -15 },
  ];

  // Add Shoot action only when musket is loaded
  if (musketLoaded) {
    actions.splice(0, 0, {
      id: MeleeActionId.Shoot,
      label: 'Shoot',
      description: 'Fire your loaded musket. 2x damage, 25% head crit. Cannot be blocked.',
      available: true,
      fatigueCost: 3,
    });
  }

  // At 0 fatigue: forced respite only
  if (fatigue <= 0) return actions.filter(a => a.id === MeleeActionId.Respite);

  // Catch Breath always available
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
  if (opp.fatigue <= 5) return { action: MeleeActionId.Respite, bodyPart: BodyPart.Torso };

  switch (opp.type) {
    case 'conscript': return conscriptAI(opp);
    case 'line':      return lineAI(opp);
    case 'veteran':
    case 'sergeant':  return veteranAI(opp, state);
  }
}

function conscriptAI(opp: MeleeOpponent): AIDecision {
  const r = Math.random();
  const hPct = opp.health / opp.maxHealth;
  if (hPct < 0.4) {
    return r < 0.4
      ? { action: MeleeActionId.AggressiveLunge, bodyPart: BodyPart.Torso }
      : { action: MeleeActionId.Guard, bodyPart: BodyPart.Torso };
  }
  if (r < 0.45) return { action: MeleeActionId.BayonetThrust, bodyPart: BodyPart.Torso };
  if (r < 0.75) return { action: MeleeActionId.Guard, bodyPart: BodyPart.Torso };
  return { action: MeleeActionId.Dodge, bodyPart: BodyPart.Torso };
}

function lineAI(opp: MeleeOpponent): AIDecision {
  const r = Math.random();
  const sPct = opp.fatigue / opp.maxFatigue;
  const targets: BodyPart[] = [BodyPart.Torso, BodyPart.Torso, BodyPart.Arms, BodyPart.Legs];
  const target = targets[Math.floor(Math.random() * targets.length)];

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

// ============================================================
// HIT / DAMAGE CALCULATION
// ============================================================

function calcHitChance(
  dexterity: number, morale: number, maxMorale: number,
  stance: MeleeStance, action: MeleeActionId,
  bodyPart: BodyPart, riposte: boolean, fatigue: number,
): number {
  const moralePenalty = (1 - morale / maxMorale) * 0.15;
  const raw = 0.60
    + STANCE_MODS[stance].attack
    + ACTION_DEFS[action].hitBonus
    + BODY_PART_DEFS[bodyPart].hitMod
    + (riposte ? 0.15 : 0)
    + dexterity / 200
    - moralePenalty
    - (fatigue < 50 ? (50 - fatigue) * 0.01 : 0);
  return Math.max(0.05, Math.min(0.95, raw));
}

function calcDamage(action: MeleeActionId, bodyPart: BodyPart, fatigue: number, strength: number = 40): number {
  const [lo, hi] = BODY_PART_DEFS[bodyPart].damageRange;
  const strengthMod = 0.75 + strength / 200; // strength 50 = 1.0x, strength 100 = 1.25x
  let dmg = Math.round(randRange(lo, hi) * ACTION_DEFS[action].damageMod * strengthMod);
  if (fatigue < 25) dmg = Math.round(dmg * 0.75);
  return Math.max(1, dmg);
}

// ============================================================
// RESOLVE MELEE EXCHANGE
// ============================================================

export interface MeleeExchangeResult {
  log: LogEntry[];
  moraleChanges: MoraleChange[];
  healthDelta: number;
  fatigueDelta: number;
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
  let fatigueDelta = 0;
  let opponentDefeated = false;
  let battleEnd: 'victory' | 'defeat' | 'survived' | undefined;

  playerHistory.push(playerAction);

  const pDef = ACTION_DEFS[playerAction];
  const sDef = STANCE_MODS[ms.playerStance];

  // Player fatigue cost (action + stance base)
  fatigueDelta -= (pDef.fatigue + sDef.fatigueCost);

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
    log.push({ turn, type: 'result', text: 'You stagger, still dazed from the blow. You can\'t act.' });
    fatigueDelta = -sDef.fatigueCost; // Only stance cost
    const oppResult = resolveOpponentAttack(opp, ai, aiDef, true, false, false, 0, turn, log, moraleChanges, ms, state);
    healthDelta += oppResult.healthDelta;
    ms.playerStunned -= 1;
    return finalize(state, ms, opp, log, moraleChanges, healthDelta, fatigueDelta, opponentDefeated, battleEnd, state.player.health + healthDelta);
  }

  // ── PLAYER RESPITE ──
  if (playerAction === MeleeActionId.Respite) {
    log.push({ turn, type: 'action', text: 'You stumble back, gasping for air. A moment\'s respite — but he\'s still coming.' });
    const oppResult = resolveOpponentAttack(opp, ai, aiDef, true, false, false, 0, turn, log, moraleChanges, ms, state);
    healthDelta += oppResult.healthDelta;
    return finalize(state, ms, opp, log, moraleChanges, healthDelta, fatigueDelta, opponentDefeated, battleEnd, state.player.health + healthDelta);
  }

  // ── PLAYER SHOOT ──
  if (playerAction === MeleeActionId.Shoot) {
    state.player.musketLoaded = false;
    const target = bodyPart || BodyPart.Torso;
    // Shoot has high base hit, cannot be blocked
    const hitChance = calcHitChance(
      state.player.dexterity, state.player.morale, state.player.maxMorale,
      ms.playerStance, playerAction, target, ms.playerRiposte, state.player.fatigue,
    );
    const hit = Math.random() < Math.max(0.10, hitChance);

    if (hit) {
      const dmg = calcDamage(playerAction, target, state.player.fatigue, state.player.strength);
      opp.health -= dmg;
      moraleChanges.push({ amount: dmg / 3, reason: 'Musket ball found its mark', source: 'action' });

      let special = '';
      // Head shot: 25% instant kill
      if (target === BodyPart.Head && Math.random() < 0.25) {
        opp.health = 0;
        special = ' The ball takes him through the skull. He drops instantly.';
      }

      log.push({ turn, type: 'result', text: `You level the musket and fire point-blank. The ball smashes into his ${PART_NAMES[target]}.${special}` });
    } else {
      log.push({ turn, type: 'result', text: 'You fire — but the ball goes wide. The smoke clears. He\'s still standing. And your musket is empty.' });
    }

    ms.playerRiposte = false;

    // Turn-based: no opponent counter-attack on player's attack turn
    ms.exchangeCount += 1;

    // Check opponent defeated
    const breakPct = opp.type === 'conscript' ? 0.30 : opp.type === 'line' ? 0.20 : 0;
    if (opp.health <= 0 || (breakPct > 0 && opp.health / opp.maxHealth <= breakPct)) {
      opponentDefeated = true;
      const killed = opp.health <= 0;
      log.push({
        turn, type: 'event',
        text: killed
          ? `${opp.name} falls. He does not get up.`
          : `${opp.name} breaks — he drops his weapon and scrambles back, beaten.`,
      });
      moraleChanges.push({ amount: 8, reason: `Opponent ${killed ? 'killed' : 'broken'}`, source: 'action' });
      ms.killCount += 1;
      if (ms.currentOpponent >= ms.opponents.length - 1) battleEnd = 'victory';
    }

    const finalHP = state.player.health + healthDelta;
    if (finalHP <= 0) battleEnd = 'defeat';
    else if (opponentDefeated && finalHP < 25 && ms.killCount >= 2 && ms.currentOpponent < ms.opponents.length - 1) {
      battleEnd = 'survived';
    }

    return { log, moraleChanges, healthDelta, fatigueDelta, opponentDefeated, battleEnd };
  }

  // ── PLAYER FEINT ──
  if (playerAction === MeleeActionId.Feint) {
    // Feint drains opponent fatigue instead of granting hit bonus
    const fatigueDrain = 15;
    opp.fatigue = Math.max(0, opp.fatigue - fatigueDrain);
    log.push({ turn, type: 'action', text: `You fake a thrust — your opponent reacts, wasting energy. His breathing grows heavier.` });
    const oppResult = resolveOpponentAttack(opp, ai, aiDef, false, false, false, 0, turn, log, moraleChanges, ms, state);
    healthDelta += oppResult.healthDelta;
    return finalize(state, ms, opp, log, moraleChanges, healthDelta, fatigueDelta, opponentDefeated, battleEnd, state.player.health + healthDelta);
  }

  // ── PLAYER GUARD ──
  if (playerAction === MeleeActionId.Guard) {
    const blockChance = 0.60 + sDef.defense;
    const oppResult = resolveOpponentAttack(opp, ai, aiDef, false, true, false, blockChance, turn, log, moraleChanges, ms, state);
    healthDelta += oppResult.healthDelta;
    return finalize(state, ms, opp, log, moraleChanges, healthDelta, fatigueDelta, opponentDefeated, battleEnd, state.player.health + healthDelta);
  }

  // ── PLAYER DODGE ──
  if (playerAction === MeleeActionId.Dodge) {
    const evadeChance = 0.50 + sDef.defense;
    const dodged = Math.random() < evadeChance;
    if (dodged) {
      ms.playerRiposte = true;
      log.push({ turn, type: 'action', text: 'You twist aside — his strike misses. You see the opening.' });
    }
    const oppResult = resolveOpponentAttack(opp, ai, aiDef, false, false, dodged, 0, turn, log, moraleChanges, ms, state);
    healthDelta += oppResult.healthDelta;
    return finalize(state, ms, opp, log, moraleChanges, healthDelta, fatigueDelta, opponentDefeated, battleEnd, state.player.health + healthDelta);
  }

  // ── PLAYER ATTACK ── (turn-based: opponent does NOT counter-attack on player's attack turn)
  if (pDef.isAttack && bodyPart) {
    const hitChance = calcHitChance(
      state.player.dexterity, state.player.morale, state.player.maxMorale,
      ms.playerStance, playerAction, bodyPart,
      ms.playerRiposte, state.player.fatigue,
    );

    const hit = Math.random() < Math.max(0.05, hitChance);

    if (hit) {
      const dmg = calcDamage(playerAction, bodyPart, state.player.fatigue, state.player.strength);
      opp.health -= dmg;
      moraleChanges.push({ amount: dmg / 4, reason: 'Your strike connects', source: 'action' });

      let special = '';
      // Head: stun + instant kill chance
      if (bodyPart === BodyPart.Head) {
        if (Math.random() < 0.10) {
          opp.health = 0;
          special = ' The blow is devastating — he goes down and doesn\'t move.';
        } else if (Math.random() < 0.35 + pDef.stunBonus) {
          opp.stunned = true; opp.stunnedTurns = 1;
          special = ' He staggers — stunned!';
          moraleChanges.push({ amount: 3, reason: 'Stunned opponent', source: 'action' });
        }
      }
      // Butt Strike stun
      if (playerAction === MeleeActionId.ButtStrike && !special && Math.random() < pDef.stunBonus) {
        opp.stunned = true; opp.stunnedTurns = 1;
        special = ' The impact rattles him — stunned!';
        moraleChanges.push({ amount: 3, reason: 'Stunned opponent', source: 'action' });
      }
      // Arms
      if (bodyPart === BodyPart.Arms && Math.random() < 0.15) {
        opp.armInjured = true;
        special = ' His arm is injured — his strikes weaken.';
      }
      // Legs
      if (bodyPart === BodyPart.Legs && Math.random() < 0.10) {
        opp.legInjured = true;
        special = ' His leg buckles — he\'s slowing.';
      }

      log.push({ turn, type: 'result', text: playerHitText(playerAction, bodyPart, dmg) + special });
    } else {
      log.push({ turn, type: 'result', text: playerMissText(playerAction, bodyPart) });
    }

    ms.playerRiposte = false;
  }

  // Turn-based: opponent only acts when player chose defense/utility (Guard, Dodge, Feint)
  // Player attacks = player's turn only. Opponent responds next exchange.
  // (Respite and Stunned already handle opponent free attacks above)

  ms.exchangeCount += 1;

  // Check opponent defeated
  const breakPct = opp.type === 'conscript' ? 0.30 : opp.type === 'line' ? 0.20 : 0;
  if (opp.health <= 0 || (breakPct > 0 && opp.health / opp.maxHealth <= breakPct)) {
    opponentDefeated = true;
    const killed = opp.health <= 0;
    log.push({
      turn, type: 'event',
      text: killed
        ? `${opp.name} falls. He does not get up.`
        : `${opp.name} breaks — he drops his weapon and scrambles back, beaten.`,
    });
    moraleChanges.push({ amount: 8, reason: `Opponent ${killed ? 'killed' : 'broken'}`, source: 'action' });
    ms.killCount += 1;

    if (ms.currentOpponent >= ms.opponents.length - 1) {
      battleEnd = 'victory';
    }
  }

  // Check player death / survived
  const finalHP = state.player.health + healthDelta;
  if (finalHP <= 0) {
    battleEnd = 'defeat';
  } else if (opponentDefeated && finalHP < 25 && ms.killCount >= 2 && ms.currentOpponent < ms.opponents.length - 1) {
    battleEnd = 'survived';
  }

  return { log, moraleChanges, healthDelta, fatigueDelta, opponentDefeated, battleEnd };
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
    log.push({ turn, type: 'result', text: `${opp.name} is stunned — unable to act.` });
    return { healthDelta };
  }

  // Non-attack actions
  if (ai.action === MeleeActionId.Respite) {
    opp.fatigue = Math.min(opp.maxFatigue, opp.fatigue + 10);
    log.push({ turn, type: 'result', text: `${opp.name} catches his breath.` });
    return { healthDelta };
  }
  if (ai.action === MeleeActionId.Feint) {
    opp.feinted = true;
    log.push({ turn, type: 'result', text: `${opp.name} makes a feinting motion — testing your guard.` });
    return { healthDelta };
  }
  if (ai.action === MeleeActionId.Guard) {
    log.push({ turn, type: 'result', text: `${opp.name} holds his guard.` });
    return { healthDelta };
  }
  if (ai.action === MeleeActionId.Dodge) {
    log.push({ turn, type: 'result', text: `${opp.name} shifts his weight, ready to evade.` });
    return { healthDelta };
  }

  // Opponent attacks
  if (!aiDef.isAttack) return { healthDelta };

  // Player blocked
  if (playerGuarding) {
    const blocked = Math.random() < blockChance;
    if (blocked) {
      log.push({ turn, type: 'result', text: `${opp.name} strikes — your guard holds! The impact jars your arms but you take no damage.` });
      oppSpendFatigue(opp, aiDef);
      return { healthDelta };
    }
    log.push({ turn, type: 'action', text: 'You brace — but the angle breaks through your guard. The blow is partially deflected.' });
    // Even a failed block reduces incoming damage by 30%
  }

  // Player dodged
  if (playerDodged) {
    log.push({ turn, type: 'result', text: `${opp.name.split(' — ')[0]} strikes — you\'ve already moved. His steel finds air.` });
    oppSpendFatigue(opp, aiDef);
    return { healthDelta };
  }

  // Calculate opponent hit
  const armPen = opp.armInjured ? 0.10 : 0;
  const feintBonus = opp.feinted ? 0.25 : 0;
  const oppHitRaw = 0.45 + aiDef.hitBonus + BODY_PART_DEFS[ai.bodyPart].hitMod + feintBonus - armPen;
  const oppHit = Math.random() < Math.max(0.15, Math.min(0.85, oppHitRaw));

  if (oppHit) {
    let dmg = calcDamage(ai.action, ai.bodyPart, opp.fatigue);
    // Free attacks (during Respite/stunned) deal half damage — opportunistic strikes
    if (freeAttack) dmg = Math.round(dmg * 0.5);
    // Failed guard still deflects 30% damage
    if (playerGuarding) dmg = Math.round(dmg * 0.7);
    healthDelta -= dmg;
    moraleChanges.push({ amount: -(dmg / 3), reason: `Hit by ${opp.name}`, source: 'event' });

    // Stun check
    const stunRoll = (ai.bodyPart === BodyPart.Head ? 0.30 : 0) + aiDef.stunBonus;
    if (stunRoll > 0 && Math.random() < stunRoll) {
      ms.playerStunned = 1;
      moraleChanges.push({ amount: -5, reason: 'Stunned!', source: 'event' });
      log.push({ turn, type: 'event', text: oppHitText(opp.name, ai.action, ai.bodyPart, dmg) + ' The world spins — you\'re stunned!' });
    } else {
      log.push({ turn, type: 'event', text: oppHitText(opp.name, ai.action, ai.bodyPart, dmg) });
    }
  } else {
    log.push({ turn, type: 'result', text: oppMissText(opp.name, ai.bodyPart) });
  }

  oppSpendFatigue(opp, aiDef);
  return { healthDelta };
}

function oppSpendFatigue(opp: MeleeOpponent, def: ActionDef) {
  const legMult = opp.legInjured ? 1.5 : 1.0;
  opp.fatigue = Math.max(0, opp.fatigue - Math.round(def.fatigue * legMult));
}

function finalize(
  state: BattleState, ms: MeleeState, opp: MeleeOpponent,
  log: LogEntry[], moraleChanges: MoraleChange[],
  healthDelta: number, fatigueDelta: number,
  opponentDefeated: boolean, battleEnd: string | undefined,
  _finalHP: number,
): MeleeExchangeResult {
  // Check opponent defeated
  const breakPct = opp.type === 'conscript' ? 0.30 : opp.type === 'line' ? 0.20 : 0;
  if (!opponentDefeated && (opp.health <= 0 || (breakPct > 0 && opp.health / opp.maxHealth <= breakPct))) {
    opponentDefeated = true;
    const killed = opp.health <= 0;
    log.push({
      turn: state.turn, type: 'event',
      text: killed
        ? `${opp.name} falls. He does not get up.`
        : `${opp.name} breaks — he drops his weapon and scrambles back, beaten.`,
    });
    moraleChanges.push({ amount: 8, reason: `Opponent ${killed ? 'killed' : 'broken'}`, source: 'action' });
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
    log, moraleChanges, healthDelta, fatigueDelta, opponentDefeated,
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
    text: `Another steps forward.\n\n${next.description}\n\n${next.name} faces you.`,
  });

  // JB narrative callback between opponents
  if (ms.currentOpponent === 2 && ms.jbAliveInMelee) {
    if (state.jbCrisisOutcome === 'steadied') {
      log.push({
        turn, type: 'event',
        text: 'To your right, Jean-Baptiste drives his bayonet into a man\'s side. The conscript screams and falls. JB stares at what he\'s done — then sets his jaw and raises the bloody steel.\n\nHe\'s not a boy anymore.',
      });
    } else {
      log.push({
        turn, type: 'event',
        text: 'Jean-Baptiste freezes. An enemy lunges — catches him across the shoulder. JB cries out and stumbles back, clutching the wound.\n\nHe\'s alive. But he\'s done.',
      });
    }
  }

  return log;
}

// ============================================================
// NARRATIVE HELPERS
// ============================================================

const PART_NAMES: Record<BodyPart, string> = {
  [BodyPart.Head]: 'face', [BodyPart.Torso]: 'chest', [BodyPart.Arms]: 'arm', [BodyPart.Legs]: 'thigh',
};

function playerHitText(action: MeleeActionId, part: BodyPart, _dmg: number): string {
  const p = PART_NAMES[part];
  if (action === MeleeActionId.BayonetThrust) {
    if (part === BodyPart.Head) return `Your point catches his ${p}. A spray of blood — he staggers.`;
    if (part === BodyPart.Torso) return `The thrust finds his ${p}. Clean. Textbook. The steel goes in and comes out red.`;
    if (part === BodyPart.Arms) return `The socket blade slices across his ${p}. He cries out, grip loosening on his musket.`;
    return `Your steel catches his ${p}. He stumbles, cursing in German.`;
  }
  if (action === MeleeActionId.AggressiveLunge) {
    return `You commit everything — the lunge drives into his ${p} with your full weight behind seventeen inches of cold iron.`;
  }
  if (action === MeleeActionId.ButtStrike) {
    if (part === BodyPart.Head) return `The brass butt-plate cracks across his jaw. His head snaps sideways.`;
    return `The musket butt hammers his ${p}. The crunch is felt through the stock.`;
  }
  return `Your attack connects with his ${p}. He reels.`;
}

function playerMissText(action: MeleeActionId, part: BodyPart): string {
  const p = PART_NAMES[part];
  if (action === MeleeActionId.AggressiveLunge) return `You lunge — overextended. The point misses his ${p} by inches. You stumble forward.`;
  if (action === MeleeActionId.ButtStrike) return `The butt-strike swings past his ${p}. Momentum pulls you off-balance.`;
  return `Your thrust at his ${p} goes wide. Steel finds nothing but cold air.`;
}

function oppHitText(name: string, _action: MeleeActionId, part: BodyPart, _dmg: number): string {
  const p = PART_NAMES[part];
  const shortName = name.split(' — ')[0];
  const texts: string[] = [
    `${shortName}'s steel catches your ${p}. Fire blooms through you.`,
    `A strike from ${shortName} opens a wound across your ${p}. Blood, hot and immediate.`,
    `${shortName} finds your ${p}. The pain is a white flash behind your eyes.`,
    `The point slips past your guard — ${shortName} scores your ${p}. You gasp.`,
  ];
  return texts[Math.floor(Math.random() * texts.length)];
}

function oppMissText(name: string, part: BodyPart): string {
  const shortName = name.split(' — ')[0];
  const p = PART_NAMES[part];
  const texts: string[] = [
    `${shortName} strikes at your ${p} — but the point goes wide.`,
    `${shortName} lunges for your ${p}. You twist aside. Steel cuts air.`,
    `A thrust from ${shortName} grazes past your ${p}. Close. Too close.`,
  ];
  return texts[Math.floor(Math.random() * texts.length)];
}
