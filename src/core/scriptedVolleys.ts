import {
  BattleState, ActionId, DrillStep, MoraleThreshold,
  LogEntry, MoraleChange, Action, ScriptedFireResult,
  getMoraleThreshold,
} from '../types';
import { rollValor } from './morale';
import { getAvailableActions } from './actions';

// ============================================================
// VOLLEY DEFINITIONS
// ============================================================

export const VOLLEY_RANGES = [120, 80, 50, 25, 100, 60, 40, 200, 200, 200, 200] as const;

export interface VolleyDef {
  range: number;
  fireAccuracyBase: number;
  aimBonus: number;
  perceptionBase: number;
  enemyReturnFireChance: number;
  enemyReturnFireDamage: [number, number];
  enemyLineDamage: number;        // scripted damage to enemy strength from the line's volley
  restrictedActions: ActionId[];
}

export const VOLLEY_DEFS: VolleyDef[] = [
  { // Volley 1: 120 paces — first exchange
    range: 120,
    fireAccuracyBase: 0.20,
    aimBonus: 0.10,
    perceptionBase: 0.15,
    enemyReturnFireChance: 0.10,
    enemyReturnFireDamage: [5, 10],
    enemyLineDamage: 6,
    restrictedActions: [ActionId.HoldFire],
  },
  { // Volley 2: 80 paces — the test
    range: 80,
    fireAccuracyBase: 0.35,
    aimBonus: 0.12,
    perceptionBase: 0.30,
    enemyReturnFireChance: 0.18,
    enemyReturnFireDamage: [8, 15],
    enemyLineDamage: 10,
    restrictedActions: [],
  },
  { // Volley 3: 50 paces — the storm
    range: 50,
    fireAccuracyBase: 0.50,
    aimBonus: 0.15,
    perceptionBase: 0.70,
    enemyReturnFireChance: 0.30,
    enemyReturnFireDamage: [10, 20],
    enemyLineDamage: 15,
    restrictedActions: [],
  },
  { // Volley 4: 25 paces — point blank
    range: 25,
    fireAccuracyBase: 0.70,
    aimBonus: 0.10,
    perceptionBase: 0.95,
    enemyReturnFireChance: 0.40,
    enemyReturnFireDamage: [12, 25],
    enemyLineDamage: 20,
    restrictedActions: [],
  },
  { // Volley 5: 100 paces — fresh column, tired defenders
    range: 100,
    fireAccuracyBase: 0.30,
    aimBonus: 0.10,
    perceptionBase: 0.20,
    enemyReturnFireChance: 0.15,
    enemyReturnFireDamage: [6, 12],
    enemyLineDamage: 8,
    restrictedActions: [ActionId.HoldFire],
  },
  { // Volley 6: 60 paces — Pontare fallen, right exposed
    range: 60,
    fireAccuracyBase: 0.45,
    aimBonus: 0.12,
    perceptionBase: 0.40,
    enemyReturnFireChance: 0.25,
    enemyReturnFireDamage: [8, 18],
    enemyLineDamage: 12,
    restrictedActions: [],
  },
  { // Volley 7: 40 paces — desperate, surrounded
    range: 40,
    fireAccuracyBase: 0.60,
    aimBonus: 0.12,
    perceptionBase: 0.80,
    enemyReturnFireChance: 0.35,
    enemyReturnFireDamage: [10, 22],
    enemyLineDamage: 16,
    restrictedActions: [],
  },
  { // Volley 8: 200 paces — first gorge volley, shooting gallery
    range: 200,
    fireAccuracyBase: 0.50,
    aimBonus: 0.10,
    perceptionBase: 0.90,
    enemyReturnFireChance: 0.02,
    enemyReturnFireDamage: [3, 6],
    enemyLineDamage: 10,
    restrictedActions: [ActionId.HoldFire, ActionId.AimCarefully, ActionId.PresentArms],
  },
  { // Volley 9: 200 paces — Austrians try to climb, easy pickings
    range: 200,
    fireAccuracyBase: 0.50,
    aimBonus: 0.10,
    perceptionBase: 0.90,
    enemyReturnFireChance: 0.03,
    enemyReturnFireDamage: [3, 6],
    enemyLineDamage: 10,
    restrictedActions: [ActionId.HoldFire, ActionId.AimCarefully, ActionId.PresentArms],
  },
  { // Volley 10: 200 paces — column disintegrating, fewer targets
    range: 200,
    fireAccuracyBase: 0.50,
    aimBonus: 0.10,
    perceptionBase: 0.90,
    enemyReturnFireChance: 0.05,
    enemyReturnFireDamage: [3, 6],
    enemyLineDamage: 8,
    restrictedActions: [ActionId.HoldFire, ActionId.AimCarefully, ActionId.PresentArms],
  },
  { // Volley 11: 200 paces — final volley, wagon guaranteed
    range: 200,
    fireAccuracyBase: 0.50,
    aimBonus: 0.10,
    perceptionBase: 0.90,
    enemyReturnFireChance: 0.05,
    enemyReturnFireDamage: [3, 6],
    enemyLineDamage: 8,
    restrictedActions: [ActionId.HoldFire, ActionId.AimCarefully, ActionId.PresentArms],
  },
];

// ============================================================
// SCRIPTED FIRE RESOLUTION (hit/miss + perception)
// ============================================================

export function resolveScriptedFire(state: BattleState, actionId: ActionId): ScriptedFireResult {
  const def = VOLLEY_DEFS[state.scriptedVolley - 1];
  const { player } = state;
  const turn = state.turn;

  // Accuracy
  let accuracy = def.fireAccuracyBase;
  if (state.aimCarefullySucceeded) accuracy += def.aimBonus;
  accuracy += player.experience / 500;
  if (player.heldFire) accuracy += 0.15;

  // Morale modifier
  if (player.moraleThreshold === MoraleThreshold.Shaken) accuracy *= 0.85;
  else if (player.moraleThreshold === MoraleThreshold.Wavering) accuracy *= 0.7;
  else if (player.moraleThreshold === MoraleThreshold.Breaking) accuracy *= 0.4;

  // SnapShot penalty
  if (actionId === ActionId.SnapShot) accuracy *= 0.3;

  accuracy = Math.min(0.90, Math.max(0.05, accuracy));

  const hitRoll = Math.random();
  const hit = hitRoll < accuracy;

  // Perception
  let perceptionChance = def.perceptionBase;
  if (state.aimCarefullySucceeded) perceptionChance += 0.15;
  perceptionChance += player.experience / 200;
  perceptionChance = Math.min(0.95, Math.max(0.05, perceptionChance));

  const perceptionRoll = Math.random();
  const perceived = perceptionRoll < perceptionChance;

  // Enemy damage
  const enemyDamage = hit ? (player.heldFire ? 5 : 2.5) : 0;

  // Morale + narrative
  const moraleChanges: MoraleChange[] = [];
  const log: LogEntry[] = [];
  const volleyIdx = state.scriptedVolley - 1;

  if (actionId === ActionId.SnapShot) {
    log.push({ turn, text: 'You jerk the trigger. The ball flies wild. The sergeant glares.', type: 'result' });
    moraleChanges.push({ amount: -1, reason: 'Fired wild', source: 'action' });
  } else if (hit && perceived) {
    moraleChanges.push({ amount: 4, reason: 'You saw your man fall', source: 'action' });
    log.push({ turn, text: getFireNarrative(volleyIdx, 'hit_seen', state), type: 'result' });
  } else if (hit && !perceived) {
    moraleChanges.push({ amount: 1, reason: 'Fired with the volley', source: 'action' });
    log.push({ turn, text: getFireNarrative(volleyIdx, 'hit_unseen', state), type: 'result' });
  } else if (!hit && perceived) {
    moraleChanges.push({ amount: -1, reason: 'You saw your shot miss', source: 'action' });
    log.push({ turn, text: getFireNarrative(volleyIdx, 'miss_seen', state), type: 'result' });
  } else {
    moraleChanges.push({ amount: 1, reason: 'Fired with the volley', source: 'action' });
    log.push({ turn, text: getFireNarrative(volleyIdx, 'miss_unseen', state), type: 'result' });
  }

  return { hit, perceived, accuracy, perceptionRoll, enemyDamage, moraleChanges, log };
}

