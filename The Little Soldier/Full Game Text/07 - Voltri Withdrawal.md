# Voltri Withdrawal
*Story Beats 10-17 — The Retreat to Savona*

---

## Flow Diagram

```
Fix Bayonets (10) --> Melee --> The Line Breaks (11) --> The Coastal Road (12)
                                                              |
                                             +----------------+----------------+
                                             |                                 |
                                    [Help Straggler]                    [Keep Moving]
                                    SEPARATION PATH                     COLUMN PATH
                                             |                                 |
                                   Wounded Soldier (15)              Cavalry Scare (13)
                                        |         |                            |
                                  [Tend]     [Leave]                           |
                                    |           |                              |
                             Wounded Canteen (17)|                             |
                              (Felix survival    |                             |
                               determined)       |                             |
                                    |            |                             |
                                    +------+-----+                             |
                                           |                                   |
                                   The Homestead (16)                          |
                                   (friendly or hostile                        |
                                    based on camp flag)                        |
                                           |                                   |
                                           +---------------+-------------------+
                                                           |
                                                  Dawn at Savona (14)
                                                  (dual-path finale)
```

### Path Summary

- **Column path:** Coastal Road (keep moving) --> Cavalry Scare --> Dawn at Savona
- **Separation path:** Coastal Road (help straggler) --> Wounded Soldier --> [Wounded Canteen] --> Homestead --> Dawn at Savona
- The Homestead is skipped if player chooses "Leave him" at Wounded Soldier -- goes directly to Homestead (canteen is skipped)
- Dawn at Savona has variant narrative and outcomes depending on which path the player took

### Key State Flags (VoltriExt)

| Flag | Type | Set By | Effect |
|------|------|--------|--------|
| `separated` | boolean | Coastal Road (Help Straggler) | Determines Dawn at Savona narrative variant |
| `felixMet` | boolean | Camp: gambling event (`gambling_accepted` flag) | Changes "a soldier" to "Felix Martel" throughout |
| `ligurianGirlSaved` | boolean | Camp: Ligurian Girl event (`ligurian_girl_saved` flag) | Determines friendly vs hostile Homestead path |
| `felixTendScore` | number | Wounded Soldier (+2), Canteen (+1) | Determines Felix survival: >=2 survives, 1 = 50/50, 0 = dies |
| `felixSurvived` | boolean | Wounded Canteen (calculated) or Wounded Soldier (Leave = false) | Affects Homestead and Dawn text |

---

## Story Beat 10: Fix Bayonets
*ChargeEncounterId.VoltriFixBayonets (10)*

### Narrative

> The Austrians are done exchanging volleys. A column of white coats surges up the slope, bayonets levelled, drums beating the charge.
>
> Sergeant Morin's voice: "FIX BAYONETS!"
>
> Steel rasps from scabbards. Clicks on muzzles. Your musket becomes a spear.
>
> The man beside you curses as his hands slip. You get yours done on the first try.
>
> They're coming up the hill. Through the olive groves. Scrambling over the stone walls. You can see their faces now.

### Choice: Fix bayonets
*Steel on steel. They're coming up the hill.*

> You fix your bayonet. The steel clicks home.
>
> The Austrian column hits the French position. Men crash into men among the olive trees and stone walls. Musket butts, bayonets, fists. The neat volley line dissolves into a dozen private battles.
>
> You are in it now.

**Effects:** Morale +3 ("The rush of close combat"). Transitions to Melee phase (Pegli Hills skirmish).

**Transitions to -->** Melee (Hilltop Skirmish), then Story Beat 11

---

## Story Beat 11: The Line Breaks
*ChargeEncounterId.VoltriLineBreaks (11)*

### Narrative

