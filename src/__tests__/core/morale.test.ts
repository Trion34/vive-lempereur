import { describe, it, expect, vi } from 'vitest';
import {
  calculatePassiveDrain,
  calculateRecovery,
  applyMoraleChanges,
  rollValor,
  rollAutoLoad,
  rollGraduatedValor,
} from '../../core/morale';
import type { Player, EnemyState, LineState, Soldier, Officer } from '../../types';
import { MoraleThreshold, HealthState, FatigueTier } from '../../types';

// ---------------------------------------------------------------------------
// Helpers: minimal mock objects
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
    stamina: 100,
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

function mockEnemy(overrides: Partial<EnemyState> = {}): EnemyState {
  return {
    range: 150,
    strength: 500,
    quality: 'line',
    morale: 'steady',
    lineIntegrity: 80,
    artillery: false,
    cavalryThreat: false,
    ...overrides,
  };
}

function mockOfficer(overrides: Partial<Officer> = {}): Officer {
  return {
    name: 'Capitaine Dupont',
    rank: 'captain',
    alive: true,
    wounded: false,
    mounted: true,
    status: 'commanding',
    ...overrides,
  };
}

function mockSoldier(overrides: Partial<Soldier> = {}): Soldier {
  return {
    id: 'soldier-1',
    name: 'Pierre',
    rank: 'private',
    valor: 40,
    morale: 80,
    maxMorale: 100,
    threshold: MoraleThreshold.Steady,
    alive: true,
    wounded: false,
    routing: false,
    musketLoaded: true,
    relationship: 50,
    ...overrides,
  };
}

function mockLine(overrides: Partial<LineState> = {}): LineState {
  return {
    leftNeighbour: mockSoldier({ id: 'left', name: 'Pierre' }),
    rightNeighbour: mockSoldier({ id: 'right', name: 'Jean-Baptiste' }),
    officer: mockOfficer(),
    lineIntegrity: 80,
    lineMorale: 'resolute',
    drumsPlaying: true,
    ncoPresent: true,
    casualtiesThisTurn: 0,
    ...overrides,
  };
}

