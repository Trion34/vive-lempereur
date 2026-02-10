# The Little Soldier

## Game Design Document

---

## 1. Vision

**Genre:** Roguelike narrative RPG
**Setting:** Napoleonic Wars (1796-1812)
**Platform:** Electron + Steam
**Comparable Titles:** A Legionary's Life, Peninsular War Battles, King of Dragon Pass

**Elevator Pitch:** You are nobody. An anonymous infantryman in Napoleon's Grande Armée. Survive the Italian Campaign, the sands of Egypt, the frozen wastes of Russia. Every battle is a coin toss between glory and a shallow grave. Every choice between battles shapes who you become — or whether you return at all.

**Core Fantasy:** Survival over heroism. You are not a general. You are not a hero. You are a man in a line, holding a musket, trying not to die. The game asks: what does courage look like from the bottom of the ranks?

---

## 2. Game Pillars

### Survival Over Heroism
The player is expendable. The army doesn't need them specifically — it needs a body in the line. Glory is incidental. Staying alive is the victory condition.

### Consequence-Driven Narrative
Every choice echoes. Saving Jean-Baptiste in the charge means he's there in the melee. Ducking under fire means the sergeant remembers. Choices propagate across battles, camp phases, and the full campaign arc.

### Historical Immersion
No anachronisms. Period-correct terminology, tactics, equipment, and social structures. The Napoleonic Wars as they were experienced by the men who fought them — brutal, chaotic, and profoundly human.

### Roguelike Replayability
Permadeath. Branching paths. Procedural events. No two runs are identical. The campaign structure means each playthrough reveals different facets of the war, different NPC arcs, different outcomes.

---

## 3. Stat System

All stats can be used for narrative and choice checks (rolls). The system is divided into three tiers.

### Primary Stats (Combat Resources)

