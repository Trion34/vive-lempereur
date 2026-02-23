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
| **Health** | Hit Points | 0–maxHP | `maxHealth = 100 + 2×Constitution`. Not tiered — when it hits 0, you die (or Grace intervenes). Thresholds: Unhurt (≥75%), Wounded (≥40%), Badly Wounded (≥15%), Critical (<15%). Low health drains morale. |
| **Stamina** | Energy in combat and camp | 0–max | **Flat pool.** `maxStamina = poolSize × 4` where `poolSize = 30 + Math.round(1.5 × Endurance)`. No tiers — just a single bar. Freely recoverable via Catch Breath. Camp uses 0-100 percentage scale; battle uses full pool scale. |
| **Fatigue** | Cumulative combat wear | 0–max | Accumulates at 50% of stamina spent. 4 tiers: Fresh (0-24%) / Winded (25-49%) / Fatigued (50-74%) / Exhausted (75-100%). Imposes hit/block/damage penalties. Only reducible via Second Wind action. Resets at phase boundaries. |

### Arms (trained military skills)

The skills the army drills into you. Grow through practice, drill, and combat experience.

| Stat | Role | Feeds Into |
|------|------|------------|
| **Musketry** | Gun skill | Gorge target accuracy, melee Shoot action, musket loading success. Does NOT affect standard volley fire. |
| **Élan** | Close combat | Melee hit chance, block chance, dodge chance. The aggressive spirit of the bayonet charge. |

### Physical

Your body — what you were born with, what the march has made of you.

| Stat | Role | Feeds Into |
|------|------|------------|
| **Strength** | Melee damage | Damage multiplier in melee (excludes Shoot). Physical checks (lifting, carrying, breaking). |
| **Endurance** | Stamina pool size | Determines stamina pool size (30 + 1.5×end) and max fatigue. Camp rest recovery, march/labor checks. |
| **Constitution** | HP pool | Max health pool (100 + 2×con). Camp disease/sharing checks. |

### Mental

Your mind — how you read people, situations, and yourself.

| Stat | Role |
|------|------|
| **Charisma** | Persuasion, leadership checks. Rally other soldiers. Talk your way out of trouble. |
| **Intelligence** | Tactical awareness, problem-solving. Recognize ambushes, understand orders, improvise. |
| **Awareness** | Perception checks. Notice danger, spot opportunities, read people. |

### Spirit

Your nerve — the thing that keeps you standing when everything says run.

| Stat | Role | Feeds Into |
|------|------|------------|
| **Valor** | Morale resilience | Morale recovery ratchet efficiency. Courage checks (standing firm, leading by example). Morale drain resistance (valorMod = 1 - valor/200). |

### Other Tracked Values

| Value | Role |
|-------|------|
| **Prestige** | Composite score: past actions + attire + equipment + medals + promotions. Social currency. Not directly rollable. |
| **Rank** | Military rank (Private → Corporal → Sergeant → ...). Unlocks dialogue options, authority, and responsibilities. |
| **Reputation: Troops** | How the rank-and-file see you. Earned through shared hardship, courage, and solidarity. |
| **Reputation: Officers** | How your superiors see you. Earned through obedience, initiative, and results. |
| **Reputation: Bonaparte** | Whether the General has noticed you. Rare, high-stakes, campaign-defining. |

### Stat Interactions

```
Arms → Combat:
  Musketry   → Gun accuracy (gorge/melee Shoot), load success
  Élan       → Melee hit, block, dodge

Physical → Meters:
  Strength   → Melee Damage
  Endurance  → Stamina pool size, max fatigue
  Constitution → Max Health pool (100 + 2×con)

Mental → Narrative:
  All mental stats serve as roll targets for narrative/choice checks

Spirit → Morale:
  Valor      → Morale recovery efficiency (ratchet formula), drain resistance
```

### Roll System

**Combat rolls:** d100 against target derived from relevant stat + situational modifiers. Success threshold clamped to 5-95 (nothing is guaranteed, nothing is impossible).

**Narrative checks:** Same d100 system. Stat + modifier vs difficulty. Multiple stats can apply to a single check (e.g., Awareness + Intelligence for tactical perception). Fatigue debuff: when Fatigue is high, melee hit/block chances are penalized (Fresh=0, Winded=-5%, Fatigued=-15%, Exhausted=-25%).

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

**Melee** — Close combat with sequential resolution. Stance/action/target system. Each round: player acts → enemies counter-attack → allies act, with state changes (health, stamina, death) applied immediately. Individual opponents with AI personalities and break thresholds.

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