// ===========================================================================
// calculatePassiveDrain
// ===========================================================================
describe('calculatePassiveDrain', () => {
  describe('range-based drain', () => {
    it('applies -6 * expMod at point-blank range (<= 50)', () => {
      const player = mockPlayer({ valor: 0 }); // expMod = 1.0
      const enemy = mockEnemy({ range: 50 });
      const changes = calculatePassiveDrain(enemy, mockLine(), player);
      const rangeDrain = changes.find((c) => c.reason.includes('point-blank'));
      expect(rangeDrain).toBeDefined();
      expect(rangeDrain!.amount).toBeCloseTo(-6);
    });

    it('applies -4 * expMod at close range (<= 100)', () => {
      const player = mockPlayer({ valor: 0 });
      const enemy = mockEnemy({ range: 100 });
      const changes = calculatePassiveDrain(enemy, mockLine(), player);
      const rangeDrain = changes.find((c) => c.reason.includes('close range'));
      expect(rangeDrain).toBeDefined();
      expect(rangeDrain!.amount).toBeCloseTo(-4);
    });

    it('applies -2 * expMod at medium range (<= 200)', () => {
      const player = mockPlayer({ valor: 0 });
      const enemy = mockEnemy({ range: 150 });
      const changes = calculatePassiveDrain(enemy, mockLine(), player);
      const rangeDrain = changes.find((c) => c.reason.includes('medium range'));
      expect(rangeDrain).toBeDefined();
      expect(rangeDrain!.amount).toBeCloseTo(-2);
    });

    it('applies -1 * expMod at long range (> 200)', () => {
      const player = mockPlayer({ valor: 0 });
      const enemy = mockEnemy({ range: 300 });
      const changes = calculatePassiveDrain(enemy, mockLine(), player);
      const rangeDrain = changes.find((c) => c.reason.includes('Distant'));
      expect(rangeDrain).toBeDefined();
      expect(rangeDrain!.amount).toBeCloseTo(-1);
    });
  });

  describe('expMod scaling (valor reduces drain)', () => {
    it('halves range drain at valor 100', () => {
      const player = mockPlayer({ valor: 100 }); // expMod = 1 - 100/200 = 0.5
      const enemy = mockEnemy({ range: 50 });
      const changes = calculatePassiveDrain(enemy, mockLine(), player);
      const rangeDrain = changes.find((c) => c.reason.includes('point-blank'));
      expect(rangeDrain!.amount).toBeCloseTo(-3); // -6 * 0.5
    });

    it('applies full drain at valor 0', () => {
      const player = mockPlayer({ valor: 0 }); // expMod = 1.0
      const enemy = mockEnemy({ range: 50 });
      const changes = calculatePassiveDrain(enemy, mockLine(), player);
      const rangeDrain = changes.find((c) => c.reason.includes('point-blank'));
      expect(rangeDrain!.amount).toBeCloseTo(-6); // -6 * 1.0
    });
  });

  describe('artillery drain', () => {
    it('adds -8 * expMod when artillery is active', () => {
      const player = mockPlayer({ valor: 0 });
      const enemy = mockEnemy({ artillery: true });
      const changes = calculatePassiveDrain(enemy, mockLine(), player);
      const artilleryDrain = changes.find((c) => c.reason.includes('Artillery'));
      expect(artilleryDrain).toBeDefined();
      expect(artilleryDrain!.amount).toBeCloseTo(-8);
    });

    it('does not add artillery drain when artillery is false', () => {
      const player = mockPlayer({ valor: 0 });
      const enemy = mockEnemy({ artillery: false });
      const changes = calculatePassiveDrain(enemy, mockLine(), player);
      const artilleryDrain = changes.find((c) => c.reason.includes('Artillery'));
      expect(artilleryDrain).toBeUndefined();
    });
  });

  describe('casualties drain', () => {
    it('applies -3 * casualtiesThisTurn * expMod', () => {
      const player = mockPlayer({ valor: 0 });
      const line = mockLine({ casualtiesThisTurn: 2 });
      const changes = calculatePassiveDrain(mockEnemy(), line, player);
      const casualtyDrain = changes.find((c) => c.reason.includes('fell'));
      expect(casualtyDrain).toBeDefined();
      expect(casualtyDrain!.amount).toBeCloseTo(-6); // -3 * 2 * 1.0
    });

    it('uses singular text for 1 casualty', () => {
      const player = mockPlayer({ valor: 0 });
      const line = mockLine({ casualtiesThisTurn: 1 });
      const changes = calculatePassiveDrain(mockEnemy(), line, player);
      const casualtyDrain = changes.find((c) => c.reason.includes('fell'));
      expect(casualtyDrain!.reason).toBe('1 man fell nearby');
    });

    it('uses plural text for multiple casualties', () => {
      const player = mockPlayer({ valor: 0 });
      const line = mockLine({ casualtiesThisTurn: 3 });
      const changes = calculatePassiveDrain(mockEnemy(), line, player);
      const casualtyDrain = changes.find((c) => c.reason.includes('fell'));
      expect(casualtyDrain!.reason).toBe('3 men fell nearby');
    });

    it('does not add casualty drain when casualtiesThisTurn is 0', () => {
      const player = mockPlayer({ valor: 0 });
      const line = mockLine({ casualtiesThisTurn: 0 });
      const changes = calculatePassiveDrain(mockEnemy(), line, player);
      const casualtyDrain = changes.find((c) => c.reason.includes('fell'));
      expect(casualtyDrain).toBeUndefined();
    });
  });

  describe('health state drain (flat, not scaled by expMod)', () => {
    it('applies -3 for BadlyWounded', () => {
      const player = mockPlayer({ healthState: HealthState.BadlyWounded });
      const changes = calculatePassiveDrain(mockEnemy(), mockLine(), player);
      const healthDrain = changes.find((c) => c.reason.includes('Pain'));
      expect(healthDrain).toBeDefined();
      expect(healthDrain!.amount).toBe(-3);
    });

    it('applies -6 for Critical', () => {
      const player = mockPlayer({ healthState: HealthState.Critical });
      const changes = calculatePassiveDrain(mockEnemy(), mockLine(), player);
      const healthDrain = changes.find((c) => c.reason.includes('wound'));
      expect(healthDrain).toBeDefined();
      expect(healthDrain!.amount).toBe(-6);
    });

    it('does not apply health drain for Unhurt or Wounded', () => {
      const unhurt = mockPlayer({ healthState: HealthState.Unhurt });
      const wounded = mockPlayer({ healthState: HealthState.Wounded });
      for (const p of [unhurt, wounded]) {
        const changes = calculatePassiveDrain(mockEnemy(), mockLine(), p);
        const healthDrain = changes.find(
          (c) => c.reason.includes('Pain') || c.reason.includes('wound is taking'),
        );
        expect(healthDrain).toBeUndefined();
      }
    });
  });

  describe('fatigue drain (flat)', () => {
    it('applies -2 when Fatigued', () => {
      const player = mockPlayer({ fatigueTier: FatigueTier.Fatigued });
      const changes = calculatePassiveDrain(mockEnemy(), mockLine(), player);
      const fatigueDrain = changes.find((c) => c.reason.includes('Fatigue'));
      expect(fatigueDrain).toBeDefined();
      expect(fatigueDrain!.amount).toBe(-2);
    });

    it('applies -4 when Exhausted', () => {
      const player = mockPlayer({ fatigueTier: FatigueTier.Exhausted });
      const changes = calculatePassiveDrain(mockEnemy(), mockLine(), player);
      const fatigueDrain = changes.find((c) => c.reason.includes('Exhaustion'));
      expect(fatigueDrain).toBeDefined();
      expect(fatigueDrain!.amount).toBe(-4);
    });

    it('does not apply fatigue drain when Fresh or Winded', () => {
      for (const tier of [FatigueTier.Fresh, FatigueTier.Winded]) {
        const player = mockPlayer({ fatigueTier: tier });
        const changes = calculatePassiveDrain(mockEnemy(), mockLine(), player);
        const fatigueDrain = changes.find(
          (c) => c.reason.includes('Fatigue') || c.reason.includes('Exhaustion'),
        );
        expect(fatigueDrain).toBeUndefined();
      }
    });
  });

  it('all changes have source "passive"', () => {
    const player = mockPlayer({
      valor: 0,
      healthState: HealthState.BadlyWounded,
      fatigueTier: FatigueTier.Exhausted,
    });
    const enemy = mockEnemy({ range: 50, artillery: true });
    const line = mockLine({ casualtiesThisTurn: 2 });
    const changes = calculatePassiveDrain(enemy, line, player);
    for (const c of changes) {
      expect(c.source).toBe('passive');
    }
  });
});

