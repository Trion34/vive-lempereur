import {
  BattleState, ChargeChoiceId, ChargeChoice, MoraleThreshold,
  LogEntry, MoraleChange, getMoraleThreshold,
} from '../types';
import { rollValor } from './morale';

// ============================================================
// CHARGE ENCOUNTER SYSTEM (Phase 2: 3 encounters)
// ============================================================

export interface ChargeEncounterResult {
  log: LogEntry[];
  moraleChanges: MoraleChange[];
  healthDelta: number;
  fatigueDelta: number;
  nextEncounter: number; // 0 = transition to melee
}

// ============================================================
// GET CURRENT ENCOUNTER (narrative + choices)
// ============================================================

export function getChargeEncounter(
  state: BattleState
): { narrative: string; choices: ChargeChoice[] } {
  const enc = state.chargeEncounter;

  if (enc === 1) return getEncounter1(state);
  if (enc === 2) {
    // Skip if JB already routed
    if (state.jbCrisisOutcome === 'worsened' || !state.line.rightNeighbour?.alive || state.line.rightNeighbour.routing) {
      // Will be skipped in battle.ts — but just in case
      return getEncounter3(state);
    }
    return getEncounter2(state);
  }
  if (enc === 3) return getEncounter3(state);

  return { narrative: '', choices: [] };
}

// ============================================================
// ENCOUNTER 1: PIERRE DIES
// ============================================================

function getEncounter1(state: BattleState): { narrative: string; choices: ChargeChoice[] } {
  const narrative = `The line surges forward. Bayonets levelled. Twenty paces becomes fifteen, becomes ten —

A volley rips from the white-coated line. Ragged, desperate, point-blank.

Pierre jerks beside you. His head snaps back. A ball has taken him through the eye.

He drops. No stumble, no stagger — just drops, like a puppet with cut strings. The veteran of Arcole. The man who checked his flint with steady hands while you shook. The anchor of your section.

Gone.

The charge doesn't stop. The charge never stops. But something inside you just broke.`;

  const mt = state.player.moraleThreshold;
  const choices: ChargeChoice[] = [
    {
      id: ChargeChoiceId.DontLookBack,
      label: "Don't look back",
      description: 'Iron will. He is gone. You are here. Keep moving. [Requires Steady]',
      available: mt === MoraleThreshold.Steady,
    },
    {
      id: ChargeChoiceId.KeepCharging,
      label: 'Keep charging',
      description: 'Process it later. Legs forward, steel forward. The drill carries you.',
      available: mt === MoraleThreshold.Steady || mt === MoraleThreshold.Shaken,
    },
    {
      id: ChargeChoiceId.ScreamHisName,
      label: 'Scream his name',
      description: 'Raw grief becomes raw fury. It will cost you — but the rage focuses everything.',
      available: true,
    },
    {
      id: ChargeChoiceId.Falter,
      label: 'Falter',
      description: 'Your legs almost stop. The world narrows. The line flows around you.',
      available: true,
    },
  ];

  return { narrative, choices };
}

// ============================================================
// ENCOUNTER 2: JEAN-BAPTISTE STUMBLES
// ============================================================

function getEncounter2(state: BattleState): { narrative: string; choices: ChargeChoice[] } {
  const jbName = state.line.rightNeighbour?.name || 'Jean-Baptiste';
  const steadied = state.jbCrisisOutcome === 'steadied';

  const narrative = steadied
    ? `${jbName} is running beside you — running, not charging, his bayonet wavering like a drunk's sword — when his boot catches a body. He goes down hard, face-first into the mud and blood.

The rear rank is right behind you. Three seconds and they'll trample him.

He looks up at you. The same look from the firing line. The same drowning man.`
    : `${jbName} — still here, somehow, barely — trips over a fallen man. He goes sprawling, musket flying from his hands.

The rear rank surges forward. They'll walk right over him. He's looking up, mud on his face, eyes wild.

He's not your responsibility. He never was.`;

  const mt = state.player.moraleThreshold;
  const choices: ChargeChoice[] = [
    {
      id: ChargeChoiceId.HaulHimUp,
      label: 'Haul him up',
      description: `Reach down mid-stride. Grab his collar. Haul. [Requires Shaken+, Fatigue >= 40. Reflex check.]`,
      available: (mt === MoraleThreshold.Steady || mt === MoraleThreshold.Shaken) && state.player.fatigue >= 40,
    },
    {
      id: ChargeChoiceId.ShoutAtHim,
      label: '"GET UP!"',
      description: 'A bark. Nothing more. He has to find his own feet.',
      available: true,
    },
    {
      id: ChargeChoiceId.LeaveHim,
      label: 'Leave him',
      description: 'The charge doesn\'t stop for one man. Keep moving.',
      available: true,
    },
  ];

  return { narrative, choices };
}

