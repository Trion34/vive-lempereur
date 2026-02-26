import { describe, it, expect, vi, afterEach } from 'vitest';
import { snapshotOf, getMeleeActions } from '../../core/melee/effects';
import type { Snapshotable } from '../../core/melee/effects';
import {
  MeleeStance,
  MeleeActionId,
  MoraleThreshold,
  HealthState,
  FatigueTier,
  BattlePhase,
  DrillStep,
} from '../../types';
import type { Player, BattleState, MeleeState, MeleeOpponent } from '../../types';

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

function mockOpponent(): MeleeOpponent {
  return {
    name: 'Austrian conscript — Hans Vogl',
    type: 'conscript',
    health: 80,
    maxHealth: 80,
    stamina: 180,
    maxStamina: 180,
    fatigue: 0,
    maxFatigue: 180,
    strength: 40,
    stunned: false,
    stunnedTurns: 0,
    armInjured: false,
    legInjured: false,
    description: 'A test opponent.',
  };
}

function mockMeleeState(): MeleeState {
  const opp = mockOpponent();
  return {
    opponents: [opp],
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
    roundNumber: 0,
    playerTargetIndex: 0,
    roundLog: [],
    maxActiveEnemies: 1,
    enemyPool: [],
    processedWaves: [],
    waveEvents: [],
    reloadProgress: 0,
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
    meleeState: mockMeleeState(),
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
    roles: { leftNeighbour: 'pierre', rightNeighbour: 'jb', officer: 'leclerc', nco: 'duval' },
    ...restOverrides,
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

// ===========================================================================
// snapshotOf
// ===========================================================================
describe('snapshotOf', () => {
  it('returns all expected fields for a combatant without morale', () => {
    const input: Snapshotable = {
      health: 80,
      maxHealth: 100,
      stamina: 150,
      maxStamina: 200,
      fatigue: 30,
      maxFatigue: 200,
    };
    const snap = snapshotOf(input);
    expect(snap.health).toBe(80);
    expect(snap.maxHealth).toBe(100);
    expect(snap.stamina).toBe(150);
    expect(snap.maxStamina).toBe(200);
    expect(snap.fatigue).toBe(30);
    expect(snap.maxFatigue).toBe(200);
    expect(snap.morale).toBeUndefined();
    expect(snap.maxMorale).toBeUndefined();
  });

  it('includes morale fields when present on input', () => {
    const input: Snapshotable = {
      health: 80,
      maxHealth: 100,
      stamina: 150,
      maxStamina: 200,
      fatigue: 30,
      maxFatigue: 200,
      morale: 75,
      maxMorale: 100,
    };
    const snap = snapshotOf(input);
    expect(snap.morale).toBe(75);
    expect(snap.maxMorale).toBe(100);
  });

  it('returns a new object (not a reference to the input)', () => {
    const input: Snapshotable = {
      health: 80,
      maxHealth: 100,
      stamina: 150,
      maxStamina: 200,
      fatigue: 30,
      maxFatigue: 200,
    };
    const snap = snapshotOf(input);
    // Mutating the snapshot should not affect the input
    snap.health = 0;
    expect(input.health).toBe(80);
  });
});

// ===========================================================================
// getMeleeActions
// ===========================================================================
describe('getMeleeActions', () => {
  it('returns available actions for a Steady player with loaded musket', () => {
    const state = mockBattleState();
    const actions = getMeleeActions(state);
    const ids = actions.map((a) => a.id);
    // Steady player with loaded musket: Shoot should be present
    expect(ids).toContain(MeleeActionId.Shoot);
    expect(ids).toContain(MeleeActionId.BayonetThrust);
    expect(ids).toContain(MeleeActionId.AggressiveLunge);
    expect(ids).toContain(MeleeActionId.ButtStrike);
    expect(ids).toContain(MeleeActionId.Feint);
    expect(ids).toContain(MeleeActionId.Guard);
    expect(ids).toContain(MeleeActionId.Respite);
  });

  it('does not include Reload when musket is loaded', () => {
    const state = mockBattleState();
    state.player.musketLoaded = true;
    const actions = getMeleeActions(state);
    const ids = actions.map((a) => a.id);
    expect(ids).not.toContain(MeleeActionId.Reload);
  });

  it('includes Reload and excludes Shoot when musket is unloaded', () => {
    const state = mockBattleState();
    state.player.musketLoaded = false;
    const actions = getMeleeActions(state);
    const ids = actions.map((a) => a.id);
    expect(ids).toContain(MeleeActionId.Reload);
    expect(ids).not.toContain(MeleeActionId.Shoot);
  });

  it('marks stamina-costly actions unavailable when stamina is low', () => {
    const state = mockBattleState();
    state.player.stamina = 15; // Only enough for Feint (14), Guard (always), Respite (always)
    const actions = getMeleeActions(state);
    const thrust = actions.find((a) => a.id === MeleeActionId.BayonetThrust);
    const lunge = actions.find((a) => a.id === MeleeActionId.AggressiveLunge);
    const butt = actions.find((a) => a.id === MeleeActionId.ButtStrike);
    expect(thrust!.available).toBe(false); // needs 20
    expect(lunge!.available).toBe(false); // needs 38
    expect(butt!.available).toBe(false); // needs 26
  });

  it('at 0 stamina only Respite is returned', () => {
    const state = mockBattleState();
    state.player.stamina = 0;
    const actions = getMeleeActions(state);
    expect(actions).toHaveLength(1);
    expect(actions[0].id).toBe(MeleeActionId.Respite);
  });

  describe('morale gating', () => {
    it('Shaken: AggressiveLunge is unavailable', () => {
      const state = mockBattleState();
      state.player.moraleThreshold = MoraleThreshold.Shaken;
      const actions = getMeleeActions(state);
      const lunge = actions.find((a) => a.id === MeleeActionId.AggressiveLunge);
      expect(lunge!.available).toBe(false);
    });

    it('Shaken: BayonetThrust is still available', () => {
      const state = mockBattleState();
      state.player.moraleThreshold = MoraleThreshold.Shaken;
      const actions = getMeleeActions(state);
      const thrust = actions.find((a) => a.id === MeleeActionId.BayonetThrust);
      expect(thrust!.available).toBe(true);
    });

    it('Wavering: only Thrust, Guard, Respite, SecondWind, Shoot, Reload available', () => {
      const state = mockBattleState();
      state.player.moraleThreshold = MoraleThreshold.Wavering;
      state.player.fatigue = 50; // enable SecondWind
      const actions = getMeleeActions(state);
      const available = actions.filter((a) => a.available).map((a) => a.id);
      // ButtStrike and Feint and AggressiveLunge should all be unavailable
      expect(available).not.toContain(MeleeActionId.AggressiveLunge);
      expect(available).not.toContain(MeleeActionId.ButtStrike);
      expect(available).not.toContain(MeleeActionId.Feint);
      // These should remain available
      expect(available).toContain(MeleeActionId.BayonetThrust);
      expect(available).toContain(MeleeActionId.Guard);
      expect(available).toContain(MeleeActionId.Respite);
    });

    it('Breaking: only Guard, Respite, SecondWind, Reload available', () => {
      const state = mockBattleState();
      state.player.moraleThreshold = MoraleThreshold.Breaking;
      state.player.fatigue = 50; // enable SecondWind
      const actions = getMeleeActions(state);
      const available = actions.filter((a) => a.available).map((a) => a.id);
      // All attacks should be unavailable
      expect(available).not.toContain(MeleeActionId.BayonetThrust);
      expect(available).not.toContain(MeleeActionId.AggressiveLunge);
      expect(available).not.toContain(MeleeActionId.ButtStrike);
      expect(available).not.toContain(MeleeActionId.Feint);
      expect(available).not.toContain(MeleeActionId.Shoot);
      // Guard and Respite always available
      expect(available).toContain(MeleeActionId.Guard);
      expect(available).toContain(MeleeActionId.Respite);
      expect(available).toContain(MeleeActionId.SecondWind);
    });

    it('Breaking with unloaded musket: Reload is available', () => {
      const state = mockBattleState();
      state.player.moraleThreshold = MoraleThreshold.Breaking;
      state.player.musketLoaded = false;
      const actions = getMeleeActions(state);
      const reload = actions.find((a) => a.id === MeleeActionId.Reload);
      expect(reload).toBeDefined();
      expect(reload!.available).toBe(true);
    });
  });

  it('SecondWind is unavailable when fatigue is 0', () => {
    const state = mockBattleState();
    state.player.fatigue = 0;
    const actions = getMeleeActions(state);
    const sw = actions.find((a) => a.id === MeleeActionId.SecondWind);
    expect(sw).toBeDefined();
    expect(sw!.available).toBe(false);
  });

  it('SecondWind is available when fatigue > 0', () => {
    const state = mockBattleState();
    state.player.fatigue = 50;
    const actions = getMeleeActions(state);
    const sw = actions.find((a) => a.id === MeleeActionId.SecondWind);
    expect(sw).toBeDefined();
    expect(sw!.available).toBe(true);
  });

  it('every action has an id, label, description, available flag, and staminaCost', () => {
    const state = mockBattleState();
    const actions = getMeleeActions(state);
    for (const a of actions) {
      expect(typeof a.id).toBe('string');
      expect(typeof a.label).toBe('string');
      expect(a.label.length).toBeGreaterThan(0);
      expect(typeof a.description).toBe('string');
      expect(a.description.length).toBeGreaterThan(0);
      expect(typeof a.available).toBe('boolean');
      expect(typeof a.staminaCost).toBe('number');
    }
  });
});
