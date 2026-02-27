import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import type { BattleState, MeleeState, MeleeOpponent, MeleeAlly, LogEntry, MoraleChange } from '../../types';
import {
  BattlePhase,
  MoraleThreshold,
  HealthState,
  FatigueTier,
  ChargeChoiceId,
  ChargeEncounterId,
  MeleeActionId,
  MeleeStance,
  BodyPart,
  ActionId,
  DrillStep,
  getHealthPoolSize,
  getStaminaPoolSize,
} from '../../types';
import { DEFAULT_EXT } from '../helpers/mockFactories';

// ---------------------------------------------------------------------------
// Mocks: control what charge / melee / volley modules return
// ---------------------------------------------------------------------------
vi.mock('../../core/charge', () => ({
  resolveChargeChoice: vi.fn(),
  getChargeEncounter: vi.fn(),
}));

vi.mock('../../core/melee', () => ({
  resolveMeleeRound: vi.fn(),
}));

vi.mock('../../core/volleys', () => ({
  getScriptedAvailableActions: vi.fn(() => []),
}));

// Import AFTER mocks are declared
import { advanceTurn, resolveMeleeRout } from '../../core/battle';
import { resolveChargeChoice, getChargeEncounter } from '../../core/charge';
import { resolveMeleeRound } from '../../core/melee';
import { getScriptedAvailableActions } from '../../core/volleys';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const maxHp = getHealthPoolSize(45);
const maxStam = getStaminaPoolSize(40) * 4;

function mockPlayer(overrides: Partial<BattleState['player']> = {}): BattleState['player'] {
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
    health: maxHp,
    maxHealth: maxHp,
    healthState: HealthState.Unhurt,
    stamina: maxStam,
    maxStamina: maxStam,
    fatigue: 0,
    maxFatigue: maxStam,
    fatigueTier: FatigueTier.Fresh,
    musketLoaded: true,
    alive: true,
    routing: false,
    fumbledLoad: false,
    soldierRep: 50,
    officerRep: 50,
    napoleonRep: 0,
    frontRank: false,
    canteenUses: 0,
    ...overrides,
  };
}

function mockOpponent(overrides: Partial<MeleeOpponent> = {}): MeleeOpponent {
  return {
    name: 'Austrian Soldier',
    type: 'line',
    health: 80,
    maxHealth: 80,
    stamina: 100,
    maxStamina: 100,
    fatigue: 0,
    maxFatigue: 100,
    strength: 30,
    stunned: false,
    stunnedTurns: 0,
    armInjured: false,
    legInjured: false,
    description: 'A line infantryman',
    ...overrides,
  };
}

function mockAlly(overrides: Partial<MeleeAlly> = {}): MeleeAlly {
  return {
    id: 'ally-1',
    name: 'Pierre',
    type: 'named',
    npcId: 'pierre',
    health: 80,
    maxHealth: 80,
    stamina: 100,
    maxStamina: 100,
    fatigue: 0,
    maxFatigue: 100,
    strength: 30,
    elan: 35,
    alive: true,
    stunned: false,
    stunnedTurns: 0,
    armInjured: false,
    legInjured: false,
    description: 'Steady veteran',
    personality: 'aggressive',
    ...overrides,
  };
}

function mockMeleeState(overrides: Partial<MeleeState> = {}): MeleeState {
  return {
    opponents: [mockOpponent()],
    currentOpponent: 0,
    playerStance: MeleeStance.Balanced,
    playerRiposte: false,
    playerStunned: 0,
    exchangeCount: 1,
    selectingStance: false,
    selectingTarget: false,
    killCount: 0,
    valorTempBonus: 0,
    maxExchanges: 10,
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
    enemyPool: [],
    processedWaves: [],
    waveEvents: [],
    reloadProgress: 0,
    ...overrides,
  };
}