// ============================================================
// ENCOUNTER 3: THE FIRST ENEMY
// ============================================================

function getEncounter3(state: BattleState): { narrative: string; choices: ChargeChoice[] } {
  const narrative = `The lines crash together.

A white-coated Austrian materialises from the smoke — young, terrified, screaming. His socket blade comes around in a wild arc aimed at your head. Not trained. Not skilled. But a foot of iron doesn't need to be skilled.

Time slows. You have one heartbeat to decide.`;

  const mt = state.player.moraleThreshold;
  const choices: ChargeChoice[] = [
    {
      id: ChargeChoiceId.MeetHeadOn,
      label: 'Meet him head-on',
      description: 'Parry and thrust. Steel against steel. [Requires Shaken+. Valor check.]',
      available: mt === MoraleThreshold.Steady || mt === MoraleThreshold.Shaken,
    },
    {
      id: ChargeChoiceId.DodgeFallInLine,
      label: 'Dodge and fall in line',
      description: 'Duck under his swing, shoulder past. Someone behind you will finish him.',
      available: true,
    },
    {
      id: ChargeChoiceId.ButtStrikeCharge,
      label: 'Butt-strike',
      description: 'Smash him with the musket butt as you pass. [Requires Fatigue >= 50.]',
      available: state.player.fatigue >= 50,
    },
  ];

  return { narrative, choices };
}

// ============================================================
// RESOLVE CHARGE CHOICE
// ============================================================

export function resolveChargeChoice(
  state: BattleState, choiceId: ChargeChoiceId
): ChargeEncounterResult {
  const enc = state.chargeEncounter;

  if (enc === 1) return resolveEncounter1(state, choiceId);
  if (enc === 2) return resolveEncounter2(state, choiceId);
  if (enc === 3) return resolveEncounter3(state, choiceId);

  return { log: [], moraleChanges: [], healthDelta: 0, fatigueDelta: 0, nextEncounter: 0 };
}

// ============================================================
// ENCOUNTER 1 RESOLUTION
// ============================================================

