import { describe, it, expect, vi } from 'vitest';
import {
  clampStat,
  rollD100,
  displayRoll,
  displayTarget,
  getPlayerStat,
  setPlayerStat,
  adjustPlayerStat,
  rollStat,
  getFatigueDebuff,
  Difficulty,
} from '../../core/stats';
import type { Player } from '../../types';
import { MoraleThreshold, HealthState, FatigueTier } from '../../types';

// ---------------------------------------------------------------------------
// Helper: minimal mock Player with all numeric stat fields
// ---------------------------------------------------------------------------
function mockPlayer(overrides: Partial<Player> = {}): Player {
  return {
    name: 'Test Soldier',
    valor: 40,
    musketry: 35,
    elan: 35,
    strength: 40,
    endurance: 40,
    constitution: 45,
    charisma: 30,
    intelligence: 30,
    awareness: 35,
    morale: 80,
    maxMorale: 100,
    moraleThreshold: MoraleThreshold.Steady,
    health: 100,
    maxHealth: 120,
    healthState: HealthState.Unhurt,
    stamina: 100,
    maxStamina: 200,
    fatigue: 0,
    maxFatigue: 200,
    fatigueTier: FatigueTier.Fresh,
    musketLoaded: true,
    alive: true,
    routing: false,
    fumbledLoad: false,
    soldierRep: 0,
    officerRep: 50,
    napoleonRep: 0,
    frontRank: false,
    canteenUses: 3,
    ...overrides,
  };
}

// ===========================================================================
// clampStat
// ===========================================================================
describe('clampStat', () => {
  it('returns the value unchanged when it is within [0, 100]', () => {
    expect(clampStat(50)).toBe(50);
    expect(clampStat(0)).toBe(0);
    expect(clampStat(100)).toBe(100);
  });

  it('clamps negative values to 0', () => {
    expect(clampStat(-1)).toBe(0);
    expect(clampStat(-999)).toBe(0);
  });

  it('clamps values above 100 to 100', () => {
    expect(clampStat(101)).toBe(100);
    expect(clampStat(999)).toBe(100);
  });

  it('handles fractional values', () => {
    expect(clampStat(50.5)).toBe(50.5);
    expect(clampStat(-0.1)).toBe(0);
    expect(clampStat(100.1)).toBe(100);
  });
});

// ===========================================================================
// rollD100
// ===========================================================================
describe('rollD100', () => {
  it('always returns an integer in [1, 100]', () => {
    for (let i = 0; i < 1000; i++) {
      const roll = rollD100();
      expect(roll).toBeGreaterThanOrEqual(1);
      expect(roll).toBeLessThanOrEqual(100);
      expect(Number.isInteger(roll)).toBe(true);
    }
  });

  it('produces a reasonable distribution (hits both extremes over many rolls)', () => {
    const rolls = new Set<number>();
    for (let i = 0; i < 5000; i++) {
      rolls.add(rollD100());
    }
    // With 5000 rolls, we should see at least 90 of the 100 possible values
    expect(rolls.size).toBeGreaterThanOrEqual(90);
    // Should include both boundary values with high probability
    expect(rolls.has(1) || rolls.has(2)).toBe(true);
    expect(rolls.has(100) || rolls.has(99)).toBe(true);
  });
});

// ===========================================================================
// displayRoll / displayTarget
// ===========================================================================
describe('displayRoll', () => {
  it('converts internal roll-under to display roll-over (101 - roll)', () => {
    expect(displayRoll(1)).toBe(100);
    expect(displayRoll(50)).toBe(51);
    expect(displayRoll(100)).toBe(1);
  });
});

describe('displayTarget', () => {
  it('converts internal target to display target (101 - target)', () => {
    expect(displayTarget(1)).toBe(100);
    expect(displayTarget(50)).toBe(51);
    expect(displayTarget(100)).toBe(1);
  });

  it('is symmetrical with displayRoll for the same input', () => {
    for (let v = 1; v <= 100; v++) {
      expect(displayRoll(v)).toBe(displayTarget(v));
    }
  });
});

