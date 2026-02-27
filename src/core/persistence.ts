import type { GameState } from '../types';

const SAVE_KEY_PREFIX = 'the_little_soldier_save';
const GLORY_KEY_PREFIX = 'the_little_soldier_glory';
const SAVE_VERSION = '0.5.0';

let activeProfileId: 1 | 2 | 3 | null = null;

function saveKey(): string {
  if (activeProfileId === null) return SAVE_KEY_PREFIX;
  return `${SAVE_KEY_PREFIX}_p${activeProfileId}`;
}

function gloryKey(): string {
  if (activeProfileId === null) return GLORY_KEY_PREFIX;
  return `${GLORY_KEY_PREFIX}_p${activeProfileId}`;
}

export function setActiveProfile(id: 1 | 2 | 3 | null): void {
  activeProfileId = id;
}


interface SaveData {
  version: string;
  gameState: GameState;
  timestamp: number;
}

/**
 * Saves the current game state to local storage.
 * In a production Electron app, this would write to a file.
 */
export function saveGame(gameState: GameState): void {
  // Don't save if the player is dead (permadeath)
  if (gameState.battleState && !gameState.battleState.player.alive) {
    deleteSave();
    return;
  }

  const saveData: SaveData = {
    version: SAVE_VERSION,
    gameState,
    timestamp: Date.now(),
  };

  try {
    const serialized = JSON.stringify(saveData);
    localStorage.setItem(saveKey(), serialized);
  } catch (error) {
    console.error('Failed to save game:', error);
  }
}

/**
 * Loads the game state from local storage.
 * Returns null if no save exists or if the save is incompatible.
 */
export function loadGame(): GameState | null {
  const serialized = localStorage.getItem(saveKey());
  if (!serialized) return null;

  try {
    const saveData: SaveData = JSON.parse(serialized);

    if (saveData.version !== SAVE_VERSION) {
      console.warn('Incompatible save version found');
      return null;
    }

    return saveData.gameState;
  } catch (error) {
    console.error('Failed to load game:', error);
    return null;
  }
}

/**
 * Deletes the save from local storage.
 */
export function deleteSave(): void {
  localStorage.removeItem(saveKey());
}

// === GLORY (persists across playthroughs) ===

export function loadGlory(): number {
  const val = localStorage.getItem(gloryKey());
  if (val === null) return 0;
  return Math.max(0, parseInt(val, 10) || 0);
}

export function saveGlory(amount: number): void {
  localStorage.setItem(gloryKey(), String(Math.max(0, Math.round(amount))));
}

export function addGlory(amount: number): number {
  const current = loadGlory();
  const next = current + amount;
  saveGlory(next);
  return next;
}
