# SYSTEMS — The Little Soldier: A Napoleonic Saga

Living reference for all game mechanics as they exist today. For the specific Battle of Rivoli breakdown, see [SYSTEMS-RIVOLI.md](SYSTEMS-RIVOLI.md).

---

## Game Structure

A **run** is one soldier's life through one campaign. Each run starts with character creation (stat allocation from a point pool) and ends with death or campaign completion.

```
INTRO (name + stats)
  → PRE-BATTLE CAMP (eve of battle)
    → BATTLE (line combat + melee + story beats)
      → POST-BATTLE CAMP (rest + recovery)
        → NEXT BATTLE → ...
```

Battles are the core experience. Camp phases sit between battles for recovery, stat growth, and NPC relationship building. Story beats punctuate the battle flow with narrative choices.

---

## 1. Stats

### 9 Primary Stats (all 0–100)

**Arms** (trained military skills)

| Stat | Default | Primary Use |
|------|---------|-------------|
| Musketry | 35 | Load success, gorge target accuracy, melee Shoot action |
| Élan | 35 | Melee hit/block/dodge chance |

**Physical**

| Stat | Default | Primary Use |
|------|---------|-------------|
| Strength | 40 | Melee damage modifier (0.75 + str/200), excludes Shoot |
| Endurance | 40 | Stamina pool size (30 + 1.5×end per tier), camp rest recovery, march/labor |
| Constitution | 45 | Max health pool (30 + 1.5×con), camp disease/sharing checks |

**Mental**

| Stat | Default | Primary Use |
|------|---------|-------------|
| Charisma | 30 | Story beat checks (Wounded Sergeant), camp socializing, NPC relationships |
| Intelligence | 30 | Letter writing quality, camp disease prevention |
| Awareness | 35 | Volley perception, gorge target accuracy (officers/wagon), volunteer duty (sentry/scout) |

**Spirit**

| Stat | Default | Primary Use |
|------|---------|-------------|
| Valor | 40 | Valor checks, morale drain resistance, morale recovery efficiency |

### d100 Check System (`rollStat()`)

```
target = clamp(statValue + modifier + difficulty, 5, 95)
roll d100 → success if roll <= target
```

- **Difficulties:** Easy (+15), Standard (+0), Hard (-15)
- **Fatigue debuff:** Fresh=0, Winded=-5, Fatigued=-15, Exhausted=-25
  - Applied to melee hit chance and guard block chance via `getFatigueDebuff()`
  - Fatigue accumulates at 50% of stamina spent; only reducible via Second Wind action

### Graduated Valor Roll (`rollGraduatedValor()`)

4-tier outcome based on margin above/below target:

| Margin | Result | Morale Effect |
|--------|--------|---------------|
| >= 20 | Great success | +5 |
| >= 0 | Pass | +1 |
| >= -20 | Fail | -5 |
| < -20 | Critical fail | -10, 20% minor wound |

---

## 2. Condition Meters

All 0–100, **HIGH = good**. Persist across battle → camp → battle transitions.

### Health

`maxHealth = 30 + Math.round(1.5 × Constitution)` (default Constitution 45 → maxHealth 98).

| Threshold | Range (% of max) | Effects |
|-----------|-------------------|---------|
| Unhurt | 76–100% | None |
| Wounded | 41–75% | None |
| Badly Wounded | 16–40% | -3 passive morale drain |
| Critical | 1–15% | -6 passive morale drain |
| Dead | 0 | Permadeath (save deleted) |

### Morale

| Threshold | Range | Effects |
|-----------|-------|---------|
| Steady | 76–100 | All actions available |
| Shaken | 41–75 | Aim Carefully, Hold Fire unavailable |
| Wavering | 16–40 | Stand Firm unavailable |
| Breaking | 1–15 | Most actions unavailable, rout possible |

### Stamina (Flat)

