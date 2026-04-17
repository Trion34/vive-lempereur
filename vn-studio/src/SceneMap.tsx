import React from 'react';
import type { VNScene } from '@game/types/vnTypes';
import { CHARACTERS } from '@game/types/vnTypes';
import { useVnSceneStore } from '../../lab/src/stores/vnSceneStore';
import { spliceNodeIntoEdge, type SpliceTarget } from '../../lab/src/utils/spliceNodeIntoEdge';
import { loadSceneLayout, saveSceneLayout, clearSceneLayout, type SceneLayout } from './sceneLayouts';

/* ------------------------------------------------------------------ */
/*  Dimensions                                                         */
/* ------------------------------------------------------------------ */

const NODE_W = 200;
const NODE_H = 80;
const CHOICE_W = 140;
const CHOICE_H = 50;
const COL_GAP = 24;
const ROW_GAP = 50;

interface SceneMapProps {
  scene: VNScene;
  currentNodeId: string;
  onSelectNode: (nodeId: string) => void;
  onClose: () => void;
}

/* ------------------------------------------------------------------ */
/*  Box / Edge types                                                   */
/*                                                                     */
/*  A box is either a dialogue node or a choice module. Each has a     */
/*  unique boxId like `node:intro_1` or `choice:felix_invite:0`.       */
/* ------------------------------------------------------------------ */

type NodeKind = 'node' | 'choice';

interface Box {
  boxId: string;
  kind: NodeKind;
  x: number;
  y: number;
  width: number;
  height: number;
  // For kind='node': the actual node id
  // For kind='choice': the parent node id
  parentId: string;
  // For kind='choice' only: the index in parent.choices
  choiceIdx?: number;
}

function nodeBoxId(id: string): string { return `node:${id}`; }
function choiceBoxId(parentId: string, choiceIdx: number): string { return `choice:${parentId}:${choiceIdx}`; }

type EdgeKind = 'next' | 'to-choice' | 'choice-target' | 'pass' | 'fail' | 'condition';

interface Edge {
  fromBoxId: string;
  toBoxId: string;
  kind: EdgeKind;
  label?: string;
  /** Whether this edge can be the drop target for a node being structurally inserted. */
  insertable: boolean;
  /** Source info for performing insertion: what node/choice does this edge come from in the data model? */
  srcNodeId: string;
  /** For choice-target/pass/fail: which choice in the parent. */
  srcChoiceIdx?: number;
  /** For condition: which branch in the parent's gameConditionNext. */
  srcConditionIdx?: number;
  /** The actual data-model target node id (the node this edge ends at in the story flow) */
  targetNodeId: string;
}

/* ------------------------------------------------------------------ */
/*  Geometry helpers                                                   */
/* ------------------------------------------------------------------ */

