import { create } from 'zustand';
import type {
  LineCombatModule,
  LabVolleyEntry,
  LabVolleyDef,
  LabVolleyNarratives,
  LabReturnFireConfig,
  LabStaminaConfig,
  VolleyMode,
  StateHints,
} from '../types/lineCombatTypes';
import { createSeedModules } from '../data/lineCombatSeedData';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = 'lab_line_combat_modules';
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

function persist(modules: LineCombatModule[]): void {
  if (persistTimer) clearTimeout(persistTimer);
  persistTimer = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(modules));
    } catch { /* quota exceeded — silently fail */ }
    persistTimer = null;
  }, 300);
}

function persistImmediate(modules: LineCombatModule[]): void {
  if (persistTimer) clearTimeout(persistTimer);
  persistTimer = null;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(modules));
  } catch { /* quota exceeded — silently fail */ }
}

/* ------------------------------------------------------------------ */
/*  Validation                                                         */
/* ------------------------------------------------------------------ */

function isNum(v: unknown): v is number { return typeof v === 'number' && !Number.isNaN(v); }
function isStr(v: unknown): v is string { return typeof v === 'string'; }
function isArr(v: unknown): v is unknown[] { return Array.isArray(v); }

function validateVolleyDef(d: unknown): boolean {
  if (!d || typeof d !== 'object') return false;
  const o = d as Record<string, unknown>;
  return isNum(o.range) && isNum(o.fireAccuracyBase) && isNum(o.perceptionBase)
    && isNum(o.enemyReturnFireChance) && isNum(o.enemyLineDamage)
    && isArr(o.enemyReturnFireDamage) && o.enemyReturnFireDamage.length === 2
    && isNum(o.enemyReturnFireDamage[0]) && isNum(o.enemyReturnFireDamage[1]);
}

function validateNarratives(n: unknown): boolean {
  if (!n || typeof n !== 'object') return false;
  const o = n as Record<string, unknown>;
  return isStr(o.present) && isStr(o.fireOrder) && isStr(o.endure)
    && isArr(o.fireHit) && o.fireHit.every(isStr)
    && isArr(o.fireMiss) && o.fireMiss.every(isStr);
}

function validateReturnFire(rf: unknown): boolean {
  if (!rf || typeof rf !== 'object') return false;
  const o = rf as Record<string, unknown>;
  return isNum(o.frontRankBonus) && isNum(o.fatalChance);
}

function validateStamina(s: unknown): boolean {
  if (!s || typeof s !== 'object') return false;
  const o = s as Record<string, unknown>;
  return isNum(o.cost) && isNum(o.recovery);
}