// ============================================================
// GORGE FIRE RESOLUTION (target-based, Part 3)
// ============================================================

export function resolveGorgeFire(state: BattleState): ScriptedFireResult {
  const { player } = state;
  const turn = state.turn;
  const moraleChanges: MoraleChange[] = [];
  const log: LogEntry[] = [];
  const target = state.gorgeTarget;

  let hit = false;
  let accuracy = 0;
  let enemyDamage = 0;

  if (target === 'column') {
    // High accuracy — shooting into packed ranks
    accuracy = 0.60 + (player.dexterity / 500) + (player.awareness / 500);
    accuracy = Math.min(0.90, Math.max(0.30, accuracy));
    hit = Math.random() < accuracy;

    if (hit) {
      enemyDamage = 5;
      moraleChanges.push({ amount: 2, reason: 'Your shot found its mark in the column', source: 'action' });
      log.push({ turn, type: 'result',
        text: 'Your ball punches into the packed ranks. A man staggers, clutches his chest, falls into the press of bodies around him. The column absorbs him like water closing over a stone. One fewer. Hundreds remain.',
      });
    } else {
      moraleChanges.push({ amount: 1, reason: 'Fired into the gorge', source: 'action' });
      log.push({ turn, type: 'result',
        text: 'Your ball strikes somewhere in the mass below. Through the smoke, you cannot see where. At this range, into that press, it hardly matters \u2014 the line\'s volley does the work.',
      });
    }
  } else if (target === 'officers') {
    // Medium accuracy — picking out a specific target
    accuracy = 0.30 + (player.dexterity / 300) + (player.awareness / 400);
    accuracy = Math.min(0.70, Math.max(0.15, accuracy));
    hit = Math.random() < accuracy;

    if (hit) {
      enemyDamage = 3;
      moraleChanges.push({ amount: 5, reason: 'You shot an Austrian officer', source: 'action' });
      log.push({ turn, type: 'result',
        text: 'You pick out the gorget \u2014 the silver crescent at his throat that marks him as an officer. He\'s trying to rally his men, waving a sword, screaming orders no one can follow. Your ball takes him in the shoulder. He spins and goes down.\n\nThe men around him freeze. Without his voice, the last thread of discipline in that section snaps.',
      });
    } else {
      moraleChanges.push({ amount: -1, reason: 'Missed the officer \u2014 wasted the shot', source: 'action' });
      log.push({ turn, type: 'result',
        text: 'You aim for the gorget, the sash, the man giving orders. The ball goes wide \u2014 close enough to make him flinch, not close enough to matter. He keeps rallying his men. The opportunity passes.',
      });
    }
  } else if (target === 'wagon') {
    // Hard accuracy — small, specific target
    accuracy = 0.15 + (player.dexterity / 250) + (player.awareness / 350);
    accuracy = Math.min(0.50, Math.max(0.10, accuracy));
    hit = Math.random() < accuracy;

    if (hit) {
      const damage = 30 + Math.random() * 15;
      state.wagonDamage += damage;
      enemyDamage = 0;

      if (state.wagonDamage >= 100) {
        // DETONATION
        state.wagonDamage = 100;
        state.enemy.strength = Math.max(0, state.enemy.strength - 30);
        moraleChanges.push({ amount: 15, reason: 'The ammunition wagon DETONATES', source: 'action' });
        log.push({ turn, type: 'result',
          text: 'Your ball strikes the powder wagon. A spark \u2014 a hiss \u2014 a heartbeat of absolute silence.\n\nThe explosion lifts the wagon off the gorge road. The fireball swallows everything within thirty paces \u2014 men, horses, debris \u2014 and the shockwave slams against the gorge walls hard enough to crack stone. Burning timber pinwheels through the smoke. A secondary explosion \u2014 the powder kegs \u2014 sends a column of fire sixty feet into the air.\n\nThe ridge shakes under your feet. Men duck involuntarily. When you look again, a smoking crater marks where the wagon was. Nothing around it moves.\n\nYou did that. One ball. One shot.',
        });
      } else {
        moraleChanges.push({ amount: 3, reason: 'Hit the wagon \u2014 something caught', source: 'action' });
        const pct = Math.round(state.wagonDamage);
        log.push({ turn, type: 'result',
          text: `Your ball strikes the wagon. Sparks fly from splintered wood. Something catches \u2014 a thin trail of smoke rises from the bed. Not enough. Not yet. But the powder kegs are exposed and the fire is spreading.\n\n[Wagon damage: ${pct}%]`,
        });
      }
    } else {
      moraleChanges.push({ amount: 0, reason: 'Missed the wagon', source: 'action' });
      log.push({ turn, type: 'result',
        text: 'Your ball strikes the gorge road a pace from the wagon, kicking up a spray of gravel. The wagon sits untouched, powder kegs exposed, daring you to try again.',
      });
    }
  }

  // Clear target
  state.gorgeTarget = undefined;

  return { hit, perceived: true, accuracy, perceptionRoll: 0, enemyDamage, moraleChanges, log };
}

// ============================================================
// FIRE NARRATIVES (per volley × outcome)
// ============================================================

type FireOutcome = 'hit_seen' | 'hit_unseen' | 'miss_seen' | 'miss_unseen';