Stamina is a simple 0-to-max energy pool. `maxStamina = poolSize × 4` where `poolSize = 30 + Math.round(1.5 × Endurance)`. At default Endurance 40: poolSize = 90, maxStamina = 360. No tiers — just a single bar. Freely recoverable via Catch Breath in melee.

### Fatigue (Cumulative Wear)

Fatigue is a separate accumulator (0 to maxFatigue) that tracks cumulative combat wear. It accumulates at **50% of stamina spent** and is the source of all tier-based debuffs. `maxFatigue = maxStamina`. The only way to reduce fatigue in melee is the **Second Wind** action.

| Tier | Range (% of max) | Hit/Block Penalty | Damage | Morale Drain |
|------|-------------------|-------------------|--------|--------------|
| Fresh | 0–24% | 0 | 100% | 0 |
| Winded | 25–49% | -5% | 100% | 0 |
| Fatigued | 50–74% | -15% | 75% | -2/turn |
| Exhausted | 75–100% | -25% | 75% | -4/turn |

At default Endurance 40 (maxFatigue = 360), fatigue accumulates ~7–12 per round. Winded hits around round 12, Fatigued around round 24. Fatigue resets to 0 at phase boundaries (melee-only resource).

---

## 3. Morale System

### Passive Drain (per turn)

- **Range-based:** point-blank=-6, close=-4, medium=-2, distant=-1 (all × valor modifier: `1 - valor/200`)
- **Artillery:** -8 × valorMod
- **Casualties:** -3 per casualty × valorMod
- **Empty musket panic:** up to -6 after multiple turns unloaded
- **Health/fatigue penalties** at low thresholds (see above)

### Recovery Sources

| Source | Morale |
|--------|--------|
| Drums playing | +2 |
| Officer alive + NCO present | +1 |
| Steady neighbour | +2 |
| Wavering/Breaking neighbour | -3 |
| Low line integrity (<50) | -3 |
| Low line integrity (<70) | -1 |

### Recovery Ratchet

Positive morale changes are multiplied by an efficiency factor:

```
efficiency = (0.25 + moraleRatio × 0.75) × (0.6 + valorFactor × 0.4)
```

At 25% morale with 40 valor: efficiency ≈ 0.39 (recovery severely hampered).
At 100% morale with 80 valor: efficiency ≈ 0.92 (near full).

### Neighbour Morale (NPCs in line)

- Drain per volley: -1 base (or -2 if range < 100), artillery -1
- Player morale influence: Steady +2, Wavering -1, Breaking -2
- Breaking neighbour: 30% chance of routing (throws down musket, -15 line integrity, -6 player morale)

### Line Morale

```
combined = avg(player + neighbour morale ratios) × 0.6 + lineIntegrity/100 × 0.4
```

Thresholds: Resolute (≥0.75), Holding (≥0.55), Shaken (≥0.35), Wavering (≥0.15), Breaking (<0.15).

---

## 4. Line Combat (Auto-Play)

All line combat phases play out as cinematic auto-play. The player watches volleys resolve automatically with animations and narrative cross-fades. Player agency comes through story beat choices between volley sequences. Story beats and camp events are presented via a full-screen cinematic overlay with typewriter text and click-to-advance pacing (see DESIGN.md §9 for details).

### Drill Cycle (per volley)

```
PRESENT → FIRE → ENDURE (return fire + valor roll) → LOAD
```

Exception: Part 3 (gorge) has no ENDURE step — one-sided fire.

### Accuracy Formula

```
accuracy = baseAccuracy
         + aimBonus (if AimCarefully succeeded)
         + 0.15 (if held fire)
         × moraleThreshold penalty (Shaken: 0.85, Wavering: 0.7, Breaking: 0.4)
         clamped to [0.05, 0.90]
```

Note: Individual musketry does NOT affect standard volley fire (Parts 1-2) — you're one soldier in a line. Musketry DOES affect gorge targeting (Part 3) and the melee Shoot action.

### Load System

