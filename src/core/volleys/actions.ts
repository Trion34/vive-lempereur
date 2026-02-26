import {
  BattleState,
  ActionId,
  DrillStep,
  MoraleThreshold,
  Action,
} from '../../types';

// ============================================================
// SCRIPTED AVAILABLE ACTIONS
// ============================================================

export function getScriptedAvailableActions(state: BattleState): Action[] {
  // Gorge-specific actions (Part 3)
  if (state.ext.battlePart === 3) {
    if (state.drillStep === DrillStep.Present) {
      return [
        {
          id: ActionId.TargetColumn,
          name: 'Target the Column',
          description: 'Fire into the packed ranks below. Easy target. Devastating.',
          minThreshold: MoraleThreshold.Breaking,
          available: true,
          drillStep: DrillStep.Present,
        },
        {
          id: ActionId.TargetOfficers,
          name: 'Target an Officer',
          description:
            'Pick out the man with the gorget and sash. Harder shot \u2014 bigger effect.',
          minThreshold: MoraleThreshold.Shaken,
          available: true,
          drillStep: DrillStep.Present,
        },
        {
          id: ActionId.TargetWagon,
          name: 'Target the Ammo Wagon',
          description: 'The powder wagon, tilted on the gorge road. One good hit...',
          minThreshold: MoraleThreshold.Shaken,
          available: (state.ext.wagonDamage as number) < 100,
          drillStep: DrillStep.Present,
        },
        {
          id: ActionId.ShowMercy,
          name: 'Show Mercy',
          description:
            'Lower your musket. These men are already beaten. The line fires without you.',
          minThreshold: MoraleThreshold.Breaking,
          available: true,
          drillStep: DrillStep.Present,
        },
      ];
    }
    if (state.drillStep === DrillStep.Fire) {
      return [
        {
          id: ActionId.Fire,
          name: 'Fire',
          description: 'Fire into the gorge.',
          minThreshold: MoraleThreshold.Breaking,
          available: true,
          drillStep: DrillStep.Fire,
        },
      ];
    }
  }

  // Parts 1 & 2: all actions handled by auto-play
  return [];
}
