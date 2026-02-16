/**
 * Balance Simulation — runs N full combat scenarios and reports stats.
 *
 * Usage: npx tsx tools/balance-sim.ts [runs=500]
 *
 * Simulates:
 *   1. Volley phase (Parts 1+2: 7 volleys of return fire + stamina drain)
 *   2. Terrain melee (4 opponents)
 *   3. Battery melee (3 opponents) — assumes player charges
 *
 * Reports survival rates, average HP/stamina at each phase transition,
 * and per-opponent kill/break/timeout stats.
 */

import {
  getHealthPoolSize, getStaminaPoolSize,
  MeleeStance, MeleeActionId, BodyPart, MoraleThreshold,
} from '../src/types';
import { getStaminaDebuff } from '../src/core/stats';

// ── Pull constants from melee.ts (duplicated here to avoid module side-effects) ──

const STANCE_MODS: Record<string, { attack: number; defense: number; staminaCost: number }> = {
  aggressive: { attack: 0.20, defense: -0.15, staminaCost: 14 },
  balanced:   { attack: 0,    defense: 0,     staminaCost: 10 },
  defensive:  { attack: -0.15, defense: 0.20, staminaCost: 8 },
};

const ACTION_DEFS: Record<string, { stamina: number; hitBonus: number; damageMod: number; isAttack: boolean; stunBonus: number }> = {
  bayonet_thrust:   { stamina: 20,  hitBonus: 0,    damageMod: 1.0, isAttack: true,  stunBonus: 0    },
  aggressive_lunge: { stamina: 38,  hitBonus: 0.15, damageMod: 1.5, isAttack: true,  stunBonus: 0    },
  butt_strike:      { stamina: 26,  hitBonus: 0.10, damageMod: 0.6, isAttack: true,  stunBonus: 0.20 },
  feint:            { stamina: 14,  hitBonus: 0,    damageMod: 0,   isAttack: false, stunBonus: 0    },
  guard:            { stamina: 12,  hitBonus: 0,    damageMod: 0,   isAttack: false, stunBonus: 0    },
  dodge:            { stamina: 16,  hitBonus: 0,    damageMod: 0,   isAttack: false, stunBonus: 0    },
  respite:          { stamina: -35, hitBonus: 0,    damageMod: 0,   isAttack: false, stunBonus: 0    },
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
  strength: number;
  breakPct: number;
  stunned: number;
  feinted: boolean;
  armInjured: boolean;
  legInjured: boolean;
}

interface PlayerSim {
  health: number;
  maxHealth: number;
  stamina: number;
  maxStamina: number;
  morale: number;
  maxMorale: number;
  elan: number;
  strength: number;
  alive: boolean;
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
  { type: 'conscript', hp: [60, 75],   sta: [140, 180], str: 40, breakPct: 0.35 },
  { type: 'line',      hp: [80, 95],   sta: [180, 240], str: 50, breakPct: 0.25 },
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
    strength: t.str, breakPct: t.breakPct, stunned: 0, feinted: false,
    armInjured: false, legInjured: false,
  };
}

// ── Simulate Volleys ──

function simVolleys(p: PlayerSim): void {
  for (const v of VOLLEY_DEFS) {
    if (!p.alive) return;
    // Return fire
    if (Math.random() < v.chance) {
      const dmg = rand(v.dmg[0], v.dmg[1]);
      // Fatal hit check (volleys 3-4 only, index 2-3)
      const idx = VOLLEY_DEFS.indexOf(v);
      if (idx >= 2 && idx <= 3 && Math.random() < 0.12) {
        p.health = 0;
        p.alive = false;
        return;
      }
      p.health = Math.max(0, p.health - dmg);
      p.morale = Math.max(0, p.morale - 8);
      if (p.health <= 0) { p.alive = false; return; }
    }
    // Stamina drain
    p.stamina = Math.max(0, p.stamina - v.staCost);
    p.stamina = Math.min(p.maxStamina, p.stamina + v.staRecov);
  }
}

// ── Simulate calcHitChance (player) ──

