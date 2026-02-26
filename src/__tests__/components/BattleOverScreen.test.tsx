import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BattleOverScreen } from '../../components/overlays/BattleOverScreen';
import type { BattleState, GameState } from '../../types';
import { MoraleThreshold, BattlePhase, DrillStep, HealthState, FatigueTier, CampaignPhase } from '../../types';

// ---------------------------------------------------------------------------
// Helpers: minimal mock objects
// ---------------------------------------------------------------------------
function mockBattleState(overrides: Partial<BattleState> = {}): BattleState {
  const { ext: extOverrides, ...restOverrides } = overrides;
  return {
    phase: BattlePhase.Line,
    drillStep: DrillStep.Fire,
    player: {
      name: 'Pierre',
      valor: 40,
      musketry: 35,
      elan: 35,
      strength: 40,
      endurance: 40,
      constitution: 45,
      charisma: 30,
      intelligence: 30,
      awareness: 35,
      morale: 60,
      maxMorale: 100,
      moraleThreshold: MoraleThreshold.Wavering,
      health: 80,
      maxHealth: 125,
      healthState: HealthState.Unhurt,
      stamina: 200,
      maxStamina: 400,
      fatigue: 0,
      maxFatigue: 400,
      fatigueTier: FatigueTier.Fresh,
      musketLoaded: true,
      alive: true,
      routing: false,
      fumbledLoad: false,
      soldierRep: 50,
      officerRep: 50,
      napoleonRep: 0,
      frontRank: false,
      canteenUses: 3,
    },
    enemy: {
      range: 100,
      strength: 300,
      quality: 'line',
      morale: 'steady',
      lineIntegrity: 50,
      artillery: false,
      cavalryThreat: false,
    },
    line: {
      lineIntegrity: 70,
      regimentStrength: 400,
      regimentMorale: 'steady',
      formation: 'line',
      actionsTaken: 0,
      frontRankLosses: 0,
    },
    soldiers: [],
    officers: [],
    log: [],
    turn: 10,
    volleysFired: 5,
    battleOver: false,
    outcome: 'victory',
    ext: {
      battlePart: 1,
      batteryCharged: false,
      meleeStage: 0,
      wagonDamage: 0,
      gorgeMercyCount: 0,
      gorgeTarget: '',
      ...extOverrides,
    },
    ...restOverrides,
  } as BattleState;
}

