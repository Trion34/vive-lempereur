import {
  BattleState,
  MeleeOpponent,
  MeleeAlly,
  MeleeStance,
  MeleeActionId,
  BodyPart,
} from '../../types';
import { getMeleeTuning } from './tuning';
import type { MeleeTuning } from './tuning';

// ============================================================
// AI
// ============================================================

interface AIDecision {
  action: MeleeActionId;
  bodyPart: BodyPart;
}

let playerHistory: MeleeActionId[] = [];
export function resetMeleeHistory(): void {
  playerHistory = []; // classic compat — v2 uses per-opponent
}

/**
 * Push a player action into the global history for classic AI.
 * In v2 mode the per-opponent tracking in round.ts replaces this,
 * but classic callers can still feed the global.
 */
export function recordPlayerAction(action: MeleeActionId): void {
  playerHistory.push(action);
  if (playerHistory.length > 6) playerHistory.shift();
}

/** Random body part (weighted toward torso) for reactive AI overrides */
function randomBodyPart(): BodyPart {
  const roll = Math.random();
  if (roll < 0.55) return BodyPart.Torso;
  if (roll < 0.75) return BodyPart.Arms;
  if (roll < 0.90) return BodyPart.Legs;
  return BodyPart.Head;
}

/**
 * Get the action history to use for a given opponent.
 * V2: use per-opponent observed actions if available and non-empty.
 * Classic: fall back to the global playerHistory.
 */
function getHistory(opp: MeleeOpponent, tuning: MeleeTuning): MeleeActionId[] {
  if (
    tuning.version === 'v2' &&
    opp.observedPlayerActions !== undefined &&
    opp.observedPlayerActions.length > 0
  ) {
    return opp.observedPlayerActions;
  }
  return playerHistory;
}

export function chooseMeleeAI(opp: MeleeOpponent, state: BattleState): AIDecision {
  if (opp.stunned) return { action: MeleeActionId.Guard, bodyPart: BodyPart.Torso };

  const tuning = getMeleeTuning(state);
  if (opp.stamina <= 15) {
    if (tuning.version === 'v2') {
      // V2: weighted probability instead of forced Respite
      const r = Math.random();
      if (r < 0.4) return { action: MeleeActionId.Respite, bodyPart: BodyPart.Torso };
      if (r < 0.7) return { action: MeleeActionId.Guard, bodyPart: BodyPart.Torso };
      // 30%: fall through to normal AI
    } else {
      return { action: MeleeActionId.Respite, bodyPart: BodyPart.Torso };
    }
  }

  // Fatigue-driven Second Wind: conscripts desperate earlier, veterans push harder
  const fatiguePct = opp.maxFatigue > 0 ? opp.fatigue / opp.maxFatigue : 0;
  const swThreshold = opp.type === 'conscript' ? 0.4 : 0.5;
  if (fatiguePct >= swThreshold && Math.random() < 0.35) {
    return { action: MeleeActionId.SecondWind, bodyPart: BodyPart.Torso };
  }

  let decision: AIDecision;
  switch (opp.type) {
    case 'conscript':
      decision = conscriptAI(opp);
      break;
    case 'line':
      decision = lineAI(opp, state, tuning);
      break;
    case 'veteran':
      decision = veteranAI(opp, state, tuning);
      break;
    case 'sergeant':
      decision = sergeantAI(opp, state, tuning);
      break;
  }

  // === V2 reactive AI modifiers (applied after base decision) ===
  if (tuning.version === 'v2') {
    const ms = state.meleeState;

    // Player HP < 30% of maxHealth: +20% chance to switch to Lunge (smell blood)
    const playerHpPct = state.player.maxHealth > 0
      ? state.player.health / state.player.maxHealth
      : 0;
    if (playerHpPct < 0.3 && Math.random() < 0.20) {
      return { action: MeleeActionId.AggressiveLunge, bodyPart: randomBodyPart() };
    }

    // Player stamina <= 0: +30% chance to switch to Lunge (punish exhaustion)
    if (state.player.stamina <= 0 && Math.random() < 0.30) {
      return { action: MeleeActionId.AggressiveLunge, bodyPart: randomBodyPart() };
    }

    // Player momentum >= 2: +25% chance to switch to Guard (defensive response)
    if (ms && ms.playerMomentum >= 2 && Math.random() < 0.25) {
      return { action: MeleeActionId.Guard, bodyPart: BodyPart.Torso };
    }

    // === Temperament influence ===
    if (opp.temperament !== undefined) {
      // High temperament (>65): 20% chance to upgrade Guard -> Thrust, Thrust -> Lunge
      if (opp.temperament > 65 && Math.random() < 0.20) {
        if (decision.action === MeleeActionId.Guard) decision.action = MeleeActionId.BayonetThrust;
        else if (decision.action === MeleeActionId.BayonetThrust) decision.action = MeleeActionId.AggressiveLunge;
      }
      // Low temperament (<35): 20% chance to downgrade Lunge -> Thrust, Thrust -> Guard
      if (opp.temperament < 35 && Math.random() < 0.20) {
        if (decision.action === MeleeActionId.AggressiveLunge) decision.action = MeleeActionId.BayonetThrust;
        else if (decision.action === MeleeActionId.BayonetThrust) decision.action = MeleeActionId.Guard;
      }
    }
  }

  return decision;
}

