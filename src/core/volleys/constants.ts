// Re-export volley definitions from Rivoli config (first battle).
// Future: engine will receive these via BattleConfig parameter.
import { RIVOLI_VOLLEY_DEFS, RIVOLI_VOLLEY_RANGES } from '../../data/battles/rivoli/volleys';

export const VOLLEY_DEFS = RIVOLI_VOLLEY_DEFS;
export const VOLLEY_RANGES = RIVOLI_VOLLEY_RANGES;
