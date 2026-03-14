---
type: officer
faction: French
unit: 14th demi-brigade
rank: Captain
role: officer
relationship: 30
stats:
  valor: 60
  morale: 90
  maxMorale: 100
---

## Overview
Company commander of the 14th. The voice of command throughout the battle. Begins ambitious, ends aged. His orders are the constant thread binding the player's experience together.

## Appearance
- "Thirty paces away" during the opening
- After volleys: "Torn coat, black with powder"
- Voice: "Raw, half-gone but carries"
- Camp: "His eyes shine in the firelight"
- Bonaparte event: "Sharp profile lit by the flames"
- Aftermath: Sword sheathed. "His eyes are old."

## Personality
- Charismatic leader who leads from the front
- Ambitious — "We'll make captain yet." (He means himself but includes the player in the dream.)
- Calm under fire, gives clear commands
- Rallies men with presence and voice
- By the end, the ambition has been burned away — "his eyes are old"

## Role in Demo

### Camp
- **Socialize**: "Speaks of glory and promotion. His eyes shine in the firelight. 'We'll make captain yet,' he says. He means himself but includes you in the dream."
- **Bonaparte Rides Past**: Steady even with the general watching.

### Line Part 1
- **Wounded Sergeant**: "Thirty paces to the left, dealing with a gap in the line where an entire file went down." Does not speak directly. Hasn't seen Duval go down.
- **Volley 3 (scripted)**: "Steady, Fourteenth!" (+4 morale)
- **Melee Transition**: "FOURTEENTH! EN AVANT!"

### Battery Decision
- "FOURTEENTH! Will you let them take your guns?!" (Voice rings out across the redoubt.)
- Battery retaken: "Turn them! Turn the guns!"

### Massena's Respite
- Walks the line. Coat torn, face black with powder, voice steady.
- "Five minutes, Fourteenth. Reform. Reload. This isn't over."

### Line Part 2
- "Captain Leclerc ahead, sword drawn, leading what remains."
- Volley 6 (scripted): "Hold the line!" (+3 morale)
- Volley 7 (scripted): "To the ridge!" (+5 morale)

### Gorge
- "FOURTEENTH! To the ridge! We finish this!"
- "FOURTEENTH! Fire at will!"
- "Every man, every gun to the ridge! We finish this!"

### Aftermath
- "The 14th will reform. Take what rest you can. We march at dusk."
- "You did your duty, soldier."
- Gorge Victory: "You did your duty, soldier."

## Arc
Begins ambitious — eyes shining with dreams of promotion. By the aftermath, his sword is sheathed and "his eyes are old." His final line — "You did your duty, soldier" — "should comfort. It doesn't."

## Relationships
- **Player**: Starts at 30. Professional distance. His approval comes through orders and recognition, not warmth.
- **Duval**: Chain of command. Leclerc is elsewhere when Duval falls.
- **The 14th**: His identity is bound to the unit. Every order begins with "FOURTEENTH!"

## Design Notes
- Survives the entire battle in all paths — never shown dying
- Voice appears as scripted morale events throughout all volleys
- Morale boosts when he speaks: +3 to +5 per volley event
- Status tracked on credits screen (Alive/Wounded/Killed in action)
- Syncs back to NPC after battle via `syncBattleResultsToNPCs`
