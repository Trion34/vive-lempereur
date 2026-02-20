# ROADMAP — The Little Soldier: A Napoleonic Saga

Broad-strokes game plan. Three campaigns, each a self-contained arc. The player is one soldier — anonymous, expendable, trying to survive.

---

## Scope

| Milestone | Scope | Status |
|-----------|-------|--------|
| **DEMO** | Battle of Rivoli (single battle, full combat loop) | In progress |
| **V1.0** | Campaign 1: Italy (6 chapters, full campaign arc) | Planning |
| **V2.0** | Campaign 2: Egypt | Future |
| **V3.0** | Campaign 3: Russia | Future |

---

## Campaign Structure

```
CAMPAIGN 1: ITALY (1796-1797)     ← V1.0
CAMPAIGN 2: EGYPT (1798-1801)     ← V2.0
CAMPAIGN 3: RUSSIA (1812)         ← V3.0
```

Each campaign is a sequence of **Chapters**. Each chapter contains:
- A **playable battle** (full combat loop: volleys, story beats, melee)
- **Camp phases** before and after (activities, events, relationships)
- **March/narrative interludes** between camps (cinematic sequences, stat checks, consequences)
- A distinct **theme** and **player arc beat**

Completing Campaign 1 unlocks Campaign 2. Each campaign raises the stakes. Italy is a young man's war — lightning victories, esprit de corps. Egypt is isolation and disease. Russia is the long death.

---

## Shared Systems vs. Battle-Specific Content

Every battle uses the same core systems:
- **Auto-play volley cycle** (PRESENT → FIRE → ENDURE → LOAD)
- **Melee** (sequential resolution, stance/action/target)
- **Story beats** (cinematic overlay, choices, stat checks, consequences)
- **Camp loop** (activities, events, NPC relationships)
- **Morale / health / stamina / fatigue** (persistent across all phases)
- **Grace and Glory** (meta-progression)

Each battle adapts these with **unique mechanics** — special volley variants, unique melee contexts, battle-specific story beats, terrain effects. The Gorge (Rivoli Part 3) is the template: same UI, new rules.

---

## Campaign Details

| Campaign | File | Chapters | Player Arc |
|----------|------|----------|------------|
| **Italy** | [CAMPAIGN-ITALY.md](CAMPAIGN-ITALY.md) | 6 | Raw recruit → Veteran → NCO |
| **Egypt** | [CAMPAIGN-EGYPT.md](CAMPAIGN-EGYPT.md) | 4-5 (TBD) | Veteran → Colonial soldier → Marooned survivor |
| **Russia** | [CAMPAIGN-RUSSIA.md](CAMPAIGN-RUSSIA.md) | 4-5 (TBD) | Old veteran → The retreat → (survival?) |

---

## Cross-Campaign Progression

### What Carries Forward
- **Stats** — The player's full stat block persists across campaigns
- **Rank** — Earned promotions carry. A Sergeant from Italy starts Egypt as a Sergeant.
- **Reputation** — All three reputation tracks (soldiers, officers, Napoleon) persist
- **NPCs** — Surviving companions transfer (some leave between campaigns, new ones join)
- **Scars and wounds** — Permanent injuries from previous campaigns affect stats/options
- **Glory** — Meta-currency persists across permadeath resets

### What Resets
- **Condition meters** — Health/morale/stamina reset to starting values per campaign
- **Fatigue** — Resets per battle (melee-only resource)
- **Equipment** — May change between campaigns (new uniforms, weapons, conditions)
- **Unit** — The player may be reassigned between campaigns
- **Enemies** — Completely new opponent types per campaign

### Rank Progression (Across Full Game)

| Rank | Earliest Opportunity | Unlock |
|------|---------------------|--------|
| Private | Start | — |
| Corporal | Chapter 2 (Lodi) | Minor authority in camp, small morale bonus |
| Sergeant | Chapter 4 (Arcole) | Command options in story beats, NCO dialogue |
| Lieutenant | Campaign 2 (Egypt) | Tactical choices before battle, officer-tier events |
| Captain | Campaign 3 (Russia) | Unit command responsibility, high-stakes decisions |

### NPC Arc Planning

NPCs are introduced, developed, and potentially killed across chapters. Key design principle: **the player should care when someone dies.**

| NPC | Introduced | Arc |
|-----|-----------|-----|
| **Pierre** | Chapter 1 (Montenotte) | The veteran. Keeps you alive. Dies at Rivoli (or survives if player intervenes). |
| **Jean-Baptiste** | Chapter 1 (Montenotte) | The scared kid. Grows into a soldier — or doesn't. His fear at Rivoli is the culmination. |
| **Captain Leclerc** | Chapter 1 (Montenotte) | The officer. Professional, distant. The player's relationship with authority. |
| **Sergeant Duval** | Chapter 1 (Montenotte) | The NCO. Fair but hard. The player's direct superior. Possible mentor. |
| *New NPCs* | Each chapter | New faces join. Some replace the dead. The roster evolves. |

---

## Development Priorities

### Phase 1: Perfect the Core (Current)
- Dial in melee combat
- Polish Rivoli as the reference implementation
- Ensure all systems are solid before scaling

### Phase 2: Battle Configuration
- Extract Rivoli-specific content into a data-driven battle config
- Build the framework for plugging in new battles
- Implement march/narrative interlude system between battles

### Phase 3: Campaign 1 Content
- Build chapters 1-4 (Montenotte, Lodi, Castiglione, Arcole)
- Build chapter 6 (Mantua)
- Expand camp content for each chapter (location-specific events, weather, supplies)
- Full NPC arcs across all 6 chapters

### Phase 4: Meta-Progression
- Rank system with promotion mechanics
- Achievements / legacy effects
- Campaign completion → Campaign 2 unlock

### Phase 5: Campaign 2 (Egypt)
- New battle mechanics (squares, desert, disease)
- New NPC roster
- New narrative content

### Phase 6: Campaign 3 (Russia)
- New survival mechanics (cold, starvation, retreat)
- The grand finale
