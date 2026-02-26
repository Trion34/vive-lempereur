import { describe, it, expect } from 'vitest';
import { CampaignPhase, MilitaryRank, NPCRole } from '../../types/enums';
import type { CampaignState } from '../../types/campaign';
import type { NPC } from '../../types/player';
import type { CampaignDef } from '../../data/campaigns/types';
import {
  createCampaignState,
  advanceSequence,
  getCurrentNode,
  getCampConfigFromDef,
  isLastNode,
  recordBattleVictory,
  nodeToPhase,
  replaceDeadNPCs,
} from '../../core/campaign';

// --- Test fixtures ---

const TEST_CAMPAIGN: CampaignDef = {
  id: 'test',
  title: 'Test Campaign',
  npcs: [],
  sequence: [
    { type: 'interlude', interludeId: 'prologue' },
    { type: 'camp', campId: 'camp-1' },
    { type: 'battle', battleId: 'battle-1' },
    { type: 'camp', campId: 'camp-2' },
    { type: 'interlude', interludeId: 'mid' },
    { type: 'battle', battleId: 'battle-2' },
  ],
  camps: {
    'camp-1': {
      id: 'camp-1',
      title: 'Camp 1',
      actionsTotal: 10,
      weather: 'cold',
      supplyLevel: 'scarce',
      openingNarrative: '',
      forcedEvents: [],
      randomEvents: [],
    },
    'camp-2': {
      id: 'camp-2',
      title: 'Camp 2',
      actionsTotal: 8,
      weather: 'clear',
      supplyLevel: 'adequate',
      openingNarrative: '',
      forcedEvents: [],
      randomEvents: [],
    },
  },
  interludes: {
    prologue: {
      fromBattle: '',
      toBattle: 'battle-1',
      narrative: ['Test'],
      splashText: 'Test',
    },
    mid: {
      fromBattle: 'battle-1',
      toBattle: 'battle-2',
      narrative: ['Mid'],
      splashText: 'Mid',
    },
  },
  replacementPool: [
    {
      id: 'rep1',
      name: 'Replacement One',
      role: NPCRole.Neighbour,
      rank: MilitaryRank.Private,
      personality: 'Quiet type',
      baseStats: { valor: 30, morale: 70, maxMorale: 100, relationship: 20 },
    },
    {
      id: 'rep2',
      name: 'Replacement Two',
      role: NPCRole.Neighbour,
      rank: MilitaryRank.Private,
      personality: 'Loud type',
      baseStats: { valor: 40, morale: 80, maxMorale: 100, relationship: 30 },
    },
    {
      id: 'rep3',
      name: 'Sergeant Rep',
      role: NPCRole.NCO,
      rank: MilitaryRank.Sergeant,
      personality: 'Stern',
      baseStats: { valor: 50, morale: 90, maxMorale: 100, relationship: 15 },
    },
  ],
};

function makeCampaignState(overrides: Partial<CampaignState> = {}): CampaignState {
  return {
    campaignId: 'test',
    sequenceIndex: 0,
    phase: CampaignPhase.Interlude,
    battlesCompleted: 0,
    currentBattle: 'battle-1',
    nextBattle: '',
    daysInCampaign: 5,
    npcDeaths: [],
    replacementsUsed: [],
    ...overrides,
  };
}

function makeNPC(overrides: Partial<NPC> = {}): NPC {
  return {
    id: 'npc1',
    name: 'Test NPC',
    role: NPCRole.Neighbour,
    rank: MilitaryRank.Private,
    relationship: 50,
    alive: true,
    wounded: false,
    morale: 70,
    maxMorale: 100,
    valor: 30,
    ...overrides,
  };
}

// --- Tests ---

describe('createCampaignState', () => {
  it('initializes at sequenceIndex 0 with phase derived from first node', () => {
    const state = createCampaignState(TEST_CAMPAIGN);
    expect(state.campaignId).toBe('test');
    expect(state.sequenceIndex).toBe(0);
    // First node is an interlude
    expect(state.phase).toBe(CampaignPhase.Interlude);
    expect(state.battlesCompleted).toBe(0);
    expect(state.currentBattle).toBe('battle-1');
    expect(state.daysInCampaign).toBe(0);
    expect(state.npcDeaths).toEqual([]);
    expect(state.replacementsUsed).toEqual([]);
  });

  it('sets phase to Camp when first node is a camp', () => {
    const campFirst: CampaignDef = {
      ...TEST_CAMPAIGN,
      sequence: [
        { type: 'camp', campId: 'camp-1' },
        { type: 'battle', battleId: 'battle-1' },
      ],
    };
    const state = createCampaignState(campFirst);
    expect(state.phase).toBe(CampaignPhase.Camp);
  });

  it('sets phase to Battle when first node is a battle', () => {
    const battleFirst: CampaignDef = {
      ...TEST_CAMPAIGN,
      sequence: [
        { type: 'battle', battleId: 'battle-1' },
      ],
    };
    const state = createCampaignState(battleFirst);
    expect(state.phase).toBe(CampaignPhase.Battle);
    expect(state.currentBattle).toBe('battle-1');
  });
});

