import { create } from 'zustand';
import type { LabPageId, LabCategory } from '../labRoutes';

export interface LabLaunchConfig {
  sourceNodeId?: string;
  [key: string]: unknown;
}

interface LabState {
  currentPage: LabPageId;
  selectedCategory: LabCategory | null;
  launchConfig: LabLaunchConfig | null;
  chatOpen: boolean;
  setPage: (page: LabPageId) => void;
  setCategory: (category: LabCategory | null) => void;
  goHome: () => void;
  navigateToLab: (page: LabPageId, config?: LabLaunchConfig) => void;
  clearLaunchConfig: () => void;
  toggleChat: () => void;
  setChatOpen: (open: boolean) => void;
}

export const useLabStore = create<LabState>((set) => ({
  currentPage: 'home',
  selectedCategory: null,
  launchConfig: null,
  chatOpen: false,
  setPage: (page) => set({ currentPage: page }),
  setCategory: (category) => set({ selectedCategory: category, currentPage: 'home' }),
  goHome: () => set({ currentPage: 'home', selectedCategory: null, launchConfig: null }),
  navigateToLab: (page, config) => set({ currentPage: page, launchConfig: config ?? null }),
  clearLaunchConfig: () => set({ launchConfig: null }),
  toggleChat: () => set((s) => ({ chatOpen: !s.chatOpen })),
  setChatOpen: (open) => set({ chatOpen: open }),
}));
