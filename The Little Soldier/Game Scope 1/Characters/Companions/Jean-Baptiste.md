---
type: companion
faction: French
unit: 14th demi-brigade
rank: Private
role: rightNeighbour
relationship: 40
melee_personality: cautious
stats:
  valor: 20
  morale: 70
  maxMorale: 85
  strength: 38
  elan: 30
---

## Overview
The frightened youth. The player's right neighbour in the line. Young, nervous, afraid — but he does not break. His arc is the transformation from terrified boy to soldier.

## Appearance
- "Jean-Baptiste grips his musket nervously." (opening narrative)
- White as chalk, pale, hands shaking
- "Grips his musket like a drowning man"
- "His hands shake — but he does it." (fixing bayonet)
- By Massena's Respite: "Pale but upright. He checks his flint with hands that barely shake anymore."

## Background
- Talks about home: the bakery, the river, his sister's cat
- First battle — has no prior combat experience
- "It's been a long road, hasn't it? Since Voltri." (Night Before)

## Personality
- Fearful, anxious, low valor (20)
- Cautious in melee combat
- Talks rapidly when nervous — about home, about anything but tomorrow
- Prone to panic but will hold if given direction
- Responsive to encouragement
- "He believes you. Mostly."

## Role in Demo

### Camp
- **JB's Fear** (random event): Found behind the supply wagon, sitting in the dark, hands shaking. "I can't do it. Tomorrow. The line. I can't." Three choices:
  - Reassure (Charisma check): Success — "Beside you. I can do that." Failure — "You're afraid too." (Not a question.)
  - Tell Him the Truth (Valor check): Success — "The brave ones just march anyway." (Repeating the player's words.) Failure — "So there's no hope then."
  - Say Nothing: Sit with him in silence. "Sometimes presence is enough."
- **Short Rations** (random event): Has already finished his own food. Stares at the player's portion. Player can Share (Con check) or keep their share. Share success: "I can't—" Then eats it, won't forget. Share failure: Player weakened.
- **The Night Before** (scripted): Jerks the player from reverie. "It's been a long road, hasn't it? Since Voltri."
- **Officer's Briefing** (volunteer success): "White as chalk, falls in beside you without a word."
- **Officer's Briefing** (volunteer failure): "Stumbles forward, hands shaking, refusing to meet anyone's eyes. But he is there."
- **Socialize**: Talks rapidly about home — the bakery, the river, his sister's cat.

### Line Part 1
- Opening: "To your right, Jean-Baptiste grips his musket nervously."
- JB crisis auto-set to "steadied" at Volley 2 (no check)
- **Melee Transition**: "Jean-Baptiste fixes his bayonet. His hands shake — but he does it." Always alive and unwounded at this point.

### Battery Decision
- **Charge**: Lost track of in the cacophony alongside Pierre.
- **Hold Back**: "Jean-Baptiste is beside you. He didn't charge either. Neither of you speaks."

### Battery Melee
- Joins as ally at Round 5 (if alive).
- Arrival: "Jean-Baptiste appears at your shoulder, pale-faced, bayonet shaking — but here. He came."

### Massena's Respite
- Alive: "Jean-Baptiste is pale but upright. He checks his flint with hands that barely shake anymore. He's become a soldier."
- Check on Comrades (alive): "'I won't break,' he says. You believe him. Mostly."

### Line Part 2
- "Jean-Baptiste somewhere behind, still carrying his musket, still in the line."

### Aftermath
- Alive: "Jean-Baptiste stands at the ridge's edge, musket grounded, staring at the gorge. He is pale but upright. Whatever you said to him during the second volley held. He made it through."
- Find Your Comrades (alive): "'I didn't break,' he says. You grip his shoulder. 'No. You didn't.'"
- Find Your Comrades (dead): "Someone has crossed his hands over his chest. He looks younger than you remembered. You kneel beside him for a moment. 'You didn't break,' you say to no one."
- Dead (general): "Jean-Baptiste is not at the ridge. He fell at the battery. Someone will tell his family. Someone must."

### Part 1 Complete
- Charged: "Jean-Baptiste is alive. Somehow. He sits against a wheel of the nearest gun, staring at nothing. His bayonet is red. He will never be the same boy who gripped his musket like driftwood at dawn."
- Held Back: "Jean-Baptiste is beside you. He didn't charge either. Neither of you speaks. There is nothing to say."

## Arc
Frightened youth transforms into a soldier through the crucible of battle. "He will never be the same boy who gripped his musket like driftwood at dawn." His defining moment is the Aftermath: "I didn't break."

## Relationships
- **Player**: Starts at 40. Built through reassurance and shared fear. The player's words at JB's Fear event echo through the battle.
- **Pierre**: Unspoken contrast — Pierre is what JB might become, if he survives long enough.
- **Duval**: Authority figure. JB follows orders even when terrified.

## Design Notes
- Melee personality: cautious (more guards, targets weakest enemy)
- Melee ally stats: HP 60-75, Stamina 140-180, Str 38, Élan 30
- Appears Round 5 of battery_skirmish if alive
- JB crisis auto-sets to "steadied" at Volley 2 (deterministic, no check)
- Always alive and unwounded at Melee Transition
- Can die in melee combat — dynamic text exists for JB alive vs dead at: Aftermath, Find Your Comrades, Part 1 Complete
- Syncs back to NPC after battle via `syncBattleResultsToNPCs`