function conscriptAI(opp: MeleeOpponent): AIDecision {
  const r = Math.random();
  const hPct = opp.maxHealth > 0 ? opp.health / opp.maxHealth : 0;
  if (hPct < 0.3) {
    // Panic: 60% flee instinct (respite), 40% desperate lunge
    return r < 0.6
      ? { action: MeleeActionId.Respite, bodyPart: BodyPart.Torso }
      : { action: MeleeActionId.AggressiveLunge, bodyPart: BodyPart.Torso };
  }
  if (r < 0.45) return { action: MeleeActionId.BayonetThrust, bodyPart: BodyPart.Torso };
  return { action: MeleeActionId.Guard, bodyPart: BodyPart.Torso };
}

function lineAI(opp: MeleeOpponent, state: BattleState, tuning: MeleeTuning): AIDecision {
  const r = Math.random();
  const sPct = opp.maxStamina > 0 ? opp.stamina / opp.maxStamina : 0;
  // 60% torso, 20% arms, 15% legs, 5% head
  const tRoll = Math.random();
  const target =
    tRoll < 0.6
      ? BodyPart.Torso
      : tRoll < 0.8
        ? BodyPart.Arms
        : tRoll < 0.95
          ? BodyPart.Legs
          : BodyPart.Head;

  // Punish player respite with lunge
  const history = getHistory(opp, tuning);
  const recent = history.slice(-2);
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
  if (r < 0.7) return { action: MeleeActionId.ButtStrike, bodyPart: target };
  return { action: MeleeActionId.Guard, bodyPart: BodyPart.Torso };
}

function veteranAI(opp: MeleeOpponent, state: BattleState, tuning: MeleeTuning): AIDecision {
  const r = Math.random();
  const history = getHistory(opp, tuning);
  const recent = history.slice(-3);
  const defCount = recent.filter((a) => a === MeleeActionId.Guard).length;
  const atkCount = recent.filter(
    (a) => a === MeleeActionId.AggressiveLunge || a === MeleeActionId.BayonetThrust,
  ).length;

  // Pattern reading: counter repeated actions
  if (recent.length >= 2 && recent[recent.length - 1] === recent[recent.length - 2]) {
    const repeated = recent[recent.length - 1];
    if (repeated === MeleeActionId.Guard)
      return { action: MeleeActionId.Feint, bodyPart: BodyPart.Head };
    if (repeated === MeleeActionId.BayonetThrust || repeated === MeleeActionId.AggressiveLunge)
      return { action: MeleeActionId.Guard, bodyPart: BodyPart.Torso };
  }

  // Adapt to patterns
  if (defCount >= 2) return { action: MeleeActionId.Feint, bodyPart: BodyPart.Head };
  if (atkCount >= 2) return { action: MeleeActionId.Guard, bodyPart: BodyPart.Torso };

  const targets: BodyPart[] = [BodyPart.Head, BodyPart.Torso, BodyPart.Arms];
  const target = targets[Math.floor(Math.random() * targets.length)];

  if (r < 0.25) return { action: MeleeActionId.BayonetThrust, bodyPart: target };
  if (r < 0.45) return { action: MeleeActionId.AggressiveLunge, bodyPart: target };
  if (r < 0.55) return { action: MeleeActionId.Feint, bodyPart: target };
  if (r < 0.7) return { action: MeleeActionId.ButtStrike, bodyPart: target };
  return { action: MeleeActionId.Guard, bodyPart: BodyPart.Torso };
}

