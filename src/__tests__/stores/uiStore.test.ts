import { describe, it, expect, beforeEach } from 'vitest';
import { useUiStore } from '../../stores/uiStore';
import { MeleeStance, MeleeActionId } from '../../types';

/** Default state snapshot used for reset assertions. */
const DEFAULTS = {
  processing: false,
  meleeStance: MeleeStance.Balanced,
  meleeSelectedAction: null,
  meleeShowingInventory: false,
  meleeHotkeysVisible: false,
  campActionCategory: null,
  campActionResult: null,
  campActionSub: null,
  lastRenderedTurn: -1,
  renderedEntriesForTurn: 0,
  campLogCount: 0,
  arenaLogCount: 0,
  campIntroSeen: false,
  phaseLogStart: 0,
  showOpeningBeat: false,
  pendingChargeResult: null,
  pendingAutoPlay: null,
  pendingAutoPlayRange: null,
  showSettings: false,
  showCredits: false,
} as const;

describe('uiStore', () => {
  beforeEach(() => {
    useUiStore.getState().resetUi();
  });

  describe('initial state', () => {
    it('has correct default values for all fields', () => {
      const state = useUiStore.getState();

      for (const [key, value] of Object.entries(DEFAULTS)) {
        expect(state[key as keyof typeof DEFAULTS], `${key} should match default`).toEqual(value);
      }
      // Glory display state
      expect(state.playerGlory).toBe(0);
      expect(state.glorySpent).toEqual({});
    });
  });

  describe('processing setter', () => {
    it('sets processing to true and back to false', () => {
      useUiStore.getState().setProcessing(true);
      expect(useUiStore.getState().processing).toBe(true);

      useUiStore.getState().setProcessing(false);
      expect(useUiStore.getState().processing).toBe(false);
    });
  });

  describe('melee UI setters', () => {
    it('setMeleeStance updates the stance', () => {
      useUiStore.getState().setMeleeStance(MeleeStance.Aggressive);
      expect(useUiStore.getState().meleeStance).toBe(MeleeStance.Aggressive);

      useUiStore.getState().setMeleeStance(MeleeStance.Defensive);
      expect(useUiStore.getState().meleeStance).toBe(MeleeStance.Defensive);
    });

    it('setMeleeSelectedAction sets and clears the selected action', () => {
      useUiStore.getState().setMeleeSelectedAction(MeleeActionId.BayonetThrust);
      expect(useUiStore.getState().meleeSelectedAction).toBe(MeleeActionId.BayonetThrust);

      useUiStore.getState().setMeleeSelectedAction(null);
      expect(useUiStore.getState().meleeSelectedAction).toBeNull();
    });

    it('setMeleeShowingInventory and setMeleeHotkeysVisible toggle correctly', () => {
      useUiStore.getState().setMeleeShowingInventory(true);
      expect(useUiStore.getState().meleeShowingInventory).toBe(true);

      useUiStore.getState().setMeleeHotkeysVisible(true);
      expect(useUiStore.getState().meleeHotkeysVisible).toBe(true);
    });
  });

  describe('camp UI setters', () => {
    it('setCampActionCategory, setCampActionResult, and setCampActionSub update state', () => {
      useUiStore.getState().setCampActionCategory('rest');
      expect(useUiStore.getState().campActionCategory).toBe('rest');

      const result = { text: 'You rested well.', changes: ['+5 stamina'] };
      useUiStore.getState().setCampActionResult(result);
      expect(useUiStore.getState().campActionResult).toEqual(result);

      useUiStore.getState().setCampActionSub('deep-sleep');
      expect(useUiStore.getState().campActionSub).toBe('deep-sleep');
    });

    it('camp setters accept null to clear values', () => {
      useUiStore.getState().setCampActionCategory('forage');
      useUiStore.getState().setCampActionResult({ text: 'Found berries.', changes: [] });
      useUiStore.getState().setCampActionSub('berries');

      useUiStore.getState().setCampActionCategory(null);
      useUiStore.getState().setCampActionResult(null);
      useUiStore.getState().setCampActionSub(null);

      expect(useUiStore.getState().campActionCategory).toBeNull();
      expect(useUiStore.getState().campActionResult).toBeNull();
      expect(useUiStore.getState().campActionSub).toBeNull();
    });
  });

  describe('resetUi', () => {
    it('resets all transient fields back to defaults after multiple changes', () => {
      // Mutate many fields
      useUiStore.setState({
        processing: true,
        meleeStance: MeleeStance.Aggressive,
        meleeSelectedAction: MeleeActionId.BayonetThrust,
        meleeShowingInventory: true,
        meleeHotkeysVisible: true,
        campActionCategory: 'socialize',
        campActionResult: { text: 'You chatted.', changes: ['+1 morale'] },
        campActionSub: 'npc-talk',
        lastRenderedTurn: 5,
        renderedEntriesForTurn: 3,
        campLogCount: 12,
        arenaLogCount: 7,
        campIntroSeen: true,
        phaseLogStart: 4,
        showOpeningBeat: true,
        pendingChargeResult: { narrative: 'Charge!', statSummary: '+2 elan' },
        pendingAutoPlay: 'resumeVolleys',
        pendingAutoPlayRange: [3, 8],
        showSettings: true,
        showCredits: true,
      });

      // Verify a few fields are actually dirty
      expect(useUiStore.getState().processing).toBe(true);
      expect(useUiStore.getState().showCredits).toBe(true);
      expect(useUiStore.getState().campIntroSeen).toBe(true);

      // Reset
      useUiStore.getState().resetUi();

      const state = useUiStore.getState();
      for (const [key, value] of Object.entries(DEFAULTS)) {
        expect(state[key as keyof typeof DEFAULTS], `${key} should be reset`).toEqual(value);
      }
    });

    it('does not reset glory display state (playerGlory, glorySpent)', () => {
      useUiStore.setState({ playerGlory: 42, glorySpent: { musketry: 5 } });
      useUiStore.getState().resetUi();

      // Glory state is NOT part of resetUi scope
      expect(useUiStore.getState().playerGlory).toBe(42);
      expect(useUiStore.getState().glorySpent).toEqual({ musketry: 5 });
    });
  });

  describe('overlay toggles', () => {
    it('showSettings and showCredits can be set via setState', () => {
      useUiStore.setState({ showSettings: true });
      expect(useUiStore.getState().showSettings).toBe(true);

      useUiStore.setState({ showCredits: true });
      expect(useUiStore.getState().showCredits).toBe(true);
    });
  });
});
