# Data-Driven Camp System — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make each camp a unique, data-driven story chapter by wiring up the existing CampConfig infrastructure and replacing hardcoded events/flags in CampPage.

**Architecture:** Replace `CampaignDef.battles[]` with a flat `sequence: CampaignNode[]` of typed nodes (camp/battle/interlude). Camp configs live on the CampaignDef as `camps: Record<string, CampConfig>`. CampPage becomes generic — reads its config from the campaign definition using the current node's campId.

**Tech Stack:** TypeScript (strict), React 19, Zustand, Vitest

**Test baseline:** 639 tests. Target: 645+ after implementation.

---

### Task 1: Add CampaignNode type and update CampaignDef

**Files:**
- Modify: `src/data/campaigns/types.ts`

**Step 1: Add CampaignNode type and update CampaignDef**

Replace the `battles` array with `sequence` and add `camps`:

```typescript
// Add this union type
export type CampaignNode =
  | { type: 'interlude'; interludeId: string }
  | { type: 'camp'; campId: string }
  | { type: 'battle'; battleId: string };
```

Update `CampaignDef`:
```typescript
export interface CampaignDef {
  id: string;
  title: string;
  sequence: CampaignNode[];
  camps: Record<string, CampConfig>;
  interludes: Record<string, InterludeDef>;
  replacementPool: NPCTemplate[];
}
```

Remove `CampaignBattleEntry` interface entirely — it's replaced by the node types. But keep `InterludeDef` and `NPCTemplate` as-is.

**Step 2: Move CampConfig to campaign types**

Move these types from `src/data/battles/types.ts` to `src/data/campaigns/types.ts`:

```typescript
export interface CampConfig {
  id: string;               // NEW: camp identifier
  title: string;            // NEW: e.g. "Rivoli Plateau — Eve of Battle"
  actionsTotal: number;
  weather: string;
  supplyLevel: string;
  openingNarrative: string;
  forcedEvents: ForcedEventConfig[];
  randomEvents: RandomEventConfig[];
  activityNarratives?: Partial<Record<CampActivityId, string[]>>;
}

export interface ForcedEventConfig {
  id: string;
  triggerAt: number;
  getEvent: (state: CampState, player: PlayerCharacter) => CampEvent;
  resolveChoice: (state: CampState, player: PlayerCharacter, choiceId: string) => CampActivityResult;
}

export interface RandomEventConfig {
  id: string;
  weight: number;
  getEvent: (state: CampState, player: PlayerCharacter) => CampEvent;
  resolveChoice: (state: CampState, player: PlayerCharacter, choiceId: string) => CampActivityResult;
}
```

Add necessary imports (CampState, PlayerCharacter, CampEvent, CampActivityResult, CampActivityId) from `../../types`.

Remove `CampConfig`, `ForcedEventConfig`, `RandomEventConfig` from `src/data/battles/types.ts`. Update the `BattleConfig.camp` field — remove it entirely since camps now live on the campaign, not the battle. If removing causes type errors in Rivoli's battle config, just remove the `camp` property from the Rivoli definition.

**Step 3: Update barrel export**

In `src/data/campaigns/index.ts`, re-export the new types:
```typescript
export type { CampaignNode, CampConfig, ForcedEventConfig, RandomEventConfig } from './types';
```

**Step 4: Verify**

Run: `npx tsc --noEmit`
Expected: Type errors in files that reference `battles[]`, `battleIndex`, `CampaignBattleEntry`, or `BattleConfig.camp`. This is expected — we'll fix them in subsequent tasks.

---

### Task 2: Update CampaignState for sequence-based flow

**Files:**
- Modify: `src/types/campaign.ts`
- Modify: `src/types/camp.ts`

**Step 1: Replace battleIndex with sequenceIndex in CampaignState**

In `src/types/campaign.ts`, change:
```typescript
export interface CampaignState {
  campaignId: string;
  sequenceIndex: number;     // was: battleIndex
  phase: CampaignPhase;
  battlesCompleted: number;
  currentBattle: string;
  nextBattle: string;
  daysInCampaign: number;
  npcDeaths: string[];
  replacementsUsed: string[];
}
```

