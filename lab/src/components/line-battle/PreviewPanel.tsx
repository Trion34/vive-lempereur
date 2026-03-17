import React from 'react';
import type { PreviewState, PreviewPlayerConfig } from '../../hooks/useLabAutoPlay';

/* ------------------------------------------------------------------ */
/*  Meter bar                                                          */
/* ------------------------------------------------------------------ */

function Meter({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="lbp-meter">
      <div className="lbp-meter-header">
        <span className="lbp-meter-label">{label}</span>
        <span className="lbp-meter-val">{Math.round(value)}/{max}</span>
      </div>
      <div className="lbp-meter-track">
        <div className="lbp-meter-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stat slider                                                        */
/* ------------------------------------------------------------------ */

function StatSlider({ label, value, onChange, min = 0, max = 100 }: {
  label: string; value: number; onChange: (v: number) => void; min?: number; max?: number;
}) {
  return (
    <label className="lbp-stat-slider">
      <span>{label}</span>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} />
      <span className="lbp-stat-val">{value}</span>
    </label>
  );
}

/* ------------------------------------------------------------------ */
/*  Volley result row                                                  */
/* ------------------------------------------------------------------ */

function VolleyResultRow({ result, isLast }: { result: import('../../hooks/useLabAutoPlay').VolleyResult; isLast: boolean }) {
  return (
    <div className={`lbp-result${isLast ? ' lbp-result-latest' : ''}`}>
      <div className="lbp-result-header">
        <span className="lbp-result-num">V{result.volleyIndex + 1}</span>
        <span className="lbp-result-range">{result.range}p</span>
        <span className={`lbp-result-hit ${result.fireHit ? 'hit' : 'miss'}`}>
          {result.fireHit ? 'HIT' : 'MISS'}
        </span>
        {result.valorRoll && (
          <span className={`lbp-result-valor lbp-valor-${result.valorRoll.outcome}`}>
            {result.valorRoll.outcome.replace('_', ' ')}
          </span>
        )}
        {result.returnFireHit && <span className="lbp-result-rethit">Return fire hit</span>}
        {result.playerDied && <span className="lbp-result-died">KILLED</span>}
      </div>
      <div className="lbp-result-deltas">
        {result.healthDamage > 0 && <span className="lbp-delta lbp-delta-bad">-{result.healthDamage} HP</span>}
        <span className={`lbp-delta ${result.moraleDelta >= 0 ? 'lbp-delta-good' : 'lbp-delta-bad'}`}>
          {result.moraleDelta >= 0 ? '+' : ''}{result.moraleDelta} morale
        </span>
        <span className={`lbp-delta ${result.staminaDelta >= 0 ? 'lbp-delta-good' : 'lbp-delta-bad'}`}>
          {result.staminaDelta >= 0 ? '+' : ''}{result.staminaDelta} stamina
        </span>
      </div>
      <div className="lbp-result-log">
        {result.narratives.map((n, i) => <div key={i} className="lbp-result-line">{n}</div>)}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main preview panel                                                 */
/* ------------------------------------------------------------------ */

interface PreviewPanelProps {
  preview: PreviewState;
  playerConfig: PreviewPlayerConfig;
  speed: 'slow' | 'normal' | 'fast';
  onPlay: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onSetSpeed: (s: 'slow' | 'normal' | 'fast') => void;
  onUpdatePlayer: (patch: Partial<PreviewPlayerConfig>) => void;
}

export function PreviewPanel({
  preview, playerConfig, speed,
  onPlay, onPause, onResume, onReset, onSetSpeed, onUpdatePlayer,
}: PreviewPanelProps) {
  const canPlay = !preview.running && !preview.finished;
  const canPause = preview.running && !preview.paused;
  const canResume = preview.running && preview.paused;
  const canReset = preview.running || preview.finished;

  return (
    <div className="lbp-panel">
      {/* Controls */}
      <div className="lbp-controls">
        <div className="lbp-controls-row">
          {canPlay && <button className="lbp-btn lbp-btn-play" onClick={onPlay}>Play</button>}
          {canPause && <button className="lbp-btn" onClick={onPause}>Pause</button>}
          {canResume && <button className="lbp-btn lbp-btn-play" onClick={onResume}>Resume</button>}
          {canReset && <button className="lbp-btn" onClick={onReset}>Reset</button>}
        </div>
        <div className="lbp-speed">
          <span className="lbp-speed-label">Speed:</span>
          {(['slow', 'normal', 'fast'] as const).map((s) => (
            <button key={s} className={`lbp-speed-btn${speed === s ? ' active' : ''}`}
              onClick={() => onSetSpeed(s)}>{s}</button>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="lbp-progress">
        <span className="lbp-progress-label">
          Volley {preview.currentVolley}/{preview.totalVolleys}
          {preview.finished && !preview.results.some((r) => r.playerDied) && ' — Complete'}
          {preview.results.some((r) => r.playerDied) && ' — KILLED'}
        </span>
        <div className="lbp-progress-track">
          <div className="lbp-progress-fill"
            style={{ width: `${preview.totalVolleys > 0 ? (preview.currentVolley / preview.totalVolleys) * 100 : 0}%` }} />
        </div>
      </div>

      {/* Player config (only when not running) */}
      {!preview.running && !preview.finished && (
        <div className="lbp-config">
          <h4 className="lb-detail-section-title">Test Player</h4>
          <div className="lbp-config-grid">
            <StatSlider label="Musketry" value={playerConfig.musketry} onChange={(v) => onUpdatePlayer({ musketry: v })} />
            <StatSlider label="Valor" value={playerConfig.valor} onChange={(v) => onUpdatePlayer({ valor: v })} />
            <StatSlider label="Endurance" value={playerConfig.endurance} onChange={(v) => onUpdatePlayer({ endurance: v })} />
            <StatSlider label="Constitution" value={playerConfig.constitution} onChange={(v) => onUpdatePlayer({ constitution: v })} />
            <StatSlider label="Health" value={playerConfig.health} onChange={(v) => onUpdatePlayer({ health: v })} />
            <StatSlider label="Morale" value={playerConfig.morale} onChange={(v) => onUpdatePlayer({ morale: v })} />
            <StatSlider label="Stamina" value={playerConfig.stamina} onChange={(v) => onUpdatePlayer({ stamina: v })} />
          </div>
          <label className="lb-slider-check">
            <input type="checkbox" checked={playerConfig.frontRank} onChange={(e) => onUpdatePlayer({ frontRank: e.target.checked })} />
            <span>Front Rank</span>
          </label>
        </div>
      )}

      {/* Live meters */}
      {(preview.running || preview.finished) && (
        <div className="lbp-meters">
          <Meter label="Health" value={preview.health} max={preview.maxHealth} color="var(--health-high)" />
          <Meter label="Morale" value={preview.morale} max={preview.maxMorale} color="var(--accent-gold)" />
          <Meter label="Stamina" value={preview.stamina} max={preview.maxStamina} color="var(--stamina-high)" />
          <Meter label="Enemy" value={preview.enemyStrength} max={100} color="var(--accent-red-bright)" />
          <Meter label="Line" value={preview.lineIntegrity} max={100} color="var(--accent-blue)" />
        </div>
      )}

      {/* Results log */}
      {preview.results.length > 0 && (
        <div className="lbp-results">
          <h4 className="lb-detail-section-title">Combat Log</h4>
          <div className="lbp-results-list">
            {preview.results.map((r, i) => (
              <VolleyResultRow key={i} result={r} isLast={i === preview.results.length - 1} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
