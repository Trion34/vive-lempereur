import { describe, it, expect } from 'vitest';
import {
  getMoraleThreshold,
  MoraleThreshold,
  getHealthState,
  HealthState,
  getStaminaPoolSize,
  getHealthPoolSize,
  getFatigueTier,
  FatigueTier,
  getFatigueTierFill,
  getFatigueTierColor,
} from '../types';

// ---------------------------------------------------------------------------
// getMoraleThreshold
// ---------------------------------------------------------------------------
describe('getMoraleThreshold', () => {
  it('returns Steady at exactly 75%', () => {
    expect(getMoraleThreshold(75, 100)).toBe(MoraleThreshold.Steady);
  });

  it('returns Steady above 75%', () => {
    expect(getMoraleThreshold(100, 100)).toBe(MoraleThreshold.Steady);
    expect(getMoraleThreshold(80, 100)).toBe(MoraleThreshold.Steady);
  });

  it('returns Shaken just below 75%', () => {
    expect(getMoraleThreshold(74, 100)).toBe(MoraleThreshold.Shaken);
  });

  it('returns Shaken at exactly 40%', () => {
    expect(getMoraleThreshold(40, 100)).toBe(MoraleThreshold.Shaken);
  });

  it('returns Wavering just below 40%', () => {
    expect(getMoraleThreshold(39, 100)).toBe(MoraleThreshold.Wavering);
  });

  it('returns Wavering at exactly 15%', () => {
    expect(getMoraleThreshold(15, 100)).toBe(MoraleThreshold.Wavering);
  });

  it('returns Breaking just below 15%', () => {
    expect(getMoraleThreshold(14, 100)).toBe(MoraleThreshold.Breaking);
  });

  it('returns Breaking at 0', () => {
    expect(getMoraleThreshold(0, 100)).toBe(MoraleThreshold.Breaking);
  });

  it('handles non-100 max values', () => {
    // 150/200 = 0.75 => Steady
    expect(getMoraleThreshold(150, 200)).toBe(MoraleThreshold.Steady);
    // 10/50 = 0.20 => Wavering
    expect(getMoraleThreshold(10, 50)).toBe(MoraleThreshold.Wavering);
  });

  it('returns Steady when morale exceeds max', () => {
    expect(getMoraleThreshold(120, 100)).toBe(MoraleThreshold.Steady);
  });
});

// ---------------------------------------------------------------------------
// getHealthState
// ---------------------------------------------------------------------------
describe('getHealthState', () => {
  it('returns Unhurt at exactly 75%', () => {
    expect(getHealthState(75, 100)).toBe(HealthState.Unhurt);
  });

  it('returns Unhurt above 75%', () => {
    expect(getHealthState(100, 100)).toBe(HealthState.Unhurt);
    expect(getHealthState(90, 100)).toBe(HealthState.Unhurt);
  });

  it('returns Wounded just below 75%', () => {
    expect(getHealthState(74, 100)).toBe(HealthState.Wounded);
  });

  it('returns Wounded at exactly 40%', () => {
    expect(getHealthState(40, 100)).toBe(HealthState.Wounded);
  });

  it('returns BadlyWounded just below 40%', () => {
    expect(getHealthState(39, 100)).toBe(HealthState.BadlyWounded);
  });

  it('returns BadlyWounded at exactly 15%', () => {
    expect(getHealthState(15, 100)).toBe(HealthState.BadlyWounded);
  });

  it('returns Critical just below 15%', () => {
    expect(getHealthState(14, 100)).toBe(HealthState.Critical);
  });

  it('returns Critical at 0', () => {
    expect(getHealthState(0, 100)).toBe(HealthState.Critical);
  });

  it('handles non-100 max values', () => {
    // 60/80 = 0.75 => Unhurt
    expect(getHealthState(60, 80)).toBe(HealthState.Unhurt);
    // 3/20 = 0.15 => BadlyWounded
    expect(getHealthState(3, 20)).toBe(HealthState.BadlyWounded);
    // 2/20 = 0.10 => Critical
    expect(getHealthState(2, 20)).toBe(HealthState.Critical);
  });

  it('returns Unhurt when health exceeds max', () => {
    expect(getHealthState(150, 100)).toBe(HealthState.Unhurt);
  });
});

