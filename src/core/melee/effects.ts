import {
  BattleState,
  MeleeState,
  MeleeOpponent,
  MeleeAlly,
  MeleeStance,
  MeleeActionId,
  BodyPart,
  RoundAction,
  CombatantSnapshot,
  MoraleThreshold,
} from '../../types';
import { getFatigueDebuff } from '../stats';

// ============================================================
// CONSTANTS
// ============================================================

export const STANCE_MODS: Record<
  MeleeStance,
  { attack: number; defense: number; staminaCost: number }
> = {
  [MeleeStance.Aggressive]: { attack: 0.2, defense: -0.15, staminaCost: 14 },
  [MeleeStance.Balanced]: { attack: 0, defense: 0, staminaCost: 10 },
  [MeleeStance.Defensive]: { attack: -0.15, defense: 0.2, staminaCost: 8 },
};

interface ActionDef {
  stamina: number;
  hitBonus: number;
  damageMod: number;
  isAttack: boolean;
  stunBonus: number;
}

export const ACTION_DEFS: Record<MeleeActionId, ActionDef> = {
  [MeleeActionId.BayonetThrust]: {
    stamina: 20,
    hitBonus: 0,
    damageMod: 1.0,
    isAttack: true,
    stunBonus: 0,
  },
  [MeleeActionId.AggressiveLunge]: {
    stamina: 38,
    hitBonus: -0.1,
    damageMod: 1.5,
    isAttack: true,
    stunBonus: 0,
  },
  [MeleeActionId.ButtStrike]: {
    stamina: 26,
    hitBonus: 0.15,
    damageMod: 0,
    isAttack: true,
    stunBonus: 0.25,
  },
  [MeleeActionId.Feint]: { stamina: 14, hitBonus: 0.1, damageMod: 0, isAttack: true, stunBonus: 0 },
  [MeleeActionId.Guard]: { stamina: 12, hitBonus: 0, damageMod: 0, isAttack: false, stunBonus: 0 },
  [MeleeActionId.Respite]: {
    stamina: -35,
    hitBonus: 0,
    damageMod: 0,
    isAttack: false,
    stunBonus: 0,
  },
  [MeleeActionId.Shoot]: { stamina: 8, hitBonus: 0, damageMod: 2.0, isAttack: true, stunBonus: 0 },
  [MeleeActionId.Reload]: { stamina: 14, hitBonus: 0, damageMod: 0, isAttack: false, stunBonus: 0 },
  [MeleeActionId.SecondWind]: {
    stamina: 0,
    hitBonus: 0,
    damageMod: 0,
    isAttack: false,
    stunBonus: 0,
  },
  [MeleeActionId.UseCanteen]: {
    stamina: 0,
    hitBonus: 0,
    damageMod: 0,
    isAttack: false,
    stunBonus: 0,
  },
};

/** Fraction of damage taken that accumulates as fatigue (getting hit wears you down) */
export const DAMAGE_FATIGUE_RATE = 0.25;

export const BODY_PART_DEFS: Record<BodyPart, { hitMod: number; damageRange: [number, number] }> = {
  [BodyPart.Head]: { hitMod: -0.25, damageRange: [25, 35] },
  [BodyPart.Torso]: { hitMod: 0, damageRange: [15, 25] },
  [BodyPart.Arms]: { hitMod: -0.1, damageRange: [10, 15] },
  [BodyPart.Legs]: { hitMod: -0.15, damageRange: [10, 20] },
};

export const PART_NAMES: Record<BodyPart, string> = {
  [BodyPart.Head]: 'face',
  [BodyPart.Torso]: 'chest',
  [BodyPart.Arms]: 'arm',
  [BodyPart.Legs]: 'thigh',
};

// ============================================================
// SNAPSHOT HELPERS
// ============================================================

export interface Snapshotable {
  health: number;
  maxHealth: number;
  stamina: number;
  maxStamina: number;
  fatigue: number;
  maxFatigue: number;
  morale?: number;
  maxMorale?: number;
}

