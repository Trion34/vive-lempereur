import {
  MoraleThreshold,
  getMoraleThreshold,
  Player,
  LineState,
  EnemyState,
  MoraleChange,
  HealthState,
  FatigueState,
  LoadResult,
  LoadAnimationStep,
} from '../types';

export function calculatePassiveDrain(
  enemy: EnemyState,
  line: LineState,
  player: Player,
): MoraleChange[] {
  const changes: MoraleChange[] = [];
  const expMod = 1 - (player.experience / 200);

  // Range-based drain
  if (enemy.range <= 50) {
    changes.push({ amount: -6 * expMod, reason: 'Enemy at point-blank range', source: 'passive' });
  } else if (enemy.range <= 100) {
    changes.push({ amount: -4 * expMod, reason: 'Enemy at close range', source: 'passive' });
  } else if (enemy.range <= 200) {
    changes.push({ amount: -2 * expMod, reason: 'Under fire at medium range', source: 'passive' });
  } else {
    changes.push({ amount: -1 * expMod, reason: 'Distant fire', source: 'passive' });
  }

  // Artillery
  if (enemy.artillery) {
    changes.push({ amount: -8 * expMod, reason: 'Artillery bombardment — you can only endure', source: 'passive' });
  }

  // Casualties
  if (line.casualtiesThisTurn > 0) {
    const drain = -3 * line.casualtiesThisTurn;
    const label = line.casualtiesThisTurn === 1 ? '1 man fell nearby' : `${line.casualtiesThisTurn} men fell nearby`;
    changes.push({ amount: drain * expMod, reason: label, source: 'passive' });
  }

  // Empty musket panic
  if (!player.musketLoaded && player.turnsWithEmptyMusket > 1) {
    const penalty = Math.min(player.turnsWithEmptyMusket * 2, 6);
    changes.push({ amount: -penalty, reason: 'Standing unarmed in the firing line', source: 'passive' });
  }

  // Low health drains morale faster
  if (player.healthState === HealthState.BadlyWounded) {
    changes.push({ amount: -3, reason: 'Pain saps your will', source: 'passive' });
  } else if (player.healthState === HealthState.Critical) {
    changes.push({ amount: -6, reason: 'The wound is taking you', source: 'passive' });
  }

  // Low fatigue erodes resolve
  if (player.fatigueState === FatigueState.Exhausted) {
    changes.push({ amount: -2, reason: 'Exhaustion erodes your nerve', source: 'passive' });
  } else if (player.fatigueState === FatigueState.Spent) {
    changes.push({ amount: -4, reason: 'You can barely stand — the will follows', source: 'passive' });
  }

  // Endurance reduces drain slightly
  const enduranceMod = 1 - (player.endurance / 400); // endurance 50 = 0.875x drain
  for (const c of changes) {
    if (c.amount < 0) c.amount *= enduranceMod;
  }

  return changes;
}

export function calculateRecovery(
  line: LineState,
  player: Player,
): MoraleChange[] {
  const changes: MoraleChange[] = [];

  if (line.drumsPlaying) {
    changes.push({ amount: 2, reason: 'The drums hold steady', source: 'recovery' });
  }

  if (line.ncoPresent && line.officer.alive) {
    changes.push({ amount: 1, reason: 'Officers steady the line', source: 'recovery' });
  }

  // Neighbour contagion
  for (const n of [line.leftNeighbour, line.rightNeighbour]) {
    if (!n?.alive || n.routing) continue;
    const t = getMoraleThreshold(n.morale, n.maxMorale);
    if (t === MoraleThreshold.Steady) {
      changes.push({ amount: 2, reason: `${n.name} stands firm`, source: 'contagion' });
    } else if (t === MoraleThreshold.Wavering || t === MoraleThreshold.Breaking) {
      changes.push({ amount: -3, reason: `${n.name} is trembling`, source: 'contagion' });
    }
  }

  if (line.lineIntegrity < 50) {
    changes.push({ amount: -3, reason: 'The line is thinning dangerously', source: 'contagion' });
  } else if (line.lineIntegrity < 70) {
    changes.push({ amount: -1, reason: 'Gaps appear in the line', source: 'contagion' });
  }

  return changes;
}

export function applyMoraleChanges(
  current: number,
  max: number,
  changes: MoraleChange[],
  valorStat: number = 50,
): { newMorale: number; threshold: MoraleThreshold } {
  let negativeTotal = 0;
  let positiveTotal = 0;

  for (const c of changes) {
    if (c.amount < 0) negativeTotal += c.amount;
    else positiveTotal += c.amount;
  }

  // Recovery ratchet: harder to recover as morale drops, valor stat helps
  const ratio = current / max;
  const valorFactor = valorStat / 100;
  const efficiency = (0.25 + ratio * 0.75) * (0.6 + valorFactor * 0.4);
  positiveTotal *= efficiency;

  const total = Math.max(0, Math.min(max, current + negativeTotal + positiveTotal));

  return {
    newMorale: Math.round(total * 10) / 10,
    threshold: getMoraleThreshold(total, max),
  };
}

// Roll against the player's Valor stat. Returns success if d100 <= valor + modifier.
export function rollValor(valorStat: number, modifier: number = 0): { success: boolean; roll: number; target: number } {
  const target = Math.min(95, Math.max(5, valorStat + modifier));
  const roll = Math.floor(Math.random() * 100) + 1;
  return { success: roll <= target, roll, target };
}

// Auto-roll for the LOAD drill step. Factor in dexterity for load success.
export function rollAutoLoad(morale: number, maxMorale: number, valorStat: number, dexterity: number = 45): LoadResult {
  const moralePct = morale / maxMorale;
  const dexMod = dexterity / 100; // dexterity 45 = 0.45
  const successChance = moralePct * (0.4 + dexMod * 0.4 + (valorStat / 100) * 0.2);
  const targetValue = Math.round(successChance * 100);
  const rollValue = Math.floor(Math.random() * 100) + 1;
  const success = rollValue <= targetValue;

  const steps: LoadAnimationStep[] = [
    { svgId: 'load-bite', label: 'Bite cartridge', success: true, duration: 800 },
    { svgId: 'load-pour', label: 'Pour powder', success: true, duration: 700 },
    { svgId: 'load-ram', label: 'Ram ball', success, duration: 900 },
    { svgId: 'load-prime', label: 'Prime pan', success, duration: 600 },
  ];

  if (!success) {
    steps[2].success = false;
    steps[3].success = false;
  }

  return { success, rollValue, targetValue, narrativeSteps: steps };
}