function getFireNarrative(volleyIdx: number, outcome: FireOutcome, _state: BattleState): string {
  const narratives: Record<number, Record<FireOutcome, string>> = {
    0: { // 120 paces
      hit_seen: 'Thunder and recoil. Through a ragged tear in the smoke, you see a man in the Austrian line stagger. His musket drops. He folds.\n\nYou did that. You will remember.',
      hit_unseen: 'Thunder and recoil. The smoke rolls in, white and impenetrable. Your ball is somewhere in that cloud. Did it find its mark? God alone knows.',
      miss_seen: 'Thunder and recoil. You catch a glimpse through the smoke — the ball kicks up dirt a pace to his left. Your man still stands. Wasted.',
      miss_unseen: 'The volley crashes out as one. The smoke swallows everything. Three hundred muskets, three hundred balls. Whether yours mattered, you\'ll never know.',
    },
    1: { // 80 paces
      hit_seen: 'At eighty paces, you see it happen. Your man takes the ball in the chest. He looks surprised — they always look surprised. He sits down in the grass like a man too tired to stand.',
      hit_unseen: 'The smoke from three hundred muskets rolls across the field like fog. Somewhere in that white wall, your ball found flesh. Or didn\'t. The smoke keeps its secrets.',
      miss_seen: 'Through the haze you see your shot strike the ground between two men. Close. Not close enough. They don\'t even flinch — too terrified to notice.',
      miss_unseen: 'The volley tears into the smoke. At eighty paces the smoke is thick enough to hide God himself. You fired. That\'s all you know.',
    },
    2: { // 50 paces
      hit_seen: 'Fifty paces. Point blank. You see the ball hit him — see the Habsburg uniform punch inward, see the man snap backward. He spins and falls face-first. No ambiguity at this range. No mercy.',
      hit_unseen: 'Even at fifty paces, the concentrated smoke of a full volley hides the result. But you heard something — a scream, a wet sound. Something found its mark.',
      miss_seen: 'You see the ball crack the stock of the musket beside your target. The man flinches — alive. You missed by inches. At fifty paces. Your hands were shaking too hard.',
      miss_unseen: 'The volley is devastating — you can hear it in the screams. But your own shot? Lost in the thunder. One ball among hundreds. The smoke takes the answer.',
    },
    3: { // 25 paces
      hit_seen: 'Twenty-five paces. You see his face — young, fair-haired, terrified — in the instant before the ball takes him. The Austrian uniform darkens with blood. He drops. You will see that face for the rest of your life.',
      hit_unseen: 'The volley at point blank is apocalyptic. Their front rank dissolves. In the chaos and smoke, your particular contribution is lost — but at this range, you don\'t miss. You know that.',
      miss_seen: 'The ball flies past his ear. He flinches. At twenty-five paces, you missed. Your hands are shaking so badly the barrel was a foot off. He looks at you. You look at him. Then the smoke rolls in.',
      miss_unseen: 'Point blank. The world is noise and smoke. Their line buckles. Whether your ball found its man or buried itself in the earth, you cannot say. At this range, it barely matters. Everyone hit something.',
    },
    4: { // 100 paces — fresh column, tired arms
      hit_seen: 'At a hundred paces, your tired arms still find the mark. A man in the fresh column staggers — clutches his side — sits down heavily. Your ball. You know it.',
      hit_unseen: 'The volley goes out. Your arms ache. Your hands are blistered. But you fired with the line, and the smoke hides the rest.',
      miss_seen: 'Your ball kicks up dirt a pace short. At a hundred paces, with arms that have already fired four volleys, it was always going to be difficult.',
      miss_unseen: 'The smoke rolls. Fresh white coats through the haze. Your ball is somewhere in there. Whether it matters, you cannot tell.',
    },
    5: { // 60 paces — desperate
      hit_seen: 'Sixty paces. Your man takes the ball and drops. The column doesn\'t even slow. They step over him. There are so many of them.',
      hit_unseen: 'The volley tears into the column. At sixty paces the damage is terrible — you can hear it. But the smoke takes the specifics and you are grateful.',
      miss_seen: 'Your shot goes wide. At sixty paces with hands that won\'t stop shaking, it\'s a miracle you\'re still firing at all.',
      miss_unseen: 'The volley crashes out. The column wavers but comes on. Your particular contribution is lost in the thunder of three hundred muskets.',
    },
    6: { // 40 paces — surrounded
      hit_seen: 'Forty paces. You see the ball hit him — see the white coat jerk, see the man spin and fall. One fewer. It doesn\'t matter. There are thousands.',
      hit_unseen: 'The volley at close range is devastating. Their front rank dissolves. Screams. The column halts. But behind them, more columns. Always more.',
      miss_seen: 'The ball passes between two men. At forty paces, you missed. Your arms are lead. Your vision swims. But you reload.',
      miss_unseen: 'Noise and smoke and the dying. Your ball goes somewhere. The column staggers. Comes on. The 14th fires again because there is nothing else to do.',
    },
    // Gorge fire narratives are handled by resolveGorgeFire — these are fallbacks
    7: {
      hit_seen: 'Your ball finds its mark in the press below.',
      hit_unseen: 'The volley pours into the gorge. Screams rise.',
      miss_seen: 'Your shot strikes stone. The gorge echoes.',
      miss_unseen: 'The volley crashes into the gorge.',
    },
    8: {
      hit_seen: 'Another man falls in the packed column below.',
      hit_unseen: 'The volley tears into the struggling mass.',
      miss_seen: 'Your ball kicks up dirt among the dead.',
      miss_unseen: 'The line fires. The gorge swallows the sound.',
    },
    9: {
      hit_seen: 'The column below is barely a column now. Your ball adds to the ruin.',
      hit_unseen: 'Into the gorge, into the dying. The volley goes.',
      miss_seen: 'Your shot goes wide. It barely matters. The gorge is full of the dead.',
      miss_unseen: 'The volley crashes down. The carnage continues.',
    },
    10: {
      hit_seen: 'The last volley. Your ball finds a man in the wreckage below.',
      hit_unseen: 'The final volley pours into the gorge.',
      miss_seen: 'Your last shot strikes the gorge wall. It\'s over.',
      miss_unseen: 'The volley echoes. Then silence.',
    },
  };

  return narratives[volleyIdx]?.[outcome] || 'The volley crashes out.';
}

// ============================================================
// VOLLEY NARRATIVES (per volley × drill step)
// ============================================================