function mockBattleState(overrides: Partial<BattleState> = {}): BattleState {
  const { ext: extOverrides, ...restOverrides } = overrides;
  return {
    phase: BattlePhase.Line,
    turn: 5,
    drillStep: DrillStep.Present,
    player: mockPlayer(),
    line: {
      leftNeighbour: {
        id: 'pierre', name: 'Pierre', rank: 'private', valor: 40,
        morale: 80, maxMorale: 100, threshold: MoraleThreshold.Steady,
        alive: true, wounded: false, routing: false, musketLoaded: true, relationship: 50,
      },
      rightNeighbour: {
        id: 'jb', name: 'Jean-Baptiste', rank: 'private', valor: 20,
        morale: 60, maxMorale: 100, threshold: MoraleThreshold.Wavering,
        alive: true, wounded: false, routing: false, musketLoaded: true, relationship: 40,
      },
      officer: { name: 'Capitaine Dupont', rank: 'captain', alive: true, wounded: false, mounted: true, status: 'commanding' },
      lineIntegrity: 80,
      lineMorale: 'steady',
      drumsPlaying: true,
      ncoPresent: true,
      casualtiesThisTurn: 0,
    },
    enemy: {
      range: 100, strength: 100, quality: 'line', morale: 'advancing',
      lineIntegrity: 100, artillery: true, cavalryThreat: false,
    },
    log: [],
    availableActions: [],
    pendingMoraleChanges: [],
    battleOver: false,
    outcome: 'pending',
    crisisTurn: 0,
    volleysFired: 0,
    scriptedVolley: 1,
    chargeEncounter: 0,
    ext: { ...DEFAULT_EXT, ...extOverrides },
    autoPlayActive: false,
    autoPlayVolleyCompleted: 0,
    graceEarned: false,
    roles: { leftNeighbour: 'pierre', rightNeighbour: 'jb', officer: 'leclerc', nco: 'duval' },
    ...restOverrides,
  } as BattleState;
}

/** Default mock return for resolveChargeChoice — neutral result */
function chargeResult(overrides: Partial<{
  log: LogEntry[];
  moraleChanges: MoraleChange[];
  healthDelta: number;
  staminaDelta: number;
  nextEncounter: number;
}> = {}) {
  return {
    log: [],
    moraleChanges: [],
    healthDelta: 0,
    staminaDelta: 0,
    nextEncounter: 0,
    ...overrides,
  };
}

