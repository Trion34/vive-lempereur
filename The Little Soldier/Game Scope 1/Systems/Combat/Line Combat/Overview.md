# Line Combat

> System design document for the line battle phase — the core gameplay loop where the player stands in formation and exchanges volleys with the enemy.

## Current State (as of Feb 2026)

### How It Works Today
- **All line combat is cinematic auto-play** — volleys resolve automatically with animations
- Player clicks "Begin" and watches volleys play out with valor checks, fire resolution, scripted events
- **4 drill steps per volley:** PRESENT → FIRE → ENDURE → LOAD
- Each step has animations, narrative text, and mechanical rolls (valor, line integrity, fire accuracy)
- Story beats interrupt between volley groups (Wounded Sergeant after V2, Melee Transition after V4)

### Rank-Agency System (implemented for 5 ranks, expanding to 7)
- **Current game code:** 5 ranks in `MilitaryRank` enum (Private, Corporal, Sergeant, Lieutenant, Captain)
- **Design target:** 7 ranks across 3 visual tiers (see lab's `LabRank` type):

| Tier | Rank | French | Agency |
|------|------|--------|--------|
| 1 — In the Ranks | **Private** | Soldat | No agency — pure auto-play |
| 1 — In the Ranks | **Corporal** | Caporal | Squad choices — fire & endure |
| 2 — Behind the Line | **Sergeant** | Sergent | Fire direction, line dressing |
| 2 — Behind the Line | **Sgt-Major** | Sergent-major | Senior company NCO — full endure/load |
| 3 — The Field | **Sous-lieutenant** | Sous-lieutenant | Platoon command — movement orders |
| 3 — The Field | **Lieutenant** | Lieutenant | Broader tactical control |
| 3 — The Field | **Captain** | Capitaine | Full company command |

- 21 `LineActionId` values across 4 tiers (Corporal through Captain) — actions for Sgt-Major and Sous-lieutenant to be defined
- Core logic in `src/core/volleys/rankActions.ts`, `src/core/volleys/volleySteps.ts`
- UI currently shows compact name-only buttons — **placeholder, needs full redesign**

### Battle Parts
| Part | Volleys | Paces | Notes |
|------|---------|-------|-------|
| Part 1 | V1-V4 | 120→80→50→25 | Melee after V4 |
| Part 2 | V5-V7 | 100→60→40 | Fresh Austrian column |
| Part 3 | V8-V11 | Gorge | No ENDURE, target selection |

### Key Files
| File | Purpose |
|------|---------|
| `src/core/volleys/index.ts` | Volley resolution (resolveAutoVolley, resolveScriptedFire, etc.) |
| `src/core/volleys/actions.ts` | Available actions per drill step |
| `src/core/volleys/rankActions.ts` | Rank-gated action definitions |
| `src/core/volleys/volleySteps.ts` | Per-step resolution with rank actions |
| `src/components/line/useAutoPlay.ts` | Auto-play loop + ranked pause/resume |
| `src/components/line/BattlefieldView.tsx` | Visual battlefield component |
| `src/pages/LinePage.tsx` | Main line battle page |
| `src/pages/LineSandboxPage.tsx` | Sandbox for testing |

---

## Overhaul Goals

> *What do we want line combat to FEEL like? What's broken or missing?*

### Questions to Resolve
- [ ] What decisions should each rank actually make? (Current 21 actions — right scope?)
- [ ] How should the UI present choices? (Buttons? Cards? Radial menu? Inline prompts?)
- [ ] How much should auto-play still exist at higher ranks? (Full control vs guided choices?)
- [ ] What visual feedback matters? (Battlefield view, formation display, casualty tracking?)
- [ ] Should the drill step cadence change? (Always 4 steps, or variable by situation?)
- [ ] How does the sandbox relate to the main game? (Testing ground? Replayable mode?)

---

## Design Decisions

> *Record decisions as we make them.*

### 1. Build Captain-first, then scale down
- Design and implement the full-agency Captain experience first
- Then remove/simplify choices for lower ranks (Captain → Lieutenant → Sergeant → Corporal → Private)
- Private remains pure auto-play (cinematic, no choices)

### 2. Turn-based combat between formations
- Moving toward an "arcadey" turn-based system between troop formations
- Not a realistic simulation — it's a game about making tactical decisions under pressure
- Each side is a formation (not individual soldiers), exchanging volleys

### 3. Sandbox baseline: matched line formations
- Both sides deploy in identical 3-rank line formation (120 files × 3 ranks = 360 men)
- Company-scale — Captain commands a company
- `BattlefieldView` accepts optional `formations` prop; defaults to historical Rivoli (200×3 line vs 40×80 column)
- Sandbox passes `{ french: { cols: 120, rows: 3 }, austrian: { cols: 120, rows: 3 } }`

### 4. Multi-formation engagement (3v3)
- Up to 3 formations per side, resolved simultaneously each volley cycle
- Player is attached to ONE formation — their meters (HP, morale, stamina, fatigue) are at risk
- Rank determines agency over the player's formation only — other formations are always NPC-controlled
- See full design below

---

## Multi-Formation Engagement System

> The line battle is a turn-based engagement between up to 3 formations per side. Each turn is one volley cycle. The player is a soldier inside one formation — they experience the battle personally, and at higher ranks, they command their formation's actions.

### Formation State

Each formation (French and Austrian) tracks:

| Field | Type | Notes |
|-------|------|-------|
| `strength` | 0–100 | Men remaining (percentage). 0 = destroyed. |
| `integrity` | 0–100 | Cohesion — how dressed/ordered the line is. Degrades under fire. |
| `morale` | enum | `resolute` / `steady` / `shaken` / `wavering` / `routing` |
| `formation` | enum | `line` / `column` / `square` / `skirmish` |
| `status` | enum | `active` / `routing` / `destroyed` |
| `musketLoaded` | bool | Formation-level loaded state |
| `range` | number | Distance to opposing formation (paces) |

**Initial simplified version:** All 6 formations start identical — 100 strength, 100 integrity, `steady` morale, `line` formation, 120 range, muskets loaded.

### Targeting (Pairing)

Each formation is paired with the formation directly across:
```
FR-1  ←→  AT-1
FR-2  ←→  AT-2
FR-3  ←→  AT-3
```

Paired formations fire at each other by default. If one formation is destroyed, its opponent can **redirect fire** to an adjacent enemy (flanking — future feature, not in initial version).

**Future:** Rank actions could allow redirecting fire to a different target (crossfire).

### Turn Structure (One Volley Cycle)

Each turn follows the existing drill step cadence, but applied across ALL formations simultaneously:

```
1. COMMAND PHASE (new)
   - Player's formation: rank-gated choices (if rank allows)
   - NPC formations: auto-select actions (AI)
   - All decisions locked before resolution begins

2. PRESENT
   - All formations present arms
   - Fire modifiers set (concentration, spread, hold, etc.)
   - Range modifiers applied (advance/hold/fall back)

3. FIRE
   - All formations fire simultaneously
   - Damage calculated per pair (FR-1 hits AT-1, AT-1 hits FR-1)
   - Results: strength loss, integrity loss on targets

4. ENDURE
   - Morale checks per formation (based on damage taken)
   - Player's formation: personal damage roll (see Damage Model)
   - Player valor roll
   - Routing checks — formations that break begin routing

5. LOAD
   - Musket reload (auto or rank-gated double-time)
   - Minor morale recovery
   - Austrian range closes (all formations advance together)
```

All formations resolve each step together before moving to the next step. This preserves the existing drill step rhythm while scaling to 6 formations.

### Damage Model (Formation → Player)

When the player's formation takes damage, the player is personally at risk. This is what makes line combat feel dangerous at every rank.

**Formation damage per volley:**
- Opposing formation fires → `strengthLoss` calculated from fire accuracy, range, formation type modifiers
- `integrityLoss` from disruption (near-misses, noise, casualties in the file)
- Both applied to the player's formation state

**Personal damage (player only):**
After formation damage is calculated, roll for personal impact:

```
hitChance = (strengthLoss × 2) + frontRankBonus
  - strengthLoss 5% → 10% personal hit chance
  - strengthLoss 10% → 20% personal hit chance
  - frontRank adds +15%

If hit:
  - HP loss: 15–40 (scaled by enemy quality and range)
  - Morale loss: 5–15 (seeing comrades fall)
  - Stamina loss: 5–10 (physical stress of combat)

If not hit:
  - Morale loss: 2–8 (still under fire, still terrifying)
  - Stamina loss: 2–5 (fatigue of standing in the line)
```

**Key principle:** Even if you're not personally hit, being in a formation under fire costs morale and stamina every single volley. The line wears you down.

### NPC Formation AI

NPC formations (all allied French + all Austrian) auto-resolve using simple rules:

**French NPC AI:**
- Always fire (never hold)
- Spread fire (never concentrate — they're not creative)
- Hold position (never advance/fall back independently)
- Close ranks if integrity < 50

**Austrian NPC AI:**
- Always fire, always advance
- Quality determines accuracy and morale resilience
- Advance rate: all 3 Austrian formations close range together (shared range)

**Future:** Austrian formations could have independent AI (one advances aggressively, one hangs back, one tries to flank). For now, they're a unified wall.

### Win/Loss Conditions

**French victory:** All 3 Austrian formations routing or destroyed.
**French defeat:** All 3 French formations routing or destroyed.
**Player death:** Player HP reaches 0 (triggers Grace check if available).
**Player rout:** Player morale reaches 0 — player routes with their formation even if others stand.

**Partial outcomes:** If 1-2 formations on either side break, the battle continues with survivors. A formation that routs is removed from play — its pair becomes free to redirect fire.

### Rank-Agency Hooks

The player only ever commands their OWN formation. Rank determines what choices they get:

| Tier | Rank | What You Decide | What Auto-Resolves |
|------|------|----------------|-------------------|
| 1 | **Private** | Nothing | Everything — you stand, fire, endure |
| 1 | **Corporal** | Personal fire mode (aimed/volley), personal endure (steady/duck) | Formation-level decisions |
| 2 | **Sergeant** | Formation fire direction (concentrate/spread/hold), load tempo (double-time) | Movement, formation changes |
| 2 | **Sgt-Major** | + Close ranks, full endure/load control | Movement, formation changes |
| 3 | **Sous-lieutenant** | + Movement orders (advance/hold/fall back), refuse flank | Fire discipline, formation type changes |
| 3 | **Lieutenant** | + Broader movement control, tactical flexibility | Formation type changes |
| 3 | **Captain** | + Fire discipline (by rank/at will/hold-hold), drums, bayonets, support requests | Nothing — full control of your formation |

**The other 2 French formations ALWAYS auto-resolve**, regardless of player rank. You are a company commander at most — not a general.

### What This Means for Existing Code

The current volley resolution system (`resolveAutoVolley`, `resolveScriptedFire`, etc.) resolves ONE formation's volley. The multi-formation system wraps this:

```
for each volley cycle:
  for each active pair (FR-n ↔ AT-n):
    resolve volley for this pair
    if pair includes player's formation:
      apply rank actions + personal damage
    else:
      auto-resolve both sides
```

Most existing volley logic can be reused — it just runs 3 times per cycle instead of once. The new code is:
1. `EngagementState` — holds 3 French + 3 Austrian `FormationState` objects
2. `resolveEngagementVolley()` — loops through pairs, calls existing resolvers
3. `rollPersonalDamage()` — translates formation hits to player meter damage
4. NPC AI action selection

### Visual Tiers (Battlefield Lab)

The SVG battlefield view changes based on rank tier:

| Tier | Ranks | View | Status |
|------|-------|------|--------|
| Tier 1 — "In the Ranks" | Private, Corporal | Soldier's-eye POV (raster bg + SVG overlay) | Deferred — needs AI-generated background |
| Tier 2 — "Behind the Line" | Sergeant, Sgt-Major | Wider formation view, gaps visible | Not started |
| **Tier 3 — "The Field"** | Sous-lt, Lieutenant, Captain | **Top-down 3v3 formation view** | **Working in lab (MultiBattlefieldView)** |

**Tier 3 is the development priority** — it's the command view, it works in SVG, and it's the right perspective for designing the system. Tiers 1 and 2 are presentation layers added later.

### Note on 7-Rank Design Target

The lab uses a 7-rank ladder (adding Sergeant-Major and Sous-lieutenant to the current 5). The game's `MilitaryRank` enum will be updated to match when the lab work merges into the game. For now, the lab defines its own `LabRank` type independently.

---

## Implementation Plan

> Build in the lab first, merge into game when stable.

### Phase 1: Multi-Formation State & Loop
- [ ] Define `FormationState` and `EngagementState` types
- [ ] `resolveEngagementVolley()` — loop through 3 pairs, auto-resolve all
- [ ] Wire to lab: "Start Auto-Play" runs the loop, SVG updates per volley
- [ ] All formations identical, all auto-resolve (no player agency yet)

### Phase 2: Player Attachment & Personal Damage
- [ ] Player is attached to one formation (already have `playerFormationIndex`)
- [ ] `rollPersonalDamage()` — formation damage flows to player HP/morale/stamina
- [ ] Player meters visible in lab sidebar
- [ ] Player can die / route — battle-over condition

### Phase 3: Captain-Level Agency
- [ ] Wire rank actions to player's formation during volley cycle
- [ ] COMMAND phase UI — present choices, pause for input
- [ ] Captain gets full formation control (existing 21 actions, adapted for multi-formation context)
- [ ] Other formations still auto-resolve

### Phase 4: Scale Down Ranks
- [ ] Lieutenant: broader tactical control, movement + some fire decisions
- [ ] Sous-lieutenant: movement orders only (advance/hold/fall back, refuse flank)
- [ ] Sgt-Major: full endure/load control, close ranks
- [ ] Sergeant: fire direction (concentrate/spread/hold), double-time
- [ ] Corporal: personal choices only (aimed/volley, steady/duck)
- [ ] Private: pure auto-play, just watch and survive

### Phase 5: Merge to Game
- [ ] Update `MilitaryRank` enum to 7 ranks
- [ ] Replace single-formation `BattleState` with `EngagementState`
- [ ] Wire `useAutoPlay` to multi-formation loop
- [ ] Adapt story beats to multi-formation context
- [ ] Tier 3 view becomes the default line combat view
