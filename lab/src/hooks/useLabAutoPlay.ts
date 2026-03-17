/**
 * useLabAutoPlay — standalone volley resolution for the Line Battle Lab preview.
 *
 * This is a simplified reimplementation of the game's resolveAutoVolley/resolveAutoGorgeVolley
 * math. It does NOT import from the game package (lab and game are separate workspaces).
 *
 * Simplifications vs the game engine:
 * - No musket loading step (auto-succeeds — the preview skips the load/fumble mechanic)
 * - No neighbour morale contagion (NPC state is not modeled)
 * - No officer rally bonus (officer state is not modeled)
 * - No drums playing bonus (line state is not modeled)
 * - No scripted events (events are described as free text in LabVolleyEntry.eventDescription)
 * - Simplified line integrity roll (no officer/drums modifiers)
 * - No fatigue tier system (only flat stamina drain)
 *
 * The preview is a design tool for validating difficulty curves and narrative flow,
 * not an exact simulation. For exact results, use the game itself.
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import type { LabVolleyEntry, VolleyMode } from '../types/lineCombatTypes';

/* ------------------------------------------------------------------ */
/*  Preview state types                                                */
/* ------------------------------------------------------------------ */

export interface PreviewPlayerConfig {
  musketry: number;
  valor: number;
  endurance: number;
  constitution: number;
  health: number;
  morale: number;
  stamina: number;
  frontRank: boolean;
}

export interface VolleyResult {
  volleyIndex: number;
  range: number;
  fireHit: boolean;
  fireNarrative: string;
  valorRoll: { outcome: 'great_success' | 'pass' | 'fail' | 'critical_fail'; moraleDelta: number } | null;
  returnFireHit: boolean;
  healthDamage: number;
  moraleDelta: number;
  staminaDelta: number;
  playerDied: boolean;
  narratives: string[];
  // Snapshot after this volley resolved
  healthAfter: number;
  moraleAfter: number;
  staminaAfter: number;
  enemyStrengthAfter: number;
  lineIntegrityAfter: number;
}

export interface PreviewState {
  running: boolean;
  paused: boolean;
  finished: boolean;
  currentVolley: number;
  totalVolleys: number;
  health: number;
  maxHealth: number;
  morale: number;
  maxMorale: number;
  stamina: number;
  maxStamina: number;
  enemyStrength: number;
  lineIntegrity: number;
  results: VolleyResult[];
  gorgeTarget: 'column' | 'officers' | 'wagon' | 'mercy' | null;
}

type SpeedSetting = 'slow' | 'normal' | 'fast';
const SPEED_MS: Record<SpeedSetting, number> = { slow: 2000, normal: 1000, fast: 300 };

/* ------------------------------------------------------------------ */
/*  Core volley resolution (standalone — no game imports)              */
/* ------------------------------------------------------------------ */

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rollPercent(chance: number): boolean {
  return Math.random() < chance;
}

function calcFireAccuracy(base: number, musketry: number): number {
  return Math.min(0.95, base + musketry / 400);
}

function calcLoadSuccess(musketry: number): number {
  return Math.min(0.95, 0.5 + musketry / 200);
}

interface ValorRollOut {
  outcome: 'great_success' | 'pass' | 'fail' | 'critical_fail';
  moraleDelta: number;
}

function rollValor(valor: number, difficultyMod: number): ValorRollOut {
  const target = clamp(valor + difficultyMod, 5, 95);
  const roll = Math.random() * 100;
  const margin = target - roll;
  if (margin >= 20) return { outcome: 'great_success', moraleDelta: 5 };
  if (margin >= 0)  return { outcome: 'pass', moraleDelta: 1 };
  if (margin >= -20) return { outcome: 'fail', moraleDelta: -5 };
  return { outcome: 'critical_fail', moraleDelta: -10 };
}

