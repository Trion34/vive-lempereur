import { GameState } from '../types';

const SAVE_KEY = 'the_little_soldier_save';
const SAVE_VERSION = '0.1.0';

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
    localStorage.setItem(SAVE_KEY, serialized);
  } catch (error) {
    console.error('Failed to save game:', error);
  }
}

/**
 * Loads the game state from local storage.
 * Returns null if no save exists or if the save is incompatible.
 */
export function loadGame(): GameState | null {
  const serialized = localStorage.getItem(SAVE_KEY);
  if (!serialized) return null;

  try {
    const saveData: SaveData = JSON.parse(serialized);
    
    // Version check (can be more sophisticated if needed)
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
  localStorage.removeItem(SAVE_KEY);
}

/**
 * Checks if a save exists.
 */
export function hasSave(): boolean {
  return localStorage.getItem(SAVE_KEY) !== null;
}