> The fighting on the hilltop sputters out. The Austrians pull back -- not routed, just regrouping. But from the east, more columns are coming. Too many.
>
> A rider gallops up from the coast road. Lieutenant Vidal reads the dispatch and his face goes blank.
>
> "Withdrawal order. The whole garrison. Fall back to Savona."
>
> Men are breathing hard, checking themselves for wounds they didn't feel during the fighting. The hilltop is littered with bodies -- French and Austrian both.
>
> Sergeant Morin is already moving. "Section! Form on me! We're pulling out -- NOW!"
>
> The question is how.

### Choice 1: Fall back with section
*Orderly retreat. Stay with Morin and the others. Get off this hill alive.*

> You fall back with the section, moving quickly down the reverse slope. Sergeant Morin keeps the formation together -- barely. Men stumble over the rocky ground, glancing back at the heights they're abandoning.
>
> The coast road opens below. The company streams down toward it, joining a growing column of retreating troops. Not a rout -- but close.
>
> "Keep moving. Eyes front. We stop when Savona stops us."

**Effects:** Morale +3 ("Orderly withdrawal -- the section holds together"), Stamina -15.

### Choice 2: Cover the retreat
*Stay behind and fire at the Austrian skirmishers while the company withdraws. [Valor check, -5 modifier]*

**Success:**
> You stay. Someone has to. [Valor: passed]
>
> You crouch behind a stone wall with a handful of others, firing at the Austrian skirmishers while the company withdraws. The balls crack overhead. You reload, fire, reload. Mechanical. Necessary.
>
> When you finally pull back, the section is already on the coast road. Sergeant Morin gives you a look that might be respect.

**Effects (success):** Morale +5 ("Covered the retreat -- courage under fire"), soldierRep +3, Stamina -15.

**Failure:**
> You try to stay. [Valor: failed]
>
> You crouch behind the wall, but when the Austrian fire intensifies, your nerve breaks. You scramble back down the slope faster than you intended, tripping over roots, skinning your palms on the rocks.
>
> You reach the road bruised and winded. No one noticed your failure. Small mercy.

**Effects (failure):** Morale -2 ("Tried to cover the retreat -- nerve failed"), Health -8, Stamina -15.

**Transitions to -->** Story Beat 12 (The Coastal Road)

---

## Story Beat 12: The Coastal Road -- BRANCHING POINT
*ChargeEncounterId.VoltriCoastalRoad (12)*

### Narrative
*Dynamic: Uses "Felix Martel" if `felixMet` is true, otherwise "a soldier".*

> Night falls on the Ligurian coast. The column staggers west along the corniche road -- a narrow track carved between the mountains and the sea.
>
> No lights. No drums. The officers have forbidden both. The Austrians are somewhere behind, and nobody wants to find out how close.
>
> Men stumble in the dark. Equipment clatters. Someone falls and curses. The road is rutted, broken, treacherous in the blackness.
>
> Ahead of you, [Felix Martel / a soldier] has collapsed at the roadside. His pack is still on. He might be sleeping. He might be done.

### Choice 1: Help the straggler --> SEPARATION PATH
*Haul him up. No one gets left behind on this road. [Constitution check]*

**Success:**
> You grab [Felix/the man]'s arm and haul him up. He's heavy -- dead weight at first, then his legs find the rhythm. [Constitution: passed]
>
> "Merci," he mumbles. You half-carry him for the next mile until he can manage on his own.
>
> But the column is pulling ahead. By the time you look up, the last man has disappeared around a bend in the road. You've fallen behind. The darkness swallows the coast road ahead and behind.
>
> You're on your own.

**Effects (success):** soldierRep +2, Stamina -10. Sets `separated = true`.

**Failure:**
> You try to haul him up, but your own legs are giving out. [Constitution: failed]
>
> The effort costs you. Your calves cramp. You stagger, nearly go down yourself. But you grit your teeth and drag [Felix/the man] upright by sheer stubbornness.
>
> It takes too long. The column moves on without you. The sounds of marching feet fade into the darkness ahead. You're separated.

**Effects (failure):** Stamina -20, Health -5. Sets `separated = true`.

**Transitions to -->** Story Beat 15 (Wounded Soldier) -- SEPARATION PATH

