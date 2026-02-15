import {
  GameState, GamePhase, PlayerCharacter, MilitaryRank,
  BattleState, BattlePhase, DrillStep, Player,
  MoraleThreshold, HealthState, StaminaState,
  getMoraleThreshold, getHealthState, getStaminaState,
  getHealthPoolSize, getStaminaPoolSize,
  CampState, NPC,
} from '../types';
import { createCampaignNPCs, npcToSoldier, npcToOfficer, syncBattleResultsToNPCs } from './npcs';
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
    reputation: 0,
    ncoApproval: 50,
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

// Create BattleState from persistent PlayerCharacter + NPCs
export function createBattleFromCharacter(pc: PlayerCharacter, npcs: NPC[]): BattleState {
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
    health: Math.round(pc.health / 100 * maxHp),
    maxHealth: maxHp,
    healthState: getHealthState(Math.round(pc.health / 100 * maxHp), maxHp),
    stamina: Math.round(pc.stamina / 100 * maxStam),
    maxStamina: maxStam,
    staminaState: getStaminaState(Math.round(pc.stamina / 100 * maxStam), maxStam),
    musketLoaded: true,
    alive: true,
    routing: false,
    heldFire: false,
    fumbledLoad: false,
    ncoApproval: pc.ncoApproval,
    duckedLastTurn: false,
    duckCount: 0,
    prayerCount: 0,
    canteenUses: 0,
    turnsWithEmptyMusket: 0,
    reputation: pc.reputation,
  };

  // Find NPCs for battle roles
  const pierreNPC = npcs.find(n => n.id === 'pierre');
  const jbNPC = npcs.find(n => n.id === 'jean-baptiste');
  const leclercNPC = npcs.find(n => n.id === 'leclerc');

  const leftNeighbour = pierreNPC ? npcToSoldier(pierreNPC) : null;
  const rightNeighbour = jbNPC ? npcToSoldier(jbNPC) : null;
  const officer = leclercNPC ? npcToOfficer(leclercNPC) : {
    name: 'Leclerc', rank: 'Capt.',
    alive: true, wounded: false, mounted: true, status: 'Mounted, steady',
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
      lineMorale: 'resolute',
      drumsPlaying: true,
      ncoPresent: true,
      filesDeep: 3,
      casualtiesThisTurn: 0,
    },
    enemy: {
      range: 120,
      strength: 100,
      quality: 'line',
      morale: 'advancing',
      lineIntegrity: 100,
      artillery: true,
      cavalryThreat: false,
    },
    log: [],
    availableActions: [],
    pendingMoraleChanges: [],
    weather: 'clear',
    timeOfDay: 'Dawn',
    battleOver: false,
    outcome: 'pending',
    crisisTurn: 0,
    volleysFired: 0,
    scriptedVolley: 1,
    aimCarefullySucceeded: false,
    jbCrisisResolved: false,
    chargeEncounter: 0,
    battlePart: 1,
    batteryCharged: false,
    meleeStage: 0,
    wagonDamage: 0,
    gorgeMercyCount: 0,
    autoPlayActive: false,
    autoPlayVolleyCompleted: 0,
    graceEarned: false,
  };
}

// Sync battle results back to persistent player character
function syncBattleToCharacter(pc: PlayerCharacter, battle: BattleState): void {
  // Stats that can change during battle
  pc.valor = battle.player.valor;
  pc.reputation = battle.player.reputation;
  pc.ncoApproval = battle.player.ncoApproval;
  // Condition meters (convert battle pools back to 0-100 percentage)
  pc.health = battle.player.maxHealth > 0 ? Math.round(battle.player.health / battle.player.maxHealth * 100) : 100;
  pc.morale = battle.player.morale;
  pc.stamina = battle.player.maxStamina > 0 ? Math.round(battle.player.stamina / battle.player.maxStamina * 100) : 100;
}

// Transition from intro to pre-battle camp (eve of Rivoli)
export function transitionToPreBattleCamp(gameState: GameState): void {
  gameState.campState = createCampState(gameState.player, gameState.npcs, {
    location: 'Rivoli Plateau \u2014 Eve of Battle',
    days: 2,
    context: 'pre-battle',
  });
  gameState.phase = GamePhase.Camp;
}

// Transition from battle to camp
export function transitionToCamp(gameState: GameState): void {
  if (!gameState.battleState) return;

  // Sync battle results to persistent state
  syncBattleToCharacter(gameState.player, gameState.battleState);
  syncBattleResultsToNPCs(gameState.npcs, gameState.battleState);

  // Update campaign
  gameState.campaign.battlesCompleted += 1;
  gameState.campaign.daysInCampaign += 1;

  // Create camp state
  gameState.campState = createCampState(gameState.player, gameState.npcs, {
    location: gameState.campaign.currentBattle + ' \u2014 aftermath',
    days: 3,
    context: 'post-battle',
  });
  gameState.phase = GamePhase.Camp;
  gameState.battleState = undefined;
}

// Sync camp meters back to persistent player character
function syncCampToCharacter(pc: PlayerCharacter, camp: CampState): void {
  pc.health = camp.health;
  pc.morale = camp.morale;
  pc.stamina = camp.stamina;
}

// Transition from camp to battle
export function transitionToBattle(gameState: GameState): void {
  const fromPreBattle = gameState.campState?.context === 'pre-battle';

  // Sync camp meters to PC before creating battle
  if (gameState.campState) {
    syncCampToCharacter(gameState.player, gameState.campState);
  }

  gameState.battleState = createBattleFromCharacter(gameState.player, gameState.npcs);
  gameState.phase = GamePhase.Battle;
  gameState.campState = undefined;

  // Don't advance campaign when coming from pre-battle camp (first battle)
  if (!fromPreBattle) {
    gameState.campaign.currentBattle = gameState.campaign.nextBattle;
  }
}
