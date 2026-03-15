import { describe, it, expect } from 'vitest';
import { MilitaryRank } from '../../types';
import {
  checkPromotionEligibility,
  applyPromotion,
  getNextRank,
  getRankIndex,
  getRankLabel,
  getRankAbbreviation,
  RANK_REQUIREMENTS,
} from '../../core/rankPromotion';
import { mockGameState } from '../helpers/mockFactories';

function makePC(overrides: Record<string, unknown> = {}) {
  const gs = mockGameState();
  return { ...gs.player, ...overrides };
}

// ============================================================
// RANK ORDERING
// ============================================================

describe('getRankIndex', () => {
  it('returns correct index for each rank', () => {
    expect(getRankIndex(MilitaryRank.Private)).toBe(0);
    expect(getRankIndex(MilitaryRank.Corporal)).toBe(1);
    expect(getRankIndex(MilitaryRank.Sergeant)).toBe(2);
    expect(getRankIndex(MilitaryRank.Lieutenant)).toBe(3);
    expect(getRankIndex(MilitaryRank.Captain)).toBe(4);
  });
});

describe('getNextRank', () => {
  it('returns next rank for non-max ranks', () => {
    expect(getNextRank(MilitaryRank.Private)).toBe(MilitaryRank.Corporal);
    expect(getNextRank(MilitaryRank.Corporal)).toBe(MilitaryRank.Sergeant);
    expect(getNextRank(MilitaryRank.Sergeant)).toBe(MilitaryRank.Lieutenant);
    expect(getNextRank(MilitaryRank.Lieutenant)).toBe(MilitaryRank.Captain);
  });

  it('returns null for Captain', () => {
    expect(getNextRank(MilitaryRank.Captain)).toBeNull();
  });
});

// ============================================================
// PROMOTION ELIGIBILITY
// ============================================================

describe('checkPromotionEligibility', () => {
  it('returns null for Captain (max rank)', () => {
    const pc = makePC({ rank: MilitaryRank.Captain });
    expect(checkPromotionEligibility(pc, 100)).toBeNull();
  });

  describe('Private → Corporal', () => {
    it('eligible when meets all requirements', () => {
      const pc = makePC({
        rank: MilitaryRank.Private,
        soldierRep: 50,
        officerRep: 40,
      });
      const result = checkPromotionEligibility(pc, 10);
      expect(result).not.toBeNull();
      expect(result!.eligible).toBe(true);
      expect(result!.nextRank).toBe(MilitaryRank.Corporal);
      expect(result!.meetsReputation).toBe(true);
      expect(result!.canAfford).toBe(true);
    });

    it('ineligible when soldierRep too low', () => {
      const pc = makePC({
        rank: MilitaryRank.Private,
        soldierRep: 30, // need 40
        officerRep: 40,
      });
      const result = checkPromotionEligibility(pc, 10);
      expect(result!.eligible).toBe(false);
      expect(result!.meetsReputation).toBe(false);
      expect(result!.failedGates).toContainEqual(expect.stringContaining('Soldier Rep'));
    });

    it('ineligible when cannot afford glory cost', () => {
      const pc = makePC({
        rank: MilitaryRank.Private,
        soldierRep: 50,
        officerRep: 40,
      });
      const result = checkPromotionEligibility(pc, 3); // need 5
      expect(result!.eligible).toBe(false);
      expect(result!.canAfford).toBe(false);
      expect(result!.meetsReputation).toBe(true);
    });
  });

  describe('Corporal → Sergeant', () => {
    it('eligible with correct requirements', () => {
      const pc = makePC({
        rank: MilitaryRank.Corporal,
        soldierRep: 65,
        officerRep: 55,
      });
      const result = checkPromotionEligibility(pc, 20);
      expect(result!.eligible).toBe(true);
      expect(result!.nextRank).toBe(MilitaryRank.Sergeant);
      expect(result!.requirement.gloryCost).toBe(15);
    });
  });

  describe('Sergeant → Lieutenant', () => {
    it('requires napoleonRep >= 10', () => {
      const pc = makePC({
        rank: MilitaryRank.Sergeant,
        officerRep: 75,
        napoleonRep: 5, // need 10
      });
      const result = checkPromotionEligibility(pc, 50);
      expect(result!.eligible).toBe(false);
      expect(result!.failedGates).toContainEqual(expect.stringContaining('Napoleon Rep'));
    });

    it('eligible with all requirements met', () => {
      const pc = makePC({
        rank: MilitaryRank.Sergeant,
        officerRep: 75,
        napoleonRep: 15,
      });
      const result = checkPromotionEligibility(pc, 50);
      expect(result!.eligible).toBe(true);
      expect(result!.requirement.gloryCost).toBe(30);
    });
  });

  describe('Lieutenant → Captain', () => {
    it('requires napoleonRep >= 30', () => {
      const pc = makePC({
        rank: MilitaryRank.Lieutenant,
        napoleonRep: 25, // need 30
      });
      const result = checkPromotionEligibility(pc, 100);
      expect(result!.eligible).toBe(false);
    });

    it('eligible when napoleonRep >= 30 and can afford 50 glory', () => {
      const pc = makePC({
        rank: MilitaryRank.Lieutenant,
        napoleonRep: 35,
      });
      const result = checkPromotionEligibility(pc, 50);
      expect(result!.eligible).toBe(true);
      expect(result!.requirement.gloryCost).toBe(50);
    });
  });
});