### Choice 2: Keep moving --> COLUMN PATH
*If you stop, you might not start again. Someone else will help him.*

> You step around [Felix/the man]. Don't look down. Don't stop. If you stop, you'll be the next one sitting at the roadside.
>
> The column grinds on. Behind you, someone else helps the straggler. Or doesn't. You don't look back.

**Effects:** Morale -2 ("Left a comrade behind -- necessary but cold").

**Transitions to -->** Story Beat 13 (Cavalry Scare) -- COLUMN PATH

---

## Story Beat 13: Cavalry Scare -- COLUMN PATH ONLY
*ChargeEncounterId.VoltriCavalryScare (13)*

### Narrative

> A sound in the darkness. Hooves.
>
> The word ripples down the column like a shiver: "Cavalry. Uhlans."
>
> Everyone freezes. The coastal road offers no cover -- just cliff on one side, sea on the other. If it's a cavalry patrol, there is nowhere to run.
>
> Shapes move in the darkness ahead. The click of bridles. The creak of saddle leather.
>
> Sergeant Morin's voice, barely a whisper: "Form a group. Stay together. If they charge, present bayonets."

### Choice 1: Stand firm
*Present your bayonet and hold your ground. Whatever comes out of the dark. [Valor check]*

**Success:**
> You stand. Bayonet out. Breathing controlled. [Valor: passed]
>
> The shapes in the darkness resolve into... a mule train. Supply animals, not cavalry. Someone's mule brays. The tension breaks like a fever.
>
> "False alarm," Morin mutters. But he saw you standing firm. That matters.

**Effects (success):** Morale +5 ("Stood firm in the dark -- false alarm, but real courage").

**Failure:**
> You try to stand firm, but your legs betray you. [Valor: failed]
>
> You stumble backward in the dark, trip over a root, go down hard on the rocky ground. Your knee hits stone. Pain shoots up your leg.
>
> The "cavalry" turns out to be a mule train. Supply animals. You pick yourself up, wincing, hoping no one saw.

**Effects (failure):** Morale -3 ("Nerve failed in the dark"), Health -6.

### Choice 2: Scatter and hide
*Get off the road. Press flat. Let the cavalry pass.*

> You dive off the road, pressing yourself flat against the hillside. Rocks dig into your ribs. You hold your breath.
>
> The shapes pass. A mule brays. It's a supply train, not Uhlans. You crawl back to the road, dirt on your face, feeling foolish.
>
> Morin shakes his head. "Next time, hold your ground."

**Effects:** Morale -2 ("Scattered and hid -- it was nothing"), soldierRep -1.

**Transitions to -->** Story Beat 14 (Dawn at Savona)

---

## Story Beat 15: Wounded Soldier -- SEPARATION PATH
*ChargeEncounterId.VoltriWoundedSoldier (15)*

### Narrative
*Dynamic: Uses "Felix" / "Bad luck" dialogue if `felixMet`, otherwise "The man" / "Help me".*

> You stumble on through the darkness, supporting the straggler. After a mile, he collapses again. This time he doesn't get up easily.
>
> In the faint starlight, you see it -- blood, dark and wet, soaking through his trouser leg. A wound from the hilltop fighting, ignored in the chaos of retreat. Now the leg is swelling, the blood still coming.
>
> [Felix/The man] looks up at you. [If Felix met: "Bad luck, eh?" he says through gritted teeth. "Should have stayed with the cards." / If not met: "Help me," he whispers. "Please."]
>
> The column is gone. The road is empty. It's just you and a bleeding man on a dark coast road.

### Choice 1: Tend his wounds
*Do what you can. Bind the leg, slow the bleeding. [Constitution check]*

*Note: Auto-pass if player has 'medicine' attribute.*

**Success (or auto-pass with medicine):**

If medicine attribute:
> You know what to do. Tourniquet above the wound. Strip of shirt for a bandage. Pressure, steady pressure. [Felix/The man] hisses but holds still. The bleeding slows.

