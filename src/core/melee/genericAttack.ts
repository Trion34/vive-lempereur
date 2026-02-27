import {
  MeleeOpponent,
  MeleeAlly,
  MeleeStance,
  MeleeActionId,
  BodyPart,
  LogEntry,
  RoundAction,
} from '../../types';
import { getFatigueDebuff } from '../stats';
import {
  ACTION_DEFS,
  BODY_PART_DEFS,
  PART_NAMES,
  BASE_HIT_RATES,
  CombatantRef,
  shortName,
} from './effects';
import { randRange } from './encounters';
import { calcHitChance, calcDamage } from './hitCalc';

// ============================================================
// GENERIC ATTACK RESOLUTION
// ============================================================

interface GenericAttackResult {
  hit: boolean;
  damage: number;
  staminaDrain: number; // stamina drained from target (butt strike)
  fatigueDrain: number; // fatigue added to target (butt strike)
  special: string; // e.g. ' Stunned!', ' Arm injured.'
  targetKilled: boolean;
  log: LogEntry[];
  roundAction: RoundAction;
}

/**
 * Generic attack resolution: any combatant attacks any other.
 * Player attacks still use the player-specific calcHitChance.
 */
export function resolveGenericAttack(
  attacker: CombatantRef,
  target: CombatantRef,
  targetRef: MeleeOpponent | MeleeAlly | null, // mutable ref for applying status effects
  action: MeleeActionId,
  bodyPart: BodyPart,
  turn: number,
  opts: {
    side: 'player' | 'ally' | 'enemy';
    targetSide?: 'player' | 'ally' | 'enemy';
    stance?: MeleeStance;
    riposte?: boolean;
    freeAttack?: boolean;
    targetGuarding?: boolean;
    targetBlockChance?: number;
  },
): GenericAttackResult {
  const log: LogEntry[] = [];
  const aDef = ACTION_DEFS[action];
  const aShort = shortName(attacker.name);
  const targetShort = shortName(target.name);

  // Non-attack actions
  if (action === MeleeActionId.Respite) {
    log.push({ turn, type: 'result', text: `${aShort} catches breath.` });
    return {
      hit: false,
      damage: 0,
      staminaDrain: 0,
      fatigueDrain: 0,
      special: '',
      targetKilled: false,
      log,
      roundAction: {
        actorName: attacker.name,
        actorSide: opts.side,
        targetName: target.name,
        targetSide: opts.targetSide,
        action,
        hit: false,
        damage: 0,
      },
    };
  }
  if (action === MeleeActionId.Guard) {
    log.push({ turn, type: 'result', text: `${aShort} guards.` });
    return {
      hit: false,
      damage: 0,
      staminaDrain: 0,
      fatigueDrain: 0,
      special: '',
      targetKilled: false,
      log,
      roundAction: {
        actorName: attacker.name,
        actorSide: opts.side,
        targetName: target.name,
        targetSide: opts.targetSide,
        action,
        hit: false,
        damage: 0,
      },
    };
  }
  if (!aDef.isAttack) {
    return {
      hit: false,
      damage: 0,
      staminaDrain: 0,
      fatigueDrain: 0,
      special: '',
      targetKilled: false,
      log,
      roundAction: {
        actorName: attacker.name,
        actorSide: opts.side,
        targetName: target.name,
        targetSide: opts.targetSide,
        action,
        hit: false,
        damage: 0,
      },
    };
  }

  // Calculate hit
  let hitChance: number;
  if (attacker.type === 'player' && opts.stance) {
    // Player uses the full calcHitChance with stance
    const skillStat = action === MeleeActionId.Shoot ? attacker.musketry : attacker.elan;
    hitChance = calcHitChance(
      skillStat,
      attacker.morale,
      attacker.maxMorale,
      opts.stance,
      action,
      bodyPart,
      opts.riposte || false,
      attacker.fatigue,
      attacker.maxFatigue,
    );
  } else if (attacker.type === 'ally') {
    // Ally: elan-based hit
    const baseHit = 0.4 + attacker.elan / 200;
    const armPen = attacker.armInjured ? 0.1 : 0;
    hitChance = Math.max(
      0.1,
      Math.min(0.8, baseHit + aDef.hitBonus + BODY_PART_DEFS[bodyPart].hitMod - armPen),
    );
  } else {
    // Enemy: type-based hit
    const baseHit = BASE_HIT_RATES[attacker.type] ?? 0.45;
    const armPen = attacker.armInjured ? 0.1 : 0;
    hitChance = Math.max(
      0.15,
      Math.min(0.85, baseHit + aDef.hitBonus + BODY_PART_DEFS[bodyPart].hitMod - armPen),
    );
  }

  // Target fatigue vulnerability: fatigued targets are easier to hit
  const targetFatigueBonus = -getFatigueDebuff(target.fatigue, target.maxFatigue) / 100;
  hitChance = Math.max(0.05, Math.min(0.95, hitChance + targetFatigueBonus));

  const hit = Math.random() < hitChance;

  if (!hit) {
    const missText = opts.side === 'player' ? `Miss.` : `${aShort} misses ${targetShort}.`;
    log.push({ turn, type: 'result', text: missText });
    return {
      hit: false,
      damage: 0,
      staminaDrain: 0,
      fatigueDrain: 0,
      special: '',
      targetKilled: false,
      log,
      roundAction: {
        actorName: attacker.name,
        actorSide: opts.side,
        targetName: target.name,
        targetSide: opts.targetSide,
        action,
        bodyPart,
        hit: false,
        damage: 0,
      },
    };
  }

  // Hit connects — check if target blocks (Guard only)
  if (opts.targetGuarding && opts.targetBlockChance) {
    if (Math.random() < opts.targetBlockChance) {
      log.push({ turn, type: 'result', text: `${aShort} attacks ${targetShort} \u2014 blocked!` });
      return {
        hit: false,
        damage: 0,
        staminaDrain: 0,
        fatigueDrain: 0,
        special: '',
        targetKilled: false,
        log,
        roundAction: {
          actorName: attacker.name,
          actorSide: opts.side,
          targetName: target.name,
          targetSide: opts.targetSide,
          action,
          bodyPart,
          hit: false,
          damage: 0,
          blocked: true,
        },
      };
    }
    log.push({ turn, type: 'action', text: 'Guard broken.' });
    // Failed block — damage reduced by 15% (applied below)
  }

  // === BUTT STRIKE: stamina drain + stun chance, no HP damage ===
  if (action === MeleeActionId.ButtStrike) {
    const stDrain = Math.round(randRange(10, 15) * (0.75 + attacker.strength / 200));
    let special = '';
    const stunChance = aDef.stunBonus + attacker.strength / 400;
    if (Math.random() < stunChance && targetRef) {
      special = ' Stunned!';
      targetRef.stunned = true;
      targetRef.stunnedTurns = 1;
    }

    const hitText =
      opts.side === 'player'
        ? `Butt strike connects.${special}`
        : `${aShort} smashes ${targetShort} with the stock.${special}`;
    log.push({ turn, type: opts.side === 'enemy' ? 'event' : 'result', text: hitText });

    return {
      hit: true,
      damage: 0,
      staminaDrain: stDrain,
      fatigueDrain: 0,
      special,
      targetKilled: false,
      log,
      roundAction: {
        actorName: attacker.name,
        actorSide: opts.side,
        targetName: target.name,
        targetSide: opts.targetSide,
        action,
        bodyPart,
        hit: true,
        damage: 0,
        special: special || undefined,
      },
    };
  }

  // === FEINT: stamina/fatigue drain, no HP damage ===
  if (action === MeleeActionId.Feint) {
    const stDrain = Math.round(randRange(25, 35));
    const ftDrain = Math.round(randRange(20, 30));

    const hitText =
      opts.side === 'player'
        ? `Feint connects. ${targetShort} reacts to the fake.`
        : `${aShort} feints \u2014 ${targetShort} falls for it.`;
    log.push({ turn, type: opts.side === 'enemy' ? 'event' : 'result', text: hitText });

    return {
      hit: true,
      damage: 0,
      staminaDrain: stDrain,
      fatigueDrain: ftDrain,
      special: '',
      targetKilled: false,
      log,
      roundAction: {
        actorName: attacker.name,
        actorSide: opts.side,
        targetName: target.name,
        targetSide: opts.targetSide,
        action,
        bodyPart,
        hit: true,
        damage: 0,
      },
    };
  }

  // === NORMAL ATTACKS: HP damage ===
  let dmg = calcDamage(action, bodyPart, attacker.fatigue, attacker.maxFatigue, attacker.strength);
  if (opts.freeAttack) dmg = Math.round(dmg * 0.7);
  if (opts.targetGuarding) dmg = Math.round(dmg * 0.85);

  let special = '';
  // Head effects
  if (bodyPart === BodyPart.Head) {
    if (Math.random() < 0.1) {
      special = ' Killed.';
    } else if (Math.random() < 0.35 + aDef.stunBonus) {
      special = ' Stunned!';
      if (targetRef) {
        targetRef.stunned = true;
        targetRef.stunnedTurns = 1;
      }
    }
  }
  // Arm injury
  if (bodyPart === BodyPart.Arms && Math.random() < 0.15 && targetRef) {
    targetRef.armInjured = true;
    special = ' Arm injured.';
  }
  // Legs injury
  if (bodyPart === BodyPart.Legs && Math.random() < 0.1 && targetRef) {
    targetRef.legInjured = true;
    special = ' Leg injured.';
  }

  const targetKilled = special === ' Killed.';

  const hitText =
    opts.side === 'player'
      ? `Hit. ${PART_NAMES[bodyPart]}.${special}`
      : `${aShort} hits ${targetShort}. ${PART_NAMES[bodyPart]}.${special}`;
  log.push({ turn, type: opts.side === 'enemy' ? 'event' : 'result', text: hitText });

  return {
    hit: true,
    damage: dmg,
    staminaDrain: 0,
    fatigueDrain: 0,
    special,
    targetKilled,
    log,
    roundAction: {
      actorName: attacker.name,
      actorSide: opts.side,
      targetName: target.name,
      targetSide: opts.targetSide,
      action,
      bodyPart,
      hit: true,
      damage: dmg,
      special: special || undefined,
    },
  };
}
