/* ------------------------------------------------------------------ */
/*  Encounter Converter — lab types → game types for sandbox play      */
/* ------------------------------------------------------------------ */

import type {
  BattleState,
  Player,
  OpponentTemplate,
  AllyTemplate,
  WaveEvent,
  EncounterConfig,
  MeleeState,
  EnemyState,
  LineState,
  RankState,
  BattleExt,
} from '@game/types';
import {
  BattlePhase,
  DrillStep,
  MoraleThreshold,
  HealthState,
  FatigueTier,
  MeleeContext,
  MeleeStance,
  MilitaryRank,
  Formation,
} from '@game/types';
import type { BattleRoles } from '@game/data/battles/types';
import { makeOpponent, makeAlly } from '@game/core/melee/encounters';
import { V2_TUNING } from '@game/core/melee/tuning';
import type {
  MeleeEncounterModule,
  LabOpponentTemplate,
  LabAllyTemplate,
  LabWaveEvent,
  LabMeleeContext,
} from '../types/meleeLabTypes';

/* ------------------------------------------------------------------ */
/*  Player config for sandbox                                          */
/* ------------------------------------------------------------------ */

export interface SandboxPlayerConfig {
  name: string;
  strength: number;
  elan: number;
  musketry: number;
  valor: number;
  endurance: number;
  constitution: number;
}

export const DEFAULT_PLAYER_CONFIG: SandboxPlayerConfig = {
  name: 'Sandbox Soldier',
  strength: 40,
  elan: 35,
  musketry: 35,
  valor: 40,
  endurance: 40,
  constitution: 45,
};

/* ------------------------------------------------------------------ */
/*  Template converters                                                */
/* ------------------------------------------------------------------ */

const CONTEXT_MAP: Record<LabMeleeContext, MeleeContext> = {
  terrain: MeleeContext.Terrain,
  battery: MeleeContext.Battery,
  skirmish: MeleeContext.Skirmish,
};

export function labOpponentToGameTemplate(o: LabOpponentTemplate): OpponentTemplate {
  return {
    name: o.name,
    type: o.type,
    health: o.health,
    stamina: o.stamina,
    strength: o.strength,
    description: o.description,
  };
}

export function labAllyToGameTemplate(a: LabAllyTemplate): AllyTemplate {
  return {
    id: a.id,
    name: a.name,
    type: (a.type === 'named' || a.type === 'generic') ? a.type : 'named',
    npcId: a.npcId || undefined,
    health: a.health,
    stamina: a.stamina,
    strength: a.strength,
    elan: a.elan,
    personality: a.personality,
    description: a.description,
  };
}

export function labWaveToGameWave(
  w: LabWaveEvent,
  allies: LabAllyTemplate[],
): WaveEvent {
  const wave: WaveEvent = {
    atRound: w.atRound,
    action: w.action,
    narrative: w.narrative,
  };
  if (w.action === 'add_ally' && w.allyTemplateId) {
    const allyLab = allies.find((a) => a.id === w.allyTemplateId);
    if (allyLab) {
      wave.allyTemplate = labAllyToGameTemplate(allyLab);
    } else {
      console.warn(`[encounterConverter] Wave event references missing ally "${w.allyTemplateId}"`);
    }
  }
  if (w.action === 'increase_max_enemies') {
    wave.newMaxEnemies = w.newMaxEnemies;
  }
  if (w.conditionNpcAlive) {
    wave.conditionNpcAlive = w.conditionNpcAlive;
  }
  return wave;
}

export function encounterModuleToEncounterConfig(enc: MeleeEncounterModule): EncounterConfig {
  return {
    context: CONTEXT_MAP[enc.context],
    opponents: enc.opponents.map(labOpponentToGameTemplate),
    allies: enc.allies.map(labAllyToGameTemplate),
    maxExchanges: enc.maxExchanges,
    initialActiveEnemies: enc.initialActiveEnemies,
    maxActiveEnemies: enc.maxActiveEnemies,
    waveEvents: enc.waveEvents.map((w) => labWaveToGameWave(w, enc.allies)),
  };
}

/* ------------------------------------------------------------------ */
/*  BattleState factory for sandbox                                    */
/* ------------------------------------------------------------------ */

