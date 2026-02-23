import React, { useCallback } from 'react';
import { CombatantCard, ENEMY_TYPE_NAMES } from './CombatantCard';
import type { MeleeState, BattleState, MeleeActionId } from '../../types';

interface SkirmishFieldProps {
  meleeState: MeleeState;
  player: BattleState['player'];
  onSelectTarget: (index: number) => void;
}

export function SkirmishField({ meleeState, player, onSelectTarget }: SkirmishFieldProps) {
  const ms = meleeState;

  // Build set of combatants who guarded last round (from roundLog)
  const guardingNames = new Set<string>();
  for (const entry of ms.roundLog) {
    if (entry.action === ('guard' as MeleeActionId)) {
      guardingNames.add(entry.actorName);
    }
  }

  // Check if current target is dead, find first live enemy
  const currentTarget = ms.opponents[ms.playerTargetIndex];
  const currentTargetDead = !currentTarget || currentTarget.health <= 0;
  const firstLiveIdx = currentTargetDead
    ? ms.activeEnemies.find((i) => ms.opponents[i].health > 0)
    : undefined;

  const handleEnemyClick = useCallback((index: number) => {
    onSelectTarget(index);
  }, [onSelectTarget]);

  // Build ally cards (alive only)
  const allyCards = ms.allies
    .filter((ally) => ally.alive && ally.health > 0)
    .map((ally) => (
      <CombatantCard
        key={ally.id}
        name={ally.name}
        alive={ally.alive}
        sideClass="is-ally"
        health={ally.health}
        maxHealth={ally.maxHealth}
        stamina={ally.stamina}
        maxStamina={ally.maxStamina}
        fatigue={ally.fatigue}
        maxFatigue={ally.maxFatigue}
        stunned={ally.stunned}
        armInjured={ally.armInjured}
        legInjured={ally.legInjured}
        guarding={guardingNames.has(ally.name)}
        dataName={ally.name}
      />
    ));

  // Build enemy cards (active, alive only)
  const enemyCards = ms.activeEnemies
    .filter((i) => {
      const opp = ms.opponents[i];
      return opp.health > 0;
    })
    .map((i) => {
      const opp = ms.opponents[i];
      const isTargeted = currentTargetDead
        ? i === firstLiveIdx
        : i === ms.playerTargetIndex;
      const displayName = ENEMY_TYPE_NAMES[opp.type] || opp.type;

      return (
        <CombatantCard
          key={opp.name}
          name={displayName}
          alive={true}
          sideClass="is-enemy"
          health={opp.health}
          maxHealth={opp.maxHealth}
          stamina={opp.stamina}
          maxStamina={opp.maxStamina}
          fatigue={opp.fatigue}
          maxFatigue={opp.maxFatigue}
          stunned={opp.stunned}
          armInjured={opp.armInjured}
          legInjured={opp.legInjured}
          guarding={guardingNames.has(opp.name)}
          dataName={opp.name}
          isTargeted={isTargeted}
          oppIndex={i}
          selectable={true}
          onClick={() => handleEnemyClick(i)}
        />
      );
    });

  return (
    <div className="skirmish-field" id="skirmish-field">
      <div className="skirmish-friendly" id="skirmish-friendly">
        {/* Allies stack above player */}
        {allyCards}
        {/* Player card at bottom */}
        <CombatantCard
          name={player.name}
          alive={player.alive}
          sideClass="is-player"
          health={player.health}
          maxHealth={player.maxHealth}
          stamina={player.stamina}
          maxStamina={player.maxStamina}
          fatigue={player.fatigue}
          maxFatigue={player.maxFatigue}
          stunned={ms.playerStunned > 0}
          armInjured={false}
          legInjured={false}
          guarding={guardingNames.has(player.name)}
        />
      </div>
      <div className="skirmish-enemy" id="skirmish-enemy">
        {enemyCards}
      </div>
    </div>
  );
}
