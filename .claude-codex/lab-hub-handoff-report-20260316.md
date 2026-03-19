# Lab Hub Handoff Report

## Scope

This report covers the Lab Hub work completed across the full recent iteration cycle, not just the last prompt. It includes:

- the original audit findings that drove the fixes
- all substantive Lab Hub code changes made afterward
- the rationale for each change
- current verification status
- remaining risks and review points for Claude

This is intentionally written as a reviewer handoff, not a changelog dump.

## High level outcome

The Lab Hub is in materially better shape than it was at the start of this pass.

- The Lab-specific security holes in the dev filesystem API were closed.
- Asset Studio persistence is much more coherent.
- Chat/thread handling is now a real subsystem instead of a loose page-level experiment.
- State tools are less dangerous and more accurate.
- The campaign and VN authoring tools no longer have the most obvious data integrity traps that showed up during audit.
- The Lab shell now lazy-loads tool pages, so the standalone Lab bundle is properly split.
- Lab verification is currently clean: typecheck, lint, test, and build all pass.

## Baseline problems identified before implementation

These were the main issues found during the audit phase and early repo inspection:

- The Vite dev middleware exposed overly permissive filesystem access patterns for gallery and thread operations.
- Asset metadata updates were not persisting reliably for filesystem-backed assets.
- Filesystem gallery helpers could silently ignore failed writes/deletes and drift out of sync with IndexedDB.
- Long chat threads could produce invalid Gemini role ordering after the sliding window kicked in.
- `campaignEditorStore.ts` read `localStorage` at module import time, which broke three Lab test suites and made non-browser imports brittle.
- Asset Studio "Use as Ref" only worked when the blob was already in memory.
- Save Manager had very light guardrails around destructive actions.
- VN node deletion could create broken or empty choice targets.
- Lab build output was still too monolithic and the Vite filesystem middleware existed in duplicated copies.

That set the priorities for the first stabilization pass.

## 1. Dev filesystem API hardening and deduplication

### Files

- `build/labFilesystemPlugins.ts` (new)
- `lab/vite.config.ts`
- `vite.config.ts`

### What changed

- Extracted the Lab filesystem middleware into a shared module so the root Vite config and the Lab Vite config are not carrying duplicate implementations.
- Added path-safety helpers:
  - ID validation
  - filename validation
  - "resolve within directory" enforcement
- Hardened the gallery endpoints:
  - list
  - save
  - delete
  - image serving
- Hardened the thread endpoints:
  - list
  - load
  - save
  - save-image
  - delete
  - image serving

### Why

- The previous middleware trusted request path segments too broadly.
- The same logic existed in two places, which made it easy for Lab and root behavior to drift.
- Centralizing the middleware lowers maintenance cost and review surface.

### Reviewer note

- This API layer is still dev-server-only by design via `configureServer()`. It is safer now, but it is still a local developer utility, not a production service boundary.

## 2. Lab shell performance and routing cleanup

### Files

- `lab/src/LabRoot.tsx`
- `lab/vite.config.ts`

### What changed

- Switched the Lab shell to lazy-load each tool page via `React.lazy` and `Suspense`.
- Kept the home page eager.
- Added a small tool-loading fallback component.
- Fixed the hash-launch parsing edge case by removing double-decoding from the Lab hash parser.
- Added chunk splitting in the Lab Vite config so Lab pages ship as separate chunks instead of a single large JS blob.

### Why

- The Lab bundle had become large enough to justify real code-splitting.
- The previous hash parsing could over-decode values on cross-launch.
- Lazy-loading tools is a clean fit because each Lab page is an isolated surface.

### Result

- The standalone Lab build is now split into page chunks.
- The earlier Lab JS chunk warning is gone.
- Largest Lab page chunk is now roughly the VN page, not a single catch-all Lab blob.

## 3. Asset Studio stabilization

### Files

