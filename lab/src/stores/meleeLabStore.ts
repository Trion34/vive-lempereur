import { create } from 'zustand';
import type {
  MeleeEncounterModule,
  LabOpponentTemplate,
  LabAllyTemplate,
  LabWaveEvent,
} from '../types/meleeLabTypes';
import {
  validateEncounterModule,
  normalizeEncounterModule,
  createDefaultEncounterModule,
  createDefaultOpponent,
  createDefaultAlly,
  createDefaultWaveEvent,
} from '../types/meleeLabTypes';
import { createSeedEncounters } from '../data/meleeSeedData';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = 'lab_melee_encounters';
const MAX_UNDO = 20;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

function now(): string {
  return new Date().toISOString();
}

let persistTimer: ReturnType<typeof setTimeout> | null = null;

function persist(encounters: MeleeEncounterModule[]): void {
  if (persistTimer) clearTimeout(persistTimer);
  persistTimer = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(encounters));
    } catch { /* quota exceeded — silently fail */ }
    persistTimer = null;
  }, 300);
}

function persistImmediate(encounters: MeleeEncounterModule[]): void {
  if (persistTimer) clearTimeout(persistTimer);
  persistTimer = null;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(encounters));
  } catch { /* quota exceeded — silently fail */ }
}

/* ------------------------------------------------------------------ */
/*  Store interface                                                    */
/* ------------------------------------------------------------------ */

interface MeleeLabStoreState {
  encounters: MeleeEncounterModule[];
  selectedEncounterId: string | null;
  selectedOpponentId: string | null;
  selectedAllyId: string | null;
  selectedWaveEventId: string | null;
  dirty: boolean;
  undoStack: MeleeEncounterModule[][];
  redoStack: MeleeEncounterModule[][];

  // Encounter CRUD
  loadEncounters: () => void;
  createEncounter: (name?: string) => string;
  deleteEncounter: (id: string) => void;
  duplicateEncounter: (id: string) => string;
  updateEncounter: (id: string, patch: Partial<MeleeEncounterModule>) => void;
  selectEncounter: (id: string | null) => void;

  // Opponent CRUD
  addOpponent: (encounterId: string) => void;
  removeOpponent: (encounterId: string, opponentId: string) => void;
  updateOpponent: (encounterId: string, opponentId: string, patch: Partial<LabOpponentTemplate>) => void;
  reorderOpponent: (encounterId: string, opponentId: string, dir: 'up' | 'down') => void;
  duplicateOpponent: (encounterId: string, opponentId: string) => void;
  selectOpponent: (id: string | null) => void;

  // Ally CRUD
  addAlly: (encounterId: string) => void;
  removeAlly: (encounterId: string, allyId: string) => void;
  updateAlly: (encounterId: string, allyId: string, patch: Partial<LabAllyTemplate>) => void;
  reorderAlly: (encounterId: string, allyId: string, dir: 'up' | 'down') => void;
  duplicateAlly: (encounterId: string, allyId: string) => void;
  selectAlly: (id: string | null) => void;

  // Wave Event CRUD
  addWaveEvent: (encounterId: string) => void;
  removeWaveEvent: (encounterId: string, eventId: string) => void;
  updateWaveEvent: (encounterId: string, eventId: string, patch: Partial<LabWaveEvent>) => void;
  reorderWaveEvent: (encounterId: string, eventId: string, dir: 'up' | 'down') => void;
  selectWaveEvent: (id: string | null) => void;

  // Persistence
  save: () => void;
  exportEncounter: (id: string) => string;
  importEncounter: (json: string) => boolean;
  undo: () => void;
  redo: () => void;
}

/* ------------------------------------------------------------------ */
/*  Undo helper                                                        */
/* ------------------------------------------------------------------ */

function pushUndo(state: MeleeLabStoreState): { undoStack: MeleeEncounterModule[][]; redoStack: MeleeEncounterModule[][] } {
  const stack = [...state.undoStack, structuredClone(state.encounters)];
  if (stack.length > MAX_UNDO) stack.shift();
  return { undoStack: stack, redoStack: [] };
}

/* ------------------------------------------------------------------ */
/*  Encounter-level helper: map over encounters, touch one             */
/* ------------------------------------------------------------------ */

function mapEnc(
  encounters: MeleeEncounterModule[],
  id: string,
  fn: (enc: MeleeEncounterModule) => MeleeEncounterModule,
): MeleeEncounterModule[] {
  return encounters.map((e) => e.id === id ? fn(e) : e);
}

/* ------------------------------------------------------------------ */
/*  Store                                                              */
/* ------------------------------------------------------------------ */

