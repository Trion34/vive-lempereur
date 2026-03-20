import { MeleeActionId } from '../../types';

/** Module-level animation speed multiplier. Higher = faster (2 = half duration). */
let animationSpeed = 1;

/** Set the global animation speed multiplier for melee wait() calls. */
export function setAnimationSpeed(speed: number) {
  animationSpeed = Math.max(0.1, speed);
}

/** Get the current animation speed multiplier. */
export function getAnimationSpeed(): number {
  return animationSpeed;
}

export function wait(ms: number) {
  return new Promise<void>((r) => setTimeout(r, Math.round(ms / animationSpeed)));
}

export const ACTION_DISPLAY_NAMES: Record<string, string> = {
  [MeleeActionId.BayonetThrust]: 'BAYONET THRUST',
  [MeleeActionId.AggressiveLunge]: 'LUNGE',
  [MeleeActionId.ButtStrike]: 'BUTT STRIKE',
  [MeleeActionId.Shoot]: 'SHOOT',
  [MeleeActionId.Feint]: 'FEINT',
  [MeleeActionId.Guard]: 'GUARD',
  [MeleeActionId.Respite]: 'CATCH BREATH',
  [MeleeActionId.Reload]: 'RELOADING',
  [MeleeActionId.SecondWind]: 'SECOND WIND',
  [MeleeActionId.UseCanteen]: 'DRINK CANTEEN',
};

export const LOAD_STEP_LABELS = ['Bite cartridge', 'Pour powder', 'Ram ball', 'Prime pan'];
