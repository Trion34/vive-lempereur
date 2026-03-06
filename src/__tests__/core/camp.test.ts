import { describe, it, expect } from 'vitest';
import { createCampState, isCampComplete, triggerForcedEvent, clearPendingEvent } from '../../core/camp';
import { getCampActivityList } from '../../core/campActivities';
import {
  PlayerCharacter,
  NPC,
  NPCRole,
  MilitaryRank,
  CampActivityId,
  CampState,
  CampEventCategory,
} from '../../types';

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

function makeNPCs(): NPC[] {
  return [
    {
      id: 'pierre',
      name: 'Pierre',
      role: NPCRole.Neighbour,
      rank: MilitaryRank.Private,
      relationship: 20,
      alive: true,
      wounded: false,
      morale: 70,
      maxMorale: 100,
      valor: 45,
    },
    {
      id: 'jean-baptiste',
      name: 'Jean-Baptiste',
      role: NPCRole.Neighbour,
      rank: MilitaryRank.Private,
      relationship: 15,
      alive: true,
      wounded: false,
      morale: 55,
      maxMorale: 100,
      valor: 30,
    },
  ];
}

// ---------------------------------------------------------------------------
// createCampState
// ---------------------------------------------------------------------------
describe('createCampState', () => {
  it('sets day to 1', () => {
    const camp = createCampState(makePlayer(), makeNPCs(), {
      id: 'test-camp',
      title: 'Rivoli',
      actionsTotal: 16,
      weather: 'cold',
      supplyLevel: 'scarce',
      openingNarrative: 'Your company of the 14th demi-brigade',
      forcedEvents: [],
      randomEvents: [],
    });
    expect(camp.day).toBe(1);
  });

  it('sets actionsTotal and actionsRemaining from config.actions', () => {
    const camp = createCampState(makePlayer(), makeNPCs(), {
      id: 'test-camp',
      title: 'Rivoli',
      actionsTotal: 16,
      weather: 'cold',
      supplyLevel: 'scarce',
      openingNarrative: 'Your company of the 14th demi-brigade',
      forcedEvents: [],
      randomEvents: [],
    });
    expect(camp.actionsTotal).toBe(16);
    expect(camp.actionsRemaining).toBe(16);
  });

  it('respects a different actions count', () => {
    const camp = createCampState(makePlayer(), makeNPCs(), {
      id: 'test-camp',
      title: 'Rivoli',
      actionsTotal: 8,
      weather: 'cold',
      supplyLevel: 'scarce',
      openingNarrative: 'Your company of the 14th demi-brigade',
      forcedEvents: [],
      randomEvents: [],
    });
    expect(camp.actionsTotal).toBe(8);
    expect(camp.actionsRemaining).toBe(8);
  });

  it('sets campId from config', () => {
    const camp = createCampState(makePlayer(), makeNPCs(), {
      id: 'test-camp',
      title: 'Rivoli',
      actionsTotal: 16,
      weather: 'cold',
      supplyLevel: 'scarce',
      openingNarrative: 'Your company of the 14th demi-brigade',
      forcedEvents: [],
      randomEvents: [],
    });
    expect(camp.campId).toBe('test-camp');
  });

  it('sets conditions with cold weather, scarce supply, steady morale', () => {
    const camp = createCampState(makePlayer(), makeNPCs(), {
      id: 'test-camp',
      title: 'Rivoli',
      actionsTotal: 16,
      weather: 'cold',
      supplyLevel: 'scarce',
      openingNarrative: 'Your company of the 14th demi-brigade',
      forcedEvents: [],
      randomEvents: [],
    });
    expect(camp.conditions.weather).toBe('cold');
    expect(camp.conditions.supplyLevel).toBe('scarce');
    expect(camp.conditions.campMorale).toBe('steady');
  });

  it('sets conditions.location from config.title', () => {
    const camp = createCampState(makePlayer(), makeNPCs(), {
      id: 'verona-camp',
      title: 'Verona',
      actionsTotal: 16,
      weather: 'cold',
      supplyLevel: 'scarce',
      openingNarrative: '',
      forcedEvents: [],
      randomEvents: [],
    });
    expect(camp.conditions.location).toBe('Verona');
  });

  it('initializes log with one opening narrative entry', () => {
    const camp = createCampState(makePlayer(), makeNPCs(), {
      id: 'test-camp',
      title: 'Rivoli',
      actionsTotal: 16,
      weather: 'cold',
      supplyLevel: 'scarce',
      openingNarrative: 'Your company of the 14th demi-brigade',
      forcedEvents: [],
      randomEvents: [],
    });
    expect(camp.log).toHaveLength(1);
    expect(camp.log[0].type).toBe('narrative');
    expect(camp.log[0].day).toBe(1);
    expect(camp.log[0].text).toContain('14th demi-brigade');
  });

  it('does not copy health/stamina/morale from player (meters live on player only)', () => {
    const camp = createCampState(makePlayer({ health: 42, stamina: 55, morale: 90 }), makeNPCs(), {
      id: 'test-camp',
      title: 'Rivoli',
      actionsTotal: 16,
      weather: 'cold',
      supplyLevel: 'scarce',
      openingNarrative: 'Your company of the 14th demi-brigade',
      forcedEvents: [],
      randomEvents: [],
    });
    expect('health' in camp).toBe(false);
    expect('stamina' in camp).toBe(false);
    expect('morale' in camp).toBe(false);
  });

  it('sets batheCooldown to 0', () => {
    const camp = createCampState(makePlayer(), makeNPCs(), {
      id: 'test-camp',
      title: 'Rivoli',
      actionsTotal: 16,
      weather: 'cold',
      supplyLevel: 'scarce',
      openingNarrative: 'Your company of the 14th demi-brigade',
      forcedEvents: [],
      randomEvents: [],
    });
    expect(camp.batheCooldown).toBe(0);
  });

  it('sets prayedThisCamp to false', () => {
    const camp = createCampState(makePlayer(), makeNPCs(), {
      id: 'test-camp',
      title: 'Rivoli',
      actionsTotal: 16,
      weather: 'cold',
      supplyLevel: 'scarce',
      openingNarrative: 'Your company of the 14th demi-brigade',
      forcedEvents: [],
      randomEvents: [],
    });
    expect(camp.prayedThisCamp).toBe(false);
  });

  it('initializes completedActivities as empty', () => {
    const camp = createCampState(makePlayer(), makeNPCs(), {
      id: 'test-camp',
      title: 'Rivoli',
      actionsTotal: 16,
      weather: 'cold',
      supplyLevel: 'scarce',
      openingNarrative: 'Your company of the 14th demi-brigade',
      forcedEvents: [],
      randomEvents: [],
    });
    expect(camp.completedActivities).toEqual([]);
  });

  it('initializes triggeredEvents as empty', () => {
    const camp = createCampState(makePlayer(), makeNPCs(), {
      id: 'test-camp',
      title: 'Rivoli',
      actionsTotal: 16,
      weather: 'cold',
      supplyLevel: 'scarce',
      openingNarrative: 'Your company of the 14th demi-brigade',
      forcedEvents: [],
      randomEvents: [],
    });
    expect(camp.triggeredEvents).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// isCampComplete
// ---------------------------------------------------------------------------
describe('isCampComplete', () => {
  function makeCamp(overrides: Partial<CampState> = {}): CampState {
    return {
      day: 1,
      actionsTotal: 16,
      actionsRemaining: 0,
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

  it('returns true when actionsRemaining is 0 and no pendingEvent', () => {
    const camp = makeCamp({ actionsRemaining: 0 });
    expect(isCampComplete(camp)).toBe(true);
  });

  it('returns true when actionsRemaining is negative and no pendingEvent', () => {
    const camp = makeCamp({ actionsRemaining: -1 });
    expect(isCampComplete(camp)).toBe(true);
  });

  it('returns false when actionsRemaining is above 0', () => {
    const camp = makeCamp({ actionsRemaining: 5 });
    expect(isCampComplete(camp)).toBe(false);
  });

  it('returns false when actionsRemaining is 1', () => {
    const camp = makeCamp({ actionsRemaining: 1 });
    expect(isCampComplete(camp)).toBe(false);
  });

  it('returns false when actionsRemaining is 0 but pendingEvent exists', () => {
    const camp = makeCamp({
      actionsRemaining: 0,
      pendingEvent: {
        id: 'test_event',
        category: CampEventCategory.Interpersonal,
        title: 'Test Event',
        narrative: 'Something happened.',
        choices: [{ id: 'choice_a', label: 'Do A', description: 'Do thing A' }],
        resolved: false,
      },
    });
    expect(isCampComplete(camp)).toBe(false);
  });

  it('returns false when both actionsRemaining > 0 and pendingEvent exists', () => {
    const camp = makeCamp({
      actionsRemaining: 3,
      pendingEvent: {
        id: 'test_event',
        category: CampEventCategory.Interpersonal,
        title: 'Test Event',
        narrative: 'Something happened.',
        choices: [],
        resolved: false,
      },
    });
    expect(isCampComplete(camp)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// getCampActivityList
// ---------------------------------------------------------------------------
describe('getCampActivityList', () => {
  it('returns exactly 5 activities', () => {
    const player = makePlayer();
    const camp = createCampState(player, makeNPCs(), {
      id: 'test-camp',
      title: 'Rivoli',
      actionsTotal: 16,
      weather: 'cold',
      supplyLevel: 'scarce',
      openingNarrative: 'Your company of the 14th demi-brigade',
      forcedEvents: [],
      randomEvents: [],
    });
    const activities = getCampActivityList(player, camp);
    expect(activities).toHaveLength(5);
  });

  it('includes Rest, Exercise, ArmsTraining, Duties, Socialize', () => {
    const player = makePlayer();
    const camp = createCampState(player, makeNPCs(), {
      id: 'test-camp',
      title: 'Rivoli',
      actionsTotal: 16,
      weather: 'cold',
      supplyLevel: 'scarce',
      openingNarrative: 'Your company of the 14th demi-brigade',
      forcedEvents: [],
      randomEvents: [],
    });
    const activities = getCampActivityList(player, camp);
    const ids = activities.map((a) => a.id);
    expect(ids).toContain(CampActivityId.Rest);
    expect(ids).toContain(CampActivityId.Exercise);
    expect(ids).toContain(CampActivityId.ArmsTraining);
    expect(ids).toContain(CampActivityId.Duties);
    expect(ids).toContain(CampActivityId.Socialize);
  });

  it('returns activities with name and description strings', () => {
    const player = makePlayer();
    const camp = createCampState(player, makeNPCs(), {
      id: 'test-camp',
      title: 'Rivoli',
      actionsTotal: 16,
      weather: 'cold',
      supplyLevel: 'scarce',
      openingNarrative: 'Your company of the 14th demi-brigade',
      forcedEvents: [],
      randomEvents: [],
    });
    const activities = getCampActivityList(player, camp);
    for (const activity of activities) {
      expect(typeof activity.name).toBe('string');
      expect(activity.name.length).toBeGreaterThan(0);
      expect(typeof activity.description).toBe('string');
      expect(activity.description.length).toBeGreaterThan(0);
    }
  });

  it('returns all activities as available', () => {
    const player = makePlayer();
    const camp = createCampState(player, makeNPCs(), {
      id: 'test-camp',
      title: 'Rivoli',
      actionsTotal: 16,
      weather: 'cold',
      supplyLevel: 'scarce',
      openingNarrative: 'Your company of the 14th demi-brigade',
      forcedEvents: [],
      randomEvents: [],
    });
    const activities = getCampActivityList(player, camp);
    for (const activity of activities) {
      expect(activity.available).toBe(true);
    }
  });

  it('returns activities with expected display names', () => {
    const player = makePlayer();
    const camp = createCampState(player, makeNPCs(), {
      id: 'test-camp',
      title: 'Rivoli',
      actionsTotal: 16,
      weather: 'cold',
      supplyLevel: 'scarce',
      openingNarrative: 'Your company of the 14th demi-brigade',
      forcedEvents: [],
      randomEvents: [],
    });
    const activities = getCampActivityList(player, camp);
    const names = activities.map((a) => a.name);
    expect(names).toContain('Rest');
    expect(names).toContain('Exercise');
    expect(names).toContain('Arms Training');
    expect(names).toContain('Duties');
    expect(names).toContain('Socialize');
  });
});

// ---------------------------------------------------------------------------
// triggerForcedEvent
// ---------------------------------------------------------------------------
describe('triggerForcedEvent', () => {
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

  it('sets pendingEvent on the camp', () => {
    const camp = makeCamp();
    const event = {
      id: 'evt1',
      category: CampEventCategory.Interpersonal,
      title: 'Test Event',
      narrative: 'Something happened.',
      choices: [],
      resolved: false,
    };

    triggerForcedEvent(camp, event, 'evt1');

    expect(camp.pendingEvent).toBe(event);
  });

  it('pushes eventId to triggeredEvents', () => {
    const camp = makeCamp({ triggeredEvents: ['earlier'] });
    const event = {
      id: 'evt2',
      category: CampEventCategory.Interpersonal,
      title: 'Test',
      narrative: 'Narrative.',
      choices: [],
      resolved: false,
    };

    triggerForcedEvent(camp, event, 'evt2');

    expect(camp.triggeredEvents).toEqual(['earlier', 'evt2']);
  });

  it('pushes log entry with event narrative', () => {
    const camp = makeCamp();
    const event = {
      id: 'evt3',
      category: CampEventCategory.Interpersonal,
      title: 'Test',
      narrative: 'The night grows cold.',
      choices: [],
      resolved: false,
    };

    triggerForcedEvent(camp, event, 'evt3');

    expect(camp.log).toHaveLength(1);
    expect(camp.log[0].text).toBe('The night grows cold.');
    expect(camp.log[0].type).toBe('event');
    expect(camp.log[0].day).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// clearPendingEvent
// ---------------------------------------------------------------------------
describe('clearPendingEvent', () => {
  it('sets pendingEvent to undefined', () => {
    const camp: CampState = {
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
      pendingEvent: {
        id: 'evt1',
        category: CampEventCategory.Interpersonal,
        title: 'Event',
        narrative: 'Something.',
        choices: [],
        resolved: false,
      },
    };

    clearPendingEvent(camp);

    expect(camp.pendingEvent).toBeUndefined();
  });

  it('is a no-op when pendingEvent is already undefined', () => {
    const camp: CampState = {
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
    };

    clearPendingEvent(camp);

    expect(camp.pendingEvent).toBeUndefined();
  });
});