If Constitution check passed:
> You do what you can -- tear a strip from your shirt, bind the wound, tie it tight. [Constitution: passed]
>
> The bleeding slows. [Felix/The man] lets out a breath. "Not bad," he manages. "For an amateur."

**Effects (success):** felixTendScore +2, Morale +3 ("Tended a wounded comrade"), Stamina -5, Virtue +5.

**Failure:**
> You try to bind the wound but your hands are shaking. The makeshift bandage is loose, sloppy. [Constitution: failed]
>
> The bleeding continues, slower maybe, but still there. It will have to do. You've done what you can.

**Effects (failure):** Stamina -10, Virtue +3.

**Transitions to -->** Story Beat 17 (Wounded Canteen)

### Choice 2: Leave him
*You can't carry him. You can barely carry yourself. Walk away.*

> You look at the wound, look at the empty road ahead. You can't carry him. You can barely carry yourself.
>
> "I'm sorry," you say. [If Felix met: "Felix stares at you. He doesn't say anything. He doesn't need to." / If not met: "The man stares at you. He doesn't say anything. He doesn't need to."]
>
> You walk away. The darkness takes him. You don't look back.

**Effects:** Morale -5 ("Left a wounded man to die"), Virtue -10. Sets `felixSurvived = false`.

**Transitions to -->** Story Beat 16 (The Homestead) -- skips Canteen

---

## Story Beat 17: Wounded Canteen -- SEPARATION PATH
*ChargeEncounterId.VoltriWoundedCanteen (17)*

### Narrative
*Dynamic canteen status.*

> [Felix/The soldier] is pale. The wound is bound but the march has taken its toll. He needs water.
>
> You check your canteen. [If canteenUses > 0: "There's water left -- not much, but some." / If empty: "It's empty."]

### Choice 1: Share your canteen
*Give him water. He needs it more than you.*

**Available only if `canteenUses > 0`.**

> You tip the canteen to [Felix/the soldier]'s lips. He drinks -- not greedily, just enough. His colour improves slightly. "You're a good man," he says quietly.

**Effects:** Uses 1 canteen, felixTendScore +1, Morale +2 ("Shared water with a wounded comrade"), Virtue +3.

### Choice 2: Conserve supplies
*You might need that water yourself before this night is over.*

*Dynamic text based on canteen status:*

> You shake the canteen. [If water: "There's water, but you might need it yourself before this night is over. You cap it and put it away." / If empty: "Empty. Nothing to share even if you wanted to."] [Felix/The soldier] says nothing, but his eyes follow the canteen.

**Effects:** Morale -1 ("Conserved supplies").

### Felix Survival Determination

After this beat, Felix's fate is calculated from accumulated `felixTendScore`:

| felixTendScore | Outcome |
|:-:|:--|
| >= 2 | Felix survives |
| 1 | 50/50 chance (random) |
| 0 | Felix dies |

**If Felix survives:**
> [Felix/The soldier] manages to stand, leaning on you. The wound is bad but not fatal -- not yet. Together, you limp on through the darkness.

**If Felix dies:**
> [Felix/The soldier]'s head drops. His breathing goes shallow, then stops. You sit with him for a moment in the dark. Then you close his eyes and walk on alone.

Additional Morale -3 ("A man died on the road") if Felix dies.

**Transitions to -->** Story Beat 16 (The Homestead)

---

## Story Beat 16: The Homestead -- SEPARATION PATH
*ChargeEncounterId.VoltriHomestead (16)*

### Narrative

> You see a light. Not much -- just a glow through shuttered windows, up the hillside from the road. A farmstead, tucked into the coastal hills. Smoke from a chimney.[If Felix survived: " [Felix/The wounded man] is fading beside you -- he needs rest, shelter, anything."]
>
> The road stretches on into the darkness. Savona is still miles away.

**This beat has two completely different paths based on the `ligurianGirlSaved` camp flag.**

### FRIENDLY PATH (if `ligurianGirlSaved = true`)

