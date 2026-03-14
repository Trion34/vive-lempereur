---
type: companion
faction: French
unit: 14th demi-brigade
rank: Private
role: leftNeighbour
relationship: 60
melee_personality: aggressive
stats:
  valor: 55
  morale: 90
  maxMorale: 100
  strength: 50
  elan: 45
---

## Overview
Arcole veteran. The player's left neighbour in the line. A quiet man whose silence speaks louder than words. His approval is the player's measure of worth.

## Appearance
- "Pierre checks his flint. Arcole veteran. Steady hands." (opening narrative)
- Blood on his sleeve after Volley 3 shoulder wound
- Fixes bayonet one-handed after wounding
- "Blood-soaked but upright" (Part 2)
- Binding his shoulder one-handed, teeth gripping the bandage end (Massena's Respite)

## Background
- Veteran of Arcole, Lodi, and "a dozen fights whose names you barely know"
- Brother died at Arcole bridge: "Bayonet through the chest. Took him two hours."

## Personality
- Quiet, stoic. Defined by economy of words.
- Aggressive in melee combat
- "From Pierre, that's a medal" / "From him, that's a speech"
- Speaks through actions more than words
- Does not judge — when the player holds back at the battery, "just a glance, no judgment in it"

## Role in Demo

### Camp
- **Pierre's Story** (random event): Sits apart from others staring into fire. Player can Listen (bond strengthens silently) or Ask About Arcole (Charisma check). Success: "We held. That's what matters." Failure: "No." Cuts conversation with a look.
- **Officer's Briefing** (volunteer): Steps up "quiet and steady" to take front rank at the player's shoulder. Would have volunteered anyway.
- **Socialize**: Shares tobacco. "You did well today."
- **Campfires**: "Arcole was worse. We held there too."

### Line Part 1
- Opening: "To your left, Pierre checks his flint. Arcole veteran. Steady hands."
- **Volley 3 (scripted)**: Always wounded — "Pierre hit. Shoulder. Still fighting." (-6 morale)
- **Volley 4 (scripted)**: "Pierre fixes bayonet. Still fighting." (+2 morale)
- **Wounded Sergeant (Keep Your Head Down)**: Barks instructions through gritted teeth "because someone has to."
- **Melee Transition**: "Pierre, blood soaking through his sleeve, fixes his bayonet one-handed. His teeth are clenched. His eyes are steady. The veteran has been here before."

### Battery Decision
- **Charge**: "Pierre is beside you — blood on his sleeve, bayonet level." Runs with the player.
- **Hold Back**: "Pierre glances back at you — just a glance, no judgment in it — and then he's gone, charging with the others."

### Battery Melee
- Joins as ally at Round 3 (if alive). `armInjured=true` from shoulder wound.
- Arrival: "Pierre crashes through the smoke beside you, bayonet levelled."
- "Didn't think I'd let you have all the fun?"
- Battery retaken (alive): "Pierre is beside you, blood on his sleeve, bayonet dripping. Still alive. Still standing."
- Battery retaken (dead): "Pierre is gone. You saw him fall in the press. Another name for the list."

### Massena's Respite
- Alive: "Pierre leans against a broken wall, his shoulder bound with a strip torn from someone's coat. The blood has soaked through. He catches your eye and nods once. Still here."
- Check on Comrades (alive): Helps bind his shoulder. "You did well today."

### Line Part 2
- Volley 5: "Pierre reloads beside you." (+2 contagion)
- Volley 6: "We've been in worse." (+3 contagion)
- "Pierre is beside you, blood-soaked but upright."

### Gorge & Aftermath
- Gorge Victory: "Pierre stands at the edge of the crater where the ammunition wagon was. He says nothing. His face says everything."
- Aftermath (alive): "Pierre sits on a rock, binding his shoulder one-handed. Blood has soaked through three layers of bandage. He catches your eye and nods once. Still here."
- Help the Wounded: "Pierre watches you from the ridge. Frowning uncertainly. But when you climb back up, he doesn't question your actions."
- Sit Down (alive): "Pierre sits beside you. Says nothing. His shoulder touches yours. That is all. That is everything. After a while... 'Time to go, lad.'"
- Sit Down (dead): "No one sits beside you. Pierre would have. That thought is the one that nearly breaks you."

### Part 1 Complete
- Charged: "Not bad. For a conscript."
- Held Back: "You watched... as Pierre ran with blood on his sleeve... The moment Pierre looked back and you weren't there."

## Arc
Pierre is the rock. He does not change. His wound at Volley 3 and potential death are the emotional stakes. His approval — rare, quiet, hard-won — is the player's measure of worth.

## Relationships
- **Player**: Starts at 60. Built through shared silence, shared danger. His rare words of approval carry enormous weight.
- **Jean-Baptiste**: Unspoken. Pierre's existence as a steady veteran is the counterpoint to JB's fear.
- **Duval**: Fellow professional. Pierre takes charge when Duval falls if the player doesn't.

## Design Notes
- Melee personality: aggressive (40% lunge when healthy, prefers weakest enemy)
- Melee ally stats: HP 75-90, Stamina 180-220, Str 50, Élan 45
- `armInjured=true` set in battery melee when he joins (checks `npcs.leftNeighbour.wounded`)
- Appears Round 3 of battery_skirmish if alive
- Shoulder wound at Volley 3 is deterministic (always happens)
- Can die in melee combat — dynamic text exists for Pierre alive vs dead at: Massena's Respite, Battery Retaken, Aftermath, Part 1 Complete, Gorge Victory, Sit Down ending
- Syncs back to NPC after battle via `syncBattleResultsToNPCs`
