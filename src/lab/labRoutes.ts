export type LabPageId =
  | 'home'
  | 'line-battle'
  | 'melee'
  | 'story-beat'
  | 'npc-browser'
  | 'campaign'
  | 'visual-novel'
  | 'camp'
  | 'minigame'
  | 'audio'
  | 'art'
  | 'state-inspector'
  | 'save-manager';

export type LabCategory = 'combat' | 'narrative' | 'systems' | 'data';

export const categoryOrder: LabCategory[] = ['combat', 'narrative', 'systems', 'data'];

export interface LabRoute {
  id: LabPageId;
  label: string;
  description: string;
  icon: string;
  category: LabCategory;
}

export const categoryLabels: Record<LabCategory, string> = {
  combat: 'Combat',
  narrative: 'Narrative',
  systems: 'Systems',
  data: 'Data & State',
};

export const labRoutes: LabRoute[] = [
  // Combat
  {
    id: 'line-battle',
    label: 'Line Battle Lab',
    description: 'Design and test line battles — volley authoring, auto-play, formulas',
    icon: '\u2694',
    category: 'combat',
  },
  {
    id: 'melee',
    label: 'Melee Lab',
    description: 'Design and test melee encounters — AI, fatigue, wave authoring',
    icon: '\u{1F5E1}',
    category: 'combat',
  },

  // Narrative
  {
    id: 'story-beat',
    label: 'Story Beat Preview',
    description: 'Author and preview cinematic narrative sequences and choices',
    icon: '\u{1F4DC}',
    category: 'narrative',
  },
  {
    id: 'npc-browser',
    label: 'NPC Browser',
    description: 'Author and manage NPCs — stats, portraits, story roles, dialogue',
    icon: '\u{1F464}',
    category: 'narrative',
  },
  {
    id: 'campaign',
    label: 'Campaign Viewer',
    description: 'Design the campaign — chapters, branching, node sequences',
    icon: '\u{1F5FA}',
    category: 'narrative',
  },
  {
    id: 'visual-novel',
    label: 'Visual Novel Lab',
    description: 'Prototype and test the visual novel dialogue system',
    icon: '\u{1F4AC}',
    category: 'narrative',
  },

  // Systems
  {
    id: 'camp',
    label: 'Camp Lab',
    description: 'Design camp phases — activities, events, UI layout, reputation gates',
    icon: '\u{1F3D5}',
    category: 'systems',
  },
  {
    id: 'minigame',
    label: 'Minigame Lab',
    description: 'Create and test mini-games — Passe-Dix and beyond',
    icon: '\u{1F3B2}',
    category: 'systems',
  },
  {
    id: 'audio',
    label: 'Audio Lab',
    description: 'Music player, SFX auditioner, and sound synthesis sandbox',
    icon: '\u{1F3B5}',
    category: 'systems',
  },
  {
    id: 'art',
    label: 'Art Lab',
    description: 'Build and iterate SVG art — camp scenes, panoramas, assets',
    icon: '\u{1F3A8}',
    category: 'systems',
  },

  // Data & State
  {
    id: 'state-inspector',
    label: 'State Inspector',
    description: 'Deep viewer for GameState, BattleState, and store trees with JSON export',
    icon: '\u{1F50D}',
    category: 'data',
  },
  {
    id: 'save-manager',
    label: 'Save Manager',
    description: 'View and edit raw saves, manage profiles, and test glory economy',
    icon: '\u{1F4BE}',
    category: 'data',
  },
];