// ===========================================================================
// calculateRecovery
// ===========================================================================
describe('calculateRecovery', () => {
  describe('drums', () => {
    it('adds +2 when drums are playing', () => {
      const line = mockLine({ drumsPlaying: true });
      const changes = calculateRecovery(line, mockPlayer());
      const drums = changes.find((c) => c.reason.includes('drums'));
      expect(drums).toBeDefined();
      expect(drums!.amount).toBe(2);
    });

    it('does not add drum bonus when drums are not playing', () => {
      const line = mockLine({ drumsPlaying: false });
      const changes = calculateRecovery(line, mockPlayer());
      const drums = changes.find((c) => c.reason.includes('drums'));
      expect(drums).toBeUndefined();
    });
  });

  describe('officer + NCO bonus', () => {
    it('adds +1 when NCO is present AND officer is alive', () => {
      const line = mockLine({
        ncoPresent: true,
        officer: mockOfficer({ alive: true }),
      });
      const changes = calculateRecovery(line, mockPlayer());
      const officerBonus = changes.find((c) => c.reason.includes('Officers'));
      expect(officerBonus).toBeDefined();
      expect(officerBonus!.amount).toBe(1);
    });

    it('does not add bonus when NCO is absent', () => {
      const line = mockLine({
        ncoPresent: false,
        officer: mockOfficer({ alive: true }),
      });
      const changes = calculateRecovery(line, mockPlayer());
      const officerBonus = changes.find((c) => c.reason.includes('Officers'));
      expect(officerBonus).toBeUndefined();
    });

    it('does not add bonus when officer is dead', () => {
      const line = mockLine({
        ncoPresent: true,
        officer: mockOfficer({ alive: false }),
      });
      const changes = calculateRecovery(line, mockPlayer());
      const officerBonus = changes.find((c) => c.reason.includes('Officers'));
      expect(officerBonus).toBeUndefined();
    });
  });

  describe('neighbour contagion', () => {
    it('adds +2 per Steady neighbour', () => {
      const steadyNeighbour = mockSoldier({
        morale: 80,
        maxMorale: 100,
        alive: true,
        routing: false,
      }); // 80% = Steady
      const line = mockLine({
        leftNeighbour: steadyNeighbour,
        rightNeighbour: steadyNeighbour,
      });
      const changes = calculateRecovery(line, mockPlayer());
      const contagion = changes.filter((c) => c.source === 'contagion' && c.amount > 0);
      expect(contagion).toHaveLength(2);
      expect(contagion[0].amount).toBe(2);
      expect(contagion[1].amount).toBe(2);
    });

    it('adds -3 per Wavering neighbour', () => {
      const waveringNeighbour = mockSoldier({
        morale: 30,
        maxMorale: 100,
        alive: true,
        routing: false,
      }); // 30% = Wavering
      const line = mockLine({
        leftNeighbour: waveringNeighbour,
        rightNeighbour: null,
      });
      const changes = calculateRecovery(line, mockPlayer());
      const contagion = changes.filter((c) => c.source === 'contagion' && c.amount < 0);
      // Should have one from the wavering neighbour, possibly one from line integrity
      const neighbourContagion = contagion.find((c) => c.reason.includes('trembling'));
      expect(neighbourContagion).toBeDefined();
      expect(neighbourContagion!.amount).toBe(-3);
    });

    it('adds -3 per Breaking neighbour', () => {
      const breakingNeighbour = mockSoldier({
        morale: 10,
        maxMorale: 100,
        alive: true,
        routing: false,
      }); // 10% = Breaking
      const line = mockLine({
        leftNeighbour: breakingNeighbour,
        rightNeighbour: null,
      });
      const changes = calculateRecovery(line, mockPlayer());
      const neighbourContagion = changes.find((c) => c.reason.includes('trembling'));
      expect(neighbourContagion).toBeDefined();
      expect(neighbourContagion!.amount).toBe(-3);
    });

    it('does not count dead neighbours', () => {
      const deadNeighbour = mockSoldier({ alive: false, morale: 10, maxMorale: 100 });
      const line = mockLine({
        leftNeighbour: deadNeighbour,
        rightNeighbour: null,
      });
      const changes = calculateRecovery(line, mockPlayer());
      const contagion = changes.filter((c) => c.source === 'contagion');
      // Only line integrity contagion, no neighbour contagion
      const neighbourContagion = contagion.filter(
        (c) => c.reason.includes('firm') || c.reason.includes('trembling'),
      );
      expect(neighbourContagion).toHaveLength(0);
    });

    it('does not count routing neighbours', () => {
      const routingNeighbour = mockSoldier({
        alive: true,
        routing: true,
        morale: 80,
        maxMorale: 100,
      });
      const line = mockLine({
        leftNeighbour: routingNeighbour,
        rightNeighbour: null,
      });
      const changes = calculateRecovery(line, mockPlayer());
      const neighbourContagion = changes.filter(
        (c) => c.reason.includes('firm') || c.reason.includes('trembling'),
      );
      expect(neighbourContagion).toHaveLength(0);
    });

    it('gives no contagion for Shaken neighbours (neither +2 nor -3)', () => {
      const shakenNeighbour = mockSoldier({
        morale: 50,
        maxMorale: 100,
        alive: true,
        routing: false,
      }); // 50% = Shaken
      const line = mockLine({
        leftNeighbour: shakenNeighbour,
        rightNeighbour: null,
        lineIntegrity: 90, // avoid line integrity penalty
      });
      const changes = calculateRecovery(line, mockPlayer());
      const neighbourContagion = changes.filter(
        (c) => c.reason.includes('firm') || c.reason.includes('trembling'),
      );
      expect(neighbourContagion).toHaveLength(0);
    });
  });

  describe('line integrity', () => {
    it('applies -3 when lineIntegrity < 50', () => {
      const line = mockLine({
        lineIntegrity: 40,
        leftNeighbour: null,
        rightNeighbour: null,
        drumsPlaying: false,
        ncoPresent: false,
      });
      const changes = calculateRecovery(line, mockPlayer());
      const integrityDrain = changes.find((c) => c.reason.includes('thinning'));
      expect(integrityDrain).toBeDefined();
      expect(integrityDrain!.amount).toBe(-3);
    });

    it('applies -1 when lineIntegrity >= 50 but < 70', () => {
      const line = mockLine({
        lineIntegrity: 60,
        leftNeighbour: null,
        rightNeighbour: null,
        drumsPlaying: false,
        ncoPresent: false,
      });
      const changes = calculateRecovery(line, mockPlayer());
      const integrityDrain = changes.find((c) => c.reason.includes('Gaps'));
      expect(integrityDrain).toBeDefined();
      expect(integrityDrain!.amount).toBe(-1);
    });

    it('applies no penalty when lineIntegrity >= 70', () => {
      const line = mockLine({
        lineIntegrity: 80,
        leftNeighbour: null,
        rightNeighbour: null,
        drumsPlaying: false,
        ncoPresent: false,
      });
      const changes = calculateRecovery(line, mockPlayer());
      const integrityDrain = changes.find(
        (c) => c.reason.includes('thinning') || c.reason.includes('Gaps'),
      );
      expect(integrityDrain).toBeUndefined();
    });
  });
});