- `lab/src/pages/AssetStudioPage.tsx`
- `lab/src/stores/assetStudioStore.ts`
- `lab/src/services/assetDb.ts`
- `lab/src/styles/asset-studio.css`

### What changed

- Fixed metadata persistence so filesystem-backed assets do not immediately overwrite updated tags/notes with stale disk state.
- Tightened filesystem helper error handling so failed gallery operations do not fail silently.
- Fixed "Use as Ref" for reloaded assets by loading the blob when it is not already in memory.
- Moved Asset Studio store bootstrapping away from raw module-scope `localStorage.getItem(...)` calls into guarded helpers.
- Added selection/filter synchronization in the gallery so the detail panel does not keep showing an asset that is no longer visible under the active filter.
- Expanded Asset Studio styling to support the new chat subsystem and related UI.

### Why

- The persistence model was split between filesystem JSON, filesystem images, and IndexedDB cache. That only works if failure paths are explicit and the primary store actually wins consistently.
- Module-scope storage reads are a recurring source of import brittleness in Lab stores.
- Hidden selection state is confusing in authoring tools because the detail panel can appear to belong to the filtered list when it no longer does.

### Reviewer note

- Asset Studio still uses a hybrid persistence model:
  - filesystem is the persistent source of truth
  - IndexedDB is a local cache
- That is workable now, but it is still a design worth reviewing if Claude wants stricter transactional guarantees.

## 4. Chat/thread subsystem build-out

### Files

- `lab/src/pages/ChatTab.tsx` (new)
- `lab/src/stores/threadStore.ts` (new)
- `lab/src/services/threadDb.ts` (new)
- `lab/src/types/threadTypes.ts` (new)
- `lab/src/services/geminiApi.ts`

### What changed

- Added a dedicated thread persistence layer backed by the new filesystem endpoints.
- Added a Zustand store for:
  - thread list
  - active thread
  - sending state
  - thread settings
  - message sending
  - image save-to-gallery flow
- Normalized Gemini content building so long threads preserve alternating roles more safely.
- On send failure, the thread list now refreshes instead of leaving thread summaries stale.
- Added save-to-gallery feedback in the Chat UI so save failures are surfaced to the user.
- Cleaned up Gemini service/runtime issues discovered during the earlier stabilization pass.

### Why

- The chat surface needed to be promoted into a first-class Lab subsystem rather than living as incidental page logic.
- The Gemini API is sensitive to message role ordering, so the sliding-window logic needed normalization.
- Filesystem-backed image saves are failure-prone enough that silent errors were not acceptable.

### Reviewer note

- The thread/image model is still filesystem-backed through Vite dev middleware. Good for Lab use, but still not meant to be treated as a production architecture.

## 5. Save Manager hardening

### Files

- `lab/src/pages/SaveManagerPage.tsx`

### What changed

- Restricted imports to `the_little_soldier_*` keys.
- Added validation for `the_little_soldier_profiles`.
- Added stronger confirmation for deleting non-game keys.
- Synced selected key state with the active filter so the detail panel does not keep showing a hidden key.
- Corrected `lastPlayed` typing drift to match real stored values better.

### Why

- Save Manager is a sharp tool by design, but it still needed basic protection against accidental corruption of unrelated local app state.
- The selected-key drift problem is especially bad in state/data tools because it can mislead users into editing the wrong thing.

## 6. State Inspector correctness pass

### Files

- `lab/src/pages/StateInspectorPage.tsx`

### What changed

- Fixed save parsing so "Game Save" now resolves current save envelopes correctly instead of treating wrapped save data as if it were raw `GameState`.
- Fixed "Battle State" to read the actual `battleState` from the current save format.
- Changed save selection to prefer the most recent profile save rather than just the first slot found.
- Replaced the old source-toggle refresh hack with an explicit refresh token.
- Enabled inline editing for custom JSON mode and prevented the UI from pretending leaf values are editable when there is no edit handler.

### Why

