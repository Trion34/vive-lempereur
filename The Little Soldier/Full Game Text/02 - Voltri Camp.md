# Voltri Camp

**Location:** Garrison at Voltri
**Weather:** Clear
**Supply Level:** Scarce
**Total Actions:** 12
**Context:** Garrison
**Random Events:** None

---

## Opening Narrative

> The 14th demi-brigade holds garrison at Voltri, a fishing town on the Ligurian coast west of Genoa. The army is starving, the pay is months late, and the new general -- Bonaparte -- has yet to prove himself. But the coast is beautiful, and for the moment, no one is shooting at you.

---

## NPCs

### Sergeant Morin (NCO)

**Rank:** Sergeant
**Personality:** The section sergent. Practical, tired, fair. Keeps the men together.
**Base Stats:** Valor 60, Morale 90/100, Relationship 30

**Socialize:**
> Sergeant Morin shares his pipe and stares at the sea. "I was at Valmy," he says. "The Revolution's first battle. We stood in the rain and the Prussians turned back. I thought the war was over." He laughs, short and bitter.

### Lieutenant Vidal (Officer)

**Rank:** Lieutenant
**Personality:** Company officer. Ambitious but distant. Thinks about promotion, not his men.
**Base Stats:** Valor 45, Morale 80/100, Relationship 20

**Socialize:**
> Lieutenant Vidal is studying a map by candlelight. He acknowledges you with a nod but doesn't look up. "The passes," he mutters. "If they come through the passes..." He trails off. You leave him to his thoughts.

### Felix Martel (Neighbour)

**Rank:** Private
**Personality:** A former traveling musician turned soldier. Quick with cards and quicker with excuses. The kind of man who always has extra bread and you never ask where it came from.
**Base Stats:** Valor 30, Morale 75/85, Relationship 10

**Socialize:**
> Felix produces a battered deck of cards from nowhere. "I'll teach you a trick," he says, shuffling one-handed. "Not a card trick -- a life trick. Always look like you belong, and never be the last one to leave." He grins. "Works in the army. Worked better in the theatre."

---

## Event Schedule

12 total actions. Forced events trigger based on actions remaining. All events are forced (no random events).

| Actions Remaining | Event |
|---|---|
| 12 | *(free)* |
| 11 | *(free)* |
| 10 | The Passe-Dix Game |
| 9 | *(free)* |
| 8 | The Coast at Night |
| 7 | *(free)* |
| 6 | The Ligurian Girl |
| 5 | *(free)* |
| 4 | The Genoese Merchant |
| 3 | *(free)* |
| 2 | An Opportunity *(conditional: requires `gambling_accepted` flag)* |
| 1 | *(free)* |

---

## Forced Events

---

### 1. The Passe-Dix Game

**Triggers at:** 10 actions remaining
**Category:** Interpersonal
**Event ID:** `voltri_gambling_invitation`

**Narrative:**

> Evening. A knot of soldiers crowds around a blanket spread in the dirt behind the cookfires. Dice clatter. Coins change hands. In the middle of it all sits a man you've seen around camp -- Felix Martel, a former musician with quick hands and a quicker smile. He's running the table and enjoying every minute.
>
> He catches your eye. "Room for one more, friend. Two sous to play. The dice don't care about rank."

**Choices:**

#### Choice A: "Join the game"

*Sit down, put your money in, roll the dice. [Costs 2 sous]*

**If player cannot afford (sous < 2):**

> You reach for your purse and find it empty. Felix shrugs. "Next time, friend." The game goes on without you.

- Morale -1

**If win (50% chance):**

> You sit down and put your sous in the pot. The dice are kind tonight -- or maybe Felix lets you win. You walk away with heavier pockets and a new acquaintance. Felix claps your shoulder. "Lucky man. Come back any time."

- Felix +10 relationship
- soldierRep +1
- Morale +3
- Sous +3
- Sets flag: `gambling_accepted`

**If lose (50% chance):**

> You sit down, put your sous in -- and watch them disappear. Felix has that look, the one that says he knew exactly how the dice would fall. "Better luck next time," he says, already counting his winnings. You walk away lighter in the purse but richer in understanding: never trust a musician with dice.

- Felix +5 relationship
- Morale -1
- Sous -2
- Sets flag: `gambling_accepted`