// ===========================================================================
// applyMoraleChanges
// ===========================================================================
describe('applyMoraleChanges', () => {
  it('applies negative changes directly (no scaling)', () => {
    const result = applyMoraleChanges(80, 100, [
      { amount: -10, reason: 'test drain', source: 'passive' },
    ]);
    expect(result.newMorale).toBe(70);
  });

  it('scales positive changes by recovery efficiency', () => {
    // current=80, max=100, valorStat=50 (default)
    // ratio = 80/100 = 0.8
    // valorFactor = 50/100 = 0.5
    // efficiency = (0.25 + 0.8*0.75) * (0.6 + 0.5*0.4) = 0.85 * 0.8 = 0.68
    const result = applyMoraleChanges(80, 100, [
      { amount: 10, reason: 'test recovery', source: 'recovery' },
    ]);
    // 80 + 10*0.68 = 80 + 6.8 = 86.8
    expect(result.newMorale).toBeCloseTo(86.8, 0);
  });

  it('scales positive changes less when morale is low (ratchet effect)', () => {
    // Low morale = lower recovery efficiency
    // current=20, max=100, valorStat=50
    // ratio = 20/100 = 0.2
    // efficiency = (0.25 + 0.2*0.75) * (0.6 + 0.5*0.4) = 0.4 * 0.8 = 0.32
    const result = applyMoraleChanges(
      20,
      100,
      [{ amount: 10, reason: 'test recovery', source: 'recovery' }],
      50,
    );
    // 20 + 10*0.32 = 20 + 3.2 = 23.2
    expect(result.newMorale).toBeCloseTo(23.2, 0);
  });

  it('high valor improves recovery efficiency', () => {
    // current=80, max=100, valorStat=100
    // ratio = 0.8
    // valorFactor = 1.0
    // efficiency = (0.25 + 0.8*0.75) * (0.6 + 1.0*0.4) = 0.85 * 1.0 = 0.85
    const highValor = applyMoraleChanges(
      80,
      100,
      [{ amount: 10, reason: 'test', source: 'recovery' }],
      100,
    );
    // current=80, max=100, valorStat=0
    // efficiency = 0.85 * 0.6 = 0.51
    const lowValor = applyMoraleChanges(
      80,
      100,
      [{ amount: 10, reason: 'test', source: 'recovery' }],
      0,
    );
    expect(highValor.newMorale).toBeGreaterThan(lowValor.newMorale);
  });

  it('clamps result to [0, max]', () => {
    const drainToZero = applyMoraleChanges(10, 100, [
      { amount: -50, reason: 'catastrophe', source: 'passive' },
    ]);
    expect(drainToZero.newMorale).toBe(0);

    const overMax = applyMoraleChanges(
      95,
      100,
      [{ amount: 50, reason: 'miracle', source: 'recovery' }],
      100,
    );
    expect(overMax.newMorale).toBeLessThanOrEqual(100);
  });

  it('returns a valid MoraleThreshold based on newMorale', () => {
    const high = applyMoraleChanges(90, 100, []);
    expect(high.threshold).toBe(MoraleThreshold.Steady);

    const low = applyMoraleChanges(5, 100, []);
    expect(low.threshold).toBe(MoraleThreshold.Breaking);
  });

  it('handles mixed positive and negative changes', () => {
    const result = applyMoraleChanges(
      60,
      100,
      [
        { amount: -10, reason: 'drain', source: 'passive' },
        { amount: 5, reason: 'recovery', source: 'recovery' },
      ],
      50,
    );
    // negativeTotal = -10, positiveTotal = 5 * efficiency
    // ratio = 60/100 = 0.6, valorFactor = 0.5
    // efficiency = (0.25 + 0.6*0.75) * (0.6 + 0.5*0.4) = 0.7 * 0.8 = 0.56
    // positiveTotal = 5 * 0.56 = 2.8
    // total = 60 + (-10) + 2.8 = 52.8
    expect(result.newMorale).toBeCloseTo(52.8, 0);
  });

  it('handles empty changes array', () => {
    const result = applyMoraleChanges(60, 100, []);
    expect(result.newMorale).toBe(60);
  });

  it('defaults valorStat to 50', () => {
    // Without explicitly passing valorStat
    const withDefault = applyMoraleChanges(80, 100, [
      { amount: 10, reason: 'test', source: 'recovery' },
    ]);
    // Explicitly passing 50
    const explicit = applyMoraleChanges(
      80,
      100,
      [{ amount: 10, reason: 'test', source: 'recovery' }],
      50,
    );
    expect(withDefault.newMorale).toBe(explicit.newMorale);
  });
});

