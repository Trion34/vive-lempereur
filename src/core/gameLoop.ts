import {
  GameState,
  GamePhase,
  CampaignPhase,
  PlayerCharacter,
  MilitaryRank,
  BattleState,
  BattlePhase,
  DrillStep,
  Player,
  FatigueTier,
  getMoraleThreshold,
  getHealthState,
  getHealthPoolSize,
  getStaminaPoolSize,
  NPC,
} from '../types';
import type { BattleInitConfig, BattleRoles } from '../data/battles/types';
import { getBattleConfig } from '../data/battles/registry';
import { getCampaignDef } from '../data/campaigns/registry';
import { createNPCsFromTemplates, npcToSoldier, npcToOfficer, syncBattleResultsToNPCs } from './npcs';
import { createCampState } from './camp';
import {
  createCampaignState,
  advanceSequence,
  getCurrentNode,
  recordBattleVictory,
  replaceDeadNPCs,
} from './campaign';

// Create a fresh new game
export function createNewGame(campaignId: string = 'italy'): GameState {
  const player: PlayerCharacter = {
    name: 'Soldier',
    rank: MilitaryRank.Private,
    valor: 40,
    musketry: 35,
    elan: 35,
    strength: 40,
    endurance: 40,
    constitution: 45,
    charisma: 30,
    intelligence: 30,
    awareness: 35,
    health: 100,
    morale: 100,
    stamina: 100,
    grace: 0,
    soldierRep: 50,
    officerRep: 50,
    napoleonRep: 0,
    frontRank: false,
    equipment: {
      musket: 'Charleville 1777',
      bayonet: 'Socket bayonet',
      musketCondition: 70,
      uniformCondition: 50,
    },
  };

  const campaignDef = getCampaignDef(campaignId);
  const npcs = createNPCsFromTemplates(campaignDef.npcs);
  const campaign = createCampaignState(campaignDef);

  // New games start with character creation (IntroPage).
  // GamePhase.Camp is a placeholder; AppRoot routes via needsCharacterCreation flag.
  return {
    phase: GamePhase.Camp,
    player,
    npcs,
    campaign,
    needsCharacterCreation: true,
  };
}

// Create BattleState from persistent PlayerCharacter + NPCs
export function createBattleFromCharacter(
  pc: PlayerCharacter,
  npcs: NPC[],
  roles: BattleRoles,
  init: BattleInitConfig,
): BattleState {
  const maxHp = getHealthPoolSize(pc.constitution);
  const maxStam = getStaminaPoolSize(pc.endurance) * 4;

  const player: Player = {
    name: pc.name,
    valor: pc.valor,
    musketry: pc.musketry,
    elan: pc.elan,
    strength: pc.strength,
    endurance: pc.endurance,
    constitution: pc.constitution,
    charisma: pc.charisma,
    intelligence: pc.intelligence,
    awareness: pc.awareness,
    morale: pc.morale,
    maxMorale: 100,
    moraleThreshold: getMoraleThreshold(pc.morale, 100),
    health: Math.round((pc.health / 100) * maxHp),
    maxHealth: maxHp,
    healthState: getHealthState(Math.round((pc.health / 100) * maxHp), maxHp),
    stamina: Math.round((pc.stamina / 100) * maxStam),
    maxStamina: maxStam,
    fatigue: 0,
    maxFatigue: maxStam,
    fatigueTier: FatigueTier.Fresh,
    musketLoaded: true,
    alive: true,
    routing: false,
    fumbledLoad: false,
    soldierRep: pc.soldierRep,
    officerRep: pc.officerRep,
    napoleonRep: pc.napoleonRep,
    frontRank: pc.frontRank,
    canteenUses: 0,
  };

  // Find NPCs for battle roles (from config)
  const leftNPC = roles.leftNeighbour ? npcs.find((n) => n.id === roles.leftNeighbour) : undefined;
  const rightNPC = roles.rightNeighbour ? npcs.find((n) => n.id === roles.rightNeighbour) : undefined;
  const officerNPC = npcs.find((n) => n.id === roles.officer);

  const leftNeighbour = leftNPC ? npcToSoldier(leftNPC) : null;
  const rightNeighbour = rightNPC ? npcToSoldier(rightNPC) : null;
  const officer = officerNPC
    ? npcToOfficer(officerNPC)
    : {
        name: roles.officer,
        rank: 'Capt.' as const,
        alive: true,
        wounded: false,
        mounted: true,
        status: 'Mounted, steady',
      };

  return {
    phase: BattlePhase.Intro,
    turn: 0,
    drillStep: DrillStep.Present,
    player,
    roles,
    line: {
      leftNeighbour,
      rightNeighbour,
      officer,
      lineIntegrity: 100,
      lineMorale: init.lineMorale,
      drumsPlaying: true,
      ncoPresent: !!roles.nco,
      casualtiesThisTurn: 0,
    },
    enemy: { ...init.enemy },
    log: [],
    availableActions: [],
    pendingMoraleChanges: [],
    battleOver: false,
    outcome: 'pending',
    crisisTurn: 0,
    volleysFired: 0,
    scriptedVolley: init.startingVolley,
    chargeEncounter: 0,
    ext: { ...init.ext },
    autoPlayActive: false,
    autoPlayVolleyCompleted: 0,
    graceEarned: false,
  };
}

