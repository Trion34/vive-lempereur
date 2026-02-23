import {
  BattleState,
  DrillStep,
  MoraleThreshold,
  LogEntry,
  MoraleChange,
  getMoraleThreshold,
} from '../../types';
import { VOLLEY_DEFS } from './constants';

// ============================================================
// SCRIPTED EVENTS (per volley x drill step)
// ============================================================

export function resolveScriptedEvents(
  state: BattleState,
  step: DrillStep,
): { log: LogEntry[]; moraleChanges: MoraleChange[] } {
  const volleyIdx = state.scriptedVolley - 1;
  const turn = state.turn;
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];

  // === VOLLEY 1 EVENTS ===
  if (volleyIdx === 0) {
    if (step === DrillStep.Fire) {
      // Successful volley recovery
      log.push({ turn, text: 'First volley hit.', type: 'event' });
      moraleChanges.push({ amount: 2, reason: 'First volley struck home', source: 'recovery' });
    }
    if (step === DrillStep.Endure) {
      // Sounds of battle from the right flank
      log.push({ turn, text: 'Fighting on the right.', type: 'event' });
      moraleChanges.push({ amount: -4, reason: 'Sounds of battle on the right', source: 'event' });
      // Range pressure + recovery (replaces passive drain system during scripted phase)
      moraleChanges.push({ amount: -2, reason: 'Under fire at medium range', source: 'passive' });
      moraleChanges.push({ amount: 2, reason: 'The drums steady the line', source: 'recovery' });
      // Neighbour contagion
      if (state.line.leftNeighbour?.alive && !state.line.leftNeighbour.routing) {
        const t = getMoraleThreshold(
          state.line.leftNeighbour.morale,
          state.line.leftNeighbour.maxMorale,
        );
        moraleChanges.push({
          amount: t === MoraleThreshold.Steady ? 2 : t === MoraleThreshold.Wavering ? -3 : 0,
          reason: `${state.line.leftNeighbour.name} stands firm`,
          source: 'contagion',
        });
      }
      if (state.line.rightNeighbour?.alive && !state.line.rightNeighbour.routing) {
        const t = getMoraleThreshold(
          state.line.rightNeighbour.morale,
          state.line.rightNeighbour.maxMorale,
        );
        moraleChanges.push({
          amount: t === MoraleThreshold.Steady ? 2 : t === MoraleThreshold.Wavering ? -3 : 0,
          reason: `${state.line.rightNeighbour.name} stands firm`,
          source: 'contagion',
        });
      }
    }
  }

  // === VOLLEY 2 EVENTS ===
  if (volleyIdx === 1) {
    if (step === DrillStep.Fire) {
      // First visible casualty in your section
      log.push({ turn, text: 'Man killed nearby.', type: 'event' });
      moraleChanges.push({ amount: -3, reason: 'Man killed in your section', source: 'event' });
      state.line.lineIntegrity = Math.max(0, state.line.lineIntegrity - 3);
    }
    if (step === DrillStep.Endure) {
      // Range pressure + recovery
      moraleChanges.push({ amount: -3, reason: 'Enemy at close range', source: 'passive' });
      moraleChanges.push({ amount: 2, reason: 'The drums hold steady', source: 'recovery' });
      // Neighbour contagion
      if (state.line.leftNeighbour?.alive && !state.line.leftNeighbour.routing) {
        moraleChanges.push({
          amount: 2,
          reason: `${state.line.leftNeighbour.name} stands firm`,
          source: 'contagion',
        });
      }
    }
  }

  // === VOLLEY 3 EVENTS ===
  if (volleyIdx === 2) {
    if (step === DrillStep.Present) {
      // Pierre is grazed — wounded but keeps fighting
      if (state.line.leftNeighbour?.alive && !state.line.leftNeighbour.wounded) {
        log.push({ turn, type: 'event', text: 'Pierre hit. Shoulder. Still fighting.' });
        moraleChanges.push({
          amount: -6,
          reason: 'Pierre is hit — wounded but fighting',
          source: 'event',
        });
        state.line.leftNeighbour.wounded = true;
        state.line.leftNeighbour.morale = Math.max(0, state.line.leftNeighbour.morale - 15);
        state.line.casualtiesThisTurn += 1;
      }

      // Officer dismounts
      if (state.line.officer.alive && state.line.officer.mounted) {
        state.line.officer.mounted = false;
        state.line.officer.status = 'On foot, rallying';
      }
    }
    if (step === DrillStep.Endure) {
      // Artillery ceases — too close
      state.enemy.artillery = false;
      log.push({ turn, text: 'Artillery silent. Too close.', type: 'event' });

      // Reports of pressure on the left
      log.push({ turn, text: 'Left flank under pressure.', type: 'event' });
      moraleChanges.push({ amount: -5, reason: 'Left flank under pressure', source: 'event' });
      state.line.lineIntegrity = Math.max(0, state.line.lineIntegrity - 5);

      // Officer rallies
      if (state.line.officer.alive) {
        log.push({ turn, text: 'Leclerc: "Steady, Fourteenth!"', type: 'event' });
        moraleChanges.push({ amount: 4, reason: 'Captain rallies the line', source: 'recovery' });
      }
      // Range pressure + contagion
      moraleChanges.push({ amount: -4, reason: 'Enemy at close range', source: 'passive' });
      if (state.line.leftNeighbour?.alive && !state.line.leftNeighbour.routing) {
        moraleChanges.push({
          amount: state.line.leftNeighbour.wounded ? 1 : 2,
          reason: `${state.line.leftNeighbour.name} holds the line`,
          source: 'contagion',
        });
      }
      if (state.line.rightNeighbour?.alive && !state.line.rightNeighbour.routing) {
        const t = getMoraleThreshold(
          state.line.rightNeighbour.morale,
          state.line.rightNeighbour.maxMorale,
        );
        const amt = t === MoraleThreshold.Steady || t === MoraleThreshold.Shaken ? 1 : -2;
        moraleChanges.push({
          amount: amt,
          reason: `${state.line.rightNeighbour.name} ${amt > 0 ? 'holds on' : 'is trembling'}`,
          source: 'contagion',
        });
      }
    }
  }

  // === VOLLEY 4 EVENTS ===
  if (volleyIdx === 3) {
    if (step === DrillStep.Present) {
      // Enemy at point blank, left flank news
      log.push({ turn, type: 'event', text: 'Enemy charging. Left flank breaking.' });
      moraleChanges.push({ amount: -4, reason: 'The enemy is charging', source: 'event' });
      moraleChanges.push({ amount: -3, reason: 'Left flank is breaking', source: 'event' });
      state.enemy.morale = 'charging';
    }
    if (step === DrillStep.Endure) {
      // Bayonets fixed
      log.push({ turn, type: 'event', text: 'Bayonets fixed.' });

      // Pierre fixes bayonet
      if (state.line.leftNeighbour?.alive) {
        log.push({ turn, type: 'event', text: 'Pierre fixes bayonet. Still fighting.' });
        moraleChanges.push({ amount: 2, reason: "Pierre's courage", source: 'recovery' });
      }

      // Range pressure at point blank
      moraleChanges.push({
        amount: -5,
        reason: "Point blank — they're right there",
        source: 'passive',
      });
    }
  }

  // === VOLLEY 5 EVENTS (Part 2) ===
  if (volleyIdx === 4) {
    if (step === DrillStep.Present) {
      // Vukassovich artillery resumes
      state.enemy.artillery = true;
      log.push({ turn, type: 'event', text: 'Vukassovich guns open.' });
      moraleChanges.push({
        amount: -5,
        reason: "Vukassovich's artillery resumes",
        source: 'event',
      });
      log.push({ turn, type: 'event', text: 'Mass\u00e9na still fighting.' });
      moraleChanges.push({
        amount: 3,
        reason: "Mass\u00e9na's presence steadies the line",
        source: 'recovery',
      });
    }
    if (step === DrillStep.Endure) {
      // Reuss attacking the Pontare
      log.push({ turn, type: 'event', text: 'Reuss attacks the Pontare.' });
      moraleChanges.push({ amount: -4, reason: 'Reuss attacking the Pontare', source: 'event' });
      moraleChanges.push({
        amount: -2,
        reason: 'Under fire \u2014 tired arms, fresh enemy',
        source: 'passive',
      });
      moraleChanges.push({ amount: 2, reason: 'The drums steady the line', source: 'recovery' });
      if (state.line.leftNeighbour?.alive && !state.line.leftNeighbour.routing) {
        log.push({ turn, type: 'event', text: 'Pierre reloads beside you.' });
        moraleChanges.push({
          amount: 2,
          reason: `${state.line.leftNeighbour.name} holds the line`,
          source: 'contagion',
        });
      }
    }
  }

  // === VOLLEY 6 EVENTS (Part 2) ===
  if (volleyIdx === 5) {
    if (step === DrillStep.Present) {
      // Pontare has fallen
      log.push({ turn, type: 'event', text: 'Pontare fallen. Right flank exposed.' });
      moraleChanges.push({
        amount: -6,
        reason: 'The Pontare has fallen \u2014 right flank exposed',
        source: 'event',
      });
      state.line.lineIntegrity = Math.max(0, state.line.lineIntegrity - 5);

      // Officer rallies
      if (state.line.officer.alive) {
        log.push({ turn, type: 'event', text: 'Leclerc: "Hold the line!"' });
        moraleChanges.push({ amount: 3, reason: 'Captain rallies the line', source: 'recovery' });
      }
    }
    if (step === DrillStep.Endure) {
      // Lusignan spotted — surrounded
      log.push({ turn, type: 'event', text: 'Lusignan at Affi. Surrounded.' });
      moraleChanges.push({
        amount: -8,
        reason: 'Surrounded \u2014 Lusignan at Affi',
        source: 'event',
      });
      if (state.line.leftNeighbour?.alive && !state.line.leftNeighbour.routing) {
        log.push({ turn, type: 'event', text: 'Pierre: "We\'ve been in worse."' });
        moraleChanges.push({
          amount: 3,
          reason: 'Pierre: "We\'ve been in worse"',
          source: 'contagion',
        });
      }
      // Range pressure
      moraleChanges.push({
        amount: -3,
        reason: 'Under fire at close range \u2014 exhausted',
        source: 'passive',
      });
    }
  }

  // === VOLLEY 7 EVENTS (Part 2) ===
  if (volleyIdx === 6) {
    if (step === DrillStep.Present) {
      // Men breaking in rear
      log.push({ turn, type: 'event', text: 'Men breaking in the rear.' });
      moraleChanges.push({ amount: -5, reason: 'Men breaking in the rear', source: 'event' });
      state.line.lineIntegrity = Math.max(0, state.line.lineIntegrity - 8);
    }
    if (step === DrillStep.Endure) {
      // Napoleon orders counterattack — the great reversal
      log.push({ turn, type: 'event', text: 'Bonaparte on the ridge. Counterattack ordered.' });
      moraleChanges.push({
        amount: 10,
        reason: 'Napoleon orders the counterattack',
        source: 'recovery',
      });
      if (state.line.officer.alive) {
        log.push({ turn, type: 'event', text: 'Leclerc: "To the ridge!"' });
        moraleChanges.push({ amount: 5, reason: 'Captain: "To the ridge!"', source: 'recovery' });
      }
      // Range pressure (but offset by the massive recovery)
      moraleChanges.push({ amount: -4, reason: 'Under fire at close range', source: 'passive' });
    }
  }

  // === VOLLEY 8 EVENTS (Part 3: Gorge) ===
  if (volleyIdx === 7) {
    if (step === DrillStep.Endure) {
      log.push({ turn, type: 'event', text: 'Men surrendering below. Column still advancing.' });
      if (state.line.leftNeighbour?.alive && !state.line.leftNeighbour.routing) {
        log.push({ turn, type: 'event', text: 'Pierre: "Butcher\'s work." Reloads anyway.' });
      }
      moraleChanges.push({
        amount: -1,
        reason: 'Minimal return fire \u2014 but the horror begins',
        source: 'passive',
      });
    }
  }

  // === VOLLEY 9 EVENTS (Part 3: Gorge) ===
  if (volleyIdx === 8) {
    if (step === DrillStep.Endure) {
      log.push({ turn, type: 'event', text: 'Screams from below.' });
      moraleChanges.push({ amount: -3, reason: 'The sound of trapped men dying', source: 'event' });
      if (state.player.awareness > 40) {
        log.push({ turn, type: 'event', text: 'A boy among the dying.' });
        moraleChanges.push({ amount: -2, reason: 'A boy among the dying', source: 'event' });
      }
    }
  }

  // === VOLLEY 10 EVENTS (Part 3: Gorge) ===
  if (volleyIdx === 9) {
    if (step === DrillStep.Endure) {
      log.push({ turn, type: 'event', text: 'Cries for help. Some men stop firing.' });
      moraleChanges.push({
        amount: -4,
        reason: "This is no longer battle \u2014 it's slaughter",
        source: 'event',
      });
      if (state.gorgeMercyCount > 0) {
        log.push({ turn, type: 'event', text: 'You showed mercy.' });
        moraleChanges.push({ amount: 3, reason: 'At least you showed mercy', source: 'recovery' });
      }
    }
  }

  // === VOLLEY 11 EVENTS (Part 3: Gorge) ===
  if (volleyIdx === 10) {
    if (step === DrillStep.Endure) {
      if (state.wagonDamage < 100) {
        // Scripted wagon detonation — artillery hits it
        log.push({ turn, type: 'event', text: 'Artillery hits wagon. DETONATION.' });
        state.wagonDamage = 100;
        state.enemy.strength = Math.max(0, state.enemy.strength - 30);
        moraleChanges.push({
          amount: 10,
          reason: 'The ammunition wagon detonates \u2014 artillery hit',
          source: 'event',
        });
      } else {
        // Already detonated by player
        log.push({ turn, type: 'event', text: 'The gorge is silent. White flags.' });
        moraleChanges.push({ amount: 3, reason: 'The gorge falls silent', source: 'recovery' });
      }
    }
  }

  return { log, moraleChanges };
}

