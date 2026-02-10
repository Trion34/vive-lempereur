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

export const VOLLEY_RANGES = [120, 80, 50, 25] as const;

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
      0: `"Feu!" The captain's sword drops.`,
      1: `"FIRE!" The word tears down the line.`,
      2: `"FIRE!" At fifty paces, the captain's voice is raw.`,
      3: `"Tirez! Dernière salve!" The final command.`,
    };
    return fireOrders[volleyIdx] || '"FIRE!"';
  }

  // PRESENT narratives
  if (step === DrillStep.Present) {
    const presentNarratives: Record<number, string> = {
      0: `"Présentez armes!" The order carries down the line like a wave. Three hundred muskets rise as one. At ${range} paces, you can make out the Austrian line through the dawn haze — the Habsburg column in their white crossbelts, steel points glinting like a hedge of thorns.\n\nThis is your first volley.`,
      1: `"PRESENT!" Eighty paces now. Close enough to see faces — strained, pale, human. Close enough to see that they are afraid too. Beside you, Jean-Baptiste\'s musket wavers. His breathing comes in sharp, ragged gasps.`,
      2: `"PRESENT!" Fifty paces. You can see their buttons. Their teeth. A man in their front rank is mouthing a prayer — the same prayer you\'ve been muttering. The air stinks of powder and iron and something else. Blood, maybe.`,
      3: `"Encore une salve! En avant après!" The captain\'s voice is hoarse but carries. Twenty-five paces. You can see their eyes — wide, terrified, defiant. The same eyes you see in every mirror.\n\nThis is the last musketry exchange. After this, cold steel.`,
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
      0: 'The return volley comes — a ripple of flame and smoke from their line. Balls whip overhead, thud into earth, crack against musket stocks. A man two files down screams. The sound cuts through the guns.',
      1: 'They return fire. At eighty paces, every ball finds something. Through the haze you glimpse the white coats reloading — methodical, mechanical. The line shudders. You hear impacts — soft, horrible sounds — and a voice calling for water.',
      2: 'Their volley tears through the line like a scythe. At fifty paces there is no hiding. You stand in the open and take it. Men fall. The rear rank closes up, stepping over the fallen.',
      3: '"FIX BAYONETS!" The order comes the instant the smoke clears. Bayonets rasp from scabbards up and down the line. Steel clicks onto muzzles. The drums shift to the pas de charge.\n\nThe enemy is twenty-five paces away. And coming.',
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
      // Artillery barrage
      log.push({ turn, text: 'A shell bursts twenty paces behind the line. Earth and iron rain down. The battery is finding its range.', type: 'event' });
      moraleChanges.push({ amount: -5, reason: 'Artillery barrage', source: 'event' });
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
        text: 'Beside you, Jean-Baptiste\'s hands are shaking so hard his ramrod rattles against the barrel. His lips are moving but no sound comes out. His eyes have that look — the one that says a man is not here anymore.',
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
      // Pierre is hit
      if (state.line.leftNeighbour?.alive && !state.line.leftNeighbour.wounded) {
        log.push({
          turn, type: 'event',
          text: 'A ball clips Pierre\'s shoulder as you raise your musket. He staggers — grunts, just a grunt, like a man bumping furniture. Blood darkens his sleeve immediately.\n\n"It\'s nothing," he says. His face is grey. It is not nothing.\n\nThe veteran — your anchor — is wounded. You are now the steadiest man in your section.',
        });
        moraleChanges.push({ amount: -8, reason: 'Pierre is hit — your anchor is down', source: 'event' });
        state.line.leftNeighbour.wounded = true;
        state.line.leftNeighbour.morale = Math.max(0, state.line.leftNeighbour.morale - 20);
        state.line.casualtiesThisTurn += 1;
      }

      // Officer dismounts
      if (state.line.officer.alive && state.line.officer.mounted) {
        state.line.officer.mounted = false;
        state.line.officer.status = 'On foot, rallying';
      }

      // JB routes if crisis was worsened
      if (state.jbCrisisOutcome === 'worsened' && state.line.rightNeighbour?.alive && !state.line.rightNeighbour.routing) {
        state.line.rightNeighbour.routing = true;
        state.line.rightNeighbour.morale = 0;
        state.line.lineIntegrity = Math.max(0, state.line.lineIntegrity - 12);
        log.push({
          turn, type: 'event',
          text: 'Jean-Baptiste breaks. He throws down his musket and runs — scrambling over the dead, shoving past the rear rank, gone. The hole in the line gapes. You could have stopped this.',
        });
        moraleChanges.push({ amount: -6, reason: 'Jean-Baptiste routed', source: 'contagion' });
      }
    }
    if (step === DrillStep.Endure) {
      // Artillery stops
      state.enemy.artillery = false;
      log.push({ turn, text: 'Their guns have gone silent. Too close for cannon now. Small mercy — the musketry more than makes up for it.', type: 'event' });

      // Near-miss cannonball lane (last artillery act)
      log.push({ turn, text: 'A final roundshot bounces through the rank two files over. Three men gone in an instant. The sound is wet. Don\'t look.', type: 'event' });
      moraleChanges.push({ amount: -6, reason: 'Cannonball lane — men torn apart', source: 'event' });
      state.line.casualtiesThisTurn += 3;
      state.line.lineIntegrity = Math.max(0, state.line.lineIntegrity - 8);

      // Officer rallies
      if (state.line.officer.alive) {
        log.push({ turn, text: 'Captain Leclerc strides down the line, sword drawn. "Steady! One more volley, then cold steel! En avant!" His voice carries above the carnage.', type: 'event' });
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
      // Enemy preparing to charge
      log.push({
        turn, type: 'event',
        text: 'Their drums beat the Sturmmarsch. The Austrian column surges forward — steel levelled, mouths open in a scream you can barely hear over the guns. The Habsburg infantry is coming.',
      });
      moraleChanges.push({ amount: -4, reason: 'The enemy is charging', source: 'event' });
      state.enemy.morale = 'charging';
    }
    if (step === DrillStep.Endure) {
      // Bayonets fixed
      log.push({
        turn, type: 'event',
        text: 'Bayonets rasp from scabbards up and down the line. Steel clicks onto muzzles. The familiar weight changes — your musket is now a spear.',
      });

      // Pierre picks up a musket (if alive)
      if (state.line.leftNeighbour?.alive) {
        log.push({
          turn, type: 'event',
          text: 'Pierre picks up a discarded musket with his good hand and fixes the bayonet. Blood still dripping down his sleeve. "Not done yet," he says.',
        });
        moraleChanges.push({ amount: 2, reason: 'Pierre\'s courage', source: 'recovery' });
      }

      // Jean-Baptiste (if still present)
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
  state.jbCrisisOutcome = 'worsened';
  if (state.line.rightNeighbour) {
    state.line.rightNeighbour.morale = state.line.rightNeighbour.maxMorale * 0.12;
    state.line.rightNeighbour.threshold = MoraleThreshold.Breaking;
  }
  const cowardAct = actionId === ActionId.Duck ? 'flinch and duck' :
                    actionId === ActionId.Pray ? 'close your eyes and mutter prayers' :
                    'turn away';
  return {
    moraleChanges: [],
    log: [{
      turn, type: 'event',
      text: `Jean-Baptiste looks to you — his neighbour, his anchor in the line — and sees you ${cowardAct}.\n\nWhatever thin thread was holding him together snaps. His face goes blank. The musket slips from his grip. He is still standing, technically, but the man behind his eyes has already fled.\n\nHe will break. Not now. Soon. And you could have stopped it.`,
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
  let actions = getAvailableActions(state);
  const volleyIdx = state.scriptedVolley - 1;
  if (volleyIdx < 0 || volleyIdx > 3) return actions;

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
