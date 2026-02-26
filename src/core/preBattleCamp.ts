import {
  CampActivityId,
  CampActivity,
  CampActivityResult,
  CampLogEntry,
  CampState,
  CampEvent,
  CampEventResult,
  PlayerCharacter,
  NPC,
  ExerciseSubActivity,
  ArmsTrainingSubActivity,
  RestSubActivity,
  DutySubActivity,
} from '../types';
import { rollStat, displayRoll, displayTarget, Difficulty, getPlayerStat } from './stats';
import {
  resolveExercise,
  resolveArmsTraining,
  resolveRest,
  statResultText,
} from './campActivities';
import { resolvePasseDix, PasseDixStake, PasseDixBet } from './passeDix';
import {
  getBriefingEvent as getBriefingEventData,
  getBonaparteEvent as getBonaparteEventData,
  getCampfiresEvent as getCampfiresEventData,
  FORAGE_SUCCESS,
  FORAGE_FAIL,
  SOCIALIZE_NARRATIVES,
} from '../data/campEvents';

// === PRE-BATTLE ACTIVITIES ===

export function getPreBattleActivities(player: PlayerCharacter, camp: CampState): CampActivity[] {
  return [
    {
      id: CampActivityId.Rest,
      name: 'Rest',
      description: 'Rest your body and mind.',
      staminaCost: 0,
      available: true,
      requiresTarget: true,
    },
    {
      id: CampActivityId.Exercise,
      name: 'Exercise',
      description: 'Physical training.',
      staminaCost: 10,
      available: true,
      requiresTarget: true,
    },
    {
      id: CampActivityId.ArmsTraining,
      name: 'Arms Training',
      description: 'Hone your combat skills.',
      staminaCost: 10,
      available: true,
      requiresTarget: true,
    },
    {
      id: CampActivityId.Duties,
      name: 'Duties',
      description: 'Drill, scout, or volunteer.',
      staminaCost: 10,
      available: true,
    },
    {
      id: CampActivityId.Socialize,
      name: 'Socialize',
      description: 'Sit with a comrade by the fire.',
      staminaCost: 5,
      available: true,
      requiresTarget: true,
    },
  ];
}

export function resolvePreBattleActivity(
  activityId: CampActivityId,
  player: PlayerCharacter,
  npcs: NPC[],
  camp: CampState,
  targetNpcId?: string,
): CampActivityResult {
  switch (activityId) {
    case CampActivityId.Rest:
      return resolveRest(player, camp, targetNpcId as RestSubActivity | undefined);
    case CampActivityId.MaintainEquipment:
      return resolveCheckEquipment(player, camp);
    case CampActivityId.Duties:
      return resolveDuty(player, camp, targetNpcId as DutySubActivity | undefined);
    case CampActivityId.Socialize:
      return resolveSocialize(player, npcs, camp, targetNpcId);
    case CampActivityId.WriteLetters:
      return resolveWriteLetter(player, camp);
    case CampActivityId.Exercise:
      return resolveExercise(player, camp, targetNpcId as ExerciseSubActivity | undefined);
    case CampActivityId.ArmsTraining:
      return resolveArmsTraining(player, camp, targetNpcId as ArmsTrainingSubActivity | undefined);
    case CampActivityId.Gamble: {
      // targetNpcId encodes "stake:bet" (e.g. "medium:passe")
      const [stake, bet] = (targetNpcId || 'medium:passe').split(':') as [PasseDixStake, PasseDixBet];
      return resolvePasseDix(player, camp, stake, bet);
    }
    default:
      return { log: [], statChanges: {}, staminaChange: 0, moraleChange: 0 };
  }
}

function resolveCheckEquipment(player: PlayerCharacter, camp: CampState): CampActivityResult {
  const log: CampLogEntry[] = [];
  const check = rollStat(player.musketry, 0, Difficulty.Standard);

  if (check.success) {
    log.push({
      day: camp.day,
      type: 'activity',
      text: 'Strip. Clean. Oil. Sharpen. The Charleville gleams. So do you.',
    });
    log.push({ day: camp.day, type: 'result', text: 'Equipment ready. Morale +2' });
  } else {
    log.push({
      day: camp.day,
      type: 'activity',
      text: 'The lock spring is weak. The uniform is beyond patching. Adequate. Not good.',
    });
    log.push({ day: camp.day, type: 'result', text: 'Adequate. Nothing more.' });
  }

  return {
    log,
    statChanges: {},
    staminaChange: -10,
    moraleChange: check.success ? 2 : 0,
  };
}

