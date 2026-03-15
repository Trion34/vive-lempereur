import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  useCampaignEditorStore,
  CHAPTERS_SEED,
  type CampaignChapter,
  type NPCAssignment,
  type CampEventData,
} from '../../lab/stores/campaignEditorStore';

function resetStore() {
  useCampaignEditorStore.setState({
    chapters: structuredClone(CHAPTERS_SEED),
    dirty: false,
    selectedChapter: null,
    selectedNode: null,
    zoomLevel: 'campaign',
    viewMode: 'list',
    nodePositions: {},
    npcAssignments: [],
    interludeNarratives: {},
    campEvents: {},
  });
}

function getState() {
  return useCampaignEditorStore.getState();
}

describe('campaignEditorStore', () => {
  beforeEach(() => {
    localStorage.clear();
    resetStore();
  });

  /* ============================================================== */
  /*  Initial state                                                  */
  /* ============================================================== */

  it('initializes with seed data', () => {
    const { chapters } = getState();
    expect(chapters).toHaveLength(CHAPTERS_SEED.length);
    expect(chapters[0].title).toBe('Army of Italy');
    expect(chapters[12].title).toBe('March on Vienna');
  });

  it('starts clean (not dirty)', () => {
    expect(getState().dirty).toBe(false);
  });

  it('starts at campaign zoom with nothing selected', () => {
    const s = getState();
    expect(s.zoomLevel).toBe('campaign');
    expect(s.selectedChapter).toBeNull();
    expect(s.selectedNode).toBeNull();
  });

  /* ============================================================== */
  /*  Navigation                                                     */
  /* ============================================================== */

  it('selectChapter sets chapter and clears node', () => {
    getState().selectChapter('ch3');
    expect(getState().selectedChapter).toBe('ch3');
    expect(getState().selectedNode).toBeNull();
  });

  it('selectNode sets node', () => {
    getState().selectNode('voltri');
    expect(getState().selectedNode).toBe('voltri');
  });

  it('setZoom changes zoom level', () => {
    getState().setZoom('node');
    expect(getState().zoomLevel).toBe('node');
  });

  /* ============================================================== */
  /*  Chapter CRUD                                                   */
  /* ============================================================== */

  it('updateChapter patches a chapter field', () => {
    getState().updateChapter('ch1', { title: 'Nice Garrison' });
    expect(getState().chapters[0].title).toBe('Nice Garrison');
    expect(getState().dirty).toBe(true);
  });

  it('updateChapter preserves other fields', () => {
    const before = structuredClone(getState().chapters[0]);
    getState().updateChapter('ch1', { title: 'Changed' });
    const after = getState().chapters[0];
    expect(after.dateRange).toBe(before.dateRange);
    expect(after.summary).toBe(before.summary);
    expect(after.nodes).toHaveLength(before.nodes.length);
  });

  it('updateChapter does nothing for non-existent id', () => {
    const before = structuredClone(getState().chapters);
    getState().updateChapter('nonexistent', { title: 'X' });
    expect(getState().chapters).toEqual(before);
  });

  it('addChapter appends at end by default', () => {
    const countBefore = getState().chapters.length;
    getState().addChapter();
    const chs = getState().chapters;
    expect(chs).toHaveLength(countBefore + 1);
    expect(chs[chs.length - 1].title).toBe('New Chapter');
    expect(chs[chs.length - 1].number).toBe(countBefore + 1);
  });

  it('addChapter inserts after specified id', () => {
    getState().addChapter('ch2');
    const chs = getState().chapters;
    expect(chs[2].title).toBe('New Chapter');
    expect(chs[2].number).toBe(3);
    // ch3 (Mondovì) should now be at index 3 with number 4
    expect(chs[3].title).toBe('Mondovì');
    expect(chs[3].number).toBe(4);
  });

  it('addChapter renumbers all chapters', () => {
    getState().addChapter('ch1');
    const chs = getState().chapters;
    chs.forEach((ch, i) => {
      expect(ch.number).toBe(i + 1);
    });
  });

  it('removeChapter deletes and renumbers', () => {
    const countBefore = getState().chapters.length;
    getState().removeChapter('ch2');
    const chs = getState().chapters;
    expect(chs).toHaveLength(countBefore - 1);
    expect(chs.find((c) => c.id === 'ch2')).toBeUndefined();
    chs.forEach((ch, i) => {
      expect(ch.number).toBe(i + 1);
    });
  });

  it('removeChapter clears selection if it was selected', () => {
    getState().selectChapter('ch2');
    getState().setZoom('chapter');
    getState().removeChapter('ch2');
    expect(getState().selectedChapter).toBeNull();
    expect(getState().zoomLevel).toBe('campaign');
  });

  it('reorderChapter moves up', () => {
    getState().reorderChapter('ch3', 'up');
    const chs = getState().chapters;
    expect(chs[1].id).toBe('ch3');
    expect(chs[2].id).toBe('ch2');
    expect(chs[1].number).toBe(2);
    expect(chs[2].number).toBe(3);
  });

  it('reorderChapter moves down', () => {
    getState().reorderChapter('ch1', 'down');
    const chs = getState().chapters;
    expect(chs[0].id).toBe('ch2');
    expect(chs[1].id).toBe('ch1');
  });

  it('reorderChapter does nothing at boundary', () => {
    const before = getState().chapters.map((c) => c.id);
    getState().reorderChapter('ch1', 'up'); // already first
    expect(getState().chapters.map((c) => c.id)).toEqual(before);
    getState().reorderChapter('ch13', 'down'); // already last
    expect(getState().chapters.map((c) => c.id)).toEqual(before);
  });

  /* ============================================================== */
  /*  Node CRUD                                                      */
  /* ============================================================== */

  it('updateNode patches a node field', () => {
    getState().updateNode('ch1', 'voltri-prologue', { label: 'New Label' });
    const ch = getState().chapters.find((c) => c.id === 'ch1')!;
    expect(ch.nodes[0].label).toBe('New Label');
    expect(getState().dirty).toBe(true);
  });

  it('updateNode can change node type', () => {
    getState().updateNode('ch1', 'voltri-prologue', { type: 'battle' });
    const ch = getState().chapters.find((c) => c.id === 'ch1')!;
    expect(ch.nodes[0].type).toBe('battle');
  });

  it('updateNode can update details', () => {
    getState().updateNode('ch1', 'voltri-garrison', { details: { actions: 16, weather: 'warm' } });
    const ch = getState().chapters.find((c) => c.id === 'ch1')!;
    const node = ch.nodes.find((n) => n.id === 'voltri-garrison')!;
    expect(node.details.actions).toBe(16);
    expect(node.details.weather).toBe('warm');
  });

  it('addNode appends at end by default', () => {
    getState().addNode('ch1');
    const ch = getState().chapters.find((c) => c.id === 'ch1')!;
    expect(ch.nodes).toHaveLength(4);
    expect(ch.nodes[3].label).toBe('New Interlude');
  });

  it('addNode inserts after specified node', () => {
    getState().addNode('ch1', 'voltri-prologue', 'camp');
    const ch = getState().chapters.find((c) => c.id === 'ch1')!;
    expect(ch.nodes).toHaveLength(4);
    expect(ch.nodes[1].type).toBe('camp');
    expect(ch.nodes[1].label).toBe('New Camp');
  });

  it('addNode creates correct type label', () => {
    getState().addNode('ch1', undefined, 'battle');
    const ch = getState().chapters.find((c) => c.id === 'ch1')!;
    const last = ch.nodes[ch.nodes.length - 1];
    expect(last.type).toBe('battle');
    expect(last.label).toBe('New Battle');
  });

  it('removeNode deletes node', () => {
    getState().removeNode('ch1', 'voltri-prologue');
    const ch = getState().chapters.find((c) => c.id === 'ch1')!;
    expect(ch.nodes).toHaveLength(2);
    expect(ch.nodes.find((n) => n.id === 'voltri-prologue')).toBeUndefined();
  });

  it('removeNode clears selection if that node was selected', () => {
    getState().selectNode('voltri-prologue');
    getState().setZoom('node');
    getState().removeNode('ch1', 'voltri-prologue');
    expect(getState().selectedNode).toBeNull();
    expect(getState().zoomLevel).toBe('chapter');
  });

  it('reorderNode moves up', () => {
    getState().reorderNode('ch1', 'voltri-garrison', 'up');
    const ch = getState().chapters.find((c) => c.id === 'ch1')!;
    expect(ch.nodes[0].id).toBe('voltri-garrison');
    expect(ch.nodes[1].id).toBe('voltri-prologue');
  });

  it('reorderNode moves down', () => {
    getState().reorderNode('ch1', 'voltri-prologue', 'down');
    const ch = getState().chapters.find((c) => c.id === 'ch1')!;
    expect(ch.nodes[0].id).toBe('voltri-garrison');
    expect(ch.nodes[1].id).toBe('voltri-prologue');
  });

  it('reorderNode does nothing at boundary', () => {
    const before = getState().chapters.find((c) => c.id === 'ch1')!.nodes.map((n) => n.id);
    getState().reorderNode('ch1', 'voltri-prologue', 'up'); // already first
    expect(getState().chapters.find((c) => c.id === 'ch1')!.nodes.map((n) => n.id)).toEqual(before);
  });

  /* ============================================================== */
  /*  localStorage persistence                                       */
  /* ============================================================== */

  it('save persists to localStorage and clears dirty', () => {
    getState().updateChapter('ch1', { title: 'Modified' });
    expect(getState().dirty).toBe(true);
    getState().save();
    expect(getState().dirty).toBe(false);
    const stored = JSON.parse(localStorage.getItem('lab_campaign_editor')!);
    expect(stored[0].title).toBe('Modified');
  });

  it('loadSaved restores from localStorage', () => {
    const modified = structuredClone(CHAPTERS_SEED);
    modified[0].title = 'Loaded Title';
    localStorage.setItem('lab_campaign_editor', JSON.stringify(modified));
    const result = getState().loadSaved();
    expect(result).toBe(true);
    expect(getState().chapters[0].title).toBe('Loaded Title');
    expect(getState().dirty).toBe(false);
  });

  it('loadSaved returns false when nothing stored', () => {
    expect(getState().loadSaved()).toBe(false);
  });

  it('loadSaved returns false for invalid JSON', () => {
    localStorage.setItem('lab_campaign_editor', 'not json');
    expect(getState().loadSaved()).toBe(false);
  });

  it('loadSaved returns false for empty array', () => {
    localStorage.setItem('lab_campaign_editor', '[]');
    expect(getState().loadSaved()).toBe(false);
  });

  it('auto-persists on chapter update', () => {
    getState().updateChapter('ch1', { title: 'Auto' });
    const stored = JSON.parse(localStorage.getItem('lab_campaign_editor')!);
    expect(stored[0].title).toBe('Auto');
  });

  it('auto-persists on node add', () => {
    getState().addNode('ch1', undefined, 'battle');
    const stored = JSON.parse(localStorage.getItem('lab_campaign_editor')!);
    expect(stored[0].nodes).toHaveLength(4);
  });

  /* ============================================================== */
  /*  Export / Import roundtrip                                      */
  /* ============================================================== */

  it('exportJSON produces a CampaignBlueprint with version field', () => {
    const json = getState().exportJSON();
    const parsed = JSON.parse(json);
    expect(parsed.version).toBe(1);
    expect(parsed.exportedAt).toBeDefined();
    expect(parsed.chapters).toHaveLength(CHAPTERS_SEED.length);
    expect(parsed.chapters[0].id).toBe('ch1');
    expect(Array.isArray(parsed.npcAssignments)).toBe(true);
    expect(typeof parsed.interludeNarratives).toBe('object');
    expect(typeof parsed.campEvents).toBe('object');
  });

  it('exportJSON includes NPC assignments and narratives', () => {
    getState().addNPC({
      npcId: 'test-npc', name: 'Test', role: 'NCO',
      status: 'active', introducedAt: 'ch1', exitAt: null, replacedBy: null,
      personality: '', socializeNarrative: '', rank: 'Private',
      baseStats: { valor: 40, morale: 80, maxMorale: 100, relationship: 30 },
    });
    getState().updateInterludeNarrative('voltri-prologue', ['Chunk'], 'Splash');
    const json = getState().exportJSON();
    const parsed = JSON.parse(json);
    expect(parsed.npcAssignments).toHaveLength(1);
    expect(parsed.npcAssignments[0].npcId).toBe('test-npc');
    expect(parsed.interludeNarratives['voltri-prologue'].chunks).toEqual(['Chunk']);
  });

  it('importJSON restores from blueprint format', () => {
    getState().updateChapter('ch5', { title: 'Milano' });
    getState().addNPC({
      npcId: 'roundtrip', name: 'Roundtrip', role: 'Neighbour',
      status: 'active', introducedAt: 'ch1', exitAt: null, replacedBy: null,
      personality: 'brave', socializeNarrative: '', rank: 'Private',
      baseStats: { valor: 40, morale: 80, maxMorale: 100, relationship: 30 },
    });
    getState().updateInterludeNarrative('voltri-prologue', ['A', 'B'], 'MySplash');
    const json = getState().exportJSON();
    resetStore();
    expect(getState().chapters[4].title).toBe('Milan');
    const result = getState().importJSON(json);
    expect(result).toBe(true);
    expect(getState().chapters[4].title).toBe('Milano');
    expect(getState().npcAssignments).toHaveLength(1);
    expect(getState().npcAssignments[0].npcId).toBe('roundtrip');
    expect(getState().interludeNarratives['voltri-prologue'].chunks).toEqual(['A', 'B']);
  });

  it('importJSON accepts legacy chapters-only format', () => {
    const legacyJson = JSON.stringify(CHAPTERS_SEED);
    const result = getState().importJSON(legacyJson);
    expect(result).toBe(true);
    expect(getState().chapters).toHaveLength(CHAPTERS_SEED.length);
  });

  it('importJSON rejects invalid JSON string', () => {
    expect(getState().importJSON('not valid')).toBe(false);
  });

  it('importJSON rejects empty array', () => {
    expect(getState().importJSON('[]')).toBe(false);
  });

  it('importJSON rejects array missing required fields', () => {
    expect(getState().importJSON('[{"foo": "bar"}]')).toBe(false);
  });

  it('importJSON rejects blueprint with empty chapters', () => {
    const bp = JSON.stringify({ version: 1, exportedAt: '', chapters: [], npcAssignments: [], interludeNarratives: {}, campEvents: {} });
    expect(getState().importJSON(bp)).toBe(false);
  });

  it('importJSON rejects blueprint with invalid chapters', () => {
    const bp = JSON.stringify({ version: 1, exportedAt: '', chapters: [{ foo: 'bar' }], npcAssignments: [], interludeNarratives: {}, campEvents: {} });
    expect(getState().importJSON(bp)).toBe(false);
  });

  it('importJSON resets selection and zoom', () => {
    getState().selectChapter('ch3');
    getState().setZoom('chapter');
    getState().importJSON(JSON.stringify(CHAPTERS_SEED));
    expect(getState().selectedChapter).toBeNull();
    expect(getState().selectedNode).toBeNull();
    expect(getState().zoomLevel).toBe('campaign');
  });

  /* ============================================================== */
  /*  Reset                                                          */
  /* ============================================================== */

  it('resetToSeed restores original data', () => {
    getState().updateChapter('ch1', { title: 'Changed' });
    getState().addChapter();
    getState().resetToSeed();
    expect(getState().chapters).toHaveLength(CHAPTERS_SEED.length);
    expect(getState().chapters[0].title).toBe('Army of Italy');
    expect(getState().dirty).toBe(false);
  });

  it('resetToSeed clears selection', () => {
    getState().selectChapter('ch5');
    getState().selectNode('milan-garrison');
    getState().setZoom('node');
    getState().resetToSeed();
    expect(getState().selectedChapter).toBeNull();
    expect(getState().selectedNode).toBeNull();
    expect(getState().zoomLevel).toBe('campaign');
  });

  /* ============================================================== */
  /*  Data integrity                                                 */
  /* ============================================================== */

  it('mutations do not affect seed data', () => {
    getState().updateChapter('ch1', { title: 'Mutated' });
    expect(CHAPTERS_SEED[0].title).toBe('Army of Italy');
  });

  it('seed data has 13 chapters', () => {
    expect(CHAPTERS_SEED).toHaveLength(13);
  });

  it('seed data has 31 total nodes', () => {
    const total = CHAPTERS_SEED.reduce((sum, ch) => sum + ch.nodes.length, 0);
    expect(total).toBe(31);
  });

  it('all seed chapters have sequential numbers', () => {
    CHAPTERS_SEED.forEach((ch, i) => {
      expect(ch.number).toBe(i + 1);
    });
  });

  it('all seed node ids are unique', () => {
    const ids = CHAPTERS_SEED.flatMap((ch) => ch.nodes.map((n) => n.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  /* ============================================================== */
  /*  View mode                                                      */
  /* ============================================================== */

  it('starts in list view mode', () => {
    expect(getState().viewMode).toBe('list');
  });

  it('setViewMode toggles between list and graph', () => {
    getState().setViewMode('graph');
    expect(getState().viewMode).toBe('graph');
    getState().setViewMode('list');
    expect(getState().viewMode).toBe('list');
  });

  /* ============================================================== */
  /*  Node positions (graph drag)                                    */
  /* ============================================================== */

  it('starts with empty nodePositions', () => {
    expect(getState().nodePositions).toEqual({});
  });

  it('updateNodePosition stores custom position', () => {
    getState().updateNodePosition('voltri-prologue', 100, 200);
    expect(getState().nodePositions['voltri-prologue']).toEqual({ x: 100, y: 200 });
  });

  it('updateNodePosition persists to localStorage', () => {
    getState().updateNodePosition('voltri', 50, 75);
    const stored = JSON.parse(localStorage.getItem('lab_campaign_editor_positions')!);
    expect(stored['voltri']).toEqual({ x: 50, y: 75 });
  });

  it('updateNodePosition accumulates multiple positions', () => {
    getState().updateNodePosition('voltri-prologue', 10, 20);
    getState().updateNodePosition('voltri', 30, 40);
    const pos = getState().nodePositions;
    expect(Object.keys(pos)).toHaveLength(2);
    expect(pos['voltri-prologue']).toEqual({ x: 10, y: 20 });
    expect(pos['voltri']).toEqual({ x: 30, y: 40 });
  });

  it('clearPositions resets all positions', () => {
    getState().updateNodePosition('voltri-prologue', 10, 20);
    getState().clearPositions();
    expect(getState().nodePositions).toEqual({});
  });

  it('clearPositions clears localStorage', () => {
    getState().updateNodePosition('voltri', 50, 75);
    getState().clearPositions();
    const stored = JSON.parse(localStorage.getItem('lab_campaign_editor_positions')!);
    expect(stored).toEqual({});
  });

  it('resetToSeed clears positions', () => {
    getState().updateNodePosition('voltri', 50, 75);
    getState().resetToSeed();
    expect(getState().nodePositions).toEqual({});
  });

  it('importJSON clears positions', () => {
    getState().updateNodePosition('voltri', 50, 75);
    getState().importJSON(JSON.stringify(CHAPTERS_SEED));
    expect(getState().nodePositions).toEqual({});
  });

  /* ============================================================== */
  /*  NPC assignments                                                */
  /* ============================================================== */

  it('starts with empty NPC assignments (after reset)', () => {
    expect(getState().npcAssignments).toEqual([]);
  });

  it('addNPC appends an assignment', () => {
    const npc: NPCAssignment = {
      npcId: 'pierre', name: 'Pierre', role: 'Neighbour',
      status: 'active', introducedAt: 'ch11', exitAt: null, replacedBy: null,
      personality: '', socializeNarrative: '', rank: 'Private', baseStats: { valor: 40, morale: 80, maxMorale: 100, relationship: 30 },
    };
    getState().addNPC(npc);
    expect(getState().npcAssignments).toHaveLength(1);
    expect(getState().npcAssignments[0].npcId).toBe('pierre');
  });

  it('addNPC persists to localStorage', () => {
    const npc: NPCAssignment = {
      npcId: 'test', name: 'Test', role: 'NCO',
      status: 'active', introducedAt: 'ch1', exitAt: null, replacedBy: null,
      personality: '', socializeNarrative: '', rank: 'Private', baseStats: { valor: 40, morale: 80, maxMorale: 100, relationship: 30 },
    };
    getState().addNPC(npc);
    const stored = JSON.parse(localStorage.getItem('lab_campaign_editor_npcs')!);
    expect(stored).toHaveLength(1);
  });

  it('updateNPC patches an assignment', () => {
    const npc: NPCAssignment = {
      npcId: 'pierre', name: 'Pierre', role: 'Neighbour',
      status: 'active', introducedAt: 'ch11', exitAt: null, replacedBy: null,
      personality: '', socializeNarrative: '', rank: 'Private', baseStats: { valor: 40, morale: 80, maxMorale: 100, relationship: 30 },
    };
    getState().addNPC(npc);
    getState().updateNPC('pierre', { status: 'wounded' });
    expect(getState().npcAssignments[0].status).toBe('wounded');
  });

  it('removeNPC deletes an assignment', () => {
    const npc: NPCAssignment = {
      npcId: 'pierre', name: 'Pierre', role: 'Neighbour',
      status: 'active', introducedAt: 'ch11', exitAt: null, replacedBy: null,
      personality: '', socializeNarrative: '', rank: 'Private', baseStats: { valor: 40, morale: 80, maxMorale: 100, relationship: 30 },
    };
    getState().addNPC(npc);
    getState().removeNPC('pierre');
    expect(getState().npcAssignments).toHaveLength(0);
  });

  it('killNPC sets status, exitAt, and replacedBy', () => {
    const npc: NPCAssignment = {
      npcId: 'duval', name: 'Sergeant Duval', role: 'NCO',
      status: 'active', introducedAt: 'ch11', exitAt: null, replacedBy: null,
      personality: '', socializeNarrative: '', rank: 'Private', baseStats: { valor: 40, morale: 80, maxMorale: 100, relationship: 30 },
    };
    getState().addNPC(npc);
    getState().killNPC('duval', 'ch11', 'renard');
    const killed = getState().npcAssignments[0];
    expect(killed.status).toBe('killed');
    expect(killed.exitAt).toBe('ch11');
    expect(killed.replacedBy).toBe('renard');
  });

  it('seedNPCsFromCampaign populates default assignments', () => {
    getState().seedNPCsFromCampaign();
    const npcs = getState().npcAssignments;
    expect(npcs.length).toBeGreaterThan(0);
    expect(npcs.find((n) => n.npcId === 'morin')).toBeDefined();
    expect(npcs.find((n) => n.npcId === 'pierre')).toBeDefined();
  });

  it('seedNPCsFromCampaign persists to localStorage', () => {
    getState().seedNPCsFromCampaign();
    const stored = JSON.parse(localStorage.getItem('lab_campaign_editor_npcs')!);
    expect(stored.length).toBeGreaterThan(0);
  });

  it('killNPC without replacedBy sets replacedBy to null', () => {
    const npc: NPCAssignment = {
      npcId: 'test', name: 'Test', role: 'NCO',
      status: 'active', introducedAt: 'ch1', exitAt: null, replacedBy: null,
      personality: '', socializeNarrative: '', rank: 'Private', baseStats: { valor: 40, morale: 80, maxMorale: 100, relationship: 30 },
    };
    getState().addNPC(npc);
    getState().killNPC('test', 'ch5');
    expect(getState().npcAssignments[0].replacedBy).toBeNull();
  });

  /* ============================================================== */
  /*  Interlude narratives                                           */
  /* ============================================================== */

  it('starts with empty interlude narratives', () => {
    expect(getState().interludeNarratives).toEqual({});
  });

  it('updateInterludeNarrative stores chunks and splashText', () => {
    getState().updateInterludeNarrative('voltri-prologue', ['Chunk 1', 'Chunk 2'], 'Splash');
    const narr = getState().interludeNarratives['voltri-prologue'];
    expect(narr.chunks).toEqual(['Chunk 1', 'Chunk 2']);
    expect(narr.splashText).toBe('Splash');
  });

  it('updateInterludeNarrative persists to localStorage', () => {
    getState().updateInterludeNarrative('test', ['A'], 'B');
    const stored = JSON.parse(localStorage.getItem('lab_campaign_editor_narratives')!);
    expect(stored.test).toEqual({ chunks: ['A'], splashText: 'B' });
  });
});
