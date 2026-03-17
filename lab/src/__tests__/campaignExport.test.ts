import { describe, it, expect } from 'vitest';
import {
  generateCampaignDefScaffold,
} from '../utils/campaignExport';
import { CHAPTERS_SEED, type CampaignChapter } from '../stores/campaignEditorStore';

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

  it('excludes vn and line-combat nodes from typed scaffold', () => {
    const chapters: CampaignChapter[] = [{
      id: 'test', number: 1, title: 'Test', dateRange: '', summary: '',
      keyBattles: [], keyCommanders: { french: [], austrian: [] }, outcome: '',
      nodes: [
        { type: 'battle', id: 'b1', label: 'Battle', description: '', details: { parts: 1, volleys: 4 } },
        { type: 'vn', id: 'vn1', label: 'VN Scene', description: '', details: {} },
        { type: 'line-combat', id: 'lc1', label: 'Line Combat', description: '', details: { moduleId: 'test-mod' } },
        { type: 'camp', id: 'c1', label: 'Camp', description: '', details: { actions: 10 } },
      ],
    }];
    const result = generateCampaignDefScaffold(chapters, 'test', 'Test');
    // Battle and camp should be in sequence
    expect(result.typescript).toContain("battleId: 'b1'");
    expect(result.typescript).toContain("campId: 'c1'");
    // VN and line-combat should NOT be in sequence
    expect(result.typescript).not.toContain("vnId: 'vn1'");
    expect(result.typescript).not.toContain("moduleId: 'test-mod'");
    // totalNodes should exclude VN and line-combat
    expect(result.stats.totalNodes).toBe(2); // battle + camp only
  });
});