/** Capture a meter snapshot of any combatant after mutations are applied */
export function snapshotOf(c: Snapshotable): CombatantSnapshot {
  const snap: CombatantSnapshot = {
    health: c.health,
    maxHealth: c.maxHealth,
    stamina: c.stamina,
    maxStamina: c.maxStamina,
    fatigue: c.fatigue,
    maxFatigue: c.maxFatigue,
  };
  if ('morale' in c && c.morale !== undefined) {
    snap.morale = c.morale;
    snap.maxMorale = c.maxMorale;
  }
  return snap;
}

/** Attach per-action meter snapshots and push to round log */
export function pushAction(
  ms: MeleeState,
  action: RoundAction,
  actor: Snapshotable,
  target: Snapshotable,
) {
  action.actorAfter = snapshotOf(actor);
  action.targetAfter = snapshotOf(target);
  ms.roundLog.push(action);
}

// ============================================================
// COMBATANT MAPPING
// ============================================================

// Unified combatant interface for generic attack resolution
export interface CombatantRef {
  name: string;
  health: number;
  maxHealth: number;
  stamina: number;
  maxStamina: number;
  fatigue: number;
  maxFatigue: number;
  morale: number;
  maxMorale: number;
  strength: number;
  elan: number;
  musketry: number;
  type: string; // 'player' | 'conscript' | 'line' | 'veteran' | 'sergeant' | 'ally'
  stunned: boolean;
  stunnedTurns: number;
  armInjured: boolean;
  legInjured: boolean;
}

// Map player to CombatantRef
export function playerToCombatant(p: BattleState['player']): CombatantRef {
  return {
    name: p.name,
    health: p.health,
    maxHealth: p.maxHealth,
    stamina: p.stamina,
    maxStamina: p.maxStamina,
    fatigue: p.fatigue,
    maxFatigue: p.maxFatigue,
    morale: p.morale,
    maxMorale: p.maxMorale,
    strength: p.strength,
    elan: p.elan,
    musketry: p.musketry,
    type: 'player',
    stunned: false,
    stunnedTurns: 0,
    armInjured: false,
    legInjured: false,
  };
}

// Map opponent to CombatantRef
export function oppToCombatant(o: MeleeOpponent): CombatantRef {
  return {
    name: o.name,
    health: o.health,
    maxHealth: o.maxHealth,
    stamina: o.stamina,
    maxStamina: o.maxStamina,
    fatigue: o.fatigue,
    maxFatigue: o.maxFatigue,
    morale: o.maxHealth,
    maxMorale: o.maxHealth, // enemies don't track morale
    strength: o.strength,
    elan: 35,
    musketry: 30,
    type: o.type,
    stunned: o.stunned,
    stunnedTurns: o.stunnedTurns,
    armInjured: o.armInjured,
    legInjured: o.legInjured,
  };
}

// Map ally to CombatantRef
export function allyToCombatant(a: MeleeAlly): CombatantRef {
  return {
    name: a.name,
    health: a.health,
    maxHealth: a.maxHealth,
    stamina: a.stamina,
    maxStamina: a.maxStamina,
    fatigue: a.fatigue,
    maxFatigue: a.maxFatigue,
    morale: a.maxHealth,
    maxMorale: a.maxHealth, // allies don't track morale
    strength: a.strength,
    elan: a.elan,
    musketry: 30,
    type: 'ally',
    stunned: a.stunned,
    stunnedTurns: a.stunnedTurns,
    armInjured: a.armInjured,
    legInjured: a.legInjured,
  };
}

// Base hit rates for different combatant types when attacking
export const BASE_HIT_RATES: Record<string, number> = {
  player: 0.35, // player uses calcHitChance instead
  ally: 0.45, // allies use elan-based calculation
  conscript: 0.35,
  line: 0.45,
  veteran: 0.55,
  sergeant: 0.6,
};

// ============================================================
// STAMINA HELPERS
// ============================================================

export function oppSpendStamina(opp: MeleeOpponent, def: ActionDef) {
  const legMult = opp.legInjured ? 1.5 : 1.0;
  const cost = Math.round(def.stamina * legMult);
  opp.stamina = Math.max(0, opp.stamina - cost);
  if (cost > 0) opp.fatigue = Math.min(opp.maxFatigue, opp.fatigue + Math.round(cost * 0.5));
}

// ============================================================
// AVAILABLE ACTIONS
// ============================================================

