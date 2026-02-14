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

export interface ActionResult {
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
        const aimSuccessTexts: Record<number, string> = {
          1: 'You pick your man through the smoke at a hundred and twenty paces. Breathe. Steady. The barrel settles. At this range it\'s more hope than aim — but you\'re steadier than most.',
          2: 'Eighty paces. You can see him clearly now — a man, a face, a life. Your hands find their calm. The barrel drops to his centre mass. Breathe. Hold. Ready.',
          3: 'Fifty paces. You can see the whites of his eyes. Your hands are stone. The barrel finds his chest and stays there. At this range, you will not miss.',
          4: 'Twenty-five paces. You can see the fear on his face — the same fear on yours. Your hands steady through sheer will. The barrel drops to his centre mass. Point blank. He is already dead.',
        };
        result.log.push({ turn: state.turn, text: aimSuccessTexts[state.scriptedVolley] || 'You pick your man through the smoke. Breathe. Steady.', type: 'action' });
        result.ncoApprovalChange = 2;
        state.player.valor = clampStat(state.player.valor + 1);
      } else {
        result.moraleChanges.push({ amount: -2, reason: 'Hands shaking too much to aim true', source: 'action' });
        const aimFailTexts: Record<number, string> = {
          1: 'You try to steady on a target, but at this range the smoke is too thick. Your arms tremble. You settle for roughly in their direction.',
          2: 'You try to aim, but the adrenaline has your hands shaking. The barrel wanders. At eighty paces, close enough to matter.',
          3: 'You try to aim — you can see their faces now — but your hands won\'t obey. The horror of what you\'re doing breaks your concentration.',
          4: 'You try to pick a man — he\'s right there, close enough to touch — but your whole body is shaking. The barrel wavers. You can see his eyes.',
        };
        const aimText = aimFailTexts[state.scriptedVolley] || 'You try to aim, but your hands won\'t obey. The barrel wanders.';
        result.log.push({ turn: state.turn, text: aimText, type: 'action' });
      }
      break;
    }
    case ActionId.PresentArms: {
      result.staminaCost = 3;
      result.log.push({ turn: state.turn, text: 'Musket to shoulder. The wood is warm against your cheek. Ready.', type: 'action' });
      break;
    }

    // === FIRE ACTIONS ===
    case ActionId.Fire: {
      result.staminaCost = 2;
      result.musketLoaded = false;
      result.heldFire = false;
      const accuracy = 0.25 + (player.experience / 300) + heldBonus;
      const rangeMod = Math.max(0, 1 - enemy.range / 400);
      const hit = roll < accuracy * rangeMod;

      if (hit) {
        result.enemyDamage = player.heldFire ? 5 : 2.5;
        if (heldBonus > 0) {
          result.log.push({ turn: state.turn, text: 'You release the held volley. Through the smoke, their line visibly buckles. That one counted.', type: 'result' });
          result.moraleChanges.push({ amount: 4, reason: 'Held volley struck home', source: 'action' });
        } else {
          result.log.push({ turn: state.turn, text: 'You fire with the volley. Through the smoke, you think you see a man fall.', type: 'result' });
          result.moraleChanges.push({ amount: 2, reason: 'Doing your duty', source: 'action' });
        }
      } else {
        result.log.push({ turn: state.turn, text: 'You fire. The volley crashes out. The smoke hides whether any of it mattered.', type: 'result' });
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
        result.log.push({ turn: state.turn, text: 'You jerk the trigger. Against all odds, someone falls.', type: 'result' });
      } else {
        result.log.push({ turn: state.turn, text: 'You yank the trigger. The ball flies wide. The sergeant glares.', type: 'result' });
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
      result.log.push({ turn: state.turn, text: 'The order comes. You do not fire. Your musket stays raised. The men beside you empty theirs. You wait.', type: 'action' });
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
      const firmTexts = [
        'You stand. The smoke rolls over you. You breathe, and you stand.',
        'Another volley crashes in. You flinch — everyone flinches — but your feet stay planted.',
        'The noise is indescribable. But you are here. You are still here.',
        'You endure. There is no other word for it. You simply endure.',
      ];
      result.log.push({ turn: state.turn, text: firmTexts[Math.floor(Math.random() * firmTexts.length)], type: 'action' });
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
        result.log.push({ turn: state.turn, text: `You grip ${target?.name}'s shoulder. "Steady, lad." Something in your voice reaches him. He steadies.`, type: 'action' });
        state.player.valor = clampStat(state.player.valor + 2);
      } else {
        result.neighbourMoraleBoost = 5;
        result.moraleChanges.push({ amount: -5, reason: 'Words of comfort you don\'t believe yourself', source: 'action' });
        result.ncoApprovalChange = 2;
        result.log.push({ turn: state.turn, text: `You grip ${target?.name}'s shoulder. "Steady." Your voice cracks. He nods, but his eyes are wild.`, type: 'action' });
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
        const texts = [
          '"GET UP, you bloody coward!" The sergeant\'s boot finds your ribs.',
          '"I see you, soldier. I see you." Duval\'s voice is quiet. Worse than shouting.',
          '"One more time and I\'ll put you in front of a firing squad." He means it.',
          '"Stay down then. Stay down and be nothing." Total contempt.',
        ];
        result.log.push({ turn: state.turn, text: texts[Math.min(dc, texts.length - 1)], type: 'result' });
      } else {
        result.log.push({ turn: state.turn, text: 'You drop as the volley crashes overhead. You\'re alive. For now.', type: 'result' });
      }
      break;
    }
    case ActionId.Pray: {
      result.staminaCost = 0;
      const pc = player.prayerCount;
      const benefit = Math.max(0, 3 - pc);
      result.moraleChanges.push({ amount: benefit, reason: benefit > 0 ? 'A moment of faith' : 'The words are empty', source: 'action' });
      const pools = [
        ['"Our Father, who art in heaven..." The words are automatic. They help.', 'You clutch the cross under your shirt. Your mother gave it to you.'],
        ['The prayer comes harder this time. The words stumble over the guns.', '"...deliver us from evil..." You\'re not sure you believe it.'],
        ['God feels very far away from this field.', 'You try to pray but the words scatter like starlings.'],
        ['Your lips move but nothing comes. The prayers have dried up.'],
      ];
      const pool = pools[Math.min(pc, pools.length - 1)];
      result.log.push({ turn: state.turn, text: pool[Math.floor(Math.random() * pool.length)], type: 'action' });
      break;
    }
    case ActionId.DrinkWater: {
      result.staminaCost = -15;
      result.moraleChanges.push({ amount: 3, reason: 'A human moment', source: 'recovery' });
      const texts = [
        'The water is warm and tastes of tin. It is the finest thing you have ever drunk.',
        'Another mouthful. The canteen feels lighter.',
        'The last of the water. A trickle. You savour it.',
      ];
      result.log.push({ turn: state.turn, text: texts[Math.min(player.canteenUses, texts.length - 1)], type: 'action' });
      break;
    }

    // === FUMBLE PATH ===
    case ActionId.GoThroughMotions: {
      result.staminaCost = 2;
      result.musketLoaded = false;
      result.moraleChanges.push({ amount: -2, reason: 'The shame of pretending', source: 'action' });
      result.log.push({ turn: state.turn, text: 'You raise the empty musket to your shoulder. The weight is the same. The lie feels heavier.', type: 'action' });
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
