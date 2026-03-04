import { Formation } from '@src/types';

// === Types ===

export type MoraleGrade = 'resolute' | 'steady' | 'shaken' | 'wavering' | 'routing';
export type CompanyStatus = 'active' | 'routing' | 'destroyed';
export type Order = 'fire' | 'hold_fire' | 'crossfire' | 'advance' | 'fall_back' | 'charge';
export type Doctrine = 'steady_advance' | 'aggressive_assault' | 'holding_action' | 'concentrated_strike';
export type DrillStep = 'command' | 'present' | 'fire' | 'endure' | 'load';

export const DRILL_STEPS: DrillStep[] = ['command', 'present', 'fire', 'endure', 'load'];

export const DRILL_STEP_INFO: Record<DrillStep, { label: string; description: string }> = {
  command: { label: 'COMMAND', description: 'Orders locked in' },
  present: { label: 'PRESENT', description: 'Fire validated' },
  fire:    { label: 'FIRE',    description: 'Volleys resolved' },
  endure:  { label: 'ENDURE',  description: 'Casualties assessed' },
  load:    { label: 'LOAD',    description: 'Muskets reloaded' },
};

export interface CompanyState {
  side: 'french' | 'austrian';
  strength: number;        // 0-100 (% men remaining)
  integrity: number;       // 0-100 (cohesion)
  morale: number;          // 0-100 independent meter
  moraleGrade: MoraleGrade;
  formation: Formation;
  status: CompanyStatus;
  musketLoaded: boolean;
  order: Order;            // current volley's order
  rangeOffset: number;     // paces offset from base range (negative = closer)
  hasFirstFire: boolean;   // held fire last volley, bonus on next Fire
  chargeReady: boolean;    // column at <=25 effective paces, gets charge bonus
  quality: number;         // modifier: each point = +5% fire damage, +5% morale resilience
}

export interface MeleeResult {
  pairIndex: number;
  chargerSide: 'french' | 'austrian';
  chargerScore: number;
  defenderScore: number;
  chargerRoll: number;
  defenderRoll: number;
  victorSide: 'french' | 'austrian';
  margin: number;
  strengthDamage: number;   // % strength lost by loser
  chargerRecoiled: boolean; // true if charger lost
}

/** Per-pair volley data for one company pair (French[i] vs Austrian[i]). */
export interface PairStepData {
  frenchDamageTaken: number;
  austrianDamageTaken: number;
  frenchCrossfired: boolean;
  austrianCrossfired: boolean;
  frenchRoll: VolleyRollResult | null;          // what French attacker i rolled
  austrianRoll: VolleyRollResult | null;         // what Austrian attacker i rolled
  frenchReceivedTier: VolleyTier | null;         // worst tier received by French i (correct for crossfire)
  austrianReceivedTier: VolleyTier | null;        // worst tier received by Austrian i
  meleeResult: MeleeResult | null;
  defensiveFireRoll: VolleyRollResult | null;
}

/** Inter-step data passed from FIRE → ENDURE. One entry per company pair. */
export type VolleyStepData = [PairStepData, PairStepData, PairStepData];

export interface EngagementState {
  french: [CompanyState, CompanyState, CompanyState];
  austrian: [CompanyState, CompanyState, CompanyState];
  range: number;           // base range (all formations start here)
  volleyCount: number;
  phase: 'ready' | 'running' | 'ended';
  winner: 'french' | 'austrian' | null;
  austrianDoctrine: Doctrine;
  autoPlay: boolean;       // when true, AI controls both sides
  drillStep: DrillStep | null;       // current drill step (null = between volleys)
  volleyStepData: VolleyStepData | null; // inter-step data for current volley
}

export type VolleyTier = 'devastating' | 'effective' | 'ragged' | 'ineffective';

export interface VolleyRollResult {
  roll: number;           // 1-100
  target: number;         // effectiveness target (10-90)
  margin: number;         // target - roll
  tier: VolleyTier;
  tierMultiplier: number; // 1.5, 1.0, 0.5, 0.15
}

export interface PairResult {
  pairIndex: number;
  frenchDamage: number;    // strength lost by French
  austrianDamage: number;  // strength lost by Austrian
  frenchRouted: boolean;
  austrianRouted: boolean;
  frenchRoll?: VolleyRollResult;
  austrianRoll?: VolleyRollResult;
  meleeResult?: MeleeResult;
}

export interface VolleyResult {
  pairs: PairResult[];
  newRange: number;
  battleOver: boolean;
  winner: 'french' | 'austrian' | null;
}

// === Tuning Config ===
// All gameplay-critical numbers in one place for easy iteration.

