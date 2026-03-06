import type {
  BattleState,
  Action,
} from '../../types';
import { getBattleConfig } from '../../data/battles/registry';

// ============================================================
// SCRIPTED AVAILABLE ACTIONS — delegates to BattleConfig
// ============================================================

/**
 * Returns available actions for the current battle state.
 * Delegates to the battle config's getAvailableActions callback.
 * If no config or callback, returns [].
 */
export function getScriptedAvailableActions(state: BattleState): Action[] {
  try {
    const config = getBattleConfig(state.configId);
    return config.getAvailableActions?.(state) ?? [];
  } catch {
    return [];
  }
}
