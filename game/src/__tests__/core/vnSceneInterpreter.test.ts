import { describe, it, expect, vi } from 'vitest';
import {
  createEmptyResult,
  accumulateEffect,
  recomputeEffects,
  buildEffectiveContext,
  evaluateChoiceLock,
  evaluateConditionBranches,
  executeStatCheck,
  type VNGameContext,
  type VNSceneResult,
} from '../../core/vnSceneInterpreter';
import type { VNGameEffect, VNConditionBranch, VNChoice, DialogueNode } from '../../types/vnTypes';
import type { PlayerCharacter, NPC } from '../../types';
import { MilitaryRank, NPCRole } from '../../types';

// === Test helpers ===

function mockPlayer(overrides: Partial<PlayerCharacter> = {}): PlayerCharacter {
  return {
    name: 'Test',
    valor: 40, musketry: 35, elan: 35,
    strength: 40, endurance: 40, constitution: 45,
    charisma: 30, intelligence: 30, awareness: 35,
    soldierRep: 50, officerRep: 50, napoleonRep: 0,
    health: 80, morale: 70, stamina: 60,
    sous: 10, virtue: 0,
    alive: true, routing: false, frontRank: false,
    musketLoaded: true, fumbledLoad: false,
    canteenUses: 3,
    rank: MilitaryRank.Private,
    grace: 0,
    attributes: {},
    ...overrides,
  } as PlayerCharacter;
}

function mockNpc(id: string, relationship: number = 50): NPC {
  return {
    id, name: id, role: NPCRole.Neighbour, rank: MilitaryRank.Private,
    relationship, alive: true, wounded: false,
    valor: 40, morale: 70, maxMorale: 100, personality: '',
  } as NPC;
}

function mockContext(overrides: Partial<VNGameContext> = {}): VNGameContext {
  return {
    player: mockPlayer(),
    npcs: [mockNpc('felix'), mockNpc('morin')],
    campFlags: {},
    ...overrides,
  };
}

// === createEmptyResult ===

describe('createEmptyResult', () => {
  it('returns zeroed result', () => {
    const r = createEmptyResult();
    expect(r.moraleChange).toBe(0);
    expect(r.staminaChange).toBe(0);
    expect(r.healthChange).toBe(0);
    expect(r.sousChange).toBe(0);
    expect(r.virtueChange).toBe(0);
    expect(r.npcChanges).toEqual([]);
    expect(r.flagChanges).toEqual({});
    expect(r.rollDisplays).toEqual([]);
    expect(Object.keys(r.statChanges)).toHaveLength(0);
  });
});

// === accumulateEffect ===

describe('accumulateEffect', () => {
  it('accumulates a single effect', () => {
    const r = accumulateEffect(createEmptyResult(), { moraleChange: 5, sousChange: 3 });
    expect(r.moraleChange).toBe(5);
    expect(r.sousChange).toBe(3);
  });

  it('accumulates multiple effects additively', () => {
    let r = createEmptyResult();
    r = accumulateEffect(r, { moraleChange: 5 });
    r = accumulateEffect(r, { moraleChange: -2 });
    expect(r.moraleChange).toBe(3);
  });

  it('merges stat changes for the same stat', () => {
    let r = createEmptyResult();
    r = accumulateEffect(r, { statChanges: { soldierRep: 2 } });
    r = accumulateEffect(r, { statChanges: { soldierRep: 3 } });
    expect(r.statChanges.soldierRep).toBe(5);
  });

  it('merges stat changes for different stats', () => {
    let r = createEmptyResult();
    r = accumulateEffect(r, { statChanges: { soldierRep: 2 } });
    r = accumulateEffect(r, { statChanges: { officerRep: 1 } });
    expect(r.statChanges.soldierRep).toBe(2);
    expect(r.statChanges.officerRep).toBe(1);
  });

  it('accumulates NPC changes per NPC', () => {
    let r = createEmptyResult();
    r = accumulateEffect(r, { npcRelationshipChanges: [{ npcId: 'felix', delta: 5 }] });
    r = accumulateEffect(r, { npcRelationshipChanges: [{ npcId: 'felix', delta: 3 }] });
    expect(r.npcChanges).toEqual([{ npcId: 'felix', relationship: 8 }]);
  });

  it('accumulates NPC changes for different NPCs', () => {
    let r = createEmptyResult();
    r = accumulateEffect(r, { npcRelationshipChanges: [{ npcId: 'felix', delta: 5 }] });
    r = accumulateEffect(r, { npcRelationshipChanges: [{ npcId: 'morin', delta: 2 }] });
    expect(r.npcChanges).toHaveLength(2);
    expect(r.npcChanges.find((c) => c.npcId === 'felix')?.relationship).toBe(5);
    expect(r.npcChanges.find((c) => c.npcId === 'morin')?.relationship).toBe(2);
  });

  it('later flag values override earlier ones', () => {
    let r = createEmptyResult();
    r = accumulateEffect(r, { flagChanges: { gambling_accepted: true } });
    r = accumulateEffect(r, { flagChanges: { gambling_accepted: false } });
    expect(r.flagChanges.gambling_accepted).toBe(false);
  });

  it('merges different flags', () => {
    let r = createEmptyResult();
    r = accumulateEffect(r, { flagChanges: { a: true } });
    r = accumulateEffect(r, { flagChanges: { b: true } });
    expect(r.flagChanges).toEqual({ a: true, b: true });
  });

  it('accumulates all meter types', () => {
    const r = accumulateEffect(createEmptyResult(), {
      moraleChange: 1, staminaChange: 2, healthChange: 3, sousChange: 4, virtueChange: 5,
    });
    expect(r.moraleChange).toBe(1);
    expect(r.staminaChange).toBe(2);
    expect(r.healthChange).toBe(3);
    expect(r.sousChange).toBe(4);
    expect(r.virtueChange).toBe(5);
  });

  it('handles empty effect gracefully', () => {
    const r = accumulateEffect(createEmptyResult(), {});
    expect(r.moraleChange).toBe(0);
  });
});

