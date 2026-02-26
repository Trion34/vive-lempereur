import { describe, it, expect, vi, beforeEach } from 'vitest';
import { saveGame, loadGame, loadGlory, saveGlory, addGlory, deleteSave, setActiveProfile } from '../../core/persistence';
import { GameState, GamePhase, CampaignPhase, MilitaryRank, PlayerCharacter, NPC, CampaignState, BattlePhase, DrillStep, MoraleThreshold, HealthState, FatigueTier } from '../../types';

// --- Helpers to build minimal valid objects ---

function makePlayerCharacter(overrides: Partial<PlayerCharacter> = {}): PlayerCharacter {
  return {
    name: 'Test Soldier',
    rank: MilitaryRank.Private,
    musketry: 35,
    elan: 35,
    strength: 40,
    endurance: 40,
    constitution: 45,
    charisma: 30,
    intelligence: 30,
    awareness: 35,
    valor: 40,
    health: 80,
    morale: 80,
    stamina: 80,
    grace: 0,
    soldierRep: 0,
    officerRep: 50,
    napoleonRep: 0,
    frontRank: false,
    equipment: {
      musket: 'Charleville 1777',
      bayonet: 'Standard',
      musketCondition: 80,
      uniformCondition: 70,
    },
    ...overrides,
  };
}

function makeCampaign(overrides: Partial<CampaignState> = {}): CampaignState {
  return {
    campaignId: 'italy',
    sequenceIndex: 2,
    phase: CampaignPhase.Battle,
    battlesCompleted: 0,
    currentBattle: 'rivoli',
    nextBattle: '',
    daysInCampaign: 1,
    npcDeaths: [],
    replacementsUsed: [],
    ...overrides,
  };
}

function makeGameState(overrides: Partial<GameState> = {}): GameState {
  return {
    phase: GamePhase.Camp,
    player: makePlayerCharacter(),
    npcs: [],
    campaign: makeCampaign(),
    ...overrides,
  };
}

function makeMinimalBattleState(overrides: Record<string, unknown> = {}) {
  const { ext: extOverrides, ...restOverrides } = overrides as Record<string, unknown> & { ext?: Record<string, unknown> };
  return {
    phase: BattlePhase.Line,
    turn: 1,
    drillStep: DrillStep.Load,
    player: {
      name: 'Test',
      valor: 40,
      musketry: 35,
      elan: 35,
      strength: 40,
      endurance: 40,
      constitution: 45,
      charisma: 30,
      intelligence: 30,
      awareness: 35,
      morale: 80,
      maxMorale: 100,
      moraleThreshold: MoraleThreshold.Steady,
      health: 150,
      maxHealth: 190,
      healthState: HealthState.Unhurt,
      stamina: 100,
      maxStamina: 180,
      fatigue: 0,
      maxFatigue: 180,
      fatigueTier: FatigueTier.Fresh,
      musketLoaded: true,
      alive: true,
      routing: false,
      fumbledLoad: false,
      soldierRep: 0,
      officerRep: 50,
      napoleonRep: 0,
      frontRank: false,
      canteenUses: 3,
    },
    line: {
      leftNeighbour: null,
      rightNeighbour: null,
      officer: { name: 'Capt. Leclerc', rank: 'Capt.', alive: true, wounded: false, mounted: true, status: 'Steady' },
      lineIntegrity: 100,
      lineMorale: 'steady',
      drumsPlaying: true,
      ncoPresent: true,
      casualtiesThisTurn: 0,
    },
    enemy: {
      range: 120,
      strength: 100,
      quality: 'line',
      morale: 'steady',
      lineIntegrity: 100,
      artillery: false,
      cavalryThreat: false,
    },
    log: [],
    availableActions: [],
    pendingMoraleChanges: [],
    battleOver: false,
    outcome: 'pending' as const,
    crisisTurn: 0,
    volleysFired: 0,
    scriptedVolley: 0,
    chargeEncounter: 0,
    ext: {
      battlePart: 1,
      batteryCharged: false,
      meleeStage: 0,
      wagonDamage: 0,
      gorgeMercyCount: 0,
      gorgeTarget: '',
      ...extOverrides,
    },
    autoPlayActive: false,
    autoPlayVolleyCompleted: 0,
    graceEarned: false,
    ...restOverrides,
  };
}