The Ligurian girl from camp recognises you. Her father lowers his gun.

#### Choice 1: Rest here
*Accept their hospitality. Sleep. Heal.*

> You approach the farmstead. A man opens the door with a fowling piece, then a girl appears behind him. She looks at you -- and recognition crosses her face. The lemon seller from camp.
>
> She speaks rapidly in Ligurian. The man lowers the gun. "Come in," she says in halting French. "Come in."
>
> They feed you. Hot soup, bread that isn't mouldy, wine that hasn't been watered. You sit by the fire and the warmth seeps into your bones.[If Felix survived: "They tend [Felix/the soldier] too -- proper bandages, clean water, a poultice of herbs. He sleeps by the fire, breathing easier."]
>
> You sleep deeply. When dawn comes, the girl's father points you toward the Savona road and presses a heel of bread into your hand.

**Effects:** Health +15, Stamina +20, Morale +5 ("Rest and kindness -- a debt repaid").

#### Choice 2: Move on at first light
*A brief rest, then back to the road. The army is at Savona.*

> You approach the farmstead. The girl recognises you and they take you in, but you don't stay long. A few hours of rest, a cup of soup, and you're on your feet again.
>
> "You should sleep," she says. But you shake your head. The army is at Savona. That's where you need to be.[If Felix survived: "[Felix/The soldier] stays. He can barely walk. The family will look after him."]
>
> You slip out before first light, the coast road grey and empty ahead.

**Effects:** Health +5, Stamina +8, Morale +3 ("Brief rest -- duty calls").

### HOSTILE PATH (if `ligurianGirlSaved = false`)

No recognition. An armed Italian farmer who doesn't want soldiers at his door.

#### Choice 1: Approach the farmstead
*Knock on the door. Ask for shelter. [Charisma check]*

**Success:**
> You approach the door. An armed man opens it -- fowling piece levelled at your chest. "No soldiers," he says in broken French.
>
> You raise your hands. Talk slowly. You're not here to take anything. [Charisma: passed]
>
> Something in your voice -- exhaustion, maybe, or honesty -- makes him lower the gun. "One night," he says. "Then you go."
>
> He lets you sleep in the kitchen. Grudging hospitality, but hospitality all the same.[If Felix survived: " [Felix/The soldier] gets a blanket by the hearth."]

**Effects (success):** Health +8, Stamina +12, Morale +3 ("Grudging shelter -- better than the road").

**Failure:**
> You approach the door. An armed man opens it -- fowling piece levelled at your chest. "No soldiers," he says.
>
> You try to talk your way in. [Charisma: failed]
>
> He doesn't budge. "Go." The door shuts. You hear the bar drop.
>
> You shelter against the lee of a stone wall nearby. Cold, exposed, but at least the wind is blocked.[If Felix survived: " You and [Felix/the soldier] huddle together for warmth. It barely helps."]

**Effects (failure):** Stamina -5, Morale -2 ("Turned away -- a cold night").

#### Choice 2: Shelter in the barn
*Don't bother the family. Find the outbuildings.*

> You skirt around the farmstead and find a barn. The door isn't locked. Inside: straw, the smell of animals, relative warmth.
>
> You collapse into the straw. Not comfortable, but out of the wind and hidden from the road.[If Felix survived: " [Felix/The soldier] lies beside you, breathing rough but steady."]
>
> You sleep in snatches, waking at every sound. Dawn finds you stiff and cold, but alive.

**Effects:** Stamina +3, Morale +1 ("Rough shelter -- better than nothing").

#### Choice 3: Keep walking
*Soldiers aren't welcome at farmsteads. Keep moving.*

> You look at the light in the window and keep walking. Soldiers aren't welcome at farmsteads. Not at night. Not in wartime.
>
> The road stretches on. Your legs ache. Your eyes burn.[If Felix survived: " [Felix/The soldier] stumbles beside you, each step a labour."] The darkness seems endless.

**Effects:** Stamina -10, Morale -3 ("Kept walking through the night -- brutal").

