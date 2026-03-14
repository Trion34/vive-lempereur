# Dawn at Savona

**Type:** Story beat (chargeEncounter=14, VoltriDawnSavona)
**Trigger:** After Cavalry Scare (final story beat)

---

## Narrative

> Dawn. The sea is grey. The mountains are grey. Everything is grey.
>
> Savona appears around a headland — walls, towers, the promise of rest. The column stumbles the last mile in silence.
>
> The men around you are hollow-eyed, boots bloody, uniforms torn. Some are carrying others. Some are just carrying themselves.
>
> The gates open. The garrison stares at the ragged column filing through. Forty kilometres. One battle. One night. Every man who walks through those gates has earned the right to collapse.
>
> What do you do?

## Choices

### Collapse and sleep
*Find a wall. Sit down. Let the exhaustion take you.*

> You find a wall. You sit down. You don't remember lying down, but you must have, because the next thing you know it's midday and someone is shaking your shoulder.
>
> "Rations," says a voice. You eat without tasting. You drink without thinking. Then you sleep again.
>
> When you finally wake properly, your body aches in places you didn't know existed. But you're alive. You're in Savona. The war goes on.

- Health +10, Stamina +20
- Morale +3: "Rest — the body takes what the mind cannot"

### Find your unit
*Report to Sergeant Morin. Account for yourself. Do the soldier's duty.*

> You force yourself to keep moving. Find the section. Report to Sergeant Morin. Account for yourself.
>
> It takes an hour to find the company assembly point. Morin is already counting heads, checking equipment, doing the sergeant's work that never ends.
>
> "Here, Sergeant."
>
> He marks you present. "Good man," he says. Two words. They mean everything.
>
> Lieutenant Vidal nods when he sees you. "The 14th held together on the march. That matters. Remember it."

- soldierRep +2, officerRep +2

## Closing Narrative

> The garrison reassembles over the next two days. The 14th is battered but intact. Voltri is lost, but the army survives.
>
> Word comes down from headquarters: General Bonaparte is concentrating the army. Something is planned. Something big.
>
> The campaign is about to begin.

## Mechanics
- Sets `battleOver = true`, `outcome = 'survived'`
- Final story beat — battle ends after this
- Player condition (health, morale, stamina) carries into the next campaign node
- Collapse: better physical recovery. Find your unit: better reputation.
