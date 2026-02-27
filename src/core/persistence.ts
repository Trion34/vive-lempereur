import { GameState, CampaignPhase } from '../types';

/** Shape of CampaignState in save version 0.3.0 (before sequenceIndex, campaignId, etc.) */
interface LegacyV3Campaign {
  campaignId?: string;
  sequenceIndex?: number;
  battleIndex?: number;
  phase?: CampaignPhase;
  currentBattle?: string;
  npcDeaths?: string[];
  replacementsUsed?: string[];
}

/** Shape of CampState in save version 0.4.0 (before health/stamina/morale removal) */
interface LegacyV4CampState {
  health?: number;
  stamina?: number;
  morale?: number;
  [key: string]: unknown;
}

const SAVE_KEY_PREFIX = 'the_little_soldier_save';
const GLORY_KEY_PREFIX = 'the_little_soldier_glory';
const SAVE_VERSION = '0.5.0';
const COMPATIBLE_VERSIONS = ['0.3.0', '0.4.0', '0.5.0'];

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

    // Check if version is compatible
    if (!COMPATIBLE_VERSIONS.includes(saveData.version)) {
      console.warn('Incompatible save version found');
      return null;
    }

    // Migrate v0.3.0 → v0.4.0: add new CampaignState fields
    if (saveData.version === '0.3.0') {
      const campaign = saveData.gameState.campaign as unknown as LegacyV3Campaign;
      if (!('campaignId' in campaign)) {
        campaign.campaignId = 'italy';
      }
      if (!('sequenceIndex' in campaign)) {
        // Legacy saves had battleIndex; map to approximate sequenceIndex
        const legacyIndex = campaign.battleIndex ?? 0;
        campaign.sequenceIndex = legacyIndex > 0 ? 2 : 0; // rough mapping
      }
      if (!('phase' in campaign)) {
        campaign.phase = CampaignPhase.Battle;
      }
      if (!('npcDeaths' in campaign)) {
        campaign.npcDeaths = [];
      }
      if (!('replacementsUsed' in campaign)) {
        campaign.replacementsUsed = [];
      }
      // Normalize currentBattle to lowercase
      if (campaign.currentBattle) {
        campaign.currentBattle = campaign.currentBattle.toLowerCase();
      }
      // Remove legacy fields
      delete campaign.battleIndex;

      saveData.version = '0.4.0';
      // Re-save with migrated data
      localStorage.setItem(saveKey(), JSON.stringify(saveData));
    }

    // Migrate v0.4.0 → v0.5.0: remove health/stamina/morale from CampState
    if (saveData.version === '0.4.0') {
      const campState = saveData.gameState.campState as unknown as LegacyV4CampState | undefined;
      if (campState) {
        // Sync camp meters to player before removing them
        const player = saveData.gameState.player;
        if (campState.health !== undefined) {
          player.health = campState.health;
        }
        if (campState.stamina !== undefined) {
          player.stamina = campState.stamina;
        }
        if (campState.morale !== undefined) {
          player.morale = campState.morale;
        }
        delete campState.health;
        delete campState.stamina;
        delete campState.morale;
      }
      saveData.version = SAVE_VERSION;
      localStorage.setItem(saveKey(), JSON.stringify(saveData));
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