// --- Tests ---

describe('persistence – saveGame / loadGame', () => {
  beforeEach(() => {
    localStorage.clear();
    setActiveProfile(null);
  });

  it('saves and loads a valid game state round-trip', () => {
    const gs = makeGameState();
    saveGame(gs);

    const loaded = loadGame();
    expect(loaded).not.toBeNull();
    expect(loaded!.phase).toBe(GamePhase.Camp);
    expect(loaded!.player.name).toBe('Test Soldier');
    expect(loaded!.campaign.currentBattle).toBe('rivoli');
  });

  it('stores data under the correct localStorage key (no profile)', () => {
    const gs = makeGameState();
    saveGame(gs);

    const raw = localStorage.getItem('the_little_soldier_save');
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed.version).toBe('0.4.0');
    expect(typeof parsed.timestamp).toBe('number');
  });

  it('stores data under profile-namespaced key when profile is active', () => {
    setActiveProfile(2);
    const gs = makeGameState();
    saveGame(gs);

    expect(localStorage.getItem('the_little_soldier_save')).toBeNull();
    const raw = localStorage.getItem('the_little_soldier_save_p2');
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed.version).toBe('0.4.0');
  });

  it('returns null when no save exists', () => {
    expect(loadGame()).toBeNull();
  });

  it('returns null for an incompatible save version', () => {
    const data = {
      version: '0.1.0',
      gameState: makeGameState(),
      timestamp: Date.now(),
    };
    localStorage.setItem('the_little_soldier_save', JSON.stringify(data));

    expect(loadGame()).toBeNull();
  });

  it('returns null for corrupt JSON', () => {
    localStorage.setItem('the_little_soldier_save', '{bad json!!!');
    expect(loadGame()).toBeNull();
  });

  it('deletes the save instead of saving when the player is dead', () => {
    // First, put something in the save slot
    const gs = makeGameState();
    saveGame(gs);
    expect(localStorage.getItem('the_little_soldier_save')).not.toBeNull();

    // Now save with a dead player in battleState
    const deadState = makeGameState({
      battleState: makeMinimalBattleState({
        player: {
          ...makeMinimalBattleState().player,
          alive: false,
        },
      }) as GameState['battleState'],
    });
    saveGame(deadState);

    // Save should be deleted (permadeath)
    expect(localStorage.getItem('the_little_soldier_save')).toBeNull();
    expect(loadGame()).toBeNull();
  });

  it('saves normally when battleState exists but player is alive', () => {
    const gs = makeGameState({
      phase: GamePhase.Battle,
      battleState: makeMinimalBattleState() as GameState['battleState'],
    });
    saveGame(gs);

    const loaded = loadGame();
    expect(loaded).not.toBeNull();
    expect(loaded!.phase).toBe(GamePhase.Battle);
  });

  it('saves normally when there is no battleState (camp phase)', () => {
    const gs = makeGameState({ phase: GamePhase.Camp });
    saveGame(gs);

    const loaded = loadGame();
    expect(loaded).not.toBeNull();
    expect(loaded!.phase).toBe(GamePhase.Camp);
  });

  it('deleteSave removes the namespaced key', () => {
    setActiveProfile(1);
    const gs = makeGameState();
    saveGame(gs);
    expect(localStorage.getItem('the_little_soldier_save_p1')).not.toBeNull();

    deleteSave();
    expect(localStorage.getItem('the_little_soldier_save_p1')).toBeNull();
  });

  it('migrates v0.3.0 save to v0.4.0 with new campaign fields', () => {
    // Create an old-format save (v0.3.0 — no campaignId/sequenceIndex/phase/npcDeaths/replacementsUsed)
    const oldCampaign = {
      battlesCompleted: 2,
      currentBattle: 'Rivoli',
      nextBattle: 'Castiglione',
      daysInCampaign: 15,
    };
    const oldSave = {
      version: '0.3.0',
      gameState: { ...makeGameState(), campaign: oldCampaign },
      timestamp: Date.now(),
    };
    localStorage.setItem('the_little_soldier_save', JSON.stringify(oldSave));

    const loaded = loadGame();
    expect(loaded).not.toBeNull();
    expect(loaded!.campaign.campaignId).toBe('italy');
    expect(loaded!.campaign.sequenceIndex).toBe(0); // rough mapping: no battleIndex in old save defaults to 0
    expect(loaded!.campaign.phase).toBe(CampaignPhase.Battle);
    expect(loaded!.campaign.npcDeaths).toEqual([]);
    expect(loaded!.campaign.replacementsUsed).toEqual([]);
    // currentBattle should be lowercased
    expect(loaded!.campaign.currentBattle).toBe('rivoli');
    // Existing fields preserved
    expect(loaded!.campaign.battlesCompleted).toBe(2);
    expect(loaded!.campaign.daysInCampaign).toBe(15);
    // Legacy battleIndex should be removed
    expect((loaded!.campaign as unknown as Record<string, unknown>).battleIndex).toBeUndefined();
  });

  it('re-saves migrated data as v0.4.0', () => {
    const oldSave = {
      version: '0.3.0',
      gameState: makeGameState(),
      timestamp: Date.now(),
    };
    localStorage.setItem('the_little_soldier_save', JSON.stringify(oldSave));

    loadGame(); // triggers migration

    const raw = localStorage.getItem('the_little_soldier_save');
    const parsed = JSON.parse(raw!);
    expect(parsed.version).toBe('0.4.0');
  });

  it('loads v0.4.0 saves without migration', () => {
    const gs = makeGameState();
    saveGame(gs);

    const loaded = loadGame();
    expect(loaded).not.toBeNull();
    expect(loaded!.campaign.campaignId).toBe('italy');
  });
});

