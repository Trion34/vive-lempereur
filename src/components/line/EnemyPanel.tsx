import React from 'react';
import type { BattleState } from '../../types';
import { BattlePhase } from '../../types';

interface EnemyPanelProps {
  battleState: BattleState;
}

const QUALITY_LABELS: Record<string, string> = {
  conscript: 'Conscripts',
  line: 'Line Infantry',
  veteran: 'Veterans',
  guard: 'Imperial Guard',
};

const POSTURE_MAP: Record<string, string> = {
  advancing: 'Advancing',
  steady: 'Holding',
  wavering: 'Wavering',
  charging: 'CHARGING!',
  resolute: 'Resolute',
  trapped: 'TRAPPED',
};

function getStrengthLabel(str: number): string {
  if (str >= 80) return 'Full Strength';
  if (str >= 60) return 'Bloodied';
  if (str >= 40) return 'Weakened';
  if (str >= 20) return 'Shattered';
  return 'Broken';
}

function getMoraleStateLabel(strength: number): string {
  if (strength >= 70) return 'Resolute';
  if (strength >= 50) return 'Holding';
  if (strength >= 30) return 'Shaken';
  return 'Wavering';
}

export function EnemyPanel({ battleState }: EnemyPanelProps) {
  const { enemy, phase, meleeState, battleOver } = battleState;

  const isMelee = phase === BattlePhase.Melee && !!meleeState;
  const hideDetail = isMelee && !battleOver;

  const postureClasses = ['status-val'];
  if (enemy.morale === 'charging') postureClasses.push('charging');
  else if (enemy.morale === 'wavering') postureClasses.push('wavering-enemy');

  return (
    <>
      <h2>The Enemy</h2>

      <div className="status-row">
        <span className="status-key">Range</span>
        <span className="status-val" id="enemy-range">
          {Math.round(enemy.range)} paces
        </span>
      </div>
      <div className="status-row">
        <span className="status-key">Quality</span>
        <span className="status-val" id="enemy-quality">
          {QUALITY_LABELS[enemy.quality] || enemy.quality}
        </span>
      </div>
      <div className="status-row">
        <span className="status-key">Strength</span>
        <span className="status-val" id="enemy-strength">
          {getStrengthLabel(enemy.strength)}
        </span>
      </div>
      <div className="status-row">
        <span className="status-key">Posture</span>
        <span className={postureClasses.join(' ')} id="enemy-morale">
          {POSTURE_MAP[enemy.morale] || enemy.morale}
        </span>
      </div>
      <div className="status-row">
        <span className="status-key">Line Integrity</span>
        <span className="status-val" id="enemy-integrity">
          {Math.round(enemy.lineIntegrity)}%
        </span>
      </div>
      <div className="status-row">
        <span className="status-key">Morale</span>
        <span className="status-val" id="enemy-morale-state">
          {getMoraleStateLabel(enemy.strength)}
        </span>
      </div>
      <div
        className="enemy-detail"
        id="enemy-detail"
        style={{ display: hideDetail ? 'none' : '' }}
      >
        <div className="status-row">
          <span className="status-key">Artillery</span>
          <span
            className="status-val"
            id="enemy-arty"
            style={{
              color: enemy.artillery ? 'var(--accent-red-bright)' : 'var(--text-dim)',
            }}
          >
            {enemy.artillery ? 'Active' : 'Silent'}
          </span>
        </div>
        <div className="status-row">
          <span className="status-key">Cavalry</span>
          <span
            className="status-val"
            id="enemy-cav"
            style={{
              color: enemy.cavalryThreat ? 'var(--accent-red-bright)' : 'var(--text-dim)',
            }}
          >
            {enemy.cavalryThreat ? 'Sighted on flank!' : 'None sighted'}
          </span>
        </div>
      </div>
    </>
  );
}
