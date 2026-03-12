import React, { useState, useCallback, useMemo } from 'react';

/* ------------------------------------------------------------------ */
/*  Passe-Dix game logic (mirrors src/core/passeDix.ts)                */
/* ------------------------------------------------------------------ */

type Stake = 'low' | 'medium' | 'high';
type Bet = 'passe' | 'manque';

interface StakeConfig {
  repWin: number;
  repLose: number;
  moraleWin: number;
  moraleLose: number;
  label: string;
  color: string;
}

const STAKES: Record<Stake, StakeConfig> = {
  low: { repWin: 1, repLose: 0, moraleWin: 2, moraleLose: -1, label: 'Cautious', color: 'var(--stamina-high)' },
  medium: { repWin: 3, repLose: -1, moraleWin: 4, moraleLose: -2, label: 'Fair', color: 'var(--accent-gold)' },
  high: { repWin: 5, repLose: -3, moraleWin: 6, moraleLose: -4, label: 'Reckless', color: 'var(--accent-red-bright)' },
};

interface RollResult {
  dice: [number, number, number];
  total: number;
  isPasse: boolean;
  bet: Bet;
  won: boolean;
  stake: Stake;
}

function rollD6(): number {
  return Math.floor(Math.random() * 6) + 1;
}

/* ------------------------------------------------------------------ */
/*  Probability calculations                                           */
/* ------------------------------------------------------------------ */

// Passe-Dix: 3d6, total > 10 = Passe, ≤ 10 = Manque
// Possible totals: 3 to 18
// Total combinations: 216

function computeProbabilities(): { total: number; count: number; pct: number }[] {
  const counts = new Map<number, number>();
  for (let a = 1; a <= 6; a++) {
    for (let b = 1; b <= 6; b++) {
      for (let c = 1; c <= 6; c++) {
        const t = a + b + c;
        counts.set(t, (counts.get(t) ?? 0) + 1);
      }
    }
  }
  const result: { total: number; count: number; pct: number }[] = [];
  for (let t = 3; t <= 18; t++) {
    const count = counts.get(t) ?? 0;
    result.push({ total: t, count, pct: (count / 216) * 100 });
  }
  return result;
}

const PROBS = computeProbabilities();
const PASSE_PCT = PROBS.filter((p) => p.total > 10).reduce((s, p) => s + p.pct, 0);
const MANQUE_PCT = 100 - PASSE_PCT;

/* ------------------------------------------------------------------ */
/*  Dice display component                                             */
/* ------------------------------------------------------------------ */

