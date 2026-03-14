# Rivoli Battery Melee

**Context:** MeleeContext.Battery
**Encounter:** battery_skirmish (if Pierre alive) / battery (if Pierre dead)

Only reached if player chose "Charge the battery" at Story Beat 1.

---

## Battery Opponent Roster

4 opponents. In battery_skirmish, 2 active enemies at once (increasing to 3 at round 7).

### Opponent 1: Austrian Infantry Guard

> Infantry assigned to hold the captured battery. He stands between you and the guns, bayonet level. Professional. Determined.

- Type: Line
- Health: 80-95
- Stamina: 180-240
- Strength: 50

### Opponent 2: Austrian Grenadier

> A grenadier from the assault column. Tall, bearskin cap, sabre-bayonet. He fights with the economy of a man who has done this many times before.

- Type: Veteran
- Health: 90-110
- Stamina: 200-260
- Strength: 60

### Opponent 3: Austrian Infantry Guard

> Another white-coat, fighting to hold the redoubt. Younger than the first. Just as stubborn.

- Type: Line
- Health: 75-90
- Stamina: 170-220
- Strength: 48

### Opponent 4: Austrian Battery Sergeant

> The sergeant who led the assault. A big man with the calm of someone who has stormed positions before. He holds a cavalry sabre. He will not give up these guns.

- Type: Sergeant
- Health: 100-125
- Stamina: 220-280
- Strength: 75

---

## Ally Arrivals (battery_skirmish only)

### Round 3 — Pierre arrives (if Pierre alive)

> Pierre crashes through the smoke beside you, bayonet levelled. "Didn't think I'd let you have all the fun?"

**Pierre's stats:**
- Health: 75-90
- Stamina: 180-220
- Strength: 50
- Elan: 45
- Personality: Aggressive
- Note: If Pierre was wounded at Volley 3, he has `armInjured = true`

**Pierre's description:**
> Pierre fights beside you — blood on his sleeve, bayonet steady. An Arcole veteran.

### Round 5 — Jean-Baptiste arrives (if Jean-Baptiste alive)

> Jean-Baptiste appears at your shoulder, pale-faced, bayonet shaking — but here. He came.

**Jean-Baptiste's stats:**
- Health: 60-75
- Stamina: 140-180
- Strength: 38
- Elan: 30
- Personality: Cautious

**Jean-Baptiste's description:**
> Jean-Baptiste is pale, bayonet shaking — but here. He came.

### Round 7 — Reinforcements

> More Austrians pour in from the far side of the redoubt. The fight thickens.

- Max active enemies increases to 3

---

## Warning at 3 Rounds Remaining

> The redoubt is nearly clear. The last defenders cling to the guns. Almost there.

---

## Battery Victory — Transition to Masséna

After the battery melee concludes, the following transition plays:

**If Pierre survived the melee:**

> --- THE BATTERY IS YOURS ---
>
> The last defender falls. The guns are yours again — French guns, retaken by French soldiers. Pierre is beside you, blood on his sleeve, bayonet dripping. Still alive. Still standing.
>
> Captain Leclerc's voice carries across the redoubt: "Turn them! Turn the guns!"
>
> Men scramble to the pieces. Rammers are found. Powder charges. Within minutes, the captured battery roars again — this time firing in the right direction. Austrian canister tears into the white-coated columns still pressing the plateau.
>
> The 14th took back its guns. The cost is written in the bodies around the redoubt. But the guns are yours.

**If Pierre died in the melee:**

> --- THE BATTERY IS YOURS ---
>
> The last defender falls. The guns are yours again — French guns, retaken by French soldiers. Pierre is gone. You saw him fall in the press. Another name for the list.
>
> Captain Leclerc's voice carries across the redoubt: "Turn them! Turn the guns!"
>
> Men scramble to the pieces. Rammers are found. Powder charges. Within minutes, the captured battery roars again — this time firing in the right direction. Austrian canister tears into the white-coated columns still pressing the plateau.
>
> The 14th took back its guns. The cost is written in the bodies around the redoubt. But the guns are yours.

*(Transitions to Story Beat 2: Masséna)*
