import {
  BattleState,
  MeleeActionId,
  BodyPart,
  LogEntry,
  MoraleChange,
} from '../../types';
import { getFatigueDebuff } from '../stats';
import {
  STANCE_MODS,
  ACTION_DEFS,
  DAMAGE_FATIGUE_RATE,
  PART_NAMES,
  snapshotOf,
  pushAction,
  playerToCombatant,
  oppToCombatant,
  allyToCombatant,
  oppSpendStamina,
  shortName,
} from './effects';
import { chooseMeleeAI, chooseAllyAI, chooseEnemyTarget } from './opponents';
import { calcHitChance, calcDamage } from './hitCalc';
import { resolveGenericAttack } from './genericAttack';
import { isOpponentDefeated, processWaveEvents, backfillEnemies } from './waveManager';

// === SecondWind tuning constants ===
const SECOND_WIND_ROLL_RANGE = 50;
const SECOND_WIND_THRESHOLD = 60;
const SECOND_WIND_FATIGUE_REDUCTION = 0.25;

// === Combat constants (used for player + ally) ===
const FATIGUE_ACCUMULATION_RATE = 0.5;
const ELAN_BLOCK_DIVISOR = 85;
const CANTEEN_HP_RESTORE = 20;

// ============================================================
// SKIRMISH ROUND RESOLUTION
// ============================================================

interface MeleeRoundResult {
  log: LogEntry[];
  moraleChanges: MoraleChange[];
  playerHealthDelta: number;
  playerStaminaDelta: number;
  allyDeaths: { name: string; npcId?: string; isNamed: boolean }[];
  enemyDefeats: number;
  battleEnd?: 'victory' | 'defeat' | 'survived';
}

/**
 * Resolve one round of melee combat.
 * Turn order: Player -> each alive ally -> each alive enemy.
 * @mutates state — modifies state.player (health/stamina/fatigue), state.meleeState, and opponents in place
 */