export function getVolleyNarrative(
  volleyIdx: number, step: DrillStep, state: BattleState
): string {
  const range = VOLLEY_DEFS[volleyIdx].range;

  // FIRE narratives (captain's order — appears before fire resolution)
  if (step === DrillStep.Fire) {
    const fireOrders: Record<number, string> = {
      0: `"Feu!" The captain's sword drops. The 14th's first volley at Rivoli.`,
      1: `"FIRE!" The word tears down the line. Across the broken ground, the volley crashes out.`,
      2: `"FIRE!" At fifty paces, the captain's voice is raw. The volley rips through the vineyard walls.`,
      3: `"Tirez! Derni\u00e8re salve!" The final command. Point blank.`,
      4: `"Feu!" The captain's voice is hoarse now, raw as an open wound. But it carries. The 14th fires again \u2014 because that is what the 14th does.`,
      5: `"FIRE!" Leclerc's voice cracks. The word comes out half-whisper, half-scream. Every man hears it. The volley goes out, ragged, desperate, defiant.`,
      6: `"TIREZ! TOUT CE QUE VOUS AVEZ!" The final volley. The captain's voice is gone. What comes out is something beyond words \u2014 raw will made sound.`,
      7: `"Pour it into them!" The order is almost unnecessary. The men fire at will.`,
      8: `"Again! Keep firing!" The mechanical rhythm of loading and firing continues.`,
      9: `"Don't let up!" But there is less conviction in the voice now.`,
      10: `"Final volley! Make it count!" The last command of the battle.`,
    };
    return fireOrders[volleyIdx] || '"FIRE!"';
  }

  // PRESENT narratives
  if (step === DrillStep.Present) {
    const presentNarratives: Record<number, string> = {
      0: `"Présentez armes!" The order carries down the line like a wave. Three hundred muskets rise as one. Through the dawn haze, Austrian columns emerge from the mountain gorges — white crossbelts, steel points glinting like a hedge of thorns. At ${range} paces, they are ghosts becoming men.\n\nFighting has already broken out on the right flank. You can hear it — gunshots, screams, the crash of volleys where there should be silence. The battle has begun before anyone expected it.\n\nThis is your first volley.`,
      1: `"PRESENT!" Eighty paces now. Close enough to see faces — strained, pale, human. The broken ground between you and them is a maze of vineyard walls and churned earth. Beside you, Jean-Baptiste\'s musket wavers. His breathing comes in sharp, ragged gasps.`,
      2: `"PRESENT!" Fifty paces. You can see their buttons. Their teeth. The air stinks of powder and iron and blood. Across the broken ground — walled gardens, shattered vines — sudden charges and counter-charges erupt on either side of the 14th\'s position.`,
      3: `"Encore une salve! En avant après!" The captain\'s voice is hoarse but carries. Twenty-five paces. The Austrian column surges forward. To your left, news ripples through the line — the left flank is breaking. White coats pushing through nearby positions.\n\nThis is the last musketry exchange. After this, cold steel.`,
      4: `"Pr\u00e9sentez armes!" Fresh Austrian columns pour from the gorges of the Adige \u2014 Vukassovich's corps, pristine white coats unstained by the morning's fighting. At a hundred paces, they advance with the steady confidence of troops who haven't yet tasted the 14th's fire.\n\nBehind them, artillery unlimbers on the far bank. The guns that fell silent during Mass\u00e9na's attack speak again.\n\nYour arms ache. Your powder pouch is lighter. Your comrades are fewer. But the drums still beat and the 14th still stands.`,
      5: `"PRESENT!" Sixty paces. The Pontare has fallen \u2014 the high ground to the right that anchored the French line all morning. You can see it: Austrian flags where French flags flew an hour ago. The right flank is open.\n\nCaptain Leclerc's voice, barely a rasp: "Refuse the flank! Right companies, wheel!" The 14th bends its line, trying to cover the gap. It's not enough. It's never enough.\n\nThe column keeps coming.`,
      6: `"PRESENT!" Forty paces. Men are breaking in the rear ranks. You can hear them \u2014 the clatter of dropped muskets, the sound of boots on gravel moving the wrong direction. The drums beat louder, trying to drown it out.\n\nSome voices in the line: "We're trapped! Lusignan is at Affi \u2014 they've cut us off!"\n\nThe column is forty paces away. This is the last volley.`,
      7: `The ridge. Below you, Austrian columns packed into the gorge like livestock in a pen. Bonaparte's trap has sprung. The order: FIRE AT WILL.\n\nThe men of the 14th line the ridge, looking down. Some faces are eager. Others are grey. This is not a battle. This is a slaughter.\n\nYou raise your musket. Choose your target.`,
      8: `Fresh columns push into the gorge from behind, shoving the survivors forward into the killing ground. More targets. The men to your left are loading mechanically \u2014 bite, pour, ram, fire. Bite, pour, ram, fire. The rhythm of butchery.\n\nAustrian officers try to organise resistance. A few muskets point upward. Futile.`,
      9: `The gorge floor is carpeted with white coats. The column is breaking apart. Men throw down their muskets and try to climb the walls \u2014 scrambling, sliding, falling back.\n\nSome Austrians raise white cloth. Others keep pushing. Through the smoke you can see it clearly now: the ammunition wagon, tilted on the gorge road, horses dead in the traces.`,
      10: `The last column. The gorge is a charnel house. The ammunition wagon sits amid the wreckage \u2014 broken wheels, scattered bodies, powder kegs exposed.\n\nThe white flags are everywhere now. The screaming has stopped. What remains is worse: silence, broken by the occasional sob.`,
    };
    let text = presentNarratives[volleyIdx] || '';

    if (state.player.moraleThreshold === MoraleThreshold.Shaken) {
      text += '\n\nYour hands are not entirely steady.';
    } else if (state.player.moraleThreshold === MoraleThreshold.Wavering) {
      text += '\n\nEvery instinct screams at you to run.';
    } else if (state.player.moraleThreshold === MoraleThreshold.Breaking) {
      text += '\n\nThe world has narrowed to a tunnel. You can\'t stop shaking.';
    }
    return text;
  }

  // ENDURE narratives
  if (step === DrillStep.Endure) {
    const endureNarratives: Record<number, string> = {
      0: 'The return volley comes — a ripple of flame and smoke from their line. Balls whip overhead, thud into earth, crack against musket stocks. A man two files down screams. The sound cuts through the guns.\n\nFrom the right flank, the sounds of battle intensify. Anxiety ripples through the line. The drums beat steady — holding, holding.',
      1: 'They return fire. At eighty paces, every ball finds something. Through the haze you glimpse the white coats reloading — methodical, mechanical. The line shudders. You hear impacts — soft, horrible sounds — and a voice calling for water.',
      2: 'Their volley tears through the line like a scythe. At fifty paces there is no hiding. You stand in the open among the walled gardens and take it. Men fall. The rear rank closes up, stepping over the fallen.\n\nReports filter down the line — pressure on the left flank is mounting. The Austrians are pushing hard.',
      3: '"FIX BAYONETS!" The order comes the instant the smoke clears. Bayonets rasp from scabbards up and down the line. Steel clicks onto muzzles.\n\nThe left flank crumbles. You can see it — white coats pouring through the gap to your left, rolling up the positions next to the 14th. The ordered line dissolves into desperate close combat.\n\nThe enemy is twenty-five paces away. And coming.',
      4: 'The return volley comes from fresh muskets fired by rested arms. Balls slam into the line with renewed violence. From the right, the sounds of fighting intensify \u2014 Reuss\'s column is attacking the Pontare. The high ground that has anchored the French position all morning is under assault.\n\nThe 14th must hold. There is nothing else.',
      5: 'Their volley tears through the refused flank like a saw through bone. The Pontare has fallen. You know it \u2014 everyone knows it. The right is open and the Austrians are pushing through.\n\nFrom somewhere behind the smoke, a rumour spreads like poison: Lusignan\'s column has been spotted at Affi, to the south. The French are surrounded.\n\nThe drums still beat. The 14th still stands. But the noose is tightening.',
      6: 'The return volley is close enough to feel the heat of the muzzle flash. Men fall. The rear ranks thin. The drums beat the charge \u2014 not retreat, the charge.\n\nAnd then, on the ridge above the plateau: movement. Horsemen. A small figure on a grey horse.\n\nThe word passes down the line like a spark along a fuse: "Bonaparte. Bonaparte is ordering the counterattack."\n\n"Every man and every gun to the ridge!"',
      7: 'The column tries to reform below. Men scramble over the dead. There is no escape \u2014 the gorge walls funnel them back into the killing ground.\n\nA few shots crack upward from the gorge floor. Hopeless, wild, fired by men who know they are already dead.',
      8: 'Screams from below. The sound carries up the gorge walls, amplified, echoing. The sound of trapped men dying.\n\nThe man next to you reloads with hands that won\'t stop moving. He doesn\'t look down anymore. None of you do.',
      9: 'Austrian wounded call for help from the gorge floor. The sound carries clearly in the sudden stillness between volleys.\n\nPierre stares down at the carnage. His face is stone. "This is no longer battle," he says quietly. "This is slaughter."',
      10: 'The gorge falls silent. White flags everywhere. The wind carries the smell of powder and blood up from below.\n\nIt\'s over.',
    };
    return endureNarratives[volleyIdx] || '';
  }

  return '';
}

// ============================================================
// SCRIPTED EVENTS (per volley × drill step)
// ============================================================

