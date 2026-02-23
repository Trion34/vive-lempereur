import type { BattleState, GameState, MeleeStance, MeleeActionId } from '../types';
import { MeleeStance as MeleeStanceEnum } from '../types';

export const appState = {
  gameState: null as unknown as GameState,
  state: null as unknown as BattleState, // battle state alias
  lastRenderedTurn: -1,
  renderedEntriesForTurn: 0,
  processing: false,
  campLogCount: 0,
  campIntroSeen: false,
  arenaLogCount: 0,
  showOpeningBeat: false,
  campQuipTimer: null as ReturnType<typeof setTimeout> | null,
  pendingAutoPlayResume: false,
  phaseLogStart: 0,
  meleeStance: MeleeStanceEnum.Balanced as MeleeStance,
  meleeSelectedAction: null as MeleeActionId | null,
  meleeShowingInventory: false,
  pendingChargeResult: null as { narrative: string; statSummary: string } | null,
  playerGlory: 0,
  glorySpent: {} as Record<string, number>,
  // Camp inline action screen
  campActionCategory: null as string | null,
  campActionResult: null as { text: string; changes: string[] } | null,
  campActionSub: null as string | null, // for nested sub-menus (e.g. Duties → Equipment)
  // Melee hotkey hints
  meleeHotkeysVisible: false,
};

let _render: () => void = () => {};
export function triggerRender() {
  _render();
}