These are the moment-to-moment survival meters. They fluctuate constantly during battle and recover (or don't) in camp.

| Stat | Role | Range | Notes |
|------|------|-------|-------|
| **Morale** | Determination in battle | 0-100 | The central combat currency. When it breaks, you break. Drains under fire, recovers through courage and camaraderie. Threshold system: Steady (75-100%), Shaken (40-75%), Wavering (15-40%), Breaking (0-15%). |
| **Health** | Hit Points | 0-100 | Physical damage. Wounds accumulate. Thresholds: Unhurt, Wounded, Badly Wounded, Critical. Low health drains morale. |
| **Fatigue** | Energy in combat and camp | 0-100 | Replaces "Stamina". Bridges combat and camp loops — fighting exhausts you, camp activities restore (or further drain) you. Low fatigue in combat debuffs roll chances. Thresholds: Fresh (75-100%), Tired (40-75%), Exhausted (15-40%), Spent (0-15%). |

### Secondary Stats (Modify Primaries)

These are persistent character attributes that modify primary stat behavior. They grow through training, experience, and camp activities. All are rollable for narrative checks.

| Stat | Role | Feeds Into |
|------|------|------------|
| **Strength** | Melee damage | Damage multiplier in melee. Physical checks (lifting, carrying, breaking). |
| **Endurance** | Fatigue management | Fatigue drain rate, recovery efficiency. Marching and camp labor checks. |
| **Constitution** | HP pool | Maximum Health, wound resistance, disease resistance. |
| **Dexterity** | Hit/dodge/load/fire accuracy | Hit chance in volley and melee. Dodge chance. Musket loading speed and success. |
| **Valor** | Morale resilience | Morale recovery ratchet efficiency. Courage checks (standing firm, leading by example). Currently implemented as d100 roll: success if roll <= valor + modifier (clamped 5-95). |

### Tertiary Stats (Narrative & Social)

These drive the story loop — camp interactions, officer relations, promotion paths, and the branching narrative. All are rollable.

| Stat | Role |
|------|------|
| **Charisma** | Persuasion, leadership checks. Rally other soldiers. Talk your way out of trouble. |
| **Intelligence** | Tactical awareness, problem-solving. Recognize ambushes, understand orders, improvise. |
| **Awareness** | Perception checks. Notice danger, spot opportunities, read people. |
| **Prestige** | Composite score: past actions + attire + equipment + medals + promotions. Social currency — how others perceive you. Not directly rollable but modifies social interactions. |
| **Rank** | Military rank (Private → Corporal → Sergeant → ...). Unlocks dialogue options, authority, and responsibilities. Progression through the story loop. |
| **Reputation: Troops** | How the rank-and-file see you. Earned through shared hardship, courage, and solidarity. |
| **Reputation: Officers** | How your superiors see you. Earned through obedience, initiative, and results. |
| **Reputation: Bonaparte** | Whether the General has noticed you. Rare, high-stakes, campaign-defining. |

### Stat Interactions

```
Secondary → Primary:
  Strength   → Melee Damage
  Endurance  → Fatigue drain/recovery rate
  Constitution → Max Health, wound thresholds
  Dexterity  → Hit chance, dodge, load speed
  Valor      → Morale recovery efficiency (ratchet formula)

Tertiary → Narrative:
  All tertiary stats serve as roll targets for narrative/choice checks
  Prestige modifies NPC disposition
  Rank gates dialogue options and camp activities
  Reputation axes feed into promotion, story branches, ending variants
```

### Roll System

**Combat rolls:** d100 against target derived from relevant stat + situational modifiers. Success threshold clamped to 5-95 (nothing is guaranteed, nothing is impossible).

**Narrative checks:** Same d100 system. Stat + modifier vs difficulty. Multiple stats can apply to a single check (e.g., Awareness + Intelligence for tactical perception). Fatigue debuff: when Fatigue is low, all roll chances are penalized.

---

## 4. Three Nested Gameplay Loops

The game consists of three nested loops, each containing the one inside it.

```
┌─────────────────────────────────────────────┐
│  STORY LOOP (outermost)                     │
│  Campaign progression, branching narrative,  │
│  choices, stat checks, consequences          │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │  CAMP LOOP (middle)                   │  │
│  │  Between battles: rest, train, events, │  │
│  │  relationships, equipment, fatigue     │  │
│  │                                        │  │
│  │  ┌─────────────────────────────────┐   │  │
│  │  │  COMBAT LOOP (innermost)        │   │  │
│  │  │  Line → Crisis → Melee          │   │  │
│  │  │  Morale, fatigue, survival      │   │  │
│  │  └─────────────────────────────────┘   │  │
│  └────────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

---

## 5. Combat Loop (Innermost)

### General Structure

Typical battles follow the same three-phase arc, but each battle defines its own specific content, events, outcomes, and timing. Each battle is custom designed, unique, and engaging.

```
Phase 1: LINE    →  Phase 2: CRISIS    →  Phase 3: MELEE
(Volleys, drill)    (Line breaks)          (Close combat)
```

**Phase 1: Line** — The firing line. Scripted volleys, drill steps (Load → Present → Fire → Endure), morale pressure, narrative events. The player acts within the volley cycle while the line holds.

**Phase 2: Crisis** — The line breaks. The moment everything changes. RPG-style encounter choices with stat checks. Battle-specific crisis type: charge, flank, rout, ambush, retreat, etc.

**Phase 3: Melee** — Close combat. Turn-based stance/action/target system. Individual opponents with AI personalities. The most mechanically dense phase.

### Battle Configuration

Each battle is a data-driven configuration. The combat system provides shared mechanics; the battle config provides specific content.

A battle configuration defines:
- **Number of volleys** and their scripted events
- **Crisis type** (what breaks the line — charge, flanking attack, rout, ambush, etc.)
- **Crisis encounters** (RPG-style narrative choices during the crisis)
- **Melee opponent roster** (number, types, names, stats)
- **Outcomes** (victory conditions, loss conditions, special endings)
- **Timers/triggers** (battle-specific mechanics — e.g., cavalry arrival, reinforcements, weather changes)
- **Narrative text** (opening, transitions, endings, all battle-specific)
- **NPC moments** (scripted character beats tied to specific phases)

### Morale System (Shared)

Morale is the central combat currency. It is a psychological meter — the fraying rope.

**Thresholds:**
| Threshold | Range | Effect |
|-----------|-------|--------|
| Steady | 75-100% | Full action availability. Can attempt high-courage actions. |
| Shaken | 40-75% | Some actions restricted. Performance degrades. |
| Wavering | 15-40% | Most courageous actions unavailable. High passive drain. |
| Breaking | 0-15% | Only desperate actions available. Rout becomes possible. |

**Morale Drain Sources:**
- Passive drain from range, artillery, casualties, wounds, empty musket, exhaustion
- Event-driven shocks (neighbour killed, officer down, cannonball lane, cavalry threat)
- Action consequences (ducking, fumbling, failed courage checks)
- Contagion from wavering/routing neighbours

**Morale Recovery Sources:**
- Drums, NCO presence, officer alive
- Neighbour contagion (steady neighbours boost morale)
- Courageous actions (standing firm, steadying the line)
- Successful volleys, lulls in fire
- Drinks, prayer (diminishing returns)

**Recovery Ratchet:** Recovery is harder as morale drops. Formula: `efficiency = (0.25 + ratio * 0.75) * (0.6 + valorFactor * 0.4)`. Valor stat softens the ratchet — experienced soldiers recover faster even at low morale.

### Phase 1: Line — Volley Cycle

The drill cycle is the heartbeat of Phase 1:

```
PRESENT → FIRE → ENDURE → LOAD → PRESENT → ...
```

Each step offers the player a set of actions gated by morale threshold:

**Present Step:**
| Action | Threshold | Effect |
|--------|-----------|--------|
| Aim Carefully | Steady | Valor check. Success: accuracy bonus + morale gain. Fail: morale loss. |
| Present Arms | Breaking | Standard. Reliable. No check. |


**Fire Step:**
| Action | Threshold | Effect |
|--------|-----------|--------|
| Fire | Shaken | Standard volley. Accuracy = experience + range modifier + held bonus. |
| Snap Shot | Breaking | Fast, wild. 8% hit chance. NCO disapproval. |
| Hold Fire | Steady | Don't fire. Chance of officer disapproval. Weapon stays loaded into next part of battle |

**Endure Step:**
| Action | Threshold | Effect |
|--------|-----------|--------|
| Stand Firm | Wavering | Valor check. Success: morale + valor growth. |
| Steady the Line | Shaken | Help neighbour. Valor check. Costs morale if charisma roll fails, boosts neighbour. |
| Duck | Breaking | Dodge incoming fire. Self-preservation vs shame spiral. NCO notices. |
| Pray | Breaking | Diminishing returns. First prayer helps, later ones don't as much. |
| Drink Water | Wavering | fixed charges. Restores fatigue and morale. |

**Load Step:** Automatic. Roll based on morale + valor. Failure = fumbled load → player must "Go Through Motions" (pretend to have a loaded musket) or face consequences.

### Phase 2: Crisis — The Line Breaks

The crisis phase is a series of RPG-style encounters with narrative text and stat-gated choices. Each battle defines its own crisis type and encounters.

Encounters feature:
- Rich narrative text (hundreds of words per encounter)
- 3-4 choices, each gated by morale threshold and/or stat requirements
- Stat checks (valor rolls, stamina checks) for ambitious choices
- Consequences that propagate: health/stamina changes, morale shifts, reputation changes, NPC state changes
- Success/failure branches within each encounter

### Phase 3: Melee — Close Combat

Turn-based combat against a roster of opponents.

**Flow per exchange:**
```

1. Choose Action
a) Bayonet Thrust Standard thrust. Reliable.
b) Dodge change to evade. Success grants riposte (+percent next hit).
c) Butt Strike Musket butt. No damage but chance to stun.
d) Aggressive Lunge Commit everything. +percent hit, 1.5x damage. Extra fatigue on miss
e) Guard high block chance. Blocked attacks deal no damage
f) Feint Fake attack. Increases enemy fatigue.
g) Shoot (only if gun is loaded) fire at close range. High damage if hit, high crit chance, cannot be blocked.
h) Recover Lowers fatigue
2. Choose Target body part (for attacks)
4. Damage, status effects, morale changes applied
3. Turn based: player acts, opponent AI acts
Continuous Checks: opponent defeated? Player dead? Battle over?
```

**Stance (toggle any time):**
| Stance | Attack Mod | Defense Mod | Fatigue Cost |
|--------|-----------|-------------|--------------|
| Aggressive | +20% | -15% | 6 |
| Balanced | +0% | +0% | 4 |
| Defensive | -15% | +20% | 2 |

**Actions:**
| Action | Fatigue | Hit Bonus | Damage | Special |
|--------|---------|-----------|--------|---------|
| Bayonet Thrust | 6 | +0% | 1.0x | Standard attack |
| Aggressive Lunge | 12 | +15% | 1.5x | High risk, high reward |
| Butt Strike | 8 | +10% | 0.6x | 20% stun chance |
| Feint | 4 | — | — | increase fatigue if "hits" enemy |
| Guard | 2 | — | — | 60% block (no damage) |
| Dodge | 4 | — | — | 50% evade, grants riposte (+15% next hit) |
| Recover | -15 | — | — | Recover fatigue. Opponent gets free attack. |

**Body Part Targeting:**
| Part | Hit Modifier | Damage Range | Special |
|------|-------------|--------------|---------|
| Head | -25% | 25-35 | 10% instant kill, 35% stun |
| Torso | +0% | 15-25 | Standard |
| Arms | -10% | 10-15 | 15% arm injury (opponent damage reduced) |
| Legs | -15% | 10-20 | 10% leg injury (opponent fatigue costs increased) |

**Hit Chance Formula:**
```
hitChance = 0.60 (base)
  + stanceMod
  + actionHitBonus
  + bodyPartMod
  + Dex/200
  - (fatigue < 50 ? (50 - fatigue) * 0.01 : 0)
  - moral
  - opponentGuardPenalty
  - opponentDodgePenalty
