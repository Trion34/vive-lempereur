import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  resolveRest,
  resolveExercise,
  resolveArmsTraining,
  statResultText,
} from '../../core/campActivities';
import {
  PlayerCharacter,
  MilitaryRank,
  CampState,
  ARMS_TRAINING_TIERS,
} from '../../types';

// Mock the stats module to control randomness
vi.mock('../../core/stats', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    rollD100: vi.fn(() => 50),
    rollStat: vi.fn((_statValue: number, _modifier: number, _difficulty: number) => ({
      success: true,
      roll: 30,
      target: 50,
      margin: 20,
    })),
  };
});

import { rollD100, rollStat } from '../../core/stats';

const mockedRollD100 = vi.mocked(rollD100);
const mockedRollStat = vi.mocked(rollStat);

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
      location: 'Rivoli',
    },
    log: [],
    completedActivities: [],
    triggeredEvents: [],
    batheCooldown: 0,
    prayedThisCamp: false,
    campId: 'test-camp',
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  // Default: rollD100 returns 50 (mid-range)
  mockedRollD100.mockReturnValue(50);
});

// ---------------------------------------------------------------------------
// resolveRest
// ---------------------------------------------------------------------------
describe('resolveRest', () => {
  describe('lay_about', () => {
    it('returns staminaChange of 20 plus weather and endurance bonuses for cold weather', () => {
      // cold weather => weatherBonus = 0
      // endurance 40 => enduranceBonus = floor(40/20) = 2
      const result = resolveRest(makePlayer({ endurance: 40 }), makeCamp(), 'lay_about');
      expect(result.staminaChange).toBe(20 + 0 + 2); // 22
    });

    it('adds weather bonus for clear weather', () => {
      const camp = makeCamp({
        conditions: {
          weather: 'clear',
          supplyLevel: 'scarce',
          campMorale: 'steady',
          location: 'Rivoli',
        },
      });
      // clear => +5, endurance 40 => floor(40/20)=2
      const result = resolveRest(makePlayer({ endurance: 40 }), camp, 'lay_about');
      expect(result.staminaChange).toBe(20 + 5 + 2); // 27
    });

    it('subtracts weather penalty for rain', () => {
      const camp = makeCamp({
        conditions: {
          weather: 'rain',
          supplyLevel: 'scarce',
          campMorale: 'steady',
          location: 'Rivoli',
        },
      });
      // rain => -5, endurance 40 => 2
      const result = resolveRest(makePlayer({ endurance: 40 }), camp, 'lay_about');
      expect(result.staminaChange).toBe(20 - 5 + 2); // 17
    });

    it('calculates endurance bonus as floor(endurance / 20)', () => {
      // endurance 100 => floor(100/20) = 5, cold => 0
      const result = resolveRest(makePlayer({ endurance: 100 }), makeCamp(), 'lay_about');
      expect(result.staminaChange).toBe(20 + 0 + 5); // 25
    });

    it('returns moraleChange of 3', () => {
      const result = resolveRest(makePlayer(), makeCamp(), 'lay_about');
      expect(result.moraleChange).toBe(3);
    });

    it('returns healthChange of 5', () => {
      const result = resolveRest(makePlayer(), makeCamp(), 'lay_about');
      expect(result.healthChange).toBe(5);
    });

    it('returns empty statChanges', () => {
      const result = resolveRest(makePlayer(), makeCamp(), 'lay_about');
      expect(result.statChanges).toEqual({});
    });

    it('returns a log entry with activity type', () => {
      const result = resolveRest(makePlayer(), makeCamp(), 'lay_about');
      expect(result.log.length).toBeGreaterThanOrEqual(1);
      expect(result.log[0].type).toBe('activity');
    });

    it('defaults to lay_about when no subChoice provided', () => {
      const result = resolveRest(makePlayer({ endurance: 40 }), makeCamp());
      // Should match lay_about: staminaChange = 20 + 0 (cold) + 2 (end 40)
      expect(result.staminaChange).toBe(22);
      expect(result.moraleChange).toBe(3);
      expect(result.healthChange).toBe(5);
    });
  });

  describe('bathe', () => {
    it('returns staminaChange of 30', () => {
      const result = resolveRest(makePlayer(), makeCamp(), 'bathe');
      expect(result.staminaChange).toBe(30);
    });

    it('returns moraleChange of 5', () => {
      const result = resolveRest(makePlayer(), makeCamp(), 'bathe');
      expect(result.moraleChange).toBe(5);
    });

    it('returns healthChange of 8', () => {
      const result = resolveRest(makePlayer(), makeCamp(), 'bathe');
      expect(result.healthChange).toBe(8);
    });

    it('returns empty statChanges', () => {
      const result = resolveRest(makePlayer(), makeCamp(), 'bathe');
      expect(result.statChanges).toEqual({});
    });

    it('returns a log entry', () => {
      const result = resolveRest(makePlayer(), makeCamp(), 'bathe');
      expect(result.log.length).toBeGreaterThanOrEqual(1);
      expect(result.log[0].type).toBe('activity');
    });
  });

  describe('pray', () => {
    it('returns valor +1 in statChanges', () => {
      const result = resolveRest(makePlayer(), makeCamp(), 'pray');
      expect(result.statChanges).toEqual({ valor: 1 });
    });

    it('returns staminaChange of 10', () => {
      const result = resolveRest(makePlayer(), makeCamp(), 'pray');
      expect(result.staminaChange).toBe(10);
    });

    it('returns moraleChange of 7', () => {
      const result = resolveRest(makePlayer(), makeCamp(), 'pray');
      expect(result.moraleChange).toBe(7);
    });

    it('returns healthChange of 3', () => {
      const result = resolveRest(makePlayer(), makeCamp(), 'pray');
      expect(result.healthChange).toBe(3);
    });

    it('produces a result log entry with valor gain text', () => {
      const result = resolveRest(makePlayer(), makeCamp(), 'pray');
      const resultEntries = result.log.filter((e) => e.type === 'result');
      expect(resultEntries.length).toBeGreaterThanOrEqual(1);
      expect(resultEntries[0].text).toContain('Valor');
      expect(resultEntries[0].text).toContain('+1');
    });
  });
});