interface MeleeActionChoice {
  id: MeleeActionId;
  label: string;
  description: string;
  available: boolean;
  staminaCost: number;
}

export function getMeleeActions(state: BattleState): MeleeActionChoice[] {
  const stamina = state.player.stamina;
  const musketLoaded = state.player.musketLoaded;
  const morale = state.player.moraleThreshold;

  const actions: MeleeActionChoice[] = [
    {
      id: MeleeActionId.BayonetThrust,
      label: 'Bayonet Thrust',
      description: 'Standard thrust. Reliable.',
      available: stamina >= 20,
      staminaCost: 20,
    },
    {
      id: MeleeActionId.AggressiveLunge,
      label: 'Aggressive Lunge',
      description: 'Wild lunge. 1.5x damage but harder to land.',
      available: stamina >= 38,
      staminaCost: 38,
    },
    {
      id: MeleeActionId.ButtStrike,
      label: 'Butt Strike',
      description: 'Musket stock. Drains stamina, chance to stun. Strength scales both.',
      available: stamina >= 26,
      staminaCost: 26,
    },
    {
      id: MeleeActionId.Feint,
      label: 'Feint',
      description: 'Fake out. No wound, but drains stamina and exhausts.',
      available: stamina >= 14,
      staminaCost: 14,
    },
    {
      id: MeleeActionId.Guard,
      label: 'Guard',
      description: 'Block chance (élan-based). Failed blocks reduce damage.',
      available: true,
      staminaCost: 12,
    },
    {
      id: MeleeActionId.Respite,
      label: 'Catch Breath',
      description: 'Recover 35 stamina. Opponent gets a free attack.',
      available: true,
      staminaCost: -35,
    },
    {
      id: MeleeActionId.SecondWind,
      label: 'Second Wind',
      description: 'Endurance roll to reduce fatigue. Opponent gets a free attack.',
      available: state.player.fatigue > 0,
      staminaCost: 0,
    },
  ];

  // Add Shoot action only when musket is loaded
  if (musketLoaded) {
    actions.splice(0, 0, {
      id: MeleeActionId.Shoot,
      label: 'Shoot',
      description: 'Fire your loaded musket. 2x damage, 25% head crit. Cannot be blocked.',
      available: true,
      staminaCost: 8,
    });
  }

  // Add Reload when musket is empty
  if (!musketLoaded) {
    const ms = state.meleeState;
    const progress = ms ? ms.reloadProgress : 0;
    actions.push({
      id: MeleeActionId.Reload,
      label: progress === 0 ? 'Reload (1/2)' : 'Reload (2/2)',
      description:
        progress === 0
          ? 'Bite cartridge, pour powder. Opponent gets a free attack.'
          : 'Ram ball, prime pan. Opponent gets a free attack. Musket ready.',
      available: stamina >= 14,
      staminaCost: 14,
    });
  }

  // At 0 stamina: forced respite only
  if (stamina <= 0) return actions.filter((a) => a.id === MeleeActionId.Respite);

  // Morale gating — low morale restricts aggressive actions
  if (morale === MoraleThreshold.Shaken) {
    // Shaken: no Aggressive Lunge
    for (const a of actions) {
      if (a.id === MeleeActionId.AggressiveLunge) a.available = false;
    }
  } else if (morale === MoraleThreshold.Wavering) {
    // Wavering: only Thrust, Guard, Respite, SecondWind, Shoot, Reload
    for (const a of actions) {
      if (
        ![
          MeleeActionId.BayonetThrust,
          MeleeActionId.Guard,
          MeleeActionId.Respite,
          MeleeActionId.SecondWind,
          MeleeActionId.Shoot,
          MeleeActionId.Reload,
        ].includes(a.id)
      ) {
        a.available = false;
      }
    }
  } else if (morale === MoraleThreshold.Breaking) {
    // Breaking: only Guard, Respite, SecondWind, Reload (survival instinct)
    for (const a of actions) {
      if (
        ![
          MeleeActionId.Guard,
          MeleeActionId.Respite,
          MeleeActionId.SecondWind,
          MeleeActionId.Reload,
        ].includes(a.id)
      ) {
        a.available = false;
      }
    }
  }

  return actions;
}
