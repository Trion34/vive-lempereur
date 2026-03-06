import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InterludePage } from '../../pages/InterludePage';
import { useGameStore } from '../../stores/gameStore';
import { CampaignPhase, GamePhase, MilitaryRank } from '../../types';

// Mock cinematic hooks (jsdom can't run animations/portals)
vi.mock('../../hooks/useCinematic', () => ({
  useCinematic: () => ({
    splashText: null,
    cinematicConfig: null,
    cinematicRef: { current: null },
    handleSplashProceed: vi.fn(),
    launchSplash: vi.fn(),
    launchCinematic: vi.fn(),
    destroyCinematic: vi.fn(),
  }),
}));

// Register campaign + battle configs
import '../../data/campaigns/italy';
import '../../data/battles/rivoli';

describe('InterludePage', () => {
  beforeEach(() => {
    // Set up a game state in Interlude phase (rivoli-mantua interlude at index 4)
    useGameStore.setState({
      gameState: {
        phase: GamePhase.Camp,
        player: {
          name: 'Test',
          rank: MilitaryRank.Private,
          valor: 40, musketry: 35, elan: 35,
          strength: 40, endurance: 40, constitution: 45,
          charisma: 30, intelligence: 30, awareness: 35,
          health: 80, morale: 70, stamina: 60,
          grace: 0, soldierRep: 50, officerRep: 50, napoleonRep: 0,
          frontRank: false,
          equipment: { musket: 'Charleville 1777', bayonet: 'Socket bayonet', musketCondition: 70, uniformCondition: 50 },
        },
        npcs: [],
        campaign: {
          campaignId: 'italy',
          sequenceIndex: 4, // rivoli-mantua interlude
          phase: CampaignPhase.Interlude,
          battlesCompleted: 1,
          currentBattle: 'mantua',
          nextBattle: '',
          daysInCampaign: 15,
          npcDeaths: [],
          replacementsUsed: [],
        },
      },
      phase: GamePhase.Camp,
    });
  });

  it('renders the interlude splash text as title', () => {
    render(<InterludePage />);
    // The rivoli-mantua interlude has splashText "The Fall of Mantua"
    expect(screen.getByText('The Fall of Mantua')).toBeTruthy();
  });

  it('shows Continue button', () => {
    render(<InterludePage />);
    expect(screen.getByText('Continue')).toBeTruthy();
  });

  it('triggers advanceToNext when Continue button is clicked', async () => {
    const spy = vi.spyOn(useGameStore.getState(), 'advanceToNext');
    render(<InterludePage />);

    const btn = screen.getByText('Continue');
    await userEvent.click(btn);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('renders the interlude page container', () => {
    const { container } = render(<InterludePage />);
    expect(container.querySelector('.interlude-page')).toBeTruthy();
  });
});