export const TUNING = {
  // --- d100 Effectiveness Roll ---
  roll: {
    baseTarget: 50,
    targetMin: 10,
    targetMax: 90,
    // Range accuracy modifiers (additive to target)
    rangeMods: [
      { maxRange: 50,  mod: 15 },
      { maxRange: 100, mod: 5 },
      { maxRange: 150, mod: 0 },
      // Beyond 150: fallback
    ] as const,
    rangeDistantMod: -10,
    moraleCenterpoint: 70,
    moraleDivisor: 3,
    crossfirePenalty: -10,
    firstFireBonus: 10,
    qualityCenter: 3,
    qualityStep: 5,
    integrityCenterpoint: 70,
    integrityDivisor: 4,
  },
  tiers: {
    devastating: { minMargin: 25,  multiplier: 1.5 },
    effective:   { minMargin: -15, multiplier: 1.0 },
    ragged:      { minMargin: -35, multiplier: 0.5 },
    ineffective: {                  multiplier: 0.15 },
  },

  // --- Damage Formula ---
  damage: {
    base: 8,
    integrityLossRatio: 0.5,
    chargeBonus: 1.3,
    qualityDmgBase: 0.8,
    qualityDmgScale: 0.1,    // q1=0.9, q3=1.1, q5=1.3
    // Range lethality (musket ball physics, separate from accuracy)
    rangeLethality: [
      { maxRange: 50,  mult: 1.3 },
      { maxRange: 100, mult: 1.1 },
      { maxRange: 150, mult: 1.0 },
    ] as const,
    rangeDistantLethality: 0.85,
  },

  // --- Morale ---
  morale: {
    casualtyWeight: 0.6,
    tierFeedback: {
      devastatingReceived: -4,
      ineffectiveDelivered: -3,
      devastatingDelivered: 3,
    },
    lowStrengthDrain: [
      { threshold: 30, penalty: -3 },
      { threshold: 50, penalty: -1 },
    ] as const,
    crossfireShock: -4,
    neighborRouting: -8,
    noCasualtiesRecovery: 2,
    holdFireRecovery: 4,
    fallBackRecovery: 2,
    highIntegrityThreshold: 70,
    highIntegrityBonus: 1,
    resoluteNeighborBonus: 2,
    squareBonus: 2,
    skirmishDrainFactor: 0.7,
    qualityResilience: { center: 4, step: 0.05 },
    // Grade thresholds (> value = grade)
    grades: { resolute: 70, steady: 50, shaken: 30, wavering: 15 },
    routingCascadePenalty: 15,
    waveringOverrideChance: 0.3,
  },

  // --- Integrity ---
  integrity: {
    holdFireRecovery: 15,
    fallBackRecovery: 10,
  },

  // --- Range & Movement ---
  movement: {
    minEffectiveRange: 25,
    chargeRange: 25,
    fallBackDistance: 20,
  },

  // --- Melee ---
  melee: {
    formationBonus: {
      [Formation.Column]: 15,
      [Formation.Line]: 0,
      [Formation.Square]: 25,
      [Formation.Skirmish]: -20,
    } as Record<Formation, number>,
    strengthWeight: 0.5,
    moraleWeight: 1 / 3,
    qualityWeight: 4,
    decisive: { minMargin: 40, strengthLoss: 30, morale: 10 },
    clear: { minMargin: 15, strengthLoss: 20, morale: 5 },
    narrow: { minMargin: 0, strengthLoss: 10, morale: 3 },
    recoilDistance: 30,
    defensiveFireRange: 25,
  },
} as const;

// === Formation Combat Profiles ===

export interface FormationProfile {
  firePower: number;
  incomingDamage: number;
  crossfireVulnerability: number;
  moveSpeed: number;       // paces per Advance order (0 = cannot advance)
  canCrossfire: boolean;
  integrityRecovery: number; // bonus recovery per volley
}

export const FORMATION_PROFILES: Record<Formation, FormationProfile> = {
  [Formation.Line]:     { firePower: 1.0, incomingDamage: 1.0, crossfireVulnerability: 1.0, moveSpeed: 0,  canCrossfire: true,  integrityRecovery: 0 },
  [Formation.Column]:   { firePower: 0.3, incomingDamage: 0.6, crossfireVulnerability: 1.4, moveSpeed: 30, canCrossfire: false, integrityRecovery: 0 },
  [Formation.Square]:   { firePower: 0.6, incomingDamage: 0.8, crossfireVulnerability: 0.6, moveSpeed: 0,  canCrossfire: false, integrityRecovery: 5 },
  [Formation.Skirmish]: { firePower: 0.5, incomingDamage: 0.4, crossfireVulnerability: 0.5, moveSpeed: 15, canCrossfire: false, integrityRecovery: 0 },
};

// === Morale Helpers ===

export function moraleToGrade(morale: number): MoraleGrade {
  const g = TUNING.morale.grades;
  if (morale > g.resolute) return 'resolute';
  if (morale > g.steady) return 'steady';
  if (morale > g.shaken) return 'shaken';
  if (morale > g.wavering) return 'wavering';
  return 'routing';
}

// === Order Validation ===

export function getValidOrders(f: CompanyState): Order[] {
  if (f.status !== 'active') return [];
  const profile = FORMATION_PROFILES[f.formation];
  const orders: Order[] = [];

  // Fire: Line and Square only (must have loaded musket)
  if ((f.formation === Formation.Line || f.formation === Formation.Square) && f.musketLoaded) {
    orders.push('fire');
  }

  // Hold Fire: any formation
  orders.push('hold_fire');

  // Crossfire: Line only, must have loaded musket
  if (profile.canCrossfire && f.musketLoaded) {
    orders.push('crossfire');
  }

  // Advance: Column and Skirmish only (moveSpeed > 0)
  if (profile.moveSpeed > 0) {
    orders.push('advance');
  }

  // Charge: Column only, must be at charge range
  if (f.formation === Formation.Column && f.chargeReady) {
    orders.push('charge');
  }

  // Fall Back: any formation
  orders.push('fall_back');

  return orders;
}

