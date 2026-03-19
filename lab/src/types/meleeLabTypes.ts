/* ------------------------------------------------------------------ */
/*  Melee Encounter Module — authorable unit for the Melee Lab         */
/* ------------------------------------------------------------------ */

/** Opponent type drives AI behavior in combat. */
export type OpponentType = 'conscript' | 'line' | 'veteran' | 'sergeant';

/** Ally personality drives AI combat style. */
export type AllyPersonality = 'aggressive' | 'balanced' | 'cautious';

/** Melee context — matches game MeleeContext enum values. */
export type LabMeleeContext = 'terrain' | 'battery' | 'skirmish';

/** Wave event action type. */
export type WaveAction = 'add_ally' | 'increase_max_enemies';

/* ------------------------------------------------------------------ */
/*  Sub-item types                                                     */
/* ------------------------------------------------------------------ */

export interface LabOpponentTemplate {
  id: string;
  name: string;
  type: OpponentType;
  health: [number, number];     // [min, max]
  stamina: [number, number];    // [min, max]
  strength: number;
  description: string;
  notes: string;
}

export interface LabAllyTemplate {
  id: string;
  name: string;
  type: string;                 // 'named' or custom
  npcId: string;                // links to game NPC id (optional, '' if none)
  health: [number, number];
  stamina: [number, number];
  strength: number;
  elan: number;
  personality: AllyPersonality;
  description: string;
  notes: string;
}

export interface LabWaveEvent {
  id: string;
  atRound: number;
  action: WaveAction;
  allyTemplateId: string;       // references LabAllyTemplate.id ('' if N/A)
  newMaxEnemies: number;        // used when action === 'increase_max_enemies'
  conditionNpcAlive: string;    // NPC id that must be alive, '' if unconditional
  narrative: string;
  notes: string;
}

/* ------------------------------------------------------------------ */
/*  Top-level module                                                   */
/* ------------------------------------------------------------------ */

export interface MeleeEncounterModule {
  id: string;
  name: string;
  description: string;
  tags: string[];
  context: LabMeleeContext;
  notes: string;

  // Parameters
  maxExchanges: number;
  initialActiveEnemies: number;
  maxActiveEnemies: number;

  // Rosters
  opponents: LabOpponentTemplate[];
  allies: LabAllyTemplate[];
  waveEvents: LabWaveEvent[];

  createdAt: string;  // ISO
  updatedAt: string;  // ISO
}

/* ------------------------------------------------------------------ */
/*  Validation                                                         */
/* ------------------------------------------------------------------ */

function isNum(v: unknown): v is number { return typeof v === 'number' && !Number.isNaN(v); }
function isStr(v: unknown): v is string { return typeof v === 'string'; }
function isArr(v: unknown): v is unknown[] { return Array.isArray(v); }

function isNumPair(v: unknown): v is [number, number] {
  return isArr(v) && v.length === 2 && isNum(v[0]) && isNum(v[1]);
}

const VALID_OPPONENT_TYPES: OpponentType[] = ['conscript', 'line', 'veteran', 'sergeant'];
const VALID_CONTEXTS: LabMeleeContext[] = ['terrain', 'battery', 'skirmish'];
const VALID_WAVE_ACTIONS: WaveAction[] = ['add_ally', 'increase_max_enemies'];
const VALID_PERSONALITIES: AllyPersonality[] = ['aggressive', 'balanced', 'cautious'];

function validateOpponent(o: unknown): boolean {
  if (!o || typeof o !== 'object') return false;
  const r = o as Record<string, unknown>;
  return isStr(r.id) && isStr(r.name)
    && isStr(r.type) && VALID_OPPONENT_TYPES.includes(r.type as OpponentType)
    && isNumPair(r.health) && isNumPair(r.stamina)
    && isNum(r.strength) && isStr(r.description) && isStr(r.notes);
}

function validateAlly(a: unknown): boolean {
  if (!a || typeof a !== 'object') return false;
  const r = a as Record<string, unknown>;
  return isStr(r.id) && isStr(r.name) && isStr(r.type)
    && isStr(r.npcId) && isNumPair(r.health) && isNumPair(r.stamina)
    && isNum(r.strength) && isNum(r.elan)
    && isStr(r.personality) && VALID_PERSONALITIES.includes(r.personality as AllyPersonality)
    && isStr(r.description) && isStr(r.notes);
}

