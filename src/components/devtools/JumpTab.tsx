import React from 'react';
import { useGameStore } from '../../stores/gameStore';
import { useUiStore } from '../../stores/uiStore';
import {
  GamePhase,
  BattlePhase,
  CampaignPhase,
  MeleeContext,
  type BattleState,
} from '../../types';
import { getBattleConfig } from '../../data/battles/registry';
import { Section, Row, Badge, ActionBtn, useForceUpdate } from './helpers';
import {
  ensureBattle,
  commit,
  jumpToPreBattleCamp,
  jumpToVolley,
  jumpToCharge,
  jumpToMelee,
  jumpToCredits,
  forceBattleEnd,
} from './shared';

interface JumpTabProps {
  onClose: () => void;
}

// ── jump functions unique to JumpTab ────────────────────────────

function jumpToPrologue() {
  const gs = useGameStore.getState().gameState!;
  // Jump to the prologue interlude (sequence index 0)
  gs.campaign = { ...gs.campaign, sequenceIndex: 0, phase: CampaignPhase.Interlude };
  gs.campState = undefined;
  gs.battleState = undefined;
  gs.phase = GamePhase.Camp; // Placeholder; AppRoot routes via campaign.phase
  commit(gs);
  useUiStore.getState().resetUi();
  useUiStore.setState({ campIntroSeen: false });
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
    let maxV = 4;
    try { maxV = getBattleConfig(bs.configId).labels.volleyMaxes[bs.ext.battlePart] ?? 4; } catch { /* fallback */ }
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
  const outcomes: { id: BattleState['outcome']; label: string; cls: string }[] = [
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
      React.createElement(ActionBtn, { label: 'Terrain Melee', onClick: wrap(() => jumpToMelee(MeleeContext.Terrain)) }),
      React.createElement(ActionBtn, { label: 'Battery', onClick: wrap(() => jumpToCharge(1)) }),
      React.createElement(ActionBtn, { label: 'Battery Melee', onClick: wrap(() => jumpToMelee(MeleeContext.Battery)) }),
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
