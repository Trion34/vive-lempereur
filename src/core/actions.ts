import {
  Action, ActionId, MoraleThreshold, DrillStep,
  BattleState, MoraleChange, LogEntry,
} from '../types';
import { rollValor } from './morale';
import { clampStat } from './stats';

const thresholdOrder: MoraleThreshold[] = [
  MoraleThreshold.Breaking, MoraleThreshold.Wavering,
  MoraleThreshold.Shaken, MoraleThreshold.Steady,
];

function meetsThreshold(current: MoraleThreshold, required: MoraleThreshold): boolean {
  return thresholdOrder.indexOf(current) >= thresholdOrder.indexOf(required);
}

export function getAvailableActions(state: BattleState): Action[] {
  const { player, line, enemy } = state;
  const step = state.drillStep;
  const mt = player.moraleThreshold;

  // LOAD step is automatic — no player actions
  if (step === DrillStep.Load) return [];

  // PRESENT step when fumbled: only "Go Through Motions"
  if (step === DrillStep.Present && player.fumbledLoad) {
    return [{
      id: ActionId.GoThroughMotions,
      name: 'Go Through the Motions',
      description: 'Raise your empty musket. Pretend. No one must know.',
      minThreshold: MoraleThreshold.Breaking,
      available: true,
      drillStep: DrillStep.Present,
    }];
  }

  // FIRE step when fumbled: no actions — auto-resolved by battle loop
  if (step === DrillStep.Fire && player.fumbledLoad) return [];

  const allActions: Action[] = [
    // === PRESENT STEP ===
    {
      id: ActionId.AimCarefully, name: 'Aim Carefully',
      description: 'Steady your musket. Pick a man. Breathe. This takes nerve — and time.',
      minThreshold: MoraleThreshold.Steady, available: false, drillStep: DrillStep.Present,
    },
    {
      id: ActionId.PresentArms, name: 'Present Arms',
      description: 'Raise your musket to the shoulder. Standard. Reliable.',
      minThreshold: MoraleThreshold.Breaking, available: false, drillStep: DrillStep.Present,
    },
    // === FIRE STEP ===
    {
      id: ActionId.Fire, name: 'Fire',
      description: player.heldFire
        ? 'Release the held volley. At this closer range, devastating.'
        : 'Fire with the volley. Present, squeeze, and trust the smoke.',
      minThreshold: MoraleThreshold.Shaken, available: false, drillStep: DrillStep.Fire,
    },
    {
      id: ActionId.SnapShot, name: 'Snap Shot',
      description: 'Jerk the trigger. Fast, wild, inaccurate — but it\'s done.',
      minThreshold: MoraleThreshold.Breaking, available: false, drillStep: DrillStep.Fire,
    },
    {
      id: ActionId.HoldFire, name: 'Hold Fire',
      description: 'Don\'t fire. Incredible nerve. Your loaded musket waits for closer range.',
      minThreshold: MoraleThreshold.Steady, available: false, drillStep: DrillStep.Fire,
    },
    // === ENDURE STEP ===
    {
      id: ActionId.StandFirm, name: 'Stand Firm',
      description: 'Endure. You stand in the line and you take it. This is the job.',
      minThreshold: MoraleThreshold.Wavering, available: false, drillStep: DrillStep.Endure,
    },
    {
      id: ActionId.SteadyNeighbour, name: 'Steady the Line',
      description: `Grip ${(line.rightNeighbour?.alive && !line.rightNeighbour.routing ? line.rightNeighbour.name : line.leftNeighbour?.name) || 'your neighbour'}'s shoulder. "Steady, lad."`,
      minThreshold: MoraleThreshold.Shaken, available: false, drillStep: DrillStep.Endure,
    },
    {
      id: ActionId.Duck, name: 'Duck',
      description: player.duckCount === 0
        ? 'Flinch as the volley comes. The sergeant will notice.'
        : player.duckCount < 3
        ? 'Duck again. The shame compounds.'
        : 'Cower. Everyone has seen.',
      minThreshold: MoraleThreshold.Breaking, available: false, drillStep: DrillStep.Endure,
    },
    {
      id: ActionId.Pray, name: 'Pray',
      description: player.prayerCount < 2
        ? 'Mutter the words your mother taught you.'
        : 'The words come harder now. God feels far away.',
      minThreshold: MoraleThreshold.Breaking, available: false, drillStep: DrillStep.Endure,
    },
    {
      id: ActionId.DrinkWater, name: `Drink (${3 - player.canteenUses} left)`,
      description: 'A mouthful of warm water. Restores body and spirit.',
      minThreshold: MoraleThreshold.Wavering, available: false, drillStep: DrillStep.Endure,
    },
  ];

  // Filter to current drill step and check availability
  const stepActions = allActions.filter(a => a.drillStep === step);

  for (const action of stepActions) {
    let available = meetsThreshold(mt, action.minThreshold);

    if (action.id === ActionId.SteadyNeighbour) {
      const hasTarget = (line.rightNeighbour?.alive && !line.rightNeighbour.routing) ||
                        (line.leftNeighbour?.alive && !line.leftNeighbour.routing);
      if (!hasTarget) available = false;
    }
    if (action.id === ActionId.DrinkWater && player.canteenUses >= 3) {
      available = false;
    }
    if (action.id === ActionId.Duck && player.ncoApproval <= 10 && line.ncoPresent) {
      available = false;
    }

    action.available = available;
  }

  return stepActions.filter(a => a.available);
}