function playerHitChance(p: PlayerSim, stance: string, action: string, bodyPart: string, riposte: boolean): number {
  const moralePenalty = (1 - p.morale / p.maxMorale) * 0.15;
  const staminaDebuffPct = getStaminaDebuff(p.stamina, p.maxStamina) / 100;
  const raw = 0.35
    + STANCE_MODS[stance].attack
    + ACTION_DEFS[action].hitBonus
    + BODY_PARTS[bodyPart].hitMod
    + (riposte ? 0.15 : 0)
    + p.elan / 120
    - moralePenalty
    + staminaDebuffPct;
  return clamp(raw, 0.05, 0.95);
}

// ── Simulate calcDamage ──

function calcDmg(action: string, bodyPart: string, stamina: number, maxStamina: number, strength: number): number {
  const [lo, hi] = BODY_PARTS[bodyPart].damageRange;
  const strMod = 0.75 + strength / 200;
  const staPct = maxStamina > 0 ? stamina / maxStamina : 1;
  let dmg = Math.round(rand(lo, hi) * ACTION_DEFS[action].damageMod * strMod);
  if (staPct < 0.25) dmg = Math.round(dmg * 0.75);
  return Math.max(1, dmg);
}

// ── Player AI (simple mixed strategy) ──

function choosePlayerAction(p: PlayerSim, opp: Opponent, exchangeNum: number): { action: string; bodyPart: string; stance: string } {
  const morale = getMoraleThreshold(p.morale, p.maxMorale);
  const staPct = p.stamina / p.maxStamina;

  // Need to catch breath
  if (staPct < 0.15) return { action: 'respite', bodyPart: 'torso', stance: 'defensive' };

  // Breaking morale — can only guard/dodge/respite
  if (morale === MoraleThreshold.Breaking) {
    return Math.random() < 0.6
      ? { action: 'guard', bodyPart: 'torso', stance: 'defensive' }
      : { action: 'dodge', bodyPart: 'torso', stance: 'defensive' };
  }

  // Wavering — only thrust/guard/dodge/respite
  if (morale === MoraleThreshold.Wavering) {
    const r = Math.random();
    if (r < 0.4 && p.stamina >= 20) return { action: 'bayonet_thrust', bodyPart: 'torso', stance: 'balanced' };
    if (r < 0.7) return { action: 'guard', bodyPart: 'torso', stance: 'defensive' };
    return { action: 'dodge', bodyPart: 'torso', stance: 'balanced' };
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
    if (r < 0.65) return { action: 'guard', bodyPart: 'torso', stance: 'defensive' };
    if (r < 0.80 && p.stamina >= 16) return { action: 'dodge', bodyPart: 'torso', stance: 'balanced' };
    if (p.stamina >= 20) return { action: 'bayonet_thrust', bodyPart: 'torso', stance: 'balanced' };
    return { action: 'guard', bodyPart: 'torso', stance: 'defensive' };
  }

  // Normal mixed play
  if (r < 0.35 && p.stamina >= 20) return { action: 'bayonet_thrust', bodyPart: 'torso', stance: 'balanced' };
  if (r < 0.50 && p.stamina >= 38) return { action: 'aggressive_lunge', bodyPart: 'torso', stance: 'aggressive' };
  if (r < 0.65) return { action: 'guard', bodyPart: 'torso', stance: 'balanced' };
  if (r < 0.80 && p.stamina >= 16) return { action: 'dodge', bodyPart: 'torso', stance: 'balanced' };
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
    if (r < 0.75) return { action: 'guard', bodyPart: 'torso' };
    return { action: 'dodge', bodyPart: 'torso' };
  }

  if (opp.type === 'line') {
    if (opp.stamina / opp.maxStamina < 0.3) {
      return r < 0.5 ? { action: 'bayonet_thrust', bodyPart: target } : { action: 'respite', bodyPart: 'torso' };
    }
    if (r < 0.35) return { action: 'bayonet_thrust', bodyPart: target };
    if (r < 0.55) return { action: 'aggressive_lunge', bodyPart: target };
    if (r < 0.70) return { action: 'butt_strike', bodyPart: target };
    if (r < 0.85) return { action: 'guard', bodyPart: 'torso' };
    return { action: 'dodge', bodyPart: 'torso' };
  }

  // veteran/sergeant
  if (r < 0.25) return { action: 'bayonet_thrust', bodyPart: target };
  if (r < 0.50) return { action: 'aggressive_lunge', bodyPart: target };
  if (r < 0.60) return { action: 'feint', bodyPart: target };
  if (r < 0.72) return { action: 'butt_strike', bodyPart: target };
  if (r < 0.86) return { action: 'guard', bodyPart: 'torso' };
  return { action: 'dodge', bodyPart: 'torso' };
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

  // Tick opponent stun
  if (opp.stunned > 0) opp.stunned--;

  // Player action resolution
  if (pChoice.action === 'respite') {
    // Free attack from opponent at 70% damage
    if (oDef.isAttack) {
      const baseHit = BASE_OPP_HIT[opp.type] ?? 0.45;
      const armPen = opp.armInjured ? 0.10 : 0;
      const oppHitRaw = baseHit + oDef.hitBonus + BODY_PARTS[oppChoice.bodyPart].hitMod - armPen;
      if (Math.random() < clamp(oppHitRaw, 0.15, 0.85)) {
        let dmg = calcDmg(oppChoice.action, oppChoice.bodyPart, opp.stamina, opp.maxStamina, opp.strength);
        dmg = Math.round(dmg * 0.7);
        p.health -= dmg;
        p.morale = Math.max(0, p.morale - dmg / 3);
      }
    }
    return { oppDefeated: false };
  }

  if (pChoice.action === 'guard') {
    const staminaDebuffPct = getStaminaDebuff(p.stamina, p.maxStamina) / 100;
    const blockChance = clamp(0.10 + sDef.defense + p.elan / 85 + staminaDebuffPct, 0.05, 0.95);

    // Opponent attacks
    if (oDef.isAttack) {
      const baseHit = BASE_OPP_HIT[opp.type] ?? 0.45;
      const armPen = opp.armInjured ? 0.10 : 0;
      const oppHitRaw = baseHit + oDef.hitBonus + BODY_PARTS[oppChoice.bodyPart].hitMod - armPen;
      if (Math.random() < clamp(oppHitRaw, 0.15, 0.85)) {
        if (Math.random() < blockChance) {
          // Blocked!
        } else {
          let dmg = calcDmg(oppChoice.action, oppChoice.bodyPart, opp.stamina, opp.maxStamina, opp.strength);
          dmg = Math.round(dmg * 0.85); // Failed block still reduces 15%
          p.health -= dmg;
          p.morale = Math.max(0, p.morale - dmg / 3);
        }
      }
    }
    return { oppDefeated: false };
  }

  if (pChoice.action === 'dodge') {
    const staminaDebuffPct = getStaminaDebuff(p.stamina, p.maxStamina) / 100;
    const evadeChance = clamp(0.00 + sDef.defense + p.elan / 85 + staminaDebuffPct, 0.05, 0.95);
    const dodged = Math.random() < evadeChance;

    if (!dodged && oDef.isAttack) {
      const baseHit = BASE_OPP_HIT[opp.type] ?? 0.45;
      const armPen = opp.armInjured ? 0.10 : 0;
      const oppHitRaw = baseHit + oDef.hitBonus + BODY_PARTS[oppChoice.bodyPart].hitMod - armPen;
      if (Math.random() < clamp(oppHitRaw, 0.15, 0.85)) {
        const dmg = calcDmg(oppChoice.action, oppChoice.bodyPart, opp.stamina, opp.maxStamina, opp.strength);
        p.health -= dmg;
        p.morale = Math.max(0, p.morale - dmg / 3);
      }
    }
    return { oppDefeated: false };
  }

  if (pChoice.action === 'feint') {
    opp.stamina = Math.max(0, opp.stamina - 45);
    // Opponent still attacks
    if (oDef.isAttack) {
      const baseHit = BASE_OPP_HIT[opp.type] ?? 0.45;
      const armPen = opp.armInjured ? 0.10 : 0;
      const oppHitRaw = baseHit + oDef.hitBonus + BODY_PARTS[oppChoice.bodyPart].hitMod - armPen;
      if (Math.random() < clamp(oppHitRaw, 0.15, 0.85)) {
        const dmg = calcDmg(oppChoice.action, oppChoice.bodyPart, opp.stamina, opp.maxStamina, opp.strength);
        p.health -= dmg;
        p.morale = Math.max(0, p.morale - dmg / 3);
      }
    }
    return { oppDefeated: false };
  }

  // Player attacks
  if (pDef.isAttack) {
    const hitChance = playerHitChance(p, pChoice.stance, pChoice.action, pChoice.bodyPart, false);
    if (Math.random() < hitChance) {
      const dmg = calcDmg(pChoice.action, pChoice.bodyPart, p.stamina, p.maxStamina, p.strength);
      opp.health -= dmg;
      p.morale = Math.min(p.maxMorale, p.morale + dmg / 4);
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
    const oppHitRaw = baseHit + oDef.hitBonus + BODY_PARTS[oppChoice.bodyPart].hitMod - armPen;
    if (Math.random() < clamp(oppHitRaw, 0.15, 0.85)) {
      const dmg = calcDmg(oppChoice.action, oppChoice.bodyPart, opp.stamina, opp.maxStamina, opp.strength);
      p.health -= dmg;
      p.morale = Math.max(0, p.morale - dmg / 3);
    }
  }

  // Opponent stamina cost
  if (oDef.isAttack) {
    const legMult = opp.legInjured ? 1.5 : 1.0;
    opp.stamina = Math.max(0, opp.stamina - Math.round(oDef.stamina * legMult));
  }

  return { oppDefeated: false };
}