**Recovery Ratchet:** Recovery is harder as morale drops. Formula: `efficiency = (0.25 + ratio * 0.75) * (0.6 + valorFactor * 0.4)`. Valor stat softens the ratchet — brave soldiers recover faster even at low morale.

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

**Auto-Load Roll** (`rollAutoLoad`): Success based on morale + valor + musketry. Fumbled load → musket empty for next volley.

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
| Fire | Shaken | Standard volley. Accuracy = range base + held bonus (individual skill does not affect line volleys). |
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

**Load Step:** Automatic. Roll based on morale + valor + musketry. Failure = fumbled load.

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

**Glory Earned:** 1 Glory per enemy defeated in melee (see *Grace and Glory* in §8). At melee end, a glory summary overlay shows kills, glory earned, and total glory.

**Stance (toggle any time):**
| Stance | Attack Mod | Defense Mod | Stamina Cost |
|--------|-----------|-------------|--------------|
| Aggressive | +20% | -15% | 14 |
| Balanced | +0% | +0% | 10 |
| Defensive | -15% | +20% | 8 |

**Actions:**
| Action | Stamina | Hit Bonus | Damage | Special |
|--------|---------|-----------|--------|---------|
| Bayonet Thrust | 20 | +0% | 1.0x | Standard attack |
| Aggressive Lunge | 38 | -10% | 1.5x | High risk, high reward |
| Butt Strike | 26 | +15% | 0 | Drains stamina (str-scaled), stun chance (25%+str/400). Immediate |
| Feint | 14 | +10% | 0 | Drains 25-35 stamina + 20-30 fatigue. Immediate |
| Guard | 12 | — | — | Hit roll first → block roll (élan-based). Blocked = no damage. Failed block = -15% damage |
| Catch Breath | -35 | — | — | Recover stamina. Opponent gets free attack |
| Second Wind | 0 | — | — | Endurance roll to reduce fatigue 25%. Opponent gets free attack |
| Use Canteen | 0 | — | — | Restores 20 HP. 3 uses per battle. Opponent gets free attack |

**Body Part Targeting:**
| Part | Hit Modifier | Damage Range | Special |
|------|-------------|--------------|---------|
| Head | -25% | 25-35 | 10% instant kill, 35% stun |
| Torso | +0% | 15-25 | Standard |
| Arms | -10% | 10-15 | 15% arm injury (opponent damage reduced) |
| Legs | -15% | 10-20 | 10% leg injury (opponent stamina costs increased) |

**Hit Chance Formula:**
```
hitChance = 0.35 (base)
  + stanceMod
  + actionHitBonus
  + bodyPartMod
  + Élan/120 (or Musketry/120 for Shoot)
  + riposte (0.15 if active)
  + fatigueDebuff (Fresh=0, Winded=-0.05, Fatigued=-0.15, Exhausted=-0.25)
  - moralePenalty ((1-morale/max) × 0.15)
```
Clamped to [0.05, 0.95].

**Opponent AI:**
Personality types with distinct behavior patterns:
- **Conscript:** Panics at low health (40% lunge), otherwise guards/thrusts conservatively.
- **Line Infantry:** Balanced. Varies attacks, manages stamina well, targets body/arms/legs.
- **Veteran/Sergeant:** Reads player patterns (last 3 actions). Adapts to defensive players with feints, adapts to aggressive players with guards. Uses Feint/ButtStrike for control.

