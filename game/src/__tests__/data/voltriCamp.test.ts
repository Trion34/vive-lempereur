import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  VOLTRI_FORCED_EVENTS,
} from '../../data/battles/voltri/camp';
import { PlayerCharacter, NPC, NPCRole, MilitaryRank, CampState } from '../../types';

// Mock stats module for controlling rollStat in Ligurian Girl follow-up check
vi.mock('../../core/stats', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    rollStat: vi.fn((_statValue: number, _modifier: number, _difficulty: number) => ({
      success: true,
      roll: 30,
      target: 50,
      margin: 20,
    })),
  };
});

import { rollStat } from '../../core/stats';
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
    attributes: {},
    virtue: 0,
    sous: 0,
    equipment: {
      musket: 'Charleville 1777',
      bayonet: 'Standard',
      musketCondition: 80,
      uniformCondition: 60,
    },
    ...overrides,
  };
}

function makeNPCs(): NPC[] {
  return [
    {
      id: 'morin',
      name: 'Sergeant Morin',
      role: NPCRole.NCO,
      rank: MilitaryRank.Sergeant,
      relationship: 30,
      alive: true,
      wounded: false,
      morale: 90,
      maxMorale: 100,
      valor: 60,
    },
    {
      id: 'vidal',
      name: 'Lieutenant Vidal',
      role: NPCRole.Officer,
      rank: MilitaryRank.Lieutenant,
      relationship: 20,
      alive: true,
      wounded: false,
      morale: 80,
      maxMorale: 100,
      valor: 45,
    },
    {
      id: 'felix',
      name: 'Felix Martel',
      role: NPCRole.Neighbour,
      rank: MilitaryRank.Private,
      relationship: 10,
      alive: true,
      wounded: false,
      morale: 75,
      maxMorale: 85,
      valor: 30,
    },
  ];
}

