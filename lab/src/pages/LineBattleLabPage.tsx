import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useLabStore } from '../stores/labStore';
import { useLineCombatStore } from '../stores/lineCombatStore';
import type { LabVolleyEntry, LabVolleyDef, LineCombatModule } from '../types/lineCombatTypes';
import { GamePreview } from '../components/line-battle/GamePreview';
import type { GamePreviewHandle } from '../components/line-battle/GamePreview';
import { PreviewControls } from '../components/line-battle/PreviewControls';
import { DEFAULT_PREVIEW_CONFIG } from '../utils/mockBattleState';
import type { PreviewConfig } from '../utils/mockBattleState';
import { DeferredInput, DeferredTextarea } from '../components/line-battle/DeferredInput';
import { useToast } from '../components/line-battle/useToast';
import { NumInput } from '../components/shared/NumInput';

/* ------------------------------------------------------------------ */
/*  Volley Editor — full field editing                                 */
/* ------------------------------------------------------------------ */

function VolleyEditor({ moduleId, volley }: { moduleId: string; volley: LabVolleyEntry }) {
  const { updateVolley } = useLineCombatStore();

  const updateDef = useCallback((patch: Partial<LabVolleyDef>) => {
    updateVolley(moduleId, volley.id, { def: { ...volley.def, ...patch } });
  }, [moduleId, volley.id, volley.def, updateVolley]);

  const freshNarratives = useCallback(() => {
    const mod = useLineCombatStore.getState().modules.find((m) => m.id === moduleId);
    const vol = mod?.volleys.find((v) => v.id === volley.id);
    return vol?.narratives ?? volley.narratives;
  }, [moduleId, volley.id, volley.narratives]);

  const updateNarrative = useCallback((key: string, value: string | string[]) => {
    updateVolley(moduleId, volley.id, { narratives: { ...freshNarratives(), [key]: value } });
  }, [moduleId, volley.id, freshNarratives, updateVolley]);

  return (
    <div className="lb-volley-editor">
      <h4 className="lb-detail-section-title">Combat Parameters</h4>
      <div className="lb-editor-grid">
        <NumInput label="Range (paces)" value={volley.def.range} onChange={(v) => updateDef({ range: v })} min={10} max={300} />
        <NumInput label="Accuracy" value={volley.def.fireAccuracyBase} onChange={(v) => updateDef({ fireAccuracyBase: v })} min={0} max={1} step={0.01} />
        <NumInput label="Perception" value={volley.def.perceptionBase} onChange={(v) => updateDef({ perceptionBase: v })} min={0} max={1} step={0.01} />
        <NumInput label="Return Fire %" value={volley.def.enemyReturnFireChance} onChange={(v) => updateDef({ enemyReturnFireChance: v })} min={0} max={1} step={0.01} />
        <NumInput label="Ret Dmg Min" value={volley.def.enemyReturnFireDamage[0]} onChange={(v) => updateDef({ enemyReturnFireDamage: [v, volley.def.enemyReturnFireDamage[1]] })} />
        <NumInput label="Ret Dmg Max" value={volley.def.enemyReturnFireDamage[1]} onChange={(v) => updateDef({ enemyReturnFireDamage: [volley.def.enemyReturnFireDamage[0], v] })} />
        <NumInput label="Line Damage" value={volley.def.enemyLineDamage} onChange={(v) => updateDef({ enemyLineDamage: v })} />
      </div>

      <h4 className="lb-detail-section-title">Return Fire</h4>
      <div className="lb-editor-grid">
        <NumInput label="Front Rank Bonus" value={volley.returnFire.frontRankBonus} onChange={(v) => updateVolley(moduleId, volley.id, { returnFire: { ...volley.returnFire, frontRankBonus: v } })} min={0} max={1} step={0.01} />
        <NumInput label="Fatal Chance" value={volley.returnFire.fatalChance} onChange={(v) => updateVolley(moduleId, volley.id, { returnFire: { ...volley.returnFire, fatalChance: v } })} min={0} max={1} step={0.01} />
      </div>

      <h4 className="lb-detail-section-title">Stamina</h4>
      <div className="lb-editor-grid">
        <NumInput label="Cost" value={volley.stamina.cost} onChange={(v) => updateVolley(moduleId, volley.id, { stamina: { ...volley.stamina, cost: v } })} />
        <NumInput label="Recovery" value={volley.stamina.recovery} onChange={(v) => updateVolley(moduleId, volley.id, { stamina: { ...volley.stamina, recovery: v } })} />
      </div>

      <h4 className="lb-detail-section-title">Narratives</h4>
      <div className="lb-editor-narratives">
        <label className="lb-editor-field">
          <span className="lb-narrative-step">PRESENT</span>
          <DeferredInput value={volley.narratives.present} onCommit={(v) => updateNarrative('present', v)} />
        </label>
        <label className="lb-editor-field">
          <span className="lb-narrative-step">FIRE</span>
          <DeferredInput value={volley.narratives.fireOrder} onCommit={(v) => updateNarrative('fireOrder', v)} />
        </label>
        <label className="lb-editor-field">
          <span className="lb-narrative-step">ENDURE</span>
          <DeferredInput value={volley.narratives.endure} onCommit={(v) => updateNarrative('endure', v)} />
        </label>
        <label className="lb-editor-field">
          <span className="lb-narrative-step">HIT</span>
          <div className="lb-array-editor">
            {volley.narratives.fireHit.map((txt, i) => (
              <div key={i} className="lb-array-row">
                <DeferredInput value={txt} onCommit={(v) => {
                  const arr = [...freshNarratives().fireHit];
                  arr[i] = v;
                  updateNarrative('fireHit', arr);
                }} />
                {volley.narratives.fireHit.length > 1 && (
                  <button className="lb-array-remove" onClick={() => {
                    updateNarrative('fireHit', freshNarratives().fireHit.filter((_, j) => j !== i));
                  }}>&times;</button>
                )}
              </div>
            ))}
            <button className="lb-array-add" onClick={() => updateNarrative('fireHit', [...freshNarratives().fireHit, ''])}>+ Add</button>
          </div>
        </label>
        <label className="lb-editor-field">
          <span className="lb-narrative-step">MISS</span>
          <div className="lb-array-editor">
            {volley.narratives.fireMiss.map((txt, i) => (
              <div key={i} className="lb-array-row">
                <DeferredInput value={txt} onCommit={(v) => {
                  const arr = [...freshNarratives().fireMiss];
                  arr[i] = v;
                  updateNarrative('fireMiss', arr);
                }} />
                {volley.narratives.fireMiss.length > 1 && (
                  <button className="lb-array-remove" onClick={() => {
                    updateNarrative('fireMiss', freshNarratives().fireMiss.filter((_, j) => j !== i));
                  }}>&times;</button>
                )}
              </div>
            ))}
            <button className="lb-array-add" onClick={() => updateNarrative('fireMiss', [...freshNarratives().fireMiss, ''])}>+ Add</button>
          </div>
        </label>
      </div>

      <h4 className="lb-detail-section-title">Event Intent</h4>
      <DeferredTextarea className="lb-editor-textarea" value={volley.eventDescription} placeholder="Describe what should happen during this volley (for Claude to implement as code)..."
        onCommit={(v) => updateVolley(moduleId, volley.id, { eventDescription: v })} />

      <h4 className="lb-detail-section-title">Designer Notes</h4>
      <DeferredTextarea className="lb-editor-textarea lb-editor-textarea-sm" value={volley.notes} placeholder="Internal notes..."
        onCommit={(v) => updateVolley(moduleId, volley.id, { notes: v })} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Module Editor                                                      */
/* ------------------------------------------------------------------ */

function ModuleEditor({ module }: { module: LineCombatModule }) {
  const {
    updateModule, selectedVolleyId, selectVolley,
    addVolley, removeVolley, reorderVolley, duplicateVolley,
  } = useLineCombatStore();
  const [tagInput, setTagInput] = useState('');

  const freshHints = useCallback(() => {
    const mod = useLineCombatStore.getState().modules.find((m) => m.id === module.id);
    return mod?.stateHints ?? module.stateHints;
  }, [module.id, module.stateHints]);

  const activeVolley = useMemo(
    () => module.volleys.find((v) => v.id === selectedVolleyId) ?? null,
    [module.volleys, selectedVolleyId],
  );

  return (
    <div className="lb-module-editor">
      {/* Module metadata */}
      <div className="lb-module-meta">
        <label className="lb-editor-field">
          <span>Name</span>
          <DeferredInput value={module.name} onCommit={(v) => updateModule(module.id, { name: v })} />
        </label>
        <label className="lb-editor-field">
          <span>Description</span>
          <DeferredInput value={module.description} onCommit={(v) => updateModule(module.id, { description: v })} />
        </label>
        <div className="lb-editor-row">
          <label className="lb-editor-field lb-editor-field-sm">
            <span>Mode</span>
            <select value={module.mode} onChange={(e) => updateModule(module.id, { mode: e.target.value as 'standard' | 'gorge' })}>
              <option value="standard">Standard</option>
              <option value="gorge">Gorge</option>
            </select>
          </label>
          <div className="lb-editor-field lb-editor-field-sm">
            <span>Tags</span>
            <div className="lb-tags">
              {module.tags.map((tag) => (
                <span key={tag} className="lb-tag">
                  {tag}
                  <button onClick={() => updateModule(module.id, { tags: module.tags.filter((t) => t !== tag) })}>&times;</button>
                </span>
              ))}
              <input type="text" className="lb-tag-input" placeholder="+ tag" value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && tagInput.trim()) {
                    if (!module.tags.includes(tagInput.trim())) {
                      updateModule(module.id, { tags: [...module.tags, tagInput.trim()] });
                    }
                    setTagInput('');
                  }
                }} />
            </div>
          </div>
        </div>
      </div>

      {/* State hints */}
      <details className="lb-hints-section">
        <summary className="lb-detail-section-title">State Hints</summary>
        <div className="lb-editor-grid">
          <NumInput label="Enemy Str Min" value={module.stateHints.expectedEnemyStrength[0]}
            onChange={(v) => updateModule(module.id, { stateHints: { ...module.stateHints, expectedEnemyStrength: [v, module.stateHints.expectedEnemyStrength[1]] } })} />
          <NumInput label="Enemy Str Max" value={module.stateHints.expectedEnemyStrength[1]}
            onChange={(v) => updateModule(module.id, { stateHints: { ...module.stateHints, expectedEnemyStrength: [module.stateHints.expectedEnemyStrength[0], v] } })} />
          <NumInput label="Health Min" value={module.stateHints.expectedPlayerHealth[0]}
            onChange={(v) => updateModule(module.id, { stateHints: { ...module.stateHints, expectedPlayerHealth: [v, module.stateHints.expectedPlayerHealth[1]] } })} />
          <NumInput label="Health Max" value={module.stateHints.expectedPlayerHealth[1]}
            onChange={(v) => updateModule(module.id, { stateHints: { ...module.stateHints, expectedPlayerHealth: [module.stateHints.expectedPlayerHealth[0], v] } })} />
        </div>
        <div className="lb-editor-row">
          <label className="lb-editor-field lb-editor-field-sm">
            <span>NCO Present</span>
            <select value={module.stateHints.ncoPresent === null ? 'null' : String(module.stateHints.ncoPresent)}
              onChange={(e) => updateModule(module.id, { stateHints: { ...module.stateHints, ncoPresent: e.target.value === 'null' ? null : e.target.value === 'true' } })}>
              <option value="null">Don't care</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </label>
          <label className="lb-editor-field lb-editor-field-sm">
            <span>Artillery</span>
            <select value={module.stateHints.artilleryActive === null ? 'null' : String(module.stateHints.artilleryActive)}
              onChange={(e) => updateModule(module.id, { stateHints: { ...module.stateHints, artilleryActive: e.target.value === 'null' ? null : e.target.value === 'true' } })}>
              <option value="null">Don't care</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </label>
        </div>
        <label className="lb-editor-field">
          <span>Entry Notes</span>
          <DeferredInput value={module.stateHints.entryNotes}
            onCommit={(v) => updateModule(module.id, { stateHints: { ...freshHints(), entryNotes: v } })} />
        </label>
        <label className="lb-editor-field">
          <span>Exit Notes</span>
          <DeferredInput value={module.stateHints.exitNotes}
            onCommit={(v) => updateModule(module.id, { stateHints: { ...freshHints(), exitNotes: v } })} />
        </label>
      </details>

      {/* Volley list + editor */}
      <div className="lb-detail-section-title">Volleys ({module.volleys.length})</div>
      <div className="lb-volley-editor-layout">
        <div className="lb-volley-list">
          {module.volleys.map((v, i) => (
            <div key={v.id}
              className={`lb-volley-list-item${selectedVolleyId === v.id ? ' active' : ''}`}
              onClick={() => selectVolley(v.id)}>
              <span className="lb-volley-list-num">{i + 1}.</span>
              <span className="lb-volley-list-range">{v.def.range}p</span>
              <span className="lb-volley-list-narr">{v.narratives.present.slice(0, 30)}</span>
              <span className="lb-volley-list-actions">
                <button title="Move up" disabled={i === 0} onClick={(e) => { e.stopPropagation(); reorderVolley(module.id, v.id, 'up'); }}>&uarr;</button>
                <button title="Move down" disabled={i === module.volleys.length - 1} onClick={(e) => { e.stopPropagation(); reorderVolley(module.id, v.id, 'down'); }}>&darr;</button>
                <button title="Duplicate" onClick={(e) => { e.stopPropagation(); duplicateVolley(module.id, v.id); }}>D</button>
                <button title="Delete" onClick={(e) => { e.stopPropagation(); removeVolley(module.id, v.id); }}>&times;</button>
              </span>
            </div>
          ))}
          <button className="lb-add-volley-btn" onClick={() => addVolley(module.id, selectedVolleyId ?? undefined)}>
            + Add Volley
          </button>
        </div>

        <div className="lb-volley-detail-panel">
          {activeVolley ? (
            <VolleyEditor key={activeVolley.id} moduleId={module.id} volley={activeVolley} />
          ) : (
            <div className="si-empty">
              {module.volleys.length === 0
                ? 'No volleys yet. Click "+ Add Volley" to create one.'
                : 'Select a volley to edit.'}
            </div>
          )}
        </div>
      </div>

      {/* Module notes */}
      <div className="lb-detail-section-title">Module Notes</div>
      <DeferredTextarea className="lb-editor-textarea" value={module.notes} placeholder="Design notes for this module..."
        onCommit={(v) => updateModule(module.id, { notes: v })} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Module Library sidebar                                             */
/* ------------------------------------------------------------------ */

function ModuleLibrary() {
  const {
    modules, selectedModuleId, selectModule,
    createModule, deleteModule, duplicateModule,
    importModule, exportModule, undo, redo, undoStack, redoStack,
  } = useLineCombatStore();
  const [showImport, setShowImport] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const toast = useToast();

  return (
    <div className="lb-module-library">
      {toast.el}
      <div className="lb-library-header">
        <span className="lb-library-title">Modules</span>
        <span className="lb-library-count">{modules.length}</span>
      </div>
      <div className="lb-library-actions">
        <button className="lb-lib-btn" onClick={() => createModule()}>+ New</button>
        <button className="lb-lib-btn" onClick={() => setShowImport(!showImport)}>Import</button>
        <button className="lb-lib-btn" disabled={undoStack.length === 0} onClick={undo} title="Undo">&#x21A9;</button>
        <button className="lb-lib-btn" disabled={redoStack.length === 0} onClick={redo} title="Redo">&#x21AA;</button>
      </div>
      {showImport && (
        <div className="lb-import-panel">
          <textarea value={importJson} onChange={(e) => setImportJson(e.target.value)} placeholder="Paste module JSON..." />
          <button onClick={() => {
            if (importModule(importJson)) {
              setImportJson('');
              setShowImport(false);
              toast.show('Module imported');
            } else {
              toast.show('Invalid JSON');
            }
          }}>Import</button>
        </div>
      )}
      <div className="lb-library-list">
        {modules.map((m) => (
          <div key={m.id}
            className={`lb-library-item${selectedModuleId === m.id ? ' active' : ''}`}
            onClick={() => selectModule(m.id)}>
            <div className="lb-library-item-name">{m.name}</div>
            <div className="lb-library-item-meta">
              <span className="lb-library-item-mode">{m.mode}</span>
              <span className="lb-library-item-volleys">{m.volleys.length}V</span>
              {m.tags.slice(0, 2).map((t) => <span key={t} className="lb-library-item-tag">{t}</span>)}
            </div>
            <div className="lb-library-item-actions">
              <button title="Duplicate" onClick={(e) => { e.stopPropagation(); duplicateModule(m.id); }}>D</button>
              <button title="Export to clipboard" onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(exportModule(m.id));
                toast.show('Copied to clipboard');
              }}>E</button>
              {pendingDelete === m.id ? (
                <>
                  <button className="lb-confirm-delete" onClick={(e) => { e.stopPropagation(); deleteModule(m.id); setPendingDelete(null); }}>Yes</button>
                  <button onClick={(e) => { e.stopPropagation(); setPendingDelete(null); }}>No</button>
                </>
              ) : (
                <button title="Delete" onClick={(e) => { e.stopPropagation(); setPendingDelete(m.id); }}>&times;</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component — two views: Design Studio + Modules                */
/* ------------------------------------------------------------------ */

type LBView = 'studio' | 'modules';

export function LineBattleLabPage() {
  const [view, setView] = useState<LBView>('studio');
  const { launchConfig, clearLaunchConfig } = useLabStore();

  const { modules, selectedModuleId, loadModules, selectModule } = useLineCombatStore();

  // Load modules on mount
  useEffect(() => {
    loadModules();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle cross-launch from campaign editor
  useEffect(() => {
    if (launchConfig) {
      if (typeof launchConfig.moduleId === 'string') {
        setView('modules');
        selectModule(launchConfig.moduleId);
      }
      clearLaunchConfig();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedModule = useMemo(
    () => modules.find((m) => m.id === selectedModuleId) ?? null,
    [modules, selectedModuleId],
  );

  // Design Studio state
  const [previewConfig, setPreviewConfig] = useState<PreviewConfig>(() => ({ ...DEFAULT_PREVIEW_CONFIG }));
  const gamePreviewRef = useRef<GamePreviewHandle>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handlePreviewConfigChange = useCallback((patch: Partial<PreviewConfig>) => {
    setPreviewConfig((prev) => ({ ...prev, ...patch }));
  }, []);

  const handlePreviewReset = useCallback(() => {
    setPreviewConfig({ ...DEFAULT_PREVIEW_CONFIG });
  }, []);

  return (
    <div className="lb-page">
      <div className="art-lab-toolbar">
        {(['studio', 'modules'] as const).map((v) => (
          <button
            key={v}
            className={`art-lab-filter-btn${view === v ? ' active' : ''}`}
            onClick={() => setView(v)}
          >
            {v === 'studio' ? 'Design Studio' : 'Modules'}
          </button>
        ))}
      </div>

      <div className="lb-content">
        {/* ========== DESIGN STUDIO ========== */}
        {view === 'studio' && (
          <div className="lb-design-studio">
            <div className="lb-studio-main">
              <GamePreview ref={gamePreviewRef} config={previewConfig} />
            </div>
            <div className={`lb-studio-sidebar${sidebarCollapsed ? ' collapsed' : ''}`}>
              <PreviewControls
                config={previewConfig}
                onChange={handlePreviewConfigChange}
                onReset={handlePreviewReset}
                previewRef={gamePreviewRef}
                modules={modules}
              />
            </div>
            <button
              className="lb-sidebar-toggle"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title={sidebarCollapsed ? 'Show controls' : 'Hide controls'}
            >
              {sidebarCollapsed ? '\u2699' : '\u00BB'}
            </button>
          </div>
        )}

        {/* ========== MODULES ========== */}
        {view === 'modules' && (
          <div className="lb-modules-layout">
            <ModuleLibrary />
            <div className="lb-module-editor-wrap">
              {selectedModule ? (
                <ModuleEditor key={selectedModule.id} module={selectedModule} />
              ) : (
                <div className="si-empty">Select a module or create a new one.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
