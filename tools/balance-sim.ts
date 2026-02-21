/**
 * Balance Simulation — runs N full combat scenarios and reports stats.
 *
 * Usage: npx tsx tools/balance-sim.ts [runs=500]
 *
 * Simulates:
 *   1. Volley phase (Parts 1+2: 7 volleys of return fire + stamina drain)
 *   2. Terrain melee (4 opponents, sequential)
 *   3. Battery skirmish (6 opponents, 2 active at a time, Pierre joins R3, JB joins R5,
 *      max enemies increases to 3 at R7, backfill from pool)
 *
 * Reports survival rates, average HP/stamina at each phase transition,
 * and per-opponent kill/break/timeout stats.
 */

import {
  getHealthPoolSize, getStaminaPoolSize,
  MeleeStance, MeleeActionId, BodyPart, MoraleThreshold,
  FatigueTier, getFatigueTier,
} from '../src/types';
import { getFatigueDebuff } from '../src/core/stats';

// ── Pull constants from melee.ts (duplicated here to avoid module side-effects) ──

const STANCE_MODS: Record<string, { attack: number; defense: number; staminaCost: number }> = {
  aggressive: { attack: 0.20, defense: -0.15, staminaCost: 14 },
  balanced:   { attack: 0,    defense: 0,     staminaCost: 10 },
  defensive:  { attack: -0.15, defense: 0.20, staminaCost: 8 },
};

const ACTION_DEFS: Record<string, { stamina: number; hitBonus: number; damageMod: number; isAttack: boolean; stunBonus: number }> = {
  bayonet_thrust:   { stamina: 20,  hitBonus: 0,    damageMod: 1.0, isAttack: true,  stunBonus: 0    },
  aggressive_lunge: { stamina: 38,  hitBonus: -0.10, damageMod: 1.5, isAttack: true,  stunBonus: 0    },
  butt_strike:      { stamina: 26,  hitBonus: 0.15, damageMod: 0,   isAttack: true,  stunBonus: 0.25 },
  feint:            { stamina: 14,  hitBonus: 0.10, damageMod: 0,   isAttack: true,  stunBonus: 0    },
  guard:            { stamina: 12,  hitBonus: 0,    damageMod: 0,   isAttack: false, stunBonus: 0    },
  respite:          { stamina: -35, hitBonus: 0,    damageMod: 0,   isAttack: false, stunBonus: 0    },
  shoot:            { stamina: 8,   hitBonus: 0,    damageMod: 2.0, isAttack: true,  stunBonus: 0    },
  reload:           { stamina: 14,  hitBonus: 0,    damageMod: 0,   isAttack: false, stunBonus: 0    },
  second_wind:      { stamina: 0,   hitBonus: 0,    damageMod: 0,   isAttack: false, stunBonus: 0    },
  use_canteen:      { stamina: 0,   hitBonus: 0,    damageMod: 0,   isAttack: false, stunBonus: 0    },
};

const BODY_PARTS: Record<string, { hitMod: number; damageRange: [number, number] }> = {
  head:  { hitMod: -0.25, damageRange: [25, 35] },
  torso: { hitMod: 0,     damageRange: [15, 25] },
  arms:  { hitMod: -0.10, damageRange: [10, 15] },
  legs:  { hitMod: -0.15, damageRange: [10, 20] },
};

const BASE_OPP_HIT: Record<string, number> = {
  conscript: 0.35, line: 0.45, veteran: 0.55, sergeant: 0.60,
};

interface Opponent {
  type: string;
  health: number;
  maxHealth: number;
  stamina: number;
  maxStamina: number;
  fatigue: number;
  maxFatigue: number;
  strength: number;
  breakPct: number;
  stunned: number;
  armInjured: boolean;
  legInjured: boolean;
}

interface PlayerSim {
  health: number;
  maxHealth: number;
  stamina: number;
  maxStamina: number;
  fatigue: number;
  maxFatigue: number;
  morale: number;
  maxMorale: number;
  elan: number;
  strength: number;
  musketry: number;
  valor: number;
  alive: boolean;
  musketLoaded: boolean;
  reloadProgress: number;
  canteenUses: number;
  grace: number;
  graceUsed: number;
}

/** Try to use Grace when player would die. Returns true if saved. */
function tryUseGrace(p: PlayerSim): boolean {
  if (p.grace <= 0) return false;
  p.grace--;
  p.graceUsed++;
  p.health = Math.round(p.maxHealth * 0.5);
  p.morale = Math.round(p.maxMorale * 0.5);
  p.stamina = Math.round(p.maxStamina * 0.5);
  p.fatigue = 0;
  p.alive = true;
  return true;
}

// ── Volley Definitions ──

const VOLLEY_DEFS = [
  { chance: 0.15, dmg: [8, 14],  staCost: 12, staRecov: 4 }, // V1
  { chance: 0.25, dmg: [10, 18], staCost: 12, staRecov: 4 }, // V2
  { chance: 0.40, dmg: [14, 24], staCost: 12, staRecov: 4 }, // V3
  { chance: 0.50, dmg: [16, 28], staCost: 12, staRecov: 4 }, // V4
  { chance: 0.20, dmg: [8, 14],  staCost: 14, staRecov: 4 }, // V5
  { chance: 0.30, dmg: [10, 20], staCost: 14, staRecov: 4 }, // V6
  { chance: 0.45, dmg: [14, 26], staCost: 14, staRecov: 4 }, // V7
];

// ── Opponent rosters ──

interface OppTemplate {
  type: string;
  hp: [number, number];
  sta: [number, number];
  str: number;
  breakPct: number;
}

const TERRAIN_ROSTER: OppTemplate[] = [
  { type: 'conscript', hp: [70, 85],   sta: [160, 200], str: 40, breakPct: 0.35 },
  { type: 'conscript', hp: [65, 80],   sta: [150, 190], str: 40, breakPct: 0.35 },
  { type: 'line',      hp: [80, 95],   sta: [180, 240], str: 50, breakPct: 0.25 },
  { type: 'veteran',   hp: [95, 115],  sta: [200, 260], str: 65, breakPct: 0.15 },
];

const BATTERY_ROSTER: OppTemplate[] = [
  { type: 'line',      hp: [80, 95],   sta: [180, 240], str: 50, breakPct: 0.25 },
  { type: 'veteran',   hp: [90, 110],  sta: [200, 260], str: 60, breakPct: 0.15 },
  { type: 'line',      hp: [75, 90],   sta: [170, 220], str: 48, breakPct: 0.25 },
  { type: 'sergeant',  hp: [100, 125], sta: [220, 280], str: 75, breakPct: 0 },
];

// ── Helpers ──

