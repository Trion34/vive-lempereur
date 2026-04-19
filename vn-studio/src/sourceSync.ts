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
import { normalizeGameCheckNextIds } from '../../lab/src/stores/vnSceneStore';

const SYNC_STATE_KEY = 'vn_studio_source_sync';
/** Bump when the hash algorithm or normalization rules change — forces
 *  any stale state to be ignored so old hashes don't misdiagnose drift. */
const SYNC_STATE_VERSION = 2;

export interface SceneSyncState {
  v: number;
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

/** Hash the persistent structure of a scene.
 *
 *  Normalizes first so that two scenes which the store would treat as
 *  identical after `loadScenes` (which applies `normalizeGameCheckNextIds`)
 *  hash to the same value. Without this, a raw source scene whose choice
 *  `nextId` diverges from its `gameCheck.passNode` would never match the
 *  post-load studio copy.
 */
export function hashScene(scene: VNScene): string {
  const normalized = normalizeGameCheckNextIds(JSON.parse(JSON.stringify(scene)));
  const canonical = JSON.stringify({
    id: normalized.id,
    title: normalized.title,
    description: normalized.description,
    mood: normalized.mood,
    cast: normalized.cast,
    startNode: normalized.startNode,
    nodes: normalized.nodes,
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
  const entry = loadMap()[sceneId];
  if (!entry || entry.v !== SYNC_STATE_VERSION) return null;
  return entry;
}

export function setSyncState(sceneId: string, state: Omit<SceneSyncState, 'v'>): void {
  const map = loadMap();
  map[sceneId] = { v: SYNC_STATE_VERSION, ...state };
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
