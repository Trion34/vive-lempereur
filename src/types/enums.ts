// === Game Phase (top-level state machine) ===

export enum GamePhase {
  Camp = 'camp',
  Battle = 'battle',
}

// === Campaign Phase (campaign-level state machine) ===

export enum CampaignPhase {
  Camp = 'camp',
  Battle = 'battle',
  Interlude = 'interlude',
  Complete = 'complete',
}

// === Military Rank ===

export enum MilitaryRank {
  Private = 'private',
  Corporal = 'corporal',
  Sergeant = 'sergeant',
  Lieutenant = 'lieutenant',
  Captain = 'captain',
}

// === Morale (in-battle psychological meter — the fraying rope) ===

export enum MoraleThreshold {
  Steady = 'steady', // 75-100%
  Shaken = 'shaken', // 40-75%
  Wavering = 'wavering', // 15-40%
  Breaking = 'breaking', // 0-15%
}

// === Health thresholds ===

export enum HealthState {
  Unhurt = 'unhurt',
  Wounded = 'wounded',
  BadlyWounded = 'badly_wounded',
  Critical = 'critical',
}

// === Fatigue tiers (replaces StaminaState) ===

export enum FatigueTier {
  Fresh = 'fresh',
  Winded = 'winded',
  Fatigued = 'fatigued',
  Exhausted = 'exhausted',
}

// === Drill Step (the 4-step volley cycle) ===

export enum DrillStep {
  Load = 'load',
  Present = 'present',
  Fire = 'fire',
  Endure = 'endure',
}

// === Actions ===

export enum ActionId {
  Fire = 'fire',
  // GORGE PRESENT step actions (Part 3)
  TargetColumn = 'target_column',
  TargetOfficers = 'target_officers',
  TargetWagon = 'target_wagon',
  ShowMercy = 'show_mercy',
}

// === Battle Phase ===

export enum BattlePhase {
  Intro = 'intro',
  Line = 'line',
  StoryBeat = 'storybeat', // parchment-style narrative choices (battery overrun)
  Melee = 'melee',
  Crisis = 'crisis', // legacy (unused in scripted path)
  Individual = 'individual', // legacy
}

// === NPC System ===

export enum NPCRole {
  Neighbour = 'neighbour',
  Officer = 'officer',
  NCO = 'nco',
}

// === Charge Choices ===

export enum ChargeChoiceId {
  // Battery story beat
  ChargeBattery = 'charge_battery',
  HoldBack = 'hold_back',
  // Masséna story beat
  TendWounds = 'tend_wounds',
  CheckComrades = 'check_comrades',
  FollowTheScreams = 'follow_the_screams',
  // Gorge story beat
  AcceptOrder = 'accept_order',
  // Wounded Sergeant story beat (mid-Part 1)
  TakeCommand = 'take_command',
  RallyTheLine = 'rally_the_line',
  KeepYourHead = 'keep_your_head',
  // Melee transition story beat (end of Part 1 auto-play)
  FixBayonets = 'fix_bayonets',
  // Aftermath story beat (post-gorge)
  HelpWounded = 'help_wounded',
  FindComrades = 'find_comrades',
  SitDown = 'sit_down',
}

// === Melee ===

export enum MeleeStance {
  Aggressive = 'aggressive',
  Balanced = 'balanced',
  Defensive = 'defensive',
}

export enum MeleeActionId {
  BayonetThrust = 'bayonet_thrust',
  AggressiveLunge = 'aggressive_lunge',
  ButtStrike = 'butt_strike',
  Feint = 'feint',
  Guard = 'guard',
  Respite = 'respite',
  Shoot = 'shoot',
  Reload = 'reload',
  SecondWind = 'second_wind',
  UseCanteen = 'use_canteen',
}

export enum BodyPart {
  Head = 'head',
  Torso = 'torso',
  Arms = 'arms',
  Legs = 'legs',
}

// === Camp ===

export enum CampActivityId {
  Rest = 'rest',
  Train = 'train',
  Socialize = 'socialize',
  WriteLetters = 'write_letters',
  Gamble = 'gamble',
  MaintainEquipment = 'maintain_equipment',
  Exercise = 'exercise',
  ArmsTraining = 'arms_training',
  Duties = 'duties',
}

export enum CampEventCategory {
  Disease = 'disease',
  Desertion = 'desertion',
  Weather = 'weather',
  Supply = 'supply',
  Interpersonal = 'interpersonal',
  Orders = 'orders',
  Rumour = 'rumour',
}
