import {
  THRESHOLD_HIGH,
  THRESHOLD_MID,
  THRESHOLD_LOW,
  FATIGUE_THRESHOLD_WINDED,
  FATIGUE_THRESHOLD_FATIGUED,
  FATIGUE_THRESHOLD_EXHAUSTED,
} from './constants';
import { MoraleThreshold, HealthState, FatigueTier } from './enums';

export function getMoraleThreshold(morale: number, max: number): MoraleThreshold {
  const pct = morale / max;
  if (pct >= THRESHOLD_HIGH) return MoraleThreshold.Steady;
  if (pct >= THRESHOLD_MID) return MoraleThreshold.Shaken;
  if (pct >= THRESHOLD_LOW) return MoraleThreshold.Wavering;
  return MoraleThreshold.Breaking;
}

export function getHealthState(health: number, max: number): HealthState {
  const pct = health / max;
  if (pct >= THRESHOLD_HIGH) return HealthState.Unhurt;
  if (pct >= THRESHOLD_MID) return HealthState.Wounded;
  if (pct >= THRESHOLD_LOW) return HealthState.BadlyWounded;
  return HealthState.Critical;
}

export function getStaminaPoolSize(endurance: number): number {
  return 30 + Math.round(1.5 * endurance);
}

export function getHealthPoolSize(constitution: number): number {
  return 30 + Math.round(1.5 * constitution);
}

export function getFatigueTier(fatigue: number, maxFatigue: number): FatigueTier {
  if (maxFatigue <= 0) return FatigueTier.Fresh;
  const pct = fatigue / maxFatigue;
  if (pct < FATIGUE_THRESHOLD_WINDED) return FatigueTier.Fresh;
  if (pct < FATIGUE_THRESHOLD_FATIGUED) return FatigueTier.Winded;
  if (pct < FATIGUE_THRESHOLD_EXHAUSTED) return FatigueTier.Fatigued;
  return FatigueTier.Exhausted;
}

/** Returns tier-relative fill (0-100) for fatigue radial: ring resets at each tier boundary */
export function getFatigueTierFill(fatigue: number, maxFatigue: number): number {
  if (maxFatigue <= 0) return 0;
  const pct = (fatigue / maxFatigue) * 100;
  const tierStart = pct >= 75 ? 75 : pct >= 50 ? 50 : pct >= 25 ? 25 : 0;
  return Math.min(100, ((pct - tierStart) / 25) * 100);
}

/** CSS variable color for a fatigue tier */
export function getFatigueTierColor(tier: FatigueTier): string {
  switch (tier) {
    case FatigueTier.Fresh:
      return 'var(--stamina-high)';
    case FatigueTier.Winded:
      return 'var(--stamina-mid)';
    case FatigueTier.Fatigued:
      return 'var(--stamina-low)';
    case FatigueTier.Exhausted:
      return 'var(--morale-crit)';
  }
}
