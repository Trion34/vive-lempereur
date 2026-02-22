# SYSTEMS-RIVOLI — Battle of Rivoli (14 January 1797)

Detailed breakdown of the Battle of Rivoli as it plays in the prototype. This is the testbed battle — the one section of the game we're actively building and iterating on.

For universal game mechanics, see [SYSTEMS.md](SYSTEMS.md).

---

## Battle Flow

```
PROLOGUE (cinematic 5-beat intro, click-through)
  │
  ▼
PRE-BATTLE CAMP (Eve of Rivoli, 8 actions)
  │
  ▼
PART 1: THE LINE (auto-play, 4 volleys)
  ├── Volleys 1–2 (120 → 80 paces)
  ├── JB Crisis (auto-resolves at Volley 2)
  ├── WOUNDED SERGEANT story beat (3 choices)
  ├── Volleys 3–4 (50 → 25 paces)
  └── MELEE TRANSITION story beat
  │
  ▼
TERRAIN MELEE (sequential resolution, 4 opponents, max 12 exchanges)
  │
  ▼
BATTERY story beat (Charge / Hold Back)
  ├── If Charge: BATTERY MELEE (3 opponents, max 8 exchanges)
  └── If Hold Back: skip melee, reputation -5, -3 morale
  │
  ▼
MASSENA story beat (TendWounds / CheckComrades / FollowTheScreams)
  │
  ▼
PART 2: HOLD THE LINE (auto-play, 3 volleys)
  ├── Volleys 5–7 (100 → 60 → 40 paces)
  ├── Fresh enemy column
  └── Historical narration (Vukassovich, Pontare, Lusignan, Napoleon)
  │
  ▼
GORGE story beat (Napoleon's counterattack order)
  │
  ▼
PART 3: THE GORGE (auto-play, 4 volleys with target selection)
  ├── Volleys 8–11 (200 paces, one-sided)
  ├── Target selection each volley: Column / Officers / Wagon / Show Mercy
  ├── Wagon mechanic (cumulative damage → detonation at 100)
  └── No ENDURE step — no return fire
  │
  ▼
AFTERMATH story beat (HelpWounded / FindComrades / SitDown)
  │
  ▼
POST-BATTLE CAMP (6 actions)
  │
  ▼
NEXT BATTLE (Castiglione — not yet built)
```

---

## Prologue: The Battle of Rivoli

Uses the cinematic overlay system (`showCinematic()`) with typewriter text. Plays on first entering pre-battle camp.

- **Subtitle:** "Italy. January, 1797." (italic date card)
- **Chunk 1:** Campaign context — Montenotte, Lodi, Castiglione, Arcole
- **Chunk 2:** The threat — Alvinczi, 28,000 men, Mantua
- **Chunk 3:** The stakes — Joubert's division, 10k vs 28k, the plateau
- **Chunk 4:** The player — 14th demi-brigade, Bonaparte rides to take command, Masséna marches behind

Click to advance through chunks (click mid-typing to skip to full text). "Make Camp" choice button appears after the final chunk.

---

## Pre-Battle Camp: Eve of Rivoli

- **Actions:** 8 (flat pool, no day system)
- **Location:** Rivoli Plateau — Eve of Battle
- **Weather:** Cold. **Supplies:** Scarce.

### Activities (Umbrella Categories)

- **Rest** — Lay About / Bathe (cooldown 4) / Pray (once per camp)
- **Exercise** — Fatigue Duty (Str+End) / Wrestle (Str+Con) / Run (End+Con)
- **Arms Training** — Solo / Comrades (soldierRep ≥20) / Officers (officerRep ≥50)
- **Duties** — Drill / Check Equipment / Volunteer for Duty (random: sentry, scout, dispatches, dig) / Tend Wounded (locked)
- **Socialize** — Talk to NPC (placeholder) / Write a Letter (illiteracy message). Does not consume action.

### "The Night Before"

### Scripted Events (4, always fire)

| When | Event | Description |
|------|-------|-------------|
| 6 actions remaining | **Austrian Campfires** | Fog settles over plateau; dim orange ghosts of Austrian fires visible through murk. Steady the men [CHA] or count them [AWR]. |
| 4 actions remaining | **Officer's Briefing** | Leclerc briefs the company. Volunteer for front rank [VAL] or stay quiet. Front rank = +15% return fire in Part 1. |
| 2 actions remaining | **Night Before** | Campfire scene. Wind shifts, fog clears — thousands of Austrian fires revealed across Monte Baldo. |
| 1 action remaining | **Bonaparte Rides Past** | Napoleon arrives at midnight. Stand tall or keep your head down. |

### Random Events (40% chance after each activity, 3 in pool)

1. Pierre tells a story from a previous campaign
2. Short rations distributed
3. Jean-Baptiste confesses his fear

