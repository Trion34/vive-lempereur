import React from 'react';
import { useGameStore } from '../../stores/gameStore';
import {
  GamePhase,
  BattleState,
  getMoraleThreshold,
  getHealthState,
  getFatigueTier,
} from '../../types';
import { setPlayerStat } from '../../core/stats';
import { Section, Row, NumberInput, Checkbox, ActionBtn, useForceUpdate } from './helpers';

function updatePlayerMeters(bs: BattleState) {
  bs.player.moraleThreshold = getMoraleThreshold(bs.player.morale, bs.player.maxMorale);
  bs.player.healthState = getHealthState(bs.player.health, bs.player.maxHealth);
  bs.player.fatigueTier = getFatigueTier(bs.player.fatigue, bs.player.maxFatigue);
}

function commit() {
  const gs = useGameStore.getState().gameState!;
  useGameStore.getState().setGameState({ ...gs });
}

export function PlayerTab() {
  const gs = useGameStore((s) => s.gameState);
  const [, bump] = useForceUpdate();

  if (!gs) return React.createElement('div', null, 'No game state');

  const bs = gs.phase === GamePhase.Battle && gs.battleState ? gs.battleState : null;

  const mutate = (fn: () => void) => {
    fn();
    commit();
    bump();
  };

  const elements: React.ReactElement[] = [];

  // ── In-Battle Meters ──
  if (bs) {
    const p = bs.player;
    elements.push(React.createElement(Section, { key: 'meters', label: 'In-Battle Meters' }));
    elements.push(
      React.createElement(Row, { key: 'morale', label: 'Morale' },
        React.createElement(NumberInput, {
          value: p.morale, min: 0, max: p.maxMorale,
          onChange: (v) => mutate(() => { p.morale = v; updatePlayerMeters(bs); }),
        }),
      ),
    );
    elements.push(
      React.createElement(Row, { key: 'health', label: 'Health' },
        React.createElement(NumberInput, {
          value: p.health, min: 0, max: p.maxHealth,
          onChange: (v) => mutate(() => { p.health = v; updatePlayerMeters(bs); }),
        }),
      ),
    );
    elements.push(
      React.createElement(Row, { key: 'stamina', label: 'Stamina' },
        React.createElement(NumberInput, {
          value: p.stamina, min: 0, max: p.maxStamina,
          onChange: (v) => mutate(() => { p.stamina = v; updatePlayerMeters(bs); }),
        }),
      ),
    );

    // ── Flags ──
    elements.push(React.createElement(Section, { key: 'flags', label: 'Flags' }));
    elements.push(
      React.createElement(Row, { key: 'musket', label: 'Musket Loaded' },
        React.createElement(Checkbox, {
          checked: p.musketLoaded,
          onChange: (v) => mutate(() => { p.musketLoaded = v; }),
        }),
      ),
    );
    elements.push(
      React.createElement(Row, { key: 'alive', label: 'Alive' },
        React.createElement(Checkbox, {
          checked: p.alive,
          onChange: (v) => mutate(() => { p.alive = v; }),
        }),
      ),
    );
    elements.push(
      React.createElement(Row, { key: 'routing', label: 'Routing' },
        React.createElement(Checkbox, {
          checked: p.routing,
          onChange: (v) => mutate(() => { p.routing = v; }),
        }),
      ),
    );
  }

  // ── Persistent Stats ──
  elements.push(React.createElement(Section, { key: 'pstats', label: 'Persistent Stats' }));
  const pc = gs.player;
  const stats = [
    'valor',
    'musketry',
    'elan',
    'strength',
    'endurance',
    'constitution',
    'charisma',
    'intelligence',
    'awareness',
  ] as const;

  for (const stat of stats) {
    elements.push(
      React.createElement(Row, { key: `stat-${stat}`, label: stat.charAt(0).toUpperCase() + stat.slice(1) },
        React.createElement(NumberInput, {
          value: pc[stat], min: 0, max: 100,
          onChange: (v) => mutate(() => {
            pc[stat] = v;
            if (bs) setPlayerStat(bs.player, stat, v);
          }),
        }),
      ),
    );
  }

  // ── Reputation ──
  elements.push(React.createElement(Section, { key: 'rep', label: 'Reputation' }));
  elements.push(
    React.createElement(Row, { key: 'solRep', label: 'Soldier Rep' },
      React.createElement(NumberInput, {
        value: pc.soldierRep, min: 0, max: 100,
        onChange: (v) => mutate(() => {
          pc.soldierRep = v;
          if (bs) bs.player.soldierRep = v;
        }),
      }),
    ),
  );
  elements.push(
    React.createElement(Row, { key: 'offRep', label: 'Officer Rep' },
      React.createElement(NumberInput, {
        value: pc.officerRep, min: 0, max: 100,
        onChange: (v) => mutate(() => {
          pc.officerRep = v;
          if (bs) bs.player.officerRep = v;
        }),
      }),
    ),
  );
  elements.push(
    React.createElement(Row, { key: 'napRep', label: 'Napoleon Rep' },
      React.createElement(NumberInput, {
        value: pc.napoleonRep, min: 0, max: 100,
        onChange: (v) => mutate(() => {
          pc.napoleonRep = v;
          if (bs) bs.player.napoleonRep = v;
        }),
      }),
    ),
  );

  // ── Cheats ──
  elements.push(React.createElement(Section, { key: 'cheats', label: 'Cheats' }));
  elements.push(
    React.createElement('div', { key: 'cheat-btns', className: 'dev-btn-group' },
      React.createElement(ActionBtn, {
        label: 'God Mode (Max All)', cls: 'success',
        onClick: () => mutate(() => {
          if (bs) {
            bs.player.morale = bs.player.maxMorale;
            bs.player.health = bs.player.maxHealth;
            bs.player.stamina = bs.player.maxStamina;
            updatePlayerMeters(bs);
          }
        }),
      }),
      React.createElement(ActionBtn, {
        label: 'Kill Player', cls: 'danger',
        onClick: () => mutate(() => {
          if (bs) {
            bs.player.health = 0;
            bs.player.alive = false;
            updatePlayerMeters(bs);
            bs.battleOver = true;
            bs.outcome = 'defeat';
          }
        }),
      }),
      React.createElement(ActionBtn, {
        label: 'Set Morale: Breaking', cls: 'danger',
        onClick: () => mutate(() => {
          if (bs) {
            bs.player.morale = 10;
            updatePlayerMeters(bs);
          }
        }),
      }),
      React.createElement(ActionBtn, {
        label: 'Restore Stamina', cls: 'success',
        onClick: () => mutate(() => {
          if (bs) {
            bs.player.stamina = bs.player.maxStamina;
            updatePlayerMeters(bs);
          }
        }),
      }),
    ),
  );

  return React.createElement(React.Fragment, null, ...elements);
}
