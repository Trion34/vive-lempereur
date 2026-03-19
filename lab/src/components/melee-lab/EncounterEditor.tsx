import React, { useCallback } from 'react';
import { useMeleeLabStore } from '../../stores/meleeLabStore';
import type { MeleeEncounterModule, LabMeleeContext } from '../../types/meleeLabTypes';
import { DeferredInput, DeferredTextarea } from '../line-battle/DeferredInput';
import { NumInput } from '../shared/NumInput';
import { OpponentEditor } from './OpponentEditor';
import { AllyEditor } from './AllyEditor';
import { WaveEventEditor } from './WaveEventEditor';

const CONTEXTS: LabMeleeContext[] = ['terrain', 'battery', 'skirmish'];

export function EncounterEditor({ encounter }: { encounter: MeleeEncounterModule }) {
  const {
    updateEncounter,
    addOpponent, removeOpponent, updateOpponent, reorderOpponent, duplicateOpponent,
    selectedOpponentId, selectOpponent,
    addAlly, removeAlly, updateAlly, reorderAlly, duplicateAlly,
    selectedAllyId, selectAlly,
    addWaveEvent, removeWaveEvent, updateWaveEvent, reorderWaveEvent,
    selectedWaveEventId, selectWaveEvent,
  } = useMeleeLabStore();

  const encId = encounter.id;

  const patch = useCallback((p: Partial<MeleeEncounterModule>) => {
    updateEncounter(encId, p);
  }, [encId, updateEncounter]);

  const selectedOpp = encounter.opponents.find((o) => o.id === selectedOpponentId) ?? null;
  const selectedAllyItem = encounter.allies.find((a) => a.id === selectedAllyId) ?? null;
  const selectedWave = encounter.waveEvents.find((w) => w.id === selectedWaveEventId) ?? null;

  return (
    <div className="ml-encounter-editor">
      {/* Metadata */}
      <section className="ml-editor-section">
        <h3 className="cl-section-title">Metadata</h3>
        <div className="lb-editor-grid">
          <DeferredInput className="lb-field" placeholder="Encounter name"
            value={encounter.name} onCommit={(v) => patch({ name: v })} />
          <label className="lb-select-field">
            <span>Context</span>
            <select value={encounter.context} onChange={(e) => patch({ context: e.target.value as LabMeleeContext })}>
              {CONTEXTS.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </label>
        </div>
        <DeferredTextarea className="lb-textarea" rows={2} placeholder="Description..."
          value={encounter.description} onCommit={(v) => patch({ description: v })} />
        <DeferredInput className="lb-field" placeholder="Tags (comma-separated)"
          value={encounter.tags.join(', ')}
          onCommit={(v) => patch({ tags: v.split(',').map((t) => t.trim()).filter(Boolean) })} />
      </section>

      {/* Parameters */}
      <section className="ml-editor-section">
        <h3 className="cl-section-title">Parameters</h3>
        <div className="lb-editor-grid">
          <NumInput label="Max Exchanges" value={encounter.maxExchanges} onChange={(v) => patch({ maxExchanges: v })} min={1} max={100} />
          <NumInput label="Initial Active Enemies" value={encounter.initialActiveEnemies} onChange={(v) => patch({ initialActiveEnemies: v })} min={1} max={10} />
          <NumInput label="Max Active Enemies" value={encounter.maxActiveEnemies} onChange={(v) => patch({ maxActiveEnemies: v })} min={1} max={10} />
        </div>
      </section>

      {/* Opponent Roster */}
      <section className="ml-editor-section">
        <div className="ml-section-header">
          <h3 className="cl-section-title">Opponent Roster ({encounter.opponents.length})</h3>
          <button className="lb-btn lb-btn-sm" onClick={() => addOpponent(encId)}>+ Add</button>
        </div>
        <div className="ml-roster-list">
          {encounter.opponents.map((opp, i) => (
            <div key={opp.id}
              className={`ml-roster-entry${selectedOpponentId === opp.id ? ' active' : ''}`}
              onClick={() => selectOpponent(opp.id)}>
              <span className="ml-roster-entry-name">{opp.name}</span>
              <span className={`ml-roster-entry-type ml-type-${opp.type}`}>{opp.type}</span>
              <span className="ml-roster-entry-stat">STR {opp.strength}</span>
              <div className="ml-roster-entry-actions">
                <button className="lb-btn-icon" title="Move up" disabled={i === 0}
                  onClick={(e) => { e.stopPropagation(); reorderOpponent(encId, opp.id, 'up'); }}>&#x25B2;</button>
                <button className="lb-btn-icon" title="Move down" disabled={i === encounter.opponents.length - 1}
                  onClick={(e) => { e.stopPropagation(); reorderOpponent(encId, opp.id, 'down'); }}>&#x25BC;</button>
                <button className="lb-btn-icon" title="Duplicate"
                  onClick={(e) => { e.stopPropagation(); duplicateOpponent(encId, opp.id); }}>&#x2398;</button>
                <button className="lb-btn-icon lb-btn-danger" title="Remove"
                  onClick={(e) => { e.stopPropagation(); removeOpponent(encId, opp.id); }}>&#x2715;</button>
              </div>
            </div>
          ))}
        </div>
        {selectedOpp && (
          <OpponentEditor opponent={selectedOpp}
            onChange={(p) => updateOpponent(encId, selectedOpp.id, p)} />
        )}
      </section>

      {/* Ally Roster */}
      <section className="ml-editor-section">
        <div className="ml-section-header">
          <h3 className="cl-section-title">Ally Roster ({encounter.allies.length})</h3>
          <button className="lb-btn lb-btn-sm" onClick={() => addAlly(encId)}>+ Add</button>
        </div>
        <div className="ml-roster-list">
          {encounter.allies.map((a, i) => (
            <div key={a.id}
              className={`ml-roster-entry ml-roster-ally-entry${selectedAllyId === a.id ? ' active' : ''}`}
              onClick={() => selectAlly(a.id)}>
              <span className="ml-roster-entry-name">{a.name}</span>
              <span className="ml-roster-entry-type">{a.personality}</span>
              <span className="ml-roster-entry-stat">STR {a.strength} ELN {a.elan}</span>
              <div className="ml-roster-entry-actions">
                <button className="lb-btn-icon" title="Move up" disabled={i === 0}
                  onClick={(e) => { e.stopPropagation(); reorderAlly(encId, a.id, 'up'); }}>&#x25B2;</button>
                <button className="lb-btn-icon" title="Move down" disabled={i === encounter.allies.length - 1}
                  onClick={(e) => { e.stopPropagation(); reorderAlly(encId, a.id, 'down'); }}>&#x25BC;</button>
                <button className="lb-btn-icon" title="Duplicate"
                  onClick={(e) => { e.stopPropagation(); duplicateAlly(encId, a.id); }}>&#x2398;</button>
                <button className="lb-btn-icon lb-btn-danger" title="Remove"
                  onClick={(e) => { e.stopPropagation(); removeAlly(encId, a.id); }}>&#x2715;</button>
              </div>
            </div>
          ))}
        </div>
        {selectedAllyItem && (
          <AllyEditor ally={selectedAllyItem}
            onChange={(p) => updateAlly(encId, selectedAllyItem.id, p)} />
        )}
      </section>

      {/* Wave Timeline */}
      <section className="ml-editor-section">
        <div className="ml-section-header">
          <h3 className="cl-section-title">Wave Timeline ({encounter.waveEvents.length})</h3>
          <button className="lb-btn lb-btn-sm" onClick={() => addWaveEvent(encId)}>+ Add</button>
        </div>
        <div className="ml-wave-list">
          {[...encounter.waveEvents]
            .sort((a, b) => a.atRound - b.atRound)
            .map((w, i) => (
              <div key={w.id}
                className={`ml-wave-entry${selectedWaveEventId === w.id ? ' active' : ''}`}
                onClick={() => selectWaveEvent(w.id)}>
                <span className="ml-wave-entry-round">R{w.atRound}</span>
                <span className="ml-wave-entry-action">
                  {w.action === 'add_ally'
                    ? `Add: ${encounter.allies.find((a) => a.id === w.allyTemplateId)?.name ?? '—'}`
                    : `Max enemies \u2192 ${w.newMaxEnemies}`}
                </span>
                {w.conditionNpcAlive && <span className="ml-wave-entry-cond">if {w.conditionNpcAlive} alive</span>}
                <div className="ml-roster-entry-actions">
                  <button className="lb-btn-icon" title="Move up" disabled={i === 0}
                    onClick={(e) => { e.stopPropagation(); reorderWaveEvent(encId, w.id, 'up'); }}>&#x25B2;</button>
                  <button className="lb-btn-icon" title="Move down" disabled={i === encounter.waveEvents.length - 1}
                    onClick={(e) => { e.stopPropagation(); reorderWaveEvent(encId, w.id, 'down'); }}>&#x25BC;</button>
                  <button className="lb-btn-icon lb-btn-danger" title="Remove"
                    onClick={(e) => { e.stopPropagation(); removeWaveEvent(encId, w.id); }}>&#x2715;</button>
                </div>
              </div>
            ))}
        </div>
        {selectedWave && (
          <WaveEventEditor event={selectedWave} allies={encounter.allies}
            onChange={(p) => updateWaveEvent(encId, selectedWave.id, p)} />
        )}
      </section>

      {/* Encounter Notes */}
      <section className="ml-editor-section">
        <h3 className="cl-section-title">Encounter Notes</h3>
        <DeferredTextarea className="lb-textarea" rows={4} placeholder="Designer notes..."
          value={encounter.notes} onCommit={(v) => patch({ notes: v })} />
      </section>
    </div>
  );
}
