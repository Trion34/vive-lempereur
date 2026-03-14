# Rivoli Camp — Eve of Battle

**Location:** Rivoli Plateau
**Weather:** Cold
**Supply Level:** Scarce
**Total Actions:** 16

---

## Opening Narrative

> The 14th demi-brigade makes camp on the plateau above Rivoli. The Austrian columns are massing in the valley below. Bonaparte is on his way.

---

## Forced Events

Forced events trigger when the player has a specific number of actions remaining.

---

### 1. Austrian Campfires (triggers at 10 actions remaining)

**Category:** Rumour

**Narrative:**

> A thick fog has settled over the plateau, rolling up from the Adige gorge, obscuring your surroundings.
>
> But out there, on the ridges to the north — Austrian campfires, bleeding through the fog like dim orange ghosts.

**Choices:**

#### Choice A: "Steady the nervous"

*Find the right words. Keep the fear from spreading. [Charisma check, difficulty 15]*

**If passed:**

> "Fires," you say, loud enough for the men nearby. "That's all they are. Fires. And tomorrow we'll put them out." A few men laugh — short, nervous laughs. But the tension breaks, just a little. Enough.

- soldierRep +2
- Morale +3

**If failed:**

> "They're just campfires," you say, but your voice comes out thin. No one laughs. A few men glance at you and look away. The fires keep burning.

- Morale -1

#### Choice B: "Try to count them"

*Study the fires. How many columns? [Awareness check, difficulty -15]*

**If passed:**

> You study the fires carefully, tracing their spread across the ridgeline. Five distinct clusters. Five columns, approaching from different directions. You report it to the sergeant. "Good eyes," Duval says. Information that might matter tomorrow.

- officerRep +3
- Morale +3

**If failed:**

> You try to count the fires but they blur together into a single carpet of light. Three columns? Five? Twenty? The darkness gives no answers. You stare until your eyes ache.

- Morale -2

---

### 2. Officer's Briefing (triggers at 7 actions remaining)

**Category:** Orders

**Narrative:**

> Your section is drawing cartridges from the supply wagon when Sergeant Duval appears. "Dawn. Austrians from the north. Three columns at least." He looks along the line. "Front rank needs filling." The section goes quiet.

**Choices:**

#### Choice A: "Volunteer for front rank"

*Step forward. Where the danger is greatest. [Valor check, difficulty 0]*

**If passed:**

> You step forward. Duval looks at you. "Good man."
>
> Behind you, a movement. Pierre steps up, quiet and steady, taking his place at your shoulder. Then Jean-Baptiste, white as chalk, falls in beside you without a word.
>
> The front rank. Where the first volley hits. Where the lines meet. You volunteered. They followed.

- soldierRep +3, officerRep +3
- Morale +2
- Duval relationship +5
- Sets player `frontRank = true`

**If failed:**

> You step forward, but your voice catches. Duval looks at you for a long moment. "Courage is not the absence of fear, soldier. It is mastery of it. Take the front rank."
>
> Pierre is already beside you — he would have volunteered anyway. Then Jean-Baptiste stumbles forward, hands shaking, refusing to meet anyone's eyes. But he is there. Your legs feel like water. But you are in the front rank. All three of you.

- soldierRep +1, officerRep +1
- Morale -3
- Duval relationship +3
- Sets player `frontRank = true`

#### Choice B: "Stay quiet"

*The front rank is for the brave or the foolish.*

> You stay silent. The sergeant's eyes pass over you without stopping. Relief and shame in equal measure. The front rank fills without you.

- Morale -3

---

### 3. The Night Before (triggers at 3 actions remaining)

**Category:** Orders (cinematic-only event, no choices)

**Narrative:**