// ── Simulate full melee (roster of opponents) ──

function simMelee(p: PlayerSim, roster: OppTemplate[], maxExchanges: number): { killed: number; survived: boolean; exchanges: number } {
  let killed = 0;
  let exchanges = 0;

  for (const template of roster) {
    if (!p.alive || p.health <= 0) break;
    const opp = makeOpp(template);

    for (let ex = 0; ex < maxExchanges - exchanges; ex++) {
      if (p.health <= 0) { p.alive = false; break; }

      const result = simExchange(p, opp);
      exchanges++;

      if (result.oppDefeated) {
        killed++;
        break;
      }

      if (exchanges >= maxExchanges) break;
    }

    if (p.health <= 0) p.alive = false;

    // Check survived condition (low HP, killed 2+, not last opponent)
    if (p.alive && p.health < 25 && killed >= 2 && roster.indexOf(template) < roster.length - 1) {
      return { killed, survived: true, exchanges };
    }
  }

  return { killed, survived: false, exchanges };
}

// ── Run one full scenario ──

interface ScenarioResult {
  volleySurvived: boolean;
  hpAfterVolleys: number;
  staAfterVolleys: number;
  terrainSurvived: boolean;
  terrainKills: number;
  hpAfterTerrain: number;
  batterySurvived: boolean;
  batteryKills: number;
  finalHP: number;
  finalStamina: number;
  overallSurvived: boolean;
}