// === Factory ===

function createCompany(side: 'french' | 'austrian'): CompanyState {
  return {
    side,
    strength: 100,
    integrity: 100,
    morale: 65,
    moraleGrade: 'steady',
    formation: Formation.Line,
    status: 'active',
    musketLoaded: true,
    order: 'fire',
    rangeOffset: 0,
    hasFirstFire: false,
    chargeReady: false,
    quality: 4,
  };
}

export function createEngagement(range = 120): EngagementState {
  return {
    french: [createCompany('french'), createCompany('french'), createCompany('french')],
    austrian: [createCompany('austrian'), createCompany('austrian'), createCompany('austrian')],
    range,
    volleyCount: 0,
    phase: 'ready',
    winner: null,
    austrianDoctrine: 'steady_advance',
    autoPlay: false,
    drillStep: null,
    volleyStepData: null,
  };
}

// === Effective Range (base + offset for a formation pair) ===

export function effectiveRange(baseRange: number, frOffset: number, atOffset: number): number {
  // Both offsets are negative when advancing (closer). Sum them for total closure.
  return Math.max(TUNING.movement.minEffectiveRange, baseRange + frOffset + atOffset);
}

// === d100 Effectiveness Roll ===

/** Roll d100 and compare to effectiveness target built from additive modifiers. */
export function rollVolleyEffectiveness(
  attacker: CompanyState,
  effectiveRng: number,
  isCrossfire: boolean,
): VolleyRollResult {
  const r = TUNING.roll;
  const t = TUNING.tiers;

  // Build effectiveness target from additive modifiers
  let rangeMod: number = r.rangeDistantMod;
  for (const bracket of r.rangeMods) {
    if (effectiveRng <= bracket.maxRange) { rangeMod = bracket.mod; break; }
  }
  const moraleMod = (attacker.morale - r.moraleCenterpoint) / r.moraleDivisor;
  const crossfireMod = isCrossfire ? r.crossfirePenalty : 0;
  const firstFireMod = attacker.hasFirstFire ? r.firstFireBonus : 0;
  const qualityMod = (attacker.quality - r.qualityCenter) * r.qualityStep;
  const integrityMod = (attacker.integrity - r.integrityCenterpoint) / r.integrityDivisor;

  const target = Math.max(r.targetMin, Math.min(r.targetMax, Math.round(
    r.baseTarget + rangeMod + moraleMod + crossfireMod + firstFireMod + qualityMod + integrityMod
  )));

  const roll = Math.floor(Math.random() * 100) + 1;
  const margin = target - roll;

  let tier: VolleyTier;
  let tierMultiplier: number;
  if (margin >= t.devastating.minMargin) { tier = 'devastating'; tierMultiplier = t.devastating.multiplier; }
  else if (margin >= t.effective.minMargin) { tier = 'effective'; tierMultiplier = t.effective.multiplier; }
  else if (margin >= t.ragged.minMargin) { tier = 'ragged'; tierMultiplier = t.ragged.multiplier; }
  else { tier = 'ineffective'; tierMultiplier = t.ineffective.multiplier; }

  return { roll, target, margin, tier, tierMultiplier };
}

// === Fire Formula ===

function fireDamage(
  attacker: CompanyState,
  effectiveRng: number,
  isCrossfire: boolean,
): { damage: number; integrityLoss: number; roll: VolleyRollResult } {
  const roll = rollVolleyEffectiveness(attacker, effectiveRng, isCrossfire);
  const d = TUNING.damage;

  const profile = FORMATION_PROFILES[attacker.formation];
  const strengthMod = attacker.strength / 100;
  const firePower = profile.firePower;
  const chargeBonus = attacker.chargeReady ? d.chargeBonus : 1.0;
  const qualityDmgMod = d.qualityDmgBase + attacker.quality * d.qualityDmgScale;

  let rangeLethality: number = d.rangeDistantLethality;
  for (const bracket of d.rangeLethality) {
    if (effectiveRng <= bracket.maxRange) { rangeLethality = bracket.mult; break; }
  }

  const damage = d.base * strengthMod * firePower * chargeBonus * qualityDmgMod * rangeLethality * roll.tierMultiplier;
  const integrityLoss = damage * d.integrityLossRatio;

  return { damage, integrityLoss, roll };
}

// === Apply Damage to Target ===

function applyDamageToTarget(
  target: CompanyState,
  damage: number,
  integrityLoss: number,
  isCrossfire: boolean,
): void {
  const profile = FORMATION_PROFILES[target.formation];

  // Apply incoming damage modifier
  const damageMod = isCrossfire ? profile.crossfireVulnerability : profile.incomingDamage;
  const actualDamage = damage * damageMod;
  const actualIntegrityLoss = integrityLoss * damageMod;

  target.strength = Math.max(0, target.strength - actualDamage);
  target.integrity = Math.max(0, target.integrity - actualIntegrityLoss);
}

