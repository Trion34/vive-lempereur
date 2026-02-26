import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  rollPasseDix,
  resolvePasseDix,
  STAKE_CONFIG,
  type PasseDixStake,
  type PasseDixBet,
} from '../../core/passeDix';
import { PlayerCharacter, MilitaryRank, CampState } from '../../types';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function makePlayer(overrides: Partial<PlayerCharacter> = {}): PlayerCharacter {
  return {
    name: 'Test Soldier',
    rank: MilitaryRank.Private,
    musketry: 35,
    elan: 35,
    strength: 40,
    endurance: 40,
    constitution: 45,
    charisma: 30,
    intelligence: 30,
    awareness: 35,
    valor: 40,
    health: 70,
    morale: 65,
    stamina: 80,
    grace: 0,
    soldierRep: 0,
    officerRep: 50,
    napoleonRep: 0,
    frontRank: false,
    equipment: {
      musket: 'Charleville 1777',
      bayonet: 'Standard',
      musketCondition: 80,
      uniformCondition: 60,
    },
    ...overrides,
  };
}

function makeCamp(overrides: Partial<CampState> = {}): CampState {
  return {
    day: 1,
    actionsTotal: 16,
    actionsRemaining: 10,
    conditions: {
      weather: 'cold',
      supplyLevel: 'scarce',
      campMorale: 'steady',
      location: 'Rivoli Plateau',
    },
    log: [],
    completedActivities: [],
    triggeredEvents: [],
    health: 70,
    stamina: 80,
    morale: 65,
    batheCooldown: 0,
    prayedThisCamp: false,
    campId: 'test-camp',
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// rollPasseDix
// ---------------------------------------------------------------------------

describe('rollPasseDix', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns three dice values between 1 and 6', () => {
    const result = rollPasseDix();
    expect(result.dice).toHaveLength(3);
    for (const d of result.dice) {
      expect(d).toBeGreaterThanOrEqual(1);
      expect(d).toBeLessThanOrEqual(6);
    }
  });

  it('calculates total correctly', () => {
    const result = rollPasseDix();
    expect(result.total).toBe(result.dice[0] + result.dice[1] + result.dice[2]);
  });

  it('isPasse is true when total > 10', () => {
    // Force dice to roll high: 5, 4, 3 = 12
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(4 / 6) // die 1: floor(4/6*6)+1 = 5
      .mockReturnValueOnce(3 / 6) // die 2: floor(3/6*6)+1 = 4
      .mockReturnValueOnce(2 / 6); // die 3: floor(2/6*6)+1 = 3

    const result = rollPasseDix();
    expect(result.total).toBe(12);
    expect(result.isPasse).toBe(true);
  });

  it('isPasse is false when total <= 10', () => {
    // Force dice to roll low: 2, 3, 2 = 7
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(1 / 6) // die 1: 2
      .mockReturnValueOnce(2 / 6) // die 2: 3
      .mockReturnValueOnce(1 / 6); // die 3: 2

    const result = rollPasseDix();
    expect(result.total).toBe(7);
    expect(result.isPasse).toBe(false);
  });

  it('isPasse is false when total equals exactly 10', () => {
    // Force dice: 4, 3, 3 = 10
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(3 / 6) // die 1: 4
      .mockReturnValueOnce(2 / 6) // die 2: 3
      .mockReturnValueOnce(2 / 6); // die 3: 3

    const result = rollPasseDix();
    expect(result.total).toBe(10);
    expect(result.isPasse).toBe(false);
  });

  it('total range is 3-18', () => {
    // Run many rolls to check bounds
    for (let i = 0; i < 100; i++) {
      const result = rollPasseDix();
      expect(result.total).toBeGreaterThanOrEqual(3);
      expect(result.total).toBeLessThanOrEqual(18);
    }
  });
});

// ---------------------------------------------------------------------------
// STAKE_CONFIG
// ---------------------------------------------------------------------------

describe('STAKE_CONFIG', () => {
  it('has all three stake tiers', () => {
    expect(STAKE_CONFIG).toHaveProperty('low');
    expect(STAKE_CONFIG).toHaveProperty('medium');
    expect(STAKE_CONFIG).toHaveProperty('high');
  });

  it('higher stakes have higher rewards and penalties', () => {
    expect(STAKE_CONFIG.high.repWin).toBeGreaterThan(STAKE_CONFIG.medium.repWin);
    expect(STAKE_CONFIG.medium.repWin).toBeGreaterThan(STAKE_CONFIG.low.repWin);
    expect(STAKE_CONFIG.high.repLose).toBeLessThan(STAKE_CONFIG.medium.repLose);
    expect(STAKE_CONFIG.high.moraleWin).toBeGreaterThan(STAKE_CONFIG.low.moraleWin);
    expect(STAKE_CONFIG.high.moraleLose).toBeLessThan(STAKE_CONFIG.low.moraleLose);
  });
});

// ---------------------------------------------------------------------------
// resolvePasseDix
// ---------------------------------------------------------------------------