export const useMeleeLabStore = create<MeleeLabStoreState>((set, get) => ({
  encounters: [],
  selectedEncounterId: null,
  selectedOpponentId: null,
  selectedAllyId: null,
  selectedWaveEventId: null,
  dirty: false,
  undoStack: [],
  redoStack: [],

  /* ============================================================== */
  /*  Load                                                           */
  /* ============================================================== */

  loadEncounters: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const valid = parsed.filter((m: unknown) => validateEncounterModule(m));
          if (valid.length > 0) {
            let encounters = valid.map((m: unknown) => normalizeEncounterModule(m as Record<string, unknown>));
            // Inject any missing seed encounters (e.g., newly added seeds)
            const seed = createSeedEncounters();
            const existingIds = new Set(encounters.map((e) => e.id));
            const missing = seed.filter((s) => !existingIds.has(s.id));
            if (missing.length > 0) {
              encounters = [...missing, ...encounters];
              persistImmediate(encounters);
            } else if (valid.length !== parsed.length) {
              persistImmediate(encounters);
            }
            set({ encounters, dirty: false });
            return;
          }
        }
      }
    } catch { /* fall through to seed */ }
    const seed = createSeedEncounters();
    set({ encounters: seed, dirty: false });
    persistImmediate(seed);
  },

  /* ============================================================== */
  /*  Encounter CRUD                                                 */
  /* ============================================================== */

  createEncounter: (name) => {
    const enc = createDefaultEncounterModule(name);
    const state = get();
    const encounters = [...state.encounters, enc];
    persistImmediate(encounters);
    set({ encounters, selectedEncounterId: enc.id, dirty: true, ...pushUndo(state) });
    return enc.id;
  },

  deleteEncounter: (id) => {
    const state = get();
    const encounters = state.encounters.filter((e) => e.id !== id);
    const sel = state.selectedEncounterId === id ? null : state.selectedEncounterId;
    persistImmediate(encounters);
    set({
      encounters, selectedEncounterId: sel,
      selectedOpponentId: sel === null ? null : state.selectedOpponentId,
      selectedAllyId: sel === null ? null : state.selectedAllyId,
      selectedWaveEventId: sel === null ? null : state.selectedWaveEventId,
      dirty: true, ...pushUndo(state),
    });
  },

  duplicateEncounter: (id) => {
    const state = get();
    const source = state.encounters.find((e) => e.id === id);
    if (!source) return '';
    const ts = now();
    const dup = structuredClone(source);
    dup.id = uid();
    dup.name = `${source.name} (copy)`;
    dup.createdAt = ts;
    dup.updatedAt = ts;
    dup.opponents = dup.opponents.map((o) => ({ ...o, id: uid() }));
    dup.allies = dup.allies.map((a) => ({ ...a, id: uid() }));
    // Remap wave event ally references
    const allyIdMap = new Map<string, string>();
    source.allies.forEach((orig, i) => { allyIdMap.set(orig.id, dup.allies[i].id); });
    dup.waveEvents = dup.waveEvents.map((w) => ({
      ...w,
      id: uid(),
      allyTemplateId: allyIdMap.get(w.allyTemplateId) ?? w.allyTemplateId,
    }));
    const encounters = [...state.encounters, dup];
    persistImmediate(encounters);
    set({ encounters, selectedEncounterId: dup.id, dirty: true, ...pushUndo(state) });
    return dup.id;
  },

  updateEncounter: (id, patch) => {
    const state = get();
    const encounters = mapEnc(state.encounters, id, (e) => ({ ...e, ...patch, updatedAt: now() }));
    persist(encounters);
    set({ encounters, dirty: true, ...pushUndo(state) });
  },

  selectEncounter: (id) => set({
    selectedEncounterId: id,
    selectedOpponentId: null,
    selectedAllyId: null,
    selectedWaveEventId: null,
  }),

  /* ============================================================== */
  /*  Opponent CRUD                                                  */
  /* ============================================================== */

  addOpponent: (encounterId) => {
    const state = get();
    const opponent = createDefaultOpponent();
    const encounters = mapEnc(state.encounters, encounterId, (e) => ({
      ...e, opponents: [...e.opponents, opponent], updatedAt: now(),
    }));
    persistImmediate(encounters);
    set({ encounters, selectedOpponentId: opponent.id, dirty: true, ...pushUndo(state) });
  },

  removeOpponent: (encounterId, opponentId) => {
    const state = get();
    const encounters = mapEnc(state.encounters, encounterId, (e) => ({
      ...e, opponents: e.opponents.filter((o) => o.id !== opponentId), updatedAt: now(),
    }));
    const sel = state.selectedOpponentId === opponentId ? null : state.selectedOpponentId;
    persistImmediate(encounters);
    set({ encounters, selectedOpponentId: sel, dirty: true, ...pushUndo(state) });
  },

  updateOpponent: (encounterId, opponentId, patch) => {
    const state = get();
    const encounters = mapEnc(state.encounters, encounterId, (e) => ({
      ...e,
      opponents: e.opponents.map((o) => o.id === opponentId ? { ...o, ...patch } : o),
      updatedAt: now(),
    }));
    persist(encounters);
    set({ encounters, dirty: true, ...pushUndo(state) });
  },

  reorderOpponent: (encounterId, opponentId, dir) => {
    const state = get();
    const encounters = mapEnc(state.encounters, encounterId, (e) => {
      const opponents = [...e.opponents];
      const idx = opponents.findIndex((o) => o.id === opponentId);
      if (idx < 0) return e;
      const swap = dir === 'up' ? idx - 1 : idx + 1;
      if (swap < 0 || swap >= opponents.length) return e;
      [opponents[idx], opponents[swap]] = [opponents[swap], opponents[idx]];
      return { ...e, opponents, updatedAt: now() };
    });
    persistImmediate(encounters);
    set({ encounters, dirty: true, ...pushUndo(state) });
  },

  duplicateOpponent: (encounterId, opponentId) => {
    const state = get();
    let newId = '';
    const encounters = mapEnc(state.encounters, encounterId, (e) => {
      const idx = e.opponents.findIndex((o) => o.id === opponentId);
      if (idx < 0) return e;
      const dup = structuredClone(e.opponents[idx]);
      dup.id = uid();
      newId = dup.id;
      const opponents = [...e.opponents];
      opponents.splice(idx + 1, 0, dup);
      return { ...e, opponents, updatedAt: now() };
    });
    persistImmediate(encounters);
    set({ encounters, selectedOpponentId: newId || state.selectedOpponentId, dirty: true, ...pushUndo(state) });
  },

  selectOpponent: (id) => set({ selectedOpponentId: id }),

  /* ============================================================== */
  /*  Ally CRUD                                                      */
  /* ============================================================== */

  addAlly: (encounterId) => {
    const state = get();
    const a = createDefaultAlly();
    const encounters = mapEnc(state.encounters, encounterId, (e) => ({
      ...e, allies: [...e.allies, a], updatedAt: now(),
    }));
    persistImmediate(encounters);
    set({ encounters, selectedAllyId: a.id, dirty: true, ...pushUndo(state) });
  },

  removeAlly: (encounterId, allyId) => {
    const state = get();
    const encounters = mapEnc(state.encounters, encounterId, (e) => ({
      ...e,
      allies: e.allies.filter((a) => a.id !== allyId),
      // Clear wave events referencing this ally
      waveEvents: e.waveEvents.map((w) =>
        w.allyTemplateId === allyId ? { ...w, allyTemplateId: '' } : w,
      ),
      updatedAt: now(),
    }));
    const sel = state.selectedAllyId === allyId ? null : state.selectedAllyId;
    persistImmediate(encounters);
    set({ encounters, selectedAllyId: sel, dirty: true, ...pushUndo(state) });
  },

  updateAlly: (encounterId, allyId, patch) => {
    const state = get();
    const encounters = mapEnc(state.encounters, encounterId, (e) => ({
      ...e,
      allies: e.allies.map((a) => a.id === allyId ? { ...a, ...patch } : a),
      updatedAt: now(),
    }));
    persist(encounters);
    set({ encounters, dirty: true, ...pushUndo(state) });
  },

  reorderAlly: (encounterId, allyId, dir) => {
    const state = get();
    const encounters = mapEnc(state.encounters, encounterId, (e) => {
      const allies = [...e.allies];
      const idx = allies.findIndex((a) => a.id === allyId);
      if (idx < 0) return e;
      const swap = dir === 'up' ? idx - 1 : idx + 1;
      if (swap < 0 || swap >= allies.length) return e;
      [allies[idx], allies[swap]] = [allies[swap], allies[idx]];
      return { ...e, allies, updatedAt: now() };
    });
    persistImmediate(encounters);
    set({ encounters, dirty: true, ...pushUndo(state) });
  },

  duplicateAlly: (encounterId, allyId) => {
    const state = get();
    let newId = '';
    const encounters = mapEnc(state.encounters, encounterId, (e) => {
      const idx = e.allies.findIndex((a) => a.id === allyId);
      if (idx < 0) return e;
      const dup = structuredClone(e.allies[idx]);
      dup.id = uid();
      newId = dup.id;
      const allies = [...e.allies];
      allies.splice(idx + 1, 0, dup);
      return { ...e, allies, updatedAt: now() };
    });
    persistImmediate(encounters);
    set({ encounters, selectedAllyId: newId || state.selectedAllyId, dirty: true, ...pushUndo(state) });
  },

  selectAlly: (id) => set({ selectedAllyId: id }),

  /* ============================================================== */
  /*  Wave Event CRUD                                                */
  /* ============================================================== */

  addWaveEvent: (encounterId) => {
    const state = get();
    const evt = createDefaultWaveEvent();
    const encounters = mapEnc(state.encounters, encounterId, (e) => ({
      ...e, waveEvents: [...e.waveEvents, evt], updatedAt: now(),
    }));
    persistImmediate(encounters);
    set({ encounters, selectedWaveEventId: evt.id, dirty: true, ...pushUndo(state) });
  },

  removeWaveEvent: (encounterId, eventId) => {
    const state = get();
    const encounters = mapEnc(state.encounters, encounterId, (e) => ({
      ...e, waveEvents: e.waveEvents.filter((w) => w.id !== eventId), updatedAt: now(),
    }));
    const sel = state.selectedWaveEventId === eventId ? null : state.selectedWaveEventId;
    persistImmediate(encounters);
    set({ encounters, selectedWaveEventId: sel, dirty: true, ...pushUndo(state) });
  },

  updateWaveEvent: (encounterId, eventId, patch) => {
    const state = get();
    const encounters = mapEnc(state.encounters, encounterId, (e) => ({
      ...e,
      waveEvents: e.waveEvents.map((w) => w.id === eventId ? { ...w, ...patch } : w),
      updatedAt: now(),
    }));
    persist(encounters);
    set({ encounters, dirty: true, ...pushUndo(state) });
  },

  reorderWaveEvent: (encounterId, eventId, dir) => {
    const state = get();
    const encounters = mapEnc(state.encounters, encounterId, (e) => {
      const waveEvents = [...e.waveEvents];
      const idx = waveEvents.findIndex((w) => w.id === eventId);
      if (idx < 0) return e;
      const swap = dir === 'up' ? idx - 1 : idx + 1;
      if (swap < 0 || swap >= waveEvents.length) return e;
      [waveEvents[idx], waveEvents[swap]] = [waveEvents[swap], waveEvents[idx]];
      return { ...e, waveEvents, updatedAt: now() };
    });
    persistImmediate(encounters);
    set({ encounters, dirty: true, ...pushUndo(state) });
  },

  selectWaveEvent: (id) => set({ selectedWaveEventId: id }),

  /* ============================================================== */
  /*  Persistence / Import / Export                                  */
  /* ============================================================== */

  save: () => {
    persistImmediate(get().encounters);
    set({ dirty: false });
  },

  exportEncounter: (id) => {
    const enc = get().encounters.find((e) => e.id === id);
    if (!enc) return '';
    return JSON.stringify(enc, null, 2);
  },

  importEncounter: (json) => {
    try {
      const raw = JSON.parse(json);
      if (!validateEncounterModule(raw)) return false;
      const enc = normalizeEncounterModule(raw as Record<string, unknown>);
      const state = get();
      // Assign new IDs to avoid collisions
      enc.id = uid();
      enc.opponents = enc.opponents.map((o) => ({ ...o, id: uid() }));
      const allyIdMap = new Map<string, string>();
      enc.allies = enc.allies.map((a) => {
        const newId = uid();
        allyIdMap.set(a.id, newId);
        return { ...a, id: newId };
      });
      enc.waveEvents = enc.waveEvents.map((w) => ({
        ...w,
        id: uid(),
        allyTemplateId: allyIdMap.get(w.allyTemplateId) ?? w.allyTemplateId,
      }));
      const encounters = [...state.encounters, enc];
      persistImmediate(encounters);
      set({ encounters, selectedEncounterId: enc.id, dirty: true, ...pushUndo(state) });
      return true;
    } catch {
      return false;
    }
  },

  /* ============================================================== */
  /*  Undo / Redo                                                    */
  /* ============================================================== */

  undo: () => {
    const state = get();
    if (state.undoStack.length === 0) return;
    const prev = state.undoStack[state.undoStack.length - 1];
    const undoStack = state.undoStack.slice(0, -1);
    const redoStack = [...state.redoStack, structuredClone(state.encounters)];
    persist(prev);
    set({ encounters: prev, undoStack, redoStack, dirty: true });
  },

  redo: () => {
    const state = get();
    if (state.redoStack.length === 0) return;
    const next = state.redoStack[state.redoStack.length - 1];
    const redoStack = state.redoStack.slice(0, -1);
    const undoStack = [...state.undoStack, structuredClone(state.encounters)];
    persist(next);
    set({ encounters: next, undoStack, redoStack, dirty: true });
  },
}));