function validateVolley(v: unknown): boolean {
  if (!v || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  if (!isStr(o.id)) return false;
  if (!validateVolleyDef(o.def)) return false;
  if (!validateNarratives(o.narratives)) return false;
  if (!validateReturnFire(o.returnFire)) return false;
  if (!validateStamina(o.stamina)) return false;
  if (!isStr(o.notes) || !isStr(o.eventDescription)) return false;
  return true;
}

function isBoolOrNull(v: unknown): boolean {
  return v === null || typeof v === 'boolean';
}

function validateStateHints(h: unknown): boolean {
  if (!h || typeof h !== 'object') return false;
  const o = h as Record<string, unknown>;
  if (!isArr(o.expectedEnemyStrength) || o.expectedEnemyStrength.length !== 2) return false;
  if (!isNum(o.expectedEnemyStrength[0]) || !isNum(o.expectedEnemyStrength[1])) return false;
  if (!isArr(o.expectedPlayerHealth) || o.expectedPlayerHealth.length !== 2) return false;
  if (!isNum(o.expectedPlayerHealth[0]) || !isNum(o.expectedPlayerHealth[1])) return false;
  if (!isBoolOrNull(o.ncoPresent)) return false;
  if (!isBoolOrNull(o.artilleryActive)) return false;
  if (!isStr(o.entryNotes)) return false;
  if (!isStr(o.exitNotes)) return false;
  return true;
}

export function validateModule(m: unknown): boolean {
  if (!m || typeof m !== 'object') return false;
  const o = m as Record<string, unknown>;
  if (!isStr(o.id) || !isStr(o.name)) return false;
  if (!isArr(o.volleys)) return false;
  if (o.mode !== 'standard' && o.mode !== 'gorge') return false;
  if (!isArr(o.tags) || !(o.tags as unknown[]).every(isStr)) return false;
  if (!isStr(o.description) || !isStr(o.notes)) return false;
  if (!validateStateHints(o.stateHints)) return false;
  for (const v of o.volleys) {
    if (!validateVolley(v)) return false;
  }
  return true;
}

/** Normalize a parsed module by filling missing optional fields with defaults. */
function normalizeModule(raw: Record<string, unknown>): LineCombatModule {
  const ts = now();
  return {
    id: isStr(raw.id) ? raw.id : uid(),
    name: isStr(raw.name) ? raw.name : 'Unnamed Module',
    description: isStr(raw.description) ? raw.description : '',
    tags: isArr(raw.tags) ? (raw.tags as unknown[]).filter(isStr) : [],
    mode: raw.mode === 'gorge' ? 'gorge' : 'standard',
    volleys: isArr(raw.volleys) ? (raw.volleys as LabVolleyEntry[]) : [],
    stateHints: raw.stateHints && typeof raw.stateHints === 'object'
      ? (raw.stateHints as StateHints)
      : createDefaultStateHints(),
    notes: isStr(raw.notes) ? raw.notes : '',
    createdAt: isStr(raw.createdAt) ? raw.createdAt : ts,
    updatedAt: isStr(raw.updatedAt) ? raw.updatedAt : ts,
  };
}

/* ------------------------------------------------------------------ */
/*  Default factories                                                  */
/* ------------------------------------------------------------------ */

export function createDefaultVolleyDef(): LabVolleyDef {
  return {
    range: 100,
    fireAccuracyBase: 0.30,
    perceptionBase: 0.20,
    enemyReturnFireChance: 0.20,
    enemyReturnFireDamage: [8, 14],
    enemyLineDamage: 8,
  };
}

export function createDefaultNarratives(): LabVolleyNarratives {
  return {
    present: 'Present arms.',
    fireOrder: '"Fire!"',
    endure: 'Return fire.',
    fireHit: ['Hit. Target down.'],
    fireMiss: ['Miss.'],
  };
}

export function createDefaultReturnFire(): LabReturnFireConfig {
  return { frontRankBonus: 0.15, fatalChance: 0 };
}

export function createDefaultStamina(): LabStaminaConfig {
  return { cost: 12, recovery: 4 };
}

export function createDefaultStateHints(): StateHints {
  return {
    expectedEnemyStrength: [60, 100],
    expectedPlayerHealth: [50, 100],
    ncoPresent: null,
    artilleryActive: null,
    entryNotes: '',
    exitNotes: '',
  };
}

export function createDefaultVolley(id?: string): LabVolleyEntry {
  return {
    id: id ?? uid(),
    def: createDefaultVolleyDef(),
    narratives: createDefaultNarratives(),
    returnFire: createDefaultReturnFire(),
    stamina: createDefaultStamina(),
    notes: '',
    eventDescription: '',
  };
}

function createDefaultModule(name?: string): LineCombatModule {
  const ts = now();
  return {
    id: uid(),
    name: name ?? 'New Module',
    description: '',
    tags: [],
    mode: 'standard',
    volleys: [],
    stateHints: createDefaultStateHints(),
    notes: '',
    createdAt: ts,
    updatedAt: ts,
  };
}

/* ------------------------------------------------------------------ */
/*  Store                                                              */
/* ------------------------------------------------------------------ */

interface LineCombatStoreState {
  modules: LineCombatModule[];
  selectedModuleId: string | null;
  selectedVolleyId: string | null;
  dirty: boolean;
  undoStack: LineCombatModule[][];
  redoStack: LineCombatModule[][];

  // Module CRUD
  loadModules: () => void;
  createModule: (name?: string) => string;
  deleteModule: (id: string) => void;
  duplicateModule: (id: string) => string;
  updateModule: (id: string, patch: Partial<LineCombatModule>) => void;
  selectModule: (id: string | null) => void;

  // Volley CRUD
  addVolley: (moduleId: string, afterVolleyId?: string) => void;
  removeVolley: (moduleId: string, volleyId: string) => void;
  updateVolley: (moduleId: string, volleyId: string, patch: Partial<LabVolleyEntry>) => void;
  reorderVolley: (moduleId: string, volleyId: string, dir: 'up' | 'down') => void;
  duplicateVolley: (moduleId: string, volleyId: string) => void;
  selectVolley: (id: string | null) => void;

  // Import from game data
  importVolleyFromGame: (moduleId: string, volley: LabVolleyEntry) => void;
  importFromGameData: (name: string, description: string, tags: string[], volleys: LabVolleyEntry[], mode: VolleyMode) => string;

  // Persistence
  save: () => void;
  exportModule: (id: string) => string;
  importModule: (json: string) => boolean;
  undo: () => void;
  redo: () => void;
}

function pushUndo(state: LineCombatStoreState): { undoStack: LineCombatModule[][]; redoStack: LineCombatModule[][] } {
  const stack = [...state.undoStack, structuredClone(state.modules)];
  if (stack.length > MAX_UNDO) stack.shift();
  return { undoStack: stack, redoStack: [] };
}

export const useLineCombatStore = create<LineCombatStoreState>((set, get) => ({
  modules: [],
  selectedModuleId: null,
  selectedVolleyId: null,
  dirty: false,
  undoStack: [],
  redoStack: [],

  loadModules: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Validate each module; keep valid ones, drop corrupt ones
          const validRaw = parsed.filter((m: unknown) => validateModule(m));
          if (validRaw.length > 0) {
            // Normalize to ensure all fields present even if validation passes
            const modules = validRaw.map((m: unknown) => normalizeModule(m as Record<string, unknown>));
            set({ modules, dirty: false });
            // Re-persist if we dropped corrupt modules
            if (validRaw.length !== parsed.length) persistImmediate(modules);
            return;
          }
        }
      }
    } catch { /* fall through to seed */ }
    const seed = createSeedModules();
    set({ modules: seed, dirty: false });
    persistImmediate(seed);
  },

  createModule: (name) => {
    const mod = createDefaultModule(name);
    const state = get();
    const modules = [...state.modules, mod];
    persistImmediate(modules);
    set({ modules, selectedModuleId: mod.id, dirty: true, ...pushUndo(state) });
    return mod.id;
  },

  deleteModule: (id) => {
    const state = get();
    const modules = state.modules.filter((m) => m.id !== id);
    const sel = state.selectedModuleId === id ? null : state.selectedModuleId;
    const volSel = sel === null ? null : state.selectedVolleyId;
    persistImmediate(modules);
    set({ modules, selectedModuleId: sel, selectedVolleyId: volSel, dirty: true, ...pushUndo(state) });
  },

  duplicateModule: (id) => {
    const state = get();
    const source = state.modules.find((m) => m.id === id);
    if (!source) return '';
    const ts = now();
    const dup = structuredClone(source);
    dup.id = uid();
    dup.name = `${source.name} (copy)`;
    dup.createdAt = ts;
    dup.updatedAt = ts;
    dup.volleys = dup.volleys.map((v) => ({ ...v, id: uid() }));
    const modules = [...state.modules, dup];
    persistImmediate(modules);
    set({ modules, selectedModuleId: dup.id, dirty: true, ...pushUndo(state) });
    return dup.id;
  },

  updateModule: (id, patch) => {
    const state = get();
    const modules = state.modules.map((m) =>
      m.id === id ? { ...m, ...patch, updatedAt: now() } : m,
    );
    persist(modules);
    set({ modules, dirty: true, ...pushUndo(state) });
  },

  selectModule: (id) => set({ selectedModuleId: id, selectedVolleyId: null }),

  // Volley CRUD
  addVolley: (moduleId, afterVolleyId) => {
    const state = get();
    const volley = createDefaultVolley();
    const modules = state.modules.map((m) => {
      if (m.id !== moduleId) return m;
      const volleys = [...m.volleys];
      if (afterVolleyId) {
        const idx = volleys.findIndex((v) => v.id === afterVolleyId);
        if (idx >= 0) volleys.splice(idx + 1, 0, volley);
        else volleys.push(volley);
      } else {
        volleys.push(volley);
      }
      return { ...m, volleys, updatedAt: now() };
    });
    persistImmediate(modules);
    set({ modules, selectedVolleyId: volley.id, dirty: true, ...pushUndo(state) });
  },

  removeVolley: (moduleId, volleyId) => {
    const state = get();
    const modules = state.modules.map((m) => {
      if (m.id !== moduleId) return m;
      return { ...m, volleys: m.volleys.filter((v) => v.id !== volleyId), updatedAt: now() };
    });
    const volSel = state.selectedVolleyId === volleyId ? null : state.selectedVolleyId;
    persistImmediate(modules);
    set({ modules, selectedVolleyId: volSel, dirty: true, ...pushUndo(state) });
  },

  updateVolley: (moduleId, volleyId, patch) => {
    const state = get();
    const modules = state.modules.map((m) => {
      if (m.id !== moduleId) return m;
      return {
        ...m,
        volleys: m.volleys.map((v) => v.id === volleyId ? { ...v, ...patch } : v),
        updatedAt: now(),
      };
    });
    persist(modules);
    set({ modules, dirty: true, ...pushUndo(state) });
  },

  reorderVolley: (moduleId, volleyId, dir) => {
    const state = get();
    const modules = state.modules.map((m) => {
      if (m.id !== moduleId) return m;
      const volleys = [...m.volleys];
      const idx = volleys.findIndex((v) => v.id === volleyId);
      if (idx < 0) return m;
      const swap = dir === 'up' ? idx - 1 : idx + 1;
      if (swap < 0 || swap >= volleys.length) return m;
      [volleys[idx], volleys[swap]] = [volleys[swap], volleys[idx]];
      return { ...m, volleys, updatedAt: now() };
    });
    persistImmediate(modules);
    set({ modules, dirty: true, ...pushUndo(state) });
  },

  duplicateVolley: (moduleId, volleyId) => {
    const state = get();
    let newId = '';
    const modules = state.modules.map((m) => {
      if (m.id !== moduleId) return m;
      const idx = m.volleys.findIndex((v) => v.id === volleyId);
      if (idx < 0) return m;
      const dup = structuredClone(m.volleys[idx]);
      dup.id = uid();
      newId = dup.id;
      const volleys = [...m.volleys];
      volleys.splice(idx + 1, 0, dup);
      return { ...m, volleys, updatedAt: now() };
    });
    persistImmediate(modules);
    set({ modules, selectedVolleyId: newId || state.selectedVolleyId, dirty: true, ...pushUndo(state) });
  },

  selectVolley: (id) => set({ selectedVolleyId: id }),

  importVolleyFromGame: (moduleId, volley) => {
    const state = get();
    const entry = { ...volley, id: uid() };
    const modules = state.modules.map((m) => {
      if (m.id !== moduleId) return m;
      return { ...m, volleys: [...m.volleys, entry], updatedAt: now() };
    });
    persistImmediate(modules);
    set({ modules, dirty: true, ...pushUndo(state) });
  },

  importFromGameData: (name, description, tags, volleys, mode) => {
    const state = get();
    const ts = now();
    const mod: LineCombatModule = {
      id: uid(),
      name,
      description,
      tags,
      mode,
      volleys: volleys.map((v) => ({ ...v, id: uid() })),
      stateHints: createDefaultStateHints(),
      notes: '',
      createdAt: ts,
      updatedAt: ts,
    };
    const modules = [...state.modules, mod];
    persistImmediate(modules);
    set({ modules, selectedModuleId: mod.id, dirty: true, ...pushUndo(state) });
    return mod.id;
  },

  save: () => {
    persistImmediate(get().modules);
    set({ dirty: false });
  },

  exportModule: (id) => {
    const mod = get().modules.find((m) => m.id === id);
    if (!mod) return '';
    return JSON.stringify(mod, null, 2);
  },

  importModule: (json) => {
    try {
      const raw = JSON.parse(json);
      if (!validateModule(raw)) return false;
      const mod = normalizeModule(raw as Record<string, unknown>);
      const state = get();
      // Assign new id to avoid collisions
      mod.id = uid();
      mod.volleys = mod.volleys.map((v) => ({ ...v, id: uid() }));
      const modules = [...state.modules, mod];
      persistImmediate(modules);
      set({ modules, selectedModuleId: mod.id, dirty: true, ...pushUndo(state) });
      return true;
    } catch {
      return false;
    }
  },

  undo: () => {
    const state = get();
    if (state.undoStack.length === 0) return;
    const prev = state.undoStack[state.undoStack.length - 1];
    const undoStack = state.undoStack.slice(0, -1);
    const redoStack = [...state.redoStack, structuredClone(state.modules)];
    persist(prev);
    set({ modules: prev, undoStack, redoStack, dirty: true });
  },

  redo: () => {
    const state = get();
    if (state.redoStack.length === 0) return;
    const next = state.redoStack[state.redoStack.length - 1];
    const redoStack = state.redoStack.slice(0, -1);
    const undoStack = [...state.undoStack, structuredClone(state.modules)];
    persist(next);
    set({ modules: next, undoStack, redoStack, dirty: true });
  },
}));
