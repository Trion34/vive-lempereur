import React from 'react';
import type { VNScene } from '@game/types/vnTypes';
import type { VNGameEffect } from '@game/types/vnTypes';
import type { PlayerCharacter } from '@game/types';
import { MilitaryRank } from '@game/types';
import { CHARACTERS } from '@game/types/vnTypes';
import { VNRenderer } from '@game/components/vn/VNRenderer';
import { MoodBackground } from '@game/components/vn/MoodBackground';
import { CharacterPortrait } from '@game/components/vn/CharacterPortrait';
import type { VNGameContext } from '@game/core/vnSceneInterpreter';

/** Build a default test player so stat checks have something reasonable to roll against */
function makeTestPlayer(): PlayerCharacter {
  return {
    name: 'Test Soldier',
    rank: MilitaryRank.Private,
    valor: 40,
    musketry: 35,
    elan: 35,
    strength: 40,
    endurance: 40,
    constitution: 45,
    charisma: 40,
    intelligence: 40,
    awareness: 35,
    health: 100,
    morale: 100,
    stamina: 100,
    grace: 0,
    soldierRep: 50,
    officerRep: 50,
    napoleonRep: 0,
    frontRank: false,
    attributes: {},
    virtue: 0,
    sous: 10,
    equipment: {
      musket: 'Charleville 1777',
      bayonet: 'Socket bayonet',
      musketCondition: 70,
      uniformCondition: 50,
    },
  };
}

interface SceneViewerProps {
  scene: VNScene;
}

interface PendingCheck {
  stat: string;
  difficulty: number;
  resolve: (outcome: 'pass' | 'fail') => void;
}

interface EffectToast {
  id: number;
  text: string;
}

/** Convert a VNGameEffect into a list of human-readable lines */
function describeEffect(effect: VNGameEffect): string[] {
  const lines: string[] = [];
  if (effect.statChanges) {
    for (const [stat, delta] of Object.entries(effect.statChanges)) {
      if (typeof delta === 'number' && delta !== 0) {
        lines.push(`${stat} ${delta > 0 ? '+' : ''}${delta}`);
      }
    }
  }
  if (effect.moraleChange) lines.push(`morale ${effect.moraleChange > 0 ? '+' : ''}${effect.moraleChange}`);
  if (effect.staminaChange) lines.push(`stamina ${effect.staminaChange > 0 ? '+' : ''}${effect.staminaChange}`);
  if (effect.healthChange) lines.push(`health ${effect.healthChange > 0 ? '+' : ''}${effect.healthChange}`);
  if (effect.sousChange) lines.push(`sous ${effect.sousChange > 0 ? '+' : ''}${effect.sousChange}`);
  if (effect.virtueChange) lines.push(`virtue ${effect.virtueChange > 0 ? '+' : ''}${effect.virtueChange}`);
  if (effect.npcRelationshipChanges) {
    for (const c of effect.npcRelationshipChanges) {
      lines.push(`${c.npcId} ${c.delta > 0 ? '+' : ''}${c.delta}`);
    }
  }
  if (effect.flagChanges) {
    for (const [flag, val] of Object.entries(effect.flagChanges)) {
      lines.push(`flag: ${flag} = ${val}`);
    }
  }
  return lines;
}