```
successChance = (morale/maxMorale) × (0.4 + musketry/100 × 0.4 + valor/100 × 0.2)
```

4-step animation: Bite cartridge → Pour powder → Ram ball → Prime pan. Fumbles auto-resolve.

### Line Integrity Roll

```
French roll = lineIntegrity × 0.6 + officerBonus(10) + drumsBonus(5) + random(1–100)/5
Austrian roll = enemyStrength × 0.5 + rangePressure((200-range)/4) + random(1–100)/5
```

French wins: enemy takes 2–4 extra damage. Austrian wins: line integrity -3 to -6.

### Perception System

Determines if the player sees their shot's effect:

```
perceptionChance = perceptionBase + 0.15 (if aimed) + awareness/200
clamped to [0.05, 0.95]
```

4 outcomes: hit_seen (+4 morale), hit_unseen (+1), miss_seen (-1), miss_unseen (+1).

---

## 5. Melee Combat

Sequential-resolution arena combat against a roster of opponents. Two contexts: **terrain** (post-line) and **battery** (if player charges). All combatants act each round: player → enemies → allies, with state mutations (health, stamina, death) applied immediately after each action. No free recovery between opponents — you fight with what you have.

### Stances

| Stance | Attack Mod | Defense Mod | Stamina Cost |
|--------|-----------|-------------|-------------|
| Aggressive | +0.20 | -0.15 | 14 |
| Balanced | 0 | 0 | 10 |
| Defensive | -0.15 | +0.20 | 8 |

### 8 Player Actions

| Action | Stamina | Hit Bonus | Damage Mod | Special |
|--------|---------|-----------|-----------|---------|
| Bayonet Thrust | 20 | 0 | 1.0× | Standard |
| Aggressive Lunge | 38 | -0.10 | 1.5× | High risk/reward |
| Butt Strike | 26 | +0.15 | 0 | Drains 10–15 stamina (×str mod), stun chance 25%+str/400. Immediate (no body part) |
| Feint | 14 | +0.10 | 0 | Drains 25–35 stamina + 20–30 fatigue. Immediate (no body part) |
| Guard | 12 | 0 | 0 | Hit roll first, then block (élan-based). Failed block: -15% damage. Visual: crossed-bayonets overlay |
| Catch Breath | -35 | 0 | 0 | Opponent gets free attack (70% damage) |
| Second Wind | 0 | 0 | 0 | Endurance roll to reduce fatigue by 25%. Opponent gets free attack (70% damage) |
| Shoot | 8 | 0 | 2.0× | One-time if musket loaded. 25% head crit kill. No strength mod |
| Use Canteen | 0 | 0 | 0 | Restores 20 HP. 3 uses per battle. Opponent gets free attack |

### Hit Chance

```
hitChance = 0.35
          + stanceAttack + actionHitBonus + bodyPartMod
          + riposte(0.15) + élan/120 (or musketry/120 for Shoot)
          - moralePenalty((1-morale/max) × 0.15)
          + fatigueDebuff (Fresh=0, Winded=-0.05, Fatigued=-0.15, Exhausted=-0.25)
clamped [0.05, 0.95]

Block chance = 0.10 + stanceDefense + élan/85 + fatigueDebuff, clamped [0.05, 0.95]
  (only checked when Guard active AND opponent hit roll succeeds)
```

### Morale Gating on Melee Actions

| Morale Threshold | Available Actions |
|-----------------|-------------------|
| Steady | All |
| Shaken | All except Aggressive Lunge |
| Wavering | Thrust, Guard, Catch Breath, Second Wind, Shoot only |
| Breaking | Guard, Catch Breath, Second Wind only |

### Opponent Hit Chance (Tier-Differentiated)

| Tier | Base Hit |
|------|----------|
| Conscript | 0.35 |
| Line | 0.45 |
| Veteran | 0.55 |
| Sergeant | 0.60 |

### Body Part Targeting