function resolveDuty(
  player: PlayerCharacter,
  camp: CampState,
  sub?: DutySubActivity,
): CampActivityResult {
  if (sub === 'volunteer') return resolveVolunteer(player, camp);
  if (sub === 'check_equipment') return resolveCheckEquipment(player, camp);
  return resolveForage(player, camp);
}

// Forage narrative arrays imported from data/campEvents

function resolveForage(player: PlayerCharacter, camp: CampState): CampActivityResult {
  const log: CampLogEntry[] = [];
  const check = rollStat(player.awareness, 0, Difficulty.Standard);

  if (check.success) {
    log.push({
      day: camp.day,
      type: 'activity',
      text: FORAGE_SUCCESS[Math.floor(Math.random() * FORAGE_SUCCESS.length)],
    });
    log.push({
      day: camp.day,
      type: 'result',
      text: 'You brought something back. The lads remember who fed them.',
    });
  } else {
    log.push({
      day: camp.day,
      type: 'activity',
      text: FORAGE_FAIL[Math.floor(Math.random() * FORAGE_FAIL.length)],
    });
    log.push({ day: camp.day, type: 'result', text: 'Nothing to show for it. At least you went.' });
  }

  return {
    log,
    statChanges: check.success ? { soldierRep: 3 } : { soldierRep: 1 },
    staminaChange: -10,
    healthChange: check.success ? 5 : 0,
    moraleChange: check.success ? 2 : -1,
  };
}

function resolveSocialize(
  player: PlayerCharacter,
  npcs: NPC[],
  camp: CampState,
  targetNpcId?: string,
): CampActivityResult {
  const log: CampLogEntry[] = [];
  const npc = npcs.find((n) => n.id === targetNpcId);
  const target = npc?.alive ? npc : undefined;

  if (!target) {
    const text =
      npc && !npc.alive
        ? `${npc.name} is gone. You sit by the fire and stare at the empty place where he used to sit.`
        : 'You sit by the fire alone. No one to talk to tonight.';
    log.push({ day: camp.day, type: 'activity', text });
    return { log, statChanges: {}, staminaChange: -5, moraleChange: -1 };
  }

  const check = rollStat(player.charisma, 0, Difficulty.Standard);

  if (check.success) {
    const narrative =
      SOCIALIZE_NARRATIVES[target.id] ||
      `You share a quiet evening with ${target.name}. The bond between soldiers grows.`;
    log.push({ day: camp.day, type: 'activity', text: narrative });
    return {
      log,
      statChanges: {},
      staminaChange: -5,
      moraleChange: 3,
      npcChanges: [{ npcId: target.id, relationship: 8 }],
    };
  } else {
    log.push({
      day: camp.day,
      type: 'activity',
      text: `You try to strike up conversation with ${target.name}, but the words come out wrong. An awkward silence. You excuse yourself.`,
    });
    return {
      log,
      statChanges: {},
      staminaChange: -5,
      moraleChange: 0,
      npcChanges: [{ npcId: target.id, relationship: -2 }],
    };
  }
}