---

## Part 1: The Line (Volleys 1–4)

All auto-play. Orchestrated by `autoPlayPart1()` → `autoPlayVolleys(0, 1)` then `autoPlayVolleys(2, 3)`.

### Volley Definitions

| Volley | Range | Base Accuracy | Aim Bonus | Return Fire % | Return Fire Dmg | Enemy Line Dmg |
|--------|-------|--------------|-----------|---------------|----------------|----------------|
| 1 | 120 paces | 0.20 | 0.10 | 15% | 8–14 | 6 |
| 2 | 80 paces | 0.35 | 0.12 | 25% | 10–18 | 10 |
| 3 | 50 paces | 0.50 | 0.15 | 40% | 14–24 | 15 |
| 4 | 25 paces | 0.70 | 0.10 | 50% | 16–28 | 20 |

### Per-Volley Cycle

1. **PRESENT** — Volley banner, narrative cross-fade
2. **FIRE** — Captain's order, French volley animation, accuracy resolution
3. **ENDURE** — Austrian return fire animation, graduated valor roll (4-tier), perception check
4. **LOAD** — Load animation (4-step), fumbles auto-resolve
5. Line integrity roll (French vs Austrian)

### Mid-Part Events

- **Volley 2 — JB Crisis:** Auto-resolves based on `(charisma + valor) / 2`. Success: JB rallied. Failure: JB shaken.
- **After Volley 2 — Wounded Sergeant** (chargeEncounter=5):
  - **TakeCommand:** Valor check. Success: +3 valor, +10 line integrity, +1 Grace. Fail: +1 valor, +5 line integrity.
  - **RallyTheLine:** Charisma check. Success: +15 neighbour morale, +5 line integrity. Fail: +5 neighbour morale.
  - **KeepYourHead:** Safe option. +5 morale, +2 stamina.
- **After Volley 4 — Melee Transition** (chargeEncounter=6): "Fix bayonets" story beat.

---

## Terrain Melee

Sequential resolution. Player chooses stance, action, and body part each round. State mutations (health, stamina, death) apply immediately after each action. See [SYSTEMS.md](SYSTEMS.md) §5 for full melee mechanics.

### Opponent Roster (4 opponents, sequential)

| # | Type | HP | Stamina | Strength | AI Tier |
|---|------|----|---------|----------|---------|
| 1 | Austrian conscript | 70–85 | 160–200 | 40 | Conscript |
| 2 | Austrian conscript | 65–80 | 150–190 | 40 | Conscript |
| 3 | Austrian line infantryman | 80–95 | 180–240 | 50 | Line |
| 4 | Austrian veteran | 95–115 | 200–260 | 65 | Veteran |

- Max 12 exchanges total
- No free recovery between opponents
- 1 Glory earned per enemy defeated

---

## Battery Story Beat (chargeEncounter=1)

After terrain melee ends.

- **ChargeBattery:** Proceeds to Battery Melee. Courage rewarded.
- **HoldBack:** Skip battery melee. Reputation -5, morale -3. Battle continues (no longer ends the game).

---

## Battery Melee

Only if player chose ChargeBattery. Sequential resolution, same mechanics as terrain melee.

### Opponent Roster (3 opponents, sequential)

| # | Type | HP | Stamina | Strength | AI Tier |
|---|------|----|---------|----------|---------|
| 1 | Austrian artillerist/conscript | 60–75 | 140–180 | 40 | Conscript |
| 2 | Austrian infantry guard/line | 80–95 | 180–240 | 50 | Line |
| 3 | Austrian battery sergeant | 100–125 | 220–280 | 75 | Sergeant |

- Max 10 exchanges total
- 1 Glory earned per enemy defeated

---

## Masséna Story Beat (chargeEncounter=2)

After battery melee (or HoldBack). Rest and recovery before Part 2.

- **TendWounds:** Constitution check. Success: +15 HP. Fail: +5 HP.
- **CheckComrades:** Charisma check. Success: +10 neighbour morale, +5 relationship. Fail: +3 neighbour morale.
- **FollowTheScreams:** Intelligence check. Success: +5 morale, +3 soldierRep. Fail: -2 morale.

Transitions to Part 2: sets `battlePart = 2`, `scriptedVolley = 5`, resets enemy to fresh column at 100 paces.

---

## Part 2: Hold the Line (Volleys 5–7)

Auto-play. Orchestrated by `autoPlayPart2()` → `autoPlayVolleys(4, 6)`. Same volley cycle as Part 1 (PRESENT → FIRE → ENDURE → LOAD). Player stats carry over; enemy resets to fresh.

### Volley Definitions

