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
import {
  CONSCRIPT_NAMES,
  LINE_NAMES,
  SERGEANT_NAMES,
  TERRAIN_ROSTER,
  BATTERY_ROSTER,
  RIVOLI_ENCOUNTERS,
} from '../../data/battles/rivoli/encounters';

export function randRange(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function pickName(type: string): string {
  const pool =
    type === 'conscript' ? CONSCRIPT_NAMES : type === 'line' ? LINE_NAMES : SERGEANT_NAMES;
  return pool[Math.floor(Math.random() * pool.length)];
}

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
  encounters: Record<string, EncounterConfig> = RIVOLI_ENCOUNTERS,
): MeleeState {
  const config = encounters[encounterKey ?? context];
  const roster = config
    ? config.opponents
    : context === MeleeContext.Battery
      ? BATTERY_ROSTER
      : TERRAIN_ROSTER;
  const usedNames = new Set<string>();
  const opponents = roster.map((t) => makeOpponent(t, usedNames));
  const maxExchanges = config ? config.maxExchanges : context === MeleeContext.Battery ? 10 : 12;
  const allies = config ? config.allies.map((t) => makeAlly(t)) : [];

  // Wave system: initial active enemies vs pool (all modes use this now)
  const initActive = config?.initialActiveEnemies ?? opponents.length;
  const activeEnemies = opponents.slice(0, initActive).map((_, i) => i);
  const enemyPool = opponents.slice(initActive).map((_, i) => i + initActive);
  const maxActiveEnemies = config?.maxActiveEnemies ?? opponents.length;

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
  };
}
