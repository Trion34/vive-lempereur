import {
  BattleState, ChargeChoiceId, ChargeChoice, BattlePhase,
  LogEntry, MoraleChange,
} from '../types';
import { createMeleeState, resetMeleeHistory } from './melee';

// ============================================================
// STORY BEAT SYSTEM (Battery Overrun Choice)
// ============================================================

export interface ChargeEncounterResult {
  log: LogEntry[];
  moraleChanges: MoraleChange[];
  healthDelta: number;
  fatigueDelta: number;
  nextEncounter: number; // 0 = done
}

// ============================================================
// GET STORY BEAT (narrative + choices)
// ============================================================

export function getChargeEncounter(
  _state: BattleState
): { narrative: string; choices: ChargeChoice[] } {
  const narrative = `The 14th fights on. Ground is taken, lost, taken again across the broken terrain of the plateau. Vineyards become killing grounds. Walled gardens become fortresses held for minutes, then lost.

Through the chaos, you hear it \u2014 the crack of artillery, closer than before, firing in the wrong direction. The Austrians have overrun one of your batteries. French guns turned against French troops.

Over the cacophony, Captain Leclerc's voice rings out \u2014 hoarse, furious, alive with defiance:

"FOURTEENTH! Will you let them take your guns?!"

You catch Pierre's eye across the press of bodies. Blood on his sleeve, bayonet steady. A glimmer of something \u2014 not madness, not despair. Valor. The real thing.`;

  const choices: ChargeChoice[] = [
    {
      id: ChargeChoiceId.ChargeBattery,
      label: 'Charge the battery',
      description: 'Heed the captain\'s call. Charge into the teeth of your own guns to take them back.',
      available: true,
    },
    {
      id: ChargeChoiceId.HoldBack,
      label: 'Hold back',
      description: 'Let braver souls lead. You\'ve done enough.',
      available: true,
    },
  ];

  return { narrative, choices };
}

// ============================================================
// RESOLVE STORY BEAT CHOICE
// ============================================================

export function resolveChargeChoice(
  state: BattleState, choiceId: ChargeChoiceId
): ChargeEncounterResult {
  const turn = state.turn;
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];

  if (choiceId === ChargeChoiceId.ChargeBattery) {
    log.push({
      turn, type: 'action',
      text: `You don't think. Your legs move. Pierre is beside you \u2014 blood on his sleeve, bayonet level \u2014 and you are running, both of you, across the open ground toward the battery.

The guns fire. Your own guns. Canister tears the air around you \u2014 men fall to your left and right. But you are still running, and Pierre is still running, and the captain is somewhere behind you screaming the Fourteenth forward.

The Austrian gunners see you coming. Some reach for short swords. Others try to turn the guns. Too late. Too slow.

You are among them.`,
    });
    moraleChanges.push({ amount: 5, reason: 'The rush of the charge', source: 'action' });

    // Transition to battery melee
    state.batteryCharged = true;
    state.meleeStage = 2;
    state.phase = BattlePhase.Melee;
    state.chargeEncounter = 0;
    state.enemy.range = 0;
    resetMeleeHistory();
    state.meleeState = createMeleeState(state, 'battery');

    const firstOpp = state.meleeState.opponents[0];
    log.push({
      turn, type: 'event',
      text: '\n--- THE BATTERY ---\n\nThe redoubt is chaos. Overturned caissons, scattered rammers, the acrid reek of powder. The guns loom like iron beasts. French guns. Your guns. Time to take them back.',
    });
    log.push({
      turn, type: 'narrative',
      text: `${firstOpp.description}\n\n${firstOpp.name} faces you.`,
    });

    return { log, moraleChanges, healthDelta: 0, fatigueDelta: 0, nextEncounter: 0 };
  }

  // HoldBack
  log.push({
    turn, type: 'action',
    text: `You hesitate. Your legs don't move. Pierre glances back at you \u2014 just a glance, no judgment in it, not yet \u2014 and then he's gone, charging with the others toward the battery.

You watch them go. Captain Leclerc. Pierre. Men whose names you know. Men whose names you don't. They run across the open ground and the guns fire and men fall and they keep running.

The battery is retaken. You see it happen from fifty paces back. The tricolour goes up over the guns. A cheer rises from the smoke.

You were not part of it.

You tell yourself you made the right choice. You will keep telling yourself that.`,
  });
  moraleChanges.push({ amount: -3, reason: 'Shame \u2014 you held back', source: 'action' });
  state.player.reputation -= 5;
  state.batteryCharged = false;

  // Battle ends \u2014 part 1 complete
  state.battleOver = true;
  state.outcome = 'part1_complete';

  return { log, moraleChanges, healthDelta: 0, fatigueDelta: 0, nextEncounter: 0 };
}