// === Melee Resolution ===

/** Calculate melee base score for a company. */
function meleeBaseScore(f: CompanyState): number {
  const m = TUNING.melee;
  return (f.strength * m.strengthWeight)
    + (f.morale * m.moraleWeight)
    + (f.quality * m.qualityWeight)
    + (m.formationBonus[f.formation] ?? 0);
}

/** Resolve melee between a charger and defender. Returns MeleeResult. */
export function resolveMelee(
  charger: CompanyState,
  defender: CompanyState,
  pairIndex: number,
): MeleeResult {
  const m = TUNING.melee;
  const chargerBase = meleeBaseScore(charger);
  const defenderBase = meleeBaseScore(defender);

  const chargerRoll = Math.floor(Math.random() * 100) + 1;
  const defenderRoll = Math.floor(Math.random() * 100) + 1;

  const chargerTotal = chargerBase + chargerRoll;
  const defenderTotal = defenderBase + defenderRoll;

  const margin = Math.abs(chargerTotal - defenderTotal);
  const chargerWins = chargerTotal >= defenderTotal;
  const victorSide = chargerWins ? charger.side : defender.side;

  // Determine outcome tier
  let strengthDamage: number;
  let victorMoraleBoost: number;
  if (margin >= m.decisive.minMargin) {
    strengthDamage = m.decisive.strengthLoss;
    victorMoraleBoost = m.decisive.morale;
  } else if (margin >= m.clear.minMargin) {
    strengthDamage = m.clear.strengthLoss;
    victorMoraleBoost = m.clear.morale;
  } else {
    strengthDamage = m.narrow.strengthLoss;
    victorMoraleBoost = m.narrow.morale;
  }

  // Apply results
  const loser = chargerWins ? defender : charger;
  const winner = chargerWins ? charger : defender;

  // Loser takes strength damage and routes
  loser.strength = Math.max(0, loser.strength - strengthDamage);
  loser.morale = 0;
  loser.moraleGrade = 'routing';
  loser.status = 'routing';

  // Winner gets morale boost
  winner.morale = Math.min(100, winner.morale + victorMoraleBoost);
  winner.moraleGrade = moraleToGrade(winner.morale);

  // Charger recoil if they lost
  const chargerRecoiled = !chargerWins;
  if (chargerRecoiled) {
    charger.rangeOffset += m.recoilDistance;
    charger.chargeReady = false;
  }

  return {
    pairIndex,
    chargerSide: charger.side,
    chargerScore: chargerTotal,
    defenderScore: defenderTotal,
    chargerRoll,
    defenderRoll,
    victorSide,
    margin,
    strengthDamage,
    chargerRecoiled,
  };
}

// === Morale Update ===

function updateMorale(
  f: CompanyState,
  casualtiesThisVolley: number,
  wasCrossfired: boolean,
  alliesOnSide: CompanyState[],
  index: number,
  receivedTier?: VolleyTier | null,
  deliveredTier?: VolleyTier | null,
): void {
  if (f.status !== 'active') return;
  const m = TUNING.morale;

  let delta = 0;

  // Drain from casualties taken this volley (scaled by severity)
  if (casualtiesThisVolley > 0) {
    delta -= casualtiesThisVolley * m.casualtyWeight;
  }

  // Morale feedback from volley tier
  if (receivedTier === 'devastating') delta += m.tierFeedback.devastatingReceived;
  if (deliveredTier === 'ineffective') delta += m.tierFeedback.ineffectiveDelivered;
  if (deliveredTier === 'devastating') delta += m.tierFeedback.devastatingDelivered;

  // Drain from low strength
  for (const { threshold, penalty } of m.lowStrengthDrain) {
    if (f.strength < threshold) { delta += penalty; break; }
  }

  // Drain from being crossfired (extra psychological shock)
  if (wasCrossfired) {
    delta += m.crossfireShock;
  }

  // Drain from neighbor routing
  const leftNeighbor = index > 0 ? alliesOnSide[index - 1] : null;
  const rightNeighbor = index < 2 ? alliesOnSide[index + 1] : null;
  if (leftNeighbor && leftNeighbor.status === 'routing') delta += m.neighborRouting;
  if (rightNeighbor && rightNeighbor.status === 'routing') delta += m.neighborRouting;

  // Recovery from no casualties
  if (casualtiesThisVolley === 0) {
    delta += m.noCasualtiesRecovery;
  }

  // Recovery from hold fire order
  if (f.order === 'hold_fire') {
    delta += m.holdFireRecovery;
  }

  // Recovery from fall back order
  if (f.order === 'fall_back') {
    delta += m.fallBackRecovery;
  }

  // Recovery from high integrity
  if (f.integrity > m.highIntegrityThreshold) {
    delta += m.highIntegrityBonus;
  }

  // Recovery from resolute neighbor
  if (leftNeighbor && leftNeighbor.status === 'active' && leftNeighbor.moraleGrade === 'resolute') delta += m.resoluteNeighborBonus;
  if (rightNeighbor && rightNeighbor.status === 'active' && rightNeighbor.moraleGrade === 'resolute') delta += m.resoluteNeighborBonus;

  // Formation-specific modifiers
  if (f.formation === Formation.Square) {
    delta += m.squareBonus;
  } else if (f.formation === Formation.Skirmish) {
    // Skirmish drains slower — reduce negative deltas
    if (delta < 0) delta *= m.skirmishDrainFactor;
  }

  // Quality resilience: each step from center reduces morale drain
  if (delta < 0 && f.quality !== m.qualityResilience.center) {
    delta *= 1.0 / (1.0 + (f.quality - m.qualityResilience.center) * m.qualityResilience.step);
  }

  f.morale = Math.max(0, Math.min(100, f.morale + delta));
  f.moraleGrade = moraleToGrade(f.morale);
}