// ============================================================
// SCRIPTED RETURN FIRE (ENDURE step)
// ============================================================

export function resolveScriptedReturnFire(
  state: BattleState,
  volleyIdx: number,
): { moraleChanges: MoraleChange[]; log: LogEntry[]; healthDamage: number } {
  const def = VOLLEY_DEFS[volleyIdx];
  const moraleChanges: MoraleChange[] = [];
  const log: LogEntry[] = [];
  let healthDamage = 0;

  let hitChance = def.enemyReturnFireChance;
  // Front rank: +15% return fire chance during Part 1 (most exposed position)
  if (state.player.frontRank && state.battlePart === 1) {
    hitChance += 0.15;
  }

  if (Math.random() < hitChance) {
    const [min, max] = def.enemyReturnFireDamage;
    healthDamage = min + Math.floor(Math.random() * (max - min));

    // Fatal hit check (only at close range — volleys 3-4; volleys 1-2 are wounds only)
    const fatalChance = volleyIdx >= 2 ? 0.12 : 0;
    if (fatalChance > 0 && Math.random() < fatalChance) {
      healthDamage = 999; // Will trigger death
      log.push({ turn: state.turn, text: 'Fatal hit.', type: 'event' });
    } else {
      moraleChanges.push({ amount: -8, reason: "You've been hit", source: 'event' });
      const wounds = ['arm', 'shoulder', 'thigh', 'side', 'hand'];
      const wound = wounds[Math.floor(Math.random() * wounds.length)];
      log.push({ turn: state.turn, type: 'event', text: `Hit. ${wound}. Still standing.` });
    }
  }

  return { moraleChanges, log, healthDamage };
}