// ===========================================================================
// rollValor
// ===========================================================================
describe('rollValor', () => {
  it('returns success when roll <= target', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.19); // roll = 20
    const result = rollValor(50);
    expect(result.success).toBe(true);
    expect(result.roll).toBe(20);
    expect(result.target).toBe(50);
    vi.restoreAllMocks();
  });

  it('returns failure when roll > target', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.79); // roll = 80
    const result = rollValor(50);
    expect(result.success).toBe(false);
    expect(result.roll).toBe(80);
    expect(result.target).toBe(50);
    vi.restoreAllMocks();
  });

  it('applies modifier to the target', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.59); // roll = 60
    const result = rollValor(50, 15);
    expect(result.target).toBe(65);
    expect(result.success).toBe(true); // 60 <= 65
    vi.restoreAllMocks();
  });

  it('clamps target to minimum 5', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.0); // roll = 1
    const result = rollValor(0, -100);
    expect(result.target).toBe(5);
    vi.restoreAllMocks();
  });

  it('clamps target to maximum 95', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99); // roll = 100
    const result = rollValor(100, 100);
    expect(result.target).toBe(95);
    vi.restoreAllMocks();
  });

  it('produces rolls in range [1, 100] over many iterations', () => {
    for (let i = 0; i < 500; i++) {
      const result = rollValor(50);
      expect(result.roll).toBeGreaterThanOrEqual(1);
      expect(result.roll).toBeLessThanOrEqual(100);
    }
  });
});

