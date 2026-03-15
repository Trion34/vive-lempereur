import { useEffect, useState, useMemo } from 'react';
import { useAssetStudioStore, type AssetStudioTab } from '../stores/assetStudioStore';
import {
  ASPECT_RATIOS,
  buildFullPrompt,
  testApiKey,
} from '../services/replicateApi';
import { testGeminiApiKey } from '../services/geminiApi';
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
  const { tab, setTab, loadAssets, loadCharacters, loadPresets, apiKey, geminiApiKey } = useAssetStudioStore();

  useEffect(() => {
    loadAssets();
    loadCharacters();
    loadPresets();
  }, []);

  useEffect(() => {
    if (!apiKey && !geminiApiKey && tab === 'generate') setTab('settings');
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
        {(apiKey || geminiApiKey) && <span className="as-api-status" title="API key configured" />}
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

/* ================================================================== */
/*  Generate Tab                                                       */
/* ================================================================== */

function GenerateTab() {
  const store = useAssetStudioStore();
  const {
    prompt, setPrompt, negativePrompt, setNegativePrompt,
    stylePresetId, setStylePresetId,
    modelId, setModelId, aspectRatio, setAspectRatio,
    seed, setSeed, guidance, setGuidance,
    inferenceSteps, setInferenceSteps,
    showAdvanced, setShowAdvanced,
    generating, generationStatus, generationError,
    currentResult, generationHistory,
    generate, selectHistoryItem,
    saveCurrentImage, downloadCurrentImage,
    characters, activeCharacterId, setActiveCharacterId,
    referenceImages, addReferenceImage, removeReferenceImage, clearReferenceImages,
  } = store;

  const allPresets = store.allPresets();
  const models = store.allModels();
  const model = models.find((m) => m.id === modelId)!;
  const preset = allPresets.find((p) => p.id === stylePresetId) || allPresets[0];

  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveTags, setSaveTags] = useState('');
  const [saveCharacterId, setSaveCharacterId] = useState<string | null>(activeCharacterId);
  const [saveNotes, setSaveNotes] = useState('');
  const [showPromptPreview, setShowPromptPreview] = useState(false);

  // Always show what the full prompt will look like
  const fullPromptPreview = buildFullPrompt(
    prompt.trim() || '[your prompt here]',
    preset,
    negativePrompt,
  );

  function handleGenerate() {
    setSaveDialogOpen(false);
    generate();
  }

  async function handleSave() {
    if (!currentResult) return;
    const tags = saveTags.split(',').map((t) => t.trim()).filter(Boolean);
    await saveCurrentImage(0, tags, saveCharacterId, saveNotes);
    setSaveDialogOpen(false);
    setSaveTags('');
    setSaveNotes('');
  }

  return (
    <div className="as-generate">
      {/* Left panel — controls */}
      <div className="as-generate-controls">
        <div className="as-controls-scroll">
          {/* Character context */}
          {characters.length > 0 && (
            <>
              <label className="as-label">Character</label>
              <select
                className="as-select"
                value={activeCharacterId || ''}
                onChange={(e) => {
                  const id = e.target.value || null;
                  setActiveCharacterId(id);
                  if (id) {
                    const char = characters.find((c) => c.id === id);
                    if (char?.promptTemplate) setPrompt(char.promptTemplate);
                  }
                }}
              >
                <option value="">None (freeform)</option>
                {characters.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </>
          )}

          <label className="as-label">Style Preset</label>
          <select
            className="as-select"
            value={stylePresetId}
            onChange={(e) => setStylePresetId(e.target.value)}
          >
            <optgroup label="Built-in">
              {allPresets.filter((p) => p.isBuiltIn).map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </optgroup>
            {allPresets.some((p) => !p.isBuiltIn) && (
              <optgroup label="Custom">
                {allPresets.filter((p) => !p.isBuiltIn).map((p) => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </optgroup>
            )}
          </select>

          <label className="as-label">Prompt</label>
          <textarea
            className="as-textarea"
            rows={5}
            placeholder="Describe what you want to generate..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && !generating) handleGenerate();
            }}
          />

          <label className="as-label">Avoid (negative)</label>
          <input
            className="as-input"
            placeholder="modern clothing, anachronisms, blurry..."
            value={negativePrompt}
            onChange={(e) => setNegativePrompt(e.target.value)}
          />

          {/* Reference images */}
          <div className="as-ref-section">
            <div className="as-ref-header">
              <label className="as-label">Reference Images</label>
              {referenceImages.length > 0 && (
                <button className="as-btn-sm" onClick={clearReferenceImages}>Clear all</button>
              )}
            </div>
            {referenceImages.length > 0 && (
              <div className="as-ref-thumbs">
                {referenceImages.map((ref) => (
                  <div key={ref.id} className="as-ref-thumb">
                    <img src={ref.url} alt={ref.name} />
                    <button className="as-ref-remove" onClick={() => removeReferenceImage(ref.id)}>&times;</button>
                    <span className="as-ref-name">{ref.name}</span>
                  </div>
                ))}
              </div>
            )}
            <label className="as-ref-upload">
              <input
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={(e) => {
                  const files = e.target.files;
                  if (!files) return;
                  for (let i = 0; i < files.length; i++) {
                    addReferenceImage(files[i], 'upload', files[i].name);
                  }
                  e.target.value = '';
                }}
              />
              <span className="as-ref-upload-btn">
                {referenceImages.length === 0 ? 'Upload reference images' : '+ Add more'}
              </span>
            </label>
            {referenceImages.length > 0 && (
              <span className="as-hint">{referenceImages.length}/14 references — Gemini models only</span>
            )}
          </div>

          {/* Collapsible full prompt preview */}
          <button
            className="as-preview-toggle"
            onClick={() => setShowPromptPreview(!showPromptPreview)}
          >
            Full prompt {showPromptPreview ? '\u25BC' : '\u25B6'}
          </button>
          {showPromptPreview && (
            <div className="as-full-prompt-preview">
              <p className="as-preview-text">{fullPromptPreview}</p>
            </div>
          )}

          <div className="as-row">
            <div className="as-field">
              <label className="as-label">Model</label>
              <select className="as-select" value={modelId} onChange={(e) => setModelId(e.target.value)}>
                <optgroup label="Google Gemini (Direct)">
                  {models.filter((m) => 'geminiModelId' in m).map((m) => (
                    <option key={m.id} value={m.id}>{m.label}</option>
                  ))}
                </optgroup>
                <optgroup label="Replicate">
                  {models.filter((m) => !('geminiModelId' in m)).map((m) => (
                    <option key={m.id} value={m.id}>{m.label}</option>
                  ))}
                </optgroup>
              </select>
            </div>
            <div className="as-field">
              <label className="as-label">Aspect Ratio</label>
              <select className="as-select" value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)}>
                {ASPECT_RATIOS.map((ar) => (
                  <option key={ar.id} value={ar.id}>{ar.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Advanced params — collapsible */}
          <button
            className="as-advanced-toggle"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? '\u25BC' : '\u25B6'} Advanced
          </button>

          {showAdvanced && (
            <div className="as-advanced-section">
              <div className="as-row">
                <div className="as-field">
                  <label className="as-label">Seed</label>
                  <input
                    className="as-input"
                    type="number"
                    placeholder="Random"
                    value={seed}
                    onChange={(e) => setSeed(e.target.value)}
                  />
                </div>
                {model.supportsGuidance && (
                  <div className="as-field">
                    <label className="as-label">Guidance ({guidance})</label>
                    <input
                      type="range"
                      className="as-slider"
                      min={model.guidanceRange?.[0] ?? 1}
                      max={model.guidanceRange?.[1] ?? 20}
                      step={0.5}
                      value={guidance}
                      onChange={(e) => setGuidance(Number(e.target.value))}
                    />
                  </div>
                )}
              </div>
              {model.supportsSteps && (
                <div className="as-field">
                  <label className="as-label">Steps ({inferenceSteps})</label>
                  <input
                    type="range"
                    className="as-slider"
                    min={model.stepsRange?.[0] ?? 1}
                    max={model.stepsRange?.[1] ?? 50}
                    step={1}
                    value={inferenceSteps}
                    onChange={(e) => setInferenceSteps(Number(e.target.value))}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="as-controls-footer">
          <button
            className="as-generate-btn"
            onClick={handleGenerate}
            disabled={generating || !prompt.trim()}
          >
            {generating ? generationStatus : 'Generate'}
          </button>
          <span className="as-hint">Ctrl+Enter to generate</span>
          {generationError && <div className="as-error">{generationError}</div>}
        </div>
      </div>

      {/* Right panel — result + history */}
      <div className="as-generate-result">
        {currentResult ? (
          <>
            <div className="as-result-image-wrap">
              <img className="as-result-image" src={currentResult.urls[0]} alt={currentResult.prompt} />
            </div>
            <div className="as-result-actions">
              {!currentResult.saved ? (
                !saveDialogOpen ? (
                  <>
                    <button className="as-btn as-btn-primary" onClick={() => {
                      setSaveCharacterId(activeCharacterId);
                      setSaveDialogOpen(true);
                    }}>
                      Save to Gallery
                    </button>
                    <button className="as-btn" onClick={downloadCurrentImage}>Download</button>
                  </>
                ) : (
                  <SaveDialog
                    tags={saveTags} setTags={setSaveTags}
                    characterId={saveCharacterId} setCharacterId={setSaveCharacterId}
                    notes={saveNotes} setNotes={setSaveNotes}
                    characters={characters}
                    onSave={handleSave} onCancel={() => setSaveDialogOpen(false)}
                  />
                )
              ) : (
                <>
                  <span className="as-saved-badge">Saved</span>
                  <button className="as-btn" onClick={downloadCurrentImage}>Download</button>
                </>
              )}
              <button className="as-btn" onClick={handleGenerate} disabled={generating}>Regenerate</button>
            </div>
            <div className="as-result-meta">
              <span>{models.find((m) => m.id === currentResult.modelId)?.label || currentResult.modelId}</span>
              <span>{allPresets.find((p) => p.id === currentResult.stylePresetId)?.label}</span>
              <span>{currentResult.aspectRatio}</span>
              {currentResult.seed != null && <span>Seed: {currentResult.seed}</span>}
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
              <>
                <div className="as-placeholder-icon">🖼</div>
                <p className="as-placeholder-title">Ready to Generate</p>
                <p>Enter a prompt and press Generate or Ctrl+Enter</p>
              </>
            )}
          </div>
        )}

        {/* History strip */}
        {generationHistory.length > 1 && (
          <div className="as-history-strip">
            <span className="as-history-label">History</span>
            <div className="as-history-items">
              {generationHistory.map((item) => (
                <button
                  key={item.id}
                  className={`as-history-thumb${currentResult?.id === item.id ? ' active' : ''}${item.saved ? ' saved' : ''}`}
                  onClick={() => selectHistoryItem(item.id)}
                  title={item.prompt}
                >
                  <img src={item.urls[0]} alt="" />
                  {item.saved && <span className="as-history-saved-dot" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Save dialog (extracted for clarity)                                 */
/* ------------------------------------------------------------------ */

function SaveDialog({
  tags, setTags, characterId, setCharacterId, notes, setNotes,
  characters, onSave, onCancel,
}: {
  tags: string; setTags: (v: string) => void;
  characterId: string | null; setCharacterId: (v: string | null) => void;
  notes: string; setNotes: (v: string) => void;
  characters: CharacterRecord[];
  onSave: () => void; onCancel: () => void;
}) {
  return (
    <div className="as-save-dialog">
      <label className="as-label-sm">Tags (comma-separated)</label>
      <input className="as-input" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="character, portrait..." />
      {characters.length > 0 && (
        <>
          <label className="as-label-sm">Character</label>
          <select className="as-select" value={characterId || ''} onChange={(e) => setCharacterId(e.target.value || null)}>
            <option value="">None</option>
            {characters.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </>
      )}
      <label className="as-label-sm">Notes</label>
      <input className="as-input" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes..." />
      <div className="as-save-actions">
        <button className="as-btn as-btn-primary" onClick={onSave}>Save</button>
        <button className="as-btn" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Gallery Tab                                                        */
/* ================================================================== */

function GalleryTab() {
  const {
    assets, galleryFilter, setGalleryFilter,
    galleryTagFilter, setGalleryTagFilter,
    galleryCharacterFilter, setGalleryCharacterFilter,
    deleteAsset, toggleFavorite,
    selectedAssetId, setSelectedAssetId,
    comparisonIds, toggleComparison, clearComparison,
    characters, loadPromptFromAsset, downloadAsset,
    addReferenceImage,
    uploadToGallery, restoreAsset, permanentlyDeleteAsset,
  } = useAssetStudioStore();

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    assets.forEach((a) => a.tags.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [assets]);

  const filteredAssets = useMemo(() => {
    let result = assets;
    if (galleryFilter === 'trash') {
      result = result.filter((a) => a.trashedAt != null);
    } else {
      // Non-trash views exclude trashed items
      result = result.filter((a) => a.trashedAt == null);
      if (galleryFilter === 'favorites') result = result.filter((a) => a.favorite);
    }
    if (galleryTagFilter) result = result.filter((a) => a.tags.includes(galleryTagFilter));
    if (galleryCharacterFilter) result = result.filter((a) => a.characterId === galleryCharacterFilter);
    return result;
  }, [assets, galleryFilter, galleryTagFilter, galleryCharacterFilter]);

  const selectedAsset = assets.find((a) => a.id === selectedAssetId);
  const comparisonAssets = assets.filter((a) => comparisonIds.includes(a.id));
  const showComparison = comparisonIds.length >= 2;

  return (
    <div className="as-gallery-layout">
      <div className="as-gallery-toolbar">
        <div className="as-gallery-filters">
          <button className={`as-filter-btn${galleryFilter === 'all' ? ' active' : ''}`} onClick={() => setGalleryFilter('all')}>
            All ({assets.filter(a => !a.trashedAt).length})
          </button>
          <button className={`as-filter-btn${galleryFilter === 'favorites' ? ' active' : ''}`} onClick={() => setGalleryFilter('favorites')}>
            Favorites
          </button>
          <button className={`as-filter-btn${galleryFilter === 'trash' ? ' active' : ''}`} onClick={() => setGalleryFilter('trash')}>
            Trash
          </button>
          {allTags.length > 0 && (
            <select className="as-select as-select-sm" value={galleryTagFilter} onChange={(e) => setGalleryTagFilter(e.target.value)}>
              <option value="">All Tags</option>
              {allTags.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          )}
          {characters.length > 0 && (
            <select className="as-select as-select-sm" value={galleryCharacterFilter || ''} onChange={(e) => setGalleryCharacterFilter(e.target.value || null)}>
              <option value="">All Characters</option>
              {characters.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          )}
        </div>
        <div className="as-gallery-toolbar-right">
          <label className="as-upload-btn">
            <input
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files) uploadToGallery(e.target.files);
                e.target.value = '';
              }}
            />
            <span className="as-btn">Upload</span>
          </label>
          {comparisonIds.length > 0 && (
            <button className="as-btn-sm" onClick={clearComparison}>Clear compare ({comparisonIds.length})</button>
          )}
          <span className="as-gallery-count">{filteredAssets.length} assets</span>
        </div>
      </div>

      {/* Comparison strip */}
      {showComparison && (
        <div className="as-comparison-strip">
          <div className="as-comparison-header">
            <span className="as-label">Comparing {comparisonAssets.length} assets</span>
            <button className="as-btn-sm" onClick={clearComparison}>Close</button>
          </div>
          <div className="as-comparison-images">
            {comparisonAssets.map((asset) => (
              <ComparisonCard key={asset.id} asset={asset} onRemove={() => toggleComparison(asset.id)} />
            ))}
          </div>
        </div>
      )}

      <div className="as-gallery-body">
        <div className="as-gallery-grid">
          {filteredAssets.length === 0 ? (
            <div className="as-placeholder">
              <div className="as-placeholder-icon">{galleryFilter === 'trash' ? '\uD83D\uDDD1' : '\uD83D\uDDC2'}</div>
              <p className="as-placeholder-title">{galleryFilter === 'trash' ? 'Trash Empty' : 'Gallery Empty'}</p>
              <p>{galleryFilter === 'trash' ? 'Deleted assets will appear here' : 'Generate and save images to build your asset library'}</p>
            </div>
          ) : (
            filteredAssets.map((asset) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                selected={selectedAssetId === asset.id}
                comparing={comparisonIds.includes(asset.id)}
                onClick={() => setSelectedAssetId(asset.id === selectedAssetId ? null : asset.id)}
                onToggleFavorite={() => toggleFavorite(asset.id)}
                onToggleCompare={() => toggleComparison(asset.id)}
              />
            ))
          )}
        </div>

        {selectedAsset && (
          <AssetDetailPanel
            asset={selectedAsset}
            onClose={() => setSelectedAssetId(null)}
            onDelete={() => deleteAsset(selectedAsset.id)}
            onUsePrompt={() => loadPromptFromAsset(selectedAsset)}
            onUseAsReference={() => {
              const blob = selectedAsset.imageBlob;
              if (blob) {
                addReferenceImage(blob, 'gallery', selectedAsset.prompt.slice(0, 30));
              }
            }}
            onDownload={() => downloadAsset(selectedAsset)}
            onRestore={() => restoreAsset(selectedAsset.id)}
            onPermanentDelete={() => permanentlyDeleteAsset(selectedAsset.id)}
          />
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Comparison card                                                    */
/* ------------------------------------------------------------------ */

function ComparisonCard({ asset, onRemove }: { asset: AssetRecord; onRemove: () => void }) {
  const [url, setUrl] = useState('');
  useEffect(() => {
    const u = getDisplayUrl(asset);
    setUrl(u);
    return () => { if (asset.imageBlob) URL.revokeObjectURL(u); };
  }, [asset]);

  return (
    <div className="as-compare-card">
      {url && <img className="as-compare-image" src={url} alt={asset.prompt} />}
      <div className="as-compare-meta">
        <span className="as-compare-prompt">{asset.prompt}</span>
        {asset.seed != null && <span className="as-compare-seed">Seed: {asset.seed}</span>}
      </div>
      <button className="as-compare-remove" onClick={onRemove}>&times;</button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Asset Card                                                         */
/* ------------------------------------------------------------------ */

function AssetCard({
  asset, selected, comparing, onClick, onToggleFavorite, onToggleCompare,
}: {
  asset: AssetRecord; selected: boolean; comparing: boolean;
  onClick: () => void; onToggleFavorite: () => void; onToggleCompare: () => void;
}) {
  const [url, setUrl] = useState('');
  useEffect(() => {
    const u = getDisplayUrl(asset);
    setUrl(u);
    return () => { if (asset.imageBlob) URL.revokeObjectURL(u); };
  }, [asset]);

  return (
    <div className={`as-asset-card${selected ? ' selected' : ''}${comparing ? ' comparing' : ''}`} onClick={onClick}>
      <div className="as-card-image-wrap">
        {url && <img className="as-card-image" src={url} alt={asset.prompt} loading="lazy" />}
        <button
          className={`as-card-compare${comparing ? ' active' : ''}`}
          onClick={(e) => { e.stopPropagation(); onToggleCompare(); }}
          title="Toggle compare"
        >
          {comparing ? '\u2611' : '\u2610'}
        </button>
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
          {asset.tags.map((t) => <span key={t} className="as-tag">{t}</span>)}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Asset Detail Panel                                                 */
/* ------------------------------------------------------------------ */

function AssetDetailPanel({
  asset, onClose, onDelete, onUsePrompt, onUseAsReference, onDownload,
  onRestore, onPermanentDelete,
}: {
  asset: AssetRecord; onClose: () => void; onDelete: () => void;
  onUsePrompt: () => void; onUseAsReference: () => void; onDownload: () => void;
  onRestore?: () => void; onPermanentDelete?: () => void;
}) {
  const { updateTags, updateNotes } = useAssetStudioStore();
  const [editTags, setEditTags] = useState(asset.tags.join(', '));
  const [editNotes, setEditNotes] = useState(asset.notes);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [url, setUrl] = useState('');

  useEffect(() => {
    const u = getDisplayUrl(asset);
    setUrl(u);
    setEditTags(asset.tags.join(', '));
    setEditNotes(asset.notes);
    setConfirmDelete(false);
    return () => { if (asset.imageBlob) URL.revokeObjectURL(u); };
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

      {/* Quick actions */}
      <div className="as-detail-quick-actions">
        <button className="as-btn as-btn-primary" onClick={onUsePrompt}>Use Prompt</button>
        <button className="as-btn" onClick={onUseAsReference}>Use as Ref</button>
        <button className="as-btn" onClick={onDownload}>Download</button>
      </div>

      <div className="as-detail-meta">
        <DetailRow label="Prompt" value={asset.prompt} />
        <DetailRow label="Full Prompt" value={asset.fullPrompt} small />
        <DetailRow label="Model" value={useAssetStudioStore.getState().allModels().find((m) => m.id === asset.modelId)?.label || asset.modelId} />
        <DetailRow label="Style" value={asset.stylePresetId} />
        <DetailRow label="Aspect" value={asset.aspectRatio} />
        {asset.seed != null && <DetailRow label="Seed" value={String(asset.seed)} />}
        <DetailRow label="Created" value={new Date(asset.createdAt).toLocaleString()} />
      </div>

      <div className="as-detail-edit">
        <label className="as-label-sm">Tags</label>
        <input className="as-input" value={editTags} onChange={(e) => setEditTags(e.target.value)} />
        <label className="as-label-sm">Notes</label>
        <textarea className="as-textarea as-textarea-sm" rows={3} value={editNotes} onChange={(e) => setEditNotes(e.target.value)} />
        <button className="as-btn as-btn-primary" onClick={handleSaveMeta} style={{ marginTop: '0.5rem' }}>Update</button>
      </div>

      <div className="as-detail-danger">
        {asset.trashedAt != null ? (
          <div className="as-trash-actions">
            <button className="as-btn as-btn-primary" onClick={onRestore}>Restore</button>
            {!confirmDelete ? (
              <button className="as-btn as-btn-danger" onClick={() => setConfirmDelete(true)}>Delete Forever</button>
            ) : (
              <div className="as-confirm-row">
                <span>Permanently delete?</span>
                <button className="as-btn as-btn-danger" onClick={onPermanentDelete}>Yes</button>
                <button className="as-btn" onClick={() => setConfirmDelete(false)}>No</button>
              </div>
            )}
          </div>
        ) : (
          !confirmDelete ? (
            <button className="as-btn as-btn-danger" onClick={() => setConfirmDelete(true)}>Move to Trash</button>
          ) : (
            <div className="as-confirm-row">
              <span>Move to trash?</span>
              <button className="as-btn as-btn-danger" onClick={onDelete}>Yes</button>
              <button className="as-btn" onClick={() => setConfirmDelete(false)}>No</button>
            </div>
          )
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div className="as-detail-row">
      <span className="as-detail-label">{label}</span>
      <span className={`as-detail-value${small ? ' as-detail-value-sm' : ''}`}>{value}</span>
    </div>
  );
}

/* ================================================================== */
/*  Characters Tab                                                     */
/* ================================================================== */

function CharactersTab() {
  const { characters, addCharacter, removeCharacter, updateCharacter, assets, generateFromCharacter } = useAssetStudioStore();
  const [editing, setEditing] = useState<CharacterRecord | null>(null);
  const [isNew, setIsNew] = useState(false);

  function startNew() {
    setEditing({
      id: crypto.randomUUID(),
      name: '', description: '', styleNotes: '', promptTemplate: '',
      referenceAssetIds: [], createdAt: Date.now(), updatedAt: Date.now(),
    });
    setIsNew(true);
  }

  async function handleSave() {
    if (!editing || !editing.name.trim()) return;
    editing.updatedAt = Date.now();
    if (isNew) await addCharacter(editing);
    else await updateCharacter(editing);
    setEditing(null);
    setIsNew(false);
  }

  const assetCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    assets.forEach((a) => { if (a.characterId) counts[a.characterId] = (counts[a.characterId] || 0) + 1; });
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
          <input className="as-input" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="e.g., Jean-Baptiste, Pierre, Napoleon" />
          <label className="as-label">Description</label>
          <textarea className="as-textarea" rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} placeholder="Physical description, personality, role..." />
          <label className="as-label">Style Notes</label>
          <textarea className="as-textarea as-textarea-sm" rows={2} value={editing.styleNotes} onChange={(e) => setEditing({ ...editing, styleNotes: e.target.value })} placeholder="Art direction notes for this character..." />
          <label className="as-label">Prompt Template</label>
          <textarea className="as-textarea" rows={3} value={editing.promptTemplate} onChange={(e) => setEditing({ ...editing, promptTemplate: e.target.value })} placeholder="Base prompt for generating this character..." />
          <div className="as-editor-actions">
            <button className="as-btn as-btn-primary" onClick={handleSave} disabled={!editing.name.trim()}>{isNew ? 'Create' : 'Save'}</button>
            <button className="as-btn" onClick={() => { setEditing(null); setIsNew(false); }}>Cancel</button>
          </div>
        </div>
      )}

      <div className="as-character-list">
        {characters.length === 0 && !editing ? (
          <div className="as-placeholder">
            <div className="as-placeholder-icon">👤</div>
            <p className="as-placeholder-title">No Characters Yet</p>
            <p>Define character sheets with prompt templates to generate consistent art</p>
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
                <button className="as-btn-sm as-btn-gen" onClick={() => generateFromCharacter(char.id)}>Generate</button>
                <button className="as-btn-sm" onClick={() => { setEditing({ ...char }); setIsNew(false); }}>Edit</button>
                <button className="as-btn-sm as-btn-danger-sm" onClick={() => removeCharacter(char.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Settings Tab                                                       */
/* ================================================================== */

function SettingsTab() {
  const store = useAssetStudioStore();
  const { apiKey, setApiKey, geminiApiKey, setGeminiApiKey, defaultModelId, setDefaultModelId, customPresets, addPreset, removePreset } = store;
  const models = store.allModels();

  // Replicate key
  const [keyInput, setKeyInput] = useState(apiKey);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'ok' | 'fail' | null>(null);

  // Gemini key
  const [geminiKeyInput, setGeminiKeyInput] = useState(geminiApiKey);
  const [geminiTesting, setGeminiTesting] = useState(false);
  const [geminiTestResult, setGeminiTestResult] = useState<'ok' | 'fail' | null>(null);

  // Preset editor
  const [newPresetOpen, setNewPresetOpen] = useState(false);
  const [presetLabel, setPresetLabel] = useState('');
  const [presetPrefix, setPresetPrefix] = useState('');
  const [presetSuffix, setPresetSuffix] = useState('');

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

  function handleSaveGeminiKey() {
    setGeminiApiKey(geminiKeyInput.trim());
    setGeminiTestResult(null);
  }

  async function handleTestGeminiKey() {
    if (!geminiKeyInput.trim()) return;
    setGeminiTesting(true);
    setGeminiTestResult(null);
    const ok = await testGeminiApiKey(geminiKeyInput.trim());
    setGeminiTestResult(ok ? 'ok' : 'fail');
    setGeminiTesting(false);
  }

  async function handleSavePreset() {
    if (!presetLabel.trim()) return;
    await addPreset({
      id: crypto.randomUUID(),
      label: presetLabel.trim(),
      prefix: presetPrefix,
      suffix: presetSuffix,
      createdAt: Date.now(),
    });
    setNewPresetOpen(false);
    setPresetLabel('');
    setPresetPrefix('');
    setPresetSuffix('');
  }

  return (
    <div className="as-settings">
      <div className="as-settings-section">
        <h4>Google Gemini API Key (Primary)</h4>
        <p className="as-hint">
          Get your API key from{' '}
          <a href="https://aistudio.google.dev/apikey" target="_blank" rel="noopener noreferrer" className="as-link">
            Google AI Studio
          </a>
          {' '}— powers NanoBanana models directly.
        </p>
        <div className="as-key-row">
          <input className="as-input as-input-key" type="password" value={geminiKeyInput} onChange={(e) => setGeminiKeyInput(e.target.value)} placeholder="AIzaSy..." />
          <button className="as-btn as-btn-primary" onClick={handleSaveGeminiKey}>Save</button>
          <button className="as-btn" onClick={handleTestGeminiKey} disabled={geminiTesting || !geminiKeyInput.trim()}>
            {geminiTesting ? 'Testing...' : 'Test'}
          </button>
        </div>
        {geminiTestResult === 'ok' && <span className="as-test-ok">Gemini API key is valid</span>}
        {geminiTestResult === 'fail' && <span className="as-test-fail">Invalid API key or network error</span>}
        {geminiApiKey && <span className="as-hint">Key saved. Stored in browser localStorage only.</span>}
      </div>

      <div className="as-settings-section">
        <h4>Replicate API Key (Optional)</h4>
        <p className="as-hint">
          Get your API key from{' '}
          <a href="https://replicate.com/account/api-tokens" target="_blank" rel="noopener noreferrer" className="as-link">
            replicate.com/account/api-tokens
          </a>
          {' '}— enables Flux models.
        </p>
        <div className="as-key-row">
          <input className="as-input as-input-key" type="password" value={keyInput} onChange={(e) => setKeyInput(e.target.value)} placeholder="r8_..." />
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
        <select className="as-select" value={defaultModelId} onChange={(e) => setDefaultModelId(e.target.value)}>
          <optgroup label="Google Gemini (Direct)">
            {models.filter((m) => 'geminiModelId' in m).map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
          </optgroup>
          <optgroup label="Replicate">
            {models.filter((m) => !('geminiModelId' in m)).map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
          </optgroup>
        </select>
        <p className="as-hint">Gemini models use your Google API key. Replicate models use your Replicate key.</p>
      </div>

      <div className="as-settings-section">
        <h4>Custom Style Presets</h4>
        <p className="as-hint">Create reusable style fragments. These are combined with your prompt at generation time.</p>
        {customPresets.length > 0 && (
          <div className="as-preset-list">
            {customPresets.map((p) => (
              <div key={p.id} className="as-preset-item">
                <div className="as-preset-info">
                  <span className="as-preset-name">{p.label}</span>
                  <span className="as-preset-fragments">
                    {p.prefix && <span className="as-preset-frag">Prefix: {p.prefix.slice(0, 50)}...</span>}
                    {p.suffix && <span className="as-preset-frag">Suffix: {p.suffix.slice(0, 50)}...</span>}
                  </span>
                </div>
                <button className="as-btn-sm as-btn-danger-sm" onClick={() => removePreset(p.id)}>Delete</button>
              </div>
            ))}
          </div>
        )}
        {!newPresetOpen ? (
          <button className="as-btn" onClick={() => setNewPresetOpen(true)} style={{ marginTop: '0.5rem' }}>+ New Preset</button>
        ) : (
          <div className="as-character-editor" style={{ marginTop: '0.5rem' }}>
            <label className="as-label">Preset Name</label>
            <input className="as-input" value={presetLabel} onChange={(e) => setPresetLabel(e.target.value)} placeholder="e.g., My Watercolor Style" />
            <label className="as-label">Prefix (prepended to prompt)</label>
            <textarea className="as-textarea as-textarea-sm" rows={2} value={presetPrefix} onChange={(e) => setPresetPrefix(e.target.value)} placeholder="e.g., Soft watercolor painting, " />
            <label className="as-label">Suffix (appended to prompt)</label>
            <textarea className="as-textarea as-textarea-sm" rows={2} value={presetSuffix} onChange={(e) => setPresetSuffix(e.target.value)} placeholder="e.g., , muted tones, period-accurate" />
            <div className="as-editor-actions">
              <button className="as-btn as-btn-primary" onClick={handleSavePreset} disabled={!presetLabel.trim()}>Save Preset</button>
              <button className="as-btn" onClick={() => setNewPresetOpen(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      <div className="as-settings-section">
        <h4>About</h4>
        <p className="as-hint">
          Asset Studio generates images via the Replicate API and stores them locally in your browser's
          IndexedDB. Nothing is sent to any server except Replicate for generation.
        </p>
      </div>
    </div>
  );
}
