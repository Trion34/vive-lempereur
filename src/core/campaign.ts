import { CampaignPhase } from '../types/enums';
import type { CampaignState } from '../types/campaign';
import type { NPC } from '../types/player';
import type {
  CampaignDef,
  CampaignBattleEntry,
  InterludeDef,
  NPCTemplate,
} from '../data/campaigns/types';

/**
 * Create a fresh CampaignState for a given campaign definition.
 * Starts at battleIndex 0 in the Prologue phase.
 */
export function createCampaignState(campaignDef: CampaignDef): CampaignState {
  const firstBattle = campaignDef.battles[0];
  const secondBattle = campaignDef.battles.length > 1 ? campaignDef.battles[1] : null;

  return {
    campaignId: campaignDef.id,
    battleIndex: 0,
    phase: CampaignPhase.Prologue,
    battlesCompleted: 0,
    currentBattle: firstBattle.battleId,
    nextBattle: secondBattle?.battleId ?? '',
    daysInCampaign: 0,
    npcDeaths: [],
    replacementsUsed: [],
  };
}

/**
 * Replace dead NPCs with unused replacements from the pool.
 * Returns updated NPC array and list of newly used replacement IDs.
 */
export function replaceDeadNPCs(
  npcs: NPC[],
  deaths: string[],
  pool: NPCTemplate[],
  alreadyUsed: string[],
): { npcs: NPC[]; newReplacements: string[] } {
  if (deaths.length === 0) {
    return { npcs, newReplacements: [] };
  }

  const used = new Set(alreadyUsed);
  const newReplacements: string[] = [];
  const updatedNpcs = [...npcs];

  for (const deadId of deaths) {
    const deadIndex = updatedNpcs.findIndex((n) => n.id === deadId);
    if (deadIndex === -1) continue;

    // Find next unused replacement matching the dead NPC's role
    const deadNpc = updatedNpcs[deadIndex];
    const replacement = pool.find((t) => !used.has(t.id) && t.role === deadNpc.role);

    if (replacement) {
      used.add(replacement.id);
      newReplacements.push(replacement.id);
      updatedNpcs[deadIndex] = {
        id: replacement.id,
        name: replacement.name,
        role: replacement.role,
        rank: replacement.rank,
        relationship: replacement.baseStats.relationship,
        alive: true,
        wounded: false,
        morale: replacement.baseStats.morale,
        maxMorale: replacement.baseStats.maxMorale,
        valor: replacement.baseStats.valor,
      };
    }
    // If no replacement available, remove the dead NPC
    else {
      updatedNpcs.splice(deadIndex, 1);
    }
  }

  return { npcs: updatedNpcs, newReplacements };
}

/**
 * Get the interlude definition between the current and next battle.
 * Returns null if no interlude exists (e.g., last battle).
 */
export function getCurrentInterlude(
  campaign: CampaignState,
  campaignDef: CampaignDef,
): InterludeDef | null {
  const current = campaignDef.battles[campaign.battleIndex];
  const next = campaignDef.battles[campaign.battleIndex + 1];
  if (!current || !next) return null;

  const key = `${current.battleId}-${next.battleId}`;
  return campaignDef.interludes[key] ?? null;
}

/**
 * Check if the current battle is the last in the campaign.
 */
export function isLastBattle(
  campaign: CampaignState,
  campaignDef: CampaignDef,
): boolean {
  return campaign.battleIndex >= campaignDef.battles.length - 1;
}

/**
 * Get the next battle entry, or null if at the last battle.
 */
export function getNextBattleEntry(
  campaign: CampaignState,
  campaignDef: CampaignDef,
): CampaignBattleEntry | null {
  const nextIndex = campaign.battleIndex + 1;
  if (nextIndex >= campaignDef.battles.length) return null;
  return campaignDef.battles[nextIndex];
}

/**
 * Get the current battle entry.
 */
export function getCurrentBattleEntry(
  campaign: CampaignState,
  campaignDef: CampaignDef,
): CampaignBattleEntry {
  return campaignDef.battles[campaign.battleIndex];
}

/**
 * Advance campaign to post-battle phase after a battle victory.
 * Returns new CampaignState (pure — no mutation).
 */
export function advanceToPostBattle(campaign: CampaignState): CampaignState {
  return {
    ...campaign,
    phase: CampaignPhase.PostBattleCamp,
    battlesCompleted: campaign.battlesCompleted + 1,
  };
}

/**
 * Advance campaign from post-battle to interlude (or complete if last battle).
 * Returns new CampaignState (pure — no mutation).
 */
export function advanceToInterlude(
  campaign: CampaignState,
  campaignDef: CampaignDef,
): CampaignState {
  if (isLastBattle(campaign, campaignDef)) {
    return { ...campaign, phase: CampaignPhase.Complete };
  }

  const next = campaignDef.battles[campaign.battleIndex + 1];
  return {
    ...campaign,
    phase: CampaignPhase.Interlude,
    battleIndex: campaign.battleIndex + 1,
    currentBattle: next.battleId,
    nextBattle: campaignDef.battles[campaign.battleIndex + 2]?.battleId ?? '',
  };
}

/**
 * Advance campaign from interlude to pre-battle camp.
 * Returns new CampaignState (pure — no mutation).
 */
export function advanceToPreBattleCamp(campaign: CampaignState): CampaignState {
  return {
    ...campaign,
    phase: CampaignPhase.PreBattleCamp,
  };
}
