import { describe, it, expect } from 'vitest';
import { getCampaignDef } from '../../data/campaigns/registry';
// Must import italy campaign to trigger registration side-effect
import '../../data/campaigns/italy/index';
import { getBattleConfig } from '../../data/battles/registry';
// Must import rivoli config to trigger registration side-effect
import '../../data/battles/rivoli/index';
import type { NPCTemplate } from '../../data/campaigns/types';

const campaignDef = getCampaignDef('italy');
const battleConfig = getBattleConfig('rivoli');

// ============================================================
// Italy campaign validation
// ============================================================

describe('Italy campaign validation', () => {
  it('campaign sequence is non-empty', () => {
    expect(campaignDef.sequence.length).toBeGreaterThan(0);
  });

  it('all camp nodes reference existing camp configs', () => {
    const campNodes = campaignDef.sequence.filter(
      (node) => node.type === 'camp',
    );
    expect(campNodes.length).toBeGreaterThan(0);

    for (const node of campNodes) {
      if (node.type === 'camp') {
        expect(
          campaignDef.camps[node.campId],
          `Camp config missing for campId "${node.campId}"`,
        ).toBeDefined();
      }
    }
  });

  it('all interlude nodes reference existing interlude defs', () => {
    const interludeNodes = campaignDef.sequence.filter(
      (node) => node.type === 'interlude',
    );
    expect(interludeNodes.length).toBeGreaterThan(0);

    for (const node of interludeNodes) {
      if (node.type === 'interlude') {
        expect(
          campaignDef.interludes[node.interludeId],
          `Interlude def missing for interludeId "${node.interludeId}"`,
        ).toBeDefined();
      }
    }
  });

  function assertNPCTemplateValid(npc: NPCTemplate, label: string) {
    expect(npc.id, `${label}: missing id`).toBeTruthy();
    expect(npc.name, `${label}: missing name`).toBeTruthy();
    expect(npc.role, `${label}: missing role`).toBeTruthy();
    expect(npc.rank, `${label}: missing rank`).toBeTruthy();
    expect(npc.personality, `${label}: missing personality`).toBeTruthy();
    expect(npc.baseStats, `${label}: missing baseStats`).toBeDefined();
    expect(
      typeof npc.baseStats.valor,
      `${label}: valor must be a number`,
    ).toBe('number');
    expect(
      typeof npc.baseStats.morale,
      `${label}: morale must be a number`,
    ).toBe('number');
    expect(
      typeof npc.baseStats.maxMorale,
      `${label}: maxMorale must be a number`,
    ).toBe('number');
    expect(
      typeof npc.baseStats.relationship,
      `${label}: relationship must be a number`,
    ).toBe('number');
  }

  it('NPC templates have required fields', () => {
    expect(campaignDef.npcs.length).toBeGreaterThan(0);
    for (const npc of campaignDef.npcs) {
      assertNPCTemplateValid(npc, `NPC "${npc.id}"`);
    }
  });

  it('replacement pool NPCs have required fields', () => {
    expect(campaignDef.replacementPool.length).toBeGreaterThan(0);
    for (const npc of campaignDef.replacementPool) {
      assertNPCTemplateValid(npc, `Replacement NPC "${npc.id}"`);
    }
  });

  it('all NPC template IDs are unique', () => {
    const allIds = [
      ...campaignDef.npcs.map((n) => n.id),
      ...campaignDef.replacementPool.map((n) => n.id),
    ];
    const uniqueIds = new Set(allIds);
    expect(
      uniqueIds.size,
      `Duplicate NPC IDs found: ${allIds.filter((id, i) => allIds.indexOf(id) !== i).join(', ')}`,
    ).toBe(allIds.length);
  });
});

// ============================================================
// Rivoli battle validation
// ============================================================

describe('Rivoli battle validation', () => {
  it('battle config has non-empty volleys array', () => {
    expect(battleConfig.volleys.length).toBeGreaterThan(0);
  });

  it('battle roles reference NPC IDs that exist in the campaign NPC list', () => {
    const campaignNpcIds = campaignDef.npcs.map((n) => n.id);
    const { roles } = battleConfig;

    if (roles.leftNeighbour) {
      expect(
        campaignNpcIds,
        `leftNeighbour "${roles.leftNeighbour}" not found in campaign NPCs`,
      ).toContain(roles.leftNeighbour);
    }

    if (roles.rightNeighbour) {
      expect(
        campaignNpcIds,
        `rightNeighbour "${roles.rightNeighbour}" not found in campaign NPCs`,
      ).toContain(roles.rightNeighbour);
    }

    expect(
      campaignNpcIds,
      `officer "${roles.officer}" not found in campaign NPCs`,
    ).toContain(roles.officer);

    if (roles.nco) {
      expect(
        campaignNpcIds,
        `nco "${roles.nco}" not found in campaign NPCs`,
      ).toContain(roles.nco);
    }
  });

  it('story beats have getNarrative, getChoices, and resolveChoice functions', () => {
    const beatIds = Object.keys(battleConfig.storyBeats);
    expect(beatIds.length).toBeGreaterThan(0);

    for (const id of beatIds) {
      const beat = battleConfig.storyBeats[Number(id)];
      expect(
        typeof beat.getNarrative,
        `StoryBeat ${id}: getNarrative must be a function`,
      ).toBe('function');
      expect(
        typeof beat.getChoices,
        `StoryBeat ${id}: getChoices must be a function`,
      ).toBe('function');
      expect(
        typeof beat.resolveChoice,
        `StoryBeat ${id}: resolveChoice must be a function`,
      ).toBe('function');
    }
  });

  it('battle has at least one encounter defined', () => {
    const encounterKeys = Object.keys(battleConfig.encounters);
    expect(encounterKeys.length).toBeGreaterThan(0);
  });

  it('init config has valid starting values', () => {
    expect(battleConfig.init.startingVolley).toBeGreaterThanOrEqual(1);
    expect(battleConfig.init.enemy.strength).toBeGreaterThan(0);
  });
});
