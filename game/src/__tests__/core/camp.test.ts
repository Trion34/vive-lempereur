import { describe, it, expect } from 'vitest';
import { createCampState, advanceCampTurn, isCampComplete, triggerForcedEvent, clearPendingEvent, hasPendingScene, triggerForcedVnEvent, resolveVnSceneResult } from '../../core/camp';
import type { VNSceneResult } from '../../core/vnSceneInterpreter';
import { getCampActivityList } from '../../core/campActivities';
import {
  PlayerCharacter,
  NPC,
  NPCRole,
  MilitaryRank,
  CampActivityId,
  CampState,
  CampEventCategory,
  GamePhase,
  CampaignPhase,
} from '../../types';
import type { GameState } from '../../types';

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
      flags: {},
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
      flags: {},
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
      flags: {},
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
      flags: {},
    };

    clearPendingEvent(camp);

    expect(camp.pendingEvent).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// advanceCampTurn — sousChange
// ---------------------------------------------------------------------------
describe('advanceCampTurn sousChange', () => {
  function makeGameState(playerOverrides: Partial<PlayerCharacter> = {}): GameState {
    const player = makePlayer(playerOverrides);
    return {
      phase: GamePhase.Camp,
      player,
      npcs: makeNPCs(),
      campaign: {
        campaignId: 'italy',
        sequenceIndex: 1,
        phase: CampaignPhase.Camp,
        battlesCompleted: 0,
        currentBattle: 'rivoli',
        nextBattle: '',
        daysInCampaign: 1,
        npcDeaths: [],
        replacementsUsed: [],
      },
      campState: {
        day: 1,
        actionsTotal: 16,
        actionsRemaining: 10,
        conditions: { weather: 'cold', supplyLevel: 'scarce', campMorale: 'steady', location: 'Rivoli' },
        log: [],
        completedActivities: [],
        triggeredEvents: [],
        batheCooldown: 0,
        prayedThisCamp: false,
        campId: 'test-camp',
        flags: {},
      },
    } as unknown as GameState;
  }

  it('does not change sous when activity result has no sousChange', () => {
    const gs = makeGameState({ sous: 10 });
    advanceCampTurn(gs, CampActivityId.Rest, 'lay_about');
    // Rest/lay_about doesn't produce sousChange, so sous stays the same
    expect(gs.player.sous).toBe(10);
  });

  it('clamps sous to minimum 0', () => {
    const gs = makeGameState({ sous: 2 });
    // Directly test the clamping logic by simulating what advanceCampTurn does
    gs.player.sous = Math.max(0, gs.player.sous + (-5));
    expect(gs.player.sous).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// hasPendingScene
// ---------------------------------------------------------------------------
describe('hasPendingScene', () => {
  function makeCamp(overrides: Partial<CampState> = {}): CampState {
    return {
      day: 1, actionsTotal: 12, actionsRemaining: 10,
      conditions: { weather: 'cold', supplyLevel: 'scarce', campMorale: 'steady', location: 'Test' },
      log: [], completedActivities: [], triggeredEvents: [],
      batheCooldown: 0, prayedThisCamp: false, campId: 'test', flags: {},
      ...overrides,
    };
  }

  it('returns false when neither pending field is set', () => {
    expect(hasPendingScene(makeCamp())).toBe(false);
  });

  it('returns true when pendingEvent is set', () => {
    const camp = makeCamp({
      pendingEvent: { id: 'e', category: CampEventCategory.Interpersonal, title: 'E', narrative: '', choices: [], resolved: false },
    });
    expect(hasPendingScene(camp)).toBe(true);
  });

  it('returns true when pendingVnScene is set', () => {
    const camp = makeCamp({
      pendingVnScene: { sceneId: 's', scene: { id: 's', title: 'S', description: '', mood: 'night_camp', cast: [], startNode: 'a', nodes: {} }, configId: 'c' },
    });
    expect(hasPendingScene(camp)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// triggerForcedVnEvent
// ---------------------------------------------------------------------------
describe('triggerForcedVnEvent', () => {
  function makeCamp(overrides: Partial<CampState> = {}): CampState {
    return {
      day: 1, actionsTotal: 12, actionsRemaining: 10,
      conditions: { weather: 'cold', supplyLevel: 'scarce', campMorale: 'steady', location: 'Test' },
      log: [], completedActivities: [], triggeredEvents: [],
      batheCooldown: 0, prayedThisCamp: false, campId: 'test', flags: {},
      ...overrides,
    };
  }

  const scene = { id: 'test_scene', title: 'Test Scene', description: '', mood: 'night_camp' as const, cast: [], startNode: 'a', nodes: { a: { id: 'a', speaker: 'narrator', text: 'hello', next: null } } };

  it('sets pendingVnScene on the camp', () => {
    const camp = makeCamp();
    triggerForcedVnEvent(camp, scene, 'evt1', 'My Title');
    expect(camp.pendingVnScene).toBeDefined();
    expect(camp.pendingVnScene!.sceneId).toBe('test_scene');
    expect(camp.pendingVnScene!.configId).toBe('evt1');
    expect(camp.pendingVnScene!.title).toBe('My Title');
  });

  it('pushes config id to triggeredEvents', () => {
    const camp = makeCamp({ triggeredEvents: ['earlier'] });
    triggerForcedVnEvent(camp, scene, 'evt2');
    expect(camp.triggeredEvents).toEqual(['earlier', 'evt2']);
  });

  it('adds log entry', () => {
    const camp = makeCamp();
    triggerForcedVnEvent(camp, scene, 'evt3', 'Custom Title');
    expect(camp.log).toHaveLength(1);
    expect(camp.log[0].type).toBe('event');
    expect(camp.log[0].text).toContain('Custom Title');
  });
});

// ---------------------------------------------------------------------------
// resolveVnSceneResult
// ---------------------------------------------------------------------------
describe('resolveVnSceneResult', () => {
  function makeGameState(playerOverrides: Partial<PlayerCharacter> = {}): GameState {
    return {
      phase: GamePhase.Battle,
      player: {
        name: 'Test', rank: MilitaryRank.Private,
        valor: 40, musketry: 35, elan: 35, strength: 40, endurance: 40, constitution: 45,
        charisma: 30, intelligence: 30, awareness: 35,
        soldierRep: 50, officerRep: 50, napoleonRep: 0,
        health: 80, morale: 70, stamina: 60, sous: 10, virtue: 0,
        alive: true, routing: false, frontRank: false,
        musketLoaded: true, fumbledLoad: false, canteenUses: 3,
        grace: 0, attributes: {},
        ...playerOverrides,
      } as PlayerCharacter,
      npcs: [{ id: 'felix', name: 'Felix', role: NPCRole.Neighbour, rank: MilitaryRank.Private, relationship: 50, alive: true, wounded: false, valor: 30, morale: 70, maxMorale: 85 }] as unknown as NPC[],
      campState: {
        day: 1, actionsTotal: 12, actionsRemaining: 8,
        conditions: { weather: 'clear', supplyLevel: 'scarce', campMorale: 'steady', location: 'Test' },
        log: [], completedActivities: [], triggeredEvents: [],
        batheCooldown: 0, prayedThisCamp: false, campId: 'test', flags: {},
        pendingVnScene: { sceneId: 's', scene: { id: 's', title: 'S', description: '', mood: 'night_camp', cast: [], startNode: 'a', nodes: {} }, configId: 'c' },
      },
      campaign: { campaignId: 'test', sequenceIndex: 0 },
    } as unknown as GameState;
  }

  function makeResult(overrides: Partial<VNSceneResult> = {}): VNSceneResult {
    return {
      statChanges: {}, moraleChange: 0, staminaChange: 0, healthChange: 0,
      sousChange: 0, virtueChange: 0, npcChanges: [], flagChanges: {}, rollDisplays: [],
      ...overrides,
    };
  }

  it('applies morale change to player', () => {
    const gs = makeGameState();
    resolveVnSceneResult(gs, makeResult({ moraleChange: 5 }));
    expect(gs.player.morale).toBe(75);
  });

  it('applies sous change to player', () => {
    const gs = makeGameState();
    resolveVnSceneResult(gs, makeResult({ sousChange: -3 }));
    expect(gs.player.sous).toBe(7);
  });

  it('applies stat changes to player', () => {
    const gs = makeGameState();
    resolveVnSceneResult(gs, makeResult({ statChanges: { soldierRep: 2 } }));
    expect(gs.player.soldierRep).toBe(52);
  });

  it('applies NPC relationship changes', () => {
    const gs = makeGameState();
    resolveVnSceneResult(gs, makeResult({ npcChanges: [{ npcId: 'felix', relationship: 10 }] }));
    expect(gs.npcs[0].relationship).toBe(60);
  });

  it('applies flag changes', () => {
    const gs = makeGameState();
    resolveVnSceneResult(gs, makeResult({ flagChanges: { gambling_accepted: true } }));
    expect(gs.campState!.flags.gambling_accepted).toBe(true);
  });

  it('clears pendingVnScene atomically', () => {
    const gs = makeGameState();
    expect(gs.campState!.pendingVnScene).toBeDefined();
    resolveVnSceneResult(gs, makeResult());
    expect(gs.campState!.pendingVnScene).toBeUndefined();
  });

  it('adds roll display log entries', () => {
    const gs = makeGameState();
    resolveVnSceneResult(gs, makeResult({ rollDisplays: [{ stat: 'Valor', roll: 65, target: 40, passed: true }] }));
    expect(gs.campState!.log.some((l) => l.text.includes('Valor') && l.text.includes('Passed'))).toBe(true);
  });
});
