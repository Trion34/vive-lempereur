import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { CharPosition, SceneMood, VNScene } from '../../types/vnTypes';
import { CHARACTERS, EXPRESSION_COLORS } from '../../types/vnTypes';
import { CharacterPortrait } from './CharacterPortrait';
import { MoodBackground } from './MoodBackground';
import { useTypewriter, parseRichText, SPEED_VALUES, MOOD_CSS_BG, sceneWordCount, readTimeEstimate } from './vnHelpers';
import type { TextSpeed } from './vnHelpers';
import {
  type VNGameContext,
  type VNSceneResult,
  type VNRollDisplay,
  createEmptyResult,
  accumulateEffect,
  recomputeEffects,
  buildEffectiveContext,
  evaluateChoiceLock,
  evaluateConditionBranches,
  executeStatCheck,
} from '../../core/vnSceneInterpreter';

interface VNRendererProps {
  scene: VNScene;
  onEnd: () => void;
  onReplay?: () => void;
  /** When provided, enables game-aware mode (stat checks, locks, effects) */
  gameContext?: VNGameContext;
  /** Called with accumulated effects when scene ends (before onEnd) */
  onSceneResult?: (result: VNSceneResult) => void;
}

export function VNRenderer({ scene, onEnd, onReplay, gameContext, onSceneResult }: VNRendererProps) {
  const [currentNodeId, setCurrentNodeId] = useState(scene.startNode);
  const [positions, setPositions] = useState<Record<string, CharPosition>>({});
  const [mood, setMood] = useState<SceneMood>(scene.mood);
  const [history, setHistory] = useState<string[]>([]);
  const [choicesMade, setChoicesMade] = useState<{ label: string; nodeId: string }[]>([]);
  const [effectClass, setEffectClass] = useState('');
  const [showLog, setShowLog] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [textSpeed, setTextSpeed] = useState<TextSpeed>('normal');
  const [autoPlay, setAutoPlay] = useState(false);
  const [showKbHint, setShowKbHint] = useState(true);
  const [showTitle, setShowTitle] = useState(true);
  const logEndRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [nodeTransition, setNodeTransition] = useState(false);
  const typeSpeed = SPEED_VALUES[textSpeed];

  // Game-aware state (only active when gameContext is provided)
  const accumulatedRef = useRef<VNSceneResult>(createEmptyResult());
  const rollRecordRef = useRef<Map<string, { passed: boolean; roll: number; target: number; stat: string }>>(new Map());
  const [activeRollDisplay, setActiveRollDisplay] = useState<VNRollDisplay | null>(null);

  const node = scene.nodes[currentNodeId];
  const speaker = node ? CHARACTERS[node.speaker] : null;
  const expression = node?.expression ?? speaker?.defaultExpression ?? 'neutral';
  const { displayed, done, skip } = useTypewriter(node?.text ?? '', typeSpeed);

  // Reset when scene changes
  useEffect(() => {
    setCurrentNodeId(scene.startNode);
    const startNode = scene.nodes[scene.startNode];
    setPositions(startNode?.positions ? { ...startNode.positions } as Record<string, CharPosition> : {});
    setMood(startNode?.mood ?? scene.mood);
    setHistory([]);
    setChoicesMade([]);
    setShowTitle(true);
  }, [scene.id, scene.mood, scene.nodes, scene.startNode]);

  // Auto-dismiss scene title card
  useEffect(() => {
    if (!showTitle) return;
    const timer = setTimeout(() => setShowTitle(false), 2500);
    return () => clearTimeout(timer);
  }, [showTitle]);

  // Apply position and mood changes on node advance
  useEffect(() => {
    if (node?.positions) {
      const newPos = node.positions as Record<string, CharPosition>;
      setPositions((prev) => ({ ...prev, ...newPos }));
    }
    if (node?.mood) {
      setMood(node.mood);
    }
    // Node transition animation
    setNodeTransition(true);
    const fadeTimer = setTimeout(() => setNodeTransition(false), 80);
    if (node?.effect) {
      setEffectClass(`vn-effect-${node.effect}`);
      const timer = setTimeout(() => setEffectClass(''), 600);
      return () => { clearTimeout(timer); clearTimeout(fadeTimer); };
    }
    return () => clearTimeout(fadeTimer);
  }, [currentNodeId, node?.effect, node?.mood, node?.positions]);

  // Game-aware: accumulate effects on node entry + evaluate condition branches
  useEffect(() => {
    if (!gameContext || !node) return;

    // Accumulate effect for this node
    if (node.gameEffect) {
      accumulatedRef.current = accumulateEffect(accumulatedRef.current, node.gameEffect);
    }

    // Evaluate condition branches — auto-redirect if a condition matches
    if (node.gameConditionNext && node.gameConditionNext.length > 0) {
      const effective = buildEffectiveContext(gameContext, accumulatedRef.current);
      const branchTarget = evaluateConditionBranches(node.gameConditionNext, effective);
      if (branchTarget) {
        // Auto-redirect — push current node to history and jump
        setHistory((prev) => [...prev, currentNodeId]);
        setCurrentNodeId(branchTarget);
        return;
      }
      // No match — fall through to node.next as normal
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNodeId]);

  // Auto-scroll log to bottom
  useEffect(() => {
    if (showLog) {
      setTimeout(() => logEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    }
  }, [showLog, history.length]);

  const advance = useCallback(() => {
    if (!done) { skip(); return; }
    if (!node) return;

    if (node.choices && node.choices.length > 0) return; // Handled by choice buttons

    // At the end — don't auto-exit, let the end card handle it
    if (node.next === null || node.next === undefined) return;

    setHistory((prev) => [...prev, currentNodeId]);
    setCurrentNodeId(node.next);
  }, [done, skip, node, currentNodeId]);

  // Auto-play: advance after typewriter finishes (stop at choices)
  const [autoPlayDelay, setAutoPlayDelay] = useState(0);
  useEffect(() => {
    if (!autoPlay || !done) {
      setAutoPlayDelay(0);
      return;
    }
    if (node?.choices && node.choices.length > 0) {
      setAutoPlay(false);
      setAutoPlayDelay(0);
      return;
    }
    const delay = Math.max(800, node?.text.length ? node.text.length * 15 : 1500);
    setAutoPlayDelay(delay);
    const timer = setTimeout(advance, delay);
    return () => { clearTimeout(timer); setAutoPlayDelay(0); };
  }, [autoPlay, done, node, advance]);

  const chooseOption = useCallback((nextId: string, choiceIndex?: number) => {
    // Track the choice for the end card — store source node so log can match it
    if (node?.choices) {
      const chosen = node.choices.find(c => c.nextId === nextId) ?? node.choices[choiceIndex ?? -1];
      if (chosen) {
        setChoicesMade((prev) => [...prev, { label: chosen.label, nodeId: currentNodeId }]);
      }
    }

    // Game-aware: handle stat check if the choice has one
    if (gameContext && node?.choices) {
      const choice = choiceIndex !== undefined ? node.choices[choiceIndex] : node.choices.find(c => c.nextId === nextId);
      if (choice?.gameCheck) {
        const rollKey = `${history.join('>')}|${currentNodeId}|${choiceIndex ?? 0}`;
        let rollResult = rollRecordRef.current.get(rollKey);
        if (!rollResult) {
          const effective = buildEffectiveContext(gameContext, accumulatedRef.current);
          const checkResult = executeStatCheck(choice.gameCheck, effective);
          rollResult = checkResult.rollDisplay;
          rollRecordRef.current.set(rollKey, rollResult);
        }
        // Show roll display, then navigate after delay
        setActiveRollDisplay(rollResult);
        const targetNode = rollResult.passed ? choice.gameCheck.passNode : choice.gameCheck.failNode;
        setHistory((prev) => [...prev, currentNodeId]);
        setTimeout(() => {
          setActiveRollDisplay(null);
          setCurrentNodeId(targetNode);
        }, 1500);
        return;
      }
    }

    setHistory((prev) => [...prev, currentNodeId]);
    setCurrentNodeId(nextId);
  }, [currentNodeId, node, gameContext, history]);

  const rewind = useCallback(() => {
    if (history.length === 0) return;
    const prevNodeId = history[history.length - 1];
    const newHistory = history.slice(0, -1);
    setHistory(newHistory);
    setCurrentNodeId(prevNodeId);

    // Game-aware: recompute accumulated effects from trimmed history + new current node
    if (gameContext) {
      accumulatedRef.current = recomputeEffects([...newHistory, prevNodeId], scene.nodes);
      // Prune roll records for nodes no longer in visited path
      const visitedPath = newHistory.join('>') + '>';
      for (const key of rollRecordRef.current.keys()) {
        if (!key.startsWith(visitedPath) && !key.startsWith(newHistory.join('>'))) {
          rollRecordRef.current.delete(key);
        }
      }
    }
  }, [history, gameContext, scene.nodes]);

  // Keyboard navigation: Space/Enter to advance, 1-4 for choices, L for log, Backspace to rewind
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Backspace') {
        e.preventDefault();
        rewind();
        return;
      }
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        advance();
      }
      if (e.key === 'l' || e.key === 'L') {
        setShowLog((prev) => !prev);
      }
      if (e.key === 'a' || e.key === 'A') {
        setAutoPlay((prev) => !prev);
      }
      if (e.key === 'd' || e.key === 'D') {
        setShowDebug((prev) => !prev);
      }
      // Number keys for choices
      if (done && node?.choices && node.choices.length > 0) {
        const idx = parseInt(e.key) - 1;
        if (idx >= 0 && idx < node.choices.length) {
          const choice = node.choices[idx];
          // Check game lock
          if (gameContext && choice.gameLock) {
            const effective = buildEffectiveContext(gameContext, accumulatedRef.current);
            if (evaluateChoiceLock(choice, effective).locked) return;
          }
          chooseOption(choice.nextId, idx);
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [advance, chooseOption, rewind, done, node]);

  // Focus stage on mount for keyboard events
  useEffect(() => {
    stageRef.current?.focus();
  }, []);

  if (!node || !speaker) return null;

  const cssBg = MOOD_CSS_BG[mood];
  const isNarrator = node.speaker === 'narrator';

  return (
    <div ref={stageRef} className={`vn-stage vn-mood-${mood} ${effectClass}${autoPlay ? ' vn-auto-active' : ''}`} style={{ background: cssBg }} onClick={advance} tabIndex={-1}>
      {/* SVG atmospheric background */}
      <MoodBackground mood={mood} />
      {/* Color overlay */}
      <div className="vn-bg-overlay" />
      {/* Cinematic vignette */}
      <div className="vn-vignette" />

      {/* Ambient particles — mood-reactive floating elements */}
      <div className={`vn-ambient vn-ambient-${mood}`}>
        {mood === 'night_camp' && Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="vn-firefly" style={{
            left: `${15 + i * 14}%`,
            animationDelay: `${i * 1.2}s`,
            animationDuration: `${5 + i * 1.5}s`,
          }} />
        ))}
        {mood === 'ridge' && Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="vn-snowflake" style={{
            left: `${5 + i * 8}%`,
            animationDelay: `${i * 0.8}s`,
            animationDuration: `${4 + (i % 3) * 2}s`,
          }} />
        ))}
        {mood === 'battlefield' && Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="vn-ash" style={{
            left: `${10 + i * 18}%`,
            animationDelay: `${i * 1.5}s`,
            animationDuration: `${6 + i * 1.2}s`,
          }} />
        ))}
        {mood === 'gorge' && Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="vn-rock-mote" style={{
            left: `${i < 4 ? 5 + i * 5 : 75 + (i - 4) * 5}%`,
            animationDelay: `${i * 0.9}s`,
            animationDuration: `${3 + (i % 3) * 1.5}s`,
          }} />
        ))}
        {mood === 'dawn' && Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="vn-dust-mote" style={{
            left: `${20 + i * 18}%`,
            animationDelay: `${i * 2}s`,
            animationDuration: `${7 + i * 1.5}s`,
          }} />
        ))}
        {mood === 'march' && Array.from({ length: 15 }, (_, i) => (
          <div key={i} className="vn-rain-drop" style={{
            left: `${3 + i * 6.5}%`,
            animationDelay: `${i * 0.3}s`,
            animationDuration: `${1.2 + (i % 4) * 0.3}s`,
          }} />
        ))}
        {mood === 'interior' && Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="vn-candle-mote" style={{
            left: `${25 + i * 12}%`,
            animationDelay: `${i * 1.8}s`,
            animationDuration: `${6 + i * 1.2}s`,
          }} />
        ))}
      </div>

      {/* Scene title card — brief cinematic overlay */}
      {showTitle && (
        <div className="vn-title-card">
          <div className="vn-title-card-mood">{mood.replace('_', ' ')}</div>
          <div className="vn-title-card-name">{scene.title}</div>
          <div className="vn-title-card-desc">{scene.description}</div>
        </div>
      )}

      {/* Keyboard shortcut overlay — fades after 4s or on first click */}
      {showKbHint && (
        <div className="vn-kb-overlay" onAnimationEnd={() => setShowKbHint(false)}>
          <span className="vn-kb-overlay-title">Controls</span>
          <div className="vn-kb-overlay-row">
            <span className="vn-kb-overlay-key">Space</span> Advance
            <span className="vn-kb-overlay-key">Bksp</span> Rewind
          </div>
          <div className="vn-kb-overlay-row">
            <span className="vn-kb-overlay-key">L</span> Log
            <span className="vn-kb-overlay-key">A</span> Auto
            <span className="vn-kb-overlay-key">D</span> Debug
            <span className="vn-kb-overlay-key">1-4</span> Choose
          </div>
        </div>
      )}

      {/* Character portraits */}
      <div className="vn-portraits">
        {scene.cast.filter((id) => id !== 'player' && id !== 'narrator').map((charId) => {
          const char = CHARACTERS[charId];
          if (!char) return null;
          const pos = positions[charId] ?? 'off';
          const isSpeaking = node.speaker === charId;
          const expr = isSpeaking ? expression : char.defaultExpression;
          return (
            <CharacterPortrait
              key={charId}
              character={char}
              expression={expr}
              speaking={isSpeaking}
              position={pos}
            />
          );
        })}
      </div>

      {/* Dialogue box */}
      <div className="vn-dialogue-area">
        <div className={[
            'vn-dialogue-box',
            isNarrator && 'vn-narrator-box',
            nodeTransition && 'vn-node-fade',
            node.mode && `vn-mode-${node.mode}`,
          ].filter(Boolean).join(' ')}
          style={{ '--speaker-color': isNarrator ? 'rgba(255,200,100,0.15)' : speaker.color } as React.CSSProperties}>
          {/* Name plate with accent bar */}
          {!isNarrator && (
            <div className="vn-nameplate" style={{ '--speaker-color': speaker.color } as React.CSSProperties}>
              <span className="vn-nameplate-text">{speaker.name}</span>
              {speaker.rank && <span className="vn-nameplate-rank">{speaker.rank}</span>}
              {node.mode && node.mode !== 'speech' && (
                <span className={`vn-mode-badge vn-mode-badge-${node.mode}`}>
                  {node.mode === 'thought' ? 'thinking' : node.mode === 'shout' ? 'shouting' : 'whispering'}
                </span>
              )}
            </div>
          )}

          {/* Text — with rich text formatting */}
          <div className="vn-text">
            {parseRichText(displayed)}
            {!done && <span className="vn-cursor">|</span>}
          </div>

          {/* Continue triangle indicator */}
          {done && (!node.choices || node.choices.length === 0) && node.next !== null && (
            <div className="vn-continue-triangle" />
          )}

          {/* Choice buttons */}
          {done && node.choices && node.choices.length > 0 && (
            <div className="vn-choices" onClick={(e) => e.stopPropagation()}>
              {node.choices.map((choice, idx) => {
                const lockState = gameContext && choice.gameLock
                  ? evaluateChoiceLock(choice, buildEffectiveContext(gameContext, accumulatedRef.current))
                  : { locked: false };
                return (
                  <button
                    key={idx}
                    className={`vn-choice-btn${lockState.locked ? ' vn-choice-locked' : ''}`}
                    onClick={() => {
                      if (lockState.locked) return;
                      chooseOption(choice.nextId, idx);
                    }}
                    disabled={lockState.locked}
                  >
                    <span className="vn-choice-key">{idx + 1}</span>
                    <div className="vn-choice-content">
                      <span className="vn-choice-label">{choice.label}</span>
                      {lockState.locked && lockState.message
                        ? <span className="vn-choice-desc">{lockState.message}</span>
                        : choice.description && <span className="vn-choice-desc">{choice.description}</span>
                      }
                      {choice.statCheck && <span className="vn-choice-check">[{choice.statCheck}]</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Auto-play progress bar */}
        {autoPlayDelay > 0 && (
          <div className="vn-auto-progress" style={{ maxWidth: 800, width: '100%' }}>
            <div className="vn-auto-progress-fill"
              style={{ animationDuration: `${autoPlayDelay}ms` }} />
          </div>
        )}

        {/* Roll display overlay — shown briefly after stat check */}
        {activeRollDisplay && (
          <div className="vn-roll-display" onClick={(e) => e.stopPropagation()}>
            <div className="vn-roll-stat">{activeRollDisplay.stat.toUpperCase()}</div>
            {activeRollDisplay.autoSuccess ? (
              <div className="vn-roll-verdict vn-roll-passed">AUTO</div>
            ) : (
              <>
                <div className="vn-roll-numbers">
                  <span className="vn-roll-value">{activeRollDisplay.roll}</span>
                  <span className="vn-roll-vs">vs</span>
                  <span className="vn-roll-target">{activeRollDisplay.target}</span>
                </div>
                <div className={`vn-roll-verdict ${activeRollDisplay.passed ? 'vn-roll-passed' : 'vn-roll-failed'}`}>
                  {activeRollDisplay.passed ? 'PASSED' : 'FAILED'}
                </div>
              </>
            )}
          </div>
        )}

        {/* End card — scene completion overlay */}
        {done && node.next === null && !node.choices && (
          <div className="vn-end-card" onClick={(e) => e.stopPropagation()}>
            <div className="vn-end-card-flourish">&#x2726; &#x2726; &#x2726;</div>
            <div className="vn-end-card-label">FIN</div>
            <div className="vn-end-card-title">{scene.title}</div>
            <div className="vn-end-card-desc">{scene.description}</div>
            <div className="vn-end-card-stats">
              <span>{history.length + 1} / {Object.keys(scene.nodes).length} nodes</span>
              <span>&middot;</span>
              <span>{scene.cast.filter((c) => c !== 'player' && c !== 'narrator').map((c) => CHARACTERS[c]?.name).join(', ')}</span>
              <span>&middot;</span>
              <span>{readTimeEstimate(sceneWordCount(scene))}</span>
            </div>
            {/* Game-aware: show accumulated changes */}
            {gameContext && (() => {
              const acc = accumulatedRef.current;
              const changes: string[] = [];
              if (acc.moraleChange) changes.push(`Morale ${acc.moraleChange > 0 ? '+' : ''}${acc.moraleChange}`);
              if (acc.staminaChange) changes.push(`Stamina ${acc.staminaChange > 0 ? '+' : ''}${acc.staminaChange}`);
              if (acc.healthChange) changes.push(`Health ${acc.healthChange > 0 ? '+' : ''}${acc.healthChange}`);
              if (acc.sousChange) changes.push(`Sous ${acc.sousChange > 0 ? '+' : ''}${acc.sousChange}`);
              if (acc.virtueChange) changes.push(`Virtue ${acc.virtueChange > 0 ? '+' : ''}${acc.virtueChange}`);
              for (const [stat, delta] of Object.entries(acc.statChanges)) {
                if (delta) changes.push(`${stat.charAt(0).toUpperCase() + stat.slice(1)} ${delta > 0 ? '+' : ''}${delta}`);
              }
              for (const nc of acc.npcChanges) {
                if (nc.relationship) {
                  const npcName = CHARACTERS[nc.npcId]?.name ?? nc.npcId;
                  changes.push(`${npcName} ${nc.relationship > 0 ? '+' : ''}${nc.relationship}`);
                }
              }
              return changes.length > 0 ? (
                <div className="vn-end-changes">
                  {changes.map((c, i) => <span key={i} className="vn-end-change-item">{c}</span>)}
                </div>
              ) : null;
            })()}
            {choicesMade.length > 0 && (
              <div className="vn-end-card-choices">
                <div className="vn-end-card-choices-label">Your choices:</div>
                {choicesMade.map((c, i) => (
                  <div key={i} className="vn-end-card-choice">{c.label}</div>
                ))}
              </div>
            )}
            <div className="vn-end-card-actions">
              <button className="vn-end-replay" onClick={() => onReplay?.()}>Replay</button>
              <button className="vn-end-exit" onClick={() => {
                if (gameContext && onSceneResult) {
                  onSceneResult(accumulatedRef.current);
                }
                onEnd?.();
              }}>Exit</button>
            </div>
          </div>
        )}

        {/* Controls bar — integrated below dialogue */}
        <div className="vn-controls-bar" onClick={(e) => e.stopPropagation()}>
          <button className="vn-rewind-btn" onClick={rewind}
            disabled={history.length === 0} title="Go back (Backspace)">
            &larr;
          </button>
          <div className="vn-controls-divider" />
          <div className="vn-speed-controls">
            {([
              { key: 'slow' as const, icon: '\u25B7', label: 'Slow' },
              { key: 'normal' as const, icon: '\u25B6', label: 'Normal' },
              { key: 'fast' as const, icon: '\u25B6\u25B6', label: 'Fast' },
              { key: 'instant' as const, icon: '\u00BB', label: 'Instant' },
            ]).map(({ key, icon, label }) => (
              <button key={key} className={`vn-speed-btn${textSpeed === key ? ' active' : ''}`}
                onClick={() => setTextSpeed(key)}
                title={`${label} text speed`}>
                {icon}
              </button>
            ))}
          </div>
          <div className="vn-controls-divider" />
          <button className={`vn-auto-btn${autoPlay ? ' active' : ''}`}
            onClick={() => setAutoPlay(!autoPlay)} title="Auto-play (A)">
            {autoPlay ? 'Stop' : 'Auto'}
          </button>
          <button className={`vn-log-btn${showLog ? ' active' : ''}`}
            onClick={() => setShowLog(!showLog)} title="Dialogue log (L)">
            Log
          </button>
          <div className="vn-controls-divider" />
          <span className="vn-progress-counter" title={`Node ${history.length + 1} of ${Object.keys(scene.nodes).length}`}>
            {history.length + 1} / {Object.keys(scene.nodes).length}
          </span>
          <div className="vn-progress-track">
            <div className="vn-progress-fill" style={{ width: `${((history.length + 1) / Object.keys(scene.nodes).length) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Dialogue history log */}
      {showLog && (
        <div className="vn-log-overlay" onClick={(e) => e.stopPropagation()}>
          <div className="vn-log-header">
            <span>{scene.title} — Log</span>
            <button className="vn-log-close" onClick={() => setShowLog(false)}>&times;</button>
          </div>
          <div className="vn-log-entries">
            {history.map((nodeId, idx) => {
              const hNode = scene.nodes[nodeId];
              if (!hNode) return null;
              const hSpeaker = CHARACTERS[hNode.speaker];
              const isNar = hNode.speaker === 'narrator';
              const hMode = hNode.mode && hNode.mode !== 'speech' ? hNode.mode : null;
              const choiceMade = choicesMade.find((c) => c.nodeId === nodeId);
              return (
                <div key={nodeId} className={[
                    'vn-log-entry',
                    isNar && 'vn-log-narrator',
                    hMode && `vn-log-${hMode}`,
                  ].filter(Boolean).join(' ')}
                  style={!isNar && hSpeaker ? { borderLeftColor: hSpeaker.color } : undefined}>
                  <div className="vn-log-entry-header">
                    {!isNar && <span className="vn-log-name" style={{ color: hSpeaker?.color }}>{hSpeaker?.name}</span>}
                    {hMode && <span className={`vn-log-mode-badge vn-log-mode-${hMode}`}>{hMode}</span>}
                    <span className="vn-log-num">{idx + 1}</span>
                  </div>
                  <span className="vn-log-text">{parseRichText(hNode.text)}</span>
                  {choiceMade && <div className="vn-log-choice-indicator">chose: {choiceMade.label}</div>}
                </div>
              );
            })}
            {/* Current node — highlighted */}
            {node && (() => {
              const cSpeaker = CHARACTERS[node.speaker];
              const cIsNar = node.speaker === 'narrator';
              const cMode = node.mode && node.mode !== 'speech' ? node.mode : null;
              return (
                <div className={[
                    'vn-log-entry', 'vn-log-current',
                    cIsNar && 'vn-log-narrator',
                    cMode && `vn-log-${cMode}`,
                  ].filter(Boolean).join(' ')}
                  style={!cIsNar && cSpeaker ? { borderLeftColor: cSpeaker.color } : undefined}>
                  <div className="vn-log-entry-header">
                    {!cIsNar && <span className="vn-log-name" style={{ color: cSpeaker?.color }}>{cSpeaker?.name}</span>}
                    {cMode && <span className={`vn-log-mode-badge vn-log-mode-${cMode}`}>{cMode}</span>}
                    <span className="vn-log-num">{history.length + 1}</span>
                  </div>
                  <span className="vn-log-text">{parseRichText(node.text)}</span>
                </div>
              );
            })()}
            <div ref={logEndRef} />
          </div>
        </div>
      )}

      {/* Debug node inspector — toggle with D key */}
      {showDebug && (
        <div className="vn-debug-overlay" onClick={(e) => e.stopPropagation()}>
          <div className="vn-debug-header">
            <span>Node Inspector</span>
            <button className="vn-debug-close" onClick={() => setShowDebug(false)}>&times;</button>
          </div>
          <div className="vn-debug-row">
            <span className="vn-debug-label">Node</span>
            <span className="vn-debug-value">{currentNodeId}</span>
          </div>
          <div className="vn-debug-row">
            <span className="vn-debug-label">Speaker</span>
            <span className="vn-debug-value" style={{ color: speaker.color }}>{speaker.name || 'narrator'}</span>
          </div>
          <div className="vn-debug-row">
            <span className="vn-debug-label">Expression</span>
            <span className="vn-debug-value">{expression}</span>
          </div>
          <div className="vn-debug-row">
            <span className="vn-debug-label">Mood</span>
            <span className="vn-debug-value">{mood}</span>
          </div>
          <div className="vn-debug-row">
            <span className="vn-debug-label">Next</span>
            <span className="vn-debug-value">{node.next === null ? '(END)' : node.next ?? '(choices)'}</span>
          </div>
          {node.choices && (
            <div className="vn-debug-row">
              <span className="vn-debug-label">Choices</span>
              <span className="vn-debug-value">{node.choices.map(c => c.nextId).join(', ')}</span>
            </div>
          )}
          {node.mode && (
            <div className="vn-debug-row">
              <span className="vn-debug-label">Mode</span>
              <span className="vn-debug-value">{node.mode}</span>
            </div>
          )}
          {node.effect && (
            <div className="vn-debug-row">
              <span className="vn-debug-label">Effect</span>
              <span className="vn-debug-value">{node.effect}</span>
            </div>
          )}
          <div className="vn-debug-row">
            <span className="vn-debug-label">History</span>
            <span className="vn-debug-value">{history.length} nodes</span>
          </div>
        </div>
      )}
    </div>
  );
}
