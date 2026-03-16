import React, { useState, useCallback, useMemo, useEffect } from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ProfileData {
  id: number;
  playerName: string;
  lifetimeGlory: number;
  currentGlory: number;
  lastPlayed: number | string | null;
}

interface StorageEntry {
  key: string;
  value: string;
  size: number;
  isGameKey: boolean;
}

const GAME_KEY_PREFIXES = [
  'the_little_soldier_',
];

function isGameKey(key: string): boolean {
  return GAME_KEY_PREFIXES.some((p) => key.startsWith(p));
}

function parseImportedValue(value: unknown): unknown {
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function isValidProfilesValue(value: unknown): boolean {
  const parsed = parseImportedValue(value);
  return Array.isArray(parsed) && parsed.every((item) =>
    item
    && typeof item === 'object'
    && typeof (item as ProfileData).id === 'number'
    && typeof (item as ProfileData).playerName === 'string'
    && typeof (item as ProfileData).lifetimeGlory === 'number'
    && typeof (item as ProfileData).currentGlory === 'number'
    && ('lastPlayed' in item),
  );
}

function validateImportEntry(key: string, value: unknown): string | null {
  if (!isGameKey(key)) {
    return `Only the_little_soldier_* keys can be imported (${key})`;
  }

  if (key === 'the_little_soldier_profiles' && !isValidProfilesValue(value)) {
    return 'the_little_soldier_profiles must contain a valid profile array';
  }

  return null;
}

function bytesLabel(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function SaveManagerPage() {
  const [profiles, setProfiles] = useState<ProfileData[]>([]);
  const [storageEntries, setStorageEntries] = useState<StorageEntry[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<'all' | 'game'>('game');
  const [editingGlory, setEditingGlory] = useState<{ profileId: number; field: 'lifetimeGlory' | 'currentGlory'; value: string } | null>(null);
  const [copyMsg, setCopyMsg] = useState('');
  const [importJson, setImportJson] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [importError, setImportError] = useState('');

  const loadData = useCallback(() => {
    // Load profiles
    const raw = localStorage.getItem('the_little_soldier_profiles');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setProfiles(Array.isArray(parsed) ? parsed : []);
      } catch {
        setProfiles([]);
      }
    } else {
      setProfiles([]);
    }

    // Load all storage entries
    const entries: StorageEntry[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      const value = localStorage.getItem(key) ?? '';
      entries.push({
        key,
        value,
        size: new Blob([value]).size,
        isGameKey: isGameKey(key),
      });
    }
    entries.sort((a, b) => {
      if (a.isGameKey !== b.isGameKey) return a.isGameKey ? -1 : 1;
      return a.key.localeCompare(b.key);
    });
    setStorageEntries(entries);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const filteredEntries = useMemo(
    () => filterMode === 'game' ? storageEntries.filter((e) => e.isGameKey) : storageEntries,
    [storageEntries, filterMode],
  );

  useEffect(() => {
    if (selectedKey && !filteredEntries.some((entry) => entry.key === selectedKey)) {
      setSelectedKey(filteredEntries[0]?.key ?? null);
    }
  }, [filteredEntries, selectedKey]);

  const totalSize = useMemo(
    () => storageEntries.reduce((sum, e) => sum + e.size, 0),
    [storageEntries],
  );

  const gameSize = useMemo(
    () => storageEntries.filter((e) => e.isGameKey).reduce((sum, e) => sum + e.size, 0),
    [storageEntries],
  );

  const selectedEntry = storageEntries.find((e) => e.key === selectedKey);

  const handleDeleteKey = useCallback((key: string) => {
    const entry = storageEntries.find((candidate) => candidate.key === key);
    if (!entry) return;

    const firstPrompt = entry.isGameKey
      ? `Delete localStorage key "${key}"? This cannot be undone.`
      : `Delete non-game localStorage key "${key}"? This may break Lab Hub or other local app state.`;
    if (!window.confirm(firstPrompt)) return;
    if (!entry.isGameKey && !window.confirm(`"${key}" is not a the_little_soldier_* key. Delete it anyway?`)) return;

    localStorage.removeItem(key);
    if (selectedKey === key) setSelectedKey(null);
    loadData();
  }, [selectedKey, loadData, storageEntries]);

  const handleGloryEdit = useCallback((profileId: number, field: 'lifetimeGlory' | 'currentGlory', value: string) => {
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 0) return;
    const raw = localStorage.getItem('the_little_soldier_profiles');
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as ProfileData[];
      const profile = parsed.find((p) => p.id === profileId);
      if (profile) {
        profile[field] = num;
        localStorage.setItem('the_little_soldier_profiles', JSON.stringify(parsed));
        loadData();
      }
    } catch { /* skip */ }
    setEditingGlory(null);
  }, [loadData]);

  const handleClearProfile = useCallback((profileId: number) => {
    if (!window.confirm(`Clear profile slot ${profileId}? This removes its save and glory data.`)) return;
    // Remove save and glory for this profile
    localStorage.removeItem(`the_little_soldier_save_p${profileId}`);
    localStorage.removeItem(`the_little_soldier_glory_p${profileId}`);
    // Reset profile data
    const raw = localStorage.getItem('the_little_soldier_profiles');
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as ProfileData[];
        const profile = parsed.find((p) => p.id === profileId);
        if (profile) {
          profile.playerName = '';
          profile.lifetimeGlory = profileId === 3 ? 100 : 0;
          profile.currentGlory = profileId === 3 ? 100 : 0;
          profile.lastPlayed = null;
          localStorage.setItem('the_little_soldier_profiles', JSON.stringify(parsed));
        }
      } catch { /* skip */ }
    }
    loadData();
  }, [loadData]);

  const handleExportAll = useCallback(() => {
    const data: Record<string, string> = {};
    for (const entry of storageEntries) {
      if (entry.isGameKey) {
        data[entry.key] = entry.value;
      }
    }
    navigator.clipboard.writeText(JSON.stringify(data, null, 2)).then(() => {
      setCopyMsg('Exported!');
      setTimeout(() => setCopyMsg(''), 2000);
    }).catch(() => {
      setCopyMsg('Export failed');
      setTimeout(() => setCopyMsg(''), 2000);
    });
  }, [storageEntries]);

  const handleImport = useCallback(() => {
    try {
      const parsed = JSON.parse(importJson);
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        setImportError('Import data must be a JSON object of key/value pairs.');
        return;
      }

      const entries = Object.entries(parsed);
      if (entries.length === 0) {
        setImportError('Import data is empty.');
        return;
      }

      const validationError = entries
        .map(([key, value]) => validateImportEntry(key, value))
        .find((error): error is string => Boolean(error));
      if (validationError) {
        setImportError(validationError);
        return;
      }

      if (!window.confirm(`Import ${entries.length} game key(s) into localStorage? Existing keys with the same name will be overwritten.`)) {
        return;
      }

      for (const [key, value] of entries) {
        localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
      }
      setImportError('');
      setCopyMsg(`Imported ${entries.length} key${entries.length === 1 ? '' : 's'}.`);
      setTimeout(() => setCopyMsg(''), 2500);
      setShowImport(false);
      setImportJson('');
      loadData();
    } catch (err) {
      setImportError(`Import failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [importJson, loadData]);

  const formatValue = (val: string): string => {
    try {
      return JSON.stringify(JSON.parse(val), null, 2);
    } catch {
      return val;
    }
  };

  return (
    <div className="sm-page">
      {/* Profiles Section */}
      <div className="sm-section">
        <h2 className="sm-section-title">Profiles</h2>
        <div className="sm-profiles">
          {profiles.length === 0 ? (
            <div className="si-empty">No profiles found. Start the game to create one.</div>
          ) : (
            profiles.map((p) => (
              <div key={p.id} className="sm-profile-card">
                <div className="sm-profile-header">
                  <span className="sm-profile-slot">Slot {p.id}</span>
                  {p.id === 3 && <span className="sm-profile-dev">DEV</span>}
                  <span className="sm-profile-name">{p.playerName || '(empty)'}</span>
                </div>
                <div className="sm-profile-stats">
                  <div className="sm-profile-stat">
                    <span className="sm-stat-label">Lifetime Glory</span>
                    {editingGlory?.profileId === p.id && editingGlory?.field === 'lifetimeGlory' ? (
                      <input
                        className="sm-glory-input"
                        value={editingGlory.value}
                        onChange={(e) => setEditingGlory({ ...editingGlory, value: e.target.value })}
                        onBlur={() => handleGloryEdit(p.id, 'lifetimeGlory', editingGlory.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleGloryEdit(p.id, 'lifetimeGlory', editingGlory.value); }}
                        autoFocus
                      />
                    ) : (
                      <span
                        className="sm-stat-value sm-stat-editable"
                        onDoubleClick={() => setEditingGlory({ profileId: p.id, field: 'lifetimeGlory', value: String(p.lifetimeGlory) })}
                      >
                        {p.lifetimeGlory}
                      </span>
                    )}
                  </div>
                  <div className="sm-profile-stat">
                    <span className="sm-stat-label">Current Glory</span>
                    {editingGlory?.profileId === p.id && editingGlory?.field === 'currentGlory' ? (
                      <input
                        className="sm-glory-input"
                        value={editingGlory.value}
                        onChange={(e) => setEditingGlory({ ...editingGlory, value: e.target.value })}
                        onBlur={() => handleGloryEdit(p.id, 'currentGlory', editingGlory.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleGloryEdit(p.id, 'currentGlory', editingGlory.value); }}
                        autoFocus
                      />
                    ) : (
                      <span
                        className="sm-stat-value sm-stat-editable"
                        onDoubleClick={() => setEditingGlory({ profileId: p.id, field: 'currentGlory', value: String(p.currentGlory) })}
                      >
                        {p.currentGlory}
                      </span>
                    )}
                  </div>
                  <div className="sm-profile-stat">
                    <span className="sm-stat-label">Last Played</span>
                    <span className="sm-stat-value">
                      {p.lastPlayed ? new Date(p.lastPlayed).toLocaleDateString() : 'Never'}
                    </span>
                  </div>
                </div>
                <div className="sm-profile-actions">
                  <button className="art-lab-small-btn" onClick={() => handleClearProfile(p.id)}>
                    Clear Profile
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* localStorage Browser */}
      <div className="sm-section">
        <div className="sm-section-header">
          <h2 className="sm-section-title">localStorage Browser</h2>
          <div className="sm-section-controls">
            <button
              className={`art-lab-filter-btn${filterMode === 'game' ? ' active' : ''}`}
              onClick={() => setFilterMode('game')}
            >
              Game Keys
            </button>
            <button
              className={`art-lab-filter-btn${filterMode === 'all' ? ' active' : ''}`}
              onClick={() => setFilterMode('all')}
            >
              All Keys
            </button>
            <span className="art-lab-toolbar-divider" />
            <button className="art-lab-small-btn" onClick={handleExportAll}>Export All</button>
            <button className="art-lab-small-btn" onClick={() => setShowImport(!showImport)}>
              {showImport ? 'Cancel' : 'Import'}
            </button>
            <button className="art-lab-small-btn" onClick={loadData}>Refresh</button>
            {copyMsg && <span className="si-copy-msg">{copyMsg}</span>}
            <span className="sm-size-info">
              Game: {bytesLabel(gameSize)} / Total: {bytesLabel(totalSize)}
            </span>
          </div>
        </div>

        {showImport && (
          <div className="si-import-area">
            <textarea
              className="si-import-textarea"
              placeholder='{"key": "value", ...}'
              value={importJson}
              onChange={(e) => {
                setImportJson(e.target.value);
                if (importError) setImportError('');
              }}
              rows={4}
            />
            <button className="art-lab-filter-btn active" onClick={handleImport}>Import & Save</button>
            {importError && <span className="si-parse-error">{importError}</span>}
          </div>
        )}

        <div className="sm-storage-layout">
          <div className="sm-key-list">
            {filteredEntries.map((entry) => (
              <button
                key={entry.key}
                className={`sm-key-item${selectedKey === entry.key ? ' active' : ''}`}
                onClick={() => setSelectedKey(entry.key)}
              >
                <span className="sm-key-name">{entry.key}</span>
                <span className="sm-key-size">{bytesLabel(entry.size)}</span>
              </button>
            ))}
            {filteredEntries.length === 0 && (
              <div className="si-empty">No keys found.</div>
            )}
          </div>
          <div className="sm-value-panel">
            {selectedEntry ? (
              <>
                <div className="sm-value-header">
                  <span className="sm-value-key">{selectedEntry.key}</span>
                  <span className="sm-value-size">{bytesLabel(selectedEntry.size)}</span>
                  <button
                    className="art-lab-small-btn"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedEntry.value).then(() => {
                        setCopyMsg('Copied!');
                        setTimeout(() => setCopyMsg(''), 2000);
                      }).catch(() => {
                        setCopyMsg('Copy failed');
                        setTimeout(() => setCopyMsg(''), 2000);
                      });
                    }}
                  >
                    Copy
                  </button>
                  <button
                    className="art-lab-small-btn"
                    style={{ color: 'var(--accent-red-bright)' }}
                    onClick={() => handleDeleteKey(selectedEntry.key)}
                  >
                    Delete
                  </button>
                </div>
                <pre className="sm-value-content">{formatValue(selectedEntry.value)}</pre>
              </>
            ) : (
              <div className="si-empty">Select a key to view its value.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