// ===========================================================================
// getPlayerStat
// ===========================================================================
describe('getPlayerStat', () => {
  it('returns the correct value for each known numeric stat', () => {
    const p = mockPlayer({
      valor: 55,
      musketry: 42,
      elan: 38,
      strength: 60,
      endurance: 48,
      constitution: 50,
      charisma: 25,
      intelligence: 33,
      awareness: 44,
      soldierRep: 10,
      officerRep: 70,
      napoleonRep: 5,
    });

    expect(getPlayerStat(p, 'valor')).toBe(55);
    expect(getPlayerStat(p, 'musketry')).toBe(42);
    expect(getPlayerStat(p, 'elan')).toBe(38);
    expect(getPlayerStat(p, 'strength')).toBe(60);
    expect(getPlayerStat(p, 'endurance')).toBe(48);
    expect(getPlayerStat(p, 'constitution')).toBe(50);
    expect(getPlayerStat(p, 'charisma')).toBe(25);
    expect(getPlayerStat(p, 'intelligence')).toBe(33);
    expect(getPlayerStat(p, 'awareness')).toBe(44);
    expect(getPlayerStat(p, 'soldierRep')).toBe(10);
    expect(getPlayerStat(p, 'officerRep')).toBe(70);
    expect(getPlayerStat(p, 'napoleonRep')).toBe(5);
  });

  it('returns 0 for unknown stat names', () => {
    const p = mockPlayer();
    expect(getPlayerStat(p, 'nonexistent')).toBe(0);
    expect(getPlayerStat(p, '')).toBe(0);
    expect(getPlayerStat(p, 'health')).toBe(0); // health is not a NumericStatKey
  });
});

// ===========================================================================
// setPlayerStat
// ===========================================================================
describe('setPlayerStat', () => {
  it('sets a known numeric stat to the given value', () => {
    const p = mockPlayer();
    setPlayerStat(p, 'valor', 99);
    expect(p.valor).toBe(99);

    setPlayerStat(p, 'soldierRep', 75);
    expect(p.soldierRep).toBe(75);
  });

  it('does not modify the player for unknown stat names', () => {
    const p = mockPlayer();
    const before = { ...p };
    setPlayerStat(p, 'nonexistent', 999);
    // All known stats remain unchanged
    expect(p.valor).toBe(before.valor);
    expect(p.strength).toBe(before.strength);
  });

  it('allows setting values outside [0, 100] (no clamping)', () => {
    const p = mockPlayer();
    setPlayerStat(p, 'strength', 150);
    expect(p.strength).toBe(150);

    setPlayerStat(p, 'charisma', -10);
    expect(p.charisma).toBe(-10);
  });
});

// ===========================================================================
// adjustPlayerStat
// ===========================================================================
describe('adjustPlayerStat', () => {
  it('increases a stat by a positive delta', () => {
    const p = mockPlayer({ strength: 40 });
    adjustPlayerStat(p, 'strength', 10);
    expect(p.strength).toBe(50);
  });

  it('decreases a stat by a negative delta', () => {
    const p = mockPlayer({ valor: 60 });
    adjustPlayerStat(p, 'valor', -20);
    expect(p.valor).toBe(40);
  });

  it('clamps the result to 0 (no negative stats)', () => {
    const p = mockPlayer({ charisma: 10 });
    adjustPlayerStat(p, 'charisma', -50);
    expect(p.charisma).toBe(0);
  });

  it('clamps the result to 100 (no stat above 100)', () => {
    const p = mockPlayer({ musketry: 90 });
    adjustPlayerStat(p, 'musketry', 20);
    expect(p.musketry).toBe(100);
  });

  it('does nothing for unknown stat names', () => {
    const p = mockPlayer({ valor: 40 });
    adjustPlayerStat(p, 'nonexistent', 10);
    expect(p.valor).toBe(40); // unchanged
  });

  it('works with zero delta', () => {
    const p = mockPlayer({ elan: 35 });
    adjustPlayerStat(p, 'elan', 0);
    expect(p.elan).toBe(35);
  });
});