// === Austrian AI ===

export function chooseAustrianOrder(
  f: CompanyState,
  index: number,
  state: EngagementState,
): Order {
  if (f.status !== 'active') return 'hold_fire';

  const validOrders = getValidOrders(f);
  const eRange = effectiveRange(state.range, 0, f.rangeOffset);
  const doctrine = state.austrianDoctrine;

  // Wavering formations may ignore orders
  if (f.moraleGrade === 'wavering' && Math.random() < TUNING.morale.waveringOverrideChance) {
    return f.musketLoaded ? 'fire' : 'hold_fire';
  }

  switch (doctrine) {
    case 'steady_advance': {
      if (f.formation === Formation.Column) {
        // Charge if ready and strong enough
        if (validOrders.includes('charge') && f.strength > 50) return 'charge';
        if (eRange > 80 && validOrders.includes('advance')) return 'advance';
        return f.musketLoaded ? 'fire' : 'hold_fire';
      }
      if (f.strength < 30 && validOrders.includes('fall_back')) return 'fall_back';
      return f.musketLoaded && validOrders.includes('fire') ? 'fire' : 'hold_fire';
    }

    case 'aggressive_assault': {
      if (f.formation === Formation.Column) {
        // Always charge when ready
        if (validOrders.includes('charge')) return 'charge';
        if (eRange > 30 && validOrders.includes('advance')) return 'advance';
        return f.musketLoaded ? 'fire' : 'hold_fire';
      }
      return f.musketLoaded && validOrders.includes('fire') ? 'fire' : 'hold_fire';
    }

    case 'holding_action': {
      // Never charge
      if (f.strength < 40 && validOrders.includes('fall_back')) return 'fall_back';
      return f.musketLoaded && validOrders.includes('fire') ? 'fire' : 'hold_fire';
    }

    case 'concentrated_strike': {
      const frenchStrengths = state.french.map(fr => fr.status === 'active' ? fr.strength : 999);
      const weakestIdx = frenchStrengths.indexOf(Math.min(...frenchStrengths));

      // Charge weakest target
      if (f.formation === Formation.Column && validOrders.includes('charge') && weakestIdx === index) {
        return 'charge';
      }

      if (f.formation === Formation.Line && f.musketLoaded && validOrders.includes('crossfire')) {
        if (weakestIdx !== index && Math.abs(weakestIdx - index) === 1) {
          return 'crossfire';
        }
      }

      if (weakestIdx === index && f.musketLoaded && validOrders.includes('fire')) {
        return 'fire';
      }

      return f.musketLoaded && validOrders.includes('fire') ? 'fire' : 'hold_fire';
    }
  }
}

// Simple French AI for auto-play mode
export function chooseFrenchAutoOrder(
  f: CompanyState,
  _index: number,
  state: EngagementState,
): Order {
  if (f.status !== 'active') return 'hold_fire';
  const validOrders = getValidOrders(f);

  if (f.formation === Formation.Column) {
    // Charge if ready and strong enough
    if (validOrders.includes('charge') && f.strength > 40) return 'charge';
    const eRange = effectiveRange(state.range, f.rangeOffset, 0);
    if (eRange > 60 && validOrders.includes('advance')) return 'advance';
    return f.musketLoaded ? 'fire' : 'hold_fire';
  }

  if (f.musketLoaded && validOrders.includes('fire')) return 'fire';
  return 'hold_fire';
}

// === Side Fire Resolution (shared by both phases) ===

/** Pick the more impactful tier (higher multiplier = more damaging). */
const TIER_RANK: Record<VolleyTier, number> = { devastating: 3, effective: 2, ragged: 1, ineffective: 0 };
function worseTier(a: VolleyTier | null, b: VolleyTier): VolleyTier {
  if (!a) return b;
  return TIER_RANK[a] >= TIER_RANK[b] ? a : b;
}

interface SideFireResult {
  damageTaken: [number, number, number];         // damage dealt to each target (target-indexed)
  crossfired: [boolean, boolean, boolean];        // whether each target was crossfired
  rolls: [VolleyRollResult | null, VolleyRollResult | null, VolleyRollResult | null]; // per attacker
  receivedTiers: [VolleyTier | null, VolleyTier | null, VolleyTier | null]; // worst tier per target
}

