# VN Lab Authoring Tool — Implementation Plan

## Goal
Transform the VN Lab from a **read-only viewer** with hardcoded demo scenes into a **full authoring tool** where scenes are created, edited, persisted, and slotted into the Campaign Editor.

Pipeline: **VN Lab (author) → Campaign Editor (arrange) → Export → Game code**

---

## Current State (What Exists)

- 3,425-line monolith `VisualNovelLabPage.tsx` containing everything
- 6 hardcoded demo scenes in a `SCENES` array
- 4 tabs: Scene Player, Dialogue Tree, Portraits, Data Format
- Full rendering engine: typewriter text, SVG portraits, mood backgrounds, choices, effects
- Read-only — no editing, no persistence, no import/export

## Architecture Decisions

1. **New Zustand store** (`vnSceneStore.ts`) owns all scene data + CRUD operations
2. **localStorage persistence** with JSON import/export (no file I/O needed)
3. **Demo scenes become seed data** — loaded on first use, editable after that
4. **Types extracted** to `vnTypes.ts` so the store, editor, and renderer can share them
5. **Editor is a new tab** ("Editor") alongside existing tabs — not a replacement
6. **Scene Browser** gains create/delete/duplicate actions
7. **Campaign Editor** gets a "Link VN Scene" action on `vn` nodes

---

## Phase 1: Extract & Persist

**Goal:** Decouple scene data from the component. Scenes live in a store with localStorage.

### Steps

1. **Create `src/lab/types/vnTypes.ts`**
   - Move all type definitions: `Expression`, `CharPosition`, `SceneMood`, `DeliveryMode`, `VNCharacter`, `DialogueNode`, `VNChoice`, `VNScene`
   - Move `CHARACTERS` record and `EXPRESSION_COLORS`
   - Export everything

2. **Create `src/lab/data/vnDemoScenes.ts`**
   - Move the 6 demo scenes from the component to this file
   - Export as `VN_DEMO_SCENES: VNScene[]`

3. **Create `src/lab/stores/vnSceneStore.ts`**
   - Zustand store with:
     - `scenes: VNScene[]` — all scenes (demo + user-created)
     - `selectedSceneId: string | null`
     - `dirty: boolean` — unsaved changes indicator
   - Actions:
     - `loadScenes()` — load from localStorage, fallback to demo seeds
     - `saveScenes()` — persist to localStorage
     - `addScene(scene)` — add new scene
     - `updateScene(id, partial)` — update scene metadata
     - `deleteScene(id)` — remove scene
     - `duplicateScene(id)` — clone with new ID
     - `importScenes(json)` — parse & merge from JSON string
     - `exportScenes()` — serialize to JSON string
     - `exportScene(id)` — serialize single scene
     - `resetToDefaults()` — restore demo scenes
   - Node-level actions (for Phase 2):
     - `addNode(sceneId, node)` — add dialogue node
     - `updateNode(sceneId, nodeId, partial)` — update node fields
     - `deleteNode(sceneId, nodeId)` — remove node + fix dangling refs
     - `addChoice(sceneId, nodeId, choice)` — add choice to node
     - `updateChoice(sceneId, nodeId, choiceIdx, partial)` — update choice
     - `deleteChoice(sceneId, nodeId, choiceIdx)` — remove choice

4. **Update `VisualNovelLabPage.tsx`**
   - Replace `SCENES` constant with `useVnSceneStore()` hook
   - Import types from `vnTypes.ts`
   - Import `CHARACTERS` / `EXPRESSION_COLORS` from `vnTypes.ts`
   - Add import/export buttons to the toolbar
   - Add "New Scene" button to SceneBrowser
   - Add delete/duplicate actions to scene cards

---

## Phase 2: Node Editor Tab

**Goal:** Edit any dialogue node inline — text, speaker, expression, mode, effects, choices.

### Steps

