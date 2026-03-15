import { describe, it, expect } from 'vitest';
import {
  getBriefingEvent,
  getBonaparteEvent,
  getCampfiresEvent,
  getAllPreBattleEvents,
  FORAGE_SUCCESS,
  FORAGE_FAIL,
  SOCIALIZE_NARRATIVES,
} from '../../data/campEvents';
import type { PlayerCharacter, NPC } from '../../types';

function mockPlayer(): PlayerCharacter {
  return {
    name: 'Test',
    rank: 'private',
    valor: 40,
    musketry: 35,
    elan: 35,
    strength: 40,
    endurance: 40,
    constitution: 45,
    charisma: 30,
    intelligence: 30,
    awareness: 35,
    health: 100,
    morale: 100,
    stamina: 100,
    grace: 0,
    soldierRep: 50,
    officerRep: 50,
    napoleonRep: 0,
    frontRank: false,
    equipment: {
      musket: 'Charleville 1777',
      bayonet: 'Socket bayonet',
      musketCondition: 70,
      uniformCondition: 50,
    },
  } as PlayerCharacter;
}

describe('forced camp events', () => {
  it('getBriefingEvent has non-empty narrative and choices', () => {
    const e = getBriefingEvent();
    expect(e.id).toBe('prebattle_briefing');
    expect(e.narrative.length).toBeGreaterThan(20);
    expect(e.choices.length).toBeGreaterThanOrEqual(1);
    expect(e.choices.every((c) => c.label.length > 0)).toBe(true);
  });

  it('getBonaparteEvent has non-empty narrative and choices', () => {
    const e = getBonaparteEvent();
    expect(e.id).toBe('prebattle_bonaparte');
    expect(e.narrative.length).toBeGreaterThan(20);
    expect(e.choices.length).toBeGreaterThanOrEqual(1);
  });

  it('getCampfiresEvent has non-empty narrative and 2 choices', () => {
    const e = getCampfiresEvent();
    expect(e.id).toBe('prebattle_campfires');
    expect(e.narrative.length).toBeGreaterThan(20);
    expect(e.choices).toHaveLength(2);
  });
});

describe('random camp events', () => {
  it('getAllPreBattleEvents returns 3 events', () => {
    const events = getAllPreBattleEvents(mockPlayer(), []);
    expect(events).toHaveLength(3);
  });

  it('every event has non-empty narrative and ≥1 choice', () => {
    const events = getAllPreBattleEvents(mockPlayer(), []);
    for (const e of events) {
      expect(e.narrative.length).toBeGreaterThan(20);
      expect(e.choices.length).toBeGreaterThanOrEqual(1);
      for (const c of e.choices) {
        expect(c.label.length).toBeGreaterThan(0);
        expect(c.id.length).toBeGreaterThan(0);
      }
    }
  });

  it('event ids are unique', () => {
    const events = getAllPreBattleEvents(mockPlayer(), []);
    const ids = events.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('activity narrative arrays', () => {
  it('FORAGE_SUCCESS has multiple non-empty entries', () => {
    expect(FORAGE_SUCCESS.length).toBeGreaterThanOrEqual(2);
    for (const s of FORAGE_SUCCESS) expect(s.length).toBeGreaterThan(20);
  });

  it('FORAGE_FAIL has multiple non-empty entries', () => {
    expect(FORAGE_FAIL.length).toBeGreaterThanOrEqual(2);
    for (const s of FORAGE_FAIL) expect(s.length).toBeGreaterThan(20);
  });

  it('SOCIALIZE_NARRATIVES has entries for known NPCs', () => {
    expect(SOCIALIZE_NARRATIVES['pierre']).toBeTruthy();
    expect(SOCIALIZE_NARRATIVES['jean-baptiste']).toBeTruthy();
    expect(SOCIALIZE_NARRATIVES['duval']).toBeTruthy();
    expect(SOCIALIZE_NARRATIVES['leclerc']).toBeTruthy();
    for (const val of Object.values(SOCIALIZE_NARRATIVES)) {
      expect(val.length).toBeGreaterThan(20);
    }
  });
});
