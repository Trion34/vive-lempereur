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
  return true;
}

function validateStateHints(h: unknown): boolean {
  if (!h || typeof h !== 'object') return false;
  const o = h as Record<string, unknown>;
  if (!isArr(o.expectedEnemyStrength) || o.expectedEnemyStrength.length !== 2) return false;
  if (!isNum(o.expectedEnemyStrength[0]) || !isNum(o.expectedEnemyStrength[1])) return false;
  if (!isArr(o.expectedPlayerHealth) || o.expectedPlayerHealth.length !== 2) return false;
  if (!isNum(o.expectedPlayerHealth[0]) || !isNum(o.expectedPlayerHealth[1])) return false;
  return true;
}

export function validateModule(m: unknown): boolean {
  if (!m || typeof m !== 'object') return false;
  const o = m as Record<string, unknown>;
  if (!isStr(o.id) || !isStr(o.name)) return false;
  if (!isArr(o.volleys)) return false;
  if (o.mode !== 'standard' && o.mode !== 'gorge') return false;
  if (!isArr(o.tags)) return false;
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
/*  Seed data — extracted from hardcoded Rivoli/Voltri volleys         */
/* ------------------------------------------------------------------ */

function makeVolley(
  range: number,
  acc: number,
  perc: number,
  retChance: number,
  retDmg: [number, number],
  lineDmg: number,
  narr: LabVolleyNarratives,
  retFire: LabReturnFireConfig,
  stamina: LabStaminaConfig,
  notes: string,
  eventDesc: string,
): LabVolleyEntry {
  return {
    id: uid(),
    def: { range, fireAccuracyBase: acc, perceptionBase: perc, enemyReturnFireChance: retChance, enemyReturnFireDamage: retDmg, enemyLineDamage: lineDmg },
    narratives: narr,
    returnFire: retFire,
    stamina,
    notes,
    eventDescription: eventDesc,
  };
}

function seedModules(): LineCombatModule[] {
  const ts = now();
  return [
    {
      id: 'rivoli-pt1',
      name: 'Rivoli Part 1 — Opening Volleys',
      description: 'First exchange at Rivoli. 120-25 paces, standard drill.',
      tags: ['rivoli', 'part-1'],
      mode: 'standard',
      volleys: [
        makeVolley(120, 0.20, 0.15, 0.15, [8, 14], 6,
          { present: 'Present arms. 120 paces.', fireOrder: '"Feu!"', endure: 'Return fire.', fireHit: ['Hit. Target down.'], fireMiss: ['Miss.'] },
          { frontRankBonus: 0.15, fatalChance: 0 }, { cost: 12, recovery: 4 },
          'Opening volley — long range', 'First volley hit event. Neighbour morale contagion.'),
        makeVolley(80, 0.35, 0.30, 0.25, [10, 18], 10,
          { present: 'Present. 80 paces.', fireOrder: '"FIRE!"', endure: 'Return fire.', fireHit: ['Hit. Target down.'], fireMiss: ['Miss.'] },
          { frontRankBonus: 0.15, fatalChance: 0 }, { cost: 12, recovery: 4 },
          'Closing range', 'Man killed nearby event. JB crisis auto-steadied.'),
        makeVolley(50, 0.50, 0.70, 0.40, [14, 24], 15,
          { present: 'Present. 50 paces.', fireOrder: '"FIRE!"', endure: 'Return fire. Men fall.', fireHit: ['Hit. Target down.'], fireMiss: ['Miss.'] },
          { frontRankBonus: 0.15, fatalChance: 0.12 }, { cost: 12, recovery: 4 },
          'Crisis volley — high casualties', 'Pierre wounded (shoulder). Officer dismounts. Artillery silenced. Left flank pressure.'),
        makeVolley(25, 0.70, 0.95, 0.50, [16, 28], 20,
          { present: 'Present. 25 paces. Last volley.', fireOrder: '"Tirez!"', endure: 'Fix bayonets.', fireHit: ['Hit. Target down.'], fireMiss: ['Miss.'] },
          { frontRankBonus: 0.15, fatalChance: 0.12 }, { cost: 12, recovery: 4 },
          'Point blank — final volley before melee', 'Enemy charging. Left flank breaking. Bayonets fixed.'),
      ],
      stateHints: { expectedEnemyStrength: [80, 100], expectedPlayerHealth: [60, 100], ncoPresent: true, artilleryActive: true, entryNotes: 'Battle start. NCO present, artillery active.', exitNotes: 'Transitions to melee.' },
      notes: 'Part 1 uses standard mode. 4 volleys with escalating intensity.',
      createdAt: ts, updatedAt: ts,
    },
    {
      id: 'rivoli-pt2',
      name: 'Rivoli Part 2 — Hold the Line',
      description: 'Fresh enemy column. 100-40 paces, standard drill. Exhausted defenders.',
      tags: ['rivoli', 'part-2'],
      mode: 'standard',
      volleys: [
        makeVolley(100, 0.30, 0.20, 0.20, [8, 14], 8,
          { present: 'Present. 100 paces. Fresh column.', fireOrder: '"Feu!"', endure: 'Return fire. Fresh muskets.', fireHit: ['Hit. Target down.'], fireMiss: ['Miss.'] },
          createDefaultReturnFire(), { cost: 14, recovery: 4 },
          'Fresh enemy column', "Vukassovich guns open. Masséna's presence steadies the line."),
        makeVolley(60, 0.45, 0.40, 0.30, [10, 20], 12,
          { present: 'Present. 60 paces. Right flank open.', fireOrder: '"FIRE!"', endure: 'Return fire. Surrounded.', fireHit: ['Hit. Target down.'], fireMiss: ['Miss.'] },
          createDefaultReturnFire(), { cost: 14, recovery: 4 },
          'Pontare fallen — flanked', 'Pontare fallen. Right flank exposed. Lusignan at Affi — surrounded.'),
        makeVolley(40, 0.60, 0.80, 0.45, [14, 26], 16,
          { present: 'Present. 40 paces. Last volley.', fireOrder: '"TIREZ!"', endure: 'Bonaparte on the ridge.', fireHit: ['Hit. Target down.'], fireMiss: ['Miss.'] },
          createDefaultReturnFire(), { cost: 14, recovery: 4 },
          'Desperate — surrounded', 'Men breaking in the rear. Bonaparte on the ridge — counterattack ordered.'),
      ],
      stateHints: { expectedEnemyStrength: [80, 100], expectedPlayerHealth: [30, 70], ncoPresent: false, artilleryActive: true, entryNotes: 'Player is exhausted from Part 1. NCO down.', exitNotes: 'Transitions to Gorge story beat.' },
      notes: 'Part 2 has higher stamina cost (14). Player carries wounds from Part 1.',
      createdAt: ts, updatedAt: ts,
    },
    {
      id: 'rivoli-pt3',
      name: 'Rivoli Part 3 — The Gorge',
      description: 'Shooting down into a gorge. 200 paces, gorge mode (target selection).',
      tags: ['rivoli', 'part-3', 'gorge'],
      mode: 'gorge',
      volleys: [
        makeVolley(200, 0.50, 0.90, 0.02, [3, 6], 10,
          { present: 'Fire at will. Gorge below.', fireOrder: '"Fire at will!"', endure: 'Scattered return fire.', fireHit: ['Hit. Gorge.'], fireMiss: ['Miss.'] },
          createDefaultReturnFire(), { cost: 3, recovery: 4 },
          'First gorge volley', 'Men surrendering below. Column still advancing.'),
        makeVolley(200, 0.50, 0.90, 0.03, [3, 6], 10,
          { present: 'Reload. More targets below.', fireOrder: '"Again!"', endure: 'Screams from below.', fireHit: ['Hit. Gorge.'], fireMiss: ['Miss.'] },
          createDefaultReturnFire(), { cost: 3, recovery: 4 },
          'Easy pickings', 'Screams from below. A boy among the dying (awareness > 40).'),
        makeVolley(200, 0.50, 0.90, 0.05, [3, 6], 8,
          { present: 'Column breaking. Wagon visible.', fireOrder: '"Fire!"', endure: 'Wounded call for help.', fireHit: ['Hit. Gorge.'], fireMiss: ['Miss.'] },
          createDefaultReturnFire(), { cost: 3, recovery: 4 },
          'Column disintegrating', 'Cries for help. Some men stop firing. Mercy morale boost if shown.'),
        makeVolley(200, 0.50, 0.90, 0.05, [3, 6], 8,
          { present: 'Last column. Wagon exposed.', fireOrder: '"Final volley!"', endure: "Silence. It's over.", fireHit: ['Hit. Gorge.'], fireMiss: ['Miss.'] },
          createDefaultReturnFire(), { cost: 3, recovery: 4 },
          'Final volley', 'Wagon detonation if not already destroyed. White flags.'),
      ],
      stateHints: { expectedEnemyStrength: [60, 100], expectedPlayerHealth: [30, 60], ncoPresent: false, artilleryActive: false, entryNotes: 'Player on ridge above gorge. No ENDURE step for return fire.', exitNotes: 'Transitions to Aftermath story beat.' },
      notes: 'Gorge mode — player selects targets (column, officers, wagon, mercy). Low return fire, low stamina cost.',
      createdAt: ts, updatedAt: ts,
    },
    {
      id: 'voltri-pt1',
      name: 'Voltri — Garrison Defense',
      description: 'Tutorial battle. 2 volleys at 150-100 paces.',
      tags: ['voltri', 'tutorial'],
      mode: 'standard',
      volleys: [
        makeVolley(150, 0.15, 0.10, 0.10, [5, 10], 4,
          { present: 'Present arms. 150 paces.', fireOrder: '"Feu!" Sergeant Morin\'s voice.', endure: 'Return fire from the olive groves.', fireHit: ['Hit. An Austrian stumbles among the olive trees.'], fireMiss: ['Miss. The ball clips branches overhead.'] },
          { frontRankBonus: 0.10, fatalChance: 0 }, { cost: 12, recovery: 4 },
          'Tutorial opening volley', 'First volley — smoke rolls. Sergeant Morin steadies.'),
        makeVolley(100, 0.25, 0.20, 0.18, [7, 13], 6,
          { present: 'Present. 100 paces.', fireOrder: '"FIRE!" The line erupts.', endure: 'Return fire. Ball hits nearby.', fireHit: ['Hit. Target down in the scrub.'], fireMiss: ['Miss. Smoke obscures.'] },
          { frontRankBonus: 0.10, fatalChance: 0 }, { cost: 12, recovery: 4 },
          'Tutorial closing volley', 'Second volley hits home. Man killed two files over. Line integrity loss.'),
      ],
      stateHints: { expectedEnemyStrength: [80, 100], expectedPlayerHealth: [80, 100], ncoPresent: true, artilleryActive: false, entryNotes: 'Tutorial battle. Player is fresh.', exitNotes: 'Transitions to Fix Bayonets story beat.' },
      notes: 'Voltri is the tutorial battle — lower intensity, gentler introduction.',
      createdAt: ts, updatedAt: ts,
    },
  ];
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
          const valid = parsed.filter((m: unknown) => validateModule(m)) as LineCombatModule[];
          if (valid.length > 0) {
            set({ modules: valid, dirty: false });
            // Re-persist if we dropped corrupt modules
            if (valid.length !== parsed.length) persistImmediate(valid);
            return;
          }
        }
      }
    } catch { /* fall through to seed */ }
    const seed = seedModules();
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
