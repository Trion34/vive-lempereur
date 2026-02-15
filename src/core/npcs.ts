import {
  NPC, NPCRole, NPCPersonality, MilitaryRank,
  Soldier, Officer, MoraleThreshold, getMoraleThreshold,
  BattleState,
} from '../types';

// Create the 4 campaign NPCs
export function createCampaignNPCs(): NPC[] {
  return [
    {
      id: 'pierre',
      name: 'Pierre',
      role: NPCRole.Neighbour,
      personality: NPCPersonality.Stoic,
      rank: MilitaryRank.Private,
      relationship: 60,
      trust: 50,
      alive: true,
      wounded: false,
      morale: 90,
      maxMorale: 100,
      valor: 55,
      experience: 30,
    },
    {
      id: 'jean-baptiste',
      name: 'Jean-Baptiste',
      role: NPCRole.Neighbour,
      personality: NPCPersonality.Nervous,
      rank: MilitaryRank.Private,
      relationship: 40,
      trust: 30,
      alive: true,
      wounded: false,
      morale: 70,
      maxMorale: 85,
      valor: 20,
      experience: 10,
    },
    {
      id: 'duval',
      name: 'Sergeant Duval',
      role: NPCRole.NCO,
      personality: NPCPersonality.Bitter,
      rank: MilitaryRank.Sergeant,
      relationship: 20,
      trust: 40,
      alive: true,
      wounded: false,
      morale: 95,
      maxMorale: 100,
      valor: 65,
      experience: 50,
    },
    {
      id: 'leclerc',
      name: 'Captain Leclerc',
      role: NPCRole.Officer,
      personality: NPCPersonality.Ambitious,
      rank: MilitaryRank.Captain,
      relationship: 30,
      trust: 30,
      alive: true,
      wounded: false,
      morale: 90,
      maxMorale: 100,
      valor: 60,
      experience: 40,
    },
  ];
}

// Bridge NPC → Soldier interface for battle line neighbours
export function npcToSoldier(npc: NPC): Soldier {
  const maxMorale = npc.maxMorale;
  return {
    id: npc.id,
    name: npc.name,
    rank: npc.rank === MilitaryRank.Sergeant ? 'sergeant' :
          npc.rank === MilitaryRank.Corporal ? 'corporal' : 'private',
    valor: npc.valor,
    morale: npc.morale,
    maxMorale,
    threshold: getMoraleThreshold(npc.morale, maxMorale),
    alive: npc.alive,
    wounded: npc.wounded,
    routing: false,
    musketLoaded: true,
    experience: npc.experience,
    relationship: npc.relationship,
  };
}

// Bridge NPC → Officer interface
export function npcToOfficer(npc: NPC): Officer {
  return {
    name: npc.name,
    rank: npc.rank === MilitaryRank.Captain ? 'Capt.' :
          npc.rank === MilitaryRank.Lieutenant ? 'Lt.' : 'Sgt.',
    alive: npc.alive,
    wounded: npc.wounded,
    mounted: npc.rank === MilitaryRank.Captain || npc.rank === MilitaryRank.Lieutenant,
    status: npc.wounded ? 'Wounded' : 'Steady',
  };
}

// Write battle outcomes back to NPCs after battle ends
export function syncBattleResultsToNPCs(npcs: NPC[], battle: BattleState): void {
  // Sync Pierre (leftNeighbour)
  const pierre = npcs.find(n => n.id === 'pierre');
  if (pierre && battle.line.leftNeighbour) {
    pierre.alive = battle.line.leftNeighbour.alive;
    pierre.wounded = battle.line.leftNeighbour.wounded;
    pierre.morale = battle.line.leftNeighbour.morale;
  }

  // Sync Jean-Baptiste (rightNeighbour)
  const jb = npcs.find(n => n.id === 'jean-baptiste');
  if (jb && battle.line.rightNeighbour) {
    jb.alive = battle.line.rightNeighbour.alive;
    jb.wounded = battle.line.rightNeighbour.wounded;
    jb.morale = battle.line.rightNeighbour.morale;
    // Routing counts as broken morale
    if (battle.line.rightNeighbour.routing) {
      jb.morale = 0;
    }
  }

  // Sync Leclerc (officer)
  const leclerc = npcs.find(n => n.id === 'leclerc');
  if (leclerc) {
    leclerc.alive = battle.line.officer.alive;
    leclerc.wounded = battle.line.officer.wounded;
  }

  // Experience gain for all surviving NPCs
  for (const npc of npcs) {
    if (npc.alive) {
      npc.experience = Math.min(100, npc.experience + 5);
    }
  }
}