describe('nodeToPhase', () => {
  it('maps camp node to CampaignPhase.Camp', () => {
    expect(nodeToPhase({ type: 'camp', campId: 'x' })).toBe(CampaignPhase.Camp);
  });

  it('maps battle node to CampaignPhase.Battle', () => {
    expect(nodeToPhase({ type: 'battle', battleId: 'x' })).toBe(CampaignPhase.Battle);
  });

  it('maps interlude node to CampaignPhase.Interlude', () => {
    expect(nodeToPhase({ type: 'interlude', interludeId: 'x' })).toBe(CampaignPhase.Interlude);
  });
});

describe('advanceSequence', () => {
  it('advances from index 0 to index 1 with correct phase', () => {
    const campaign = makeCampaignState({ sequenceIndex: 0 });
    const result = advanceSequence(campaign, TEST_CAMPAIGN);
    expect(result.sequenceIndex).toBe(1);
    expect(result.phase).toBe(CampaignPhase.Camp); // node 1 is camp
  });

  it('advances through all nodes correctly', () => {
    let campaign = makeCampaignState({ sequenceIndex: 0 });

    // 0 -> 1: interlude -> camp
    campaign = advanceSequence(campaign, TEST_CAMPAIGN);
    expect(campaign.sequenceIndex).toBe(1);
    expect(campaign.phase).toBe(CampaignPhase.Camp);

    // 1 -> 2: camp -> battle
    campaign = advanceSequence(campaign, TEST_CAMPAIGN);
    expect(campaign.sequenceIndex).toBe(2);
    expect(campaign.phase).toBe(CampaignPhase.Battle);

    // 2 -> 3: battle -> camp
    campaign = advanceSequence(campaign, TEST_CAMPAIGN);
    expect(campaign.sequenceIndex).toBe(3);
    expect(campaign.phase).toBe(CampaignPhase.Camp);

    // 3 -> 4: camp -> interlude
    campaign = advanceSequence(campaign, TEST_CAMPAIGN);
    expect(campaign.sequenceIndex).toBe(4);
    expect(campaign.phase).toBe(CampaignPhase.Interlude);

    // 4 -> 5: interlude -> battle
    campaign = advanceSequence(campaign, TEST_CAMPAIGN);
    expect(campaign.sequenceIndex).toBe(5);
    expect(campaign.phase).toBe(CampaignPhase.Battle);
  });

  it('transitions to Complete when advancing past last node', () => {
    const campaign = makeCampaignState({ sequenceIndex: 5 }); // last node
    const result = advanceSequence(campaign, TEST_CAMPAIGN);
    expect(result.sequenceIndex).toBe(6);
    expect(result.phase).toBe(CampaignPhase.Complete);
  });

  it('does not mutate the original campaign state', () => {
    const campaign = makeCampaignState({ sequenceIndex: 0 });
    advanceSequence(campaign, TEST_CAMPAIGN);
    expect(campaign.sequenceIndex).toBe(0);
    expect(campaign.phase).toBe(CampaignPhase.Interlude);
  });

  it('updates currentBattle when advancing to a battle node', () => {
    const campaign = makeCampaignState({ sequenceIndex: 1 });
    const result = advanceSequence(campaign, TEST_CAMPAIGN);
    expect(result.sequenceIndex).toBe(2);
    expect(result.currentBattle).toBe('battle-1');
  });
});

describe('getCurrentNode', () => {
  it('returns the node at the current sequenceIndex', () => {
    const campaign = makeCampaignState({ sequenceIndex: 0 });
    const node = getCurrentNode(campaign, TEST_CAMPAIGN);
    expect(node).toEqual({ type: 'interlude', interludeId: 'prologue' });
  });

  it('returns a camp node at index 1', () => {
    const campaign = makeCampaignState({ sequenceIndex: 1 });
    const node = getCurrentNode(campaign, TEST_CAMPAIGN);
    expect(node).toEqual({ type: 'camp', campId: 'camp-1' });
  });

  it('returns a battle node at index 2', () => {
    const campaign = makeCampaignState({ sequenceIndex: 2 });
    const node = getCurrentNode(campaign, TEST_CAMPAIGN);
    expect(node).toEqual({ type: 'battle', battleId: 'battle-1' });
  });

  it('returns null when past the end of the sequence', () => {
    const campaign = makeCampaignState({ sequenceIndex: 10 });
    const node = getCurrentNode(campaign, TEST_CAMPAIGN);
    expect(node).toBeNull();
  });
});

