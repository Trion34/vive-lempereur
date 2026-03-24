import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  useCampaignEditorStore,
  nodeTypeColor,
  nodeTypeLabel,
  getKeysForType,
  getNodeCompleteness,
  type NodeType,
  type CampaignChapter,
  type ChapterNode,
  type CampEventData,
  type ForcedEventBlueprint,
  type RandomEventBlueprint,
  type EventChoiceBlueprint,
} from '../stores/campaignEditorStore';
import { useLineCombatStore } from '../stores/lineCombatStore';
import { useVnSceneStore } from '../stores/vnSceneStore';
import {
  useConfirm,
  EditableText,
  TagEditor,
  DetailEditor,
  NodeTypeSelect,
  AddNodeButton,
} from '../components/campaign/EditorControls';
import { CampaignGraph } from '../components/campaign/CampaignGraph';
import type { LabPageId } from '../labRoutes';
import { openLabInNewTab } from '../utils/openLabInNewTab';
import { NarrativePreview } from '../components/campaign/NarrativePreview';
import { NPCTimeline } from '../components/campaign/NPCTimeline';
import { PlaythroughMode } from '../components/campaign/PlaythroughMode';
import { buildRuntimeCampaignDef } from '../utils/campaignExport';
import { persistCampaignDef } from '@game/data/campaigns/registry';
import type { VNSceneDef } from '@game/data/campaigns/types';

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */

export function CampaignViewerPage() {
  const store = useCampaignEditorStore();
  const {
    chapters, dirty, zoomLevel, selectedChapter, selectedNode, viewMode,
    setZoom, selectChapter, selectNode, setViewMode,
    updateChapter, addChapter, removeChapter, reorderChapter, duplicateChapter,
    updateNode, addNode, removeNode, reorderNode, duplicateNode,
    undo, redo, undoStack, redoStack,
    save, exportJSON, importJSON, resetToSeed,
  } = store;

  const chapter = chapters.find((c) => c.id === selectedChapter);
  const node = chapter?.nodes.find((n) => n.id === selectedNode);

  const resetConfirm = useConfirm();
  const [searchTerm, setSearchTerm] = useState('');

  // Undo/redo keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        const tag = (e.target as HTMLElement).tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && ((e.key === 'z' && e.shiftKey) || e.key === 'y')) {
        const tag = (e.target as HTMLElement).tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [undo, redo]);

  const handleChapterClick = (chId: string) => {
    selectChapter(chId);
    setZoom('chapter');
  };

  const handleNodeClick = (nodeId: string) => {
    selectNode(nodeId);
    setZoom('node');
  };

  const handleBack = useCallback(() => {
    if (zoomLevel === 'node') {
      selectNode(null);
      setZoom('chapter');
    } else if (zoomLevel === 'chapter') {
      selectChapter(null);
      setZoom('campaign');
    }
  }, [zoomLevel, selectNode, setZoom, selectChapter]);

  // Escape key → Back navigation (list view only)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && viewMode === 'list' && zoomLevel !== 'campaign') {
        // Don't intercept if user is in an input/textarea
        const tag = (e.target as HTMLElement).tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
        e.preventDefault();
        handleBack();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [viewMode, zoomLevel, handleBack]);

  const handleExport = () => {
    const json = exportJSON();
    navigator.clipboard.writeText(json).catch(() => {});
  };

  const handleImport = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!importJSON(text)) {
        alert('Invalid campaign JSON');
      }
    } catch {
      const text = prompt('Paste campaign JSON:');
      if (text && !importJSON(text)) {
        alert('Invalid campaign JSON');
      }
    }
  };

  const handleDownload = () => {
    const json = exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'campaign-blueprint.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (resetConfirm.pending) {
      resetToSeed();
      resetConfirm.cancel();
    } else {
      resetConfirm.request();
    }
  };

  const resetLabel = resetConfirm.pending
    ? (dirty ? 'Unsaved changes! Confirm?' : 'Confirm?')
    : 'Reset';

  const handleTestCampaign = () => {
    const { chapters: chs, npcAssignments, interludeNarratives, getCampEvents } = useCampaignEditorStore.getState();

    // Bootstrap VN scene store from localStorage (may not have been opened this session)
    useVnSceneStore.getState().loadScenes();
    const vnScenes = useVnSceneStore.getState().scenes;

    // Gather camp events per camp node
    const allNodes = chs.flatMap((ch) => ch.nodes);
    const campEvents: Record<string, CampEventData> = {};
    for (const n of allNodes) {
      if (n.type === 'camp') {
        campEvents[n.id] = getCampEvents(n.id);
      }
    }

    // Map VN node IDs to VN scenes via explicit sceneId detail or fallback to node ID
    const vnSceneMap: Record<string, VNSceneDef> = {};
    const missingScenes: string[] = [];
    for (const n of allNodes) {
      if (n.type === 'vn') {
        const sceneId = typeof n.details.sceneId === 'string' ? n.details.sceneId : n.id;
        const scene = vnScenes.find((s) => s.id === sceneId);
        if (scene) {
          vnSceneMap[n.id] = scene;
        } else {
          missingScenes.push(`"${n.label}" (sceneId: ${sceneId})`);
        }
      }
    }

    const def = buildRuntimeCampaignDef(
      'lab-test',
      'Lab Test Campaign',
      chs,
      npcAssignments,
      interludeNarratives,
      campEvents,
      vnSceneMap,
    );

    // Persist to localStorage so the game tab can pick it up
    persistCampaignDef(def);

    const vnCount = Object.keys(vnSceneMap).length;
    const warnings = missingScenes.length > 0
      ? `\n\nMissing VN scenes: ${missingScenes.join(', ')}`
      : '';
    const openGame = confirm(
      `Campaign saved with ${def.sequence.length} nodes, ${vnCount} VN scenes.${warnings}\n\nOpen game to test?`
    );
    if (openGame) {
      window.open('/game/index.html', '_blank');
    }
  };

  const totalNodes = chapters.reduce((sum, ch) => sum + ch.nodes.length, 0);

  return (
    <div className="cv-page">
      {/* Toolbar */}
      <div className="art-lab-toolbar">
        {/* View mode toggle */}
        <button
          className={`art-lab-filter-btn${viewMode === 'list' ? ' active' : ''}`}
          onClick={() => setViewMode('list')}
        >
          List
        </button>
        <button
          className={`art-lab-filter-btn${viewMode === 'graph' ? ' active' : ''}`}
          onClick={() => setViewMode('graph')}
        >
          Graph
        </button>
        <button
          className={`art-lab-filter-btn${viewMode === 'timeline' ? ' active' : ''}`}
          onClick={() => setViewMode('timeline')}
        >
          Timeline
        </button>
        <button
          className={`art-lab-filter-btn${viewMode === 'playthrough' ? ' active' : ''}`}
          onClick={() => setViewMode('playthrough')}
        >
          Playthrough
        </button>

        <span className="art-lab-toolbar-divider" />

        {/* Breadcrumbs (list view only) */}
        {viewMode === 'list' && (
          <>
            <button
              className={`art-lab-filter-btn${zoomLevel === 'campaign' ? ' active' : ''}`}
              onClick={() => { setZoom('campaign'); selectChapter(null); selectNode(null); }}
            >
              Campaign
            </button>
            {chapter && (
              <>
                <span className="cv-breadcrumb-sep">&rsaquo;</span>
                <button
                  className={`art-lab-filter-btn${zoomLevel === 'chapter' ? ' active' : ''}`}
                  onClick={() => { setZoom('chapter'); selectNode(null); }}
                >
                  Ch.{chapter.number}: {chapter.title}
                </button>
              </>
            )}
            {node && (
              <>
                <span className="cv-breadcrumb-sep">&rsaquo;</span>
                <span className="cv-breadcrumb-node">{node.label}</span>
              </>
            )}
            {zoomLevel !== 'campaign' && (
              <>
                <span className="art-lab-toolbar-divider" />
                <button className="art-lab-small-btn" onClick={handleBack}>&larr; Back</button>
              </>
            )}
            <span className="art-lab-toolbar-divider" />
          </>
        )}

        {/* Editor controls */}
        {dirty && <span className="cv-dirty-dot" title="Unsaved changes" />}
        <button className="art-lab-small-btn" onClick={save} title="Save to localStorage">Save</button>
        <button className="art-lab-small-btn" onClick={handleExport} title="Copy full blueprint JSON to clipboard">Copy Blueprint</button>
        <button className="art-lab-small-btn" onClick={handleImport} title="Import blueprint JSON from clipboard">Paste Blueprint</button>
        <button className="art-lab-small-btn" onClick={handleDownload} title="Download blueprint as JSON file">Download</button>
        <button className="art-lab-small-btn" onClick={handleTestCampaign} title="Register campaign def in game runtime">Test Campaign</button>
        <button
          className="art-lab-small-btn"
          onClick={undo}
          disabled={undoStack.length === 0}
          title="Undo (Ctrl+Z)"
        >
          Undo
        </button>
        <button
          className="art-lab-small-btn"
          onClick={redo}
          disabled={redoStack.length === 0}
          title="Redo (Ctrl+Shift+Z)"
        >
          Redo
        </button>
        <button
          className={`art-lab-small-btn${resetConfirm.pending ? ' cv-confirm-active' : ''}`}
          onClick={handleReset}
          title={resetConfirm.pending ? 'Click again to confirm reset' : 'Reset to seed data'}
        >
          {resetLabel}
        </button>
        <span className="art-lab-count">
          {chapters.length} chapters, {totalNodes} nodes
        </span>
      </div>

      {/* Graph view */}
      {viewMode === 'graph' && <CampaignGraph />}

      {/* Timeline view */}
      {viewMode === 'timeline' && <NPCTimeline />}

      {/* Playthrough view */}
      {viewMode === 'playthrough' && (
        <PlaythroughMode
          chapters={chapters}
          interludeNarratives={store.interludeNarratives}
          onExit={() => setViewMode('list')}
        />
      )}

      {/* List view */}
      {viewMode === 'list' && (
        <div className="cv-content">
          {zoomLevel === 'campaign' && (
            <CampaignLevel
              chapters={chapters}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onChapterClick={handleChapterClick}
              onUpdateChapter={updateChapter}
              onReorderChapter={reorderChapter}
              onRemoveChapter={removeChapter}
              onAddChapter={addChapter}
              onDuplicateChapter={duplicateChapter}
            />
          )}

          {zoomLevel === 'chapter' && chapter && (
            <ChapterLevel
              chapter={chapter}
              interludeNarratives={store.interludeNarratives}
              campEvents={store.campEvents}
              onNodeClick={handleNodeClick}
              onUpdateChapter={updateChapter}
              onUpdateNode={updateNode}
              onAddNode={addNode}
              onRemoveNode={removeNode}
              onReorderNode={reorderNode}
              onDuplicateNode={duplicateNode}
            />
          )}

          {zoomLevel === 'node' && node && chapter && (
            <NodeLevel
              node={node}
              chapter={chapter}
              chapters={chapters}
              onUpdateNode={updateNode}
            />
          )}
        </div>
      )}

    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Campaign level                                                     */
/* ------------------------------------------------------------------ */

function CampaignLevel({ chapters, searchTerm, onSearchChange, onChapterClick, onUpdateChapter, onReorderChapter, onRemoveChapter, onAddChapter, onDuplicateChapter }: {
  chapters: CampaignChapter[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onChapterClick: (id: string) => void;
  onUpdateChapter: (id: string, patch: Partial<CampaignChapter>) => void;
  onReorderChapter: (id: string, dir: 'up' | 'down') => void;
  onRemoveChapter: (id: string) => void;
  onAddChapter: (afterId?: string) => void;
  onDuplicateChapter: (id: string) => void;
}) {
  const filteredChapters = useMemo(() => {
    if (!searchTerm.trim()) return chapters;
    const term = searchTerm.toLowerCase();
    return chapters.filter((ch) =>
      ch.title.toLowerCase().includes(term) ||
      ch.summary.toLowerCase().includes(term) ||
      ch.dateRange.toLowerCase().includes(term) ||
      ch.nodes.some((n) =>
        n.label.toLowerCase().includes(term) ||
        n.description.toLowerCase().includes(term),
      ),
    );
  }, [chapters, searchTerm]);

  return (
    <div className="cv-campaign">
      <h2 className="cv-campaign-title">The Italian Campaign, 1796&ndash;1797</h2>
      <div className="cv-search-bar">
        <input
          className="cv-search-input"
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search chapters, nodes..."
        />
        {searchTerm && (
          <button className="cv-search-clear" onClick={() => onSearchChange('')}>&times;</button>
        )}
        <span className="cv-campaign-subtitle">
          {searchTerm ? `${filteredChapters.length} of ${chapters.length} chapters` : `${chapters.length} chapters from Nice to Vienna`}
        </span>
      </div>
      <div className="cv-timeline">
        {filteredChapters.map((ch, i) => (
          <ChapterCard
            key={ch.id}
            chapter={ch}
            index={i}
            total={filteredChapters.length}
            onClick={() => onChapterClick(ch.id)}
            onUpdate={(patch) => onUpdateChapter(ch.id, patch)}
            onReorder={(dir) => onReorderChapter(ch.id, dir)}
            onRemove={() => onRemoveChapter(ch.id)}
            onDuplicate={() => onDuplicateChapter(ch.id)}
          />
        ))}
      </div>
      <button className="cv-add-btn cv-add-chapter-btn" onClick={() => onAddChapter()}>+ Add Chapter</button>
    </div>
  );
}

function ChapterCard({ chapter: ch, index, total, onClick, onUpdate: _onUpdate, onReorder, onRemove, onDuplicate }: {
  chapter: CampaignChapter;
  index: number;
  total: number;
  onClick: () => void;
  onUpdate: (patch: Partial<CampaignChapter>) => void;
  onReorder: (dir: 'up' | 'down') => void;
  onRemove: () => void;
  onDuplicate: () => void;
}) {
  const deleteConfirm = useConfirm();

  return (
    <div className="cv-chapter-card cv-chapter-card-edit">
      <div className="cv-chapter-number">Ch.{ch.number}</div>
      <div className="cv-chapter-info" onClick={onClick}>
        <span className="cv-chapter-title">{ch.title}</span>
        <span className="cv-chapter-date">{ch.dateRange}</span>
        <span className="cv-chapter-summary">{ch.summary}</span>
      </div>
      <div className="cv-chapter-nodes">
        {ch.nodes.map((n) => (
          <span
            key={n.id}
            className="cv-node-pip"
            style={{ background: nodeTypeColor[n.type] }}
            title={`${nodeTypeLabel[n.type]}: ${n.label}`}
          />
        ))}
      </div>
      <div className="cv-card-controls">
        {index > 0 && (
          <button className="cv-move-btn" onClick={(e) => { e.stopPropagation(); onReorder('up'); }} title="Move up">&uarr;</button>
        )}
        {index < total - 1 && (
          <button className="cv-move-btn" onClick={(e) => { e.stopPropagation(); onReorder('down'); }} title="Move down">&darr;</button>
        )}
        <button className="cv-move-btn" onClick={(e) => { e.stopPropagation(); onDuplicate(); }} title="Duplicate chapter">&#x2295;</button>
        <button
          className={`cv-delete-btn${deleteConfirm.pending ? ' cv-confirm-active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            if (deleteConfirm.pending) { onRemove(); deleteConfirm.cancel(); }
            else deleteConfirm.request();
          }}
          title={deleteConfirm.pending ? 'Click again to confirm' : 'Delete chapter'}
        >
          {deleteConfirm.pending ? '?' : '\u00D7'}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Chapter level                                                      */
/* ------------------------------------------------------------------ */

function ChapterLevel({ chapter, interludeNarratives, campEvents, onNodeClick, onUpdateChapter, onUpdateNode: _onUpdateNode, onAddNode: _onAddNode, onRemoveNode, onReorderNode, onDuplicateNode }: {
  chapter: CampaignChapter;
  interludeNarratives: Record<string, { chunks: string[]; splashText: string }>;
  campEvents: Record<string, CampEventData>;
  onNodeClick: (id: string) => void;
  onUpdateChapter: (id: string, patch: Partial<CampaignChapter>) => void;
  onUpdateNode: (chId: string, nId: string, patch: Partial<ChapterNode>) => void;
  onAddNode: (chId: string, afterId?: string, type?: NodeType) => void;
  onRemoveNode: (chId: string, nId: string) => void;
  onReorderNode: (chId: string, nId: string, dir: 'up' | 'down') => void;
  onDuplicateNode: (chId: string, nId: string) => void;
}) {
  return (
    <div className="cv-chapter-detail">
      <div className="cv-chapter-header">
        <EditableText
          tag="h2"
          className="cv-chapter-detail-title"
          value={`Chapter ${chapter.number}: ${chapter.title}`}
          onChange={(v) => {
            const stripped = v.replace(/^Chapter\s+\d+:\s*/, '');
            onUpdateChapter(chapter.id, { title: stripped });
          }}
        />
        <EditableText
          tag="span"
          className="cv-chapter-detail-date"
          value={chapter.dateRange}
          onChange={(v) => onUpdateChapter(chapter.id, { dateRange: v })}
          placeholder="Date range..."
        />
      </div>
      <EditableText
        tag="p"
        className="cv-chapter-detail-summary"
        value={chapter.summary}
        onChange={(v) => onUpdateChapter(chapter.id, { summary: v })}
        multiline
        placeholder="Chapter summary..."
      />

      <div className="cv-node-flow">
        <AddNodeButton chapterId={chapter.id} />
        {chapter.nodes.map((n, i) => (
          <React.Fragment key={n.id}>
            <NodeCard
              node={n}
              index={i}
              total={chapter.nodes.length}
              chapterId={chapter.id}
              completeness={getNodeCompleteness(n, interludeNarratives, campEvents)}
              interludeNarratives={interludeNarratives}
              onClick={() => onNodeClick(n.id)}
              onReorder={(dir) => onReorderNode(chapter.id, n.id, dir)}
              onRemove={() => onRemoveNode(chapter.id, n.id)}
              onDuplicate={() => onDuplicateNode(chapter.id, n.id)}
            />
            <AddNodeButton chapterId={chapter.id} afterNodeId={n.id} />
          </React.Fragment>
        ))}
      </div>

      <div className="cv-chapter-meta">
        <div className="cv-meta-section">
          <h3 className="cv-meta-title">Key Battles</h3>
          <TagEditor
            tags={chapter.keyBattles}
            onChange={(tags) => onUpdateChapter(chapter.id, { keyBattles: tags })}
            label="Battles"
            tagClass="cv-meta-tag-battle"
          />
        </div>
        <div className="cv-meta-section">
          <h3 className="cv-meta-title">Commanders</h3>
          <div className="cv-commanders">
            <TagEditor
              tags={chapter.keyCommanders.french}
              onChange={(tags) => onUpdateChapter(chapter.id, { keyCommanders: { ...chapter.keyCommanders, french: tags } })}
              label="French"
              tagClass="cv-meta-tag-french"
            />
            <TagEditor
              tags={chapter.keyCommanders.austrian}
              onChange={(tags) => onUpdateChapter(chapter.id, { keyCommanders: { ...chapter.keyCommanders, austrian: tags } })}
              label="Austrian"
              tagClass="cv-meta-tag-austrian"
            />
          </div>
        </div>
        <div className="cv-meta-section">
          <h3 className="cv-meta-title">Outcome</h3>
          <EditableText
            tag="p"
            className="cv-meta-text"
            value={chapter.outcome}
            onChange={(v) => onUpdateChapter(chapter.id, { outcome: v })}
            placeholder="Chapter outcome..."
          />
        </div>
      </div>
    </div>
  );
}

const COMPLETENESS_COLORS: Record<string, string> = {
  complete: 'var(--health-high)',
  partial: 'var(--accent-gold)',
  empty: 'var(--text-muted, #555)',
};

function NodeCard({ node: n, index, total, chapterId: _chapterId, completeness, interludeNarratives, onClick, onReorder, onRemove, onDuplicate }: {
  node: ChapterNode;
  index: number;
  total: number;
  chapterId: string;
  completeness: 'complete' | 'partial' | 'empty';
  interludeNarratives: Record<string, { chunks: string[]; splashText: string }>;
  onClick: () => void;
  onReorder: (dir: 'up' | 'down') => void;
  onRemove: () => void;
  onDuplicate: () => void;
}) {
  const deleteConfirm = useConfirm();

  // For interlude/vn nodes, filter out 'beats' from details and show chunk count instead
  const isNarrativeNode = n.type === 'interlude' || n.type === 'vn';
  const displayDetails = isNarrativeNode
    ? Object.entries(n.details).filter(([k]) => k !== 'beats')
    : Object.entries(n.details);
  const chunkCount = isNarrativeNode ? (interludeNarratives[n.id]?.chunks.length ?? 0) : 0;

  return (
    <>
      <div className="cv-node-card cv-node-card-edit">
        <div className="cv-node-card-main" onClick={onClick}>
          <span className="cv-node-type-badge" style={{ background: nodeTypeColor[n.type] }}>
            {nodeTypeLabel[n.type]}
          </span>
          <span
            className="cv-completeness-dot"
            style={{ background: COMPLETENESS_COLORS[completeness] }}
            title={completeness}
          />
          <span className="cv-node-label">{n.label}</span>
          <span className="cv-node-desc">{n.description}</span>
          {(displayDetails.length > 0 || isNarrativeNode) && (
            <div className="cv-node-details">
              {displayDetails.map(([k, v]) => (
                <span key={k} className="cv-node-detail-item">
                  {k}: <strong>{String(v)}</strong>
                </span>
              ))}
              {isNarrativeNode && (
                <span className="cv-node-detail-item">
                  chunks: <strong>{chunkCount}</strong>
                </span>
              )}
            </div>
          )}
        </div>
        <div className="cv-card-controls cv-card-controls-vertical">
          {index > 0 && (
            <button className="cv-move-btn" onClick={(e) => { e.stopPropagation(); onReorder('up'); }} title="Move up">&uarr;</button>
          )}
          {index < total - 1 && (
            <button className="cv-move-btn" onClick={(e) => { e.stopPropagation(); onReorder('down'); }} title="Move down">&darr;</button>
          )}
          <button className="cv-move-btn" onClick={(e) => { e.stopPropagation(); onDuplicate(); }} title="Duplicate node">&#x2295;</button>
          <button
            className={`cv-delete-btn${deleteConfirm.pending ? ' cv-confirm-active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              if (deleteConfirm.pending) { onRemove(); deleteConfirm.cancel(); }
              else deleteConfirm.request();
            }}
            title={deleteConfirm.pending ? 'Click again to confirm' : 'Delete node'}
          >
            {deleteConfirm.pending ? '?' : '\u00D7'}
          </button>
        </div>
      </div>
      {index < total - 1 && (
        <div className="cv-node-arrow">&darr;</div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Cross-launch button                                                */
/* ------------------------------------------------------------------ */

function CrossLaunchButton({ node }: { node: ChapterNode }) {
  const getTarget = (): { page: LabPageId; label: string; config: Record<string, string | number | undefined> } | null => {
    if (node.type === 'camp') {
      return {
        page: 'camp',
        label: 'Open in Camp Lab',
        config: { sourceNodeId: node.id, actions: node.details.actions, weather: node.details.weather, supply: node.details.supply },
      };
    }
    if (node.type === 'battle') {
      return {
        page: 'line-battle',
        label: 'Open in Line Battle Lab',
        config: { sourceNodeId: node.id, volleys: node.details.volleys, parts: node.details.parts },
      };
    }
    if (node.type === 'interlude') {
      return {
        page: 'story-beat',
        label: 'Open in Story Beat Preview',
        config: { sourceNodeId: node.id, label: node.label },
      };
    }
    if (node.type === 'vn') {
      return {
        page: 'visual-novel',
        label: 'Open in Visual Novel Lab',
        config: { sourceNodeId: node.id, label: node.label, sceneId: typeof node.details.sceneId === 'string' ? node.details.sceneId : undefined },
      };
    }
    if (node.type === 'line-combat') {
      return {
        page: 'line-battle',
        label: 'Open in Line Battle Lab',
        config: { moduleId: node.details.moduleId as string },
      };
    }
    return null;
  };

  const target = getTarget();
  if (!target) return null;

  return (
    <div className="cv-cross-launch-group">
      <button
        className="cv-cross-launch-btn"
        onClick={() => openLabInNewTab(target.page, target.config)}
      >
        {target.label}
      </button>

      {/* Secondary cross-launch: battle nodes also get Melee Lab */}
      {node.type === 'battle' && (
        <button
          className="cv-cross-launch-btn cv-cross-launch-secondary"
          onClick={() => openLabInNewTab('melee', { sourceNodeId: node.id, label: node.label })}
        >
          Open in Melee Lab
        </button>
      )}

      {/* Utility cross-launch row */}
      <div className="cv-cross-launch-utils">
        <button
          className="cv-cross-launch-util-btn"
          onClick={() => openLabInNewTab('audio', { sourceNodeId: node.id, label: node.label })}
          title="Open Audio Lab with node context"
        >
          Audio
        </button>
        <button
          className="cv-cross-launch-util-btn"
          onClick={() => openLabInNewTab('art', { sourceNodeId: node.id, label: node.label })}
          title="Open Art Lab with node context"
        >
          Art
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Node level                                                         */
/* ------------------------------------------------------------------ */

function InterludeNarrativeEditor({ nodeId }: { nodeId: string }) {
  const { interludeNarratives, updateInterludeNarrative } = useCampaignEditorStore();
  const data = interludeNarratives[nodeId] ?? { chunks: [], splashText: '' };

  const handleChunksChange = (text: string) => {
    const chunks = text.split('\n\n').filter((c) => c.trim().length > 0);
    updateInterludeNarrative(nodeId, chunks, data.splashText);
  };

  const handleSplashChange = (text: string) => {
    updateInterludeNarrative(nodeId, data.chunks, text);
  };

  const chunkCount = data.chunks.length;

  return (
    <div className="cv-node-detail-config cv-interlude-narrative-editor">
      <h3 className="cv-meta-title">Narrative</h3>
      <div className="cv-interlude-splash-section">
        <label className="cn-label">
          Splash Text
          <input
            className="cv-edit-input"
            value={data.splashText}
            onChange={(e) => handleSplashChange(e.target.value)}
            placeholder="Splash text..."
          />
        </label>
      </div>
      <label className="cn-label">
        Narrative Chunks (separate with blank lines)
        <textarea
          className="cv-edit-textarea"
          value={data.chunks.join('\n\n')}
          onChange={(e) => handleChunksChange(e.target.value)}
          rows={12}
          placeholder="Write narrative chunks separated by blank lines..."
        />
      </label>
      <span className="cv-interlude-chunk-count">
        {chunkCount === 0 ? 'No chunks yet \u2014 write narrative above' : `${chunkCount} chunk${chunkCount !== 1 ? 's' : ''}`}
      </span>
      {chunkCount > 0 && (
        <NarrativePreview chunks={data.chunks} splashText={data.splashText} />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Structured editors for Camp and Battle nodes                       */
/* ------------------------------------------------------------------ */

const WEATHER_OPTIONS = ['cold', 'clear', 'hot', 'rain', 'fog'] as const;
const SUPPLY_OPTIONS = ['scarce', 'adequate', 'plentiful'] as const;

function CampStructuredEditor({ node, chapterId, onUpdateNode }: {
  node: ChapterNode;
  chapterId: string;
  onUpdateNode: (chId: string, nId: string, patch: Partial<ChapterNode>) => void;
}) {
  const details = node.details;
  const actions = typeof details.actions === 'number' ? details.actions : 16;
  const weather = typeof details.weather === 'string' ? details.weather : 'clear';
  const supply = typeof details.supply === 'string' ? details.supply : 'adequate';
  const openingNarrative = typeof details.openingNarrative === 'string' ? details.openingNarrative : '';

  const updateDetail = (key: string, value: string | number) => {
    onUpdateNode(chapterId, node.id, { details: { ...details, [key]: value } });
  };

  return (
    <div className="cv-node-detail-config">
      <h3 className="cv-meta-title">Camp Configuration</h3>
      <div className="cv-structured-editor">
        <div className="cv-structured-field">
          <label>Actions</label>
          <input
            type="number"
            min={1}
            max={30}
            value={actions}
            onChange={(e) => updateDetail('actions', parseInt(e.target.value) || 1)}
          />
        </div>
        <div className="cv-structured-field">
          <label>Weather</label>
          <select value={weather} onChange={(e) => updateDetail('weather', e.target.value)}>
            {WEATHER_OPTIONS.map((w) => <option key={w} value={w}>{w}</option>)}
          </select>
        </div>
        <div className="cv-structured-field">
          <label>Supply Level</label>
          <select value={supply} onChange={(e) => updateDetail('supply', e.target.value)}>
            {SUPPLY_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="cv-structured-field cv-field-wide">
          <label>Opening Narrative</label>
          <textarea
            value={openingNarrative}
            onChange={(e) => updateDetail('openingNarrative', e.target.value)}
            placeholder="Narrative text shown when camp begins..."
            rows={4}
          />
        </div>
      </div>
    </div>
  );
}

function BattleStructuredEditor({ node, chapterId, onUpdateNode }: {
  node: ChapterNode;
  chapterId: string;
  onUpdateNode: (chId: string, nId: string, patch: Partial<ChapterNode>) => void;
}) {
  const details = node.details;
  const parts = typeof details.parts === 'number' ? details.parts : 1;
  const volleys = typeof details.volleys === 'number' ? details.volleys : 4;

  const updateDetail = (key: string, value: number) => {
    onUpdateNode(chapterId, node.id, { details: { ...details, [key]: value } });
  };

  return (
    <div className="cv-node-detail-config">
      <h3 className="cv-meta-title">Battle Configuration</h3>
      <div className="cv-structured-editor">
        <div className="cv-structured-field">
          <label>Parts</label>
          <input
            type="number"
            min={1}
            max={3}
            value={parts}
            onChange={(e) => updateDetail('parts', parseInt(e.target.value) || 1)}
          />
        </div>
        <div className="cv-structured-field">
          <label>Volleys</label>
          <input
            type="number"
            min={1}
            max={20}
            value={volleys}
            onChange={(e) => updateDetail('volleys', parseInt(e.target.value) || 1)}
          />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Line Combat Structured Editor                                       */
/* ------------------------------------------------------------------ */

function LineCombatStructuredEditor({ node, chapterId, onUpdateNode }: {
  node: ChapterNode;
  chapterId: string;
  onUpdateNode: (chId: string, nId: string, patch: Partial<ChapterNode>) => void;
}) {
  const { modules, loadModules } = useLineCombatStore();
  const details = node.details;
  const moduleId = typeof details.moduleId === 'string' ? details.moduleId : '';

  useEffect(() => { loadModules(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedModule = modules.find((m) => m.id === moduleId);

  const updateDetail = (key: string, value: string | number) => {
    onUpdateNode(chapterId, node.id, { details: { ...details, [key]: value } });
  };

  return (
    <div className="cv-node-detail-config">
      <h3 className="cv-meta-title">Line Combat Module</h3>
      <div className="cv-structured-editor">
        <div className="cv-structured-field">
          <label>Module</label>
          <select value={moduleId} onChange={(e) => updateDetail('moduleId', e.target.value)}>
            <option value="">-- Select Module --</option>
            {modules.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
      </div>
      {moduleId && !selectedModule && (
        <div className="cv-line-combat-warning">
          Module "{moduleId}" not found — it may have been deleted or renamed.
          <button className="cv-lc-clear-btn" onClick={() => updateDetail('moduleId', '')}>Clear reference</button>
        </div>
      )}
      {selectedModule && (
        <div className="cv-line-combat-summary">
          <div className="cv-lc-row">
            <span className="cv-lc-label">Mode</span>
            <span className="cv-lc-val">{selectedModule.mode}</span>
          </div>
          <div className="cv-lc-row">
            <span className="cv-lc-label">Volleys</span>
            <span className="cv-lc-val">{selectedModule.volleys.length}</span>
          </div>
          <div className="cv-lc-row">
            <span className="cv-lc-label">Range</span>
            <span className="cv-lc-val">
              {selectedModule.volleys.length > 0
                ? `${selectedModule.volleys[0].def.range}\u2192${selectedModule.volleys[selectedModule.volleys.length - 1].def.range}p`
                : '\u2014'}
            </span>
          </div>
          {selectedModule.tags.length > 0 && (
            <div className="cv-lc-row">
              <span className="cv-lc-label">Tags</span>
              <span className="cv-lc-val">{selectedModule.tags.join(', ')}</span>
            </div>
          )}
          <button
            className="cv-cross-launch-btn cv-cross-launch-secondary"
            style={{ marginTop: '0.4rem' }}
            onClick={() => openLabInNewTab('line-battle', { moduleId: selectedModule.id })}
          >
            Open in Line Battle Lab
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Camp Event Editor                                                   */
/* ------------------------------------------------------------------ */

const EVENT_CATEGORIES = ['disease', 'desertion', 'weather', 'supply', 'interpersonal', 'orders', 'rumour'] as const;
const STAT_OPTIONS = ['valor', 'musketry', 'elan', 'strength', 'endurance', 'constitution', 'charisma', 'intelligence', 'awareness'] as const;

function EventVNLaunchButton({ nodeId, eventId, eventTitle }: { nodeId: string; eventId: string; eventTitle: string }) {
  return (
    <button
      className="cv-cross-launch-util-btn cv-event-vn-btn"
      onClick={(e) => { e.stopPropagation(); openLabInNewTab('visual-novel', { sourceNodeId: nodeId, eventId, label: eventTitle }); }}
      title="Open event in Visual Novel Lab"
    >
      VN
    </button>
  );
}

function CampEventEditor({ nodeId }: { nodeId: string }) {
  const { getCampEvents, updateCampEvents } = useCampaignEditorStore();
  const data = getCampEvents(nodeId);
  const [expandedForced, setExpandedForced] = useState<string | null>(null);
  const [expandedRandom, setExpandedRandom] = useState<string | null>(null);

  const update = (patch: Partial<CampEventData>) => {
    updateCampEvents(nodeId, { ...data, ...patch });
  };

  const addForcedEvent = () => {
    const id = `forced-${Date.now()}`;
    const evt: ForcedEventBlueprint = {
      id, title: 'New Event', category: 'interpersonal',
      narrative: '', choices: [], triggerAt: 6,
    };
    update({ forcedEvents: [...data.forcedEvents, evt] });
    setExpandedForced(id);
  };

  const updateForcedEvent = (eventId: string, patch: Partial<ForcedEventBlueprint>) => {
    update({
      forcedEvents: data.forcedEvents.map((e) =>
        e.id === eventId ? { ...e, ...patch } : e,
      ),
    });
  };

  const removeForcedEvent = (eventId: string) => {
    update({ forcedEvents: data.forcedEvents.filter((e) => e.id !== eventId) });
    if (expandedForced === eventId) setExpandedForced(null);
  };

  const addRandomEvent = () => {
    const id = `random-${Date.now()}`;
    const evt: RandomEventBlueprint = {
      id, title: 'New Event', category: 'interpersonal',
      narrative: '', choices: [], weight: 1,
    };
    update({ randomEvents: [...data.randomEvents, evt] });
    setExpandedRandom(id);
  };

  const updateRandomEvent = (eventId: string, patch: Partial<RandomEventBlueprint>) => {
    update({
      randomEvents: data.randomEvents.map((e) =>
        e.id === eventId ? { ...e, ...patch } : e,
      ),
    });
  };

  const removeRandomEvent = (eventId: string) => {
    update({ randomEvents: data.randomEvents.filter((e) => e.id !== eventId) });
    if (expandedRandom === eventId) setExpandedRandom(null);
  };

  return (
    <div className="cv-node-detail-config cv-event-editor">
      <h3 className="cv-meta-title">Camp Events</h3>

      {/* Random event chance */}
      <div className="cv-structured-editor">
        <div className="cv-structured-field">
          <label>Random Event Chance</label>
          <input
            type="number"
            min={0}
            max={1}
            step={0.05}
            value={data.randomEventChance}
            onChange={(e) => update({ randomEventChance: parseFloat(e.target.value) || 0 })}
          />
        </div>
      </div>

      {/* Forced Events */}
      <div className="cv-event-section">
        <h4 className="cv-event-section-title">Forced Events ({data.forcedEvents.length})</h4>
        {data.forcedEvents.map((evt) => (
          <div key={evt.id} className="cv-event-item">
            <div
              className="cv-event-item-header"
              onClick={() => setExpandedForced(expandedForced === evt.id ? null : evt.id)}
            >
              <span className="cv-event-item-title">{evt.title}</span>
              <span className="cv-event-item-meta">@{evt.triggerAt} remaining | {evt.category}</span>
              <EventVNLaunchButton nodeId={nodeId} eventId={evt.id} eventTitle={evt.title} />
              <button className="cv-delete-btn cv-event-remove-btn" onClick={(e) => { e.stopPropagation(); removeForcedEvent(evt.id); }}>&times;</button>
            </div>
            {expandedForced === evt.id && (
              <EventBlueprintEditor
                event={evt}
                onUpdate={(patch) => updateForcedEvent(evt.id, patch)}
                extraFields={
                  <div className="cv-structured-field">
                    <label>Trigger At (actions remaining)</label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={evt.triggerAt}
                      onChange={(e) => updateForcedEvent(evt.id, { triggerAt: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                }
              />
            )}
          </div>
        ))}
        <button className="cv-add-btn cv-event-add-btn" onClick={addForcedEvent}>+ Add Forced Event</button>
      </div>

      {/* Random Events */}
      <div className="cv-event-section">
        <h4 className="cv-event-section-title">Random Events ({data.randomEvents.length})</h4>
        {data.randomEvents.map((evt) => (
          <div key={evt.id} className="cv-event-item">
            <div
              className="cv-event-item-header"
              onClick={() => setExpandedRandom(expandedRandom === evt.id ? null : evt.id)}
            >
              <span className="cv-event-item-title">{evt.title}</span>
              <span className="cv-event-item-meta">weight: {evt.weight} | {evt.category}</span>
              <EventVNLaunchButton nodeId={nodeId} eventId={evt.id} eventTitle={evt.title} />
              <button className="cv-delete-btn cv-event-remove-btn" onClick={(e) => { e.stopPropagation(); removeRandomEvent(evt.id); }}>&times;</button>
            </div>
            {expandedRandom === evt.id && (
              <EventBlueprintEditor
                event={evt}
                onUpdate={(patch) => updateRandomEvent(evt.id, patch)}
                extraFields={
                  <div className="cv-structured-field">
                    <label>Weight</label>
                    <input
                      type="number"
                      min={0.1}
                      max={10}
                      step={0.1}
                      value={evt.weight}
                      onChange={(e) => updateRandomEvent(evt.id, { weight: parseFloat(e.target.value) || 1 })}
                    />
                  </div>
                }
              />
            )}
          </div>
        ))}
        <button className="cv-add-btn cv-event-add-btn" onClick={addRandomEvent}>+ Add Random Event</button>
      </div>
    </div>
  );
}

function EventBlueprintEditor({ event, onUpdate, extraFields }: {
  event: ForcedEventBlueprint | RandomEventBlueprint;
  onUpdate: (patch: Partial<ForcedEventBlueprint & RandomEventBlueprint>) => void;
  extraFields?: React.ReactNode;
}) {
  const addChoice = () => {
    const id = `choice-${Date.now()}`;
    const choice: EventChoiceBlueprint = { id, label: 'New Choice', description: '' };
    onUpdate({ choices: [...event.choices, choice] });
  };

  const updateChoice = (choiceId: string, patch: Partial<EventChoiceBlueprint>) => {
    onUpdate({
      choices: event.choices.map((c) =>
        c.id === choiceId ? { ...c, ...patch } : c,
      ),
    });
  };

  const removeChoice = (choiceId: string) => {
    onUpdate({ choices: event.choices.filter((c) => c.id !== choiceId) });
  };

  return (
    <div className="cv-event-detail">
      <div className="cv-structured-editor">
        <div className="cv-structured-field">
          <label>Title</label>
          <input
            className="cv-edit-input"
            value={event.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
          />
        </div>
        <div className="cv-structured-field">
          <label>Category</label>
          <select value={event.category} onChange={(e) => onUpdate({ category: e.target.value as typeof event.category })}>
            {EVENT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        {extraFields}
        <div className="cv-structured-field cv-field-wide">
          <label>Narrative</label>
          <textarea
            value={event.narrative}
            onChange={(e) => onUpdate({ narrative: e.target.value })}
            placeholder="Event narrative text..."
            rows={4}
          />
        </div>
      </div>

      {/* Choices */}
      <div className="cv-event-choices">
        <h5 className="cv-event-choices-title">Choices ({event.choices.length})</h5>
        {event.choices.map((choice) => (
          <div key={choice.id} className="cv-event-choice">
            <div className="cv-structured-editor">
              <div className="cv-structured-field">
                <label>Label</label>
                <input
                  className="cv-edit-input"
                  value={choice.label}
                  onChange={(e) => updateChoice(choice.id, { label: e.target.value })}
                />
              </div>
              <div className="cv-structured-field">
                <label>Stat Check</label>
                <select
                  value={choice.statCheck?.stat ?? ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      updateChoice(choice.id, { statCheck: { stat: e.target.value, difficulty: choice.statCheck?.difficulty ?? 50 } });
                    } else {
                      updateChoice(choice.id, { ...choice, statCheck: undefined });
                    }
                  }}
                >
                  <option value="">None</option>
                  {STAT_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              {choice.statCheck && (
                <div className="cv-structured-field">
                  <label>Difficulty</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={choice.statCheck.difficulty}
                    onChange={(e) => updateChoice(choice.id, { statCheck: { ...choice.statCheck!, difficulty: parseInt(e.target.value) || 50 } })}
                  />
                </div>
              )}
              <div className="cv-structured-field cv-field-wide">
                <label>Description</label>
                <textarea
                  value={choice.description}
                  onChange={(e) => updateChoice(choice.id, { description: e.target.value })}
                  placeholder="What happens when the player picks this..."
                  rows={2}
                />
              </div>
            </div>
            <button className="cv-delete-btn cv-event-remove-btn" onClick={() => removeChoice(choice.id)}>&times;</button>
          </div>
        ))}
        <button className="cv-add-btn cv-event-add-btn" onClick={addChoice}>+ Add Choice</button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Interlude Battle Linking Editor                                     */
/* ------------------------------------------------------------------ */

function VNSceneIdEditor({ node, chapterId, onUpdateNode }: {
  node: ChapterNode;
  chapterId: string;
  onUpdateNode: (chId: string, nId: string, patch: Partial<ChapterNode>) => void;
}) {
  const vnScenes = useVnSceneStore((s) => s.scenes);
  const currentSceneId = typeof node.details.sceneId === 'string' ? node.details.sceneId : '';

  // Bootstrap scenes from localStorage if empty
  React.useEffect(() => {
    if (vnScenes.length === 0) useVnSceneStore.getState().loadScenes();
  }, [vnScenes.length]);

  const updateSceneId = (value: string) => {
    onUpdateNode(chapterId, node.id, { details: { ...node.details, sceneId: value } });
  };

  return (
    <div className="cv-node-detail-config">
      <h3 className="cv-meta-title">VN Scene</h3>
      <div className="cv-structured-editor">
        <div className="cv-structured-field">
          <label>Scene</label>
          <select value={currentSceneId} onChange={(e) => updateSceneId(e.target.value)}>
            <option value="">— Select a VN scene —</option>
            {vnScenes.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
          </select>
          {currentSceneId && !vnScenes.some((s) => s.id === currentSceneId) && (
            <p style={{ color: '#c44', fontSize: '0.85em', margin: '4px 0 0' }}>
              Scene "{currentSceneId}" not found in VN Lab
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function InterludeBattleLinkEditor({ node, chapterId, chapters, onUpdateNode }: {
  node: ChapterNode;
  chapterId: string;
  chapters: CampaignChapter[];
  onUpdateNode: (chId: string, nId: string, patch: Partial<ChapterNode>) => void;
}) {
  const details = node.details;
  const fromBattle = typeof details.fromBattle === 'string' ? details.fromBattle : '';
  const toBattle = typeof details.toBattle === 'string' ? details.toBattle : '';

  const battleNodes = chapters.flatMap((ch) =>
    ch.nodes.filter((n) => n.type === 'battle').map((n) => ({ id: n.id, label: n.label })),
  );

  const updateDetail = (key: string, value: string) => {
    onUpdateNode(chapterId, node.id, { details: { ...details, [key]: value } });
  };

  return (
    <div className="cv-node-detail-config">
      <h3 className="cv-meta-title">Battle Links</h3>
      <div className="cv-structured-editor">
        <div className="cv-structured-field">
          <label>From Battle</label>
          <select value={fromBattle} onChange={(e) => updateDetail('fromBattle', e.target.value)}>
            <option value="">None</option>
            {battleNodes.map((b) => <option key={b.id} value={b.id}>{b.label}</option>)}
          </select>
        </div>
        <div className="cv-structured-field">
          <label>To Battle</label>
          <select value={toBattle} onChange={(e) => updateDetail('toBattle', e.target.value)}>
            <option value="">None</option>
            {battleNodes.map((b) => <option key={b.id} value={b.id}>{b.label}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}

/** Filter out structured keys so the generic DetailEditor only shows extras */
function filterStructuredKeys(details: Record<string, string | number>, knownKeys: string[]): Record<string, string | number> {
  const filtered: Record<string, string | number> = {};
  for (const [k, v] of Object.entries(details)) {
    if (!knownKeys.includes(k)) filtered[k] = v;
  }
  return filtered;
}

function mergeDetails(structuredDetails: Record<string, string | number>, extraDetails: Record<string, string | number>, knownKeys: string[]): Record<string, string | number> {
  const merged: Record<string, string | number> = {};
  for (const key of knownKeys) {
    if (key in structuredDetails) merged[key] = structuredDetails[key];
  }
  for (const [k, v] of Object.entries(extraDetails)) {
    merged[k] = v;
  }
  return merged;
}

function NodeLevel({ node, chapter, chapters, onUpdateNode }: {
  node: ChapterNode;
  chapter: CampaignChapter;
  chapters: CampaignChapter[];
  onUpdateNode: (chId: string, nId: string, patch: Partial<ChapterNode>) => void;
}) {
  const CAMP_KEYS = ['actions', 'weather', 'supply', 'openingNarrative'];
  const BATTLE_KEYS = ['parts', 'volleys'];
  const INTERLUDE_KEYS = ['fromBattle', 'toBattle'];
  const VN_KEYS = ['sceneId', 'fromBattle', 'toBattle'];
  const LINE_COMBAT_KEYS = ['moduleId'];

  const knownKeys = node.type === 'camp' ? CAMP_KEYS
    : node.type === 'battle' ? BATTLE_KEYS
    : node.type === 'vn' ? VN_KEYS
    : node.type === 'line-combat' ? LINE_COMBAT_KEYS
    : INTERLUDE_KEYS;

  const extraDetails = filterStructuredKeys(node.details, knownKeys);

  const handleExtraChange = (d: Record<string, string | number>) => {
    // Merge: keep structured keys from current details, replace extras
    const merged = mergeDetails(node.details, d, knownKeys);
    onUpdateNode(chapter.id, node.id, { details: merged });
  };

  return (
    <div className="cv-node-detail" data-node-type={node.type}>
      <div className="cv-node-detail-header">
        <NodeTypeSelect
          value={node.type}
          onChange={(t) => {
            // Clean old type-specific keys when changing type
            const oldTypeKeys = getKeysForType(node.type);
            const newTypeKeys = getKeysForType(t);
            const cleaned = { ...node.details };
            for (const key of oldTypeKeys) {
              if (!newTypeKeys.includes(key)) delete cleaned[key];
            }
            onUpdateNode(chapter.id, node.id, { type: t, details: cleaned });
          }}
        />
        <EditableText
          tag="h2"
          className="cv-node-detail-title"
          value={node.label}
          onChange={(v) => onUpdateNode(chapter.id, node.id, { label: v })}
          placeholder="Node label..."
        />
      </div>
      <EditableText
        tag="p"
        className="cv-node-detail-desc"
        value={node.description}
        onChange={(v) => onUpdateNode(chapter.id, node.id, { description: v })}
        multiline
        placeholder="Node description..."
      />

      <CrossLaunchButton node={node} />

      {node.type === 'interlude' && (
        <>
          <p className="cv-node-type-desc">Cinematic narrative — text slides</p>
          <InterludeNarrativeEditor nodeId={node.id} />
          <InterludeBattleLinkEditor node={node} chapterId={chapter.id} chapters={chapters} onUpdateNode={onUpdateNode} />
        </>
      )}

      {node.type === 'camp' && (
        <>
          <CampStructuredEditor node={node} chapterId={chapter.id} onUpdateNode={onUpdateNode} />
          <CampEventEditor nodeId={node.id} />
        </>
      )}

      {node.type === 'battle' && (
        <BattleStructuredEditor node={node} chapterId={chapter.id} onUpdateNode={onUpdateNode} />
      )}

      {node.type === 'line-combat' && (
        <LineCombatStructuredEditor node={node} chapterId={chapter.id} onUpdateNode={onUpdateNode} />
      )}

      {node.type === 'vn' && (
        <>
          <p className="cv-node-type-desc">Visual Novel sequence — dialogue, portraits, branching</p>
          <VNSceneIdEditor node={node} chapterId={chapter.id} onUpdateNode={onUpdateNode} />
          <InterludeNarrativeEditor nodeId={node.id} />
          <InterludeBattleLinkEditor node={node} chapterId={chapter.id} chapters={chapters} onUpdateNode={onUpdateNode} />
        </>
      )}

      <div className="cv-node-detail-config">
        <h3 className="cv-meta-title">Additional Properties</h3>
        <DetailEditor
          details={extraDetails}
          onChange={handleExtraChange}
        />
      </div>

      <div className="cv-node-detail-context">
        <h3 className="cv-meta-title">Chapter Context</h3>
        <p className="cv-meta-text">
          Chapter {chapter.number}: {chapter.title} ({chapter.dateRange})
        </p>
        <p className="cv-meta-text">{chapter.summary}</p>
      </div>
    </div>
  );
}