// ---------------------------------------------------------------------------
// resolveExercise
// ---------------------------------------------------------------------------
describe('resolveExercise', () => {
  describe('haul (strength + endurance)', () => {
    it('returns +1 for both stats when rolls pass', () => {
      // strength=40, target1=100-40=60, roll<=60 => pass
      // endurance=40, target2=100-40=60, roll<=60 => pass
      mockedRollD100.mockReturnValueOnce(30).mockReturnValueOnce(30);
      const result = resolveExercise(makePlayer(), makeCamp(), 'haul');
      expect(result.statChanges).toHaveProperty('strength', 1);
      expect(result.statChanges).toHaveProperty('endurance', 1);
    });

    it('returns +1 for only the first stat when only first roll passes', () => {
      // roll1=30 <= 60 => pass, roll2=90 > 60 => fail
      mockedRollD100.mockReturnValueOnce(30).mockReturnValueOnce(90);
      const result = resolveExercise(makePlayer(), makeCamp(), 'haul');
      expect(result.statChanges).toHaveProperty('strength', 1);
      expect(result.statChanges).not.toHaveProperty('endurance');
    });

    it('returns +1 for only the second stat when only second roll passes', () => {
      // roll1=90 > 60 => fail, roll2=30 <= 60 => pass
      mockedRollD100.mockReturnValueOnce(90).mockReturnValueOnce(30);
      const result = resolveExercise(makePlayer(), makeCamp(), 'haul');
      expect(result.statChanges).not.toHaveProperty('strength');
      expect(result.statChanges).toHaveProperty('endurance', 1);
    });

    it('returns empty statChanges when both rolls fail', () => {
      // roll1=90 > 60, roll2=95 > 60
      mockedRollD100.mockReturnValueOnce(90).mockReturnValueOnce(95);
      const result = resolveExercise(makePlayer(), makeCamp(), 'haul');
      expect(result.statChanges).toEqual({});
    });

    it('returns staminaChange of -10', () => {
      mockedRollD100.mockReturnValueOnce(50).mockReturnValueOnce(50);
      const result = resolveExercise(makePlayer(), makeCamp(), 'haul');
      expect(result.staminaChange).toBe(-10);
    });

    it('returns moraleChange +2 when both pass', () => {
      mockedRollD100.mockReturnValueOnce(10).mockReturnValueOnce(10);
      const result = resolveExercise(makePlayer(), makeCamp(), 'haul');
      expect(result.moraleChange).toBe(2);
    });

    it('returns moraleChange 0 when exactly one passes', () => {
      mockedRollD100.mockReturnValueOnce(10).mockReturnValueOnce(99);
      const result = resolveExercise(makePlayer(), makeCamp(), 'haul');
      expect(result.moraleChange).toBe(0);
    });

    it('returns moraleChange -1 when both fail', () => {
      mockedRollD100.mockReturnValueOnce(99).mockReturnValueOnce(99);
      const result = resolveExercise(makePlayer(), makeCamp(), 'haul');
      expect(result.moraleChange).toBe(-1);
    });

    it('includes two result log entries (one per stat)', () => {
      mockedRollD100.mockReturnValueOnce(30).mockReturnValueOnce(30);
      const result = resolveExercise(makePlayer(), makeCamp(), 'haul');
      const resultEntries = result.log.filter((e) => e.type === 'result');
      expect(resultEntries).toHaveLength(2);
    });

    it('uses success narrative when at least one stat passes', () => {
      mockedRollD100.mockReturnValueOnce(10).mockReturnValueOnce(99);
      const result = resolveExercise(makePlayer(), makeCamp(), 'haul');
      const activity = result.log.find((e) => e.type === 'activity');
      expect(activity?.text).toContain('getting stronger');
    });

    it('uses fail narrative when both stats fail', () => {
      mockedRollD100.mockReturnValueOnce(99).mockReturnValueOnce(99);
      const result = resolveExercise(makePlayer(), makeCamp(), 'haul');
      const activity = result.log.find((e) => e.type === 'activity');
      expect(activity?.text).toContain('not getting any stronger');
    });
  });

  describe('wrestle (strength + constitution)', () => {
    it('tests strength and constitution', () => {
      // strength=40 => target=60, constitution=45 => target=55
      // Both pass with low rolls
      mockedRollD100.mockReturnValueOnce(10).mockReturnValueOnce(10);
      const result = resolveExercise(makePlayer(), makeCamp(), 'wrestle');
      expect(result.statChanges).toHaveProperty('strength', 1);
      expect(result.statChanges).toHaveProperty('constitution', 1);
    });

    it('fails constitution with high roll', () => {
      // strength=40 => target=60, roll 30 => pass
      // constitution=45 => target=55, roll 80 => fail
      mockedRollD100.mockReturnValueOnce(30).mockReturnValueOnce(80);
      const result = resolveExercise(makePlayer(), makeCamp(), 'wrestle');
      expect(result.statChanges).toHaveProperty('strength', 1);
      expect(result.statChanges).not.toHaveProperty('constitution');
    });
  });

  describe('run (endurance + constitution)', () => {
    it('tests endurance and constitution', () => {
      // endurance=40 => target=60, constitution=45 => target=55
      mockedRollD100.mockReturnValueOnce(10).mockReturnValueOnce(10);
      const result = resolveExercise(makePlayer(), makeCamp(), 'run');
      expect(result.statChanges).toHaveProperty('endurance', 1);
      expect(result.statChanges).toHaveProperty('constitution', 1);
    });

    it('uses run-specific narrative on success', () => {
      mockedRollD100.mockReturnValueOnce(10).mockReturnValueOnce(10);
      const result = resolveExercise(makePlayer(), makeCamp(), 'run');
      const activity = result.log.find((e) => e.type === 'activity');
      expect(activity?.text).toContain('camp perimeter');
    });
  });

  describe('roll-against logic', () => {
    it('passes when roll equals target (boundary)', () => {
      // strength=40 => target=60, roll=60 => pass (roll <= target)
      mockedRollD100.mockReturnValueOnce(60).mockReturnValueOnce(99);
      const result = resolveExercise(makePlayer(), makeCamp(), 'haul');
      expect(result.statChanges).toHaveProperty('strength', 1);
    });

    it('fails when roll is one above target', () => {
      // strength=40 => target=60, roll=61 => fail
      mockedRollD100.mockReturnValueOnce(61).mockReturnValueOnce(99);
      const result = resolveExercise(makePlayer(), makeCamp(), 'haul');
      expect(result.statChanges).not.toHaveProperty('strength');
    });

    it('harder to pass with higher stat (smaller target)', () => {
      // strength=90 => target=10 (harder)
      const player = makePlayer({ strength: 90, endurance: 90 });
      mockedRollD100.mockReturnValueOnce(50).mockReturnValueOnce(50);
      const result = resolveExercise(player, makeCamp(), 'haul');
      expect(result.statChanges).toEqual({});
    });

    it('defaults to haul when no subChoice provided', () => {
      mockedRollD100.mockReturnValueOnce(10).mockReturnValueOnce(10);
      const result = resolveExercise(makePlayer(), makeCamp());
      // haul = strength + endurance
      expect(result.statChanges).toHaveProperty('strength', 1);
      expect(result.statChanges).toHaveProperty('endurance', 1);
    });
  });
});