/** Resolve fire for one side: calculate damage, apply it to targets, consume ammo. Returns results. */
function resolveSideFire(
  attackers: CompanyState[],
  targets: CompanyState[],
  state: EngagementState,
): SideFireResult {
  const result: SideFireResult = {
    damageTaken: [0, 0, 0],
    crossfired: [false, false, false],
    rolls: [null, null, null],
    receivedTiers: [null, null, null],
  };

  for (let i = 0; i < 3; i++) {
    const atk = attackers[i];
    if (atk.status !== 'active') continue;

    // Chargers skip normal fire — they'll resolve in the charge phase
    if (atk.order === 'charge') continue;

    // If the opposing target is charging, skip normal fire — will be defensive fire in charge phase
    if (targets[i].order === 'charge') continue;

    if (atk.order === 'fire') {
      const tgt = targets[i];
      if (tgt.status !== 'active') continue;
      const atkIsFrench = atk.side === 'french';
      const eRange = effectiveRange(
        state.range,
        atkIsFrench ? atk.rangeOffset : tgt.rangeOffset,
        atkIsFrench ? tgt.rangeOffset : atk.rangeOffset,
      );
      const { damage, integrityLoss, roll } = fireDamage(atk, eRange, false);
      result.rolls[i] = roll;
      result.receivedTiers[i] = worseTier(result.receivedTiers[i], roll.tier);
      const tgtStrBefore = tgt.strength;
      applyDamageToTarget(tgt, damage, integrityLoss, false);
      result.damageTaken[i] += tgtStrBefore - tgt.strength;
      atk.hasFirstFire = false;
      atk.chargeReady = false;
      atk.musketLoaded = false;
    } else if (atk.order === 'crossfire') {
      const adjTargets = i === 0 ? [1] : i === 2 ? [1] : [0, 2];
      let targetIdx = adjTargets[0];
      if (adjTargets.length > 1) {
        const s0 = targets[adjTargets[0]].status === 'active' ? targets[adjTargets[0]].strength : 999;
        const s1 = targets[adjTargets[1]].status === 'active' ? targets[adjTargets[1]].strength : 999;
        targetIdx = s0 <= s1 ? adjTargets[0] : adjTargets[1];
      }
      const tgt = targets[targetIdx];
      if (tgt.status !== 'active') continue;
      const atkIsFrench = atk.side === 'french';
      const eRange = effectiveRange(
        state.range,
        atkIsFrench ? atk.rangeOffset : tgt.rangeOffset,
        atkIsFrench ? tgt.rangeOffset : atk.rangeOffset,
      );
      const { damage, integrityLoss, roll } = fireDamage(atk, eRange, true);
      result.rolls[i] = roll;
      result.receivedTiers[targetIdx] = worseTier(result.receivedTiers[targetIdx], roll.tier);
      const tgtStrBefore = tgt.strength;
      applyDamageToTarget(tgt, damage, integrityLoss, true);
      result.damageTaken[targetIdx] += tgtStrBefore - tgt.strength;
      result.crossfired[targetIdx] = true;
      atk.hasFirstFire = false;
      atk.chargeReady = false;
      atk.musketLoaded = false;
    }
  }

  return result;
}

// ============================================================
// === Drill Step Functions ===
// ============================================================
// The volley is broken into 5 discrete steps. Each can be called
// individually (for step-by-step UI) or all at once via the wrapper.
// Execution order preserves identical behavior to the original
// monolithic resolveEngagementVolley().

/** COMMAND: Validate orders. Wavering formations may ignore their assigned order. */
export function resolveCommand(state: EngagementState): void {
  state.phase = 'running';
  state.drillStep = 'command';

  for (const side of [state.french, state.austrian] as CompanyState[][]) {
    for (const f of side) {
      if (f.status !== 'active') continue;
      if (f.moraleGrade === 'wavering' && Math.random() < TUNING.morale.waveringOverrideChance) {
        f.order = f.musketLoaded ? 'fire' : 'hold_fire';
      }
    }
  }
}

/** PRESENT: Pre-fire validation. Placeholder for future fire doctrine decisions. */
export function resolvePresent(state: EngagementState): void {
  state.drillStep = 'present';
  // Future: fire doctrine modifiers, target validation, crossfire arc checks
}

