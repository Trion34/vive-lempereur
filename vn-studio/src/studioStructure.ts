/**
 * VN Studio sidebar structure — persisted to localStorage.
 * Defines the chapter groupings, dividers, and scene ordering
 * that the user can freely edit via drag-and-drop and inline editing.
 */

const STORAGE_KEY = 'vn_studio_structure';

export interface StudioChapter {
  id: string;
  title: string;
  collapsed?: boolean;
  entries: StudioEntry[];
}

export type StudioEntry =
  | { type: 'scene'; sceneId: string }
  | { type: 'divider'; label: string };

export interface StudioStructure {
  chapters: StudioChapter[];
}

/** Default structure — used on first load */
const DEFAULT_STRUCTURE: StudioStructure = {
  chapters: [
    {
      id: 'ch1_voltri',
      title: 'Chapter 1 — Voltri',
      entries: [
        { type: 'divider', label: 'Camp Events' },
        { type: 'scene', sceneId: 'voltri_passe_dix' },
        { type: 'scene', sceneId: 'voltri_coast_at_night' },
        { type: 'scene', sceneId: 'voltri_ligurian_girl' },
        { type: 'scene', sceneId: 'voltri_genoese_merchant' },
        { type: 'scene', sceneId: 'voltri_theft_opportunity' },
        { type: 'divider', label: 'Battle' },
        { type: 'scene', sceneId: 'voltri_fix_bayonets' },
        { type: 'scene', sceneId: 'voltri_line_breaks' },
        { type: 'scene', sceneId: 'voltri_coastal_road' },
        { type: 'scene', sceneId: 'voltri_cavalry_scare' },
        { type: 'scene', sceneId: 'voltri_wounded_soldier' },
        { type: 'scene', sceneId: 'voltri_wounded_canteen' },
        { type: 'scene', sceneId: 'voltri_homestead' },
        { type: 'scene', sceneId: 'voltri_dawn_savona' },
      ],
    },
  ],
};

export function loadStructure(): StudioStructure {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.chapters) return parsed;
    }
  } catch { /* fall through */ }
  return structuredClone(DEFAULT_STRUCTURE);
}

export function saveStructure(structure: StudioStructure): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(structure));
  } catch {
    console.warn('[VN Studio] Failed to save structure');
  }
}

/** Generate a simple unique ID */
export function generateChapterId(): string {
  return `ch_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}
