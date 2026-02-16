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
| Endurance | 40 | Stamina pool size (100 + 2×end per tier), camp rest recovery, march/labor |
| Constitution | 45 | Max health pool (100 + 2×con), camp disease/sharing checks |

**Mental**

| Stat | Default | Primary Use |
|------|---------|-------------|
| Charisma | 30 | Story beat checks (Wounded Sergeant), camp socializing, NPC relationships |
| Intelligence | 30 | Letter writing quality, camp disease prevention |
| Awareness | 35 | Volley perception, gorge target accuracy (officers/wagon), camp scouting |

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
- **Stamina debuff:** Fresh=0, Tired=-5, Exhausted=-15, Spent=-25
  - NOTE: `getStaminaDebuff()` is defined but never called — stamina debuff is not currently applied to stat checks

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

`maxHealth = 100 + 2 × Constitution` (default Constitution 45 → maxHealth 190).

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

### Stamina (Tiered)

Stamina uses a **tiered pool system**. Each tier has a pool of `100 + 2 × Endurance` points. When the pool drains to 0, the player drops one tier and gets a fresh pool. Recovery that overflows a tier bumps the player up with the excess.

```
maxStamina = poolSize × 4
Fresh:     top 25% of total (tier 4)
Tired:     50–75% (tier 3)
Exhausted: 25–50% (tier 2)
Spent:     0–25% (tier 1) — at 0, player stays Spent
```

At default Endurance 40: poolSize = 180, maxStamina = 720.

| Threshold | Effects |
|-----------|---------|
| Fresh | None |
| Tired | Melee: some actions gated |
| Exhausted | -2 passive morale drain |
| Spent | -4 passive morale drain |

---

## 3. Morale System

### Passive Drain (per turn)

- **Range-based:** point-blank=-6, close=-4, medium=-2, distant=-1 (all × valor modifier: `1 - valor/200`)
- **Artillery:** -8 × valorMod
- **Casualties:** -3 per casualty × valorMod
- **Empty musket panic:** up to -6 after multiple turns unloaded
- **Health/stamina penalties** at low thresholds (see above)

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

All line combat phases play out as cinematic auto-play. The player watches volleys resolve automatically with animations and narrative cross-fades. Player agency comes through story beat choices between volley sequences.

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

Turn-based 1v1 arena combat against sequential opponents. Two contexts: **terrain** (post-line) and **battery** (if player charges). No free recovery between opponents — you fight with what you have.

### Stances

| Stance | Attack Mod | Defense Mod | Stamina Cost |
|--------|-----------|-------------|-------------|
| Aggressive | +0.20 | -0.15 | 18 |
| Balanced | 0 | 0 | 12 |
| Defensive | -0.15 | +0.20 | 6 |

### 8 Player Actions

| Action | Stamina | Hit Bonus | Damage Mod | Special |
|--------|---------|-----------|-----------|---------|
| Bayonet Thrust | 18 | 0 | 1.0× | Standard |
| Aggressive Lunge | 35 | +0.15 | 1.5× | High risk/reward |
| Butt Strike | 25 | +0.10 | 0.6× | 20% stun |
| Feint | 12 | 0 | 0 | Drains 45 opponent stamina |
| Guard | 6 | 0 | 0 | 60% block (+stance def). Failed: -30% damage |
| Dodge | 12 | 0 | 0 | 50% evade (+stance def). Success grants riposte |
| Catch Breath | -50 | 0 | 0 | Opponent gets free attack (half damage) |
| Shoot | 8 | 0 | 2.0× | One-time if musket loaded. 25% head crit kill. No strength mod |

### Hit Chance

```
hitChance = 0.60
          + stanceAttack + actionHitBonus + bodyPartMod
          + riposte(0.15) + élan/200 (or musketry/200 for Shoot)
          - moralePenalty((1-morale/max) × 0.15)
          - staminaPenalty(if <50: (50-stam) × 0.01)
clamped [0.05, 0.95]

Block chance = 0.60 + stanceDefense + élan/400
Dodge chance = 0.50 + stanceDefense + élan/400
```

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
| Conscript | Mostly guard + basic thrust. Goes aggressive when low HP |
| Line | Balanced mix. Manages stamina (catch breath when low) |
| Veteran/Sergeant | Reads player's last 3 actions. Exploits defensive patterns, counters aggression |