/** FIRE: Execute fire (French first, then Austrian) + resolve movement orders. */
export function resolveFire(state: EngagementState): void {
  state.drillStep = 'fire';

  // French fires first — damage applies to Austrians immediately
  const frResult = resolveSideFire(state.french, state.austrian, state);

  // Austrian fires second — uses their (now reduced) strength
  const atResult = resolveSideFire(state.austrian, state.french, state);

  // Build per-pair step data from results
  const stepData: VolleyStepData = [0, 1, 2].map(i => ({
    frenchDamageTaken: atResult.damageTaken[i],
    austrianDamageTaken: frResult.damageTaken[i],
    frenchCrossfired: atResult.crossfired[i],
    austrianCrossfired: frResult.crossfired[i],
    frenchRoll: frResult.rolls[i],
    austrianRoll: atResult.rolls[i],
    frenchReceivedTier: atResult.receivedTiers[i],
    austrianReceivedTier: frResult.receivedTiers[i],
    meleeResult: null,
    defensiveFireRoll: null,
  })) as VolleyStepData;

  // === Charge Resolution ===
  for (let i = 0; i < 3; i++) {
    const fr = state.french[i];
    const at = state.austrian[i];
    const frCharges = fr.order === 'charge' && fr.status === 'active';
    const atCharges = at.order === 'charge' && at.status === 'active';

    if (!frCharges && !atCharges) continue;

    if (frCharges && atCharges) {
      // Head-on collision — no defensive fire, just melee
      const result = resolveMelee(fr, at, i);
      stepData[i].meleeResult = result;
      // Track damage
      if (result.victorSide === 'french') {
        stepData[i].austrianDamageTaken += result.strengthDamage;
      } else {
        stepData[i].frenchDamageTaken += result.strengthDamage;
      }
    } else {
      const charger = frCharges ? fr : at;
      const defender = frCharges ? at : fr;

      // Defensive fire: defender fires at charger at close range
      if (defender.status === 'active' && defender.musketLoaded) {
        const defFireResult = fireDamage(defender, TUNING.melee.defensiveFireRange, false);
        stepData[i].defensiveFireRoll = defFireResult.roll;

        const chargerStrBefore = charger.strength;
        applyDamageToTarget(charger, defFireResult.damage, defFireResult.integrityLoss, false);
        const dmgDealt = chargerStrBefore - charger.strength;

        if (frCharges) {
          stepData[i].frenchDamageTaken += dmgDealt;
        } else {
          stepData[i].austrianDamageTaken += dmgDealt;
        }

        defender.musketLoaded = false;
        defender.hasFirstFire = false;

        // Check if charger was routed by defensive fire
        if (charger.strength <= 0) {
          charger.status = 'routing';
          charger.morale = 0;
          charger.moraleGrade = 'routing';
          continue; // Charge fails
        }
      }

      // Melee resolution
      if (charger.status === 'active' && defender.status === 'active') {
        const result = resolveMelee(charger, defender, i);
        stepData[i].meleeResult = result;
        if (result.victorSide === charger.side) {
          if (frCharges) {
            stepData[i].austrianDamageTaken += result.strengthDamage;
          } else {
            stepData[i].frenchDamageTaken += result.strengthDamage;
          }
        } else {
          if (frCharges) {
            stepData[i].frenchDamageTaken += result.strengthDamage;
          } else {
            stepData[i].austrianDamageTaken += result.strengthDamage;
          }
        }
      }
    }
  }

  // Resolve movement
  for (const side of [state.french, state.austrian] as CompanyState[][]) {
    for (const f of side) {
      if (f.status !== 'active') continue;
      const profile = FORMATION_PROFILES[f.formation];

      if (f.order === 'advance' && profile.moveSpeed > 0) {
        f.rangeOffset -= profile.moveSpeed;
        if (f.formation === Formation.Column) {
          const oppositeIdx = side === state.french
            ? state.french.indexOf(f)
            : state.austrian.indexOf(f);
          const otherSide = side === state.french ? state.austrian : state.french;
          const opposite = otherSide[oppositeIdx];
          const eRange = effectiveRange(
            state.range,
            side === state.french ? f.rangeOffset : opposite?.rangeOffset ?? 0,
            side === state.austrian ? f.rangeOffset : opposite?.rangeOffset ?? 0,
          );
          if (eRange <= TUNING.movement.chargeRange) {
            f.chargeReady = true;
          }
        }
      } else if (f.order === 'fall_back') {
        f.rangeOffset = Math.min(0, f.rangeOffset + TUNING.movement.fallBackDistance);
      }
    }
  }

  // Store step data for ENDURE
  state.volleyStepData = stepData;
}

/** ENDURE: Integrity recovery, morale update, routing cascade. */
export function resolveEndure(state: EngagementState): void {
  state.drillStep = 'endure';

  const stepData = state.volleyStepData;
  if (!stepData) return;

  // Integrity recovery (must happen before morale — morale reads f.integrity)
  for (const side of [state.french, state.austrian] as CompanyState[][]) {
    for (const f of side) {
      if (f.status !== 'active') continue;
      const profile = FORMATION_PROFILES[f.formation];

      let recovery = profile.integrityRecovery;
      if (f.order === 'hold_fire') recovery += TUNING.integrity.holdFireRecovery;
      if (f.order === 'fall_back') recovery += TUNING.integrity.fallBackRecovery;

      if (recovery > 0) {
        f.integrity = Math.min(100, f.integrity + recovery);
      }
    }
  }

  // Morale update — receivedTier is target-indexed (correct for crossfire)
  // deliveredTier is attacker-indexed (what this company's volley achieved)
  for (let i = 0; i < 3; i++) {
    const p = stepData[i];
    updateMorale(state.french[i], p.frenchDamageTaken, p.frenchCrossfired, state.french, i,
      p.frenchReceivedTier, p.frenchRoll?.tier);
    updateMorale(state.austrian[i], p.austrianDamageTaken, p.austrianCrossfired, state.austrian, i,
      p.austrianReceivedTier, p.austrianRoll?.tier);
  }

  // Routing cascade
  let cascadeOccurred = true;
  while (cascadeOccurred) {
    cascadeOccurred = false;
    for (const side of [state.french, state.austrian] as CompanyState[][]) {
      for (let i = 0; i < 3; i++) {
        const f = side[i];
        if (f.status !== 'active') continue;
        if (f.moraleGrade === 'routing' || f.strength <= 0) {
          f.status = 'routing';
          if (i > 0 && side[i - 1].status === 'active') {
            side[i - 1].morale = Math.max(0, side[i - 1].morale - TUNING.morale.routingCascadePenalty);
            side[i - 1].moraleGrade = moraleToGrade(side[i - 1].morale);
            if (side[i - 1].moraleGrade === 'routing') cascadeOccurred = true;
          }
          if (i < 2 && side[i + 1].status === 'active') {
            side[i + 1].morale = Math.max(0, side[i + 1].morale - TUNING.morale.routingCascadePenalty);
            side[i + 1].moraleGrade = moraleToGrade(side[i + 1].morale);
            if (side[i + 1].moraleGrade === 'routing') cascadeOccurred = true;
          }
        }
      }
    }
  }
}