function resolveVolunteer(player: PlayerCharacter, camp: CampState): CampActivityResult {
  const log: CampLogEntry[] = [];

  // Army assigns you a random task
  const tasks = ['sentry', 'scout', 'dispatches', 'dig'] as const;
  const task = tasks[Math.floor(Math.random() * tasks.length)];

  switch (task) {
    case 'sentry': {
      const check = rollStat(player.awareness, 0, Difficulty.Standard);
      if (check.success) {
        log.push({
          day: camp.day,
          type: 'activity',
          text: 'You draw sentry duty on the perimeter.',
        });
        log.push({
          day: camp.day,
          type: 'result',
          text: 'SENTRY DUTY — The cold is brutal, but you keep your eyes open. Every shadow could be Austrian scouts. Hours pass. Your vigilance is noted by the returning patrol corporal. You made a good impression.\n\nAwareness check: PASSED\nOfficer Rep +3',
        });
        return { log, statChanges: { officerRep: 3 }, staminaChange: -12, moraleChange: 0 };
      } else {
        log.push({
          day: camp.day,
          type: 'activity',
          text: 'You draw sentry duty on the perimeter.',
        });
        log.push({
          day: camp.day,
          type: 'result',
          text: 'SENTRY DUTY — The cold seeps through your coat. Your eyes grow heavy. You jerk awake at a sound — nothing. Or was it? The corporal finds you shivering, half conscious. He says nothing. His look says enough. You made a bad impression.\n\nAwareness check: FAILED\nOfficer Rep -2 | Morale -2',
        });
        return { log, statChanges: { officerRep: -2 }, staminaChange: -12, moraleChange: -2 };
      }
    }
    case 'scout': {
      const check = rollStat(player.awareness, 0, Difficulty.Standard);
      if (check.success) {
        log.push({
          day: camp.day,
          type: 'activity',
          text: 'A corporal picks you for a patrol of the plateau.',
        });
        log.push({
          day: camp.day,
          type: 'result',
          text: 'SCOUT THE GROUND — Stone walls. Ravines. Frozen vineyards. You map it in your mind — reporting your findings to the corporal with meticulous detail. He nods at your observations. You made a good impression.\n\nAwareness check: PASSED\nOfficer Rep +2 | Morale +1',
        });
        return { log, statChanges: { officerRep: 2 }, staminaChange: -10, moraleChange: 1 };
      } else {
        log.push({
          day: camp.day,
          type: 'activity',
          text: 'A corporal picks you for a patrol of the plateau.',
        });
        log.push({
          day: camp.day,
          type: 'result',
          text: "SCOUT THE GROUND — The darkness and cold defeat you. Every ravine looks the same. You stumble back to camp with nothing useful to report. The corporal's disdain is evident. You made a bad impression.\n\nAwareness check: FAILED\nOfficer Rep -1 | Morale -1",
        });
        return { log, statChanges: { officerRep: -1 }, staminaChange: -10, moraleChange: -1 };
      }
    }
    case 'dispatches': {
      const check = rollStat(player.endurance, 0, Difficulty.Standard);
      if (check.success) {
        log.push({
          day: camp.day,
          type: 'activity',
          text: "You're sent running dispatches between officer positions.",
        });
        log.push({
          day: camp.day,
          type: 'result',
          text: 'CARRY DISPATCHES — Across the frozen plateau in the dark, following paths you can barely see. But you find each position, deliver each message, and return. The lieutenant acknowledges you with a cool nod. You made a good impression.\n\nEndurance check: PASSED\nOfficer Rep +2',
        });
        return { log, statChanges: { officerRep: 2 }, staminaChange: -15, moraleChange: 0 };
      } else {
        log.push({
          day: camp.day,
          type: 'activity',
          text: "You're sent running dispatches between officer positions.",
        });
        log.push({
          day: camp.day,
          type: 'result',
          text: 'CARRY DISPATCHES — The plateau is dark and confusing. You take a wrong turn, double back, arrive late. The officer snatches the dispatch without a word. You made a bad impression.\n\nEndurance check: FAILED\nOfficer Rep -1 | Morale -1',
        });
        return { log, statChanges: { officerRep: -1 }, staminaChange: -15, moraleChange: -1 };
      }
    }
    case 'dig': {
      const check = rollStat(player.strength, 0, Difficulty.Standard);
      if (check.success) {
        log.push({ day: camp.day, type: 'activity', text: "You're put on entrenchment detail." });
        log.push({
          day: camp.day,
          type: 'result',
          text: 'DIG POSITIONS — Piling stones, digging shallow trenches in the frozen earth. Your hands crack and bleed. Your hard work makes a real difference. You made a good impression.\n\nStrength check: PASSED\nOfficer Rep +1 | Soldier Rep +1',
        });
        return {
          log,
          statChanges: { officerRep: 1, soldierRep: 1 },
          staminaChange: -18,
          moraleChange: 0,
        };
      } else {
        log.push({ day: camp.day, type: 'activity', text: "You're put on entrenchment detail." });
        log.push({
          day: camp.day,
          type: 'result',
          text: 'DIG POSITIONS — The ground is frozen iron. Your tools bounce off it. Hours of labor for inches of trench. The sergeant looks at the result and says, "That wouldn\'t stop a goat." You made a bad impression.\n\nStrength check: FAILED\nSoldier Rep -1 | Morale -1',
        });
        return { log, statChanges: { soldierRep: -1 }, staminaChange: -18, moraleChange: -1 };
      }
    }
  }
}

