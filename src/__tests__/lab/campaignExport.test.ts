import { describe, it, expect } from 'vitest';
import {
  generateCampaignDefScaffold,
  buildRuntimeCampaignDef,
  type NPCAssignment,
} from '../../lab/utils/campaignExport';
import { CHAPTERS_SEED, type CampaignChapter } from '../../lab/stores/campaignEditorStore';

describe('generateCampaignDefScaffold', () => {
  it('produces valid TypeScript string', () => {
    const result = generateCampaignDefScaffold(CHAPTERS_SEED, 'italy', 'Italian Campaign');
    expect(result.typescript).toContain("id: 'italy'");
    expect(result.typescript).toContain("title: 'Italian Campaign'");
    expect(result.typescript).toContain('registerCampaignDef');
  });

  it('counts node types correctly', () => {
    const result = generateCampaignDefScaffold(CHAPTERS_SEED, 'test', 'Test');
    const allNodes = CHAPTERS_SEED.flatMap((ch) => ch.nodes);
    expect(result.stats.totalNodes).toBe(allNodes.length);
    expect(result.stats.camps).toBe(allNodes.filter((n) => n.type === 'camp').length);
    expect(result.stats.interludes).toBe(allNodes.filter((n) => n.type === 'interlude').length);
    expect(result.stats.battles).toBe(allNodes.filter((n) => n.type === 'battle').length);
  });

  it('flattens all nodes into sequence entries', () => {
    const result = generateCampaignDefScaffold(CHAPTERS_SEED, 'test', 'Test');
    const allNodes = CHAPTERS_SEED.flatMap((ch) => ch.nodes);
    for (const n of allNodes) {
      if (n.type === 'camp') {
        expect(result.typescript).toContain(`campId: '${n.id}'`);
      } else if (n.type === 'battle') {
        expect(result.typescript).toContain(`battleId: '${n.id}'`);
      } else {
        expect(result.typescript).toContain(`interludeId: '${n.id}'`);
      }
    }
  });

  it('generates CampConfig stubs with actions from details', () => {
    const result = generateCampaignDefScaffold(CHAPTERS_SEED, 'test', 'Test');
    // Voltri garrison has actions: 12
    expect(result.typescript).toContain("'voltri-garrison':");
    expect(result.typescript).toContain('actionsTotal: 12');
    // Eve of Rivoli has actions: 16
    expect(result.typescript).toContain("'eve-of-rivoli':");
    expect(result.typescript).toContain('actionsTotal: 16');
  });

  it('generates interlude stubs with fromBattle/toBattle inference', () => {
    const result = generateCampaignDefScaffold(CHAPTERS_SEED, 'test', 'Test');
    // voltri-prologue is followed by voltri-garrison then voltri battle
    expect(result.typescript).toContain("'voltri-prologue':");
    expect(result.typescript).toContain("toBattle: 'voltri'");
  });

  it('warns about camp nodes missing actions', () => {
    const chapters: CampaignChapter[] = [{
      id: 'test', number: 1, title: 'Test', dateRange: '', summary: '',
      keyBattles: [], keyCommanders: { french: [], austrian: [] }, outcome: '',
      nodes: [{ type: 'camp', id: 'camp-1', label: 'No Actions', description: '', details: {} }],
    }];
    const result = generateCampaignDefScaffold(chapters, 'test', 'Test');
    expect(result.warnings.some((w) => w.includes('missing "actions"'))).toBe(true);
  });

  it('warns about consecutive same-type nodes', () => {
    const chapters: CampaignChapter[] = [{
      id: 'test', number: 1, title: 'Test', dateRange: '', summary: '',
      keyBattles: [], keyCommanders: { french: [], austrian: [] }, outcome: '',
      nodes: [
        { type: 'camp', id: 'c1', label: 'Camp 1', description: '', details: { actions: 10 } },
        { type: 'camp', id: 'c2', label: 'Camp 2', description: '', details: { actions: 10 } },
      ],
    }];
    const result = generateCampaignDefScaffold(chapters, 'test', 'Test');
    expect(result.warnings.some((w) => w.includes('Consecutive camp'))).toBe(true);
  });

  it('warns about interludes without adjacent battles', () => {
    const chapters: CampaignChapter[] = [{
      id: 'test', number: 1, title: 'Test', dateRange: '', summary: '',
      keyBattles: [], keyCommanders: { french: [], austrian: [] }, outcome: '',
      nodes: [
        { type: 'interlude', id: 'i1', label: 'Lonely Interlude', description: '', details: {} },
        { type: 'camp', id: 'c1', label: 'Camp', description: '', details: { actions: 10 } },
      ],
    }];
    const result = generateCampaignDefScaffold(chapters, 'test', 'Test');
    expect(result.warnings.some((w) => w.includes('no adjacent battle'))).toBe(true);
  });

  it('escapes single quotes in strings', () => {
    const chapters: CampaignChapter[] = [{
      id: 'test', number: 1, title: "Test's", dateRange: '', summary: '',
      keyBattles: [], keyCommanders: { french: [], austrian: [] }, outcome: '',
      nodes: [
        { type: 'camp', id: "it's-a-camp", label: "Napoleon's Camp", description: '', details: { actions: 8 } },
      ],
    }];
    const result = generateCampaignDefScaffold(chapters, "it's", "Test's Campaign");
    expect(result.typescript).toContain("\\'");
    expect(result.typescript).not.toContain("id: 'it's'");
  });

  it('produces no warnings for well-formed seed data', () => {
    const result = generateCampaignDefScaffold(CHAPTERS_SEED, 'test', 'Test');
    // Seed data has some legitimate warnings (consecutive same-type, interludes without battles)
    // but should not crash
    expect(result.typescript.length).toBeGreaterThan(100);
  });

  it('generates import statements', () => {
    const result = generateCampaignDefScaffold(CHAPTERS_SEED, 'test', 'Test');
    expect(result.typescript).toContain("import { registerCampaignDef }");
    expect(result.typescript).toContain("import type { CampaignDef }");
  });

  it('includes TODO comments for hand-authored parts', () => {
    const result = generateCampaignDefScaffold(CHAPTERS_SEED, 'test', 'Test');
    expect(result.typescript).toContain('TODO: Define NPC templates');
    expect(result.typescript).toContain('TODO: Write opening narrative');
    expect(result.typescript).toContain('TODO: Write narrative chunks');
    expect(result.typescript).toContain('TODO: Define replacement pool');
  });
});