function createSandboxPlayer(cfg: SandboxPlayerConfig): Player {
  const maxHealth = Math.round(30 + 1.5 * cfg.constitution);
  const maxStamina = Math.round(30 + 1.5 * cfg.endurance);
  const maxMorale = 100;
  const maxFatigue = maxStamina;

  return {
    name: cfg.name,
    valor: cfg.valor,
    musketry: cfg.musketry,
    elan: cfg.elan,
    strength: cfg.strength,
    endurance: cfg.endurance,
    constitution: cfg.constitution,
    charisma: 30,
    intelligence: 30,
    awareness: 35,
    morale: maxMorale,
    maxMorale,
    moraleThreshold: MoraleThreshold.Steady,
    health: maxHealth,
    maxHealth,
    healthState: HealthState.Unhurt,
    stamina: maxStamina,
    maxStamina,
    fatigue: 0,
    maxFatigue,
    fatigueTier: FatigueTier.Fresh,
    musketLoaded: true,
    alive: true,
    routing: false,
    fumbledLoad: false,
    soldierRep: 50,
    officerRep: 50,
    napoleonRep: 0,
    frontRank: false,
    canteenUses: 0,
  };
}

function createSandboxMeleeState(config: EncounterConfig): MeleeState {
  const usedNames = new Set<string>();
  const opponents = config.opponents.map((t) => makeOpponent(t, usedNames));
  const allies = config.allies.map((t) => makeAlly(t));

  const initActive = Math.min(3, config.initialActiveEnemies ?? opponents.length);
  const activeEnemies = opponents.slice(0, initActive).map((_, i) => i);
  const enemyPool = opponents.slice(initActive).map((_, i) => i + initActive);
  const maxActive = Math.min(3, config.maxActiveEnemies ?? opponents.length);

  return {
    opponents,
    currentOpponent: 0,
    playerStance: MeleeStance.Balanced,
    playerRiposte: false,
    playerStunned: 0,
    exchangeCount: 0,
    selectingStance: false,
    selectingTarget: false,
    killCount: 0,
    valorTempBonus: 0,
    maxExchanges: config.maxExchanges,
    meleeContext: config.context,
    lastOppAttacked: false,
    playerGuarding: false,
    oppGuarding: false,
    allies,
    activeEnemies,
    roundNumber: 0,
    playerTargetIndex: 0,
    roundLog: [],
    maxActiveEnemies: maxActive,
    enemyPool,
    processedWaves: [],
    waveEvents: config.waveEvents ?? [],
    reloadProgress: 0,
    playerMomentum: 0,
    playerFreeStrikeReady: false,
  };
}

export function createSandboxBattleState(
  enc: MeleeEncounterModule,
  playerConfig: SandboxPlayerConfig = DEFAULT_PLAYER_CONFIG,
): BattleState {
  const config = encounterModuleToEncounterConfig(enc);
  const player = createSandboxPlayer(playerConfig);
  const meleeState = createSandboxMeleeState(config);

  const stubLine: LineState = {
    leftNeighbour: null,
    rightNeighbour: null,
    officer: { name: 'Stub', rank: 'Captain', alive: true, wounded: false, mounted: false, status: '' },
    lineIntegrity: 100,
    lineMorale: 'steady',
    drumsPlaying: false,
    ncoPresent: false,
    casualtiesThisTurn: 0,
  };

  const stubEnemy: EnemyState = {
    range: 0,
    strength: 100,
    quality: 'line',
    morale: 'steady',
    lineIntegrity: 100,
    artillery: false,
    cavalryThreat: false,
  };

  const stubRoles: BattleRoles = {
    leftNeighbour: 'jb',
    rightNeighbour: 'pierre',
    officer: 'deschamps',
    nco: 'aubert',
  };

  const stubRankState: RankState = {
    heldVolleyBonus: false,
    refuseFlankTurns: 0,
    holdCount: 0,
    fixedBayonetsEarly: false,
    requestSupportCooldown: 0,
    refuseFlankUsed: false,
    rangeModifier: 0,
  };

  const stubExt: BattleExt = {
    battlePart: 1,
    meleeStage: 0,
  };

  return {
    configId: 'sandbox',
    phase: BattlePhase.Melee,
    turn: 0,
    drillStep: DrillStep.Load,
    player,
    roles: stubRoles,
    line: stubLine,
    enemy: stubEnemy,
    log: [],
    availableActions: [],
    pendingMoraleChanges: [],
    battleOver: false,
    outcome: 'pending',
    crisisTurn: 0,
    volleysFired: 0,
    scriptedVolley: 0,
    chargeEncounter: 0,
    meleeState,
    meleeTuning: V2_TUNING,
    ext: stubExt,
    autoPlayActive: false,
    autoPlayVolleyCompleted: 0,
    graceEarned: false,
    pendingVirtueChange: 0,
    playerRank: MilitaryRank.Private,
    rankState: stubRankState,
    formation: Formation.Line,
    formationChosen: false,
  };
}