// ===========================================================================
// rollAutoLoad
// ===========================================================================
describe('rollAutoLoad', () => {
  it('returns a LoadResult with success, rollValue, targetValue, and narrativeSteps', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.0); // roll = 1
    const result = rollAutoLoad(80, 100, 50, 35);
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('rollValue');
    expect(result).toHaveProperty('targetValue');
    expect(result).toHaveProperty('narrativeSteps');
    expect(result.narrativeSteps).toHaveLength(4);
    vi.restoreAllMocks();
  });

  it('succeeds when roll <= targetValue', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.0); // roll = 1
    const result = rollAutoLoad(80, 100, 50, 35);
    expect(result.success).toBe(true);
    expect(result.rollValue).toBe(1);
    // All steps should be successful
    for (const step of result.narrativeSteps) {
      expect(step.success).toBe(true);
    }
    vi.restoreAllMocks();
  });

  it('fails when roll > targetValue', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99); // roll = 100
    const result = rollAutoLoad(80, 100, 50, 35);
    expect(result.success).toBe(false);
    // First two steps always succeed, last two fail on load failure
    expect(result.narrativeSteps[0].success).toBe(true);
    expect(result.narrativeSteps[1].success).toBe(true);
    expect(result.narrativeSteps[2].success).toBe(false);
    expect(result.narrativeSteps[3].success).toBe(false);
    vi.restoreAllMocks();
  });

  it('calculates targetValue from morale, musketry, and valor', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.0);
    // moralePct = 80/100 = 0.8
    // dexMod = 35/100 = 0.35
    // successChance = 0.8 * (0.4 + 0.35*0.4 + (50/100)*0.2) = 0.8 * (0.4 + 0.14 + 0.1) = 0.8 * 0.64 = 0.512
    // targetValue = round(0.512 * 100) = 51
    const result = rollAutoLoad(80, 100, 50, 35);
    expect(result.targetValue).toBe(51);
    vi.restoreAllMocks();
  });

  it('has 4 narrative steps with expected labels', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.0);
    const result = rollAutoLoad(80, 100, 50);
    expect(result.narrativeSteps[0].label).toBe('Bite cartridge');
    expect(result.narrativeSteps[1].label).toBe('Pour powder');
    expect(result.narrativeSteps[2].label).toBe('Ram ball');
    expect(result.narrativeSteps[3].label).toBe('Prime pan');
    vi.restoreAllMocks();
  });

  it('defaults musketry to 35', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.0);
    const withDefault = rollAutoLoad(80, 100, 50);
    const withExplicit = rollAutoLoad(80, 100, 50, 35);
    expect(withDefault.targetValue).toBe(withExplicit.targetValue);
    vi.restoreAllMocks();
  });

  it('higher musketry improves success chance', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.0);
    const lowMusketry = rollAutoLoad(80, 100, 50, 10);
    vi.restoreAllMocks();
    vi.spyOn(Math, 'random').mockReturnValue(0.0);
    const highMusketry = rollAutoLoad(80, 100, 50, 90);
    vi.restoreAllMocks();
    expect(highMusketry.targetValue).toBeGreaterThan(lowMusketry.targetValue);
  });
});

