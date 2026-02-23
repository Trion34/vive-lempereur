import { create } from 'zustand';
import type { MeleeStance, MeleeActionId } from '../types';
import { MeleeStance as MeleeStanceEnum } from '../types';

interface UiStore {
  // Processing lock
  processing: boolean;
  setProcessing: (v: boolean) => void;

  // Melee UI state
  meleeStance: MeleeStance;
  meleeSelectedAction: MeleeActionId | null;
  meleeShowingInventory: boolean;
  meleeHotkeysVisible: boolean;
  setMeleeStance: (stance: MeleeStance) => void;
  setMeleeSelectedAction: (action: MeleeActionId | null) => void;
  setMeleeShowingInventory: (v: boolean) => void;
  setMeleeHotkeysVisible: (v: boolean) => void;

  // Camp UI state
  campActionCategory: string | null;
  campActionResult: { text: string; changes: string[] } | null;
  campActionSub: string | null;
  setCampActionCategory: (v: string | null) => void;
  setCampActionResult: (v: { text: string; changes: string[] } | null) => void;
  setCampActionSub: (v: string | null) => void;

  // Rendering state
  lastRenderedTurn: number;
  renderedEntriesForTurn: number;
  campLogCount: number;
  arenaLogCount: number;
  campIntroSeen: boolean;
  phaseLogStart: number;

  // Pending states
  pendingAutoPlayResume: boolean;
  showOpeningBeat: boolean;
  pendingChargeResult: { narrative: string; statSummary: string } | null;

  // Pending auto-play (set by StoryBeatPage, consumed by LinePage)
  pendingAutoPlay: 'resumeVolleys' | 'part2' | 'part3' | null;
  pendingAutoPlayRange: [number, number] | null;

  // Credits screen
  showCredits: boolean;

  // Glory (display state, canonical in gloryStore)
  playerGlory: number;
  glorySpent: Record<string, number>;

  // Reset all transient UI state
  resetUi: () => void;
}

export const useUiStore = create<UiStore>((set) => ({
  processing: false,
  setProcessing: (v) => set({ processing: v }),

  meleeStance: MeleeStanceEnum.Balanced,
  meleeSelectedAction: null,
  meleeShowingInventory: false,
  meleeHotkeysVisible: false,
  setMeleeStance: (stance) => set({ meleeStance: stance }),
  setMeleeSelectedAction: (action) => set({ meleeSelectedAction: action }),
  setMeleeShowingInventory: (v) => set({ meleeShowingInventory: v }),
  setMeleeHotkeysVisible: (v) => set({ meleeHotkeysVisible: v }),

  campActionCategory: null,
  campActionResult: null,
  campActionSub: null,
  setCampActionCategory: (v) => set({ campActionCategory: v }),
  setCampActionResult: (v) => set({ campActionResult: v }),
  setCampActionSub: (v) => set({ campActionSub: v }),

  lastRenderedTurn: -1,
  renderedEntriesForTurn: 0,
  campLogCount: 0,
  arenaLogCount: 0,
  campIntroSeen: false,
  phaseLogStart: 0,

  pendingAutoPlayResume: false,
  showOpeningBeat: false,
  pendingChargeResult: null,

  pendingAutoPlay: null,
  pendingAutoPlayRange: null,

  showCredits: false,

  playerGlory: 0,
  glorySpent: {},

  resetUi: () =>
    set({
      processing: false,
      meleeStance: MeleeStanceEnum.Balanced,
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
      pendingAutoPlayResume: false,
      showOpeningBeat: false,
      pendingChargeResult: null,
      pendingAutoPlay: null,
      pendingAutoPlayRange: null,
      showCredits: false,
    }),
}));