export function resolveMeleeRound(
  state: BattleState,
  playerAction: MeleeActionId,
  playerBodyPart: BodyPart | undefined,
  playerTargetIdx: number,
): MeleeRoundResult {
  const ms = state.meleeState!;
  const turn = state.turn;
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];
  let playerHealthDelta = 0;
  let playerStaminaDelta = 0;
  const allyDeaths: MeleeRoundResult['allyDeaths'] = [];
  let enemyDefeats = 0;
  let battleEnd: MeleeRoundResult['battleEnd'];

  ms.roundLog = [];
  ms.roundNumber += 1;

  // Process wave events (reinforcements, enemy escalation)
  const waveLogs = processWaveEvents(ms, turn, state.line, state.roles);
  log.push(...waveLogs);

  const pDef = ACTION_DEFS[playerAction];
  const sDef = STANCE_MODS[ms.playerStance];

  // Tick stuns on all combatants (before action resolution)
  if (ms.playerStunned > 0) ms.playerStunned -= 1;
  for (const opp of ms.opponents) {
    if (opp.stunned) {
      opp.stunnedTurns -= 1;
      if (opp.stunnedTurns <= 0) opp.stunned = false;
    }
  }
  for (const ally of ms.allies) {
    if (ally.stunned) {
      ally.stunnedTurns -= 1;
      if (ally.stunnedTurns <= 0) ally.stunned = false;
    }
  }

  const playerStunned = ms.playerStunned > 0;

  // Player stamina cost + fatigue accumulation (stunned = stance cost only, applied immediately)
  const playerStamCost = playerStunned ? sDef.staminaCost : pDef.stamina + sDef.staminaCost;
  playerStaminaDelta = -playerStamCost;
  state.player.stamina = Math.max(
    0,
    Math.min(state.player.maxStamina, state.player.stamina - playerStamCost),
  );
  if (playerStamCost > 0) {
    state.player.fatigue = Math.min(
      state.player.maxFatigue,
      state.player.fatigue + Math.round(playerStamCost * FATIGUE_ACCUMULATION_RATE),
    );
  }

  // Track guard state for UI overlay
  ms.playerGuarding = playerAction === MeleeActionId.Guard && !playerStunned;

  // Track player defensive state for this round
  const playerGuarding = playerAction === MeleeActionId.Guard && !playerStunned;
  let playerBlockChance = 0;

  if (playerGuarding) {
    const fatigueDebuffPct = getFatigueDebuff(state.player.fatigue, state.player.maxFatigue) / 100;
    playerBlockChance = Math.max(
      0.05,
      Math.min(0.95, 0.1 + sDef.defense + state.player.elan / ELAN_BLOCK_DIVISOR + fatigueDebuffPct),
    );
  }

  // Track ally defensive states
  const allyGuarding = new Map<string, number>(); // id -> block chance

  // Get list of live active enemies (only those on the field, not in pool)
  const liveEnemyIndices = ms.activeEnemies.filter((i) => {
    const o = ms.opponents[i];
    return o.health > 0 && !isOpponentDefeated(o);
  });

  const liveAllies = ms.allies.filter((a) => a.alive && a.health > 0);

  // === PLAYER ACTS ===
  if (playerStunned) {
    log.push({ turn, type: 'result', text: "Stunned. Can't act." });
  } else if (playerAction === MeleeActionId.Respite) {
    log.push({ turn, type: 'action', text: 'Catching breath.' });
    pushAction(
      ms,
      {
        actorName: state.player.name,
        actorSide: 'player',
        targetName: state.player.name,
        targetSide: 'player',
        action: playerAction,
        hit: true,
        damage: 0,
      },
      state.player,
      state.player,
    );
  } else if (playerAction === MeleeActionId.Feint && liveEnemyIndices.length > 0) {
    const targetIdx = liveEnemyIndices.includes(playerTargetIdx)
      ? playerTargetIdx
      : liveEnemyIndices[0];
    const target = ms.opponents[targetIdx];
    const result = resolveGenericAttack(
      playerToCombatant(state.player),
      oppToCombatant(target),
      target,
      playerAction,
      BodyPart.Torso,
      turn,
      { side: 'player', targetSide: 'enemy', stance: ms.playerStance, riposte: ms.playerRiposte },
    );
    log.push(...result.log);
    if (result.hit) {
      target.stamina = Math.max(0, target.stamina - result.staminaDrain);
      target.fatigue = Math.min(target.maxFatigue, target.fatigue + result.fatigueDrain);
      moraleChanges.push({ amount: 2, reason: 'You wrong-foot your opponent', source: 'action' });
    }
    pushAction(ms, result.roundAction, state.player, target);
    ms.playerRiposte = false;
  } else if (playerAction === MeleeActionId.Reload) {
    ms.reloadProgress += 1;
    if (ms.reloadProgress >= 2) {
      state.player.musketLoaded = true;
      ms.reloadProgress = 0;
      log.push({ turn, type: 'action', text: 'Ram ball home. Prime the pan. Musket loaded.' });
    } else {
      log.push({ turn, type: 'action', text: 'Bite cartridge. Pour powder. Half loaded.' });
    }
    pushAction(
      ms,
      {
        actorName: state.player.name,
        actorSide: 'player',
        targetName: state.player.name,
        targetSide: 'player',
        action: playerAction,
        hit: false,
        damage: 0,
      },
      state.player,
      state.player,
    );
  } else if (playerAction === MeleeActionId.SecondWind) {
    // Second Wind: endurance roll to reduce fatigue
    const endRoll = state.player.endurance + Math.random() * SECOND_WIND_ROLL_RANGE;
    const success = endRoll > SECOND_WIND_THRESHOLD;
    if (success) {
      const reduction = Math.round(state.player.maxFatigue * SECOND_WIND_FATIGUE_REDUCTION);
      state.player.fatigue = Math.max(0, state.player.fatigue - reduction);
      log.push({
        turn,
        type: 'action',
        text: 'Second wind. The burning eases. You can breathe again.',
      });
    } else {
      log.push({
        turn,
        type: 'action',
        text: "You try to steady your breathing — but the exhaustion won't release its grip.",
      });
    }
    pushAction(
      ms,
      {
        actorName: state.player.name,
        actorSide: 'player',
        targetName: state.player.name,
        targetSide: 'player',
        action: playerAction,
        hit: success,
        damage: 0,
      },
      state.player,
      state.player,
    );
  } else if (playerAction === MeleeActionId.UseCanteen) {
    // Drink from canteen: restore HP, increment uses
    const hpRestore = CANTEEN_HP_RESTORE;
    state.player.health = Math.min(state.player.maxHealth, state.player.health + hpRestore);
    state.player.canteenUses += 1;
    log.push({
      turn,
      type: 'action',
      text: 'You uncork the canteen and drink. The water is warm and tastes of tin, but it steadies you.',
    });
    pushAction(
      ms,
      {
        actorName: state.player.name,
        actorSide: 'player',
        targetName: state.player.name,
        targetSide: 'player',
        action: playerAction,
        hit: true,
        damage: hpRestore,
      },
      state.player,
      state.player,
    );
  } else if (playerAction === MeleeActionId.Shoot && state.player.musketLoaded) {
    state.player.musketLoaded = false;
    ms.reloadProgress = 0;
    const target = liveEnemyIndices.includes(playerTargetIdx)
      ? ms.opponents[playerTargetIdx]
      : ms.opponents[liveEnemyIndices[0]];
    const bp = playerBodyPart || BodyPart.Torso;
    const baseHitChance = calcHitChance(
      state.player.musketry,
      state.player.morale,
      state.player.maxMorale,
      ms.playerStance,
      playerAction,
      bp,
      ms.playerRiposte,
      state.player.fatigue,
      state.player.maxFatigue,
    );
    // Target fatigue vulnerability: fatigued targets are easier to shoot
    const shootFatigueBonus = -getFatigueDebuff(target.fatigue, target.maxFatigue) / 100;
    const hitChance = Math.max(0.05, Math.min(0.95, baseHitChance + shootFatigueBonus));
    const hit = Math.random() < Math.max(0.1, hitChance);
    if (hit) {
      const dmg = calcDamage(
        playerAction,
        bp,
        state.player.fatigue,
        state.player.maxFatigue,
        state.player.strength,
      );
      target.health -= dmg;
      target.fatigue = Math.min(
        target.maxFatigue,
        target.fatigue + Math.round(dmg * DAMAGE_FATIGUE_RATE),
      );
      moraleChanges.push({
        amount: dmg / 3,
        reason: 'Musket ball found its mark',
        source: 'action',
      });
      let special = '';
      if (bp === BodyPart.Head && Math.random() < 0.25) {
        target.health = 0;
        special = ' Killed.';
      }
      log.push({
        turn,
        type: 'result',
        text: `Shot hits ${shortName(target.name)}. ${PART_NAMES[bp]}.${special}`,
      });
      pushAction(
        ms,
        {
          actorName: state.player.name,
          actorSide: 'player',
          targetName: target.name,
          targetSide: 'enemy',
          action: playerAction,
          bodyPart: bp,
          hit: true,
          damage: dmg,
          special: special || undefined,
        },
        state.player,
        target,
      );
    } else {
      log.push({ turn, type: 'result', text: 'Shot misses.' });
      pushAction(
        ms,
        {
          actorName: state.player.name,
          actorSide: 'player',
          targetName: target.name,
          targetSide: 'enemy',
          action: playerAction,
          bodyPart: bp,
          hit: false,
          damage: 0,
        },
        state.player,
        target,
      );
    }
    ms.playerRiposte = false;
  } else if (playerAction === MeleeActionId.ButtStrike && liveEnemyIndices.length > 0) {
    const targetIdx = liveEnemyIndices.includes(playerTargetIdx)
      ? playerTargetIdx
      : liveEnemyIndices[0];
    const target = ms.opponents[targetIdx];
    const result = resolveGenericAttack(
      playerToCombatant(state.player),
      oppToCombatant(target),
      target,
      playerAction,
      BodyPart.Torso,
      turn,
      { side: 'player', targetSide: 'enemy', stance: ms.playerStance, riposte: ms.playerRiposte },
    );
    log.push(...result.log);
    if (result.hit) {
      target.stamina = Math.max(0, target.stamina - result.staminaDrain);
      target.fatigue = Math.min(target.maxFatigue, target.fatigue + result.fatigueDrain);
      moraleChanges.push({ amount: 2, reason: 'You stagger your opponent', source: 'action' });
    }
    pushAction(ms, result.roundAction, state.player, target);
    ms.playerRiposte = false;
  } else if (pDef.isAttack && playerBodyPart && liveEnemyIndices.length > 0) {
    const targetIdx = liveEnemyIndices.includes(playerTargetIdx)
      ? playerTargetIdx
      : liveEnemyIndices[0];
    const target = ms.opponents[targetIdx];
    const result = resolveGenericAttack(
      playerToCombatant(state.player),
      oppToCombatant(target),
      target,
      playerAction,
      playerBodyPart,
      turn,
      { side: 'player', targetSide: 'enemy', stance: ms.playerStance, riposte: ms.playerRiposte },
    );
    log.push(...result.log);
    if (result.hit) {
      target.health -= result.damage;
      target.stamina = Math.max(0, target.stamina - result.staminaDrain);
      target.fatigue = Math.min(
        target.maxFatigue,
        target.fatigue + result.fatigueDrain + Math.round(result.damage * DAMAGE_FATIGUE_RATE),
      );
      if (result.damage > 0)
        moraleChanges.push({
          amount: result.damage / 4,
          reason: 'Your strike connects',
          source: 'action',
        });
      if (result.staminaDrain > 0)
        moraleChanges.push({ amount: 2, reason: 'You stagger your opponent', source: 'action' });
      if (result.targetKilled) target.health = 0;
    }
    pushAction(ms, result.roundAction, state.player, target);
    ms.playerRiposte = false;
  } else if (playerAction === MeleeActionId.Guard) {
    // Already handled above (defensive state tracked)
    log.push({ turn, type: 'action', text: 'You raise your guard.' });
    const guardTarget =
      ms.opponents[
        liveEnemyIndices.includes(playerTargetIdx) ? playerTargetIdx : liveEnemyIndices[0]
      ];
    pushAction(
      ms,
      {
        actorName: state.player.name,
        actorSide: 'player',
        targetName: guardTarget?.name ?? '',
        targetSide: 'enemy',
        action: MeleeActionId.Guard,
        hit: false,
        damage: 0,
      },
      state.player,
      guardTarget || state.player,
    );
  }

  // Check for enemy defeats after player acts
  for (const idx of liveEnemyIndices) {
    const opp = ms.opponents[idx];
    if (isOpponentDefeated(opp)) {
      // Retroactively mark the killing blow in the round log
      for (let i = ms.roundLog.length - 1; i >= 0; i--) {
        if (ms.roundLog[i].targetName === opp.name && ms.roundLog[i].hit) {
          ms.roundLog[i].targetKilled = true;
          break;
        }
      }
      log.push({ turn, type: 'event', text: `${shortName(opp.name)} down.` });
      ms.roundLog.push({
        eventType: 'defeat',
        actorName: opp.name,
        actorSide: 'enemy',
        targetName: opp.name,
        targetSide: 'enemy',
        action: MeleeActionId.Guard,
        hit: false,
        damage: 0,
        narrative: `${shortName(opp.name)} is down`,
        actorAfter: snapshotOf(opp),
        targetAfter: snapshotOf(opp),
      });
      ms.killCount += 1;
      enemyDefeats += 1;
    }
  }

  // Backfill enemies from pool after player kills
  backfillEnemies(ms, turn, log);

  // === ALLIES ACT ===
  for (const ally of liveAllies) {
    if (ally.stunned || ally.health <= 0 || !ally.alive) continue;

    // Refresh live enemy list each iteration so allies don't target dead enemies
    const currentLiveEnemies = ms.activeEnemies.filter((i) => {
      const o = ms.opponents[i];
      return o.health > 0 && !isOpponentDefeated(o);
    });
    if (currentLiveEnemies.length === 0) break;

    const aiChoice = chooseAllyAI(ally, ms.opponents, currentLiveEnemies);
    const targetIdx = aiChoice.targetIndex;
    const target = ms.opponents[targetIdx];

    // Ally stamina cost + fatigue
    const allyActionDef = ACTION_DEFS[aiChoice.action];
    const legMult = ally.legInjured ? 1.5 : 1.0;
    const allyCost = Math.round(allyActionDef.stamina * legMult);
    ally.stamina = Math.max(0, ally.stamina - allyCost);
    if (allyCost > 0)
      ally.fatigue = Math.min(ally.maxFatigue, ally.fatigue + Math.round(allyCost * FATIGUE_ACCUMULATION_RATE));

    if (aiChoice.action === MeleeActionId.Guard) {
      allyGuarding.set(ally.id, Math.max(0.05, Math.min(0.8, 0.1 + ally.elan / ELAN_BLOCK_DIVISOR)));
      log.push({ turn, type: 'result', text: `${ally.name} raises guard.` });
      pushAction(
        ms,
        {
          actorName: ally.name,
          actorSide: 'ally',
          targetName: target.name,
          targetSide: 'enemy',
          action: aiChoice.action,
          hit: false,
          damage: 0,
        },
        ally,
        target,
      );
      continue;
    }

    if (aiChoice.action === MeleeActionId.Respite) {
      ally.stamina = Math.min(ally.maxStamina, ally.stamina + 30);
      log.push({ turn, type: 'result', text: `${ally.name} catches breath.` });
      pushAction(
        ms,
        {
          actorName: ally.name,
          actorSide: 'ally',
          targetName: target.name,
          targetSide: 'enemy',
          action: aiChoice.action,
          hit: true,
          damage: 0,
        },
        ally,
        target,
      );
      continue;
    }

    if (aiChoice.action === MeleeActionId.SecondWind) {
      const allyEndRoll = ally.elan + Math.random() * SECOND_WIND_ROLL_RANGE;
      const allySwSuccess = allyEndRoll > SECOND_WIND_THRESHOLD;
      if (allySwSuccess) {
        const reduction = Math.round(ally.maxFatigue * SECOND_WIND_FATIGUE_REDUCTION);
        ally.fatigue = Math.max(0, ally.fatigue - reduction);
        log.push({ turn, type: 'result', text: `${ally.name} finds a second wind.` });
      } else {
        log.push({ turn, type: 'result', text: `${ally.name} gasps for breath.` });
      }
      pushAction(
        ms,
        {
          actorName: ally.name,
          actorSide: 'ally',
          targetName: target.name,
          targetSide: 'enemy',
          action: aiChoice.action,
          hit: allySwSuccess,
          damage: 0,
        },
        ally,
        target,
      );
      continue;
    }

    const result = resolveGenericAttack(
      allyToCombatant(ally),
      oppToCombatant(target),
      target,
      aiChoice.action,
      aiChoice.bodyPart,
      turn,
      { side: 'ally', targetSide: 'enemy' },
    );
    log.push(...result.log);
    if (result.hit) {
      target.health -= result.damage;
      target.stamina = Math.max(0, target.stamina - result.staminaDrain);
      target.fatigue = Math.min(
        target.maxFatigue,
        target.fatigue + result.fatigueDrain + Math.round(result.damage * DAMAGE_FATIGUE_RATE),
      );
      if (result.targetKilled) target.health = 0;
    }
    pushAction(ms, result.roundAction, ally, target);

    // Check defeat
    if (isOpponentDefeated(target)) {
      // Retroactively mark the killing blow in the round log
      for (let i = ms.roundLog.length - 1; i >= 0; i--) {
        if (ms.roundLog[i].targetName === target.name && ms.roundLog[i].hit) {
          ms.roundLog[i].targetKilled = true;
          break;
        }
      }
      log.push({ turn, type: 'event', text: `${shortName(target.name)} down.` });
      ms.roundLog.push({
        eventType: 'defeat',
        actorName: target.name,
        actorSide: 'enemy',
        targetName: target.name,
        targetSide: 'enemy',
        action: MeleeActionId.Guard,
        hit: false,
        damage: 0,
        narrative: `${shortName(target.name)} is down`,
        actorAfter: snapshotOf(target),
        targetAfter: snapshotOf(target),
      });
      ms.killCount += 1;
      enemyDefeats += 1;
    }
  }

  // Backfill enemies from pool after ally kills
  backfillEnemies(ms, turn, log);

  // Refresh live active enemy list
  const liveEnemiesAfterAllies = ms.activeEnemies.filter((i) => {
    const o = ms.opponents[i];
    return o.health > 0 && !isOpponentDefeated(o);
  });

  // === ENEMIES ACT ===
  for (const idx of liveEnemiesAfterAllies) {
    // Stop if player is already dead
    if (state.player.health <= 0) break;

    const opp = ms.opponents[idx];
    if (opp.stunned) {
      log.push({ turn, type: 'result', text: `${shortName(opp.name)} stunned.` });
      continue;
    }

    const ai = chooseMeleeAI(opp, state);
    const aiDef = ACTION_DEFS[ai.action];

    // Enemy target selection
    const enemyTarget = chooseEnemyTarget(opp, state.player, ms.allies);

    // Enemy stamina cost
    oppSpendStamina(opp, aiDef);

    if (ai.action === MeleeActionId.Respite) {
      opp.stamina = Math.min(opp.maxStamina, opp.stamina + 30);
      log.push({ turn, type: 'result', text: `${shortName(opp.name)} catches breath.` });
      pushAction(
        ms,
        {
          actorName: opp.name,
          actorSide: 'enemy',
          targetName: enemyTarget.name,
          targetSide: 'enemy',
          action: ai.action,
          hit: true,
          damage: 0,
        },
        opp,
        opp,
      );
      continue;
    }
    if (ai.action === MeleeActionId.SecondWind) {
      // Opponent Second Wind: use strength as proxy for endurance
      const oppEndRoll = opp.strength + Math.random() * SECOND_WIND_ROLL_RANGE;
      const oppSwSuccess = oppEndRoll > SECOND_WIND_THRESHOLD;
      if (oppSwSuccess) {
        const reduction = Math.round(opp.maxFatigue * SECOND_WIND_FATIGUE_REDUCTION);
        opp.fatigue = Math.max(0, opp.fatigue - reduction);
        log.push({
          turn,
          type: 'result',
          text: `${shortName(opp.name)} catches a second wind.`,
        });
      } else {
        log.push({ turn, type: 'result', text: `${shortName(opp.name)} gasps for breath.` });
      }
      pushAction(
        ms,
        {
          actorName: opp.name,
          actorSide: 'enemy',
          targetName: enemyTarget.name,
          targetSide: 'enemy',
          action: ai.action,
          hit: oppSwSuccess,
          damage: 0,
        },
        opp,
        opp,
      );
      continue;
    }
    if (ai.action === MeleeActionId.Guard) {
      log.push({ turn, type: 'result', text: `${shortName(opp.name)} guards.` });
      pushAction(
        ms,
        {
          actorName: opp.name,
          actorSide: 'enemy',
          targetName: enemyTarget.name,
          targetSide: 'enemy',
          action: ai.action,
          hit: false,
          damage: 0,
        },
        opp,
        opp,
      );
      continue;
    }

    if (!aiDef.isAttack) continue;

    // Attacking the player
    if (enemyTarget.type === 'player') {
      ms.lastOppAttacked = true;
      const result = resolveGenericAttack(
        oppToCombatant(opp),
        playerToCombatant(state.player),
        null,
        ai.action,
        ai.bodyPart,
        turn,
        {
          side: 'enemy',
          targetSide: 'player',
          targetGuarding: playerGuarding,
          targetBlockChance: playerBlockChance,
          freeAttack:
            playerAction === MeleeActionId.Respite ||
            playerAction === MeleeActionId.Reload ||
            playerAction === MeleeActionId.SecondWind ||
            playerAction === MeleeActionId.UseCanteen ||
            playerStunned,
        },
      );
      log.push(...result.log);
      if (result.hit) {
        // Apply health damage immediately
        state.player.health = Math.max(0, state.player.health - result.damage);
        state.player.stamina = Math.max(0, state.player.stamina - result.staminaDrain);
        state.player.fatigue = Math.min(
          state.player.maxFatigue,
          state.player.fatigue +
            result.fatigueDrain +
            Math.round(result.damage * DAMAGE_FATIGUE_RATE),
        );
        playerHealthDelta -= result.damage;
        if (result.damage > 0)
          moraleChanges.push({
            amount: -(result.damage / 3),
            reason: `Hit by ${shortName(opp.name)}`,
            source: 'event',
          });
        if (result.staminaDrain > 0)
          moraleChanges.push({
            amount: -3,
            reason: `Staggered by ${shortName(opp.name)}`,
            source: 'event',
          });
        // Stun check on player
        const stunRoll = (ai.bodyPart === BodyPart.Head ? 0.3 : 0) + aiDef.stunBonus;
        if (stunRoll > 0 && Math.random() < stunRoll) {
          ms.playerStunned = 1;
          moraleChanges.push({ amount: -5, reason: 'Stunned!', source: 'event' });
        }
      }
      pushAction(ms, result.roundAction, opp, state.player);

      // Player death check — stop remaining enemies from attacking
      if (state.player.health <= 0) {
        battleEnd = 'defeat';
        break;
      }
    } else {
      // Attacking an ally
      const targetAlly = ms.allies.find((a) => a.id === enemyTarget.id);
      if (!targetAlly || !targetAlly.alive || targetAlly.health <= 0) continue;

      const allyBlockChance = allyGuarding.get(targetAlly.id) || 0;
      const result = resolveGenericAttack(
        oppToCombatant(opp),
        allyToCombatant(targetAlly),
        targetAlly,
        ai.action,
        ai.bodyPart,
        turn,
        {
          side: 'enemy',
          targetSide: 'ally',
          targetGuarding: allyBlockChance > 0,
          targetBlockChance: allyBlockChance,
        },
      );
      log.push(...result.log);
      if (result.hit) {
        targetAlly.health -= result.damage;
        targetAlly.stamina = Math.max(0, targetAlly.stamina - result.staminaDrain);
        targetAlly.fatigue = Math.min(
          targetAlly.maxFatigue,
          targetAlly.fatigue +
            result.fatigueDrain +
            Math.round(result.damage * DAMAGE_FATIGUE_RATE),
        );
        if (result.targetKilled) targetAlly.health = 0;
      }
      pushAction(ms, result.roundAction, opp, targetAlly);

      // Ally death check
      if (targetAlly.health <= 0 && targetAlly.alive) {
        targetAlly.alive = false;
        const isNamed = targetAlly.type === 'named';
        allyDeaths.push({ name: targetAlly.name, npcId: targetAlly.npcId, isNamed });
        if (isNamed) {
          log.push({
            turn,
            type: 'event',
            text: `${targetAlly.name} goes down! The loss hits you like a physical blow.`,
          });
          moraleChanges.push({ amount: -8, reason: `${targetAlly.name} fell`, source: 'event' });
        } else {
          log.push({ turn, type: 'event', text: `${targetAlly.name} falls.` });
          moraleChanges.push({ amount: -3, reason: 'Ally fell', source: 'event' });
        }
        ms.roundLog.push({
          eventType: 'defeat',
          actorName: targetAlly.name,
          actorSide: 'ally',
          targetName: targetAlly.name,
          targetSide: 'ally',
          action: MeleeActionId.Guard,
          hit: false,
          damage: 0,
          narrative: isNamed ? `${targetAlly.name} goes down` : `${targetAlly.name} falls`,
          actorAfter: snapshotOf(targetAlly),
          targetAfter: snapshotOf(targetAlly),
        });
      }
    }
  }

  // === END-OF-ROUND CHECKS ===
  ms.exchangeCount += 1;

  // All enemies defeated? (active ones dead/broken AND pool is empty)
  const anyActiveAlive = ms.activeEnemies.some((i) => {
    const o = ms.opponents[i];
    return o.health > 0 && !isOpponentDefeated(o);
  });
  if (!anyActiveAlive && ms.enemyPool.length === 0) battleEnd = 'victory';

  // Player dead? (health already applied in-place during enemy attacks)
  if (state.player.health <= 0) battleEnd = 'defeat';

  // Survived check (low HP, fought hard, more enemies remain)
  if (
    !battleEnd &&
    enemyDefeats > 0 &&
    state.player.health < 25 &&
    ms.killCount >= 2 &&
    (anyActiveAlive || ms.enemyPool.length > 0)
  ) {
    battleEnd = 'survived';
  }

  // Sync currentOpponent to first live active enemy
  const firstLiveActive = ms.activeEnemies.find((i) => {
    const o = ms.opponents[i];
    return o.health > 0 && !isOpponentDefeated(o);
  });
  if (firstLiveActive !== undefined) {
    ms.currentOpponent = firstLiveActive;
  }

  return {
    log,
    moraleChanges,
    playerHealthDelta,
    playerStaminaDelta,
    allyDeaths,
    enemyDefeats,
    battleEnd,
  };
}
