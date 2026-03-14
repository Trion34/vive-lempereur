---
type: officer
faction: French
unit: 14th demi-brigade
rank: Sergeant
role: nco
relationship: 20
stats:
  valor: 65
  morale: 95
  maxMorale: 100
---

## Overview
Granite-faced NCO who has held the section together since dawn. Gruff, competent, professional. His wounding is the game's first leadership crisis.

## Appearance
- "Granite-faced NCO"
- Wounded: "His face shows nothing — just surprise, as if he'd tripped on a vine root. Then the pain hits and he grabs his leg with both hands."
- Battle Ending (survived): Blood on his face, shoving the player toward the rear.

## Personality
- Gruff, professional soldier
- High morale (95) and valor (65) — command presence
- Pragmatic: values information and discipline
- Grudging warmth underneath the gruffness: "At least you're not useless."
- "Courage is not the absence of fear, soldier. It is mastery of it."

## Role in Demo

### Camp
- **Campfires** (Try to Count, success): Receives the player's intelligence report. "Good eyes."
- **Officer's Briefing** (scripted): "Dawn. Austrians from the north. Three columns at least." ... "Front rank needs filling."
  - Volunteer success: "Good man."
  - Volunteer failure: "Courage is not the absence of fear, soldier. It is mastery of it. Take the front rank."
- **Socialize**: Grumbles about the rations, the officers, the war. "At least you're not useless."

### Wounded Sergeant (Story Beat)
- Takes a ball in the thigh at 50 paces during Volley 2. Goes down hard.
- "His face shows nothing — just surprise, as if he'd tripped on a vine root. Then the pain hits and he grabs his leg with both hands."
- His spontoon clatters. "Sergeant's down!" The cry ripples through the section.
- `ncoPresent` set to false. The section loses its NCO.

### Battle Ending
- Survived: Drags the player from the press. Blood on his face. "Enough, lad. You've done enough."

## Arc
Competent NCO whose deterministic wounding creates the game's first leadership crisis. His absence forces the player to step up (TakeCommand), rally (RallyTheLine), or shrink (KeepYourHead). Reappears in the "Survived" battle ending, implying recovery.

## Relationships
- **Player**: Starts at 20. Professional — not warm, but reliable. Approval earned through competence.
- **Pierre**: Fellow professional. Pierre fills the NCO void if the player doesn't.
- **Leclerc**: Chain of command. Leclerc is dealing with a gap in the line when Duval goes down — hasn't seen it happen.

## Design Notes
- `ncoPresent` flag tracks his status — set to false at Wounded Sergeant (chargeEncounter=5)
- Wounding is deterministic — always happens after Volley 2
- Player choices at Wounded Sergeant: TakeCommand (pick up his spontoon), RallyTheLine (keep him in spirit), KeepYourHead (shrink)
- Does not appear as melee ally — he's downed before melee phase
- TakeCommand success: +10 relationship, can earn Grace
