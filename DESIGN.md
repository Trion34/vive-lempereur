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
| **Stamina** | Energy in combat and camp | 0-100 | Bridges combat and camp loops — fighting drains you, camp activities restore (or further spend) you. Low stamina in combat debuffs roll chances. Thresholds: Fresh (75-100%), Tired (40-75%), Exhausted (15-40%), Spent (0-15%). Same scale everywhere (HIGH=good). |

### Secondary Stats (Modify Primaries)

These are persistent character attributes that modify primary stat behavior. They grow through training, experience, and camp activities. All are rollable for narrative checks.

| Stat | Role | Feeds Into |
|------|------|------------|
| **Strength** | Melee damage | Damage multiplier in melee. Physical checks (lifting, carrying, breaking). |
| **Endurance** | Stamina management | Stamina drain rate, recovery efficiency. Marching and camp labor checks. |
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
  Endurance  → Stamina drain/recovery rate
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

**Narrative checks:** Same d100 system. Stat + modifier vs difficulty. Multiple stats can apply to a single check (e.g., Awareness + Intelligence for tactical perception). Stamina debuff: when Stamina is low, all roll chances are penalized.

---

## 4. Three Nested Gameplay Loops

The game consists of three nested loops, each containing the one inside it.

```
┌──────────────────────────────────────────────────┐
│  STORY LOOP (outermost)                          │
│  Campaign progression, branching narrative,       │
│  choices, stat checks, consequences               │
│                                                   │
│  ┌─────────────────────────────────────────────┐  │
│  │  CAMP LOOP (middle)                        │  │
│  │  Between battles: rest, train, events,      │  │
│  │  relationships, equipment, stamina          │  │
│  │                                             │  │
│  │  ┌──────────────────────────────────────┐   │  │
│  │  │  COMBAT LOOP (innermost)             │   │  │
│  │  │  Auto-play volleys → Story beats     │   │  │
│  │  │  → Melee → More volleys → ...        │   │  │
│  │  │  Morale, stamina, survival           │   │  │
│  │  └──────────────────────────────────────┘   │  │
│  └─────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

---

## 5. Combat Loop (Innermost)

### General Structure

Battles are divided into **Battle Parts**, each containing a sequence of cinematic auto-play volleys punctuated by **Story Beats** (narrative choice encounters). The player watches the volley sequence unfold with timed animations, then makes choices at story beats that shape the battle's progression.

```
Part 1: LINE (auto-play volleys 1-4) → MELEE → STORY BEATS (Battery, Masséna)
Part 2: LINE (auto-play volleys 5-7) → STORY BEAT (Gorge)
Part 3: GORGE (auto-play volleys 8-11 with target selection) → STORY BEAT (Aftermath)
```

**Line Phase (Auto-Play)** — Cinematic volley sequences. The player clicks "Begin" and watches timed animations: PRESENT → FIRE → volley animation → results → ENDURE → Austrian return fire → valor card → line integrity → load animation. No player input during volleys (except Part 3 target selection). Story beats interrupt between volleys for narrative choices.

**Story Beats** — RPG-style narrative encounters with choices gated by morale and stats. Replace the old "Crisis" concept with a flexible system of encounters inserted throughout the battle flow.

**Melee** — Close combat with simultaneous exchanges. Turn-based stance/action/target system with opponent counter-attacks. Individual opponents with AI personalities and break thresholds.

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

### Auto-Play Volley System

All volleys use a **cinematic auto-play** system. The player clicks "Begin" (or "Continue" after a story beat) and watches a timed animation sequence for each volley:

```
1. PRESENT — Volley banner cross-fades in ("— Volley N at X Paces —")
2. FIRE — Captain's fire order → French volley sound + animation → hit/miss results
3. ENDURE — Austrian return fire sound + animation → damage results
4. VALOR CHECK — 4-tier graduated valor roll card (Great Success / Pass / Fail / Critical Fail)
5. LINE INTEGRITY — French vs Austrian contested roll determines line degradation
6. LOAD — Auto-load roll with animation (success or fumble)
```

**Graduated Valor Roll** (`rollGraduatedValor`): d100 vs `valor + difficultyMod` (clamped 5-95). Difficulty worsens as line integrity drops (`(lineIntegrity - 100) * 0.3`).

| Outcome | Margin | Morale | Notes |
|---------|--------|--------|-------|
| Great Success | ≥ +20 | +5 | "Nerves of steel." |
| Pass | ≥ 0 | +1 | "Holding." |
| Fail | ≥ -20 | -5 | "Shaking." |
| Critical Fail | < -20 | -10 | "Breaking." 20% chance of minor wound. |

**Line Integrity Roll** (`rollLineIntegrity`): Contested roll — French roll (based on line integrity + officer/drums bonuses) vs Austrian roll (based on enemy strength). Positive margin = line holds or strengthens. Negative = line degrades.

**Auto-Load Roll** (`rollAutoLoad`): Success based on morale + valor + dexterity. Fumbled load → musket empty for next volley.

**Gorge Volleys (Part 3)** are a special variant: no ENDURE step, no return fire, no valor roll, no line integrity roll. The French fire from the ridge into the gorge below — a one-sided shooting gallery. Instead, the auto-play **pauses each volley** for target selection (see Gorge section below).

### Drill Step Actions (Design Reference)

These actions define what the drill steps *represent*. In auto-play, they resolve automatically (using StandFirm as the default endure action). They remain relevant for the underlying resolution mechanics.

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
| Hold Fire | Steady | Don't fire. Weapon stays loaded. |

**Endure Step:**
| Action | Threshold | Effect |
|--------|-----------|--------|
| Stand Firm | Wavering | Valor check. Success: morale + valor growth. (Auto-play default.) |
| Steady the Line | Shaken | Help neighbour. Valor check. Costs morale if charisma roll fails, boosts neighbour. |
| Duck | Breaking | Dodge incoming fire. Self-preservation vs shame spiral. NCO notices. |
| Pray | Breaking | Diminishing returns. First prayer helps, later ones don't as much. |
| Drink Water | Wavering | Fixed charges. Restores stamina and morale. |

**Load Step:** Automatic. Roll based on morale + valor + dexterity. Failure = fumbled load.

### Story Beats

Story beats are RPG-style narrative encounters inserted between volley sequences. Each beat has rich narrative text and 2-4 choices gated by morale thresholds and/or stat requirements.

**Story Beat Types (chargeEncounter values):**

| ID | Name | Trigger | Choices |
|----|------|---------|---------|
| 5 | Wounded Sergeant | After Volley 2 (mid-Part 1) | Take Command / Rally The Line / Keep Your Head |
| 6 | Fix Bayonets | After Part 1 volleys, before melee | Fix Bayonets (auto) |
| 1 | Battery | After melee | Charge the Battery / Hold Back |
| 2 | Masséna | After battery (transitions to Part 2) | Tend Wounds / Check Comrades / Scavenge Ammo |
| 3 | Gorge | After Part 2 volleys (transitions to Part 3) | Accept Order (To the Ridge) |
| 4 | Aftermath | After Part 3 gorge volleys | Help Wounded / Find Comrades / Sit Down |

Encounters feature:
- Rich narrative text (hundreds of words per encounter)
- 2-4 choices, each gated by morale threshold and/or stat requirements
- Stat checks (valor rolls, stamina checks) for ambitious choices
- Consequences that propagate: health/stamina changes, morale shifts, reputation changes, NPC state changes
- Success/failure branches within each encounter

### Melee — Close Combat

Turn-based combat with **simultaneous exchanges** against a roster of opponents.

**Flow per exchange:**
```
1. Player chooses Action (attack, defense, utility)
2. Player chooses Target body part (for attacks)
3. Player's action resolves → damage/effects applied
4. Opponent counter-attacks in the same exchange (if still alive, on player attack turns)
5. UI shows wind-up glow → clash flash → sequential results (player hit, then opponent counter)
6. Check: opponent defeated? (health ≤ 0 or broke at threshold) Player dead? Battle over?
```

**Wind-Up / Clash Animations:** Before each exchange resolves, combatants show colored glows (red = attacking, blue = defending) followed by a white clash flash burst. On attack turns, the player strikes first, then the opponent counter-attacks with its own wind-up animation.

**Break Detection:** Conscripts break at 30% health, line infantry at 20%. Broken opponents count as kills (drop weapon, scramble back). Veterans/sergeants fight to the death.

**Glory Earned:** 1 Glory per enemy defeated in melee. At melee end, a glory summary overlay shows kills, glory earned, and total glory.

**Stance (toggle any time):**
| Stance | Attack Mod | Defense Mod | Stamina Cost |
|--------|-----------|-------------|--------------|
| Aggressive | +20% | -15% | 6 |
| Balanced | +0% | +0% | 4 |
| Defensive | -15% | +20% | 2 |

**Actions:**
| Action | Stamina | Hit Bonus | Damage | Special |
|--------|---------|-----------|--------|---------|
| Bayonet Thrust | 6 | +0% | 1.0x | Standard attack |
| Aggressive Lunge | 12 | +15% | 1.5x | High risk, high reward |
| Butt Strike | 8 | +10% | 0.6x | 20% stun chance |
| Feint | 4 | — | — | Drains enemy stamina if "hits" |
| Guard | 2 | — | — | 60% block (no damage) |
| Dodge | 4 | — | — | 50% evade, grants riposte (+15% next hit) |
| Recover | -15 | — | — | Recover stamina. Opponent gets free attack. |

**Body Part Targeting:**
| Part | Hit Modifier | Damage Range | Special |
|------|-------------|--------------|---------|
| Head | -25% | 25-35 | 10% instant kill, 35% stun |
| Torso | +0% | 15-25 | Standard |
| Arms | -10% | 10-15 | 15% arm injury (opponent damage reduced) |
| Legs | -15% | 10-20 | 10% leg injury (opponent stamina costs increased) |

**Hit Chance Formula:**
```
hitChance = 0.60 (base)
  + stanceMod
  + actionHitBonus
  + bodyPartMod
  + Dex/200
  - (stamina < 50 ? (50 - stamina) * 0.01 : 0)
  - moral
  - opponentGuardPenalty
  - opponentDodgePenalty
