import { describe, it, expect, beforeEach } from 'vitest';
import { useVnSceneStore } from '../stores/vnSceneStore';
import type { VNScene } from '../types/vnTypes';

function makeScene(): VNScene {
  return {
    id: 'test_undo_scene',
    title: 'Undo Test',
    description: '',
    mood: 'night_camp',
    cast: ['narrator'],
    startNode: 'a',
    nodes: {
      a: { id: 'a', speaker: 'narrator', text: 'first', next: 'b' },
      b: { id: 'b', speaker: 'narrator', text: 'middle', next: 'c' },
      c: { id: 'c', speaker: 'narrator', text: 'last', next: null },
    },
  };
}

describe('vnSceneStore undo/redo', () => {
  beforeEach(() => {
    // Isolate per test — delete any scene we care about + reset history
    const s = useVnSceneStore.getState();
    useVnSceneStore.setState({ scenes: [], history: {}, redo: {}, dirty: false });
    // Re-bind get/set happens via create; direct setState above is enough.
    void s;
  });

  it('captures a pre-mutation snapshot and undo restores it', () => {
    const store = useVnSceneStore.getState();
    store.addScene(makeScene());

    // Delete node 'b' — a structural mutation, should snapshot.
    store.deleteNode('test_undo_scene', 'b');

    let scene = useVnSceneStore.getState().scenes.find((s) => s.id === 'test_undo_scene')!;
    expect(scene.nodes.b).toBeUndefined();
    expect(useVnSceneStore.getState().canUndo('test_undo_scene')).toBe(true);

    // Undo
    expect(useVnSceneStore.getState().undo('test_undo_scene')).toBe(true);
    scene = useVnSceneStore.getState().scenes.find((s) => s.id === 'test_undo_scene')!;
    expect(scene.nodes.b).toBeDefined();
    expect(scene.nodes.b.text).toBe('middle');
    expect(useVnSceneStore.getState().canRedo('test_undo_scene')).toBe(true);
  });

  it('redo re-applies the undone change and alternates cleanly', () => {
    const store = useVnSceneStore.getState();
    store.addScene(makeScene());
    store.deleteNode('test_undo_scene', 'b');
    store.undo('test_undo_scene');
    // Redo should restore the deletion
    expect(useVnSceneStore.getState().redoAction('test_undo_scene')).toBe(true);
    const scene = useVnSceneStore.getState().scenes.find((s) => s.id === 'test_undo_scene')!;
    expect(scene.nodes.b).toBeUndefined();

    // Bounce back and forth
    useVnSceneStore.getState().undo('test_undo_scene');
    expect(useVnSceneStore.getState().scenes.find((s) => s.id === 'test_undo_scene')!.nodes.b).toBeDefined();
    useVnSceneStore.getState().redoAction('test_undo_scene');
    expect(useVnSceneStore.getState().scenes.find((s) => s.id === 'test_undo_scene')!.nodes.b).toBeUndefined();
  });

  it('a new mutation after undo clears the redo stack', () => {
    const store = useVnSceneStore.getState();
    store.addScene(makeScene());
    store.deleteNode('test_undo_scene', 'b');
    store.undo('test_undo_scene');
    expect(useVnSceneStore.getState().canRedo('test_undo_scene')).toBe(true);

    // Make a new edit — redo should be cleared.
    store.deleteNode('test_undo_scene', 'c');
    expect(useVnSceneStore.getState().canRedo('test_undo_scene')).toBe(false);
  });

  it('text-only mutations do not push history (per scope decision)', () => {
    const store = useVnSceneStore.getState();
    store.addScene(makeScene());
    const before = useVnSceneStore.getState().history['test_undo_scene']?.length ?? 0;
    store.updateNode('test_undo_scene', 'a', { text: 'edited' });
    const after = useVnSceneStore.getState().history['test_undo_scene']?.length ?? 0;
    expect(after).toBe(before);
  });

  it('history is capped so the stack cannot grow unbounded', () => {
    const store = useVnSceneStore.getState();
    store.addScene(makeScene());
    for (let i = 0; i < 60; i++) {
      // Each iteration alternates adding and removing a node (a structural change)
      const id = `extra_${i}`;
      store.addNode('test_undo_scene', { id, speaker: 'narrator', text: '', next: null });
    }
    const history = useVnSceneStore.getState().history['test_undo_scene'] ?? [];
    expect(history.length).toBeLessThanOrEqual(50);
  });
});
