import { describe, it, expect, beforeEach } from 'vitest';
import { useLineCombatStore } from '../stores/lineCombatStore';

function resetStore() {
  useLineCombatStore.setState({
    modules: [],
    selectedModuleId: null,
    selectedVolleyId: null,
    dirty: false,
    undoStack: [],
    redoStack: [],
  });
}

function getState() {
  return useLineCombatStore.getState();
}

describe('lineCombatStore', () => {
  beforeEach(() => {
    localStorage.clear();
    resetStore();
  });

  /* ============================================================== */
  /*  loadModules                                                     */
  /* ============================================================== */

  it('seeds 4 modules on first load (empty localStorage)', () => {
    getState().loadModules();
    expect(getState().modules).toHaveLength(4);
    expect(getState().modules[0].name).toContain('Rivoli Part 1');
    expect(getState().modules[3].name).toContain('Voltri');
  });

  it('loads from localStorage if data exists', () => {
    const saved = [{ id: 'test', name: 'Test', description: '', tags: [], mode: 'standard', volleys: [], stateHints: { expectedEnemyStrength: [0, 100], expectedPlayerHealth: [0, 100], ncoPresent: null, artilleryActive: null, entryNotes: '', exitNotes: '' }, notes: '', createdAt: '', updatedAt: '' }];
    localStorage.setItem('lab_line_combat_modules', JSON.stringify(saved));
    getState().loadModules();
    expect(getState().modules).toHaveLength(1);
    expect(getState().modules[0].id).toBe('test');
  });

  it('seed modules have correct volley counts', () => {
    getState().loadModules();
    const mods = getState().modules;
    expect(mods[0].volleys).toHaveLength(4); // Rivoli Pt 1
    expect(mods[1].volleys).toHaveLength(3); // Rivoli Pt 2
    expect(mods[2].volleys).toHaveLength(4); // Rivoli Pt 3
    expect(mods[3].volleys).toHaveLength(2); // Voltri
  });

  it('seed modules have correct modes', () => {
    getState().loadModules();
    const mods = getState().modules;
    expect(mods[0].mode).toBe('standard');
    expect(mods[2].mode).toBe('gorge');
  });

  /* ============================================================== */
  /*  Module CRUD                                                     */
  /* ============================================================== */

  it('createModule appends a new module', () => {
    getState().loadModules();
    const countBefore = getState().modules.length;
    const id = getState().createModule('Custom Module');
    expect(getState().modules).toHaveLength(countBefore + 1);
    const mod = getState().modules.find((m) => m.id === id);
    expect(mod).toBeDefined();
    expect(mod!.name).toBe('Custom Module');
    expect(getState().selectedModuleId).toBe(id);
    expect(getState().dirty).toBe(true);
  });

  it('createModule persists to localStorage', () => {
    getState().loadModules();
    getState().createModule('Persisted');
    const stored = JSON.parse(localStorage.getItem('lab_line_combat_modules')!);
    expect(stored.some((m: { name: string }) => m.name === 'Persisted')).toBe(true);
  });

  it('deleteModule removes the module', () => {
    getState().loadModules();
    const id = getState().modules[0].id;
    const countBefore = getState().modules.length;
    getState().deleteModule(id);
    expect(getState().modules).toHaveLength(countBefore - 1);
    expect(getState().modules.find((m) => m.id === id)).toBeUndefined();
  });

  it('deleteModule clears selection if deleted module was selected', () => {
    getState().loadModules();
    const id = getState().modules[0].id;
    getState().selectModule(id);
    getState().deleteModule(id);
    expect(getState().selectedModuleId).toBeNull();
  });

  it('duplicateModule creates a copy with new id', () => {
    getState().loadModules();
    const source = getState().modules[0];
    const newId = getState().duplicateModule(source.id);
    expect(newId).not.toBe(source.id);
    const dup = getState().modules.find((m) => m.id === newId);
    expect(dup).toBeDefined();
    expect(dup!.name).toContain('(copy)');
    expect(dup!.volleys).toHaveLength(source.volleys.length);
    // Volley ids should be different
    expect(dup!.volleys[0].id).not.toBe(source.volleys[0].id);
  });

  it('updateModule patches a module field', () => {
    getState().loadModules();
    const id = getState().modules[0].id;
    getState().updateModule(id, { name: 'Updated Name' });
    expect(getState().modules.find((m) => m.id === id)!.name).toBe('Updated Name');
    expect(getState().dirty).toBe(true);
  });

  it('updateModule sets the updatedAt timestamp', () => {
    getState().loadModules();
    const id = getState().modules[0].id;
    getState().updateModule(id, { name: 'Time Test' });
    const after = getState().modules.find((m) => m.id === id)!.updatedAt;
    // Should be a valid ISO date string
    expect(new Date(after).getTime()).not.toBeNaN();
    expect(after.length).toBeGreaterThan(0);
  });

  it('selectModule sets selectedModuleId and clears volley', () => {
    getState().loadModules();
    const id = getState().modules[0].id;
    getState().selectModule(id);
    expect(getState().selectedModuleId).toBe(id);
    expect(getState().selectedVolleyId).toBeNull();
  });

  /* ============================================================== */
  /*  Volley CRUD                                                     */
  /* ============================================================== */

  it('addVolley appends a volley to the module', () => {
    getState().loadModules();
    const modId = getState().modules[3].id; // Voltri — 2 volleys
    getState().addVolley(modId);
    expect(getState().modules.find((m) => m.id === modId)!.volleys).toHaveLength(3);
  });

  it('addVolley inserts after specified volley', () => {
    getState().loadModules();
    const mod = getState().modules[0]; // Rivoli Pt 1 — 4 volleys
    const afterId = mod.volleys[1].id;
    getState().addVolley(mod.id, afterId);
    const updated = getState().modules.find((m) => m.id === mod.id)!;
    expect(updated.volleys).toHaveLength(5);
    expect(updated.volleys[1].id).toBe(afterId);
    // New volley should be at index 2
    expect(updated.volleys[2].def.range).toBe(100); // default
  });

  it('removeVolley deletes the volley', () => {
    getState().loadModules();
    const mod = getState().modules[0];
    const volleyId = mod.volleys[0].id;
    getState().removeVolley(mod.id, volleyId);
    const updated = getState().modules.find((m) => m.id === mod.id)!;
    expect(updated.volleys).toHaveLength(3);
    expect(updated.volleys.find((v) => v.id === volleyId)).toBeUndefined();
  });

  it('removeVolley clears selectedVolleyId if it was selected', () => {
    getState().loadModules();
    const mod = getState().modules[0];
    const volleyId = mod.volleys[0].id;
    getState().selectVolley(volleyId);
    getState().removeVolley(mod.id, volleyId);
    expect(getState().selectedVolleyId).toBeNull();
  });

  it('updateVolley patches a volley field', () => {
    getState().loadModules();
    const mod = getState().modules[0];
    const volleyId = mod.volleys[0].id;
    getState().updateVolley(mod.id, volleyId, { notes: 'Test note' });
    const updated = getState().modules.find((m) => m.id === mod.id)!;
    expect(updated.volleys.find((v) => v.id === volleyId)!.notes).toBe('Test note');
  });

  it('updateVolley can update nested def', () => {
    getState().loadModules();
    const mod = getState().modules[0];
    const volleyId = mod.volleys[0].id;
    getState().updateVolley(mod.id, volleyId, { def: { ...mod.volleys[0].def, range: 200 } });
    const updated = getState().modules.find((m) => m.id === mod.id)!;
    expect(updated.volleys.find((v) => v.id === volleyId)!.def.range).toBe(200);
  });

  it('reorderVolley moves up', () => {
    getState().loadModules();
    const mod = getState().modules[0];
    const secondId = mod.volleys[1].id;
    getState().reorderVolley(mod.id, secondId, 'up');
    const updated = getState().modules.find((m) => m.id === mod.id)!;
    expect(updated.volleys[0].id).toBe(secondId);
  });

  it('reorderVolley moves down', () => {
    getState().loadModules();
    const mod = getState().modules[0];
    const firstId = mod.volleys[0].id;
    getState().reorderVolley(mod.id, firstId, 'down');
    const updated = getState().modules.find((m) => m.id === mod.id)!;
    expect(updated.volleys[1].id).toBe(firstId);
  });

  it('reorderVolley does nothing at boundary', () => {
    getState().loadModules();
    const mod = getState().modules[0];
    const firstId = mod.volleys[0].id;
    getState().reorderVolley(mod.id, firstId, 'up');
    const updated = getState().modules.find((m) => m.id === mod.id)!;
    expect(updated.volleys[0].id).toBe(firstId);
  });

  it('duplicateVolley creates a copy after the original', () => {
    getState().loadModules();
    const mod = getState().modules[0];
    const originalId = mod.volleys[0].id;
    getState().duplicateVolley(mod.id, originalId);
    const updated = getState().modules.find((m) => m.id === mod.id)!;
    expect(updated.volleys).toHaveLength(5);
    expect(updated.volleys[0].id).toBe(originalId);
    // Duplicate should be at index 1 with different id but same range
    expect(updated.volleys[1].id).not.toBe(originalId);
    expect(updated.volleys[1].def.range).toBe(updated.volleys[0].def.range);
  });

  /* ============================================================== */
  /*  Import                                                          */
  /* ============================================================== */

  it('importVolleyFromGame adds a volley to the module', () => {
    getState().loadModules();
    const modId = getState().modules[0].id;
    const entry = {
      id: 'temp',
      def: { range: 150, fireAccuracyBase: 0.15, perceptionBase: 0.10, enemyReturnFireChance: 0.10, enemyReturnFireDamage: [5, 10] as [number, number], enemyLineDamage: 4 },
      narratives: { present: 'Test', fireOrder: 'Fire', endure: 'Endure', fireHit: ['Hit'], fireMiss: ['Miss'] },
      returnFire: { frontRankBonus: 0.10, fatalChance: 0 },
      stamina: { cost: 12, recovery: 4 },
      notes: 'Imported',
      eventDescription: '',
    };
    getState().importVolleyFromGame(modId, entry);
    const updated = getState().modules.find((m) => m.id === modId)!;
    expect(updated.volleys).toHaveLength(5); // 4 + 1
    expect(updated.volleys[4].notes).toBe('Imported');
    expect(updated.volleys[4].id).not.toBe('temp'); // should get new id
  });

  it('importFromGameData creates a new module', () => {
    getState().loadModules();
    const id = getState().importFromGameData('Test Battle', 'desc', ['test'], [], 'standard');
    const mod = getState().modules.find((m) => m.id === id);
    expect(mod).toBeDefined();
    expect(mod!.name).toBe('Test Battle');
    expect(mod!.tags).toEqual(['test']);
    expect(getState().selectedModuleId).toBe(id);
  });

  /* ============================================================== */
  /*  Persistence                                                     */
  /* ============================================================== */

  it('save persists and clears dirty', () => {
    getState().loadModules();
    getState().createModule('To Save');
    expect(getState().dirty).toBe(true);
    getState().save();
    expect(getState().dirty).toBe(false);
    const stored = JSON.parse(localStorage.getItem('lab_line_combat_modules')!);
    expect(stored.some((m: { name: string }) => m.name === 'To Save')).toBe(true);
  });

  it('exportModule returns JSON string', () => {
    getState().loadModules();
    const id = getState().modules[0].id;
    const json = getState().exportModule(id);
    const parsed = JSON.parse(json);
    expect(parsed.id).toBe(id);
    expect(parsed.name).toContain('Rivoli');
  });

  it('exportModule returns empty string for non-existent id', () => {
    getState().loadModules();
    expect(getState().exportModule('nonexistent')).toBe('');
  });

  it('importModule adds from valid JSON', () => {
    getState().loadModules();
    const countBefore = getState().modules.length;
    const json = JSON.stringify({ id: 'imported', name: 'Imported Module', description: '', tags: [], mode: 'standard', volleys: [], stateHints: { expectedEnemyStrength: [0, 100], expectedPlayerHealth: [0, 100], ncoPresent: null, artilleryActive: null, entryNotes: '', exitNotes: '' }, notes: '', createdAt: '', updatedAt: '' });
    expect(getState().importModule(json)).toBe(true);
    expect(getState().modules).toHaveLength(countBefore + 1);
    // Should have a new id (not 'imported')
    const last = getState().modules[getState().modules.length - 1];
    expect(last.name).toBe('Imported Module');
    expect(last.id).not.toBe('imported');
  });

  it('importModule rejects invalid JSON', () => {
    getState().loadModules();
    expect(getState().importModule('not json')).toBe(false);
  });

  it('importModule rejects object without required fields', () => {
    expect(getState().importModule(JSON.stringify({ foo: 'bar' }))).toBe(false);
  });

  /* ============================================================== */
  /*  Undo / Redo                                                     */
  /* ============================================================== */

  it('undo restores previous state', () => {
    getState().loadModules();
    const originalName = getState().modules[0].name;
    const id = getState().modules[0].id;
    getState().updateModule(id, { name: 'Changed' });
    expect(getState().modules[0].name).toBe('Changed');
    getState().undo();
    expect(getState().modules[0].name).toBe(originalName);
  });

  it('redo restores undone change', () => {
    getState().loadModules();
    const id = getState().modules[0].id;
    getState().updateModule(id, { name: 'Changed' });
    getState().undo();
    getState().redo();
    expect(getState().modules.find((m) => m.id === id)!.name).toBe('Changed');
  });

  it('undo does nothing when stack is empty', () => {
    getState().loadModules();
    const before = getState().modules[0].name;
    getState().undo();
    expect(getState().modules[0].name).toBe(before);
  });

  it('redo does nothing when stack is empty', () => {
    getState().loadModules();
    const before = getState().modules[0].name;
    getState().redo();
    expect(getState().modules[0].name).toBe(before);
  });

  it('new mutation clears redo stack', () => {
    getState().loadModules();
    const id = getState().modules[0].id;
    getState().updateModule(id, { name: 'A' });
    getState().undo();
    expect(getState().redoStack.length).toBeGreaterThan(0);
    getState().updateModule(id, { name: 'B' });
    expect(getState().redoStack).toHaveLength(0);
  });

  /* ============================================================== */
  /*  Data integrity                                                  */
  /* ============================================================== */

  it('mutations do not affect other modules', () => {
    getState().loadModules();
    const id = getState().modules[0].id;
    const otherName = getState().modules[1].name;
    getState().updateModule(id, { name: 'Changed' });
    expect(getState().modules[1].name).toBe(otherName);
  });

  it('seed volleys have sensible ranges', () => {
    getState().loadModules();
    for (const mod of getState().modules) {
      for (const v of mod.volleys) {
        expect(v.def.range).toBeGreaterThan(0);
        expect(v.def.range).toBeLessThanOrEqual(300);
        expect(v.def.fireAccuracyBase).toBeGreaterThanOrEqual(0);
        expect(v.def.fireAccuracyBase).toBeLessThanOrEqual(1);
      }
    }
  });

  it('all seed volley ids are unique', () => {
    getState().loadModules();
    const ids = getState().modules.flatMap((m) => m.volleys.map((v) => v.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all seed module ids are unique', () => {
    getState().loadModules();
    const ids = getState().modules.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