/** LOAD: Reload muskets, set first-fire flags, increment volley count, check win. */
export function resolveLoad(state: EngagementState): VolleyResult {
  state.drillStep = 'load';

  const stepData = state.volleyStepData;

  // Reload all muskets + set first-fire flags
  for (const side of [state.french, state.austrian] as CompanyState[][]) {
    for (const f of side) {
      if (f.status !== 'active') continue;

      f.musketLoaded = true;

      if (f.order === 'hold_fire') {
        f.hasFirstFire = true;
      }
    }
  }

  // Build pair results (include roll data)
  const pairs: PairResult[] = [0, 1, 2].map(i => {
    const p = stepData?.[i];
    return {
      pairIndex: i,
      frenchDamage: p?.frenchDamageTaken ?? 0,
      austrianDamage: p?.austrianDamageTaken ?? 0,
      frenchRouted: state.french[i].status !== 'active',
      austrianRouted: state.austrian[i].status !== 'active',
      frenchRoll: p?.frenchRoll ?? undefined,
      austrianRoll: p?.austrianRoll ?? undefined,
      meleeResult: p?.meleeResult ?? undefined,
    };
  });

  // Increment volley count
  state.volleyCount++;

  // Win check
  const frenchAllDown = state.french.every(f => f.status !== 'active');
  const austrianAllDown = state.austrian.every(f => f.status !== 'active');

  let winner: 'french' | 'austrian' | null = null;
  let battleOver = false;

  if (frenchAllDown && austrianAllDown) {
    const frStr = state.french.reduce((s, f) => s + f.strength, 0);
    const atStr = state.austrian.reduce((s, f) => s + f.strength, 0);
    winner = frStr >= atStr ? 'french' : 'austrian';
    battleOver = true;
  } else if (frenchAllDown) {
    winner = 'austrian';
    battleOver = true;
  } else if (austrianAllDown) {
    winner = 'french';
    battleOver = true;
  }

  if (battleOver) {
    state.phase = 'ended';
    state.winner = winner;
  }

  // Clear inter-step data
  state.volleyStepData = null;
  state.drillStep = null;

  return { pairs, newRange: state.range, battleOver, winner };
}

// === Volley Resolution (wrapper) ===
// Calls all 5 drill steps sequentially. Produces identical results
// to the original monolithic function.

export function resolveEngagementVolley(state: EngagementState): VolleyResult {
  resolveCommand(state);
  resolvePresent(state);
  resolveFire(state);
  resolveEndure(state);
  return resolveLoad(state);
}

// === Doctrine Descriptions ===

export const DOCTRINE_INFO: Record<Doctrine, { label: string; description: string }> = {
  steady_advance: {
    label: 'Steady Advance',
    description: 'Advance in column to 80 paces, reform to line, then fire. Predictable but relentless.',
  },
  aggressive_assault: {
    label: 'Aggressive Assault',
    description: 'Rush to melee range in column and charge. High risk — vulnerable to crossfire.',
  },
  holding_action: {
    label: 'Holding Action',
    description: 'Stay in line, fire every volley, fall back if weakened. Defensive grind.',
  },
  concentrated_strike: {
    label: 'Concentrated Strike',
    description: 'Crossfire the weakest French company. Exploits gaps.',
  },
};

// === Order Descriptions ===

export const ORDER_INFO: Record<Order, { label: string; icon: string; description: string }> = {
  fire: {
    label: 'Fire',
    icon: '\u{1F525}',
    description: 'Standard volley at opposing company.',
  },
  hold_fire: {
    label: 'Hold',
    icon: '\u23F8',
    description: 'No fire. +15 integrity. First Fire bonus (+50%) on next volley.',
  },
  crossfire: {
    label: 'Crossfire',
    icon: '\u2197',
    description: 'Fire at adjacent enemy (0.7x accuracy). Line only.',
  },
  advance: {
    label: 'Advance',
    icon: '\u2B06',
    description: 'Close range. Column 30 paces, Skirmish 15. Charge at <=25.',
  },
  charge: {
    label: 'Charge',
    icon: '\u2694',
    description: 'Bayonet charge into melee. Column only, at <=25 paces.',
  },
  fall_back: {
    label: 'Fall Back',
    icon: '\u2B07',
    description: 'Increase range by 20 paces. +10 integrity recovery.',
  },
};
