import { describe, it, expect } from 'vitest';
import { CampaignPhase, MilitaryRank, NPCRole } from '../../types/enums';
import type { CampaignState } from '../../types/campaign';
import type { NPC } from '../../types/player';
import type { CampaignDef } from '../../data/campaigns/types';
import {
  createCampaignState,
  replaceDeadNPCs,
  getCurrentInterlude,
  isLastBattle,
  getNextBattleEntry,
  getCurrentBattleEntry,
  advanceToPostBattle,
  advanceToInterlude,
  advanceToPreBattleCamp,
} from '../../core/campaign';

// --- Test fixtures ---

const TEST_CAMPAIGN: CampaignDef = {
  id: 'test',
  title: 'Test Campaign',
  battles: [
    { battleId: 'battle1', title: 'First Battle', subtitle: 'The beginning', implemented: true },
    { battleId: 'battle2', title: 'Second Battle', subtitle: 'The middle', implemented: true },
    { battleId: 'battle3', title: 'Third Battle', subtitle: 'The end', implemented: false },
  ],
  interludes: {
    'battle1-battle2': {
      fromBattle: 'battle1',
      toBattle: 'battle2',
      narrative: ['You marched onward.', 'The road stretched ahead.'],
      splashText: 'The March Continues',
    },
    'battle2-battle3': {
      fromBattle: 'battle2',
      toBattle: 'battle3',
      narrative: ['The final leg.'],
      splashText: 'The Last March',
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
    battleIndex: 0,
    phase: CampaignPhase.Battle,
    battlesCompleted: 0,
    currentBattle: 'battle1',
    nextBattle: 'battle2',
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
  it('initializes at battle index 0 in Prologue phase', () => {
    const state = createCampaignState(TEST_CAMPAIGN);
    expect(state.campaignId).toBe('test');
    expect(state.battleIndex).toBe(0);
    expect(state.phase).toBe(CampaignPhase.Prologue);
    expect(state.battlesCompleted).toBe(0);
    expect(state.currentBattle).toBe('battle1');
    expect(state.nextBattle).toBe('battle2');
    expect(state.daysInCampaign).toBe(0);
    expect(state.npcDeaths).toEqual([]);
    expect(state.replacementsUsed).toEqual([]);
  });

  it('handles single-battle campaign (no next battle)', () => {
    const singleBattle: CampaignDef = {
      ...TEST_CAMPAIGN,
      battles: [TEST_CAMPAIGN.battles[0]],
    };
    const state = createCampaignState(singleBattle);
    expect(state.nextBattle).toBe('');
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

describe('getCurrentInterlude', () => {
  it('returns interlude between battle1 and battle2', () => {
    const campaign = makeCampaignState({ battleIndex: 0 });
    const interlude = getCurrentInterlude(campaign, TEST_CAMPAIGN);
    expect(interlude).not.toBeNull();
    expect(interlude!.fromBattle).toBe('battle1');
    expect(interlude!.toBattle).toBe('battle2');
    expect(interlude!.splashText).toBe('The March Continues');
  });

  it('returns null for last battle (no next battle)', () => {
    const campaign = makeCampaignState({ battleIndex: 2 });
    const interlude = getCurrentInterlude(campaign, TEST_CAMPAIGN);
    expect(interlude).toBeNull();
  });
});

describe('isLastBattle', () => {
  it('returns false for first battle', () => {
    const campaign = makeCampaignState({ battleIndex: 0 });
    expect(isLastBattle(campaign, TEST_CAMPAIGN)).toBe(false);
  });

  it('returns true for final battle', () => {
    const campaign = makeCampaignState({ battleIndex: 2 });
    expect(isLastBattle(campaign, TEST_CAMPAIGN)).toBe(true);
  });
});

describe('getNextBattleEntry', () => {
  it('returns next battle when one exists', () => {
    const campaign = makeCampaignState({ battleIndex: 0 });
    const next = getNextBattleEntry(campaign, TEST_CAMPAIGN);
    expect(next).not.toBeNull();
    expect(next!.battleId).toBe('battle2');
  });

  it('returns null at last battle', () => {
    const campaign = makeCampaignState({ battleIndex: 2 });
    expect(getNextBattleEntry(campaign, TEST_CAMPAIGN)).toBeNull();
  });
});

describe('getCurrentBattleEntry', () => {
  it('returns current battle entry', () => {
    const campaign = makeCampaignState({ battleIndex: 1 });
    const entry = getCurrentBattleEntry(campaign, TEST_CAMPAIGN);
    expect(entry.battleId).toBe('battle2');
    expect(entry.title).toBe('Second Battle');
  });
});

describe('advanceToPostBattle', () => {
  it('transitions to PostBattleCamp and increments battlesCompleted', () => {
    const campaign = makeCampaignState({ battlesCompleted: 1 });
    const result = advanceToPostBattle(campaign);
    expect(result.phase).toBe(CampaignPhase.PostBattleCamp);
    expect(result.battlesCompleted).toBe(2);
    // Original not mutated
    expect(campaign.phase).toBe(CampaignPhase.Battle);
    expect(campaign.battlesCompleted).toBe(1);
  });
});

describe('advanceToInterlude', () => {
  it('transitions to Interlude and advances battle index', () => {
    const campaign = makeCampaignState({ battleIndex: 0, phase: CampaignPhase.PostBattleCamp });
    const result = advanceToInterlude(campaign, TEST_CAMPAIGN);
    expect(result.phase).toBe(CampaignPhase.Interlude);
    expect(result.battleIndex).toBe(1);
    expect(result.currentBattle).toBe('battle2');
    expect(result.nextBattle).toBe('battle3');
  });

  it('transitions to Complete if at last battle', () => {
    const campaign = makeCampaignState({ battleIndex: 2, phase: CampaignPhase.PostBattleCamp });
    const result = advanceToInterlude(campaign, TEST_CAMPAIGN);
    expect(result.phase).toBe(CampaignPhase.Complete);
    // Battle index unchanged
    expect(result.battleIndex).toBe(2);
  });

  it('sets nextBattle to empty string when advancing to final battle', () => {
    const campaign = makeCampaignState({ battleIndex: 1, phase: CampaignPhase.PostBattleCamp });
    const result = advanceToInterlude(campaign, TEST_CAMPAIGN);
    expect(result.currentBattle).toBe('battle3');
    expect(result.nextBattle).toBe('');
  });
});

describe('advanceToPreBattleCamp', () => {
  it('transitions to PreBattleCamp', () => {
    const campaign = makeCampaignState({ phase: CampaignPhase.Interlude });
    const result = advanceToPreBattleCamp(campaign);
    expect(result.phase).toBe(CampaignPhase.PreBattleCamp);
  });
});
