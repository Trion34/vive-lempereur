import React, { useState, useMemo } from 'react';
import type { MeleeEncounterModule } from '../../types/meleeLabTypes';

function rollRange(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max - min + 1));
}

function calcDmg(strength: number): string {
  return (0.75 + strength / 200).toFixed(3);
}

function calcHit(elan: number): string {
  return ((0.5 + elan / 200) * 100).toFixed(1);
}

export function EncounterPreview({ encounter }: { encounter: MeleeEncounterModule }) {
  const [seed, setSeed] = useState(0);

  const rolled = useMemo(() => {
    // Force re-roll when seed changes
    void seed;
    return {
      opponents: encounter.opponents.map((o) => ({
        ...o,
        rolledHealth: rollRange(o.health[0], o.health[1]),
        rolledStamina: rollRange(o.stamina[0], o.stamina[1]),
      })),
      allies: encounter.allies.map((a) => ({
        ...a,
        rolledHealth: rollRange(a.health[0], a.health[1]),
        rolledStamina: rollRange(a.stamina[0], a.stamina[1]),
      })),
    };
  }, [encounter, seed]);

  return (
    <div className="ml-preview">
      <div className="ml-preview-header">
        <h3 className="cl-section-title">Preview: {encounter.name}</h3>
        <button className="lb-btn lb-btn-sm" onClick={() => setSeed((s) => s + 1)}>Re-roll Stats</button>
      </div>

      {/* Parameter Summary */}
      <div className="ml-preview-params">
        <span className="ml-preview-badge">{encounter.context}</span>
        <span className="ml-preview-stat">{encounter.maxExchanges} max rounds</span>
        <span className="ml-preview-stat">{encounter.initialActiveEnemies} initial / {encounter.maxActiveEnemies} max enemies</span>
      </div>

      {/* Opponent Roster */}
      {rolled.opponents.length > 0 && (
        <section>
          <h4 className="lb-detail-section-title">Opponents ({rolled.opponents.length})</h4>
          <div className="ml-preview-roster">
            {rolled.opponents.map((o) => (
              <div key={o.id} className="ml-preview-card">
                <div className="ml-preview-card-header">
                  <span className="ml-preview-card-name">{o.name}</span>
                  <span className={`ml-roster-entry-type ml-type-${o.type}`}>{o.type}</span>
                </div>
                <div className="ml-preview-card-stats">
                  <span>HP {o.rolledHealth}</span>
                  <span>STM {o.rolledStamina}</span>
                  <span>STR {o.strength}</span>
                  <span>DMG {calcDmg(o.strength)}x</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Ally Roster */}
      {rolled.allies.length > 0 && (
        <section>
          <h4 className="lb-detail-section-title">Allies ({rolled.allies.length})</h4>
          <div className="ml-preview-roster">
            {rolled.allies.map((a) => (
              <div key={a.id} className="ml-preview-card ml-preview-card-ally">
                <div className="ml-preview-card-header">
                  <span className="ml-preview-card-name">{a.name}</span>
                  <span className="ml-roster-entry-type">{a.personality}</span>
                </div>
                <div className="ml-preview-card-stats">
                  <span>HP {a.rolledHealth}</span>
                  <span>STM {a.rolledStamina}</span>
                  <span>STR {a.strength}</span>
                  <span>ELN {a.elan}</span>
                  <span>HIT {calcHit(a.elan)}%</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Wave Timeline */}
      {encounter.waveEvents.length > 0 && (
        <section>
          <h4 className="lb-detail-section-title">Wave Timeline</h4>
          <div className="ml-preview-timeline">
            {[...encounter.waveEvents]
              .sort((a, b) => a.atRound - b.atRound)
              .map((w) => (
                <div key={w.id} className="ml-preview-wave">
                  <span className="ml-preview-wave-round">R{w.atRound}</span>
                  <div className="ml-preview-wave-body">
                    <span className="ml-preview-wave-action">
                      {w.action === 'add_ally'
                        ? `Add: ${encounter.allies.find((a) => a.id === w.allyTemplateId)?.name ?? '—'}`
                        : `Max enemies \u2192 ${w.newMaxEnemies}`}
                    </span>
                    {w.conditionNpcAlive && <span className="ml-preview-wave-cond">if {w.conditionNpcAlive} alive</span>}
                    {w.narrative && <p className="ml-preview-wave-narr">{w.narrative}</p>}
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}
    </div>
  );
}