function resolveEncounter1(state: BattleState, choiceId: ChargeChoiceId): ChargeEncounterResult {
  const turn = state.turn;
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];
  let healthDelta = 0;
  let fatigueDelta = 0;

  // Pierre dies (auto effects applied in battle.ts)
  // These are the choice-specific effects

  switch (choiceId) {
    case ChargeChoiceId.DontLookBack:
      log.push({
        turn, type: 'action',
        text: 'You don\'t look down. You don\'t look back. Pierre is dead and you are alive and the enemy is ten paces ahead and your steel is level and your legs are moving.\n\nThe sergeant sees you — the steadiest man in the section, still charging, still forward. He nods. Once. That nod is worth more than any medal.',
      });
      state.player.reputation += 5;
      state.player.ncoApproval = Math.min(100, state.player.ncoApproval + 4);
      state.player.valor += 3;
      break;

    case ChargeChoiceId.KeepCharging:
      log.push({
        turn, type: 'action',
        text: 'Your legs keep moving. The drill carries you. Left-right-left-right. The point stays level. Pierre is dead and you can\'t think about that now, can\'t think about anything except the man in front of you and the man behind you and seventeen inches of cold iron that are your whole world.\n\nLater. You\'ll feel it later.',
      });
      moraleChanges.push({ amount: -2, reason: 'Grief held back — for now', source: 'action' });
      state.player.reputation += 2;
      state.player.ncoApproval = Math.min(100, state.player.ncoApproval + 3);
      state.player.valor += 1;
      break;

    case ChargeChoiceId.ScreamHisName:
      log.push({
        turn, type: 'action',
        text: '"PIERRE!" The scream tears out of you — raw, animal, nothing human about it. The grief becomes fury. The fury becomes momentum. You are screaming and running and the steel is a part of your arm and you will kill every man in front of you.\n\nThe men around you hear it. Some draw strength from it. Others look away.',
      });
      moraleChanges.push({ amount: -5, reason: 'Raw grief', source: 'action' });
      fatigueDelta = 5;
      // Rage gives temporary valor boost for remaining encounters
      state.player.valor += 2;
      break;

    case ChargeChoiceId.Falter:
      log.push({
        turn, type: 'action',
        text: 'Your legs stop. Just for a moment. A heartbeat. But in a charge, a heartbeat is an eternity.\n\nThe line flows around you like water around a stone. Men shove past. Someone curses. The rear rank nearly knocks you flat.\n\nThen your legs start again. Not because of courage. Because the alternative is being alone on this field.',
      });
      moraleChanges.push({ amount: -8, reason: 'Pierre is dead — you nearly broke', source: 'action' });
      fatigueDelta = -10;
      state.player.ncoApproval = Math.max(0, state.player.ncoApproval - 5);
      state.player.valor = Math.max(0, state.player.valor - 2);
      break;
  }

  // Determine next encounter
  let nextEncounter = 2;
  // Skip encounter 2 if JB already gone
  if (state.jbCrisisOutcome === 'worsened' || !state.line.rightNeighbour?.alive || state.line.rightNeighbour.routing) {
    nextEncounter = 3;
  }

  return { log, moraleChanges, healthDelta, fatigueDelta, nextEncounter };
}

// ============================================================
// ENCOUNTER 2 RESOLUTION
// ============================================================

function resolveEncounter2(state: BattleState, choiceId: ChargeChoiceId): ChargeEncounterResult {
  const turn = state.turn;
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];
  let healthDelta = 0;
  let fatigueDelta = 0;

  switch (choiceId) {
    case ChargeChoiceId.HaulHimUp: {
      const valorMod = Math.floor(state.player.fatigue / 10) - 5;
      const { success } = rollValor(state.player.valor, valorMod);

      if (success) {
        log.push({
          turn, type: 'action',
          text: 'You don\'t break stride. Your hand shoots down, grabs his collar, and hauls. One fluid motion — pull, plant, push. Like dragging a sheep from a ditch.\n\nJean-Baptiste is on his feet. Stumbling, but moving. His eyes find yours — the same look as the firing line. Gratitude. Disbelief. Something else. Trust, maybe.\n\n"Stay with me," you say. And this time, he does.',
        });
        moraleChanges.push({ amount: 5, reason: 'You saved Jean-Baptiste — again', source: 'action' });
        state.player.reputation += 3;
        state.player.ncoApproval = Math.min(100, state.player.ncoApproval + 5);
        state.player.valor += 2;
      } else {
        log.push({
          turn, type: 'action',
          text: 'You reach down — but your foot catches the same body. You stumble, nearly go down yourself. Your hand finds Jean-Baptiste\'s collar but you\'re off-balance, pulling him sideways instead of up.\n\nThe rear rank shoves you both forward. Jean-Baptiste scrambles to his feet, wild-eyed. You recover your footing. Neither of you fell.\n\nBut it wasn\'t clean. It wasn\'t steady. Your body is starting to fail you.',
        });
        moraleChanges.push({ amount: -3, reason: 'Stumbled trying to help', source: 'action' });
        fatigueDelta = -15;
      }
      break;
    }

    case ChargeChoiceId.ShoutAtHim:
      log.push({
        turn, type: 'action',
        text: '"GET UP!" The words come out hard and sharp, a sergeant\'s voice you didn\'t know you had.\n\nJean-Baptiste scrambles. Hands and knees in the mud, then up, then running. Not because of you — because of the boots coming up behind him. But he\'s up.\n\nHe finds his musket. Falls in beside you. His face is a mask of mud and terror. But he\'s moving.',
      });
      // No stat changes — neutral choice
      break;

    case ChargeChoiceId.LeaveHim:
      log.push({
        turn, type: 'action',
        text: 'You keep running. The charge doesn\'t stop for one man. It doesn\'t stop for anyone.\n\nBehind you, you hear a cry — cut short. The rear rank doesn\'t slow down. They can\'t. Jean-Baptiste is beneath their boots, beneath the charge, beneath everything.\n\nYou don\'t look back. There\'s nothing to look back for.',
      });
      moraleChanges.push({ amount: -3, reason: 'You left him', source: 'action' });
      state.player.reputation -= 3;
      if (state.line.rightNeighbour) {
        state.line.rightNeighbour.alive = false;
      }
      break;
  }

  return { log, moraleChanges, healthDelta, fatigueDelta, nextEncounter: 3 };
}