**Step 2: Replace context with campId in CampState**

In `src/types/camp.ts`, change the `context` field:
```typescript
  campId: string;  // was: context: 'pre-battle'
```

**Step 3: Simplify CampaignPhase enum**

In `src/types/enums.ts`, the `CampaignPhase` enum no longer needs `Prologue`, `PreBattleCamp`, or `PostBattleCamp` — these are now just different camp nodes in the sequence. The phase tracks what TYPE of node we're on:

```typescript
export enum CampaignPhase {
  Camp = 'camp',
  Battle = 'battle',
  Interlude = 'interlude',
  Complete = 'complete',
}
```

**Step 4: Verify**

Run: `npx tsc --noEmit`
Expected: Many type errors across the codebase. These are expected — the next tasks fix them.

---

### Task 3: Update Italy campaign definition with sequence

**Files:**
- Modify: `src/data/campaigns/italy/index.ts`
- Modify: `src/data/battles/rivoli/camp.ts` (extract forced events into CampConfig format)

**Step 1: Convert forced events to ForcedEventConfig format**

In `src/data/battles/rivoli/camp.ts`, the existing `getCampfiresEvent()`, `getBriefingEvent()`, `getBonaparteEvent()` functions return `CampEvent` objects. We need to wrap them into `ForcedEventConfig` entries.

The `resolveChoice` functions currently live in `src/core/preBattleCamp.ts` as `resolvePreBattleEventChoice()`. For now, each config entry's `resolveChoice` will delegate to that existing function.

Create and export from `src/data/battles/rivoli/camp.ts`:

```typescript
import type { ForcedEventConfig, RandomEventConfig } from '../../campaigns/types';

export const RIVOLI_PRE_BATTLE_FORCED_EVENTS: ForcedEventConfig[] = [
  {
    id: 'prebattle_campfires',
    triggerAt: 10,
    getEvent: (_state, _player) => getCampfiresEvent(),
    resolveChoice: (state, player, choiceId) =>
      resolvePreBattleEventChoice(getCampfiresEvent(), choiceId, player, [], state.day),
  },
  {
    id: 'prebattle_briefing',
    triggerAt: 7,
    getEvent: (_state, _player) => getBriefingEvent(),
    resolveChoice: (state, player, choiceId) =>
      resolvePreBattleEventChoice(getBriefingEvent(), choiceId, player, [], state.day),
  },
  // Note: "night_before" at triggerAt=3 is a special cinematic handled inline (NIGHT_BEFORE_TEXT).
  // Wrap it as a forced event with a custom getEvent that returns a CampEvent with the narrative.
  {
    id: 'night_before',
    triggerAt: 3,
    getEvent: (_state, _player) => ({
      id: 'night_before',
      title: 'The Night Before',
      narrative: NIGHT_BEFORE_TEXT,
      choices: [],
    }),
    resolveChoice: () => ({ outcome: '', statChanges: [] }),
  },
  {
    id: 'prebattle_bonaparte',
    triggerAt: 1,
    getEvent: (_state, _player) => getBonaparteEvent(),
    resolveChoice: (state, player, choiceId) =>
      resolvePreBattleEventChoice(getBonaparteEvent(), choiceId, player, [], state.day),
  },
];

export const RIVOLI_RANDOM_EVENTS: RandomEventConfig[] = getAllPreBattleEvents().map(evt => ({
  id: evt.id,
  weight: 1,
  getEvent: (_state: CampState, _player: PlayerCharacter) => evt,
  resolveChoice: (state: CampState, player: PlayerCharacter, choiceId: string) =>
    resolvePreBattleEventChoice(evt, choiceId, player, [], state.day),
}));
```

Import `resolvePreBattleEventChoice` from `../../core/preBattleCamp` and `NIGHT_BEFORE_TEXT` from wherever it's currently defined in CampPage (it may need to be extracted to the data layer).

**Step 2: Rewrite Italy campaign with sequence + camps**

In `src/data/campaigns/italy/index.ts`:

