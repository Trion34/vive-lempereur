import React, { useState, useCallback, useMemo } from 'react';

/* ------------------------------------------------------------------ */
/*  JSON Tree Viewer                                                   */
/* ------------------------------------------------------------------ */

interface TreeNodeProps {
  label: string;
  value: unknown;
  depth: number;
  path: string;
  onEdit?: (path: string, value: unknown) => void;
}

function TreeNode({ label, value, depth, path, onEdit }: TreeNodeProps) {
  const [expanded, setExpanded] = useState(depth < 1);
  const [editing, setEditing] = useState(false);
  const [editVal, setEditVal] = useState('');

  const isObject = value !== null && typeof value === 'object';
  const isArray = Array.isArray(value);

  const startEdit = () => {
    if (isObject) return;
    setEditVal(JSON.stringify(value));
    setEditing(true);
  };

  const commitEdit = () => {
    try {
      const parsed = JSON.parse(editVal);
      onEdit?.(path, parsed);
    } catch {
      // If not valid JSON, treat as string
      onEdit?.(path, editVal);
    }
    setEditing(false);
  };

  const cancelEdit = () => setEditing(false);

  if (!isObject) {
    const typeClass =
      typeof value === 'string' ? 'si-val-string' :
      typeof value === 'number' ? 'si-val-number' :
      typeof value === 'boolean' ? 'si-val-boolean' :
      value === null ? 'si-val-null' : 'si-val-other';

    return (
      <div className="si-leaf" style={{ paddingLeft: `${depth * 16}px` }}>
        <span className="si-key">{label}:</span>
        {editing ? (
          <span className="si-edit-inline">
            <input
              className="si-edit-input"
              value={editVal}
              onChange={(e) => setEditVal(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') cancelEdit(); }}
              autoFocus
            />
            <button className="si-edit-ok" onClick={commitEdit}>ok</button>
            <button className="si-edit-cancel" onClick={cancelEdit}>x</button>
          </span>
        ) : (
          <span className={`si-val ${typeClass}`} onDoubleClick={startEdit}>
            {value === null ? 'null' : typeof value === 'string' ? `"${value}"` : String(value)}
          </span>
        )}
      </div>
    );
  }

  const entries = isArray
    ? (value as unknown[]).map((v, i) => [String(i), v] as const)
    : Object.entries(value as Record<string, unknown>);

  const count = entries.length;
  const summary = isArray ? `Array(${count})` : `{${count} keys}`;

  return (
    <div className="si-node">
      <div
        className="si-branch"
        style={{ paddingLeft: `${depth * 16}px` }}
        onClick={() => setExpanded(!expanded)}
      >
        <span className={`si-toggle ${expanded ? 'si-toggle-open' : ''}`}>&#9654;</span>
        <span className="si-key">{label}</span>
        <span className="si-summary">{summary}</span>
      </div>
      {expanded && entries.map(([key, val]) => (
        <TreeNode
          key={key}
          label={key}
          value={val}
          depth={depth + 1}
          path={path ? `${path}.${key}` : key}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  State Source Definitions                                            */
/* ------------------------------------------------------------------ */

type StateSourceId = 'localStorage' | 'sample-game' | 'sample-battle' | 'custom';

interface StateSource {
  id: StateSourceId;
  label: string;
  getData: () => Record<string, unknown>;
}

function getAllLocalStorage(): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    try {
      result[key] = JSON.parse(localStorage.getItem(key)!);
    } catch {
      result[key] = localStorage.getItem(key);
    }
  }
  return result;
}

function getSampleGameState(): Record<string, unknown> {
  // Try to load from localStorage game save
  for (let i = 1; i <= 3; i++) {
    const raw = localStorage.getItem(`the_little_soldier_save_p${i}`);
    if (raw) {
      try { return JSON.parse(raw); } catch { /* skip */ }
    }
  }
  // Fallback to old key
  const raw = localStorage.getItem('the_little_soldier_save');
  if (raw) {
    try { return JSON.parse(raw); } catch { /* skip */ }
  }
  return { _note: 'No game save found in localStorage' };
}

function getSampleBattleState(): Record<string, unknown> {
  const game = getSampleGameState();
  if (game.battleState && typeof game.battleState === 'object') {
    return game.battleState as Record<string, unknown>;
  }
  return { _note: 'No battleState found in current game save' };
}

const sources: StateSource[] = [
  { id: 'localStorage', label: 'All localStorage', getData: getAllLocalStorage },
  { id: 'sample-game', label: 'Game Save', getData: getSampleGameState },
  { id: 'sample-battle', label: 'Battle State', getData: getSampleBattleState },
];

/* ------------------------------------------------------------------ */
/*  Main Page Component                                                */
/* ------------------------------------------------------------------ */

export function StateInspectorPage() {
  const [sourceId, setSourceId] = useState<StateSourceId>('localStorage');
  const [customJson, setCustomJson] = useState('');
  const [customData, setCustomData] = useState<Record<string, unknown> | null>(null);
  const [parseError, setParseError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [copyMsg, setCopyMsg] = useState('');

  const activeData = useMemo(() => {
    if (sourceId === 'custom') return customData ?? {};
    const src = sources.find((s) => s.id === sourceId);
    return src?.getData() ?? {};
  }, [sourceId, customData]);

  const filteredData = useMemo(() => {
    if (!searchQuery) return activeData;
    const q = searchQuery.toLowerCase();
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(activeData)) {
      if (key.toLowerCase().includes(q) || JSON.stringify(val).toLowerCase().includes(q)) {
        result[key] = val;
      }
    }
    return result;
  }, [activeData, searchQuery]);

  const handleImport = useCallback(() => {
    try {
      const parsed = JSON.parse(customJson);
      setCustomData(parsed);
      setSourceId('custom');
      setParseError('');
    } catch (e) {
      setParseError(`Parse error: ${(e as Error).message}`);
    }
  }, [customJson]);

  const handleExport = useCallback(() => {
    const json = JSON.stringify(activeData, null, 2);
    navigator.clipboard.writeText(json).then(() => {
      setCopyMsg('Copied!');
      setTimeout(() => setCopyMsg(''), 2000);
    });
  }, [activeData]);

  const handleRefresh = useCallback(() => {
    // Force re-render by toggling source
    const cur = sourceId;
    setSourceId('custom' as StateSourceId);
    setTimeout(() => setSourceId(cur), 0);
  }, [sourceId]);

  const keyCount = Object.keys(filteredData).length;

  return (
    <div className="si-page">
      {/* Toolbar */}
      <div className="art-lab-toolbar">
        <span className="art-lab-toolbar-label">Source:</span>
        {sources.map((s) => (
          <button
            key={s.id}
            className={`art-lab-filter-btn${sourceId === s.id ? ' active' : ''}`}
            onClick={() => setSourceId(s.id)}
          >
            {s.label}
          </button>
        ))}
        <button
          className={`art-lab-filter-btn${sourceId === 'custom' ? ' active' : ''}`}
          onClick={() => setSourceId('custom')}
        >
          Custom JSON
        </button>

        <span className="art-lab-toolbar-divider" />

        <input
          className="si-search"
          type="text"
          placeholder="Search keys/values..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <span className="art-lab-toolbar-divider" />

        <button className="art-lab-small-btn" onClick={handleExport}>Export JSON</button>
        <button className="art-lab-small-btn" onClick={handleRefresh}>Refresh</button>
        {copyMsg && <span className="si-copy-msg">{copyMsg}</span>}

        <span className="art-lab-count">{keyCount} {keyCount === 1 ? 'key' : 'keys'}</span>
      </div>

      {/* Import area (custom mode) */}
      {sourceId === 'custom' && (
        <div className="si-import-area">
          <textarea
            className="si-import-textarea"
            placeholder="Paste JSON here..."
            value={customJson}
            onChange={(e) => setCustomJson(e.target.value)}
            rows={6}
          />
          <div className="si-import-actions">
            <button className="art-lab-filter-btn active" onClick={handleImport}>Parse & Load</button>
            {parseError && <span className="si-parse-error">{parseError}</span>}
          </div>
        </div>
      )}

      {/* Tree viewer */}
      <div className="si-tree">
        {Object.keys(filteredData).length === 0 ? (
          <div className="si-empty">No data to display.</div>
        ) : (
          Object.entries(filteredData).map(([key, val]) => (
            <TreeNode
              key={key}
              label={key}
              value={val}
              depth={0}
              path={key}
            />
          ))
        )}
      </div>
    </div>
  );
}
