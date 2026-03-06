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
    <div className="line-section" id="line-status">
      <h3>The Line</h3>
      <div className={officerClasses} id="officer-card">
        <span className="officer-rank" id="officer-rank">
          {line.officer.rank} {line.officer.name}
        </span>
        <span className="officer-status" id="officer-status">{line.officer.status}</span>
      </div>

      {renderNeighbour(line.leftNeighbour, 'left-neighbour')}

      <div className="you-marker" id="you-marker">
        <div className="you-portrait-wrap">
          <div className="you-portrait" />
        </div>
        <span className="you-name">[ {player.name.toUpperCase()} ]</span>
      </div>

      {renderNeighbour(line.rightNeighbour, 'right-neighbour')}

      <div className="line-stats">
        <div className="status-row">
          <span className="status-key">Integrity</span>
          <span className="status-val" id="line-integrity-val">{Math.round(line.lineIntegrity)}%</span>
        </div>
        <div className="status-row">
          <span className="status-key">Morale</span>
          <span className="status-val" id="line-morale-val" style={{ color: getMoraleColor(line.lineMorale) }}>
            {MORALE_LABELS[line.lineMorale] || line.lineMorale}
          </span>
        </div>
      </div>
    </div>
  );
}
