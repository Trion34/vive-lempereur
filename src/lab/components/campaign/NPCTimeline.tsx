import React, { useState, useMemo } from 'react';
import {
  useCampaignEditorStore,
  type CampaignChapter,
  type NPCAssignment,
} from '../../stores/campaignEditorStore';
import { openLabInNewTab } from '../../utils/openLabInNewTab';

/* ------------------------------------------------------------------ */
/*  NPC Timeline Visualization                                         */
/* ------------------------------------------------------------------ */

function getChapterIndex(chapters: CampaignChapter[], chapterId: string): number {
  return chapters.findIndex((ch) => ch.id === chapterId);
}

const ROLE_ORDER: Record<string, number> = { NCO: 0, Officer: 1, Neighbour: 2 };

export function NPCTimeline() {
  const { chapters, npcAssignments, addNPC, updateNPC, removeNPC, killNPC,
    replacementPool, addReplacementNPC, updateReplacementNPC, removeReplacementNPC } = useCampaignEditorStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingReplacementId, setEditingReplacementId] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const sorted = [...npcAssignments].sort((a, b) => {
      const roleA = ROLE_ORDER[a.role] ?? 3;
      const roleB = ROLE_ORDER[b.role] ?? 3;
      if (roleA !== roleB) return roleA - roleB;
      return a.name.localeCompare(b.name);
    });
    const groups: Record<string, NPCAssignment[]> = { NCO: [], Officer: [], Neighbour: [] };
    for (const npc of sorted) {
      (groups[npc.role] ??= []).push(npc);
    }
    return groups;
  }, [npcAssignments]);

  const handleAdd = () => {
    const id = `npc-${Date.now()}`;
    addNPC({
      npcId: id,
      name: 'New NPC',
      role: 'Neighbour',
      status: 'active',
      introducedAt: chapters[0]?.id ?? '',
      exitAt: null,
      replacedBy: null,
      personality: '',
      socializeNarrative: '',
      rank: 'Private',
      baseStats: { valor: 40, morale: 80, maxMorale: 100, relationship: 30 },
    });
    setEditingId(id);
  };

  return (
    <div className="ct-container">
      {/* Column headers */}
      <div className="ct-header-row">
        <div className="ct-name-col">NPC</div>
        {chapters.map((ch) => (
          <div key={ch.id} className="ct-chapter-col" title={ch.title}>
            {ch.number}
          </div>
        ))}
      </div>

      {/* NPC rows by role */}
      {(['NCO', 'Officer', 'Neighbour'] as const).map((role) => (
        <React.Fragment key={role}>
          {grouped[role].length > 0 && (
            <div className="ct-role-header">{role}s</div>
          )}
          {grouped[role].map((npc) => (
            <NPCRow
              key={npc.npcId}
              npc={npc}
              chapters={chapters}
              editing={editingId === npc.npcId}
              onEdit={() => setEditingId(editingId === npc.npcId ? null : npc.npcId)}
              onUpdate={(patch) => updateNPC(npc.npcId, patch)}
              onRemove={() => removeNPC(npc.npcId)}
              onKill={(atCh) => killNPC(npc.npcId, atCh)}
            />
          ))}
        </React.Fragment>
      ))}

      <button className="cv-add-btn" onClick={handleAdd}>+ Add NPC</button>

      {/* Replacement Pool */}
      <div className="ct-replacement-section">
        <div className="ct-role-header">Replacement Pool</div>
        {replacementPool.map((npc) => (
          <div key={npc.npcId}>
            <div className="ct-row ct-replacement-row" onClick={() => setEditingReplacementId(editingReplacementId === npc.npcId ? null : npc.npcId)}>
              <div className="ct-name-col">
                <span className="ct-status-dot ct-status-reserve" />
                {npc.name}
                <span className="ct-replacement-role">{npc.role}</span>
              </div>
              <div className="ct-replacement-info">
                {npc.rank} &mdash; {npc.personality ? npc.personality.slice(0, 60) + (npc.personality.length > 60 ? '...' : '') : 'No personality set'}
              </div>
            </div>
            {editingReplacementId === npc.npcId && (
              <div className="ct-edit-panel">
                <label className="ct-edit-field">
                  Name
                  <input className="cv-edit-input" value={npc.name} onChange={(e) => updateReplacementNPC(npc.npcId, { name: e.target.value })} />
                </label>
                <label className="ct-edit-field">
                  Role
                  <select className="cv-type-select" value={npc.role} onChange={(e) => updateReplacementNPC(npc.npcId, { role: e.target.value as NPCAssignment['role'] })}>
                    <option value="NCO">NCO</option>
                    <option value="Officer">Officer</option>
                    <option value="Neighbour">Neighbour</option>
                  </select>
                </label>
                <label className="ct-edit-field">
                  Rank
                  <select className="cv-type-select" value={npc.rank ?? 'Private'} onChange={(e) => updateReplacementNPC(npc.npcId, { rank: e.target.value })}>
                    <option value="Private">Private</option>
                    <option value="Corporal">Corporal</option>
                    <option value="Sergeant">Sergeant</option>
                    <option value="Lieutenant">Lieutenant</option>
                    <option value="Captain">Captain</option>
                  </select>
                </label>
                <div className="ct-edit-stats-row">
                  <label className="ct-edit-field">
                    Valor
                    <input type="number" className="cv-edit-input" min={0} max={100}
                      value={npc.baseStats?.valor ?? 40}
                      onChange={(e) => updateReplacementNPC(npc.npcId, { baseStats: { ...(npc.baseStats ?? { valor: 40, morale: 80, maxMorale: 100, relationship: 30 }), valor: parseInt(e.target.value) || 0 } })}
                    />
                  </label>
                  <label className="ct-edit-field">
                    Morale
                    <input type="number" className="cv-edit-input" min={0} max={100}
                      value={npc.baseStats?.morale ?? 80}
                      onChange={(e) => updateReplacementNPC(npc.npcId, { baseStats: { ...(npc.baseStats ?? { valor: 40, morale: 80, maxMorale: 100, relationship: 30 }), morale: parseInt(e.target.value) || 0 } })}
                    />
                  </label>
                  <label className="ct-edit-field">
                    Relationship
                    <input type="number" className="cv-edit-input" min={-100} max={100}
                      value={npc.baseStats?.relationship ?? 30}
                      onChange={(e) => updateReplacementNPC(npc.npcId, { baseStats: { ...(npc.baseStats ?? { valor: 40, morale: 80, maxMorale: 100, relationship: 30 }), relationship: parseInt(e.target.value) || 0 } })}
                    />
                  </label>
                </div>
                <label className="ct-edit-field ct-edit-field-wide">
                  Personality
                  <textarea className="cv-edit-textarea" value={npc.personality ?? ''} onChange={(e) => updateReplacementNPC(npc.npcId, { personality: e.target.value })}
                    placeholder="Character description..."
                    rows={3}
                  />
                </label>
                <button className="cv-delete-btn" onClick={() => { removeReplacementNPC(npc.npcId); setEditingReplacementId(null); }}>Remove from Pool</button>
              </div>
            )}
          </div>
        ))}
        <button className="cv-add-btn" onClick={() => {
          const id = `reserve-${Date.now()}`;
          addReplacementNPC({
            npcId: id, name: 'New Reserve', role: 'Neighbour', status: 'active',
            introducedAt: '', exitAt: null, replacedBy: null,
            personality: '', socializeNarrative: '', rank: 'Private',
            baseStats: { valor: 40, morale: 80, maxMorale: 100, relationship: 30 },
          });
          setEditingReplacementId(id);
        }}>+ Add Replacement NPC</button>
      </div>
    </div>
  );
}