#### Choice B: "Watch"

*Stand at the edge. Learn how Felix works before risking your money.*

> You stand at the edge and watch Felix work. He's good -- quick hands, easy patter, always knows when to let someone win just enough to keep them playing. He catches your eye once and winks. You file the observation away for later.

- Felix +3 relationship
- Morale +1
- Sets flag: `gambling_accepted`

#### Choice C: "Decline"

*Walk away. You didn't survive this long by gambling.*

> You shake your head and walk on. Felix shrugs -- no offence taken. "Your loss, friend." The dice rattle behind you as you go.

- *(no changes)*

---

### 2. The Coast at Night

**Triggers at:** 8 actions remaining
**Category:** Interpersonal
**Event ID:** `voltri_coast_at_night`

**Narrative:**

> You slip away from the camp after supper and walk down to the shore. The Mediterranean stretches out before you, black and silver under the stars. Its beauty a stark contrast to the miserable soldier's life you're growing accustomed to.

**Choices:**

#### Choice A: "Write a letter home"

*Find the words, if you can. Put something down before you forget how this feels.*
**Locked if player is illiterate** (lock text: "You never learned your letters.")

> You sit on a rock and write by starlight. The words are clumsy, and your pen scratches more than it writes. But you describe the sea, the coast, the way the mountains look at sunset. You don't mention the hunger or the fear. Some things are better left unsaid.

- Stamina +2
- Morale +5

#### Choice B: "Watch the sea"

*Stay here a while. Let the quiet settle into you.*

> You stay until the cold drives you back. You sleep well for the first time in weeks.

- Stamina +2
- Morale +2

---

### 3. The Ligurian Girl

**Triggers at:** 6 actions remaining
**Category:** Interpersonal
**Event ID:** `voltri_ligurian_girl`

**Narrative:**

> A girl from the town appears at the edge of camp with a basket of lemons. Dark hair, olive skin, a face that would turn heads even if the men weren't starving for more than food. She's trying to sell them -- a few sous each, probably her family's only income. A big corporal named Gros approaches her. He's smiling, but it's the wrong kind of smile. He puts a hand on her arm. She tries to pull away. The men nearby look at the ground.

**Choices:**

#### Choice A: "Step in"

*Tell him to let her go. [Charisma check]*

**If Charisma check passed:**

> You step forward and speak calmly. "That's enough, Gros." Something in your voice -- or maybe just the fact that someone spoke at all -- breaks the spell. He lets go, mutters something, walks away. The girl gathers her basket and disappears down the road without looking back. A couple of the men nod at you. That took nerve.

- soldierRep +2
- Morale +3
- Virtue +5
- Sets flag: `ligurian_girl_saved`

**If Charisma check failed -- Elan sub-check succeeds:**

> "Mind your own business, boy." He lets go of her arm and turns on you, squaring up. She slips away with her basket -- at least there's that. Gros swings. You duck under it and put him on his back. He stays down. The section saw you stand up and hold your own. Gros won't try that again.

- soldierRep +3
- Morale +2
- Virtue +5
- Sets flag: `ligurian_girl_saved`

**If Charisma check failed -- Elan sub-check also fails:**

> "Mind your own business, boy." He lets go of her arm and turns on you. She slips away with her basket -- at least there's that. But Gros puts you on the ground before you can get your guard up. A knee in your ribs, a boot in your side. Someone pulls him off. You lie in the dirt, tasting blood. At least the girl got away.

- Health -5
- Stamina -5
- Morale -2
- Virtue +5
- Sets flag: `ligurian_girl_saved`

#### Choice B: "Fetch Sergeant Morin"

*Find Morin. He'll put a stop to this. [Endurance check]*

**If passed:**

> You sprint through camp and find Morin by the cookfires. He doesn't ask questions -- just follows you back at a pace that makes you run to keep up. One look from Morin and Gros drops his hand, snaps to attention. "Get back to your section," Morin says. The girl is gone before anyone can apologise. Morin glances at you. "Good lad."

- officerRep +2
- Morale +2
- Morin +3 relationship
- Virtue +5
- Sets flag: `ligurian_girl_saved`

**If failed:**

> You run, but Morin isn't where you thought. By the time you find him and drag him back, the spot is empty. No Gros. No girl. Just the basket of lemons overturned in the dirt. Morin looks at the lemons, then at you. He says nothing. You wish he had.

