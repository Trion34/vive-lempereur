import { useEffect, useState, useMemo } from 'react';
import { useAssetStudioStore, type AssetStudioTab } from '../stores/assetStudioStore';
import {
  AVAILABLE_MODELS,
  STYLE_PRESETS,
  ASPECT_RATIOS,
  buildFullPrompt,
  testApiKey,
} from '../services/replicateApi';
import { getDisplayUrl, type AssetRecord, type CharacterRecord } from '../services/assetDb';

/* ------------------------------------------------------------------ */
/*  Tab bar                                                            */
/* ------------------------------------------------------------------ */

const TABS: { id: AssetStudioTab; label: string }[] = [
  { id: 'generate', label: 'Generate' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'characters', label: 'Characters' },
  { id: 'settings', label: 'Settings' },
];

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export function AssetStudioPage() {
  const { tab, setTab, loadAssets, loadCharacters, apiKey } = useAssetStudioStore();

  useEffect(() => {
    loadAssets();
    loadCharacters();
  }, []);

  // Nudge user to settings if no API key
  useEffect(() => {
    if (!apiKey && tab === 'generate') {
      setTab('settings');
    }
  }, []);

  return (
    <div className="as-page">
      <div className="as-tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`as-tab${tab === t.id ? ' active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="as-content">
        {tab === 'generate' && <GenerateTab />}
        {tab === 'gallery' && <GalleryTab />}
        {tab === 'characters' && <CharactersTab />}
        {tab === 'settings' && <SettingsTab />}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Generate Tab                                                       */
/* ------------------------------------------------------------------ */

function GenerateTab() {
  const {
    prompt, setPrompt,
    stylePresetId, setStylePresetId,
    modelId, setModelId,
    aspectRatio, setAspectRatio,
    generating, generationStatus, generationError,
    currentResult,
    generate,
    saveCurrentImage,
    characters,
  } = useAssetStudioStore();

  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveTags, setSaveTags] = useState('');
  const [saveCharacterId, setSaveCharacterId] = useState<string | null>(null);
  const [saveNotes, setSaveNotes] = useState('');
  const [saved, setSaved] = useState(false);

  const preset = STYLE_PRESETS.find((p) => p.id === stylePresetId)!;
  const fullPromptPreview = prompt.trim() ? buildFullPrompt(prompt.trim(), preset) : '';

  function handleGenerate() {
    setSaved(false);
    setSaveDialogOpen(false);
    generate();
  }

  async function handleSave() {
    if (!currentResult) return;
    const tags = saveTags.split(',').map((t) => t.trim()).filter(Boolean);
    await saveCurrentImage(0, tags, saveCharacterId, saveNotes);
    setSaved(true);
    setSaveDialogOpen(false);
  }

  return (
    <div className="as-generate">
      {/* Left panel — controls */}
      <div className="as-generate-controls">
        <label className="as-label">Style Preset</label>
        <select
          className="as-select"
          value={stylePresetId}
          onChange={(e) => setStylePresetId(e.target.value)}
        >
          {STYLE_PRESETS.map((p) => (
            <option key={p.id} value={p.id}>{p.label}</option>
          ))}
        </select>

        <label className="as-label">Prompt</label>
        <textarea
          className="as-textarea"
          rows={5}
          placeholder="Describe what you want to generate..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && !generating) {
              handleGenerate();
            }
          }}
        />

        {fullPromptPreview && (
          <div className="as-full-prompt-preview">
            <span className="as-label-sm">Full prompt:</span>
            <p className="as-preview-text">{fullPromptPreview}</p>
          </div>
        )}

        <div className="as-row">
          <div className="as-field">
            <label className="as-label">Model</label>
            <select
              className="as-select"
              value={modelId}
              onChange={(e) => setModelId(e.target.value)}
            >
              {AVAILABLE_MODELS.map((m) => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
          </div>

          <div className="as-field">
            <label className="as-label">Aspect Ratio</label>
            <select
              className="as-select"
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
            >
              {ASPECT_RATIOS.map((ar) => (
                <option key={ar.id} value={ar.id}>{ar.label}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          className="as-generate-btn"
          onClick={handleGenerate}
          disabled={generating || !prompt.trim()}
        >
          {generating ? generationStatus : 'Generate'}
        </button>
        <span className="as-hint">Ctrl+Enter to generate</span>

        {generationError && (
          <div className="as-error">{generationError}</div>
        )}
      </div>

      {/* Right panel — result */}
      <div className="as-generate-result">
        {currentResult ? (
          <>
            <div className="as-result-image-wrap">
              <img
                className="as-result-image"
                src={currentResult.urls[0]}
                alt={currentResult.prompt}
              />
            </div>
            <div className="as-result-actions">
              {!saved ? (
                !saveDialogOpen ? (
                  <button className="as-btn as-btn-primary" onClick={() => setSaveDialogOpen(true)}>
                    Save to Gallery
                  </button>
                ) : (
                  <div className="as-save-dialog">
                    <label className="as-label-sm">Tags (comma-separated)</label>
                    <input
                      className="as-input"
                      value={saveTags}
                      onChange={(e) => setSaveTags(e.target.value)}
                      placeholder="character, portrait, napoleon..."
                    />
                    {characters.length > 0 && (
                      <>
                        <label className="as-label-sm">Character</label>
                        <select
                          className="as-select"
                          value={saveCharacterId || ''}
                          onChange={(e) => setSaveCharacterId(e.target.value || null)}
                        >
                          <option value="">None</option>
                          {characters.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </>
                    )}
                    <label className="as-label-sm">Notes</label>
                    <input
                      className="as-input"
                      value={saveNotes}
                      onChange={(e) => setSaveNotes(e.target.value)}
                      placeholder="Optional notes..."
                    />
                    <div className="as-save-actions">
                      <button className="as-btn as-btn-primary" onClick={handleSave}>Save</button>
                      <button className="as-btn" onClick={() => setSaveDialogOpen(false)}>Cancel</button>
                    </div>
                  </div>
                )
              ) : (
                <span className="as-saved-badge">Saved to gallery</span>
              )}
              <button
                className="as-btn"
                onClick={handleGenerate}
                disabled={generating}
              >
                Regenerate
              </button>
            </div>
            <div className="as-result-meta">
              <span>Model: {AVAILABLE_MODELS.find((m) => m.id === currentResult.modelId)?.label}</span>
              <span>Style: {STYLE_PRESETS.find((p) => p.id === currentResult.stylePresetId)?.label}</span>
              <span>Aspect: {currentResult.aspectRatio}</span>
            </div>
          </>
        ) : (
          <div className="as-placeholder">
            {generating ? (
              <div className="as-generating">
                <div className="as-spinner" />
                <p>{generationStatus}</p>
              </div>
            ) : (
              <p>Enter a prompt and click Generate to create an image</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Gallery Tab                                                        */
/* ------------------------------------------------------------------ */

function GalleryTab() {
  const {
    assets, galleryFilter, setGalleryFilter,
    galleryTagFilter, setGalleryTagFilter,
    galleryCharacterFilter, setGalleryCharacterFilter,
    deleteAsset, toggleFavorite,
    selectedAssetId, setSelectedAssetId,
    characters,
  } = useAssetStudioStore();

  // Collect all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    assets.forEach((a) => a.tags.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [assets]);

  // Filter assets
  const filteredAssets = useMemo(() => {
    let result = assets;
    if (galleryFilter === 'favorites') {
      result = result.filter((a) => a.favorite);
    }
    if (galleryTagFilter) {
      result = result.filter((a) => a.tags.includes(galleryTagFilter));
    }
    if (galleryCharacterFilter) {
      result = result.filter((a) => a.characterId === galleryCharacterFilter);
    }
    return result;
  }, [assets, galleryFilter, galleryTagFilter, galleryCharacterFilter]);

  const selectedAsset = assets.find((a) => a.id === selectedAssetId);

  return (
    <div className="as-gallery-layout">
      {/* Toolbar */}
      <div className="as-gallery-toolbar">
        <div className="as-gallery-filters">
          <button
            className={`as-filter-btn${galleryFilter === 'all' ? ' active' : ''}`}
            onClick={() => setGalleryFilter('all')}
          >
            All ({assets.length})
          </button>
          <button
            className={`as-filter-btn${galleryFilter === 'favorites' ? ' active' : ''}`}
            onClick={() => setGalleryFilter('favorites')}
          >
            Favorites
          </button>

          {allTags.length > 0 && (
            <select
              className="as-select as-select-sm"
              value={galleryTagFilter}
              onChange={(e) => setGalleryTagFilter(e.target.value)}
            >
              <option value="">All Tags</option>
              {allTags.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          )}

          {characters.length > 0 && (
            <select
              className="as-select as-select-sm"
              value={galleryCharacterFilter || ''}
              onChange={(e) => setGalleryCharacterFilter(e.target.value || null)}
            >
              <option value="">All Characters</option>
              {characters.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}
        </div>
        <span className="as-gallery-count">{filteredAssets.length} assets</span>
      </div>

      <div className="as-gallery-body">
        {/* Grid */}
        <div className="as-gallery-grid">
          {filteredAssets.length === 0 ? (
            <div className="as-placeholder">
              <p>{assets.length === 0 ? 'No assets saved yet. Generate some images first!' : 'No assets match your filters.'}</p>
            </div>
          ) : (
            filteredAssets.map((asset) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                selected={selectedAssetId === asset.id}
                onClick={() => setSelectedAssetId(asset.id === selectedAssetId ? null : asset.id)}
                onToggleFavorite={() => toggleFavorite(asset.id)}
              />
            ))
          )}
        </div>

        {/* Detail panel */}
        {selectedAsset && (
          <AssetDetailPanel
            asset={selectedAsset}
            onClose={() => setSelectedAssetId(null)}
            onDelete={() => deleteAsset(selectedAsset.id)}
          />
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Asset Card                                                         */
/* ------------------------------------------------------------------ */

function AssetCard({
  asset,
  selected,
  onClick,
  onToggleFavorite,
}: {
  asset: AssetRecord;
  selected: boolean;
  onClick: () => void;
  onToggleFavorite: () => void;
}) {
  const [url, setUrl] = useState<string>('');

  useEffect(() => {
    const displayUrl = getDisplayUrl(asset);
    setUrl(displayUrl);
    return () => {
      if (asset.imageBlob) URL.revokeObjectURL(displayUrl);
    };
  }, [asset]);

  return (
    <div className={`as-asset-card${selected ? ' selected' : ''}`} onClick={onClick}>
      <div className="as-card-image-wrap">
        {url && <img className="as-card-image" src={url} alt={asset.prompt} loading="lazy" />}
      </div>
      <div className="as-card-footer">
        <span className="as-card-prompt" title={asset.prompt}>{asset.prompt}</span>
        <button
          className={`as-card-fav${asset.favorite ? ' active' : ''}`}
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
          title={asset.favorite ? 'Unfavorite' : 'Favorite'}
        >
          {asset.favorite ? '\u2605' : '\u2606'}
        </button>
      </div>
      {asset.tags.length > 0 && (
        <div className="as-card-tags">
          {asset.tags.map((t) => (
            <span key={t} className="as-tag">{t}</span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Asset Detail Panel                                                 */
/* ------------------------------------------------------------------ */

function AssetDetailPanel({
  asset,
  onClose,
  onDelete,
}: {
  asset: AssetRecord;
  onClose: () => void;
  onDelete: () => void;
}) {
  const { updateTags, updateNotes } = useAssetStudioStore();
  const [editTags, setEditTags] = useState(asset.tags.join(', '));
  const [editNotes, setEditNotes] = useState(asset.notes);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [url, setUrl] = useState<string>('');

  useEffect(() => {
    const displayUrl = getDisplayUrl(asset);
    setUrl(displayUrl);
    setEditTags(asset.tags.join(', '));
    setEditNotes(asset.notes);
    return () => {
      if (asset.imageBlob) URL.revokeObjectURL(displayUrl);
    };
  }, [asset]);

  function handleSaveMeta() {
    const tags = editTags.split(',').map((t) => t.trim()).filter(Boolean);
    updateTags(asset.id, tags);
    updateNotes(asset.id, editNotes);
  }

  return (
    <div className="as-detail-panel">
      <div className="as-detail-header">
        <span className="as-detail-title">Asset Details</span>
        <button className="as-detail-close" onClick={onClose}>&times;</button>
      </div>

      {url && <img className="as-detail-image" src={url} alt={asset.prompt} />}

      <div className="as-detail-meta">
        <div className="as-detail-row">
          <span className="as-detail-label">Prompt</span>
          <p className="as-detail-value">{asset.prompt}</p>
        </div>
        <div className="as-detail-row">
          <span className="as-detail-label">Full Prompt</span>
          <p className="as-detail-value as-detail-value-sm">{asset.fullPrompt}</p>
        </div>
        <div className="as-detail-row">
          <span className="as-detail-label">Model</span>
          <span className="as-detail-value">{AVAILABLE_MODELS.find((m) => m.id === asset.modelId)?.label || asset.modelId}</span>
        </div>
        <div className="as-detail-row">
          <span className="as-detail-label">Style</span>
          <span className="as-detail-value">{STYLE_PRESETS.find((p) => p.id === asset.stylePresetId)?.label || asset.stylePresetId}</span>
        </div>
        <div className="as-detail-row">
          <span className="as-detail-label">Aspect</span>
          <span className="as-detail-value">{asset.aspectRatio}</span>
        </div>
        <div className="as-detail-row">
          <span className="as-detail-label">Created</span>
          <span className="as-detail-value">{new Date(asset.createdAt).toLocaleString()}</span>
        </div>
      </div>

      <div className="as-detail-edit">
        <label className="as-label-sm">Tags</label>
        <input
          className="as-input"
          value={editTags}
          onChange={(e) => setEditTags(e.target.value)}
        />
        <label className="as-label-sm">Notes</label>
        <textarea
          className="as-textarea as-textarea-sm"
          rows={3}
          value={editNotes}
          onChange={(e) => setEditNotes(e.target.value)}
        />
        <button className="as-btn as-btn-primary" onClick={handleSaveMeta}>
          Update
        </button>
      </div>

      <div className="as-detail-danger">
        {!confirmDelete ? (
          <button className="as-btn as-btn-danger" onClick={() => setConfirmDelete(true)}>
            Delete Asset
          </button>
        ) : (
          <div className="as-confirm-row">
            <span>Delete this asset?</span>
            <button className="as-btn as-btn-danger" onClick={onDelete}>Yes, delete</button>
            <button className="as-btn" onClick={() => setConfirmDelete(false)}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Characters Tab                                                     */
/* ------------------------------------------------------------------ */

function CharactersTab() {
  const { characters, addCharacter, removeCharacter, updateCharacter, assets } = useAssetStudioStore();
  const [editing, setEditing] = useState<CharacterRecord | null>(null);
  const [isNew, setIsNew] = useState(false);

  function startNew() {
    setEditing({
      id: crypto.randomUUID(),
      name: '',
      description: '',
      styleNotes: '',
      promptTemplate: '',
      referenceAssetIds: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    setIsNew(true);
  }

  async function handleSave() {
    if (!editing || !editing.name.trim()) return;
    editing.updatedAt = Date.now();
    if (isNew) {
      await addCharacter(editing);
    } else {
      await updateCharacter(editing);
    }
    setEditing(null);
    setIsNew(false);
  }

  function handleEdit(char: CharacterRecord) {
    setEditing({ ...char });
    setIsNew(false);
  }

  // Count assets per character
  const assetCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    assets.forEach((a) => {
      if (a.characterId) {
        counts[a.characterId] = (counts[a.characterId] || 0) + 1;
      }
    });
    return counts;
  }, [assets]);

  return (
    <div className="as-characters">
      <div className="as-characters-header">
        <h3 className="as-section-title">Character Sheets</h3>
        <button className="as-btn as-btn-primary" onClick={startNew}>+ New Character</button>
      </div>

      {editing && (
        <div className="as-character-editor">
          <h4>{isNew ? 'New Character' : `Editing: ${editing.name}`}</h4>
          <label className="as-label">Name</label>
          <input
            className="as-input"
            value={editing.name}
            onChange={(e) => setEditing({ ...editing, name: e.target.value })}
            placeholder="e.g., Jean-Baptiste, Pierre, Napoleon"
          />
          <label className="as-label">Description</label>
          <textarea
            className="as-textarea"
            rows={3}
            value={editing.description}
            onChange={(e) => setEditing({ ...editing, description: e.target.value })}
            placeholder="Physical description, personality, role in the story..."
          />
          <label className="as-label">Style Notes</label>
          <textarea
            className="as-textarea as-textarea-sm"
            rows={2}
            value={editing.styleNotes}
            onChange={(e) => setEditing({ ...editing, styleNotes: e.target.value })}
            placeholder="Art direction notes for this character..."
          />
          <label className="as-label">Prompt Template</label>
          <textarea
            className="as-textarea"
            rows={3}
            value={editing.promptTemplate}
            onChange={(e) => setEditing({ ...editing, promptTemplate: e.target.value })}
            placeholder="Base prompt fragment for generating this character. Use {pose} or {scene} as placeholders."
          />
          <div className="as-editor-actions">
            <button className="as-btn as-btn-primary" onClick={handleSave} disabled={!editing.name.trim()}>
              {isNew ? 'Create' : 'Save Changes'}
            </button>
            <button className="as-btn" onClick={() => { setEditing(null); setIsNew(false); }}>Cancel</button>
          </div>
        </div>
      )}

      <div className="as-character-list">
        {characters.length === 0 && !editing ? (
          <div className="as-placeholder">
            <p>No characters defined yet. Create character sheets to maintain consistency across generated assets.</p>
          </div>
        ) : (
          characters.map((char) => (
            <div key={char.id} className="as-character-card">
              <div className="as-character-info">
                <span className="as-character-name">{char.name}</span>
                <p className="as-character-desc">{char.description}</p>
                {char.styleNotes && <p className="as-character-style">{char.styleNotes}</p>}
                <span className="as-character-count">{assetCounts[char.id] || 0} assets</span>
              </div>
              <div className="as-character-actions">
                <button className="as-btn-sm" onClick={() => handleEdit(char)}>Edit</button>
                <button className="as-btn-sm as-btn-danger-sm" onClick={() => removeCharacter(char.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Settings Tab                                                       */
/* ------------------------------------------------------------------ */

function SettingsTab() {
  const { apiKey, setApiKey, defaultModelId, setDefaultModelId } = useAssetStudioStore();
  const [keyInput, setKeyInput] = useState(apiKey);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'ok' | 'fail' | null>(null);

  function handleSaveKey() {
    setApiKey(keyInput.trim());
    setTestResult(null);
  }

  async function handleTestKey() {
    if (!keyInput.trim()) return;
    setTesting(true);
    setTestResult(null);
    const ok = await testApiKey(keyInput.trim());
    setTestResult(ok ? 'ok' : 'fail');
    setTesting(false);
  }

  return (
    <div className="as-settings">
      <h3 className="as-section-title">Settings</h3>

      <div className="as-settings-section">
        <h4>Replicate API Key</h4>
        <p className="as-hint">
          Get your API key from{' '}
          <a href="https://replicate.com/account/api-tokens" target="_blank" rel="noopener noreferrer" className="as-link">
            replicate.com/account/api-tokens
          </a>
        </p>
        <div className="as-key-row">
          <input
            className="as-input as-input-key"
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="r8_..."
          />
          <button className="as-btn as-btn-primary" onClick={handleSaveKey}>Save</button>
          <button className="as-btn" onClick={handleTestKey} disabled={testing || !keyInput.trim()}>
            {testing ? 'Testing...' : 'Test'}
          </button>
        </div>
        {testResult === 'ok' && <span className="as-test-ok">API key is valid</span>}
        {testResult === 'fail' && <span className="as-test-fail">Invalid API key or network error</span>}
        {apiKey && <span className="as-hint">Key saved. Stored in browser localStorage only.</span>}
      </div>

      <div className="as-settings-section">
        <h4>Default Model</h4>
        <select
          className="as-select"
          value={defaultModelId}
          onChange={(e) => setDefaultModelId(e.target.value)}
        >
          {AVAILABLE_MODELS.map((m) => (
            <option key={m.id} value={m.id}>{m.label}</option>
          ))}
        </select>
        <p className="as-hint">
          Schnell is fastest and cheapest (~$0.003/image). Pro produces higher quality (~$0.04/image).
        </p>
      </div>

      <div className="as-settings-section">
        <h4>About</h4>
        <p className="as-hint">
          Asset Studio generates images via the Replicate API and stores them locally in your browser's
          IndexedDB. Nothing is sent to any server except Replicate for generation.
          API calls are proxied through the Vite dev server to handle CORS.
        </p>
      </div>
    </div>
  );
}
