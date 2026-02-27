import React from 'react';
import { useGameStore } from '../../stores/gameStore';
import { useUiStore } from '../../stores/uiStore';
import { GamePhase } from '../../types';
import {
  transitionToBattle,
  createNewGame,
} from '../../core/gameLoop';
import { getScriptedAvailableActions } from '../../core/volleys';
import { Section, ActionBtn, useForceUpdate } from './helpers';
import {
  commit,
  jumpToPreBattleCamp,
  jumpToVolley,
  jumpToCharge,
  jumpToMelee,
  jumpToCredits,
  forceBattleEnd,
} from './shared';

interface ActionsTabProps {
  onClose: () => void;
}

// ── auto-play ──

function autoPlayTurn() {
  const selectors = [
    '#actions-grid button',
    '.parchment-choice',
    '#arena-actions-grid button.action-btn',
  ];
  for (const sel of selectors) {
    const btn = document.querySelector(sel) as HTMLElement | null;
    if (btn) {
      btn.click();
      setTimeout(() => {
        const torso = document.querySelector('.body-target-btn') as HTMLElement | null;
        if (torso) torso.click();
      }, 100);
      return;
    }
  }
}

function autoPlayMultiple(count: number) {
  let i = 0;
  const interval = setInterval(() => {
    autoPlayTurn();
    i++;
    if (i >= count) clearInterval(interval);
  }, 300);
}

// ── component ──

export function ActionsTab({ onClose }: ActionsTabProps) {
  const gs = useGameStore((s) => s.gameState);
  const [, bump] = useForceUpdate();

  if (!gs) return React.createElement('div', null, 'No game state');

  const wrap = (fn: () => void) => () => {
    fn();
    bump();
    onClose();
  };

  const wrapNoClose = (fn: () => void) => () => {
    fn();
    bump();
  };

  const elements: React.ReactElement[] = [];

  // ── Skip Phases ──
  elements.push(React.createElement(Section, { key: 'skip', label: 'Skip Phases' }));
  elements.push(
    React.createElement('div', { key: 'skip-btns', className: 'dev-btn-group' },
      React.createElement(ActionBtn, { label: '\u2192 Pre-Battle Camp', onClick: wrap(() => jumpToPreBattleCamp()) }),
      React.createElement(ActionBtn, { label: '\u2192 Battery', onClick: wrap(() => jumpToCharge(1)) }),
      React.createElement(ActionBtn, { label: '\u2192 Melee', onClick: wrap(() => jumpToMelee()) }),
      React.createElement(ActionBtn, { label: '\u2192 Mass\u00e9na', onClick: wrap(() => jumpToCharge(2)) }),
      React.createElement(ActionBtn, { label: '\u2192 Part 2 (V5)', onClick: wrap(() => jumpToVolley(5, 2)) }),
      React.createElement(ActionBtn, { label: '\u2192 Gorge Beat', onClick: wrap(() => jumpToCharge(3)) }),
      React.createElement(ActionBtn, { label: '\u2192 Part 3 (V8)', onClick: wrap(() => jumpToVolley(8, 3)) }),
      React.createElement(ActionBtn, { label: '\u2192 Credits', onClick: wrap(() => jumpToCredits()) }),
      React.createElement(ActionBtn, {
        label: 'Camp \u2192 Battle',
        onClick: wrapNoClose(() => {
          if (gs.phase === GamePhase.Camp) {
            transitionToBattle(gs);
            const bs = gs.battleState!;
            bs.log.push({
              turn: 0,
              text: '[DEV] Skipped camp, starting new battle',
              type: 'narrative',
            });
            bs.availableActions = getScriptedAvailableActions(bs);
            commit(gs);
          }
        }),
      }),
    ),
  );

  // ── Battle Outcomes ──
  elements.push(React.createElement(Section, { key: 'outcomes', label: 'Battle Outcomes' }));
  elements.push(
    React.createElement('div', { key: 'outcome-btns', className: 'dev-btn-group' },
      React.createElement(ActionBtn, { label: 'Victory', cls: 'success', onClick: wrapNoClose(() => forceBattleEnd('victory')) }),
      React.createElement(ActionBtn, { label: 'Gorge Victory', cls: 'success', onClick: wrapNoClose(() => forceBattleEnd('gorge_victory')) }),
      React.createElement(ActionBtn, { label: 'Survived', onClick: wrapNoClose(() => forceBattleEnd('survived')) }),
      React.createElement(ActionBtn, { label: 'Rout', cls: 'danger', onClick: wrapNoClose(() => forceBattleEnd('rout')) }),
      React.createElement(ActionBtn, { label: 'Defeat', cls: 'danger', onClick: wrapNoClose(() => forceBattleEnd('defeat')) }),
    ),
  );

  // ── Camp Actions ──
  elements.push(React.createElement(Section, { key: 'camp', label: 'Camp Actions' }));
  elements.push(
    React.createElement('div', { key: 'camp-btns', className: 'dev-btn-group' },
      React.createElement(ActionBtn, {
        label: 'Skip Camp Event',
        onClick: wrapNoClose(() => {
          if (gs.campState?.pendingEvent) {
            gs.campState.pendingEvent = undefined;
            gs.campState.log.push({ day: 1, text: '[DEV] Event skipped', type: 'narrative' });
            commit(gs);
          }
        }),
      }),
      React.createElement(ActionBtn, {
        label: 'Complete Camp',
        onClick: wrapNoClose(() => {
          if (gs.campState) {
            gs.campState.actionsRemaining = 0;
            gs.campState.pendingEvent = undefined;
            commit(gs);
          }
        }),
      }),
      React.createElement(ActionBtn, {
        label: 'Add Activity', cls: 'success',
        onClick: wrapNoClose(() => {
          if (gs.campState) {
            gs.campState.actionsRemaining++;
            commit(gs);
          }
        }),
      }),
    ),
  );

  // ── General ──
  elements.push(React.createElement(Section, { key: 'general', label: 'General' }));
  elements.push(
    React.createElement('div', { key: 'general-btns', className: 'dev-btn-group' },
      React.createElement(ActionBtn, {
        label: 'Reset Game', cls: 'danger',
        onClick: wrapNoClose(() => {
          const newGs = createNewGame();
          useGameStore.getState().setGameState(newGs);
          useUiStore.getState().resetUi();
        }),
      }),
      React.createElement(ActionBtn, {
        label: 'Dump State (console)',
        onClick: () => {
          // Intentional: dumps full state to browser console for debugging
          // eslint-disable-next-line no-console
          console.log('[DEV] Game State:', JSON.parse(JSON.stringify(gs)));
        },
      }),
      React.createElement(ActionBtn, {
        label: 'Auto-play Turn',
        onClick: () => { onClose(); autoPlayTurn(); },
      }),
      React.createElement(ActionBtn, {
        label: 'Auto-play 5 Turns',
        onClick: () => { onClose(); autoPlayMultiple(5); },
      }),
    ),
  );

  // ── NPCs ──
  elements.push(React.createElement(Section, { key: 'npcs', label: 'NPCs' }));
  for (const npc of gs.npcs) {
    elements.push(
      React.createElement('div', { key: `npc-${npc.name}`, className: 'dev-row' },
        React.createElement('span', { className: 'dev-label' }, npc.name),
        React.createElement('span', { className: 'dev-val' },
          `${npc.alive ? 'Alive' : 'Dead'} | Rel: ${npc.relationship}`,
        ),
      ),
    );
  }

  return React.createElement(React.Fragment, null, ...elements);
}
