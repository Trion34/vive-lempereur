import { describe, it, expect } from 'vitest';
import {
  labOpponentToGameTemplate,
  labAllyToGameTemplate,
  labWaveToGameWave,
  encounterModuleToEncounterConfig,
  createSandboxBattleState,
  DEFAULT_PLAYER_CONFIG,
} from '../utils/encounterConverter';
import type { LabOpponentTemplate, LabAllyTemplate, LabWaveEvent, MeleeEncounterModule } from '../types/meleeLabTypes';
import { createDefaultEncounterModule, createDefaultOpponent, createDefaultAlly, createDefaultWaveEvent } from '../types/meleeLabTypes';
import { BattlePhase, MeleeStance, MeleeContext } from '@game/types';

/* ------------------------------------------------------------------ */
/*  Fixtures                                                           */
/* ------------------------------------------------------------------ */

function makeLabOpponent(overrides?: Partial<LabOpponentTemplate>): LabOpponentTemplate {
  return { ...createDefaultOpponent('opp1'), ...overrides };
}

function makeLabAlly(overrides?: Partial<LabAllyTemplate>): LabAllyTemplate {
  return { ...createDefaultAlly('ally1'), ...overrides };
}

function makeLabWave(overrides?: Partial<LabWaveEvent>): LabWaveEvent {
  return { ...createDefaultWaveEvent('wave1'), ...overrides };
}

function makeEncounter(overrides?: Partial<MeleeEncounterModule>): MeleeEncounterModule {
  return {
    ...createDefaultEncounterModule('Test Encounter'),
    opponents: [makeLabOpponent()],
    initialActiveEnemies: 1,
    maxActiveEnemies: 1,
    ...overrides,
  };
}

/* ------------------------------------------------------------------ */
/*  labOpponentToGameTemplate                                          */
/* ------------------------------------------------------------------ */

describe('labOpponentToGameTemplate', () => {
  it('drops id and notes, keeps combat fields', () => {
    const lab = makeLabOpponent({
      id: 'x',
      name: 'Grenadier',
      type: 'veteran',
      health: [80, 100],
      stamina: [180, 220],
      strength: 55,
      description: 'Elite',
      notes: 'Should be dropped',
    });
    const game = labOpponentToGameTemplate(lab);
    expect(game).toEqual({
      name: 'Grenadier',
      type: 'veteran',
      health: [80, 100],
      stamina: [180, 220],
      strength: 55,
      description: 'Elite',
    });
    expect((game as unknown as Record<string, unknown>)['id']).toBeUndefined();
    expect((game as unknown as Record<string, unknown>)['notes']).toBeUndefined();
  });
});

/* ------------------------------------------------------------------ */
/*  labAllyToGameTemplate                                              */
/* ------------------------------------------------------------------ */

describe('labAllyToGameTemplate', () => {
  it('drops notes, keeps personality and elan', () => {
    const lab = makeLabAlly({
      name: 'Pierre',
      type: 'named',
      npcId: 'pierre',
      elan: 40,
      strength: 38,
      personality: 'aggressive',
      notes: 'drop me',
    });
    const game = labAllyToGameTemplate(lab);
    expect(game.name).toBe('Pierre');
    expect(game.npcId).toBe('pierre');
    expect(game.elan).toBe(40);
    expect(game.strength).toBe(38);
    expect(game.personality).toBe('aggressive');
    expect((game as unknown as Record<string, unknown>)['notes']).toBeUndefined();
  });

  it('omits npcId when empty string', () => {
    const lab = makeLabAlly({ npcId: '' });
    const game = labAllyToGameTemplate(lab);
    expect(game.npcId).toBeUndefined();
  });
});

/* ------------------------------------------------------------------ */
/*  labWaveToGameWave                                                  */
/* ------------------------------------------------------------------ */

describe('labWaveToGameWave', () => {
  it('resolves allyTemplateId to inline allyTemplate', () => {
    const ally = makeLabAlly({ id: 'a1', name: 'Pierre' });
    const wave = makeLabWave({ action: 'add_ally', allyTemplateId: 'a1' });
    const result = labWaveToGameWave(wave, [ally]);
    expect(result.allyTemplate).toBeDefined();
    expect(result.allyTemplate!.name).toBe('Pierre');
  });

  it('handles increase_max_enemies action', () => {
    const wave = makeLabWave({ action: 'increase_max_enemies', newMaxEnemies: 3 });
    const result = labWaveToGameWave(wave, []);
    expect(result.newMaxEnemies).toBe(3);
    expect(result.allyTemplate).toBeUndefined();
  });

  it('preserves conditionNpcAlive when set', () => {
    const wave = makeLabWave({ conditionNpcAlive: 'pierre' });
    const result = labWaveToGameWave(wave, []);
    expect(result.conditionNpcAlive).toBe('pierre');
  });

  it('omits conditionNpcAlive when empty', () => {
    const wave = makeLabWave({ conditionNpcAlive: '' });
    const result = labWaveToGameWave(wave, []);
    expect(result.conditionNpcAlive).toBeUndefined();
  });
});

