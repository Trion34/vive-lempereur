# Melee Actions & Combat

> Source: `src/core/melee.ts`, `src/ui/meleePhase.ts`

## Stances
| Stance | Attack Mod | Defense Mod | Stamina/Round |
|--------|-----------|-------------|---------------|
| AGGRESSIVE | +20% | -15% | 14 |
| BALANCED | 0 | 0 | 10 |
| DEFENSIVE | -15% | +20% | 8 |

---

## Attack Actions

### Bayonet Thrust [Q]
**Display:** "BAYONET THRUST"
**Stamina:** 20 | **Hit Bonus:** 0 | **Damage:** 1.0x
*Opens body part picker*

### Aggressive Lunge [W]
**Display:** "LUNGE"
**Stamina:** 38 | **Hit Bonus:** -10% | **Damage:** 1.5x
*Opens body part picker*

### Butt Strike [E]
**Display:** "BUTT STRIKE"
**Stamina:** 26 | **Hit Bonus:** +15% | **Damage:** 0 HP
*Immediate (no body part). Drains 10–15 stamina scaled by strength. Stun chance: 25% + str/400*

### Feint [R]
**Display:** "FEINT"
**Stamina:** 14 | **Hit Bonus:** +10% | **Damage:** 0 HP
*Immediate (no body part). Drains 25–35 stamina + 20–30 fatigue.*

### Shoot [T]
**Display:** "SHOOT"
**Stamina:** 8 | **Hit Bonus:** 0 | **Damage:** 2.0x
*Uses musketry stat. Opens body part picker. Requires loaded musket.*

---

## Defense & Recovery Actions

### Guard [A]
**Display:** "GUARD"
**Stamina:** 12
*Braces for attack. Hit roll first, then block roll if hit connects. Failed block = 15% damage reduction.*

### Catch Breath [S]
**Display:** "CATCH BREATH"
**Stamina:** -35 (restores)
*Opponent gets free attack.*

### Second Wind [D]
**Display:** "SECOND WIND"
**Stamina:** 0
*Endurance roll (end + random 0–50 > 60). Reduces fatigue by 25%. Opponent gets free attack.*

**Success animation:** "SECOND WIND — SUCCESS"
**Fail animation:** "SECOND WIND — FAILED"

### Reload [F]
**Display:** "RELOADING"
**Stamina:** 14
*Two-step reload process. Steps: "Bite cartridge" → "Pour powder" → "Ram ball" → "Prime pan"*

### Drink Canteen [1 in Inventory]
**Display:** "DRINK CANTEEN"
**Label:** "Drink Canteen ([N] left)"
**Description:** "Restore health. Opponent gets a free attack."
*Restores 20 HP. 3 uses per battle.*

---

## Flee (Breaking Morale Only)
**Display:** "Flee" [X]
> You can't take any more. Drop everything and run.

**Resolution:**
> You can't. You can't do this anymore. The bayonet drops. Your legs carry you backwards, then sideways, then away — stumbling down the rocky slope. Running. The shame will come later. Right now there is only the animal need to survive.

---

## Body Part Targets
| Target | Effect | Hit Modifier |
|--------|--------|-------------|
| Head | Stun + kill chance | -25% |
| Torso | Standard damage | 0 |
| Arms | Arm injury | -10% |
| Legs | Slows opponent | -15% |

---

## Opponent Roster — Terrain Melee

### Austrian Conscript (×2)
**Type:** conscript | **HP:** 65–85 | **Stamina:** 150–200 | **Str:** 40

> He stumbles through the vineyard wall, white coat torn on the stones. Wide-eyed, shaking. His bayonet weaves like a drunk's sword.

> Another white coat scrambles over the low wall. Young — impossibly young. His musket is longer than he is tall. He screams as he comes.

### Austrian Line Infantryman
**Type:** line | **HP:** 80–95 | **Stamina:** 180–240 | **Str:** 50

> A career soldier pushes through the gap in the stone wall. Calm enough. Steel levelled, feet planted among the vines. He knows the drill.

### Austrian Veteran
**Type:** veteran | **HP:** 95–115 | **Stamina:** 200–260 | **Str:** 65

> This one is different. Steady hands, dead eyes, a scar across his jaw from some forgotten battle. He steps over the vineyard wall without hurrying.

---

## Opponent Roster — Battery Melee

### Austrian Infantry Guard (×2)
**Type:** line | **HP:** 75–95 | **Stamina:** 170–240 | **Str:** 48–50

> Infantry assigned to hold the captured battery. He stands between you and the guns, bayonet level. Professional. Determined.

> Another white-coat, fighting to hold the redoubt. Younger than the first. Just as stubborn.

### Austrian Grenadier
**Type:** veteran | **HP:** 90–110 | **Stamina:** 200–260 | **Str:** 60

> A grenadier from the assault column. Tall, bearskin cap, sabre-bayonet. He fights with the economy of a man who has done this many times before.

### Austrian Battery Sergeant
**Type:** sergeant | **HP:** 100–125 | **Stamina:** 220–280 | **Str:** 75

> The sergeant who led the assault. A big man with the calm of someone who has stormed positions before. He holds a cavalry sabre. He will not give up these guns.

---

## Ally Templates

### Pierre (Aggressive)
**HP:** 75–90 | **Stamina:** 180–220 | **Str:** 50 | **Élan:** 45
> Pierre fights beside you — blood on his sleeve, bayonet steady. An Arcole veteran.

**Arrival:** "Pierre crashes through the smoke beside you, bayonet levelled. 'Didn't think I'd let you have all the fun?'"

### Jean-Baptiste (Cautious)
**HP:** 60–75 | **Stamina:** 140–180 | **Str:** 38 | **Élan:** 30
> Jean-Baptiste is pale, bayonet shaking — but here. He came.

**Arrival:** "Jean-Baptiste appears at your shoulder, pale-faced, bayonet shaking — but here. He came."

---

## Wave Events (Battery Skirmish)

- **Round 3:** Pierre joins (if alive)
- **Round 5:** Jean-Baptiste joins (if alive)
- **Round 7:** "More Austrians pour in from the far side of the redoubt. The fight thickens." (max enemies → 3)

---

## Animation Text
- "HIT" / "MISS" / "BLOCKED"
- "[NAME] JOINS THE FIGHT"
- "[Name] guards" / "[Name] catches breath" / "[Name] reloads" / "[Name] finds second wind" / "[Name] drinks from canteen"
- "CATCH BREATH" / "DRINK CANTEEN"
- Floating: "-[N]" (damage), "+[N] HP" (heal), "BLOCKED", status effects

## Status Tooltips
- "Stunned — Cannot act this turn"
- "Guarding — Braced for the next attack"
- "Arm Injured — Hit chance reduced"
- "Leg Injured — Stamina costs increased"
- "Dead"

## Glory Summary (Post-Melee)
**Title:** "GLORY EARNED"
> [N] enemy/enemies defeated
> +[N] Glory
> Total: [N]

## Grace Intervenes
**Title:** "GRACE INTERVENES"
> Fate is not finished with you. A hand steadies your arm. Breath returns. The world swims back into focus.
> Health restored to [N] | Morale to [N] | Stamina to [N]
> Grace remaining: [N]
