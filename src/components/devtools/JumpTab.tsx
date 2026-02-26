import React from 'react';
import { useGameStore } from '../../stores/gameStore';
import { useUiStore } from '../../stores/uiStore';
import {
  GamePhase,
  BattlePhase,
  DrillStep,
} from '../../types';
import { createMeleeState } from '../../core/melee';
import {
  transitionToCamp,
  createBattleFromCharacter,
} from '../../core/gameLoop';
import { getScriptedAvailableActions, VOLLEY_RANGES } from '../../core/volleys';
import { Section, Row, Badge, ActionBtn, useForceUpdate } from './helpers';

interface JumpTabProps {
  onClose: () => void;
}

// ── helpers ────────────────────────────────────────────────────

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

// ── jump functions ─────────────────────────────────────────────

function jumpToPrologue() {
  const gs = useGameStore.getState().gameState!;
  // Jump to the prologue interlude (sequence index 0)
  gs.campaign = { ...gs.campaign, sequenceIndex: 0, phase: 'interlude' as any };
  gs.campState = undefined;
  gs.battleState = undefined;
  gs.phase = GamePhase.Camp; // Placeholder; AppRoot routes via campaign.phase
  commit(gs);
  useUiStore.getState().resetUi();
  useUiStore.setState({ campIntroSeen: false });
}

