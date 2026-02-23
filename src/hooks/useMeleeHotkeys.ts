import { useEffect } from 'react';
import {
  BattlePhase,
  MeleeStance,
  MeleeActionId,
  BodyPart,
  MoraleThreshold,
} from '../types';
import { getMeleeActions } from '../core/melee';
import { useGameStore } from '../stores/gameStore';
import { useUiStore } from '../stores/uiStore';

const STANCE_HOTKEYS: Record<string, MeleeStance> = {
  '1': MeleeStance.Aggressive,
  '2': MeleeStance.Balanced,
  '3': MeleeStance.Defensive,
};

const BODY_PART_HOTKEYS: Record<string, BodyPart> = {
  '1': BodyPart.Head,
  '2': BodyPart.Torso,
  '3': BodyPart.Arms,
  '4': BodyPart.Legs,
};

const KEY_TO_ACTION: Record<string, MeleeActionId> = {
  Q: MeleeActionId.BayonetThrust,
  W: MeleeActionId.AggressiveLunge,
  E: MeleeActionId.ButtStrike,
  R: MeleeActionId.Feint,
  T: MeleeActionId.Shoot,
  A: MeleeActionId.Guard,
  S: MeleeActionId.Respite,
  D: MeleeActionId.SecondWind,
  F: MeleeActionId.Reload,
};

/**
 * Actions that require a body part picker step before execution.
 */
function needsBodyPartPicker(id: MeleeActionId): boolean {
  return (
    id === MeleeActionId.BayonetThrust ||
    id === MeleeActionId.AggressiveLunge ||
    id === MeleeActionId.Shoot
  );
}

/**
 * Hook that listens for melee hotkeys during the melee phase.
 *
 * @param onAction - called when the user completes an action via hotkey
 * @param onFlee - called when the user presses X at Breaking morale
 */
export function useMeleeHotkeys(
  onAction: (action: MeleeActionId, bodyPart?: BodyPart) => void,
  onFlee: () => void,
) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const gameState = useGameStore.getState().gameState;
      const battleState = gameState?.battleState;
      if (!battleState || battleState.phase !== BattlePhase.Melee) return;

      const ui = useUiStore.getState();
      if (ui.processing || battleState.battleOver) return;

      // Don't intercept when typing in an input
      const tag = (document.activeElement?.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      const ms = battleState.meleeState;
      if (!ms) return;

      const key = e.key.toUpperCase();

      // --- Body part picker active ---
      if (ms.selectingTarget && ui.meleeSelectedAction) {
        const bodyPart = BODY_PART_HOTKEYS[key];
        if (bodyPart) {
          e.preventDefault();
          onAction(ui.meleeSelectedAction, bodyPart);
          return;
        }
        if (e.key === 'Escape') {
          e.preventDefault();
          useUiStore.getState().setMeleeSelectedAction(null);
          ms.selectingTarget = false;
          return;
        }
        return; // swallow other keys while picker is open
      }

      // --- Inventory panel active ---
      if (ui.meleeShowingInventory) {
        if (key === '1') {
          const canteenLeft = 3 - battleState.player.canteenUses;
          if (canteenLeft > 0) {
            e.preventDefault();
            useUiStore.getState().setMeleeShowingInventory(false);
            onAction(MeleeActionId.UseCanteen);
          }
          return;
        }
        if (e.key === 'Escape') {
          e.preventDefault();
          useUiStore.getState().setMeleeShowingInventory(false);
          return;
        }
        return;
      }

      // --- Main view: stances (number row) ---
      const stance = STANCE_HOTKEYS[key];
      if (stance) {
        e.preventDefault();
        useUiStore.getState().setMeleeStance(stance);
        return;
      }

      // --- Main view: actions (letter keys) ---
      const actions = getMeleeActions(battleState);
      const actionId = KEY_TO_ACTION[key];
      if (actionId) {
        const action = actions.find((a) => a.id === actionId);
        if (!action || !action.available) return;
        e.preventDefault();

        if (needsBodyPartPicker(actionId)) {
          useUiStore.getState().setMeleeSelectedAction(actionId);
          ms.selectingTarget = true;
        } else {
          onAction(actionId);
        }
        return;
      }

      // --- Inventory ---
      if (key === 'I') {
        e.preventDefault();
        useUiStore.getState().setMeleeShowingInventory(true);
        return;
      }

      // --- Flee ---
      if (key === 'X' && battleState.player.moraleThreshold === MoraleThreshold.Breaking) {
        e.preventDefault();
        onFlee();
        return;
      }
    }

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onAction, onFlee]);
}