describe('resolvePasseDix', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns a win result when bet matches outcome (passe + total > 10)', () => {
    // Force high roll: 5, 4, 3 = 12 (passe)
    // Then a narrative random pick
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(4 / 6) // die 1: 5
      .mockReturnValueOnce(3 / 6) // die 2: 4
      .mockReturnValueOnce(2 / 6) // die 3: 3
      .mockReturnValueOnce(0.1); // narrative pick

    const player = makePlayer();
    const camp = makeCamp();
    const result = resolvePasseDix(player, camp, 'medium', 'passe');

    expect(result.statChanges).toEqual({ soldierRep: 3 });
    expect(result.moraleChange).toBe(4);
    expect(result.staminaChange).toBe(-5);
    expect(result.log.length).toBeGreaterThanOrEqual(2);
    expect(result.log.some((e) => e.type === 'activity')).toBe(true);
    expect(result.log.some((e) => e.type === 'result')).toBe(true);
  });

  it('returns a win result when bet matches outcome (manque + total <= 10)', () => {
    // Force low roll: 2, 3, 2 = 7 (manque)
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(1 / 6) // die 1: 2
      .mockReturnValueOnce(2 / 6) // die 2: 3
      .mockReturnValueOnce(1 / 6) // die 3: 2
      .mockReturnValueOnce(0.1); // narrative pick

    const player = makePlayer();
    const camp = makeCamp();
    const result = resolvePasseDix(player, camp, 'low', 'manque');

    expect(result.statChanges).toEqual({ soldierRep: 1 });
    expect(result.moraleChange).toBe(2);
  });

  it('returns a loss result when bet does not match outcome', () => {
    // Force high roll: 5, 4, 3 = 12 (passe), but player bet manque
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(4 / 6) // die 1: 5
      .mockReturnValueOnce(3 / 6) // die 2: 4
      .mockReturnValueOnce(2 / 6) // die 3: 3
      .mockReturnValueOnce(0.99) // awareness check roll (d100 = 100, will fail Hard check)
      .mockReturnValueOnce(0.1); // narrative pick

    const player = makePlayer({ awareness: 10 }); // low awareness = no cheat detection
    const camp = makeCamp();
    const result = resolvePasseDix(player, camp, 'high', 'manque');

    expect(result.statChanges).toEqual({ soldierRep: -3 });
    expect(result.moraleChange).toBe(-4);
    expect(result.staminaChange).toBe(-5);
  });

  it('detects cheating on loss when awareness is high', () => {
    // Force high roll: 5, 4, 3 = 12 (passe), but player bet manque
    // Then awareness check must pass (d100 <= target)
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(4 / 6) // die 1: 5
      .mockReturnValueOnce(3 / 6) // die 2: 4
      .mockReturnValueOnce(2 / 6) // die 3: 3
      .mockReturnValueOnce(0.01); // awareness check roll = 1 (very low, passes Hard check)

    const player = makePlayer({ awareness: 80 }); // very high awareness
    const camp = makeCamp();
    const result = resolvePasseDix(player, camp, 'high', 'manque');

    // Cheating detected: +1 rep, +1 morale (not the loss penalty)
    expect(result.statChanges).toEqual({ soldierRep: 1 });
    expect(result.moraleChange).toBe(1);
    expect(result.log.some((e) => e.text.includes('Cheating detected') || e.text.includes('Weighted dice'))).toBe(true);
  });

  it('low stake loss has no rep penalty', () => {
    // Force loss: high roll, bet manque
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(4 / 6) // die 1: 5
      .mockReturnValueOnce(3 / 6) // die 2: 4
      .mockReturnValueOnce(2 / 6) // die 3: 3
      .mockReturnValueOnce(0.99) // awareness check fails
      .mockReturnValueOnce(0.1); // narrative pick

    const player = makePlayer({ awareness: 5 });
    const camp = makeCamp();
    const result = resolvePasseDix(player, camp, 'low', 'manque');

    expect(result.statChanges).toEqual({}); // low stake: repLose = 0
    expect(result.moraleChange).toBe(-1);
  });

  it('always costs 5 stamina regardless of outcome', () => {
    const stakes: PasseDixStake[] = ['low', 'medium', 'high'];
    const bets: PasseDixBet[] = ['passe', 'manque'];

    for (const stake of stakes) {
      for (const bet of bets) {
        const result = resolvePasseDix(makePlayer(), makeCamp(), stake, bet);
        expect(result.staminaChange).toBe(-5);
      }
    }
  });

  it('includes dice values in narrative text', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(4 / 6) // die 1: 5
      .mockReturnValueOnce(3 / 6) // die 2: 4
      .mockReturnValueOnce(2 / 6) // die 3: 3
      .mockReturnValueOnce(0.1); // narrative pick

    const result = resolvePasseDix(makePlayer(), makeCamp(), 'medium', 'passe');
    const activityText = result.log.find((e) => e.type === 'activity')?.text || '';
    expect(activityText).toContain('5');
    expect(activityText).toContain('4');
    expect(activityText).toContain('3');
    expect(activityText).toContain('12');
  });
});
