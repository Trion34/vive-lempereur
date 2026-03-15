/**
 * Rank Promotion System
 *
 * Rank persists on PlayerCharacter. Progression requires reputation gates + Glory cost.
 * Checked at camp phase end (before battle) or at specific story beats.
 */

import { MilitaryRank } from '../types';
import type { PlayerCharacter } from '../types';

// ============================================================
// RANK ORDER
// ============================================================

const RANK_ORDER: MilitaryRank[] = [
  MilitaryRank.Private,
  MilitaryRank.Corporal,
  MilitaryRank.Sergeant,
  MilitaryRank.Lieutenant,
  MilitaryRank.Captain,
];

export function getRankIndex(rank: MilitaryRank): number {
  return RANK_ORDER.indexOf(rank);
}

export function getNextRank(rank: MilitaryRank): MilitaryRank | null {
  const idx = getRankIndex(rank);
  return idx < RANK_ORDER.length - 1 ? RANK_ORDER[idx + 1] : null;
}

// ============================================================
// PROMOTION REQUIREMENTS
// ============================================================

export interface RankRequirement {
  rank: MilitaryRank;
  soldierRep: number;
  officerRep: number;
  napoleonRep: number;
  gloryCost: number;
  label: string;
  promotionNarrative: string;
}

export const RANK_REQUIREMENTS: Record<string, RankRequirement> = {
  [MilitaryRank.Corporal]: {
    rank: MilitaryRank.Corporal,
    soldierRep: 40,
    officerRep: 30,
    napoleonRep: 0,
    gloryCost: 5,
    label: 'Corporal',
    promotionNarrative:
      'The men look to you now. When the sergeant fell, you kept your file steady. The captain noticed. "You — you\'re corporal now. Keep those men in line."',
  },
  [MilitaryRank.Sergeant]: {
    rank: MilitaryRank.Sergeant,
    soldierRep: 60,
    officerRep: 50,
    napoleonRep: 0,
    gloryCost: 15,
    label: 'Sergeant',
    promotionNarrative:
      'The company assembles. The captain reads the order: promotion to sergeant. The men cheer — some of them, at least. The ones who\'ve stood beside you in the line. You are responsible for them now.',
  },
  [MilitaryRank.Lieutenant]: {
    rank: MilitaryRank.Lieutenant,
    soldierRep: 0,
    officerRep: 70,
    napoleonRep: 10,
    gloryCost: 30,
    label: 'Lieutenant',
    promotionNarrative:
      'A field commission. The colonel himself delivers it: "For conspicuous gallantry..." You are an officer now. The gulf between you and the men you once stood beside yawns open. But they still follow you.',
  },
  [MilitaryRank.Captain]: {
    rank: MilitaryRank.Captain,
    soldierRep: 0,
    officerRep: 0,
    napoleonRep: 30,
    gloryCost: 50,
    label: 'Captain',
    promotionNarrative:
      'Napoleon himself signs the commission. "I remember you," he says — and perhaps he does. The company is yours. Every volley, every order, every life — yours to command. The weight settles onto your shoulders like a second pack.',
  },
};

// ============================================================
// CHECK PROMOTION ELIGIBILITY
// ============================================================

export interface PromotionCheck {
  eligible: boolean;
  nextRank: MilitaryRank;
  requirement: RankRequirement;
  meetsReputation: boolean;
  canAfford: boolean;
  /** Which specific rep gates are not met */
  failedGates: string[];
}

/**
 * Check if a player qualifies for promotion to the next rank.
 * Returns null if already at Captain (max rank).
 */
export function checkPromotionEligibility(
  pc: PlayerCharacter,
  currentGlory: number,
): PromotionCheck | null {
  const next = getNextRank(pc.rank);
  if (!next) return null;

  const req = RANK_REQUIREMENTS[next];
  if (!req) return null;

  const failedGates: string[] = [];
  if (pc.soldierRep < req.soldierRep) failedGates.push(`Soldier Rep: ${pc.soldierRep}/${req.soldierRep}`);
  if (pc.officerRep < req.officerRep) failedGates.push(`Officer Rep: ${pc.officerRep}/${req.officerRep}`);
  if (pc.napoleonRep < req.napoleonRep) failedGates.push(`Napoleon Rep: ${pc.napoleonRep}/${req.napoleonRep}`);

  const meetsReputation = failedGates.length === 0;
  const canAfford = currentGlory >= req.gloryCost;

  return {
    eligible: meetsReputation && canAfford,
    nextRank: next,
    requirement: req,
    meetsReputation,
    canAfford,
    failedGates,
  };
}

/**
 * Apply a rank promotion to the player character.
 * Returns the glory spent. Does NOT check eligibility — caller must validate first.
 */
export function applyPromotion(pc: PlayerCharacter, nextRank: MilitaryRank): number {
  const req = RANK_REQUIREMENTS[nextRank];
  pc.rank = nextRank;
  return req?.gloryCost ?? 0;
}

// ============================================================
// RANK DISPLAY HELPERS
// ============================================================

const RANK_LABELS: Record<MilitaryRank, string> = {
  [MilitaryRank.Private]: 'Private',
  [MilitaryRank.Corporal]: 'Corporal',
  [MilitaryRank.Sergeant]: 'Sergeant',
  [MilitaryRank.Lieutenant]: 'Lieutenant',
  [MilitaryRank.Captain]: 'Captain',
};

export function getRankLabel(rank: MilitaryRank): string {
  return RANK_LABELS[rank] || rank;
}

const RANK_ABBREVIATIONS: Record<MilitaryRank, string> = {
  [MilitaryRank.Private]: 'Pvt.',
  [MilitaryRank.Corporal]: 'Cpl.',
  [MilitaryRank.Sergeant]: 'Sgt.',
  [MilitaryRank.Lieutenant]: 'Lt.',
  [MilitaryRank.Captain]: 'Capt.',
};

export function getRankAbbreviation(rank: MilitaryRank): string {
  return RANK_ABBREVIATIONS[rank] || rank;
}
