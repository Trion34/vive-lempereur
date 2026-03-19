import React from 'react';
import type { LabWaveEvent, LabAllyTemplate, WaveAction } from '../../types/meleeLabTypes';
import { DeferredInput, DeferredTextarea } from '../line-battle/DeferredInput';
import { NumInput } from '../shared/NumInput';

const WAVE_ACTIONS: WaveAction[] = ['add_ally', 'increase_max_enemies'];

export function WaveEventEditor({ event, allies, onChange }: {
  event: LabWaveEvent;
  allies: LabAllyTemplate[];
  onChange: (patch: Partial<LabWaveEvent>) => void;
}) {
  return (
    <div className="ml-editor-panel">
      <h4 className="lb-detail-section-title">Wave Event</h4>
      <div className="lb-editor-grid">
        <NumInput label="At Round" value={event.atRound} onChange={(v) => onChange({ atRound: v })} min={1} max={100} />
        <label className="lb-select-field">
          <span>Action</span>
          <select value={event.action} onChange={(e) => onChange({ action: e.target.value as WaveAction })}>
            {WAVE_ACTIONS.map((a) => (
              <option key={a} value={a}>{a === 'add_ally' ? 'Add Ally' : 'Increase Max Enemies'}</option>
            ))}
          </select>
        </label>
      </div>

      {event.action === 'add_ally' && (
        <div className="lb-editor-grid">
          <label className="lb-select-field">
            <span>Ally</span>
            <select value={event.allyTemplateId}
              onChange={(e) => onChange({ allyTemplateId: e.target.value })}>
              <option value="">— None —</option>
              {allies.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </label>
        </div>
      )}

      {event.action === 'increase_max_enemies' && (
        <div className="lb-editor-grid">
          <NumInput label="New Max Enemies" value={event.newMaxEnemies}
            onChange={(v) => onChange({ newMaxEnemies: v })} min={1} max={10} />
        </div>
      )}

      <div className="lb-editor-grid">
        <DeferredInput className="lb-field" placeholder="Condition: NPC alive (id or empty)"
          value={event.conditionNpcAlive} onCommit={(v) => onChange({ conditionNpcAlive: v })} />
      </div>

      <h4 className="lb-detail-section-title">Narrative</h4>
      <DeferredTextarea className="lb-textarea" rows={3} placeholder="Wave event narrative..."
        value={event.narrative} onCommit={(v) => onChange({ narrative: v })} />

      <h4 className="lb-detail-section-title">Notes</h4>
      <DeferredTextarea className="lb-textarea" rows={2} placeholder="Designer notes..."
        value={event.notes} onCommit={(v) => onChange({ notes: v })} />
    </div>
  );
}
