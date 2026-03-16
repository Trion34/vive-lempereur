import React, { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import {
  useCampaignEditorStore,
  nodeTypeLabel,
  type CampaignChapter,
  type ChapterNode,
  type NodeType,
} from '../../stores/campaignEditorStore';
import { EditableText, DetailEditor, NodeTypeSelect, TagEditor } from './EditorControls';
import type { LabPageId } from '../../labRoutes';
import { NarrativePreview } from './NarrativePreview';
import { openLabInNewTab } from '../../utils/openLabInNewTab';

/* ------------------------------------------------------------------ */
/*  Layout constants                                                   */
/* ------------------------------------------------------------------ */

const SWIMLANE_W = 180;
const SWIMLANE_GAP = 60;
const HEADER_H = 50;
const NODE_W = 160;
const NODE_H = 56;
const NODE_GAP = 24;
const TOP_PAD = 16;
const GRAPH_PAD = 40;

/* ------------------------------------------------------------------ */
/*  Layout computation                                                 */
/* ------------------------------------------------------------------ */

export interface NodePos {
  x: number;
  y: number;
  chapterId: string;
  nodeId: string;
}

interface EdgeDef {
  id: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
  crossChapter: boolean;
}

interface SwimlaneDef {
  chapter: CampaignChapter;
  x: number;
  y: number;
  w: number;
  h: number;
}

export function computeLayout(
  chapters: CampaignChapter[],
  customPositions: Record<string, { x: number; y: number }>,
): Record<string, NodePos> {
  const positions: Record<string, NodePos> = {};

  chapters.forEach((ch, ci) => {
    const laneX = GRAPH_PAD + ci * (SWIMLANE_W + SWIMLANE_GAP);
    const nodeX = laneX + (SWIMLANE_W - NODE_W) / 2;

    ch.nodes.forEach((n, ni) => {
      if (customPositions[n.id]) {
        positions[n.id] = { ...customPositions[n.id], chapterId: ch.id, nodeId: n.id };
      } else {
        positions[n.id] = {
          x: nodeX,
          y: HEADER_H + TOP_PAD + ni * (NODE_H + NODE_GAP) + GRAPH_PAD,
          chapterId: ch.id,
          nodeId: n.id,
        };
      }
    });
  });

  return positions;
}

export function computeEdges(
  chapters: CampaignChapter[],
  positions: Record<string, NodePos>,
): EdgeDef[] {
  const edges: EdgeDef[] = [];

  // Intra-chapter edges
  chapters.forEach((ch) => {
    for (let i = 0; i < ch.nodes.length - 1; i++) {
      const from = positions[ch.nodes[i].id];
      const to = positions[ch.nodes[i + 1].id];
      if (from && to) {
        edges.push({
          id: `${ch.nodes[i].id}-${ch.nodes[i + 1].id}`,
          from: { x: from.x + NODE_W / 2, y: from.y + NODE_H },
          to: { x: to.x + NODE_W / 2, y: to.y },
          crossChapter: false,
        });
      }
    }
  });

  // Inter-chapter edges
  for (let i = 0; i < chapters.length - 1; i++) {
    const lastNode = chapters[i].nodes[chapters[i].nodes.length - 1];
    const firstNode = chapters[i + 1].nodes[0];
    if (lastNode && firstNode) {
      const from = positions[lastNode.id];
      const to = positions[firstNode.id];
      if (from && to) {
        edges.push({
          id: `${lastNode.id}-${firstNode.id}-cross`,
          from: { x: from.x + NODE_W / 2, y: from.y + NODE_H },
          to: { x: to.x + NODE_W / 2, y: to.y },
          crossChapter: true,
        });
      }
    }
  }

  return edges;
}

function computeSwimlanes(chapters: CampaignChapter[]): SwimlaneDef[] {
  return chapters.map((ch, ci) => {
    const x = GRAPH_PAD + ci * (SWIMLANE_W + SWIMLANE_GAP);
    const h = HEADER_H + TOP_PAD + Math.max(ch.nodes.length, 1) * (NODE_H + NODE_GAP) + GRAPH_PAD;
    return { chapter: ch, x, y: GRAPH_PAD, w: SWIMLANE_W, h };
  });
}

/* ------------------------------------------------------------------ */
/*  SVG sub-components                                                 */
/* ------------------------------------------------------------------ */

// Resolve CSS custom properties to actual colors for SVG fill
const NODE_TYPE_COLORS: Record<NodeType, string> = {
  interlude: '#4caf50',
  camp: '#c8a84e',
  battle: '#c45050',
  vn: '#3a5a8b',
};

function SwimlaneRect({ def }: { def: SwimlaneDef }) {
  return (
    <g>
      <rect
        x={def.x}
        y={def.y}
        width={def.w}
        height={def.h}
        rx={8}
        className="cg-swimlane"
      />
      <text
        x={def.x + def.w / 2}
        y={def.y + 18}
        className="cg-swimlane-title"
        textAnchor="middle"
      >
        Ch.{def.chapter.number}: {def.chapter.title}
      </text>
      <text
        x={def.x + def.w / 2}
        y={def.y + 34}
        className="cg-swimlane-date"
        textAnchor="middle"
      >
        {def.chapter.dateRange}
      </text>
    </g>
  );
}

function EdgePath({ edge }: { edge: EdgeDef }) {
  const { from, to, crossChapter } = edge;
  const dy = to.y - from.y;
  const dx = to.x - from.x;

  let d: string;
  if (crossChapter) {
    // S-curve for cross-chapter connections
    const midX = from.x + dx * 0.5;
    d = `M ${from.x} ${from.y} C ${midX} ${from.y + 30}, ${midX} ${to.y - 30}, ${to.x} ${to.y}`;
  } else {
    // Vertical curve within same chapter
    const cp = Math.max(dy * 0.35, 15);
    d = `M ${from.x} ${from.y} C ${from.x} ${from.y + cp}, ${to.x} ${to.y - cp}, ${to.x} ${to.y}`;
  }

  return (
    <g>
      <path d={d} className={`cg-edge${crossChapter ? ' cg-edge-cross' : ''}`} />
      {/* Arrow head */}
      <polygon
        points={`${to.x},${to.y} ${to.x - 4},${to.y - 8} ${to.x + 4},${to.y - 8}`}
        className="cg-edge-arrow"
      />
    </g>
  );
}

function GraphNode({ node, x, y, selected, onMouseDown }: {
  node: ChapterNode;
  x: number;
  y: number;
  selected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
}) {
  const color = NODE_TYPE_COLORS[node.type];

  // Truncate label to fit
  const maxLabelLen = 20;
  const label = node.label.length > maxLabelLen
    ? node.label.slice(0, maxLabelLen - 1) + '\u2026'
    : node.label;

  return (
    <g
      transform={`translate(${x}, ${y})`}
      className={`cg-node${selected ? ' cg-node-selected' : ''}`}
      onMouseDown={onMouseDown}
    >
      {/* Background */}
      <rect width={NODE_W} height={NODE_H} rx={6} className="cg-node-bg" />
      {/* Type color bar */}
      <rect width={NODE_W} height={5} rx={3} fill={color} className="cg-node-bar" />
      {/* Label */}
      <text x={NODE_W / 2} y={24} className="cg-node-label" textAnchor="middle">{label}</text>
      {/* Type text */}
      <text x={NODE_W / 2} y={40} className="cg-node-type-text" textAnchor="middle">
        {nodeTypeLabel[node.type]}
      </text>
      {/* Detail count */}
      {Object.keys(node.details).length > 0 && (
        <text x={NODE_W - 8} y={NODE_H - 6} className="cg-node-details-count" textAnchor="end">
          {Object.entries(node.details).map(([k, v]) => `${k}:${v}`).join(' ')}
        </text>
      )}
      {/* Selection ring */}
      {selected && (
        <rect
          x={-2} y={-2}
          width={NODE_W + 4} height={NODE_H + 4}
          rx={8}
          className="cg-node-ring"
        />
      )}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/*  Graph sidebar                                                      */
/* ------------------------------------------------------------------ */

function GraphSidebarCrossLaunch({ node }: { node: ChapterNode }) {
  const getTarget = (): { page: LabPageId; label: string; config: Record<string, string | number | undefined> } | null => {
    if (node.type === 'camp') {
      return { page: 'camp', label: 'Open in Camp Lab', config: { sourceNodeId: node.id, actions: node.details.actions, weather: node.details.weather, supply: node.details.supply } };
    }
    if (node.type === 'battle') {
      return { page: 'line-battle', label: 'Open in Line Battle Lab', config: { sourceNodeId: node.id, volleys: node.details.volleys, parts: node.details.parts } };
    }
    if (node.type === 'interlude') {
      return { page: 'story-beat', label: 'Open in Story Beat Preview', config: { sourceNodeId: node.id, label: node.label } };
    }
    if (node.type === 'vn') {
      return { page: 'visual-novel', label: 'Open in Visual Novel Lab', config: { sourceNodeId: node.id, label: node.label } };
    }
    return null;
  };

  const target = getTarget();
  if (!target) return null;

  return (
    <div className="cv-cross-launch-group">
      <button className="cv-cross-launch-btn" onClick={() => openLabInNewTab(target.page, target.config)}>
        {target.label}
      </button>

      {node.type === 'battle' && (
        <button
          className="cv-cross-launch-btn cv-cross-launch-secondary"
          onClick={() => openLabInNewTab('melee', { sourceNodeId: node.id, label: node.label })}
        >
          Open in Melee Lab
        </button>
      )}

      <div className="cv-cross-launch-utils">
        <button
          className="cv-cross-launch-util-btn"
          onClick={() => openLabInNewTab('audio', { sourceNodeId: node.id, label: node.label })}
          title="Open Audio Lab"
        >
          Audio
        </button>
        <button
          className="cv-cross-launch-util-btn"
          onClick={() => openLabInNewTab('art', { sourceNodeId: node.id, label: node.label })}
          title="Open Art Lab"
        >
          Art
        </button>
      </div>
    </div>
  );
}

function GraphSidebar({ node, chapter, onClose }: {
  node: ChapterNode;
  chapter: CampaignChapter;
  onClose: () => void;
}) {
  const { updateNode, updateChapter, interludeNarratives } = useCampaignEditorStore();

  return (
    <div className="cg-sidebar">
      <div className="cg-sidebar-header">
        <NodeTypeSelect
          value={node.type}
          onChange={(t) => updateNode(chapter.id, node.id, { type: t })}
        />
        <button className="cg-sidebar-close" onClick={onClose} title="Close">&times;</button>
      </div>

      <EditableText
        tag="h2"
        className="cg-sidebar-title"
        value={node.label}
        onChange={(v) => updateNode(chapter.id, node.id, { label: v })}
        placeholder="Node label..."
      />

      <EditableText
        tag="p"
        className="cg-sidebar-desc"
        value={node.description}
        onChange={(v) => updateNode(chapter.id, node.id, { description: v })}
        multiline
        placeholder="Description..."
      />

      <GraphSidebarCrossLaunch node={node} />

      {node.type === 'interlude' && interludeNarratives[node.id]?.chunks.length > 0 && (
        <div className="cg-sidebar-section">
          <h3 className="cv-meta-title">Narrative Preview</h3>
          <NarrativePreview
            chunks={interludeNarratives[node.id].chunks}
            splashText={interludeNarratives[node.id].splashText}
            compact
          />
        </div>
      )}

      <div className="cg-sidebar-section">
        <h3 className="cv-meta-title">Configuration</h3>
        <DetailEditor
          details={node.details}
          onChange={(d) => updateNode(chapter.id, node.id, { details: d })}
        />
      </div>

      <div className="cg-sidebar-section">
        <h3 className="cv-meta-title">Chapter: {chapter.title}</h3>
        <EditableText
          tag="p"
          className="cg-sidebar-desc"
          value={chapter.summary}
          onChange={(v) => updateChapter(chapter.id, { summary: v })}
          multiline
          placeholder="Chapter summary..."
        />
      </div>

      <div className="cg-sidebar-section">
        <h3 className="cv-meta-title">Commanders</h3>
        <TagEditor
          tags={chapter.keyCommanders.french}
          onChange={(tags) => updateChapter(chapter.id, { keyCommanders: { ...chapter.keyCommanders, french: tags } })}
          label="French"
          tagClass="cv-meta-tag-french"
        />
        <TagEditor
          tags={chapter.keyCommanders.austrian}
          onChange={(tags) => updateChapter(chapter.id, { keyCommanders: { ...chapter.keyCommanders, austrian: tags } })}
          label="Austrian"
          tagClass="cv-meta-tag-austrian"
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main CampaignGraph component                                       */
/* ------------------------------------------------------------------ */

export function CampaignGraph() {
  const { chapters, selectedNode, nodePositions, selectNode, updateNodePosition } = useCampaignEditorStore();
  const svgRef = useRef<SVGSVGElement>(null);

  // Transform state: pan + zoom
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });

  // Drag state
  const dragRef = useRef<{
    nodeId: string;
    startMouse: { x: number; y: number };
    startPos: { x: number; y: number };
    moved: boolean;
  } | null>(null);

  // Pan state
  const panRef = useRef<{
    startMouse: { x: number; y: number };
    startTransform: { x: number; y: number };
  } | null>(null);

  // Compute layout
  const positions = useMemo(
    () => computeLayout(chapters, nodePositions),
    [chapters, nodePositions],
  );
  const edges = useMemo(() => computeEdges(chapters, positions), [chapters, positions]);
  const swimlanes = useMemo(() => computeSwimlanes(chapters), [chapters]);

  // Find selected node info
  const selectedInfo = useMemo(() => {
    if (!selectedNode) return null;
    for (const ch of chapters) {
      const n = ch.nodes.find((nd) => nd.id === selectedNode);
      if (n) return { node: n, chapter: ch };
    }
    return null;
  }, [chapters, selectedNode]);

  // Mouse → SVG coordinate conversion
  // Node mousedown — start drag
  const handleNodeMouseDown = useCallback((nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const pos = positions[nodeId];
    if (!pos) return;
    dragRef.current = {
      nodeId,
      startMouse: { x: e.clientX, y: e.clientY },
      startPos: { x: pos.x, y: pos.y },
      moved: false,
    };
  }, [positions]);

  // Canvas mousedown — start pan
  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    // Only pan on background clicks
    if ((e.target as Element).closest('.cg-node')) return;
    panRef.current = {
      startMouse: { x: e.clientX, y: e.clientY },
      startTransform: { x: transform.x, y: transform.y },
    };
  }, [transform]);

  // Mousemove — handle drag or pan
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (dragRef.current) {
        const drag = dragRef.current;
        const dx = (e.clientX - drag.startMouse.x) / transform.scale;
        const dy = (e.clientY - drag.startMouse.y) / transform.scale;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
          drag.moved = true;
        }
        if (drag.moved) {
          updateNodePosition(drag.nodeId, drag.startPos.x + dx, drag.startPos.y + dy);
        }
      }
      if (panRef.current) {
        const pan = panRef.current;
        setTransform((t) => ({
          ...t,
          x: pan.startTransform.x + (e.clientX - pan.startMouse.x),
          y: pan.startTransform.y + (e.clientY - pan.startMouse.y),
        }));
      }
    };

    const handleUp = () => {
      if (dragRef.current && !dragRef.current.moved) {
        // It was a click, not a drag — select the node
        selectNode(dragRef.current.nodeId);
      }
      dragRef.current = null;
      panRef.current = null;
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [transform.scale, updateNodePosition, selectNode]);

  // Zoom with wheel
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const factor = e.deltaY > 0 ? 0.92 : 1.08;
    setTransform((t) => {
      const newScale = Math.min(Math.max(t.scale * factor, 0.2), 3);
      // Zoom centered on mouse position
      const graphX = (mouseX - t.x) / t.scale;
      const graphY = (mouseY - t.y) / t.scale;
      return {
        x: mouseX - graphX * newScale,
        y: mouseY - graphY * newScale,
        scale: newScale,
      };
    });
  }, []);

  // Fit-to-view
  const handleFitView = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const totalW = chapters.length * (SWIMLANE_W + SWIMLANE_GAP) + GRAPH_PAD * 2;
    const maxNodes = Math.max(...chapters.map((ch) => ch.nodes.length), 1);
    const totalH = HEADER_H + TOP_PAD + maxNodes * (NODE_H + NODE_GAP) + GRAPH_PAD * 2;

    const scaleX = rect.width / totalW;
    const scaleY = rect.height / totalH;
    const scale = Math.max(Math.min(scaleX, scaleY, 1) * 0.9, 0.6);

    setTransform({
      x: (rect.width - totalW * scale) / 2,
      y: (rect.height - totalH * scale) / 2,
      scale,
    });
  }, [chapters]);

  // Fit view on first render
  useEffect(() => {
    handleFitView();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCloseSidebar = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  return (
    <div className="cg-container">
      <div className="cg-controls">
        <button className="cg-control-btn" onClick={handleFitView} title="Fit to view">Fit</button>
        <button
          className="cg-control-btn"
          onClick={() => setTransform((t) => ({ ...t, scale: Math.min(t.scale * 1.2, 3) }))}
          title="Zoom in"
        >+</button>
        <button
          className="cg-control-btn"
          onClick={() => setTransform((t) => ({ ...t, scale: Math.max(t.scale * 0.8, 0.2) }))}
          title="Zoom out"
        >&minus;</button>
        <span className="cg-zoom-label">{Math.round(transform.scale * 100)}%</span>
      </div>

      <svg
        ref={svgRef}
        className="cg-canvas"
        onMouseDown={handleCanvasMouseDown}
        onWheel={handleWheel}
      >
        <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
          {/* Swimlanes */}
          {swimlanes.map((sl) => (
            <SwimlaneRect key={sl.chapter.id} def={sl} />
          ))}

          {/* Edges */}
          {edges.map((edge) => (
            <EdgePath key={edge.id} edge={edge} />
          ))}

          {/* Nodes */}
          {chapters.flatMap((ch) =>
            ch.nodes.map((n) => {
              const pos = positions[n.id];
              if (!pos) return null;
              return (
                <GraphNode
                  key={n.id}
                  node={n}
                  x={pos.x}
                  y={pos.y}
                  selected={selectedNode === n.id}
                  onMouseDown={(e) => handleNodeMouseDown(n.id, e)}
                />
              );
            }),
          )}
        </g>
      </svg>

      {/* Sidebar */}
      {selectedInfo && (
        <GraphSidebar
          node={selectedInfo.node}
          chapter={selectedInfo.chapter}
          onClose={handleCloseSidebar}
        />
      )}
    </div>
  );
}
