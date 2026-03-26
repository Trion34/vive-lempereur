# The Little Soldier — Claude Code Instructions

## Project Structure

This is a monorepo with two workspace packages:
- **`game/`** — The game source code, tests, and styles
- **`lab/`** — The lab/tooling source code, tests, and styles
- **Root** — Host config that serves both on :3000 via `npm run dev`

`public/` stays at the repo root (shared static assets). `battlefield-lab/` is experimental (not a workspace).

## Testing Requirements

**Every feature, bugfix, or refactor MUST include tests at two levels:**

### 1. Unit / Integration Tests (Vitest)

- Run with: `npx vitest run` (runs both game and lab tests via workspace projects)
- Per-workspace: `npm run test --workspace=game` or `npm run test --workspace=lab`
- All new code must have corresponding tests before the work is considered complete
- **Core logic** (`game/src/core/`): Test state transitions, formulas, edge cases. Tests go in `game/src/__tests__/core/`.
- **Data layer** (`game/src/data/`): Test that all definitions produce valid output. Tests go in `game/src/__tests__/data/`.
- **Components** (`game/src/components/`, `game/src/pages/`): Test rendering, user interaction, and store-driven state changes using `@testing-library/react`. Tests go in `game/src/__tests__/components/` or `game/src/__tests__/pages/`.
- **Shared test helpers** live in `game/src/__tests__/helpers/` (e.g., `mockFactories.ts` for `mockBattleState()`, `mockGameState()`).
- **Lab tests** live in `lab/src/__tests__/`.
- Mock audio (`music.ts`, `audio.ts`) and animation hooks (`useMeleeAnimation`, `useCinematic`) in component tests — jsdom cannot run these.
- Current baseline: **2146 tests**. Never merge with fewer passing tests than you started with.

### 2. E2E Visual Testing (Playwright MCP)

After unit tests pass, verify UI-affecting changes in a live browser using the Playwright MCP tools:

1. Start the dev server: `npm run dev` (port 3000 by default, serves both game and lab)
2. Use `mcp__plugin_playwright_playwright__browser_navigate` to open the app at `/game/index.html`
3. Use `mcp__plugin_playwright_playwright__browser_snapshot` and `mcp__plugin_playwright_playwright__browser_take_screenshot` to verify the UI renders correctly
4. Use `mcp__plugin_playwright_playwright__browser_click` to interact with the app and test user flows
5. Walk through the affected game phases to confirm nothing is visually broken

**What to verify in E2E:**
- New UI elements render and are interactive
- Existing screens still display correctly after changes
- Phase transitions work (Intro → Camp → Line → StoryBeat → Melee)
- Overlays (settings, cinematic, battle-over) open and close properly
- DevTools panel opens with backtick key and all tabs function

### 3. Dead Code Detection (Knip)

Use [Knip](https://knip.dev/) to find unused exports, files, and dependencies after refactors or deletions:

```bash
npx knip
```

Run Knip when:
- Deleting or reorganizing files/modules
- Removing features or replacing implementations
- After large refactors to catch orphaned exports and dead code
- Before finalizing a branch for merge

Fix any legitimate findings (unused exports, unreferenced files, stale dependencies). Ignore false positives from dynamic imports or test helpers.

### Verification Checklist

Run these commands after every step of work:

```bash
npx tsc --noEmit        # Type safety — must be clean
npm run build            # Production build — must succeed
npx vitest run           # Tests — all must pass
```

After refactors or deletions, also run `npx knip` to catch dead code.

Then do a Playwright MCP walkthrough for any UI-facing changes.

## Backwards Compatibility

**No save migration code until 1.0.** The game is pre-release — old saves can be discarded. If the save format changes, bump `SAVE_VERSION` in `persistence.ts` and let incompatible saves return `null`. Players start fresh. Don't write migration logic, legacy interfaces, or compatibility shims.

## Project Conventions

- **Stack:** TypeScript (strict), React 19, Zustand, Vite, Vitest
- **State mutation convention:** `advanceTurn()` in `battle.ts` is the **immutability boundary** — it `structuredClone()`s the input and returns new state. Everything else (camp, game-loop, melee round, auto-play) mutates in place. Zustand stores call core functions, then shallow-copy (`{ ...gameState }`) to trigger re-renders. Components must call `saveGame()` after mutations. The auto-play hook (`useAutoPlay.ts`) mutates `battleStateRef.current` directly and calls `syncState()` to force re-renders.
- **Narrative content** lives in `game/src/data/` (separated from logic in `game/src/core/`)
- **VN (Visual Novel) system:** Game-mechanic-aware VN scenes can replace camp events. Pure interpreter in `game/src/core/vnSceneInterpreter.ts`, renderer in `game/src/components/vn/VNRenderer.tsx`. VN scene data in `game/src/data/battles/*/vnScenes/`. Camp events use `kind: 'vn'` config. Lab pipeline: VN Lab (author) → Campaign Editor (attach to events) → Export → Game.
- **CSS:** Vanilla CSS with custom properties (`--parchment-dark`, `--ink-primary`, etc.). No CSS-in-JS.
- **No unnecessary dependencies.** Animations use CSS keyframes + JS coordination, not animation libraries.