```typescript
import { RIVOLI_PRE_BATTLE_FORCED_EVENTS, RIVOLI_RANDOM_EVENTS, RIVOLI_CAMP_META } from '../../battles/rivoli/camp';
import type { CampaignDef } from '../types';

export const ITALY_CAMPAIGN: CampaignDef = {
  id: 'italy',
  title: 'The Italian Campaign, 1796–1797',

  sequence: [
    { type: 'interlude', interludeId: 'italy-prologue' },
    { type: 'camp', campId: 'eve-of-rivoli' },
    { type: 'battle', battleId: 'rivoli' },
    { type: 'camp', campId: 'after-rivoli' },
    { type: 'interlude', interludeId: 'rivoli-mantua' },
    { type: 'battle', battleId: 'mantua' },
    // Future: more camps, battles, interludes
  ],

  camps: {
    'eve-of-rivoli': {
      id: 'eve-of-rivoli',
      title: 'Rivoli Plateau — Eve of Battle',
      actionsTotal: 16,
      weather: RIVOLI_CAMP_META.weather,
      supplyLevel: RIVOLI_CAMP_META.supplyLevel,
      openingNarrative: RIVOLI_CAMP_META.openingNarrative,
      forcedEvents: RIVOLI_PRE_BATTLE_FORCED_EVENTS,
      randomEvents: RIVOLI_RANDOM_EVENTS,
    },
    'after-rivoli': {
      id: 'after-rivoli',
      title: 'Camp — After the Battle',
      actionsTotal: 8,
      weather: 'cold',
      supplyLevel: 'scarce',
      openingNarrative: 'The guns have fallen silent. The 14th tends its wounded and counts its dead.',
      forcedEvents: [],
      randomEvents: [],
    },
  },

  interludes: {
    'italy-prologue': {
      fromBattle: '',
      toBattle: 'rivoli',
      splashText: 'Italy. January, 1797.',
      narrative: [/* Move PROLOGUE_BEATS content here */],
    },
    'rivoli-mantua': {
      // Keep existing interlude
      fromBattle: 'rivoli',
      toBattle: 'mantua',
      splashText: 'The Fall of Mantua',
      narrative: [/* Keep existing */],
    },
  },

  replacementPool: [/* Keep existing */],
};
```

The prologue cinematic content (currently hardcoded as `PROLOGUE_BEATS` in CampPage.tsx) needs to be moved into the `italy-prologue` interlude's `narrative` array.

**Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: Fewer errors now, but still errors in campaign engine, game loop, and tests that reference old fields.

---

### Task 4: Update campaign engine for sequence-based flow

**Files:**
- Modify: `src/core/campaign.ts`

**Step 1: Rewrite campaign engine functions**

Replace all functions to work with `sequenceIndex` and `CampaignNode[]`:

```typescript
export function createCampaignState(campaignDef: CampaignDef): CampaignState {
  return {
    campaignId: campaignDef.id,
    sequenceIndex: 0,
    phase: nodeToPhase(campaignDef.sequence[0]),
    battlesCompleted: 0,
    currentBattle: findCurrentBattle(campaignDef, 0),
    nextBattle: '',
    daysInCampaign: 0,
    npcDeaths: [],
    replacementsUsed: [],
  };
}

// Helper: convert node type to CampaignPhase
function nodeToPhase(node: CampaignNode): CampaignPhase {
  switch (node.type) {
    case 'camp': return CampaignPhase.Camp;
    case 'battle': return CampaignPhase.Battle;
    case 'interlude': return CampaignPhase.Interlude;
  }
}

// Helper: find the battleId of the nearest battle node at or after index
function findCurrentBattle(def: CampaignDef, fromIndex: number): string {
  for (let i = fromIndex; i < def.sequence.length; i++) {
    const node = def.sequence[i];
    if (node.type === 'battle') return node.battleId;
  }
  return '';
}

// Advance to the next node in the sequence
export function advanceSequence(campaign: CampaignState, campaignDef: CampaignDef): CampaignState {
  const nextIndex = campaign.sequenceIndex + 1;
  if (nextIndex >= campaignDef.sequence.length) {
    return { ...campaign, sequenceIndex: nextIndex, phase: CampaignPhase.Complete };
  }
  const nextNode = campaignDef.sequence[nextIndex];
  return {
    ...campaign,
    sequenceIndex: nextIndex,
    phase: nodeToPhase(nextNode),
    currentBattle: findCurrentBattle(campaignDef, nextIndex),
  };
}

// Get the current node
export function getCurrentNode(campaign: CampaignState, campaignDef: CampaignDef): CampaignNode | null {
  return campaignDef.sequence[campaign.sequenceIndex] ?? null;
}

// Get camp config for a camp node
export function getCampConfig(campId: string, campaignDef: CampaignDef): CampConfig | null {
  return campaignDef.camps[campId] ?? null;
}

// Check if current node is the last one
export function isLastNode(campaign: CampaignState, campaignDef: CampaignDef): boolean {
  return campaign.sequenceIndex >= campaignDef.sequence.length - 1;
}

// Increment battlesCompleted (call after a battle victory)
export function recordBattleVictory(campaign: CampaignState): CampaignState {
  return { ...campaign, battlesCompleted: campaign.battlesCompleted + 1 };
}
```

