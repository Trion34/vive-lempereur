# Rivoli Aftermath

**Story Beat 4 — THE AFTERMATH**
Triggers after Volley 11 (chargeEncounter = 4)

---

## Narrative

> Victory.
>
> The Austrian column is defeated.
>
> But the battle is not over — not everywhere. From the ridge, you hear it: the thunder of hooves on the frozen plateau. Leclerc's chasseurs à cheval — just a few hundred horsemen — sweep into the Austrian centre like a scythe through wheat. The exhausted white-coated columns, spread out and disordered after hours of fighting, break at the first sight of cavalry.
>
> The rout spreads faster than the horsemen can ride. Alvinczi himself — the Austrian commander who thought himself on the cusp of victory an hour ago — joins the undignified race to the rear.
>
> Word passes down the ridge like a spark along a fuse: Lusignan's column — the force at Affi that had the whole army convinced they were surrounded — has been cut off by General Rey. They are surrendering in their thousands.
>
> The Battle of Rivoli is won.

> The 14th demi-brigade held the plateau through dawn.

**If battery was charged:**
> Retook the battery by bayonet.

**If battery was NOT charged:**
> Held the line while others charged the battery.

> Endured Vukassovich's fresh columns when the right flank broke. And sealed the gorge.

**If Pierre alive:**
> Pierre sits on a rock, binding his shoulder one-handed. Blood has soaked through three layers of bandage. He catches your eye and nods once. Still here.

**If Pierre dead:**
> Pierre's place in the line is empty. You don't look at the spot where he fell. You can't.

**If Jean-Baptiste alive:**
> Jean-Baptiste stands at the ridge's edge, musket grounded, staring at the gorge. He is pale but upright. Whatever you said to him during the second volley held. He made it through.

**If Jean-Baptiste dead:**
> Jean-Baptiste is not at the ridge. He fell at the battery. Someone will tell his family. Someone must.

> Captain Leclerc sheathes his sword. His hand is steady now. "The 14th will reform. Take what rest you can. We march at dusk."

---

## Choices

### Choice A: "Help the wounded"

*Descend into the gorge. Tend to Austrian wounded. Mercy and humanity for its own sake.*

> You descend into the gorge.
>
> The smell hits first — powder, blood, the animal stench of fear. Austrian wounded lie among the dead, calling in languages you don't understand. But the cries of the damned sound the same in any tongue.
>
> You kneel beside a man in a soiled white coat. He flinches — then sees your canteen. Gratitude.

**If gorgeMercyCount > 0 (showed mercy during gorge volleys):**
> You showed mercy on the ridge. Now you show it here. It does not undo what happened. Nothing will. But it is something.

**If Pierre alive:**
> Pierre watches you from the ridge. Frowning uncertainly. But when you climb back up, he doesn't question your actions.

**If Pierre dead:**
> When you climb back up, the ridge feels emptier than before. Pierre would have understood.

- Stamina -30
- Morale +8: "Compassion after slaughter"
- soldierRep +5

---

### Choice B: "Find your comrades"

*Search for Pierre, Jean-Baptiste, the men you stood beside. See who survived.*

> You go looking for the living.

**If Pierre alive:**
> You find Pierre first. He's binding his own shoulder, one-handed, teeth gripping the bandage end. You kneel and help. He doesn't thank you. He doesn't need to. "You did well today," he says quietly. From Pierre, that's a medal.

**If Pierre dead:**
> You go to where Pierre fell. Someone has covered his face with his coat. You stand there for a long time. There is nothing to say. There is nothing to do. But you stand there anyway.

**If Jean-Baptiste alive:**
> Jean-Baptiste looks up when you approach. He's exhausted — of course he is — but he meets your eyes. "I didn't break," he says. You grip his shoulder. "No. You didn't."

**If Jean-Baptiste dead:**
> You go to where Jean-Baptiste fell at the battery. Someone has crossed his hands over his chest. He looks younger than you remembered. You kneel beside him for a moment. "You didn't break," you say to no one.

> The 14th is smaller now. The faces that are missing will never come back. But the faces that remain — they look at you, and you look at them, and something passes between you that has no name.
>
> You survived Rivoli together. That is a bond that will never break.

- Stamina +30
- Morale +5: "Found your comrades — the bond holds"
- Pierre relationship +10 (if alive)
- Jean-Baptiste relationship +10 (if alive)

---

### Choice C: "Sit down"

*Your legs stop working. The musket slides from your fingers. You sit on the ridge and stare.*

> You sit down.
>
> Not a decision. Your legs simply stop working. The musket slides from your fingers and clatters on the frozen ground. You sit on the ridge, knees drawn up, and stare at the gorge below.
>
> The sounds of victory wash over you — distant cheers, the cavalry horns, voices calling in triumph. None of it reaches you. Not really. You are somewhere else. Somewhere between the first volley at dawn and the last volley into the gorge.

**If Pierre alive:**
> Pierre sits beside you. Says nothing. His shoulder touches yours. That is all. That is everything.
>
> After a while — minutes, hours, you cannot say — his voice: "Time to go, lad." You pick up your musket. You stand. You walk.

**If Pierre dead:**
> No one sits beside you. Pierre would have. That thought is the one that nearly breaks you.
>
> After a while — minutes, hours, you cannot say — you pick up your musket. You stand. You walk. Because there is nothing else to do.

- Health +10
- Stamina +45
- Morale +3: "Rest — the body takes what the mind cannot"

---

## Closing Narrative (after any choice)

> The drums beat assembly. The 14th reforms — what is left of it. Men fall in by habit, finding their places in a line that has too many gaps. The officers count heads. The sergeants mark the dead.
>
> The Battle of Rivoli is over. The cost is written in the faces of the men who paid it. But the 14th held. Through dawn, through the battery, through the gorge. They held.
>
> Whatever comes next, you will carry this day with you forever.

*(Battle ends — outcome: victory)*