export function resolveScriptedEvents(
  state: BattleState, step: DrillStep, actionId: ActionId
): { log: LogEntry[]; moraleChanges: MoraleChange[] } {
  const volleyIdx = state.scriptedVolley - 1;
  const turn = state.turn;
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];

  // === VOLLEY 1 EVENTS ===
  if (volleyIdx === 0) {
    if (step === DrillStep.Fire) {
      // Successful volley recovery
      log.push({ turn, text: 'A ragged cheer rises from the line. The first volley struck home. Their ranks are thinner.', type: 'event' });
      moraleChanges.push({ amount: 2, reason: 'First volley struck home', source: 'recovery' });
    }
    if (step === DrillStep.Endure) {
      // Sounds of battle from the right flank
      log.push({ turn, text: 'From the right flank, a crescendo of musketry. Someone else\'s fight — but the sound of it crawls under your skin. Men are dying over there. The battle is wider than you imagined.', type: 'event' });
      moraleChanges.push({ amount: -4, reason: 'Sounds of battle on the right', source: 'event' });
      // Range pressure + recovery (replaces passive drain system during scripted phase)
      moraleChanges.push({ amount: -2, reason: 'Under fire at medium range', source: 'passive' });
      moraleChanges.push({ amount: 2, reason: 'The drums steady the line', source: 'recovery' });
      // Neighbour contagion
      if (state.line.leftNeighbour?.alive && !state.line.leftNeighbour.routing) {
        const t = getMoraleThreshold(state.line.leftNeighbour.morale, state.line.leftNeighbour.maxMorale);
        moraleChanges.push({ amount: t === MoraleThreshold.Steady ? 2 : t === MoraleThreshold.Wavering ? -3 : 0, reason: `${state.line.leftNeighbour.name} stands firm`, source: 'contagion' });
      }
      if (state.line.rightNeighbour?.alive && !state.line.rightNeighbour.routing) {
        const t = getMoraleThreshold(state.line.rightNeighbour.morale, state.line.rightNeighbour.maxMorale);
        moraleChanges.push({ amount: t === MoraleThreshold.Steady ? 2 : t === MoraleThreshold.Wavering ? -3 : 0, reason: `${state.line.rightNeighbour.name} stands firm`, source: 'contagion' });
      }
    }
  }

  // === VOLLEY 2 EVENTS ===
  if (volleyIdx === 1) {
    if (step === DrillStep.Present) {
      // Jean-Baptiste deterioration narrative (no morale effect yet — that's at ENDURE)
      log.push({
        turn, type: 'event',
        text: 'Beside you, Jean-Baptiste\'s hands are shaking so hard his ramrod rattles against the barrel. His lips are moving but no sound comes out. He hasn\'t dropped his musket — not yet — but his eyes have that look. The one that says a man is close to breaking.',
      });
    }
    if (step === DrillStep.Fire) {
      // First visible casualty in your section
      log.push({ turn, text: 'A ball punches through the man two files to your left. He drops without a sound — there, then gone. The rear rank steps over him.', type: 'event' });
      moraleChanges.push({ amount: -3, reason: 'Man killed in your section', source: 'event' });
      state.line.lineIntegrity = Math.max(0, state.line.lineIntegrity - 3);
    }
    if (step === DrillStep.Endure) {
      // JB crisis is handled separately in resolveJBCrisis (called from advanceScriptedTurn)
      // Inject the setup narrative
      if (!state.jbCrisisResolved) {
        log.push({
          turn, type: 'event',
          text: 'Jean-Baptiste drops his musket. It clatters on the packed earth. His eyes are wide and white. He takes a half-step backward.\n\nThe sergeant hasn\'t seen. Not yet.',
        });
      }
      // Range pressure + recovery
      moraleChanges.push({ amount: -3, reason: 'Enemy at close range', source: 'passive' });
      moraleChanges.push({ amount: 2, reason: 'The drums hold steady', source: 'recovery' });
      // Neighbour contagion (Pierre only — JB is in crisis)
      if (state.line.leftNeighbour?.alive && !state.line.leftNeighbour.routing) {
        moraleChanges.push({ amount: 2, reason: `${state.line.leftNeighbour.name} stands firm`, source: 'contagion' });
      }
    }
  }

  // === VOLLEY 3 EVENTS ===
  if (volleyIdx === 2) {
    if (step === DrillStep.Present) {
      // Pierre is grazed — wounded but keeps fighting
      if (state.line.leftNeighbour?.alive && !state.line.leftNeighbour.wounded) {
        log.push({
          turn, type: 'event',
          text: 'A ball clips Pierre\'s shoulder as you raise your musket. He staggers — grunts, just a grunt, like a man bumping furniture. Blood darkens his sleeve immediately.\n\n"It\'s nothing," he says, gripping the musket tighter with his good hand. His face is grey. But he raises his weapon. Still here. Still Pierre.\n\nThe veteran is wounded. But he is not down.',
        });
        moraleChanges.push({ amount: -6, reason: 'Pierre is hit — wounded but fighting', source: 'event' });
        state.line.leftNeighbour.wounded = true;
        state.line.leftNeighbour.morale = Math.max(0, state.line.leftNeighbour.morale - 15);
        state.line.casualtiesThisTurn += 1;
      }

      // Officer dismounts
      if (state.line.officer.alive && state.line.officer.mounted) {
        state.line.officer.mounted = false;
        state.line.officer.status = 'On foot, rallying';
      }

      // JB shaken but holds — Pierre steadies him from the other side
      if (state.jbCrisisOutcome === 'shaken' && state.line.rightNeighbour?.alive && !state.line.rightNeighbour.routing) {
        log.push({
          turn, type: 'event',
          text: 'Jean-Baptiste is visibly breaking — his whole body trembling, musket wavering. Pierre, blood running down his sleeve, barks a single word at him: "HOLD." Sharp as a slap.\n\nJean-Baptiste holds. Barely. The thread is thin, but it holds.',
        });
        moraleChanges.push({ amount: -2, reason: 'Jean-Baptiste barely holding', source: 'contagion' });
      }
    }
    if (step === DrillStep.Endure) {
      // Artillery ceases — too close
      state.enemy.artillery = false;
      log.push({ turn, text: 'The artillery falls silent. Too close for cannon now — the lines are tangled in the vineyards and walled gardens. Small mercy. The musketry more than makes up for it.', type: 'event' });

      // Reports of pressure on the left
      log.push({ turn, text: 'Word comes down the line — the left flank is under heavy pressure. Austrian columns pushing through the gorges, threatening to turn the position. The 14th must hold.', type: 'event' });
      moraleChanges.push({ amount: -5, reason: 'Left flank under pressure', source: 'event' });
      state.line.lineIntegrity = Math.max(0, state.line.lineIntegrity - 5);

      // Officer rallies
      if (state.line.officer.alive) {
        log.push({ turn, text: 'Captain Leclerc strides down the line, sword drawn. "Steady, Fourteenth! One more volley, then cold steel! En avant!" His voice carries above the carnage.', type: 'event' });
        moraleChanges.push({ amount: 4, reason: 'Captain rallies the line', source: 'recovery' });
      }
      // Range pressure + contagion
      moraleChanges.push({ amount: -4, reason: 'Enemy at close range', source: 'passive' });
      if (state.line.leftNeighbour?.alive && !state.line.leftNeighbour.routing) {
        moraleChanges.push({ amount: state.line.leftNeighbour.wounded ? 1 : 2, reason: `${state.line.leftNeighbour.name} holds the line`, source: 'contagion' });
      }
      if (state.line.rightNeighbour?.alive && !state.line.rightNeighbour.routing) {
        const t = getMoraleThreshold(state.line.rightNeighbour.morale, state.line.rightNeighbour.maxMorale);
        const amt = t === MoraleThreshold.Steady || t === MoraleThreshold.Shaken ? 1 : -2;
        moraleChanges.push({ amount: amt, reason: `${state.line.rightNeighbour.name} ${amt > 0 ? 'holds on' : 'is trembling'}`, source: 'contagion' });
      }
    }
  }

  // === VOLLEY 4 EVENTS ===
  if (volleyIdx === 3) {
    if (step === DrillStep.Present) {
      // Enemy at point blank, left flank news
      log.push({
        turn, type: 'event',
        text: 'Their drums beat the Sturmmarsch. The Austrian column surges forward — steel levelled, mouths open in a scream you can barely hear over the guns. To your left, the news is worse: the left flank is breaking. White coats pushing through nearby positions.',
      });
      moraleChanges.push({ amount: -4, reason: 'The enemy is charging', source: 'event' });
      moraleChanges.push({ amount: -3, reason: 'Left flank is breaking', source: 'event' });
      state.enemy.morale = 'charging';
    }
    if (step === DrillStep.Endure) {
      // Bayonets fixed
      log.push({
        turn, type: 'event',
        text: 'Bayonets rasp from scabbards up and down the line. Steel clicks onto muzzles. The familiar weight changes — your musket is now a spear.',
      });

      // Pierre fixes bayonet (wounded but alive)
      if (state.line.leftNeighbour?.alive) {
        log.push({
          turn, type: 'event',
          text: 'Pierre fixes his bayonet with his good hand, blood still dripping down his sleeve. "Not done yet," he says. The veteran holds.',
        });
        moraleChanges.push({ amount: 2, reason: 'Pierre\'s courage', source: 'recovery' });
      }

      // Jean-Baptiste (always alive in Part 1)
      if (state.line.rightNeighbour?.alive && !state.line.rightNeighbour.routing) {
        if (state.jbCrisisOutcome === 'steadied') {
          log.push({ turn, text: 'Jean-Baptiste fixes his bayonet. His hands shake. But he does it. He looks at you once — a look that says everything — and faces front.', type: 'event' });
          moraleChanges.push({ amount: 2, reason: 'Jean-Baptiste stands', source: 'recovery' });
        } else {
          log.push({ turn, text: 'Jean-Baptiste fumbles with his bayonet. Drops it. Picks it up. Fixes it on the third try. He\'s still here. Barely.', type: 'event' });
        }
      }

      // Range pressure at point blank
      moraleChanges.push({ amount: -5, reason: 'Point blank — they\'re right there', source: 'passive' });
    }
  }

  // === VOLLEY 5 EVENTS (Part 2) ===
  if (volleyIdx === 4) {
    if (step === DrillStep.Present) {
      // Vukassovich artillery resumes
      state.enemy.artillery = true;
      log.push({
        turn, type: 'event',
        text: 'Vukassovich\'s guns open from across the Adige. Round shot screams overhead. The artillery that fell silent during the melee is back \u2014 and this time it\'s fresh batteries, unhurried, well-aimed.',
      });
      moraleChanges.push({ amount: -5, reason: 'Vukassovich\'s artillery resumes', source: 'event' });
      // Masséna's presence steadies
      log.push({
        turn, type: 'event',
        text: 'But to the south, Mass\u00e9na\'s drums still beat. His division is still fighting. You are not alone.',
      });
      moraleChanges.push({ amount: 3, reason: 'Mass\u00e9na\'s presence steadies the line', source: 'recovery' });
    }
    if (step === DrillStep.Endure) {
      // Reuss attacking the Pontare
      log.push({
        turn, type: 'event',
        text: 'From the right, the sound of concentrated musketry. Reuss\'s column is assaulting the Pontare \u2014 the high ground that anchors the entire French position. If it falls, the right flank is open.',
      });
      moraleChanges.push({ amount: -4, reason: 'Reuss attacking the Pontare', source: 'event' });
      // Standard drain/recovery
      moraleChanges.push({ amount: -2, reason: 'Under fire \u2014 tired arms, fresh enemy', source: 'passive' });
      moraleChanges.push({ amount: 2, reason: 'The drums steady the line', source: 'recovery' });
      // Pierre holds
      if (state.line.leftNeighbour?.alive && !state.line.leftNeighbour.routing) {
        log.push({
          turn, type: 'event',
          text: `${state.line.leftNeighbour.name} reloads beside you. ${state.line.leftNeighbour.wounded ? 'One-handed, teeth gritted, blood on his sleeve. Still here. Still Pierre.' : 'Steady. Mechanical. The veteran holds.'}`,
        });
        moraleChanges.push({ amount: 2, reason: `${state.line.leftNeighbour.name} holds the line`, source: 'contagion' });
      }
    }
  }

  // === VOLLEY 6 EVENTS (Part 2) ===
  if (volleyIdx === 5) {
    if (step === DrillStep.Present) {
      // Pontare has fallen
      log.push({
        turn, type: 'event',
        text: 'The Pontare has fallen. Austrian flags fly where French flags flew an hour ago. The right flank is open \u2014 exposed. The 14th must refuse its flank, bending the line to cover what the Pontare no longer protects.',
      });
      moraleChanges.push({ amount: -6, reason: 'The Pontare has fallen \u2014 right flank exposed', source: 'event' });
      state.line.lineIntegrity = Math.max(0, state.line.lineIntegrity - 5);

      // Officer rallies
      if (state.line.officer.alive) {
        log.push({
          turn, type: 'event',
          text: 'Captain Leclerc\'s voice, raw and broken: "Hold the line, Fourteenth! Mass\u00e9na holds the left \u2014 we hold the right! HOLD!"',
        });
        moraleChanges.push({ amount: 3, reason: 'Captain rallies the line', source: 'recovery' });
      }
    }
    if (step === DrillStep.Endure) {
      // Lusignan spotted — surrounded
      log.push({
        turn, type: 'event',
        text: 'Word reaches the line like a cold knife: Lusignan\'s column has been spotted at Affi, to the south. The gorge behind the French position \u2014 the only retreat \u2014 is threatened. The 14th is surrounded.',
      });
      moraleChanges.push({ amount: -8, reason: 'Surrounded \u2014 Lusignan at Affi', source: 'event' });
      // Pierre moment
      if (state.line.leftNeighbour?.alive && !state.line.leftNeighbour.routing) {
        log.push({
          turn, type: 'event',
          text: `Pierre glances at you. His face is grey, his shoulder dark with blood. But his eyes are steady. "We've been in worse," he says. It's a lie. You both know it. But it helps.`,
        });
        moraleChanges.push({ amount: 3, reason: 'Pierre: "We\'ve been in worse"', source: 'contagion' });
      }
      // Range pressure
      moraleChanges.push({ amount: -3, reason: 'Under fire at close range \u2014 exhausted', source: 'passive' });
    }
  }

  // === VOLLEY 7 EVENTS (Part 2) ===
  if (volleyIdx === 6) {
    if (step === DrillStep.Present) {
      // Men breaking in rear
      log.push({
        turn, type: 'event',
        text: 'Men are breaking in the rear ranks. You can hear muskets clattering to the ground, boots scraping on gravel. The line is thinning from behind.',
      });
      moraleChanges.push({ amount: -5, reason: 'Men breaking in the rear', source: 'event' });
      state.line.lineIntegrity = Math.max(0, state.line.lineIntegrity - 8);

      // JB state check
      if (state.line.rightNeighbour?.alive && !state.line.rightNeighbour.routing) {
        if (state.jbCrisisOutcome === 'steadied') {
          log.push({
            turn, type: 'event',
            text: 'Jean-Baptiste is still here. Still standing. His face is a mask of exhaustion but his hands hold the musket level. Whatever you said to him during the second volley \u2014 it held.',
          });
          moraleChanges.push({ amount: 2, reason: 'Jean-Baptiste holds', source: 'contagion' });
        } else {
          log.push({
            turn, type: 'event',
            text: 'Jean-Baptiste is shaking so hard the musket rattles. He won\'t last. But he hasn\'t run. Somehow, he hasn\'t run.',
          });
        }
      }
    }
    if (step === DrillStep.Endure) {
      // Napoleon orders counterattack — the great reversal
      log.push({
        turn, type: 'event',
        text: 'On the ridge: Bonaparte. The small figure on the grey horse is unmistakable. An aide gallops down. The orders carry like thunder: "Every man and every gun to the ridge! The counterattack goes in NOW!"',
      });
      moraleChanges.push({ amount: 10, reason: 'Napoleon orders the counterattack', source: 'recovery' });
      // Officer rallies
      if (state.line.officer.alive) {
        log.push({
          turn, type: 'event',
          text: 'Captain Leclerc draws his sword. His voice is gone \u2014 what comes out is half-whisper, half-roar: "FOURTEENTH! TO THE RIDGE!"',
        });
        moraleChanges.push({ amount: 5, reason: 'Captain: "To the ridge!"', source: 'recovery' });
      }
      // Range pressure (but offset by the massive recovery)
      moraleChanges.push({ amount: -4, reason: 'Under fire at close range', source: 'passive' });
    }
  }

  // === VOLLEY 8 EVENTS (Part 3: Gorge) ===
  if (volleyIdx === 7) {
    if (step === DrillStep.Endure) {
      log.push({
        turn, type: 'event',
        text: 'Below, the first men throw down their arms. White coats raising empty hands. But the column behind them pushes forward, crushing them against the fallen.',
      });
      // Pierre reacts
      if (state.line.leftNeighbour?.alive && !state.line.leftNeighbour.routing) {
        log.push({
          turn, type: 'event',
          text: '"This is butcher\'s work," Pierre says. He reloads anyway. His face is the face of a man doing something he will never forgive himself for.',
        });
      }
      moraleChanges.push({ amount: -1, reason: 'Minimal return fire \u2014 but the horror begins', source: 'passive' });
    }
  }

  // === VOLLEY 9 EVENTS (Part 3: Gorge) ===
  if (volleyIdx === 8) {
    if (step === DrillStep.Endure) {
      log.push({
        turn, type: 'event',
        text: 'Screams from below. Not the screams of battle \u2014 the screams of trapped men dying. The sound carries up the gorge walls and will not stop.',
      });
      moraleChanges.push({ amount: -3, reason: 'The sound of trapped men dying', source: 'event' });
      if (state.player.awareness > 40) {
        log.push({
          turn, type: 'event',
          text: 'Among the white coats below, you see a face. A boy. Younger than Jean-Baptiste. He is trying to climb the gorge wall with hands that leave red smears on the rock.',
        });
        moraleChanges.push({ amount: -2, reason: 'A boy among the dying', source: 'event' });
      }
    }
  }

  // === VOLLEY 10 EVENTS (Part 3: Gorge) ===
  if (volleyIdx === 9) {
    if (step === DrillStep.Endure) {
      log.push({
        turn, type: 'event',
        text: 'Austrian wounded call for help. "Hilfe! Bitte!" The words need no translation. Some men on the ridge stop loading. Others fire faster, wanting it to end.',
      });
      moraleChanges.push({ amount: -4, reason: 'This is no longer battle \u2014 it\'s slaughter', source: 'event' });
      if (state.gorgeMercyCount > 0) {
        log.push({
          turn, type: 'event',
          text: 'You did not fire every time. That small mercy sits in your chest like a stone \u2014 cold, hard, but real.',
        });
        moraleChanges.push({ amount: 3, reason: 'At least you showed mercy', source: 'recovery' });
      }
    }
  }

  // === VOLLEY 11 EVENTS (Part 3: Gorge) ===
  if (volleyIdx === 10) {
    if (step === DrillStep.Endure) {
      if (state.wagonDamage < 100) {
        // Scripted wagon detonation — artillery hits it
        log.push({
          turn, type: 'event',
          text: 'A French cannon on the ridge fires into the gorge. The ball strikes the ammunition wagon squarely. For a heartbeat, nothing.\n\nThen the world splits open.\n\nThe explosion lifts the wagon off the ground. A column of fire and smoke erupts from the gorge floor. The blast rolls outward \u2014 bodies, debris, shattered timber thrown against the gorge walls. The shockwave hits the ridge like a physical blow.\n\nWhen the smoke clears, a crater marks where the wagon stood. Around it, nothing moves.',
        });
        state.wagonDamage = 100;
        state.enemy.strength = Math.max(0, state.enemy.strength - 30);
        moraleChanges.push({ amount: 10, reason: 'The ammunition wagon detonates \u2014 artillery hit', source: 'event' });
      } else {
        // Already detonated by player
        log.push({
          turn, type: 'event',
          text: 'Where the wagon was, a smoking crater. The gorge is silent. White flags hang from musket barrels, from hands, from sticks. The Austrian column \u2014 what remains of it \u2014 has ceased to exist as a fighting force.',
        });
        moraleChanges.push({ amount: 3, reason: 'The gorge falls silent', source: 'recovery' });
      }
    }
  }

  return { log, moraleChanges };
}

