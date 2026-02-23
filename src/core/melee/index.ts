// Barrel re-export: all public API from the melee subsystem
export { ENCOUNTERS, createMeleeState } from './encounters';
export { resetMeleeHistory } from './opponents';
export { snapshotOf, getMeleeActions } from './effects';
export {
  calcHitChance,
  resolveGenericAttack,
  resolveMeleeRound,
} from './combat';
export type { MeleeRoundResult } from './combat';
