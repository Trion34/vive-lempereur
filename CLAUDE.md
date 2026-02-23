# The Little Soldier — Claude Code Instructions

## Testing Requirements

**Every feature, bugfix, or refactor MUST include tests at two levels:**

### 1. Unit / Integration Tests (Vitest)

- Run with: `npx vitest run`
- All new code must have corresponding tests before the work is considered complete
- **Core logic** (`src/core/`): Test state transitions, formulas, edge cases. Tests go in `src/__tests__/core/`.
- **Data layer** (`src/data/`): Test that all definitions produce valid output. Tests go in `src/__tests__/data/`.
- **Components** (`src/components/`, `src/pages/`): Test rendering, user interaction, and store-driven state changes using `@testing-library/react`. Tests go in `src/__tests__/components/` or `src/__tests__/pages/`.
- **Shared test helpers** live in `src/__tests__/helpers/` (e.g., `mockFactories.ts` for `mockBattleState()`, `mockGameState()`).
- Mock audio (`music.ts`, `audio.ts`) and animation hooks (`useMeleeAnimation`, `useCinematic`) in component tests — jsdom cannot run these.
- Current baseline: **523 tests, 0 failures**. Never merge with fewer passing tests than you started with.

### 2. E2E Visual Testing (Playwright MCP)

After unit tests pass, verify UI-affecting changes in a live browser using the Playwright MCP tools:

1. Start the dev server: `npm run dev` (port 3000 by default)
2. Use `mcp__plugin_playwright_playwright__browser_navigate` to open the app
3. Use `mcp__plugin_playwright_playwright__browser_snapshot` and `mcp__plugin_playwright_playwright__browser_take_screenshot` to verify the UI renders correctly
4. Use `mcp__plugin_playwright_playwright__browser_click` to interact with the app and test user flows
5. Walk through the affected game phases to confirm nothing is visually broken

**What to verify in E2E:**
- New UI elements render and are interactive
- Existing screens still display correctly after changes
- Phase transitions work (Intro → Camp → Line → StoryBeat → Melee)
- Overlays (settings, cinematic, battle-over) open and close properly
- DevTools panel opens with backtick key and all tabs function

### Verification Checklist

Run these three commands after every step of work:

```bash
npx tsc --noEmit        # Type safety — must be clean
npm run build            # Production build — must succeed
npx vitest run           # Tests — all must pass
```

Then do a Playwright MCP walkthrough for any UI-facing changes.

## Project Conventions

- **Stack:** TypeScript (strict), React 19, Zustand, Vite, Vitest
- **State:** Game logic in `src/core/` is pure (takes state, returns new state). Zustand stores in `src/stores/` call core functions and update reactively.
- **Narrative content** lives in `src/data/` (separated from logic in `src/core/`)
- **CSS:** Vanilla CSS with custom properties (`--parchment-dark`, `--ink-primary`, etc.). No CSS-in-JS.
- **No unnecessary dependencies.** Animations use CSS keyframes + JS coordination, not animation libraries.