// ============================================================
// JEAN-BAPTISTE CRISIS (Volley 2, ENDURE)
// ============================================================

export function resolveJBCrisis(
  state: BattleState, actionId: ActionId
): { moraleChanges: MoraleChange[]; log: LogEntry[]; lineMoraleBoost: number } {
  const turn = state.turn;
  state.jbCrisisResolved = true;

  if (actionId === ActionId.SteadyNeighbour) {
    const { success } = rollValor(state.player.valor, 0);

    if (success) {
      state.jbCrisisOutcome = 'steadied';
      if (state.line.rightNeighbour) {
        state.line.rightNeighbour.morale = state.line.rightNeighbour.maxMorale * 0.5;
        state.line.rightNeighbour.threshold = MoraleThreshold.Shaken;
      }
      state.player.reputation += 5;
      state.player.ncoApproval = Math.min(100, state.player.ncoApproval + 8);
      state.player.valor += 2;
      return {
        moraleChanges: [
          { amount: 5, reason: 'You steadied Jean-Baptiste — leadership', source: 'action' },
        ],
        log: [{
          turn, type: 'action',
          text: `You grab Jean-Baptiste's collar. Hard. He flinches — looks at you with the eyes of a drowning man.\n\n"Jean-Baptiste. LOOK AT ME." Your voice cuts through the guns. Where does it come from — this steadiness? You don't know. "We are here. We hold. Together."\n\nSomething shifts behind his eyes. His breathing slows. Not steady — he'll never be steady today — but he bends down, picks up his musket. His hands still shake. But he raises it.\n\nSergeant Duval sees. Says nothing. Nods once.`,
        }],
        lineMoraleBoost: 5,
      };
    } else {
      state.jbCrisisOutcome = 'failed';
      if (state.line.rightNeighbour) {
        state.line.rightNeighbour.morale = state.line.rightNeighbour.maxMorale * 0.3;
        state.line.rightNeighbour.threshold = MoraleThreshold.Wavering;
      }
      return {
        moraleChanges: [
          { amount: -3, reason: 'You tried — your own fear showed through', source: 'action' },
        ],
        log: [{
          turn, type: 'action',
          text: `You reach for Jean-Baptiste's arm. "Steady, lad. Steady —" But your voice cracks. He looks at you and sees the truth: you are barely holding yourself together.\n\nHe doesn't run. Not quite. But the words didn't reach him. He picks up his musket like a man in a dream. Going through the motions. Nothing behind the eyes.\n\nYou tried. It wasn't enough.`,
        }],
        lineMoraleBoost: -2,
      };
    }
  }

  if (actionId === ActionId.StandFirm) {
    state.jbCrisisOutcome = 'ignored';
    if (state.line.rightNeighbour) {
      state.line.rightNeighbour.morale = state.line.rightNeighbour.maxMorale * 0.25;
      state.line.rightNeighbour.threshold = MoraleThreshold.Wavering;
    }
    return {
      moraleChanges: [],
      log: [{
        turn, type: 'action',
        text: `Jean-Baptiste is shaking apart beside you. His musket on the ground. His hands clawing at nothing.\n\nYou look away. Focus on your own weapon. Your own breathing. Your own survival.\n\nSomehow, he finds his feet. Picks up the musket. Not because of you. Despite you. Pierre barks something at him from the other side — just a word, sharp and hard — and the boy straightens. Barely.\n\nThe line holds. But something hollow opened up in the space between you.`,
      }],
      lineMoraleBoost: -5,
    };
  }

  // Duck, Pray, DrinkWater, or other — cowardice/inaction response
  state.jbCrisisOutcome = 'shaken';
  if (state.line.rightNeighbour) {
    state.line.rightNeighbour.morale = state.line.rightNeighbour.maxMorale * 0.20;
    state.line.rightNeighbour.threshold = MoraleThreshold.Breaking;
  }
  const cowardAct = actionId === ActionId.Duck ? 'flinch and duck' :
                    actionId === ActionId.Pray ? 'close your eyes and mutter prayers' :
                    'turn away';
  return {
    moraleChanges: [],
    log: [{
      turn, type: 'event',
      text: `Jean-Baptiste looks to you — his neighbour, his anchor in the line — and sees you ${cowardAct}.\n\nWhatever thin thread was holding him together nearly snaps. His face goes blank. The musket slips from his grip. He is visibly breaking — but Pierre barks something at him from the other side, sharp as a slap, and the boy bends down, picks up his musket with shaking hands.\n\nHe holds. Barely. Not because of you.`,
    }],
    lineMoraleBoost: -8,
  };
}