> The 14th demi-brigade bivouacs on the plateau above Rivoli. The January night is bitter. The fog still clings to the plateau, draping the camp in grey.
>
> You find a spot near a warm fire. Someone passes a heel of bread. Someone else is sharpening a bayonet, the cold song of steel. "It's been a long road, hasn't it?" Jean-Baptiste jerks you from some listless reverie. "Since Voltri." Ten long months.
>
> Then the wind shifts. Slowly at first, then all at once, the fog tears apart like a curtain.
>
> And there they are. Campfires. Not dozens — thousands. Covering the slopes of Monte Baldo like a second sky. Every one of them a squad, a company, a column. Now every man knows with certainty. We are outnumbered.

---

### 4. Bonaparte Rides Past (triggers at 1 action remaining)

**Category:** Orders

**Narrative:**

> A stir runs through the camp. Hooves on frozen ground. Bonaparte himself rides past the fires of the 14th, grey coat, plain hat, that sharp profile lit by the flames. He does not stop. He does not speak. But every man straightens as he passes. The general sees everything. Everyone knows it.

**Choice:** "Continue" [Valor check, difficulty 0]

**If passed:**

> You stand straight. Musket grounded. Eyes forward. Bonaparte's gaze sweeps over you. You stood like a soldier when the general rode past. The men around you noticed.

- soldierRep +1, napoleonRep +2
- Morale +3

**If failed:**

> You keep a low profile. The general passes. But something nags — a missed moment, a chance to be seen. If only you had more courage.

- No stat changes

---

## Random Events

Random events have a chance of triggering on any camp action. Each can only trigger once.

---

### Pierre's Story

**Category:** Interpersonal

**Narrative:**

> Pierre is sitting apart from the others, staring into the fire. His face is unreadable. He has been at Arcole, at Lodi, at a dozen fights whose names you barely know. He has not spoken all evening. But there is something in his silence tonight that is different. Heavier.

**Choices:**

#### Choice A: "Listen"

*Sit beside him. Wait for him to speak.*

> You sit beside him. Minutes pass. The fire shifts. Finally: "At Arcole, I watched my brother die on the bridge. Bayonet through the chest. Took him two hours." He says nothing else. Neither do you. But when you leave, he puts a hand on your shoulder. Brief. Heavy.

- Morale +2
- Pierre relationship +6

#### Choice B: "Ask about Arcole"

*Draw him out. [Charisma check, difficulty 0]*

**If passed:**

> "Tell me about Arcole," you say. Pierre is quiet for a long time. Then he talks — not the version the officers tell, but the real one. The confusion, the fear, the bridge that kept filling with dead. "We held," he says at the end. "That's what matters." His voice is steady. Yours is steadier for hearing it.

- Valor +1
- Morale +3
- Pierre relationship +8

**If failed:**

> "Tell me about—" Pierre cuts you off with a look. "No." The silence afterward is heavier than the darkness. You leave him to his fire and his ghosts.

- Morale -1
- Pierre relationship -3

---

### Short Rations

**Category:** Supply

**Narrative:**

> The quartermaster distributes what passes for supper: a quarter-loaf of hard bread, a sliver of cheese, a cup of thin broth. It is not enough. It was never going to be enough. Jean-Baptiste stares at your portion. He has already finished his own.

**Choices:**

#### Choice A: "Accept your share"

*Eat what you are given. A soldier endures.*

> You eat your share slowly, making each bite last. The bread is hard. The cheese is harder. But it is fuel, and tomorrow you will burn through all of it. A soldier eats what he is given and is grateful.

- No stat changes

#### Choice B: "Share with Jean-Baptiste"

*Give him half your bread. [Constitution check, difficulty 0]*

**If passed:**

> You break your bread in half and push it across to Jean-Baptiste. He stares at it, then at you. "I can't—" "Eat it." He eats. Your stomach aches through the night, but your constitution holds. The boy won't forget.

- soldierRep +2
- Morale +2
- Jean-Baptiste relationship +8

**If failed:**

> You give half your bread to Jean-Baptiste. He takes it gratefully. Your stomach protests through the night. By dawn you are light-headed and weak. Generosity and wisdom are not always the same thing.