function sergeantAI(opp: MeleeOpponent, state: BattleState, tuning: MeleeTuning): AIDecision {
  const r = Math.random();
  const history = getHistory(opp, tuning);
  const recent = history.slice(-4); // 4-move window (wider than veteran)
  const defCount = recent.filter((a) => a === MeleeActionId.Guard).length;
  const atkCount = recent.filter(
    (a) => a === MeleeActionId.AggressiveLunge || a === MeleeActionId.BayonetThrust,
  ).length;

  // Pattern reading: counter repeated actions (same as veteran)
  if (recent.length >= 2 && recent[recent.length - 1] === recent[recent.length - 2]) {
    const repeated = recent[recent.length - 1];
    if (repeated === MeleeActionId.Guard)
      return { action: MeleeActionId.Feint, bodyPart: BodyPart.Head };
    if (repeated === MeleeActionId.BayonetThrust || repeated === MeleeActionId.AggressiveLunge)
      return { action: MeleeActionId.Guard, bodyPart: BodyPart.Torso };
  }

  // Reads stance patterns: if player always Defensive, Feint->Lunge combo
  if (state.meleeState?.playerStance === MeleeStance.Defensive && defCount >= 2) {
    return r < 0.6
      ? { action: MeleeActionId.Feint, bodyPart: BodyPart.Head }
      : { action: MeleeActionId.AggressiveLunge, bodyPart: BodyPart.Torso };
  }

  // Adapt to patterns
  if (defCount >= 2) return { action: MeleeActionId.Feint, bodyPart: BodyPart.Head };
  if (atkCount >= 2) return { action: MeleeActionId.Guard, bodyPart: BodyPart.Torso };

  // Never uses Respite until <10% stamina (discipline/pride)
  if (opp.maxStamina > 0 && opp.stamina / opp.maxStamina < 0.1) {
    return { action: MeleeActionId.Respite, bodyPart: BodyPart.Torso };
  }

  const targets: BodyPart[] = [BodyPart.Head, BodyPart.Torso, BodyPart.Arms];
  const target = targets[Math.floor(Math.random() * targets.length)];

  // Higher lunge usage (30% vs veteran's 20%)
  if (r < 0.2) return { action: MeleeActionId.BayonetThrust, bodyPart: target };
  if (r < 0.5) return { action: MeleeActionId.AggressiveLunge, bodyPart: target };
  if (r < 0.6) return { action: MeleeActionId.Feint, bodyPart: target };
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

export function chooseAllyAI(
  ally: MeleeAlly,
  enemies: MeleeOpponent[],
  liveEnemyIndices: number[],
  tuning?: MeleeTuning,
): AllyAIDecision {
  if (liveEnemyIndices.length === 0) {
    return { action: MeleeActionId.Guard, bodyPart: BodyPart.Torso, targetIndex: 0 };
  }

  // Stunned allies guard
  if (ally.stunned) {
    return {
      action: MeleeActionId.Guard,
      bodyPart: BodyPart.Torso,
      targetIndex: liveEnemyIndices[0],
    };
  }

  // Low stamina: catch breath (classic: forced, v2: weighted probability)
  if (ally.stamina <= 15) {
    if (tuning && tuning.version === 'v2') {
      // V2: weighted probability instead of forced Respite
      const r = Math.random();
      if (r < 0.4) {
        return { action: MeleeActionId.Respite, bodyPart: BodyPart.Torso, targetIndex: liveEnemyIndices[0] };
      }
      if (r < 0.7) {
        return { action: MeleeActionId.Guard, bodyPart: BodyPart.Torso, targetIndex: liveEnemyIndices[0] };
      }
      // 30%: fall through to normal AI
    } else {
      return {
        action: MeleeActionId.Respite,
        bodyPart: BodyPart.Torso,
        targetIndex: liveEnemyIndices[0],
      };
    }
  }

  // High fatigue: attempt Second Wind
  const allyFatiguePct = ally.maxFatigue > 0 ? ally.fatigue / ally.maxFatigue : 0;
  if (allyFatiguePct >= 0.5 && Math.random() < 0.3) {
    return {
      action: MeleeActionId.SecondWind,
      bodyPart: BodyPart.Torso,
      targetIndex: liveEnemyIndices[0],
    };
  }

  const hPct = ally.maxHealth > 0 ? ally.health / ally.maxHealth : 0;
  const r = Math.random();

  // Random body part weighted toward torso
  const tRoll = Math.random();
  const bp =
    tRoll < 0.55
      ? BodyPart.Torso
      : tRoll < 0.75
        ? BodyPart.Arms
        : tRoll < 0.9
          ? BodyPart.Legs
          : BodyPart.Head;

  switch (ally.personality) {
    case 'aggressive': {
      // Pierre-type: prefers attacks, Lunge when healthy, focuses weakest enemy
      const weakestIdx = findWeakestEnemy(enemies, liveEnemyIndices);
      if (hPct > 0.5 && r < 0.4)
        return { action: MeleeActionId.AggressiveLunge, bodyPart: bp, targetIndex: weakestIdx };
      if (r < 0.75)
        return { action: MeleeActionId.BayonetThrust, bodyPart: bp, targetIndex: weakestIdx };
      if (r < 0.85)
        return { action: MeleeActionId.ButtStrike, bodyPart: bp, targetIndex: weakestIdx };
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
      if (r < 0.35)
        return { action: MeleeActionId.BayonetThrust, bodyPart: bp, targetIndex: weakestIdx };
      if (r < 0.55)
        return { action: MeleeActionId.AggressiveLunge, bodyPart: bp, targetIndex: weakestIdx };
      if (r < 0.75)
        return { action: MeleeActionId.Guard, bodyPart: BodyPart.Torso, targetIndex: weakestIdx };
      return { action: MeleeActionId.ButtStrike, bodyPart: bp, targetIndex: weakestIdx };
    }
    case 'cautious': {
      // JB-type: more guards, targets whoever seems safest
      const weakestIdx = findWeakestEnemy(enemies, liveEnemyIndices);
      if (hPct < 0.4 || r < 0.35) {
        return { action: MeleeActionId.Guard, bodyPart: BodyPart.Torso, targetIndex: weakestIdx };
      }
      if (r < 0.6)
        return { action: MeleeActionId.BayonetThrust, bodyPart: bp, targetIndex: weakestIdx };
      if (r < 0.75)
        return { action: MeleeActionId.Guard, bodyPart: BodyPart.Torso, targetIndex: weakestIdx };
      return { action: MeleeActionId.ButtStrike, bodyPart: bp, targetIndex: weakestIdx };
    }
    default: {
      // Fallback: balanced behavior
      const weakestIdx = findWeakestEnemy(enemies, liveEnemyIndices);
      return { action: MeleeActionId.BayonetThrust, bodyPart: bp, targetIndex: weakestIdx };
    }
  }
}

function findWeakestEnemy(enemies: MeleeOpponent[], liveIndices: number[]): number {
  let weakest = liveIndices[0];
  let lowestHpPct = 1;
  for (const idx of liveIndices) {
    const e = enemies[idx];
    const pct = e.maxHealth > 0 ? e.health / e.maxHealth : 0;
    if (pct < lowestHpPct) {
      lowestHpPct = pct;
      weakest = idx;
    }
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

export function chooseEnemyTarget(
  opp: MeleeOpponent,
  player: BattleState['player'],
  allies: MeleeAlly[],
): EnemyTargetRef {
  const playerRef: EnemyTargetRef = { type: 'player', id: 'player', name: player.name };
  const liveAllies = allies.filter((a) => a.alive && a.health > 0);
  if (liveAllies.length === 0) return playerRef;

  const allTargets: (EnemyTargetRef & { hpPct: number })[] = [
    { ...playerRef, hpPct: player.maxHealth > 0 ? player.health / player.maxHealth : 0 },
    ...liveAllies.map((a) => ({
      type: 'ally' as const,
      id: a.id,
      name: a.name,
      hpPct: a.maxHealth > 0 ? a.health / a.maxHealth : 0,
    })),
  ];

  switch (opp.type) {
    case 'conscript': {
      // Biased toward weakest target (easy kill instinct)
      allTargets.sort((a, b) => a.hpPct - b.hpPct);
      return Math.random() < 0.65
        ? allTargets[0]
        : allTargets[Math.floor(Math.random() * allTargets.length)];
    }
    case 'line': {
      // Random target, slight bias toward player
      return Math.random() < 0.45
        ? playerRef
        : allTargets[Math.floor(Math.random() * allTargets.length)];
    }
    case 'veteran': {
      // Targets most dangerous (highest HP = most threatening)
      allTargets.sort((a, b) => b.hpPct - a.hpPct);
      return Math.random() < 0.6
        ? allTargets[0]
        : allTargets[Math.floor(Math.random() * allTargets.length)];
    }
    case 'sergeant': {
      // Prioritizes the player (break the leader)
      return Math.random() < 0.7
        ? playerRef
        : allTargets[Math.floor(Math.random() * allTargets.length)];
    }
    default:
      return playerRef;
  }
}
