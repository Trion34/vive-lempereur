import React from 'react';
import type { BattleState } from '../../types';
import { BattlePhase, DrillStep } from '../../types';

interface DrillIndicatorProps {
  battleState: BattleState;
}

const STEPS: { step: DrillStep; label: string }[] = [
  { step: DrillStep.Present, label: 'PRESENT' },
  { step: DrillStep.Fire, label: 'FIRE' },
  { step: DrillStep.Endure, label: 'ENDURE' },
  { step: DrillStep.Load, label: 'LOAD' },
];

export function DrillIndicator({ battleState }: DrillIndicatorProps) {
  // Hide during story beat and melee phases
  if (
    battleState.phase === BattlePhase.StoryBeat ||
    battleState.phase === BattlePhase.Melee
  ) {
    return null;
  }

  return (
    <div className="drill-indicator" id="drill-indicator">
      {STEPS.map(({ step, label }) => {
        const isActive = step === battleState.drillStep;
        const isAuto = step === DrillStep.Load;
        const classes = [
          'drill-step',
          isActive ? 'active' : '',
          isAuto ? 'auto' : '',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <div key={step} className={classes} data-step={step}>
            {label}
          </div>
        );
      })}
    </div>
  );
}
