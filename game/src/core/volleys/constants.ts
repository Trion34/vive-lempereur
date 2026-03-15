/**
 * Volley definitions for the rank-agency system.
 *
 * TODO: This currently hardcodes Rivoli volley defs. When rank-agency
 * is refactored to support multiple battles, these functions should
 * accept `volleys: VolleyConfig[]` as a parameter (like autoVolley.ts).
 */

import { RIVOLI_VOLLEY_DEFS } from '../../data/battles/rivoli/volleys';

export const VOLLEY_DEFS = RIVOLI_VOLLEY_DEFS;