// ---------------------------------------------------------------------------
// resolveArmsTraining
// ---------------------------------------------------------------------------
describe('resolveArmsTraining', () => {
  describe('cap check', () => {
    it('returns no stat gain when stat is at the solo cap (50)', () => {
      const player = makePlayer({ musketry: 50 });
      const result = resolveArmsTraining(player, makeCamp(), 'solo_musketry');
      expect(result.statChanges).toEqual({});
    });

    it('returns no stat gain when stat exceeds the solo cap', () => {
      const player = makePlayer({ musketry: 60 });
      const result = resolveArmsTraining(player, makeCamp(), 'solo_musketry');
      expect(result.statChanges).toEqual({});
    });

    it('returns staminaChange of -10 even when capped', () => {
      const player = makePlayer({ musketry: 50 });
      const result = resolveArmsTraining(player, makeCamp(), 'solo_musketry');
      expect(result.staminaChange).toBe(-10);
    });

    it('returns moraleChange of 0 when capped', () => {
      const player = makePlayer({ musketry: 50 });
      const result = resolveArmsTraining(player, makeCamp(), 'solo_musketry');
      expect(result.moraleChange).toBe(0);
    });

    it('uses capped narrative when stat is at cap', () => {
      const player = makePlayer({ musketry: 50 });
      const result = resolveArmsTraining(player, makeCamp(), 'solo_musketry');
      const activity = result.log.find((e) => e.type === 'activity');
      expect(activity?.text).toContain("learned all you can on your own");
    });

    it('logs a result entry indicating cap reached', () => {
      const player = makePlayer({ musketry: 50 });
      const result = resolveArmsTraining(player, makeCamp(), 'solo_musketry');
      const resultEntry = result.log.find((e) => e.type === 'result');
      expect(resultEntry?.text).toContain('capped');
    });

    it('respects comrades cap (70)', () => {
      const player = makePlayer({ elan: 70 });
      const result = resolveArmsTraining(player, makeCamp(), 'comrades_elan');
      expect(result.statChanges).toEqual({});
    });

    it('respects officers cap (85)', () => {
      const player = makePlayer({ musketry: 85 });
      const result = resolveArmsTraining(player, makeCamp(), 'officers_musketry');
      expect(result.statChanges).toEqual({});
    });
  });

  describe('diminishing returns and success', () => {
    it('grants +1 stat on successful roll', () => {
      // musketry=35, solo cap=50, target=min(80, max(0, (50-35)*2))=min(80,30)=30
      // roll must be <= 30 to succeed
      mockedRollD100.mockReturnValueOnce(10);
      const result = resolveArmsTraining(makePlayer(), makeCamp(), 'solo_musketry');
      expect(result.statChanges).toEqual({ musketry: 1 });
    });

    it('returns empty statChanges on failed roll', () => {
      // target=30, roll=50 => fail
      mockedRollD100.mockReturnValueOnce(50);
      const result = resolveArmsTraining(makePlayer(), makeCamp(), 'solo_musketry');
      expect(result.statChanges).toEqual({});
    });

    it('calculates target as min(maxChance, max(0, (cap - statVal) * 2))', () => {
      // solo: cap=50, maxChance=80
      // musketry=35 => target = min(80, max(0, (50-35)*2)) = min(80, 30) = 30
      // roll=30 => pass (exactly at target)
      mockedRollD100.mockReturnValueOnce(30);
      const result = resolveArmsTraining(makePlayer({ musketry: 35 }), makeCamp(), 'solo_musketry');
      expect(result.statChanges).toEqual({ musketry: 1 });
    });

    it('fails when roll is one above target', () => {
      // target = 30, roll = 31 => fail
      mockedRollD100.mockReturnValueOnce(31);
      const result = resolveArmsTraining(makePlayer({ musketry: 35 }), makeCamp(), 'solo_musketry');
      expect(result.statChanges).toEqual({});
    });

    it('uses maxChance when stat is very low (large gap to cap)', () => {
      // solo: cap=50, maxChance=80
      // musketry=0 => target = min(80, max(0, (50-0)*2)) = min(80, 100) = 80
      mockedRollD100.mockReturnValueOnce(80);
      const player = makePlayer({ musketry: 0 });
      const result = resolveArmsTraining(player, makeCamp(), 'solo_musketry');
      expect(result.statChanges).toEqual({ musketry: 1 });
    });

    it('target shrinks as stat approaches cap', () => {
      // solo: cap=50, maxChance=80
      // musketry=49 => target = min(80, max(0, (50-49)*2)) = min(80, 2) = 2
      mockedRollD100.mockReturnValueOnce(3);
      const player = makePlayer({ musketry: 49 });
      const result = resolveArmsTraining(player, makeCamp(), 'solo_musketry');
      expect(result.statChanges).toEqual({}); // roll 3 > target 2
    });

    it('returns moraleChange +1 on success', () => {
      mockedRollD100.mockReturnValueOnce(1);
      const result = resolveArmsTraining(makePlayer(), makeCamp(), 'solo_musketry');
      expect(result.moraleChange).toBe(1);
    });

    it('returns moraleChange -1 on failure', () => {
      mockedRollD100.mockReturnValueOnce(99);
      const result = resolveArmsTraining(makePlayer(), makeCamp(), 'solo_musketry');
      expect(result.moraleChange).toBe(-1);
    });

    it('returns staminaChange of -10', () => {
      mockedRollD100.mockReturnValueOnce(50);
      const result = resolveArmsTraining(makePlayer(), makeCamp(), 'solo_musketry');
      expect(result.staminaChange).toBe(-10);
    });
  });

  describe('elan sub-activities', () => {
    it('trains elan with solo_elan', () => {
      // elan=35, solo cap=50, target=min(80, (50-35)*2)=30
      mockedRollD100.mockReturnValueOnce(10);
      const result = resolveArmsTraining(makePlayer(), makeCamp(), 'solo_elan');
      expect(result.statChanges).toEqual({ elan: 1 });
    });

    it('trains elan with comrades_elan', () => {
      // elan=35, comrades cap=70, target=min(85, (70-35)*2)=min(85,70)=70
      mockedRollD100.mockReturnValueOnce(50);
      const result = resolveArmsTraining(makePlayer(), makeCamp(), 'comrades_elan');
      expect(result.statChanges).toEqual({ elan: 1 });
    });

    it('trains elan with officers_elan', () => {
      // elan=35, officers cap=85, target=min(90, (85-35)*2)=min(90,100)=90
      mockedRollD100.mockReturnValueOnce(80);
      const result = resolveArmsTraining(makePlayer(), makeCamp(), 'officers_elan');
      expect(result.statChanges).toEqual({ elan: 1 });
    });
  });

  describe('log entries', () => {
    it('includes activity and result log entries on success', () => {
      mockedRollD100.mockReturnValueOnce(1);
      const result = resolveArmsTraining(makePlayer(), makeCamp(), 'solo_musketry');
      const activityEntries = result.log.filter((e) => e.type === 'activity');
      const resultEntries = result.log.filter((e) => e.type === 'result');
      expect(activityEntries).toHaveLength(1);
      expect(resultEntries).toHaveLength(1);
    });

    it('uses success narrative on success', () => {
      mockedRollD100.mockReturnValueOnce(1);
      const result = resolveArmsTraining(makePlayer(), makeCamp(), 'solo_musketry');
      const activity = result.log.find((e) => e.type === 'activity');
      expect(activity?.text).toContain('getting better');
    });

    it('uses fail narrative on failure', () => {
      mockedRollD100.mockReturnValueOnce(99);
      const result = resolveArmsTraining(makePlayer(), makeCamp(), 'solo_musketry');
      const activity = result.log.find((e) => e.type === 'activity');
      expect(activity?.text).toContain('not getting any better');
    });

    it('defaults to solo_musketry when no subChoice provided', () => {
      mockedRollD100.mockReturnValueOnce(1);
      const result = resolveArmsTraining(makePlayer(), makeCamp());
      expect(result.statChanges).toEqual({ musketry: 1 });
    });
  });
});