**Between Opponents:** No free recovery — you fight with what you have. NPC narrative beats (e.g., JB's arc callback).

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
| **Train** | Medium | Improve combat stats. Drill improves Musketry. Sparring improves Élan/Strength. Marching improves Endurance. | Implemented |
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

Secondary stats grow through targeted training activities and camp activities. Growth is slow and gated by:
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

### Grace and Glory (Implemented)

Two complementary meta-resources that soften permadeath while preserving its stakes.

**Glory** — Cross-run meta-progression currency. Persists in localStorage across permadeath resets.

- **Earned:** 1 Glory per enemy defeated in melee combat
- **Starting balance:** 10 Glory for first character creation
- **Spent during:** Character creation — 1 Glory = +1 to a selected stat (up to stat max), or 5 Glory = 1 Grace
- **Displayed:** Glory banner in intro screen, post-melee summary overlay
- **Persistence:** Separate from save data — survives permadeath
- **Reset:** Resets to starting balance on New Game

**Grace** — Consumable extra life. Lives on `PlayerCharacter` (per-run, not cross-run).

- **Cap:** 2 maximum
- **Purchased:** 5 Glory per Grace during character creation
- **Earned:** +1 Grace from succeeding the TakeCommand valor check at the Wounded Sergeant story beat
- **Trigger:** When the player would die (health reaches 0), Grace is offered before the death screen
- **Effect:** Spend 1 Grace → health, morale, and stamina restored to 50% of max. Battle continues.
- **Popup:** "GRACE INTERVENES" overlay (gold-bordered, laurel themed) shows stat restoration and remaining Grace
- **Displayed:** 🌿 badge on player portrait (line, melee, camp), Grace count in parchment status bar, Grace row in battle HUD (hidden at 0)
- **Death interception points:** Auto-play Part 1 volleys, auto-play Part 3 gorge volleys, melee combat, turn-by-turn line combat
- **Design intent:** Grace is rare and precious — at most 2 per run. It turns a guaranteed death into a second chance at 50% stats, still precarious. The player must earn or invest to get it.

### Between Runs

- **Glory:** Accumulated across runs. Allows stronger starting stats and Grace purchases on subsequent characters.
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

- **Runtime:** Browser (Electron + Steam planned for distribution)
- **Build:** Vite + TypeScript (strict mode)
- **UI Framework:** React 19 with function components and hooks
- **State Management:** Zustand stores (`gameStore`, `uiStore`, `settingsStore`, `gloryStore`)
- **Testing:** Vitest + @testing-library/react (523 tests), ESLint
- **CSS:** Vanilla CSS with CSS custom properties (`--parchment-dark`, `--ink-primary`, etc.)

### Component Architecture

React components organized by responsibility:

| Layer | Path | Examples |
|-------|------|---------|
| Pages | `src/pages/` | `IntroPage`, `CampPage`, `LinePage`, `MeleePage`, `StoryBeatPage` |
| Components | `src/components/` | `ErrorBoundary`, `DevToolsPanel`, `CombatantCard`, `MeterBar` |
| Overlays | `src/components/overlays/` | `SettingsPanel`, `CinematicOverlay`, `BattleOverScreen` |
| Hooks | `src/hooks/` | `useMeleeAnimation`, `useCinematic`, `useAudioInit` |
| Stores | `src/stores/` | `gameStore`, `uiStore`, `settingsStore`, `gloryStore` |
| Core Logic | `src/core/` | `battle`, `charge`, `melee/`, `volleys/`, `preBattleCamp` |
| Data Layer | `src/data/` | `encounters.ts`, `campEvents.ts` (narrative content separated from logic) |
| Types | `src/types/` | `enums.ts`, `player.ts`, `battle.ts`, `camp.ts`, `melee.ts` |

### Phase-Based Routing

`AppRoot.tsx` reads `gameStore` state and renders the appropriate page component:

| Phase | Component | Layout |
|-------|-----------|--------|
| Intro | `IntroPage` | Character creation (name + stats) |
| Camp | `CampPage` | Activity selection, event overlays, camp log |
| Line | `LinePage` | 3-column (player panel / center narrative / enemy panel) |
| Story Beat | `StoryBeatPage` | Cinematic overlay with typewriter text + choices |
| Melee | `MeleePage` | Arena (combatant cards, combat log, action grid) |
| Opening Beat | `OpeningBeatPage` | Cinematic prologue sequence |
| Credits | `CreditsScreen` | End-of-game credits |

### Cinematic Overlay System

Story beats and camp events use a full-screen cinematic overlay (`src/components/overlays/CinematicOverlay.tsx`) with:

- **Typewriter effect** — Large serif text (30px EB Garamond) typed at ~35 chars/sec with blinking cursor. Click mid-typing to skip to full text.
- **Chunk-based pacing** — Each narrative chunk replaces the previous (not accumulating). Click to advance through chunks.
- **Pre-rendered text** — Full paragraph rendered with untyped portion set to `visibility: hidden`, eliminating word-wrap reflow during typing.
- **Choices** — Appear at bottom after final chunk. Each choice has a label and description.
- **Result screen** — After a choice, `showResult()` types out the consequence with optional stat changes display and roll display (pass/fail badge in top-left corner).
- **"Fate Beckons..." splash** — Semi-transparent overlay shown before cinematic sequences, click to proceed.
- **State machine:** `TYPING → CHUNK_COMPLETE → TYPING (next) → CHOICES_VISIBLE → (choice) → RESULT_TYPING → RESULT_COMPLETE → (continue)`

### Error Boundary

`ErrorBoundary` (React class component) wraps the entire app. On unhandled errors:
- Displays an in-game-styled fallback ("Something went wrong") with collapsible error details
- "Try to Continue" — clears error state, re-renders children
- "Restart Game" — clears localStorage save + reloads

### State Management

Zustand stores provide reactive state with direct subscription from any component:

- **`gameStore`** — Core game state (`GameState`, `GamePhase`), turn dispatch, phase transitions
- **`uiStore`** — Transient UI state (overlays, pending choices, animation flags)
- **`settingsStore`** — Persisted user preferences (volume, display, gameplay options)
- **`gloryStore`** — Cross-run meta-progression (Glory balance, spent tracking)

Game logic in `src/core/` remains pure — functions take state and return new state. Stores call core functions and update reactively.

### Save System (Implemented)

- Auto-save after every volley, every melee exchange, every camp activity, and every story beat choice
- Save format: `{ version: "0.2.0", gameState: GameState, timestamp: number }` stored in localStorage
- Permadeath: save auto-deleted when `player.alive === false` (Grace interception happens before this)
- Glory persisted separately (survives permadeath) under its own localStorage key; Grace lives on PlayerCharacter (per-run)
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
- Stamina is a flat pool (no tiers). Fatigue is a separate accumulator (0 to maxFatigue) with 4 tiers: Fresh / Winded / Fatigued / Exhausted. Fatigue accumulates at 50% of stamina spent and imposes all tier-based debuffs.

---

## 10. Content Roadmap

### Built

**Gameplay:**
- **Full Battle of Rivoli** across 3 battle parts (11 volleys, melee, 6 story beats)
- **Cinematic auto-play** for all volley sequences (Parts 1-3)
- **Graduated valor rolls** (4-tier) and **line integrity rolls** per volley
- **Gorge target selection** (Column/Officers/Wagon/Mercy) with wagon detonation mechanic
- **Melee combat** with sequential exchanges, wind-up/clash animations, break detection, glory summary
- **6 story beat encounters** (Wounded Sergeant, Fix Bayonets, Battery, Masséna, Gorge, Aftermath)
- **Morale system** with thresholds, drain, recovery, ratchet, contagion
- **Persistent condition meters** (health/morale/stamina carry across all phases)
- **Grace and Glory system** (Glory: earned in melee, spent on stats/Grace, persists across runs; Grace: consumable extra life, restores to 50%, earned via TakeCommand or purchased for 5 Glory)
- **Save/persistence system** with auto-save, permadeath deletion, mid-auto-play resume
- **Music system** (2-track with crossfade)
- **Camp loop** (pre-battle: 8 activities with umbrella categories; post-battle: 6 activities)
- **Named NPC arcs** (Pierre, Jean-Baptiste, Captain Leclerc, Sergeant Duval)
- **Player portrait** and line status panel with neighbour morale bars
- **Mascot** with hover quotes and click-to-cycle alternate poses

**Technical Foundation:**
- **React 19 + Zustand** architecture with typed stores and function components
- **523 unit + integration tests** (Vitest + @testing-library/react)
- **ESLint** with zero errors
- **Error boundary** with in-game-styled fallback UI
- **Narrative data layer** — encounter definitions and camp event prose extracted from logic into `src/data/`
- **Animation decomposition** — melee animation monolith split into 5 focused sub-modules (`effects`, `meters`, `cardSpawn`, `reload`, `constants`)
- **React DevTools panel** (backtick toggle) with Jump, Player, Battle, Actions, and Audio tabs
- **Settings panel** with Display, Audio, and Gameplay tabs
- **Phase-based routing** via `AppRoot` reading Zustand store state
- **Production build** at 512KB (testScreen excluded from production bundle via dynamic import)

### Next Milestones

1. **Battle Configuration System** — Extract Rivoli-specific content into a data-driven battle config. Build the framework for multiple battles.
2. **Second Battle** — Implement a second battle (Arcole or Montenotte) using the battle config system.
3. **Camp Content Expansion** — Add Scout and Pray activities. Flesh out random event pool (disease, desertion, weather, supply, interpersonal, orders, rumours).
4. **Story Loop** — Branching narrative framework between battles, stat checks, consequence propagation.
5. **Stat System Expansion** — Full tertiary stats (Prestige, Rank, Reputation axes) with narrative impact.
6. **Campaign 1 Content** — All Italian Campaign battles, camp segments, story beats.
7. **Electron Wrapper** — Desktop packaging, Steam integration.
8. **Meta-Progression Expansion** — Unlockables, achievements, legacy effects.
