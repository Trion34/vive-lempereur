import {
  BattleState,
  DrillStep,
  MoraleThreshold,
} from '../../types';
import type { VolleyConfig } from '../../data/battles/types';
import { RIVOLI_VOLLEYS } from '../../data/battles/rivoli/volleys';

// ============================================================
// VOLLEY NARRATIVES — reads from config
// ============================================================

export function getVolleyNarrative(
  volleyIdx: number,
  step: DrillStep,
  state: BattleState,
  volleys: VolleyConfig[] = RIVOLI_VOLLEYS,
): string {
  const config = volleys[volleyIdx];
  if (!config) return '';

  if (step === DrillStep.Fire) {
    return config.narratives.fireOrder;
  }

  if (step === DrillStep.Present) {
    let text = config.narratives.present;
    if (state.player.moraleThreshold === MoraleThreshold.Shaken) {
      text += ' Hands unsteady.';
    } else if (state.player.moraleThreshold === MoraleThreshold.Wavering) {
      text += ' Want to run.';
    } else if (state.player.moraleThreshold === MoraleThreshold.Breaking) {
      text += " Can't stop shaking.";
    }
    return text;
  }

  if (step === DrillStep.Endure) {
    return config.narratives.endure;
  }

  return '';
}