**Transitions to -->** Story Beat 14 (Dawn at Savona)

---

## Story Beat 14: Dawn at Savona -- DUAL-PATH FINALE
*ChargeEncounterId.VoltriDawnSavona (14)*

### Narrative -- Column Path

> Dawn. The sea is grey. The mountains are grey. Everything is grey.
>
> Savona appears around a headland -- walls, towers, the promise of rest. The column stumbles the last mile in silence.
>
> The men around you are hollow-eyed, boots bloody, uniforms torn. Some are carrying others. Some are just carrying themselves.
>
> The gates open. The garrison stares at the ragged column filing through. Forty kilometres. One battle. One night. Every man who walks through those gates has earned the right to collapse.
>
> What do you do?

### Narrative -- Separation Path

> Dawn. The sea is grey. The mountains are grey. Everything is grey.
>
> Savona appears around a headland -- walls, towers, the promise of rest. You stumble the last mile alone.[If Felix survived: " [Felix/The wounded soldier] limps beside you, pale but alive."]
>
> You arrive hours after the main body. The garrison stares at you -- a straggler, uniform torn, eyes hollow. Sergeant Morin finds you at the gate. His face shifts from anger to relief.
>
> "Where the hell have you been?"
>
> What do you do?

### Choice 1: Collapse and sleep
*Find a wall. Sit down. Let the exhaustion take you.*

**Column path:**
> You find a wall. You sit down. You don't remember lying down, but you must have, because the next thing you know it's midday and someone is shaking your shoulder.
>
> "Rations," says a voice. You eat without tasting. You drink without thinking. Then you sleep again.
>
> When you finally wake properly, your body aches in places you didn't know existed. But you're alive. You're in Savona. The war goes on.

**Separation path:**
> Morin takes one look at you and doesn't ask questions. "Get some rest, soldier. We'll sort it out later."
>
> You find a wall. You sit down. You don't remember lying down, but you must have, because the next thing you know it's afternoon and someone is shaking your shoulder.
>
> "Rations," says a voice. You eat without tasting. Then you sleep again.[If Felix survived: "When you wake, someone tells you [Felix/the man you brought in] is with the surgeons. He'll live. The men are surprised to see him alive."]

**Effects (both paths):** Health +10, Stamina +20, Morale +3 ("Rest -- the body takes what the mind cannot").

### Choice 2: Find your unit
*Report to Sergeant Morin. Account for yourself. Do the soldier's duty.*

**Column path:**
> You force yourself to keep moving. Find the section. Report to Sergeant Morin. Account for yourself.
>
> It takes an hour to find the company assembly point. Morin is already counting heads, checking equipment, doing the sergeant's work that never ends.
>
> "Here, Sergeant."
>
> He marks you present. "Good man," he says. Two words. They mean everything.
>
> Lieutenant Vidal nods when he sees you. "The 14th held together on the march. That matters. Remember it."

**Effects (column):** soldierRep +2, officerRep +2.

**Separation path:**
> "I fell behind helping a wounded man, Sergeant. I'm here to report."
>
> Morin studies you for a long moment. Then he marks you present. "You came in hours late, carrying a wounded soldier, after forty kilometres on the coast road in the dark." He pauses. "That's either very brave or very stupid. I'll decide which later."
>
> Lieutenant Vidal nods when he sees you. "The 14th held together -- even its stragglers. That matters. Remember it."[If Felix survived: "The men gather around when they hear about [Felix/the man you carried]. Someone you barely know claps you on the back. 'Good man,' he says."]

**Effects (separation):** soldierRep +3, officerRep +2.

### Closing Narrative (both paths)

> The garrison reassembles over the next two days. The 14th is battered but intact. Voltri is lost, but the army survives.
>
> Word comes down from headquarters: General Bonaparte is concentrating the army. Something is planned. Something big.
>
> The campaign is about to begin.

Sets `battleOver = true`, `outcome = 'survived'`.