1. **Add "Editor" tab** to the main component (5th tab)
2. **Scene metadata editor** (top section):
   - Editable title, description, mood dropdown, cast checkboxes
   - Start node selector
3. **Node list** (left panel):
   - Scrollable list of all nodes in the scene
   - Click to select for editing
   - Drag handle for reorder (stretch goal — skip if complex)
   - Add/delete node buttons
   - Visual indicators: speaker color, choice icon, end icon
4. **Node detail editor** (right panel):
   - `speaker` — dropdown of CHARACTERS
   - `expression` — dropdown (9 options) with color preview
   - `text` — textarea with rich text preview below
   - `mode` — radio buttons (speech/thought/shout/whisper)
   - `positions` — per-character position dropdowns
   - `mood` — optional override dropdown
   - `next` — dropdown of other node IDs (or null for end)
   - `effect` — dropdown (none/shake/flash/fade)
   - `sfx` — text input
   - **Choices sub-editor** (if node has choices):
     - List of choices with label, description, nextId, statCheck, condition
     - Add/remove choice buttons
     - nextId dropdown pointing to existing nodes
5. **Live preview strip** — small VN renderer showing current node as it would appear in-game

---

## Phase 3: Scene Builder

**Goal:** Create scenes from scratch, manage the full node graph visually.

### Steps

1. **"New Scene" workflow**:
   - Click "New Scene" → modal with title, description, mood, cast selection
   - Creates scene with a single starter node (narrator, "Scene begins...")
   - Auto-selects in Editor tab
2. **Node graph mini-map** (in Editor tab):
   - Small visual flow showing node connections
   - Nodes as small rectangles, lines for `next` / choice connections
   - Click node to select for editing
   - Highlights orphan nodes (not reachable from startNode)
   - Highlights broken references (next points to non-existent node)
3. **Validation panel**:
   - Warnings for: unreachable nodes, broken next refs, missing text, duplicate IDs
   - Error count badge on Editor tab
4. **Quick-add patterns**:
   - "Add dialogue after this node" — inserts new node, rewires `next`
   - "Add choice branch" — adds choice + creates target node
   - "Convert to choice node" — changes linear node to branching

---

## Phase 4: Campaign Integration

**Goal:** VN scenes can be referenced from Campaign Editor `vn` nodes.

### Steps

1. **Campaign Editor `vn` node detail panel**:
   - Dropdown to select from available VN scenes (from vnSceneStore)
   - "Open in VN Lab" button — cross-launches with `navigateToLab('visual-novel', { sceneId })`
   - Preview: shows scene title, description, node count, cast
2. **VN Lab receives launch config**:
   - If `launchConfig.sceneId` is set, auto-select that scene
   - If `launchConfig.sourceNodeId` is set, show "Back to Campaign" button
3. **Export integration**:
   - `campaignExport.ts` includes VN scene references in scaffold
   - Generated TypeScript imports VN scene data for the game engine

---

## File Inventory (New/Modified)

| File | Action | Purpose |
|------|--------|---------|
| `src/lab/types/vnTypes.ts` | NEW | Shared types + constants |
| `src/lab/data/vnDemoScenes.ts` | NEW | 6 demo scenes extracted |
| `src/lab/stores/vnSceneStore.ts` | NEW | Zustand store for scene CRUD + persistence |
| `src/lab/pages/VisualNovelLabPage.tsx` | MODIFY | Wire up store, add Editor tab, add toolbar actions |
| `src/lab/styles/visual-novel.css` | MODIFY | Add editor panel styles |
| `src/lab/stores/campaignEditorStore.ts` | MODIFY | Add VN scene linking (Phase 4) |
| `src/lab/utils/campaignExport.ts` | MODIFY | Include VN refs in export (Phase 4) |

---

## Verification After Each Phase

```bash
npx tsc --noEmit        # Must pass
npm run build            # Must succeed
npx vitest run           # All tests pass
```

Then Playwright walkthrough of the VN Lab to confirm nothing broke.
