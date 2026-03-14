---
type: historical
faction: French
role: Commander-in-Chief, Army of Italy
rank: General
---

## Overview
A distant, godlike presence. Never speaks to the player directly. His gaze and his orders shape the battle from above. Small figure on a grey horse. The general sees everything.

## Appearance
- "Small figure on a grey horse"
- "Grey coat, plain hat, that sharp profile lit by the flames"
- "He does not stop. He does not speak. But every man straightens as he passes."

## Role in Demo

### Camp
- **Bonaparte Rides Past** (scripted event, 1 action remaining): Rides past the fires of the 14th. Grey coat, plain hat, sharp profile. Does not stop or speak. "The general sees everything. Everyone knows it."
  - Valor check success: "Bonaparte's gaze sweeps over you." (napoleonRep increase)
  - Valor check failure: "A missed moment."

### Prologue
- "General Bonaparte has led the Army of Italy on a campaign that has stunned Europe."
- "Bonaparte rides through the night to take command."

### Gorge (Story Beat)
- "On the ridge above the plateau, a small figure on a grey horse. Even through the smoke and chaos, every man in the line knows who it is. Bonaparte."
- Orders the counterattack via aide-de-camp.

### Line Part 2
- Volley 7 (scripted): "Bonaparte on the ridge. Counterattack ordered." (+10 morale — the biggest single morale boost in the game.)
- "Bonaparte watches from above. He has seen the 14th hold the plateau."

### Aftermath
- "On the ridge above, Bonaparte is already dictating dispatches. Rivoli is a victory. A decisive victory."
- Cavalry charge victory: "Bonaparte timed it perfectly. He always does."

### Character Creation
- 20 Napoleon quotes displayed on mascot hover during stat allocation.

## Arc
Never interacts with the player directly. His presence is felt through commands relayed by aides and through the electrifying effect he has on morale. The +10 morale boost when he appears on the ridge is the game's emotional turning point.

## Design Notes
- `napoleonRep` stat (0-100) tracks whether Napoleon knows the player exists. Starts at 0.
- Bonaparte Rides Past camp event: Valor check determines napoleonRep change
- No direct dialogue in any story beat — presence only
- +10 morale boost at Volley 7 is the largest single morale event in the game