| Part | Hit Mod | Damage | Special |
|------|---------|--------|---------|
| Head | -0.25 | 25–35 | 10% instant kill, 35% stun |
| Torso | 0 | 15–25 | None |
| Arms | -0.10 | 10–15 | 15% arm injury (reduces opponent hit) |
| Legs | -0.15 | 10–20 | 10% leg injury (1.5× opponent stamina cost) |

### AI Tiers

| Tier | Behaviour |
|------|-----------|
| Conscript | Mostly guard + basic thrust. At <30% HP: 60% flee (respite), 40% desperate lunge |
| Line | Balanced mix with body targeting (60% torso, 20% arms, 15% legs, 5% head). Punishes player respite with lunge |
| Veteran | Reads player's last 3 actions. Counters repeated actions (Guard→Feint, Attack→Guard). Uses Feint/ButtStrike for control |
| Sergeant | 4-move pattern window. Reads stance patterns (Defensive→Feint/Lunge). Higher lunge usage (30%). Never respites until <10% stamina |

### Break Thresholds

- Conscripts break at 35% HP (count as kills)
- Line troops break at 25% HP
- Veterans break at 15% HP
- Sergeants never break (must be killed)

---

## 6. Camp System

Sits between battles. Each camp has a flat action pool (no day system). After each activity, 40% chance of a random event.

### Camp Flow

1. **Prologue** (pre-battle only) — Cinematic overlay with typewriter text. Date card subtitle, 4 narrative chunks, "Make Camp" choice button at the end. Uses the same `showCinematic()` system as story beats.
2. **Camp Intro** (post-battle) — Parchment overlay with narrative ("After the Battle"), click Continue.
3. **Activity Phase** — Spend actions on activities until pool exhausted.
4. **"The Night Before"** (pre-battle only) — Narrative popup triggers at 2 actions remaining.
5. **March** — Click "March to Battle" when all actions spent.

### Pre-Battle Camp

- **8 actions** total
- **Activities (umbrella categories):**
  - **Rest** — Lay About / Bathe (cooldown 4) / Pray (once per camp)
  - **Exercise** — Fatigue Duty (Str+End) / Wrestle (Str+Con) / Run (End+Con)
  - **Arms Training** — Solo / Comrades (soldierRep ≥20) / Officers (officerRep ≥50), each with Musketry + Élan sub-options
  - **Duties** — Drill / Check Equipment / Volunteer for Duty (random: sentry, scout, dispatches, dig) / Tend Wounded (locked)
  - **Socialize** — Talk to NPC (placeholder) / Write a Letter (illiteracy message). Does not consume action.
- Unique scripted events tied to the upcoming battle

### Post-Battle Camp

- **6 actions** total
- **Activities:** Rest, Exercise, Arms Training, Duties (Drill, Check Equipment), Socialize, Gamble, Train
- Random events across 7 categories: Disease, Desertion, Weather, Supply, Interpersonal, Orders, Rumour

### Strain System

Training activities (Exercise, Arms Training, Drill) increase strain by 25 per action. Rest reduces strain (Lay About: -15, Bathe: -25, Pray: -10). Tiers: Rested / Strained / Overworked. Higher strain adds stamina cost and morale penalties to training.

### Stat Training Results

All training shows results as a popup. Format: per-stat flavor text + result ("Your hands remember. Musketry +1" or "Your hands fumble. Musketry —").

### Reputation Trackers (3 groups, all 0-100)

| Tracker | Starts | What it tracks |
|---------|--------|---------------|
| `soldierRep` | 50 | How rank-and-file see you |
| `officerRep` | 50 | How officers/NCOs view your discipline |
| `napoleonRep` | 0 | Whether Napoleon knows you exist |

All activities use the d100 `rollStat()` system. Results modify condition meters, reputation trackers, NPC relationships, and occasionally grant +1 to a stat.

---

## 7. NPCs

4 campaign NPCs that persist across battles:

| NPC | Role | Personality | Valor | Starting Relationship |
|-----|------|------------|-------|----------------------|
| Pierre | Neighbour (left) | Stoic | 55 | 60 |
| Jean-Baptiste | Neighbour (right) | Nervous | 20 | 40 |
| Sergeant Duval | NCO | Bitter | 65 | 20 |
| Captain Leclerc | Officer | Ambitious | 60 | 30 |

- `relationship` (-100 to 100): how much they like the player
- Synced between battle and persistent state via `syncBattleResultsToNPCs()`

---

## 8. Grace and Glory

### Glory (Meta-Currency)

- Persists in localStorage across permadeath resets
- **Starting balance:** 10
- **Earned:** 1 per enemy defeated in melee
- **Spent:** Character creation — 1 Glory = +1 stat point, or 5 Glory = 1 Grace
- **Current issue:** `resetGlory()` called on init — resets to default every session (needs revisiting)

### Grace (Consumable Extra Life)

- Lives on `PlayerCharacter` (per-run, not cross-run)
- **Cap:** 2
- **Purchased:** 5 Glory during character creation
- **Earned:** TakeCommand success at Wounded Sergeant story beat (+1)
- **Effect:** When player would die, spend 1 Grace to survive at 50% of max stats
- **Display:** Grace badge on character portrait across all screens

---

## 9. Persistence

### Within a Run (battle → camp → battle)

- All 9 stats, 3 condition meters, grace, 3 rep trackers (soldierRep/officerRep/napoleonRep), equipment condition
- NPC relationship/alive/wounded state
- Campaign progress (battlesCompleted, currentBattle, daysInCampaign)

### Sync Points

| Transition | Function | What Copies |
|-----------|----------|-------------|
| Battle → Character | `syncBattleToCharacter()` | valor, soldierRep, officerRep, napoleonRep, health, morale, stamina |
| Camp → Character | `syncCampToCharacter()` | health, morale, stamina |
| Character → Battle | `createBattleFromCharacter()` | Creates fresh BattleState from PC stats |

### Save System

- Key: `the_little_soldier_save`, version `0.2.0`
- Saves entire `GameState` as JSON to localStorage
- Will NOT save if player is dead (permadeath — save deleted)
- Version check on load — incompatible versions return null

---

## 10. System Status

| System | Status | Notes |
|--------|--------|-------|
| Stats (9) | Working | All defined, used in checks |
| Condition Meters (3) | Working | Persist across transitions. Flat stamina + fatigue accumulator. |
| Morale | Deep, complete | Drain, recovery, neighbour contagion, ratchet, action gating |
| Line Combat | Complete | 11 volley defs, all auto-play |
| Melee | Complete | Stances, body targeting, 4-tier AI (conscript/line/veteran/sergeant), tier-specific break thresholds, morale gating, élan-based guard with hit→block order, SVG status icons with hover tooltips |
| Story Beats | Complete | 6 beats with branching choices, cinematic overlay presentation |
| Camp | Complete | Flat action pool (8 pre / 6 post), umbrella activities, strain system, cinematic prologue, stat result popups |
| Reputation | Working | 3 group trackers (soldierRep/officerRep/napoleonRep), replaced reputation+ncoApproval |
| NPCs | Working | 4 NPCs, relationship, battle sync |
| Grace | Wired | Purchase + earn + death interception implemented |
| Glory | Partial | Earn/spend functions exist, resets on init (needs fix) |
| Equipment Condition | Stub | Fields exist, never mechanically checked |
| Military Rank | Stub | Enum exists, starts at Private, no promotion mechanic |
| Fatigue Debuff | Active | Applied to melee hit/block via `getFatigueDebuff()`. Fatigue accumulates at 50% of stamina spent. |
| Campaign | Stub | nextBattle = 'Castiglione', no second battle content |
| Dexterity → Split | Complete | Replaced by Musketry (gun skill) and Élan (melee combat) |