| Volley | Range | Base Accuracy | Aim Bonus | Return Fire % | Return Fire Dmg | Enemy Line Dmg |
|--------|-------|--------------|-----------|---------------|----------------|----------------|
| 5 | 100 paces | 0.30 | 0.10 | 20% | 8–14 | 8 |
| 6 | 60 paces | 0.45 | 0.12 | 30% | 10–20 | 12 |
| 7 | 40 paces | 0.60 | 0.12 | 45% | 14–26 | 16 |

### Historical Events (Narrated)

- Vukassovich's artillery bombardment
- Pontare falls
- Lusignan appears at Affi
- Napoleon orders the counterattack

After volley 7 → `transitionToGorge()` → Gorge story beat.

---

## Gorge Story Beat (chargeEncounter=3)

Napoleon's counterattack order. Single choice: **AcceptOrder** ("To the ridge").

Transitions to Part 3: sets `battlePart = 3`, `scriptedVolley = 8`.

---

## Part 3: The Gorge (Volleys 8–11)

Auto-play with player target selection. Orchestrated by `autoPlayPart3()` → `autoPlayGorgeVolleys(7, 10)`.

**Key difference from Parts 1–2:** No ENDURE step. The player is firing down into the gorge — one-sided. No return fire (except 2–5% scripted chance), no valor roll.

### Per-Volley Cycle

1. **PRESENT** — Volley banner
2. **TARGET SELECTION** — Auto-play pauses, player chooses target:
   - TargetColumn / TargetOfficers / TargetWagon / ShowMercy
3. **FIRE** — French volley animation, target-specific resolution
4. **LOAD** — Load animation

### Volley Definitions

| Volley | Range | Base Accuracy | Return Fire % | Return Fire Dmg | Enemy Line Dmg |
|--------|-------|--------------|---------------|----------------|----------------|
| 8 | 200 paces | 0.50 | 2% | 3–6 | 10 |
| 9 | 200 paces | 0.50 | 3% | 3–6 | 10 |
| 10 | 200 paces | 0.50 | 4% | 3–6 | 8 |
| 11 | 200 paces | 0.50 | 5% | 3–6 | 8 |

### Target Resolution

| Target | Accuracy Formula | Damage | Special |
|--------|-----------------|--------|---------|
| Column | 0.60 + musketry/500 + awareness/500, [0.30–0.90] | 5 enemy dmg | +2 morale on hit |
| Officers | 0.30 + musketry/300 + awareness/400, [0.15–0.70] | 3 enemy dmg | +5 morale on hit, -1 on miss |
| Wagon | 0.15 + musketry/250 + awareness/350, [0.10–0.50] | 30–45 wagon dmg | Detonates at 100 |
| Show Mercy | N/A | 0 | +3 morale (compassion), -2 morale (disobedience) |

### Wagon Mechanic

- Cumulative `wagonDamage` (0–100)
- Each wagon hit adds 30 + random × 15
- **Detonation at 100:** -30 enemy strength, +15 morale
- If not detonated by volley 11: artillery scripted to destroy it
- Stamina cost is light: -3 per volley (vs -9 in line combat)

---

## Aftermath Story Beat (chargeEncounter=4)

After Part 3 completes. Victory narrative — Rivoli is won, Austrian column routed.

- **HelpWounded:** Compassion choice
- **FindComrades:** Check on NPCs
- **SitDown:** Rest

Currently the temporary end of the prototype. Post-battle camp transition follows.

---

## Post-Battle Camp: Rivoli Aftermath

- **Actions:** 6 (flat pool, no day system)
- **Location:** Rivoli — Aftermath
- **Weather:** Clear. **Supplies:** Adequate.
- **Intro:** Parchment overlay ("After the Battle") — click Continue to enter camp.

### Activities

Rest, Exercise, Arms Training, Duties (Drill, Check Equipment), Socialize, Gamble, Train.

### Random Events (12+ across 7 categories)

| Category | Events |
|----------|--------|
| Disease | Camp Fever, Wound Infection |
| Desertion | Desertion in the Night |
| Weather | Storm, Bitter Cold |
| Supply | Foraging Opportunity, Rations Cut |
| Interpersonal | Argument, Stories Around the Fire, NCO Inspection |
| Orders | Reconnaissance Duty |
| Rumour | Peace, Reinforcements, Enemy Movements |

Camp ends when all actions exhausted.

---

## Historical Reference

Based on the Battle of Rivoli, 14 January 1797, during Napoleon's Italian Campaign. See `rivoli-historical.md` for the full timeline (Epic History TV transcript).

Key historical beats woven into gameplay:
- French line holds against Austrian column advance (Parts 1–2)
- Masséna's arrival with reinforcements
- Austrian artillery under Vukassovich
- Napoleon's counterattack through the gorge (Part 3)
- Joubert's division holding the plateau