function distToSegment(px: number, py: number, x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

function distToEdge(px: number, py: number, fromBox: Box, toBox: Box): number {
  const x1 = fromBox.x + fromBox.width / 2;
  const y1 = fromBox.y + fromBox.height;
  const x2 = toBox.x + toBox.width / 2;
  const y2 = toBox.y;
  const midY = y1 + (y2 - y1) / 2;
  const d1 = distToSegment(px, py, x1, y1, x1, midY);
  const d2 = distToSegment(px, py, x1, midY, x2, midY);
  const d3 = distToSegment(px, py, x2, midY, x2, y2);
  return Math.min(d1, d2, d3);
}

/* ------------------------------------------------------------------ */
/*  Tree structure builder                                             */
/*                                                                     */
/*  Walks the scene graph and emits boxes + edges with choice modules  */
/*  as first-class entities between a choice node and its targets.     */
/* ------------------------------------------------------------------ */

interface LayoutResult {
  boxes: Map<string, Box>;
  edges: Edge[];
  width: number;
  height: number;
}

/** For each box ID, list of child box IDs in the first-visit tree. */
function buildTree(scene: VNScene): {
  children: Map<string, string[]>;
  visited: Set<string>;
  edges: Edge[];
} {
  const children = new Map<string, string[]>();
  const visited = new Set<string>(); // of NODE ids (not box ids)
  const edges: Edge[] = [];

  // Helper: add a child to a parent in the tree
  const addChild = (parent: string, child: string) => {
    if (!children.has(parent)) children.set(parent, []);
    children.get(parent)!.push(child);
  };

  const walk = (nodeId: string) => {
    if (visited.has(nodeId)) return;
    if (!scene.nodes[nodeId]) return;
    visited.add(nodeId);
    const node = scene.nodes[nodeId];
    const parentBoxId = nodeBoxId(nodeId);
    if (!children.has(parentBoxId)) children.set(parentBoxId, []);

    // Choices: each becomes a child choice box
    if (node.choices && node.choices.length > 0) {
      node.choices.forEach((c, ci) => {
        const cBoxId = choiceBoxId(nodeId, ci);
        if (!children.has(cBoxId)) children.set(cBoxId, []);
        addChild(parentBoxId, cBoxId);

        // Edge: node → choice box
        edges.push({
          fromBoxId: parentBoxId,
          toBoxId: cBoxId,
          kind: 'to-choice',
          insertable: false, // node→choice edges are visual only
          srcNodeId: nodeId,
          srcChoiceIdx: ci,
          targetNodeId: nodeId, // not meaningful for this edge
        });

        // Choice targets
        if (c.gameCheck) {
          // Pass branch
          const passId = c.gameCheck.passNode;
          if (scene.nodes[passId]) {
            const passBoxId = nodeBoxId(passId);
            if (!visited.has(passId)) {
              addChild(cBoxId, passBoxId);
              edges.push({
                fromBoxId: cBoxId,
                toBoxId: passBoxId,
                kind: 'pass',
                label: '\u2713 pass',
                insertable: true,
                srcNodeId: nodeId,
                srcChoiceIdx: ci,
                targetNodeId: passId,
              });
              walk(passId);
            } else {
              // Convergence — still show edge but don't re-place
              edges.push({
                fromBoxId: cBoxId,
                toBoxId: passBoxId,
                kind: 'pass',
                label: '\u2713 pass',
                insertable: true,
                srcNodeId: nodeId,
                srcChoiceIdx: ci,
                targetNodeId: passId,
              });
            }
          }
          // Fail branch
          const failId = c.gameCheck.failNode;
          if (scene.nodes[failId]) {
            const failBoxId = nodeBoxId(failId);
            if (!visited.has(failId)) {
              addChild(cBoxId, failBoxId);
              edges.push({
                fromBoxId: cBoxId,
                toBoxId: failBoxId,
                kind: 'fail',
                label: '\u2717 fail',
                insertable: true,
                srcNodeId: nodeId,
                srcChoiceIdx: ci,
                targetNodeId: failId,
              });
              walk(failId);
            } else {
              edges.push({
                fromBoxId: cBoxId,
                toBoxId: failBoxId,
                kind: 'fail',
                label: '\u2717 fail',
                insertable: true,
                srcNodeId: nodeId,
                srcChoiceIdx: ci,
                targetNodeId: failId,
              });
            }
          }
        } else {
          // Simple choice target
          const targetId = c.nextId;
          if (scene.nodes[targetId]) {
            const targetBoxId = nodeBoxId(targetId);
            if (!visited.has(targetId)) {
              addChild(cBoxId, targetBoxId);
              edges.push({
                fromBoxId: cBoxId,
                toBoxId: targetBoxId,
                kind: 'choice-target',
                insertable: true,
                srcNodeId: nodeId,
                srcChoiceIdx: ci,
                targetNodeId: targetId,
              });
              walk(targetId);
            } else {
              edges.push({
                fromBoxId: cBoxId,
                toBoxId: targetBoxId,
                kind: 'choice-target',
                insertable: true,
                srcNodeId: nodeId,
                srcChoiceIdx: ci,
                targetNodeId: targetId,
              });
            }
          }
        }
      });
    }

    // gameConditionNext
    if (node.gameConditionNext) {
      node.gameConditionNext.forEach((b, bi) => {
        if (!scene.nodes[b.nextId]) return;
        const targetBoxId = nodeBoxId(b.nextId);
        const desc = b.flag ? `if ${b.flag}` : b.minStat ? `if ${b.minStat.stat} \u2265 ${b.minStat.value}` : b.minSous ? `if sous \u2265 ${b.minSous}` : 'condition';
        if (!visited.has(b.nextId)) {
          addChild(parentBoxId, targetBoxId);
          edges.push({
            fromBoxId: parentBoxId,
            toBoxId: targetBoxId,
            kind: 'condition',
            label: desc,
            insertable: true,
            srcNodeId: nodeId,
            srcConditionIdx: bi,
            targetNodeId: b.nextId,
          });
          walk(b.nextId);
        } else {
          edges.push({
            fromBoxId: parentBoxId,
            toBoxId: targetBoxId,
            kind: 'condition',
            label: desc,
            insertable: true,
            srcNodeId: nodeId,
            srcConditionIdx: bi,
            targetNodeId: b.nextId,
          });
        }
      });
    }

    // Linear next
    if (typeof node.next === 'string' && scene.nodes[node.next]) {
      const targetBoxId = nodeBoxId(node.next);
      if (!visited.has(node.next)) {
        addChild(parentBoxId, targetBoxId);
        edges.push({
          fromBoxId: parentBoxId,
          toBoxId: targetBoxId,
          kind: 'next',
          insertable: true,
          srcNodeId: nodeId,
          targetNodeId: node.next,
        });
        walk(node.next);
      } else {
        edges.push({
          fromBoxId: parentBoxId,
          toBoxId: targetBoxId,
          kind: 'next',
          insertable: true,
          srcNodeId: nodeId,
          targetNodeId: node.next,
        });
      }
    }
  };

  walk(scene.startNode);

  return { children, visited, edges };
}

function computeLayout(scene: VNScene): LayoutResult {
  const { children, visited, edges } = buildTree(scene);
  const boxes = new Map<string, Box>();

  // Determine dimensions for a box id
  const getDims = (boxId: string): { w: number; h: number } => {
    return boxId.startsWith('choice:') ? { w: CHOICE_W, h: CHOICE_H } : { w: NODE_W, h: NODE_H };
  };

  // Bottom-up: subtree width for each box
  const subtreeWidth = new Map<string, number>();
  const depth = new Map<string, number>();
  const placed = new Set<string>(); // box ids already placed in the tree

  function measure(boxId: string, d: number): number {
    depth.set(boxId, d);
    const kids = (children.get(boxId) ?? []).filter((k) => !placed.has(k));
    kids.forEach((k) => placed.add(k));
    const { w } = getDims(boxId);
    if (kids.length === 0) {
      subtreeWidth.set(boxId, w);
      return w;
    }
    let total = 0;
    for (const k of kids) {
      if (total > 0) total += COL_GAP;
      total += measure(k, d + 1);
    }
    const result = Math.max(w, total);
    subtreeWidth.set(boxId, result);
    return result;
  }

  placed.add(nodeBoxId(scene.startNode));
  measure(nodeBoxId(scene.startNode), 0);

  // Track vertical position per depth (for variable-height rows)
  // Since nodes are NODE_H and choices are CHOICE_H, and a row might have both,
  // we compute the max height per depth level.
  const depthHeights = new Map<number, number>();
  for (const [boxId, d] of depth.entries()) {
    const { h } = getDims(boxId);
    depthHeights.set(d, Math.max(depthHeights.get(d) ?? 0, h));
  }
  // Compute the y-offset for each depth
  const depthY = new Map<number, number>();
  let cursorY = 0;
  for (let d = 0; d <= Math.max(...depthHeights.keys()); d++) {
    depthY.set(d, cursorY);
    cursorY += (depthHeights.get(d) ?? 0) + ROW_GAP;
  }

  // Top-down: assign positions
  const placed2 = new Set<string>();
  function place(boxId: string, leftX: number) {
    if (placed2.has(boxId)) return;
    placed2.add(boxId);
    const w = subtreeWidth.get(boxId) ?? getDims(boxId).w;
    const d = depth.get(boxId) ?? 0;
    const dims = getDims(boxId);
    const centerX = leftX + w / 2;
    const x = centerX - dims.w / 2;
    const y = depthY.get(d) ?? (d * (NODE_H + ROW_GAP));

    const isChoice = boxId.startsWith('choice:');
    if (isChoice) {
      // Parse "choice:parentId:idx"
      const parts = boxId.split(':');
      boxes.set(boxId, {
        boxId,
        kind: 'choice',
        x,
        y,
        width: dims.w,
        height: dims.h,
        parentId: parts[1],
        choiceIdx: parseInt(parts[2], 10),
      });
    } else {
      // Parse "node:id"
      const nodeId = boxId.slice(5);
      boxes.set(boxId, {
        boxId,
        kind: 'node',
        x,
        y,
        width: dims.w,
        height: dims.h,
        parentId: nodeId,
      });
    }

    const kids = children.get(boxId) ?? [];
    let cursor = leftX;
    for (const k of kids) {
      if (placed2.has(k)) continue;
      place(k, cursor);
      cursor += (subtreeWidth.get(k) ?? getDims(k).w) + COL_GAP;
    }
  }
  place(nodeBoxId(scene.startNode), 0);

  // Orphans
  const orphans = Object.keys(scene.nodes).filter((id) => !visited.has(id));
  if (orphans.length > 0) {
    const maxY = Math.max(...Array.from(boxes.values()).map((b) => b.y + b.height), 0);
    let cursor = 0;
    for (const id of orphans) {
      const bId = nodeBoxId(id);
      boxes.set(bId, {
        boxId: bId,
        kind: 'node',
        x: cursor,
        y: maxY + 60,
        width: NODE_W,
        height: NODE_H,
        parentId: id,
      });
      cursor += NODE_W + COL_GAP;
    }
  }

  // Normalize: shift to positive
  const minX = Math.min(...Array.from(boxes.values()).map((b) => b.x), 0);
  if (minX < 0) {
    for (const b of boxes.values()) b.x -= minX;
  }

  const width = Math.max(...Array.from(boxes.values()).map((b) => b.x + b.width), NODE_W);
  const height = Math.max(...Array.from(boxes.values()).map((b) => b.y + b.height), NODE_H);

  return { boxes, edges, width, height };
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function SceneMap({ scene, currentNodeId, onSelectNode, onClose }: SceneMapProps) {
  const replaceSceneStructure = useVnSceneStore((s) => s.replaceSceneStructure);

  const autoLayout = React.useMemo(() => computeLayout(scene), [scene]);

  // User-edited positions override auto-layout. Keyed by boxId.
  const [overrides, setOverrides] = React.useState<SceneLayout>(() => loadSceneLayout(scene.id));

  React.useEffect(() => {
    setOverrides(loadSceneLayout(scene.id));
  }, [scene.id]);

  const mergedBoxes = React.useMemo(() => {
    const result = new Map(autoLayout.boxes);
    for (const [boxId, pos] of Object.entries(overrides)) {
      const auto = result.get(boxId);
      if (auto) result.set(boxId, { ...auto, x: pos.x, y: pos.y });
    }
    return result;
  }, [autoLayout, overrides]);

  const layoutBounds = React.useMemo(() => {
    const boxes = Array.from(mergedBoxes.values());
    const maxW = Math.max(...boxes.map((b) => b.x + b.width), NODE_W);
    const maxH = Math.max(...boxes.map((b) => b.y + b.height), NODE_H);
    return { width: maxW, height: maxH };
  }, [mergedBoxes]);

  const [pan, setPan] = React.useState<{ x: number; y: number }>({ x: 60, y: 60 });
  const [panning, setPanning] = React.useState(false);
  const panStartRef = React.useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const dragMovedRef = React.useRef<boolean>(false);

  const [draggingBoxId, setDraggingBoxId] = React.useState<string | null>(null);
  const boxDragRef = React.useRef<{ offsetX: number; offsetY: number; startX: number; startY: number } | null>(null);
  const [dropTargetEdgeIdx, setDropTargetEdgeIdx] = React.useState<number | null>(null);
  const stageRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const isLinearNodeBox = (boxId: string): boolean => {
    if (!boxId.startsWith('node:')) return false;
    const nodeId = boxId.slice(5);
    const n = scene.nodes[nodeId];
    if (!n) return false;
    const hasChoices = !!n.choices && n.choices.length > 0;
    const hasConditions = !!n.gameConditionNext && n.gameConditionNext.length > 0;
    return !hasChoices && !hasConditions;
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (draggingBoxId) return;
    setPanning(true);
    dragMovedRef.current = false;
    panStartRef.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
  };

  const handleBoxMouseDown = (e: React.MouseEvent, boxId: string) => {
    e.stopPropagation();
    const box = mergedBoxes.get(boxId);
    if (!box) return;
    dragMovedRef.current = false;
    setDraggingBoxId(boxId);
    boxDragRef.current = {
      offsetX: e.clientX - box.x,
      offsetY: e.clientY - box.y,
      startX: e.clientX,
      startY: e.clientY,
    };
  };

  const handleResetLayout = () => {
    if (!window.confirm('Reset this scene\u2019s map layout to auto-arrangement?')) return;
    clearSceneLayout(scene.id);
    setOverrides({});
  };

  React.useEffect(() => {
    if (!panning && !draggingBoxId) return;
    const onMove = (e: MouseEvent) => {
      if (draggingBoxId && boxDragRef.current) {
        const { offsetX, offsetY, startX, startY } = boxDragRef.current;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        if (Math.hypot(dx, dy) > 4) dragMovedRef.current = true;
        const newX = e.clientX - offsetX;
        const newY = e.clientY - offsetY;
        setOverrides((prev) => ({
          ...prev,
          [draggingBoxId]: { x: newX, y: newY },
        }));

        // Hit-test edges — only for linear node boxes, and only against insertable edges
        if (isLinearNodeBox(draggingBoxId) && stageRef.current) {
          const stageRect = stageRef.current.getBoundingClientRect();
          const px = e.clientX - stageRect.left;
          const py = e.clientY - stageRect.top;
          let bestIdx: number | null = null;
          let bestDist = 15;
          autoLayout.edges.forEach((edge, i) => {
            if (!edge.insertable) return;
            // Skip edges connected to the dragged node's box
            if (edge.fromBoxId === draggingBoxId || edge.toBoxId === draggingBoxId) return;
            const fromBox = mergedBoxes.get(edge.fromBoxId);
            const toBox = mergedBoxes.get(edge.toBoxId);
            if (!fromBox || !toBox) return;
            const d = distToEdge(px, py, fromBox, toBox);
            if (d < bestDist) {
              bestDist = d;
              bestIdx = i;
            }
          });
          setDropTargetEdgeIdx(bestIdx);
        } else {
          setDropTargetEdgeIdx(null);
        }
      } else if (panning && panStartRef.current) {
        const { x, y, px, py } = panStartRef.current;
        const dx = e.clientX - x;
        const dy = e.clientY - y;
        if (Math.hypot(dx, dy) > 4) dragMovedRef.current = true;
        setPan({ x: px + dx, y: py + dy });
      }
    };
    const onUp = () => {
      setPanning(false);
      panStartRef.current = null;
      if (draggingBoxId) {
        const dropIdx = dropTargetEdgeIdx;
        const draggedBoxId = draggingBoxId;

        if (dropIdx !== null && isLinearNodeBox(draggedBoxId)) {
          const targetEdge = autoLayout.edges[dropIdx];
          if (targetEdge) {
            const draggedNodeId = draggedBoxId.slice(5);
            performEdgeInsert(draggedNodeId, targetEdge);
          }
        }

        setOverrides((current) => {
          saveSceneLayout(scene.id, current);
          return current;
        });
        setDraggingBoxId(null);
        setDropTargetEdgeIdx(null);
        boxDragRef.current = null;
      }
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panning, draggingBoxId, scene.id, dropTargetEdgeIdx, autoLayout.edges, mergedBoxes]);

  /** Perform structural insertion of a linear node into an edge */
  const performEdgeInsert = (draggedId: string, edge: Edge) => {
    const target: SpliceTarget = {
      kind: edge.kind as SpliceTarget['kind'],
      srcNodeId: edge.srcNodeId,
      srcChoiceIdx: edge.srcChoiceIdx,
      srcConditionIdx: edge.srcConditionIdx,
      targetNodeId: edge.targetNodeId,
    };
    const next = spliceNodeIntoEdge(scene, draggedId, target);
    replaceSceneStructure(scene.id, next.nodes, next.startNode);
  };

  const colorMap: Record<EdgeKind, string> = {
    next: '#6a6254',
    'to-choice': '#6a6254',
    'choice-target': '#b8963e',
    pass: '#6c9866',
    fail: '#c45544',
    condition: '#6a8aaa',
  };

  const hasCustomLayout = Object.keys(overrides).length > 0;

  return (
    <div className="vns-map-overlay">
      <div className="vns-map-toolbar">
        <button className="vns-map-btn" onClick={onClose}>
          <span>{'\u2190'}</span>
          <span>Back to Editor</span>
        </button>
        <div className="vns-map-spacer" />
        <div className="vns-map-hint">
          {dropTargetEdgeIdx !== null
            ? <span style={{ color: '#f0d97a' }}>Release to insert into this edge</span>
            : 'Drag nodes to move \u00B7 Drop on an edge to splice in \u00B7 Click to jump'}
        </div>
        {hasCustomLayout && (
          <button className="vns-map-btn" onClick={handleResetLayout} title="Reset layout to auto-arrangement">
            <span>{'\u21BB'}</span>
            <span>Reset Layout</span>
          </button>
        )}
      </div>

      <div
        className={`vns-map-canvas${panning ? ' panning' : ''}`}
        onMouseDown={handleCanvasMouseDown}
      >
        <div
          ref={stageRef}
          className="vns-map-stage"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px)`,
            width: layoutBounds.width,
            height: layoutBounds.height,
          }}
        >
          {/* Edges */}
          <svg
            className="vns-map-edges"
            width={layoutBounds.width}
            height={layoutBounds.height}
            style={{ left: 0, top: 0 }}
          >
            <defs>
              {(['next', 'to-choice', 'choice-target', 'pass', 'fail', 'condition'] as const).map((kind) => (
                <marker
                  key={kind}
                  id={`arrow-${kind}`}
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={colorMap[kind]} />
                </marker>
              ))}
            </defs>
            {autoLayout.edges.map((e, i) => {
              const from = mergedBoxes.get(e.fromBoxId);
              const to = mergedBoxes.get(e.toBoxId);
              if (!from || !to) return null;
              const x1 = from.x + from.width / 2;
              const y1 = from.y + from.height;
              const x2 = to.x + to.width / 2;
              const y2 = to.y;
              const color = colorMap[e.kind];
              const isDropTarget = dropTargetEdgeIdx === i;
              const midY = y1 + (y2 - y1) / 2;
              const path = `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`;
              return (
                <g key={i}>
                  <path
                    d={path}
                    stroke={isDropTarget ? '#f0d97a' : color}
                    strokeWidth={isDropTarget ? 5 : 2}
                    fill="none"
                    markerEnd={`url(#arrow-${e.kind})`}
                    style={isDropTarget ? { filter: 'drop-shadow(0 0 4px rgba(240, 217, 122, 0.6))' } : undefined}
                  />
                  {e.label && (
                    <text
                      x={(x1 + x2) / 2}
                      y={midY - 4}
                      fill={isDropTarget ? '#f0d97a' : color}
                      fontSize="10"
                      fontFamily="system-ui, sans-serif"
                      fontWeight="600"
                      textAnchor="middle"
                      style={{ paintOrder: 'stroke', stroke: '#15110d', strokeWidth: 4 }}
                    >
                      {e.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Boxes — nodes and choice modules */}
          {Array.from(mergedBoxes.values()).map((box) => {
            if (box.kind === 'choice') {
              const parentNode = scene.nodes[box.parentId];
              const choice = parentNode?.choices?.[box.choiceIdx!];
              if (!choice) return null;
              const isCheck = !!choice.gameCheck;
              const isDragging = draggingBoxId === box.boxId;
              return (
                <div
                  key={box.boxId}
                  className={`vns-choice-box${isCheck ? ' check' : ''}${isDragging ? ' dragging' : ''}`}
                  style={{ left: box.x, top: box.y, width: box.width, height: box.height }}
                  onMouseDown={(e) => handleBoxMouseDown(e, box.boxId)}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!dragMovedRef.current) onSelectNode(box.parentId);
                  }}
                  title={`Choice: ${choice.label}`}
                >
                  <div className="vns-choice-box-label">{choice.label || <em>(unnamed)</em>}</div>
                  {isCheck && (
                    <div className="vns-choice-box-check">
                      {choice.gameCheck!.stat.toUpperCase()} {choice.gameCheck!.difficulty}
                    </div>
                  )}
                </div>
              );
            }

            // Dialogue node box
            const nodeId = box.parentId;
            const node = scene.nodes[nodeId];
            if (!node) return null;
            const speaker = CHARACTERS[node.speaker];
            const speakerName = speaker?.name || (node.speaker === 'narrator' ? 'Narrator' : node.speaker);
            const speakerColor = speaker?.color ?? '#8a8070';
            const isCurrent = nodeId === currentNodeId;
            const isStart = nodeId === scene.startNode;
            const hasChoices = !!node.choices && node.choices.length > 0;
            const hasConditions = !!node.gameConditionNext && node.gameConditionNext.length > 0;
            const isEnd = node.next === null && !hasChoices && !hasConditions;
            const isDragging = draggingBoxId === box.boxId;
            const textPreview = (node.text || '').slice(0, 60) + ((node.text?.length ?? 0) > 60 ? '\u2026' : '');

            return (
              <div
                key={box.boxId}
                className={`vns-tree-node${isCurrent ? ' current' : ''}${isStart ? ' start' : ''}${isEnd ? ' end' : ''}${isDragging ? ' dragging' : ''}`}
                style={{ left: box.x, top: box.y, width: box.width, height: box.height }}
                onMouseDown={(e) => handleBoxMouseDown(e, box.boxId)}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!dragMovedRef.current) onSelectNode(nodeId);
                }}
                title={`Drag to move \u00B7 Click to jump to ${nodeId}`}
              >
                <div className="vns-tree-node-speaker" style={{ color: speakerColor }}>{speakerName}</div>
                <div className="vns-tree-node-text">{textPreview || <em>(empty)</em>}</div>
                {isStart && <span className="vns-tree-node-tag start">START</span>}
                {isEnd && <span className="vns-tree-node-tag end">END</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