// ============================================================
// APPLY PROMOTION
// ============================================================

describe('applyPromotion', () => {
  it('changes player rank and returns glory cost', () => {
    const pc = makePC({ rank: MilitaryRank.Private });
    const cost = applyPromotion(pc, MilitaryRank.Corporal);
    expect(pc.rank).toBe(MilitaryRank.Corporal);
    expect(cost).toBe(5);
  });

  it('applies Sergeant promotion correctly', () => {
    const pc = makePC({ rank: MilitaryRank.Corporal });
    const cost = applyPromotion(pc, MilitaryRank.Sergeant);
    expect(pc.rank).toBe(MilitaryRank.Sergeant);
    expect(cost).toBe(15);
  });
});

// ============================================================
// RANK REQUIREMENTS
// ============================================================

describe('RANK_REQUIREMENTS', () => {
  it('defines requirements for all non-Private ranks', () => {
    expect(RANK_REQUIREMENTS[MilitaryRank.Corporal]).toBeDefined();
    expect(RANK_REQUIREMENTS[MilitaryRank.Sergeant]).toBeDefined();
    expect(RANK_REQUIREMENTS[MilitaryRank.Lieutenant]).toBeDefined();
    expect(RANK_REQUIREMENTS[MilitaryRank.Captain]).toBeDefined();
  });

  it('has increasing glory costs', () => {
    const costs = [
      RANK_REQUIREMENTS[MilitaryRank.Corporal].gloryCost,
      RANK_REQUIREMENTS[MilitaryRank.Sergeant].gloryCost,
      RANK_REQUIREMENTS[MilitaryRank.Lieutenant].gloryCost,
      RANK_REQUIREMENTS[MilitaryRank.Captain].gloryCost,
    ];
    for (let i = 1; i < costs.length; i++) {
      expect(costs[i]).toBeGreaterThan(costs[i - 1]);
    }
  });

  it('all requirements have promotion narratives', () => {
    for (const req of Object.values(RANK_REQUIREMENTS)) {
      expect(req.promotionNarrative).toBeTruthy();
      expect(req.promotionNarrative.length).toBeGreaterThan(20);
    }
  });
});

// ============================================================
// DISPLAY HELPERS
// ============================================================

describe('getRankLabel', () => {
  it('returns human-readable label for each rank', () => {
    expect(getRankLabel(MilitaryRank.Private)).toBe('Private');
    expect(getRankLabel(MilitaryRank.Captain)).toBe('Captain');
  });
});

describe('getRankAbbreviation', () => {
  it('returns abbreviation for each rank', () => {
    expect(getRankAbbreviation(MilitaryRank.Private)).toBe('Pvt.');
    expect(getRankAbbreviation(MilitaryRank.Sergeant)).toBe('Sgt.');
    expect(getRankAbbreviation(MilitaryRank.Captain)).toBe('Capt.');
  });
});