function resolvePreviewVolley(
  volley: LabVolleyEntry,
  volleyIndex: number,
  player: {
    musketry: number; valor: number; health: number; maxHealth: number;
    morale: number; maxMorale: number; stamina: number; maxStamina: number;
    frontRank: boolean;
  },
  enemy: { strength: number; lineIntegrity: number },
  lineIntegrity: number,
  mode: VolleyMode,
  gorgeTarget?: 'column' | 'officers' | 'wagon' | 'mercy',
): VolleyResult {
  const d = volley.def;
  const narratives: string[] = [];
  let moraleDelta = 0;
  let healthDamage = 0;

  // --- PRESENT ---
  narratives.push(volley.narratives.present);

  // --- FIRE ---
  const accuracy = calcFireAccuracy(d.fireAccuracyBase, player.musketry);
  const fireHit = rollPercent(accuracy);
  const hitNarr = volley.narratives.fireHit;
  const missNarr = volley.narratives.fireMiss;
  const fireNarrative = fireHit
    ? hitNarr[randInt(0, hitNarr.length - 1)]
    : missNarr[randInt(0, missNarr.length - 1)];
  narratives.push(`${volley.narratives.fireOrder} ${fireNarrative}`);

  // Enemy damage
  const lineDmg = d.enemyLineDamage;
  const fireDmg = fireHit ? Math.round(lineDmg * 0.5) : 0;
  enemy.strength = Math.max(0, enemy.strength - lineDmg - fireDmg);
  enemy.lineIntegrity = Math.max(0, enemy.lineIntegrity - (lineDmg + fireDmg) * 0.7);

  if (fireHit) moraleDelta += 2;

  // --- VALOR ROLL (standard mode only) ---
  let valorRoll: ValorRollOut | null = null;
  if (mode === 'standard') {
    const diffMod = (lineIntegrity - 100) * 0.3;
    valorRoll = rollValor(player.valor, diffMod);
    moraleDelta += valorRoll.moraleDelta;
    narratives.push(`Valor: ${valorRoll.outcome.replace('_', ' ')}`);

    // Critical fail wound chance
    if (valorRoll.outcome === 'critical_fail' && rollPercent(0.2)) {
      const wound = randInt(5, 10);
      healthDamage += wound;
      narratives.push('Flinched — minor wound.');
    }
  }

  // --- GORGE TARGET (gorge mode) ---
  if (mode === 'gorge' && gorgeTarget) {
    if (gorgeTarget === 'mercy') {
      narratives.push('You lower your musket. The line fires without you.');
      moraleDelta += 3;
    } else if (gorgeTarget === 'officers') {
      const officerHit = rollPercent(accuracy * 0.6);
      if (officerHit) {
        enemy.strength = Math.max(0, enemy.strength - 5);
        narratives.push('Officer down. Column wavers.');
        moraleDelta += 2;
      } else {
        narratives.push('Missed the officer.');
      }
    } else if (gorgeTarget === 'wagon') {
      const wagonHit = rollPercent(accuracy * 0.4);
      if (wagonHit) {
        enemy.strength = Math.max(0, enemy.strength - 15);
        narratives.push('Wagon hit! Explosion.');
        moraleDelta += 5;
      } else {
        narratives.push('Wagon shot missed.');
      }
    } else {
      narratives.push('Fire into the column.');
    }
  }

  // --- ENDURE (return fire — standard mode only) ---
  let returnFireHit = false;
  if (mode === 'standard') {
    narratives.push(volley.narratives.endure);
    const retChance = d.enemyReturnFireChance + (player.frontRank ? volley.returnFire.frontRankBonus : 0);
    returnFireHit = rollPercent(Math.min(0.95, retChance));
    if (returnFireHit) {
      // Fatal check
      if (volley.returnFire.fatalChance > 0 && rollPercent(volley.returnFire.fatalChance)) {
        healthDamage = player.health; // instant kill
        narratives.push('FATAL HIT.');
      } else {
        const dmg = randInt(d.enemyReturnFireDamage[0], d.enemyReturnFireDamage[1]);
        healthDamage += dmg;
        narratives.push(`Hit by return fire. ${dmg} damage.`);
      }
      moraleDelta -= 3;
    } else {
      narratives.push('Return fire misses.');
    }

    // Line integrity roll
    const frenchRoll = lineIntegrity * 0.6 + Math.random() * 20;
    const rangePressure = Math.max(0, (200 - d.range) / 4);
    const austrianRoll = enemy.strength * 0.5 + rangePressure + Math.random() * 20;
    if (frenchRoll >= austrianRoll) {
      const extraDmg = randInt(2, 4);
      enemy.strength = Math.max(0, enemy.strength - extraDmg);
      enemy.lineIntegrity = Math.max(0, enemy.lineIntegrity - extraDmg);
    } else {
      const intLoss = randInt(3, 6);
      lineIntegrity = Math.max(0, lineIntegrity - intLoss);
    }

    // Passive morale drain from range
    moraleDelta -= Math.max(1, Math.round((200 - d.range) / 50));
  } else {
    // Gorge: minimal return fire
    narratives.push(volley.narratives.endure);
    if (rollPercent(d.enemyReturnFireChance)) {
      const dmg = randInt(d.enemyReturnFireDamage[0], d.enemyReturnFireDamage[1]);
      healthDamage += dmg;
      narratives.push(`Stray shot. ${dmg} damage.`);
    }
    moraleDelta -= 1;
  }

  // --- STAMINA ---
  const staminaCost = volley.stamina.cost;
  const staminaRecovery = volley.stamina.recovery;
  const staminaDelta = -staminaCost + staminaRecovery;

  // --- APPLY ---
  const newHealth = Math.max(0, player.health - healthDamage);
  const rawMorale = player.morale + moraleDelta;
  const newMorale = clamp(rawMorale, 0, player.maxMorale);
  const newStamina = clamp(player.stamina + staminaDelta, 0, player.maxStamina);
  const playerDied = newHealth <= 0;

  return {
    volleyIndex,
    range: d.range,
    fireHit,
    fireNarrative,
    valorRoll,
    returnFireHit,
    healthDamage,
    moraleDelta,
    staminaDelta,
    playerDied,
    narratives,
    healthAfter: newHealth,
    moraleAfter: newMorale,
    staminaAfter: newStamina,
    enemyStrengthAfter: enemy.strength,
    lineIntegrityAfter: lineIntegrity,
  };
}

