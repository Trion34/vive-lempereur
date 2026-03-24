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
  VN = 'vn',
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
  // Voltri story beats
  VoltriFixBayonets = 'voltri_fix_bayonets',
  FallBack = 'fall_back',
  CoverRetreat = 'cover_retreat',
  HelpStragglers = 'help_stragglers',
  KeepMoving = 'keep_moving',
  StandFirm = 'stand_firm',
  ScatterAndHide = 'scatter_and_hide',
  CollapseAndSleep = 'collapse_and_sleep',
  FindYourUnit = 'find_your_unit',
  // Voltri separation path
  TendWoundsVoltri = 'tend_wounds_voltri',
  ShareCanteen = 'share_canteen',
  LeaveWounded = 'leave_wounded',
  ConserveSupplies = 'conserve_supplies',
  ApproachHomestead = 'approach_homestead',
  AvoidHomestead = 'avoid_homestead',
  ShelterInBarn = 'shelter_in_barn',
  RestHere = 'rest_here',
  MoveOnAtDawn = 'move_on_at_dawn',
}

// === Charge Encounter IDs (story beat milestones within a battle) ===

export enum ChargeEncounterId {
  None = 0,
  Battery = 1,
  Massena = 2,
  Gorge = 3,
  Aftermath = 4,
  WoundedSergeant = 5,
  FixBayonets = 6,
  // Voltri story beats
  VoltriFixBayonets = 10,
  VoltriLineBreaks = 11,
  VoltriCoastalRoad = 12,
  VoltriCavalryScare = 13,
  VoltriDawnSavona = 14,
  VoltriWoundedSoldier = 15,
  VoltriHomestead = 16,
  VoltriWoundedCanteen = 17,
}

// === Melee Context ===

export enum MeleeContext {
  Terrain = 'terrain',
  Battery = 'battery',
  Skirmish = 'skirmish',
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

// === Formation (line battle) ===

export enum Formation {
  Line = 'line',
  Column = 'column',
  Square = 'square',
  Skirmish = 'skirmish',
}

// === Line Actions (rank-based agency) ===

export enum LineActionId {
  // Corporal — FIRE step
  AimedShot = 'aimed_shot',
  FireWithVolley = 'fire_with_volley',
  // Corporal — ENDURE step
  SteadyYourFile = 'steady_your_file',
  KeepHeadDown = 'keep_head_down',
  // Sergeant — PRESENT step
  ConcentrateFire = 'concentrate_fire',
  SpreadFire = 'spread_fire',
  HoldFire = 'hold_fire',
  // Sergeant — ENDURE step
  CloseRanks = 'close_ranks',
  // Sergeant — LOAD step
  DoubleTime = 'double_time',
  // Lieutenant — PRESENT step
  Advance = 'advance',
  HoldPosition = 'hold_position',
  FallBack = 'fall_back',
  // Lieutenant — ENDURE step
  RefuseFlank = 'refuse_flank',
  // Captain — PRESENT step
  HoldHoldFire = 'hold_hold_fire',
  // Captain — FIRE step
  FireByRank = 'fire_by_rank',
  FireAtWill = 'fire_at_will',
  StandardVolley = 'standard_volley',
  // Captain — ENDURE step
  OrderDrums = 'order_drums',
  SilenceDrums = 'silence_drums',
  // Captain — LOAD step
  FixBayonetsEarly = 'fix_bayonets_early',
  RequestSupport = 'request_support',
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