- Morale -3

#### Choice C: "Look away"

*It's not your problem. Keep your head down.*

> You stare at the ground. When you look up, the spot is empty. Gros and the girl are both gone. The basket lies on its side, lemons scattered in the dust. Nobody says anything. You eat your supper in silence and do not sleep well.

- Morale -2
- Virtue -5

---

### 4. The Genoese Merchant

**Triggers at:** 4 actions remaining
**Category:** Supply
**Event ID:** `voltri_genoese_merchant`

**Narrative:**

> A local merchant appears at the edge of camp, mule loaded with bread, cheese, and wine. The prices are outrageous -- three times what they should be. He knows you're starving and he doesn't care. Half the section is already reaching for their purses.

**Choices:**

#### Choice A: "Check the goods"

*Something about those sacks doesn't look right. [Awareness check]*

**If passed:**

> You look closer. The bread sacks are half-filled with straw. The cheese is rinded with wax to hide the mould. "These goods are short," you say, loud enough for the section to hear. The merchant sputters. Morin steps forward. "Double the weight or get out." The men eat well tonight, and they remember who spoke up.

- soldierRep +2
- Morale +3
- Morin +2 relationship

**If failed:**

> You squint at the goods but nothing looks obviously wrong. The men buy at full price. Later, someone finds straw in the bread sacks. By then the merchant is long gone.

- Morale -1
- Sous -1

#### Choice B: "Haggle him down"

*Talk the price down. Make him earn his profit. [Charisma check]*

**If passed:**

> "That price would shame a Parisian banker," you say. The merchant laughs, but you don't blink. You talk about the garrison, the general's orders on fair trading, the provost marshal. The price comes down by half. The men clap you on the back as you walk away with a wheel of cheese.

- soldierRep +1
- Morale +3
- Sous -1

**If failed:**

> You try to talk the price down, but the merchant has done this before. He smiles, shrugs, starts packing his mule. The men glare at you. You end up paying full price just to keep the peace.

- Morale -1
- Sous -2

---

### 5. An Opportunity

**Triggers at:** 2 actions remaining
**Category:** Interpersonal
**Event ID:** `voltri_theft_opportunity`
**Condition:** Only triggers if `gambling_accepted` flag is set (player chose Join or Watch at the Passe-Dix Game)

**Narrative:**

> Felix catches your arm after evening roll call, pulling you into the shadow of a supply wagon. His usual grin is thinner than usual -- more calculating.
>
> "I've been watching the officer's reserve stores. Vidal keeps the key on his belt, but tonight he's drinking with the captain from the 32nd. The lock is nothing. I need someone to keep watch."
>
> He holds your gaze. "Equal shares. Enough bread and wine for a week. What do you say?"

**Choices:**

#### Choice A: "Keep watch"

*Stand guard while Felix works the lock. Equal shares. [Awareness check]*

**If passed:**

> You stand in the shadows, heart hammering, while Felix works the lock with a bent nail. It takes him thirty seconds. He fills a sack with bread, wine, and a wheel of cheese. You slip away like ghosts.
>
> Later, splitting the goods behind the latrine trench, Felix grins at you. "See? Easy money. Easier than dice, even." You eat well tonight. The taste is complicated.

- Morale +2
- Sous +3
- Virtue -10
- Felix +10 relationship

**If failed:**

> You're watching the path when a figure rounds the corner -- Sergeant Morin, on his rounds. You freeze. Felix bolts. Morin doesn't chase him, but he sees you.
>
> "What are you doing here, soldier?"
>
> You stammer something about checking equipment. His eyes go to the supply wagon, the open lock. He says nothing for a long time. "Get back to your section. Now."
>
> He doesn't report you. But the way he looks at you tomorrow is worse than any punishment.

- officerRep -5
- Morale -3
- Virtue -5
- Morin -5 relationship

#### Choice B: "Refuse"

*Shake your head. You're not a thief. Not yet.*

> You shake your head. "Not for me, Felix."
>
> He studies you for a moment, then shrugs. "Your conscience, friend." He slips away into the dark. You hear nothing more about it -- but the next morning, Felix has fresh bread and a guilty smile.

- Morale +1
- Virtue +3
- Felix -3 relationship
