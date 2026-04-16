/**
 * Per-scene node layout positions for the map view.
 * Stored in localStorage, keyed by scene id.
 *
 * When a position exists for a node, it overrides the auto-layout.
 * Nodes without a stored position fall back to auto-layout.
 */

const STORAGE_KEY = 'vn_studio_scene_layouts';

export interface NodePosition { x: number; y: number }
export type SceneLayout = Record<string, NodePosition>; // nodeId -> position
export type AllLayouts = Record<string, SceneLayout>;   // sceneId -> SceneLayout

export function loadLayouts(): AllLayouts {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* fall through */ }
  return {};
}

export function saveLayouts(layouts: AllLayouts): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(layouts));
  } catch {
    console.warn('[VN Studio] Failed to save scene layouts');
  }
}

export function loadSceneLayout(sceneId: string): SceneLayout {
  return loadLayouts()[sceneId] ?? {};
}

export function saveSceneLayout(sceneId: string, layout: SceneLayout): void {
  const all = loadLayouts();
  all[sceneId] = layout;
  saveLayouts(all);
}

export function clearSceneLayout(sceneId: string): void {
  const all = loadLayouts();
  delete all[sceneId];
  saveLayouts(all);
}