Keep `replaceDeadNPCs` as-is — it doesn't depend on sequence structure.

Remove old functions: `advanceToPostBattle`, `advanceToInterlude`, `advanceToPreBattleCamp`, `isLastBattle`, `getNextBattleEntry`, `getCurrentBattleEntry`, `getCurrentInterlude`.

**Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: Errors in files importing removed functions. Fixed in next tasks.

---

### Task 5: Update game loop transitions

**Files:**
- Modify: `src/core/gameLoop.ts`
- Modify: `src/core/camp.ts`

**Step 1: Update createCampState to take CampConfig**

In `src/core/camp.ts`, change the `createCampState` function to accept the campaign-level `CampConfig`:

```typescript
import type { CampConfig } from '../data/campaigns/types';

export function createCampState(
  player: PlayerCharacter,
  npcs: NPC[],
  config: CampConfig,
): CampState {
  const conditions: CampConditions = {
    weather: config.weather,
    supplyLevel: config.supplyLevel,
    campMorale: 'steady',
    location: config.title,
  };

  return {
    day: 1,
    actionsTotal: config.actionsTotal,
    actionsRemaining: config.actionsTotal,
    conditions,
    log: config.openingNarrative ? [{
      day: 1,
      text: config.openingNarrative,
      type: 'narrative',
    }] : [],
    completedActivities: [],
    triggeredEvents: [],
    health: player.health,
    stamina: player.stamina,
    morale: player.morale,
    batheCooldown: 0,
    prayedThisCamp: false,
    campId: config.id,
  };
}
```

Remove the `import { RIVOLI_CAMP_META }` — no more hardcoded references.

**Step 2: Simplify game loop transitions**

In `src/core/gameLoop.ts`, replace the multiple transition functions with a unified approach:

- `transitionToPostBattleCamp(gameState)` → becomes `advanceToNextNode(gameState)` (generic). It handles syncing battle results, replacing dead NPCs, then advancing the sequence. If the next node is a camp, it creates the camp state from config.
- `transitionToInterlude(gameState)` → also just `advanceToNextNode(gameState)`. Clears camp state, advances sequence.
- `transitionToNextBattle(gameState)` → also `advanceToNextNode(gameState)`. If next node is a battle, creates battle state. If unimplemented, skip to Complete.

Actually, a cleaner approach: one function `advanceToNextNode(gameState)` that:
1. Advances `campaign.sequenceIndex` via `advanceSequence()`
2. Reads the new current node
3. If `camp` → creates CampState from config, sets `gameState.phase = GamePhase.Camp`
4. If `battle` → checks if implemented, creates BattleState or skips to Complete
5. If `interlude` → clears campState/battleState, sets campaign phase
6. If past end → sets Complete

Keep `transitionToBattle(gameState)` for the camp→battle transition (already exists, called from "March to Battle").

Keep battle-result syncing in a separate `handleBattleVictory(gameState)` function called from `advanceCampaign`.

**Step 3: Update createNewGame**

`createNewGame()` initializes the campaign at `sequenceIndex: 0`, then reads the first node. If it's an interlude (the prologue), the campaign phase is Interlude. AppRoot routes to InterludePage.

