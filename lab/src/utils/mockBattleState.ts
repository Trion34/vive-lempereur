import type { BattleState, EnemyState, LineState, RivoliExt, RankState, Player, Soldier, Officer } from '@game/types';
import {
  BattlePhase,
  DrillStep,
  MoraleThreshold,
  HealthState,
  FatigueTier,
  MilitaryRank,
  Formation,
} from '@game/types';
import type { BattleRoles } from '@game/data/battles/types';

/* ------------------------------------------------------------------ */
/*  PreviewConfig — the designer-facing knobs                          */
/* ------------------------------------------------------------------ */

export interface NeighbourConfig {
  name: string;
  alive: boolean;
  wounded: boolean;
  routing: boolean;
}

export interface PreviewConfig {
  range: number;
  drillStep: DrillStep;
  lineIntegrity: number;
  lineMorale: string;
  enemyStrength: number;
  enemyMorale: string;
  enemyLineIntegrity: number;
  enemyQuality: string;
  artillery: boolean;
  cavalryThreat: boolean;
  playerName: string;
  playerMorale: number;
  playerHealth: number;
  ncoPresent: boolean;
  officerAlive: boolean;
  leftNeighbour: NeighbourConfig | null;
  rightNeighbour: NeighbourConfig | null;
  officerName: string;
  scriptedVolley: number;
}

/* ------------------------------------------------------------------ */
/*  Presets                                                            */
/* ------------------------------------------------------------------ */

export const PREVIEW_PRESETS: Record<string, PreviewConfig> = {
  freshStart: {
    range: 120,
    drillStep: DrillStep.Present,
    lineIntegrity: 95,
    lineMorale: 'steady',
    enemyStrength: 95,
    enemyMorale: 'advancing',
    enemyLineIntegrity: 100,
    enemyQuality: 'line',
    artillery: false,
    cavalryThreat: false,
    playerName: 'Soldier',
    playerMorale: 80,
    playerHealth: 100,
    ncoPresent: true,
    officerAlive: true,
    leftNeighbour: { name: 'Left Neighbour', alive: true, wounded: false, routing: false },
    rightNeighbour: { name: 'Right Neighbour', alive: true, wounded: false, routing: false },
    officerName: 'Officer',
    scriptedVolley: 1,
  },
  crisis: {
    range: 50,
    drillStep: DrillStep.Endure,
    lineIntegrity: 35,
    lineMorale: 'wavering',
    enemyStrength: 70,
    enemyMorale: 'charging',
    enemyLineIntegrity: 55,
    enemyQuality: 'line',
    artillery: true,
    cavalryThreat: true,
    playerName: 'Soldier',
    playerMorale: 30,
    playerHealth: 45,
    ncoPresent: false,
    officerAlive: false,
    leftNeighbour: { name: 'Left Neighbour', alive: true, wounded: true, routing: false },
    rightNeighbour: { name: 'Right Neighbour', alive: true, wounded: false, routing: true },
    officerName: 'Officer',
    scriptedVolley: 4,
  },
  elevatedFire: {
    range: 200,
    drillStep: DrillStep.Fire,
    lineIntegrity: 60,
    lineMorale: 'resolute',
    enemyStrength: 80,
    enemyMorale: 'trapped',
    enemyLineIntegrity: 40,
    enemyQuality: 'conscript',
    artillery: false,
    cavalryThreat: false,
    playerName: 'Soldier',
    playerMorale: 70,
    playerHealth: 60,
    ncoPresent: true,
    officerAlive: true,
    leftNeighbour: { name: 'Left Neighbour', alive: true, wounded: true, routing: false },
    rightNeighbour: { name: 'Right Neighbour', alive: true, wounded: false, routing: false },
    officerName: 'Officer',
    scriptedVolley: 8,
  },
  tutorial: {
    range: 100,
    drillStep: DrillStep.Load,
    lineIntegrity: 100,
    lineMorale: 'holding',
    enemyStrength: 100,
    enemyMorale: 'steady',
    enemyLineIntegrity: 100,
    enemyQuality: 'line',
    artillery: false,
    cavalryThreat: false,
    playerName: 'Recruit',
    playerMorale: 100,
    playerHealth: 100,
    ncoPresent: true,
    officerAlive: true,
    leftNeighbour: { name: 'Left Neighbour', alive: true, wounded: false, routing: false },
    rightNeighbour: { name: 'Right Neighbour', alive: true, wounded: false, routing: false },
    officerName: 'Officer',
    scriptedVolley: 0,
  },
};

export const DEFAULT_PREVIEW_CONFIG: PreviewConfig = PREVIEW_PRESETS.freshStart;

/* ------------------------------------------------------------------ */
/*  Factory: PreviewConfig → BattleState                               */
/* ------------------------------------------------------------------ */

