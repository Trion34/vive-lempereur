# Line Combat System — Ground-Up Roadmap

## Context

The battlefield lab has a working 3v3 engagement engine with turn-based resolution, formation orders, crossfire, morale, and Austrian AI. The Obsidian design docs lay out a vision for a full rank-gated tactical combat system where the player stands inside a formation and commands it (at high ranks) or just survives (at low ranks).

This roadmap is the step-by-step plan for building from the current lab foundation to a complete, mergeable line combat system.

**Core design principle:** Build Captain-first, then scale down. The player only ever commands their OWN formation — the other 2 French always auto-resolve.

**Constraint:** Steps 1-5 are lab-only (`battlefield-lab/src/`). Step 6 merges to `src/`.

---

## The Foundation (Built)

Already working in `battlefield-lab/src/engagement.ts` + `Lab.tsx`:

- 3v3 engagement (3 French vs 3 Austrian formations)
- Turn-based resolution (French fires first, then Austrian)
- 5 orders: Fire, Hold Fire, Crossfire, Advance, Fall Back
- 4 formation profiles: Line/Column/Square/Skirmish with combat modifiers
- Independent morale: 0-100 meter with 5 grades, cascading rout
- Austrian AI: 4 doctrines
- Per-formation range offsets
- First Fire bonus + Column charge bonus
- SVG battlefield with strength/morale display
- Manual order selection + auto-play mode

---

## Step 1: Drill Step Cadence

**Goal:** Break the monolithic `resolveEngagementVolley()` into 5 discrete drill steps. This is the structural prerequisite for rank-gated agency — you can't pause for player input if there's only one resolution step.

### The 5 Steps

| Step        | What Happens                                     |
| ----------- | ------------------------------------------------ |
| **COMMAND** | Both sides lock in orders (player or AI)         |
| **PRESENT** | Apply fire modifiers, validate targets           |
| **FIRE**    | Resolve damage (French first, then Austrian)     |
| **ENDURE**  | Morale checks, routing, cascade, personal damage |
| **LOAD**    | Musket reload, integrity recovery                |

### Implementation

- Split `resolveEngagementVolley()` into 5 functions: `resolveCommand()`, `resolvePresent()`, `resolveFire()`, `resolveEndure()`, `resolveLoad()`
- Keep the wrapper that calls all 5 sequentially — "Execute Volley" still runs one full cycle
- Existing logic redistributes across steps (fire formula -> FIRE, morale update -> ENDURE, reload -> LOAD)
- Show current drill step in the engagement status panel

### Files

- `battlefield-lab/src/engagement.ts` — split resolution
- `battlefield-lab/src/Lab.tsx` — step indicator in UI

### Done When

- Auto-play produces identical results to current system
- Manual Execute Volley works unchanged
- Step indicator visible in engagement panel

---

## Step 2: Player Attachment & Personal Damage

**Goal:** Put the player inside a formation. When that formation takes hits, the player is personally at risk. This is what makes line combat dangerous and tense at every rank.

### Personal Damage Model

```
hitChance = (strengthLoss x 2) + frontRankBonus(+15%)

If hit:   HP -15 to -40, Morale -5 to -15, Stamina -5 to -10
If not:   Morale -2 to -8, Stamina -2 to -5
```

Even if not personally hit, standing under fire always costs morale and stamina.

### Implementation

- `PlayerLineState` on EngagementState: HP, morale, stamina, fatigue, frontRank, alive
- `rollPersonalDamage()` runs during the ENDURE step for the player's formation
- Player can die (HP=0) or rout (morale=0) -> battle-over
- Grace check: if player has grace, intercept death
- `playerFormationIndex` already exists in Lab.tsx — wire it to the engagement

### Lab UI

- Player meters panel (HP bar, Morale bar, Stamina bar) below the battlefield
- Player's formation highlighted (already has `.player` class)
- Battle-over state when player dies/routes

### Files

- `battlefield-lab/src/engagement.ts` — PlayerLineState, rollPersonalDamage(), ENDURE integration
- `battlefield-lab/src/Lab.tsx` — meters display, battle-over overlay

### Done When

- Player takes damage proportional to their formation's casualties
- Player can die while formation survives (bad luck + front rank)
- Player can survive while formation breaks (good luck)
- HP/morale/stamina bars update each volley

---

## Step 3: Captain Agency

**Goal:** Wire the full-control Captain experience. Captain decides everything for their formation. Other formations auto-resolve.

### Captain's Decisions Per Volley

| Step | Decision | Options |
|------|----------|---------|
| COMMAND | **Formation Order** | Fire / Hold / Crossfire / Advance / Fall Back |
| PRESENT | **Fire Doctrine** | By Rank (accurate) / At Will (fast, sloppy) / Hold-Hold (devastating next volley) |
| ENDURE | **Rally** | Close Ranks (+integrity) / Presence (+morale) / Steady the Line (prevent rout) |
| LOAD | **Tempo** | Standard / Double-Time (faster, costs stamina) / Fix Bayonets (melee prep) |

### Implementation