// ---------------------------------------------------------------------------
// statResultText
// ---------------------------------------------------------------------------
describe('statResultText', () => {
  it('returns flavor + "Strength +1" when gained', () => {
    expect(statResultText('strength', true)).toBe('The weight feels lighter. Strength +1');
  });

  it('returns flavor + "Strength \u2014" when not gained', () => {
    expect(statResultText('strength', false)).toBe("Your muscles won't cooperate. Strength \u2014");
  });

  it('returns flavor + "Endurance +1" when gained', () => {
    expect(statResultText('endurance', true)).toBe('Second wind. Endurance +1');
  });

  it('returns flavor + "Endurance \u2014" when not gained', () => {
    expect(statResultText('endurance', false)).toBe('Your lungs give out. Endurance \u2014');
  });

  it('returns flavor + "Constitution +1" when gained', () => {
    expect(statResultText('constitution', true)).toBe('Your body hardens. Constitution +1');
  });

  it('returns flavor + "Musketry +1" when gained', () => {
    expect(statResultText('musketry', true)).toBe('Your hands remember. Musketry +1');
  });

  it('returns flavor + "\u00c9lan +1" for elan when gained', () => {
    expect(statResultText('elan', true)).toBe('The blade feels natural. \u00c9lan +1');
  });

  it('returns flavor + "\u00c9lan \u2014" for elan when not gained', () => {
    expect(statResultText('elan', false)).toBe('The motions stay stiff. \u00c9lan \u2014');
  });

  it('returns flavor + "Valor +1" when gained', () => {
    expect(statResultText('valor', true)).toBe('Your nerve steadies. Valor +1');
  });

  it('returns flavor + "Awareness +1" when gained', () => {
    expect(statResultText('awareness', true)).toBe('You see what others miss. Awareness +1');
  });

  it('capitalizes unknown stats with first letter uppercase (no flavor)', () => {
    expect(statResultText('luck', true)).toBe('Luck +1');
    expect(statResultText('luck', false)).toBe('Luck \u2014');
  });
});
