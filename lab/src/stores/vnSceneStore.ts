import { create } from 'zustand';
import type { VNScene, DialogueNode, VNChoice, SceneMood, CharPosition } from '../types/vnTypes';
import { VN_DEMO_SCENES } from '../data/vnDemoScenes';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = 'vn_lab_scenes';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Enforce nextId = gameCheck.passNode invariant for all choices with gameCheck.
 *  Mutates scene in place, returns the same reference. */
export function normalizeGameCheckNextIds(scene: VNScene): VNScene {
  for (const node of Object.values(scene.nodes)) {
    if (node.choices) {
      for (const choice of node.choices) {
        if (choice.gameCheck) {
          choice.nextId = choice.gameCheck.passNode;
        }
      }
    }
  }
  return scene;
}

function generateId(): string {
  return `scene_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function generateNodeId(prefix = 'node'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
}

function loadFromStorage(): VNScene[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as VNScene[];
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveToStorage(scenes: VNScene[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scenes));
  } catch {
    console.warn('[VN Lab] localStorage save failed — quota likely exceeded. Disk backup is still active.');
  }
}

/** Fire-and-forget disk backup via dev server */
function saveToDisk(scenes: VNScene[]): void {
  fetch('/api/vn-scenes/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(scenes),
  }).then(r => {
    if (!r.ok) console.warn('[VN Lab] Disk backup failed:', r.status);
  }).catch(() => {
    console.warn('[VN Lab] Disk backup unavailable — dev server may be down');
  });
}

/** Deep clone a scene */
function cloneScene(scene: VNScene): VNScene {
  return JSON.parse(JSON.stringify(scene));
}

/* ------------------------------------------------------------------ */
/*  Validation                                                         */
/* ------------------------------------------------------------------ */

export interface ValidationWarning {
  type: 'unreachable' | 'broken_ref' | 'missing_text' | 'duplicate_id' | 'no_end' | 'orphan_choice';
  nodeId: string;
  message: string;
}

export function validateScene(scene: VNScene): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];
  const nodeIds = new Set(Object.keys(scene.nodes));

  // Find reachable nodes via BFS
  const reachable = new Set<string>();
  const queue = [scene.startNode];
  while (queue.length > 0) {
    const id = queue.shift()!;
    if (reachable.has(id) || !nodeIds.has(id)) continue;
    reachable.add(id);
    const node = scene.nodes[id];
    if (node.next && typeof node.next === 'string') queue.push(node.next);
    if (node.choices) {
      for (const c of node.choices) {
        queue.push(c.nextId);
        if (c.gameCheck) { queue.push(c.gameCheck.passNode); queue.push(c.gameCheck.failNode); }
      }
    }
    if (node.gameConditionNext) {
      for (const b of node.gameConditionNext) queue.push(b.nextId);
    }
  }

  // Check for unreachable
  for (const id of nodeIds) {
    if (!reachable.has(id)) {
      warnings.push({ type: 'unreachable', nodeId: id, message: `Node "${id}" is not reachable from startNode` });
    }
  }

  // Check each node
  let hasEnd = false;
  for (const [id, node] of Object.entries(scene.nodes)) {
    // Broken next ref
    if (node.next && typeof node.next === 'string' && !nodeIds.has(node.next)) {
      warnings.push({ type: 'broken_ref', nodeId: id, message: `Node "${id}" points to non-existent node "${node.next}"` });
    }
    // Broken choice refs + game check refs
    if (node.choices) {
      for (const c of node.choices) {
        if (!nodeIds.has(c.nextId)) {
          warnings.push({ type: 'orphan_choice', nodeId: id, message: `Choice "${c.label}" points to non-existent node "${c.nextId}"` });
        }
        if (c.gameCheck) {
          if (!nodeIds.has(c.gameCheck.passNode)) {
            warnings.push({ type: 'broken_ref', nodeId: id, message: `Game check passNode "${c.gameCheck.passNode}" in choice "${c.label}" does not exist` });
          }
          if (!nodeIds.has(c.gameCheck.failNode)) {
            warnings.push({ type: 'broken_ref', nodeId: id, message: `Game check failNode "${c.gameCheck.failNode}" in choice "${c.label}" does not exist` });
          }
        }
      }
    }
    // Broken condition branch refs
    if (node.gameConditionNext) {
      for (const b of node.gameConditionNext) {
        if (!nodeIds.has(b.nextId)) {
          warnings.push({ type: 'broken_ref', nodeId: id, message: `Condition branch nextId "${b.nextId}" in node "${id}" does not exist` });
        }
      }
    }
    // Missing text
    if (!node.text || node.text.trim() === '') {
      warnings.push({ type: 'missing_text', nodeId: id, message: `Node "${id}" has empty text` });
    }
    // End detection
    if (node.next === null && !node.choices) hasEnd = true;
  }

  if (!hasEnd) {
    warnings.push({ type: 'no_end', nodeId: scene.startNode, message: 'Scene has no terminal node (next: null)' });
  }

  return warnings;
}

/* ------------------------------------------------------------------ */
/*  Store                                                              */
/* ------------------------------------------------------------------ */

interface VnSceneState {
  scenes: VNScene[];
  selectedSceneId: string | null;
  dirty: boolean;

  // Lifecycle
  loadScenes: () => void;
  saveScenes: () => void;
  resetToDefaults: () => void;

  // Scene CRUD
  selectScene: (id: string | null) => void;
  addScene: (scene: VNScene) => void;
  createScene: (title: string, description: string, mood: SceneMood, cast: string[]) => string;
  updateScene: (id: string, partial: Partial<Pick<VNScene, 'title' | 'description' | 'mood' | 'cast' | 'startNode'>>) => void;
  deleteScene: (id: string) => void;
  duplicateScene: (id: string) => string | null;

  // Import/Export
  importScenes: (json: string) => { added: number; errors: string[] };
  importScene: (json: string) => { success: boolean; error?: string; id?: string };
  exportScenes: () => string;
  exportScene: (id: string) => string | null;

  // Node CRUD
  addNode: (sceneId: string, node: DialogueNode) => void;
  insertNodeAfter: (sceneId: string, afterNodeId: string, speaker: string) => string | null;
  updateNode: (sceneId: string, nodeId: string, partial: Partial<DialogueNode>) => void;
  deleteNode: (sceneId: string, nodeId: string) => void;

  // Choice CRUD
  addChoice: (sceneId: string, nodeId: string, choice: VNChoice) => void;
  addChoiceWithNode: (sceneId: string, nodeId: string, label: string, speaker: string) => string | null;
  updateChoice: (sceneId: string, nodeId: string, choiceIdx: number, partial: Partial<VNChoice>) => void;
  deleteChoice: (sceneId: string, nodeId: string, choiceIdx: number) => void;

  // Convert node type
  convertToChoiceNode: (sceneId: string, nodeId: string) => void;
  convertToLinearNode: (sceneId: string, nodeId: string, keepChoiceIdx?: number) => void;
}

export const useVnSceneStore = create<VnSceneState>((set, get) => ({
  scenes: [],
  selectedSceneId: null,
  dirty: false,

  /* ---- Lifecycle ---- */

  loadScenes: () => {
    const stored = loadFromStorage();
    const scenes = stored ?? VN_DEMO_SCENES.map(cloneScene);
    scenes.forEach(normalizeGameCheckNextIds);
    set({ scenes, dirty: false });

    // If localStorage was empty, try recovering from disk backup
    if (!stored) {
      fetch('/api/vn-scenes')
        .then(r => r.ok ? r.json() : null)
        .then(diskScenes => {
          if (Array.isArray(diskScenes) && diskScenes.length > 0) {
            diskScenes.forEach(normalizeGameCheckNextIds);
            saveToStorage(diskScenes);
            set({ scenes: diskScenes, dirty: false });
            console.info('[VN Lab] Restored', diskScenes.length, 'scenes from disk backup');
          }
        })
        .catch(() => { /* dev server unreachable — use what we have */ });
    }
  },

  saveScenes: () => {
    const scenes = get().scenes;
    saveToStorage(scenes);
    saveToDisk(scenes);
    set({ dirty: false });
  },

  resetToDefaults: () => {
    const scenes = VN_DEMO_SCENES.map(cloneScene);
    saveToStorage(scenes);
    saveToDisk(scenes);
    set({ scenes, selectedSceneId: null, dirty: false });
  },

  /* ---- Scene CRUD ---- */

  selectScene: (id) => set({ selectedSceneId: id }),

  addScene: (scene) => {
    set((s) => ({ scenes: [...s.scenes, cloneScene(scene)], dirty: true }));
  },

  createScene: (title, description, mood, cast) => {
    const id = generateId();
    // Find the first non-narrator, non-player character in the cast for the second node
    const firstSpeaker = cast.find((c) => c !== 'narrator' && c !== 'player') ?? 'narrator';
    // Build initial positions: place up to 2 characters on stage
    const stageChars = cast.filter((c) => c !== 'narrator' && c !== 'player');
    const positions: Partial<Record<string, CharPosition>> = {};
    if (stageChars[0]) positions[stageChars[0]] = 'left';
    if (stageChars[1]) positions[stageChars[1]] = 'right';

    const scene: VNScene = {
      id,
      title,
      description,
      mood,
      cast: cast.length > 0 ? cast : ['narrator'],
      startNode: 'start',
      nodes: {
        start: {
          id: 'start',
          speaker: 'narrator',
          text: '',
          ...(Object.keys(positions).length > 0 ? { positions } : {}),
          next: 'line_1',
        },
        line_1: {
          id: 'line_1',
          speaker: firstSpeaker,
          text: '',
          next: 'choice_1',
        },
        choice_1: {
          id: 'choice_1',
          speaker: 'narrator',
          text: '',
          choices: [
            { label: 'Choice A', nextId: 'branch_a' },
            { label: 'Choice B', nextId: 'branch_b' },
          ],
        },
        branch_a: {
          id: 'branch_a',
          speaker: firstSpeaker,
          text: '',
          next: 'ending',
        },
        branch_b: {
          id: 'branch_b',
          speaker: firstSpeaker,
          text: '',
          next: 'ending',
        },
        ending: {
          id: 'ending',
          speaker: 'narrator',
          text: '',
          effect: 'fade',
          next: null,
        },
      },
    };
    set((s) => ({ scenes: [...s.scenes, scene], selectedSceneId: id, dirty: true }));
    return id;
  },

  updateScene: (id, partial) => {
    set((s) => ({
      scenes: s.scenes.map((sc) => sc.id === id ? { ...sc, ...partial } : sc),
      dirty: true,
    }));
  },

  deleteScene: (id) => {
    set((s) => ({
      scenes: s.scenes.filter((sc) => sc.id !== id),
      selectedSceneId: s.selectedSceneId === id ? null : s.selectedSceneId,
      dirty: true,
    }));
  },

  duplicateScene: (id) => {
    const source = get().scenes.find((s) => s.id === id);
    if (!source) return null;
    const newId = generateId();
    const clone = cloneScene(source);
    clone.id = newId;
    clone.title = `${source.title} (copy)`;
    set((s) => ({ scenes: [...s.scenes, clone], selectedSceneId: newId, dirty: true }));
    return newId;
  },

  /* ---- Import/Export ---- */

  importScenes: (json) => {
    try {
      const parsed = JSON.parse(json);
      const arr: VNScene[] = Array.isArray(parsed) ? parsed : [parsed];
      const existingIds = new Set(get().scenes.map((s) => s.id));
      const errors: string[] = [];
      const toAdd: VNScene[] = [];
      for (const sc of arr) {
        if (!sc.id || !sc.title || !sc.nodes || !sc.startNode) {
          errors.push(`Invalid scene: missing required fields (id/title/nodes/startNode)`);
          continue;
        }
        if (existingIds.has(sc.id)) {
          // Give it a new ID to avoid conflicts
          sc.id = generateId();
        }
        normalizeGameCheckNextIds(sc);
        toAdd.push(sc);
      }
      if (toAdd.length > 0) {
        set((s) => ({ scenes: [...s.scenes, ...toAdd], dirty: true }));
      }
      return { added: toAdd.length, errors };
    } catch (e) {
      return { added: 0, errors: [`Invalid JSON: ${e instanceof Error ? e.message : String(e)}`] };
    }
  },

  importScene: (json) => {
    try {
      const parsed = JSON.parse(json);
      if (!parsed.id || !parsed.title || !parsed.nodes || !parsed.startNode) {
        return { success: false, error: 'Missing required fields (id/title/nodes/startNode)' };
      }
      const existingIds = new Set(get().scenes.map((s) => s.id));
      if (existingIds.has(parsed.id)) {
        parsed.id = generateId();
      }
      normalizeGameCheckNextIds(parsed);
      set((s) => ({ scenes: [...s.scenes, parsed], selectedSceneId: parsed.id, dirty: true }));
      return { success: true, id: parsed.id };
    } catch (e) {
      return { success: false, error: `Invalid JSON: ${e instanceof Error ? e.message : String(e)}` };
    }
  },

  exportScenes: () => JSON.stringify(get().scenes, null, 2),

  exportScene: (id) => {
    const scene = get().scenes.find((s) => s.id === id);
    return scene ? JSON.stringify(scene, null, 2) : null;
  },

  /* ---- Node CRUD ---- */

  addNode: (sceneId, node) => {
    set((s) => ({
      scenes: s.scenes.map((sc) => {
        if (sc.id !== sceneId) return sc;
        return { ...sc, nodes: { ...sc.nodes, [node.id]: node } };
      }),
      dirty: true,
    }));
  },

  insertNodeAfter: (sceneId, afterNodeId, speaker) => {
    const scene = get().scenes.find((s) => s.id === sceneId);
    if (!scene) return null;
    const afterNode = scene.nodes[afterNodeId];
    if (!afterNode) return null;

    const newId = generateNodeId(speaker === 'narrator' ? 'nar' : speaker);
    const newNode: DialogueNode = {
      id: newId,
      speaker,
      text: '',
      next: afterNode.next ?? null,
    };

    set((s) => ({
      scenes: s.scenes.map((sc) => {
        if (sc.id !== sceneId) return sc;
        const nodes = { ...sc.nodes };
        nodes[newId] = newNode;
        // Rewire: afterNode now points to newNode
        nodes[afterNodeId] = { ...afterNode, next: newId };
        return { ...sc, nodes };
      }),
      dirty: true,
    }));
    return newId;
  },

  updateNode: (sceneId, nodeId, partial) => {
    set((s) => ({
      scenes: s.scenes.map((sc) => {
        if (sc.id !== sceneId) return sc;
        const node = sc.nodes[nodeId];
        if (!node) return sc;
        const updated = { ...node, ...partial };
        // Keep id consistent
        updated.id = nodeId;
        return { ...sc, nodes: { ...sc.nodes, [nodeId]: updated } };
      }),
      dirty: true,
    }));
  },

  deleteNode: (sceneId, nodeId) => {
    set((s) => ({
      scenes: s.scenes.map((sc) => {
        if (sc.id !== sceneId) return sc;
        const deletedNode = sc.nodes[nodeId];
        if (!deletedNode) return sc;

        const nodes = { ...sc.nodes };
        delete nodes[nodeId];

        // Fix dangling references: any node that points to the deleted node
        // should point to the deleted node's next (or null)
        const replacement = deletedNode.next ?? null;
        let choiceReplacementId: string | null = typeof replacement === 'string' ? replacement : null;
        for (const [id, node] of Object.entries(nodes)) {
          if (node.next === nodeId) {
            nodes[id] = { ...node, next: replacement };
          }
          if (node.choices) {
            const updated = node.choices.map((c) => {
              let choice = c;
              // Fix gameCheck refs — clear entire check if either target is deleted
              if (choice.gameCheck && (choice.gameCheck.passNode === nodeId || choice.gameCheck.failNode === nodeId)) {
                choice = { ...choice, gameCheck: undefined };
              }
              if (choice.nextId !== nodeId) return choice;
              if (!choiceReplacementId) {
                choiceReplacementId = generateNodeId('end');
                nodes[choiceReplacementId] = {
                  id: choiceReplacementId,
                  speaker: 'narrator',
                  text: '',
                  next: null,
                };
              }
              return { ...choice, nextId: choiceReplacementId };
            });
            nodes[id] = { ...nodes[id], choices: updated };
          }
          // Fix gameConditionNext refs — remove branches pointing to deleted node
          if (node.gameConditionNext) {
            const filtered = node.gameConditionNext.filter((b) => b.nextId !== nodeId);
            nodes[id] = { ...nodes[id], gameConditionNext: filtered.length > 0 ? filtered : undefined };
          }
        }

        // Fix startNode if it was the deleted node
        const startNode = sc.startNode === nodeId
          ? (typeof replacement === 'string' ? replacement : Object.keys(nodes)[0] ?? 'start')
          : sc.startNode;

        return { ...sc, nodes, startNode };
      }),
      dirty: true,
    }));
  },

  /* ---- Choice CRUD ---- */

  addChoice: (sceneId, nodeId, choice) => {
    set((s) => ({
      scenes: s.scenes.map((sc) => {
        if (sc.id !== sceneId) return sc;
        const node = sc.nodes[nodeId];
        if (!node) return sc;
        const choices = [...(node.choices ?? []), choice];
        // When adding choices, remove `next` to make it a branch node
        return { ...sc, nodes: { ...sc.nodes, [nodeId]: { ...node, choices, next: undefined } } };
      }),
      dirty: true,
    }));
  },

  addChoiceWithNode: (sceneId, nodeId, label, speaker) => {
    const scene = get().scenes.find((s) => s.id === sceneId);
    if (!scene || !scene.nodes[nodeId]) return null;

    const targetId = generateNodeId(speaker === 'narrator' ? 'nar' : speaker);
    const targetNode: DialogueNode = {
      id: targetId,
      speaker,
      text: '',
      next: null,
    };
    const choice: VNChoice = { label, nextId: targetId };

    set((s) => ({
      scenes: s.scenes.map((sc) => {
        if (sc.id !== sceneId) return sc;
        const node = sc.nodes[nodeId];
        if (!node) return sc;
        const choices = [...(node.choices ?? []), choice];
        const nodes = {
          ...sc.nodes,
          [nodeId]: { ...node, choices, next: undefined },
          [targetId]: targetNode,
        };
        return { ...sc, nodes };
      }),
      dirty: true,
    }));
    return targetId;
  },

  updateChoice: (sceneId, nodeId, choiceIdx, partial) => {
    set((s) => ({
      scenes: s.scenes.map((sc) => {
        if (sc.id !== sceneId) return sc;
        const node = sc.nodes[nodeId];
        if (!node?.choices?.[choiceIdx]) return sc;
        const choices = [...node.choices];
        choices[choiceIdx] = { ...choices[choiceIdx], ...partial };
        return { ...sc, nodes: { ...sc.nodes, [nodeId]: { ...node, choices } } };
      }),
      dirty: true,
    }));
  },

  deleteChoice: (sceneId, nodeId, choiceIdx) => {
    set((s) => ({
      scenes: s.scenes.map((sc) => {
        if (sc.id !== sceneId) return sc;
        const node = sc.nodes[nodeId];
        if (!node?.choices) return sc;
        const choices = node.choices.filter((_, i) => i !== choiceIdx);
        if (choices.length === 0) {
          // No choices left — convert back to linear with next: null
          const linearNode = { ...node, next: null };
          delete linearNode.choices;
          return { ...sc, nodes: { ...sc.nodes, [nodeId]: linearNode } };
        }
        return { ...sc, nodes: { ...sc.nodes, [nodeId]: { ...node, choices } } };
      }),
      dirty: true,
    }));
  },

  /* ---- Convert node type ---- */

  convertToChoiceNode: (sceneId, nodeId) => {
    const scene = get().scenes.find((s) => s.id === sceneId);
    if (!scene) return;
    const node = scene.nodes[nodeId];
    if (!node || node.choices) return;

    // Create first choice pointing to old next (or new end node)
    const targetId = node.next ?? null;
    const choice: VNChoice = {
      label: 'Choice 1',
      nextId: targetId ?? generateNodeId('end'),
    };

    set((s) => ({
      scenes: s.scenes.map((sc) => {
        if (sc.id !== sceneId) return sc;
        const nodes = { ...sc.nodes };
        // If there was no next, create an end node for the choice target
        if (!targetId) {
          const endId = choice.nextId;
          nodes[endId] = { id: endId, speaker: 'narrator', text: '', next: null };
        }
        nodes[nodeId] = { ...node, choices: [choice], next: undefined };
        return { ...sc, nodes };
      }),
      dirty: true,
    }));
  },

  convertToLinearNode: (sceneId, nodeId, keepChoiceIdx = 0) => {
    const scene = get().scenes.find((s) => s.id === sceneId);
    if (!scene) return;
    const node = scene.nodes[nodeId];
    if (!node?.choices) return;

    const keptChoice = node.choices[keepChoiceIdx] ?? node.choices[0];
    const next = keptChoice?.nextId ?? null;
    const linearNode = { ...node, next };
    delete linearNode.choices;

    set((s) => ({
      scenes: s.scenes.map((sc) => {
        if (sc.id !== sceneId) return sc;
        return { ...sc, nodes: { ...sc.nodes, [nodeId]: linearNode } };
      }),
      dirty: true,
    }));
  },
}));
