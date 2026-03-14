import { create } from 'zustand';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type NodeType = 'interlude' | 'camp' | 'battle' | 'vn';

export interface ChapterNode {
  type: NodeType;
  id: string;
  label: string;
  description: string;
  details: Record<string, string | number>;
}

export interface CampaignChapter {
  id: string;
  number: number;
  title: string;
  dateRange: string;
  summary: string;
  keyBattles: string[];
  keyCommanders: { french: string[]; austrian: string[] };
  outcome: string;
  nodes: ChapterNode[];
}

export type ZoomLevel = 'campaign' | 'chapter' | 'node';

export interface NPCAssignment {
  npcId: string;
  name: string;
  role: 'NCO' | 'Officer' | 'Neighbour';
  status: 'active' | 'killed' | 'wounded' | 'replaced';
  introducedAt: string;
  exitAt: string | null;
  replacedBy: string | null;
  personality: string;
  socializeNarrative: string;
  rank: string;
  baseStats: { valor: number; morale: number; maxMorale: number; relationship: number };
}

/* ------------------------------------------------------------------ */
/*  Camp Event Blueprint types                                         */
/* ------------------------------------------------------------------ */

export interface EventChoiceBlueprint {
  id: string;
  label: string;
  description: string;
  statCheck?: { stat: string; difficulty: number };
}

export interface EventBlueprint {
  id: string;
  title: string;
  category: 'disease' | 'desertion' | 'weather' | 'supply' | 'interpersonal' | 'orders' | 'rumour';
  narrative: string;
  choices: EventChoiceBlueprint[];
}

export interface ForcedEventBlueprint extends EventBlueprint {
  triggerAt: number;
}

export interface RandomEventBlueprint extends EventBlueprint {
  weight: number;
}

export interface CampEventData {
  forcedEvents: ForcedEventBlueprint[];
  randomEvents: RandomEventBlueprint[];
  randomEventChance: number;
}

/* ------------------------------------------------------------------ */
/*  Campaign Blueprint (full export format)                            */
/* ------------------------------------------------------------------ */

export interface CampaignBlueprint {
  version: 1;
  exportedAt: string;
  chapters: CampaignChapter[];
  npcAssignments: NPCAssignment[];
  interludeNarratives: Record<string, { chunks: string[]; splashText: string }>;
  campEvents: Record<string, CampEventData>;
}

/* ------------------------------------------------------------------ */
/*  Seed data                                                          */
/* ------------------------------------------------------------------ */

