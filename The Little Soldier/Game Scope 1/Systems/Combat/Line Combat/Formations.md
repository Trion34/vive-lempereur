# Formations

> Research compilation for the line combat formation system. Sources: historical research (1791 Reglement, Italian Campaign accounts), game design analysis (Total War, C&C:N, Lasalle, Black Powder, Ultimate General), and project-specific context.

---

## Historical Formations (Napoleonic, 1796-97)

### 1. Line (Ligne)
- **Shape:** 3 ranks deep, shoulder-to-shoulder. A company of ~120 men spans ~80m. A battalion of ~600 spans ~150m.
- **Purpose:** Maximum firepower. Every musket fires. Standard firefight deployment.
- **Pros:** Full volley output, wide frontage, decent vs cavalry if steady.
- **Cons:** Slow to move, fragile flanks, hard to maintain on broken ground, needs trained troops.
- **At Rivoli:** The 14th's primary formation on the plateau. "14th Line refused its left flank" — a mid-battle line maneuver.

### 2. Column of Attack (Colonne d'Attaque)
- **Shape:** Companies stacked behind each other, 2 companies wide ("by divisions"), 30-50m deep. Stubby rectangle, not a thin snake.
- **Purpose:** Rapid movement + bayonet shock. Preceded by skirmishers and artillery.
- **Pros:** Fast, easy to maintain with raw troops, quick to form square (~30s), psychological impact.
- **Cons:** Only front companies fire (~15% firepower), devastated by artillery, degenerates into mob if front stalls.
- **At Rivoli:** French counterattacks delivered in column. Leclerc's brigade assaulted the gorge in column.

### 3. Square (Carre)
- **Shape:** Hollow rectangle, 3-6 ranks per face, bayonets out, officers/drums/colours inside. ~20m per side for a battalion.
- **Purpose:** Anti-cavalry. All-round defense. Horses won't charge steady bayonets.
- **Pros:** Virtually unbreakable by cavalry if troops hold nerve. Fire in all directions.
- **Cons:** Artillery magnet (dense, stationary). Terrible firepower in any one direction. Immobile. Collapses if one face breaks.
- **At Rivoli:** Less common due to mountainous terrain limiting cavalry. Austrian dragoons at the gorge were destroyed by canister before they could threaten infantry.
- **Key drama:** The Austrians on the plateau COULDN'T form square when French cavalry hit them — they'd lost cohesion on broken ground. That's why 26 chasseurs broke an entire battalion.

### 4. Open Order / Skirmish (Tirailleurs)
- **Shape:** Pairs of soldiers spread 5-10 paces apart across a wide front. 1/3 held in reserve behind the chain.
- **Purpose:** Screen, harass, disrupt. Pick off officers. Precede every French attack.
- **Pros:** Near-immune to artillery/volleys. Exploits terrain. Aimed fire. High mobility.
- **Cons:** Low volume of fire. Helpless vs cavalry. Can't hold ground vs formed infantry. Hard to control.
- **At Rivoli:** Extensive. French tirailleurs preceded every assault. Light demi-brigades fought in skirmish order. Even line battalions detached companies as skirmishers.
- **Captain's role:** Most autonomous command — captain has broad tactical discretion directing fire and movement.

### 5. Mixed Order (Ordre Mixte)
- **Shape:** Brigade-level: 1 battalion in line (center), 2 in column (flanks). Skirmishers forward.
- **Purpose:** Combines line firepower with column shock/flexibility. The French specialty.
- **Pros:** Fixes enemy with fire while columns maneuver. Columns can form square if cavalry appears. Accommodates mixed-quality troops.
- **Cons:** Requires coordination between battalion commanders. Complex in broken terrain.
- **At Rivoli:** Not yet formalized (first codified at Tagliamento, March 1797), but the *spirit* was there — some battalions in line, some in column, based on terrain and troop quality.
- **Note:** This is a BRIGADE/DIVISION level decision, above a captain's authority.

### 6. Refused Flank
- **Shape:** One end of the line bends backward at an angle, creating an L-shape.
- **Purpose:** Prevent encirclement when enemy threatens to get around your flank.
- **At Rivoli:** **Specifically documented for the 14th.** When hit from front and left simultaneously, the 14th refused its left flank. The captains of the leftmost companies physically wheeled their men into the new facing under fire.
- **Captain's role:** Direct. You execute the wheel. Your skill determines if it succeeds or becomes chaos.

### 7. Column of March (Colonne de Route)
- **Shape:** Narrow file, 1-2 platoons wide, battalion strung out 200-400m along a road.
- **Purpose:** Getting places. The only option through mountain passes.
- **Cons:** Completely helpless in combat. Long deployment time.
- **At Rivoli:** How everyone arrived. Massena's 140km forced march. Austrian columns through Monte Baldo. Quasdanovich through the Osteria gorge.

### 8. En Echelon
- **Shape:** Staggered diagonal line — each unit offset behind and to the side.
- **Purpose:** Sequential attacks that keep pressure without committing everything.
- **At Rivoli:** Napoleon's sequential strikes against individual Austrian columns are echelon attacks at the operational level.
- **Note:** General-level decision, not captain-level.

---