function rand(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

function getMoraleThreshold(morale: number, max: number): MoraleThreshold {
  const pct = morale / max;
  if (pct >= 0.75) return MoraleThreshold.Steady;
  if (pct >= 0.40) return MoraleThreshold.Shaken;
  if (pct >= 0.15) return MoraleThreshold.Wavering;
  return MoraleThreshold.Breaking;
}

function makeOpp(t: OppTemplate): Opponent {
  const hp = rand(t.hp[0], t.hp[1]);
  const sta = rand(t.sta[0], t.sta[1]);
  return {
    type: t.type, health: hp, maxHealth: hp, stamina: sta, maxStamina: sta,
    fatigue: 0, maxFatigue: sta,
    strength: t.str, breakPct: t.breakPct, stunned: 0,
    armInjured: false, legInjured: false,
  };
}

// ── Simulate Volleys ──

// Simplified graduated valor roll matching src/core/morale.ts rollGraduatedValor
function simGraduatedValor(valorStat: number, difficultyMod: number): { outcome: string; moraleChange: number } {
  const target = clamp(valorStat + difficultyMod, 5, 95);
  const roll = Math.floor(Math.random() * 100) + 1;
  const margin = target - roll;

  if (margin >= 20) return { outcome: 'great_success', moraleChange: 5 };
  if (margin >= 0)  return { outcome: 'pass', moraleChange: 1 };
  if (margin >= -20) return { outcome: 'fail', moraleChange: -5 };
  return { outcome: 'critical_fail', moraleChange: -10 };
}

// Simplified morale application matching src/core/morale.ts applyMoraleChanges
function simApplyMorale(current: number, max: number, changes: number[], valorStat: number): number {
  let neg = 0, pos = 0;
  for (const c of changes) { if (c < 0) neg += c; else pos += c; }
  // Recovery ratchet: harder to recover as morale drops, valor helps
  const ratio = current / max;
  const valorFactor = valorStat / 100;
  const efficiency = (0.25 + ratio * 0.75) * (0.6 + valorFactor * 0.4);
  pos *= efficiency;
  return clamp(Math.round((current + neg + pos) * 10) / 10, 0, max);
}

function simVolleys(p: PlayerSim): void {
  // Approximate line integrity (degrades over volleys)
  let lineIntegrity = 100;

  for (let i = 0; i < VOLLEY_DEFS.length; i++) {
    if (!p.alive) return;
    const v = VOLLEY_DEFS[i];
    const moraleChanges: number[] = [];

    // --- PASSIVE MORALE DRAIN (range-based, valor-scaled) ---
    const expMod = 1 - (p.valor / 200);
    const range = [120, 80, 50, 25, 100, 60, 40][i]; // approx volley ranges
    if (range <= 50)       moraleChanges.push(-6 * expMod);
    else if (range <= 100) moraleChanges.push(-4 * expMod);
    else                   moraleChanges.push(-2 * expMod);

    // Recovery: drums + officers (simplified — always present)
    moraleChanges.push(2); // drums
    moraleChanges.push(1); // officers

    // Line integrity degradation
    if (lineIntegrity < 50)      moraleChanges.push(-3);
    else if (lineIntegrity < 70) moraleChanges.push(-1);

    // --- GRADUATED VALOR ROLL ---
    const difficultyMod = (lineIntegrity - 100) * 0.3;
    const valorRoll = simGraduatedValor(p.valor, difficultyMod);
    moraleChanges.push(valorRoll.moraleChange);

    // Critical fail: 20% chance of minor wound
    if (valorRoll.outcome === 'critical_fail' && Math.random() < 0.2) {
      const woundDmg = 5 + Math.floor(Math.random() * 5);
      p.health = Math.max(0, p.health - woundDmg);
      if (p.health <= 0) { p.alive = false; if (!tryUseGrace(p)) return; }
    }

    // --- RETURN FIRE ---
    if (Math.random() < v.chance) {
      const dmg = rand(v.dmg[0], v.dmg[1]);
      // Fatal hit check (volleys 3-4 only)
      if (i >= 2 && i <= 3 && Math.random() < 0.12) {
        p.health = 0;
        p.alive = false;
        if (!tryUseGrace(p)) return;
        continue;
      }
      p.health = Math.max(0, p.health - dmg);
      moraleChanges.push(-Math.round(dmg / 2)); // hit drains morale
      if (p.health <= 0) { p.alive = false; if (!tryUseGrace(p)) return; }
    }

    // --- LINE INTEGRITY ROLL (simplified: degrades 3-8 per volley) ---
    lineIntegrity = Math.max(20, lineIntegrity - rand(3, 8));

    // --- APPLY MORALE ---
    p.morale = simApplyMorale(p.morale, p.maxMorale, moraleChanges, p.valor);

    // --- STAMINA ---
    p.stamina = Math.max(0, p.stamina - v.staCost);
    p.stamina = Math.min(p.maxStamina, p.stamina + v.staRecov);
  }
}

// ── Simulate calcHitChance (player) ──

function playerHitChance(p: PlayerSim, stance: string, action: string, bodyPart: string, riposte: boolean, targetFatigue: number = 0, targetMaxFatigue: number = 1): number {
  const moralePenalty = (1 - p.morale / p.maxMorale) * 0.15;
  const staminaDebuffPct = getFatigueDebuff(p.fatigue, p.maxFatigue) / 100;
  const targetFatigueBonus = -getFatigueDebuff(targetFatigue, targetMaxFatigue) / 100;
  const skillStat = action === 'shoot' ? p.musketry : p.elan;
  const raw = 0.35
    + STANCE_MODS[stance].attack
    + ACTION_DEFS[action].hitBonus
    + BODY_PARTS[bodyPart].hitMod
    + (riposte ? 0.15 : 0)
    + skillStat / 120
    - moralePenalty
    + staminaDebuffPct
    + targetFatigueBonus;
  return clamp(raw, 0.05, 0.95);
}

// ── Simulate calcDamage ──

function calcDmg(action: string, bodyPart: string, _fatigue: number, _maxFatigue: number, strength: number): number {
  const [lo, hi] = BODY_PARTS[bodyPart].damageRange;
  const strMod = 0.75 + strength / 200;
  const dmg = Math.round(rand(lo, hi) * ACTION_DEFS[action].damageMod * strMod);
  return Math.max(1, dmg);
}

// ── Player AI (simple mixed strategy) ──

function choosePlayerAction(p: PlayerSim, opp: Opponent, exchangeNum: number): { action: string; bodyPart: string; stance: string } {
  const morale = getMoraleThreshold(p.morale, p.maxMorale);
  const staPct = p.stamina / p.maxStamina;

  // Drink canteen when hurt (3 uses max, +20 HP each, gives enemy free attack)
  const hpPct = p.health / p.maxHealth;
  if (p.canteenUses < 3 && hpPct < 0.5) {
    return { action: 'use_canteen', bodyPart: 'torso', stance: 'defensive' };
  }

  // Need to catch breath
  if (staPct < 0.15) return { action: 'respite', bodyPart: 'torso', stance: 'defensive' };

  // Shoot if musket loaded (high priority — 2x damage, one-time opening shot)
  if (p.musketLoaded) {
    return { action: 'shoot', bodyPart: 'torso', stance: 'balanced' };
  }

  // Reload when safe (opponent stunned or low HP)
  if (!p.musketLoaded && p.reloadProgress > 0 && (opp.stunned > 0 || opp.health / opp.maxHealth < 0.3)) {
    return { action: 'reload', bodyPart: 'torso', stance: 'defensive' };
  }

  // Breaking morale — can only guard/respite/reload
  if (morale === MoraleThreshold.Breaking) {
    if (!p.musketLoaded && p.reloadProgress > 0) return { action: 'reload', bodyPart: 'torso', stance: 'defensive' };
    return { action: 'guard', bodyPart: 'torso', stance: 'defensive' };
  }

  // Wavering — only thrust/guard/respite
  if (morale === MoraleThreshold.Wavering) {
    const r = Math.random();
    if (r < 0.45 && p.stamina >= 20) return { action: 'bayonet_thrust', bodyPart: 'torso', stance: 'balanced' };
    return { action: 'guard', bodyPart: 'torso', stance: 'defensive' };
  }

  // Balanced mixed strategy
  const r = Math.random();
  if (opp.stunned > 0 && p.stamina >= 38) {
    return { action: 'aggressive_lunge', bodyPart: 'torso', stance: 'aggressive' };
  }

  // Against tough opponents (veteran/sergeant), be more cautious
  const isTough = opp.type === 'veteran' || opp.type === 'sergeant';
  if (isTough) {
    if (r < 0.25 && p.stamina >= 20) return { action: 'bayonet_thrust', bodyPart: 'torso', stance: 'balanced' };
    if (r < 0.40 && p.stamina >= 14) return { action: 'feint', bodyPart: 'torso', stance: 'balanced' };
    if (r < 0.70) return { action: 'guard', bodyPart: 'torso', stance: 'defensive' };
    if (p.stamina >= 20) return { action: 'bayonet_thrust', bodyPart: 'torso', stance: 'balanced' };
    return { action: 'guard', bodyPart: 'torso', stance: 'defensive' };
  }

  // Normal mixed play
  if (r < 0.35 && p.stamina >= 20) return { action: 'bayonet_thrust', bodyPart: 'torso', stance: 'balanced' };
  if (r < 0.50 && p.stamina >= 38) return { action: 'aggressive_lunge', bodyPart: 'torso', stance: 'aggressive' };
  if (r < 0.70) return { action: 'guard', bodyPart: 'torso', stance: 'balanced' };
  if (p.stamina >= 20) return { action: 'bayonet_thrust', bodyPart: 'torso', stance: 'balanced' };
  return { action: 'guard', bodyPart: 'torso', stance: 'defensive' };
}

// ── Opponent AI (simplified) ──

function chooseOppAction(opp: Opponent): { action: string; bodyPart: string } {
  if (opp.stunned > 0) return { action: 'guard', bodyPart: 'torso' };
  if (opp.stamina <= 15) return { action: 'respite', bodyPart: 'torso' };

  const r = Math.random();
  const tRoll = Math.random();
  const target = tRoll < 0.60 ? 'torso' : tRoll < 0.80 ? 'arms' : tRoll < 0.95 ? 'legs' : 'head';

  if (opp.type === 'conscript') {
    if (opp.health / opp.maxHealth < 0.3) {
      return r < 0.6 ? { action: 'respite', bodyPart: 'torso' } : { action: 'aggressive_lunge', bodyPart: 'torso' };
    }
    if (r < 0.45) return { action: 'bayonet_thrust', bodyPart: 'torso' };
    return { action: 'guard', bodyPart: 'torso' };
  }

  if (opp.type === 'line') {
    if (opp.stamina / opp.maxStamina < 0.3) {
      return r < 0.5 ? { action: 'bayonet_thrust', bodyPart: target } : { action: 'respite', bodyPart: 'torso' };
    }
    if (r < 0.35) return { action: 'bayonet_thrust', bodyPart: target };
    if (r < 0.55) return { action: 'aggressive_lunge', bodyPart: target };
    if (r < 0.70) return { action: 'butt_strike', bodyPart: target };
    return { action: 'guard', bodyPart: 'torso' };
  }

  // veteran/sergeant
  if (r < 0.25) return { action: 'bayonet_thrust', bodyPart: target };
  if (r < 0.50) return { action: 'aggressive_lunge', bodyPart: target };
  if (r < 0.60) return { action: 'feint', bodyPart: target };
  if (r < 0.72) return { action: 'butt_strike', bodyPart: target };
  return { action: 'guard', bodyPart: 'torso' };
}

// ── Simulate one melee exchange ──

function simExchange(p: PlayerSim, opp: Opponent): { oppDefeated: boolean } {
  const pChoice = choosePlayerAction(p, opp, 0);
  const oppChoice = chooseOppAction(opp);

  const sDef = STANCE_MODS[pChoice.stance];
  const pDef = ACTION_DEFS[pChoice.action];
  const oDef = ACTION_DEFS[oppChoice.action];

  // Player stamina cost
  p.stamina = Math.max(0, p.stamina + pDef.stamina - sDef.staminaCost);
  // (Note: pDef.stamina is negative for respite, so this works correctly)
  // Actually, the cost is -(pDef.stamina + sDef.staminaCost) but we need to handle respite
  // In the real code: staminaDelta -= (pDef.stamina + sDef.staminaCost)
  // Let me fix this:
  let staDelta = -(pDef.stamina + sDef.staminaCost);
  p.stamina = clamp(p.stamina + staDelta, 0, p.maxStamina);
  // Fatigue accumulates at 50% of stamina spent
  if (staDelta < 0) p.fatigue = Math.min(p.maxFatigue, p.fatigue + Math.round(-staDelta * 0.5));

  // Tick opponent stun
  if (opp.stunned > 0) opp.stunned--;

  // Player action resolution
  if (pChoice.action === 'respite' || pChoice.action === 'use_canteen') {
    // Canteen: +20 HP
    if (pChoice.action === 'use_canteen') {
      p.health = Math.min(p.maxHealth, p.health + 20);
      p.canteenUses++;
    }
    // Free attack from opponent at 70% damage
    if (oDef.isAttack) {
      const baseHit = BASE_OPP_HIT[opp.type] ?? 0.45;
      const armPen = opp.armInjured ? 0.10 : 0;
      const targetVuln = -getFatigueDebuff(p.fatigue, p.maxFatigue) / 100;
      const oppHitRaw = baseHit + oDef.hitBonus + BODY_PARTS[oppChoice.bodyPart].hitMod - armPen + targetVuln;
      if (Math.random() < clamp(oppHitRaw, 0.15, 0.85)) {
        let dmg = calcDmg(oppChoice.action, oppChoice.bodyPart, opp.fatigue, opp.maxFatigue, opp.strength);
        dmg = Math.round(dmg * 0.7);
        p.health -= dmg;
        p.morale = Math.max(0, p.morale - dmg / 3);
      }
    }
    return { oppDefeated: false };
  }

  if (pChoice.action === 'guard') {
    const staminaDebuffPct = getFatigueDebuff(p.fatigue, p.maxFatigue) / 100;
    const blockChance = clamp(0.10 + sDef.defense + p.elan / 85 + staminaDebuffPct, 0.05, 0.95);

    // Opponent attacks
    if (oDef.isAttack) {
      const baseHit = BASE_OPP_HIT[opp.type] ?? 0.45;
      const armPen = opp.armInjured ? 0.10 : 0;
      const targetVuln = -getFatigueDebuff(p.fatigue, p.maxFatigue) / 100;
      const oppHitRaw = baseHit + oDef.hitBonus + BODY_PARTS[oppChoice.bodyPart].hitMod - armPen + targetVuln;
      if (Math.random() < clamp(oppHitRaw, 0.15, 0.85)) {
        if (Math.random() < blockChance) {
          // Blocked!
        } else {
          let dmg = calcDmg(oppChoice.action, oppChoice.bodyPart, opp.fatigue, opp.maxFatigue, opp.strength);
          dmg = Math.round(dmg * 0.85); // Failed block still reduces 15%
          p.health -= dmg;
          p.morale = Math.max(0, p.morale - dmg / 3);
        }
      }
    }
    return { oppDefeated: false };
  }

  if (pChoice.action === 'shoot') {
    p.musketLoaded = false;
    p.reloadProgress = 0;
    const shootHit = playerHitChance(p, pChoice.stance, 'shoot', pChoice.bodyPart, false, opp.fatigue, opp.maxFatigue);
    if (Math.random() < Math.max(0.10, shootHit)) {
      const dmg = calcDmg('shoot', pChoice.bodyPart, p.fatigue, p.maxFatigue, p.strength);
      opp.health -= dmg;
      p.morale = Math.min(p.maxMorale, p.morale + dmg / 3);
      // Head shot: 25% instant kill
      if (pChoice.bodyPart === 'head' && Math.random() < 0.25) opp.health = 0;
    }
    // Opponent counter-attacks
    if (opp.health > 0 && oDef.isAttack) {
      const baseHit = BASE_OPP_HIT[opp.type] ?? 0.45;
      const armPen = opp.armInjured ? 0.10 : 0;
      const targetVuln = -getFatigueDebuff(p.fatigue, p.maxFatigue) / 100;
      const oppHitRaw = baseHit + oDef.hitBonus + BODY_PARTS[oppChoice.bodyPart].hitMod - armPen + targetVuln;
      if (Math.random() < clamp(oppHitRaw, 0.15, 0.85)) {
        const dmg = calcDmg(oppChoice.action, oppChoice.bodyPart, opp.fatigue, opp.maxFatigue, opp.strength);
        p.health -= dmg;
        p.morale = Math.max(0, p.morale - dmg / 3);
      }
    }
    if (oDef.isAttack) {
      const legMult = opp.legInjured ? 1.5 : 1.0;
      const oppCost = Math.round(oDef.stamina * legMult);
      opp.stamina = Math.max(0, opp.stamina - oppCost);
      opp.fatigue = Math.min(opp.maxFatigue, opp.fatigue + Math.round(oppCost * 0.5));
    }
    if (opp.health <= 0 || (opp.breakPct > 0 && opp.health / opp.maxHealth <= opp.breakPct)) {
      return { oppDefeated: true };
    }
    return { oppDefeated: false };
  }

  if (pChoice.action === 'reload') {
    p.reloadProgress += 1;
    if (p.reloadProgress >= 2) {
      p.musketLoaded = true;
      p.reloadProgress = 0;
    }
    // Free attack from opponent (like respite)
    if (oDef.isAttack) {
      const baseHit = BASE_OPP_HIT[opp.type] ?? 0.45;
      const armPen = opp.armInjured ? 0.10 : 0;
      const targetVuln = -getFatigueDebuff(p.fatigue, p.maxFatigue) / 100;
      const oppHitRaw = baseHit + oDef.hitBonus + BODY_PARTS[oppChoice.bodyPart].hitMod - armPen + targetVuln;
      if (Math.random() < clamp(oppHitRaw, 0.15, 0.85)) {
        let dmg = calcDmg(oppChoice.action, oppChoice.bodyPart, opp.fatigue, opp.maxFatigue, opp.strength);
        dmg = Math.round(dmg * 0.7);
        p.health -= dmg;
        p.morale = Math.max(0, p.morale - dmg / 3);
      }
    }
    return { oppDefeated: false };
  }

  // Player attacks
  if (pDef.isAttack) {
    const hitChance = playerHitChance(p, pChoice.stance, pChoice.action, pChoice.bodyPart, false, opp.fatigue, opp.maxFatigue);
    if (Math.random() < hitChance) {
      if (pChoice.action === 'feint') {
        // Feint: drain stamina/fatigue, no HP damage
        opp.stamina = Math.max(0, opp.stamina - rand(25, 35));
        opp.fatigue = Math.min(opp.maxFatigue, opp.fatigue + rand(20, 30));
      } else if (pChoice.action === 'butt_strike') {
        // Butt Strike: stamina drain + stun chance, no HP damage
        opp.stamina = Math.max(0, opp.stamina - Math.round(rand(10, 15) * (0.75 + p.strength / 200)));
        const stunChance = ACTION_DEFS['butt_strike'].stunBonus + p.strength / 400;
        if (Math.random() < stunChance) opp.stunned = 1;
      } else {
        const dmg = calcDmg(pChoice.action, pChoice.bodyPart, p.fatigue, p.maxFatigue, p.strength);
        opp.health -= dmg;
        p.morale = Math.min(p.maxMorale, p.morale + dmg / 4);
      }
    }
  }

  // Check opponent defeated
  if (opp.health <= 0 || (opp.breakPct > 0 && opp.health / opp.maxHealth <= opp.breakPct)) {
    return { oppDefeated: true };
  }

  // Opponent counter-attacks
  if (opp.health > 0 && oDef.isAttack) {
    const baseHit = BASE_OPP_HIT[opp.type] ?? 0.45;
    const armPen = opp.armInjured ? 0.10 : 0;
    const targetVuln = -getFatigueDebuff(p.fatigue, p.maxFatigue) / 100;
    const oppHitRaw = baseHit + oDef.hitBonus + BODY_PARTS[oppChoice.bodyPart].hitMod - armPen + targetVuln;
    if (Math.random() < clamp(oppHitRaw, 0.15, 0.85)) {
      const dmg = calcDmg(oppChoice.action, oppChoice.bodyPart, opp.fatigue, opp.maxFatigue, opp.strength);
      p.health -= dmg;
      p.morale = Math.max(0, p.morale - dmg / 3);
    }
  }

  // Opponent stamina cost
  if (oDef.isAttack) {
    const legMult = opp.legInjured ? 1.5 : 1.0;
    const oppCost = Math.round(oDef.stamina * legMult);
    opp.stamina = Math.max(0, opp.stamina - oppCost);
    opp.fatigue = Math.min(opp.maxFatigue, opp.fatigue + Math.round(oppCost * 0.5));
  }

  return { oppDefeated: false };
}

// ── Simulate full melee (roster of opponents, sequential) ──

function simMelee(p: PlayerSim, roster: OppTemplate[], maxExchanges: number): { killed: number; survived: boolean; exchanges: number } {
  let killed = 0;
  let exchanges = 0;

  for (const template of roster) {
    if (!p.alive || p.health <= 0) break;
    const opp = makeOpp(template);

    for (let ex = 0; ex < maxExchanges - exchanges; ex++) {
      if (p.health <= 0) { p.alive = false; if (!tryUseGrace(p)) break; }

      const result = simExchange(p, opp);
      exchanges++;

      if (result.oppDefeated) {
        killed++;
        break;
      }

      if (exchanges >= maxExchanges) break;
    }

    if (p.health <= 0) { p.alive = false; tryUseGrace(p); }

    // Check survived condition (low HP, killed 2+, not last opponent)
    if (p.alive && p.health < 25 && killed >= 2 && roster.indexOf(template) < roster.length - 1) {
      return { killed, survived: true, exchanges };
    }
  }

  return { killed, survived: false, exchanges };
}

// ══════════════════════════════════════════════════════════════
// BATTERY SKIRMISH SIMULATION (with allies + wave events)
// ══════════════════════════════════════════════════════════════

interface AllySim {
  name: string;
  health: number;
  maxHealth: number;
  stamina: number;
  maxStamina: number;
  fatigue: number;
  maxFatigue: number;
  strength: number;
  elan: number;
  personality: 'aggressive' | 'cautious';
  alive: boolean;
  stunned: number;
  armInjured: boolean;
  legInjured: boolean;
}

interface AllyTemplate {
  name: string;
  hp: [number, number];
  sta: [number, number];
  strength: number;
  elan: number;
  personality: 'aggressive' | 'cautious';
}

const PIERRE: AllyTemplate = { name: 'Pierre', hp: [75, 90], sta: [180, 220], strength: 50, elan: 45, personality: 'aggressive' };
const JB: AllyTemplate = { name: 'Jean-Baptiste', hp: [60, 75], sta: [140, 180], strength: 38, elan: 30, personality: 'cautious' };

function makeAlly(t: AllyTemplate): AllySim {
  const hp = rand(t.hp[0], t.hp[1]);
  const sta = rand(t.sta[0], t.sta[1]);
  return {
    name: t.name, health: hp, maxHealth: hp, stamina: sta, maxStamina: sta,
    fatigue: 0, maxFatigue: sta,
    strength: t.strength, elan: t.elan, personality: t.personality,
    alive: true, stunned: 0, armInjured: false, legInjured: false,
  };
}

function isOppDefeated(opp: Opponent): boolean {
  if (opp.health <= 0) return true;
  return opp.breakPct > 0 && opp.health / opp.maxHealth <= opp.breakPct;
}

// Ally AI — personality-driven action selection (matches real game's chooseAllyAI)
function chooseAllyAction(ally: AllySim, liveOpps: Opponent[]): { action: string; bodyPart: string; targetIdx: number } {
  if (ally.stunned > 0) return { action: 'guard', bodyPart: 'torso', targetIdx: 0 };
  if (ally.stamina <= 15) return { action: 'respite', bodyPart: 'torso', targetIdx: 0 };

  // Target weakest enemy
  let weakestIdx = 0;
  let lowestPct = 1;
  for (let i = 0; i < liveOpps.length; i++) {
    const pct = liveOpps[i].health / liveOpps[i].maxHealth;
    if (pct < lowestPct) { lowestPct = pct; weakestIdx = i; }
  }

  const hPct = ally.health / ally.maxHealth;
  const r = Math.random();
  const tRoll = Math.random();
  const bp = tRoll < 0.55 ? 'torso' : tRoll < 0.75 ? 'arms' : tRoll < 0.90 ? 'legs' : 'head';

  if (ally.personality === 'aggressive') {
    // Pierre: prefers attacks, lunge when healthy
    if (hPct > 0.5 && r < 0.40) return { action: 'aggressive_lunge', bodyPart: bp, targetIdx: weakestIdx };
    if (r < 0.75) return { action: 'bayonet_thrust', bodyPart: bp, targetIdx: weakestIdx };
    if (r < 0.85) return { action: 'butt_strike', bodyPart: bp, targetIdx: weakestIdx };
    return { action: 'guard', bodyPart: 'torso', targetIdx: weakestIdx };
  }

  // cautious (JB): more guards, less aggression
  if (hPct < 0.4 || r < 0.35) return { action: 'guard', bodyPart: 'torso', targetIdx: weakestIdx };
  if (r < 0.60) return { action: 'bayonet_thrust', bodyPart: bp, targetIdx: weakestIdx };
  if (r < 0.75) return { action: 'guard', bodyPart: 'torso', targetIdx: weakestIdx };
  return { action: 'butt_strike', bodyPart: bp, targetIdx: weakestIdx };
}

// Ally hit chance — elan-based (matches real game's resolveGenericAttack for allies)
function allyHitChance(ally: AllySim, action: string, bodyPart: string, targetFatigue: number = 0, targetMaxFatigue: number = 1): number {
  const baseHit = 0.40 + ally.elan / 200;
  const armPen = ally.armInjured ? 0.10 : 0;
  const targetFatigueBonus = -getFatigueDebuff(targetFatigue, targetMaxFatigue) / 100;
  return clamp(baseHit + ACTION_DEFS[action].hitBonus + BODY_PARTS[bodyPart].hitMod - armPen + targetFatigueBonus, 0.10, 0.80);
}

// Enemy target selection — type-based priority (matches real game's chooseEnemyTarget)
function chooseEnemyTarget(opp: Opponent, p: PlayerSim, allies: AllySim[]): 'player' | number {
  const liveAllies = allies.filter(a => a.alive && a.health > 0);
  if (liveAllies.length === 0) return 'player';

  // Build target list with HP percentages
  const targets: { ref: 'player' | number; hpPct: number }[] = [
    { ref: 'player', hpPct: p.health / p.maxHealth },
    ...liveAllies.map((a, i) => ({ ref: i as number, hpPct: a.health / a.maxHealth })),
  ];

  switch (opp.type) {
    case 'conscript': {
      // Biased toward weakest target (easy kill instinct)
      targets.sort((a, b) => a.hpPct - b.hpPct);
      return Math.random() < 0.65 ? targets[0].ref : targets[Math.floor(Math.random() * targets.length)].ref;
    }
    case 'line': {
      // Slight bias toward player
      return Math.random() < 0.45 ? 'player' : targets[Math.floor(Math.random() * targets.length)].ref;
    }
    case 'veteran': {
      // Targets most dangerous (highest HP)
      targets.sort((a, b) => b.hpPct - a.hpPct);
      return Math.random() < 0.60 ? targets[0].ref : targets[Math.floor(Math.random() * targets.length)].ref;
    }
    case 'sergeant': {
      // Prioritizes the player
      return Math.random() < 0.70 ? 'player' : targets[Math.floor(Math.random() * targets.length)].ref;
    }
    default:
      return 'player';
  }
}

/** Resolve one attack in skirmish: attacker hits target, apply damage + status effects */
function simSkirmishAttack(
  attackerStr: number, attackerFatigue: number, attackerMaxFatigue: number,
  action: string, bodyPart: string, hitChance: number,
  targetGuarding: boolean, targetBlockChance: number,
  freeAttack: boolean,
): { hit: boolean; damage: number; stunTarget: boolean; armInjure: boolean; legInjure: boolean; staminaDrain: number; fatigueDrain: number } {
  const aDef = ACTION_DEFS[action];
  const miss = { hit: false, damage: 0, stunTarget: false, armInjure: false, legInjure: false, staminaDrain: 0, fatigueDrain: 0 };
  if (!aDef.isAttack) return miss;

  // Hit check
  if (Math.random() >= hitChance) return miss;

  // Block check (hit→block order)
  if (targetGuarding && Math.random() < targetBlockChance) return miss;

  // Butt Strike: stamina drain + stun chance, no HP damage
  if (action === 'butt_strike') {
    const stDrain = Math.round(rand(10, 15) * (0.75 + attackerStr / 200));
    const stunChance = aDef.stunBonus + attackerStr / 400;
    const stunTarget = Math.random() < stunChance;
    return { hit: true, damage: 0, stunTarget, armInjure: false, legInjure: false, staminaDrain: stDrain, fatigueDrain: 0 };
  }

  // Feint: stamina/fatigue drain, no HP damage
  if (action === 'feint') {
    const stDrain = Math.round(rand(25, 35));
    const ftDrain = Math.round(rand(20, 30));
    return { hit: true, damage: 0, stunTarget: false, armInjure: false, legInjure: false, staminaDrain: stDrain, fatigueDrain: ftDrain };
  }

  // Normal attacks: HP damage
  let dmg = calcDmg(action, bodyPart, attackerFatigue, attackerMaxFatigue, attackerStr);
  if (freeAttack) dmg = Math.round(dmg * 0.7);
  if (targetGuarding) dmg = Math.round(dmg * 0.85); // Failed block still reduces 15%

  // Status effects
  let stunTarget = false;
  let armInjure = false;
  let legInjure = false;

  if (bodyPart === 'head') {
    if (Math.random() < 0.10) dmg = 9999; // Instant kill
    else if (Math.random() < 0.35 + aDef.stunBonus) stunTarget = true;
  }
  if (bodyPart === 'arms' && Math.random() < 0.15) armInjure = true;
  if (bodyPart === 'legs' && Math.random() < 0.10) legInjure = true;

  return { hit: true, damage: Math.max(1, dmg), stunTarget, armInjure, legInjure, staminaDrain: 0, fatigueDrain: 0 };
}

/**
 * Simulate battery melee as skirmish with allies + wave events.
 * Matches real game: 2 initial enemies, Pierre at R3, JB at R5, max enemies → 3 at R7.
 */
function simBatterySkirmish(
  p: PlayerSim, roster: OppTemplate[], maxRounds: number, pierreAlive: boolean, jbAlive: boolean,
): { killed: number; survived: boolean; rounds: number; allyDeaths: string[]; diedOnRound: number } {
  // Build opponent pool
  const allOpps = roster.map(t => makeOpp(t));
  const activeIndices: number[] = [0, 1]; // First 2 start active
  const pool: number[] = [];
  for (let i = 2; i < allOpps.length; i++) pool.push(i);
  let maxActive = 2;

  const allies: AllySim[] = [];
  const allyDeaths: string[] = [];
  let killed = 0;

  function getLiveActive(): number[] {
    return activeIndices.filter(i => !isOppDefeated(allOpps[i]));
  }

  function backfill() {
    let liveCount = getLiveActive().length;
    while (liveCount < maxActive && pool.length > 0) {
      activeIndices.push(pool.shift()!);
      liveCount++;
    }
  }

  let diedOnRound = 0;

  for (let round = 1; round <= maxRounds; round++) {
    if (!p.alive || p.health <= 0) break;

    // ── Wave events ──
    if (round === 3 && pierreAlive) allies.push(makeAlly(PIERRE));
    if (round === 5 && jbAlive) allies.push(makeAlly(JB));
    if (round === 7) { maxActive = 3; backfill(); }

    backfill();

    const liveEnemies = getLiveActive();
    if (liveEnemies.length === 0 && pool.length === 0) break; // Victory

    const liveAllies = allies.filter(a => a.alive && a.health > 0);

    // Tick stuns
    if (p.alive) { /* player stun ticked after resolution */ }
    for (const opp of allOpps) { if (opp.stunned > 0) opp.stunned--; }
    for (const ally of allies) { if (ally.stunned > 0) ally.stunned--; }

    // Track defensive states
    let playerGuarding = false;
    let playerBlockChance = 0;
    const allyGuarding = new Map<number, number>(); // ally index → block chance

    // ═══ PLAYER ACTS ═══
    const liveEnemyOpps = liveEnemies.map(i => allOpps[i]);
    if (liveEnemyOpps.length > 0) {
      // Pick target (weakest active enemy)
      let targetLocalIdx = 0;
      let lowestPct = 1;
      for (let i = 0; i < liveEnemyOpps.length; i++) {
        const pct = liveEnemyOpps[i].health / liveEnemyOpps[i].maxHealth;
        if (pct < lowestPct) { lowestPct = pct; targetLocalIdx = i; }
      }
      const targetGlobalIdx = liveEnemies[targetLocalIdx];
      const targetOpp = allOpps[targetGlobalIdx];

      const pChoice = choosePlayerAction(p, targetOpp, round);
      const pDef = ACTION_DEFS[pChoice.action];
      const sDef = STANCE_MODS[pChoice.stance];

      // Stamina cost + fatigue
      const pCost = pDef.stamina + sDef.staminaCost;
      p.stamina = clamp(p.stamina - pCost, 0, p.maxStamina);
      if (pCost > 0) p.fatigue = Math.min(p.maxFatigue, p.fatigue + Math.round(pCost * 0.5));

      if (pChoice.action === 'guard') {
        playerGuarding = true;
        const staminaDebuffPct = getFatigueDebuff(p.fatigue, p.maxFatigue) / 100;
        playerBlockChance = clamp(0.10 + sDef.defense + p.elan / 85 + staminaDebuffPct, 0.05, 0.95);
      } else if (pChoice.action === 'shoot') {
        p.musketLoaded = false;
        p.reloadProgress = 0;
        const hitChance = playerHitChance(p, pChoice.stance, 'shoot', pChoice.bodyPart, false, targetOpp.fatigue, targetOpp.maxFatigue);
        if (Math.random() < Math.max(0.10, hitChance)) {
          const dmg = calcDmg('shoot', pChoice.bodyPart, p.fatigue, p.maxFatigue, p.strength);
          targetOpp.health -= dmg;
          p.morale = Math.min(p.maxMorale, p.morale + dmg / 3);
          if (pChoice.bodyPart === 'head' && Math.random() < 0.25) targetOpp.health = 0;
        }
      } else if (pChoice.action === 'reload') {
        p.reloadProgress += 1;
        if (p.reloadProgress >= 2) { p.musketLoaded = true; p.reloadProgress = 0; }
      } else if (pChoice.action === 'respite') {
        // Recover handled by negative stamina cost
      } else if (pChoice.action === 'use_canteen') {
        p.health = Math.min(p.maxHealth, p.health + 20);
        p.canteenUses++;
      } else if (pDef.isAttack) {
        const hitChance = playerHitChance(p, pChoice.stance, pChoice.action, pChoice.bodyPart, false, targetOpp.fatigue, targetOpp.maxFatigue);
        const result = simSkirmishAttack(
          p.strength, p.fatigue, p.maxFatigue,
          pChoice.action, pChoice.bodyPart, hitChance,
          false, 0, false,
        );
        if (result.hit) {
          targetOpp.health -= result.damage;
          targetOpp.stamina = Math.max(0, targetOpp.stamina - result.staminaDrain);
          targetOpp.fatigue = Math.min(targetOpp.maxFatigue, targetOpp.fatigue + result.fatigueDrain);
          if (result.damage > 0) p.morale = Math.min(p.maxMorale, p.morale + result.damage / 4);
          if (result.stunTarget) { targetOpp.stunned = 1; }
          if (result.armInjure) targetOpp.armInjured = true;
          if (result.legInjure) targetOpp.legInjured = true;
        }
      }

      // Check enemy defeats after player
      if (isOppDefeated(targetOpp)) killed++;
    }

    backfill();

    // ═══ ALLIES ACT ═══
    const liveEnemiesAfterPlayer = getLiveActive();
    for (const ally of liveAllies) {
      if (ally.stunned > 0 || ally.health <= 0 || !ally.alive) continue;
      const currentLive = liveEnemiesAfterPlayer.filter(i => !isOppDefeated(allOpps[i]));
      if (currentLive.length === 0) break;

      const currentLiveOpps = currentLive.map(i => allOpps[i]);
      const allyChoice = chooseAllyAction(ally, currentLiveOpps);
      const allyDef = ACTION_DEFS[allyChoice.action];
      const legMult = ally.legInjured ? 1.5 : 1.0;
      const allyCost = Math.round(allyDef.stamina * legMult);
      ally.stamina = Math.max(0, ally.stamina - allyCost);
      if (allyCost > 0) ally.fatigue = Math.min(ally.maxFatigue, ally.fatigue + Math.round(allyCost * 0.5));

      if (allyChoice.action === 'guard') {
        const allyIdx = allies.indexOf(ally);
        allyGuarding.set(allyIdx, clamp(0.10 + ally.elan / 85, 0.05, 0.80));
        continue;
      }
      if (allyChoice.action === 'respite') {
        ally.stamina = Math.min(ally.maxStamina, ally.stamina + 30);
        continue;
      }
      if (allyDef.isAttack) {
        const target = currentLiveOpps[allyChoice.targetIdx];
        const globalIdx = currentLive[allyChoice.targetIdx];
        const hitChance = allyHitChance(ally, allyChoice.action, allyChoice.bodyPart, target.fatigue, target.maxFatigue);
        const result = simSkirmishAttack(
          ally.strength, ally.fatigue, ally.maxFatigue,
          allyChoice.action, allyChoice.bodyPart, hitChance,
          false, 0, false,
        );
        if (result.hit) {
          target.health -= result.damage;
          target.stamina = Math.max(0, target.stamina - result.staminaDrain);
          target.fatigue = Math.min(target.maxFatigue, target.fatigue + result.fatigueDrain);
          if (result.stunTarget) target.stunned = 1;
          if (result.armInjure) target.armInjured = true;
          if (result.legInjure) target.legInjured = true;
        }
        if (isOppDefeated(target)) killed++;
      }
    }

    backfill();

    // ═══ ENEMIES ACT ═══
    const liveEnemiesForAttack = getLiveActive();
    for (const idx of liveEnemiesForAttack) {
      const opp = allOpps[idx];
      if (opp.stunned > 0) continue;

      const oppChoice = chooseOppAction(opp);
      const oDef = ACTION_DEFS[oppChoice.action];

      // Stamina cost + fatigue
      if (oDef.isAttack) {
        const legMult = opp.legInjured ? 1.5 : 1.0;
        const oCost = Math.round(oDef.stamina * legMult);
        opp.stamina = Math.max(0, opp.stamina - oCost);
        opp.fatigue = Math.min(opp.maxFatigue, opp.fatigue + Math.round(oCost * 0.5));
      }

      if (oppChoice.action === 'respite') {
        opp.stamina = Math.min(opp.maxStamina, opp.stamina + 30);
        continue;
      }
      if (oppChoice.action === 'guard') continue;
      if (!oDef.isAttack) continue;

      // Pick target
      const target = chooseEnemyTarget(opp, p, allies);

      if (target === 'player') {
        const baseHit = BASE_OPP_HIT[opp.type] ?? 0.45;
        const armPen = opp.armInjured ? 0.10 : 0;
        const targetVuln = -getFatigueDebuff(p.fatigue, p.maxFatigue) / 100;
        const hitChance = clamp(baseHit + oDef.hitBonus + BODY_PARTS[oppChoice.bodyPart].hitMod - armPen + targetVuln, 0.15, 0.85);

        const result = simSkirmishAttack(
          opp.strength, opp.fatigue, opp.maxFatigue,
          oppChoice.action, oppChoice.bodyPart, hitChance,
          playerGuarding, playerBlockChance, false,
        );
        if (result.hit) {
          p.health -= result.damage;
          p.stamina = Math.max(0, p.stamina - result.staminaDrain);
          p.fatigue = Math.min(p.maxFatigue, p.fatigue + result.fatigueDrain);
          if (result.damage > 0) p.morale = Math.max(0, p.morale - result.damage / 3);
          if (result.stunTarget) { /* player stun handled via morale */ }
        }
      } else {
        // Attacking an ally
        const allyIdx = target as number;
        const targetAlly = allies.filter(a => a.alive && a.health > 0)[allyIdx];
        if (!targetAlly) continue;

        const baseHit = BASE_OPP_HIT[opp.type] ?? 0.45;
        const armPen = opp.armInjured ? 0.10 : 0;
        const targetVuln = -getFatigueDebuff(targetAlly.fatigue, targetAlly.maxFatigue) / 100;
        const hitChance = clamp(baseHit + oDef.hitBonus + BODY_PARTS[oppChoice.bodyPart].hitMod - armPen + targetVuln, 0.15, 0.85);

        const realAllyIdx = allies.indexOf(targetAlly);
        const allyBlock = allyGuarding.get(realAllyIdx) || 0;

        const result = simSkirmishAttack(
          opp.strength, opp.fatigue, opp.maxFatigue,
          oppChoice.action, oppChoice.bodyPart, hitChance,
          allyBlock > 0, allyBlock, false,
        );
        if (result.hit) {
          targetAlly.health -= result.damage;
          targetAlly.stamina = Math.max(0, targetAlly.stamina - result.staminaDrain);
          targetAlly.fatigue = Math.min(targetAlly.maxFatigue, targetAlly.fatigue + result.fatigueDrain);
          if (result.stunTarget) targetAlly.stunned = 1;
          if (result.armInjure) targetAlly.armInjured = true;
          if (result.legInjure) targetAlly.legInjured = true;

          if (targetAlly.health <= 0) {
            targetAlly.alive = false;
            allyDeaths.push(targetAlly.name);
            p.morale = Math.max(0, p.morale - 8);
          }
        }
      }

    }

    // Player death check (Grace intercepts)
    if (p.health <= 0) {
      p.alive = false;
      if (!tryUseGrace(p)) { diedOnRound = round; break; }
    }

    // Victory check: all enemies down and pool empty
    const anyAlive = getLiveActive().length > 0 || pool.length > 0;
    if (!anyAlive) break;
  }

  const anyEnemyLeft = getLiveActive().length > 0 || pool.length > 0;
  const survived = p.alive && !anyEnemyLeft;

  return { killed, survived, rounds: diedOnRound, allyDeaths, diedOnRound };
}

// ── Run one full scenario ──

interface ScenarioResult {
  volleySurvived: boolean;
  hpAfterVolleys: number;
  staAfterVolleys: number;
  moraleAfterVolleys: number;
  terrainSurvived: boolean;
  terrainKills: number;
  hpAfterTerrain: number;
  batterySurvived: boolean;
  batteryKills: number;
  batteryDeathRound: number;
  finalHP: number;
  finalStamina: number;
  overallSurvived: boolean;
  pierreDied: boolean;
  jbDied: boolean;
  graceUsed: number;
}

function runScenario(stats: StatProfile): ScenarioResult {
  const maxHp = getHealthPoolSize(stats.constitution);
  const maxSta = getStaminaPoolSize(stats.endurance) * 4;

  const p: PlayerSim = {
    health: maxHp, maxHealth: maxHp,
    stamina: maxSta, maxStamina: maxSta,
    fatigue: 0, maxFatigue: maxSta,
    morale: 100, maxMorale: 100,
    elan: stats.elan, strength: stats.strength,
    musketry: stats.musketry, valor: stats.valor,
    alive: true,
    musketLoaded: true,
    reloadProgress: 0,
    canteenUses: 0,
    grace: stats.grace,
    graceUsed: 0,
  };

  // Phase 1: Volleys
  simVolleys(p);
  const hpAfterVolleys = p.health;
  const staAfterVolleys = p.stamina;
  const moraleAfterVolleys = p.morale;
  const volleySurvived = p.alive;

  if (!p.alive) {
    return {
      volleySurvived: false, hpAfterVolleys: 0, staAfterVolleys: 0, moraleAfterVolleys: 0,
      terrainSurvived: false, terrainKills: 0, hpAfterTerrain: 0,
      batterySurvived: false, batteryKills: 0, batteryDeathRound: 0,
      finalHP: 0, finalStamina: 0, overallSurvived: false,
      pierreDied: false, jbDied: false, graceUsed: p.graceUsed,
    };
  }

  // Masséna rest (rough approximation: +10 morale)
  p.morale = Math.min(p.maxMorale, p.morale + 10);

  // Phase 2: Terrain melee (musket loaded at start)
  p.musketLoaded = true;
  p.reloadProgress = 0;
  const terrain = simMelee(p, TERRAIN_ROSTER, 12);
  const hpAfterTerrain = Math.max(0, p.health);
  const terrainSurvived = p.alive || terrain.survived;

  if (!p.alive) {
    return {
      volleySurvived, hpAfterVolleys, staAfterVolleys, moraleAfterVolleys,
      terrainSurvived: false, terrainKills: terrain.killed, hpAfterTerrain: 0,
      batterySurvived: false, batteryKills: 0, batteryDeathRound: 0,
      finalHP: 0, finalStamina: 0, overallSurvived: false,
      pierreDied: false, jbDied: false, graceUsed: p.graceUsed,
    };
  }

  // Phase 3: Battery skirmish (musket loaded, with Pierre + JB allies)
  p.musketLoaded = true;
  p.reloadProgress = 0;
  const battery = simBatterySkirmish(p, BATTERY_ROSTER, 20, true, true);
  const batterySurvived = p.alive && battery.survived;

  return {
    volleySurvived, hpAfterVolleys, staAfterVolleys, moraleAfterVolleys,
    terrainSurvived, terrainKills: terrain.killed, hpAfterTerrain,
    batterySurvived, batteryKills: battery.killed,
    batteryDeathRound: battery.diedOnRound,
    finalHP: Math.max(0, p.health), finalStamina: Math.max(0, p.stamina),
    overallSurvived: batterySurvived,
    pierreDied: battery.allyDeaths.includes('Pierre'),
    jbDied: battery.allyDeaths.includes('Jean-Baptiste'),
    graceUsed: p.graceUsed,
  };
}

// ── Main ──

const N = parseInt(process.argv[2] || '1000');

interface StatProfile {
  name: string;
  elan: number;
  strength: number;
  endurance: number;
  constitution: number;
  musketry: number;
  valor: number;
  grace: number;
}

const PROFILES: StatProfile[] = [
  { name: 'Default',          elan: 35, strength: 40, endurance: 40, constitution: 45, musketry: 35, valor: 40, grace: 0 },
  { name: 'Low Stats',        elan: 20, strength: 30, endurance: 30, constitution: 35, musketry: 20, valor: 25, grace: 0 },
  { name: 'Invested',         elan: 55, strength: 50, endurance: 50, constitution: 55, musketry: 50, valor: 55, grace: 0 },
  { name: 'Expert',           elan: 75, strength: 60, endurance: 60, constitution: 65, musketry: 70, valor: 70, grace: 0 },
  { name: 'Glass Cannon',     elan: 70, strength: 65, endurance: 25, constitution: 30, musketry: 60, valor: 40, grace: 0 },
  { name: 'Tank',             elan: 25, strength: 30, endurance: 70, constitution: 70, musketry: 30, valor: 55, grace: 0 },
  { name: 'Default + 2 Grace',  elan: 35, strength: 40, endurance: 40, constitution: 45, musketry: 35, valor: 40, grace: 2 },
  { name: 'Invested + 1 Grace', elan: 55, strength: 50, endurance: 50, constitution: 55, musketry: 50, valor: 55, grace: 1 },
  { name: 'Invested + 2 Grace', elan: 55, strength: 50, endurance: 50, constitution: 55, musketry: 50, valor: 55, grace: 2 },
];

console.log(`\n=== COMBAT BALANCE SIMULATION (${N} runs per profile) ===\n`);

for (const profile of PROFILES) {
  const results: ScenarioResult[] = [];
  for (let i = 0; i < N; i++) {
    results.push(runScenario(profile));
  }

  const volleySurvival = results.filter(r => r.volleySurvived).length / N * 100;
  const terrainSurvival = results.filter(r => r.terrainSurvived).length / N * 100;
  const batterySurvival = results.filter(r => r.batterySurvived).length / N * 100;
  const overallSurvival = results.filter(r => r.overallSurvived).length / N * 100;

  const alive = results.filter(r => r.volleySurvived);
  const avgHpAfterVolleys = alive.length > 0 ? alive.reduce((s, r) => s + r.hpAfterVolleys, 0) / alive.length : 0;
  const avgStaAfterVolleys = alive.length > 0 ? alive.reduce((s, r) => s + r.staAfterVolleys, 0) / alive.length : 0;
  const avgMoraleAfterVolleys = alive.length > 0 ? alive.reduce((s, r) => s + r.moraleAfterVolleys, 0) / alive.length : 0;

  const terrainAlive = results.filter(r => r.terrainSurvived);
  const avgHpAfterTerrain = terrainAlive.length > 0 ? terrainAlive.reduce((s, r) => s + r.hpAfterTerrain, 0) / terrainAlive.length : 0;

  const avgTerrainKills = results.reduce((s, r) => s + r.terrainKills, 0) / N;
  const avgBatteryKills = results.filter(r => r.terrainSurvived).length > 0
    ? results.filter(r => r.terrainSurvived).reduce((s, r) => s + r.batteryKills, 0) / results.filter(r => r.terrainSurvived).length
    : 0;

  const maxHp = getHealthPoolSize(profile.constitution);
  const maxSta = getStaminaPoolSize(profile.endurance) * 4;

  const pierreDeathRate = results.filter(r => r.pierreDied).length / N * 100;
  const jbDeathRate = results.filter(r => r.jbDied).length / N * 100;

  // Battery diagnostics
  const batteryEntrants = results.filter(r => r.terrainSurvived);
  const avgHpEnteringBattery = batteryEntrants.length > 0 ? batteryEntrants.reduce((s, r) => s + r.hpAfterTerrain, 0) / batteryEntrants.length : 0;
  const batteryDeaths = batteryEntrants.filter(r => r.batteryDeathRound > 0);
  const avgDeathRound = batteryDeaths.length > 0 ? batteryDeaths.reduce((s, r) => s + r.batteryDeathRound, 0) / batteryDeaths.length : 0;

  const avgGraceUsed = results.reduce((s, r) => s + r.graceUsed, 0) / N;

  const graceLabel = profile.grace > 0 ? `, Grace: ${profile.grace}` : '';
  console.log(`── ${profile.name} ── (HP: ${maxHp}, Stamina: ${maxSta}${graceLabel})`);
  console.log(`  Volley survival:  ${volleySurvival.toFixed(1)}%  (avg HP: ${avgHpAfterVolleys.toFixed(0)}/${maxHp}, sta: ${avgStaAfterVolleys.toFixed(0)}/${maxSta}, morale: ${avgMoraleAfterVolleys.toFixed(0)}/100)`);
  console.log(`  Terrain survival: ${terrainSurvival.toFixed(1)}%  (avg HP after: ${avgHpAfterTerrain.toFixed(0)}/${maxHp}, avg kills: ${avgTerrainKills.toFixed(1)}/4)`);
  console.log(`  Battery survival: ${batterySurvival.toFixed(1)}%  (avg kills: ${avgBatteryKills.toFixed(1)}/4, Pierre died: ${pierreDeathRate.toFixed(0)}%, JB died: ${jbDeathRate.toFixed(0)}%)`);
  console.log(`    ↳ enters at ${avgHpEnteringBattery.toFixed(0)}/${maxHp} HP, avg death round: ${avgDeathRound.toFixed(1)} (Pierre R3, JB R5)`);
  if (profile.grace > 0) console.log(`    ↳ avg Grace used: ${avgGraceUsed.toFixed(1)}/${profile.grace}`);
  console.log(`  OVERALL SURVIVAL: ${overallSurvival.toFixed(1)}%`);
  console.log();
}

// Target survival rates from the plan:
console.log('TARGET RATES: ~35% default, ~65% invested, ~85% expert');

// ── Fresh Battery Benchmark (isolated — full HP, no prior attrition) ──
console.log(`\n=== FRESH BATTERY BENCHMARK (${N} runs, skirmish with allies, full HP) ===\n`);
for (const profile of PROFILES) {
  const maxHp = getHealthPoolSize(profile.constitution);
  const maxSta = getStaminaPoolSize(profile.endurance) * 4;
  let wins = 0;
  let totalKills = 0;
  let totalDeathRound = 0;
  let deaths = 0;
  let pierreDied = 0;
  let jbDied = 0;
  let totalGrace = 0;
  for (let i = 0; i < N; i++) {
    const fresh: PlayerSim = {
      health: maxHp, maxHealth: maxHp,
      stamina: maxSta, maxStamina: maxSta,
      fatigue: 0, maxFatigue: maxSta,
      morale: 100, maxMorale: 100,
      elan: profile.elan, strength: profile.strength,
      musketry: profile.musketry, valor: profile.valor,
      alive: true, musketLoaded: true, reloadProgress: 0,
      canteenUses: 0, grace: profile.grace, graceUsed: 0,
    };
    const result = simBatterySkirmish(fresh, BATTERY_ROSTER, 20, true, true);
    totalKills += result.killed;
    if (result.survived) wins++;
    if (result.diedOnRound > 0) { totalDeathRound += result.diedOnRound; deaths++; }
    if (result.allyDeaths.includes('Pierre')) pierreDied++;
    if (result.allyDeaths.includes('Jean-Baptiste')) jbDied++;
    totalGrace += fresh.graceUsed;
  }
  const avgKills = totalKills / N;
  const avgDeath = deaths > 0 ? totalDeathRound / deaths : 0;
  const graceInfo = profile.grace > 0 ? `, grace used: ${(totalGrace/N).toFixed(1)}/${profile.grace}` : '';
  console.log(`  ${profile.name}: ${(wins / N * 100).toFixed(1)}% win  (kills: ${avgKills.toFixed(1)}/4, death R${avgDeath.toFixed(1)}${graceInfo})`);
}