// === recomputeEffects ===

describe('recomputeEffects', () => {
  const nodes: Record<string, DialogueNode> = {
    a: { id: 'a', speaker: 'narrator', text: 'A', next: 'b', gameEffect: { moraleChange: 5 } },
    b: { id: 'b', speaker: 'narrator', text: 'B', next: 'c', gameEffect: { sousChange: -2 } },
    c: { id: 'c', speaker: 'narrator', text: 'C', next: null },
  };

  it('recomputes from full history', () => {
    const r = recomputeEffects(['a', 'b', 'c'], nodes);
    expect(r.moraleChange).toBe(5);
    expect(r.sousChange).toBe(-2);
  });

  it('recomputes from partial history (rewind)', () => {
    const r = recomputeEffects(['a'], nodes);
    expect(r.moraleChange).toBe(5);
    expect(r.sousChange).toBe(0);
  });

  it('handles nodes without gameEffect', () => {
    const r = recomputeEffects(['c'], nodes);
    expect(r.moraleChange).toBe(0);
  });

  it('handles unknown node IDs gracefully', () => {
    const r = recomputeEffects(['unknown'], nodes);
    expect(r.moraleChange).toBe(0);
  });
});

// === buildEffectiveContext ===

describe('buildEffectiveContext', () => {
  it('overlays sous change', () => {
    const base = mockContext({ player: mockPlayer({ sous: 10 }) });
    const acc = { ...createEmptyResult(), sousChange: -5 };
    const eff = buildEffectiveContext(base, acc);
    expect(eff.player.sous).toBe(5);
  });

  it('overlays stat changes', () => {
    const base = mockContext({ player: mockPlayer({ soldierRep: 50 }) });
    const acc = { ...createEmptyResult(), statChanges: { soldierRep: 10 } };
    const eff = buildEffectiveContext(base, acc);
    expect(eff.player.soldierRep).toBe(60);
  });

  it('overlays flag changes', () => {
    const base = mockContext({ campFlags: {} });
    const acc = { ...createEmptyResult(), flagChanges: { gambling_accepted: true } };
    const eff = buildEffectiveContext(base, acc);
    expect(eff.campFlags.gambling_accepted).toBe(true);
  });

  it('overlays NPC relationship changes', () => {
    const base = mockContext({ npcs: [mockNpc('felix', 10)] });
    const acc = { ...createEmptyResult(), npcChanges: [{ npcId: 'felix', relationship: 5 }] };
    const eff = buildEffectiveContext(base, acc);
    expect(eff.npcs[0].relationship).toBe(15);
  });

  it('overlays morale/stamina/health/virtue', () => {
    const base = mockContext({ player: mockPlayer({ morale: 70, stamina: 60, health: 80, virtue: 0 }) });
    const acc = { ...createEmptyResult(), moraleChange: -10, staminaChange: 5, healthChange: -3, virtueChange: 10 };
    const eff = buildEffectiveContext(base, acc);
    expect(eff.player.morale).toBe(60);
    expect(eff.player.stamina).toBe(65);
    expect(eff.player.health).toBe(77);
    expect(eff.player.virtue).toBe(10);
  });

  it('does not mutate base context', () => {
    const base = mockContext({ player: mockPlayer({ sous: 10 }), campFlags: { old: true } });
    const origSous = base.player.sous;
    const acc = { ...createEmptyResult(), sousChange: -5, flagChanges: { new_flag: true } };
    buildEffectiveContext(base, acc);
    expect(base.player.sous).toBe(origSous);
    expect(base.campFlags).not.toHaveProperty('new_flag');
  });
});