function makeSoldier(
  id: string,
  name: string,
  alive: boolean,
  wounded: boolean,
  routing: boolean,
): Soldier {
  const morale = !alive ? 0 : routing ? 10 : wounded ? 40 : 60;
  const threshold = !alive
    ? MoraleThreshold.Breaking
    : routing
      ? MoraleThreshold.Breaking
      : wounded
        ? MoraleThreshold.Shaken
        : MoraleThreshold.Steady;
  return {
    id,
    name,
    rank: 'private',
    valor: 30,
    morale,
    maxMorale: 100,
    threshold,
    alive,
    wounded,
    routing,
    musketLoaded: true,
    relationship: 50,
  };
}

export function previewConfigToBattleState(cfg: PreviewConfig): BattleState {
  const player: Player = {
    name: cfg.playerName,
    valor: 40,
    musketry: 35,
    elan: 35,
    strength: 40,
    endurance: 40,
    constitution: 45,
    charisma: 30,
    intelligence: 30,
    awareness: 35,
    morale: cfg.playerMorale,
    maxMorale: 100,
    moraleThreshold: cfg.playerMorale >= 75 ? MoraleThreshold.Steady : cfg.playerMorale >= 40 ? MoraleThreshold.Shaken : MoraleThreshold.Wavering,
    health: cfg.playerHealth,
    maxHealth: 100,
    healthState: cfg.playerHealth >= 70 ? HealthState.Unhurt : cfg.playerHealth >= 40 ? HealthState.Wounded : HealthState.BadlyWounded,
    stamina: 200,
    maxStamina: 400,
    fatigue: 0,
    maxFatigue: 400,
    fatigueTier: FatigueTier.Fresh,
    musketLoaded: true,
    alive: true,
    routing: false,
    fumbledLoad: false,
    soldierRep: 50,
    officerRep: 50,
    napoleonRep: 0,
    frontRank: false,
    canteenUses: 3,
  };

  const enemy: EnemyState = {
    range: cfg.range,
    strength: cfg.enemyStrength,
    quality: cfg.enemyQuality,
    morale: cfg.enemyMorale,
    lineIntegrity: cfg.enemyLineIntegrity,
    artillery: cfg.artillery,
    cavalryThreat: cfg.cavalryThreat,
  };

  const officer: Officer = {
    name: cfg.officerName,
    rank: 'lieutenant',
    alive: cfg.officerAlive,
    wounded: false,
    mounted: false,
    status: cfg.officerAlive ? 'commanding' : 'down',
  };

  const left = cfg.leftNeighbour;
  const right = cfg.rightNeighbour;

  const line: LineState = {
    leftNeighbour: left
      ? makeSoldier('left', left.name, left.alive, left.wounded, left.routing)
      : null,
    rightNeighbour: right
      ? makeSoldier('right', right.name, right.alive, right.wounded, right.routing)
      : null,
    officer,
    lineIntegrity: cfg.lineIntegrity,
    lineMorale: cfg.lineMorale,
    drumsPlaying: cfg.lineIntegrity > 50,
    ncoPresent: cfg.ncoPresent,
    casualtiesThisTurn: 0,
  };

  const roles: BattleRoles = {
    leftNeighbour: left ? 'left' : '',
    rightNeighbour: right ? 'right' : '',
    officer: 'officer',
    nco: 'nco',
  };

  const ext: RivoliExt = {
    battlePart: 1,
    batteryCharged: false,
    meleeStage: 0,
    wagonDamage: 0,
    gorgeTarget: '',
    gorgeMercyCount: 0,
  };

  const rankState: RankState = {
    heldVolleyBonus: false,
    refuseFlankTurns: 0,
    holdCount: 0,
    fixedBayonetsEarly: false,
    requestSupportCooldown: 0,
    refuseFlankUsed: false,
    rangeModifier: 0,
  };

  return {
    configId: 'lab',
    phase: BattlePhase.Line,
    turn: cfg.scriptedVolley || 1,
    drillStep: cfg.drillStep,
    player,
    roles,
    line,
    enemy,
    log: [],
    availableActions: [],
    pendingMoraleChanges: [],
    battleOver: false,
    outcome: 'pending',
    crisisTurn: 0,
    volleysFired: cfg.scriptedVolley || 0,
    scriptedVolley: cfg.scriptedVolley,
    chargeEncounter: 0,
    ext,
    autoPlayActive: false,
    autoPlayVolleyCompleted: 0,
    graceEarned: false,
    pendingVirtueChange: 0,
    playerRank: MilitaryRank.Private,
    rankState,
    formation: Formation.Line,
    formationChosen: false,
  } as BattleState;
}
