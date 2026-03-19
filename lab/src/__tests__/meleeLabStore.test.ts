import { describe, it, expect, beforeEach } from 'vitest';
import { useMeleeLabStore } from '../stores/meleeLabStore';

function resetStore() {
  useMeleeLabStore.setState({
    encounters: [],
    selectedEncounterId: null,
    selectedOpponentId: null,
    selectedAllyId: null,
    selectedWaveEventId: null,
    dirty: false,
    undoStack: [],
    redoStack: [],
  });
}

function getState() {
  return useMeleeLabStore.getState();
}

/** Helper: build a minimal valid encounter JSON for import testing. */
function validEncounterJson(overrides: Record<string, unknown> = {}): string {
  return JSON.stringify({
    id: 'imp', name: 'Imported', description: '', tags: [], context: 'terrain',
    notes: '', maxExchanges: 10, initialActiveEnemies: 1, maxActiveEnemies: 1,
    opponents: [], allies: [], waveEvents: [],
    createdAt: '', updatedAt: '',
    ...overrides,
  });
}

describe('meleeLabStore', () => {
  beforeEach(() => {
    localStorage.clear();
    resetStore();
  });

  /* ============================================================== */
  /*  loadEncounters                                                  */
  /* ============================================================== */

  it('seeds 4 encounters on first load (empty localStorage)', () => {
    getState().loadEncounters();
    expect(getState().encounters).toHaveLength(4);
    expect(getState().encounters[0].name).toContain('Rivoli: Terrain');
    expect(getState().encounters[3].name).toContain('Voltri: Pegli');
  });

  it('loads from localStorage if data exists', () => {
    const saved = [{
      id: 'test', name: 'Test', description: '', tags: [], context: 'terrain',
      notes: '', maxExchanges: 10, initialActiveEnemies: 1, maxActiveEnemies: 1,
      opponents: [], allies: [], waveEvents: [],
      createdAt: '', updatedAt: '',
    }];
    localStorage.setItem('lab_melee_encounters', JSON.stringify(saved));
    getState().loadEncounters();
    expect(getState().encounters).toHaveLength(1);
    expect(getState().encounters[0].id).toBe('test');
  });

  it('drops corrupt entries and keeps valid ones', () => {
    const good = {
      id: 'ok', name: 'Good', description: '', tags: [], context: 'terrain',
      notes: '', maxExchanges: 10, initialActiveEnemies: 1, maxActiveEnemies: 1,
      opponents: [], allies: [], waveEvents: [],
      createdAt: '', updatedAt: '',
    };
    const bad = { id: 'bad', name: 42 };
    localStorage.setItem('lab_melee_encounters', JSON.stringify([good, bad]));
    getState().loadEncounters();
    expect(getState().encounters).toHaveLength(1);
    expect(getState().encounters[0].id).toBe('ok');
  });

  it('falls back to seed when all localStorage entries are corrupt', () => {
    localStorage.setItem('lab_melee_encounters', JSON.stringify([{ id: 'x' }]));
    getState().loadEncounters();
    expect(getState().encounters).toHaveLength(4);
  });

  it('seed encounters have correct opponent counts', () => {
    getState().loadEncounters();
    const encs = getState().encounters;
    expect(encs[0].opponents).toHaveLength(4); // Terrain
    expect(encs[1].opponents).toHaveLength(4); // Battery Solo
    expect(encs[2].opponents).toHaveLength(4); // Battery Skirmish
    expect(encs[3].opponents).toHaveLength(3); // Pegli Hills
  });

  it('seed encounters have correct ally counts', () => {
    getState().loadEncounters();
    const encs = getState().encounters;
    expect(encs[0].allies).toHaveLength(0);
    expect(encs[2].allies).toHaveLength(2); // Battery Skirmish
  });

  it('seed Battery Skirmish has 3 wave events', () => {
    getState().loadEncounters();
    expect(getState().encounters[2].waveEvents).toHaveLength(3);
  });

  it('seed encounters have correct contexts', () => {
    getState().loadEncounters();
    expect(getState().encounters[0].context).toBe('terrain');
    expect(getState().encounters[1].context).toBe('battery');
    expect(getState().encounters[3].context).toBe('skirmish');
  });

  /* ============================================================== */
  /*  Encounter CRUD                                                  */
  /* ============================================================== */

  it('createEncounter appends a new encounter', () => {
    getState().loadEncounters();
    const countBefore = getState().encounters.length;
    const id = getState().createEncounter('Custom Encounter');
    expect(getState().encounters).toHaveLength(countBefore + 1);
    const enc = getState().encounters.find((e) => e.id === id);
    expect(enc).toBeDefined();
    expect(enc!.name).toBe('Custom Encounter');
    expect(getState().selectedEncounterId).toBe(id);
    expect(getState().dirty).toBe(true);
  });

  it('createEncounter persists to localStorage', () => {
    getState().loadEncounters();
    getState().createEncounter('Persisted');
    const stored = JSON.parse(localStorage.getItem('lab_melee_encounters')!);
    expect(stored.some((e: { name: string }) => e.name === 'Persisted')).toBe(true);
  });

  it('deleteEncounter removes the encounter', () => {
    getState().loadEncounters();
    const id = getState().encounters[0].id;
    const countBefore = getState().encounters.length;
    getState().deleteEncounter(id);
    expect(getState().encounters).toHaveLength(countBefore - 1);
    expect(getState().encounters.find((e) => e.id === id)).toBeUndefined();
  });

  it('deleteEncounter clears selection if deleted encounter was selected', () => {
    getState().loadEncounters();
    const id = getState().encounters[0].id;
    getState().selectEncounter(id);
    getState().deleteEncounter(id);
    expect(getState().selectedEncounterId).toBeNull();
  });

  it('duplicateEncounter creates a copy with new id', () => {
    getState().loadEncounters();
    const source = getState().encounters[0];
    const newId = getState().duplicateEncounter(source.id);
    expect(newId).not.toBe(source.id);
    const dup = getState().encounters.find((e) => e.id === newId);
    expect(dup).toBeDefined();
    expect(dup!.name).toContain('(copy)');
    expect(dup!.opponents).toHaveLength(source.opponents.length);
    expect(dup!.opponents[0].id).not.toBe(source.opponents[0].id);
  });

  it('duplicateEncounter remaps ally references in wave events', () => {
    getState().loadEncounters();
    const skirmish = getState().encounters[2]; // Battery Skirmish
    const newId = getState().duplicateEncounter(skirmish.id);
    const dup = getState().encounters.find((e) => e.id === newId)!;
    // Wave event ally refs should point to the dup's ally ids, not the originals
    const dupAllyIds = new Set(dup.allies.map((a) => a.id));
    for (const w of dup.waveEvents) {
      if (w.allyTemplateId) {
        expect(dupAllyIds.has(w.allyTemplateId)).toBe(true);
      }
    }
  });

  it('updateEncounter patches a field', () => {
    getState().loadEncounters();
    const id = getState().encounters[0].id;
    getState().updateEncounter(id, { name: 'Updated Name' });
    expect(getState().encounters.find((e) => e.id === id)!.name).toBe('Updated Name');
    expect(getState().dirty).toBe(true);
  });

  it('updateEncounter sets updatedAt', () => {
    getState().loadEncounters();
    const id = getState().encounters[0].id;
    getState().updateEncounter(id, { name: 'Time Test' });
    const after = getState().encounters.find((e) => e.id === id)!.updatedAt;
    expect(new Date(after).getTime()).not.toBeNaN();
  });

  it('selectEncounter sets selectedEncounterId and clears sub-selections', () => {
    getState().loadEncounters();
    const id = getState().encounters[0].id;
    getState().selectEncounter(id);
    expect(getState().selectedEncounterId).toBe(id);
    expect(getState().selectedOpponentId).toBeNull();
    expect(getState().selectedAllyId).toBeNull();
    expect(getState().selectedWaveEventId).toBeNull();
  });

  /* ============================================================== */
  /*  Opponent CRUD                                                   */
  /* ============================================================== */

  it('addOpponent appends an opponent', () => {
    getState().loadEncounters();
    const encId = getState().encounters[3].id; // Pegli — 3 opponents
    getState().addOpponent(encId);
    expect(getState().encounters.find((e) => e.id === encId)!.opponents).toHaveLength(4);
  });

  it('removeOpponent deletes the opponent', () => {
    getState().loadEncounters();
    const enc = getState().encounters[0];
    const oppId = enc.opponents[0].id;
    getState().removeOpponent(enc.id, oppId);
    const updated = getState().encounters.find((e) => e.id === enc.id)!;
    expect(updated.opponents).toHaveLength(3);
    expect(updated.opponents.find((o) => o.id === oppId)).toBeUndefined();
  });

  it('removeOpponent clears selection if that opponent was selected', () => {
    getState().loadEncounters();
    const enc = getState().encounters[0];
    const oppId = enc.opponents[0].id;
    getState().selectOpponent(oppId);
    getState().removeOpponent(enc.id, oppId);
    expect(getState().selectedOpponentId).toBeNull();
  });

  it('updateOpponent patches a field', () => {
    getState().loadEncounters();
    const enc = getState().encounters[0];
    const oppId = enc.opponents[0].id;
    getState().updateOpponent(enc.id, oppId, { name: 'Renamed' });
    const updated = getState().encounters.find((e) => e.id === enc.id)!;
    expect(updated.opponents.find((o) => o.id === oppId)!.name).toBe('Renamed');
  });

  it('reorderOpponent moves up', () => {
    getState().loadEncounters();
    const enc = getState().encounters[0];
    const secondId = enc.opponents[1].id;
    getState().reorderOpponent(enc.id, secondId, 'up');
    const updated = getState().encounters.find((e) => e.id === enc.id)!;
    expect(updated.opponents[0].id).toBe(secondId);
  });

  it('reorderOpponent moves down', () => {
    getState().loadEncounters();
    const enc = getState().encounters[0];
    const firstId = enc.opponents[0].id;
    getState().reorderOpponent(enc.id, firstId, 'down');
    const updated = getState().encounters.find((e) => e.id === enc.id)!;
    expect(updated.opponents[1].id).toBe(firstId);
  });

  it('reorderOpponent does nothing at boundary', () => {
    getState().loadEncounters();
    const enc = getState().encounters[0];
    const firstId = enc.opponents[0].id;
    getState().reorderOpponent(enc.id, firstId, 'up');
    const updated = getState().encounters.find((e) => e.id === enc.id)!;
    expect(updated.opponents[0].id).toBe(firstId);
  });

  it('duplicateOpponent creates a copy after the original', () => {
    getState().loadEncounters();
    const enc = getState().encounters[0];
    const origId = enc.opponents[0].id;
    getState().duplicateOpponent(enc.id, origId);
    const updated = getState().encounters.find((e) => e.id === enc.id)!;
    expect(updated.opponents).toHaveLength(5);
    expect(updated.opponents[0].id).toBe(origId);
    expect(updated.opponents[1].id).not.toBe(origId);
    expect(updated.opponents[1].name).toBe(updated.opponents[0].name);
  });

  /* ============================================================== */
  /*  Ally CRUD                                                       */
  /* ============================================================== */

  it('addAlly appends an ally', () => {
    getState().loadEncounters();
    const encId = getState().encounters[0].id; // Terrain — 0 allies
    getState().addAlly(encId);
    expect(getState().encounters.find((e) => e.id === encId)!.allies).toHaveLength(1);
  });

  it('removeAlly deletes the ally', () => {
    getState().loadEncounters();
    const enc = getState().encounters[2]; // Skirmish — 2 allies
    const allyId = enc.allies[0].id;
    getState().removeAlly(enc.id, allyId);
    const updated = getState().encounters.find((e) => e.id === enc.id)!;
    expect(updated.allies).toHaveLength(1);
    expect(updated.allies.find((a) => a.id === allyId)).toBeUndefined();
  });

  it('removeAlly clears wave event allyTemplateId referencing the deleted ally', () => {
    getState().loadEncounters();
    const enc = getState().encounters[2]; // Skirmish
    const pierreId = enc.allies[0].id;
    // Wave event at index 0 should reference Pierre
    expect(enc.waveEvents[0].allyTemplateId).toBe(pierreId);
    getState().removeAlly(enc.id, pierreId);
    const updated = getState().encounters.find((e) => e.id === enc.id)!;
    expect(updated.waveEvents[0].allyTemplateId).toBe('');
  });

  it('removeAlly clears selection if that ally was selected', () => {
    getState().loadEncounters();
    const enc = getState().encounters[2];
    const allyId = enc.allies[0].id;
    getState().selectAlly(allyId);
    getState().removeAlly(enc.id, allyId);
    expect(getState().selectedAllyId).toBeNull();
  });

  it('updateAlly patches a field', () => {
    getState().loadEncounters();
    const enc = getState().encounters[2];
    const allyId = enc.allies[0].id;
    getState().updateAlly(enc.id, allyId, { name: 'Renamed Pierre' });
    const updated = getState().encounters.find((e) => e.id === enc.id)!;
    expect(updated.allies.find((a) => a.id === allyId)!.name).toBe('Renamed Pierre');
  });

  it('reorderAlly moves up', () => {
    getState().loadEncounters();
    const enc = getState().encounters[2];
    const jbId = enc.allies[1].id;
    getState().reorderAlly(enc.id, jbId, 'up');
    const updated = getState().encounters.find((e) => e.id === enc.id)!;
    expect(updated.allies[0].id).toBe(jbId);
  });

  it('reorderAlly does nothing at boundary', () => {
    getState().loadEncounters();
    const enc = getState().encounters[2];
    const pierreId = enc.allies[0].id;
    getState().reorderAlly(enc.id, pierreId, 'up');
    const updated = getState().encounters.find((e) => e.id === enc.id)!;
    expect(updated.allies[0].id).toBe(pierreId);
  });

  it('duplicateAlly creates a copy after the original', () => {
    getState().loadEncounters();
    const enc = getState().encounters[2];
    const origId = enc.allies[0].id;
    getState().duplicateAlly(enc.id, origId);
    const updated = getState().encounters.find((e) => e.id === enc.id)!;
    expect(updated.allies).toHaveLength(3);
    expect(updated.allies[1].id).not.toBe(origId);
    expect(updated.allies[1].name).toBe(updated.allies[0].name);
  });

  /* ============================================================== */
  /*  Wave Event CRUD                                                 */
  /* ============================================================== */

  it('addWaveEvent appends a wave event', () => {
    getState().loadEncounters();
    const encId = getState().encounters[0].id; // Terrain — 0 waves
    getState().addWaveEvent(encId);
    expect(getState().encounters.find((e) => e.id === encId)!.waveEvents).toHaveLength(1);
  });

  it('removeWaveEvent deletes the event', () => {
    getState().loadEncounters();
    const enc = getState().encounters[2]; // 3 waves
    const eventId = enc.waveEvents[0].id;
    getState().removeWaveEvent(enc.id, eventId);
    const updated = getState().encounters.find((e) => e.id === enc.id)!;
    expect(updated.waveEvents).toHaveLength(2);
  });

  it('removeWaveEvent clears selection if that event was selected', () => {
    getState().loadEncounters();
    const enc = getState().encounters[2];
    const eventId = enc.waveEvents[0].id;
    getState().selectWaveEvent(eventId);
    getState().removeWaveEvent(enc.id, eventId);
    expect(getState().selectedWaveEventId).toBeNull();
  });

  it('updateWaveEvent patches a field', () => {
    getState().loadEncounters();
    const enc = getState().encounters[2];
    const eventId = enc.waveEvents[0].id;
    getState().updateWaveEvent(enc.id, eventId, { atRound: 99 });
    const updated = getState().encounters.find((e) => e.id === enc.id)!;
    expect(updated.waveEvents.find((w) => w.id === eventId)!.atRound).toBe(99);
  });

  it('reorderWaveEvent moves down', () => {
    getState().loadEncounters();
    const enc = getState().encounters[2];
    const firstId = enc.waveEvents[0].id;
    getState().reorderWaveEvent(enc.id, firstId, 'down');
    const updated = getState().encounters.find((e) => e.id === enc.id)!;
    expect(updated.waveEvents[1].id).toBe(firstId);
  });

  it('reorderWaveEvent does nothing at boundary', () => {
    getState().loadEncounters();
    const enc = getState().encounters[2];
    const firstId = enc.waveEvents[0].id;
    getState().reorderWaveEvent(enc.id, firstId, 'up');
    const updated = getState().encounters.find((e) => e.id === enc.id)!;
    expect(updated.waveEvents[0].id).toBe(firstId);
  });

  /* ============================================================== */
  /*  Persistence                                                     */
  /* ============================================================== */

  it('save persists and clears dirty', () => {
    getState().loadEncounters();
    getState().createEncounter('To Save');
    expect(getState().dirty).toBe(true);
    getState().save();
    expect(getState().dirty).toBe(false);
    const stored = JSON.parse(localStorage.getItem('lab_melee_encounters')!);
    expect(stored.some((e: { name: string }) => e.name === 'To Save')).toBe(true);
  });

  it('exportEncounter returns JSON string', () => {
    getState().loadEncounters();
    const id = getState().encounters[0].id;
    const json = getState().exportEncounter(id);
    const parsed = JSON.parse(json);
    expect(parsed.id).toBe(id);
    expect(parsed.name).toContain('Rivoli');
  });

  it('exportEncounter returns empty string for non-existent id', () => {
    getState().loadEncounters();
    expect(getState().exportEncounter('nonexistent')).toBe('');
  });

  it('importEncounter adds from valid JSON', () => {
    getState().loadEncounters();
    const countBefore = getState().encounters.length;
    expect(getState().importEncounter(validEncounterJson())).toBe(true);
    expect(getState().encounters).toHaveLength(countBefore + 1);
    const last = getState().encounters[getState().encounters.length - 1];
    expect(last.name).toBe('Imported');
    expect(last.id).not.toBe('imp'); // new id assigned
  });

  it('importEncounter rejects invalid JSON', () => {
    expect(getState().importEncounter('not json')).toBe(false);
  });

  it('importEncounter rejects object without required fields', () => {
    expect(getState().importEncounter(JSON.stringify({ foo: 'bar' }))).toBe(false);
  });

  it('importEncounter rejects invalid context', () => {
    expect(getState().importEncounter(validEncounterJson({ context: 'invalid' }))).toBe(false);
  });

  it('importEncounter rejects non-numeric maxExchanges', () => {
    expect(getState().importEncounter(validEncounterJson({ maxExchanges: 'ten' }))).toBe(false);
  });

  it('importEncounter rejects invalid opponent', () => {
    const bad = validEncounterJson({
      opponents: [{ id: 'o1', name: 42 }], // name must be string
    });
    expect(getState().importEncounter(bad)).toBe(false);
  });

  it('importEncounter rejects invalid ally', () => {
    const bad = validEncounterJson({
      allies: [{ id: 'a1', name: 'X', type: 'named', npcId: '', health: [1, 2], stamina: [1, 2], strength: 1, elan: 1, personality: 'INVALID', description: '', notes: '' }],
    });
    expect(getState().importEncounter(bad)).toBe(false);
  });

  it('importEncounter rejects invalid wave event', () => {
    const bad = validEncounterJson({
      waveEvents: [{ id: 'w1', atRound: 'three', action: 'add_ally', allyTemplateId: '', newMaxEnemies: 0, conditionNpcAlive: '', narrative: '', notes: '' }],
    });
    expect(getState().importEncounter(bad)).toBe(false);
  });

  it('importEncounter accepts well-formed encounter with all sub-items', () => {
    const good = validEncounterJson({
      opponents: [{ id: 'o1', name: 'Opp', type: 'line', health: [70, 90], stamina: [160, 220], strength: 45, description: '', notes: '' }],
      allies: [{ id: 'a1', name: 'Ally', type: 'named', npcId: '', health: [60, 80], stamina: [140, 200], strength: 40, elan: 35, personality: 'balanced', description: '', notes: '' }],
      waveEvents: [{ id: 'w1', atRound: 3, action: 'add_ally', allyTemplateId: 'a1', newMaxEnemies: 0, conditionNpcAlive: '', narrative: 'Test', notes: '' }],
    });
    expect(getState().importEncounter(good)).toBe(true);
  });

  it('importEncounter remaps ally IDs in wave events', () => {
    const good = validEncounterJson({
      allies: [{ id: 'orig-ally', name: 'Ally', type: 'named', npcId: '', health: [60, 80], stamina: [140, 200], strength: 40, elan: 35, personality: 'balanced', description: '', notes: '' }],
      waveEvents: [{ id: 'w1', atRound: 3, action: 'add_ally', allyTemplateId: 'orig-ally', newMaxEnemies: 0, conditionNpcAlive: '', narrative: '', notes: '' }],
    });
    getState().importEncounter(good);
    const imported = getState().encounters[getState().encounters.length - 1];
    const newAllyId = imported.allies[0].id;
    expect(newAllyId).not.toBe('orig-ally');
    expect(imported.waveEvents[0].allyTemplateId).toBe(newAllyId);
  });

  /* ============================================================== */
  /*  Undo / Redo                                                     */
  /* ============================================================== */

  it('undo restores previous state', () => {
    getState().loadEncounters();
    const originalName = getState().encounters[0].name;
    const id = getState().encounters[0].id;
    getState().updateEncounter(id, { name: 'Changed' });
    expect(getState().encounters[0].name).toBe('Changed');
    getState().undo();
    expect(getState().encounters[0].name).toBe(originalName);
  });

  it('redo restores undone change', () => {
    getState().loadEncounters();
    const id = getState().encounters[0].id;
    getState().updateEncounter(id, { name: 'Changed' });
    getState().undo();
    getState().redo();
    expect(getState().encounters.find((e) => e.id === id)!.name).toBe('Changed');
  });

  it('undo does nothing when stack is empty', () => {
    getState().loadEncounters();
    const before = getState().encounters[0].name;
    getState().undo();
    expect(getState().encounters[0].name).toBe(before);
  });

  it('redo does nothing when stack is empty', () => {
    getState().loadEncounters();
    const before = getState().encounters[0].name;
    getState().redo();
    expect(getState().encounters[0].name).toBe(before);
  });

  it('new mutation clears redo stack', () => {
    getState().loadEncounters();
    const id = getState().encounters[0].id;
    getState().updateEncounter(id, { name: 'A' });
    getState().undo();
    expect(getState().redoStack.length).toBeGreaterThan(0);
    getState().updateEncounter(id, { name: 'B' });
    expect(getState().redoStack).toHaveLength(0);
  });

  /* ============================================================== */
  /*  Data integrity                                                  */
  /* ============================================================== */

  it('mutations do not affect other encounters', () => {
    getState().loadEncounters();
    const id = getState().encounters[0].id;
    const otherName = getState().encounters[1].name;
    getState().updateEncounter(id, { name: 'Changed' });
    expect(getState().encounters[1].name).toBe(otherName);
  });

  it('seed opponents have sensible strength values', () => {
    getState().loadEncounters();
    for (const enc of getState().encounters) {
      for (const o of enc.opponents) {
        expect(o.strength).toBeGreaterThan(0);
        expect(o.strength).toBeLessThanOrEqual(100);
        expect(o.health[0]).toBeLessThanOrEqual(o.health[1]);
        expect(o.stamina[0]).toBeLessThanOrEqual(o.stamina[1]);
      }
    }
  });

  it('all seed opponent ids are unique within each encounter', () => {
    getState().loadEncounters();
    for (const enc of getState().encounters) {
      const ids = enc.opponents.map((o) => o.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it('all seed encounter ids are unique', () => {
    getState().loadEncounters();
    const ids = getState().encounters.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('seed wave events reference valid ally ids', () => {
    getState().loadEncounters();
    const skirmish = getState().encounters[2];
    const allyIds = new Set(skirmish.allies.map((a) => a.id));
    for (const w of skirmish.waveEvents) {
      if (w.allyTemplateId) {
        expect(allyIds.has(w.allyTemplateId)).toBe(true);
      }
    }
  });

  it('seed wave events are ordered by round', () => {
    getState().loadEncounters();
    const skirmish = getState().encounters[2];
    for (let i = 1; i < skirmish.waveEvents.length; i++) {
      expect(skirmish.waveEvents[i].atRound).toBeGreaterThanOrEqual(skirmish.waveEvents[i - 1].atRound);
    }
  });
});