```
Clamped to [0.05, 0.95].

**Opponent AI:**
Personality types with distinct behavior patterns:
- **Conscript:** Panics at low health (40% lunge), otherwise guards/thrusts conservatively.
- **Line Infantry:** Balanced. Varies attacks, manages stamina, targets body/arms/legs.
- **Veteran/Sergeant:** Reads player patterns (last 3 actions). Exploits feint setups. Adapts to defensive players with feints, adapts to aggressive players with dodges/guards.

**Between Opponents:** Brief recovery (+15 HP, +20 fatigue). NPC narrative beats (e.g., JB's arc callback).

### Battle Outcomes

Outcomes are battle-specific, not system-level constants. A battle configuration defines which outcomes are possible and what triggers them. Common outcome patterns:

- **Victory** — All opponents defeated, or enemy rout trigger met
- **Defeat** — Player death (health reaches 0)
- **Survived** — Player pulled from combat at low health after proving themselves
- **Rout** — Player flees at Breaking morale
- **Special** — Battle-specific (e.g., cavalry arrival, reinforcement, objective completion)

### Rivoli Prototype (Reference Implementation)

The Battle of Rivoli (January 14, 1797) is the first implemented battle. It demonstrates the combat system with these specific parameters:

- **Phase 1:** 4 scripted volleys at ranges 120→80→50→25 paces. JB crisis at Volley 2 Endure. Scripted events per volley. No passive drain (all morale from scripted events).
- **Phase 2:** Charge crisis (3 encounters: Pierre dies → JB stumbles → First enemy). RPG-style choices gated by morale and stats.
- **Phase 3:** 3 opponents (Austrian conscript → line infantryman → Feldwebel). 12-exchange cavalry timer — survive 12 rounds and chasseurs arrive.
- **Outcomes:** Victory, Defeat, Survived, Rout, Cavalry Victory.
- **NPCs:** Pierre (left neighbour, Arcole veteran — dies in charge), Jean-Baptiste (right neighbour, conscript — crisis arc), Captain Leclerc (officer), Sergeant Duval (NCO).

---

## 6. Camp Loop (Middle)

The camp loop wraps the combat loop. Between battles, the player manages fatigue, relationships, training, and equipment. Camp is where choices compound and consequences accumulate.

### Time System

Days pass between battles. Each camp loop allows a limited number of activities. The amount of activites varies by campaign segment (more rest between major engagements, less during forced marches).

### Fatigue Bridge

Fatigue is the currency that bridges combat and camp:
- Combat drains fatigue. Ending a battle exhausted means starting camp in poor shape.
- Camp activities cost or restore fatigue. Resting recovers it. Training, foraging, and socializing spend it.
- Starting the next battle with low fatigue means debuffed rolls from the first volley.

### Activities

| Activity | Fatigue Cost | Effect |
|----------|-------------|--------|
| **Rest** | Restores | Primary recovery. Amount depends on conditions (weather, supplies, shelter). |
| **Train** | Medium | Improve secondary stats. Drill improves Dexterity. Sparring improves Strength. Marching improves Endurance. Training costs fatigue, training when overfatigued hurts moral|
| **Socialize** | Low | Build relationships. Charisma checks. NPC events. Chance to increase moral. Reputation changes. |
| **Write Letters** | Low | Morale recovery for next battle. Intelligence check for eloquence (reputation). |
| **Gamble** | Low | Risk/reward. Prestige and reputation stakes. |
| **Drill** | High | Unit drill. Improves collective performance. NCO approval. |
| **Maintain Equipment** | Low | Weapon reliability, uniform condition (feeds into Prestige). |

### NPC Relationships

Named NPCs persist across battles and camp. Relationships are tracked numerically and affect gameplay:

- **Neighbours:** The men beside you in the line. Their morale affects yours. Their survival depends on your choices.
- **NCO (Sergeant):** Tracks approval. High approval grants leeway; low approval means punishment details.
- **Officer:** Reputation axis. Their survival/death affects unit morale and story branches.
- **Other soldiers:** Met through camp socializing. Can become friends, rivals, or enemies.

Relationship events:
- Shared meals, guard duty conversations, gambling disputes
- Favours asked and owed
- Interpersonal conflicts (mediation checks)
- Grief and trauma processing after battles

### Random Events

Camp events are categorized:

| Category | Examples |
|----------|---------|
| **Disease** | Fever, dysentery, wound infection. Constitution checks. |
| **Desertion** | NPC disappears. Morale ripple. Decision: report or cover? |
| **Weather** | Storm, cold snap, heat. Affects activity effectiveness. |
| **Supply** | Rations cut, pay arrives (or doesn't), loot distribution. |
| **Interpersonal** | Fights, friendships, rivalries, romantic entanglements. |
| **Orders** | Reassignment, punishment detail, special mission. |
| **Rumour** | News from other fronts. Campaign context. Bonaparte sightings. |

### Training & Stat Growth

Secondary stats grow through targeted training activities and through experience in combat. Growth is slow and gated by:
- Fatigue cost (training not effective when exhausted)
- Available instructors (NCO for drill, veterans for combat techniques)
- Equipment (need weapons for sparring, writing materials for letters)
- Diminishing returns (each point harder than the last)

---

## 7. Story Loop (Outermost)

The story loop is a traditional text-based RPG with branching paths, choices, and rolls against all stat tiers. It provides the overarching structure within which camp and combat loops operate.

### Campaign Structure

**Campaign 1: Italy (1796-1797)**
The First Italian Campaign. Bonaparte's lightning war across northern Italy. The player starts as a raw recruit and fights through:

| Battle | Date | Historical Context |
|--------|------|-------------------|
| Montenotte | Apr 1796 | First engagement. Learning the basics. |
| Lodi | May 1796 | The bridge. Bonaparte leads from the front. |
| Arcole | Nov 1796 | Three days of hell at the bridge. |
| **Rivoli** | **Jan 1797** | **The decisive battle. (Prototyped.)** |
| Mantua | Feb 1797 | The siege ends. |

Between battles: marches through Italy, camp in foreign territory, encounters with locals, supply crises, promotion opportunities.

**Campaign 2: Egypt (1798-1801)** *(Future)*
Desert warfare. Pyramids. Plague. Marooned. Dramatically different terrain, enemies, and mood.

**Campaign 3: Russia (1812)** *(Future)*
The Grande Armée. The march to Moscow. The retreat. The ultimate survival story.

### Branching Narrative

Story branches are driven by:
- **Stat checks:** Roll against any stat tier. Multiple paths through each narrative beat.
- **Past choices:** Consequences from combat and camp propagate forward. NPC states, reputation levels, and equipment all affect available options.
- **Reputation gates:** Some paths require specific reputation levels with troops, officers, or Bonaparte.
- **Rank progression:** Higher rank unlocks authority options but also responsibilities and risk.

### Check/Roll System

Narrative checks use the same d100 system as combat:

```
Target = RelevantStat + Modifier
Roll = d100
Success = Roll <= Target
```

Checks can involve:
- Single stat (e.g., Valor check to volunteer for a dangerous mission)
- Combined stats (e.g., Intelligence + Awareness for tactical perception)
- Opposed checks (e.g., Charisma vs NPC's suspicion)
- Prestige-modified checks (e.g., convincing an officer, modified by Prestige)

**Difficulty Tiers:**
| Difficulty | Modifier |
|------------|----------|
| Trivial | +30 |
| Easy | +15 |
| Standard | +0 |
| Hard | -15 |
| Very Hard | -30 |
| Near Impossible | -45 |

### Consequence Propagation

Choices ripple:
- **Immediate:** Health, fatigue, morale changes
- **Short-term:** NPC attitude shifts, reputation changes, equipment gains/losses
- **Long-term:** Story branches opened/closed, promotion eligibility, ending variants
- **Campaign-wide:** Certain choices define the character arc (coward-to-hero, idealist-to-cynic, lone wolf-to-leader)

### Key Story Beats (Campaign 1)

Story beats are historical events reframed from the infantry perspective:
- Bonaparte's arrival and first speech (heard from the ranks, not the podium)
- The crossing at Lodi (ordered onto the bridge)
- Arcole (three days of failed assaults, survivor's guilt)
- Winter camp (disease, desertion, low morale)
- Rivoli (the decisive stand — prototyped combat)
- Victory and its aftermath (what was it for?)

---

## 8. Roguelike Meta-Progression

### Permadeath

Death is permanent. A single musket ball, a failed dodge, a moment of broken morale — the run ends. The game saves automatically and deletes saves on death.

### Run Structure

A run = one soldier's life through one campaign. Each run starts with character creation (stat allocation from a point pool) and ends with death or campaign completion.

### Between Runs

- **Unlockables:** New starting backgrounds (different stat distributions), new starting equipment, cosmetic variations.
- **Achievements:** Tracked across runs. "Survive Rivoli without ducking." "Reach Sergeant by Arcole." "Never lose a neighbour."
- **Campaign chapters:** Completing Campaign 1 unlocks Campaign 2. Each campaign is a self-contained arc.
- **Legacy effects:** Optional. Names of previous characters appear as references in future runs (tombstones, mentions by veterans).

### Replayability Drivers

- Different stat builds open different narrative paths
- RNG in combat events, camp events, and NPC behaviour
- Branching story paths with mutually exclusive options
- Multiple possible endings per campaign
- Different relationship arcs with persistent NPCs
- Rank progression (how far can you climb?)

---

## 9. Technical Architecture

### Stack

- **Runtime:** Electron (desktop application)
- **Build:** Vite + TypeScript
- **Distribution:** Steam
- **UI:** Vanilla HTML/CSS with phase-based layout switching
- **State:** Immutable state objects with `structuredClone` per turn

### Phase-Based UI System

Three distinct layouts, activated by CSS class on the root game element:

| Phase | CSS Class | Layout | Description |
|-------|-----------|--------|-------------|
| Line | `phase-line` | 3-column (260px / 760px / 260px) | Player panel, center narrative + actions, enemy panel |
| Crisis | `phase-charge` | Parchment/storybook | Full-width narrative with choice buttons. Literary style. |
| Melee | `phase-melee` | Arena | Player/opponent cards, combat log feed, action grid |

### State Management

Each turn produces a new state via `structuredClone(state)` + mutations + return. No mutation of previous state. This enables:
- Clean undo/replay capability
- State serialization for saves
- Deterministic testing

### Save System Considerations

- Auto-save after every turn (combat) and every activity (camp)
- Save = serialized state JSON
- Permadeath: save deleted on death, no save-scumming
- Campaign progress saved between runs (unlocks, achievements)

---

## 10. Content Roadmap

### Built (Prototype)

- Battle of Rivoli combat loop (all 3 phases)
- Morale system with thresholds, drain, recovery, ratchet
- Scripted 4-volley Phase 1 with drill cycle
- 3-encounter charge Phase 2 with RPG choices
- 3-opponent melee Phase 3 with AI personalities
- Action system (volleys + melee)
- Named NPC arcs (Pierre, Jean-Baptiste)
- Phase-based UI with 3 layouts
- Playwright E2E evaluation suite (3 reviewer personas)

### Next Milestones

1. **Stat System Expansion** — Implement full primary/secondary/tertiary stat system. Replace current hardcoded values with stat-derived formulas.
2. **Battle Configuration System** — Extract Rivoli-specific content into a data-driven battle config. Build the framework for multiple battles.
3. **Camp Loop** — Day cycle, activity menu, fatigue bridge, NPC interactions.
4. **Second Battle** — Implement a second battle (Arcole or Montenotte) using the battle config system.
5. **Story Loop** — Branching narrative framework, stat checks, consequence propagation.
6. **Campaign 1 Content** — All Italian Campaign battles, camp segments, story beats.
7. **Electron Wrapper** — Desktop packaging, Steam integration.
8. **Meta-Progression** — Permadeath saves, unlockables, achievements.