### Break Thresholds

- Conscripts break at 30% HP (count as kills)
- Line troops break at 20% HP
- Veterans/sergeants fight to the death

---

## 6. Camp System

Sits between battles. Each camp has a flat action pool (no day system). After each activity, 40% chance of a random event.

### Camp Flow

1. **Prologue** (pre-battle only) — Cinematic step-through intro. 5 beats of text, click-anywhere to advance. Sets up the battle and stakes. Final beat → "Make Camp" button.
2. **Camp Intro** (post-battle) — Parchment overlay with narrative, click Continue.
3. **Activity Phase** — Spend actions on activities until pool exhausted.
4. **"The Night Before"** (pre-battle only) — Narrative popup triggers at 2 actions remaining.
5. **March** — Click "March to Battle" when all actions spent.

### Pre-Battle Camp

- **8 actions** total
- **Activities (umbrella categories):**
  - **Rest** — Lay About / Bathe (cooldown 4) / Pray (once per camp)
  - **Exercise** — Fatigue Duty (Str+End) / Wrestle (Str+Con) / Run (End+Con)
  - **Arms Training** — Solo / Comrades (soldierRep ≥20) / Officers (officerRep ≥50), each with Musketry + Élan sub-options
  - **Duties** — Drill / Check Equipment / Scout the Ground / Stand Watch (locked) / Tend Wounded (locked)
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
| `soldierRep` | 0 | How rank-and-file see you |
| `officerRep` | 50 | How officers/NCOs view your discipline |
| `napoleonRep` | 0 | Whether Napoleon knows you exist |

All activities use the d100 `rollStat()` system. Results modify condition meters, reputation trackers, NPC relationships, and occasionally grant +1 to a stat.

---

## 7. NPCs

4 campaign NPCs that persist across battles:

| NPC | Role | Personality | Valor | Starting Relationship | Starting Trust |
|-----|------|------------|-------|----------------------|---------------|
| Pierre | Neighbour (left) | Stoic | 55 | 60 | 50 |
| Jean-Baptiste | Neighbour (right) | Nervous | 20 | 40 | 30 |
| Sergeant Duval | NCO | Bitter | 65 | 20 | 40 |
| Captain Leclerc | Officer | Ambitious | 60 | 30 | 30 |

- `relationship` (-100 to 100): how much they like the player
- `trust` (0 to 100): how much they rely on the player
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
- NPC relationship/trust/alive/wounded state
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
| Condition Meters (3) | Working | Persist across transitions. Stamina uses tiered pool system. |
| Morale | Deep, complete | Drain, recovery, neighbour contagion, ratchet, action gating |
| Line Combat | Complete | 11 volley defs, all auto-play |
| Melee | Complete | Stances, body targeting, 3-tier AI, break thresholds |
| Story Beats | Complete | 6 beats with branching choices |
| Camp | Complete | Flat action pool (8 pre / 6 post), umbrella activities, strain system, prologue intro, stat result popups |
| Reputation | Working | 3 group trackers (soldierRep/officerRep/napoleonRep), replaced reputation+ncoApproval |
| NPCs | Working | 4 NPCs, relationship/trust, battle sync |
| Grace | Wired | Purchase + earn + death interception implemented |
| Glory | Partial | Earn/spend functions exist, resets on init (needs fix) |
| Equipment Condition | Stub | Fields exist, never mechanically checked |
| Military Rank | Stub | Enum exists, starts at Private, no promotion mechanic |
| Stamina Debuff | Defined, unused | `getStaminaDebuff()` never called |
| Campaign | Stub | nextBattle = 'Castiglione', no second battle content |
| Dexterity → Split | Complete | Replaced by Musketry (gun skill) and Élan (melee combat) |
