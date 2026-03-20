/* ------------------------------------------------------------------ */
/*  Momentum helpers — consecutive-hit bonus system                    */
/*                                                                     */
/*  Momentum is a 0-3 counter. Each hit increments it (cap 3).        */
/*  Any miss resets to 0. At 1+ stacks, +5% hit bonus.                */
/*  At 2+ stacks, +15% damage bonus. Reaching 3 arms a free strike   */
/*  (next attack action costs 0 stamina). All gated on                */
/*  tuning.momentumEnabled.                                            */
/* ------------------------------------------------------------------ */

export interface MomentumHolder {
  momentum: number;
  freeStrikeReady: boolean;
}

/**
 * Update momentum after an attack resolves.
 * Mutates the holder in place.
 * @param c — any object with momentum + freeStrikeReady (player or opponent)
 * @param hit — whether the attack connected
 */
export function updateMomentum(c: MomentumHolder, hit: boolean): void {
  if (hit) {
    const prev = c.momentum;
    c.momentum = Math.min(3, prev + 1);
    if (prev === 2 && c.momentum === 3) c.freeStrikeReady = true;
  } else {
    c.momentum = 0;
    c.freeStrikeReady = false;
  }
}

/**
 * Reset momentum to 0 and disarm any pending free strike.
 * Used when a combatant takes damage from an opponent.
 */
export function resetMomentum(c: MomentumHolder): void {
  c.momentum = 0;
  c.freeStrikeReady = false;
}