// ---------------------------------------------------------------------------
// getStaminaPoolSize
// ---------------------------------------------------------------------------
describe('getStaminaPoolSize', () => {
  it('returns 30 when endurance is 0', () => {
    expect(getStaminaPoolSize(0)).toBe(30);
  });

  it('returns 30 + round(1.5 * endurance) for typical values', () => {
    // endurance 40: 30 + round(60) = 90
    expect(getStaminaPoolSize(40)).toBe(90);
    // endurance 100: 30 + round(150) = 180
    expect(getStaminaPoolSize(100)).toBe(180);
  });

  it('rounds correctly for odd endurance values', () => {
    // endurance 1: 30 + round(1.5) = 30 + 2 = 32
    expect(getStaminaPoolSize(1)).toBe(32);
    // endurance 3: 30 + round(4.5) = 30 + 4 = 34 (banker's rounding in some impls)
    // Math.round(4.5) = 5 in JS
    expect(getStaminaPoolSize(3)).toBe(35);
    // endurance 5: 30 + round(7.5) = 30 + 8 = 38
    expect(getStaminaPoolSize(5)).toBe(38);
  });

  it('handles large endurance values', () => {
    expect(getStaminaPoolSize(200)).toBe(330);
  });
});

// ---------------------------------------------------------------------------
// getHealthPoolSize
// ---------------------------------------------------------------------------
describe('getHealthPoolSize', () => {
  it('returns 30 when constitution is 0', () => {
    expect(getHealthPoolSize(0)).toBe(30);
  });

  it('returns 30 + round(1.5 * constitution) for typical values', () => {
    // constitution 45 (default): 30 + round(67.5) = 30 + 68 = 98
    expect(getHealthPoolSize(45)).toBe(98);
    // constitution 100: 30 + round(150) = 180
    expect(getHealthPoolSize(100)).toBe(180);
  });

  it('rounds correctly for odd constitution values', () => {
    // constitution 1: 30 + round(1.5) = 30 + 2 = 32
    expect(getHealthPoolSize(1)).toBe(32);
    // constitution 3: 30 + round(4.5) = 30 + 5 = 35
    expect(getHealthPoolSize(3)).toBe(35);
  });

  it('handles large constitution values', () => {
    expect(getHealthPoolSize(200)).toBe(330);
  });
});

// ---------------------------------------------------------------------------
// getFatigueTier
// ---------------------------------------------------------------------------
describe('getFatigueTier', () => {
  it('returns Fresh when maxFatigue is 0', () => {
    expect(getFatigueTier(0, 0)).toBe(FatigueTier.Fresh);
  });

  it('returns Fresh when maxFatigue is negative', () => {
    expect(getFatigueTier(0, -10)).toBe(FatigueTier.Fresh);
  });

  it('returns Fresh when fatigue is 0', () => {
    expect(getFatigueTier(0, 100)).toBe(FatigueTier.Fresh);
  });

  it('returns Fresh just below 25%', () => {
    expect(getFatigueTier(24, 100)).toBe(FatigueTier.Fresh);
  });

  it('returns Winded at exactly 25%', () => {
    expect(getFatigueTier(25, 100)).toBe(FatigueTier.Winded);
  });

  it('returns Winded just below 50%', () => {
    expect(getFatigueTier(49, 100)).toBe(FatigueTier.Winded);
  });

  it('returns Fatigued at exactly 50%', () => {
    expect(getFatigueTier(50, 100)).toBe(FatigueTier.Fatigued);
  });

  it('returns Fatigued just below 75%', () => {
    expect(getFatigueTier(74, 100)).toBe(FatigueTier.Fatigued);
  });

  it('returns Exhausted at exactly 75%', () => {
    expect(getFatigueTier(75, 100)).toBe(FatigueTier.Exhausted);
  });

  it('returns Exhausted at 100%', () => {
    expect(getFatigueTier(100, 100)).toBe(FatigueTier.Exhausted);
  });

  it('returns Exhausted when fatigue exceeds maxFatigue', () => {
    expect(getFatigueTier(120, 100)).toBe(FatigueTier.Exhausted);
  });

  it('handles non-100 maxFatigue values', () => {
    // 50/200 = 0.25 => Winded
    expect(getFatigueTier(50, 200)).toBe(FatigueTier.Winded);
    // 30/60 = 0.50 => Fatigued
    expect(getFatigueTier(30, 60)).toBe(FatigueTier.Fatigued);
  });
});