- Stamina -5
- Morale -1
- Jean-Baptiste relationship +6

---

### Jean-Baptiste's Fear

**Category:** Interpersonal

**Narrative:**

> You find Jean-Baptiste behind the supply wagon, sitting in the dark. His hands are shaking.
>
> "I can't do it," he whispers. "Tomorrow. The line. I can't."
>
> He's not the only one thinking it. He's just the only one saying it out loud.

**Choices:**

#### Choice A: "Reassure him"

*"You can. You will. Stay beside me." [Charisma check, difficulty 0]*

**If passed:**

> "You can. You will. Stay beside me tomorrow and do what I do." Your voice is steadier than you feel. Jean-Baptiste looks at you. The shaking slows. Stops. "Beside you," he repeats. "I can do that." He believes you. Now you have to be worthy of that belief.

- Morale +3
- Jean-Baptiste relationship +10

**If failed:**

> You try to reassure him but the words ring hollow. He can hear the doubt in your voice. "You're afraid too," he says. It is not a question. You leave him behind the wagon, and the dark feels darker.

- Morale -5
- Jean-Baptiste relationship +2

#### Choice B: "Tell him the truth"

*"Everyone's afraid. The brave ones just march anyway." [Valor check, difficulty 0]*

**If passed:**

> "Everyone's afraid," you say. "Pierre is afraid. Duval is afraid. The difference is they march anyway." Jean-Baptiste is quiet for a long time. "The brave ones just march anyway," he repeats. It is not comfort. It is something harder and more useful. Truth.

- Morale +2
- Jean-Baptiste relationship +5
- Pierre relationship +2

**If failed:**

> "Everyone's afraid," you say. But the words come out wrong — too blunt, too hard. Jean-Baptiste flinches like you struck him. "So there's no hope then," he whispers. You meant to be honest. Instead you made it worse.

- Morale -2
- Jean-Baptiste relationship -2
- Pierre relationship +2

#### Choice C: "Say nothing"

*Sit with him in the dark. Sometimes presence is enough.*

> You sit beside him in the dark. You don't speak. Neither does he. The shaking continues for a while, then gradually eases. When he finally stands up, he touches your arm briefly. Sometimes presence is enough. Sometimes it is everything.

- Morale +2
- Jean-Baptiste relationship +6

---

## Forage Narratives

Three possible success texts and three possible failure texts, selected randomly.

### Forage Success

> You find a root cellar half-buried in snow behind an abandoned farmhouse. Frozen turnips, a sack of chestnuts, a clay jug of vinegar. Not much — but the men cheer when you come back.

> A skinny chicken, hiding in the ruins of a barn. You wring its neck before it can squawk. Tonight, the section eats.

> Firewood. Real firewood — dry oak, stacked under a collapsed shed roof. You drag back as much as you can carry. The fire burns properly for the first time in days.

### Forage Failure

> Nothing. Frozen fields picked clean by every army that has passed this way. You come back empty-handed, boots soaked through, fingers blue.

> You range further than you should, alone on the mountainside. The wind cuts through your coat. There is nothing here. There was never anything here.

> An abandoned village, already stripped. Every cupboard bare, every root cellar emptied. You kick through the snow for an hour and find nothing but frozen mud.

---

## Socialize Narratives

### Pierre

> Pierre is quiet as always, but tonight he shares his tobacco. "You did well today," he says. From him, that's a speech.

### Jean-Baptiste

> Jean-Baptiste talks rapidly about home — the bakery, the river, his sister's cat. You listen. Sometimes listening is enough.

### Sergeant Duval

> Sergeant Duval grumbles about the rations, the officers, the war. But there's a grudging warmth underneath. "At least you're not useless," he says.

### Captain Leclerc

> Captain Leclerc speaks of glory and promotion. His eyes shine in the firelight. "We'll make captain yet," he says. He means himself, but includes you in the dream.
