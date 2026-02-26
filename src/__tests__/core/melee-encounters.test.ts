import { describe, it, expect, vi, afterEach } from 'vitest';
import { makeOpponent, makeAlly, createMeleeState } from '../../core/melee/encounters';
import {
  MeleeStance,
  MoraleThreshold,
  HealthState,
  FatigueTier,
  BattlePhase,
  DrillStep,
} from '../../types';
import type {
  OpponentTemplate,
  AllyTemplate,
  Player,
  BattleState,
} from '../../types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mockPlayer(overrides: Partial<Player> = {}): Player {
  return {
    name: 'Test Soldier',
    valor: 40,
    musketry: 35,
    elan: 35,
    strength: 40,
    endurance: 40,
    constitution: 45,
    charisma: 30,
    intelligence: 30,
    awareness: 35,
    morale: 80,
    maxMorale: 100,
    moraleThreshold: MoraleThreshold.Steady,
    health: 100,
    maxHealth: 120,
    healthState: HealthState.Unhurt,
    stamina: 200,
    maxStamina: 200,
    fatigue: 0,
    maxFatigue: 200,
    fatigueTier: FatigueTier.Fresh,
    musketLoaded: true,
    alive: true,
    routing: false,
    fumbledLoad: false,
    soldierRep: 0,
    officerRep: 50,
    napoleonRep: 0,
    frontRank: false,
    canteenUses: 3,
    ...overrides,
  };
}