export function SceneViewer({ scene }: SceneViewerProps) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [playKey, setPlayKey] = React.useState(0);
  const [pendingCheck, setPendingCheck] = React.useState<PendingCheck | null>(null);
  const [toasts, setToasts] = React.useState<EffectToast[]>([]);
  const toastIdRef = React.useRef(0);

  // Reset when switching scenes
  React.useEffect(() => {
    setIsPlaying(false);
    setPlayKey((k) => k + 1);
    setPendingCheck(null);
    setToasts([]);
  }, [scene.id]);

  const gameContext: VNGameContext = React.useMemo(() => ({
    player: makeTestPlayer(),
    npcs: [],
    campFlags: {},
  }), [scene.id, playKey]);

  const handlePlay = () => {
    setPlayKey((k) => k + 1);
    setIsPlaying(true);
    setPendingCheck(null);
    setToasts([]);
  };

  const handleEnd = () => {
    setIsPlaying(false);
    setPendingCheck(null);
  };

  const handleRestart = () => {
    setPlayKey((k) => k + 1);
    setPendingCheck(null);
    setToasts([]);
  };

  // Esc to exit fullscreen
  React.useEffect(() => {
    if (!isPlaying) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (pendingCheck) return; // don't exit while a check is pending
        setIsPlaying(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isPlaying, pendingCheck]);

  // Stat check prompt — returns a promise resolved by user click
  const handleStatCheckPrompt = React.useCallback((check: { stat: string; difficulty: number }): Promise<'pass' | 'fail'> => {
    return new Promise<'pass' | 'fail'>((resolve) => {
      setPendingCheck({ stat: check.stat, difficulty: check.difficulty, resolve });
    });
  }, []);

  // Effect applied — show a toast
  const handleEffectApplied = React.useCallback((effect: VNGameEffect) => {
    const lines = describeEffect(effect);
    if (lines.length === 0) return;
    const id = ++toastIdRef.current;
    const text = lines.join(' \u00B7 ');
    setToasts((prev) => [...prev, { id, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const resolveCheck = (outcome: 'pass' | 'fail') => {
    if (!pendingCheck) return;
    pendingCheck.resolve(outcome);
    setPendingCheck(null);
  };

  // Get start node info for thumbnail preview
  const startNode = scene.nodes[scene.startNode];
  const startPositions = startNode?.positions ?? {};
  const charsOnStage = scene.cast.filter((c) => c !== 'narrator' && c !== 'player');
  const wordCount = Object.values(scene.nodes).reduce((sum, n) => sum + (n.text?.split(/\s+/).filter(Boolean).length ?? 0), 0);
  const readMin = Math.max(1, Math.round(wordCount / 200));

  if (isPlaying) {
    return (
      <div className="vns-fullscreen-overlay">
        <div className="vns-viewer-controls">
          <button className="vns-viewer-control-btn" onClick={handleEnd} title="Exit viewer (Esc)">
            <span>&larr;</span>
            <span>Back to Studio</span>
          </button>
          <button className="vns-viewer-control-btn" onClick={handleRestart} title="Restart this scene from the beginning">
            <span>&#x21BB;</span>
            <span>Restart</span>
          </button>
        </div>
        <VNRenderer
          key={playKey}
          scene={scene}
          gameContext={gameContext}
          onEnd={handleEnd}
          onReplay={handlePlay}
          onStatCheckPrompt={handleStatCheckPrompt}
          viewerOverrideLocks
          onEffectApplied={handleEffectApplied}
        />

        {/* Stat check prompt modal */}
        {pendingCheck && (
          <div className="vns-check-modal-backdrop">
            <div className="vns-check-modal">
              <div className="vns-check-modal-label">Stat Check</div>
              <div className="vns-check-modal-stat">
                <span className="vns-check-stat-name">{pendingCheck.stat.toUpperCase()}</span>
                <span className="vns-check-stat-diff">difficulty {pendingCheck.difficulty}</span>
              </div>
              <div className="vns-check-modal-buttons">
                <button className="vns-check-btn vns-check-pass" onClick={() => resolveCheck('pass')}>
                  <span className="vns-check-icon">{'\u2713'}</span> Pass
                </button>
                <button className="vns-check-btn vns-check-fail" onClick={() => resolveCheck('fail')}>
                  <span className="vns-check-icon">{'\u2717'}</span> Fail
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Effect toasts */}
        {toasts.length > 0 && (
          <div className="vns-toasts">
            {toasts.map((t) => (
              <div key={t.id} className="vns-toast">{t.text}</div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="vns-thumbnail">
      <div className="vns-thumbnail-stage">
        <MoodBackground mood={scene.mood} />
        <div className="vns-thumbnail-portraits">
          {charsOnStage.map((cid) => {
            const ch = CHARACTERS[cid];
            const pos = startPositions[cid] ?? 'center';
            if (!ch || pos === 'off') return null;
            return (
              <div key={cid} className={`vns-thumbnail-portrait pos-${pos}`}>
                <CharacterPortrait
                  character={ch}
                  expression={ch.defaultExpression}
                  position={pos}
                  speaking={false}
                />
              </div>
            );
          })}
        </div>
        <div className="vns-thumbnail-overlay">
          <h2 className="vns-thumbnail-title">{scene.title}</h2>
          <p className="vns-thumbnail-desc">{scene.description}</p>
          <div className="vns-thumbnail-meta">
            <span>{Object.keys(scene.nodes).length} nodes</span>
            <span>&middot;</span>
            <span>{wordCount} words</span>
            <span>&middot;</span>
            <span>~{readMin} min</span>
          </div>
          <button className="vns-play-btn" onClick={handlePlay}>
            <span className="vns-play-icon">{'\u25B6'}</span>
            <span>Play Scene</span>
          </button>
        </div>
      </div>
    </div>
  );
}