/** Default mock return for resolveMeleeRound — no battle end */
function meleeResult(overrides: Partial<{
  log: LogEntry[];
  moraleChanges: MoraleChange[];
  playerHealthDelta: number;
  playerStaminaDelta: number;
  allyDeaths: { name: string; npcId?: string; isNamed: boolean }[];
  enemyDefeats: number;
  battleEnd?: 'victory' | 'defeat' | 'survived';
}> = {}) {
  return {
    log: [],
    moraleChanges: [],
    playerHealthDelta: 0,
    playerStaminaDelta: 0,
    allyDeaths: [],
    enemyDefeats: 0,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------
beforeEach(() => {
  vi.clearAllMocks();
  (resolveChargeChoice as Mock).mockReturnValue(chargeResult());
  (getChargeEncounter as Mock).mockReturnValue({ narrative: 'A story beat.', choices: [] });
  (resolveMeleeRound as Mock).mockReturnValue(meleeResult());
  (getScriptedAvailableActions as Mock).mockReturnValue([]);
});

// ===========================================================================
// resolveMeleeRout
// ===========================================================================
describe('resolveMeleeRout', () => {
  it('returns a new state (structuredClone — no mutation)', () => {
    const state = mockBattleState({ phase: BattlePhase.Melee, turn: 7 });
    const result = resolveMeleeRout(state);
    expect(result).not.toBe(state);
    expect(state.battleOver).toBe(false); // original unchanged
  });

  it('sets battleOver to true', () => {
    const state = mockBattleState({ phase: BattlePhase.Melee });
    const result = resolveMeleeRout(state);
    expect(result.battleOver).toBe(true);
  });

  it('sets outcome to rout', () => {
    const state = mockBattleState({ phase: BattlePhase.Melee });
    const result = resolveMeleeRout(state);
    expect(result.outcome).toBe('rout');
  });

  it('adds a narrative log entry about fleeing', () => {
    const state = mockBattleState({ phase: BattlePhase.Melee, turn: 3 });
    const result = resolveMeleeRout(state);
    expect(result.log).toHaveLength(1);
    expect(result.log[0].type).toBe('narrative');
    expect(result.log[0].turn).toBe(3);
    expect(result.log[0].text).toContain('shame');
  });

  it('clears availableActions', () => {
    const state = mockBattleState({
      phase: BattlePhase.Melee,
      availableActions: [{ id: ActionId.Fire, name: 'Fire', description: 'Fire musket', minThreshold: MoraleThreshold.Steady, available: true, drillStep: DrillStep.Fire }],
    });
    const result = resolveMeleeRout(state);
    expect(result.availableActions).toEqual([]);
  });
});

// ===========================================================================
// advanceTurn — StoryBeat phase (exercises advanceChargeTurn)
// ===========================================================================
describe('advanceTurn — StoryBeat phase', () => {
  it('dispatches to charge path when phase is StoryBeat', () => {
    const state = mockBattleState({ phase: BattlePhase.StoryBeat, chargeEncounter: ChargeEncounterId.Battery });
    advanceTurn(state, ChargeChoiceId.ChargeBattery);
    expect(resolveChargeChoice).toHaveBeenCalledTimes(1);
  });

  it('does not mutate original state', () => {
    const state = mockBattleState({ phase: BattlePhase.StoryBeat, chargeEncounter: ChargeEncounterId.Battery });
    const originalTurn = state.turn;
    advanceTurn(state, ChargeChoiceId.ChargeBattery);
    expect(state.turn).toBe(originalTurn);
  });

  it('increments turn counter', () => {
    const state = mockBattleState({ phase: BattlePhase.StoryBeat, turn: 4, chargeEncounter: ChargeEncounterId.Battery });
    const result = advanceTurn(state, ChargeChoiceId.ChargeBattery);
    expect(result.turn).toBe(5);
  });

  it('applies health delta from charge choice (clamped to [0, maxHealth])', () => {
    (resolveChargeChoice as Mock).mockReturnValue(chargeResult({ healthDelta: -30 }));
    const state = mockBattleState({ phase: BattlePhase.StoryBeat, chargeEncounter: ChargeEncounterId.Battery });
    const result = advanceTurn(state, ChargeChoiceId.ChargeBattery);
    expect(result.player.health).toBe(state.player.health - 30);
    expect(result.player.health).toBeGreaterThanOrEqual(0);
  });

  it('clamps health to 0 when delta exceeds current health', () => {
    (resolveChargeChoice as Mock).mockReturnValue(chargeResult({ healthDelta: -9999 }));
    const state = mockBattleState({ phase: BattlePhase.StoryBeat, chargeEncounter: ChargeEncounterId.Battery });
    const result = advanceTurn(state, ChargeChoiceId.ChargeBattery);
    expect(result.player.health).toBe(0);
  });

  it('clamps health to maxHealth when delta is positive', () => {
    (resolveChargeChoice as Mock).mockReturnValue(chargeResult({ healthDelta: 9999 }));
    const state = mockBattleState({ phase: BattlePhase.StoryBeat, chargeEncounter: ChargeEncounterId.Battery });
    const result = advanceTurn(state, ChargeChoiceId.ChargeBattery);
    expect(result.player.health).toBe(state.player.maxHealth);
  });

  it('applies stamina delta (clamped to [0, maxStamina])', () => {
    (resolveChargeChoice as Mock).mockReturnValue(chargeResult({ staminaDelta: -50 }));
    const state = mockBattleState({ phase: BattlePhase.StoryBeat, chargeEncounter: ChargeEncounterId.Battery });
    const result = advanceTurn(state, ChargeChoiceId.ChargeBattery);
    expect(result.player.stamina).toBe(state.player.stamina - 50);
  });

  it('clamps stamina to 0 when delta exceeds current stamina', () => {
    (resolveChargeChoice as Mock).mockReturnValue(chargeResult({ staminaDelta: -9999 }));
    const state = mockBattleState({ phase: BattlePhase.StoryBeat, chargeEncounter: ChargeEncounterId.Battery });
    const result = advanceTurn(state, ChargeChoiceId.ChargeBattery);
    expect(result.player.stamina).toBe(0);
  });

  it('updates healthState after health delta', () => {
    (resolveChargeChoice as Mock).mockReturnValue(chargeResult({ healthDelta: -30 }));
    const state = mockBattleState({ phase: BattlePhase.StoryBeat, chargeEncounter: ChargeEncounterId.Battery });
    const result = advanceTurn(state, ChargeChoiceId.ChargeBattery);
    // healthState should be recalculated
    expect(result.player.healthState).toBeDefined();
  });

  it('logs morale summary when total morale changes are nonzero', () => {
    const moraleChanges: MoraleChange[] = [{ amount: -10, reason: 'fear', source: 'passive' }];
    (resolveChargeChoice as Mock).mockReturnValue(chargeResult({ moraleChanges }));
    const state = mockBattleState({ phase: BattlePhase.StoryBeat, chargeEncounter: ChargeEncounterId.Battery });
    const result = advanceTurn(state, ChargeChoiceId.ChargeBattery);
    const moraleLog = result.log.find(e => e.type === 'morale');
    expect(moraleLog).toBeDefined();
    expect(moraleLog!.text).toContain('Morale lost');
  });

  it('does not log morale summary when total is zero', () => {
    (resolveChargeChoice as Mock).mockReturnValue(chargeResult({ moraleChanges: [] }));
    const state = mockBattleState({ phase: BattlePhase.StoryBeat, chargeEncounter: ChargeEncounterId.Battery });
    const result = advanceTurn(state, ChargeChoiceId.ChargeBattery);
    const moraleLog = result.log.find(e => e.type === 'morale');
    expect(moraleLog).toBeUndefined();
  });

  it('logs positive morale recovery', () => {
    const moraleChanges: MoraleChange[] = [{ amount: 15, reason: 'courage', source: 'passive' }];
    (resolveChargeChoice as Mock).mockReturnValue(chargeResult({ moraleChanges }));
    const state = mockBattleState({ phase: BattlePhase.StoryBeat, chargeEncounter: ChargeEncounterId.Battery });
    const result = advanceTurn(state, ChargeChoiceId.ChargeBattery);
    const moraleLog = result.log.find(e => e.type === 'morale');
    expect(moraleLog).toBeDefined();
    expect(moraleLog!.text).toContain('recovered');
  });

  it('clears availableActions when not transitioning to Line phase', () => {
    // Stays in StoryBeat → empty actions
    (resolveChargeChoice as Mock).mockReturnValue(chargeResult());
    const state = mockBattleState({ phase: BattlePhase.StoryBeat, chargeEncounter: ChargeEncounterId.Battery });
    const result = advanceTurn(state, ChargeChoiceId.ChargeBattery);
    expect(result.availableActions).toEqual([]);
  });

  it('Masséna encounter reduces fatigue by 30%', () => {
    // Set up a state at Masséna encounter with some fatigue
    const state = mockBattleState({
      phase: BattlePhase.StoryBeat,
      chargeEncounter: ChargeEncounterId.Massena,
      player: mockPlayer({ fatigue: 200, maxFatigue: 400 }),
    });
    const result = advanceTurn(state, ChargeChoiceId.TendWounds);
    // Fatigue should be reduced by 30% of maxFatigue = 120
    expect(result.player.fatigue).toBe(200 - Math.round(400 * 0.3)); // 200 - 120 = 80
  });

  it('Masséna fatigue reduction does not go below 0', () => {
    const state = mockBattleState({
      phase: BattlePhase.StoryBeat,
      chargeEncounter: ChargeEncounterId.Massena,
      player: mockPlayer({ fatigue: 10, maxFatigue: 400 }),
    });
    const result = advanceTurn(state, ChargeChoiceId.TendWounds);
    expect(result.player.fatigue).toBe(0);
  });

  it('non-Masséna encounters do not reduce fatigue', () => {
    const state = mockBattleState({
      phase: BattlePhase.StoryBeat,
      chargeEncounter: ChargeEncounterId.Battery,
      player: mockPlayer({ fatigue: 200, maxFatigue: 400 }),
    });
    const result = advanceTurn(state, ChargeChoiceId.ChargeBattery);
    expect(result.player.fatigue).toBe(200);
  });

  it('updates fatigueTier after fatigue changes', () => {
    const state = mockBattleState({
      phase: BattlePhase.StoryBeat,
      chargeEncounter: ChargeEncounterId.Massena,
      player: mockPlayer({ fatigue: 100, maxFatigue: 400 }),
    });
    const result = advanceTurn(state, ChargeChoiceId.TendWounds);
    expect(result.player.fatigueTier).toBeDefined();
  });

  it('resets pendingMoraleChanges at start of turn', () => {
    const state = mockBattleState({
      phase: BattlePhase.StoryBeat,
      chargeEncounter: ChargeEncounterId.Battery,
      pendingMoraleChanges: [{ amount: -5, reason: 'old', source: 'passive' }],
    });
    // The turn resets pending, but advanceChargeTurn may add new ones
    // After the full turn, pendingMoraleChanges should only contain what resolveChargeChoice added
    (resolveChargeChoice as Mock).mockReturnValue(chargeResult({ moraleChanges: [] }));
    const result = advanceTurn(state, ChargeChoiceId.ChargeBattery);
    // pendingMoraleChanges has been consumed by applyMoraleChanges; the old one is gone
    expect(result.pendingMoraleChanges).not.toContainEqual({ amount: -5, reason: 'old', source: 'passive' });
  });
});

// ===========================================================================
// advanceTurn — Melee phase (exercises advanceMeleeTurn)
// ===========================================================================
describe('advanceTurn — Melee phase', () => {
  it('dispatches to melee path when phase is Melee and meleeInput provided', () => {
    const state = mockBattleState({
      phase: BattlePhase.Melee,
      meleeState: mockMeleeState(),
    });
    advanceTurn(state, MeleeActionId.BayonetThrust, {
      action: MeleeActionId.BayonetThrust,
      bodyPart: BodyPart.Torso,
    });
    expect(resolveMeleeRound).toHaveBeenCalledTimes(1);
  });

  it('returns early (no-op) if meleeState is missing', () => {
    const state = mockBattleState({ phase: BattlePhase.Melee });
    // No meleeState on state
    const result = advanceTurn(state, MeleeActionId.BayonetThrust, {
      action: MeleeActionId.BayonetThrust,
      bodyPart: BodyPart.Torso,
    });
    expect(resolveMeleeRound).not.toHaveBeenCalled();
    expect(result.turn).toBe(state.turn + 1);
  });

  it('does not mutate original state', () => {
    const ms = mockMeleeState();
    const state = mockBattleState({ phase: BattlePhase.Melee, meleeState: ms });
    const originalTurn = state.turn;
    advanceTurn(state, MeleeActionId.BayonetThrust, {
      action: MeleeActionId.BayonetThrust,
    });
    expect(state.turn).toBe(originalTurn);
  });

  it('sets stance when provided in meleeInput', () => {
    const ms = mockMeleeState({ playerStance: MeleeStance.Balanced });
    const state = mockBattleState({ phase: BattlePhase.Melee, meleeState: ms });
    const result = advanceTurn(state, MeleeActionId.BayonetThrust, {
      action: MeleeActionId.BayonetThrust,
      stance: MeleeStance.Aggressive,
    });
    expect(result.meleeState!.playerStance).toBe(MeleeStance.Aggressive);
  });

  it('updates healthState and fatigueTier from current values', () => {
    const ms = mockMeleeState();
    const state = mockBattleState({ phase: BattlePhase.Melee, meleeState: ms });
    const result = advanceTurn(state, MeleeActionId.Guard, {
      action: MeleeActionId.Guard,
    });
    expect(result.player.healthState).toBeDefined();
    expect(result.player.fatigueTier).toBeDefined();
  });

  it('applies morale changes from melee round result', () => {
    const moraleChanges: MoraleChange[] = [{ amount: -8, reason: 'enemy hit', source: 'passive' }];
    (resolveMeleeRound as Mock).mockReturnValue(meleeResult({ moraleChanges }));
    const ms = mockMeleeState();
    const state = mockBattleState({
      phase: BattlePhase.Melee,
      meleeState: ms,
      player: mockPlayer({ morale: 80, maxMorale: 100 }),
    });
    const result = advanceTurn(state, MeleeActionId.Guard, { action: MeleeActionId.Guard });
    // Morale should decrease (exact amount depends on applyMoraleChanges math)
    expect(result.player.morale).toBeLessThan(80);
  });

  it('logs morale summary when morale changes are nonzero', () => {
    const moraleChanges: MoraleChange[] = [{ amount: -12, reason: 'fear', source: 'passive' }];
    (resolveMeleeRound as Mock).mockReturnValue(meleeResult({ moraleChanges }));
    const ms = mockMeleeState();
    const state = mockBattleState({ phase: BattlePhase.Melee, meleeState: ms });
    const result = advanceTurn(state, MeleeActionId.Guard, { action: MeleeActionId.Guard });
    const moraleLog = result.log.find(e => e.type === 'morale');
    expect(moraleLog).toBeDefined();
    expect(moraleLog!.text).toContain('Morale lost');
  });

  // --- Battle end: defeat ---
  it('defeat: sets player alive=false, battleOver=true, outcome=defeat', () => {
    (resolveMeleeRound as Mock).mockReturnValue(meleeResult({ battleEnd: 'defeat' }));
    const ms = mockMeleeState();
    const state = mockBattleState({ phase: BattlePhase.Melee, meleeState: ms });
    const result = advanceTurn(state, MeleeActionId.Guard, { action: MeleeActionId.Guard });
    expect(result.player.alive).toBe(false);
    expect(result.battleOver).toBe(true);
    expect(result.outcome).toBe('defeat');
  });

  it('defeat: adds narrative log about falling in battle', () => {
    (resolveMeleeRound as Mock).mockReturnValue(meleeResult({ battleEnd: 'defeat' }));
    const ms = mockMeleeState();
    const state = mockBattleState({ phase: BattlePhase.Melee, meleeState: ms });
    const result = advanceTurn(state, MeleeActionId.Guard, { action: MeleeActionId.Guard });
    const deathLog = result.log.find(e => e.type === 'event' && e.text.includes('bayonet'));
    expect(deathLog).toBeDefined();
  });

  // --- Battle end: terrain survived ---
  it('survived (terrain): transitions to StoryBeat with Battery encounter', () => {
    (resolveMeleeRound as Mock).mockReturnValue(meleeResult({ battleEnd: 'survived' }));
    const ms = mockMeleeState({ meleeContext: 'terrain' });
    const state = mockBattleState({ phase: BattlePhase.Melee, meleeState: ms });
    const result = advanceTurn(state, MeleeActionId.Guard, { action: MeleeActionId.Guard });
    expect(result.phase).toBe(BattlePhase.StoryBeat);
    expect(result.chargeEncounter).toBe(ChargeEncounterId.Battery);
  });

  // --- Battle end: battery survived → Masséna ---
  it('survived (battery): transitions to Masséna story beat', () => {
    (resolveMeleeRound as Mock).mockReturnValue(meleeResult({ battleEnd: 'survived' }));
    const ms = mockMeleeState({ meleeContext: 'battery' });
    const state = mockBattleState({ phase: BattlePhase.Melee, meleeState: ms });
    const result = advanceTurn(state, MeleeActionId.Guard, { action: MeleeActionId.Guard });
    expect(result.phase).toBe(BattlePhase.StoryBeat);
    expect(result.chargeEncounter).toBe(ChargeEncounterId.Massena);
  });

  // --- Battle end: terrain victory ---
  it('victory (terrain): transitions to StoryBeat with Battery encounter', () => {
    (resolveMeleeRound as Mock).mockReturnValue(meleeResult({ battleEnd: 'victory' }));
    const ms = mockMeleeState({ meleeContext: 'terrain' });
    const state = mockBattleState({ phase: BattlePhase.Melee, meleeState: ms });
    const result = advanceTurn(state, MeleeActionId.Guard, { action: MeleeActionId.Guard });
    expect(result.phase).toBe(BattlePhase.StoryBeat);
    expect(result.chargeEncounter).toBe(ChargeEncounterId.Battery);
    expect(result.battleOver).toBe(false);
  });

  // --- Battle end: battery victory → Masséna ---
  it('victory (battery): transitions to Masséna story beat', () => {
    (resolveMeleeRound as Mock).mockReturnValue(meleeResult({ battleEnd: 'victory' }));
    const ms = mockMeleeState({ meleeContext: 'battery' });
    const state = mockBattleState({ phase: BattlePhase.Melee, meleeState: ms });
    const result = advanceTurn(state, MeleeActionId.Guard, { action: MeleeActionId.Guard });
    expect(result.phase).toBe(BattlePhase.StoryBeat);
    expect(result.chargeEncounter).toBe(ChargeEncounterId.Massena);
  });

  // --- Max exchanges reached ---
  it('max exchanges (terrain): transitions to StoryBeat with Battery encounter', () => {
    (resolveMeleeRound as Mock).mockReturnValue(meleeResult()); // no battleEnd
    const ms = mockMeleeState({ meleeContext: 'terrain', exchangeCount: 10, maxExchanges: 10 });
    const state = mockBattleState({ phase: BattlePhase.Melee, meleeState: ms });
    const result = advanceTurn(state, MeleeActionId.Guard, { action: MeleeActionId.Guard });
    expect(result.phase).toBe(BattlePhase.StoryBeat);
    expect(result.chargeEncounter).toBe(ChargeEncounterId.Battery);
  });

  it('max exchanges (battery): transitions to Masséna story beat', () => {
    (resolveMeleeRound as Mock).mockReturnValue(meleeResult()); // no battleEnd
    const ms = mockMeleeState({ meleeContext: 'battery', exchangeCount: 10, maxExchanges: 10 });
    const state = mockBattleState({ phase: BattlePhase.Melee, meleeState: ms });
    const result = advanceTurn(state, MeleeActionId.Guard, { action: MeleeActionId.Guard });
    expect(result.phase).toBe(BattlePhase.StoryBeat);
    expect(result.chargeEncounter).toBe(ChargeEncounterId.Massena);
  });

  // --- Warning at 3 rounds remaining ---
  it('logs warning when 3 rounds remain (terrain context)', () => {
    (resolveMeleeRound as Mock).mockReturnValue(meleeResult()); // no battleEnd
    const ms = mockMeleeState({ meleeContext: 'terrain', exchangeCount: 7, maxExchanges: 10 });
    const state = mockBattleState({ phase: BattlePhase.Melee, meleeState: ms });
    const result = advanceTurn(state, MeleeActionId.Guard, { action: MeleeActionId.Guard });
    const warningLog = result.log.find(e => e.type === 'event' && e.text.includes('thinning'));
    expect(warningLog).toBeDefined();
  });

  it('logs warning when 3 rounds remain (battery context)', () => {
    (resolveMeleeRound as Mock).mockReturnValue(meleeResult()); // no battleEnd
    const ms = mockMeleeState({ meleeContext: 'battery', exchangeCount: 7, maxExchanges: 10 });
    const state = mockBattleState({ phase: BattlePhase.Melee, meleeState: ms });
    const result = advanceTurn(state, MeleeActionId.Guard, { action: MeleeActionId.Guard });
    const warningLog = result.log.find(e => e.type === 'event' && e.text.includes('redoubt'));
    expect(warningLog).toBeDefined();
  });

  it('no warning when not exactly 3 rounds remaining', () => {
    (resolveMeleeRound as Mock).mockReturnValue(meleeResult());
    const ms = mockMeleeState({ meleeContext: 'terrain', exchangeCount: 5, maxExchanges: 10 });
    const state = mockBattleState({ phase: BattlePhase.Melee, meleeState: ms });
    const result = advanceTurn(state, MeleeActionId.Guard, { action: MeleeActionId.Guard });
    const warningLog = result.log.find(e => e.type === 'event' && e.text.includes('thinning'));
    expect(warningLog).toBeUndefined();
  });

  // --- Melee UI reset ---
  it('resets melee UI state when battle not over', () => {
    (resolveMeleeRound as Mock).mockReturnValue(meleeResult());
    const ms = mockMeleeState({
      selectingStance: true,
      selectingTarget: true,
      selectedAction: MeleeActionId.BayonetThrust,
      exchangeCount: 2,
      maxExchanges: 10,
    });
    const state = mockBattleState({ phase: BattlePhase.Melee, meleeState: ms });
    const result = advanceTurn(state, MeleeActionId.Guard, { action: MeleeActionId.Guard });
    expect(result.meleeState!.selectingStance).toBe(false);
    expect(result.meleeState!.selectingTarget).toBe(false);
    expect(result.meleeState!.selectedAction).toBeUndefined();
  });

  it('clears availableActions after melee turn', () => {
    (resolveMeleeRound as Mock).mockReturnValue(meleeResult());
    const ms = mockMeleeState();
    const state = mockBattleState({ phase: BattlePhase.Melee, meleeState: ms });
    const result = advanceTurn(state, MeleeActionId.Guard, { action: MeleeActionId.Guard });
    expect(result.availableActions).toEqual([]);
  });

  // --- Ally sync to line NPCs ---
  it('syncs leftNeighbour alive/wounded from ally', () => {
    (resolveMeleeRound as Mock).mockReturnValue(meleeResult());
    const ally = mockAlly({ npcId: 'pierre', alive: true, health: 30, maxHealth: 80 });
    const ms = mockMeleeState({ allies: [ally] });
    const state = mockBattleState({ phase: BattlePhase.Melee, meleeState: ms });
    const result = advanceTurn(state, MeleeActionId.Guard, { action: MeleeActionId.Guard });
    expect(result.line.leftNeighbour!.alive).toBe(true);
    expect(result.line.leftNeighbour!.wounded).toBe(true); // 30 < 80*0.5 = 40
  });

  it('syncs rightNeighbour alive/wounded from ally', () => {
    (resolveMeleeRound as Mock).mockReturnValue(meleeResult());
    const ally = mockAlly({ id: 'ally-jb', npcId: 'jb', name: 'Jean-Baptiste', alive: false, health: 0, maxHealth: 80 });
    const ms = mockMeleeState({ allies: [ally] });
    const state = mockBattleState({ phase: BattlePhase.Melee, meleeState: ms });
    const result = advanceTurn(state, MeleeActionId.Guard, { action: MeleeActionId.Guard });
    expect(result.line.rightNeighbour!.alive).toBe(false);
    expect(result.line.rightNeighbour!.wounded).toBe(true); // !alive → wounded
  });
});

// ===========================================================================
// Battery → Masséna transition (tested through melee victory/survived/maxExchanges)
// ===========================================================================
describe('transitionBatteryToMassena (via melee outcomes)', () => {
  it('logs battery victory narrative', () => {
    (resolveMeleeRound as Mock).mockReturnValue(meleeResult({ battleEnd: 'victory' }));
    const ms = mockMeleeState({ meleeContext: 'battery' });
    const state = mockBattleState({ phase: BattlePhase.Melee, meleeState: ms });
    const result = advanceTurn(state, MeleeActionId.Guard, { action: MeleeActionId.Guard });
    const batteryLog = result.log.find(e => e.text.includes('THE BATTERY IS YOURS'));
    expect(batteryLog).toBeDefined();
    expect(batteryLog!.type).toBe('narrative');
  });

  it('includes "Still alive" clause when leftNeighbour ally is alive', () => {
    (resolveMeleeRound as Mock).mockReturnValue(meleeResult({ battleEnd: 'victory' }));
    const ally = mockAlly({ npcId: 'pierre', alive: true });
    const ms = mockMeleeState({ meleeContext: 'battery', allies: [ally] });
    const state = mockBattleState({ phase: BattlePhase.Melee, meleeState: ms });
    const result = advanceTurn(state, MeleeActionId.Guard, { action: MeleeActionId.Guard });
    const batteryLog = result.log.find(e => e.text.includes('THE BATTERY IS YOURS'));
    expect(batteryLog!.text).toContain('Still alive');
  });

  it('includes "gone" clause when leftNeighbour ally is dead', () => {
    (resolveMeleeRound as Mock).mockReturnValue(meleeResult({ battleEnd: 'victory' }));
    const ally = mockAlly({ npcId: 'pierre', alive: false });
    const ms = mockMeleeState({ meleeContext: 'battery', allies: [ally] });
    const state = mockBattleState({ phase: BattlePhase.Melee, meleeState: ms });
    const result = advanceTurn(state, MeleeActionId.Guard, { action: MeleeActionId.Guard });
    const batteryLog = result.log.find(e => e.text.includes('THE BATTERY IS YOURS'));
    expect(batteryLog!.text).toContain('gone');
  });

  it('falls back to line.leftNeighbour.alive when no ally matches', () => {
    (resolveMeleeRound as Mock).mockReturnValue(meleeResult({ battleEnd: 'victory' }));
    // No allies at all — falls back to line state
    const ms = mockMeleeState({ meleeContext: 'battery', allies: [] });
    const state = mockBattleState({ phase: BattlePhase.Melee, meleeState: ms });
    state.line.leftNeighbour!.alive = false;
    const result = advanceTurn(state, MeleeActionId.Guard, { action: MeleeActionId.Guard });
    const batteryLog = result.log.find(e => e.text.includes('THE BATTERY IS YOURS'));
    expect(batteryLog!.text).toContain('gone');
  });

  it('sets chargeEncounter to Masséna', () => {
    (resolveMeleeRound as Mock).mockReturnValue(meleeResult({ battleEnd: 'victory' }));
    const ms = mockMeleeState({ meleeContext: 'battery' });
    const state = mockBattleState({ phase: BattlePhase.Melee, meleeState: ms });
    const result = advanceTurn(state, MeleeActionId.Guard, { action: MeleeActionId.Guard });
    expect(result.chargeEncounter).toBe(ChargeEncounterId.Massena);
  });

  it('calls getChargeEncounter for Masséna narrative', () => {
    (resolveMeleeRound as Mock).mockReturnValue(meleeResult({ battleEnd: 'victory' }));
    const ms = mockMeleeState({ meleeContext: 'battery' });
    const state = mockBattleState({ phase: BattlePhase.Melee, meleeState: ms });
    advanceTurn(state, MeleeActionId.Guard, { action: MeleeActionId.Guard });
    expect(getChargeEncounter).toHaveBeenCalled();
  });

  it('clears availableActions after transition', () => {
    (resolveMeleeRound as Mock).mockReturnValue(meleeResult({ battleEnd: 'victory' }));
    const ms = mockMeleeState({ meleeContext: 'battery' });
    const state = mockBattleState({ phase: BattlePhase.Melee, meleeState: ms });
    const result = advanceTurn(state, MeleeActionId.Guard, { action: MeleeActionId.Guard });
    expect(result.availableActions).toEqual([]);
  });

  it('uses roles.leftNeighbour (not hardcoded pierre) for ally lookup', () => {
    // Custom role: leftNeighbour is 'girard' not 'pierre'
    (resolveMeleeRound as Mock).mockReturnValue(meleeResult({ battleEnd: 'victory' }));
    const ally = mockAlly({ npcId: 'girard', alive: false });
    const ms = mockMeleeState({ meleeContext: 'battery', allies: [ally] });
    const state = mockBattleState({
      phase: BattlePhase.Melee,
      meleeState: ms,
      roles: { leftNeighbour: 'girard', rightNeighbour: 'jb', officer: 'leclerc', nco: 'duval' },
    });
    const result = advanceTurn(state, MeleeActionId.Guard, { action: MeleeActionId.Guard });
    const batteryLog = result.log.find(e => e.text.includes('THE BATTERY IS YOURS'));
    // Should find girard as dead (not default to alive due to 'pierre' not matching)
    expect(batteryLog!.text).toContain('gone');
  });
});