// === ACTION RESOLUTION ===

interface ActionResult {
  moraleChanges: MoraleChange[];
  log: LogEntry[];
  musketLoaded: boolean;
  heldFire: boolean;
  ncoApprovalChange: number;
  enemyDamage: number;
  ducked: boolean;
  neighbourMoraleBoost: number;
  staminaCost: number;
  healthCost: number;
  nextDrillStep: DrillStep;
}

export function resolveAction(actionId: ActionId, state: BattleState): ActionResult {
  const result: ActionResult = {
    moraleChanges: [], log: [],
    musketLoaded: state.player.musketLoaded,
    heldFire: state.player.heldFire,
    ncoApprovalChange: 0, enemyDamage: 0, ducked: false,
    neighbourMoraleBoost: 0, staminaCost: 0, healthCost: 0,
    nextDrillStep: getNextDrillStep(state.drillStep, actionId, state.player.musketLoaded),
  };

  const roll = Math.random();
  const { player, enemy, line } = state;
  const heldBonus = player.heldFire ? 0.2 : 0;

  switch (actionId) {
    // === PRESENT ACTIONS ===
    case ActionId.AimCarefully: {
      result.staminaCost = 5;
      result.heldFire = false;
      const { success: valorSuccess } = rollValor(player.valor, 0);
      if (valorSuccess) {
        result.moraleChanges.push({ amount: 1, reason: 'Steady hands, steady aim', source: 'action' });
        result.log.push({ turn: state.turn, text: 'Aimed.', type: 'action' });
        result.ncoApprovalChange = 2;
        state.player.valor = clampStat(state.player.valor + 1);
      } else {
        result.moraleChanges.push({ amount: -2, reason: 'Hands shaking too much to aim true', source: 'action' });
        result.log.push({ turn: state.turn, text: 'Can\'t steady.', type: 'action' });
      }
      break;
    }
    case ActionId.PresentArms: {
      result.staminaCost = 3;
      result.log.push({ turn: state.turn, text: 'Ready.', type: 'action' });
      break;
    }

    // === FIRE ACTIONS ===
    case ActionId.Fire: {
      result.staminaCost = 2;
      result.musketLoaded = false;
      result.heldFire = false;
      const accuracy = 0.25 + (player.musketry / 300) + heldBonus;
      const rangeMod = Math.max(0, 1 - enemy.range / 400);
      const hit = roll < accuracy * rangeMod;

      if (hit) {
        result.enemyDamage = player.heldFire ? 5 : 2.5;
        if (heldBonus > 0) {
          result.log.push({ turn: state.turn, text: 'Held fire released. Hit.', type: 'result' });
          result.moraleChanges.push({ amount: 4, reason: 'Held volley struck home', source: 'action' });
        } else {
          result.log.push({ turn: state.turn, text: 'Hit.', type: 'result' });
          result.moraleChanges.push({ amount: 2, reason: 'Doing your duty', source: 'action' });
        }
      } else {
        result.log.push({ turn: state.turn, text: 'Fired.', type: 'result' });
        result.moraleChanges.push({ amount: 1, reason: 'Fired with the volley', source: 'action' });
      }
      break;
    }
    case ActionId.SnapShot: {
      result.staminaCost = 1;
      result.musketLoaded = false;
      result.heldFire = false;
      if (roll < 0.08) {
        result.enemyDamage = 1;
        result.log.push({ turn: state.turn, text: 'Snap shot. Hit.', type: 'result' });
      } else {
        result.log.push({ turn: state.turn, text: 'Snap shot. Wide.', type: 'result' });
        result.ncoApprovalChange = -3;
      }
      result.moraleChanges.push({ amount: -1, reason: 'Fired wild', source: 'action' });
      break;
    }
    case ActionId.HoldFire: {
      result.staminaCost = 1;
      result.heldFire = true;
      result.moraleChanges.push({ amount: -5, reason: 'Holding fire — every nerve screams to shoot', source: 'action' });
      result.ncoApprovalChange = 3;
      result.log.push({ turn: state.turn, text: 'Holding fire.', type: 'action' });
      break;
    }

    // === ENDURE ACTIONS ===
    case ActionId.StandFirm: {
      result.staminaCost = 2;
      const { success: valorSuccess } = rollValor(player.valor, 10);
      if (valorSuccess) {
        result.moraleChanges.push({ amount: 3, reason: 'True courage — the act itself is defiance', source: 'action' });
        state.player.valor = clampStat(state.player.valor + 1);
      } else {
        result.moraleChanges.push({ amount: 1, reason: 'Standing, barely', source: 'action' });
      }
      result.ncoApprovalChange = 1;
      result.log.push({ turn: state.turn, text: 'Standing firm.', type: 'action' });
      break;
    }
    case ActionId.SteadyNeighbour: {
      result.staminaCost = 3;
      // Use charisma stat for the roll instead of valor
      const { success: charismaSuccess } = rollValor(player.charisma, -10);
      const target = line.rightNeighbour?.alive && !line.rightNeighbour.routing ? line.rightNeighbour : line.leftNeighbour;
      if (charismaSuccess) {
        result.neighbourMoraleBoost = 15;
        result.moraleChanges.push({ amount: -3, reason: 'Courage shared is courage spent', source: 'action' });
        result.ncoApprovalChange = 5;
        result.log.push({ turn: state.turn, text: `Steadied ${target?.name}.`, type: 'action' });
        state.player.valor = clampStat(state.player.valor + 2);
      } else {
        result.neighbourMoraleBoost = 5;
        result.moraleChanges.push({ amount: -5, reason: 'Words of comfort you don\'t believe yourself', source: 'action' });
        result.ncoApprovalChange = 2;
        result.log.push({ turn: state.turn, text: `Tried to steady ${target?.name}. Not enough.`, type: 'action' });
      }
      break;
    }
    case ActionId.Duck: {
      result.ducked = true;
      result.staminaCost = 1;
      const dc = player.duckCount;
      const selfPreservation = Math.max(0, 2 - dc);
      const shameCost = Math.min(dc * 2 + 1, 8);
      result.moraleChanges.push({ amount: selfPreservation, reason: 'Self-preservation', source: 'action' });
      result.moraleChanges.push({ amount: -shameCost, reason: 'Shame', source: 'action' });
      result.ncoApprovalChange = -6;
      state.player.valor = Math.max(0, state.player.valor - 1);

      if (line.ncoPresent) {
        result.log.push({ turn: state.turn, text: 'Ducked. Sergeant noticed.', type: 'result' });
      } else {
        result.log.push({ turn: state.turn, text: 'Ducked.', type: 'result' });
      }
      break;
    }
    case ActionId.Pray: {
      result.staminaCost = 0;
      const pc = player.prayerCount;
      const benefit = Math.max(0, 3 - pc);
      result.moraleChanges.push({ amount: benefit, reason: benefit > 0 ? 'A moment of faith' : 'The words are empty', source: 'action' });
      result.log.push({ turn: state.turn, text: benefit > 0 ? 'Praying.' : 'Prayers empty.', type: 'action' });
      break;
    }
    case ActionId.DrinkWater: {
      result.staminaCost = -15;
      result.moraleChanges.push({ amount: 3, reason: 'A human moment', source: 'recovery' });
      result.log.push({ turn: state.turn, text: 'Drank.', type: 'action' });
      break;
    }

    // === FUMBLE PATH ===
    case ActionId.GoThroughMotions: {
      result.staminaCost = 2;
      result.musketLoaded = false;
      result.moraleChanges.push({ amount: -2, reason: 'The shame of pretending', source: 'action' });
      result.log.push({ turn: state.turn, text: 'Empty musket raised.', type: 'action' });
      result.nextDrillStep = DrillStep.Fire;
      break;
    }
  }

  return result;
}

function getNextDrillStep(current: DrillStep, action: ActionId, loaded: boolean): DrillStep {
  if (action === ActionId.HoldFire) return DrillStep.Endure;
  if (action === ActionId.GoThroughMotions) return DrillStep.Fire;

  switch (current) {
    case DrillStep.Load: return DrillStep.Present;
    case DrillStep.Present: return DrillStep.Fire;
    case DrillStep.Fire: return DrillStep.Endure;
    case DrillStep.Endure:
      return loaded ? DrillStep.Present : DrillStep.Load;
  }
}
