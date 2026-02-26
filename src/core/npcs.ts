import {
  NPC,
  NPCRole,
  MilitaryRank,
  Soldier,
  Officer,
  MoraleThreshold,
  getMoraleThreshold,
  BattleState,
} from '../types';
import type { BattleRoles } from '../data/battles/types';
import type { NPCTemplate } from '../data/campaigns/types';

// Create NPCs from campaign template data
export function createNPCsFromTemplates(templates: NPCTemplate[]): NPC[] {
  return templates.map((t) => ({
    id: t.id,
    name: t.name,
    role: t.role,
    rank: t.rank,
    relationship: t.baseStats.relationship,
    alive: true,
    wounded: false,
    morale: t.baseStats.morale,
    maxMorale: t.baseStats.maxMorale,
    valor: t.baseStats.valor,
  }));
}

// Create the 4 campaign NPCs (legacy wrapper — uses hardcoded Italy NPCs)
export function createCampaignNPCs(): NPC[] {
  return [
    {
      id: 'pierre',
      name: 'Pierre',
      role: NPCRole.Neighbour,
      rank: MilitaryRank.Private,
      relationship: 60,
      alive: true,
      wounded: false,
      morale: 90,
      maxMorale: 100,
      valor: 55,
    },
    {
      id: 'jean-baptiste',
      name: 'Jean-Baptiste',
      role: NPCRole.Neighbour,
      rank: MilitaryRank.Private,
      relationship: 40,
      alive: true,
      wounded: false,
      morale: 70,
      maxMorale: 85,
      valor: 20,
    },
    {
      id: 'duval',
      name: 'Sergeant Duval',
      role: NPCRole.NCO,
      rank: MilitaryRank.Sergeant,
      relationship: 20,
      alive: true,
      wounded: false,
      morale: 95,
      maxMorale: 100,
      valor: 65,
    },
    {
      id: 'leclerc',
      name: 'Captain Leclerc',
      role: NPCRole.Officer,
      rank: MilitaryRank.Captain,
      relationship: 30,
      alive: true,
      wounded: false,
      morale: 90,
      maxMorale: 100,
      valor: 60,
    },
  ];
}

// Bridge NPC → Soldier interface for battle line neighbours
export function npcToSoldier(npc: NPC): Soldier {
  const maxMorale = npc.maxMorale;
  return {
    id: npc.id,
    name: npc.name,
    rank:
      npc.rank === MilitaryRank.Sergeant
        ? 'sergeant'
        : npc.rank === MilitaryRank.Corporal
          ? 'corporal'
          : 'private',
    valor: npc.valor,
    morale: npc.morale,
    maxMorale,
    threshold: getMoraleThreshold(npc.morale, maxMorale),
    alive: npc.alive,
    wounded: npc.wounded,
    routing: false,
    musketLoaded: true,
    relationship: npc.relationship,
  };
}

// Bridge NPC → Officer interface
export function npcToOfficer(npc: NPC): Officer {
  return {
    name: npc.name,
    rank:
      npc.rank === MilitaryRank.Captain
        ? 'Capt.'
        : npc.rank === MilitaryRank.Lieutenant
          ? 'Lt.'
          : 'Sgt.',
    alive: npc.alive,
    wounded: npc.wounded,
    mounted: npc.rank === MilitaryRank.Captain || npc.rank === MilitaryRank.Lieutenant,
    status: npc.wounded ? 'Wounded' : 'Steady',
  };
}

/**
 * Write battle outcomes back to NPCs after battle ends.
 * Uses BattleRoles to match NPCs by role rather than hardcoded IDs.
 * Returns list of NPC IDs that died in this battle.
 */
export function syncBattleResultsToNPCs(
  npcs: NPC[],
  battle: BattleState,
  roles: BattleRoles,
): string[] {
  const deaths: string[] = [];

  // Sync left neighbour
  if (roles.leftNeighbour && battle.line.leftNeighbour) {
    const npc = npcs.find((n) => n.id === roles.leftNeighbour);
    if (npc) {
      npc.alive = battle.line.leftNeighbour.alive;
      npc.wounded = battle.line.leftNeighbour.wounded;
      npc.morale = battle.line.leftNeighbour.morale;
      if (battle.line.leftNeighbour.routing) npc.morale = 0;
      if (!npc.alive) deaths.push(npc.id);
    }
  }

  // Sync right neighbour
  if (roles.rightNeighbour && battle.line.rightNeighbour) {
    const npc = npcs.find((n) => n.id === roles.rightNeighbour);
    if (npc) {
      npc.alive = battle.line.rightNeighbour.alive;
      npc.wounded = battle.line.rightNeighbour.wounded;
      npc.morale = battle.line.rightNeighbour.morale;
      if (battle.line.rightNeighbour.routing) npc.morale = 0;
      if (!npc.alive) deaths.push(npc.id);
    }
  }

  // Sync officer
  if (roles.officer) {
    const npc = npcs.find((n) => n.id === roles.officer);
    if (npc) {
      npc.alive = battle.line.officer.alive;
      npc.wounded = battle.line.officer.wounded;
      if (!npc.alive) deaths.push(npc.id);
    }
  }

  return deaths;
}
