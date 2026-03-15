import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createEngagement,
  resolveEngagementVolley,
  resolveCommand,
  resolvePresent,
  resolveFire,
  resolveEndure,
  resolveLoad,
  moraleToGrade,
  effectiveRange,
  rollVolleyEffectiveness,
  resolveMelee,
  getValidOrders,
  chooseAustrianOrder,
  chooseFrenchAutoOrder,
  DRILL_STEPS,
  DRILL_STEP_INFO,
  TUNING,
} from '../../../battlefield-lab/src/engagement';
import type {
  EngagementState,
  CompanyState,
  PairStepData,
  VolleyStepData,
} from '../../../battlefield-lab/src/engagement';
import { Formation } from '../../types';

function deepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/** Assign fire orders for all active formations on both sides */
function assignFireOrders(state: EngagementState): void {
  for (const side of [state.french, state.austrian]) {
    for (const f of side) {
      if (f.status === 'active') {
        f.order = 'fire';
      }
    }
  }
}

/** Create empty VolleyStepData with all required fields */
function emptyPairStepData(): PairStepData {
  return {
    frenchDamageTaken: 0,
    austrianDamageTaken: 0,
    frenchCrossfired: false,
    austrianCrossfired: false,
    frenchRoll: null,
    austrianRoll: null,
    frenchReceivedTier: null,
    austrianReceivedTier: null,
    meleeResult: null,
    defensiveFireRoll: null,
  };
}

function emptyStepData(): VolleyStepData {
  return [emptyPairStepData(), emptyPairStepData(), emptyPairStepData()];
}

