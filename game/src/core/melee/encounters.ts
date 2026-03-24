import {
  BattleState,
  MeleeState,
  MeleeOpponent,
  MeleeAlly,
  MeleeStance,
  OpponentTemplate,
  AllyTemplate,
  EncounterConfig,
  MeleeContext,
} from '../../types';
import { AUSTRIAN_NAMES } from '../../data/encounters/austrianNames';
import { tryGetBattleConfig } from '../../data/battles/registry';

/** Hard cap: never more than 3 combatants per side at once */
export const MAX_COMBATANTS_PER_SIDE = 3;
/** Max allies = MAX_COMBATANTS_PER_SIDE - 1 (player counts as one combatant) */
export const MAX_ALLIES = MAX_COMBATANTS_PER_SIDE - 1;

export function randRange(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function pickName(type: string): string {
  const pool = AUSTRIAN_NAMES[type] ?? AUSTRIAN_NAMES['line'] ?? ['Soldat'];
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Temperament ranges per opponent type — [min, max] inclusive */
const TEMPERAMENT_RANGES: Record<MeleeOpponent['type'], [number, number]> = {
  conscript: [20, 40],
  line: [35, 55],
  veteran: [45, 65],
  sergeant: [55, 80],
};

export function makeOpponent(t: OpponentTemplate, usedNames?: Set<string>): MeleeOpponent {
  const health = randRange(t.health[0], t.health[1]);
  const stamina = randRange(t.stamina[0], t.stamina[1]);
  // Pick a unique personal name to avoid card lookup collisions
  let personalName: string;
  let fullName: string;
  let attempts = 0;
  do {
    personalName = pickName(t.type);
    fullName = `${t.name} — ${personalName}`;
    attempts++;
  } while (usedNames?.has(fullName) && attempts < 20);
  usedNames?.add(fullName);
  const [tMin, tMax] = TEMPERAMENT_RANGES[t.type];
  return {
    name: fullName,
    type: t.type,
    health,
    maxHealth: health,
    stamina,
    maxStamina: stamina,
    fatigue: 0,
    maxFatigue: stamina,
    strength: t.strength,
    stunned: false,
    stunnedTurns: 0,
    armInjured: false,
    legInjured: false,
    description: t.description,
    momentum: 0,
    freeStrikeReady: false,
    observedPlayerActions: [],
    temperament: randRange(tMin, tMax),
  };
}

export function makeAlly(t: AllyTemplate): MeleeAlly {
  const health = randRange(t.health[0], t.health[1]);
  const stamina = randRange(t.stamina[0], t.stamina[1]);
  return {
    id: t.id,
    name: t.name,
    type: t.type,
    npcId: t.npcId,
    health,
    maxHealth: health,
    stamina,
    maxStamina: stamina,
    fatigue: 0,
    maxFatigue: stamina,
    strength: t.strength,
    elan: t.elan,
    alive: true,
    stunned: false,
    stunnedTurns: 0,
    armInjured: false,
    legInjured: false,
    description: t.description,
    personality: t.personality,
  };
}

// ============================================================
// CREATE MELEE STATE
// ============================================================

export function createMeleeState(
  state: BattleState,
  context: MeleeContext = MeleeContext.Terrain,
  encounterKey?: string,
): MeleeState {
  const battleConfig = tryGetBattleConfig(state.configId);
  const encounters = battleConfig?.encounters ?? {};
  const config = encounters[encounterKey ?? context];
  if (!config) {
    throw new Error(`[createMeleeState] No encounter config for key="${encounterKey ?? context}" in battle "${state.configId}". Available keys: [${Object.keys(encounters).join(', ')}]`);
  }
  const roster = config?.opponents ?? [];
  const usedNames = new Set<string>();
  const opponents = roster.map((t) => makeOpponent(t, usedNames));
  const maxExchanges = config?.maxExchanges ?? 12;
  const allies = (config?.allies ?? []).slice(0, MAX_ALLIES).map((t) => makeAlly(t));

  // Wave system: initial active enemies vs pool (all modes use this now)
  const initActive = Math.min(MAX_COMBATANTS_PER_SIDE, config?.initialActiveEnemies ?? opponents.length);
  const activeEnemies = opponents.slice(0, initActive).map((_, i) => i);
  const enemyPool = opponents.slice(initActive).map((_, i) => i + initActive);
  const maxActiveEnemies = Math.min(MAX_COMBATANTS_PER_SIDE, config?.maxActiveEnemies ?? opponents.length);

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
    maxExchanges,
    meleeContext: config ? config.context : context,
    lastOppAttacked: false,
    playerGuarding: false,
    oppGuarding: false,
    // Combat field state
    allies,
    activeEnemies,
    roundNumber: 0,
    playerTargetIndex: 0,
    roundLog: [],
    maxActiveEnemies,
    enemyPool,
    processedWaves: [],
    waveEvents: config?.waveEvents ?? [],
    reloadProgress: 0,
    playerMomentum: 0,
    playerFreeStrikeReady: false,
  };
}