- The page description implies a `GameState` / `BattleState` inspector. It was not actually doing that reliably with current save format.
- The old refresh behavior was a workaround, not real logic.
- Dead editing affordances are confusing in a tool whose entire purpose is state inspection and manipulation.

## 7. Campaign editor stabilization

### Files

- `lab/src/stores/campaignEditorStore.ts`
- `lab/src/pages/CampaignViewerPage.tsx`
- `lab/src/components/campaign/CampaignGraph.tsx`
- `lab/src/utils/campaignExport.ts`
- `lab/src/__tests__/campaignEditorStore.test.ts`

### What changed

- Removed module-scope `localStorage` reads from `campaignEditorStore.ts` so the store can import cleanly in tests and non-browser contexts.
- Cleaned up related test assumptions and export behavior.
- Fixed smaller runtime/lint issues in Campaign Viewer and Campaign Graph.

### Why

- This was the direct cause of the three failing Lab test suites at the time of the earlier audit.
- Campaign tooling is a central authoring surface, so import-time side effects were unacceptable.

### Reviewer note

- I did not do a deep data-model redesign here. This pass was about stability and correctness, not replacing the campaign architecture.

## 8. Visual Novel editor/data integrity fixes

### Files

- `lab/src/stores/vnSceneStore.ts`
- `lab/src/pages/VisualNovelLabPage.tsx`

### What changed

- Fixed node deletion so choice references are repaired more safely instead of being rewritten into broken empty targets.
- Fixed conversion behavior between linear and choice nodes.
- Cleaned up a conditional-hook issue and other runtime/lint debt in `VisualNovelLabPage.tsx`.
- Added scene-selection synchronization so the page auto-selects the first available scene when scenes exist and the current selection is missing.
- Stopped play mode when the selected scene disappears.

### Why

- Authoring tools need strong guarantees around graph integrity.
- Empty or dangling targets in branching content are the kind of bug that silently poisons authored data.
- The page-level selection work matches the same "visible data vs hidden stale state" cleanup done across the other labs.

## 9. Per-lab sweep fixes across the remaining tools

### Files

- `lab/src/pages/LineBattleLabPage.tsx`
- `lab/src/pages/MeleeLabPage.tsx`
- `lab/src/pages/StoryBeatPreviewPage.tsx`
- `lab/src/pages/NpcBrowserPage.tsx`
- `lab/src/pages/AudioLabPage.tsx`

### What changed

- Line Battle:
  - selection is now keyed uniquely by battle/part/index rather than raw volley number
  - selection stays in sync with active filters
- Melee:
  - selected opponent state stays in sync with active filters
- Story Beat:
  - filtered selection auto-syncs
  - fixed in-place sort mutation on static arrays
  - beat flow logic is more consistent with current selection/filter state
- NPC Browser:
  - selected NPC state stays in sync with active filters
- Audio Lab:
  - browser audio context is now closed on unmount
  - audio element ref is cleaned up on teardown

### Why

- These were not catastrophic bugs, but they are exactly the kind of "this tool feels wrong" issues that slow down authoring and erode trust.
- Line Battle had one concrete correctness bug: duplicate volley indices across Rivoli and Voltri could resolve to the wrong detail panel in the combined view.

## 10. Test harness and verification support

### Files

- `lab/src/test/setup.ts` (new)
- `lab/vitest.config.ts`

### What changed

- Added a deterministic in-memory `localStorage` / `sessionStorage` mock for Lab tests.
- Pointed Vitest at the shared setup file.

### Why

- This was needed after removing some browser-only assumptions and cleaning up store imports.
- It also made the Lab test environment more explicit and less dependent on incidental jsdom behavior.

## 11. Shared root or adjacent branch changes Claude may notice

These are outside the strict Lab Hub surface, but they are present in the same branch and explain some surrounding diffs:

- `game/src/AppRoot.tsx`
  - lazy-loaded major game pages and overlays to eliminate the root build chunk warning
