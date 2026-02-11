import {
  GameState, GamePhase, PlayerCharacter, MilitaryRank,
  BattleState, BattlePhase, DrillStep, Player,
  MoraleThreshold, HealthState, FatigueState,
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
    dexterity: 45,
    strength: 40,
    endurance: 40,
    constitution: 45,
    charisma: 30,
    intelligence: 30,
    awareness: 35,
    experience: 20,
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
  const player: Player = {
    name: pc.name,
    valor: pc.valor,
    dexterity: pc.dexterity,
    strength: pc.strength,
    endurance: pc.endurance,
    constitution: pc.constitution,
    charisma: pc.charisma,
    intelligence: pc.intelligence,
    awareness: pc.awareness,
    morale: 100,
    maxMorale: 100,
    moraleThreshold: MoraleThreshold.Steady,
    health: 100,
    maxHealth: 100,
    healthState: HealthState.Unhurt,
    fatigue: 100,
    maxFatigue: 100,
    fatigueState: FatigueState.Fresh,
    musketLoaded: true,
    alive: true,
    routing: false,
    experience: pc.experience,
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
    batteryCharged: false,
    meleeStage: 0,
  };
}

// Sync battle results back to persistent player character
export function syncBattleToCharacter(pc: PlayerCharacter, battle: BattleState): void {
  // Stats that can change during battle
  pc.valor = battle.player.valor;
  pc.reputation = battle.player.reputation;
  pc.ncoApproval = battle.player.ncoApproval;
  // Experience gain from battle
  pc.experience = Math.min(100, battle.player.experience + 10);
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
    location: gameState.campaign.currentBattle + ' — aftermath',
    days: 3,
  });
  gameState.phase = GamePhase.Camp;
  gameState.battleState = undefined;
}

// Transition from camp to battle
export function transitionToBattle(gameState: GameState): void {
  gameState.battleState = createBattleFromCharacter(gameState.player, gameState.npcs);
  gameState.phase = GamePhase.Battle;
  gameState.campState = undefined;
  gameState.campaign.currentBattle = gameState.campaign.nextBattle;
}
