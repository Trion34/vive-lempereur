# UI & System Text

> Source: `src/app.ts`, `src/ui/overlays.ts`, `src/ui/meleePhase.ts`

---

## Phase Headers
- "PHASE 1: THE LINE"
- "PHASE 2: MELEE"
- "PHASE 3: HOLD THE LINE" (Part 2)
- "PHASE 4: THE GORGE" (Part 3)
- "THE BATTERY" / "THE BATTERY CHARGE"
- "MASSÉNA'S ARRIVAL"
- "THE GORGE"
- "THE AFTERMATH"
- "THE WOUNDED SERGEANT"
- "FIX BAYONETS"

---

## Player Status Labels

### Health States
- UNHURT
- WOUNDED
- BADLY WOUNDED
- CRITICAL

### Morale Thresholds
- Steady
- Shaken
- Wavering
- Breaking

### Musket Status
- Loaded / Empty

---

## Enemy Panel Labels

### Enemy Quality
- Conscripts / Line Infantry / Veterans / Imperial Guard

### Enemy Strength
- Full Strength / Bloodied / Weakened / Shattered / Broken

### Enemy Morale
- Advancing / Holding / Wavering / CHARGING! / Resolute / TRAPPED

### Artillery
- Active / Silent

### Cavalry
- "Sighted on flank!" / "None sighted"

---

## Line Status Labels

### Neighbour States
- DEAD / ROUTING / WOUNDED

### Line Morale
- Resolute / Holding / Shaken / Wavering / Breaking

---

## Melee Arena Labels
- "Round [X] / [MAX]"
- "Kills: [N]"

### Fatigue Tiers
- FRESH / WINDED / FATIGUED / EXHAUSTED

### Melee Enemy Type Display
- Conscript / Line Infantry / Veteran / Sergeant

---

## Character Panel
**Stats:** Name, Rank, Valor, Musketry, Élan, Strength, Endurance, Constitution, Charisma, Intelligence, Awareness, Soldier Rep, Officer Rep, Napoleon Rep
**Battle stats:** Morale, Health, Stamina, Volleys Fired

---

## Inventory Panel

| Item | Name | Description |
|------|------|-------------|
| Musket | Charleville M1777 | .69 calibre smoothbore musket |
| Bayonet | Socket Bayonet | 17-inch triangular blade |
| Cartridges | Cartridge Pouch | Paper cartridges with ball & powder |
| Canteen | Canteen | Tin water flask |
| Uniform | Uniform | 14th Demi-brigade, blue coat & white facings |
| Kit | Kit | Pack, bedroll, rations |

**Dynamic:** "~40 remaining" (cartridges), "[N] drink(s) left" (canteen), "Loaded"/"Empty" (musket), "Condition: [N]%" (musket/uniform)

---

## Melee Transition Text (battle.ts)

### Terrain Melee → Battery Story Beat
> The fighting ebbs. Not a victory — not a defeat. The Austrians pull back through the broken ground, regrouping. You lean on your musket, gasping. Around you, the survivors of the 14th do the same.
>
> But the battle is not over. Not even close.

### Battery Retaken
> --- THE BATTERY IS YOURS ---
>
> The last defender falls. The guns are yours again — French guns, retaken by French soldiers. [Pierre status clause]
>
> Captain Leclerc's voice carries across the redoubt: "Turn them! Turn the guns!"
>
> Men scramble to the pieces. Rammers are found. Powder charges. Within minutes, the captured battery roars again — this time firing in the right direction. Austrian canister tears into the white-coated columns still pressing the plateau.
>
> The 14th took back its guns. The cost is written in the bodies around the redoubt. But the guns are yours.

**Pierre alive:** "Pierre is beside you, blood on his sleeve, bayonet dripping. Still alive. Still standing."
**Pierre dead:** "Pierre is gone. You saw him fall in the press. Another name for the list."

### Melee Warning (3 rounds remaining)
**Terrain:** "The fighting is thinning. The Austrians are faltering in the broken ground. A few more exchanges..."
**Battery:** "The redoubt is nearly clear. The last defenders cling to the guns. Almost there."

### Melee Defeat
> The bayonet finds you. You go down in the press of bodies, in the mud and the blood. The field takes you.

### Melee Rout
> You can't. You can't do this anymore. The bayonet drops. Your legs carry you backwards, then sideways, then away — stumbling down the rocky slope. Running. The shame will come later. Right now there is only the animal need to survive.

---

## Neighbour Routs (Dynamic)
> [Name] breaks! He throws down his musket and runs.

---

## Cinematic Splash
> Fate Beckons...

---

## Load Animation
**Title:** "RELOADING"
**Verdict:** "LOADED" / "FUMBLED"

---

## Valor Check Display
**Title:** "VALOR CHECK"
**Outcomes:** STEELED / HELD STEADY / SHAKEN / NEARLY BROKE
**Summary:** "Morale: [sign][value]"