function runScenario(stats: { elan: number; strength: number; endurance: number; constitution: number }): ScenarioResult {
  const maxHp = getHealthPoolSize(stats.constitution);
  const maxSta = getStaminaPoolSize(stats.endurance) * 4;

  const p: PlayerSim = {
    health: maxHp, maxHealth: maxHp,
    stamina: maxSta, maxStamina: maxSta,
    morale: 100, maxMorale: 100,
    elan: stats.elan, strength: stats.strength,
    alive: true,
  };

  // Phase 1: Volleys
  simVolleys(p);
  const hpAfterVolleys = p.health;
  const staAfterVolleys = p.stamina;
  const volleySurvived = p.alive;

  if (!p.alive) {
    return {
      volleySurvived: false, hpAfterVolleys: 0, staAfterVolleys: 0,
      terrainSurvived: false, terrainKills: 0, hpAfterTerrain: 0,
      batterySurvived: false, batteryKills: 0,
      finalHP: 0, finalStamina: 0, overallSurvived: false,
    };
  }

  // Masséna rest (rough approximation: +15 HP, +40 stamina, +10 morale)
  p.morale = Math.min(p.maxMorale, p.morale + 10);

  // Phase 2: Terrain melee
  const terrain = simMelee(p, TERRAIN_ROSTER, 12);
  const hpAfterTerrain = Math.max(0, p.health);
  const terrainSurvived = p.alive || terrain.survived;

  if (!p.alive) {
    return {
      volleySurvived, hpAfterVolleys, staAfterVolleys,
      terrainSurvived: false, terrainKills: terrain.killed, hpAfterTerrain: 0,
      batterySurvived: false, batteryKills: 0,
      finalHP: 0, finalStamina: 0, overallSurvived: false,
    };
  }

  // Phase 3: Battery melee
  const battery = simMelee(p, BATTERY_ROSTER, 10);
  const batterySurvived = p.alive || battery.survived;

  return {
    volleySurvived, hpAfterVolleys, staAfterVolleys,
    terrainSurvived, terrainKills: terrain.killed, hpAfterTerrain,
    batterySurvived, batteryKills: battery.killed,
    finalHP: Math.max(0, p.health), finalStamina: Math.max(0, p.stamina),
    overallSurvived: p.alive || battery.survived,
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
}

const PROFILES: StatProfile[] = [
  { name: 'Default (35/40/40/45)',    elan: 35, strength: 40, endurance: 40, constitution: 45 },
  { name: 'Low Stats (20/30/30/35)',  elan: 20, strength: 30, endurance: 30, constitution: 35 },
  { name: 'Invested (55/50/50/55)',   elan: 55, strength: 50, endurance: 50, constitution: 55 },
  { name: 'Expert (75/60/60/65)',     elan: 75, strength: 60, endurance: 60, constitution: 65 },
  { name: 'Glass Cannon (70/65/25/30)', elan: 70, strength: 65, endurance: 25, constitution: 30 },
  { name: 'Tank (25/30/70/70)',       elan: 25, strength: 30, endurance: 70, constitution: 70 },
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

  const terrainAlive = results.filter(r => r.terrainSurvived);
  const avgHpAfterTerrain = terrainAlive.length > 0 ? terrainAlive.reduce((s, r) => s + r.hpAfterTerrain, 0) / terrainAlive.length : 0;

  const avgTerrainKills = results.reduce((s, r) => s + r.terrainKills, 0) / N;
  const avgBatteryKills = results.filter(r => r.terrainSurvived).length > 0
    ? results.filter(r => r.terrainSurvived).reduce((s, r) => s + r.batteryKills, 0) / results.filter(r => r.terrainSurvived).length
    : 0;

  const maxHp = getHealthPoolSize(profile.constitution);
  const maxSta = getStaminaPoolSize(profile.endurance) * 4;

  console.log(`── ${profile.name} ── (HP: ${maxHp}, Stamina: ${maxSta})`);
  console.log(`  Volley survival:  ${volleySurvival.toFixed(1)}%  (avg HP after: ${avgHpAfterVolleys.toFixed(0)}/${maxHp}, sta: ${avgStaAfterVolleys.toFixed(0)}/${maxSta})`);
  console.log(`  Terrain survival: ${terrainSurvival.toFixed(1)}%  (avg HP after: ${avgHpAfterTerrain.toFixed(0)}/${maxHp}, avg kills: ${avgTerrainKills.toFixed(1)}/4)`);
  console.log(`  Battery survival: ${batterySurvival.toFixed(1)}%  (avg kills: ${avgBatteryKills.toFixed(1)}/3)`);
  console.log(`  OVERALL SURVIVAL: ${overallSurvival.toFixed(1)}%`);
  console.log();
}

// Target survival rates from the plan:
console.log('TARGET RATES: ~35% default, ~65% invested, ~85% expert');