function jumpToPreBattleCamp() {
  const gs = useGameStore.getState().gameState!;
  // Jump to the eve-of-rivoli camp node (sequence index 1 in Italy campaign)
  gs.campaign = { ...gs.campaign, sequenceIndex: 1 };
  transitionToCamp(gs);
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

function jumpToOpeningBeat() {
  const gs = useGameStore.getState().gameState!;
  const bs = ensureBattle();
  bs.phase = BattlePhase.Line;
  bs.ext.battlePart = 1;
  bs.scriptedVolley = 1;
  bs.turn = 1;
  bs.battleOver = false;
  bs.outcome = 'pending';
  bs.log.push({ turn: bs.turn, text: '[DEV] Jumped to Opening Beat', type: 'narrative' });
  commit(gs);
  useUiStore.setState({ showOpeningBeat: true, lastRenderedTurn: -1, phaseLogStart: 0 });
}

function jumpToMelee(context: 'terrain' | 'battery' = 'terrain') {
  const gs = useGameStore.getState().gameState!;
  const bs = ensureBattle();
  bs.phase = BattlePhase.Melee;
  bs.scriptedVolley = 0;
  bs.chargeEncounter = 0;
  bs.turn = 16;
  bs.battleOver = false;
  bs.outcome = 'pending';
  bs.enemy.range = 0;
  if (context === 'battery') {
    bs.ext.batteryCharged = true;
    bs.ext.meleeStage = 1;
    bs.ext.battlePart = 1;
  }
  bs.meleeState = createMeleeState(bs, context, context);
  bs.log.push({ turn: bs.turn, text: `[DEV] Jumped to Melee (${context})`, type: 'narrative' });
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

// ── component ──────────────────────────────────────────────────

export function JumpTab({ onClose }: JumpTabProps) {
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

  // --- current state ---
  const stateRows: React.ReactElement[] = [];
  stateRows.push(React.createElement(Row, { key: 'gp', label: 'Game Phase' }, React.createElement(Badge, { text: gs.phase })));

  if (gs.phase === GamePhase.Battle && gs.battleState) {
    const bs = gs.battleState;
    stateRows.push(React.createElement(Row, { key: 'bp', label: 'Battle Phase' }, React.createElement(Badge, { text: bs.phase })));
    const maxV = bs.ext.battlePart === 3 ? 11 : bs.ext.battlePart === 2 ? 7 : 4;
    if (bs.phase === BattlePhase.Line)
      stateRows.push(React.createElement(Row, { key: 'vol', label: 'Volley' }, React.createElement(Badge, { text: `${bs.scriptedVolley} / ${maxV}` })));
    stateRows.push(React.createElement(Row, { key: 'bpart', label: 'Battle Part' }, React.createElement(Badge, { text: String(bs.ext.battlePart) })));
    if (bs.phase === BattlePhase.StoryBeat)
      stateRows.push(React.createElement(Row, { key: 'sb', label: 'Story Beat' }, React.createElement(Badge, { text: 'Battery Choice' })));
    if (bs.phase === BattlePhase.Melee && bs.meleeState)
      stateRows.push(React.createElement(Row, { key: 'ex', label: 'Exchange' }, React.createElement(Badge, { text: `${bs.meleeState.exchangeCount} / ${bs.meleeState.maxExchanges}` })));
    stateRows.push(React.createElement(Row, { key: 'turn', label: 'Turn' }, React.createElement(Badge, { text: String(bs.turn) })));
    stateRows.push(React.createElement(Row, { key: 'out', label: 'Outcome' }, React.createElement(Badge, { text: bs.outcome })));
  }

  if (gs.phase === GamePhase.Camp && gs.campState) {
    const camp = gs.campState;
    stateRows.push(React.createElement(Row, { key: 'ctx', label: 'Camp ID' }, React.createElement(Badge, { text: camp.campId })));
    stateRows.push(React.createElement(Row, { key: 'loc', label: 'Location' }, React.createElement(Badge, { text: camp.conditions.location })));
    stateRows.push(React.createElement(Row, { key: 'act', label: 'Actions' }, React.createElement(Badge, { text: `${camp.actionsRemaining} / ${camp.actionsTotal}` })));
    stateRows.push(React.createElement(Row, { key: 'stam', label: 'Stamina' }, React.createElement(Badge, { text: String(gs.player.stamina) })));
    stateRows.push(React.createElement(Row, { key: 'mor', label: 'Morale' }, React.createElement(Badge, { text: String(gs.player.morale) })));
    stateRows.push(React.createElement(Row, { key: 'pev', label: 'Pending Event' }, React.createElement(Badge, { text: camp.pendingEvent ? 'YES' : 'No' })));
  }

  // --- outcomes ---
  const outcomes: { id: string; label: string; cls: string }[] = [
    { id: 'victory', label: 'Victory', cls: 'success' },
    { id: 'gorge_victory', label: 'Gorge Victory', cls: 'success' },
    { id: 'cavalry_victory', label: 'Cavalry Victory', cls: 'success' },
    { id: 'part1_complete', label: 'Part 1 Complete', cls: '' },
    { id: 'part2_gorge_setup', label: 'To the Ridge', cls: '' },
    { id: 'survived', label: 'Survived', cls: '' },
    { id: 'rout', label: 'Rout', cls: 'danger' },
    { id: 'defeat', label: 'Defeat', cls: 'danger' },
  ];

  return React.createElement(
    React.Fragment,
    null,
    // Current State
    React.createElement(Section, { label: 'Current State' }),
    ...stateRows,

    // Prologue
    React.createElement(Section, { label: 'Prologue' }),
    React.createElement(
      'div',
      { className: 'dev-btn-group' },
      React.createElement(ActionBtn, { label: 'Prologue', onClick: wrap(() => jumpToPrologue()) }),
    ),

    // Pre-Battle Camp
    React.createElement(Section, { label: 'Pre-Battle Camp (Eve of Rivoli)' }),
    React.createElement(
      'div',
      { className: 'dev-btn-group' },
      React.createElement(ActionBtn, { label: 'Eve of Battle', onClick: wrap(() => jumpToPreBattleCamp()) }),
      React.createElement(ActionBtn, {
        label: 'Eve \u2014 Complete',
        onClick: wrap(() => {
          jumpToPreBattleCamp();
          const gs2 = useGameStore.getState().gameState!;
          if (gs2.campState) {
            gs2.campState.actionsRemaining = 0;
            gs2.campState.pendingEvent = undefined;
          }
          commit(gs2);
        }),
      }),
    ),

    // Part 1
    React.createElement(Section, { label: 'Part 1: The Line' }),
    React.createElement(
      'div',
      { className: 'dev-btn-group' },
      React.createElement(ActionBtn, { label: 'Opening Beat', onClick: wrap(() => jumpToOpeningBeat()) }),
      React.createElement(ActionBtn, { label: 'Line Start', onClick: wrap(() => jumpToVolley(1, 1)) }),
      React.createElement(ActionBtn, { label: 'Wounded Sgt', onClick: wrap(() => jumpToCharge(5)) }),
      React.createElement(ActionBtn, { label: 'Fix Bayonets', onClick: wrap(() => jumpToCharge(6)) }),
      React.createElement(ActionBtn, { label: 'Terrain Melee', onClick: wrap(() => jumpToMelee('terrain')) }),
      React.createElement(ActionBtn, { label: 'Battery', onClick: wrap(() => jumpToCharge(1)) }),
      React.createElement(ActionBtn, { label: 'Battery Melee', onClick: wrap(() => jumpToMelee('battery')) }),
      React.createElement(ActionBtn, { label: 'Mass\u00e9na', onClick: wrap(() => jumpToCharge(2)) }),
    ),

    // Part 2
    React.createElement(Section, { label: 'Part 2: Hold the Line' }),
    React.createElement(
      'div',
      { className: 'dev-btn-group' },
      React.createElement(ActionBtn, { label: 'Line Start', onClick: wrap(() => jumpToVolley(5, 2)) }),
      React.createElement(ActionBtn, { label: 'Gorge Beat', onClick: wrap(() => jumpToCharge(3)) }),
    ),

    // Part 3
    React.createElement(Section, { label: 'Part 3: The Gorge' }),
    React.createElement(
      'div',
      { className: 'dev-btn-group' },
      React.createElement(ActionBtn, { label: 'Line Start', onClick: wrap(() => jumpToVolley(8, 3)) }),
      React.createElement(ActionBtn, { label: 'Aftermath', onClick: wrap(() => jumpToCharge(4)) }),
    ),

    // Post-Battle
    React.createElement(Section, { label: 'Post-Battle' }),
    React.createElement(
      'div',
      { className: 'dev-btn-group' },
      React.createElement(ActionBtn, { label: 'Credits', onClick: wrap(() => jumpToCredits()) }),
    ),

    // Force Battle Outcome
    React.createElement(Section, { label: 'Force Battle Outcome' }),
    React.createElement(
      'div',
      { className: 'dev-btn-group' },
      ...outcomes.map((o) =>
        React.createElement(ActionBtn, {
          key: o.id,
          label: o.label,
          cls: o.cls,
          onClick: wrapNoClose(() => forceBattleEnd(o.id)),
        }),
      ),
    ),
  );
}