describe('getCampConfigFromDef', () => {
  it('returns camp config for a valid campId', () => {
    const config = getCampConfigFromDef('camp-1', TEST_CAMPAIGN);
    expect(config).not.toBeNull();
    expect(config!.id).toBe('camp-1');
    expect(config!.title).toBe('Camp 1');
    expect(config!.actionsTotal).toBe(10);
  });

  it('returns a different config for a different campId', () => {
    const config = getCampConfigFromDef('camp-2', TEST_CAMPAIGN);
    expect(config).not.toBeNull();
    expect(config!.id).toBe('camp-2');
    expect(config!.actionsTotal).toBe(8);
    expect(config!.weather).toBe('clear');
  });

  it('returns null for a non-existent campId', () => {
    const config = getCampConfigFromDef('nonexistent', TEST_CAMPAIGN);
    expect(config).toBeNull();
  });
});

describe('isLastNode', () => {
  it('returns false when at the first node', () => {
    const campaign = makeCampaignState({ sequenceIndex: 0 });
    expect(isLastNode(campaign, TEST_CAMPAIGN)).toBe(false);
  });

  it('returns false when in the middle of the sequence', () => {
    const campaign = makeCampaignState({ sequenceIndex: 3 });
    expect(isLastNode(campaign, TEST_CAMPAIGN)).toBe(false);
  });

  it('returns true when at the last node', () => {
    const campaign = makeCampaignState({ sequenceIndex: 5 });
    expect(isLastNode(campaign, TEST_CAMPAIGN)).toBe(true);
  });

  it('returns true when past the end', () => {
    const campaign = makeCampaignState({ sequenceIndex: 10 });
    expect(isLastNode(campaign, TEST_CAMPAIGN)).toBe(true);
  });
});

describe('recordBattleVictory', () => {
  it('increments battlesCompleted by 1', () => {
    const campaign = makeCampaignState({ battlesCompleted: 2 });
    const result = recordBattleVictory(campaign);
    expect(result.battlesCompleted).toBe(3);
  });

  it('does not mutate the original state', () => {
    const campaign = makeCampaignState({ battlesCompleted: 1 });
    recordBattleVictory(campaign);
    expect(campaign.battlesCompleted).toBe(1);
  });
});

describe('replaceDeadNPCs', () => {
  it('returns same array when no deaths', () => {
    const npcs = [makeNPC({ id: 'a' }), makeNPC({ id: 'b' })];
    const result = replaceDeadNPCs(npcs, [], TEST_CAMPAIGN.replacementPool, []);
    expect(result.npcs).toEqual(npcs);
    expect(result.newReplacements).toEqual([]);
  });

  it('replaces a dead Neighbour NPC with first available replacement', () => {
    const npcs = [
      makeNPC({ id: 'pierre', role: NPCRole.Neighbour }),
      makeNPC({ id: 'jb', role: NPCRole.Neighbour }),
    ];
    const result = replaceDeadNPCs(npcs, ['pierre'], TEST_CAMPAIGN.replacementPool, []);
    expect(result.npcs).toHaveLength(2);
    expect(result.npcs[0].id).toBe('rep1');
    expect(result.npcs[0].name).toBe('Replacement One');
    expect(result.npcs[0].alive).toBe(true);
    expect(result.npcs[0].wounded).toBe(false);
    expect(result.newReplacements).toEqual(['rep1']);
  });

  it('skips already-used replacements', () => {
    const npcs = [makeNPC({ id: 'pierre', role: NPCRole.Neighbour })];
    const result = replaceDeadNPCs(npcs, ['pierre'], TEST_CAMPAIGN.replacementPool, ['rep1']);
    expect(result.npcs[0].id).toBe('rep2');
    expect(result.newReplacements).toEqual(['rep2']);
  });

  it('replaces multiple dead NPCs', () => {
    const npcs = [
      makeNPC({ id: 'a', role: NPCRole.Neighbour }),
      makeNPC({ id: 'b', role: NPCRole.Neighbour }),
    ];
    const result = replaceDeadNPCs(npcs, ['a', 'b'], TEST_CAMPAIGN.replacementPool, []);
    expect(result.npcs[0].id).toBe('rep1');
    expect(result.npcs[1].id).toBe('rep2');
    expect(result.newReplacements).toEqual(['rep1', 'rep2']);
  });

  it('removes NPC when no replacement available for their role', () => {
    const npcs = [makeNPC({ id: 'officer1', role: NPCRole.Officer })];
    const result = replaceDeadNPCs(npcs, ['officer1'], TEST_CAMPAIGN.replacementPool, []);
    expect(result.npcs).toHaveLength(0);
    expect(result.newReplacements).toEqual([]);
  });

  it('matches replacement by role (NCO gets NCO replacement)', () => {
    const npcs = [makeNPC({ id: 'sgt', role: NPCRole.NCO, rank: MilitaryRank.Sergeant })];
    const result = replaceDeadNPCs(npcs, ['sgt'], TEST_CAMPAIGN.replacementPool, []);
    expect(result.npcs[0].id).toBe('rep3');
    expect(result.npcs[0].rank).toBe(MilitaryRank.Sergeant);
  });
});