// ============================================================
// ENCOUNTER 3 RESOLUTION
// ============================================================

function resolveEncounter3(state: BattleState, choiceId: ChargeChoiceId): ChargeEncounterResult {
  const turn = state.turn;
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];
  let healthDelta = 0;
  let fatigueDelta = 0;

  switch (choiceId) {
    case ChargeChoiceId.MeetHeadOn: {
      const { success } = rollValor(state.player.valor + (0), 10);

      if (success) {
        log.push({
          turn, type: 'action',
          text: 'You catch his bayonet on yours — steel screams against steel — and drive it aside. In the same motion your own point finds his chest. The thrust is textbook. Clean. Terrible.\n\nHe looks at you with an expression you will never forget. Surprise. Not pain — not yet. Just surprise that this is how it ends.\n\nHe falls. Your first. The bayonet pulls free with a sound you will hear in your dreams.\n\nYou step over him and keep charging.',
        });
        moraleChanges.push({ amount: 6, reason: 'First kill — you are still alive', source: 'action' });
        fatigueDelta = -8;
        state.player.valor += 3;
      } else {
        log.push({
          turn, type: 'action',
          text: 'You bring your bayonet up to meet his — too slow. His point catches your arm, a line of fire from elbow to wrist. You cry out, twist away, shove past him with your shoulder.\n\nSomeone behind you finishes him. You hear the thud. Your arm is bleeding freely but the hand still works. It still works.\n\nKeep moving. Keep moving.',
        });
        healthDelta = -15;
        moraleChanges.push({ amount: -2, reason: 'Wounded in the first clash', source: 'action' });
        fatigueDelta = -10;
      }
      break;
    }

    case ChargeChoiceId.DodgeFallInLine:
      log.push({
        turn, type: 'action',
        text: 'You duck. His bayonet whistles over your head — close enough to feel the wind. You shoulder into him as you pass, feel him stagger, and you\'re through.\n\nBehind you, the second rank deals with him. You hear a grunt, a clatter, then nothing. Not your problem.\n\nYou fall in with the front of the charge, bayonet level, heart hammering. The melee is ahead.',
      });
      // No stat changes — safe choice
      break;

    case ChargeChoiceId.ButtStrikeCharge: {
      const fatiguePass = state.player.fatigue >= 60;
      const success = fatiguePass || rollValor(state.player.valor, 0).success;

      if (success) {
        log.push({
          turn, type: 'action',
          text: 'You reverse the musket — one fluid motion, brass butt-plate swinging around like a hammer. It catches him square in the jaw. The crunch is felt more than heard.\n\nHe goes down. Doesn\'t get up.\n\nYour arms ring with the impact. But you\'re through, you\'re past him, and the melee is opening up ahead.',
        });
        moraleChanges.push({ amount: 4, reason: 'Brutal efficiency', source: 'action' });
        fatigueDelta = -12;
        state.player.valor += 1;
      } else {
        log.push({
          turn, type: 'action',
          text: 'You swing the musket butt — but your arms are lead. Too slow. The brass glances off his shoulder, barely a graze. His bayonet comes around and opens a cut across your side.\n\nYou stagger past. Someone else takes him down. The cut burns — shallow but long. Blood soaks into your coat.\n\nYou\'re through. Barely.',
        });
        healthDelta = -10;
        fatigueDelta = -15;
      }
      break;
    }
  }

  return { log, moraleChanges, healthDelta, fatigueDelta, nextEncounter: 0 }; // 0 = melee
}
