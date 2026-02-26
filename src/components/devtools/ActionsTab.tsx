import React from 'react';
import { useGameStore } from '../../stores/gameStore';
import { useUiStore } from '../../stores/uiStore';
import { GamePhase, BattlePhase, DrillStep } from '../../types';
import { createMeleeState } from '../../core/melee';
import {
  transitionToBattle,
  transitionToPreBattleCamp,
  createBattleFromCharacter,
  createNewGame,
} from '../../core/gameLoop';
import { getScriptedAvailableActions, VOLLEY_RANGES } from '../../core/volleys';
import { Section, Row, ActionBtn, useForceUpdate } from './helpers';

interface ActionsTabProps {
  onClose: () => void;
}

// ── shared jump helpers (duplicated from JumpTab to keep modules independent) ──

function ensureBattle() {
  const gs = useGameStore.getState().gameState!;
  if (gs.phase !== GamePhase.Battle || !gs.battleState) {
    gs.battleState = createBattleFromCharacter(gs.player, gs.npcs);
    gs.phase = GamePhase.Battle;
    gs.campState = undefined;
  }
  return gs.battleState!;
}

function commit(gs = useGameStore.getState().gameState!) {
  useGameStore.getState().setGameState({ ...gs });
}

function jumpToPreBattleCamp() {
  const gs = useGameStore.getState().gameState!;
  transitionToPreBattleCamp(gs);
  const camp = gs.campState!;
  camp.log.push({ day: 1, text: '[DEV] Jumped to Pre-Battle Camp', type: 'narrative' });
  commit(gs);
}

function jumpToVolley(volley: number, part: 1 | 2 | 3 = 1) {
  const gs = useGameStore.getState().gameState!;
  const bs = ensureBattle();
  bs.phase = BattlePhase.Line;
  bs.scriptedVolley = volley;
  bs.ext.battlePart = part;
  bs.drillStep = DrillStep.Present;
  bs.turn = (volley - 1) * 3 + 1;
  bs.battleOver = false;
  bs.outcome = 'pending';
  bs.enemy.range = VOLLEY_RANGES[volley - 1];
  bs.chargeEncounter = 0;

  if (part === 2) {
    bs.ext.batteryCharged = true;
    bs.ext.meleeStage = 2;
    bs.enemy.quality = 'line';
    bs.enemy.morale = 'advancing';
    bs.enemy.strength = 100;
    bs.enemy.lineIntegrity = 100;
    bs.enemy.artillery = true;
    bs.enemy.cavalryThreat = false;
  } else if (part === 3) {
    bs.ext.batteryCharged = true;
    bs.ext.meleeStage = 2;
    bs.ext.wagonDamage = 0;
    bs.ext.gorgeMercyCount = 0;
    bs.ext.gorgeTarget = '';
    bs.enemy = {
      range: 200,
      strength: 100,
      quality: 'column',
      morale: 'trapped',
      lineIntegrity: 100,
      artillery: false,
      cavalryThreat: false,
    };
  }

  bs.availableActions = getScriptedAvailableActions(bs);
  bs.log.push({
    turn: bs.turn,
    text: `[DEV] Jumped to Volley ${volley} (Part ${part})`,
    type: 'narrative',
  });
  commit(gs);
}

function jumpToCharge(encounter: number) {
  const gs = useGameStore.getState().gameState!;
  const bs = ensureBattle();
  bs.phase = BattlePhase.StoryBeat;
  bs.chargeEncounter = encounter;
  bs.scriptedVolley = 0;
  bs.battleOver = false;
  bs.outcome = 'pending';

  const encounterLabels: Record<number, string> = {
    1: 'Battery Choice',
    2: "Mass\u00e9na's Arrival",
    3: 'The Gorge',
    4: 'The Aftermath',
    5: 'Wounded Sergeant',
    6: 'Fix Bayonets',
  };

  if (encounter === 5) {
    bs.turn = 7;
    bs.ext.battlePart = 1;
    bs.enemy.range = 50;
    bs.enemy.morale = 'advancing';
    bs.line.ncoPresent = true;
  } else if (encounter === 6) {
    bs.turn = 13;
    bs.ext.battlePart = 1;
    bs.enemy.range = 25;
    bs.enemy.morale = 'charging';
  } else if (encounter === 1) {
    bs.turn = 13;
    bs.enemy.range = 0;
    bs.enemy.morale = 'charging';
    bs.ext.meleeStage = 1;
    bs.ext.battlePart = 1;
  } else if (encounter === 2) {
    bs.turn = 20;
    bs.enemy.range = 100;
    bs.enemy.morale = 'advancing';
    bs.ext.meleeStage = 2;
    bs.ext.battlePart = 1;
    bs.ext.batteryCharged = true;
  } else if (encounter === 3) {
    bs.turn = 30;
    bs.enemy.range = 40;
    bs.enemy.morale = 'wavering';
    bs.ext.meleeStage = 2;
    bs.ext.battlePart = 2;
    bs.ext.batteryCharged = true;
  } else if (encounter === 4) {
    bs.turn = 45;
    bs.ext.battlePart = 3;
    bs.enemy.range = 200;
    bs.enemy.strength = 5;
    bs.enemy.morale = 'trapped';
    bs.enemy.lineIntegrity = 0;
    bs.enemy.artillery = false;
    bs.enemy.cavalryThreat = false;
    bs.ext.meleeStage = 2;
    bs.ext.batteryCharged = true;
    bs.ext.wagonDamage = 50;
    bs.ext.gorgeMercyCount = 1;
  }

  bs.log.push({
    turn: bs.turn,
    text: `[DEV] Jumped to Story Beat (${encounterLabels[encounter] || encounter})`,
    type: 'narrative',
  });
  commit(gs);
}

function jumpToMelee() {
  const gs = useGameStore.getState().gameState!;
  const bs = ensureBattle();
  bs.phase = BattlePhase.Melee;
  bs.scriptedVolley = 0;
  bs.chargeEncounter = 0;
  bs.turn = 16;
  bs.battleOver = false;
  bs.outcome = 'pending';
  bs.enemy.range = 0;
  bs.meleeState = createMeleeState(bs, 'terrain', 'terrain');
  bs.log.push({ turn: bs.turn, text: '[DEV] Jumped to Melee', type: 'narrative' });
  commit(gs);
}

function jumpToCredits() {
  const gs = useGameStore.getState().gameState!;
  if (!gs.battleState) {
    gs.battleState = createBattleFromCharacter(gs.player, gs.npcs);
    gs.phase = GamePhase.Battle;
  }
  const bs = gs.battleState!;
  bs.battleOver = true;
  bs.outcome = 'gorge_victory';
  bs.ext.battlePart = 3;
  bs.ext.batteryCharged = true;
  bs.ext.wagonDamage = 50;
  bs.ext.gorgeMercyCount = 1;
  commit(gs);
}

function forceBattleEnd(outcome: string) {
  const gs = useGameStore.getState().gameState!;
  const bs = ensureBattle();
  bs.battleOver = true;
  bs.outcome = outcome as any;
  bs.log.push({
    turn: bs.turn,
    text: `[DEV] Forced outcome: ${outcome}`,
    type: 'narrative',
  });
  commit(gs);
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
