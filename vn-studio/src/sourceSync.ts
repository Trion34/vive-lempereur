/**
 * Source-sync tracking for VN Studio.
 *
 * Tracks, per scene, the content hashes of (a) the game-code source and (b) the
 * studio workspace as of the last sync. On boot we compare current hashes to
 * these baselines so we can:
 *   - auto-sync the studio from source when the user has no local edits
 *   - show a drift badge when both the source and the studio have changed
 */

import type { VNScene } from '@game/types/vnTypes';

const SYNC_STATE_KEY = 'vn_studio_source_sync';

export interface SceneSyncState {
  sourceHash: string;
  studioHash: string;
}

type SyncStateMap = Record<string, SceneSyncState>;

/** FNV-1a 32-bit — fast, deterministic, non-cryptographic. */
function fnv1a(s: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

/** Hash the persistent structure of a scene. */
export function hashScene(scene: VNScene): string {
  const canonical = JSON.stringify({
    id: scene.id,
    title: scene.title,
    description: scene.description,
    mood: scene.mood,
    cast: scene.cast,
    startNode: scene.startNode,
    nodes: scene.nodes,
  });
  return fnv1a(canonical);
}

function loadMap(): SyncStateMap {
  try {
    const raw = localStorage.getItem(SYNC_STATE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as SyncStateMap;
  } catch {
    return {};
  }
}

function saveMap(map: SyncStateMap): void {
  try {
    localStorage.setItem(SYNC_STATE_KEY, JSON.stringify(map));
  } catch {
    console.warn('[VN Studio] Failed to persist source-sync state');
  }
}

export function getSyncState(sceneId: string): SceneSyncState | null {
  return loadMap()[sceneId] ?? null;
}

export function setSyncState(sceneId: string, state: SceneSyncState): void {
  const map = loadMap();
  map[sceneId] = state;
  saveMap(map);
}

/**
 * True when the studio has local edits that diverge from the current source.
 * Used to surface a drift badge — if the user has no edits, boot-time
 * auto-sync handles the divergence silently instead.
 */
export function hasDrift(studioScene: VNScene, sourceScene: VNScene): boolean {
  const state = getSyncState(studioScene.id);
  if (!state) return false;
  const studioHash = hashScene(studioScene);
  const sourceHash = hashScene(sourceScene);
  if (studioHash === sourceHash) return false;
  return studioHash !== state.studioHash;
}
