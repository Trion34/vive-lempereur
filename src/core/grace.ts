import type { GameState, BattleState } from '../types';
import { FatigueTier, getHealthState, getMoraleThreshold } from '../types';

export const GRACE_CAP = 2;

/**
 * Apply grace recovery when the player would die.
 * Spends one grace to restore the player to 50% of max stats.
 * @mutates gameState.player.grace, battleState.player, battleState.battleOver, battleState.outcome
 * @returns true if grace was available and applied, false otherwise
 */
export function applyGraceRecovery(gameState: GameState, battleState: BattleState): boolean {
  if (gameState.player.grace <= 0) return false;
  gameState.player.grace--;

  const bp = battleState.player;
  bp.health = bp.maxHealth * 0.5;
  bp.morale = bp.maxMorale * 0.5;
  bp.stamina = bp.maxStamina * 0.5;
  bp.healthState = getHealthState(bp.health, bp.maxHealth);
  bp.moraleThreshold = getMoraleThreshold(bp.morale, bp.maxMorale);
  bp.fatigue = 0;
  bp.fatigueTier = FatigueTier.Fresh;
  bp.alive = true;
  battleState.battleOver = false;
  battleState.outcome = 'pending';
  return true;
}

/**
 * Collect a grace reward earned during a story beat.
 * @mutates gameState.player.grace, battleState.graceEarned
 */
export function collectGraceReward(gameState: GameState, battleState: BattleState): void {
  if (!battleState.graceEarned) return;
  gameState.player.grace = Math.min(GRACE_CAP, gameState.player.grace + 1);
  battleState.graceEarned = false;
}
