import React from 'react';
import type { BattleState } from '../../types';
import { MoraleThreshold } from '../../types';

interface LineStatusProps {
  battleState: BattleState;
}

const MORALE_LABELS: Record<string, string> = {
  resolute: 'Resolute',
  holding: 'Holding',
  shaken: 'Shaken',
  wavering: 'Wavering',
  breaking: 'Breaking',
};

function getMoraleColor(lineMorale: string): string {
  if (lineMorale === 'resolute' || lineMorale === 'holding') return 'var(--health-high)';
  if (lineMorale === 'shaken') return 'var(--morale-mid)';
  if (lineMorale === 'wavering') return 'var(--morale-low)';
  return 'var(--morale-crit)';
}

export function LineStatus({ battleState }: LineStatusProps) {
  const { line, player } = battleState;

  const officerClasses = ['officer-card', !line.officer.alive ? 'down' : '']
    .filter(Boolean)
    .join(' ');

  const renderNeighbour = (
    n: typeof line.leftNeighbour,
    id: string,
  ) => {
    if (!n) return <div className="neighbour" id={id} />;

    let stateText: string;
    if (!n.alive) stateText = 'DEAD';
    else if (n.routing) stateText = 'ROUTING';
    else if (n.wounded) stateText = 'WOUNDED';
    else stateText = n.threshold.toUpperCase();

    const classes = [
      'neighbour',
      !n.alive ? 'dead' : '',
      n.alive && n.routing ? 'routing' : '',
      n.alive &&
      !n.routing &&
      (n.threshold === MoraleThreshold.Wavering || n.threshold === MoraleThreshold.Breaking)
        ? 'wavering'
        : '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={classes} id={id}>
        <span className="neighbour-name">{n.name}</span>
        <span className="neighbour-state">{stateText}</span>
      </div>
    );
  };

  return (
    <div className="line-status" id="line-status">
      <div className={officerClasses} id="officer-card">
        <span id="officer-rank">
          {line.officer.rank} {line.officer.name}
        </span>
        <span id="officer-status">{line.officer.status}</span>
      </div>

      <div className="line-row">
        {renderNeighbour(line.leftNeighbour, 'left-neighbour')}

        <div className="you-marker" id="you-marker">
          <span className="you-name">[ {player.name.toUpperCase()} ]</span>
        </div>

        {renderNeighbour(line.rightNeighbour, 'right-neighbour')}
      </div>

      <div className="line-info">
        <span>
          Integrity: <span id="line-integrity-val">{Math.round(line.lineIntegrity)}%</span>
        </span>
        <span>
          Morale:{' '}
          <span id="line-morale-val" style={{ color: getMoraleColor(line.lineMorale) }}>
            {MORALE_LABELS[line.lineMorale] || line.lineMorale}
          </span>
        </span>
      </div>
    </div>
  );
}
