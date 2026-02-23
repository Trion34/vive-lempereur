// Barrel re-export for volleys module
// Replaces the old src/core/scriptedVolleys.ts

export { VOLLEY_RANGES, VOLLEY_DEFS } from './constants';
export type { VolleyDef } from './constants';

export { resolveScriptedFire, resolveGorgeFire, resolveGorgePresent } from './fire';

export { resolveScriptedEvents, resolveScriptedReturnFire } from './events';

export { getScriptedAvailableActions } from './actions';

export { getVolleyNarrative } from './narrative';

export { resolveAutoVolley, resolveAutoGorgeVolley, rollLineIntegrity } from './autoVolley';
