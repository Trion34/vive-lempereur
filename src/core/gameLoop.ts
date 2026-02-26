import {
  GameState,
  GamePhase,
  PlayerCharacter,
  MilitaryRank,
  BattleState,
  BattlePhase,
  DrillStep,
  Player,
  MoraleThreshold,
  HealthState,
  FatigueTier,
  getFatigueTier,
  getMoraleThreshold,
  getHealthState,
  getHealthPoolSize,
  getStaminaPoolSize,
  CampState,
  NPC,
} from '../types';
import type { BattleInitConfig, BattleRoles } from '../data/battles/types';
import { createCampaignNPCs, npcToSoldier, npcToOfficer } from './npcs';
import { createCampState } from './camp';

// Create a fresh new game
export function createNewGame(): GameState {
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

  const npcs = createCampaignNPCs();

  return {
    phase: GamePhase.Battle, // Start with the first battle
    player,
    npcs,
    battleState: createBattleFromCharacter(player, npcs),
    campaign: {
      battlesCompleted: 0,
      currentBattle: 'Rivoli',
      nextBattle: 'Castiglione',
      daysInCampaign: 0,
    },
  };
}

// Default Rivoli battle roles (backward compat)
const RIVOLI_ROLES: BattleRoles = {
  leftNeighbour: 'pierre',
  rightNeighbour: 'jean-baptiste',
  officer: 'leclerc',
  nco: 'duval',
};

// Default Rivoli init config (backward compat)
const RIVOLI_INIT: BattleInitConfig = {
  enemy: {
    range: 120,
    strength: 100,
    quality: 'line',
    morale: 'advancing',
    lineIntegrity: 100,
    artillery: true,
    cavalryThreat: false,
  },
  ext: {
    battlePart: 1,
    batteryCharged: false,
    meleeStage: 0,
    wagonDamage: 0,
    gorgeTarget: '',
    gorgeMercyCount: 0,
  },
  startingVolley: 1,
  lineMorale: 'resolute',
};

// Create BattleState from persistent PlayerCharacter + NPCs
export function createBattleFromCharacter(
  pc: PlayerCharacter,
  npcs: NPC[],
  roles: BattleRoles = RIVOLI_ROLES,
  init: BattleInitConfig = RIVOLI_INIT,
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

// Sync battle results back to persistent player character
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

// Transition from intro to pre-battle camp (eve of Rivoli)
export function transitionToPreBattleCamp(gameState: GameState): void {
  gameState.campState = createCampState(gameState.player, gameState.npcs, {
    location: 'Rivoli Plateau \u2014 Eve of Battle',
    actions: 16,
  });
  gameState.phase = GamePhase.Camp;
}

// Sync camp meters back to persistent player character
function syncCampToCharacter(pc: PlayerCharacter, camp: CampState): void {
  pc.health = camp.health;
  pc.morale = camp.morale;
  pc.stamina = camp.stamina;
}

// Transition from camp to battle
export function transitionToBattle(gameState: GameState): void {
  // Sync camp meters to PC before creating battle
  if (gameState.campState) {
    syncCampToCharacter(gameState.player, gameState.campState);
  }

  gameState.battleState = createBattleFromCharacter(gameState.player, gameState.npcs);
  gameState.phase = GamePhase.Battle;
  gameState.campState = undefined;
}
