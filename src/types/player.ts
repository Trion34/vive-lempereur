import {
  MilitaryRank,
  MoraleThreshold,
  HealthState,
  FatigueTier,
  NPCRole,
} from './enums';

// === Equipment ===

export interface Equipment {
  musket: string;
  bayonet: string;
  musketCondition: number; // 0-100
  uniformCondition: number; // 0-100
}

// === Soldier ===

export interface Soldier {
  id: string;
  name: string;
  rank: 'private' | 'corporal' | 'sergeant';
  valor: number; // persistent stat (nerve/battle-hardness)
  morale: number; // in-battle meter (drains/recovers)
  maxMorale: number;
  threshold: MoraleThreshold;
  alive: boolean;
  wounded: boolean;
  routing: boolean;
  musketLoaded: boolean;
  relationship: number;
}

// === Officer ===

export interface Officer {
  name: string;
  rank: string;
  alive: boolean;
  wounded: boolean;
  mounted: boolean;
  status: string;
}

// === Player (in-battle state) ===

export interface Player {
  name: string;
  // Primary stats
  valor: number;
  musketry: number;
  elan: number;
  strength: number;
  endurance: number;
  constitution: number;
  charisma: number;
  intelligence: number;
  awareness: number;
  // In-battle meter (the fraying rope)
  morale: number;
  maxMorale: number;
  moraleThreshold: MoraleThreshold;
  // Secondary meters
  health: number;
  maxHealth: number;
  healthState: HealthState;
  stamina: number;
  maxStamina: number;
  fatigue: number;
  maxFatigue: number;
  fatigueTier: FatigueTier;
  // State
  musketLoaded: boolean;
  alive: boolean;
  routing: boolean;
  fumbledLoad: boolean;
  // Internal tracking (not displayed in battle)
  soldierRep: number;
  officerRep: number;
  napoleonRep: number;
  frontRank: boolean;
  canteenUses: number;
}

// === PlayerCharacter (persistent across battles/camp — 3 stat tiers) ===

export interface PlayerCharacter {
  name: string;
  rank: MilitaryRank;
  // Arms (trained military skills)
  musketry: number;
  elan: number;
  // Physical
  strength: number;
  endurance: number;
  constitution: number;
  // Mental
  charisma: number;
  intelligence: number;
  awareness: number;
  // Spirit
  valor: number;
  // Persistent meters
  health: number; // 0-100, HIGH=good (same scale as battle)
  morale: number; // 0-100, HIGH=good (same scale as battle)
  stamina: number; // 0-100, HIGH=good (100=Fresh, 0=Spent)
  grace: number; // 0-2, consumable extra life
  soldierRep: number; // 0-100, how rank-and-file see you
  officerRep: number; // 0-100, how officers/NCOs view your discipline
  napoleonRep: number; // 0-100, whether Napoleon knows you exist
  // Flags
  frontRank: boolean;
  // Equipment
  equipment: Equipment;
}

// === NPC ===

export interface NPC {
  id: string;
  name: string;
  role: NPCRole;
  rank: MilitaryRank;
  relationship: number; // -100 to 100
  alive: boolean;
  wounded: boolean;
  morale: number;
  maxMorale: number;
  // Stats (simplified for NPCs)
  valor: number;
}
