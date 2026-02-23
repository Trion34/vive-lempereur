import {
  BattleState,
  DrillStep,
  MoraleThreshold,
} from '../../types';
import { VOLLEY_DEFS } from './constants';

// ============================================================
// VOLLEY NARRATIVES (per volley x drill step)
// ============================================================

export function getVolleyNarrative(volleyIdx: number, step: DrillStep, state: BattleState): string {
  const range = VOLLEY_DEFS[volleyIdx].range;

  // FIRE narratives (captain's order — appears before fire resolution)
  if (step === DrillStep.Fire) {
    const fireOrders: Record<number, string> = {
      0: `"Feu!"`,
      1: `"FIRE!"`,
      2: `"FIRE!"`,
      3: `"Tirez!"`,
      4: `"Feu!"`,
      5: `"FIRE!"`,
      6: `"TIREZ!"`,
      7: `"Fire at will!"`,
      8: `"Again!"`,
      9: `"Fire!"`,
      10: `"Final volley!"`,
    };
    return fireOrders[volleyIdx] || '"FIRE!"';
  }

  // PRESENT narratives
  if (step === DrillStep.Present) {
    const presentNarratives: Record<number, string> = {
      0: `Present arms. ${range} paces.`,
      1: `Present. 80 paces.`,
      2: `Present. 50 paces.`,
      3: `Present. 25 paces. Last volley.`,
      4: `Present. ${range} paces. Fresh column.`,
      5: `Present. 60 paces. Right flank open.`,
      6: `Present. 40 paces. Last volley.`,
      7: `Fire at will. Gorge below.`,
      8: `Reload. More targets below.`,
      9: `Column breaking. Wagon visible.`,
      10: `Last column. Wagon exposed.`,
    };
    let text = presentNarratives[volleyIdx] || '';

    if (state.player.moraleThreshold === MoraleThreshold.Shaken) {
      text += ' Hands unsteady.';
    } else if (state.player.moraleThreshold === MoraleThreshold.Wavering) {
      text += ' Want to run.';
    } else if (state.player.moraleThreshold === MoraleThreshold.Breaking) {
      text += " Can't stop shaking.";
    }
    return text;
  }

  // ENDURE narratives
  if (step === DrillStep.Endure) {
    const endureNarratives: Record<number, string> = {
      0: 'Return fire.',
      1: 'Return fire.',
      2: 'Return fire. Men fall.',
      3: 'Fix bayonets.',
      4: 'Return fire. Fresh muskets.',
      5: 'Return fire. Surrounded.',
      6: 'Bonaparte on the ridge. Counterattack ordered.',
      7: 'Scattered return fire from below.',
      8: 'Screams from below.',
      9: 'Wounded call for help.',
      10: "Silence. It's over.",
    };
    return endureNarratives[volleyIdx] || '';
  }

  return '';
}
