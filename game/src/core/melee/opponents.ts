import {
  BattleState,
  MeleeOpponent,
  MeleeAlly,
  MeleeStance,
  MeleeActionId,
  BodyPart,
} from '../../types';

// ============================================================
// AI
// ============================================================

interface AIDecision {
  action: MeleeActionId;
  bodyPart: BodyPart;
}

let playerHistory: MeleeActionId[] = [];
export function resetMeleeHistory() {
  playerHistory = [];
}

export function chooseMeleeAI(opp: MeleeOpponent, state: BattleState): AIDecision {
  if (opp.stunned) return { action: MeleeActionId.Guard, bodyPart: BodyPart.Torso };
  if (opp.stamina <= 15) return { action: MeleeActionId.Respite, bodyPart: BodyPart.Torso };

  // Fatigue-driven Second Wind: conscripts desperate earlier, veterans push harder
  const fatiguePct = opp.maxFatigue > 0 ? opp.fatigue / opp.maxFatigue : 0;
  const swThreshold = opp.type === 'conscript' ? 0.4 : 0.5;
  if (fatiguePct >= swThreshold && Math.random() < 0.35) {
    return { action: MeleeActionId.SecondWind, bodyPart: BodyPart.Torso };
  }

  switch (opp.type) {
    case 'conscript':
      return conscriptAI(opp);
    case 'line':
      return lineAI(opp, state);
    case 'veteran':
      return veteranAI(opp, state);
    case 'sergeant':
      return sergeantAI(opp, state);
  }
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

function lineAI(opp: MeleeOpponent, state: BattleState): AIDecision {
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
  if (r < 0.7) return { action: MeleeActionId.ButtStrike, bodyPart: target };
  return { action: MeleeActionId.Guard, bodyPart: BodyPart.Torso };
}

function veteranAI(opp: MeleeOpponent, state: BattleState): AIDecision {
  const r = Math.random();
  const recent = playerHistory.slice(-3);
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

function sergeantAI(opp: MeleeOpponent, state: BattleState): AIDecision {
  const r = Math.random();
  const recent = playerHistory.slice(-4); // 4-move window (wider than veteran)
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

  // Low stamina: catch breath
  if (ally.stamina <= 15) {
    return {
      action: MeleeActionId.Respite,
      bodyPart: BodyPart.Torso,
      targetIndex: liveEnemyIndices[0],
    };
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