## What a Captain Controls vs. What He Doesn't

### Captain HAS authority over:
- **Fire discipline** — when to fire, by rank/file/at will, hold fire
- **Company alignment** — dressing/spacing within the battalion formation
- **Skirmish command** — full tactical discretion when detached as tirailleurs
- **Executing maneuvers** — refused flank wheel, forming his face of a square
- **Village fighting** — independent decisions about barricading, fields of fire, withdrawal
- **Crisis initiative** — filling gaps, rallying men, acting without orders when situation demands

### Captain does NOT control:
- Battalion formation choice (line/column/square) — chef de bataillon's decision
- Brigade tactical scheme (ordre mixte, echelon) — general's decision
- When to advance/retreat at battalion level

### The 1796-97 Exception:
Revolutionary armies were chronically short of trained officers. A competent captain who saw a threat and acted (refusing a flank, plugging a gap, ordering a charge) would be praised, not censured. **This aligns perfectly with the rank-agency system** — higher rank = more latitude.

---

## Drill Timings (1791 Reglement, ideal conditions)

| Transition | Time |
|---|---|
| Line → Square | ~100 seconds |
| Column → Square | ~30 seconds |
| Column → Line | ~60 seconds |
| Line → Column | ~45-60 seconds |
| March pace (ordinary) | 76 steps/min |
| March pace (accelerated) | 100 steps/min |
| Charge pace | 120 steps/min |

---

## Game Design Lessons (from other games)

### The Core Pattern: Rock-Paper-Scissors
- **Line** beats Column (firepower destroys narrow mass)
- **Column** beats hesitation (speed + shock breaks wavering defenders)
- **Square** beats Cavalry (impenetrable bayonets)
- **Cavalry** beats Line (flanking shock)
- **Artillery** beats Square (dense stationary target)

### What Makes Formation Decisions FUN (ranked by elegance)

1. **C&C: Napoleonics card cost** — Forming square costs a random command card, reducing future options. Simple, creates agonizing decisions. **Gold standard for turn-based.**
2. **Lasalle disruption interaction** — Fresh units change freely; battered units risk collapse. Formation change interacts with unit condition.
3. **General de Brigade command friction** — Must roll to change formation, can fail. Planning 2-3 turns ahead feels like real generalship.
4. **Black Powder order limits** — Line = 2 orders/turn, column = 3. The cost isn't switching — it's BEING in the formation.
5. **Ultimate General slider** — No discrete formations. Width = firepower, narrow = speed. Stamina drains faster when deployed wide.

### Key Design Principles
- **3-4 formation types maximum.** Beyond that, players can't feel the difference.
- **The COST of switching** is what creates drama, not the stat bonuses.
- **Formations must be reactive** — the best moments come when you're FORCED to change (cavalry incoming — do you form square and lose offensive capability?).
- **Tie effectiveness to unit condition** — fresh troops change crisply, battered troops risk collapse.
- **National flavor** — French bonus to column melee, Austrian reliance on linear tactics.

### What Makes Formations TEDIOUS
- Too many types with marginal differences
- Hidden math / invisible bonuses
- No reactive element (set and forget)
- Free/instant switching (no decision)

---

## Recommendation for The Little Soldier

### Core Formation Set (4 types)

| Formation | Visual Shape | Gameplay Identity |
|---|---|---|
| **Line** | Wide, thin (3 ranks) | Maximum firepower. Standard firefight. Vulnerable flanks. |
| **Column** | Narrow, deep | Fast movement, bayonet shock. Minimal firepower. Quick to form square. |
| **Square** | Hollow block | Anti-cavalry fortress. Immobile, artillery bait. Costs something precious to form. |
| **Skirmish** | Dispersed dots | Harass, screen, terrain exploitation. Helpless vs formed troops or cavalry. |

### Why These Four
- They cover every tactical situation at Rivoli
- Clear rock-paper-scissors relationships
- Each feels fundamentally different (not just stat tweaks)
- Historically accurate for 1796-97 French practice
- Captain-level: you'd execute line, column, square changes. Skirmish gives the most independent agency.

### Formations NOT included (and why)
- **Mixed Order** — brigade-level, above a captain. The GAME can use it for NPC formations.
- **Oblique Order** — army-level, Frederick the Great era. Not relevant at company scale.
- **En Echelon** — operational-level sequencing, not a company formation.
- **Refused Flank** — better modeled as a LINE MODIFIER (an action within line formation) than a separate formation type.
- **Column of March** — not a combat formation. Could be a movement mode between engagements.

### The Switching Cost Question
How should changing formation cost the player? Options from game research:

1. **Action cost** — changing formation consumes your turn (simple, proven)
2. **Stamina cost** — drill is exhausting; ties to the fatigue system we already have
3. **Disorder risk** — roll against drill/training; failure = temporary vulnerability (Lasalle model)
4. **Opportunity cost** — C&C model: spend a resource you need elsewhere
5. **Time exposure** — you're vulnerable DURING the change (Total War model, needs real-time element)

**Recommendation:** Combination of 1 + 2 — changing formation costs your turn AND stamina. Battered/exhausted troops should find it harder (longer or riskier). This leverages the existing fatigue system.