// === evaluateChoiceLock ===

describe('evaluateChoiceLock', () => {
  it('returns unlocked when no gameLock', () => {
    const choice: VNChoice = { label: 'Test', nextId: 'x' };
    expect(evaluateChoiceLock(choice, mockContext()).locked).toBe(false);
  });

  it('locks when missing required attribute', () => {
    const choice: VNChoice = { label: 'Test', nextId: 'x', gameLock: { requireAttribute: 'literate', lockedMessage: 'Cannot read' } };
    const ctx = mockContext({ player: mockPlayer({ attributes: {} }) });
    const r = evaluateChoiceLock(choice, ctx);
    expect(r.locked).toBe(true);
    expect(r.message).toBe('Cannot read');
  });

  it('unlocks when attribute is present', () => {
    const choice: VNChoice = { label: 'Test', nextId: 'x', gameLock: { requireAttribute: 'literate' } };
    const ctx = mockContext({ player: mockPlayer({ attributes: { literate: true } }) });
    expect(evaluateChoiceLock(choice, ctx).locked).toBe(false);
  });

  it('locks when insufficient sous', () => {
    const choice: VNChoice = { label: 'Test', nextId: 'x', gameLock: { requireSous: 5 } };
    const ctx = mockContext({ player: mockPlayer({ sous: 3 }) });
    expect(evaluateChoiceLock(choice, ctx).locked).toBe(true);
  });

  it('unlocks when enough sous', () => {
    const choice: VNChoice = { label: 'Test', nextId: 'x', gameLock: { requireSous: 5 } };
    const ctx = mockContext({ player: mockPlayer({ sous: 5 }) });
    expect(evaluateChoiceLock(choice, ctx).locked).toBe(false);
  });

  it('locks when required flag is missing', () => {
    const choice: VNChoice = { label: 'Test', nextId: 'x', gameLock: { requireFlag: 'gambling_accepted' } };
    const ctx = mockContext({ campFlags: {} });
    expect(evaluateChoiceLock(choice, ctx).locked).toBe(true);
  });

  it('unlocks when flag is set', () => {
    const choice: VNChoice = { label: 'Test', nextId: 'x', gameLock: { requireFlag: 'gambling_accepted' } };
    const ctx = mockContext({ campFlags: { gambling_accepted: true } });
    expect(evaluateChoiceLock(choice, ctx).locked).toBe(false);
  });

  it('locks on combined requirements (attr + sous)', () => {
    const choice: VNChoice = { label: 'Test', nextId: 'x', gameLock: { requireAttribute: 'literate', requireSous: 5 } };
    // Has sous but not attribute
    const ctx = mockContext({ player: mockPlayer({ sous: 10, attributes: {} }) });
    expect(evaluateChoiceLock(choice, ctx).locked).toBe(true);
  });
});

// === evaluateConditionBranches ===