function DiceFace({ value }: { value: number }) {
  return (
    <div className="mg-die">
      <span className="mg-die-val">{value}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function MinigameLabPage() {
  const [stake, setStake] = useState<Stake>('medium');
  const [bet, setBet] = useState<Bet>('passe');
  const [history, setHistory] = useState<RollResult[]>([]);
  const [showProbs, setShowProbs] = useState(false);

  const roll = useCallback(() => {
    const dice: [number, number, number] = [rollD6(), rollD6(), rollD6()];
    const total = dice[0] + dice[1] + dice[2];
    const isPasse = total > 10;
    const won = bet === 'passe' ? isPasse : !isPasse;
    const result: RollResult = { dice, total, isPasse, bet, won, stake };
    setHistory((prev) => [result, ...prev]);
  }, [stake, bet]);

  const stats = useMemo(() => {
    if (history.length === 0) return { wins: 0, losses: 0, winRate: 0, totalRep: 0, totalMorale: 0 };
    const wins = history.filter((r) => r.won).length;
    const losses = history.length - wins;
    let totalRep = 0;
    let totalMorale = 0;
    for (const r of history) {
      const cfg = STAKES[r.stake];
      if (r.won) {
        totalRep += cfg.repWin;
        totalMorale += cfg.moraleWin;
      } else {
        totalRep += cfg.repLose;
        totalMorale += cfg.moraleLose;
      }
    }
    return { wins, losses, winRate: (wins / history.length) * 100, totalRep, totalMorale };
  }, [history]);

  const latest = history[0] ?? null;

  return (
    <div className="mg-page">
      <div className="art-lab-toolbar">
        <span className="art-lab-toolbar-label">Minigame:</span>
        <span className="mg-game-title">Passe-Dix</span>
        <span className="art-lab-toolbar-divider" />
        <button
          className={`art-lab-filter-btn${showProbs ? ' active' : ''}`}
          onClick={() => setShowProbs(!showProbs)}
        >
          Probabilities
        </button>
        <button className="art-lab-small-btn" onClick={() => setHistory([])}>Clear History</button>
        <span className="art-lab-count">{history.length} rolls</span>
      </div>

      <div className="mg-content">
        <div className="mg-game-area">
          {/* Controls */}
          <div className="mg-controls">
            <div className="mg-control-group">
              <span className="mg-control-label">Stake</span>
              <div className="mg-control-buttons">
                {(['low', 'medium', 'high'] as Stake[]).map((s) => (
                  <button
                    key={s}
                    className={`mg-stake-btn${stake === s ? ' active' : ''}`}
                    style={stake === s ? { borderColor: STAKES[s].color, color: STAKES[s].color } : {}}
                    onClick={() => setStake(s)}
                  >
                    {STAKES[s].label}
                  </button>
                ))}
              </div>
            </div>
            <div className="mg-control-group">
              <span className="mg-control-label">Bet</span>
              <div className="mg-control-buttons">
                <button
                  className={`mg-bet-btn${bet === 'passe' ? ' active' : ''}`}
                  onClick={() => setBet('passe')}
                >
                  Passe (&gt;10)
                </button>
                <button
                  className={`mg-bet-btn${bet === 'manque' ? ' active' : ''}`}
                  onClick={() => setBet('manque')}
                >
                  Manque (&le;10)
                </button>
              </div>
            </div>
          </div>

          {/* Roll button */}
          <button className="mg-roll-btn" onClick={roll}>
            Roll the Dice
          </button>

          {/* Latest result */}
          {latest && (
            <div className={`mg-result${latest.won ? ' mg-result-win' : ' mg-result-lose'}`}>
              <div className="mg-dice-row">
                {latest.dice.map((d, i) => <DiceFace key={i} value={d} />)}
              </div>
              <div className="mg-result-info">
                <span className="mg-result-total">Total: {latest.total}</span>
                <span className="mg-result-call">{latest.isPasse ? 'PASSE' : 'MANQUE'}</span>
                <span className="mg-result-outcome">{latest.won ? 'YOU WIN!' : 'You lose.'}</span>
              </div>
            </div>
          )}

          {/* Session stats */}
          {history.length > 0 && (
            <div className="mg-stats">
              <div className="mg-stat">
                <span className="mg-stat-label">Record</span>
                <span className="mg-stat-value">{stats.wins}W - {stats.losses}L ({stats.winRate.toFixed(1)}%)</span>
              </div>
              <div className="mg-stat">
                <span className="mg-stat-label">Net Reputation</span>
                <span className="mg-stat-value" style={{ color: stats.totalRep >= 0 ? 'var(--health-high)' : 'var(--accent-red-bright)' }}>
                  {stats.totalRep >= 0 ? '+' : ''}{stats.totalRep}
                </span>
              </div>
              <div className="mg-stat">
                <span className="mg-stat-label">Net Morale</span>
                <span className="mg-stat-value" style={{ color: stats.totalMorale >= 0 ? 'var(--health-high)' : 'var(--accent-red-bright)' }}>
                  {stats.totalMorale >= 0 ? '+' : ''}{stats.totalMorale}
                </span>
              </div>
            </div>
          )}

          {/* Payouts table */}
          <div className="mg-payouts">
            <h3 className="cl-section-title">Stake Payouts</h3>
            <table className="mg-payout-table">
              <thead>
                <tr>
                  <th>Stake</th>
                  <th>Win: Rep</th>
                  <th>Win: Morale</th>
                  <th>Lose: Rep</th>
                  <th>Lose: Morale</th>
                </tr>
              </thead>
              <tbody>
                {(['low', 'medium', 'high'] as Stake[]).map((s) => {
                  const cfg = STAKES[s];
                  return (
                    <tr key={s}>
                      <td style={{ color: cfg.color }}>{cfg.label}</td>
                      <td style={{ color: 'var(--health-high)' }}>+{cfg.repWin}</td>
                      <td style={{ color: 'var(--health-high)' }}>+{cfg.moraleWin}</td>
                      <td style={{ color: cfg.repLose < 0 ? 'var(--accent-red-bright)' : 'var(--text-dim)' }}>{cfg.repLose}</td>
                      <td style={{ color: 'var(--accent-red-bright)' }}>{cfg.moraleLose}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Probability sidebar */}
        {showProbs && (
          <div className="mg-prob-panel">
            <h3 className="cl-section-title">Probability Distribution (3d6)</h3>
            <div className="mg-prob-summary">
              <span>Passe (&gt;10): <strong>{PASSE_PCT.toFixed(1)}%</strong></span>
              <span>Manque (&le;10): <strong>{MANQUE_PCT.toFixed(1)}%</strong></span>
            </div>
            <div className="mg-prob-chart">
              {PROBS.map((p) => (
                <div key={p.total} className="mg-prob-bar-row">
                  <span className="mg-prob-label">{p.total}</span>
                  <div className="mg-prob-track">
                    <div
                      className="mg-prob-fill"
                      style={{
                        width: `${(p.pct / 12.5) * 100}%`,
                        background: p.total > 10 ? 'var(--accent-gold)' : 'var(--accent-blue)',
                      }}
                    />
                  </div>
                  <span className="mg-prob-val">{p.pct.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Roll history */}
      {history.length > 1 && (
        <div className="mg-history">
          <h3 className="cl-section-title">Roll History</h3>
          <div className="mg-history-list">
            {history.slice(1, 21).map((r, i) => (
              <div key={i} className={`mg-history-item${r.won ? ' mg-history-win' : ''}`}>
                <span className="mg-history-dice">{r.dice.join('-')}</span>
                <span className="mg-history-total">={r.total}</span>
                <span className="mg-history-call">{r.isPasse ? 'P' : 'M'}</span>
                <span className="mg-history-result">{r.won ? 'W' : 'L'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
