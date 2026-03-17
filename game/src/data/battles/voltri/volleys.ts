import type { BattleState, LogEntry, MoraleChange } from '../../../types';
import { DrillStep } from '../../../types';
import type { VolleyConfig, VolleyEventResult } from '../types';

// ============================================================
// VOLTRI VOLLEY EVENT FUNCTIONS
// ============================================================

function volley1Events(state: BattleState, step: DrillStep): VolleyEventResult {
  const turn = state.turn;
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];

  if (step === DrillStep.Fire) {
    log.push({ turn, text: 'First volley crashes out. Smoke rolls across the hillside.', type: 'event' });
    moraleChanges.push({ amount: 3, reason: 'First volley — the musket does its work', source: 'recovery' });
  }
  if (step === DrillStep.Endure) {
    moraleChanges.push({ amount: -2, reason: 'Under fire for the first time', source: 'passive' });
    moraleChanges.push({ amount: 2, reason: 'Sergeant Morin steadies the section', source: 'recovery' });
  }
  return { log, moraleChanges };
}

function volley2Events(state: BattleState, step: DrillStep): VolleyEventResult {
  const turn = state.turn;
  const log: LogEntry[] = [];
  const moraleChanges: MoraleChange[] = [];

  if (step === DrillStep.Fire) {
    log.push({ turn, text: 'The second volley hits home. White coats stumble in the olive groves.', type: 'event' });
    moraleChanges.push({ amount: 2, reason: 'Good shooting — Austrians falter', source: 'recovery' });
  }
  if (step === DrillStep.Endure) {
    log.push({ turn, text: 'Austrian return fire. Ball hits the man two files over.', type: 'event' });
    moraleChanges.push({ amount: -4, reason: 'Man killed in the section', source: 'event' });
    moraleChanges.push({ amount: -2, reason: 'Under fire at closer range', source: 'passive' });
    state.line.lineIntegrity = Math.max(0, state.line.lineIntegrity - 4);
  }
  return { log, moraleChanges };
}

// ============================================================
// VOLTRI VOLLEY CONFIGS (2 tutorial volleys)
// ============================================================

export const VOLTRI_VOLLEYS: VolleyConfig[] = [
  {
    // Volley 1: 150 paces — first exchange on the heights
    def: {
      range: 150,
      fireAccuracyBase: 0.15,
      perceptionBase: 0.1,
      enemyReturnFireChance: 0.1,
      enemyReturnFireDamage: [5, 10],
      enemyLineDamage: 4,
    },
    narratives: {
      fireOrder: '"Feu!" Sergeant Morin\'s voice cuts through the wind.',
      present: 'Present arms. 150 paces. The Austrians are climbing the slope.',
      endure: 'Return fire from the olive groves.',
      fireHit: ['Hit. An Austrian stumbles and falls among the olive trees.'],
      fireMiss: ['Miss. The ball clips branches overhead.'],
    },
    events: volley1Events,
    returnFire: { frontRankBonus: 0.1, fatalChance: 0 },
    staminaCost: 12,
    staminaRecovery: 4,
  },
  {
    // Volley 2: 100 paces — closer engagement
    def: {
      range: 100,
      fireAccuracyBase: 0.25,
      perceptionBase: 0.2,
      enemyReturnFireChance: 0.18,
      enemyReturnFireDamage: [7, 13],
      enemyLineDamage: 6,
    },
    narratives: {
      fireOrder: '"FIRE!" The line erupts.',
      present: 'Present. 100 paces. They keep coming.',
      endure: 'Austrian return fire tears through the position.',
      fireHit: ['Hit. Target down in the scrub.'],
      fireMiss: ['Miss. The smoke makes it hard to see.'],
    },
    events: volley2Events,
    returnFire: { frontRankBonus: 0.1, fatalChance: 0 },
    staminaCost: 12,
    staminaRecovery: 4,
  },
];