/**
 * Sync battle results back to persistent player character.
 * @mutates pc — overwrites valor, reputation trackers, and condition meters from battle state
 */
function syncBattleToCharacter(pc: PlayerCharacter, battle: BattleState): void {
  // Stats that can change during battle
  pc.valor = battle.player.valor;
  pc.soldierRep = battle.player.soldierRep;
  pc.officerRep = battle.player.officerRep;
  pc.napoleonRep = battle.player.napoleonRep;
  // Condition meters (convert battle pools back to 0-100 percentage)
  pc.health =
    battle.player.maxHealth > 0
      ? Math.round((battle.player.health / battle.player.maxHealth) * 100)
      : 100;
  pc.morale = battle.player.morale;
  pc.stamina =
    battle.player.maxStamina > 0
      ? Math.round((battle.player.stamina / battle.player.maxStamina) * 100)
      : 100;
}

/**
 * Transition to a camp node (used when the current sequence node is a camp).
 * @mutates gameState — sets campState and phase
 */
export function transitionToCamp(gameState: GameState): void {
  const campaignDef = getCampaignDef(gameState.campaign.campaignId);
  const node = getCurrentNode(gameState.campaign, campaignDef);
  if (!node || node.type !== 'camp') return;

  const campConfig = campaignDef.camps[node.campId];
  if (!campConfig) return;

  gameState.campState = createCampState(gameState.player, gameState.npcs, campConfig);
  gameState.phase = GamePhase.Camp;
}

/**
 * Transition from camp to battle.
 * @mutates gameState — sets battleState, phase, campaign, and clears campState
 */
export function transitionToBattle(gameState: GameState): void {
  const battleId = gameState.campaign.currentBattle;
  const config = getBattleConfig(battleId);

  gameState.battleState = createBattleFromCharacter(gameState.player, gameState.npcs, config.roles, config.init);
  gameState.battleState.phase = BattlePhase.Line; // Skip character-creation intro for campaign battles
  gameState.phase = GamePhase.Battle;
  gameState.campaign = { ...gameState.campaign, phase: CampaignPhase.Battle };
  gameState.campState = undefined;
}

/**
 * Handle battle victory: sync results, replace dead NPCs, record victory.
 * @mutates gameState — updates npcs, campaign (victory record, deaths, replacements), clears battleState
 */
export function handleBattleVictory(gameState: GameState): void {
  const campaignDef = getCampaignDef(gameState.campaign.campaignId);

  // Sync battle results
  if (gameState.battleState) {
    syncBattleToCharacter(gameState.player, gameState.battleState);

    // Use roles stored on the battle state (set during battle creation)
    const deaths = syncBattleResultsToNPCs(gameState.npcs, gameState.battleState, gameState.battleState.roles);

    if (deaths.length > 0) {
      const { npcs: updatedNpcs, newReplacements } = replaceDeadNPCs(
        gameState.npcs,
        deaths,
        campaignDef.replacementPool,
        gameState.campaign.replacementsUsed,
      );
      gameState.npcs = updatedNpcs;
      gameState.campaign = {
        ...recordBattleVictory(gameState.campaign),
        npcDeaths: [...gameState.campaign.npcDeaths, ...deaths],
        replacementsUsed: [...gameState.campaign.replacementsUsed, ...newReplacements],
      };
    } else {
      gameState.campaign = recordBattleVictory(gameState.campaign);
    }
  } else {
    gameState.campaign = recordBattleVictory(gameState.campaign);
  }

  gameState.battleState = undefined;
}

/**
 * Advance to the next node in the campaign sequence.
 * @mutates gameState — updates campaign, phase, and creates campState or battleState as needed
 */
export function advanceToNextNode(gameState: GameState): void {
  const campaignDef = getCampaignDef(gameState.campaign.campaignId);
  gameState.campaign = advanceSequence(gameState.campaign, campaignDef);

  const node = getCurrentNode(gameState.campaign, campaignDef);
  if (!node) {
    // Past end of sequence
    gameState.campaign = { ...gameState.campaign, phase: CampaignPhase.Complete };
    return;
  }

  if (node.type === 'camp') {
    const campConfig = campaignDef.camps[node.campId];
    if (campConfig) {
      gameState.campState = createCampState(gameState.player, gameState.npcs, campConfig);
    }
    gameState.phase = GamePhase.Camp;
  } else if (node.type === 'battle') {
    // Check if battle is implemented (has a registered config)
    let config;
    try {
      config = getBattleConfig(node.battleId);
    } catch {
      // No config = unimplemented, mark as complete
      gameState.campaign = { ...gameState.campaign, phase: CampaignPhase.Complete };
      return;
    }

    gameState.battleState = createBattleFromCharacter(gameState.player, gameState.npcs, config.roles, config.init);
    gameState.battleState.phase = BattlePhase.Line; // Skip character-creation intro for campaign battles
    gameState.phase = GamePhase.Battle;
    gameState.campState = undefined;
  } else if (node.type === 'interlude') {
    // Clear campState and battleState for interludes
    gameState.campState = undefined;
    gameState.battleState = undefined;
  }
}
