/* ------------------------------------------------------------------ */
/*  Line Combat Converter — lab types → game VolleyMechanics           */
/* ------------------------------------------------------------------ */

import type { VolleyMechanics } from '@game/data/battles/types';
import type { LabVolleyEntry } from '../types/lineCombatTypes';

/** Convert a lab volley entry to game VolleyMechanics (pure data, no events) */
export function labVolleyToMechanics(lab: LabVolleyEntry): VolleyMechanics {
  return {
    range: lab.def.range,
    fireAccuracyBase: lab.def.fireAccuracyBase,
    perceptionBase: lab.def.perceptionBase,
    enemyReturnFireChance: lab.def.enemyReturnFireChance,
    enemyReturnFireDamage: lab.def.enemyReturnFireDamage,
    enemyLineDamage: lab.def.enemyLineDamage,
    narratives: {
      present: lab.narratives.present,
      fireOrder: lab.narratives.fireOrder,
      endure: lab.narratives.endure,
      fireHit: lab.narratives.fireHit,
      fireMiss: lab.narratives.fireMiss,
    },
    returnFire: (lab.returnFire.frontRankBonus !== 0 || lab.returnFire.fatalChance !== 0)
      ? { frontRankBonus: lab.returnFire.frontRankBonus, fatalChance: lab.returnFire.fatalChance }
      : undefined,
    staminaCost: lab.stamina.cost,
    staminaRecovery: lab.stamina.recovery,
  };
}