function mockGameState(): GameState {
  return {
    phase: 'battle',
    player: {
      name: 'Pierre',
      rank: 'private',
      valor: 40,
      musketry: 35,
      elan: 35,
      strength: 40,
      endurance: 40,
      constitution: 45,
      charisma: 30,
      intelligence: 30,
      awareness: 35,
      health: 100,
      morale: 100,
      stamina: 100,
      grace: 0,
      soldierRep: 50,
      officerRep: 50,
      napoleonRep: 0,
      frontRank: false,
      equipment: {
        musket: 'Charleville 1777',
        bayonet: 'Socket bayonet',
        musketCondition: 70,
        uniformCondition: 50,
      },
    },
    npcs: [],
    battleState: null,
    campaign: {
      campaignId: 'italy',
      battleIndex: 4,
      phase: CampaignPhase.Battle,
      battlesCompleted: 0,
      currentBattle: 'rivoli',
      nextBattle: '',
      daysInCampaign: 0,
      npcDeaths: [],
      replacementsUsed: [],
    },
  } as unknown as GameState;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('BattleOverScreen', () => {
  it('renders null when battleOver is false', () => {
    const { container } = render(
      <BattleOverScreen
        battleState={mockBattleState({ battleOver: false })}
        gameState={mockGameState()}
        onRestart={() => {}}
        onContinueCredits={() => {}}
      />,
    );
    expect(container.innerHTML).toBe('');
  });

  it('shows correct title for defeat outcome', () => {
    render(
      <BattleOverScreen
        battleState={mockBattleState({ battleOver: true, outcome: 'defeat' })}
        gameState={mockGameState()}
        onRestart={() => {}}
        onContinueCredits={() => {}}
      />,
    );
    expect(screen.getByText('Pierre \u2014 Killed in Action')).toBeInTheDocument();
  });

  it('shows correct title for victory outcome', () => {
    render(
      <BattleOverScreen
        battleState={mockBattleState({ battleOver: true, outcome: 'victory' })}
        gameState={mockGameState()}
        onRestart={() => {}}
        onContinueCredits={() => {}}
      />,
    );
    expect(screen.getByText('Pierre \u2014 Victory')).toBeInTheDocument();
  });

  it('shows Restart button for non-gorge outcomes', () => {
    render(
      <BattleOverScreen
        battleState={mockBattleState({ battleOver: true, outcome: 'defeat' })}
        gameState={mockGameState()}
        onRestart={() => {}}
        onContinueCredits={() => {}}
      />,
    );
    const restartBtn = screen.getByText('Restart');
    expect(restartBtn).toBeInTheDocument();
    expect(restartBtn.style.display).not.toBe('none');
  });

  it('Restart button calls onRestart', async () => {
    const onRestart = vi.fn();
    render(
      <BattleOverScreen
        battleState={mockBattleState({ battleOver: true, outcome: 'defeat' })}
        gameState={mockGameState()}
        onRestart={onRestart}
        onContinueCredits={() => {}}
      />,
    );
    await userEvent.click(screen.getByText('Restart'));
    expect(onRestart).toHaveBeenCalledOnce();
  });

  it('shows Continue button for gorge_victory', async () => {
    const onContinue = vi.fn();
    render(
      <BattleOverScreen
        battleState={mockBattleState({ battleOver: true, outcome: 'gorge_victory' })}
        gameState={mockGameState()}
        onRestart={() => {}}
        onContinueCredits={onContinue}
      />,
    );
    const continueBtn = screen.getByText('Continue');
    expect(continueBtn.style.display).toBe('inline-block');
    await userEvent.click(continueBtn);
    expect(onContinue).toHaveBeenCalledOnce();
  });

  it('shows March On button for victory when onAdvanceCampaign is provided', () => {
    render(
      <BattleOverScreen
        battleState={mockBattleState({ battleOver: true, outcome: 'victory' })}
        gameState={mockGameState()}
        onRestart={() => {}}
        onContinueCredits={() => {}}
        onAdvanceCampaign={() => {}}
      />,
    );
    expect(screen.getByText('March On')).toBeInTheDocument();
  });

  it('March On button calls onAdvanceCampaign', async () => {
    const onAdvanceCampaign = vi.fn();
    render(
      <BattleOverScreen
        battleState={mockBattleState({ battleOver: true, outcome: 'victory' })}
        gameState={mockGameState()}
        onRestart={() => {}}
        onContinueCredits={() => {}}
        onAdvanceCampaign={onAdvanceCampaign}
      />,
    );
    await userEvent.click(screen.getByText('March On'));
    expect(onAdvanceCampaign).toHaveBeenCalledOnce();
  });

  it('does not show March On for defeat outcomes', () => {
    render(
      <BattleOverScreen
        battleState={mockBattleState({ battleOver: true, outcome: 'defeat' })}
        gameState={mockGameState()}
        onRestart={() => {}}
        onContinueCredits={() => {}}
        onAdvanceCampaign={() => {}}
      />,
    );
    expect(screen.queryByText('March On')).not.toBeInTheDocument();
  });

  it('gorge_victory Continue calls onAdvanceCampaign when provided', async () => {
    const onAdvanceCampaign = vi.fn();
    render(
      <BattleOverScreen
        battleState={mockBattleState({ battleOver: true, outcome: 'gorge_victory' })}
        gameState={mockGameState()}
        onRestart={() => {}}
        onContinueCredits={() => {}}
        onAdvanceCampaign={onAdvanceCampaign}
      />,
    );
    await userEvent.click(screen.getByText('Continue'));
    expect(onAdvanceCampaign).toHaveBeenCalledOnce();
  });
});
