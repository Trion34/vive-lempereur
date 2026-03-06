import { CampaignPhase } from '../types';
import type { CampaignState, NPC } from '../types';
import type {
  CampaignDef,
  CampaignNode,
  NPCTemplate,
  CampConfig,
} from '../data/campaigns/types';

/**
 * Create a fresh CampaignState for a given campaign definition.
 * Starts at sequenceIndex 0 with phase derived from the first node.
 */
export function createCampaignState(campaignDef: CampaignDef): CampaignState {
  return {
    campaignId: campaignDef.id,
    sequenceIndex: 0,
    phase: nodeToPhase(campaignDef.sequence[0]),
    battlesCompleted: 0,
    currentBattle: findCurrentBattle(campaignDef, 0),
    nextBattle: '',
    daysInCampaign: 0,
    npcDeaths: [],
    replacementsUsed: [],
  };
}

/** Convert a CampaignNode type to the corresponding CampaignPhase. */
export function nodeToPhase(node: CampaignNode): CampaignPhase {
  switch (node.type) {
    case 'camp':
      return CampaignPhase.Camp;
    case 'battle':
      return CampaignPhase.Battle;
    case 'interlude':
      return CampaignPhase.Interlude;
  }
}

/** Find the battleId of the nearest battle node at or after `fromIndex`. */
function findCurrentBattle(def: CampaignDef, fromIndex: number): string {
  for (let i = fromIndex; i < def.sequence.length; i++) {
    const node = def.sequence[i];
    if (node.type === 'battle') return node.battleId;
  }
  return '';
}

/**
 * Advance to the next node in the sequence.
 * Returns new CampaignState (pure -- no mutation).
 */
export function advanceSequence(
  campaign: CampaignState,
  campaignDef: CampaignDef,
): CampaignState {
  const nextIndex = campaign.sequenceIndex + 1;
  if (nextIndex >= campaignDef.sequence.length) {
    return { ...campaign, sequenceIndex: nextIndex, phase: CampaignPhase.Complete };
  }
  const nextNode = campaignDef.sequence[nextIndex];
  return {
    ...campaign,
    sequenceIndex: nextIndex,
    phase: nodeToPhase(nextNode),
    currentBattle: findCurrentBattle(campaignDef, nextIndex),
  };
}

/** Get the current node, or null if past the end. */
export function getCurrentNode(
  campaign: CampaignState,
  campaignDef: CampaignDef,
): CampaignNode | null {
  return campaignDef.sequence[campaign.sequenceIndex] ?? null;
}

/** Get camp config for a camp node, or null if not found. */
export function getCampConfigFromDef(
  campId: string,
  campaignDef: CampaignDef,
): CampConfig | null {
  return campaignDef.camps[campId] ?? null;
}

/** Check if current node is the last one in the sequence. */
export function isLastNode(
  campaign: CampaignState,
  campaignDef: CampaignDef,
): boolean {
  return campaign.sequenceIndex >= campaignDef.sequence.length - 1;
}

/**
 * Increment battlesCompleted (call after a battle victory).
 * Returns new CampaignState (pure -- no mutation).
 */
export function recordBattleVictory(campaign: CampaignState): CampaignState {
  return { ...campaign, battlesCompleted: campaign.battlesCompleted + 1 };
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