function resolveWriteLetter(player: PlayerCharacter, camp: CampState): CampActivityResult {
  const log: CampLogEntry[] = [];
  const check = rollStat(player.intelligence, 0, Difficulty.Standard);

  if (check.success) {
    log.push({
      day: camp.day,
      type: 'activity',
      text: 'You write by the light of the fire, the quill scratching against paper balanced on your knee. You do not write about tomorrow. You write about the mountains, the stars, the taste of the bread they gave you in Verona. You write that you are well. You fold the letter carefully and give it to the courier. If the worst happens, these words will outlast you.',
    });
    log.push({
      day: camp.day,
      type: 'result',
      text: 'A good letter. The men respect a man of letters.',
    });
    return {
      log,
      statChanges: { soldierRep: 2 },
      staminaChange: -5,
      moraleChange: 5,
    };
  } else {
    log.push({
      day: camp.day,
      type: 'activity',
      text: 'You try to write but the words will not come. What do you say to someone who cannot imagine this place? The cold, the waiting, the knowledge of what dawn brings? You write three lines, cross out two, and seal the letter half-empty. It is something. It is not enough.',
    });
    return {
      log,
      statChanges: {},
      staminaChange: -5,
      moraleChange: 2,
    };
  }
}

// === PRE-BATTLE EVENTS ===

// Forced events — delegates to data layer
export const getBonaparteEvent = getBonaparteEventData;

export function resolvePreBattleEventChoice(
  event: CampEvent,
  choiceId: string,
  player: PlayerCharacter,
  npcs: NPC[],
  day: number = 1,
): CampEventResult {
  const choice = event.choices.find((c) => c.id === choiceId);
  if (!choice) {
    return { log: [], statChanges: {}, moraleChange: 0 };
  }

  event.resolved = true;

  let checkPassed = true;
  let rollData: { stat: string; roll: number; target: number; passed: boolean } | undefined;
  if (choice.statCheck) {
    const statVal = getPlayerStat(player, choice.statCheck.stat) || 30;
    const result = rollStat(statVal, 0, choice.statCheck.difficulty);
    checkPassed = result.success;
    rollData = {
      stat: choice.statCheck.stat.charAt(0).toUpperCase() + choice.statCheck.stat.slice(1),
      roll: displayRoll(result.roll),
      target: displayTarget(result.target),
      passed: result.success,
    };
  }

  const outcome = resolvePreBattleOutcome(event.id, choiceId, checkPassed, player, npcs, day);
  if (rollData) outcome.rollDisplay = rollData;
  return outcome;
}