function makeCamp(overrides: Partial<CampState> = {}): CampState {
  return {
    day: 1,
    actionsTotal: 12,
    actionsRemaining: 10,
    conditions: {
      weather: 'clear',
      supplyLevel: 'scarce',
      campMorale: 'steady',
      location: 'Voltri',
    },
    log: [],
    completedActivities: [],
    triggeredEvents: [],
    batheCooldown: 0,
    prayedThisCamp: false,
    campId: 'voltri-garrison',
    flags: {},
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Forced Event Configs
// ---------------------------------------------------------------------------
describe('VOLTRI_FORCED_EVENTS', () => {
  it('has 5 forced events', () => {
    expect(VOLTRI_FORCED_EVENTS).toHaveLength(5);
  });

  it('each has a getEvent that returns a valid CampEvent', () => {
    for (const config of VOLTRI_FORCED_EVENTS) {
      const event = config.getEvent(makeCamp(), makePlayer());
      expect(event.id).toBe(config.id);
      expect(event.title).toBeTruthy();
      expect(event.narrative.length).toBeGreaterThan(20);
      expect(event.choices.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('trigger thresholds are in descending order', () => {
    const thresholds = VOLTRI_FORCED_EVENTS.map((e: { triggerAt: number }) => e.triggerAt);
    for (let i = 1; i < thresholds.length; i++) {
      expect(thresholds[i]).toBeLessThan(thresholds[i - 1]);
    }
  });

  it('all event IDs are unique', () => {
    const ids = VOLTRI_FORCED_EVENTS.map((e: { id: string }) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('event schedule matches expected: gambling(10), coast(8), girl(6), merchant(4), theft(2)', () => {
    const schedule = VOLTRI_FORCED_EVENTS.map((e: { id: string; triggerAt: number }) => [e.id, e.triggerAt]);
    expect(schedule).toEqual([
      ['voltri_gambling_invitation', 10],
      ['voltri_coast_at_night', 8],
      ['voltri_ligurian_girl', 6],
      ['voltri_genoese_merchant', 4],
      ['voltri_theft_opportunity', 2],
    ]);
  });
});

// ---------------------------------------------------------------------------
// Gambling Invitation
// ---------------------------------------------------------------------------
describe('Gambling Invitation outcome resolver', () => {
  const config = VOLTRI_FORCED_EVENTS.find((e) => e.id === 'voltri_gambling_invitation')!;

  it('join_game with enough sous gives flagChanges.gambling_accepted', () => {
    const result = config.resolveChoice(makeCamp(), makePlayer({ sous: 5 }), makeNPCs(), 'join_game', true);
    expect(result.flagChanges?.gambling_accepted).toBe(true);
  });

  it('join_game with insufficient sous gives morale -1 and no flag', () => {
    const result = config.resolveChoice(makeCamp(), makePlayer({ sous: 0 }), makeNPCs(), 'join_game', true);
    expect(result.moraleChange).toBe(-1);
    expect(result.flagChanges).toBeUndefined();
  });

  it('watch gives morale +1, relationship, and gambling_accepted flag', () => {
    const result = config.resolveChoice(makeCamp(), makePlayer(), makeNPCs(), 'watch', true);
    expect(result.moraleChange).toBe(1);
    expect(result.flagChanges?.gambling_accepted).toBe(true);
    expect(result.npcChanges?.find((c: { npcId: string }) => c.npcId === 'felix')?.relationship).toBe(3);
  });

  it('decline gives morale 0 and no flag', () => {
    const result = config.resolveChoice(makeCamp(), makePlayer(), makeNPCs(), 'decline', true);
    expect(result.moraleChange).toBe(0);
    expect(result.flagChanges).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Coast at Night
// ---------------------------------------------------------------------------
describe('Coast at Night outcome resolver', () => {
  const config = VOLTRI_FORCED_EVENTS.find((e) => e.id === 'voltri_coast_at_night')!;

  it('write_letter gives morale +5 and stamina +2', () => {
    const result = config.resolveChoice(makeCamp(), makePlayer(), makeNPCs(), 'write_letter', true);
    expect(result.moraleChange).toBe(5);
    expect(result.staminaChange).toBe(2);
  });

  it('write_letter choice is locked for illiterate players', () => {
    const event = config.getEvent(makeCamp(), makePlayer({ attributes: {} }));
    const writeChoice = event.choices.find((c) => c.id === 'write_letter')!;
    expect(writeChoice.locked).toBe(true);
  });

  it('write_letter choice is unlocked for literate players', () => {
    const event = config.getEvent(makeCamp(), makePlayer({ attributes: { literate: true } }));
    const writeChoice = event.choices.find((c) => c.id === 'write_letter')!;
    expect(writeChoice.locked).toBeFalsy();
  });

  it('watch_sea gives stamina +2 and morale +2', () => {
    const result = config.resolveChoice(makeCamp(), makePlayer(), makeNPCs(), 'watch_sea', true);
    expect(result.staminaChange).toBe(2);
    expect(result.moraleChange).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// The Ligurian Girl
// ---------------------------------------------------------------------------
describe('The Ligurian Girl outcome resolver', () => {
  const config = VOLTRI_FORCED_EVENTS.find((e) => e.id === 'voltri_ligurian_girl')!;

  beforeEach(() => {
    mockedRollStat.mockReset();
    mockedRollStat.mockReturnValue({ success: true, roll: 30, target: 50, margin: 20 });
  });

  it('step_in charisma pass gives soldierRep +2, morale +3, virtue +5, and ligurian_girl_saved flag', () => {
    const result = config.resolveChoice(makeCamp(), makePlayer(), makeNPCs(), 'step_in', true);
    expect(result.statChanges.soldierRep).toBe(2);
    expect(result.moraleChange).toBe(3);
    expect(result.virtueChange).toBe(5);
    expect(result.flagChanges?.ligurian_girl_saved).toBe(true);
  });

  it('step_in charisma fail + elan win gives soldierRep +3, morale +2, virtue +5', () => {
    mockedRollStat.mockReturnValue({ success: true, roll: 30, target: 50, margin: 20 });
    const result = config.resolveChoice(makeCamp(), makePlayer(), makeNPCs(), 'step_in', false);
    expect(result.statChanges.soldierRep).toBe(3);
    expect(result.moraleChange).toBe(2);
    expect(result.virtueChange).toBe(5);
    expect(result.flagChanges?.ligurian_girl_saved).toBe(true);
  });

  it('step_in charisma fail + elan lose gives health/stamina loss, still saves girl', () => {
    mockedRollStat.mockReturnValue({ success: false, roll: 70, target: 50, margin: -20 });
    const result = config.resolveChoice(makeCamp(), makePlayer(), makeNPCs(), 'step_in', false);
    expect(result.moraleChange).toBe(-2);
    expect(result.staminaChange).toBe(-5);
    expect(result.healthChange).toBe(-5);
    expect(result.virtueChange).toBe(5);
    expect(result.flagChanges?.ligurian_girl_saved).toBe(true);
  });

  it('fetch_morin pass gives officerRep +2, morale +2, virtue +5, and morin relationship +3', () => {
    const result = config.resolveChoice(makeCamp(), makePlayer(), makeNPCs(), 'fetch_morin', true);
    expect(result.statChanges.officerRep).toBe(2);
    expect(result.moraleChange).toBe(2);
    expect(result.virtueChange).toBe(5);
    expect(result.flagChanges?.ligurian_girl_saved).toBe(true);
    expect(result.npcChanges!.find((c: { npcId: string }) => c.npcId === 'morin')?.relationship).toBe(3);
  });

  it('fetch_morin fail gives morale -3 and no ligurian_girl_saved flag', () => {
    const result = config.resolveChoice(makeCamp(), makePlayer(), makeNPCs(), 'fetch_morin', false);
    expect(result.moraleChange).toBe(-3);
    expect(result.flagChanges).toBeUndefined();
  });

  it('look_away gives morale -2 and virtue -5', () => {
    const result = config.resolveChoice(makeCamp(), makePlayer(), makeNPCs(), 'look_away', true);
    expect(result.moraleChange).toBe(-2);
    expect(result.virtueChange).toBe(-5);
  });
});

// ---------------------------------------------------------------------------
// Genoese Merchant
// ---------------------------------------------------------------------------
describe('Genoese Merchant outcome resolver', () => {
  const config = VOLTRI_FORCED_EVENTS.find((e) => e.id === 'voltri_genoese_merchant')!;

  it('spot_cheating pass gives soldierRep +2, morale +3, and morin relationship +2', () => {
    const result = config.resolveChoice(makeCamp(), makePlayer(), makeNPCs(), 'spot_cheating', true);
    expect(result.statChanges.soldierRep).toBe(2);
    expect(result.moraleChange).toBe(3);
    expect(result.npcChanges!.find((c: { npcId: string }) => c.npcId === 'morin')?.relationship).toBe(2);
  });

  it('spot_cheating fail gives morale -1 and sous -1', () => {
    const result = config.resolveChoice(makeCamp(), makePlayer(), makeNPCs(), 'spot_cheating', false);
    expect(result.moraleChange).toBe(-1);
    expect(result.sousChange).toBe(-1);
  });

  it('haggle pass gives soldierRep +1, morale +3, sous -1', () => {
    const result = config.resolveChoice(makeCamp(), makePlayer(), makeNPCs(), 'haggle', true);
    expect(result.statChanges.soldierRep).toBe(1);
    expect(result.moraleChange).toBe(3);
    expect(result.sousChange).toBe(-1);
  });

  it('haggle fail gives morale -1 and sous -2', () => {
    const result = config.resolveChoice(makeCamp(), makePlayer(), makeNPCs(), 'haggle', false);
    expect(result.moraleChange).toBe(-1);
    expect(result.sousChange).toBe(-2);
  });
});

// ---------------------------------------------------------------------------
// Theft Opportunity
// ---------------------------------------------------------------------------
describe('Theft Opportunity outcome resolver', () => {
  const config = VOLTRI_FORCED_EVENTS.find((e) => e.id === 'voltri_theft_opportunity')!;

  it('has a condition that requires gambling_accepted flag', () => {
    expect(config.condition).toBeDefined();
    expect(config.condition!(makeCamp({ flags: {} }), makePlayer())).toBe(false);
    expect(config.condition!(makeCamp({ flags: { gambling_accepted: true } }), makePlayer())).toBe(true);
  });

  it('join_theft success gives sous +3, virtue -10', () => {
    const result = config.resolveChoice(makeCamp(), makePlayer(), makeNPCs(), 'join_theft', true);
    expect(result.sousChange).toBe(3);
    expect(result.virtueChange).toBe(-10);
    expect(result.moraleChange).toBe(2);
  });

  it('join_theft failure gives officerRep -5, virtue -5, morin relationship -5', () => {
    const result = config.resolveChoice(makeCamp(), makePlayer(), makeNPCs(), 'join_theft', false);
    expect(result.statChanges.officerRep).toBe(-5);
    expect(result.virtueChange).toBe(-5);
    expect(result.moraleChange).toBe(-3);
    expect(result.npcChanges!.find((c: { npcId: string }) => c.npcId === 'morin')?.relationship).toBe(-5);
  });

  it('refuse gives morale +1, virtue +3', () => {
    const result = config.resolveChoice(makeCamp(), makePlayer(), makeNPCs(), 'refuse', true);
    expect(result.moraleChange).toBe(1);
    expect(result.virtueChange).toBe(3);
  });
});