```
Clamped to [0.05, 0.95].

**Opponent AI:**
Personality types with distinct behavior patterns:
- **Conscript:** Panics at low health (40% lunge), otherwise guards/thrusts conservatively.
- **Line Infantry:** Balanced. Varies attacks, manages stamina well, targets body/arms/legs.
- **Veteran/Sergeant:** Reads player patterns (last 3 actions). Exploits feint setups. Adapts to defensive players with feints, adapts to aggressive players with dodges/guards.

**Between Opponents:** Brief recovery (+15 HP, +20 stamina). NPC narrative beats (e.g., JB's arc callback).

### Battle Outcomes

Outcomes are battle-specific, not system-level constants. A battle configuration defines which outcomes are possible and what triggers them. Common outcome patterns:

- **Victory** — All opponents defeated, or enemy rout trigger met
- **Defeat** — Player death (health reaches 0)
- **Survived** — Player pulled from combat at low health after proving themselves
- **Rout** — Player flees at Breaking morale
- **Special** — Battle-specific (e.g., cavalry arrival, reinforcement, objective completion)

### Rivoli Prototype (Reference Implementation)

The Battle of Rivoli (January 14, 1797) is the first implemented battle. It demonstrates the full combat system across three battle parts.

**Part 1 — The Line (Volleys 1-4, auto-play):**
- 4 volleys at ranges 120→80→50→25 paces
- Wounded Sergeant story beat after Volley 2 (chargeEncounter=5)
- JB crisis at Volley 2 auto-resolves based on (charisma+valor)/2
- Graduated valor rolls + line integrity rolls per volley
- Scripted events per volley (canister, drummer boy, officer moments)
- Transitions to melee after Volley 4

**Melee — Terrain Combat:**
- 4 opponents: 2 Austrian conscripts → 1 line infantryman → 1 veteran (Feldwebel)
- Max 10 exchanges, then cavalry timer — survive and chasseurs arrive
- Outcomes: Victory, Defeat, Survived, Cavalry Victory
- 1 Glory earned per kill

**Story Beats — Battery & Masséna:**
- Battery (chargeEncounter=1): Charge the Battery / Hold Back
- If charged: Battery melee (3 opponents: artillerist, guard, sergeant, max 8 exchanges)
- Masséna (chargeEncounter=2): Tend Wounds / Check Comrades / Scavenge Ammo
- Transitions to Part 2

**Part 2 — Fresh Column (Volleys 5-7, auto-play):**
- 3 volleys at ranges 100→60→40 paces against a fresh Austrian column
- Same auto-play mechanics as Part 1 (valor rolls, line integrity, return fire)
- Enemy resets to full strength; player stats carry over
- Transitions to Gorge story beat

**Part 3 — The Gorge (Volleys 8-11, auto-play with target selection):**
- 4 volleys at 200 paces from the ridge into the gorge below
- French fire is one-sided: no return fire, no valor roll, no line integrity roll
- Auto-play **pauses each volley** for target selection:
  - Target Column — Fire into packed ranks (easy, devastating)
  - Target Officers — Pick out the officer (harder shot, bigger effect)
  - Target Ammo Wagon — Hit the powder wagon (accumulates damage, can detonate)
  - Show Mercy — Lower musket (morale +3, -2 for disobedience; line fires without you)
- Wagon detonation at 100% damage (removed from options after)
- Aftermath story beat (chargeEncounter=4): Help Wounded / Find Comrades / Sit Down

**NPCs:** Pierre (left neighbour, Arcole veteran — dies in charge), Jean-Baptiste (right neighbour, conscript — crisis arc), Captain Leclerc (officer), Sergeant Duval (NCO).

---

## 6. Camp Loop (Middle)

The camp loop wraps the combat loop. Between battles, the player manages stamina, relationships, training, and equipment. Camp is where choices compound and consequences accumulate.

### Time System

Days pass between battles. Each camp loop allows a limited number of activities. The amount of activites varies by campaign segment (more rest between major engagements, less during forced marches).

### Stamina Bridge

Stamina is the currency that bridges combat and camp:
- Combat drains stamina. Ending a battle exhausted means starting camp in poor shape.
- Camp activities cost or restore stamina. Resting recovers it. Training, foraging, and socializing spend it.
- Starting the next battle with low stamina means debuffed rolls from the first volley.
- Same scale everywhere: 0-100, HIGH=good. No inversion between phases.

### Activities

| Activity | Stamina Cost | Effect | Status |
|----------|-------------|--------|--------|
| **Rest** | Restores | Primary recovery. Amount depends on conditions (weather, supplies, shelter). | Implemented |
| **Train** | Medium | Improve secondary stats. Drill improves Dexterity. Sparring improves Strength. Marching improves Endurance. | Implemented |
| **Socialize** | Low | Build relationships. Charisma checks. NPC events. Chance to increase morale. | Implemented |
| **Write Letters** | Low | Morale recovery for next battle. Intelligence check for eloquence (reputation). | Implemented |
| **Gamble** | Low | Risk/reward. Prestige and reputation stakes. | Implemented |
| **Drill** | High | Unit drill. Improves collective performance. NCO approval. | Implemented |
| **Maintain Equipment** | Low | Weapon reliability, uniform condition (feeds into Prestige). | Implemented |
| **Scout** | Medium | Reconnaissance. Awareness checks. Tactical info for next battle. | Planned |
| **Pray** | Low | Spiritual comfort. Morale recovery, diminishing returns. | Planned |

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

Camp events framework is implemented but content is sparse. Event categories planned:

| Category | Examples | Status |
|----------|---------|--------|
| **Disease** | Fever, dysentery, wound infection. Constitution checks. | Framework only |
| **Desertion** | NPC disappears. Morale ripple. Decision: report or cover? | Framework only |
| **Weather** | Storm, cold snap, heat. Affects activity effectiveness. | Framework only |
| **Supply** | Rations cut, pay arrives (or doesn't), loot distribution. | Framework only |
| **Interpersonal** | Fights, friendships, rivalries, romantic entanglements. | Framework only |
| **Orders** | Reassignment, punishment detail, special mission. | Framework only |
| **Rumour** | News from other fronts. Campaign context. Bonaparte sightings. | Framework only |

### Training & Stat Growth

Secondary stats grow through targeted training activities and through experience in combat. Growth is slow and gated by:
- Stamina cost (training not effective when exhausted)
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
- **Immediate:** Health, stamina, morale changes
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

### Glory (Implemented)

Glory is the cross-run meta-progression currency. It persists in localStorage across permadeath resets.

- **Earned:** 1 Glory per enemy defeated in melee combat
- **Starting balance:** 5 Glory for first character creation
- **Spent during:** Character creation — 1 Glory = +1 to a selected stat (up to stat max)
- **Displayed:** Glory banner in intro screen, post-melee summary overlay
- **Persistence:** Separate from save data — survives permadeath

### Between Runs

- **Glory:** Accumulated across runs. Allows stronger starting stats on subsequent characters.
- **Unlockables:** *(Future)* New starting backgrounds (different stat distributions), new starting equipment, cosmetic variations.
- **Achievements:** *(Future)* Tracked across runs. "Survive Rivoli without ducking." "Reach Sergeant by Arcole." "Never lose a neighbour."
- **Campaign chapters:** Completing Campaign 1 unlocks Campaign 2. Each campaign is a self-contained arc.
- **Legacy effects:** *(Future)* Optional. Names of previous characters appear as references in future runs (tombstones, mentions by veterans).

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

### Save System (Implemented)

- Auto-save after every volley, every melee exchange, every camp activity, and every story beat choice
- Save format: `{ version: "0.2.0", gameState: GameState, timestamp: number }` stored in localStorage
- Permadeath: save auto-deleted when `player.alive === false`
- Glory persisted separately (survives permadeath) under its own localStorage key
- Save/resume for auto-play: if game reloads mid-volley sequence, a "Continue" button resumes from the current volley

### Music System (Implemented)

Two-track phase-based music with crossfade:

| Track | File | Used In |
|-------|------|---------|
| Dreams | `/assets/music/dreams.mp3` | Intro, story beats, camp |
| Battle | `/assets/music/battle.mp3` | Line phase (volleys), melee |

- 1.5-second crossfade transition between tracks
- Master volume 30% by default, mute toggle available
- Audio locked behind first user gesture (click/keypress unlocks all audio)

### Persistent Condition Meters (Implemented)

Health, morale, and stamina persist across all phase transitions:
- `syncBattleToCharacter()` copies battle meters to PlayerCharacter at battle→camp transition
- `syncCampToCharacter()` copies camp meters back at camp→battle transition
- Same scale everywhere: 0-100, HIGH=good (no inversion between phases)
- StaminaState enum: Fresh (>75%) / Tired (>40%) / Exhausted (>15%) / Spent (≤15%)

---

## 10. Content Roadmap

### Built

- **Full Battle of Rivoli** across 3 battle parts (11 volleys, melee, 6 story beats)
- **Cinematic auto-play** for all volley sequences (Parts 1-3)
- **Graduated valor rolls** (4-tier) and **line integrity rolls** per volley
- **Gorge target selection** (Column/Officers/Wagon/Mercy) with wagon detonation mechanic
- **Melee combat** with simultaneous exchanges, wind-up/clash animations, break detection, glory summary
- **6 story beat encounters** (Wounded Sergeant, Fix Bayonets, Battery, Masséna, Gorge, Aftermath)
- **Morale system** with thresholds, drain, recovery, ratchet, contagion
- **Persistent condition meters** (health/morale/stamina carry across all phases)
- **Glory meta-progression** (earned in melee, spent in character creation, persists across runs)
- **Save/persistence system** with auto-save, permadeath deletion, mid-auto-play resume
- **Music system** (2-track with crossfade)
- **Camp loop** (7 activities: Rest, Train, Socialize, Write Letters, Gamble, Drill, Maintain Equipment)
- **Named NPC arcs** (Pierre, Jean-Baptiste, Captain Leclerc, Sergeant Duval)
- **Phase-based UI** with 3 layouts + parchment story beat overlay
- **Player portrait** and line status panel with neighbour morale bars
- **Mascot** with hover quotes and click-to-cycle alternate poses
- **Playwright E2E evaluation suite** (3 reviewer personas)

### Next Milestones

1. **Battle Configuration System** — Extract Rivoli-specific content into a data-driven battle config. Build the framework for multiple battles.
2. **Second Battle** — Implement a second battle (Arcole or Montenotte) using the battle config system.
3. **Camp Content Expansion** — Add Scout and Pray activities. Flesh out random event pool (disease, desertion, weather, supply, interpersonal, orders, rumours).
4. **Story Loop** — Branching narrative framework between battles, stat checks, consequence propagation.
5. **Stat System Expansion** — Full tertiary stats (Prestige, Rank, Reputation axes) with narrative impact.
6. **Campaign 1 Content** — All Italian Campaign battles, camp segments, story beats.
7. **Electron Wrapper** — Desktop packaging, Steam integration.
8. **Meta-Progression Expansion** — Unlockables, achievements, legacy effects.