/* ------------------------------------------------------------------ */
/*  Preview hook                                                       */
/* ------------------------------------------------------------------ */

const DEFAULT_PLAYER: PreviewPlayerConfig = {
  musketry: 35,
  valor: 40,
  endurance: 40,
  constitution: 45,
  health: 80,
  morale: 70,
  stamina: 90,
  frontRank: false,
};

function createInitialPreview(volleys: LabVolleyEntry[]): PreviewState {
  const p = DEFAULT_PLAYER;
  return {
    running: false,
    paused: false,
    finished: false,
    currentVolley: 0,
    totalVolleys: volleys.length,
    health: p.health,
    maxHealth: Math.round(30 + 1.5 * p.constitution),
    morale: p.morale,
    maxMorale: 100,
    stamina: p.stamina,
    maxStamina: Math.round(30 + 1.5 * p.endurance),
    enemyStrength: 100,
    lineIntegrity: 100,
    results: [],
    gorgeTarget: null,
  };
}

export function useLabAutoPlay(volleys: LabVolleyEntry[], mode: VolleyMode) {
  const [preview, setPreview] = useState<PreviewState>(() => createInitialPreview(volleys));
  const [playerConfig, setPlayerConfig] = useState<PreviewPlayerConfig>(DEFAULT_PLAYER);
  const [speed, setSpeed] = useState<SpeedSetting>('normal');
  const cancelRef = useRef(false);
  const pauseRef = useRef(false);

  // Sync totalVolleys when the module changes
  useEffect(() => {
    cancelRef.current = true;
    setPreview((s) => ({
      ...s,
      totalVolleys: volleys.length,
      running: false, paused: false, finished: false,
      currentVolley: 0, results: [],
    }));
  }, [volleys.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const reset = useCallback(() => {
    cancelRef.current = true;
    const p = playerConfig;
    setPreview({
      running: false,
      paused: false,
      finished: false,
      currentVolley: 0,
      totalVolleys: volleys.length,
      health: p.health,
      maxHealth: Math.round(30 + 1.5 * p.constitution),
      morale: p.morale,
      maxMorale: 100,
      stamina: p.stamina,
      maxStamina: Math.round(30 + 1.5 * p.endurance),
      enemyStrength: 100,
      lineIntegrity: 100,
      results: [],
      gorgeTarget: null,
    });
  }, [volleys.length, playerConfig]);

  const play = useCallback(async () => {
    cancelRef.current = false;
    pauseRef.current = false;
    const p = playerConfig;
    const maxHealth = Math.round(30 + 1.5 * p.constitution);
    const maxMorale = 100;
    const maxStamina = Math.round(30 + 1.5 * p.endurance);

    let health = p.health;
    let morale = p.morale;
    let stamina = p.stamina;
    let enemyStrength = 100;
    let enemyLineIntegrity = 100;
    let lineIntegrity = 100;
    const results: VolleyResult[] = [];

    setPreview((s) => ({ ...s, running: true, paused: false, finished: false, results: [], currentVolley: 0, totalVolleys: volleys.length }));

    for (let i = 0; i < volleys.length; i++) {
      if (cancelRef.current) return;

      // Wait while paused
      while (pauseRef.current && !cancelRef.current) {
        await new Promise((r) => setTimeout(r, 100));
      }
      if (cancelRef.current) return;

      // For gorge mode, default to 'column' target (preview doesn't pause for selection)
      const gorgeTarget = mode === 'gorge' ? 'column' as const : undefined;

      const enemy = { strength: enemyStrength, lineIntegrity: enemyLineIntegrity };
      const result = resolvePreviewVolley(
        volleys[i], i, {
          musketry: p.musketry, valor: p.valor,
          health, maxHealth, morale, maxMorale, stamina, maxStamina,
          frontRank: p.frontRank,
        },
        enemy, lineIntegrity, mode, gorgeTarget,
      );

      // Update running state
      health = result.healthAfter;
      morale = result.moraleAfter;
      stamina = result.staminaAfter;
      enemyStrength = result.enemyStrengthAfter;
      enemyLineIntegrity = enemy.lineIntegrity;
      lineIntegrity = result.lineIntegrityAfter;
      results.push(result);

      setPreview((s) => ({
        ...s,
        currentVolley: i + 1,
        health, morale, stamina, enemyStrength, lineIntegrity,
        maxHealth, maxMorale, maxStamina,
        results: [...results],
      }));

      if (result.playerDied) {
        setPreview((s) => ({ ...s, running: false, finished: true }));
        return;
      }

      // Delay between volleys
      await new Promise((r) => setTimeout(r, SPEED_MS[speed]));
    }

    if (!cancelRef.current) {
      setPreview((s) => ({ ...s, running: false, finished: true }));
    }
  }, [volleys, mode, playerConfig, speed]);

  const pause = useCallback(() => {
    pauseRef.current = true;
    setPreview((s) => ({ ...s, paused: true }));
  }, []);

  const resume = useCallback(() => {
    pauseRef.current = false;
    setPreview((s) => ({ ...s, paused: false }));
  }, []);

  const updatePlayer = useCallback((patch: Partial<PreviewPlayerConfig>) => {
    setPlayerConfig((p) => ({ ...p, ...patch }));
  }, []);

  return { preview, playerConfig, speed, play, pause, resume, reset, setSpeed, updatePlayer };
}