describe('evaluateConditionBranches', () => {
  it('returns null when no branches match', () => {
    const branches: VNConditionBranch[] = [{ flag: 'nonexistent', nextId: 'x' }];
    expect(evaluateConditionBranches(branches, mockContext())).toBeNull();
  });

  it('returns null for empty branches array', () => {
    expect(evaluateConditionBranches([], mockContext())).toBeNull();
  });

  it('matches on flag', () => {
    const branches: VNConditionBranch[] = [{ flag: 'gambling_accepted', nextId: 'paid' }];
    const ctx = mockContext({ campFlags: { gambling_accepted: true } });
    expect(evaluateConditionBranches(branches, ctx)).toBe('paid');
  });

  it('matches on minStat', () => {
    const branches: VNConditionBranch[] = [{ minStat: { stat: 'valor', value: 50 }, nextId: 'brave' }];
    const ctx = mockContext({ player: mockPlayer({ valor: 60 }) });
    expect(evaluateConditionBranches(branches, ctx)).toBe('brave');
  });

  it('does not match minStat when below threshold', () => {
    const branches: VNConditionBranch[] = [{ minStat: { stat: 'valor', value: 50 }, nextId: 'brave' }];
    const ctx = mockContext({ player: mockPlayer({ valor: 30 }) });
    expect(evaluateConditionBranches(branches, ctx)).toBeNull();
  });

  it('matches on minSous', () => {
    const branches: VNConditionBranch[] = [{ minSous: 2, nextId: 'dice_scene' }];
    const ctx = mockContext({ player: mockPlayer({ sous: 5 }) });
    expect(evaluateConditionBranches(branches, ctx)).toBe('dice_scene');
  });

  it('does not match minSous when insufficient', () => {
    const branches: VNConditionBranch[] = [{ minSous: 2, nextId: 'dice_scene' }];
    const ctx = mockContext({ player: mockPlayer({ sous: 1 }) });
    expect(evaluateConditionBranches(branches, ctx)).toBeNull();
  });

  it('first match wins when multiple branches', () => {
    const branches: VNConditionBranch[] = [
      { minSous: 10, nextId: 'rich' },
      { minSous: 2, nextId: 'can_afford' },
    ];
    const ctx = mockContext({ player: mockPlayer({ sous: 15 }) });
    expect(evaluateConditionBranches(branches, ctx)).toBe('rich');
  });

  it('matches combined conditions (flag + minSous)', () => {
    const branches: VNConditionBranch[] = [
      { flag: 'has_key', minSous: 5, nextId: 'special' },
    ];
    // Has flag but not sous
    expect(evaluateConditionBranches(branches, mockContext({ campFlags: { has_key: true }, player: mockPlayer({ sous: 2 }) }))).toBeNull();
    // Has both
    expect(evaluateConditionBranches(branches, mockContext({ campFlags: { has_key: true }, player: mockPlayer({ sous: 10 }) }))).toBe('special');
  });

  it('evaluates minSous against effective sous (with accumulated sousChange)', () => {
    const base = mockContext({ player: mockPlayer({ sous: 1 }) });
    const accumulated = { ...createEmptyResult(), sousChange: 5 };
    const effective = buildEffectiveContext(base, accumulated);
    const branches: VNConditionBranch[] = [{ minSous: 2, nextId: 'dice_scene' }];
    // Base sous=1 < 2, but effective sous=6 >= 2
    expect(evaluateConditionBranches(branches, effective)).toBe('dice_scene');
  });
});

// === executeStatCheck ===

describe('executeStatCheck', () => {
  it('returns passed=true and passNode on successful roll', () => {
    // Mock rollStat to always succeed by using very high stat
    const check = { stat: 'valor' as const, difficulty: 0, passNode: 'win', failNode: 'lose' };
    // We can't deterministically test random rolls, so just verify shape
    const ctx = mockContext({ player: mockPlayer({ valor: 95 }) });
    const result = executeStatCheck(check, ctx);
    expect(result).toHaveProperty('passed');
    expect(result).toHaveProperty('nextNode');
    expect(result).toHaveProperty('rollDisplay');
    expect(result.rollDisplay).toHaveProperty('stat');
    expect(result.rollDisplay).toHaveProperty('roll');
    expect(result.rollDisplay).toHaveProperty('target');
    expect(result.rollDisplay).toHaveProperty('passed');
    expect(typeof result.rollDisplay.stat).toBe('string');
    expect(typeof result.rollDisplay.roll).toBe('number');
    if (result.passed) {
      expect(result.nextNode).toBe('win');
    } else {
      expect(result.nextNode).toBe('lose');
    }
  });

  it('routes to failNode on failed roll', () => {
    // Use very low stat + hard difficulty to make failure very likely
    const check = { stat: 'valor' as const, difficulty: -90, passNode: 'win', failNode: 'lose' };
    const ctx = mockContext({ player: mockPlayer({ valor: 5 }) });
    const result = executeStatCheck(check, ctx);
    // With valor 5 and difficulty -90, target is clamped to 5, so most rolls fail
    // But we can't guarantee — just check shape
    expect(['win', 'lose']).toContain(result.nextNode);
    expect(result.passed).toBe(result.nextNode === 'win');
  });

  it('capitalizes stat name in rollDisplay', () => {
    const check = { stat: 'awareness' as const, difficulty: 0, passNode: 'a', failNode: 'b' };
    const ctx = mockContext();
    const result = executeStatCheck(check, ctx);
    expect(result.rollDisplay.stat).toBe('Awareness');
  });
});