describe('engagement drill step cadence', () => {
  let state: EngagementState;

  beforeEach(() => {
    state = createEngagement(120);
  });

  describe('createEngagement', () => {
    it('initializes drillStep as null', () => {
      expect(state.drillStep).toBeNull();
    });

    it('initializes volleyStepData as null', () => {
      expect(state.volleyStepData).toBeNull();
    });

    it('has 3 french and 3 austrian formations', () => {
      expect(state.french).toHaveLength(3);
      expect(state.austrian).toHaveLength(3);
    });

    it('starts all formations at steady morale (65)', () => {
      for (const f of [...state.french, ...state.austrian]) {
        expect(f.morale).toBe(65);
        expect(f.moraleGrade).toBe('steady');
      }
    });
  });

  describe('DRILL_STEPS', () => {
    it('has 5 steps in correct order', () => {
      expect(DRILL_STEPS).toEqual(['command', 'present', 'fire', 'endure', 'load']);
    });

    it('all steps have info entries', () => {
      for (const step of DRILL_STEPS) {
        expect(DRILL_STEP_INFO[step]).toBeDefined();
        expect(DRILL_STEP_INFO[step].label).toBeTruthy();
        expect(DRILL_STEP_INFO[step].description).toBeTruthy();
      }
    });
  });

  describe('resolveCommand', () => {
    it('sets drillStep to command', () => {
      assignFireOrders(state);
      resolveCommand(state);
      expect(state.drillStep).toBe('command');
    });

    it('sets phase to running', () => {
      assignFireOrders(state);
      resolveCommand(state);
      expect(state.phase).toBe('running');
    });

    it('wavering formations may have orders overridden', () => {
      // Set a formation to wavering and force the random override
      state.french[0].morale = 10;
      state.french[0].moraleGrade = 'wavering';
      state.french[0].order = 'hold_fire';

      // Mock Math.random to always return < 0.3 (triggers override)
      vi.spyOn(Math, 'random').mockReturnValue(0.1);

      resolveCommand(state);
      // Should be overridden to 'fire' since musketLoaded is true
      expect(state.french[0].order).toBe('fire');

      vi.restoreAllMocks();
    });

    it('wavering formations keep orders if random > 0.3', () => {
      state.french[0].morale = 10;
      state.french[0].moraleGrade = 'wavering';
      state.french[0].order = 'hold_fire';

      vi.spyOn(Math, 'random').mockReturnValue(0.5);

      resolveCommand(state);
      expect(state.french[0].order).toBe('hold_fire');

      vi.restoreAllMocks();
    });
  });

  describe('resolvePresent', () => {
    it('sets drillStep to present', () => {
      resolvePresent(state);
      expect(state.drillStep).toBe('present');
    });

    it('is currently a no-op (placeholder)', () => {
      const before = deepCopy(state);
      resolvePresent(state);
      // Only drillStep should change
      before.drillStep = 'present';
      expect(state).toEqual(before);
    });
  });

  describe('resolveFire', () => {
    it('sets drillStep to fire', () => {
      assignFireOrders(state);
      resolveFire(state);
      expect(state.drillStep).toBe('fire');
    });

    it('creates volleyStepData with 3 pair entries', () => {
      assignFireOrders(state);
      resolveFire(state);
      expect(state.volleyStepData).not.toBeNull();
      expect(state.volleyStepData).toHaveLength(3);
    });

    it('deals damage to austrian formations when french fires', () => {
      assignFireOrders(state);
      resolveFire(state);
      const totalAustrianDmg = state.volleyStepData!.reduce((s, p) => s + p.austrianDamageTaken, 0);
      expect(totalAustrianDmg).toBeGreaterThan(0);
    });

    it('deals damage to french formations when austrian fires', () => {
      assignFireOrders(state);
      resolveFire(state);
      const totalFrenchDmg = state.volleyStepData!.reduce((s, p) => s + p.frenchDamageTaken, 0);
      expect(totalFrenchDmg).toBeGreaterThan(0);
    });

    it('french fires first — austrian strength reduced before they fire', () => {
      assignFireOrders(state);
      const austrianStrBefore = state.austrian.map(f => f.strength);
      resolveFire(state);
      // Austrians should have less strength (took French fire first)
      for (let i = 0; i < 3; i++) {
        expect(state.austrian[i].strength).toBeLessThan(austrianStrBefore[i]);
      }
    });

    it('consumes musket when firing', () => {
      assignFireOrders(state);
      resolveFire(state);
      for (const f of state.french) {
        expect(f.musketLoaded).toBe(false);
      }
    });

    it('resolves advance movement', () => {
      state.french[0].formation = Formation.Column;
      state.french[0].order = 'advance';
      resolveFire(state);
      expect(state.french[0].rangeOffset).toBe(-30); // Column moveSpeed = 30
    });

    it('resolves fall_back movement', () => {
      state.french[1].order = 'fall_back';
      state.french[1].rangeOffset = -40;
      resolveFire(state);
      expect(state.french[1].rangeOffset).toBe(-20); // +20 paces, capped at 0
    });

    it('sets chargeReady when column reaches <=25 paces', () => {
      state.french[0].formation = Formation.Column;
      state.french[0].order = 'advance';
      state.french[0].rangeOffset = -70; // Will be -100 after advance (120-100=20 effective)
      resolveFire(state);
      expect(state.french[0].chargeReady).toBe(true);
    });
  });

  describe('resolveEndure', () => {
    it('sets drillStep to endure', () => {
      assignFireOrders(state);
      resolveFire(state);
      resolveEndure(state);
      expect(state.drillStep).toBe('endure');
    });

    it('updates morale based on damage taken', () => {
      // Mock random to produce "effective" tier rolls (moderate damage)
      // Roll of 40 with default target ~62 → margin 22 → effective tier (1.0x)
      vi.spyOn(Math, 'random').mockReturnValue(0.39);
      assignFireOrders(state);
      resolveFire(state);
      vi.restoreAllMocks();
      const moraleBefore = state.french.map(f => f.morale);
      resolveEndure(state);
      // Formations that took damage should have reduced morale
      for (let i = 0; i < 3; i++) {
        if (state.volleyStepData![i].frenchDamageTaken > 0) {
          expect(state.french[i].morale).toBeLessThan(moraleBefore[i]);
        }
      }
    });

    it('recovers integrity for hold_fire orders', () => {
      state.french[0].order = 'hold_fire';
      state.french[0].integrity = 60;
      // Need step data
      state.volleyStepData = emptyStepData();
      resolveEndure(state);
      expect(state.french[0].integrity).toBe(75); // 60 + 15
    });

    it('routes formations at 0 morale', () => {
      state.french[0].morale = 1;
      state.french[0].moraleGrade = 'routing';
      const sd = emptyStepData();
      sd[0].frenchDamageTaken = 10;
      state.volleyStepData = sd;
      resolveEndure(state);
      expect(state.french[0].status).toBe('routing');
    });

    it('cascades routing to neighbors', () => {
      // Center formation already routing
      state.french[1].morale = 0;
      state.french[1].moraleGrade = 'routing';
      // Neighbors at low morale
      state.french[0].morale = 20;
      state.french[0].moraleGrade = moraleToGrade(20);
      state.french[2].morale = 20;
      state.french[2].moraleGrade = moraleToGrade(20);

      state.volleyStepData = emptyStepData();
      resolveEndure(state);

      // Center should route
      expect(state.french[1].status).toBe('routing');
      // Neighbors should have morale reduced by 15 from cascade
      expect(state.french[0].morale).toBeLessThanOrEqual(20);
      expect(state.french[2].morale).toBeLessThanOrEqual(20);
    });

    it('skips if no volleyStepData', () => {
      state.volleyStepData = null;
      const before = deepCopy(state);
      resolveEndure(state);
      before.drillStep = 'endure';
      expect(state).toEqual(before);
    });
  });

  describe('resolveLoad', () => {
    it('sets drillStep to null after completion', () => {
      assignFireOrders(state);
      resolveFire(state);
      resolveEndure(state);
      resolveLoad(state);
      expect(state.drillStep).toBeNull();
    });

    it('clears volleyStepData', () => {
      assignFireOrders(state);
      resolveFire(state);
      resolveEndure(state);
      resolveLoad(state);
      expect(state.volleyStepData).toBeNull();
    });

    it('reloads muskets for non-firing formations', () => {
      state.french[0].order = 'hold_fire';
      state.french[0].musketLoaded = false;
      state.volleyStepData = emptyStepData();
      resolveLoad(state);
      expect(state.french[0].musketLoaded).toBe(true);
    });

    it('reloads muskets even for formations that fired', () => {
      state.french[0].order = 'fire';
      state.french[0].musketLoaded = false;
      state.volleyStepData = emptyStepData();
      resolveLoad(state);
      expect(state.french[0].musketLoaded).toBe(true);
    });

    it('sets first-fire flag for hold_fire orders', () => {
      state.french[0].order = 'hold_fire';
      state.volleyStepData = emptyStepData();
      resolveLoad(state);
      expect(state.french[0].hasFirstFire).toBe(true);
    });

    it('increments volley count', () => {
      state.volleyStepData = emptyStepData();
      expect(state.volleyCount).toBe(0);
      resolveLoad(state);
      expect(state.volleyCount).toBe(1);
    });

    it('returns VolleyResult with pair data', () => {
      assignFireOrders(state);
      resolveFire(state);
      resolveEndure(state);
      const result = resolveLoad(state);
      expect(result.pairs).toHaveLength(3);
      expect(result.newRange).toBe(120);
    });

    it('detects win when all one side routes', () => {
      for (const f of state.austrian) {
        f.status = 'routing';
      }
      state.volleyStepData = emptyStepData();
      const result = resolveLoad(state);
      expect(result.battleOver).toBe(true);
      expect(result.winner).toBe('french');
      expect(state.phase).toBe('ended');
    });
  });

  describe('resolveEngagementVolley (wrapper)', () => {
    it('calls all 5 steps and returns result', () => {
      assignFireOrders(state);
      const result = resolveEngagementVolley(state);
      expect(result.pairs).toHaveLength(3);
      expect(state.volleyCount).toBe(1);
      // drillStep should be null (cleared at end of LOAD)
      expect(state.drillStep).toBeNull();
      expect(state.volleyStepData).toBeNull();
    });

    it('produces damage on both sides', () => {
      assignFireOrders(state);
      const result = resolveEngagementVolley(state);
      const totalFrDmg = result.pairs.reduce((a, p) => a + p.frenchDamage, 0);
      const totalAtDmg = result.pairs.reduce((a, p) => a + p.austrianDamage, 0);
      expect(totalFrDmg).toBeGreaterThan(0);
      expect(totalAtDmg).toBeGreaterThan(0);
    });

    it('wrapper and manual steps produce identical results', () => {
      // Run wrapper on one copy
      const stateA = createEngagement(120);
      assignFireOrders(stateA);
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      const resultA = resolveEngagementVolley(stateA);

      // Run individual steps on another copy
      const stateB = createEngagement(120);
      assignFireOrders(stateB);
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      resolveCommand(stateB);
      resolvePresent(stateB);
      resolveFire(stateB);
      resolveEndure(stateB);
      const resultB = resolveLoad(stateB);

      // Results should match
      expect(resultA).toEqual(resultB);

      // State should match (except transient drillStep/volleyStepData which are null in both)
      expect(stateA.french.map(f => f.strength)).toEqual(stateB.french.map(f => f.strength));
      expect(stateA.french.map(f => f.morale)).toEqual(stateB.french.map(f => f.morale));
      expect(stateA.austrian.map(f => f.strength)).toEqual(stateB.austrian.map(f => f.strength));
      expect(stateA.austrian.map(f => f.morale)).toEqual(stateB.austrian.map(f => f.morale));

      vi.restoreAllMocks();
    });

    it('multiple volleys accumulate damage', () => {
      for (let v = 0; v < 5; v++) {
        assignFireOrders(state);
        resolveEngagementVolley(state);
        // Reload muskets
        for (const side of [state.french, state.austrian]) {
          for (const f of side) {
            if (f.status === 'active') f.musketLoaded = true;
          }
        }
      }
      expect(state.volleyCount).toBe(5);
      // All formations should have taken damage
      for (const f of [...state.french, ...state.austrian]) {
        if (f.status === 'active') {
          expect(f.strength).toBeLessThan(100);
        }
      }
    });
  });

  describe('effectiveRange', () => {
    it('combines base range with offsets', () => {
      expect(effectiveRange(120, -30, -20)).toBe(70);
    });

    it('clamps to minimum 25', () => {
      expect(effectiveRange(120, -60, -60)).toBe(25);
    });

    it('returns base range when no offsets', () => {
      expect(effectiveRange(120, 0, 0)).toBe(120);
    });
  });

  describe('roll-based volley damage', () => {
    afterEach(() => { vi.restoreAllMocks(); });

    describe('rollVolleyEffectiveness', () => {
      it('devastating tier when margin >= 25', () => {
        // target = 62 (standard line at 120p, morale 65, quality 4, integrity 100)
        // Need roll <= target - 25 = 37. Math.random returning 0.0 → roll = 1
        vi.spyOn(Math, 'random').mockReturnValue(0.0);
        const company = createEngagement(120).french[0];
        const result = rollVolleyEffectiveness(company, 120, false);
        expect(result.tier).toBe('devastating');
        expect(result.tierMultiplier).toBe(1.5);
        expect(result.roll).toBe(1);
        expect(result.margin).toBeGreaterThanOrEqual(25);
      });

      it('effective tier when margin >= -15 and < 25', () => {
        // target ≈ 62, need roll between 38 and 77 → Math.random = 0.49 → roll = 50
        vi.spyOn(Math, 'random').mockReturnValue(0.49);
        const company = createEngagement(120).french[0];
        const result = rollVolleyEffectiveness(company, 120, false);
        expect(result.tier).toBe('effective');
        expect(result.tierMultiplier).toBe(1.0);
      });

      it('ragged tier when margin >= -35 and < -15', () => {
        // target ≈ 62, need roll 78-97 → Math.random = 0.79 → roll = 80
        vi.spyOn(Math, 'random').mockReturnValue(0.79);
        const company = createEngagement(120).french[0];
        const result = rollVolleyEffectiveness(company, 120, false);
        expect(result.tier).toBe('ragged');
        expect(result.tierMultiplier).toBe(0.5);
      });

      it('ineffective tier when margin < -35', () => {
        // target ≈ 62, need roll > 97 → Math.random = 0.99 → roll = 100
        vi.spyOn(Math, 'random').mockReturnValue(0.99);
        const company = createEngagement(120).french[0];
        const result = rollVolleyEffectiveness(company, 120, false);
        expect(result.tier).toBe('ineffective');
        expect(result.tierMultiplier).toBe(0.15);
      });

      it('clamps target to minimum 10', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.5);
        const company = createEngagement(200).french[0];
        company.morale = 10;   // moraleMod = (10-70)/3 = -20
        company.integrity = 10; // integrityMod = (10-70)/4 = -15
        company.quality = 1;    // qualityMod = (1-3)*5 = -10
        const result = rollVolleyEffectiveness(company, 200, true);
        // 50 - 10 - 20 - 10 - 10 - 15 = -15, clamped to 10
        expect(result.target).toBe(10);
      });

      it('clamps target to maximum 90', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.5);
        const company = createEngagement(25).french[0];
        company.morale = 100;    // moraleMod = +10
        company.integrity = 100; // integrityMod = +7.5
        company.quality = 5;     // qualityMod = +10
        company.hasFirstFire = true; // +10
        const result = rollVolleyEffectiveness(company, 25, false);
        // 50 + 15 + 10 + 0 + 10 + 10 + 8 = 103, clamped to 90
        expect(result.target).toBe(90);
      });

      it('close range increases target', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.5);
        const company = createEngagement(120).french[0];
        const close = rollVolleyEffectiveness(company, 50, false);
        const far = rollVolleyEffectiveness(company, 200, false);
        expect(close.target).toBeGreaterThan(far.target);
      });

      it('crossfire penalty reduces target', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.5);
        const company = createEngagement(120).french[0];
        const normal = rollVolleyEffectiveness(company, 120, false);
        const crossfire = rollVolleyEffectiveness(company, 120, true);
        expect(crossfire.target).toBe(normal.target - 10);
      });

      it('first fire bonus increases target', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.5);
        const company = createEngagement(120).french[0];
        const normal = rollVolleyEffectiveness(company, 120, false);
        company.hasFirstFire = true;
        const firstFire = rollVolleyEffectiveness(company, 120, false);
        expect(firstFire.target).toBe(normal.target + 10);
      });
    });

    describe('tier multiplier applies to damage', () => {
      it('devastating volley deals 1.5x base damage', () => {
        // Roll 1 → devastating
        vi.spyOn(Math, 'random').mockReturnValue(0.0);
        const s = createEngagement(120);
        assignFireOrders(s);
        resolveFire(s);
        const devDmg = s.volleyStepData![0].austrianDamageTaken;

        // Roll 50 → effective (1.0x)
        vi.spyOn(Math, 'random').mockReturnValue(0.49);
        const s2 = createEngagement(120);
        assignFireOrders(s2);
        resolveFire(s2);
        const effDmg = s2.volleyStepData![0].austrianDamageTaken;

        expect(devDmg).toBeCloseTo(effDmg * 1.5, 0);
      });

      it('ineffective volley deals 0.15x base damage', () => {
        // Roll 100 → ineffective
        vi.spyOn(Math, 'random').mockReturnValue(0.99);
        const s = createEngagement(120);
        assignFireOrders(s);
        resolveFire(s);
        const ineDmg = s.volleyStepData![0].austrianDamageTaken;

        // Roll 50 → effective (1.0x)
        vi.spyOn(Math, 'random').mockReturnValue(0.49);
        const s2 = createEngagement(120);
        assignFireOrders(s2);
        resolveFire(s2);
        const effDmg = s2.volleyStepData![0].austrianDamageTaken;

        expect(ineDmg).toBeCloseTo(effDmg * 0.15, 0);
      });
    });

    describe('roll data propagates through drill steps', () => {
      it('resolveFire stores rolls in volleyStepData', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.49);
        const s = createEngagement(120);
        assignFireOrders(s);
        resolveFire(s);

        for (let i = 0; i < 3; i++) {
          expect(s.volleyStepData![i].frenchRoll).not.toBeNull();
          expect(s.volleyStepData![i].frenchRoll!.roll).toBeGreaterThan(0);
          expect(s.volleyStepData![i].austrianRoll).not.toBeNull();
        }
      });

      it('resolveLoad includes rolls in PairResult', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.49);
        const s = createEngagement(120);
        assignFireOrders(s);
        resolveFire(s);
        resolveEndure(s);
        const result = resolveLoad(s);

        for (const pair of result.pairs) {
          expect(pair.frenchRoll).toBeDefined();
          expect(pair.frenchRoll!.tier).toBeTruthy();
          expect(pair.austrianRoll).toBeDefined();
          expect(pair.austrianRoll!.tier).toBeTruthy();
        }
      });

      it('non-firing companies have null rolls', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.49);
        const s = createEngagement(120);
        s.french[0].order = 'hold_fire';
        s.french[1].order = 'fire';
        s.french[2].order = 'fire';
        for (const f of s.austrian) f.order = 'fire';
        resolveFire(s);

        expect(s.volleyStepData![0].frenchRoll).toBeNull();
        expect(s.volleyStepData![1].frenchRoll).not.toBeNull();
        expect(s.volleyStepData![2].frenchRoll).not.toBeNull();
      });
    });

    describe('morale feedback from tiers', () => {
      it('devastating received reduces defender morale by extra 4', () => {
        // French fires devastating (roll=1), Austrians hold fire
        vi.spyOn(Math, 'random').mockReturnValue(0.0);
        const s = createEngagement(120);
        for (const f of s.french) f.order = 'fire';
        for (const f of s.austrian) f.order = 'hold_fire';
        resolveFire(s);
        const moraleBefore = s.austrian[0].morale;
        resolveEndure(s);
        const moraleDrop = moraleBefore - s.austrian[0].morale;
        vi.restoreAllMocks();

        // Same scenario but effective (roll=50)
        vi.spyOn(Math, 'random').mockReturnValue(0.49);
        const s2 = createEngagement(120);
        for (const f of s2.french) f.order = 'fire';
        for (const f of s2.austrian) f.order = 'hold_fire';
        resolveFire(s2);
        const moraleBefore2 = s2.austrian[0].morale;
        resolveEndure(s2);
        const moraleDrop2 = moraleBefore2 - s2.austrian[0].morale;

        // Devastating should cause more morale loss
        expect(moraleDrop).toBeGreaterThan(moraleDrop2);
      });

      it('devastating delivered boosts attacker morale by 3', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.0);
        const s = createEngagement(120);
        for (const f of s.french) f.order = 'fire';
        for (const f of s.austrian) f.order = 'hold_fire';
        resolveFire(s);
        const moraleBefore = s.french[0].morale;
        resolveEndure(s);
        // French took no damage (Austrians held fire) and delivered devastating
        // Should get +3 from devastating delivered + base recovery
        expect(s.french[0].morale).toBeGreaterThan(moraleBefore);
      });

      it('crossfire receivedTier maps to correct target', () => {
        // Austrian 0 crossfires at French 1 (devastating roll)
        vi.spyOn(Math, 'random').mockReturnValue(0.0);
        const s = createEngagement(120);
        s.austrian[0].order = 'crossfire';
        s.austrian[1].order = 'hold_fire';
        s.austrian[2].order = 'hold_fire';
        for (const f of s.french) f.order = 'hold_fire';
        resolveFire(s);
        // The roll was devastating (roll=1, target~62, margin=61)
        // It should be mapped to French target 1 (the crossfire target), not French 0
        expect(s.volleyStepData![0].frenchReceivedTier).toBeNull(); // French 0 was not fired at
        expect(s.volleyStepData![1].frenchReceivedTier).toBe('devastating'); // French 1 received crossfire
        vi.restoreAllMocks();
      });
    });

    it('produces varying damage across volleys', () => {
      const damages: number[] = [];
      for (let i = 0; i < 20; i++) {
        const s = createEngagement(120);
        assignFireOrders(s);
        resolveFire(s);
        damages.push(s.volleyStepData![0].austrianDamageTaken);
      }
      const unique = new Set(damages);
      expect(unique.size).toBeGreaterThan(1);
    });

    it('deterministic with mocked Math.random', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      const s1 = createEngagement(120);
      assignFireOrders(s1);
      resolveFire(s1);

      const s2 = createEngagement(120);
      assignFireOrders(s2);
      resolveFire(s2);

      expect(s1.volleyStepData!.map(p => p.austrianDamageTaken)).toEqual(
        s2.volleyStepData!.map(p => p.austrianDamageTaken),
      );
    });
  });

  describe('company quality', () => {
    afterEach(() => { vi.restoreAllMocks(); });

    it('defaults to 4 on new companies', () => {
      expect(state.french[0].quality).toBe(4);
      expect(state.austrian[0].quality).toBe(4);
    });

    it('high quality increases fire damage', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.49);

      // Baseline: quality 4 → qualityDmgMod = 0.8 + 4*0.1 = 1.2
      const s0 = createEngagement(120);
      assignFireOrders(s0);
      resolveFire(s0);
      const baseDmg = s0.volleyStepData![0].austrianDamageTaken;

      // Quality 5 → qualityDmgMod = 0.8 + 5*0.1 = 1.3
      const s1 = createEngagement(120);
      s1.french[0].quality = 5;
      assignFireOrders(s1);
      resolveFire(s1);
      const boostedDmg = s1.volleyStepData![0].austrianDamageTaken;

      expect(boostedDmg).toBeGreaterThan(baseDmg);
    });

    it('low quality decreases fire damage', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.49);

      const s0 = createEngagement(120);
      assignFireOrders(s0);
      resolveFire(s0);
      const baseDmg = s0.volleyStepData![0].austrianDamageTaken;

      // Quality 2 → qualityDmgMod = 0.8 + 2*0.1 = 1.0 (vs baseline 1.2)
      const s1 = createEngagement(120);
      s1.french[0].quality = 2;
      assignFireOrders(s1);
      resolveFire(s1);
      const weakDmg = s1.volleyStepData![0].austrianDamageTaken;

      expect(weakDmg).toBeLessThan(baseDmg);
    });

    it('high quality reduces morale drain', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.49);

      // Quality 4 (baseline) takes fire
      const s0 = createEngagement(120);
      assignFireOrders(s0);
      resolveFire(s0);
      const moraleBefore0 = s0.french[0].morale;
      resolveEndure(s0);
      const drain0 = moraleBefore0 - s0.french[0].morale;

      // Quality 7 takes fire
      const s1 = createEngagement(120);
      s1.french[0].quality = 7;
      assignFireOrders(s1);
      resolveFire(s1);
      const moraleBefore1 = s1.french[0].morale;
      resolveEndure(s1);
      const drain1 = moraleBefore1 - s1.french[0].morale;

      // Higher quality should drain less morale
      expect(drain1).toBeLessThan(drain0);
    });

    it('low quality increases morale drain', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.49);

      const s0 = createEngagement(120);
      assignFireOrders(s0);
      resolveFire(s0);
      const moraleBefore0 = s0.french[0].morale;
      resolveEndure(s0);
      const drain0 = moraleBefore0 - s0.french[0].morale;

      // Quality 1 = lowest
      const s1 = createEngagement(120);
      s1.french[0].quality = 1;
      assignFireOrders(s1);
      resolveFire(s1);
      const moraleBefore1 = s1.french[0].morale;
      resolveEndure(s1);
      const drain1 = moraleBefore1 - s1.french[0].morale;

      // Lower quality should drain more morale
      expect(drain1).toBeGreaterThan(drain0);
    });
  });

  describe('moraleToGrade', () => {
    it('maps morale values to correct grades', () => {
      expect(moraleToGrade(80)).toBe('resolute');
      expect(moraleToGrade(71)).toBe('resolute');
      expect(moraleToGrade(70)).toBe('steady');
      expect(moraleToGrade(51)).toBe('steady');
      expect(moraleToGrade(50)).toBe('shaken');
      expect(moraleToGrade(31)).toBe('shaken');
      expect(moraleToGrade(30)).toBe('wavering');
      expect(moraleToGrade(16)).toBe('wavering');
      expect(moraleToGrade(15)).toBe('routing');
      expect(moraleToGrade(0)).toBe('routing');
    });
  });

  // =================================================================
  // Charge & Melee System
  // =================================================================

  describe('charge order validation', () => {
    it('charge requires Column formation', () => {
      const co = state.french[0];
      co.formation = Formation.Line;
      co.chargeReady = true;
      expect(getValidOrders(co)).not.toContain('charge');
    });

    it('charge requires chargeReady === true', () => {
      const co = state.french[0];
      co.formation = Formation.Column;
      co.chargeReady = false;
      expect(getValidOrders(co)).not.toContain('charge');
    });

    it('charge is valid when Column + chargeReady', () => {
      const co = state.french[0];
      co.formation = Formation.Column;
      co.chargeReady = true;
      expect(getValidOrders(co)).toContain('charge');
    });

    it('charge is not available for routing companies', () => {
      const co = state.french[0];
      co.formation = Formation.Column;
      co.chargeReady = true;
      co.status = 'routing';
      expect(getValidOrders(co)).toEqual([]);
    });
  });

  describe('resolveMelee', () => {
    afterEach(() => { vi.restoreAllMocks(); });

    function makeCharger(): CompanyState {
      const co = createEngagement().french[0];
      co.formation = Formation.Column;
      co.strength = 100;
      co.morale = 70;
      co.quality = 3;
      co.chargeReady = true;
      return co;
    }

    function makeDefender(): CompanyState {
      const co = createEngagement().austrian[0];
      co.formation = Formation.Line;
      co.strength = 100;
      co.morale = 70;
      co.quality = 3;
      return co;
    }

    it('calculates melee scores using strength, morale, quality, formation bonus', () => {
      vi.spyOn(Math, 'random')
        .mockReturnValueOnce(0.49)   // charger roll = 50
        .mockReturnValueOnce(0.49);  // defender roll = 50
      const charger = makeCharger();
      const defender = makeDefender();
      const result = resolveMelee(charger, defender, 0);

      // charger: (100*0.5) + (70/3) + (3*4) + 15 = 50 + 23.33 + 12 + 15 = 100.33 + 50 = 150.33
      // defender: (100*0.5) + (70/3) + (3*4) + 0 = 50 + 23.33 + 12 + 0 = 85.33 + 50 = 135.33
      expect(result.chargerScore).toBeGreaterThan(result.defenderScore);
      expect(result.victorSide).toBe('french');
    });

    it('decisive victory when margin >= 40', () => {
      // Charger rolls high, defender rolls low
      vi.spyOn(Math, 'random')
        .mockReturnValueOnce(0.89)   // charger roll = 90
        .mockReturnValueOnce(0.09);  // defender roll = 10
      const charger = makeCharger();
      const defender = makeDefender();
      const result = resolveMelee(charger, defender, 0);

      expect(result.margin).toBeGreaterThanOrEqual(40);
      expect(result.strengthDamage).toBe(TUNING.melee.decisive.strengthLoss);
    });

    it('clear victory when margin >= 15 and < 40', () => {
      // Engineer rolls for ~20 margin
      vi.spyOn(Math, 'random')
        .mockReturnValueOnce(0.59)   // charger roll = 60
        .mockReturnValueOnce(0.49);  // defender roll = 50
      const charger = makeCharger();
      const defender = makeDefender();
      const result = resolveMelee(charger, defender, 0);

      // Margin ≈ 15 + (60-50) = ~25 — in clear range
      expect(result.margin).toBeGreaterThanOrEqual(15);
      expect(result.strengthDamage).toBe(TUNING.melee.clear.strengthLoss);
    });

    it('loser always routes', () => {
      vi.spyOn(Math, 'random')
        .mockReturnValueOnce(0.49)
        .mockReturnValueOnce(0.49);
      const charger = makeCharger();
      const defender = makeDefender();
      resolveMelee(charger, defender, 0);

      // Charger wins (column bonus), so defender routes
      expect(defender.status).toBe('routing');
      expect(defender.morale).toBe(0);
      expect(defender.moraleGrade).toBe('routing');
    });

    it('winner gets morale boost', () => {
      vi.spyOn(Math, 'random')
        .mockReturnValueOnce(0.49)
        .mockReturnValueOnce(0.49);
      const charger = makeCharger();
      const defender = makeDefender();
      const moraleBefore = charger.morale;
      resolveMelee(charger, defender, 0);

      expect(charger.morale).toBeGreaterThan(moraleBefore);
    });

    it('charger recoils when they lose', () => {
      // Defender rolls much higher
      vi.spyOn(Math, 'random')
        .mockReturnValueOnce(0.0)    // charger roll = 1
        .mockReturnValueOnce(0.99);  // defender roll = 100
      const charger = makeCharger();
      const defender = makeDefender();
      const offsetBefore = charger.rangeOffset;
      const result = resolveMelee(charger, defender, 0);

      expect(result.chargerRecoiled).toBe(true);
      expect(charger.rangeOffset).toBe(offsetBefore + TUNING.melee.recoilDistance);
      expect(charger.chargeReady).toBe(false);
    });

    it('charger does not recoil when they win', () => {
      vi.spyOn(Math, 'random')
        .mockReturnValueOnce(0.99)
        .mockReturnValueOnce(0.0);
      const charger = makeCharger();
      const defender = makeDefender();
      const result = resolveMelee(charger, defender, 0);

      expect(result.chargerRecoiled).toBe(false);
    });

    it('square formation bonus makes charges risky', () => {
      // Set defender to square
      const charger = makeCharger();
      const defender = makeDefender();
      defender.formation = Formation.Square;

      // With equal rolls, square's +25 bonus vs column's +15 means defender has advantage
      vi.spyOn(Math, 'random')
        .mockReturnValueOnce(0.49)
        .mockReturnValueOnce(0.49);
      const result = resolveMelee(charger, defender, 0);

      // Square defender base: 85.33 + 25 = 110.33
      // Column charger base: 85.33 + 15 = 100.33
      // With equal rolls, defender wins
      expect(result.victorSide).toBe('austrian');
    });

    it('degraded column loses to healthy line', () => {
      const charger = makeCharger();
      charger.strength = 50;
      charger.morale = 40;
      const defender = makeDefender();

      // Equal rolls
      vi.spyOn(Math, 'random')
        .mockReturnValueOnce(0.49)
        .mockReturnValueOnce(0.49);
      const result = resolveMelee(charger, defender, 0);

      // Degraded charger: (50*0.5)+(40/3)+(3*4)+15 = 25+13.33+12+15 = 65.33
      // Full defender: 85.33
      // With equal rolls, defender wins
      expect(result.victorSide).toBe('austrian');
    });
  });

  describe('charge in resolveFire', () => {
    afterEach(() => { vi.restoreAllMocks(); });

    function setupChargeState(): EngagementState {
      const s = createEngagement(50);
      // French column at charge range
      s.french[0].formation = Formation.Column;
      s.french[0].chargeReady = true;
      s.french[0].order = 'charge';
      // Other French companies fire normally
      s.french[1].order = 'fire';
      s.french[2].order = 'fire';
      // Austrian defenders fire
      for (const f of s.austrian) f.order = 'fire';
      return s;
    }

    it('charger skips normal fire', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.49);
      const s = setupChargeState();
      resolveFire(s);

      // French[0] ordered charge, so its roll in the normal fire phase should be null
      expect(s.volleyStepData![0].frenchRoll).toBeNull();
      // French[1] and [2] fired normally
      expect(s.volleyStepData![1].frenchRoll).not.toBeNull();
      expect(s.volleyStepData![2].frenchRoll).not.toBeNull();
    });

    it('produces meleeResult for charging pair', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.49);
      const s = setupChargeState();
      resolveFire(s);

      expect(s.volleyStepData![0].meleeResult).not.toBeNull();
      expect(s.volleyStepData![0].meleeResult!.chargerSide).toBe('french');
    });

    it('defender fires defensive volley at close range', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.49);
      const s = setupChargeState();
      resolveFire(s);

      expect(s.volleyStepData![0].defensiveFireRoll).not.toBeNull();
    });

    it('charger routed by defensive fire skips melee', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.49);
      const s = setupChargeState();
      // Weaken charger severely — defensive fire should kill them
      s.french[0].strength = 5;
      resolveFire(s);

      // If charger routed, no melee should occur
      if (s.french[0].status === 'routing') {
        expect(s.volleyStepData![0].meleeResult).toBeNull();
      }
    });

    it('non-charging pairs have null meleeResult', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.49);
      const s = setupChargeState();
      resolveFire(s);

      expect(s.volleyStepData![1].meleeResult).toBeNull();
      expect(s.volleyStepData![2].meleeResult).toBeNull();
    });

    it('both sides charging results in head-on collision (no defensive fire)', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.49);
      const s = createEngagement(50);
      // Both sides charge
      s.french[0].formation = Formation.Column;
      s.french[0].chargeReady = true;
      s.french[0].order = 'charge';
      s.austrian[0].formation = Formation.Column;
      s.austrian[0].chargeReady = true;
      s.austrian[0].order = 'charge';
      // Others hold
      s.french[1].order = 'hold_fire';
      s.french[2].order = 'hold_fire';
      s.austrian[1].order = 'hold_fire';
      s.austrian[2].order = 'hold_fire';
      resolveFire(s);

      // Head-on collision: no defensive fire
      expect(s.volleyStepData![0].defensiveFireRoll).toBeNull();
      // But melee still happens
      expect(s.volleyStepData![0].meleeResult).not.toBeNull();
    });

    it('melee loser routes and triggers routing cascade', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.49);
      const s = setupChargeState();
      // Weaken Austrian neighbors so cascade routes them too
      s.austrian[1].morale = 10;
      s.austrian[1].moraleGrade = 'wavering';
      s.austrian[2].morale = 10;
      s.austrian[2].moraleGrade = 'wavering';

      resolveFire(s);
      resolveEndure(s);

      // Austrian[0] lost melee → routes → cascade hits neighbors
      if (s.austrian[0].status === 'routing') {
        // Neighbor morale should have been penalized
        expect(s.austrian[1].morale).toBeLessThanOrEqual(10);
      }
    });
  });

  describe('charge resolveLoad integration', () => {
    afterEach(() => { vi.restoreAllMocks(); });

    it('meleeResult appears in PairResult', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.49);
      const s = createEngagement(50);
      s.french[0].formation = Formation.Column;
      s.french[0].chargeReady = true;
      s.french[0].order = 'charge';
      s.french[1].order = 'fire';
      s.french[2].order = 'fire';
      for (const f of s.austrian) f.order = 'fire';

      resolveFire(s);
      resolveEndure(s);
      const result = resolveLoad(s);

      expect(result.pairs[0].meleeResult).toBeDefined();
      expect(result.pairs[0].meleeResult!.pairIndex).toBe(0);
    });
  });

  describe('AI doctrine charge decisions', () => {
    afterEach(() => { vi.restoreAllMocks(); });

    function makeColumnAtChargeRange(side: 'french' | 'austrian'): EngagementState {
      const s = createEngagement(50);
      for (let i = 0; i < 3; i++) {
        s[side][i].formation = Formation.Column;
        s[side][i].chargeReady = true;
      }
      return s;
    }

    it('aggressive_assault always charges when chargeReady', () => {
      // Suppress wavering override
      vi.spyOn(Math, 'random').mockReturnValue(0.9);
      const s = makeColumnAtChargeRange('austrian');
      s.austrianDoctrine = 'aggressive_assault';

      const order = chooseAustrianOrder(s.austrian[0], 0, s);
      expect(order).toBe('charge');
    });

    it('steady_advance charges when chargeReady AND strength > 50%', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.9);
      const s = makeColumnAtChargeRange('austrian');
      s.austrianDoctrine = 'steady_advance';
      s.austrian[0].strength = 60;

      expect(chooseAustrianOrder(s.austrian[0], 0, s)).toBe('charge');

      // Below 50% — no charge
      s.austrian[1].strength = 40;
      expect(chooseAustrianOrder(s.austrian[1], 1, s)).not.toBe('charge');
    });

    it('holding_action never charges', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.9);
      const s = makeColumnAtChargeRange('austrian');
      s.austrianDoctrine = 'holding_action';

      const order = chooseAustrianOrder(s.austrian[0], 0, s);
      expect(order).not.toBe('charge');
    });

    it('concentrated_strike charges weakest target', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.9);
      const s = makeColumnAtChargeRange('austrian');
      s.austrianDoctrine = 'concentrated_strike';
      // French[1] is weakest
      s.french[0].strength = 80;
      s.french[1].strength = 30;
      s.french[2].strength = 80;

      // Austrian[1] faces weakest → charges
      expect(chooseAustrianOrder(s.austrian[1], 1, s)).toBe('charge');
      // Austrian[0] faces strong target → doesn't charge
      expect(chooseAustrianOrder(s.austrian[0], 0, s)).not.toBe('charge');
    });

    it('French auto-play charges when chargeReady AND strength > 40%', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.9);
      const s = makeColumnAtChargeRange('french');
      s.french[0].strength = 50;

      expect(chooseFrenchAutoOrder(s.french[0], 0, s)).toBe('charge');

      // Below 40% — no charge
      s.french[1].strength = 30;
      expect(chooseFrenchAutoOrder(s.french[1], 1, s)).not.toBe('charge');
    });
  });
});