// ---------------------------------------------------------------------------
// getFatigueTierFill
// ---------------------------------------------------------------------------
describe('getFatigueTierFill', () => {
  it('returns 0 when maxFatigue is 0', () => {
    expect(getFatigueTierFill(0, 0)).toBe(0);
  });

  it('returns 0 when maxFatigue is negative', () => {
    expect(getFatigueTierFill(0, -5)).toBe(0);
  });

  it('returns 0 when fatigue is 0', () => {
    expect(getFatigueTierFill(0, 100)).toBe(0);
  });

  it('returns proportional fill within the Fresh tier (0-25%)', () => {
    // fatigue 12.5 / max 100 = 12.5% => tierStart 0 => ((12.5 - 0) / 25) * 100 = 50
    expect(getFatigueTierFill(12.5, 100)).toBe(50);
    // fatigue 25 / max 100 = 25% => tierStart 25 => ((25 - 25) / 25) * 100 = 0
    expect(getFatigueTierFill(25, 100)).toBe(0);
  });

  it('returns proportional fill within the Winded tier (25-50%)', () => {
    // fatigue 37.5 / max 100 = 37.5% => tierStart 25 => ((37.5 - 25) / 25) * 100 = 50
    expect(getFatigueTierFill(37.5, 100)).toBe(50);
  });

  it('returns proportional fill within the Fatigued tier (50-75%)', () => {
    // fatigue 62.5 / max 100 = 62.5% => tierStart 50 => ((62.5 - 50) / 25) * 100 = 50
    expect(getFatigueTierFill(62.5, 100)).toBe(50);
  });

  it('returns proportional fill within the Exhausted tier (75-100%)', () => {
    // fatigue 87.5 / max 100 = 87.5% => tierStart 75 => ((87.5 - 75) / 25) * 100 = 50
    expect(getFatigueTierFill(87.5, 100)).toBe(50);
  });

  it('returns 100 at exact tier boundary end', () => {
    // fatigue 24.99.. of 100 => pct ~24.99 => tierStart 0 => ((24.99 - 0)/25)*100 ~ 99.96
    // fatigue 50/100 = 50% => tierStart 50 => ((50 - 50)/25)*100 = 0 (it crossed into next tier)
    // Use exactly 100/100 = 100% => tierStart 75 => ((100 - 75) / 25) * 100 = 100
    expect(getFatigueTierFill(100, 100)).toBe(100);
  });

  it('caps at 100 when fatigue exceeds maxFatigue', () => {
    // fatigue 150 / max 100 = 150% => tierStart 75 => ((150 - 75) / 25) * 100 = 300, capped at 100
    expect(getFatigueTierFill(150, 100)).toBe(100);
  });

  it('handles non-100 maxFatigue values', () => {
    // fatigue 10 / max 200 = 5% => pct = 5 => tierStart 0 => ((5 - 0) / 25) * 100 = 20
    expect(getFatigueTierFill(10, 200)).toBe(20);
  });

  it('returns 0 at exact tier boundary starts (reset behavior)', () => {
    // 25% => tierStart 25 => fill = 0
    expect(getFatigueTierFill(25, 100)).toBe(0);
    // 50% => tierStart 50 => fill = 0
    expect(getFatigueTierFill(50, 100)).toBe(0);
    // 75% => tierStart 75 => fill = 0
    expect(getFatigueTierFill(75, 100)).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// getFatigueTierColor
// ---------------------------------------------------------------------------
describe('getFatigueTierColor', () => {
  it('returns --stamina-high for Fresh', () => {
    expect(getFatigueTierColor(FatigueTier.Fresh)).toBe('var(--stamina-high)');
  });

  it('returns --stamina-mid for Winded', () => {
    expect(getFatigueTierColor(FatigueTier.Winded)).toBe('var(--stamina-mid)');
  });

  it('returns --stamina-low for Fatigued', () => {
    expect(getFatigueTierColor(FatigueTier.Fatigued)).toBe('var(--stamina-low)');
  });

  it('returns --morale-crit for Exhausted', () => {
    expect(getFatigueTierColor(FatigueTier.Exhausted)).toBe('var(--morale-crit)');
  });
});
