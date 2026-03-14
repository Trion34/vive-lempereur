# Gorge — Targeting & Events

> Source: `src/core/scriptedVolleys.ts`

## Part 3 Volleys (8–11, all at 200 paces — shooting gallery)

### Gorge Target Selection (PRESENT Step)

#### Target the Column
**Button:** "Target the Column"
**Description:** "Fire into the packed ranks below. Easy target. Devastating."

> You aim into the packed ranks. At this range, into that mass, you can hardly miss. You pick a point in the white-coated column and hold steady.

**Hit:** "Hit. Column." (+2 morale: "Your shot found its mark in the column")
**Miss:** "Fired into column." (+1 morale: "Fired into the gorge")

#### Target an Officer
**Button:** "Target an Officer"
**Description:** "Pick out the man with the gorget and sash. Harder shot — bigger effect."

> You scan the gorge for the gorget, the sash, the man waving a sword. There — an officer trying to rally his men. You settle the front sight on him and hold your breath.

**Hit:** "Hit. Officer down." (+5 morale: "You shot an Austrian officer")
**Miss:** "Missed officer." (-1 morale: "Missed the officer — wasted the shot")

#### Target the Ammo Wagon
**Button:** "Target the Ammo Wagon"
**Description:** "The powder wagon, tilted on the gorge road. One good hit..."
*Disabled when wagon damage ≥ 100*

> The ammunition wagon. Tilted on the gorge road, horses dead in the traces. You can see the powder kegs through the shattered sideboards. One good hit and...

**Hit (not detonation):** "Hit wagon. [Wagon damage: N%]" (+3 morale: "Hit the wagon — something caught")
**Hit (detonation!):** "WAGON DETONATION. The gorge erupts." (+15 morale: "The ammunition wagon DETONATES")
**Miss:** "Missed wagon." (0 morale)

#### Show Mercy
**Button:** "Show Mercy"
**Description:** "Lower your musket. These men are already beaten. The line fires without you."

> You lower your musket. The men around you fire — the line pours its volley into the gorge — but your finger stays off the trigger.
>
> These men are beaten. They are dying in a trap. You will not add to it.
>
> No one notices. Or if they notice, no one says anything. Not here. Not now.

**Morale:** +3 ("Compassion — you lowered your musket"), -2 ("Disobeying the order to fire")

---

## Gorge Volley Narratives

### Volley 8 — First Gorge Volley
**Present:** "Fire at will. Gorge below."
**Fire Order:** "Fire at will!"
**Endure:** "Scattered return fire from below."

**Events:**
- ENDURE: "Men surrendering below. Column still advancing."
- ENDURE: Pierre: "Butcher's work." Reloads anyway. (if Pierre alive)

### Volley 9 — Easy Pickings
**Present:** "Reload. More targets below."
**Fire Order:** "Again!"
**Endure:** "Screams from below."

**Events:**
- ENDURE: "Screams from below." (-3 morale: "The sound of trapped men dying")
- ENDURE: "A boy among the dying." (-2 morale, if awareness > 40)

### Volley 10 — Column Disintegrating
**Present:** "Column breaking. Wagon visible."
**Fire Order:** "Fire!"
**Endure:** "Wounded call for help."

**Events:**
- ENDURE: "Cries for help. Some men stop firing." (-4 morale: "This is no longer battle — it's slaughter")
- ENDURE: "You showed mercy." (+3 morale, if mercy count > 0)

### Volley 11 — Final Volley
**Present:** "Last column. Wagon exposed."
**Fire Order:** "Final volley!"
**Endure:** "Silence. It's over."

**Events (wagon not yet detonated):**
- ENDURE: "Artillery hits wagon. DETONATION." (+10 morale: "The ammunition wagon detonates — artillery hit")

**Events (wagon already detonated):**
- ENDURE: "The gorge is silent. White flags." (+3 morale: "The gorge falls silent")
