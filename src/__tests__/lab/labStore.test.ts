import { describe, it, expect, beforeEach } from 'vitest';
import { useLabStore } from '../../lab/stores/labStore';
import { labRoutes } from '../../lab/labRoutes';

describe('labStore', () => {
  beforeEach(() => {
    useLabStore.setState({ currentPage: 'home', selectedCategory: null, launchConfig: null });
  });

  it('starts on the home page with no category selected', () => {
    const state = useLabStore.getState();
    expect(state.currentPage).toBe('home');
    expect(state.selectedCategory).toBeNull();
  });

  it('navigates to a lab page', () => {
    useLabStore.getState().setPage('line-battle');
    expect(useLabStore.getState().currentPage).toBe('line-battle');
  });

  it('selects a category (stays on home)', () => {
    useLabStore.getState().setCategory('combat');
    const state = useLabStore.getState();
    expect(state.selectedCategory).toBe('combat');
    expect(state.currentPage).toBe('home');
  });

  it('clears category filter with null', () => {
    useLabStore.getState().setCategory('narrative');
    useLabStore.getState().setCategory(null);
    expect(useLabStore.getState().selectedCategory).toBeNull();
  });

  it('goHome resets page and category', () => {
    useLabStore.getState().setCategory('systems');
    useLabStore.getState().setPage('camp');
    useLabStore.getState().goHome();
    const state = useLabStore.getState();
    expect(state.currentPage).toBe('home');
    expect(state.selectedCategory).toBeNull();
  });

  it('can navigate to every defined route', () => {
    for (const route of labRoutes) {
      useLabStore.getState().setPage(route.id);
      expect(useLabStore.getState().currentPage).toBe(route.id);
    }
  });

  it('has 12 tool routes (excluding home)', () => {
    expect(labRoutes).toHaveLength(12);
  });

  it('every route has required fields', () => {
    for (const route of labRoutes) {
      expect(route.id).toBeTruthy();
      expect(route.label).toBeTruthy();
      expect(route.description).toBeTruthy();
      expect(route.icon).toBeTruthy();
      expect(route.category).toBeTruthy();
    }
  });

  it('has no duplicate route ids', () => {
    const ids = labRoutes.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has correct category distribution', () => {
    const byCat = (cat: string) => labRoutes.filter((r) => r.category === cat);
    expect(byCat('combat')).toHaveLength(2);
    expect(byCat('narrative')).toHaveLength(4);
    expect(byCat('systems')).toHaveLength(4);
    expect(byCat('data')).toHaveLength(2);
  });

  /* ============================================================== */
  /*  Cross-launch (navigateToLab / launchConfig)                    */
  /* ============================================================== */

  it('starts with null launchConfig', () => {
    expect(useLabStore.getState().launchConfig).toBeNull();
  });

  it('navigateToLab sets page and config', () => {
    useLabStore.getState().navigateToLab('camp', { sourceNodeId: 'voltri-garrison', actions: 12 });
    const s = useLabStore.getState();
    expect(s.currentPage).toBe('camp');
    expect(s.launchConfig).toEqual({ sourceNodeId: 'voltri-garrison', actions: 12 });
  });

  it('navigateToLab without config sets launchConfig to null', () => {
    useLabStore.getState().navigateToLab('line-battle');
    const s = useLabStore.getState();
    expect(s.currentPage).toBe('line-battle');
    expect(s.launchConfig).toBeNull();
  });

  it('goHome clears launchConfig', () => {
    useLabStore.getState().navigateToLab('camp', { sourceNodeId: 'test' });
    useLabStore.getState().goHome();
    const s = useLabStore.getState();
    expect(s.currentPage).toBe('home');
    expect(s.launchConfig).toBeNull();
  });

  it('clearLaunchConfig nulls config without changing page', () => {
    useLabStore.getState().navigateToLab('camp', { sourceNodeId: 'test' });
    useLabStore.getState().clearLaunchConfig();
    const s = useLabStore.getState();
    expect(s.currentPage).toBe('camp');
    expect(s.launchConfig).toBeNull();
  });

  it('setPage does not affect launchConfig', () => {
    useLabStore.getState().navigateToLab('camp', { data: 'value' });
    useLabStore.getState().setPage('melee');
    const s = useLabStore.getState();
    expect(s.currentPage).toBe('melee');
    expect(s.launchConfig).toEqual({ data: 'value' });
  });
});