function NPCRow({ npc, chapters, editing, onEdit, onUpdate, onRemove, onKill }: {
  npc: NPCAssignment;
  chapters: CampaignChapter[];
  editing: boolean;
  onEdit: () => void;
  onUpdate: (patch: Partial<NPCAssignment>) => void;
  onRemove: () => void;
  onKill: (atChapter: string) => void;
}) {
  const startIdx = getChapterIndex(chapters, npc.introducedAt);
  const endIdx = npc.exitAt ? getChapterIndex(chapters, npc.exitAt) : chapters.length - 1;

  return (
    <>
      <div className="ct-row" onClick={onEdit}>
        <div className="ct-name-col">
          <span className={`ct-status-dot ct-status-${npc.status}`} />
          {npc.name}
          <button
            className="cv-cross-launch-util-btn cv-npc-link-btn"
            onClick={(e) => { e.stopPropagation(); openLabInNewTab('npc-browser', { npcId: npc.npcId, label: npc.name }); }}
            title="Open in NPC Browser"
          >
            &#x1F517;
          </button>
        </div>
        {chapters.map((ch, i) => {
          const inRange = i >= startIdx && i <= endIdx && startIdx >= 0;
          const isExit = npc.exitAt === ch.id;
          return (
            <div key={ch.id} className="ct-chapter-col">
              {inRange && (
                <div className={`ct-bar ct-bar-${npc.role.toLowerCase()}`}>
                  {isExit && (
                    <span className={`ct-marker ct-marker-${npc.status}`} title={npc.status}>
                      {npc.status === 'killed' ? '\u2020' : npc.status === 'wounded' ? '\u25CF' : '\u25CB'}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {editing && (
        <div className="ct-edit-panel">
          <label className="ct-edit-field">
            Name
            <input className="cv-edit-input" value={npc.name} onChange={(e) => onUpdate({ name: e.target.value })} />
          </label>
          <label className="ct-edit-field">
            Role
            <select className="cv-type-select" value={npc.role} onChange={(e) => onUpdate({ role: e.target.value as NPCAssignment['role'] })}>
              <option value="NCO">NCO</option>
              <option value="Officer">Officer</option>
              <option value="Neighbour">Neighbour</option>
            </select>
          </label>
          <label className="ct-edit-field">
            Rank
            <select className="cv-type-select" value={npc.rank ?? 'Private'} onChange={(e) => onUpdate({ rank: e.target.value })}>
              <option value="Private">Private</option>
              <option value="Corporal">Corporal</option>
              <option value="Sergeant">Sergeant</option>
              <option value="Lieutenant">Lieutenant</option>
              <option value="Captain">Captain</option>
            </select>
          </label>
          <label className="ct-edit-field">
            Introduced At
            <select className="cv-type-select" value={npc.introducedAt} onChange={(e) => onUpdate({ introducedAt: e.target.value })}>
              {chapters.map((ch) => <option key={ch.id} value={ch.id}>Ch.{ch.number}: {ch.title}</option>)}
            </select>
          </label>
          <label className="ct-edit-field">
            Status
            <select className="cv-type-select" value={npc.status} onChange={(e) => {
              const status = e.target.value as NPCAssignment['status'];
              if (status === 'killed') {
                onKill(npc.exitAt ?? chapters[chapters.length - 1].id);
              } else {
                onUpdate({ status, exitAt: status === 'active' ? null : npc.exitAt });
              }
            }}>
              <option value="active">Active</option>
              <option value="killed">Killed</option>
              <option value="wounded">Wounded</option>
              <option value="replaced">Replaced</option>
            </select>
          </label>
          {npc.status !== 'active' && (
            <label className="ct-edit-field">
              Exit At
              <select className="cv-type-select" value={npc.exitAt ?? ''} onChange={(e) => onUpdate({ exitAt: e.target.value || null })}>
                <option value="">None</option>
                {chapters.map((ch) => <option key={ch.id} value={ch.id}>Ch.{ch.number}: {ch.title}</option>)}
              </select>
            </label>
          )}

          {/* Base Stats */}
          <div className="ct-edit-stats-row">
            <label className="ct-edit-field">
              Valor
              <input type="number" className="cv-edit-input" min={0} max={100}
                value={npc.baseStats?.valor ?? 40}
                onChange={(e) => onUpdate({ baseStats: { ...(npc.baseStats ?? { valor: 40, morale: 80, maxMorale: 100, relationship: 30 }), valor: parseInt(e.target.value) || 0 } })}
              />
            </label>
            <label className="ct-edit-field">
              Morale
              <input type="number" className="cv-edit-input" min={0} max={100}
                value={npc.baseStats?.morale ?? 80}
                onChange={(e) => onUpdate({ baseStats: { ...(npc.baseStats ?? { valor: 40, morale: 80, maxMorale: 100, relationship: 30 }), morale: parseInt(e.target.value) || 0 } })}
              />
            </label>
            <label className="ct-edit-field">
              Max Morale
              <input type="number" className="cv-edit-input" min={0} max={100}
                value={npc.baseStats?.maxMorale ?? 100}
                onChange={(e) => onUpdate({ baseStats: { ...(npc.baseStats ?? { valor: 40, morale: 80, maxMorale: 100, relationship: 30 }), maxMorale: parseInt(e.target.value) || 0 } })}
              />
            </label>
            <label className="ct-edit-field">
              Relationship
              <input type="number" className="cv-edit-input" min={-100} max={100}
                value={npc.baseStats?.relationship ?? 30}
                onChange={(e) => onUpdate({ baseStats: { ...(npc.baseStats ?? { valor: 40, morale: 80, maxMorale: 100, relationship: 30 }), relationship: parseInt(e.target.value) || 0 } })}
              />
            </label>
          </div>

          {/* Personality */}
          <label className="ct-edit-field ct-edit-field-wide">
            Personality
            <textarea className="cv-edit-textarea" value={npc.personality ?? ''} onChange={(e) => onUpdate({ personality: e.target.value })}
              placeholder="Character description for narrative generation..."
              rows={3}
            />
          </label>

          {/* Socialize Narrative */}
          <label className="ct-edit-field ct-edit-field-wide">
            Socialize Narrative
            <textarea className="cv-edit-textarea" value={npc.socializeNarrative ?? ''} onChange={(e) => onUpdate({ socializeNarrative: e.target.value })}
              placeholder="What happens when you talk to them at camp..."
              rows={3}
            />
          </label>

          <button className="cv-delete-btn" onClick={onRemove}>Remove NPC</button>
        </div>
      )}
    </>
  );
}
