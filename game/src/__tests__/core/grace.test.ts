import { describe, it, expect } from 'vitest';
import { applyGraceRecovery, collectGraceReward, GRACE_CAP } from '../../core/grace';
import { mockGameState, mockBattleState } from '../helpers/mockFactories';
import { FatigueTier, HealthState, MoraleThreshold } from '../../types';

describe('applyGraceRecovery', () => {
  it('restores player to 50% of max stats when grace > 0', () => {
    const bs = mockBattleState({
      battleOver: true,
      outcome: 'defeat',
      player: {
        ...mockBattleState().player,
        health: 0,
        maxHealth: 100,
        morale: 0,
        maxMorale: 100,
        stamina: 0,
        maxStamina: 400,
        fatigue: 300,
        maxFatigue: 400,
        fatigueTier: FatigueTier.Exhausted,
        alive: false,
      },
    });
    const gs = mockGameState({ player: { ...mockGameState().player, grace: 2 }, battleState: bs });

    const result = applyGraceRecovery(gs, bs);

    expect(result).toBe(true);
    expect(gs.player.grace).toBe(1);
    expect(bs.player.health).toBe(50);
    expect(bs.player.morale).toBe(50);
    expect(bs.player.stamina).toBe(200);
    expect(bs.player.fatigue).toBe(0);
    expect(bs.player.fatigueTier).toBe(FatigueTier.Fresh);
    expect(bs.player.alive).toBe(true);
    expect(bs.battleOver).toBe(false);
    expect(bs.outcome).toBe('pending');
  });

  it('returns false and does nothing when grace is 0', () => {
    const bs = mockBattleState({ battleOver: true, outcome: 'defeat' });
    const gs = mockGameState({ player: { ...mockGameState().player, grace: 0 }, battleState: bs });
    const origHealth = bs.player.health;

    const result = applyGraceRecovery(gs, bs);

    expect(result).toBe(false);
    expect(gs.player.grace).toBe(0);
    expect(bs.player.health).toBe(origHealth);
    expect(bs.battleOver).toBe(true);
  });

  it('sets all 7 recovery fields (health, morale, stamina, healthState, moraleThreshold, fatigue, fatigueTier)', () => {
    const bs = mockBattleState({
      battleOver: true,
      outcome: 'defeat',
      player: {
        ...mockBattleState().player,
        health: 0,
        maxHealth: 100,
        morale: 0,
        maxMorale: 100,
        stamina: 0,
        maxStamina: 400,
        fatigue: 300,
        maxFatigue: 400,
        fatigueTier: FatigueTier.Exhausted,
        healthState: HealthState.Critical,
        moraleThreshold: MoraleThreshold.Breaking,
        alive: false,
      },
    });
    const gs = mockGameState({ player: { ...mockGameState().player, grace: 1 }, battleState: bs });

    applyGraceRecovery(gs, bs);

    expect(bs.player.health).toBe(50);
    expect(bs.player.morale).toBe(50);
    expect(bs.player.stamina).toBe(200);
    expect(bs.player.healthState).toBe(HealthState.Wounded);
    expect(bs.player.moraleThreshold).toBe(MoraleThreshold.Shaken);
    expect(bs.player.fatigue).toBe(0);
    expect(bs.player.fatigueTier).toBe(FatigueTier.Fresh);
  });

  it('sets healthState and moraleThreshold to correct derived values', () => {
    const bs = mockBattleState({
      player: {
        ...mockBattleState().player,
        health: 0,
        maxHealth: 200,
        morale: 0,
        maxMorale: 100,
        alive: false,
      },
      battleOver: true,
      outcome: 'defeat',
    });
    const gs = mockGameState({ player: { ...mockGameState().player, grace: 1 }, battleState: bs });

    applyGraceRecovery(gs, bs);

    // 50% of 200 = 100, 100/200 = 0.5 which is >= 0.4 (THRESHOLD_MID) = Wounded
    expect(bs.player.healthState).toBe(HealthState.Wounded);
    // 50% of 100 morale = 50, 50/100 = 0.5 which is >= 0.4 (THRESHOLD_MID) = Shaken
    expect(bs.player.moraleThreshold).toBe(MoraleThreshold.Shaken);
  });
});

describe('collectGraceReward', () => {
  it('increments grace when graceEarned is true', () => {
    const bs = mockBattleState({ graceEarned: true });
    const gs = mockGameState({ player: { ...mockGameState().player, grace: 0 }, battleState: bs });

    collectGraceReward(gs, bs);

    expect(gs.player.grace).toBe(1);
    expect(bs.graceEarned).toBe(false);
  });

  it('does nothing when graceEarned is false', () => {
    const bs = mockBattleState({ graceEarned: false });
    const gs = mockGameState({ player: { ...mockGameState().player, grace: 1 }, battleState: bs });

    collectGraceReward(gs, bs);

    expect(gs.player.grace).toBe(1);
  });

  it('caps grace at GRACE_CAP', () => {
    const bs = mockBattleState({ graceEarned: true });
    const gs = mockGameState({ player: { ...mockGameState().player, grace: GRACE_CAP }, battleState: bs });

    collectGraceReward(gs, bs);

    expect(gs.player.grace).toBe(GRACE_CAP);
    expect(bs.graceEarned).toBe(false);
  });
});