describe('persistence – Glory system', () => {
  beforeEach(() => {
    localStorage.clear();
    setActiveProfile(null);
  });

  // loadGlory
  it('loadGlory returns 0 when no value stored', () => {
    expect(loadGlory()).toBe(0);
  });

  it('loadGlory returns stored value', () => {
    localStorage.setItem('the_little_soldier_glory', '25');
    expect(loadGlory()).toBe(25);
  });

  it('loadGlory returns 0 for negative stored values', () => {
    localStorage.setItem('the_little_soldier_glory', '-5');
    expect(loadGlory()).toBe(0);
  });

  it('loadGlory returns 0 for non-numeric stored values', () => {
    localStorage.setItem('the_little_soldier_glory', 'abc');
    expect(loadGlory()).toBe(0);
  });

  it('loadGlory uses profile-namespaced key when profile is active', () => {
    setActiveProfile(2);
    localStorage.setItem('the_little_soldier_glory_p2', '42');
    expect(loadGlory()).toBe(42);
  });

  // saveGlory
  it('saveGlory stores the value in localStorage', () => {
    saveGlory(42);
    expect(localStorage.getItem('the_little_soldier_glory')).toBe('42');
  });

  it('saveGlory rounds fractional values', () => {
    saveGlory(7.8);
    expect(localStorage.getItem('the_little_soldier_glory')).toBe('8');

    saveGlory(7.2);
    expect(localStorage.getItem('the_little_soldier_glory')).toBe('7');
  });

  it('saveGlory clamps negative values to 0', () => {
    saveGlory(-10);
    expect(localStorage.getItem('the_little_soldier_glory')).toBe('0');
  });

  it('saveGlory uses profile-namespaced key when profile is active', () => {
    setActiveProfile(3);
    saveGlory(99);
    expect(localStorage.getItem('the_little_soldier_glory_p3')).toBe('99');
    expect(localStorage.getItem('the_little_soldier_glory')).toBeNull();
  });

  // addGlory
  it('addGlory adds to current glory and returns new total', () => {
    saveGlory(10);
    const result = addGlory(5);
    expect(result).toBe(15);
    expect(loadGlory()).toBe(15);
  });

  it('addGlory works from default (no stored value)', () => {
    // default is 0 (profiles own the defaults now)
    const result = addGlory(3);
    expect(result).toBe(3);
    expect(loadGlory()).toBe(3);
  });

  it('addGlory handles negative amounts (spending glory)', () => {
    saveGlory(20);
    const result = addGlory(-5);
    expect(result).toBe(15);
    expect(loadGlory()).toBe(15);
  });
});