function mockBattleState(overrides: Partial<BattleState> = {}): BattleState {
  const { ext: extOverrides, ...restOverrides } = overrides;
  return {
    phase: BattlePhase.Melee,
    turn: 1,
    drillStep: DrillStep.Endure,
    player: mockPlayer(),
    line: {
      leftNeighbour: null,
      rightNeighbour: null,
      officer: { name: 'Capitaine', rank: 'captain', alive: true, wounded: false, mounted: true, status: 'commanding' },
      lineIntegrity: 80,
      lineMorale: 'resolute',
      drumsPlaying: true,
      ncoPresent: true,
      casualtiesThisTurn: 0,
    },
    enemy: {
      range: 0,
      strength: 100,
      quality: 'line',
      morale: 'steady',
      lineIntegrity: 50,
      artillery: false,
      cavalryThreat: false,
    },
    log: [],
    availableActions: [],
    pendingMoraleChanges: [],
    battleOver: false,
    outcome: 'pending',
    crisisTurn: 0,
    volleysFired: 0,
    scriptedVolley: 0,
    chargeEncounter: 0,
    ext: {
      battlePart: 1,
      batteryCharged: false,
      meleeStage: 1,
      wagonDamage: 0,
      gorgeMercyCount: 0,
      gorgeTarget: '',
      ...extOverrides,
    },
    autoPlayActive: false,
    autoPlayVolleyCompleted: 0,
    graceEarned: false,
    ...restOverrides,
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

// ===========================================================================
// makeOpponent
// ===========================================================================
describe('makeOpponent', () => {
  const template: OpponentTemplate = {
    name: 'Austrian conscript',
    type: 'conscript',
    health: [70, 85],
    stamina: [160, 200],
    strength: 40,
    description: 'A test opponent.',
  };

  it('creates an opponent with health within template range', () => {
    for (let i = 0; i < 50; i++) {
      const opp = makeOpponent(template);
      expect(opp.health).toBeGreaterThanOrEqual(70);
      expect(opp.health).toBeLessThanOrEqual(85);
      expect(opp.maxHealth).toBe(opp.health);
    }
  });

  it('creates an opponent with stamina within template range', () => {
    for (let i = 0; i < 50; i++) {
      const opp = makeOpponent(template);
      expect(opp.stamina).toBeGreaterThanOrEqual(160);
      expect(opp.stamina).toBeLessThanOrEqual(200);
      expect(opp.maxStamina).toBe(opp.stamina);
    }
  });

  it('sets the correct type from template', () => {
    const opp = makeOpponent(template);
    expect(opp.type).toBe('conscript');
  });

  it('sets strength from template', () => {
    const opp = makeOpponent(template);
    expect(opp.strength).toBe(40);
  });

  it('sets description from template', () => {
    const opp = makeOpponent(template);
    expect(opp.description).toBe('A test opponent.');
  });

  it('initializes combat state fields correctly', () => {
    const opp = makeOpponent(template);
    expect(opp.fatigue).toBe(0);
    expect(opp.maxFatigue).toBe(opp.stamina);
    expect(opp.stunned).toBe(false);
    expect(opp.stunnedTurns).toBe(0);
    expect(opp.armInjured).toBe(false);
    expect(opp.legInjured).toBe(false);
  });

  it('produces a name containing the template name', () => {
    const opp = makeOpponent(template);
    expect(opp.name).toContain('Austrian conscript');
    // Name should contain a dash separator with personal name
    expect(opp.name).toContain(' — ');
  });

  it('uses usedNames set to avoid duplicates', () => {
    const usedNames = new Set<string>();
    const opp1 = makeOpponent(template, usedNames);
    expect(usedNames.has(opp1.name)).toBe(true);
  });
});

// ===========================================================================
// makeAlly
// ===========================================================================
describe('makeAlly', () => {
  const template: AllyTemplate = {
    id: 'test-ally',
    name: 'Pierre',
    type: 'named',
    npcId: 'pierre',
    health: [75, 90],
    stamina: [180, 220],
    strength: 50,
    elan: 45,
    personality: 'aggressive',
    description: 'A brave ally.',
  };

  it('creates an ally with correct id and name', () => {
    const ally = makeAlly(template);
    expect(ally.id).toBe('test-ally');
    expect(ally.name).toBe('Pierre');
  });

  it('creates an ally with health within template range', () => {
    for (let i = 0; i < 50; i++) {
      const ally = makeAlly(template);
      expect(ally.health).toBeGreaterThanOrEqual(75);
      expect(ally.health).toBeLessThanOrEqual(90);
      expect(ally.maxHealth).toBe(ally.health);
    }
  });

  it('creates an ally with stamina within template range', () => {
    for (let i = 0; i < 50; i++) {
      const ally = makeAlly(template);
      expect(ally.stamina).toBeGreaterThanOrEqual(180);
      expect(ally.stamina).toBeLessThanOrEqual(220);
      expect(ally.maxStamina).toBe(ally.stamina);
    }
  });

  it('sets correct fields from template', () => {
    const ally = makeAlly(template);
    expect(ally.type).toBe('named');
    expect(ally.npcId).toBe('pierre');
    expect(ally.strength).toBe(50);
    expect(ally.elan).toBe(45);
    expect(ally.personality).toBe('aggressive');
    expect(ally.description).toBe('A brave ally.');
  });

  it('initializes combat state correctly', () => {
    const ally = makeAlly(template);
    expect(ally.alive).toBe(true);
    expect(ally.fatigue).toBe(0);
    expect(ally.maxFatigue).toBe(ally.stamina);
    expect(ally.stunned).toBe(false);
    expect(ally.stunnedTurns).toBe(0);
    expect(ally.armInjured).toBe(false);
    expect(ally.legInjured).toBe(false);
  });
});

// ===========================================================================
// createMeleeState
// ===========================================================================
describe('createMeleeState', () => {
  it('produces a valid MeleeState for terrain context', () => {
    const state = mockBattleState();
    const ms = createMeleeState(state, 'terrain');
    expect(ms).toBeDefined();
    expect(ms.opponents.length).toBeGreaterThan(0);
    expect(ms.meleeContext).toBe('terrain');
  });

  it('produces correct opponent count for terrain (4 opponents)', () => {
    const state = mockBattleState();
    const ms = createMeleeState(state, 'terrain');
    expect(ms.opponents).toHaveLength(4);
  });

  it('produces correct opponent count for battery (4 opponents)', () => {
    const state = mockBattleState();
    const ms = createMeleeState(state, 'battery');
    expect(ms.opponents).toHaveLength(4);
  });

  it('initializes player snapshot correctly (stance, riposte, stun)', () => {
    const state = mockBattleState();
    const ms = createMeleeState(state, 'terrain');
    expect(ms.playerStance).toBe(MeleeStance.Balanced);
    expect(ms.playerRiposte).toBe(false);
    expect(ms.playerStunned).toBe(0);
  });

  it('initializes exchange and round counters to 0', () => {
    const state = mockBattleState();
    const ms = createMeleeState(state, 'terrain');
    expect(ms.exchangeCount).toBe(0);
    expect(ms.roundNumber).toBe(0);
    expect(ms.killCount).toBe(0);
  });

  it('sets maxExchanges from encounter config', () => {
    const state = mockBattleState();
    const terrain = createMeleeState(state, 'terrain');
    expect(terrain.maxExchanges).toBe(12);

    const battery = createMeleeState(state, 'battery');
    expect(battery.maxExchanges).toBe(10);
  });

  it('sets up active enemies and pool based on config', () => {
    const state = mockBattleState();
    const ms = createMeleeState(state, 'terrain');
    // terrain config: initialActiveEnemies = 1
    expect(ms.activeEnemies).toHaveLength(1);
    expect(ms.activeEnemies[0]).toBe(0);
    // remaining 3 in pool
    expect(ms.enemyPool).toHaveLength(3);
  });

  it('creates allies from encounter config', () => {
    const state = mockBattleState();
    // terrain and battery have no initial allies
    const ms = createMeleeState(state, 'terrain');
    expect(ms.allies).toHaveLength(0);
  });

  it('battery_skirmish encounter has wave events', () => {
    const state = mockBattleState();
    const ms = createMeleeState(state, 'battery', 'battery_skirmish');
    expect(ms.waveEvents.length).toBeGreaterThan(0);
    expect(ms.processedWaves).toHaveLength(0);
  });

  it('initializes roundLog as empty array', () => {
    const state = mockBattleState();
    const ms = createMeleeState(state, 'terrain');
    expect(ms.roundLog).toHaveLength(0);
  });

  it('initializes reloadProgress at 0', () => {
    const state = mockBattleState();
    const ms = createMeleeState(state, 'terrain');
    expect(ms.reloadProgress).toBe(0);
  });
});
