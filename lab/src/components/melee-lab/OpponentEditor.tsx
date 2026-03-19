import React from 'react';
import type { LabOpponentTemplate, OpponentType } from '../../types/meleeLabTypes';
import { DeferredInput, DeferredTextarea } from '../line-battle/DeferredInput';
import { NumInput } from '../shared/NumInput';

const OPPONENT_TYPES: OpponentType[] = ['conscript', 'line', 'veteran', 'sergeant'];

export function OpponentEditor({ opponent, onChange }: {
  opponent: LabOpponentTemplate;
  onChange: (patch: Partial<LabOpponentTemplate>) => void;
}) {
  const dmgMult = (0.75 + opponent.strength / 200).toFixed(3);

  return (
    <div className="ml-editor-panel">
      <h4 className="lb-detail-section-title">Opponent Details</h4>
      <div className="lb-editor-grid">
        <DeferredInput className="lb-field" placeholder="Name" value={opponent.name}
          onCommit={(v) => onChange({ name: v })} />
        <label className="lb-select-field">
          <span>Type</span>
          <select value={opponent.type} onChange={(e) => onChange({ type: e.target.value as OpponentType })}>
            {OPPONENT_TYPES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
        </label>
      </div>

      <h4 className="lb-detail-section-title">Stats</h4>
      <div className="lb-editor-grid">
        <NumInput label="Health Min" value={opponent.health[0]} onChange={(v) => onChange({ health: [v, opponent.health[1]] })} min={1} max={300} />
        <NumInput label="Health Max" value={opponent.health[1]} onChange={(v) => onChange({ health: [opponent.health[0], v] })} min={1} max={300} />
        <NumInput label="Stamina Min" value={opponent.stamina[0]} onChange={(v) => onChange({ stamina: [v, opponent.stamina[1]] })} min={1} max={500} />
        <NumInput label="Stamina Max" value={opponent.stamina[1]} onChange={(v) => onChange({ stamina: [opponent.stamina[0], v] })} min={1} max={500} />
        <NumInput label="Strength" value={opponent.strength} onChange={(v) => onChange({ strength: v })} min={0} max={100} />
      </div>
      <div className="ml-computed">Damage multiplier: {dmgMult}x</div>

      <h4 className="lb-detail-section-title">Description</h4>
      <DeferredTextarea className="lb-textarea" rows={3} placeholder="Narrative description..."
        value={opponent.description} onCommit={(v) => onChange({ description: v })} />

      <h4 className="lb-detail-section-title">Notes</h4>
      <DeferredTextarea className="lb-textarea" rows={2} placeholder="Designer notes..."
        value={opponent.notes} onCommit={(v) => onChange({ notes: v })} />
    </div>
  );
}