// ============================================================
// SCRIPTED RETURN FIRE (ENDURE step)
// ============================================================

export function resolveScriptedReturnFire(
  state: BattleState, volleyIdx: number
): { moraleChanges: MoraleChange[]; log: LogEntry[]; healthDamage: number } {
  const def = VOLLEY_DEFS[volleyIdx];
  const moraleChanges: MoraleChange[] = [];
  const log: LogEntry[] = [];
  let healthDamage = 0;

  const hitChance = state.player.duckedLastTurn ? def.enemyReturnFireChance * 0.3 : def.enemyReturnFireChance;

  if (Math.random() < hitChance) {
    const [min, max] = def.enemyReturnFireDamage;
    healthDamage = min + Math.floor(Math.random() * (max - min));

    // Fatal hit check (only at close range — volleys 3-4; volleys 1-2 are wounds only)
    const fatalChance = volleyIdx >= 2 ? 0.12 : 0;
    if (fatalChance > 0 && Math.random() < fatalChance) {
      healthDamage = 999; // Will trigger death
      const deathTexts = [
        'A ball strikes you square in the chest. The world tilts. The sky fills your vision. The last thing you hear is the drums.',
        'Something punches you in the side. Hard. You look down. The red spreading across your coat is the last colour you ever see.',
      ];
      log.push({ turn: state.turn, text: deathTexts[Math.floor(Math.random() * deathTexts.length)], type: 'event' });
    } else {
      moraleChanges.push({ amount: -8, reason: 'You\'ve been hit', source: 'event' });
      const wounds = ['arm', 'shoulder', 'thigh', 'side', 'hand'];
      const wound = wounds[Math.floor(Math.random() * wounds.length)];
      log.push({
        turn: state.turn, type: 'event',
        text: `A ball grazes your ${wound}. White-hot pain. Blood, warm and immediate. You're still standing. Keep loading. Don't look at it. Don't look at it.`,
      });
    }
  }

  return { moraleChanges, log, healthDamage };
}

