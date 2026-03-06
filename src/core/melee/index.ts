// Barrel re-export: all public API from the melee subsystem
export { createMeleeState } from './encounters';
export { resetMeleeHistory } from './opponents';
export { snapshotOf, getMeleeActions } from './effects';
export { calcHitChance } from './hitCalc';
export { resolveMeleeRound } from './round';