**Step 4: Verify**

Run: `npx tsc --noEmit`

---

### Task 6: Update game store actions

**Files:**
- Modify: `src/stores/gameStore.ts`

**Step 1: Simplify campaign actions**

Replace the three separate actions with a unified pattern:

```typescript
// Called from BattleOverScreen after victory
advanceCampaign: () => {
  // Sync battle results, replace dead NPCs, then advance to next node
  handleBattleVictory(gameState);
  advanceToNextNode(gameState);
  saveGame(gameState);
  set({ gameState: { ...gameState }, phase: gameState.phase });
}

// Called from "March On"/"March to Battle" in CampPage and from InterludePage "Continue"
advanceToNext: () => {
  advanceToNextNode(gameState);
  saveGame(gameState);
  set({ gameState: { ...gameState }, phase: gameState.phase });
}
```

Remove `continueToInterlude`, `continueToNextBattle`, `isLastBattle`. Replace with `advanceToNext`.

**Step 2: Verify**

Run: `npx tsc --noEmit`

---

### Task 7: Update CampPage to read config from campaign

**Files:**
- Modify: `src/pages/CampPage.tsx`

This is the biggest change. CampPage becomes generic:

**Step 1: Remove all hardcoded event logic**

Remove:
- The `isPostBattle` flag (line 119)
- The `PROLOGUE_BEATS` constant and prologue effect (lines 152-174) — prologue is now an interlude node
- The hardcoded scripted event triggers (lines 178-212)
- The `handleNightBefore` function
- The `NIGHT_BEFORE_TEXT` constant
- The `campIntroSeen` UI store dependency (no longer needed — prologue is a separate page)
- Imports of `getCampfiresEvent`, `getBriefingEvent`, `getBonaparteEvent` from preBattleCamp

**Step 2: Add config-driven forced event logic**

Read the camp config:
```typescript
const campConfig = useMemo(() => {
  if (!gameState?.campaign) return null;
  const def = getCampaignDef(gameState.campaign.campaignId);
  const node = getCurrentNode(gameState.campaign, def);
  if (!node || node.type !== 'camp') return null;
  return def.camps[node.campId] ?? null;
}, [gameState?.campaign]);
```

Replace the hardcoded event triggers with a generic loop:
```typescript
useEffect(() => {
  if (!camp || !campConfig || !gameState) return;
  if (camp.pendingEvent) return;
  if (cinematic.cinematicConfig || cinematic.splashText) return;

  // Check forced events from config
  for (const fe of campConfig.forcedEvents) {
    if (camp.actionsRemaining <= fe.triggerAt && !camp.triggeredEvents.includes(fe.id)) {
      const event = fe.getEvent(camp, gameState.player);
      camp.pendingEvent = event;
      camp.triggeredEvents.push(fe.id);
      camp.log.push({ day: camp.day, text: event.narrative, type: 'event' });
      saveGame(gameState);
      forceUpdate();
      return;
    }
  }
}, [camp?.actionsRemaining, camp?.pendingEvent, campConfig]);
```

**Step 3: Update event resolution**

When resolving a pending event choice, use the camp config to find the `resolveChoice` function:
```typescript
function handleCampEventChoice(choiceId: string) {
  if (!gameState || !campConfig || !camp?.pendingEvent) return;

  const eventId = camp.pendingEvent.id;
  const fe = campConfig.forcedEvents.find(f => f.id === eventId)
    ?? campConfig.randomEvents.find(r => r.id === eventId);

  if (fe) {
    const result = fe.resolveChoice(camp, gameState.player, choiceId);
    // Apply result (same logic as current resolveCampEventAction)
    ...
  }
}
```

**Step 4: Unify the march button**

The "March On" / "March to Battle" distinction goes away. It's always just "Continue" or "March On" — advancing to the next node:
```typescript
const handleMarch = useCallback(() => {
  useGameStore.getState().advanceToNext();
}, []);
```

The button label can come from the camp config or be derived from what the next node is.

**Step 5: Verify**

Run: `npx tsc --noEmit && npx vitest run`

---