// ===========================================================================
// rollStat
// ===========================================================================
describe('rollStat', () => {
  it('returns a result with success, roll, target, and margin fields', () => {
    // Seed a predictable roll by mocking Math.random
    vi.spyOn(Math, 'random').mockReturnValue(0.49); // roll = floor(0.49*100)+1 = 50
    const result = rollStat(60, 0, Difficulty.Standard);
    expect(result).toEqual({
      success: true,
      roll: 50,
      target: 60,
      margin: 10,
    });
    vi.restoreAllMocks();
  });

  it('applies modifier to the target', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.59); // roll = 60
    const result = rollStat(40, 15);
    expect(result.target).toBe(55); // 40 + 15
    expect(result.success).toBe(false); // 60 > 55
    vi.restoreAllMocks();
  });

  it('applies difficulty to the target', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.49); // roll = 50
    const result = rollStat(50, 0, Difficulty.Easy);
    expect(result.target).toBe(65); // 50 + 15
    expect(result.success).toBe(true); // 50 <= 65
    vi.restoreAllMocks();
  });

  it('clamps target to minimum 5 (never impossible)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.0); // roll = 1
    const result = rollStat(0, -100, Difficulty.Hard);
    expect(result.target).toBe(5);
    vi.restoreAllMocks();
  });

  it('clamps target to maximum 95 (never guaranteed)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99); // roll = 100
    const result = rollStat(100, 100, Difficulty.Easy);
    expect(result.target).toBe(95);
    vi.restoreAllMocks();
  });

  it('margin is positive on success and negative on failure', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.19); // roll = 20
    const success = rollStat(50);
    expect(success.success).toBe(true);
    expect(success.margin).toBeGreaterThan(0);
    vi.restoreAllMocks();

    vi.spyOn(Math, 'random').mockReturnValue(0.79); // roll = 80
    const fail = rollStat(50);
    expect(fail.success).toBe(false);
    expect(fail.margin).toBeLessThan(0);
    vi.restoreAllMocks();
  });

  it('produces rolls in range [1, 100] over many iterations', () => {
    const rolls: number[] = [];
    for (let i = 0; i < 1000; i++) {
      const r = rollStat(50);
      rolls.push(r.roll);
      expect(r.roll).toBeGreaterThanOrEqual(1);
      expect(r.roll).toBeLessThanOrEqual(100);
    }
  });

  it('uses Difficulty enum values correctly', () => {
    expect(Difficulty.Easy).toBe(15);
    expect(Difficulty.Standard).toBe(0);
    expect(Difficulty.Hard).toBe(-15);
  });

  it('defaults modifier to 0 and difficulty to Standard', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.39); // roll = 40
    const result = rollStat(50);
    expect(result.target).toBe(50);
    expect(result.success).toBe(true); // 40 <= 50
    vi.restoreAllMocks();
  });
});

// ===========================================================================
// getFatigueDebuff
// ===========================================================================
describe('getFatigueDebuff', () => {
  const maxFatigue = 200;

  it('returns 0 for Fresh tier (< 25% fatigue)', () => {
    expect(getFatigueDebuff(0, maxFatigue)).toBe(0);
    expect(getFatigueDebuff(10, maxFatigue)).toBe(0);
    expect(getFatigueDebuff(49, maxFatigue)).toBe(0); // 24.5% < 25%
  });

  it('returns -10 for Winded tier (25%-49% fatigue)', () => {
    expect(getFatigueDebuff(50, maxFatigue)).toBe(-10); // exactly 25%
    expect(getFatigueDebuff(75, maxFatigue)).toBe(-10); // 37.5%
    expect(getFatigueDebuff(99, maxFatigue)).toBe(-10); // 49.5%
  });

  it('returns -30 for Fatigued tier (50%-74% fatigue)', () => {
    expect(getFatigueDebuff(100, maxFatigue)).toBe(-30); // exactly 50%
    expect(getFatigueDebuff(120, maxFatigue)).toBe(-30); // 60%
    expect(getFatigueDebuff(149, maxFatigue)).toBe(-30); // 74.5%
  });

  it('returns -50 for Exhausted tier (>= 75% fatigue)', () => {
    expect(getFatigueDebuff(150, maxFatigue)).toBe(-50); // exactly 75%
    expect(getFatigueDebuff(180, maxFatigue)).toBe(-50); // 90%
    expect(getFatigueDebuff(200, maxFatigue)).toBe(-50); // 100%
  });

  it('returns 0 when maxFatigue is 0 (Fresh by default)', () => {
    expect(getFatigueDebuff(0, 0)).toBe(0);
    expect(getFatigueDebuff(50, 0)).toBe(0);
  });

  it('handles boundary values precisely', () => {
    // Right at 25% boundary
    expect(getFatigueDebuff(50, 200)).toBe(-10); // 25% = Winded
    // Just under 25%
    expect(getFatigueDebuff(49, 200)).toBe(0); // 24.5% = Fresh
    // Right at 50% boundary
    expect(getFatigueDebuff(100, 200)).toBe(-30); // 50% = Fatigued
    // Right at 75% boundary
    expect(getFatigueDebuff(150, 200)).toBe(-50); // 75% = Exhausted
  });
});

// ===========================================================================
// Difficulty enum
// ===========================================================================
describe('Difficulty enum', () => {
  it('has exactly three members with correct values', () => {
    expect(Difficulty.Easy).toBe(15);
    expect(Difficulty.Standard).toBe(0);
    expect(Difficulty.Hard).toBe(-15);
  });
});
