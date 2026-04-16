import React from 'react';
import type { VNScene, DialogueNode } from '@game/types/vnTypes';
import { CHARACTERS } from '@game/types/vnTypes';
import { useVnSceneStore } from '../../lab/src/stores/vnSceneStore';
import { GAME_SCENES } from '../../lab/src/utils/gameSceneImporter';
import { SceneMap } from './SceneMap';

interface SceneEditorProps {
  scene: VNScene;
}

const UNDO_WINDOW_MS = 60_000; // 1 minute to undo a reset

export function SceneEditor({ scene }: SceneEditorProps) {
  const updateChoice = useVnSceneStore((s) => s.updateChoice);
  const insertNodeAfter = useVnSceneStore((s) => s.insertNodeAfter);
  const deleteScene = useVnSceneStore((s) => s.deleteScene);
  const addScene = useVnSceneStore((s) => s.addScene);
  const [currentNodeId, setCurrentNodeId] = React.useState(scene.startNode);
  const [history, setHistory] = React.useState<string[]>([]);
  const [showMap, setShowMap] = React.useState(false);

  // Undo snapshot — stores the pre-reset scene for a limited time
  const [undoSnapshot, setUndoSnapshot] = React.useState<{ scene: VNScene; expiresAt: number } | null>(null);
  const [, forceRerender] = React.useReducer((x) => x + 1, 0);

  // Tick the undo banner countdown every second; clear when expired
  React.useEffect(() => {
    if (!undoSnapshot) return;
    const tick = setInterval(() => {
      if (Date.now() > undoSnapshot.expiresAt) {
        setUndoSnapshot(null);
      } else {
        forceRerender();
      }
    }, 1000);
    return () => clearInterval(tick);
  }, [undoSnapshot]);

  // Clear undo when user switches to a different scene
  React.useEffect(() => {
    setUndoSnapshot(null);
  }, [scene.id]);

  // Does this scene have a canonical source version we can reset to?
  const sourceScene = React.useMemo(
    () => GAME_SCENES.find((s) => s.id === scene.id) ?? null,
    [scene.id],
  );

  const handleResetToSource = () => {
    if (!sourceScene) return;
    const confirm = window.confirm(
      `Reset "${sourceScene.title}" to its original version from the game source?\n\nYou'll have 60 seconds to undo if this was a mistake.`
    );
    if (!confirm) return;

    // Snapshot the current version before overwriting
    const snapshot: VNScene = JSON.parse(JSON.stringify(scene));
    setUndoSnapshot({ scene: snapshot, expiresAt: Date.now() + UNDO_WINDOW_MS });

    deleteScene(scene.id);
    addScene(JSON.parse(JSON.stringify(sourceScene)));
    setCurrentNodeId(sourceScene.startNode);
    setHistory([]);
  };

  const handleUndoReset = () => {
    if (!undoSnapshot) return;
    deleteScene(scene.id);
    addScene(JSON.parse(JSON.stringify(undoSnapshot.scene)));
    setCurrentNodeId(undoSnapshot.scene.startNode);
    setHistory([]);
    setUndoSnapshot(null);
  };

  // Reset navigation when scene changes
  React.useEffect(() => {
    setCurrentNodeId(scene.startNode);
    setHistory([]);
  }, [scene.id, scene.startNode]);

  const currentNode = scene.nodes[currentNodeId];
  const totalNodes = Object.keys(scene.nodes).length;
  const allNodeIds = Object.keys(scene.nodes);
  const currentIndex = allNodeIds.indexOf(currentNodeId) + 1; // 1-based

  if (!currentNode) {
    return (
      <div className="vns-editor-empty">
        <p>Node not found: {currentNodeId}</p>
      </div>
    );
  }

  // Determine forward navigation options
  const hasChoices = !!currentNode.choices && currentNode.choices.length > 0;
  const linearNext = typeof currentNode.next === 'string' ? currentNode.next : null;
  const canGoNextLinear = !hasChoices && linearNext !== null && !!scene.nodes[linearNext];
  const canGoBack = history.length > 0;

  const goToNode = (targetId: string) => {
    if (!scene.nodes[targetId]) return;
    setHistory((prev) => [...prev, currentNodeId]);
    setCurrentNodeId(targetId);
  };

  const handleBack = () => {
    if (!canGoBack) return;
    const prevId = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setCurrentNodeId(prevId);
  };

  const handleAddNode = () => {
    // Default new node speaker = same as current node (most common case)
    const newId = insertNodeAfter(scene.id, currentNodeId, currentNode.speaker);
    if (newId) {
      setHistory((prev) => [...prev, currentNodeId]);
      setCurrentNodeId(newId);
    }
  };

  return (
    <div className="vns-editor">
      {showMap && (
        <SceneMap
          scene={scene}
          currentNodeId={currentNodeId}
          onSelectNode={(id) => {
            setHistory((prev) => [...prev, currentNodeId]);
            setCurrentNodeId(id);
            setShowMap(false);
          }}
          onClose={() => setShowMap(false)}
        />
      )}
      <div className="vns-editor-canvas">
        <div className="vns-editor-topbar">
          <div className="vns-node-counter">
            Node {currentIndex} of {totalNodes}
          </div>
          <div className="vns-editor-topbar-actions">
            {sourceScene && (
              <button
                className="vns-map-toggle-btn"
                onClick={handleResetToSource}
                title="Restore this scene from the game source (discards edits)"
              >
                <span>{'\u21BB'}</span>
                <span>Reset to Source</span>
              </button>
            )}
            <button className="vns-map-toggle-btn" onClick={() => setShowMap(true)} title="Open map view">
              <span>{'\u25A6'}</span>
              <span>Map</span>
            </button>
          </div>
        </div>

        {undoSnapshot && (
          <div className="vns-undo-banner">
            <span className="vns-undo-label">
              Scene reset from source.
            </span>
            <button className="vns-undo-btn" onClick={handleUndoReset}>
              <span>{'\u21B6'}</span>
              <span>Undo reset</span>
            </button>
            <span className="vns-undo-timer">
              ({Math.max(0, Math.ceil((undoSnapshot.expiresAt - Date.now()) / 1000))}s)
            </span>
          </div>
        )}

        <NodeCard sceneId={scene.id} cast={scene.cast} node={currentNode} />

        {/* Choice branch navigation */}
        {hasChoices && (
          <div className="vns-choice-nav">
            {currentNode.choices!.map((choice, idx) => {
              const isCheck = !!choice.gameCheck;
              return (
                <div key={idx} className="vns-choice-row">
                  <input
                    className="vns-choice-label-input"
                    value={choice.label}
                    placeholder="Choice text\u2026"
                    onChange={(e) => updateChoice(scene.id, currentNodeId, idx, { label: e.target.value })}
                  />
                  {isCheck ? (
                    <div className="vns-choice-targets">
                      <button
                        className="vns-choice-target-btn pass"
                        onClick={() => goToNode(choice.gameCheck!.passNode)}
                        title={`Follow pass branch \u2192 ${choice.gameCheck!.passNode}`}
                      >
                        <span>{'\u2713'}</span> pass
                      </button>
                      <button
                        className="vns-choice-target-btn fail"
                        onClick={() => goToNode(choice.gameCheck!.failNode)}
                        title={`Follow fail branch \u2192 ${choice.gameCheck!.failNode}`}
                      >
                        <span>{'\u2717'}</span> fail
                      </button>
                    </div>
                  ) : (
                    <button
                      className="vns-choice-target-btn"
                      onClick={() => goToNode(choice.nextId)}
                      title={`Follow \u2192 ${choice.nextId}`}
                    >
                      <span>{'\u2192'}</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Linear nav buttons */}
        <div className="vns-editor-nav">
          <button
            className="vns-nav-btn"
            onClick={handleBack}
            disabled={!canGoBack}
          >
            <span>{'\u2190'}</span>
            <span>Previous</span>
          </button>
          {!hasChoices && (
            <button
              className="vns-nav-btn add"
              onClick={handleAddNode}
              title="Add a new node after this one"
            >
              <span>{'\u002B'}</span>
              <span>Add Node</span>
            </button>
          )}
          {!hasChoices && (
            <button
              className="vns-nav-btn"
              onClick={() => linearNext && goToNode(linearNext)}
              disabled={!canGoNextLinear}
            >
              <span>Next</span>
              <span>{'\u2192'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function NodeCard({ sceneId, cast, node }: { sceneId: string; cast: string[]; node: DialogueNode }) {
  const updateNode = useVnSceneStore((s) => s.updateNode);
  const speaker = CHARACTERS[node.speaker];
  const speakerColor = speaker?.color ?? '#8a8070';

  // Speaker options: scene cast + narrator + player (if not already in cast)
  const speakerOptions = React.useMemo(() => {
    const ids = new Set<string>(cast);
    ids.add('narrator');
    ids.add('player');
    return Array.from(ids);
  }, [cast]);

  return (
    <div className="vns-node-card">
      <div className="vns-node-speaker-row">
        <select
          className="vns-node-speaker-select"
          style={{ color: speakerColor }}
          value={node.speaker}
          onChange={(e) => updateNode(sceneId, node.id, { speaker: e.target.value })}
        >
          {speakerOptions.map((cid) => {
            const ch = CHARACTERS[cid];
            const name = ch?.name || (cid === 'narrator' ? 'Narrator' : cid);
            return <option key={cid} value={cid}>{name}</option>;
          })}
        </select>
      </div>
      <textarea
        className="vns-node-text-input"
        value={node.text}
        placeholder="Write the dialogue\u2026"
        onChange={(e) => updateNode(sceneId, node.id, { text: e.target.value })}
        rows={4}
      />
    </div>
  );
}