### Task 8: Update AppRoot routing

**Files:**
- Modify: `src/AppRoot.tsx`

**Step 1: Route based on campaign phase**

The simplified CampaignPhase enum (Camp, Battle, Interlude, Complete) maps cleanly:

```typescript
// Campaign-level routing
if (campaign?.phase === CampaignPhase.Complete) return <CampaignCompletePage />;
if (campaign?.phase === CampaignPhase.Interlude) return <InterludePage />;
if (campaign?.phase === CampaignPhase.Camp) return <CampPage />;
// Otherwise: battle routing (existing)
```

Remove checks for `CampaignPhase.Prologue`, `PreBattleCamp`, `PostBattleCamp`.

**Step 2: Update InterludePage**

`InterludePage` needs to look up its interlude by the current node's `interludeId` instead of deriving it from battle pairs:

```typescript
const node = getCurrentNode(campaign, campaignDef);
if (node?.type === 'interlude') {
  const interlude = campaignDef.interludes[node.interludeId];
  // Use interlude.splashText, interlude.narrative
}
```

The "Continue" / "Complete Campaign" button calls `advanceToNext()`.

**Step 3: Verify**

Run: `npx tsc --noEmit && npx vitest run`

---

### Task 9: Save migration v0.4.0 → v0.5.0

**Files:**
- Modify: `src/core/persistence.ts`

**Step 1: Add migration**

```typescript
const SAVE_VERSION = '0.5.0';
const COMPATIBLE_VERSIONS = ['0.3.0', '0.4.0', '0.5.0'];
```

In `loadGame()`, add v0.4.0 → v0.5.0 migration after the existing v0.3.0 migration:

```typescript
if (saveData.version === '0.4.0') {
  const campaign = saveData.gameState.campaign as Record<string, unknown>;
  const battleIndex = campaign.battleIndex as number ?? 4;

  // Map old battleIndex to sequenceIndex
  // Italy sequence: [interlude:prologue, camp:eve-of-rivoli, battle:rivoli, camp:after-rivoli, interlude:rivoli-mantua, battle:mantua]
  // Old battleIndex 4 (rivoli) → sequenceIndex depends on campaign phase
  const oldPhase = campaign.phase as string;
  let sequenceIndex = 0;
  if (oldPhase === 'pre_battle_camp' || oldPhase === 'prologue') {
    sequenceIndex = 1; // camp:eve-of-rivoli
  } else if (oldPhase === 'battle') {
    sequenceIndex = 2; // battle:rivoli
  } else if (oldPhase === 'post_battle_camp') {
    sequenceIndex = 3; // camp:after-rivoli
  } else if (oldPhase === 'interlude') {
    sequenceIndex = 4; // interlude:rivoli-mantua
  } else if (oldPhase === 'complete') {
    sequenceIndex = 6; // past end
  }

  campaign.sequenceIndex = sequenceIndex;
  delete campaign.battleIndex;

  // Map old CampaignPhase to new
  if (oldPhase === 'prologue' || oldPhase === 'pre_battle_camp' || oldPhase === 'post_battle_camp') {
    campaign.phase = 'camp';
  }
  // 'battle', 'interlude', 'complete' stay the same

  // Update CampState context → campId
  const campState = saveData.gameState.campState as Record<string, unknown> | undefined;
  if (campState) {
    if (oldPhase === 'post_battle_camp') {
      campState.campId = 'after-rivoli';
    } else {
      campState.campId = 'eve-of-rivoli';
    }
    delete campState.context;
  }

  saveData.version = '0.5.0';
  localStorage.setItem(saveKey(), JSON.stringify(saveData));
}
```

**Step 2: Verify**

Run: `npx tsc --noEmit && npx vitest run`

---

### Task 10: Fix all remaining type errors and update tests

