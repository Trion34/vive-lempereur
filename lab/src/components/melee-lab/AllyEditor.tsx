import React from 'react';
import type { LabAllyTemplate, AllyPersonality } from '../../types/meleeLabTypes';
import { DeferredInput, DeferredTextarea } from '../line-battle/DeferredInput';
import { NumInput } from '../shared/NumInput';

const PERSONALITIES: AllyPersonality[] = ['aggressive', 'balanced', 'cautious'];

export function AllyEditor({ ally, onChange }: {
  ally: LabAllyTemplate;
  onChange: (patch: Partial<LabAllyTemplate>) => void;
}) {
  const hitChance = ((0.5 + ally.elan / 200) * 100).toFixed(1);
  const dmgMult = (0.75 + ally.strength / 200).toFixed(3);

  return (
    <div className="ml-editor-panel">
      <h4 className="lb-detail-section-title">Ally Details</h4>
      <div className="lb-editor-grid">
        <DeferredInput className="lb-field" placeholder="Name" value={ally.name}
          onCommit={(v) => onChange({ name: v })} />
        <DeferredInput className="lb-field" placeholder="NPC ID (optional)" value={ally.npcId}
          onCommit={(v) => onChange({ npcId: v })} />
        <label className="lb-select-field">
          <span>Personality</span>
          <select value={ally.personality} onChange={(e) => onChange({ personality: e.target.value as AllyPersonality })}>
            {PERSONALITIES.map((p) => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
          </select>
        </label>
      </div>

      <h4 className="lb-detail-section-title">Stats</h4>
      <div className="lb-editor-grid">
        <NumInput label="Health Min" value={ally.health[0]} onChange={(v) => onChange({ health: [v, ally.health[1]] })} min={1} max={300} />
        <NumInput label="Health Max" value={ally.health[1]} onChange={(v) => onChange({ health: [ally.health[0], v] })} min={1} max={300} />
        <NumInput label="Stamina Min" value={ally.stamina[0]} onChange={(v) => onChange({ stamina: [v, ally.stamina[1]] })} min={1} max={500} />
        <NumInput label="Stamina Max" value={ally.stamina[1]} onChange={(v) => onChange({ stamina: [ally.stamina[0], v] })} min={1} max={500} />
        <NumInput label="Strength" value={ally.strength} onChange={(v) => onChange({ strength: v })} min={0} max={100} />
        <NumInput label="Elan" value={ally.elan} onChange={(v) => onChange({ elan: v })} min={0} max={100} />
      </div>
      <div className="ml-computed">Hit chance: {hitChance}% | Damage: {dmgMult}x</div>

      <h4 className="lb-detail-section-title">Description</h4>
      <DeferredTextarea className="lb-textarea" rows={3} placeholder="Narrative description..."
        value={ally.description} onCommit={(v) => onChange({ description: v })} />

      <h4 className="lb-detail-section-title">Notes</h4>
      <DeferredTextarea className="lb-textarea" rows={2} placeholder="Designer notes..."
        value={ally.notes} onCommit={(v) => onChange({ notes: v })} />
    </div>
  );
}
