import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type {
  Expression, CharPosition, SceneMood, DeliveryMode,
  DialogueNode, VNChoice, VNScene,
  VNGameEffect, VNConditionBranch, VNGameCheck, VNGameLock,
} from '../types/vnTypes';
import {
  CHARACTERS, EXPRESSION_COLORS, ALL_EXPRESSIONS, ALL_MOODS, MOOD_ACCENT,
} from '../types/vnTypes';

const NUMERIC_STAT_OPTIONS = ['valor', 'musketry', 'elan', 'strength', 'endurance', 'constitution', 'charisma', 'intelligence', 'awareness', 'soldierRep', 'officerRep', 'napoleonRep'] as const;
const ATTRIBUTE_OPTIONS = ['literate', 'medicine', 'gambling'] as const;
import { CharacterPortrait } from '@game/components/vn/CharacterPortrait';
import { MoodBackground } from '@game/components/vn/MoodBackground';
import { VNRenderer } from '@game/components/vn/VNRenderer';
import { parseRichText } from '@game/components/vn/vnHelpers';
import { MOOD_CSS_BG, sceneWordCount, readTimeEstimate } from '@game/components/vn/vnHelpers';
import { useVnSceneStore, validateScene } from '../stores/vnSceneStore';
import { useLabStore } from '../stores/labStore';
import { getImportableGameScenes } from '../utils/gameSceneImporter';

/* ================================================================== */
/*  (SCENES loaded from vnSceneStore — no inline constant)             */
/* ================================================================== */