/* ------------------------------------------------------------------ */
/*  encounterModuleToEncounterConfig                                   */
/* ------------------------------------------------------------------ */

describe('encounterModuleToEncounterConfig', () => {
  it('converts full module to EncounterConfig', () => {
    const enc = makeEncounter({
      context: 'battery',
      maxExchanges: 15,
      opponents: [makeLabOpponent({ name: 'A' }), makeLabOpponent({ id: 'o2', name: 'B' })],
      allies: [makeLabAlly({ name: 'Pierre' })],
      initialActiveEnemies: 1,
      maxActiveEnemies: 2,
    });
    const config = encounterModuleToEncounterConfig(enc);
    expect(config.context).toBe(MeleeContext.Battery);
    expect(config.maxExchanges).toBe(15);
    expect(config.opponents).toHaveLength(2);
    expect(config.allies).toHaveLength(1);
    expect(config.initialActiveEnemies).toBe(1);
    expect(config.maxActiveEnemies).toBe(2);
  });

  it('maps context strings correctly', () => {
    expect(encounterModuleToEncounterConfig(makeEncounter({ context: 'terrain' })).context).toBe(MeleeContext.Terrain);
    expect(encounterModuleToEncounterConfig(makeEncounter({ context: 'skirmish' })).context).toBe(MeleeContext.Skirmish);
  });
});

/* ------------------------------------------------------------------ */
/*  createSandboxBattleState                                           */
/* ------------------------------------------------------------------ */

describe('createSandboxBattleState', () => {
  it('creates a valid BattleState in Melee phase', () => {
    const enc = makeEncounter();
    const bs = createSandboxBattleState(enc);
    expect(bs.phase).toBe(BattlePhase.Melee);
    expect(bs.battleOver).toBe(false);
    expect(bs.meleeState).toBeDefined();
  });

  it('uses player config for stats', () => {
    const enc = makeEncounter();
    const cfg = { ...DEFAULT_PLAYER_CONFIG, strength: 60, constitution: 50 };
    const bs = createSandboxBattleState(enc, cfg);
    expect(bs.player.strength).toBe(60);
    expect(bs.player.maxHealth).toBe(Math.round(30 + 1.5 * 50));
  });

  it('calculates maxStamina from endurance', () => {
    const enc = makeEncounter();
    const cfg = { ...DEFAULT_PLAYER_CONFIG, endurance: 60 };
    const bs = createSandboxBattleState(enc, cfg);
    expect(bs.player.maxStamina).toBe(Math.round(30 + 1.5 * 60));
  });

  it('initializes melee state with opponents', () => {
    const enc = makeEncounter({
      opponents: [
        makeLabOpponent({ name: 'Line A' }),
        makeLabOpponent({ id: 'o2', name: 'Line B' }),
      ],
      initialActiveEnemies: 1,
      maxActiveEnemies: 2,
    });
    const bs = createSandboxBattleState(enc);
    const ms = bs.meleeState!;
    expect(ms.opponents).toHaveLength(2);
    expect(ms.activeEnemies).toHaveLength(1);
    expect(ms.enemyPool).toHaveLength(1);
    expect(ms.maxActiveEnemies).toBe(2);
  });

  it('initializes melee state with allies', () => {
    const enc = makeEncounter({
      allies: [makeLabAlly({ name: 'Pierre' })],
    });
    const bs = createSandboxBattleState(enc);
    expect(bs.meleeState!.allies).toHaveLength(1);
    expect(bs.meleeState!.allies[0].name).toBe('Pierre');
    expect(bs.meleeState!.allies[0].alive).toBe(true);
  });

  it('initializes wave events', () => {
    const ally = makeLabAlly({ id: 'a1', name: 'JB' });
    const enc = makeEncounter({
      allies: [ally],
      waveEvents: [makeLabWave({ atRound: 3, action: 'add_ally', allyTemplateId: 'a1' })],
    });
    const bs = createSandboxBattleState(enc);
    expect(bs.meleeState!.waveEvents).toHaveLength(1);
    expect(bs.meleeState!.waveEvents[0].atRound).toBe(3);
    expect(bs.meleeState!.waveEvents[0].allyTemplate?.name).toBe('JB');
  });

  it('player starts with full health, morale, stamina', () => {
    const bs = createSandboxBattleState(makeEncounter());
    expect(bs.player.health).toBe(bs.player.maxHealth);
    expect(bs.player.morale).toBe(bs.player.maxMorale);
    expect(bs.player.stamina).toBe(bs.player.maxStamina);
    expect(bs.player.fatigue).toBe(0);
    expect(bs.player.alive).toBe(true);
  });

  it('player starts with musket loaded', () => {
    const bs = createSandboxBattleState(makeEncounter());
    expect(bs.player.musketLoaded).toBe(true);
  });

  it('melee stance starts balanced', () => {
    const bs = createSandboxBattleState(makeEncounter());
    expect(bs.meleeState!.playerStance).toBe(MeleeStance.Balanced);
  });
});