function validateWaveEvent(w: unknown): boolean {
  if (!w || typeof w !== 'object') return false;
  const r = w as Record<string, unknown>;
  return isStr(r.id) && isNum(r.atRound)
    && isStr(r.action) && VALID_WAVE_ACTIONS.includes(r.action as WaveAction)
    && isStr(r.allyTemplateId) && isNum(r.newMaxEnemies)
    && isStr(r.conditionNpcAlive) && isStr(r.narrative) && isStr(r.notes);
}

export function validateEncounterModule(m: unknown): boolean {
  if (!m || typeof m !== 'object') return false;
  const r = m as Record<string, unknown>;
  if (!isStr(r.id) || !isStr(r.name)) return false;
  if (!isStr(r.description) || !isStr(r.notes)) return false;
  if (!isArr(r.tags) || !(r.tags as unknown[]).every(isStr)) return false;
  if (!isStr(r.context) || !VALID_CONTEXTS.includes(r.context as LabMeleeContext)) return false;
  if (!isNum(r.maxExchanges) || !isNum(r.initialActiveEnemies) || !isNum(r.maxActiveEnemies)) return false;
  if (!isArr(r.opponents) || !(r.opponents as unknown[]).every(validateOpponent)) return false;
  if (!isArr(r.allies) || !(r.allies as unknown[]).every(validateAlly)) return false;
  if (!isArr(r.waveEvents) || !(r.waveEvents as unknown[]).every(validateWaveEvent)) return false;
  return true;
}

export function normalizeEncounterModule(raw: Record<string, unknown>): MeleeEncounterModule {
  const ts = new Date().toISOString();
  return {
    id: isStr(raw.id) ? raw.id : uid(),
    name: isStr(raw.name) ? raw.name : 'Unnamed Encounter',
    description: isStr(raw.description) ? raw.description : '',
    tags: isArr(raw.tags) ? (raw.tags as unknown[]).filter(isStr) : [],
    context: isStr(raw.context) && VALID_CONTEXTS.includes(raw.context as LabMeleeContext)
      ? raw.context as LabMeleeContext : 'terrain',
    notes: isStr(raw.notes) ? raw.notes : '',
    maxExchanges: isNum(raw.maxExchanges) ? raw.maxExchanges : 10,
    initialActiveEnemies: isNum(raw.initialActiveEnemies) ? raw.initialActiveEnemies : 1,
    maxActiveEnemies: isNum(raw.maxActiveEnemies) ? raw.maxActiveEnemies : 1,
    opponents: isArr(raw.opponents) ? raw.opponents as LabOpponentTemplate[] : [],
    allies: isArr(raw.allies) ? raw.allies as LabAllyTemplate[] : [],
    waveEvents: isArr(raw.waveEvents) ? raw.waveEvents as LabWaveEvent[] : [],
    createdAt: isStr(raw.createdAt) ? raw.createdAt : ts,
    updatedAt: isStr(raw.updatedAt) ? raw.updatedAt : ts,
  };
}

/* ------------------------------------------------------------------ */
/*  Default factories                                                  */
/* ------------------------------------------------------------------ */

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function createDefaultOpponent(id?: string): LabOpponentTemplate {
  return {
    id: id ?? uid(),
    name: 'New Opponent',
    type: 'line',
    health: [70, 90],
    stamina: [160, 220],
    strength: 45,
    description: '',
    notes: '',
  };
}

export function createDefaultAlly(id?: string): LabAllyTemplate {
  return {
    id: id ?? uid(),
    name: 'New Ally',
    type: 'named',
    npcId: '',
    health: [60, 80],
    stamina: [140, 200],
    strength: 40,
    elan: 35,
    personality: 'balanced',
    description: '',
    notes: '',
  };
}

export function createDefaultWaveEvent(id?: string): LabWaveEvent {
  return {
    id: id ?? uid(),
    atRound: 3,
    action: 'add_ally',
    allyTemplateId: '',
    newMaxEnemies: 2,
    conditionNpcAlive: '',
    narrative: '',
    notes: '',
  };
}

export function createDefaultEncounterModule(name?: string): MeleeEncounterModule {
  const ts = new Date().toISOString();
  return {
    id: uid(),
    name: name ?? 'New Encounter',
    description: '',
    tags: [],
    context: 'terrain',
    notes: '',
    maxExchanges: 10,
    initialActiveEnemies: 1,
    maxActiveEnemies: 1,
    opponents: [],
    allies: [],
    waveEvents: [],
    createdAt: ts,
    updatedAt: ts,
  };
}
