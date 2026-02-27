import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  isOpponentDefeated,
  backfillEnemies,
  processWaveEvents,
} from '../../core/melee/waveManager';
import {
  MeleeStance,
  MeleeActionId,
  MoraleThreshold,
} from '../../types';
import type {
  MeleeOpponent,
  MeleeState,
  MeleeAlly,
  WaveEvent,
  AllyTemplate,
  LogEntry,
  BattleState,
} from '../../types';
import { mockBattleState } from '../helpers/mockFactories';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mockOpponent(overrides: Partial<MeleeOpponent> = {}): MeleeOpponent {
  return {
    name: 'Austrian Line — Hans',
    type: 'line',
    health: 80,
    maxHealth: 80,
    stamina: 200,
    maxStamina: 200,
    fatigue: 0,
    maxFatigue: 200,
    strength: 40,
    stunned: false,
    stunnedTurns: 0,
    armInjured: false,
    legInjured: false,
    description: 'A line infantryman.',
    ...overrides,
  } as MeleeOpponent;
}

function mockMeleeState(overrides: Partial<MeleeState> = {}): MeleeState {
  return {
    opponents: [
      mockOpponent({ name: 'Austrian Line — Hans' }),
      mockOpponent({ name: 'Austrian Line — Fritz' }),
      mockOpponent({ name: 'Austrian Line — Karl' }),
    ],
    currentOpponent: 0,
    playerStance: MeleeStance.Balanced,
    playerRiposte: false,
    playerStunned: 0,
    exchangeCount: 0,
    selectingStance: false,
    selectingTarget: false,
    killCount: 0,
    valorTempBonus: 0,
    maxExchanges: 12,
    meleeContext: 'terrain',
    lastOppAttacked: false,
    playerGuarding: false,
    oppGuarding: false,
    allies: [],
    activeEnemies: [0],
    roundNumber: 1,
    playerTargetIndex: 0,
    roundLog: [],
    maxActiveEnemies: 2,
    enemyPool: [1, 2],
    processedWaves: [],
    waveEvents: [],
    reloadProgress: 0,
    ...overrides,
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

// ===========================================================================
// isOpponentDefeated
// ===========================================================================
describe('isOpponentDefeated', () => {
  it('returns true when opponent health is 0', () => {
    const opp = mockOpponent({ health: 0 });
    expect(isOpponentDefeated(opp)).toBe(true);
  });

  it('returns true when opponent health is negative', () => {
    const opp = mockOpponent({ health: -10 });
    expect(isOpponentDefeated(opp)).toBe(true);
  });

  it('returns false when opponent has positive health', () => {
    const opp = mockOpponent({ health: 1 });
    expect(isOpponentDefeated(opp)).toBe(false);
  });

  it('returns false when opponent is at full health', () => {
    const opp = mockOpponent({ health: 80 });
    expect(isOpponentDefeated(opp)).toBe(false);
  });
});

// ===========================================================================
// backfillEnemies
// ===========================================================================
describe('backfillEnemies', () => {
  it('moves opponents from pool to active up to maxActiveEnemies', () => {
    const ms = mockMeleeState({
      activeEnemies: [0],
      enemyPool: [1, 2],
      maxActiveEnemies: 2,
    });
    const log: LogEntry[] = [];

    backfillEnemies(ms, 5, log);

    // Should have pulled one from pool to fill up to max of 2
    expect(ms.activeEnemies).toEqual([0, 1]);
    expect(ms.enemyPool).toEqual([2]);
    expect(log).toHaveLength(1);
    expect(log[0].type).toBe('event');
    expect(log[0].turn).toBe(5);
  });

  it('fills multiple slots when several active enemies are dead', () => {
    const ms = mockMeleeState({
      opponents: [
        mockOpponent({ name: 'Opp A — Hans', health: 0 }),   // defeated
        mockOpponent({ name: 'Opp B — Fritz', health: 0 }),   // defeated
        mockOpponent({ name: 'Opp C — Karl', health: 80 }),   // in pool, alive
        mockOpponent({ name: 'Opp D — Ludwig', health: 80 }), // in pool, alive
      ],
      activeEnemies: [0, 1],   // both dead
      enemyPool: [2, 3],
      maxActiveEnemies: 2,
    });
    const log: LogEntry[] = [];

    backfillEnemies(ms, 3, log);

    // Both dead actives should be replaced
    expect(ms.activeEnemies).toEqual([0, 1, 2, 3]);
    expect(ms.enemyPool).toEqual([]);
    expect(log).toHaveLength(2);
  });

  it('does nothing when pool is empty', () => {
    const ms = mockMeleeState({
      activeEnemies: [0],
      enemyPool: [],
      maxActiveEnemies: 3,
    });
    const log: LogEntry[] = [];

    backfillEnemies(ms, 1, log);

    expect(ms.activeEnemies).toEqual([0]);
    expect(log).toHaveLength(0);
  });

  it('does nothing when active slots are already filled', () => {
    const ms = mockMeleeState({
      activeEnemies: [0, 1],
      enemyPool: [2],
      maxActiveEnemies: 2,
    });
    const log: LogEntry[] = [];

    backfillEnemies(ms, 1, log);

    expect(ms.activeEnemies).toEqual([0, 1]);
    expect(ms.enemyPool).toEqual([2]);
    expect(log).toHaveLength(0);
  });

  it('adds roundLog arrival entries for each backfilled opponent', () => {
    const ms = mockMeleeState({
      opponents: [
        mockOpponent({ name: 'Opp A — Hans', health: 0 }),
        mockOpponent({ name: 'Opp B — Fritz', health: 80 }),
      ],
      activeEnemies: [0],
      enemyPool: [1],
      maxActiveEnemies: 2,
      roundLog: [],
    });
    const log: LogEntry[] = [];

    backfillEnemies(ms, 4, log);

    expect(ms.roundLog).toHaveLength(1);
    expect(ms.roundLog[0].eventType).toBe('arrival');
    expect(ms.roundLog[0].actorSide).toBe('enemy');
    expect(ms.roundLog[0].actorName).toBe('Opp B — Fritz');
  });
});

// ===========================================================================
// processWaveEvents
// ===========================================================================
describe('processWaveEvents', () => {
  const allyTemplate: AllyTemplate = {
    id: 'pierre-ally',
    name: 'Pierre',
    type: 'named',
    npcId: 'pierre',
    health: [80, 80],
    stamina: [200, 200],
    strength: 45,
    elan: 40,
    personality: 'aggressive',
    description: 'Your comrade.',
  };

  it('triggers add_ally wave event when round condition is met', () => {
    const ms = mockMeleeState({
      roundNumber: 3,
      waveEvents: [
        {
          atRound: 2,
          action: 'add_ally',
          allyTemplate,
          narrative: 'Pierre rushes to your side!',
        },
      ],
      processedWaves: [],
      allies: [],
    });
    const battle = mockBattleState();

    const log = processWaveEvents(ms, battle.turn, battle.line, battle.roles);

    expect(ms.allies).toHaveLength(1);
    expect(ms.allies[0].name).toBe('Pierre');
    expect(ms.processedWaves).toContain(0);
    expect(log.some((e) => e.text.includes('Pierre rushes'))).toBe(true);
  });

  it('does not trigger wave event when round is before atRound', () => {
    const ms = mockMeleeState({
      roundNumber: 1,
      waveEvents: [
        {
          atRound: 5,
          action: 'add_ally',
          allyTemplate,
          narrative: 'Pierre arrives!',
        },
      ],
      processedWaves: [],
      allies: [],
    });
    const battle = mockBattleState();

    const log = processWaveEvents(ms, battle.turn, battle.line, battle.roles);

    expect(ms.allies).toHaveLength(0);
    expect(ms.processedWaves).not.toContain(0);
    // Log may still have backfill entries, but no ally arrival
    expect(log.every((e) => !e.text.includes('Pierre arrives'))).toBe(true);
  });

  it('skips already-processed wave events', () => {
    const ms = mockMeleeState({
      roundNumber: 5,
      waveEvents: [
        {
          atRound: 2,
          action: 'add_ally',
          allyTemplate,
          narrative: 'Pierre arrives!',
        },
      ],
      processedWaves: [0], // already processed
      allies: [],
    });
    const battle = mockBattleState();

    processWaveEvents(ms, battle.turn, battle.line, battle.roles);

    expect(ms.allies).toHaveLength(0);
  });

  it('triggers increase_max_enemies wave event', () => {
    const ms = mockMeleeState({
      roundNumber: 4,
      maxActiveEnemies: 2,
      waveEvents: [
        {
          atRound: 3,
          action: 'increase_max_enemies',
          newMaxEnemies: 4,
          narrative: 'More enemies pour through the gap!',
        },
      ],
      processedWaves: [],
    });
    const battle = mockBattleState();

    const log = processWaveEvents(ms, battle.turn, battle.line, battle.roles);

    expect(ms.maxActiveEnemies).toBe(4);
    expect(ms.processedWaves).toContain(0);
    expect(log.some((e) => e.text.includes('More enemies'))).toBe(true);
  });

  it('skips add_ally when conditionNpcAlive NPC is dead', () => {
    const ms = mockMeleeState({
      roundNumber: 3,
      waveEvents: [
        {
          atRound: 1,
          action: 'add_ally',
          allyTemplate,
          conditionNpcAlive: 'pierre',
          narrative: 'Pierre arrives!',
        },
      ],
      processedWaves: [],
      allies: [],
    });
    const battle = mockBattleState({
      line: {
        leftNeighbour: {
          id: 'pierre',
          name: 'Pierre',
          rank: 'private',
          valor: 30,
          morale: 0,
          maxMorale: 100,
          threshold: MoraleThreshold.Wavering,
          alive: false,
          wounded: true,
          routing: false,
          musketLoaded: false,
          relationship: 50,
        },
        rightNeighbour: null,
        officer: { name: 'Lt. Durand', rank: 'lieutenant', alive: true, wounded: false, mounted: false, status: 'commanding' },
        lineIntegrity: 50,
        lineMorale: 'shaky',
        drumsPlaying: false,
        ncoPresent: true,
        casualtiesThisTurn: 0,
      },
    });

    processWaveEvents(ms, battle.turn, battle.line, battle.roles);

    // Wave marked as processed but ally NOT added because NPC is dead
    expect(ms.processedWaves).toContain(0);
    expect(ms.allies).toHaveLength(0);
  });

  it('triggers add_ally when conditionNpcAlive NPC is alive', () => {
    const ms = mockMeleeState({
      roundNumber: 3,
      waveEvents: [
        {
          atRound: 1,
          action: 'add_ally',
          allyTemplate,
          conditionNpcAlive: 'pierre',
          narrative: 'Pierre arrives!',
        },
      ],
      processedWaves: [],
      allies: [],
    });
    const battle = mockBattleState({
      line: {
        leftNeighbour: {
          id: 'pierre',
          name: 'Pierre',
          rank: 'private',
          valor: 30,
          morale: 60,
          maxMorale: 100,
          threshold: MoraleThreshold.Wavering,
          alive: true,
          wounded: false,
          routing: false,
          musketLoaded: true,
          relationship: 50,
        },
        rightNeighbour: null,
        officer: { name: 'Lt. Durand', rank: 'lieutenant', alive: true, wounded: false, mounted: false, status: 'commanding' },
        lineIntegrity: 70,
        lineMorale: 'steady',
        drumsPlaying: true,
        ncoPresent: true,
        casualtiesThisTurn: 0,
      },
    });

    processWaveEvents(ms, battle.turn, battle.line, battle.roles);

    expect(ms.allies).toHaveLength(1);
    expect(ms.allies[0].name).toBe('Pierre');
  });

  it('carries over wound status to ally when left neighbour was wounded', () => {
    const ms = mockMeleeState({
      roundNumber: 3,
      waveEvents: [
        {
          atRound: 1,
          action: 'add_ally',
          allyTemplate,
          conditionNpcAlive: 'pierre',
          narrative: 'Pierre arrives wounded!',
        },
      ],
      processedWaves: [],
      allies: [],
    });
    const battle = mockBattleState({
      line: {
        leftNeighbour: {
          id: 'pierre',
          name: 'Pierre',
          rank: 'private',
          valor: 30,
          morale: 60,
          maxMorale: 100,
          threshold: MoraleThreshold.Wavering,
          alive: true,
          wounded: true,
          routing: false,
          musketLoaded: true,
          relationship: 50,
        },
        rightNeighbour: null,
        officer: { name: 'Lt. Durand', rank: 'lieutenant', alive: true, wounded: false, mounted: false, status: 'commanding' },
        lineIntegrity: 70,
        lineMorale: 'steady',
        drumsPlaying: true,
        ncoPresent: true,
        casualtiesThisTurn: 0,
      },
    });

    processWaveEvents(ms, battle.turn, battle.line, battle.roles);

    expect(ms.allies).toHaveLength(1);
    expect(ms.allies[0].armInjured).toBe(true);
  });

  it('calls backfillEnemies after processing wave events', () => {
    // Set up a state where increase_max_enemies opens a new slot
    // and there are opponents in the pool to fill it
    const ms = mockMeleeState({
      roundNumber: 2,
      maxActiveEnemies: 1,
      activeEnemies: [0],
      enemyPool: [1, 2],
      waveEvents: [
        {
          atRound: 2,
          action: 'increase_max_enemies',
          newMaxEnemies: 3,
          narrative: 'The enemy reinforces!',
        },
      ],
      processedWaves: [],
    });
    const battle = mockBattleState();

    const log = processWaveEvents(ms, battle.turn, battle.line, battle.roles);

    // Max increased to 3, so 2 should be pulled from pool
    expect(ms.maxActiveEnemies).toBe(3);
    expect(ms.activeEnemies).toEqual([0, 1, 2]);
    expect(ms.enemyPool).toEqual([]);
    // Log should include the wave narrative + 2 backfill entries
    expect(log.length).toBeGreaterThanOrEqual(3);
  });
});
