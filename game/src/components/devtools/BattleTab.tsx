import React from 'react';
import { useGameStore } from '../../stores/gameStore';
import { GamePhase, BattlePhase, WAGON_DAMAGE_CAP, WAGON_DETONATION_STRENGTH_PENALTY } from '../../types';
import {
  Section,
  Row,
  Badge,
  NumberInput,
  Checkbox,
  Select,
  ActionBtn,
  useForceUpdate,
} from './helpers';

function commit() {
  const gs = useGameStore.getState().gameState!;
  useGameStore.getState().setGameState({ ...gs });
}

export function BattleTab() {
  const gs = useGameStore((s) => s.gameState);
  const [, bump] = useForceUpdate();

  if (!gs) return React.createElement('div', null, 'No game state');

  const mutate = (fn: () => void) => {
    fn();
    commit();
    bump();
  };

  const bs = gs.phase === GamePhase.Battle && gs.battleState ? gs.battleState : null;

  if (!bs) {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(Section, { label: 'Not in Battle' }),
      React.createElement(Row, { label: 'Phase' }, React.createElement(Badge, { text: gs.phase })),
    );
  }

  const elements: React.ReactElement[] = [];

  // ── Enemy ──
  elements.push(React.createElement(Section, { key: 'enemy', label: 'Enemy' }));
  elements.push(
    React.createElement(Row, { key: 'eRange', label: 'Range' },
      React.createElement(NumberInput, {
        value: bs.enemy.range, min: 0, max: 300,
        onChange: (v) => mutate(() => { bs.enemy.range = v; }),
      }),
    ),
  );
  elements.push(
    React.createElement(Row, { key: 'eStr', label: 'Strength' },
      React.createElement(NumberInput, {
        value: bs.enemy.strength, min: 0, max: 100,
        onChange: (v) => mutate(() => { bs.enemy.strength = v; }),
      }),
    ),
  );
  elements.push(
    React.createElement(Row, { key: 'eLI', label: 'Line Integrity' },
      React.createElement(NumberInput, {
        value: bs.enemy.lineIntegrity, min: 0, max: 100,
        onChange: (v) => mutate(() => { bs.enemy.lineIntegrity = v; }),
      }),
    ),
  );
  elements.push(
    React.createElement(Row, { key: 'eArt', label: 'Artillery' },
      React.createElement(Checkbox, {
        checked: bs.enemy.artillery,
        onChange: (v) => mutate(() => { bs.enemy.artillery = v; }),
      }),
    ),
  );
  elements.push(
    React.createElement(Row, { key: 'eCav', label: 'Cavalry Threat' },
      React.createElement(Checkbox, {
        checked: bs.enemy.cavalryThreat,
        onChange: (v) => mutate(() => { bs.enemy.cavalryThreat = v; }),
      }),
    ),
  );
  elements.push(
    React.createElement(Row, { key: 'eMor', label: 'Morale' },
      React.createElement(Select, {
        value: bs.enemy.morale,
        options: ['advancing', 'steady', 'wavering', 'charging', 'resolute', 'trapped'],
        onChange: (v) => mutate(() => { bs.enemy.morale = v; }),
      }),
    ),
  );

  // ── Your Line ──
  elements.push(React.createElement(Section, { key: 'line', label: 'Your Line' }));
  elements.push(
    React.createElement(Row, { key: 'lInteg', label: 'Integrity' },
      React.createElement(NumberInput, {
        value: bs.line.lineIntegrity, min: 0, max: 100,
        onChange: (v) => mutate(() => { bs.line.lineIntegrity = v; }),
      }),
    ),
  );

  if (bs.line.leftNeighbour) {
    const ln = bs.line.leftNeighbour;
    elements.push(
      React.createElement(Row, { key: 'pAlive', label: 'Pierre Alive' },
        React.createElement(Checkbox, {
          checked: ln.alive,
          onChange: (v) => mutate(() => { ln.alive = v; }),
        }),
      ),
    );
    elements.push(
      React.createElement(Row, { key: 'pWound', label: 'Pierre Wounded' },
        React.createElement(Checkbox, {
          checked: ln.wounded,
          onChange: (v) => mutate(() => { ln.wounded = v; }),
        }),
      ),
    );
  }

  if (bs.line.rightNeighbour) {
    const rn = bs.line.rightNeighbour;
    elements.push(
      React.createElement(Row, { key: 'jbAlive', label: 'JB Alive' },
        React.createElement(Checkbox, {
          checked: rn.alive,
          onChange: (v) => mutate(() => { rn.alive = v; }),
        }),
      ),
    );
    elements.push(
      React.createElement(Row, { key: 'jbWound', label: 'JB Wounded' },
        React.createElement(Checkbox, {
          checked: rn.wounded,
          onChange: (v) => mutate(() => { rn.wounded = v; }),
        }),
      ),
    );
  }

  elements.push(
    React.createElement(Row, { key: 'offAlive', label: 'Officer Alive' },
      React.createElement(Checkbox, {
        checked: bs.line.officer.alive,
        onChange: (v) => mutate(() => { bs.line.officer.alive = v; }),
      }),
    ),
  );

  // ── Gorge State (Part 3) ──
  if (bs.ext.battlePart === 3) {
    elements.push(React.createElement(Section, { key: 'gorge', label: 'Gorge State' }));
    elements.push(
      React.createElement(Row, { key: 'wDmg', label: 'Wagon Damage' },
        React.createElement(NumberInput, {
          value: bs.ext.wagonDamage, min: 0, max: WAGON_DAMAGE_CAP,
          onChange: (v) => mutate(() => { bs.ext.wagonDamage = v; }),
        }),
      ),
    );
    elements.push(
      React.createElement(Row, { key: 'mercy', label: 'Mercy Count' },
        React.createElement(NumberInput, {
          value: bs.ext.gorgeMercyCount, min: 0, max: 11,
          onChange: (v) => mutate(() => { bs.ext.gorgeMercyCount = v; }),
        }),
      ),
    );
    elements.push(
      React.createElement('div', { key: 'gorge-btns', className: 'dev-btn-group' },
        React.createElement(ActionBtn, {
          label: 'Set Wagon 90%',
          onClick: () => mutate(() => { bs.ext.wagonDamage = 90; }),
        }),
        React.createElement(ActionBtn, {
          label: 'Detonate Wagon', cls: 'danger',
          onClick: () => mutate(() => {
            bs.ext.wagonDamage = WAGON_DAMAGE_CAP;
            bs.enemy.strength = Math.max(0, bs.enemy.strength - WAGON_DETONATION_STRENGTH_PENALTY);
          }),
        }),
      ),
    );
  }

  // ── Melee State ──
  if (bs.phase === BattlePhase.Melee && bs.meleeState) {
    const ms = bs.meleeState;
    elements.push(React.createElement(Section, { key: 'melee', label: 'Melee' }));
    elements.push(
      React.createElement(Row, { key: 'mExch', label: 'Exchange' },
        React.createElement(NumberInput, {
          value: ms.exchangeCount, min: 0, max: ms.maxExchanges,
          onChange: (v) => mutate(() => { ms.exchangeCount = v; }),
        }),
      ),
    );
    elements.push(
      React.createElement(Row, { key: 'mMax', label: 'Max Exchanges' },
        React.createElement(NumberInput, {
          value: ms.maxExchanges, min: 1, max: 30,
          onChange: (v) => mutate(() => { ms.maxExchanges = v; }),
        }),
      ),
    );
    elements.push(
      React.createElement(Row, { key: 'mKill', label: 'Kill Count' },
        React.createElement(NumberInput, {
          value: ms.killCount, min: 0, max: 10,
          onChange: (v) => mutate(() => { ms.killCount = v; }),
        }),
      ),
    );
    elements.push(
      React.createElement(Row, { key: 'mOpp', label: 'Current Opp' },
        React.createElement(NumberInput, {
          value: ms.currentOpponent, min: 0, max: ms.opponents.length - 1,
          onChange: (v) => mutate(() => { ms.currentOpponent = v; }),
        }),
      ),
    );

    const opp = ms.opponents[ms.currentOpponent];
    if (opp) {
      elements.push(React.createElement(Section, { key: 'oppSec', label: `Opponent: ${opp.name}` }));
      elements.push(
        React.createElement(Row, { key: 'oHp', label: 'Health' },
          React.createElement(NumberInput, {
            value: opp.health, min: 0, max: opp.maxHealth,
            onChange: (v) => mutate(() => { opp.health = v; }),
          }),
        ),
      );
      elements.push(
        React.createElement(Row, { key: 'oStam', label: 'Stamina' },
          React.createElement(NumberInput, {
            value: opp.stamina, min: 0, max: opp.maxStamina,
            onChange: (v) => mutate(() => { opp.stamina = v; }),
          }),
        ),
      );
      elements.push(
        React.createElement(Row, { key: 'oStun', label: 'Stunned' },
          React.createElement(Checkbox, {
            checked: opp.stunned,
            onChange: (v) => mutate(() => { opp.stunned = v; }),
          }),
        ),
      );
      elements.push(
        React.createElement(Row, { key: 'oArm', label: 'Arm Injured' },
          React.createElement(Checkbox, {
            checked: opp.armInjured,
            onChange: (v) => mutate(() => { opp.armInjured = v; }),
          }),
        ),
      );
      elements.push(
        React.createElement(Row, { key: 'oLeg', label: 'Leg Injured' },
          React.createElement(Checkbox, {
            checked: opp.legInjured,
            onChange: (v) => mutate(() => { opp.legInjured = v; }),
          }),
        ),
      );
      elements.push(
        React.createElement('div', { key: 'opp-btns', className: 'dev-btn-group' },
          React.createElement(ActionBtn, {
            label: 'Kill Opponent', cls: 'danger',
            onClick: () => mutate(() => { opp.health = 0; }),
          }),
          React.createElement(ActionBtn, {
            label: 'Full Heal Opp', cls: 'success',
            onClick: () => mutate(() => {
              opp.health = opp.maxHealth;
              opp.stamina = opp.maxStamina;
              opp.stunned = false;
              opp.armInjured = false;
              opp.legInjured = false;
            }),
          }),
        ),
      );
    }
  }

  // ── Camp State ──
  if (gs.phase === GamePhase.Camp && gs.campState) {
    const camp = gs.campState;
    const p = gs.player;
    elements.push(React.createElement(Section, { key: 'camp', label: `Camp State (${camp.campId})` }));
    elements.push(
      React.createElement(Row, { key: 'cCtx', label: 'Camp ID' },
        React.createElement(Badge, { text: camp.campId }),
      ),
    );
    elements.push(
      React.createElement(Row, { key: 'cAct', label: 'Actions Left' },
        React.createElement(NumberInput, {
          value: camp.actionsRemaining, min: 0, max: camp.actionsTotal,
          onChange: (v) => mutate(() => { camp.actionsRemaining = v; }),
        }),
      ),
    );
    elements.push(
      React.createElement(Row, { key: 'cHp', label: 'Player Health' },
        React.createElement(NumberInput, {
          value: p.health, min: 0, max: 100,
          onChange: (v) => mutate(() => { p.health = v; }),
        }),
      ),
    );
    elements.push(
      React.createElement(Row, { key: 'cStam', label: 'Player Stamina' },
        React.createElement(NumberInput, {
          value: p.stamina, min: 0, max: 100,
          onChange: (v) => mutate(() => { p.stamina = v; }),
        }),
      ),
    );
    elements.push(
      React.createElement(Row, { key: 'cMor', label: 'Player Morale' },
        React.createElement(NumberInput, {
          value: p.morale, min: 0, max: 100,
          onChange: (v) => mutate(() => { p.morale = v; }),
        }),
      ),
    );
  }

  return React.createElement(React.Fragment, null, ...elements);
}
