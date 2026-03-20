// Barrel re-export: all public API from the melee subsystem
export { createMeleeState } from './encounters';
export { resetMeleeHistory, recordPlayerAction } from './opponents';
export { snapshotOf, getMeleeActions } from './effects';
export { calcHitChance } from './hitCalc';
export { resolveMeleeRound } from './round';
export { getMeleeTuning, CLASSIC_TUNING, V2_TUNING } from './tuning';
export type { MeleeTuning, BodyPartTuning, RespiteRecovery } from './tuning';
export { updateMomentum, resetMomentum } from './momentum';
export type { MomentumHolder } from './momentum';