export const CHAPTERS_SEED: CampaignChapter[] = [
  {
    id: 'ch1', number: 1, title: 'Army of Italy',
    dateRange: 'March-April 1796',
    summary: 'Napoleon takes command of the ragged Army of Italy at Nice. The army is starving, barefoot, and demoralized. You are a private soldier garrisoned at Voltri — a fishing town on the Ligurian coast.',
    keyBattles: ['Voltri (10 Apr)'],
    keyCommanders: { french: ['Napoleon', 'Masséna', 'La Harpe'], austrian: ['Beaulieu', 'Argenteau'] },
    outcome: 'Austrian attack forces French withdrawal from Voltri. The campaign begins.',
    nodes: [
      { type: 'interlude', id: 'voltri-prologue', label: 'Voltri Prologue', description: 'Introduction to the Italian Campaign. The player arrives at the Ligurian coast.', details: { beats: 5 } },
      { type: 'camp', id: 'voltri-garrison', label: 'Garrison at Voltri', description: 'Garrison life at the coastal town of Voltri, April 1796. 12 actions, 5 forced events.', details: { actions: 12, weather: 'clear', supply: 'scarce', openingNarrative: 'The 14th demi-brigade holds garrison at Voltri, a fishing town on the Ligurian coast west of Genoa. The army is starving, the pay is months late, and the new general — Bonaparte — has yet to prove himself. But the coast is beautiful, and for the moment, no one is shooting at you.' } },
      { type: 'battle', id: 'voltri', label: 'Battle of Voltri', description: 'Austrian attack on the coastal garrison. Tutorial battle — 1 part, 2 volleys.', details: { volleys: 2, parts: 1 } },
    ],
  },
  {
    id: 'ch2', number: 2, title: 'Montenotte',
    dateRange: 'April 1796',
    summary: 'Napoleon strikes at the junction between Austrian and Piedmontese forces, defeating them in detail. The first victory of the campaign.',
    keyBattles: ['Montenotte (12 Apr)', 'Millesimo (13 Apr)', 'Dego (14-15 Apr)'],
    keyCommanders: { french: ['Napoleon', 'La Harpe', 'Augereau', 'Masséna'], austrian: ['Argenteau', 'Beaulieu'] },
    outcome: 'Austrian centre broken. Piedmontese isolated.',
    nodes: [
      { type: 'interlude', id: 'montenotte-prologue', label: 'March into the Mountains', description: 'The army moves north from the coast into the Apennine passes.', details: {} },
      { type: 'camp', id: 'montenotte-camp', label: 'Camp at Montenotte', description: 'Night before the first real battle. Rain, fog, mountain terrain.', details: { actions: 14 } },
      { type: 'battle', id: 'montenotte', label: 'Battle of Montenotte', description: 'Dawn attack through mountain ravines.', details: {} },
    ],
  },
  {
    id: 'ch3', number: 3, title: 'Mondovì',
    dateRange: 'April 1796',
    summary: 'Napoleon turns on Piedmont-Sardinia. The fertile plains offer plunder and relief from starvation, but also moral complications.',
    keyBattles: ['Mondovì (21 Apr)', 'Armistice of Cherasco (28 Apr)'],
    keyCommanders: { french: ['Napoleon', 'Sérurier', 'Augereau'], austrian: [] },
    outcome: 'Piedmont-Sardinia sues for peace. French army fed and re-equipped.',
    nodes: [
      { type: 'camp', id: 'mondovi-camp', label: 'Camp at Mondovì', description: 'Plunder and feasting on the Piedmontese plain.', details: { actions: 14 } },
      { type: 'battle', id: 'mondovi', label: 'Battle of Mondovì', description: 'Attack on the Piedmontese defensive position.', details: {} },
    ],
  },
  {
    id: 'ch4', number: 4, title: 'Lodi',
    dateRange: 'May 1796',
    summary: 'The charge across the bridge at Lodi becomes legendary. Napoleon earns the nickname "le petit caporal" from his men.',
    keyBattles: ['Fombio (8 May)', 'Lodi Bridge (10 May)'],
    keyCommanders: { french: ['Napoleon', 'Masséna', 'Dallemagne', 'Lannes'], austrian: ['Beaulieu', 'Sebottendorf'] },
    outcome: 'Austrian rearguard destroyed. Road to Milan open.',
    nodes: [
      { type: 'interlude', id: 'montenotte-lodi', label: 'March to Lodi', description: 'The army crosses the Po and advances on Milan.', details: { beats: 3 } },
      { type: 'camp', id: 'lodi-camp', label: 'Camp at Lodi', description: 'On the riverbank. The bridge awaits.', details: { actions: 14 } },
      { type: 'battle', id: 'lodi', label: 'Battle of Lodi', description: 'Charge across the bridge under Austrian cannon fire.', details: {} },
    ],
  },
  {
    id: 'ch5', number: 5, title: 'Milan',
    dateRange: 'May-June 1796',
    summary: 'The French occupy Milan. Garrison duty in an Italian city — culture shock, uneasy occupation, political intrigue.',
    keyBattles: [],
    keyCommanders: { french: ['Napoleon', 'Murat'], austrian: [] },
    outcome: 'French consolidate control of Lombardy. Mantua siege begins.',
    nodes: [
      { type: 'camp', id: 'milan-garrison', label: 'Garrison at Milan', description: 'Urban garrison life. Italian architecture, culture, unease.', details: { actions: 16 } },
    ],
  },
  {
    id: 'ch6', number: 6, title: 'Mantua Siege',
    dateRange: 'July-August 1796',
    summary: 'The siege drags on in the malarial marshes. Disease kills more men than the Austrians. Wurmser marches south with a relief army.',
    keyBattles: ['Siege of Mantua (ongoing)', 'Lonato (3 Aug)'],
    keyCommanders: { french: ['Napoleon', 'Masséna', 'Augereau', 'Sérurier'], austrian: ['Wurmser'] },
    outcome: 'First relief attempt begins. French must lift siege temporarily.',
    nodes: [
      { type: 'camp', id: 'mantua-siege-camp', label: 'Siege Lines at Mantua', description: 'Malarial marsh, heat, disease, boredom, death.', details: { actions: 14 } },
      { type: 'battle', id: 'mantua-siege', label: 'Defense of the Siege', description: 'Holding the lines against Austrian sorties.', details: {} },
    ],
  },
  {
    id: 'ch7', number: 7, title: 'Castiglione',
    dateRange: 'August 1796',
    summary: "Wurmser's relief army is defeated at Castiglione. A desperate defensive battle in the summer heat near Lake Garda.",
    keyBattles: ['Castiglione (5 Aug)'],
    keyCommanders: { french: ['Napoleon', 'Masséna', 'Augereau', 'Marmont'], austrian: ['Wurmser', 'Quasdanovich'] },
    outcome: 'Wurmser retreats. Siege of Mantua resumes.',
    nodes: [
      { type: 'interlude', id: 'lodi-castiglione', label: 'Summer in Lombardy', description: 'March south along Lake Garda in murderous heat.', details: { beats: 3 } },
      { type: 'camp', id: 'castiglione-camp', label: 'Camp at Castiglione', description: 'Lake Garda hillside. Exhausted troops, summer heat.', details: { actions: 14 } },
      { type: 'battle', id: 'castiglione', label: 'Battle of Castiglione', description: "Desperate defense against Wurmser's relief army.", details: {} },
    ],
  },
  {
    id: 'ch8', number: 8, title: 'Bassano',
    dateRange: 'September 1796',
    summary: 'Wurmser thrusts through the Brenta valley. Napoleon races to intercept in the autumn mountains.',
    keyBattles: ['Bassano (8 Sept)', 'Rovereto (4 Sept)'],
    keyCommanders: { french: ['Napoleon', 'Masséna', 'Augereau'], austrian: ['Wurmser'] },
    outcome: 'Wurmser defeated again, retreats into Mantua. Now besieged himself.',
    nodes: [
      { type: 'camp', id: 'bassano-camp', label: 'Camp in the Brenta Valley', description: 'Autumn mountain valley, river below, fast-moving clouds.', details: { actions: 12 } },
      { type: 'battle', id: 'bassano', label: 'Battle of Bassano', description: 'Pursuit through the mountain valley.', details: {} },
    ],
  },
  {
    id: 'ch9', number: 9, title: 'Caldiero',
    dateRange: 'October-November 1796',
    summary: 'A rare French defeat. Alvinczi repulses the attack at Caldiero in the rain and mud. The darkest hour of the campaign.',
    keyBattles: ['Caldiero (12 Nov)'],
    keyCommanders: { french: ['Napoleon', 'Masséna', 'Augereau'], austrian: ['Alvinczi', 'Davidovich'] },
    outcome: 'French retreat. Morale at its lowest.',
    nodes: [
      { type: 'interlude', id: 'castiglione-arcole', label: 'Road to Arcole', description: 'The marshes around Arcole. Narrow causeways swept by grapeshot.', details: { beats: 3 } },
      { type: 'camp', id: 'caldiero-camp', label: 'Camp at Caldiero', description: 'Muddy field. Rain. Tattered uniforms. Despair.', details: { actions: 10 } },
      { type: 'battle', id: 'caldiero', label: 'Battle of Caldiero', description: 'Attack in driving rain. Repulsed.', details: {} },
    ],
  },
  {
    id: 'ch10', number: 10, title: 'Arcole',
    dateRange: 'November 1796',
    summary: "Three days of fighting for the bridge at Arcole. Napoleon personally leads a charge with the flag. Grim determination wins the day.",
    keyBattles: ['Arcole (15-17 Nov)'],
    keyCommanders: { french: ['Napoleon', 'Masséna', 'Augereau', 'Lannes'], austrian: ['Alvinczi'] },
    outcome: 'Austrian retreat. French hold northern Italy.',
    nodes: [
      { type: 'camp', id: 'arcole-camp', label: 'Camp at Arcole', description: 'Marsh/causeway. November dawn, frost, thin ice.', details: { actions: 12 } },
      { type: 'battle', id: 'arcole', label: 'Battle of Arcole', description: 'Three days on the bridge. Napoleon charges with the flag.', details: {} },
    ],
  },
  {
    id: 'ch11', number: 11, title: 'Rivoli',
    dateRange: 'January 1797',
    summary: "The decisive battle. Joubert's division holds the plateau above Rivoli against 28,000 Austrians until Masséna arrives.",
    keyBattles: ['Rivoli (14-15 Jan)'],
    keyCommanders: { french: ['Napoleon', 'Joubert', 'Masséna', 'Rey'], austrian: ['Alvinczi', 'Lusignan', 'Lipthay'] },
    outcome: 'Decisive French victory. Austrian army shattered.',
    nodes: [
      { type: 'interlude', id: 'arcole-rivoli', label: 'Winter on the Adige', description: 'Winter settles. Alvinczi marches south with 28,000 men.', details: { beats: 3 } },
      { type: 'interlude', id: 'italy-prologue', label: 'Italy Prologue', description: 'Full campaign recap and setup for Rivoli.', details: { beats: 5 } },
      { type: 'camp', id: 'eve-of-rivoli', label: 'Eve of Rivoli', description: 'Night before the battle on the plateau. 16 actions.', details: { actions: 16, weather: 'cold', supply: 'scarce' } },
      { type: 'battle', id: 'rivoli', label: 'Battle of Rivoli', description: 'The main battle. 3 parts, 11 volleys, multiple melee encounters.', details: { volleys: 11, parts: 3 } },
    ],
  },
  {
    id: 'ch12', number: 12, title: 'Fall of Mantua',
    dateRange: 'February 1797',
    summary: "With Alvinczi defeated, Mantua's garrison finally surrenders. The long siege is over.",
    keyBattles: ['Surrender of Mantua (2 Feb)'],
    keyCommanders: { french: ['Napoleon', 'Sérurier'], austrian: ['Wurmser (surrenders)'] },
    outcome: "Mantua falls. Austria's last foothold in Italy is gone.",
    nodes: [
      { type: 'interlude', id: 'rivoli-mantua', label: 'The Fall of Mantua', description: 'The siege tightens. Wurmser surrenders.', details: { beats: 3 } },
      { type: 'camp', id: 'mantua-fall-camp', label: 'Outside Mantua', description: 'Fortress walls, surrendering column, winter morning.', details: { actions: 8 } },
    ],
  },
  {
    id: 'ch13', number: 13, title: 'March on Vienna',
    dateRange: 'March-April 1797',
    summary: 'Bonaparte marches into Austria itself. The alpine passes open to green valleys and spring. The Treaty of Campo Formio ends the war.',
    keyBattles: ['Tagliamento (16 Mar)', 'Treaty of Campo Formio (17 Oct)'],
    keyCommanders: { french: ['Napoleon'], austrian: ['Archduke Charles'] },
    outcome: 'Austria sues for peace. Italy is French. Napoleon returns a hero.',
    nodes: [
      { type: 'camp', id: 'vienna-march-camp', label: 'Alpine Road', description: 'Mountain pass opening to green valley. Spring flowers. Hope.', details: { actions: 8 } },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Display helpers                                                    */
/* ------------------------------------------------------------------ */

export const nodeTypeColor: Record<NodeType, string> = {
  interlude: 'var(--stamina-high)',
  camp: 'var(--accent-gold)',
  battle: 'var(--accent-red-bright)',
  vn: 'var(--accent-blue)',
};

export const nodeTypeLabel: Record<NodeType, string> = {
  interlude: 'Interlude',
  camp: 'Camp',
  battle: 'Battle',
  vn: 'Visual Novel',
};

/* ------------------------------------------------------------------ */
/*  Store                                                              */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = 'lab_campaign_editor';
const POSITIONS_KEY = 'lab_campaign_editor_positions';
const NPCS_KEY = 'lab_campaign_editor_npcs';
const NARRATIVES_KEY = 'lab_campaign_editor_narratives';
const CAMP_EVENTS_KEY = 'lab_campaign_editor_camp_events';
const REPLACEMENT_POOL_KEY = 'lab_campaign_editor_replacement_pool';

export type ViewMode = 'list' | 'graph' | 'timeline' | 'playthrough';

/* ------------------------------------------------------------------ */
/*  Node completeness helper                                           */
/* ------------------------------------------------------------------ */

export type NodeCompleteness = 'complete' | 'partial' | 'empty';

export function getNodeCompleteness(
  node: ChapterNode,
  interludeNarratives: Record<string, { chunks: string[]; splashText: string }>,
  campEvents: Record<string, CampEventData>,
): NodeCompleteness {
  if (node.type === 'camp') {
    const hasEvents = !!(campEvents[node.id] && (campEvents[node.id].forcedEvents.length > 0 || campEvents[node.id].randomEvents.length > 0));
    const hasNarrative = typeof node.details.openingNarrative === 'string' && (node.details.openingNarrative as string).length > 0;
    if (hasEvents && hasNarrative) return 'complete';
    if (hasEvents || hasNarrative) return 'partial';
    return 'empty';
  }
  if (node.type === 'battle') {
    const hasVolleys = typeof node.details.volleys === 'number' && node.details.volleys > 0;
    const hasParts = typeof node.details.parts === 'number' && node.details.parts > 0;
    if (hasVolleys && hasParts) return 'complete';
    if (hasVolleys || hasParts) return 'partial';
    return 'empty';
  }
  if (node.type === 'interlude' || node.type === 'vn') {
    const narrative = interludeNarratives[node.id];
    if (narrative && narrative.chunks.length > 0) return 'complete';
    return 'empty';
  }
  return 'empty';
}

/* ------------------------------------------------------------------ */
/*  Type-specific detail keys                                          */
/* ------------------------------------------------------------------ */

export const CAMP_DETAIL_KEYS = ['actions', 'weather', 'supply', 'openingNarrative'];
export const BATTLE_DETAIL_KEYS = ['parts', 'volleys'];
export const INTERLUDE_DETAIL_KEYS = ['beats', 'fromBattle', 'toBattle'];
export const VN_DETAIL_KEYS = ['beats', 'fromBattle', 'toBattle'];

export function getKeysForType(type: NodeType): string[] {
  switch (type) {
    case 'camp': return CAMP_DETAIL_KEYS;
    case 'battle': return BATTLE_DETAIL_KEYS;
    case 'interlude': return INTERLUDE_DETAIL_KEYS;
    case 'vn': return VN_DETAIL_KEYS;
  }
}

/* ------------------------------------------------------------------ */
/*  Default replacement pool                                           */
/* ------------------------------------------------------------------ */

export const DEFAULT_REPLACEMENT_POOL: NPCAssignment[] = [
  { npcId: 'girard', name: 'Girard', role: 'Neighbour', status: 'active', introducedAt: '', exitAt: null, replacedBy: null, personality: 'A quiet man from Provence. Former farmhand. Does what he is told.', socializeNarrative: '', rank: 'Private', baseStats: { valor: 35, morale: 70, maxMorale: 90, relationship: 20 } },
  { npcId: 'moreau', name: 'Moreau', role: 'NCO', status: 'active', introducedAt: '', exitAt: null, replacedBy: null, personality: 'A by-the-book corporal promoted to sergeant after casualties. Nervous authority.', socializeNarrative: '', rank: 'Sergeant', baseStats: { valor: 45, morale: 75, maxMorale: 100, relationship: 25 } },
  { npcId: 'thibault', name: 'Thibault', role: 'Neighbour', status: 'active', introducedAt: '', exitAt: null, replacedBy: null, personality: 'Conscript from Lyon. Young, scared, tries to hide it with bluster.', socializeNarrative: '', rank: 'Private', baseStats: { valor: 30, morale: 65, maxMorale: 85, relationship: 15 } },
  { npcId: 'renard', name: 'Renard', role: 'Officer', status: 'active', introducedAt: '', exitAt: null, replacedBy: null, personality: 'Transferred from the Rhine army. Competent but cold. Doesn\'t know the men yet.', socializeNarrative: '', rank: 'Lieutenant', baseStats: { valor: 50, morale: 85, maxMorale: 100, relationship: 10 } },
];

interface CampaignEditorState {
  chapters: CampaignChapter[];
  dirty: boolean;
  selectedChapter: string | null;
  selectedNode: string | null;
  zoomLevel: ZoomLevel;
  viewMode: ViewMode;
  nodePositions: Record<string, { x: number; y: number }>;
  npcAssignments: NPCAssignment[];
  interludeNarratives: Record<string, { chunks: string[]; splashText: string }>;
  campEvents: Record<string, CampEventData>;
  replacementPool: NPCAssignment[];

  // Undo/redo
  undoStack: CampaignChapter[][];
  redoStack: CampaignChapter[][];

  // Navigation
  setZoom: (level: ZoomLevel) => void;
  selectChapter: (id: string | null) => void;
  selectNode: (id: string | null) => void;
  setViewMode: (mode: ViewMode) => void;

  // Chapter CRUD
  updateChapter: (id: string, patch: Partial<Omit<CampaignChapter, 'id' | 'nodes'>>) => void;
  addChapter: (afterId?: string) => void;
  removeChapter: (id: string) => void;
  reorderChapter: (id: string, direction: 'up' | 'down') => void;
  duplicateChapter: (id: string) => void;

  // Node CRUD
  updateNode: (chapterId: string, nodeId: string, patch: Partial<Omit<ChapterNode, 'id'>>) => void;
  addNode: (chapterId: string, afterNodeId?: string, type?: NodeType) => void;
  removeNode: (chapterId: string, nodeId: string) => void;
  reorderNode: (chapterId: string, nodeId: string, direction: 'up' | 'down') => void;
  duplicateNode: (chapterId: string, nodeId: string) => void;

  // Graph positions
  updateNodePosition: (nodeId: string, x: number, y: number) => void;
  clearPositions: () => void;

  // NPC assignments
  addNPC: (npc: NPCAssignment) => void;
  updateNPC: (npcId: string, patch: Partial<Omit<NPCAssignment, 'npcId'>>) => void;
  removeNPC: (npcId: string) => void;
  killNPC: (npcId: string, atChapter: string, replacedBy?: string) => void;
  seedNPCsFromCampaign: () => void;

  // Replacement pool
  addReplacementNPC: (npc: NPCAssignment) => void;
  updateReplacementNPC: (npcId: string, patch: Partial<Omit<NPCAssignment, 'npcId'>>) => void;
  removeReplacementNPC: (npcId: string) => void;

  // Camp events
  getCampEvents: (nodeId: string) => CampEventData;
  updateCampEvents: (nodeId: string, data: CampEventData) => void;

  // Interlude narratives
  updateInterludeNarrative: (nodeId: string, chunks: string[], splashText: string) => void;

  // Undo/redo
  undo: () => void;
  redo: () => void;

  // Persistence
  save: () => void;
  loadSaved: () => boolean;
  exportJSON: () => string;
  importJSON: (json: string) => boolean;
  resetToSeed: () => void;
}

let idCounter = 0;
function genId(prefix: string): string {
  return `${prefix}-${Date.now()}-${++idCounter}`;
}

const MAX_UNDO = 20;

function renumber(chapters: CampaignChapter[]): void {
  chapters.forEach((ch, i) => { ch.number = i + 1; });
}

function persist(chapters: CampaignChapter[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chapters));
  } catch { /* quota exceeded / private browsing */ }
}

function persistPositions(positions: Record<string, { x: number; y: number }>): void {
  try {
    localStorage.setItem(POSITIONS_KEY, JSON.stringify(positions));
  } catch { /* quota exceeded / private browsing */ }
}

function persistNPCs(npcs: NPCAssignment[]): void {
  try {
    localStorage.setItem(NPCS_KEY, JSON.stringify(npcs));
  } catch { /* quota exceeded / private browsing */ }
}

function persistNarratives(narratives: Record<string, { chunks: string[]; splashText: string }>): void {
  try {
    localStorage.setItem(NARRATIVES_KEY, JSON.stringify(narratives));
  } catch { /* quota exceeded / private browsing */ }
}

function persistCampEvents(campEvents: Record<string, CampEventData>): void {
  try {
    localStorage.setItem(CAMP_EVENTS_KEY, JSON.stringify(campEvents));
  } catch { /* quota exceeded / private browsing */ }
}

function persistReplacementPool(pool: NPCAssignment[]): void {
  try {
    localStorage.setItem(REPLACEMENT_POOL_KEY, JSON.stringify(pool));
  } catch { /* quota exceeded / private browsing */ }
}

function defaultCampEventData(): CampEventData {
  return { forcedEvents: [], randomEvents: [], randomEventChance: 0.4 };
}

const DEFAULT_NPC_BASE = { personality: '', socializeNarrative: '', rank: 'Private', baseStats: { valor: 40, morale: 80, maxMorale: 100, relationship: 30 } };

const DEFAULT_NPC_ASSIGNMENTS: NPCAssignment[] = [
  { npcId: 'morin', name: 'Sergeant Morin', role: 'NCO', status: 'active', introducedAt: 'ch1', exitAt: null, replacedBy: null, rank: 'Sergeant', personality: 'The section sergent. Practical, tired, fair. Keeps the men together.', socializeNarrative: 'Sergeant Morin shares his pipe and stares at the sea. "I was at Valmy," he says. "The Revolution\'s first battle. We stood in the rain and the Prussians turned back. I thought the war was over." He laughs, short and bitter.', baseStats: { valor: 60, morale: 90, maxMorale: 100, relationship: 30 } },
  { npcId: 'vidal', name: 'Lieutenant Vidal', role: 'Officer', status: 'active', introducedAt: 'ch1', exitAt: null, replacedBy: null, rank: 'Lieutenant', personality: 'Company officer. Ambitious but distant. Thinks about promotion, not his men.', socializeNarrative: 'Lieutenant Vidal is studying a map by candlelight. He acknowledges you with a nod but doesn\'t look up. "The passes," he mutters. "If they come through the passes..." He trails off. You leave him to his thoughts.', baseStats: { valor: 45, morale: 80, maxMorale: 100, relationship: 20 } },
  { npcId: 'felix', name: 'Felix Martel', role: 'Neighbour', status: 'active', introducedAt: 'ch1', exitAt: null, replacedBy: null, rank: 'Private', personality: 'A former traveling musician turned soldier. Quick with cards and quicker with excuses. The kind of man who always has extra bread and you never ask where it came from.', socializeNarrative: 'Felix produces a battered deck of cards from nowhere. "I\'ll teach you a trick," he says, shuffling one-handed. "Not a card trick — a life trick. Always look like you belong, and never be the last one to leave." He grins. "Works in the army. Worked better in the theatre."', baseStats: { valor: 30, morale: 75, maxMorale: 85, relationship: 10 } },
  { npcId: 'pierre', name: 'Pierre', role: 'Neighbour', status: 'active', introducedAt: 'ch11', exitAt: null, replacedBy: null, ...DEFAULT_NPC_BASE },
  { npcId: 'jean-baptiste', name: 'Jean-Baptiste', role: 'Neighbour', status: 'active', introducedAt: 'ch11', exitAt: null, replacedBy: null, ...DEFAULT_NPC_BASE },
  { npcId: 'duval', name: 'Sergeant Duval', role: 'NCO', status: 'active', introducedAt: 'ch11', exitAt: null, replacedBy: null, ...DEFAULT_NPC_BASE, rank: 'Sergeant' },
  { npcId: 'leclerc', name: 'Captain Leclerc', role: 'Officer', status: 'active', introducedAt: 'ch11', exitAt: null, replacedBy: null, ...DEFAULT_NPC_BASE, rank: 'Captain' },
];

const DEFAULT_NARRATIVES: Record<string, { chunks: string[]; splashText: string }> = {
  'voltri-prologue': {
    splashText: 'The Italian Campaign',
    chunks: [
      'Ligurian Coast, April 1796',
      'The Army of Italy starves on the Riviera. Stretched thin from Nice to Genoa, the soldiers of the Republic endure in wretched form. The Directory believes Italy is a sideshow \u2014 the real war is on the Rhine.',
      'A new general has taken command. Young and blazing with ambition. The men don\u2019t know what to make of him yet.',
      'You are a private soldier garrisoned at Voltri \u2014 a fishing town on the Ligurian coast, seventeen kilometers west of Genoa. A strategic position between mountains and sea. The Austrian army gathers somewhere in those mountains.',
      'You are young, untested and already beleaguered by the sorry state of French Army of Italy. You are no one special.',
    ],
  },
};

const DEFAULT_CAMP_EVENTS: Record<string, CampEventData> = {
  'voltri-garrison': {
    forcedEvents: [
      {
        id: 'voltri_gambling_invitation',
        title: 'The Passe-Dix Game',
        category: 'interpersonal',
        triggerAt: 10,
        narrative: 'Evening. A knot of soldiers crowds around a blanket spread in the dirt behind the cookfires. Dice clatter. Coins change hands. Felix Martel catches your eye. "Room for one more, friend. Two sous to play. The dice don\u2019t care about rank."',
        choices: [
          { id: 'join_game', label: 'Join the game', description: 'Sit down, put your money in, roll the dice. [Costs 2 sous]' },
          { id: 'watch', label: 'Watch', description: 'Stand at the edge. Learn how Felix works before risking your money.' },
          { id: 'decline', label: 'Decline', description: 'Walk away. You didn\u2019t survive this long by gambling.' },
        ],
      },
      {
        id: 'voltri_coast_at_night',
        title: 'The Coast at Night',
        category: 'interpersonal',
        triggerAt: 8,
        narrative: 'You slip away from the camp after supper and walk down to the shore. The Mediterranean stretches out before you, black and silver under the stars.',
        choices: [
          { id: 'write_letter', label: 'Write a letter home', description: 'Find the words, if you can. Put something down before you forget how this feels.' },
          { id: 'watch_sea', label: 'Watch the sea', description: 'Stay here a while. Let the quiet settle into you.' },
        ],
      },
      {
        id: 'voltri_ligurian_girl',
        title: 'The Ligurian Girl',
        category: 'interpersonal',
        triggerAt: 6,
        narrative: 'A girl from the town appears at the edge of camp with a basket of lemons. A big corporal named Gros approaches her with the wrong kind of smile. He puts a hand on her arm. She tries to pull away. The men nearby look at the ground.',
        choices: [
          { id: 'step_in', label: 'Step in', description: 'Tell him to let her go.', statCheck: { stat: 'charisma', difficulty: 0 } },
          { id: 'fetch_morin', label: 'Fetch Sergeant Morin', description: 'Find Morin. He\u2019ll put a stop to this.', statCheck: { stat: 'endurance', difficulty: 0 } },
          { id: 'look_away', label: 'Look away', description: 'It\u2019s not your problem. Keep your head down.' },
        ],
      },
      {
        id: 'voltri_genoese_merchant',
        title: 'The Genoese Merchant',
        category: 'supply',
        triggerAt: 4,
        narrative: 'A local merchant appears at the edge of camp, mule loaded with bread, cheese, and wine. The prices are outrageous \u2014 three times what they should be. He knows you\'re starving and he doesn\'t care.',
        choices: [
          { id: 'spot_cheating', label: 'Check the goods', description: 'Something about those sacks doesn\'t look right.', statCheck: { stat: 'awareness', difficulty: 0 } },
          { id: 'haggle', label: 'Haggle him down', description: 'Talk the price down. Make him earn his profit.', statCheck: { stat: 'charisma', difficulty: 0 } },
        ],
      },
      {
        id: 'voltri_theft_opportunity',
        title: 'An Opportunity',
        category: 'interpersonal',
        triggerAt: 2,
        narrative: 'Felix catches your arm after evening roll call. "I\u2019ve been watching the officer\u2019s reserve stores. Vidal keeps the key on his belt, but tonight he\u2019s drinking with the captain from the 32nd. The lock is nothing. I need someone to keep watch." He holds your gaze. "Equal shares."',
        choices: [
          { id: 'join_theft', label: 'Keep watch', description: 'Stand guard while Felix works the lock. Equal shares.', statCheck: { stat: 'awareness', difficulty: 0 } },
          { id: 'refuse', label: 'Refuse', description: 'Shake your head. You\u2019re not a thief. Not yet.' },
        ],
      },
    ],
    randomEvents: [],
    randomEventChance: 0,
  },
};

export const useCampaignEditorStore = create<CampaignEditorState>((set, get) => {
  /** Push current chapters to undo stack before a mutation */
  function pushUndo() {
    const { chapters, undoStack } = get();
    const snapshot = structuredClone(chapters);
    const newStack = [...undoStack, snapshot];
    if (newStack.length > MAX_UNDO) newStack.shift();
    set({ undoStack: newStack, redoStack: [] });
  }

  return {
  chapters: structuredClone(CHAPTERS_SEED),
  dirty: false,
  selectedChapter: null,
  selectedNode: null,
  npcAssignments: structuredClone(DEFAULT_NPC_ASSIGNMENTS),
  interludeNarratives: structuredClone(DEFAULT_NARRATIVES),
  campEvents: structuredClone(DEFAULT_CAMP_EVENTS),
  replacementPool: structuredClone(DEFAULT_REPLACEMENT_POOL),
  zoomLevel: 'campaign',
  viewMode: 'list',
  nodePositions: {},
  undoStack: [],
  redoStack: [],

  // -- Navigation --
  setZoom: (level) => set({ zoomLevel: level }),
  selectChapter: (id) => set({ selectedChapter: id, selectedNode: null }),
  selectNode: (id) => set({ selectedNode: id }),
  setViewMode: (mode) => set({ viewMode: mode }),

  // -- Chapter CRUD --
  updateChapter: (id, patch) => {
    pushUndo();
    const chapters = structuredClone(get().chapters);
    const ch = chapters.find((c) => c.id === id);
    if (!ch) return;
    Object.assign(ch, patch);
    persist(chapters);
    set({ chapters, dirty: true });
  },

  addChapter: (afterId) => {
    pushUndo();
    const chapters = structuredClone(get().chapters);
    const newCh: CampaignChapter = {
      id: genId('ch'),
      number: 0,
      title: 'New Chapter',
      dateRange: '',
      summary: '',
      keyBattles: [],
      keyCommanders: { french: [], austrian: [] },
      outcome: '',
      nodes: [],
    };
    if (afterId) {
      const idx = chapters.findIndex((c) => c.id === afterId);
      chapters.splice(idx + 1, 0, newCh);
    } else {
      chapters.push(newCh);
    }
    renumber(chapters);
    persist(chapters);
    set({ chapters, dirty: true });
  },

  removeChapter: (id) => {
    pushUndo();
    let chapters = structuredClone(get().chapters);
    chapters = chapters.filter((c) => c.id !== id);
    renumber(chapters);
    persist(chapters);
    const updates: Partial<CampaignEditorState> = { chapters, dirty: true };
    if (get().selectedChapter === id) {
      updates.selectedChapter = null;
      updates.selectedNode = null;
      updates.zoomLevel = 'campaign';
    }
    set(updates);
  },

  reorderChapter: (id, direction) => {
    pushUndo();
    const chapters = structuredClone(get().chapters);
    const idx = chapters.findIndex((c) => c.id === id);
    if (idx < 0) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= chapters.length) return;
    [chapters[idx], chapters[targetIdx]] = [chapters[targetIdx], chapters[idx]];
    renumber(chapters);
    persist(chapters);
    set({ chapters, dirty: true });
  },

  duplicateChapter: (id) => {
    pushUndo();
    const chapters = structuredClone(get().chapters);
    const idx = chapters.findIndex((c) => c.id === id);
    if (idx < 0) return;
    const original = chapters[idx];
    const clone = structuredClone(original);
    clone.id = genId('ch');
    clone.title = `${original.title} (Copy)`;
    clone.nodes = clone.nodes.map((n) => ({ ...n, id: genId('node') }));
    chapters.splice(idx + 1, 0, clone);
    renumber(chapters);
    persist(chapters);
    set({ chapters, dirty: true });
  },

  // -- Node CRUD --
  updateNode: (chapterId, nodeId, patch) => {
    pushUndo();
    const chapters = structuredClone(get().chapters);
    const ch = chapters.find((c) => c.id === chapterId);
    if (!ch) return;
    const node = ch.nodes.find((n) => n.id === nodeId);
    if (!node) return;
    Object.assign(node, patch);
    persist(chapters);
    set({ chapters, dirty: true });
  },

  addNode: (chapterId, afterNodeId, type = 'interlude') => {
    pushUndo();
    const chapters = structuredClone(get().chapters);
    const ch = chapters.find((c) => c.id === chapterId);
    if (!ch) return;
    const newNode: ChapterNode = {
      type,
      id: genId('node'),
      label: `New ${nodeTypeLabel[type]}`,
      description: '',
      details: {},
    };
    if (afterNodeId) {
      const idx = ch.nodes.findIndex((n) => n.id === afterNodeId);
      ch.nodes.splice(idx + 1, 0, newNode);
    } else {
      ch.nodes.push(newNode);
    }
    persist(chapters);
    set({ chapters, dirty: true });
  },

  removeNode: (chapterId, nodeId) => {
    pushUndo();
    const chapters = structuredClone(get().chapters);
    const ch = chapters.find((c) => c.id === chapterId);
    if (!ch) return;
    ch.nodes = ch.nodes.filter((n) => n.id !== nodeId);
    persist(chapters);
    const updates: Partial<CampaignEditorState> = { chapters, dirty: true };
    if (get().selectedNode === nodeId) {
      updates.selectedNode = null;
      updates.zoomLevel = 'chapter';
    }
    set(updates);
  },

  reorderNode: (chapterId, nodeId, direction) => {
    pushUndo();
    const chapters = structuredClone(get().chapters);
    const ch = chapters.find((c) => c.id === chapterId);
    if (!ch) return;
    const idx = ch.nodes.findIndex((n) => n.id === nodeId);
    if (idx < 0) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= ch.nodes.length) return;
    [ch.nodes[idx], ch.nodes[targetIdx]] = [ch.nodes[targetIdx], ch.nodes[idx]];
    persist(chapters);
    set({ chapters, dirty: true });
  },

  duplicateNode: (chapterId, nodeId) => {
    pushUndo();
    const chapters = structuredClone(get().chapters);
    const ch = chapters.find((c) => c.id === chapterId);
    if (!ch) return;
    const idx = ch.nodes.findIndex((n) => n.id === nodeId);
    if (idx < 0) return;
    const original = ch.nodes[idx];
    const clone = structuredClone(original);
    clone.id = genId('node');
    clone.label = `${original.label} (Copy)`;
    ch.nodes.splice(idx + 1, 0, clone);
    persist(chapters);
    set({ chapters, dirty: true });
  },

  // -- Graph positions --
  updateNodePosition: (nodeId, x, y) => {
    const positions = { ...get().nodePositions, [nodeId]: { x, y } };
    persistPositions(positions);
    set({ nodePositions: positions });
  },

  clearPositions: () => {
    persistPositions({});
    set({ nodePositions: {} });
  },

  // -- NPC assignments --
  addNPC: (npc) => {
    const npcs = [...get().npcAssignments, npc];
    persistNPCs(npcs);
    set({ npcAssignments: npcs });
  },

  updateNPC: (npcId, patch) => {
    const npcs = get().npcAssignments.map((a) =>
      a.npcId === npcId ? { ...a, ...patch } : a,
    );
    persistNPCs(npcs);
    set({ npcAssignments: npcs });
  },

  removeNPC: (npcId) => {
    const npcs = get().npcAssignments.filter((a) => a.npcId !== npcId);
    persistNPCs(npcs);
    set({ npcAssignments: npcs });
  },

  killNPC: (npcId, atChapter, replacedBy) => {
    const npcs = get().npcAssignments.map((a) =>
      a.npcId === npcId
        ? { ...a, status: 'killed' as const, exitAt: atChapter, replacedBy: replacedBy ?? null }
        : a,
    );
    persistNPCs(npcs);
    set({ npcAssignments: npcs });
  },

  seedNPCsFromCampaign: () => {
    const npcs = structuredClone(DEFAULT_NPC_ASSIGNMENTS);
    persistNPCs(npcs);
    set({ npcAssignments: npcs });
  },

  // -- Replacement pool --
  addReplacementNPC: (npc) => {
    const pool = [...get().replacementPool, npc];
    persistReplacementPool(pool);
    set({ replacementPool: pool });
  },

  updateReplacementNPC: (npcId, patch) => {
    const pool = get().replacementPool.map((a) =>
      a.npcId === npcId ? { ...a, ...patch } : a,
    );
    persistReplacementPool(pool);
    set({ replacementPool: pool });
  },

  removeReplacementNPC: (npcId) => {
    const pool = get().replacementPool.filter((a) => a.npcId !== npcId);
    persistReplacementPool(pool);
    set({ replacementPool: pool });
  },

  // -- Camp events --
  getCampEvents: (nodeId) => {
    return get().campEvents[nodeId] ?? defaultCampEventData();
  },

  updateCampEvents: (nodeId, data) => {
    const campEvents = { ...get().campEvents, [nodeId]: data };
    persistCampEvents(campEvents);
    set({ campEvents });
  },

  // -- Interlude narratives --
  updateInterludeNarrative: (nodeId, chunks, splashText) => {
    const narratives = { ...get().interludeNarratives, [nodeId]: { chunks, splashText } };
    persistNarratives(narratives);
    set({ interludeNarratives: narratives });
  },

  // -- Undo/redo --
  undo: () => {
    const { undoStack, chapters } = get();
    if (undoStack.length === 0) return;
    const newUndoStack = [...undoStack];
    const snapshot = newUndoStack.pop()!;
    const newRedoStack = [...get().redoStack, structuredClone(chapters)];
    persist(snapshot);
    set({ chapters: snapshot, undoStack: newUndoStack, redoStack: newRedoStack, dirty: true });
  },

  redo: () => {
    const { redoStack, chapters } = get();
    if (redoStack.length === 0) return;
    const newRedoStack = [...redoStack];
    const snapshot = newRedoStack.pop()!;
    const newUndoStack = [...get().undoStack, structuredClone(chapters)];
    persist(snapshot);
    set({ chapters: snapshot, undoStack: newUndoStack, redoStack: newRedoStack, dirty: true });
  },

  // -- Persistence --
  save: () => {
    persist(get().chapters);
    set({ dirty: false });
  },

  loadSaved: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      const parsed = JSON.parse(raw) as CampaignChapter[];
      if (!Array.isArray(parsed) || parsed.length === 0) return false;
      set({ chapters: parsed, dirty: false });
      return true;
    } catch {
      return false;
    }
  },

  exportJSON: () => {
    const blueprint: CampaignBlueprint = {
      version: 1,
      exportedAt: new Date().toISOString(),
      chapters: get().chapters,
      npcAssignments: get().npcAssignments,
      interludeNarratives: get().interludeNarratives,
      campEvents: get().campEvents,
    };
    return JSON.stringify(blueprint, null, 2);
  },

  importJSON: (json) => {
    try {
      const raw = JSON.parse(json);

      // New blueprint format (object with version field)
      if (raw && typeof raw === 'object' && !Array.isArray(raw) && raw.version === 1) {
        const bp = raw as CampaignBlueprint;
        if (!Array.isArray(bp.chapters) || bp.chapters.length === 0) return false;
        const first = bp.chapters[0];
        if (!first.id || !first.title || !Array.isArray(first.nodes)) return false;
        persist(bp.chapters);
        persistPositions({});
        const npcs = Array.isArray(bp.npcAssignments) ? bp.npcAssignments : [];
        persistNPCs(npcs);
        const narratives = bp.interludeNarratives && typeof bp.interludeNarratives === 'object' ? bp.interludeNarratives : {};
        persistNarratives(narratives);
        const campEvts = bp.campEvents && typeof bp.campEvents === 'object' ? bp.campEvents : {};
        persistCampEvents(campEvts);
        set({
          chapters: bp.chapters, dirty: false, selectedChapter: null, selectedNode: null,
          zoomLevel: 'campaign', nodePositions: {}, npcAssignments: npcs,
          interludeNarratives: narratives, campEvents: campEvts,
        });
        return true;
      }

      // Legacy format (plain chapters array)
      const parsed = raw as CampaignChapter[];
      if (!Array.isArray(parsed) || parsed.length === 0) return false;
      const first = parsed[0];
      if (!first.id || !first.title || !Array.isArray(first.nodes)) return false;
      persist(parsed);
      persistPositions({});
      persistCampEvents({});
      set({ chapters: parsed, dirty: false, selectedChapter: null, selectedNode: null, zoomLevel: 'campaign', nodePositions: {}, campEvents: {} });
      return true;
    } catch {
      return false;
    }
  },

  resetToSeed: () => {
    const chapters = structuredClone(CHAPTERS_SEED);
    const npcs = structuredClone(DEFAULT_NPC_ASSIGNMENTS);
    const narratives = structuredClone(DEFAULT_NARRATIVES);
    const campEvts = structuredClone(DEFAULT_CAMP_EVENTS);
    const pool = structuredClone(DEFAULT_REPLACEMENT_POOL);
    persist(chapters);
    persistPositions({});
    persistNPCs(npcs);
    persistNarratives(narratives);
    persistCampEvents(campEvts);
    persistReplacementPool(pool);
    set({
      chapters, dirty: false, selectedChapter: null, selectedNode: null,
      zoomLevel: 'campaign', viewMode: 'list', nodePositions: {},
      npcAssignments: npcs, interludeNarratives: narratives, campEvents: campEvts,
      replacementPool: pool, undoStack: [], redoStack: [],
    });
  },
};
});

