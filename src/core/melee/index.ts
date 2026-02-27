// Barrel re-export: all public API from the melee subsystem
export { createMeleeState } from './encounters';
export { resetMeleeHistory } from './opponents';
export { snapshotOf, getMeleeActions, shortName } from './effects';
export { calcHitChance } from './hitCalc';
export { resolveGenericAttack } from './genericAttack';
export { resolveMeleeRound } from './round';
