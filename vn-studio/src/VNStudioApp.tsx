import React from 'react';
import { useVnSceneStore } from '../../lab/src/stores/vnSceneStore';
import type { VNScene } from '@game/types/vnTypes';
import { CHARACTERS } from '@game/types/vnTypes';
import { GAME_SCENES } from '../../lab/src/utils/gameSceneImporter';
import {
  loadStructure, saveStructure, generateChapterId,
  type StudioStructure, type StudioChapter, type StudioEntry,
} from './studioStructure';
import { SceneViewer } from './SceneViewer';
import { SceneEditor } from './SceneEditor';

/* ------------------------------------------------------------------ */
/*  Sidebar                                                            */
/* ------------------------------------------------------------------ */

function SceneSidebar({ scenes, selectedId, onSelect }: {
  scenes: VNScene[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [structure, setStructure] = React.useState<StudioStructure>(loadStructure);
  const [searchText, setSearchText] = React.useState('');
  const sceneMap = React.useMemo(() => new Map(scenes.map((s) => [s.id, s])), [scenes]);

  const needle = searchText.toLowerCase().trim();
  const matchesSearch = (label: string, scene: VNScene | null): boolean => {
    if (!needle) return true;
    if (label.toLowerCase().includes(needle)) return true;
    if (scene && scene.description.toLowerCase().includes(needle)) return true;
    return false;
  };

  // Persist on every change
  const update = React.useCallback((fn: (s: StudioStructure) => StudioStructure) => {
    setStructure((prev) => {
      const next = fn(prev);
      saveStructure(next);
      return next;
    });
  }, []);

  // ---- Chapter actions ----
  const toggleChapter = (chId: string) => {
    update((s) => ({
      ...s,
      chapters: s.chapters.map((ch) =>
        ch.id === chId ? { ...ch, collapsed: !ch.collapsed } : ch
      ),
    }));
  };

  const renameChapter = (chId: string, title: string) => {
    update((s) => ({
      ...s,
      chapters: s.chapters.map((ch) =>
        ch.id === chId ? { ...ch, title } : ch
      ),
    }));
  };

  const addChapter = () => {
    update((s) => ({
      ...s,
      chapters: [...s.chapters, { id: generateChapterId(), title: 'New Chapter', entries: [] }],
    }));
  };

  const deleteChapter = (chId: string) => {
    update((s) => ({
      ...s,
      chapters: s.chapters.filter((ch) => ch.id !== chId),
    }));
  };

  // ---- Entry actions ----
  const addDivider = (chId: string) => {
    update((s) => ({
      ...s,
      chapters: s.chapters.map((ch) =>
        ch.id === chId ? { ...ch, entries: [...ch.entries, { type: 'divider', label: 'New Section' }] } : ch
      ),
    }));
  };

  const renameDivider = (chId: string, entryIdx: number, label: string) => {
    update((s) => ({
      ...s,
      chapters: s.chapters.map((ch) => {
        if (ch.id !== chId) return ch;
        const entries = [...ch.entries];
        const e = entries[entryIdx];
        if (e?.type === 'divider') entries[entryIdx] = { ...e, label };
        return { ...ch, entries };
      }),
    }));
  };

  const deleteEntry = (chId: string, entryIdx: number) => {
    update((s) => ({
      ...s,
      chapters: s.chapters.map((ch) =>
        ch.id === chId ? { ...ch, entries: ch.entries.filter((_, i) => i !== entryIdx) } : ch
      ),
    }));
  };

  // ---- Drag and drop ----
  const dragRef = React.useRef<{ chId: string; idx: number } | null>(null);

  const handleDragStart = (chId: string, idx: number) => {
    dragRef.current = { chId, idx };
  };

  const handleDrop = (targetChId: string, targetIdx: number) => {
    const src = dragRef.current;
    if (!src) return;
    dragRef.current = null;

    update((s) => {
      const chapters = s.chapters.map((ch) => ({ ...ch, entries: [...ch.entries] }));
      const srcChapter = chapters.find((ch) => ch.id === src.chId);
      const tgtChapter = chapters.find((ch) => ch.id === targetChId);
      if (!srcChapter || !tgtChapter) return s;

      const [moved] = srcChapter.entries.splice(src.idx, 1);
      if (!moved) return s;

      // Adjust target index if dragging within same chapter and src is before target
      const adjustedIdx = (src.chId === targetChId && src.idx < targetIdx) ? targetIdx - 1 : targetIdx;
      tgtChapter.entries.splice(adjustedIdx, 0, moved);

      return { ...s, chapters };
    });
  };

  // ---- Collect uncategorized scenes ----
  const usedSceneIds = React.useMemo(() => {
    const used = new Set<string>();
    for (const ch of structure.chapters) {
      for (const e of ch.entries) {
        if (e.type === 'scene') used.add(e.sceneId);
      }
    }
    return used;
  }, [structure]);

  const uncategorized = React.useMemo(
    () => scenes.filter((s) => !usedSceneIds.has(s.id)),
    [scenes, usedSceneIds],
  );

  // ---- Editing state ----
  const [editingChapter, setEditingChapter] = React.useState<string | null>(null);
  const [editingDivider, setEditingDivider] = React.useState<{ chId: string; idx: number } | null>(null);

  return (
    <>
      <div className="vns-sidebar-header">
        <h1>VN Studio</h1>
        <input
          className="vns-search-input"
          type="text"
          placeholder="Search\u2026"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      <div className="vns-scene-list">
      {structure.chapters.map((ch) => {
        const sceneEntries = ch.entries.filter((e) => e.type === 'scene');
        const createdCount = sceneEntries.filter((e) => e.type === 'scene' && sceneMap.has(e.sceneId)).length;
        const hasActive = ch.entries.some((e) => e.type === 'scene' && e.sceneId === selectedId);

        // When searching, hide chapters with zero matching scenes
        if (needle) {
          const anyMatch = ch.entries.some((e) => {
            if (e.type !== 'scene') return false;
            const scene = sceneMap.get(e.sceneId) ?? null;
            const label = scene?.title ?? e.sceneId.replace(/^voltri_/, '').replace(/_/g, ' ');
            return matchesSearch(label, scene);
          });
          if (!anyMatch) return null;
        }

        return (
          <div key={ch.id} className="vns-chapter-group">
            {/* Chapter header */}
            <div className={`vns-chapter-toggle${hasActive ? ' has-active' : ''}`}>
              <button className="vns-chapter-arrow-btn" onClick={() => toggleChapter(ch.id)}>
                {ch.collapsed ? '\u25B8' : '\u25BE'}
              </button>
              {editingChapter === ch.id ? (
                <input
                  className="vns-chapter-rename-input"
                  autoFocus
                  value={ch.title}
                  onChange={(e) => renameChapter(ch.id, e.target.value)}
                  onBlur={() => setEditingChapter(null)}
                  onKeyDown={(e) => { if (e.key === 'Enter') setEditingChapter(null); }}
                />
              ) : (
                <span className="vns-chapter-title" onDoubleClick={() => setEditingChapter(ch.id)}>
                  {ch.title}
                </span>
              )}
              <span className="vns-chapter-count">{createdCount}/{sceneEntries.length}</span>
              <button className="vns-chapter-menu-btn" onClick={() => deleteChapter(ch.id)} title="Delete chapter">&times;</button>
            </div>

            {/* Chapter contents */}
            {!ch.collapsed && (
              <div className="vns-chapter-scenes">
                {ch.entries.map((entry, idx) => {
                  if (entry.type === 'divider') {
                    const isEditingThis = editingDivider?.chId === ch.id && editingDivider?.idx === idx;
                    return (
                      <div key={`div-${idx}`} className="vns-sidebar-divider"
                        onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('drag-over'); }}
                        onDragLeave={(e) => e.currentTarget.classList.remove('drag-over')}
                        onDrop={(e) => { e.currentTarget.classList.remove('drag-over'); handleDrop(ch.id, idx); }}
                      >
                        {isEditingThis ? (
                          <input
                            className="vns-divider-rename-input"
                            autoFocus
                            value={entry.label}
                            onChange={(e) => renameDivider(ch.id, idx, e.target.value)}
                            onBlur={() => setEditingDivider(null)}
                            onKeyDown={(e) => { if (e.key === 'Enter') setEditingDivider(null); }}
                          />
                        ) : (
                          <span onDoubleClick={() => setEditingDivider({ chId: ch.id, idx })}>
                            {entry.label}
                          </span>
                        )}
                        <button className="vns-divider-delete" onClick={() => deleteEntry(ch.id, idx)} title="Remove divider">&times;</button>
                      </div>
                    );
                  }

                  const scene = sceneMap.get(entry.sceneId) ?? null;
                  const label = scene?.title ?? entry.sceneId.replace(/^voltri_/, '').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

                  // Filter by search
                  if (needle && !matchesSearch(label, scene)) return null;

                  return (
                    <div
                      key={entry.sceneId}
                      className={`vns-scene-btn${selectedId === entry.sceneId ? ' active' : ''}${!scene ? ' placeholder' : ''}`}
                      draggable
                      onDragStart={() => handleDragStart(ch.id, idx)}
                      onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('drag-over'); }}
                      onDragLeave={(e) => e.currentTarget.classList.remove('drag-over')}
                      onDrop={(e) => { e.preventDefault(); e.currentTarget.classList.remove('drag-over'); handleDrop(ch.id, idx); }}
                      onClick={() => onSelect(entry.sceneId)}
                    >
                      <span className="vns-scene-btn-title">
                        <span className="vns-drag-handle" title="Drag to reorder">{'\u2261'}</span>
                        {!scene && <span className="vns-placeholder-dot" />}
                        {label}
                      </span>
                      {scene ? (
                        <span className="vns-scene-btn-desc">{scene.description}</span>
                      ) : (
                        <span className="vns-scene-btn-desc vns-not-created">Not yet created</span>
                      )}
                    </div>
                  );
                })}

                {/* Drop zone at end of chapter */}
                <div
                  className="vns-drop-zone-end"
                  onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('drag-over'); }}
                  onDragLeave={(e) => e.currentTarget.classList.remove('drag-over')}
                  onDrop={(e) => { e.currentTarget.classList.remove('drag-over'); handleDrop(ch.id, ch.entries.length); }}
                />

                {/* Chapter actions */}
                <div className="vns-chapter-actions">
                  <button className="vns-chapter-action-btn" onClick={() => addDivider(ch.id)}>+ Divider</button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Add chapter button */}
      <button className="vns-add-chapter-btn" onClick={addChapter}>+ Add Chapter</button>

      {/* Uncategorized scenes */}
      {uncategorized.length > 0 && (() => {
        const filtered = uncategorized.filter((scene) => matchesSearch(scene.title, scene));
        if (filtered.length === 0) return null;
        return (
          <div className="vns-chapter-group">
            <div className="vns-chapter-toggle">
              <span className="vns-chapter-arrow-btn">{'\u25BE'}</span>
              <span className="vns-chapter-title">Other Scenes</span>
              <span className="vns-chapter-count">{filtered.length}</span>
            </div>
            <div className="vns-chapter-scenes">
              {filtered.map((scene) => (
                <div
                  key={scene.id}
                  className={`vns-scene-btn${selectedId === scene.id ? ' active' : ''}`}
                  onClick={() => onSelect(scene.id)}
                >
                  <span className="vns-scene-btn-title">{scene.title}</span>
                  <span className="vns-scene-btn-desc">{scene.description}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })()}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Main app                                                           */
/* ------------------------------------------------------------------ */

type MainTab = 'viewer' | 'editor';

export function VNStudioApp() {
  const scenes = useVnSceneStore((s) => s.scenes);
  const loadScenes = useVnSceneStore((s) => s.loadScenes);
  const [selectedSceneId, setSelectedSceneId] = React.useState<string | null>(null);
  const [mainTab, setMainTab] = React.useState<MainTab>('viewer');

  React.useEffect(() => { loadScenes(); }, [loadScenes]);

  const selectedScene = scenes.find((s) => s.id === selectedSceneId) ?? null;

  return (
    <div className="vns-app">
      <div className="vns-sidebar">
        <SceneSidebar scenes={scenes} selectedId={selectedSceneId} onSelect={setSelectedSceneId} />
      </div>
      <div className="vns-main">
        <div className="vns-main-tabs">
          <button
            className={`vns-main-tab${mainTab === 'viewer' ? ' active' : ''}`}
            onClick={() => setMainTab('viewer')}
          >
            Viewer
          </button>
          <button
            className={`vns-main-tab${mainTab === 'editor' ? ' active' : ''}`}
            onClick={() => setMainTab('editor')}
          >
            Editor
          </button>
        </div>
        <div className="vns-main-body">
          {selectedScene ? (
            mainTab === 'viewer' ? (
              <SceneViewer scene={selectedScene} />
            ) : (
              <SceneEditor scene={selectedScene} />
            )
          ) : selectedSceneId ? (
            <div className="vns-empty">
              <p>This scene hasn't been created yet.</p>
            </div>
          ) : (
            <div className="vns-empty">
              <p>Select a scene from the sidebar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
