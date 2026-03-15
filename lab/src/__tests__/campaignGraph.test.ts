import { describe, it, expect } from 'vitest';
import {
  computeLayout,
  computeEdges,
} from '../components/campaign/CampaignGraph';
import { CHAPTERS_SEED } from '../stores/campaignEditorStore';

describe('campaignGraph layout', () => {
  it('computes a position for every node', () => {
    const positions = computeLayout(CHAPTERS_SEED, {});
    const allNodeIds = CHAPTERS_SEED.flatMap((ch) => ch.nodes.map((n) => n.id));
    for (const id of allNodeIds) {
      expect(positions[id]).toBeDefined();
      expect(positions[id].x).toBeGreaterThanOrEqual(0);
      expect(positions[id].y).toBeGreaterThanOrEqual(0);
    }
  });

  it('positions nodes in different chapters at different x coordinates', () => {
    const positions = computeLayout(CHAPTERS_SEED, {});
    const ch1FirstNode = CHAPTERS_SEED[0].nodes[0];
    const ch2FirstNode = CHAPTERS_SEED[1].nodes[0];
    expect(positions[ch2FirstNode.id].x).toBeGreaterThan(positions[ch1FirstNode.id].x);
  });

  it('positions nodes within same chapter at same x, increasing y', () => {
    const positions = computeLayout(CHAPTERS_SEED, {});
    const ch1 = CHAPTERS_SEED[0]; // has 3 nodes
    expect(ch1.nodes.length).toBe(3);
    for (let i = 0; i < ch1.nodes.length - 1; i++) {
      const a = positions[ch1.nodes[i].id];
      const b = positions[ch1.nodes[i + 1].id];
      expect(a.x).toBe(b.x);
      expect(b.y).toBeGreaterThan(a.y);
    }
  });

  it('respects custom positions when provided', () => {
    const custom = { 'voltri-prologue': { x: 999, y: 888 } };
    const positions = computeLayout(CHAPTERS_SEED, custom);
    expect(positions['voltri-prologue'].x).toBe(999);
    expect(positions['voltri-prologue'].y).toBe(888);
    // Other nodes should still have auto positions
    expect(positions['voltri-garrison'].x).not.toBe(999);
  });

  it('includes chapterId and nodeId in position result', () => {
    const positions = computeLayout(CHAPTERS_SEED, {});
    const pos = positions['voltri-prologue'];
    expect(pos.chapterId).toBe('ch1');
    expect(pos.nodeId).toBe('voltri-prologue');
  });
});

describe('campaignGraph edges', () => {
  const positions = computeLayout(CHAPTERS_SEED, {});

  it('creates intra-chapter edges for sequential nodes', () => {
    const edges = computeEdges(CHAPTERS_SEED, positions);
    // ch1 has 3 nodes → 2 intra-chapter edges
    const ch1Edges = edges.filter(
      (e) => e.id.startsWith('voltri-prologue-') || e.id.startsWith('voltri-garrison-'),
    );
    const intraEdges = ch1Edges.filter((e) => !e.crossChapter);
    expect(intraEdges.length).toBe(2);
  });

  it('creates inter-chapter edges between adjacent chapters', () => {
    const edges = computeEdges(CHAPTERS_SEED, positions);
    const crossEdges = edges.filter((e) => e.crossChapter);
    // 13 chapters → 12 inter-chapter edges
    expect(crossEdges.length).toBe(12);
  });

  it('edges have valid from/to coordinates', () => {
    const edges = computeEdges(CHAPTERS_SEED, positions);
    for (const e of edges) {
      expect(typeof e.from.x).toBe('number');
      expect(typeof e.from.y).toBe('number');
      expect(typeof e.to.x).toBe('number');
      expect(typeof e.to.y).toBe('number');
      expect(isNaN(e.from.x)).toBe(false);
      expect(isNaN(e.to.y)).toBe(false);
    }
  });

  it('total edges = intra-chapter + inter-chapter', () => {
    const edges = computeEdges(CHAPTERS_SEED, positions);
    // Intra-chapter: sum of (nodes.length - 1) for each chapter
    const intraCount = CHAPTERS_SEED.reduce((sum, ch) => sum + Math.max(ch.nodes.length - 1, 0), 0);
    const crossCount = CHAPTERS_SEED.length - 1;
    expect(edges.length).toBe(intraCount + crossCount);
  });
});