// On store creation, try to load from localStorage
const stored = localStorage.getItem(STORAGE_KEY);
if (stored) {
  try {
    const parsed = JSON.parse(stored) as CampaignChapter[];
    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].id && parsed[0].title) {
      useCampaignEditorStore.setState({ chapters: parsed });
    }
  } catch { /* use seed data */ }
}

const storedPositions = localStorage.getItem(POSITIONS_KEY);
if (storedPositions) {
  try {
    const parsed = JSON.parse(storedPositions);
    if (parsed && typeof parsed === 'object') {
      useCampaignEditorStore.setState({ nodePositions: parsed });
    }
  } catch { /* use empty */ }
}

const storedNPCs = localStorage.getItem(NPCS_KEY);
if (storedNPCs) {
  try {
    const parsed = JSON.parse(storedNPCs);
    if (Array.isArray(parsed)) {
      useCampaignEditorStore.setState({ npcAssignments: parsed });
    }
  } catch { /* use defaults */ }
}

const storedNarratives = localStorage.getItem(NARRATIVES_KEY);
if (storedNarratives) {
  try {
    const parsed = JSON.parse(storedNarratives);
    if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
      useCampaignEditorStore.setState({ interludeNarratives: parsed });
    } else {
      useCampaignEditorStore.setState({ interludeNarratives: structuredClone(DEFAULT_NARRATIVES) });
    }
  } catch {
    useCampaignEditorStore.setState({ interludeNarratives: structuredClone(DEFAULT_NARRATIVES) });
  }
} else {
  useCampaignEditorStore.setState({ interludeNarratives: structuredClone(DEFAULT_NARRATIVES) });
}

const storedCampEvents = localStorage.getItem(CAMP_EVENTS_KEY);
if (storedCampEvents) {
  try {
    const parsed = JSON.parse(storedCampEvents);
    if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
      useCampaignEditorStore.setState({ campEvents: parsed });
    } else {
      useCampaignEditorStore.setState({ campEvents: structuredClone(DEFAULT_CAMP_EVENTS) });
    }
  } catch {
    useCampaignEditorStore.setState({ campEvents: structuredClone(DEFAULT_CAMP_EVENTS) });
  }
} else {
  useCampaignEditorStore.setState({ campEvents: structuredClone(DEFAULT_CAMP_EVENTS) });
}

const storedReplacementPool = localStorage.getItem(REPLACEMENT_POOL_KEY);
if (storedReplacementPool) {
  try {
    const parsed = JSON.parse(storedReplacementPool);
    if (Array.isArray(parsed)) {
      useCampaignEditorStore.setState({ replacementPool: parsed });
    }
  } catch { /* use defaults */ }
}