// ============================================================
// SCRIPTED AVAILABLE ACTIONS
// ============================================================

export function getScriptedAvailableActions(state: BattleState): Action[] {
  const volleyIdx = state.scriptedVolley - 1;
  if (volleyIdx < 0 || volleyIdx > 10) return getAvailableActions(state);

  // Gorge-specific actions (Part 3)
  if (state.battlePart === 3) {
    if (state.drillStep === DrillStep.Present) {
      return [
        { id: ActionId.TargetColumn, name: 'Target the Column',
          description: 'Fire into the packed ranks below. Easy target. Devastating.',
          minThreshold: MoraleThreshold.Breaking, available: true, drillStep: DrillStep.Present },
        { id: ActionId.TargetOfficers, name: 'Target an Officer',
          description: 'Pick out the man with the gorget and sash. Harder shot \u2014 bigger effect.',
          minThreshold: MoraleThreshold.Shaken, available: true, drillStep: DrillStep.Present },
        { id: ActionId.TargetWagon, name: 'Target the Ammo Wagon',
          description: 'The powder wagon, tilted on the gorge road. One good hit...',
          minThreshold: MoraleThreshold.Shaken, available: state.wagonDamage < 100, drillStep: DrillStep.Present },
        { id: ActionId.ShowMercy, name: 'Show Mercy',
          description: 'Lower your musket. These men are already beaten. The line fires without you.',
          minThreshold: MoraleThreshold.Breaking, available: true, drillStep: DrillStep.Present },
      ];
    }
    if (state.drillStep === DrillStep.Fire) {
      return [
        { id: ActionId.Fire, name: 'Fire', description: 'Fire into the gorge.',
          minThreshold: MoraleThreshold.Breaking, available: true, drillStep: DrillStep.Fire },
      ];
    }
    return getAvailableActions(state);
  }

  // Normal scripted volleys (Parts 1 & 2)
  let actions = getAvailableActions(state);
  const def = VOLLEY_DEFS[volleyIdx];

  // Remove restricted actions for this volley
  actions = actions.filter(a => !def.restrictedActions.includes(a.id));

  // Volley 2 ENDURE: relabel SteadyNeighbour for JB crisis
  if (state.scriptedVolley === 2 && state.drillStep === DrillStep.Endure && !state.jbCrisisResolved) {
    const steadyAction = actions.find(a => a.id === ActionId.SteadyNeighbour);
    if (steadyAction) {
      steadyAction.name = 'Grab Jean-Baptiste';
      steadyAction.description = 'He\'s about to bolt. Grab his shoulder. Look him in the eye. Find the words. [Valor check]';
    }
    // Relabel StandFirm for context
    const standAction = actions.find(a => a.id === ActionId.StandFirm);
    if (standAction) {
      standAction.name = 'Focus on Yourself';
      standAction.description = 'Jean-Baptiste is not your problem. Keep your own musket ready. Let someone else handle it.';
    }
  }

  return actions;
}