**Files:**
- Modify: `src/__tests__/core/campaign.test.ts`
- Modify: `src/__tests__/core/gameLoop.test.ts`
- Modify: `src/__tests__/core/persistence.test.ts`
- Modify: `src/__tests__/helpers/mockFactories.ts`
- Modify: `src/__tests__/components/BattleOverScreen.test.tsx`
- Modify: `src/__tests__/pages/InterludePage.test.tsx`
- Modify: `src/__tests__/pages/CampaignCompletePage.test.tsx`
- Modify: `src/testScreen.ts`
- Modify: `src/components/overlays/BattleOverScreen.tsx` (if needed)
- Modify: `src/pages/LinePage.tsx`, `MeleePage.tsx`, `StoryBeatPage.tsx` (if store actions renamed)

**Step 1: Update mockFactories**

In `src/__tests__/helpers/mockFactories.ts`, update `mockGameState()` to use new fields:
```typescript
campaign: {
  campaignId: 'italy',
  sequenceIndex: 2,  // was: battleIndex: 4
  phase: CampaignPhase.Battle,  // new enum value
  battlesCompleted: 0,
  currentBattle: 'rivoli',
  nextBattle: '',
  daysInCampaign: 0,
  npcDeaths: [],
  replacementsUsed: [],
},
```

**Step 2: Rewrite campaign.test.ts**

Update all tests for the new function signatures:
- `createCampaignState(campaignDef)` → verify `sequenceIndex: 0`
- `advanceSequence(campaign, campaignDef)` → test advancing through each node type
- `getCurrentNode()`, `getCampConfig()`, `isLastNode()`
- `recordBattleVictory()`
- Keep `replaceDeadNPCs` tests as-is

**Step 3: Update gameLoop.test.ts**

Fix tests that reference `battleIndex`, `transitionToPostBattleCamp`, `transitionToInterlude`, `transitionToNextBattle`.

**Step 4: Update persistence.test.ts**

- Update version checks to `'0.5.0'`
- Add v0.4.0 → v0.5.0 migration test
- Keep v0.3.0 migration test (now migrates through 0.3.0 → 0.4.0 → 0.5.0)

**Step 5: Update BattleOverScreen tests and component**

If `advanceCampaign` was renamed, update the prop and its callers.

**Step 6: Update InterludePage and CampaignCompletePage tests**

Update to use new campaign state fields.

**Step 7: Update testScreen.ts**

Fix campaign state in the DevTools test screen helper.

**Step 8: Verify everything passes**

Run: `npx tsc --noEmit && npm run build && npx vitest run`
Expected: All 639+ tests passing, no type errors, build succeeds.

---

### Task 11: Cleanup and dead code removal

**Files:**
- Modify: `src/core/preBattleCamp.ts` — remove unused exports if CampPage no longer calls them directly
- Modify: `src/pages/CampPage.tsx` — remove `campIntroSeen` from `useUiStore` if no longer needed
- Modify: `src/stores/uiStore.ts` — remove `campIntroSeen` state if fully unused
- Run: `npx knip` to find dead code

**Step 1: Remove campIntroSeen from UI store**

If the prologue is now an interlude node and CampPage no longer checks `campIntroSeen`, remove it from the UI store entirely.

**Step 2: Clean up preBattleCamp.ts**

The forced event functions (`getCampfiresEvent`, etc.) are now called from the config entries in `rivoli/camp.ts`. Check if `preBattleCamp.ts` still exports anything used directly, or if it can be simplified.

**Step 3: Run dead code check**

Run: `npx knip`
Fix any legitimate findings.

**Step 4: Final verification**

Run: `npx tsc --noEmit && npm run build && npx vitest run`
Target: 645+ tests, all passing.

---

### Task 12: E2E verification

**Step 1: Start dev server**

Run: `npm run dev`

**Step 2: Playwright walkthrough**

1. New Game → should go to prologue **interlude** (not camp prologue)
2. Click through prologue narrative → arrives at eve-of-rivoli **camp**
3. Verify camp title: "Rivoli Plateau — Eve of Battle"
4. Verify forced events fire at correct thresholds (10, 7, 3, 1 actions remaining)
5. Force victory via DevTools → verify advance to after-rivoli **camp**
6. Verify camp title: "Camp — After the Battle"
7. Verify no pre-battle events fire, "March On" button visible
8. Click March On → verify interlude (rivoli-mantua) plays
9. Click Continue → verify next battle (mantua) or campaign complete
10. Verify save/load preserves sequence state