function SceneBrowser({ scenes, selectedId, onSelect }: {
  scenes: VNScene[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [moodFilter, setMoodFilter] = useState<SceneMood | null>(null);
  const [charFilter, setCharFilter] = useState<string | null>(null);

  const totalNodes = scenes.reduce((s, sc) => s + Object.keys(sc.nodes).length, 0);
  const totalWords = scenes.reduce((s, sc) => s + sceneWordCount(sc), 0);
  const totalBranches = scenes.reduce((s, sc) => s + Object.values(sc.nodes).filter((n) => n.choices).length, 0);
  const uniqueChars = [...new Set(scenes.flatMap((sc) => sc.cast.filter((c) => c !== 'player' && c !== 'narrator')))];
  const moodCounts = scenes.reduce<Record<string, number>>((acc, sc) => {
    acc[sc.mood] = (acc[sc.mood] ?? 0) + 1;
    return acc;
  }, {});

  const filteredScenes = scenes.filter((sc) => {
    if (moodFilter && sc.mood !== moodFilter) return false;
    if (charFilter && !sc.cast.includes(charFilter)) return false;
    return true;
  });

  return (
    <div className="vn-browser">
      {/* Aggregate statistics summary */}
      <div className="vn-browser-stats">
        <div className="vn-browser-stat"><span className="vn-browser-stat-val">{scenes.length}</span><span className="vn-browser-stat-label">scenes</span></div>
        <div className="vn-browser-stat"><span className="vn-browser-stat-val">{totalNodes}</span><span className="vn-browser-stat-label">nodes</span></div>
        <div className="vn-browser-stat"><span className="vn-browser-stat-val">{totalWords.toLocaleString()}</span><span className="vn-browser-stat-label">words</span></div>
        <div className="vn-browser-stat"><span className="vn-browser-stat-val">{totalBranches}</span><span className="vn-browser-stat-label">branches</span></div>
        <div className="vn-browser-stat"><span className="vn-browser-stat-val">{uniqueChars.length}</span><span className="vn-browser-stat-label">characters</span></div>
        <div className="vn-browser-stat"><span className="vn-browser-stat-val">{readTimeEstimate(totalWords)}</span><span className="vn-browser-stat-label">total</span></div>
      </div>
      {/* Mood filter tags — click to filter */}
      <div className="vn-browser-moods">
        <span className="vn-browser-filter-label">Mood</span>
        {moodFilter && (
          <button className="vn-browser-mood-tag vn-browser-mood-clear" onClick={() => setMoodFilter(null)}>
            all
          </button>
        )}
        {Object.entries(moodCounts).map(([mood, count]) => (
          <button
            key={mood}
            className={`vn-browser-mood-tag${moodFilter === mood ? ' active' : ''}`}
            style={{ borderColor: MOOD_ACCENT[mood as SceneMood], color: MOOD_ACCENT[mood as SceneMood] }}
            onClick={() => setMoodFilter(moodFilter === mood ? null : mood as SceneMood)}
          >
            {mood.replace(/_/g, ' ')} ({count})
          </button>
        ))}
      </div>
      {/* Character filter — click to filter scenes by cast */}
      <div className="vn-browser-moods">
        <span className="vn-browser-filter-label">Cast</span>
        {charFilter && (
          <button className="vn-browser-mood-tag vn-browser-mood-clear" onClick={() => setCharFilter(null)}>
            all
          </button>
        )}
        {uniqueChars.map((charId) => {
          const ch = CHARACTERS[charId];
          if (!ch) return null;
          return (
            <button
              key={charId}
              className={`vn-browser-mood-tag${charFilter === charId ? ' active' : ''}`}
              style={{ borderColor: ch.color, color: ch.color }}
              onClick={() => setCharFilter(charFilter === charId ? null : charId)}
            >
              {ch.name}
            </button>
          );
        })}
      </div>

      {/* Active filter summary */}
      {(moodFilter || charFilter) && (
        <div className="vn-browser-active-filter">
          Showing {filteredScenes.length} of {scenes.length} scenes
          {moodFilter && <span className="vn-browser-active-tag" style={{ color: MOOD_ACCENT[moodFilter] }}>{moodFilter.replace(/_/g, ' ')}</span>}
          {charFilter && <span className="vn-browser-active-tag" style={{ color: CHARACTERS[charFilter]?.color }}>{CHARACTERS[charFilter]?.name}</span>}
          <button className="vn-browser-clear-all" onClick={() => { setMoodFilter(null); setCharFilter(null); }}>Clear all</button>
        </div>
      )}

      {filteredScenes.map((scene) => {
        const words = sceneWordCount(scene);
        const castChars = scene.cast.filter((c) => c !== 'player' && c !== 'narrator').map((id) => CHARACTERS[id]).filter(Boolean);
        const branchCount = Object.values(scene.nodes).filter((n) => n.choices && n.choices.length > 0).length;
        return (
        <button
          key={scene.id}
          className={`vn-scene-card${selectedId === scene.id ? ' active' : ''}`}
          onClick={() => onSelect(scene.id)}
          style={{ borderLeftColor: MOOD_ACCENT[scene.mood], borderLeftWidth: 3 }}
        >
          <div className="vn-scene-card-top">
            <span className="vn-scene-mood" style={{ color: MOOD_ACCENT[scene.mood] }}>{scene.mood.replace(/_/g, ' ')}</span>
            <div className="vn-scene-cast-dots">
              {castChars.map((ch) => (
                <span key={ch.id} className="vn-scene-cast-dot" style={{ background: ch.color }} title={ch.name} />
              ))}
            </div>
          </div>
          <span className="vn-scene-title">{scene.title}</span>
          <span className="vn-scene-desc">{scene.description}</span>
          <span className="vn-scene-opener">{scene.nodes[scene.startNode]?.text.slice(0, 80)}{(scene.nodes[scene.startNode]?.text.length ?? 0) > 80 ? '\u2026' : ''}</span>
          <div className="vn-scene-meta">
            <span>{Object.keys(scene.nodes).length} nodes</span>
            <span>{words} words</span>
            {branchCount > 0 && <span className="vn-scene-meta-branch">{branchCount} branch{branchCount > 1 ? 'es' : ''}</span>}
            <span>{readTimeEstimate(words)}</span>
          </div>
        </button>
        );
      })}
    </div>
  );
}

/* ================================================================== */
/*  DIALOGUE TREE INSPECTOR — Recursive visual tree                    */
/* ================================================================== */

function DialogueTreeView({ scene }: { scene: VNScene }) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const toggleExpand = useCallback((nodeId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId); else next.add(nodeId);
      return next;
    });
  }, []);

  /* Build incoming-edges map so we can detect convergence points */
  const incomingEdges = useMemo(() => {
    const edges: Record<string, string[]> = {};
    for (const node of Object.values(scene.nodes)) {
      if (node.next) (edges[node.next] ??= []).push(node.id);
      if (node.choices) {
        for (const c of node.choices) (edges[c.nextId] ??= []).push(node.id);
      }
    }
    return edges;
  }, [scene]);

  /* Count total nodes for the stats bar */
  const nodeCount = Object.keys(scene.nodes).length;
  const choiceNodes = Object.values(scene.nodes).filter((n) => n.choices).length;
  const endNodes = Object.values(scene.nodes).filter((n) => n.next === null && !n.choices).length;
  const totalWords = Object.values(scene.nodes).reduce((s, n) => s + n.text.split(/\s+/).length, 0);

  /* Recursive renderer — walks from a node following next/choices */
  const rendered = useRef(new Set<string>());
  rendered.current.clear(); // reset on every render

  const renderNode = (nodeId: string, depth: number): React.ReactNode => {
    const node = scene.nodes[nodeId];
    if (!node) return null;

    /* If already rendered, show a back-reference instead of duplicating */
    if (rendered.current.has(nodeId)) {
      return (
        <div className="vn-tree-ref" key={`ref-${nodeId}-${depth}`}>
          <span className="vn-tree-ref-arrow">&crarr;</span>
          <span className="vn-tree-ref-id">{nodeId}</span>
          <span className="vn-tree-ref-label">(continues above)</span>
        </div>
      );
    }
    rendered.current.add(nodeId);

    const speaker = CHARACTERS[node.speaker];
    const isNarrator = node.speaker === 'narrator';
    const hasChoices = !!node.choices;
    const isEnd = node.next === null && !hasChoices;
    const convergent = (incomingEdges[nodeId]?.length ?? 0) > 1;
    const speakerColor = !isNarrator && speaker ? speaker.color : undefined;

    return (
      <div className="vn-tree-group" key={nodeId}>
        {/* The node card */}
        <div
          className={[
            'vn-tree-node',
            hasChoices && 'vn-tree-branch',
            isEnd && 'vn-tree-terminal',
            convergent && 'vn-tree-convergent',
            isNarrator && 'vn-tree-narrator',
          ].filter(Boolean).join(' ')}
          style={speakerColor ? { borderLeftColor: speakerColor } as React.CSSProperties : undefined}
        >
          <div className="vn-tree-node-header">
            <span className="vn-tree-node-id">{node.id}</span>
            <span className="vn-tree-node-speaker" style={{ color: isNarrator ? 'var(--text-dim)' : speaker?.color }}>
              {isNarrator ? 'Narrator' : speaker?.name}
            </span>
            {node.expression && <span className="vn-tree-node-expr">{node.expression}</span>}
            {node.mode && node.mode !== 'speech' && (
              <span className={`vn-tree-node-mode vn-tree-mode-${node.mode}`}>{node.mode}</span>
            )}
            {node.effect && <span className="vn-tree-node-effect">{node.effect}</span>}
            {convergent && <span className="vn-tree-converge-badge">&lArr; merge</span>}
          </div>
          <p className={`vn-tree-node-text${node.text.length > 140 ? ' vn-tree-node-truncatable' : ''}`}
            onClick={node.text.length > 140 ? (e) => { e.stopPropagation(); toggleExpand(nodeId); } : undefined}>
            {expandedNodes.has(nodeId) || node.text.length <= 140
              ? parseRichText(node.text)
              : <>{parseRichText(node.text.slice(0, 140))}<span className="vn-tree-ellipsis">&hellip;</span></>
            }
          </p>

          {/* Choice tags inline */}
          {hasChoices && (
            <div className="vn-tree-node-choices">
              {node.choices!.map((c, ci) => (
                <span key={ci} className="vn-tree-choice-tag">
                  <span className="vn-tree-choice-num">{ci + 1}</span>
                  {c.label}
                  {c.statCheck && <span className="vn-tree-choice-check">[{c.statCheck}]</span>}
                  {c.gameCheck && <span className="vn-tree-choice-check">[check: {c.gameCheck.stat}]</span>}
                  {c.gameLock && <span className="vn-tree-choice-check">[locked]</span>}
                </span>
              ))}
            </div>
          )}

          {isEnd && <span className="vn-tree-end">END</span>}
        </div>

        {/* Connection line to next */}
        {!hasChoices && node.next && <div className="vn-tree-connector" />}

        {/* Fork into branches */}
        {hasChoices && (
          <div className="vn-tree-branches">
            {node.choices!.map((c, ci) => (
              <div key={c.nextId} className="vn-tree-branch-group">
                <div className="vn-tree-branch-header">
                  <span className="vn-tree-branch-num">{ci + 1}</span>
                  <span className="vn-tree-branch-label">{c.label}</span>
                  {c.statCheck && <span className="vn-tree-branch-check">{c.statCheck}</span>}
                </div>
                <div className="vn-tree-branch-content">
                  {renderNode(c.nextId, depth + 1)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Linear continuation */}
        {!hasChoices && node.next && renderNode(node.next, depth)}
      </div>
    );
  };

  return (
    <div className="vn-tree">
      <div className="vn-tree-stats">
        <h3 className="cl-section-title">Dialogue Tree: {scene.title}</h3>
        <div className="vn-tree-stats-tags">
          <span className="vn-tree-stat">{nodeCount} nodes</span>
          <span className="vn-tree-stat">{totalWords} words</span>
          <span className="vn-tree-stat vn-tree-stat-choice">{choiceNodes} choice{choiceNodes !== 1 ? 's' : ''}</span>
          <span className="vn-tree-stat vn-tree-stat-end">{endNodes} ending{endNodes !== 1 ? 's' : ''}</span>
        </div>
      </div>
      <div className="vn-tree-nodes">
        {renderNode(scene.startNode, 0)}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  DATA FORMAT REFERENCE                                              */
/* ================================================================== */

function DataFormatView() {
  return (
    <div className="vn-format">
      <h3 className="cl-section-title">VN Data Format Reference</h3>
      <div className="vn-format-sections">
        <div className="vn-format-card">
          <h4 className="lb-formula-card-title">VNScene</h4>
          <pre className="vn-format-code">{`{
  id: string,
  title: string,
  description: string,
  mood: SceneMood,
  cast: string[],      // character IDs
  startNode: string,
  nodes: Record<string, DialogueNode>
}`}</pre>
        </div>
        <div className="vn-format-card">
          <h4 className="lb-formula-card-title">DialogueNode</h4>
          <pre className="vn-format-code">{`{
  id: string,
  speaker: string,     // character ID
  expression?: Expression,
  text: string,
  mode?: DeliveryMode, // speech|thought|shout|whisper
  positions?: { [charId]: Position },
  mood?: SceneMood,    // override scene mood
  next?: string | null, // null = end
  choices?: VNChoice[],
  sfx?: string,
  effect?: 'shake' | 'flash' | 'fade'
}`}</pre>
        </div>
        <div className="vn-format-card">
          <h4 className="lb-formula-card-title">VNChoice</h4>
          <pre className="vn-format-code">{`{
  label: string,
  description?: string,
  nextId: string,
  condition?: string,  // gate description
  statCheck?: string   // e.g. "Valor 50+"
}`}</pre>
        </div>
        <div className="vn-format-card">
          <h4 className="lb-formula-card-title">Expressions</h4>
          <div className="vn-expr-grid">
            {(Object.keys(EXPRESSION_COLORS) as Expression[]).map((expr) => (
              <span key={expr} className="vn-expr-tag" style={{ color: EXPRESSION_COLORS[expr] }}>{expr}</span>
            ))}
          </div>
        </div>
        <div className="vn-format-card">
          <h4 className="lb-formula-card-title">Scene Moods</h4>
          <div className="vn-mood-grid">
            {(Object.keys(MOOD_CSS_BG) as SceneMood[]).map((m) => (
              <div key={m} className="vn-mood-swatch">
                <div className="vn-mood-swatch-color" style={{ background: MOOD_CSS_BG[m] }} />
                <span>{m.replace(/_/g, ' ')}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="vn-format-card">
          <h4 className="lb-formula-card-title">Rich Text Markup</h4>
          <div className="vn-richtext-ref">
            <div className="vn-richtext-row">
              <code className="vn-richtext-syntax">*text*</code>
              <span className="vn-rich-italic">italic</span>
              <span className="vn-richtext-usage">Emphasis, inner thoughts</span>
            </div>
            <div className="vn-richtext-row">
              <code className="vn-richtext-syntax">**text**</code>
              <strong className="vn-rich-bold">bold</strong>
              <span className="vn-richtext-usage">Commands, strong emotion</span>
            </div>
            <div className="vn-richtext-row">
              <code className="vn-richtext-syntax">~text~</code>
              <span className="vn-rich-whisper">whisper</span>
              <span className="vn-richtext-usage">Quiet speech, asides</span>
            </div>
            <div className="vn-richtext-row">
              <code className="vn-richtext-syntax">_text_</code>
              <span className="vn-rich-emphasis">emphasis</span>
              <span className="vn-richtext-usage">Key words, gold highlight</span>
            </div>
          </div>
        </div>
        <div className="vn-format-card">
          <h4 className="lb-formula-card-title">Delivery Modes</h4>
          <div className="vn-delivery-ref">
            <div className="vn-richtext-row">
              <code className="vn-richtext-syntax">speech</code>
              <span style={{ color: 'var(--text-primary)' }}>Default</span>
              <span className="vn-richtext-usage">Normal spoken dialogue (default if omitted)</span>
            </div>
            <div className="vn-richtext-row">
              <code className="vn-richtext-syntax">thought</code>
              <span style={{ color: '#8B9DC3', fontStyle: 'italic' }}>Inner voice</span>
              <span className="vn-richtext-usage">Internal monologue, dotted border</span>
            </div>
            <div className="vn-richtext-row">
              <code className="vn-richtext-syntax">shout</code>
              <span style={{ color: '#C45544', fontWeight: 700 }}>Loud</span>
              <span className="vn-richtext-usage">Shouted commands, red glow, screen shake</span>
            </div>
            <div className="vn-richtext-row">
              <code className="vn-richtext-syntax">whisper</code>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.85em' }}>Quiet</span>
              <span className="vn-richtext-usage">Hushed speech, faded, smaller text</span>
            </div>
          </div>
        </div>
        <div className="vn-format-card">
          <h4 className="lb-formula-card-title">Characters</h4>
          <div className="vn-char-list">
            {Object.values(CHARACTERS).filter((c) => c.id !== 'narrator').map((char) => (
              <div key={char.id} className="vn-char-item">
                <span className="vn-char-name" style={{ color: char.color }}>{char.name}</span>
                <span className="vn-char-id">{char.id}</span>
                {char.rank && <span className="vn-char-rank">{char.rank}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  PORTRAIT GALLERY — expression reference for all characters          */
/* ================================================================== */

const GALLERY_CHARACTERS = Object.values(CHARACTERS).filter((c) => c.id !== 'narrator' && c.id !== 'player');

function PortraitGalleryView() {
  const [selectedChar, setSelectedChar] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [enlarged, setEnlarged] = useState<{ charId: string; expr: Expression } | null>(null);

  const filteredChars = selectedChar
    ? GALLERY_CHARACTERS.filter((c) => c.id === selectedChar)
    : GALLERY_CHARACTERS;

  return (
    <div className="vn-gallery">
      <div className="vn-gallery-toolbar">
        <span className="vn-gallery-label">Character:</span>
        <button
          className={`art-lab-filter-btn${selectedChar === null ? ' active' : ''}`}
          onClick={() => setSelectedChar(null)}
        >
          All
        </button>
        {GALLERY_CHARACTERS.map((char) => (
          <button
            key={char.id}
            className={`art-lab-filter-btn${selectedChar === char.id ? ' active' : ''}`}
            onClick={() => setSelectedChar(char.id)}
            style={{ borderBottom: `2px solid ${char.color}` }}
          >
            {char.name}
          </button>
        ))}
        <span className="art-lab-toolbar-divider" />
        <label className="art-lab-toggle">
          <input type="checkbox" checked={compareMode} onChange={(e) => setCompareMode(e.target.checked)} />
          Compare
        </label>
      </div>

      {compareMode ? (
        /* Compare mode: one row per expression, all characters side-by-side */
        <div className="vn-gallery-compare">
          {ALL_EXPRESSIONS.map((expr) => (
            <div key={expr} className="vn-gallery-compare-row">
              <div className="vn-gallery-compare-label" style={{ color: EXPRESSION_COLORS[expr] }}>
                {expr}
              </div>
              <div className="vn-gallery-compare-portraits">
                {filteredChars.map((char) => (
                  <div key={char.id} className="vn-gallery-compare-cell">
                    <CharacterPortrait
                      character={char}
                      expression={expr}
                      speaking={false}
                      position="center"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Grid mode: one section per character, all expressions shown */
        <div className="vn-gallery-grid">
          {filteredChars.map((char) => (
            <div key={char.id} className="vn-gallery-character">
              <div className="vn-gallery-char-header">
                <span className="vn-gallery-char-name" style={{ color: char.color }}>{char.name}</span>
                {char.rank && <span className="vn-gallery-char-rank">{char.rank}</span>}
                <span className="vn-gallery-char-id">{char.id}</span>
              </div>
              <div className="vn-gallery-expressions">
                {ALL_EXPRESSIONS.map((expr) => (
                  <div key={expr} className="vn-gallery-expr-cell" onClick={() => setEnlarged({ charId: char.id, expr })} style={{ cursor: 'pointer' }}>
                    <div className="vn-gallery-portrait-wrap">
                      <CharacterPortrait
                        character={char}
                        expression={expr}
                        speaking={expr === char.defaultExpression}
                        position="center"
                      />
                    </div>
                    <span className="vn-gallery-expr-label" style={{ color: EXPRESSION_COLORS[expr] }}>
                      {expr}
                      {expr === char.defaultExpression && <span className="vn-gallery-default-badge">default</span>}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Enlarged portrait modal */}
      {enlarged && (() => {
        const eChar = CHARACTERS[enlarged.charId];
        if (!eChar) return null;
        const charIdx = GALLERY_CHARACTERS.findIndex((c) => c.id === enlarged.charId);
        const prevChar = charIdx > 0 ? GALLERY_CHARACTERS[charIdx - 1] : null;
        const nextChar = charIdx < GALLERY_CHARACTERS.length - 1 ? GALLERY_CHARACTERS[charIdx + 1] : null;
        return (
          <div className="vn-gallery-modal" onClick={() => setEnlarged(null)}>
            <div className="vn-gallery-modal-content" onClick={(e) => e.stopPropagation()}>
              {/* Prev/Next character navigation */}
              {prevChar && (
                <button className="vn-gallery-modal-nav vn-gallery-modal-prev"
                  onClick={() => setEnlarged({ charId: prevChar.id, expr: enlarged.expr })}
                  title={prevChar.name}>
                  &lsaquo;
                </button>
              )}
              {nextChar && (
                <button className="vn-gallery-modal-nav vn-gallery-modal-next"
                  onClick={() => setEnlarged({ charId: nextChar.id, expr: enlarged.expr })}
                  title={nextChar.name}>
                  &rsaquo;
                </button>
              )}
              <div className="vn-gallery-modal-portrait">
                <CharacterPortrait character={eChar} expression={enlarged.expr} speaking={true} position="center" />
              </div>
              <div className="vn-gallery-modal-info">
                <span className="vn-gallery-modal-name" style={{ color: eChar.color }}>{eChar.name}</span>
                <span className="vn-gallery-modal-expr" style={{ color: EXPRESSION_COLORS[enlarged.expr] }}>{enlarged.expr}</span>
                {eChar.rank && <span className="vn-gallery-modal-rank">{eChar.rank}</span>}
              </div>
              <div className="vn-gallery-modal-expressions">
                {ALL_EXPRESSIONS.map((expr) => (
                  <button
                    key={expr}
                    className={`vn-gallery-modal-expr-btn${enlarged.expr === expr ? ' active' : ''}`}
                    style={{ color: EXPRESSION_COLORS[expr] }}
                    onClick={() => setEnlarged({ charId: enlarged.charId, expr })}
                  >
                    {expr}
                  </button>
                ))}
              </div>
              {/* Character dot indicators */}
              <div className="vn-gallery-modal-dots">
                {GALLERY_CHARACTERS.map((c) => (
                  <button key={c.id} className={`vn-gallery-modal-dot${c.id === enlarged.charId ? ' active' : ''}`}
                    style={{ background: c.id === enlarged.charId ? c.color : undefined }}
                    onClick={() => setEnlarged({ charId: c.id, expr: enlarged.expr })}
                    title={c.name} />
                ))}
              </div>
              <button className="vn-gallery-modal-close" onClick={() => setEnlarged(null)}>&times;</button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

/* ================================================================== */
/*  MAIN COMPONENT                                                     */
/* ================================================================== */

type VNTab = 'play' | 'tree' | 'portraits' | 'format' | 'editor';

const TAB_LABELS: Record<VNTab, string> = {
  play: 'Scene Player',
  tree: 'Dialogue Tree',
  portraits: 'Portraits',
  format: 'Data Format',
  editor: 'Editor',
};

/* ================================================================== */
/*  EDITOR COMPONENTS                                                   */
/* ================================================================== */

/** Walk the scene graph in display order: BFS from startNode, then orphans */
function getOrderedNodeIds(scene: VNScene): string[] {
  const ordered: string[] = [];
  const visited = new Set<string>();
  const queue = [scene.startNode];
  while (queue.length > 0) {
    const id = queue.shift()!;
    if (visited.has(id) || !scene.nodes[id]) continue;
    visited.add(id);
    ordered.push(id);
    const node = scene.nodes[id];
    if (node.next && typeof node.next === 'string') queue.push(node.next);
    if (node.choices) {
      for (const c of node.choices) queue.push(c.nextId);
    }
  }
  // Orphan nodes at the end
  for (const id of Object.keys(scene.nodes)) {
    if (!visited.has(id)) ordered.push(id);
  }
  return ordered;
}

/** Cast speaker buttons — quick-add a line from any character */
function SpeakerQuickBar({ scene, afterNodeId, onInserted }: {
  scene: VNScene;
  afterNodeId: string;
  onInserted: (newId: string) => void;
}) {
  const insertNodeAfter = useVnSceneStore((s) => s.insertNodeAfter);
  const addChoiceWithNode = useVnSceneStore((s) => s.addChoiceWithNode);
  const node = scene.nodes[afterNodeId];
  const hasChoices = !!node?.choices;

  const handleInsertSpeaker = (speaker: string) => {
    if (hasChoices) {
      // Node has choices — add a new choice branch instead
      const newId = addChoiceWithNode(scene.id, afterNodeId, `New ${CHARACTERS[speaker]?.name ?? speaker} line`, speaker);
      if (newId) onInserted(newId);
    } else {
      const newId = insertNodeAfter(scene.id, afterNodeId, speaker);
      if (newId) onInserted(newId);
    }
  };

  const castCharacters = scene.cast.filter((id) => id !== 'player').length > 0
    ? scene.cast : ['narrator', 'player', 'pierre', 'jb'];

  return (
    <div className="vn-speaker-bar">
      <span className="vn-speaker-bar-label">{hasChoices ? '+ branch from:' : '+ insert after:'}</span>
      {castCharacters.map((cid) => {
        const char = CHARACTERS[cid];
        if (!char) return null;
        return (
          <button
            key={cid}
            className="vn-speaker-btn"
            style={{ borderColor: char.color, color: char.color }}
            onClick={() => handleInsertSpeaker(cid)}
            title={`Add ${char.name || 'narrator'} line after this node`}
          >
            {char.name || 'Narrator'}
          </button>
        );
      })}
    </div>
  );
}

/** Collapsible section wrapper for the edit form */
/* ------------------------------------------------------------------ */
/*  Game-mechanic editor sub-components                                 */
/* ------------------------------------------------------------------ */

function GameEffectEditor({ effect, onChange }: {
  effect?: VNGameEffect;
  onChange: (effect: VNGameEffect | undefined) => void;
}) {
  const eff = effect ?? {};
  const setField = (patch: Partial<VNGameEffect>) => onChange({ ...eff, ...patch });

  const statEntries = Object.entries(eff.statChanges ?? {}) as [string, number][];
  const npcEntries = eff.npcRelationshipChanges ?? [];
  const flagEntries = Object.entries(eff.flagChanges ?? {});

  return (
    <div className="vn-game-editor">
      {/* Meters */}
      <div className="vn-game-row">
        {(['moraleChange', 'staminaChange', 'healthChange', 'sousChange', 'virtueChange'] as const).map((key) => (
          <div key={key} className="vn-game-field-sm">
            <label className="vn-editor-label">{key.replace('Change', '')}</label>
            <input type="number" className="vn-editor-input" value={eff[key] ?? ''} placeholder="0"
              onChange={(e) => {
                const v = e.target.value === '' ? undefined : parseInt(e.target.value);
                setField({ [key]: v } as Partial<VNGameEffect>);
              }} />
          </div>
        ))}
      </div>
      {/* Stat changes */}
      <div className="vn-editor-label" style={{ marginTop: '0.3rem' }}>Stat Changes</div>
      {statEntries.map(([stat, delta], i) => (
        <div key={i} className="vn-game-row">
          <select className="vn-editor-select" value={stat}
            onChange={(e) => {
              const newStats = { ...eff.statChanges };
              delete newStats[stat as keyof typeof newStats];
              (newStats as Record<string, number>)[e.target.value] = delta;
              setField({ statChanges: newStats });
            }}>
            {NUMERIC_STAT_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <input type="number" className="vn-editor-input" value={delta}
            onChange={(e) => setField({ statChanges: { ...eff.statChanges, [stat]: parseInt(e.target.value) || 0 } })} />
          <button className="vn-choice-remove" onClick={() => {
            const newStats = { ...eff.statChanges };
            delete newStats[stat as keyof typeof newStats];
            setField({ statChanges: Object.keys(newStats).length > 0 ? newStats : undefined });
          }}>x</button>
        </div>
      ))}
      <button className="vn-choice-add" style={{ fontSize: '11px' }}
        onClick={() => setField({ statChanges: { ...eff.statChanges, valor: 0 } })}>+ Stat</button>

      {/* NPC changes */}
      <div className="vn-editor-label" style={{ marginTop: '0.3rem' }}>NPC Relationship</div>
      {npcEntries.map((nc, i) => (
        <div key={i} className="vn-game-row">
          <input className="vn-editor-input" value={nc.npcId} placeholder="NPC id"
            onChange={(e) => {
              const arr = [...npcEntries]; arr[i] = { ...nc, npcId: e.target.value };
              setField({ npcRelationshipChanges: arr });
            }} />
          <input type="number" className="vn-editor-input" value={nc.delta}
            onChange={(e) => {
              const arr = [...npcEntries]; arr[i] = { ...nc, delta: parseInt(e.target.value) || 0 };
              setField({ npcRelationshipChanges: arr });
            }} />
          <button className="vn-choice-remove" onClick={() => {
            const arr = npcEntries.filter((_, j) => j !== i);
            setField({ npcRelationshipChanges: arr.length > 0 ? arr : undefined });
          }}>x</button>
        </div>
      ))}
      <button className="vn-choice-add" style={{ fontSize: '11px' }}
        onClick={() => setField({ npcRelationshipChanges: [...npcEntries, { npcId: '', delta: 0 }] })}>+ NPC</button>

      {/* Flags */}
      <div className="vn-editor-label" style={{ marginTop: '0.3rem' }}>Flags</div>
      {flagEntries.map(([flag, val], i) => (
        <div key={i} className="vn-game-row">
          <input className="vn-editor-input" value={flag} placeholder="flag name"
            onChange={(e) => {
              const newFlags = { ...eff.flagChanges };
              delete newFlags[flag];
              newFlags[e.target.value] = val as boolean;
              setField({ flagChanges: newFlags });
            }} />
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '11px' }}>
            <input type="checkbox" checked={val as boolean}
              onChange={(e) => setField({ flagChanges: { ...eff.flagChanges, [flag]: e.target.checked } })} />
            {val ? 'set' : 'clear'}
          </label>
          <button className="vn-choice-remove" onClick={() => {
            const newFlags = { ...eff.flagChanges };
            delete newFlags[flag];
            setField({ flagChanges: Object.keys(newFlags).length > 0 ? newFlags : undefined });
          }}>x</button>
        </div>
      ))}
      <button className="vn-choice-add" style={{ fontSize: '11px' }}
        onClick={() => setField({ flagChanges: { ...eff.flagChanges, '': true } })}>+ Flag</button>

      {/* Clear all */}
      {Object.keys(eff).some((k) => eff[k as keyof VNGameEffect] != null) && (
        <button className="vn-choice-remove" style={{ marginTop: '0.3rem', fontSize: '10px' }}
          onClick={() => onChange(undefined)}>Clear All Effects</button>
      )}
    </div>
  );
}

function ConditionBranchEditor({ conditions, nodeIds, onChange }: {
  conditions?: VNConditionBranch[];
  nodeIds: string[];
  onChange: (conditions: VNConditionBranch[] | undefined) => void;
}) {
  const branches = conditions ?? [];
  return (
    <div className="vn-game-editor">
      {branches.map((b, i) => (
        <div key={i} className="vn-game-row" style={{ flexWrap: 'wrap', gap: '0.3rem' }}>
          <input className="vn-editor-input" value={b.flag ?? ''} placeholder="flag"
            style={{ width: '80px' }}
            onChange={(e) => { const arr = [...branches]; arr[i] = { ...b, flag: e.target.value || undefined }; onChange(arr); }} />
          <select className="vn-editor-select" value={b.minStat?.stat ?? ''} style={{ width: '90px' }}
            onChange={(e) => {
              const arr = [...branches];
              arr[i] = { ...b, minStat: e.target.value ? { stat: e.target.value as typeof NUMERIC_STAT_OPTIONS[number], value: b.minStat?.value ?? 30 } : undefined };
              onChange(arr);
            }}>
            <option value="">No stat</option>
            {NUMERIC_STAT_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {b.minStat && (
            <input type="number" className="vn-editor-input" value={b.minStat.value} style={{ width: '50px' }}
              onChange={(e) => { const arr = [...branches]; arr[i] = { ...b, minStat: { ...b.minStat!, value: parseInt(e.target.value) || 0 } }; onChange(arr); }} />
          )}
          <input type="number" className="vn-editor-input" value={b.minSous ?? ''} placeholder="sous" style={{ width: '55px' }}
            onChange={(e) => { const arr = [...branches]; arr[i] = { ...b, minSous: e.target.value ? parseInt(e.target.value) : undefined }; onChange(arr); }} />
          <select className="vn-editor-select" value={b.nextId} style={{ flex: 1 }}
            onChange={(e) => { const arr = [...branches]; arr[i] = { ...b, nextId: e.target.value }; onChange(arr); }}>
            {nodeIds.map((nid) => <option key={nid} value={nid}>{nid}</option>)}
          </select>
          <button className="vn-choice-remove" onClick={() => { const arr = branches.filter((_, j) => j !== i); onChange(arr.length > 0 ? arr : undefined); }}>x</button>
        </div>
      ))}
      <button className="vn-choice-add" style={{ fontSize: '11px' }}
        onClick={() => onChange([...branches, { nextId: nodeIds[0] ?? '' }])}>+ Condition</button>
    </div>
  );
}

function GameCheckEditor({ check, nodeIds, onChange }: {
  check?: VNGameCheck;
  nodeIds: string[];
  onChange: (check: VNGameCheck | undefined) => void;
}) {
  if (!check) {
    return (
      <button className="vn-choice-add" style={{ fontSize: '11px' }}
        onClick={() => onChange({ stat: 'valor', difficulty: 0, passNode: nodeIds[0] ?? '', failNode: nodeIds[0] ?? '' })}>
        + Enable Stat Check
      </button>
    );
  }
  return (
    <div className="vn-game-editor">
      <div className="vn-game-row">
        <select className="vn-editor-select" value={check.stat}
          onChange={(e) => onChange({ ...check, stat: e.target.value as typeof NUMERIC_STAT_OPTIONS[number] })}>
          {NUMERIC_STAT_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <div className="vn-game-field-sm">
          <label className="vn-editor-label">diff</label>
          <input type="number" className="vn-editor-input" value={check.difficulty}
            onChange={(e) => onChange({ ...check, difficulty: parseInt(e.target.value) || 0 })} />
        </div>
      </div>
      <div className="vn-game-row">
        <div className="vn-game-field-sm" style={{ flex: 1 }}>
          <label className="vn-editor-label" style={{ color: '#6a9a6a' }}>Pass</label>
          <select className="vn-editor-select" value={check.passNode}
            onChange={(e) => onChange({ ...check, passNode: e.target.value })}>
            {nodeIds.map((nid) => <option key={nid} value={nid}>{nid}</option>)}
          </select>
        </div>
        <div className="vn-game-field-sm" style={{ flex: 1 }}>
          <label className="vn-editor-label" style={{ color: '#c45544' }}>Fail</label>
          <select className="vn-editor-select" value={check.failNode}
            onChange={(e) => onChange({ ...check, failNode: e.target.value })}>
            {nodeIds.map((nid) => <option key={nid} value={nid}>{nid}</option>)}
          </select>
        </div>
      </div>
      <button className="vn-choice-remove" style={{ fontSize: '10px' }} onClick={() => onChange(undefined)}>Remove Check</button>
    </div>
  );
}

function GameLockEditor({ lock, onChange }: {
  lock?: VNGameLock;
  onChange: (lock: VNGameLock | undefined) => void;
}) {
  if (!lock) {
    return (
      <button className="vn-choice-add" style={{ fontSize: '11px' }}
        onClick={() => onChange({ lockedMessage: 'Locked' })}>
        + Enable Lock
      </button>
    );
  }
  return (
    <div className="vn-game-editor">
      <div className="vn-game-row">
        <div className="vn-game-field-sm">
          <label className="vn-editor-label">Attribute</label>
          <select className="vn-editor-select" value={lock.requireAttribute ?? ''}
            onChange={(e) => onChange({ ...lock, requireAttribute: (e.target.value || undefined) as typeof ATTRIBUTE_OPTIONS[number] | undefined })}>
            <option value="">None</option>
            {ATTRIBUTE_OPTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div className="vn-game-field-sm">
          <label className="vn-editor-label">Min Sous</label>
          <input type="number" className="vn-editor-input" value={lock.requireSous ?? ''} placeholder="0"
            onChange={(e) => onChange({ ...lock, requireSous: e.target.value ? parseInt(e.target.value) : undefined })} />
        </div>
      </div>
      <div className="vn-game-row">
        <div className="vn-game-field-sm" style={{ flex: 1 }}>
          <label className="vn-editor-label">Require Flag</label>
          <input className="vn-editor-input" value={lock.requireFlag ?? ''} placeholder="flag name"
            onChange={(e) => onChange({ ...lock, requireFlag: e.target.value || undefined })} />
        </div>
        <div className="vn-game-field-sm" style={{ flex: 1 }}>
          <label className="vn-editor-label">Locked Message</label>
          <input className="vn-editor-input" value={lock.lockedMessage ?? ''} placeholder="Cannot..."
            onChange={(e) => onChange({ ...lock, lockedMessage: e.target.value || undefined })} />
        </div>
      </div>
      <button className="vn-choice-remove" style={{ fontSize: '10px' }} onClick={() => onChange(undefined)}>Remove Lock</button>
    </div>
  );
}

function CollapsibleSection({ title, defaultOpen = false, children }: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="vn-script-collapsible">
      <button className="vn-script-collapsible-header" onClick={() => setOpen(!open)}>
        <span className="vn-script-collapsible-arrow">{open ? '\u25BE' : '\u25B8'}</span>
        <span className="vn-script-collapsible-title">{title}</span>
      </button>
      {open && <div className="vn-script-collapsible-body">{children}</div>}
    </div>
  );
}

/** Script Flow — unified screenplay-style node list + inline editor */
function ScriptFlow({ scene, selectedNodeId, onSelect }: {
  scene: VNScene;
  selectedNodeId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const orderedIds = useMemo(() => getOrderedNodeIds(scene), [scene]);
  const orphanStart = useMemo(() => {
    const visited = new Set<string>();
    const queue = [scene.startNode];
    while (queue.length > 0) {
      const id = queue.shift()!;
      if (visited.has(id) || !scene.nodes[id]) continue;
      visited.add(id);
      const node = scene.nodes[id];
      if (node.next && typeof node.next === 'string') queue.push(node.next);
      if (node.choices) for (const c of node.choices) queue.push(c.nextId);
    }
    return visited.size;
  }, [scene]);

  const updateNode = useVnSceneStore((s) => s.updateNode);
  const deleteNode = useVnSceneStore((s) => s.deleteNode);
  const convertToChoiceNode = useVnSceneStore((s) => s.convertToChoiceNode);
  const convertToLinearNode = useVnSceneStore((s) => s.convertToLinearNode);
  const nodeIds = useMemo(() => Object.keys(scene.nodes), [scene]);
  const charIds = Object.keys(CHARACTERS);
  const selectedRef = useRef<HTMLDivElement>(null);

  // Scroll selected node into view
  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedNodeId]);

  const handleDeleteNode = (nodeId: string) => {
    if (nodeIds.length <= 1) return;
    deleteNode(scene.id, nodeId);
    onSelect(null);
  };

  return (
    <div className="vn-script-flow">
      <div className="vn-script-flow-header">
        <span className="vn-script-flow-title">Script ({orderedIds.length} nodes)</span>
      </div>
      <div className="vn-script-flow-body">
        {orderedIds.map((id, idx) => {
          const node = scene.nodes[id];
          const speaker = CHARACTERS[node.speaker];
          const speakerColor = speaker?.color ?? '#8a8070';
          const speakerName = speaker?.name || 'Narrator';
          const isSelected = selectedNodeId === id;
          const isOrphan = idx >= orphanStart;
          const isStart = id === scene.startNode;
          const isEnd = node.next === null && !node.choices;
          const hasChoices = !!node.choices && node.choices.length > 0;
          const expression = node.expression ?? 'neutral';
          const deliveryMode = node.mode ?? 'speech';

          return (
            <div
              key={id}
              ref={isSelected ? selectedRef : undefined}
              className={`vn-script-node${isSelected ? ' selected' : ''}${isOrphan ? ' orphan' : ''}`}
              style={{ '--speaker-accent': speakerColor } as React.CSSProperties}
              onClick={() => !isSelected && onSelect(id)}
            >
              {/* Screenplay header: speaker name + badges */}
              <div className="vn-script-node-header">
                <span className="vn-script-speaker" style={{ color: speakerColor }}>
                  {isStart && <span className="vn-script-badge start" title="Start node">{'\u25B6'}</span>}
                  {speakerName.toUpperCase()}
                </span>
                <span className="vn-script-badges">
                  {expression !== 'neutral' && (
                    <span className="vn-script-badge expr" style={{ borderColor: EXPRESSION_COLORS[expression], color: EXPRESSION_COLORS[expression] }}>
                      {expression}
                    </span>
                  )}
                  {deliveryMode !== 'speech' && (
                    <span className="vn-script-badge mode">{deliveryMode}</span>
                  )}
                  {node.effect && (
                    <span className="vn-script-badge effect">{node.effect}</span>
                  )}
                  {isEnd && <span className="vn-script-badge end">END</span>}
                  {hasChoices && <span className="vn-script-badge choice">CHOICE</span>}
                </span>
              </div>

              {/* Dialogue text — always visible */}
              <div className="vn-script-text">
                {node.text ? parseRichText(node.text) : <span className="vn-script-empty">(empty)</span>}
              </div>

              {/* Choice pills (collapsed view) */}
              {hasChoices && !isSelected && (
                <div className="vn-script-choices-preview">
                  {node.choices!.map((c, i) => (
                    <div key={i} className="vn-script-choice-pill">
                      <span className="vn-script-choice-connector">{i === node.choices!.length - 1 ? '\u2514' : '\u251C'}</span>
                      <span className="vn-script-choice-label">{'\u201C'}{c.label}{'\u201D'}</span>
                      <span className="vn-script-choice-target">{'\u2192'} {c.nextId}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* ═══ EXPANDED EDIT FORM ═══ */}
              {isSelected && (
                <div className="vn-script-edit-form" onClick={(e) => e.stopPropagation()}>
                  {/* Row 1: Speaker + Expression */}
                  <div className="vn-script-edit-row">
                    <div className="vn-editor-field">
                      <label className="vn-editor-label">Speaker</label>
                      <select className="vn-editor-select" value={node.speaker}
                        onChange={(e) => updateNode(scene.id, id, { speaker: e.target.value })}>
                        {charIds.map((cid) => (
                          <option key={cid} value={cid}>{CHARACTERS[cid].name || cid} {CHARACTERS[cid].rank ? `(${CHARACTERS[cid].rank})` : ''}</option>
                        ))}
                      </select>
                    </div>
                    <div className="vn-editor-field">
                      <label className="vn-editor-label">Expression</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="vn-node-list-dot" style={{ background: EXPRESSION_COLORS[node.expression ?? 'neutral'], width: 10, height: 10 }} />
                        <select className="vn-editor-select" value={node.expression ?? ''}
                          onChange={(e) => updateNode(scene.id, id, { expression: (e.target.value || undefined) as Expression | undefined })}>
                          <option value="">(default)</option>
                          {ALL_EXPRESSIONS.map((expr) => <option key={expr} value={expr}>{expr}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Text area */}
                  <div className="vn-editor-field">
                    <label className="vn-editor-label">Dialogue Text</label>
                    <textarea className="vn-editor-textarea vn-script-textarea" rows={4} value={node.text}
                      onChange={(e) => updateNode(scene.id, id, { text: e.target.value })} />
                  </div>

                  {/* Row 2: Mode + Effect */}
                  <div className="vn-script-edit-row">
                    <div className="vn-editor-field">
                      <label className="vn-editor-label">Delivery Mode</label>
                      <div className="vn-editor-radio-group">
                        {(['speech', 'thought', 'shout', 'whisper'] as DeliveryMode[]).map((m) => (
                          <label key={m} className="vn-editor-radio">
                            <input type="radio" name={`mode_${id}`} value={m}
                              checked={(node.mode ?? 'speech') === m}
                              onChange={() => updateNode(scene.id, id, { mode: m === 'speech' ? undefined : m })} />
                            {m}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="vn-editor-field">
                      <label className="vn-editor-label">Effect</label>
                      <select className="vn-editor-select" value={node.effect ?? ''}
                        onChange={(e) => updateNode(scene.id, id, { effect: (e.target.value || undefined) as 'shake' | 'flash' | 'fade' | undefined })}>
                        <option value="">(none)</option>
                        <option value="shake">shake</option>
                        <option value="flash">flash</option>
                        <option value="fade">fade</option>
                      </select>
                    </div>
                  </div>

                  {/* Next Node */}
                  {!hasChoices && (
                    <div className="vn-editor-field">
                      <label className="vn-editor-label">Next Node</label>
                      <select className="vn-editor-select" value={node.next ?? '__end__'}
                        onChange={(e) => updateNode(scene.id, id, { next: e.target.value === '__end__' ? null : e.target.value })}>
                        <option value="__end__">(End)</option>
                        {nodeIds.filter((nid) => nid !== id).map((nid) => {
                          const targetNode = scene.nodes[nid];
                          const preview = targetNode?.text ? ` \u2014 ${targetNode.text.slice(0, 30)}${targetNode.text.length > 30 ? '\u2026' : ''}` : '';
                          return <option key={nid} value={nid}>{nid}{preview}</option>;
                        })}
                      </select>
                    </div>
                  )}

                  {/* Choices editor (inline) */}
                  {hasChoices && (
                    <ChoicesEditor choices={node.choices!} nodeIds={nodeIds} scene={scene} nodeId={id} />
                  )}

                  {/* Collapsible: Stage Positions */}
                  <CollapsibleSection title="Stage Positions">
                    <div className="vn-editor-positions">
                      {scene.cast.filter((cid) => cid !== 'narrator').map((cid) => (
                        <div key={cid} className="vn-editor-position-row">
                          <span style={{ color: CHARACTERS[cid]?.color }}>{CHARACTERS[cid]?.name || cid}</span>
                          <select className="vn-editor-select" value={node.positions?.[cid] ?? 'off'}
                            onChange={(e) => {
                              const pos = e.target.value as CharPosition;
                              const newPositions = { ...(node.positions ?? {}), [cid]: pos };
                              updateNode(scene.id, id, { positions: newPositions });
                            }}>
                            <option value="off">off</option>
                            <option value="left">left</option>
                            <option value="center">center</option>
                            <option value="right">right</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  </CollapsibleSection>

                  {/* Collapsible: SFX */}
                  <CollapsibleSection title="Sound Effects">
                    <div className="vn-editor-field">
                      <input className="vn-editor-input" value={node.sfx ?? ''} placeholder="Sound effect name"
                        onChange={(e) => updateNode(scene.id, id, { sfx: e.target.value || undefined })} />
                    </div>
                  </CollapsibleSection>

                  {/* Collapsible: Game Effects */}
                  <CollapsibleSection title={`Game Effects${node.gameEffect ? ' (FX)' : ''}`}>
                    <GameEffectEditor
                      effect={node.gameEffect}
                      onChange={(gameEffect) => updateNode(scene.id, id, { gameEffect })}
                    />
                  </CollapsibleSection>

                  {/* Collapsible: Auto-Branch Conditions */}
                  <CollapsibleSection title={`Auto-Branch${node.gameConditionNext ? ' (IF)' : ''}`}>
                    <ConditionBranchEditor
                      conditions={node.gameConditionNext}
                      nodeIds={nodeIds}
                      onChange={(gameConditionNext) => updateNode(scene.id, id, { gameConditionNext })}
                    />
                  </CollapsibleSection>

                  {/* Bottom actions bar */}
                  <div className="vn-script-edit-actions">
                    {/* Speaker quick-add */}
                    <SpeakerQuickBar scene={scene} afterNodeId={id} onInserted={onSelect} />

                    <div className="vn-script-edit-actions-right">
                      {hasChoices ? (
                        <button className="vn-editor-convert" onClick={() => convertToLinearNode(scene.id, id)}>
                          Convert to Linear
                        </button>
                      ) : (
                        <button className="vn-editor-convert" onClick={() => convertToChoiceNode(scene.id, id)}>
                          Make Choice Node
                        </button>
                      )}
                      <button
                        className="vn-editor-action-btn danger"
                        onClick={() => handleDeleteNode(id)}
                        disabled={nodeIds.length <= 1}
                        title="Delete this node"
                      >
                        Delete Node
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Scene Settings Panel — collapsible, shown in right column below preview */
function SceneSettingsPanel({ scene }: { scene: VNScene }) {
  const updateScene = useVnSceneStore((s) => s.updateScene);
  const nodeIds = Object.keys(scene.nodes);
  const charIds = Object.keys(CHARACTERS);
  const [open, setOpen] = useState(true);

  return (
    <div className="vn-scene-settings">
      <button className="vn-scene-settings-header" onClick={() => setOpen(!open)}>
        <span className="vn-script-collapsible-arrow">{open ? '\u25BE' : '\u25B8'}</span>
        <span className="vn-scene-settings-title">Scene Settings</span>
        <span className="vn-scene-settings-id">{scene.id}</span>
      </button>
      {open && (
        <div className="vn-scene-settings-body">
          <div className="vn-editor-field">
            <label className="vn-editor-label">Title</label>
            <input className="vn-editor-input" value={scene.title}
              onChange={(e) => updateScene(scene.id, { title: e.target.value })} />
          </div>

          <div className="vn-editor-field">
            <label className="vn-editor-label">Description</label>
            <textarea className="vn-editor-textarea" rows={2} value={scene.description}
              onChange={(e) => updateScene(scene.id, { description: e.target.value })} />
          </div>

          <div className="vn-script-edit-row">
            <div className="vn-editor-field">
              <label className="vn-editor-label">Mood</label>
              <select className="vn-editor-select" value={scene.mood}
                onChange={(e) => updateScene(scene.id, { mood: e.target.value as SceneMood })}>
                {ALL_MOODS.map((m) => <option key={m} value={m}>{m.replace(/_/g, ' ')}</option>)}
              </select>
            </div>
            <div className="vn-editor-field">
              <label className="vn-editor-label">Start Node</label>
              <select className="vn-editor-select" value={scene.startNode}
                onChange={(e) => updateScene(scene.id, { startNode: e.target.value })}>
                {nodeIds.map((nid) => <option key={nid} value={nid}>{nid}</option>)}
              </select>
            </div>
          </div>

          <div className="vn-editor-field">
            <label className="vn-editor-label">Cast</label>
            <div className="vn-editor-cast-checks">
              {charIds.map((cid) => (
                <label key={cid} className="vn-editor-radio" style={{ color: CHARACTERS[cid]?.color }}>
                  <input type="checkbox" checked={scene.cast.includes(cid)}
                    onChange={(e) => {
                      const newCast = e.target.checked
                        ? [...scene.cast, cid]
                        : scene.cast.filter((c) => c !== cid);
                      updateScene(scene.id, { cast: newCast });
                    }} />
                  {CHARACTERS[cid]?.name || cid}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Choice sub-editor */
function ChoicesEditor({ choices, nodeIds, scene, nodeId }: {
  choices: VNChoice[];
  nodeIds: string[];
  scene: VNScene;
  nodeId: string;
}) {
  const sceneId = scene.id;
  const updateChoice = useVnSceneStore((s) => s.updateChoice);
  const deleteChoice = useVnSceneStore((s) => s.deleteChoice);
  const addChoice = useVnSceneStore((s) => s.addChoice);

  return (
    <div className="vn-choices-editor">
      <div className="vn-editor-label">Choices</div>
      {choices.map((choice, idx) => (
        <div key={idx} className="vn-choice-item">
          <div className="vn-editor-field">
            <label className="vn-editor-label">Label</label>
            <input className="vn-editor-input" value={choice.label}
              onChange={(e) => updateChoice(sceneId, nodeId, idx, { label: e.target.value })} />
          </div>
          <div className="vn-editor-field">
            <label className="vn-editor-label">Description</label>
            <input className="vn-editor-input" value={choice.description ?? ''}
              onChange={(e) => updateChoice(sceneId, nodeId, idx, { description: e.target.value || undefined })} />
          </div>
          {/* Next Node — hidden when gameCheck is enabled (managed by passNode) */}
          {!choice.gameCheck ? (
            <div className="vn-editor-field">
              <label className="vn-editor-label">Next Node</label>
              <select className="vn-editor-select" value={choice.nextId}
                onChange={(e) => updateChoice(sceneId, nodeId, idx, { nextId: e.target.value })}>
                {nodeIds.map((nid) => {
                  const targetNode = scene.nodes[nid];
                  const preview = targetNode?.text ? ` — ${targetNode.text.slice(0, 30)}${targetNode.text.length > 30 ? '…' : ''}` : '';
                  return <option key={nid} value={nid}>{nid}{preview}</option>;
                })}
              </select>
            </div>
          ) : (
            <div className="vn-editor-field" style={{ opacity: 0.6, fontSize: '11px' }}>
              <label className="vn-editor-label">Routing</label>
              <span>Pass: {choice.gameCheck.passNode} / Fail: {choice.gameCheck.failNode}</span>
            </div>
          )}
          {/* Structured Game Check */}
          <div className="vn-editor-field">
            <label className="vn-editor-label">Game Check</label>
            <GameCheckEditor
              check={choice.gameCheck}
              nodeIds={nodeIds}
              onChange={(gameCheck) => {
                const patch: Partial<VNChoice> = { gameCheck };
                // Invariant: nextId = passNode when gameCheck is enabled
                if (gameCheck) patch.nextId = gameCheck.passNode;
                updateChoice(sceneId, nodeId, idx, patch);
              }}
            />
          </div>
          {/* Game Lock */}
          <div className="vn-editor-field">
            <label className="vn-editor-label">Lock</label>
            <GameLockEditor
              lock={choice.gameLock}
              onChange={(gameLock) => updateChoice(sceneId, nodeId, idx, { gameLock })}
            />
          </div>
          {/* Legacy display fields */}
          <div className="vn-editor-field">
            <label className="vn-editor-label">Display Text</label>
            <input className="vn-editor-input" value={choice.statCheck ?? ''} placeholder="e.g. Valor 50+ (display only)"
              onChange={(e) => updateChoice(sceneId, nodeId, idx, { statCheck: e.target.value || undefined })} />
          </div>
          <div className="vn-editor-field">
            <label className="vn-editor-label">Condition Text</label>
            <input className="vn-editor-input" value={choice.condition ?? ''} placeholder="Human-readable gate (display only)"
              onChange={(e) => updateChoice(sceneId, nodeId, idx, { condition: e.target.value || undefined })} />
          </div>
          <button className="vn-choice-remove" onClick={() => deleteChoice(sceneId, nodeId, idx)}>Remove</button>
        </div>
      ))}
      <button className="vn-choice-add" onClick={() => addChoice(sceneId, nodeId, { label: 'New choice', nextId: nodeIds[0] ?? '' })}>
        + Add Choice
      </button>
    </div>
  );
}

/* NodeDetailEditor and SceneMetadataEditor replaced by ScriptFlow + SceneSettingsPanel above */

/** Accumulate character positions by walking from startNode to targetNodeId */
function getAccumulatedPositions(scene: VNScene, targetNodeId: string): Record<string, CharPosition> {
  const positions: Record<string, CharPosition> = {};
  const visited = new Set<string>();
  // Walk the chain from start to find positions set before the target node
  let current: string | null = scene.startNode;
  while (current && !visited.has(current)) {
    visited.add(current);
    const n: DialogueNode | undefined = scene.nodes[current];
    if (!n) break;
    if (n.positions) Object.assign(positions, n.positions);
    if (current === targetNodeId) break;
    if (n.next) { current = n.next; }
    else if (n.choices) {
      // Try to find path to target through choices
      const found: VNChoice | undefined = n.choices.find((c: VNChoice) => c.nextId === targetNodeId);
      current = found ? found.nextId : n.choices[0]?.nextId ?? null;
    } else { break; }
  }
  return positions;
}

/** Live preview — right column. Shows the scene as the player would see it at this node. */
function EditorLivePreview({ scene, nodeId }: { scene: VNScene; nodeId: string | null }) {
  const resolvedNodeId = nodeId ?? scene.startNode;
  const node = scene.nodes[resolvedNodeId];

  const positions = useMemo(
    () => getAccumulatedPositions(scene, resolvedNodeId),
    [resolvedNodeId, scene],
  );

  if (!node) return <div className="vn-editor-preview"><div className="si-empty">No node to preview.</div></div>;

  const speaker = CHARACTERS[node.speaker];
  const expression = node.expression ?? speaker?.defaultExpression ?? 'neutral';
  const mood = node.mood ?? scene.mood;
  const isNarrator = node.speaker === 'narrator';

  const hasChoices = !!node.choices && node.choices.length > 0;
  const isEnd = node.next === null && !hasChoices;
  const deliveryMode = node.mode ?? 'speech';

  return (
    <div className="vn-editor-preview">
      {/* Stage — mood background + portraits + dialogue */}
      <div className="vn-editor-preview-stage" style={{ background: MOOD_CSS_BG[mood] }}>
        <MoodBackground mood={mood} />
        <div className="vn-preview-portraits">
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
        <div className="vn-preview-dialogue-wrap">
          <div className={`vn-dialogue-box${isNarrator ? ' vn-narrator-box' : ''}${deliveryMode !== 'speech' ? ` vn-${deliveryMode}` : ''}`}
            style={{ '--speaker-color': isNarrator ? 'rgba(255,200,100,0.15)' : speaker?.color ?? '#888' } as React.CSSProperties}>
            {!isNarrator && speaker && (
              <div className="vn-nameplate" style={{ '--speaker-color': speaker.color } as React.CSSProperties}>
                <span className="vn-nameplate-text">{speaker.name}</span>
              </div>
            )}
            <div className="vn-text">{node.text ? parseRichText(node.text) : <span style={{ opacity: 0.3 }}>(empty — type text above)</span>}</div>
          </div>
          {/* Choice buttons preview */}
          {hasChoices && (
            <div className="vn-preview-choices">
              {node.choices!.map((c, i) => (
                <div key={i} className="vn-preview-choice-pill">
                  <span className="vn-preview-choice-num">{i + 1}</span>
                  {c.label || '(empty choice)'}
                  {c.statCheck && <span className="vn-preview-choice-stat">[{c.statCheck}]</span>}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Effect badge */}
        {node.effect && <div className="vn-preview-effect-badge">{node.effect}</div>}
        {isEnd && <div className="vn-preview-end-badge">END</div>}
      </div>

      {/* Node metadata summary below the preview */}
      <div className="vn-preview-meta">
        <div className="vn-preview-meta-item">
          <span className="vn-preview-meta-label">Node</span>
          <span className="vn-preview-meta-val">{node.id}</span>
        </div>
        <div className="vn-preview-meta-item">
          <span className="vn-preview-meta-label">Speaker</span>
          <span className="vn-preview-meta-val" style={{ color: speaker?.color }}>{speaker?.name || 'Narrator'}</span>
        </div>
        {node.expression && (
          <div className="vn-preview-meta-item">
            <span className="vn-preview-meta-label">Expr</span>
            <span className="vn-preview-meta-val" style={{ color: EXPRESSION_COLORS[node.expression] }}>{node.expression}</span>
          </div>
        )}
        {deliveryMode !== 'speech' && (
          <div className="vn-preview-meta-item">
            <span className="vn-preview-meta-label">Mode</span>
            <span className="vn-preview-meta-val">{deliveryMode}</span>
          </div>
        )}
        <div className="vn-preview-meta-item">
          <span className="vn-preview-meta-label">Next</span>
          <span className="vn-preview-meta-val">{hasChoices ? `${node.choices!.length} choices` : isEnd ? 'END' : node.next}</span>
        </div>
      </div>
    </div>
  );
}

/** Validation panel — bottom of editor tab */
function ValidationPanel({ scene, onSelectNode }: { scene: VNScene; onSelectNode: (id: string) => void }) {
  const warnings = useMemo(() => validateScene(scene), [scene]);

  if (warnings.length === 0) {
    return (
      <div className="vn-validation-panel">
        <span className="vn-validation-ok">No issues found.</span>
      </div>
    );
  }

  const typeColors: Record<string, string> = {
    unreachable: '#C4956A',
    broken_ref: '#C45544',
    missing_text: '#D4AF37',
    duplicate_id: '#C45544',
    no_end: '#8B9DC3',
    orphan_choice: '#9B8EC4',
  };

  return (
    <div className="vn-validation-panel">
      <div className="vn-validation-title">Validation ({warnings.length} warning{warnings.length !== 1 ? 's' : ''})</div>
      {warnings.map((w, i) => (
        <button
          key={i}
          className="vn-validation-warning"
          style={{ borderLeftColor: typeColors[w.type] ?? 'var(--text-dim)' }}
          onClick={() => onSelectNode(w.nodeId)}
        >
          <span className="vn-validation-type" style={{ color: typeColors[w.type] }}>{w.type}</span>
          <span className="vn-validation-msg">{w.message}</span>
        </button>
      ))}
    </div>
  );
}

/** New Scene modal */
function NewSceneModal({ onClose, onCreated }: { onClose: () => void; onCreated?: (sceneId: string) => void }) {
  const createScene = useVnSceneStore((s) => s.createScene);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mood, setMood] = useState<SceneMood>('night_camp');
  const [cast, setCast] = useState<string[]>(['narrator', 'player', 'pierre', 'jb']);
  const charIds = Object.keys(CHARACTERS);

  const handleCreate = () => {
    if (!title.trim()) return;
    const id = createScene(title.trim(), description.trim(), mood, cast);
    onCreated?.(id);
    onClose();
  };

  return (
    <div className="vn-modal-overlay" onClick={onClose}>
      <div className="vn-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="cl-section-title">New Scene</h3>
        <div className="vn-scene-form">
          <div className="vn-editor-field">
            <label className="vn-editor-label">Title</label>
            <input className="vn-editor-input" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Scene title" autoFocus />
          </div>
          <div className="vn-editor-field">
            <label className="vn-editor-label">Description</label>
            <textarea className="vn-editor-textarea" rows={2} value={description}
              onChange={(e) => setDescription(e.target.value)} placeholder="Brief description" />
          </div>
          <div className="vn-editor-field">
            <label className="vn-editor-label">Mood</label>
            <select className="vn-editor-select" value={mood}
              onChange={(e) => setMood(e.target.value as SceneMood)}>
              {ALL_MOODS.map((m) => <option key={m} value={m}>{m.replace(/_/g, ' ')}</option>)}
            </select>
          </div>
          <div className="vn-editor-field">
            <label className="vn-editor-label">Cast</label>
            <div className="vn-editor-cast-checks">
              {charIds.map((cid) => (
                <label key={cid} className="vn-editor-radio" style={{ color: CHARACTERS[cid]?.color }}>
                  <input type="checkbox" checked={cast.includes(cid)}
                    onChange={(e) => {
                      setCast(e.target.checked ? [...cast, cid] : cast.filter((c) => c !== cid));
                    }} />
                  {CHARACTERS[cid]?.name || cid}
                </label>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button className="art-lab-filter-btn" onClick={onClose}>Cancel</button>
            <button className="art-lab-filter-btn active" onClick={handleCreate} disabled={!title.trim()}>Create</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Import modal */
function ImportModal({ onClose }: { onClose: () => void }) {
  const importScenes = useVnSceneStore((s) => s.importScenes);
  const [json, setJson] = useState('');
  const [result, setResult] = useState<{ added: number; errors: string[] } | null>(null);

  const handleImport = () => {
    const res = importScenes(json);
    setResult(res);
    if (res.added > 0 && res.errors.length === 0) {
      setTimeout(onClose, 1200);
    }
  };

  return (
    <div className="vn-modal-overlay" onClick={onClose}>
      <div className="vn-modal vn-modal-wide" onClick={(e) => e.stopPropagation()}>
        <h3 className="cl-section-title">Import Scenes</h3>
        <div className="vn-scene-form">
          <div className="vn-editor-field">
            <label className="vn-editor-label">Paste JSON (single scene or array of scenes)</label>
            <textarea className="vn-editor-textarea" rows={10} value={json}
              onChange={(e) => setJson(e.target.value)} placeholder='{"id": "...", "title": "...", ...}' />
          </div>
          {result && (
            <div style={{ marginTop: '0.5rem' }}>
              {result.added > 0 && <div style={{ color: '#7CAA8B' }}>Imported {result.added} scene(s) successfully.</div>}
              {result.errors.map((err, i) => <div key={i} style={{ color: '#C45544' }}>{err}</div>)}
            </div>
          )}
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button className="art-lab-filter-btn" onClick={onClose}>Cancel</button>
            <button className="art-lab-filter-btn active" onClick={handleImport} disabled={!json.trim()}>Import</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Full Editor tab content — 2-panel screenplay layout */
function EditorTabContent({ scene, selectedNodeId, setSelectedNodeId }: {
  scene: VNScene;
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
}) {
  return (
    <div className="vn-editor-tab-content">
      <div className="vn-editor-layout">
        {/* Left panel (60%): Script Flow */}
        <div className="vn-editor-left-panel">
          <ScriptFlow
            scene={scene}
            selectedNodeId={selectedNodeId}
            onSelect={setSelectedNodeId}
          />
          {/* Bottom: Validation panel */}
          <ValidationPanel scene={scene} onSelectNode={setSelectedNodeId} />
        </div>

        {/* Right panel (40%): Live Preview + Scene Settings */}
        <div className="vn-editor-right-panel">
          <EditorLivePreview scene={scene} nodeId={selectedNodeId} />
          <SceneSettingsPanel scene={scene} />
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  MAIN COMPONENT                                                     */
/* ================================================================== */

export function VisualNovelLabPage() {
  const [tab, setTab] = useState<VNTab>('play');
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [playKey, setPlayKey] = useState(0);
  const [editorNodeId, setEditorNodeId] = useState<string | null>(null);
  const [showNewScene, setShowNewScene] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  // Store bindings
  const scenes = useVnSceneStore((s) => s.scenes);
  const dirty = useVnSceneStore((s) => s.dirty);
  const saveScenes = useVnSceneStore((s) => s.saveScenes);
  const deleteScene = useVnSceneStore((s) => s.deleteScene);
  const duplicateScene = useVnSceneStore((s) => s.duplicateScene);
  const exportScene = useVnSceneStore((s) => s.exportScene);
  const exportScenes = useVnSceneStore((s) => s.exportScenes);
  const addScene = useVnSceneStore((s) => s.addScene);

  // Lab store for launch config
  const { launchConfig, clearLaunchConfig } = useLabStore();

  // Initialize store on mount
  useEffect(() => {
    useVnSceneStore.getState().loadScenes();
  }, []);

  // Auto-save with debounce
  useEffect(() => {
    if (!dirty) return;
    let fadeTimer: ReturnType<typeof setTimeout>;
    const timer = setTimeout(() => {
      saveScenes();
      setShowSaved(true);
      fadeTimer = setTimeout(() => setShowSaved(false), 1500);
    }, 500);
    return () => {
      clearTimeout(timer);
      clearTimeout(fadeTimer);
    };
  }, [dirty, saveScenes]);

  // Handle launch config — auto-select scene if sceneId is provided
  useEffect(() => {
    if (launchConfig?.sceneId) {
      const sceneId = String(launchConfig.sceneId);
      setSelectedSceneId(sceneId);
      if (launchConfig.sourceNodeId) {
        setTab('editor');
      }
      clearLaunchConfig();
    }
  }, [launchConfig, clearLaunchConfig]);

  const selectedScene = useMemo(
    () => scenes.find((s) => s.id === selectedSceneId) ?? null,
    [scenes, selectedSceneId],
  );

  useEffect(() => {
    if (scenes.length === 0) {
      if (selectedSceneId !== null) setSelectedSceneId(null);
      return;
    }

    if (!selectedSceneId || !scenes.some((scene) => scene.id === selectedSceneId)) {
      setSelectedSceneId(scenes[0].id);
    }
  }, [scenes, selectedSceneId]);

  useEffect(() => {
    if (!selectedScene) {
      setPlaying(false);
    }
  }, [selectedScene]);

  // Reset editor node when scene changes
  useEffect(() => {
    setEditorNodeId(null);
  }, [selectedSceneId]);

  const handlePlay = useCallback(() => {
    if (selectedScene) {
      setPlaying(true);
      setPlayKey((k) => k + 1);
    }
  }, [selectedScene]);

  const handleEnd = useCallback(() => {
    setPlaying(false);
  }, []);

  const handleExportScene = useCallback(() => {
    if (!selectedSceneId) return;
    const json = exportScene(selectedSceneId);
    if (json) {
      navigator.clipboard.writeText(json).catch(() => {});
    }
  }, [selectedSceneId, exportScene]);

  const handleExportAll = useCallback(() => {
    const json = exportScenes();
    navigator.clipboard.writeText(json).catch(() => {});
  }, [exportScenes]);

  const handleImportGameScenes = useCallback(() => {
    const existingIds = new Set(scenes.map((s) => s.id));
    const importable = getImportableGameScenes(existingIds);
    if (importable.length === 0) {
      alert('All game scenes are already in the lab.');
      return;
    }
    for (const s of importable) {
      addScene(s);
    }
    alert(`Imported ${importable.length} game scene(s).`);
  }, [scenes, addScene]);

  const handleDelete = useCallback(() => {
    if (!selectedSceneId) return;
    deleteScene(selectedSceneId);
    setSelectedSceneId(null);
  }, [selectedSceneId, deleteScene]);

  const handleDuplicate = useCallback(() => {
    if (!selectedSceneId) return;
    const newId = duplicateScene(selectedSceneId);
    if (newId) setSelectedSceneId(newId);
  }, [selectedSceneId, duplicateScene]);

  return (
    <div className="vn-page">
      <div className="art-lab-toolbar">
        {(['play', 'tree', 'portraits', 'format', 'editor'] as VNTab[]).map((t) => (
          <button
            key={t}
            className={`art-lab-filter-btn${tab === t ? ' active' : ''}`}
            onClick={() => { setTab(t); setPlaying(false); }}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
        {tab !== 'format' && tab !== 'portraits' && selectedScene && (
          <>
            <span className="art-lab-toolbar-divider" />
            <span className="mg-game-title">{selectedScene.title}</span>
          </>
        )}
        {tab === 'play' && selectedScene && !playing && (
          <button className="art-lab-filter-btn active" onClick={handlePlay} style={{ marginLeft: 'auto' }}>
            Play Scene
          </button>
        )}
        {tab === 'play' && playing && (
          <button className="art-lab-filter-btn" onClick={() => setPlaying(false)} style={{ marginLeft: 'auto' }}>
            Exit Player
          </button>
        )}

        {/* Editor toolbar actions */}
        {tab === 'editor' && (
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            {dirty ? <span className="vn-dirty-indicator">Unsaved changes</span>
              : showSaved ? <span className="vn-saved-indicator">Saved</span>
              : null}
            <button className="art-lab-filter-btn" onClick={() => setShowNewScene(true)}>New Scene</button>
            <button className="art-lab-filter-btn" onClick={() => setShowImport(true)}>Import</button>
            <button className="art-lab-filter-btn" onClick={handleImportGameScenes} title="Import VN scenes from game code">Import Game Scenes</button>
            {selectedScene && (
              <>
                <button className="art-lab-filter-btn" onClick={handleExportScene} title="Copy scene JSON to clipboard">Export Scene</button>
                <button className="art-lab-filter-btn" onClick={handleDuplicate}>Duplicate</button>
                <button className="art-lab-filter-btn" onClick={handleDelete} style={{ color: '#C45544' }}>Delete</button>
              </>
            )}
            <button className="art-lab-filter-btn" onClick={handleExportAll} title="Copy all scenes JSON to clipboard">Export All</button>
          </div>
        )}

        <span className="art-lab-count">{scenes.length} scenes</span>
      </div>

      {/* Full-screen player mode */}
      {tab === 'play' && playing && selectedScene && (
        <VNRenderer key={playKey} scene={selectedScene} onEnd={handleEnd} onReplay={handlePlay} />
      )}

      {/* Browse mode */}
      {tab === 'play' && !playing && (
        <div className="vn-browse-layout">
          <SceneBrowser scenes={scenes} selectedId={selectedSceneId} onSelect={setSelectedSceneId} />
          <div className="vn-scene-preview">
            {selectedScene ? (
              <>
                {/* Mini scene preview with mood background */}
                <div className="vn-scene-preview-thumb" style={{ background: MOOD_CSS_BG[selectedScene.mood] }}>
                  <MoodBackground mood={selectedScene.mood} />
                  <div className="vn-preview-cast">
                    {selectedScene.cast.filter((id) => id !== 'player' && id !== 'narrator').map((charId) => {
                      const char = CHARACTERS[charId];
                      if (!char) return null;
                      return (
                        <div key={charId} className="vn-preview-portrait">
                          <CharacterPortrait
                            character={char}
                            expression={char.defaultExpression}
                            speaking={false}
                            position="center"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
                <h2 className="npc-detail-name">{selectedScene.title}</h2>
                <p className="npc-detail-text">{selectedScene.description}</p>
                <div className="vn-scene-info">
                  <div className="lb-param"><span className="lb-param-label">Mood</span><span className="lb-param-val">{selectedScene.mood.replace(/_/g, ' ')}</span></div>
                  <div className="lb-param"><span className="lb-param-label">Nodes</span><span className="lb-param-val">{Object.keys(selectedScene.nodes).length}</span></div>
                  <div className="lb-param"><span className="lb-param-label">Cast</span><span className="lb-param-val">{selectedScene.cast.filter((c) => c !== 'player').map((c) => CHARACTERS[c]?.name).join(', ')}</span></div>
                  <div className="lb-param"><span className="lb-param-label">Branches</span><span className="lb-param-val">{Object.values(selectedScene.nodes).filter((n) => n.choices && n.choices.length > 0).length}</span></div>
                </div>
                <button className="mg-roll-btn" onClick={handlePlay} style={{ marginTop: '1rem' }}>
                  Play Scene
                </button>
              </>
            ) : (
              <div className="si-empty">Select a scene to preview or play.</div>
            )}
          </div>
        </div>
      )}

      {/* Dialogue tree view */}
      {tab === 'tree' && (
        <div className="vn-browse-layout">
          <SceneBrowser scenes={scenes} selectedId={selectedSceneId} onSelect={setSelectedSceneId} />
          <div className="vn-tree-panel">
            {selectedScene ? (
              <DialogueTreeView scene={selectedScene} />
            ) : (
              <div className="si-empty">Select a scene to view its dialogue tree.</div>
            )}
          </div>
        </div>
      )}

      {/* Portrait gallery */}
      {tab === 'portraits' && <PortraitGalleryView />}

      {/* Data format reference */}
      {tab === 'format' && <DataFormatView />}

      {/* Editor tab */}
      {tab === 'editor' && (
        <div className="vn-browse-layout">
          <SceneBrowser scenes={scenes} selectedId={selectedSceneId} onSelect={setSelectedSceneId} />
          <div className="vn-editor-main">
            {selectedScene ? (
              <EditorTabContent scene={selectedScene} selectedNodeId={editorNodeId} setSelectedNodeId={setEditorNodeId} />
            ) : (
              <div className="si-empty">Select a scene to edit, or create a new one.</div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      {showNewScene && <NewSceneModal onClose={() => setShowNewScene(false)} onCreated={(id) => {
        setSelectedSceneId(id);
        setTab('editor');
        setEditorNodeId('start');
      }} />}
      {showImport && <ImportModal onClose={() => setShowImport(false)} />}
    </div>
  );
}