- Captain gets 3 decision points per volley: COMMAND, PRESENT, LOAD
- ENDURE rally is reactive (only prompted if formation took casualties)
- Each step function checks rank -> if Captain, pause for input; otherwise auto-resolve
- NPC French formations always use simple AI (fire, hold position, close ranks if damaged)
- Volley flow becomes: Begin -> COMMAND prompt -> PRESENT prompt -> FIRE (auto) -> ENDURE prompt -> LOAD prompt -> done

### Lab UI

- Step-by-step volley flow with pause-at-each-decision
- Decision panel replaces the current "pick all orders then execute" flow
- "Waiting for orders..." state at each decision point
- When auto-play is on, Captain AI makes all decisions automatically

### Files

- `battlefield-lab/src/engagement.ts` — captain action types, step modifiers, decision resolution
- `battlefield-lab/src/Lab.tsx` — step-by-step UI flow, decision prompts

### Done When

- Captain can make all decisions each volley
- Hold-Hold Fire -> devastating double-hold bonus
- Fire doctrine affects accuracy/damage measurably
- Auto-play still works with Captain AI

---

## Step 4: Scale Down Ranks

**Goal:** Remove agency level by level. Each rank below Captain loses certain decisions.

### Rank -> Decision Map

| Rank | COMMAND | PRESENT | ENDURE | LOAD |
|------|---------|---------|--------|------|
| **Captain** | Full orders | Fire doctrine | Rally | Tempo, bayonets |
| **Lieutenant** | Full orders | Fire doctrine | — | — |
| **Sous-lt** | Movement only | — | — | — |
| **Sgt-Major** | — | — | Close Ranks | Double-Time |
| **Sergeant** | — | Concentrate/Spread/Hold | — | Double-Time |
| **Corporal** | — | Aimed/Volley (personal) | Steady/Duck (personal) | — |
| **Private** | — | — | — | — |

### Key Points

- **Private = pure auto-play** — no prompts, cinematic experience
- **Corporal = personal choices** — how YOU fire and endure, not the formation
- **Sergeant/Sgt-Major = formation support** — fire direction and load tempo
- **Lt/Sous-lt = movement agency** — advance, hold, or fall back
- **Captain = everything**

### Implementation

- Step functions check `playerRank` to decide whether to pause
- Corporal has small inline prompts (2 choices); Captain has full panels
- For ranks without COMMAND access, all 3 French formations get NPC AI orders
- The lab's rank selector (already built) gets wired to gate decisions

### Files

- `battlefield-lab/src/engagement.ts` — rank-aware resolution, personal vs formation actions
- `battlefield-lab/src/Lab.tsx` — conditional UI per rank

### Done When

- Private: no prompts, full auto-play
- Corporal: 2 small prompts per volley
- Captain: 3-4 full prompts per volley
- Switching rank mid-session changes agency immediately

---

## Step 5: Reform, Battle Log & Polish

**Goal:** Add formation changes mid-battle, a readable battle log, and visual polish.

### Reform Order

- New order: **Reform** — change formation type (e.g., Column -> Line)
- Costs one full volley (no fire, no movement)
- Integrity check: if < 50, 30% chance of disorder (stuck in transition, vulnerable)
- Captain-only (1796 exception: competent officers act on initiative)

### Battle Log

- Scrollable volley-by-volley history
- Per-volley: orders, damage, morale changes, routing events
- Collapsible entries (summary -> expand for detail)
- Helps understand what happened during auto-play

### SVG Polish

- Order indicators on formations (icon showing current order)
- Per-formation advance animation (independent movement, not all at once)
- Routed formations visually scatter/fade
- Crossfire arcs (visual line showing angled fire)
- Player formation distinct highlight

### Files

- `battlefield-lab/src/engagement.ts` — Reform order + validation
- `battlefield-lab/src/Lab.tsx` — battle log panel, reform UI
- `battlefield-lab/src/MultiBattlefieldView.tsx` — visual indicators, animations
- `battlefield-lab/src/lab.css` — log styles, new visual states

---

## Step 6: Merge to Game

**Goal:** Bring the lab system into the main codebase. Replace single-formation line combat.

### What Changes in `src/`

1. **Types**: `MilitaryRank` -> 7 ranks. Add `EngagementState` to game types.
2. **Core**: Move `engagement.ts` logic -> `src/core/engagement.ts`
3. **Volleys**: `useAutoPlay.ts` drives the multi-formation loop
4. **LinePage**: MultiBattlefieldView replaces single-formation view
5. **Story Beats**: Fire at scripted volley counts, apply to player's formation
6. **Battle Parts**: Part 1/2/3 all use engagement system
7. **Personal Damage**: PlayerCharacter meters <-> engagement PlayerLineState

### Migration Strategy

- Feature flag `useMultiFormation` on BattleState (default false)
- Run both systems in parallel during testing
- Once stable, remove old code and flag

---

## Sequencing

| Step | What | Depends On |
|------|------|-----------|
| 1 | Drill Step Cadence | Foundation |
| 2 | Player Attachment | Step 1 |
| 3 | Captain Agency | Steps 1-2 |
| 4 | Scale Down Ranks | Step 3 |
| 5 | Reform & Polish | Steps 1-4 |
| 6 | Merge to Game | Steps 1-5 |