function resolvePreBattleOutcome(
  eventId: string,
  choiceId: string,
  checkPassed: boolean,
  player: PlayerCharacter,
  npcs: NPC[],
  day: number,
): CampEventResult {
  const log: CampLogEntry[] = [];
  const statChanges: Partial<Record<string, number>> = {};
  let moraleChange = 0;
  let staminaChange = 0;
  const npcChanges: { npcId: string; relationship: number }[] = [];

  switch (eventId) {
    case 'prebattle_bonaparte':
      if (checkPassed) {
        log.push({
          day,
          type: 'result',
          text: "You stand straight. Musket grounded. Eyes forward. Bonaparte's gaze sweeps over you. You stood like a soldier when the general rode past. The men around you noticed.",
        });
        moraleChange = 3;
        statChanges.soldierRep = 1;
        statChanges.napoleonRep = 2;
      } else {
        log.push({
          day,
          type: 'result',
          text: 'You keep a low profile. The general passes. But something nags \u2014 a missed moment, a chance to be seen. If only you had more courage.',
        });
        moraleChange = 0;
      }
      break;

    case 'prebattle_campfires':
      if (choiceId === 'steady_men') {
        if (checkPassed) {
          log.push({
            day,
            type: 'result',
            text: '"Fires," you say, loud enough for the men nearby. "That\'s all they are. Fires. And tomorrow we\'ll put them out." A few men laugh \u2014 short, nervous laughs. But the tension breaks, just a little. Enough.',
          });
          moraleChange = 3;
          statChanges.soldierRep = 2;
        } else {
          log.push({
            day,
            type: 'result',
            text: '"They\'re just campfires," you say, but your voice comes out thin. No one laughs. A few men glance at you and look away. The fires keep burning.',
          });
          moraleChange = -1;
        }
      } else {
        if (checkPassed) {
          log.push({
            day,
            type: 'result',
            text: 'You study the fires carefully, tracing their spread across the ridgeline. Five distinct clusters. Five columns, approaching from different directions. You report it to the sergeant. "Good eyes," Duval says. Information that might matter tomorrow.',
          });
          moraleChange = 3;
          statChanges.officerRep = 3;
        } else {
          log.push({
            day,
            type: 'result',
            text: 'You try to count the fires but they blur together into a single carpet of light. Three columns? Five? Twenty? The darkness gives no answers. You stare until your eyes ache.',
          });
          moraleChange = -2;
        }
      }
      break;

    case 'prebattle_pierre_story':
      if (choiceId === 'listen') {
        log.push({
          day,
          type: 'result',
          text: 'You sit beside him. Minutes pass. The fire shifts. Finally: "At Arcole, I watched my brother die on the bridge. Bayonet through the chest. Took him two hours." He says nothing else. Neither do you. But when you leave, he puts a hand on your shoulder. Brief. Heavy.',
        });
        moraleChange = 2;
        const pierre = npcs.find((n) => n.id === 'pierre');
        if (pierre) npcChanges.push({ npcId: 'pierre', relationship: 6 });
      } else {
        if (checkPassed) {
          log.push({
            day,
            type: 'result',
            text: '"Tell me about Arcole," you say. Pierre is quiet for a long time. Then he talks \u2014 not the version the officers tell, but the real one. The confusion, the fear, the bridge that kept filling with dead. "We held," he says at the end. "That\'s what matters." His voice is steady. Yours is steadier for hearing it.',
          });
          moraleChange = 3;
          statChanges.valor = 1;
          const pierre = npcs.find((n) => n.id === 'pierre');
          if (pierre) npcChanges.push({ npcId: 'pierre', relationship: 8 });
        } else {
          log.push({
            day,
            type: 'result',
            text: '"Tell me about\u2014" Pierre cuts you off with a look. "No." The silence afterward is heavier than the darkness. You leave him to his fire and his ghosts.',
          });
          moraleChange = -1;
          const pierre = npcs.find((n) => n.id === 'pierre');
          if (pierre) npcChanges.push({ npcId: 'pierre', relationship: -3 });
        }
      }
      break;

    case 'prebattle_rations':
      if (choiceId === 'accept') {
        log.push({
          day,
          type: 'result',
          text: 'You eat your share slowly, making each bite last. The bread is hard. The cheese is harder. But it is fuel, and tomorrow you will burn through all of it. A soldier eats what he is given and is grateful.',
        });
        moraleChange = 0;
      } else {
        if (checkPassed) {
          log.push({
            day,
            type: 'result',
            text: 'You break your bread in half and push it across to Jean-Baptiste. He stares at it, then at you. "I can\'t\u2014" "Eat it." He eats. Your stomach aches through the night, but your constitution holds. The boy won\'t forget.',
          });
          moraleChange = 2;
          statChanges.soldierRep = 2;
          const jb = npcs.find((n) => n.id === 'jean-baptiste');
          if (jb) npcChanges.push({ npcId: 'jean-baptiste', relationship: 8 });
        } else {
          log.push({
            day,
            type: 'result',
            text: 'You give half your bread to Jean-Baptiste. He takes it gratefully. Your stomach protests through the night. By dawn you are light-headed and weak. Generosity and wisdom are not always the same thing.',
          });
          moraleChange = -1;
          staminaChange = -5;
          const jb = npcs.find((n) => n.id === 'jean-baptiste');
          if (jb) npcChanges.push({ npcId: 'jean-baptiste', relationship: 6 });
        }
      }
      break;

    case 'prebattle_jb_fear':
      if (choiceId === 'reassure') {
        if (checkPassed) {
          log.push({
            day,
            type: 'result',
            text: '"You can. You will. Stay beside me tomorrow and do what I do." Your voice is steadier than you feel. Jean-Baptiste looks at you. The shaking slows. Stops. "Beside you," he repeats. "I can do that." He believes you. Now you have to be worthy of that belief.',
          });
          moraleChange = 3;
          const jb = npcs.find((n) => n.id === 'jean-baptiste');
          if (jb) npcChanges.push({ npcId: 'jean-baptiste', relationship: 10 });
        } else {
          log.push({
            day,
            type: 'result',
            text: 'You try to reassure him but the words ring hollow. He can hear the doubt in your voice. "You\'re afraid too," he says. It is not a question. You leave him behind the wagon, and the dark feels darker.',
          });
          moraleChange = -5;
          const jb = npcs.find((n) => n.id === 'jean-baptiste');
          if (jb) npcChanges.push({ npcId: 'jean-baptiste', relationship: 2 });
        }
      } else if (choiceId === 'truth') {
        const pierre = npcs.find((n) => n.id === 'pierre');
        if (checkPassed) {
          log.push({
            day,
            type: 'result',
            text: '"Everyone\'s afraid," you say. "Pierre is afraid. Duval is afraid. The difference is they march anyway." Jean-Baptiste is quiet for a long time. "The brave ones just march anyway," he repeats. It is not comfort. It is something harder and more useful. Truth.',
          });
          moraleChange = 2;
          const jb = npcs.find((n) => n.id === 'jean-baptiste');
          if (jb) npcChanges.push({ npcId: 'jean-baptiste', relationship: 5 });
          if (pierre) npcChanges.push({ npcId: 'pierre', relationship: 2 });
        } else {
          log.push({
            day,
            type: 'result',
            text: '"Everyone\'s afraid," you say. But the words come out wrong — too blunt, too hard. Jean-Baptiste flinches like you struck him. "So there\'s no hope then," he whispers. You meant to be honest. Instead you made it worse.',
          });
          moraleChange = -2;
          const jb = npcs.find((n) => n.id === 'jean-baptiste');
          if (jb) npcChanges.push({ npcId: 'jean-baptiste', relationship: -2 });
          if (pierre) npcChanges.push({ npcId: 'pierre', relationship: 2 });
        }
      } else {
        log.push({
          day,
          type: 'result',
          text: "You sit beside him in the dark. You don't speak. Neither does he. The shaking continues for a while, then gradually eases. When he finally stands up, he touches your arm briefly. Sometimes presence is enough. Sometimes it is everything.",
        });
        moraleChange = 2;
        const jb = npcs.find((n) => n.id === 'jean-baptiste');
        if (jb) npcChanges.push({ npcId: 'jean-baptiste', relationship: 6 });
      }
      break;

    case 'prebattle_briefing':
      if (choiceId === 'volunteer') {
        player.frontRank = true;
        const duval = npcs.find((n) => n.id === 'duval');
        if (checkPassed) {
          log.push({
            day,
            type: 'result',
            text: 'You step forward. Duval looks at you. "Good man."\n\nBehind you, a movement. Pierre steps up, quiet and steady, taking his place at your shoulder. Then Jean-Baptiste, white as chalk, falls in beside you without a word.\n\nThe front rank. Where the first volley hits. Where the lines meet. You volunteered. They followed.',
          });
          moraleChange = 2;
          statChanges.soldierRep = 3;
          statChanges.officerRep = 3;
          if (duval) npcChanges.push({ npcId: 'duval', relationship: 5 });
        } else {
          log.push({
            day,
            type: 'result',
            text: 'You step forward, but your voice catches. Duval looks at you for a long moment. "Courage is not the absence of fear, soldier. It is mastery of it. Take the front rank."\n\nPierre is already beside you — he would have volunteered anyway. Then Jean-Baptiste stumbles forward, hands shaking, refusing to meet anyone\'s eyes. But he is there. Your legs feel like water. But you are in the front rank. All three of you.',
          });
          moraleChange = -3;
          statChanges.soldierRep = 1;
          statChanges.officerRep = 1;
          if (duval) npcChanges.push({ npcId: 'duval', relationship: 3 });
        }
      } else {
        log.push({
          day,
          type: 'result',
          text: "You stay silent. The sergeant's eyes pass over you without stopping. Relief and shame in equal measure. The front rank fills without you.",
        });
        moraleChange = -3;
      }
      break;

    default:
      log.push({ day, type: 'result', text: 'The moment passes.' });
      break;
  }

  return {
    log,
    statChanges,
    moraleChange,
    staminaChange: staminaChange !== 0 ? staminaChange : undefined,
    npcChanges: npcChanges.length > 0 ? npcChanges : undefined,
  };
}
