import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LineSandboxPage } from '../../pages/LineSandboxPage';
import { useUiStore } from '../../stores/uiStore';

// Mock heavy child components to avoid deep render trees
vi.mock('../../components/line/BattlefieldView', () => ({
  BattlefieldView: vi.fn(() => <div data-testid="battlefield-view" />),
}));

vi.mock('../../components/line/useAutoPlay', () => ({
  useAutoPlay: () => ({
    sandboxRun: vi.fn(),
    isRunning: false,
    isAwaitingRankAction: () => false,
    isAwaitingGorgeTarget: () => false,
    getPendingRankActions: () => null,
    resolveRankAction: vi.fn(),
    resolveGorgeTarget: vi.fn(),
  }),
}));

vi.mock('../../components/line/DrillIndicator', () => ({
  DrillIndicator: () => <div data-testid="drill-indicator" />,
}));

vi.mock('../../components/line/LineStatus', () => ({
  LineStatus: () => <div data-testid="line-status" />,
}));

vi.mock('../../components/line/EnemyPanel', () => ({
  EnemyPanel: () => <div data-testid="enemy-panel" />,
}));

vi.mock('../../utils/helpers', () => ({
  wait: vi.fn(() => Promise.resolve()),
  makeFatigueRadial: vi.fn(() => '<svg></svg>'),
}));

vi.mock('../../core/persistence', () => ({
  saveGame: vi.fn(),
  loadGame: vi.fn(() => null),
  loadGlory: vi.fn(() => ({ glory: 0, spent: {} })),
  addGlory: vi.fn(),
}));

describe('LineSandboxPage', () => {
  describe('Setup Screen', () => {
    it('renders setup screen by default', () => {
      render(<LineSandboxPage />);
      expect(screen.getByText('LINE SANDBOX')).toBeInTheDocument();
      expect(screen.getByText('BEGIN SANDBOX')).toBeInTheDocument();
    });

    it('renders all 5 rank options', () => {
      render(<LineSandboxPage />);
      expect(screen.getByText('Private')).toBeInTheDocument();
      expect(screen.getByText('Corporal')).toBeInTheDocument();
      expect(screen.getByText('Sergeant')).toBeInTheDocument();
      expect(screen.getByText('Lieutenant')).toBeInTheDocument();
      expect(screen.getByText('Captain')).toBeInTheDocument();
    });

    it('renders rank subtitles', () => {
      render(<LineSandboxPage />);
      expect(screen.getByText('No agency')).toBeInTheDocument();
      expect(screen.getByText('Your File')).toBeInTheDocument();
      expect(screen.getByText('The Section')).toBeInTheDocument();
      expect(screen.getByText('The Company')).toBeInTheDocument();
      expect(screen.getByText('The Formation')).toBeInTheDocument();
    });

    it('renders scenario cards', () => {
      render(<LineSandboxPage />);
      expect(screen.getByText('Standard Line')).toBeInTheDocument();
      expect(screen.getByText('Scenario B')).toBeInTheDocument();
      expect(screen.getByText('Scenario C')).toBeInTheDocument();
    });

    it('Private is selected by default', () => {
      render(<LineSandboxPage />);
      const privateBtn = screen.getByText('Private').closest('button');
      expect(privateBtn?.classList.contains('selected')).toBe(true);
    });

    it('Standard Line scenario is selected by default', () => {
      render(<LineSandboxPage />);
      const card = screen.getByText('Standard Line').closest('button');
      expect(card?.classList.contains('selected')).toBe(true);
    });

    it('clicking a rank button selects it', () => {
      render(<LineSandboxPage />);
      const sergeantBtn = screen.getByText('Sergeant').closest('button')!;
      fireEvent.click(sergeantBtn);
      expect(sergeantBtn.classList.contains('selected')).toBe(true);

      // Private should no longer be selected
      const privateBtn = screen.getByText('Private').closest('button')!;
      expect(privateBtn.classList.contains('selected')).toBe(false);
    });

    it('placeholder scenarios are disabled', () => {
      render(<LineSandboxPage />);
      const scenarioB = screen.getByText('Scenario B').closest('button')!;
      expect(scenarioB).toBeDisabled();
      expect(scenarioB.classList.contains('disabled')).toBe(true);
    });

    it('back button navigates away from sandbox', () => {
      render(<LineSandboxPage />);
      const backBtn = screen.getByTitle('Back to Profile');
      fireEvent.click(backBtn);
      expect(useUiStore.getState().showLineSandbox).toBe(false);
    });

    it('launches sandbox on BEGIN SANDBOX click', () => {
      render(<LineSandboxPage />);
      fireEvent.click(screen.getByText('BEGIN SANDBOX'));

      // Setup screen should be gone, sandbox should be visible
      expect(screen.queryByText('BEGIN SANDBOX')).not.toBeInTheDocument();
      expect(screen.getByText('Your Condition')).toBeInTheDocument();
    });

    it('launches with selected rank', () => {
      render(<LineSandboxPage />);

      // Select Sergeant
      fireEvent.click(screen.getByText('Sergeant').closest('button')!);
      fireEvent.click(screen.getByText('BEGIN SANDBOX'));

      // Should be in sandbox mode (no setup screen)
      expect(screen.queryByText('BEGIN SANDBOX')).not.toBeInTheDocument();
      expect(screen.getByText('Your Condition')).toBeInTheDocument();
    });
  });

  describe('Change Setup', () => {
    it('returns to setup screen when Change Setup is clicked', () => {
      render(<LineSandboxPage />);

      // Launch sandbox
      fireEvent.click(screen.getByText('BEGIN SANDBOX'));
      expect(screen.queryByText('BEGIN SANDBOX')).not.toBeInTheDocument();

      // Switch to Controls tab
      fireEvent.click(screen.getByText('Controls'));

      // Click Change Setup
      const changeSetupBtn = screen.getByText(/Change Setup/);
      fireEvent.click(changeSetupBtn);

      // Should be back at setup screen
      expect(screen.getByText('BEGIN SANDBOX')).toBeInTheDocument();
    });
  });
});