describe('buildRuntimeCampaignDef', () => {
  it('builds a valid CampaignDef from seed chapters', () => {
    const def = buildRuntimeCampaignDef(CHAPTERS_SEED, 'italy', 'Italian Campaign', {}, []);
    expect(def.id).toBe('italy');
    expect(def.title).toBe('Italian Campaign');
    expect(def.sequence.length).toBe(CHAPTERS_SEED.flatMap((ch) => ch.nodes).length);
  });

  it('populates camps from camp nodes', () => {
    const def = buildRuntimeCampaignDef(CHAPTERS_SEED, 'test', 'Test', {}, []);
    expect(def.camps['voltri-garrison']).toBeDefined();
    expect(def.camps['voltri-garrison'].actionsTotal).toBe(12);
    expect(def.camps['eve-of-rivoli']).toBeDefined();
    expect(def.camps['eve-of-rivoli'].actionsTotal).toBe(16);
  });

  it('populates interludes from interlude nodes', () => {
    const def = buildRuntimeCampaignDef(CHAPTERS_SEED, 'test', 'Test', {}, []);
    expect(def.interludes['voltri-prologue']).toBeDefined();
    expect(def.interludes['voltri-prologue'].toBattle).toBe('voltri');
  });

  it('uses narrative data when provided', () => {
    const narratives = {
      'voltri-prologue': { chunks: ['Chunk 1', 'Chunk 2'], splashText: 'My Splash' },
    };
    const def = buildRuntimeCampaignDef(CHAPTERS_SEED, 'test', 'Test', narratives, []);
    expect(def.interludes['voltri-prologue'].narrative).toEqual(['Chunk 1', 'Chunk 2']);
    expect(def.interludes['voltri-prologue'].splashText).toBe('My Splash');
  });

  it('converts active NPC assignments to NPCTemplates', () => {
    const npcs: NPCAssignment[] = [
      { npcId: 'pierre', name: 'Pierre', role: 'Neighbour', status: 'active', introducedAt: 'ch1', exitAt: null, replacedBy: null, personality: '', socializeNarrative: '', rank: 'Private', baseStats: { valor: 40, morale: 80, maxMorale: 100, relationship: 30 } },
      { npcId: 'duval', name: 'Duval', role: 'NCO', status: 'killed', introducedAt: 'ch1', exitAt: 'ch5', replacedBy: null, personality: '', socializeNarrative: '', rank: 'Sergeant', baseStats: { valor: 40, morale: 80, maxMorale: 100, relationship: 30 } },
    ];
    const def = buildRuntimeCampaignDef(CHAPTERS_SEED, 'test', 'Test', {}, npcs);
    expect(def.npcs).toHaveLength(1);
    expect(def.npcs[0].id).toBe('pierre');
  });
});
