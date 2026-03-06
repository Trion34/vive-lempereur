import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CampaignCompletePage } from '../../pages/CampaignCompletePage';
import { useGameStore } from '../../stores/gameStore';
import { CampaignPhase, GamePhase, MilitaryRank } from '../../types';

// Register campaign config
import '../../data/campaigns/italy';

describe('CampaignCompletePage', () => {
  beforeEach(() => {
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
          sequenceIndex: 5,
          phase: CampaignPhase.Complete,
          battlesCompleted: 1,
          currentBattle: 'mantua',
          nextBattle: '',
          daysInCampaign: 30,
          npcDeaths: ['pierre'],
          replacementsUsed: ['girard'],
        },
      },
      phase: GamePhase.Camp,
    });
  });

  it('renders Campaign Complete title', () => {
    render(<CampaignCompletePage />);
    expect(screen.getByText('Campaign Complete')).toBeTruthy();
  });

  it('renders campaign stats', () => {
    render(<CampaignCompletePage />);
    expect(screen.getByText(/Battles won: 1/)).toBeTruthy();
    expect(screen.getByText(/Days in campaign: 30/)).toBeTruthy();
    expect(screen.getByText(/Comrades lost: 1/)).toBeTruthy();
  });

  it('shows coming-soon message when not at last node in sequence', () => {
    // Set sequenceIndex before the end of the sequence to simulate
    // hitting an unimplemented battle early
    useGameStore.setState({
      gameState: {
        ...useGameStore.getState().gameState!,
        campaign: {
          ...useGameStore.getState().gameState!.campaign,
          sequenceIndex: 2, // Not at the end (sequence has 6 nodes)
          phase: CampaignPhase.Complete,
        },
      },
    });
    render(<CampaignCompletePage />);
    expect(screen.getByText(/More battles are coming/)).toBeTruthy();
  });

  it('renders Play Again button', () => {
    render(<CampaignCompletePage />);
    expect(screen.getByText('Play Again')).toBeTruthy();
  });
});