// ===========================================================================
// rollGraduatedValor
// ===========================================================================
describe('rollGraduatedValor', () => {
  it('returns great_success with +5 morale when margin >= 20', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.09); // roll = 10
    const result = rollGraduatedValor(50, 0); // target 50, roll 10, margin 40
    expect(result.outcome).toBe('great_success');
    expect(result.moraleChange).toBe(5);
    expect(result.roll).toBe(10);
    vi.restoreAllMocks();
  });

  it('returns pass with +1 morale when margin >= 0 but < 20', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.39); // roll = 40
    const result = rollGraduatedValor(50, 0); // target 50, roll 40, margin 10
    expect(result.outcome).toBe('pass');
    expect(result.moraleChange).toBe(1);
    vi.restoreAllMocks();
  });

  it('returns fail with -5 morale when margin >= -20 but < 0', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.59); // roll = 60
    const result = rollGraduatedValor(50, 0); // target 50, roll 60, margin -10
    expect(result.outcome).toBe('fail');
    expect(result.moraleChange).toBe(-5);
    vi.restoreAllMocks();
  });

  it('returns critical_fail with -10 morale when margin < -20', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.89); // roll = 90
    const result = rollGraduatedValor(50, 0); // target 50, roll 90, margin -40
    expect(result.outcome).toBe('critical_fail');
    expect(result.moraleChange).toBe(-10);
    vi.restoreAllMocks();
  });

  it('applies difficultyMod to the target', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.49); // roll = 50
    const easier = rollGraduatedValor(50, 10); // target 60
    expect(easier.target).toBe(60);
    expect(easier.outcome).toBe('pass'); // margin = 60 - 50 = 10

    vi.restoreAllMocks();
    vi.spyOn(Math, 'random').mockReturnValue(0.49); // roll = 50
    const harder = rollGraduatedValor(50, -10); // target 40
    expect(harder.target).toBe(40);
    expect(harder.outcome).toBe('fail'); // margin = 40 - 50 = -10

    vi.restoreAllMocks();
  });

  it('clamps target to minimum 5', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.0); // roll = 1
    const result = rollGraduatedValor(0, -100);
    expect(result.target).toBe(5);
    vi.restoreAllMocks();
  });

  it('clamps target to maximum 95', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99); // roll = 100
    const result = rollGraduatedValor(100, 100);
    expect(result.target).toBe(95);
    vi.restoreAllMocks();
  });

  it('always returns a narrative string', () => {
    for (let i = 0; i < 100; i++) {
      const result = rollGraduatedValor(50, 0);
      expect(typeof result.narrative).toBe('string');
      expect(result.narrative.length).toBeGreaterThan(0);
    }
  });

  it('produces all four outcomes over many rolls', () => {
    const outcomes = new Set<string>();
    for (let i = 0; i < 1000; i++) {
      const result = rollGraduatedValor(50, 0);
      outcomes.add(result.outcome);
    }
    expect(outcomes.has('great_success')).toBe(true);
    expect(outcomes.has('pass')).toBe(true);
    expect(outcomes.has('fail')).toBe(true);
    expect(outcomes.has('critical_fail')).toBe(true);
  });

  it('returns a rounded target value', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const result = rollGraduatedValor(33, -7); // target = 26
    expect(result.target).toBe(Math.round(result.target));
    vi.restoreAllMocks();
  });
});
