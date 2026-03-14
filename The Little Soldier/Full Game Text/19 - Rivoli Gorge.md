# Rivoli Gorge

**Story Beat 3 — THE GORGE**
Triggers after Volley 7 (chargeEncounter = 3)

---

## Narrative

> On the ridge above the plateau, a small figure on a grey horse. Even through the smoke and chaos, every man in the line knows who it is. Bonaparte.
>
> He's been there since dawn, watching, calculating, moving his pieces across this frozen chessboard. Now he moves the last one.
>
> An aide-de-camp gallops down from the ridge. The orders carry down the line like fire along a powder trail:
>
> "Every man, every gun to the ridge! The counterattack goes in NOW!"
>
> Captain Leclerc turns to the 14th. His voice is raw, half-gone, but it carries:
>
> "FOURTEENTH! To the ridge! We finish this!"
>
> Around you, the survivors of two phases of hell straighten their backs. The drums change their beat — not the steady rhythm of the line, but the pas de charge. The advance.
>
> Bonaparte is ordering the counterattack. The gorge must be sealed. And the 14th is going.

---

## Choice

### "To the ridge"

*Follow the captain. Follow Bonaparte. Follow the drums. One more time.*

> You shoulder your musket. Your legs move. Around you, the remnants of the 14th demi-brigade move with you — battered, bloodied, exhausted, and advancing.
>
> Bonaparte watches as his army surges forward. The drums beat the charge. The gorge awaits.

- Morale +5: "Napoleon's presence — the counterattack" (recovery)

---

## Gorge Arrival

> The ridge. You reach it gasping, legs burning, and look down.
>
> The gorge of the Adige opens below — a narrow defile carved through the mountains, its walls steep and unforgiving. And packed into that gorge, shoulder to shoulder, white coats crushed together like cattle in a pen: the Austrian deathtrap.
>
> Thousands of them. Columns that cannot deploy, cannot form line, cannot fight. They can only push forward into the trap or try to climb walls that offer no purchase. Their officers scream orders that no one can follow.
>
> Captain Leclerc reaches the ridge nearby. "FOURTEENTH! Fire at will!"
>
> You're in little danger here. For once.

*(Transitions to Part 3 Line Phase — Volleys 8-11, gorge volleys at 200 paces)*

---

## Gorge Target Selection System

During Part 3 volleys, the player chooses a target during the Present step of each volley. The line fires automatically during the Fire step.

### Target the Column

*Fire into the packed ranks below. Easy target. Devastating.*

**Present text:**
> You aim into the packed ranks. At this range, into that mass, you can hardly miss. You pick a point in the white-coated column and hold steady.

**Fire — Hit:**
> Hit. Column.

- Morale +2: "Your shot found its mark in the column"
- Enemy damage: 5

**Fire — Miss:**
> Fired into column.

- Morale +1: "Fired into the gorge"

---

### Target an Officer

*Pick out the man with the gorget and sash. Harder shot — bigger effect.*

**Present text:**
> You scan the gorge for the gorget, the sash, the man waving a sword. There — an officer trying to rally his men. You settle the front sight on him and hold your breath.

**Fire — Hit:**
> Hit. Officer down.

- Morale +5: "You shot an Austrian officer"
- Enemy damage: 3

**Fire — Miss:**
> Missed officer.

- Morale -1: "Missed the officer — wasted the shot"

---

### Target the Ammo Wagon

*The powder wagon, tilted on the gorge road. One good hit...*

*(Only available while wagon damage < cap)*

**Present text:**
> The ammunition wagon. Tilted on the gorge road, horses dead in the traces. You can see the powder kegs through the shattered sideboards. One good hit and...

**Fire — Hit (damage, no detonation):**
> Hit wagon. [Wagon damage: (percent)%]

- Morale +3: "Hit the wagon — something caught"

**Fire — Hit (detonation!):**
> WAGON DETONATION. The gorge erupts.

- Morale +15: "The ammunition wagon DETONATES"
- Massive enemy strength reduction

**Fire — Miss:**
> Missed wagon.

- No morale change

---

### Show Mercy

*Lower your musket. These men are already beaten. The line fires without you.*

**Present text:**
> You lower your musket. The men around you fire — the line pours its volley into the gorge — but your finger stays off the trigger.
>
> These men are beaten. They are dying in a trap. You will not add to it.
>
> No one notices. Or if they notice, no one says anything. Not here. Not now.

- Morale +3: "Compassion — you lowered your musket"
- Morale -2: "Disobeying the order to fire"
- Increments `gorgeMercyCount`
- Line still fires (reduced damage)
