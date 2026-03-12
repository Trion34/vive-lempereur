import { create } from 'zustand';
import type { LabPageId, LabCategory } from '../labRoutes';

interface LabState {
  currentPage: LabPageId;
  selectedCategory: LabCategory | null;
  setPage: (page: LabPageId) => void;
  setCategory: (category: LabCategory | null) => void;
  goHome: () => void;
}

export const useLabStore = create<LabState>((set) => ({
  currentPage: 'home',
  selectedCategory: null,
  setPage: (page) => set({ currentPage: page }),
  setCategory: (category) => set({ selectedCategory: category, currentPage: 'home' }),
  goHome: () => set({ currentPage: 'home', selectedCategory: null }),
}));
