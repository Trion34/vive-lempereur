import React, { useState, useRef, useCallback } from 'react';
import {
  useCampaignEditorStore,
  nodeTypeColor,
  nodeTypeLabel,
  type NodeType,
} from '../../stores/campaignEditorStore';

/* ------------------------------------------------------------------ */
/*  useConfirm — click-twice-to-delete pattern                        */
/* ------------------------------------------------------------------ */

export function useConfirm() {
  const [pending, setPending] = useState(false);
  const timerRef = useRef<number>(0);

  const request = useCallback(() => {
    setPending(true);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setPending(false), 3000);
  }, []);

  const cancel = useCallback(() => {
    setPending(false);
    window.clearTimeout(timerRef.current);
  }, []);

  return { pending, request, cancel };
}

/* ------------------------------------------------------------------ */
/*  EditableText — inline click-to-edit for text fields                */
/* ------------------------------------------------------------------ */

export function EditableText({
  value, onChange, className, tag: Tag = 'span', multiline = false, placeholder = 'Click to edit...',
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  tag?: 'span' | 'h2' | 'p';
  multiline?: boolean;
  placeholder?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const startEdit = () => {
    setDraft(value);
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const commit = () => {
    setEditing(false);
    if (draft !== value) onChange(draft);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) { e.preventDefault(); commit(); }
    if (e.key === 'Escape') { setEditing(false); setDraft(value); }
  };

  if (editing) {
    if (multiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          className={`cv-edit-textarea ${className ?? ''}`}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={handleKey}
          rows={3}
        />
      );
    }
    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        className={`cv-edit-input ${className ?? ''}`}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={handleKey}
      />
    );
  }

  return (
    <Tag
      className={`cv-editable ${className ?? ''}`}
      onClick={startEdit}
      title="Click to edit"
    >
      {value || <em className="cv-placeholder">{placeholder}</em>}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/*  TagEditor — add/remove tag list (commanders, battles)              */
/* ------------------------------------------------------------------ */

export function TagEditor({ tags, onChange, label, tagClass }: {
  tags: string[];
  onChange: (tags: string[]) => void;
  label: string;
  tagClass?: string;
}) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const startAdd = () => {
    setAdding(true);
    setDraft('');
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const commitAdd = () => {
    setAdding(false);
    const trimmed = draft.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); commitAdd(); }
    if (e.key === 'Escape') { setAdding(false); }
  };

  return (
    <div className="cv-tag-editor">
      <span className="cv-commander-label">{label}:</span>
      {tags.map((t) => (
        <span key={t} className={`cv-meta-tag ${tagClass ?? ''}`}>
          {t}
          <button className="cv-tag-remove" onClick={() => onChange(tags.filter((x) => x !== t))} title="Remove">&times;</button>
        </span>
      ))}
      {adding ? (
        <input
          ref={inputRef}
          className="cv-edit-input cv-tag-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitAdd}
          onKeyDown={handleKey}
          placeholder="Name..."
        />
      ) : (
        <button className="cv-add-btn cv-add-btn-inline" onClick={startAdd} title={`Add ${label}`}>+</button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  DetailEditor — key-value config editor                             */
/* ------------------------------------------------------------------ */

export function DetailEditor({ details, onChange }: {
  details: Record<string, string | number>;
  onChange: (d: Record<string, string | number>) => void;
}) {
  const [addingKey, setAddingKey] = useState(false);
  const [newKey, setNewKey] = useState('');
  const keyRef = useRef<HTMLInputElement>(null);

  const updateValue = (key: string, raw: string) => {
    const numVal = Number(raw);
    onChange({ ...details, [key]: raw !== '' && !isNaN(numVal) && String(numVal) === raw ? numVal : raw });
  };

  const removeKey = (key: string) => {
    const copy = { ...details };
    delete copy[key];
    onChange(copy);
  };

  const startAddKey = () => {
    setAddingKey(true);
    setNewKey('');
    setTimeout(() => keyRef.current?.focus(), 0);
  };

  const commitAddKey = () => {
    setAddingKey(false);
    const trimmed = newKey.trim();
    if (trimmed && !(trimmed in details)) {
      onChange({ ...details, [trimmed]: '' });
    }
  };

  return (
    <div className="cv-detail-editor">
      {Object.entries(details).map(([k, v]) => (
        <div key={k} className="cv-config-item cv-config-item-edit">
          <span className="cv-config-key">{k}</span>
          <input
            className="cv-edit-input cv-config-input"
            value={String(v)}
            onChange={(e) => updateValue(k, e.target.value)}
          />
          <button className="cv-delete-btn cv-delete-btn-sm" onClick={() => removeKey(k)} title="Remove">&times;</button>
        </div>
      ))}
      {addingKey ? (
        <input
          ref={keyRef}
          className="cv-edit-input cv-tag-input"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          onBlur={commitAddKey}
          onKeyDown={(e) => { if (e.key === 'Enter') commitAddKey(); if (e.key === 'Escape') setAddingKey(false); }}
          placeholder="Key name..."
        />
      ) : (
        <button className="cv-add-btn" onClick={startAddKey} title="Add detail">+ Add Detail</button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  NodeTypeSelect — dropdown for node type                            */
/* ------------------------------------------------------------------ */

export function NodeTypeSelect({ value, onChange }: { value: NodeType; onChange: (t: NodeType) => void }) {
  return (
    <select
      className="cv-type-select"
      value={value}
      onChange={(e) => onChange(e.target.value as NodeType)}
    >
      <option value="interlude">Interlude</option>
      <option value="camp">Camp</option>
      <option value="battle">Battle</option>
      <option value="vn">Visual Novel</option>
    </select>
  );
}

/* ------------------------------------------------------------------ */
/*  AddNodeButton — type picker for adding nodes                       */
/* ------------------------------------------------------------------ */

export function AddNodeButton({ chapterId, afterNodeId }: { chapterId: string; afterNodeId?: string }) {
  const addNode = useCampaignEditorStore((s) => s.addNode);
  const [picking, setPicking] = useState(false);

  if (picking) {
    return (
      <div className="cv-add-node-picker">
        {(['interlude', 'camp', 'battle', 'vn'] as NodeType[]).map((t) => (
          <button
            key={t}
            className="cv-add-node-type-btn"
            style={{ borderColor: nodeTypeColor[t] }}
            onClick={() => { addNode(chapterId, afterNodeId, t); setPicking(false); }}
          >
            {nodeTypeLabel[t]}
          </button>
        ))}
        <button className="cv-add-node-type-btn cv-cancel-btn" onClick={() => setPicking(false)}>Cancel</button>
      </div>
    );
  }

  return (
    <button className="cv-add-btn cv-add-btn-between" onClick={() => setPicking(true)} title="Add node">+</button>
  );
}