- `game/src/__tests__/setup.ts`
  - added the same storage mock pattern used in Lab

These were done during the broader performance/stability passes, but they are not necessary to understand the Lab Hub logic itself.

## 12. Verification history and current status

### Earlier in the cycle

- `lab` typecheck passed
- `lab` build passed
- `lab` tests initially failed in three campaign suites because of `campaignEditorStore.ts` touching `localStorage` at import time

### Current status

All Lab checks are now clean:

- `npm run typecheck --workspace=lab`
- `npm run lint --workspace=lab`
- `npm run test --workspace=lab`
- `npm run build --workspace=lab`

Additional relevant status from earlier passes:

- root `npm run build` was also brought back to a clean state after code-splitting work
- full `game` typecheck/lint/test still has unrelated pre-existing failures in formation / rank action / sandbox areas and a few older data files; those are not Lab regressions

## 13. Important reviewer context

If Claude is reviewing this work, these are the highest-value things to focus on:

- whether the dev-only filesystem middleware now has the right level of path validation
- whether the filesystem + IndexedDB split in Asset Studio is acceptable as-is or should be simplified further
- whether the chat/thread persistence model is good enough for Lab use
- whether any of the static Lab datasets should be replaced with shared imports from `game/` to reduce drift
- whether the current page-level selection-sync behavior is the desired UX everywhere

## 14. Remaining risks and follow-up opportunities

The big correctness issues are addressed, but there is still follow-up work available:

- Lab CSS is still large, even though JS chunking is much better.
- Several labs still mirror game-side data/configs rather than importing shared sources:
  - Camp
  - Line Battle
  - Melee
  - Story Beat
  - NPC Browser
  - Art / Audio / Minigame static references
- Page-level interactions remain lightly tested. Current tests are strongest around campaign store/export behavior, not browser interaction flows.
- Thread and gallery writes are still ultimately local filesystem operations during dev. They are much safer now, but still not transactional in the strict sense.

## 15. Files changed that are part of the Lab Hub work

Core Lab/shared support:

- `build/labFilesystemPlugins.ts`
- `lab/vite.config.ts`
- `vite.config.ts`
- `lab/src/LabRoot.tsx`
- `lab/vitest.config.ts`
- `lab/src/test/setup.ts`

Asset Studio / Chat:

- `lab/src/pages/AssetStudioPage.tsx`
- `lab/src/pages/ChatTab.tsx`
- `lab/src/services/assetDb.ts`
- `lab/src/services/geminiApi.ts`
- `lab/src/services/threadDb.ts`
- `lab/src/stores/assetStudioStore.ts`
- `lab/src/stores/threadStore.ts`
- `lab/src/types/threadTypes.ts`
- `lab/src/styles/asset-studio.css`

State and save tools:

- `lab/src/pages/SaveManagerPage.tsx`
- `lab/src/pages/StateInspectorPage.tsx`

Campaign / VN authoring:

- `lab/src/pages/CampaignViewerPage.tsx`
- `lab/src/components/campaign/CampaignGraph.tsx`
- `lab/src/stores/campaignEditorStore.ts`
- `lab/src/utils/campaignExport.ts`
- `lab/src/__tests__/campaignEditorStore.test.ts`
- `lab/src/pages/VisualNovelLabPage.tsx`
- `lab/src/stores/vnSceneStore.ts`

Other tool pages:

- `lab/src/pages/LineBattleLabPage.tsx`
- `lab/src/pages/MeleeLabPage.tsx`
- `lab/src/pages/NpcBrowserPage.tsx`
- `lab/src/pages/StoryBeatPreviewPage.tsx`
- `lab/src/pages/AudioLabPage.tsx`

## 16. Unrelated worktree noise

There are unrelated modified/untracked files in the worktree that were not part of this Lab Hub pass, including art docs and public reference assets. Claude should not treat those as part of the Lab review unless explicitly asked.
