/**
 * Game Scene Importer — imports game-side VN scenes into the VN Lab store.
 * Add new game scenes to GAME_SCENES array as they are created.
 */

import type { VNScene } from '../types/vnTypes';
import { PASSE_DIX_SCENE } from '@game/data/battles/voltri/vnScenes/passeDix';
import { normalizeGameCheckNextIds } from '../stores/vnSceneStore';

/** All game-side VN scenes available for import into the lab. */
export const GAME_SCENES: VNScene[] = [
  PASSE_DIX_SCENE,
];

/** Returns game scenes not already in the lab store. */
export function getImportableGameScenes(existingIds: Set<string>): VNScene[] {
  return GAME_SCENES
    .filter((s) => !existingIds.has(s.id))
    .map((s) => {
      // Deep clone + normalize before importing
      const clone = JSON.parse(JSON.stringify(s)) as VNScene;
      return normalizeGameCheckNextIds(clone);
    });
}
