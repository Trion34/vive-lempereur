import React from 'react';
import type { BattleState } from '../../types';
import { BattlePhase, DrillStep } from '../../types';

interface DrillIndicatorProps {
  battleState: BattleState;
}

const STEPS: { step: DrillStep; label: string }[] = [
  { step: DrillStep.Load, label: 'LOAD' },
  { step: DrillStep.Present, label: 'PRESENT' },
  { step: DrillStep.Fire, label: 'FIRE' },
  { step: DrillStep.Endure, label: 'ENDURE' },
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
      {STEPS.map(({ step, label }, index) => {
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
          <React.Fragment key={step}>
            {index > 0 && <div className="drill-arrow">{'\u2192'}</div>}
            <div className={classes} data-step={step}>
              {label}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
