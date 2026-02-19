# EVENTS — The Little Soldier: Battle of Rivoli

Complete chronological reference for every event, story beat, and narrative choice in the game. All flavor text, choices, stat checks, and consequences.

---

## 1. Prologue

*Cinematic overlay with typewriter text. Plays on first entering pre-battle camp.*

**Subtitle:** *Italy. January, 1797.*

**Chunk 1:**
> For ten months, General Bonaparte has led the Army of Italy on a campaign that has stunned Europe. Montenotte. Lodi. Castiglione. Arcole. Each victory bought with blood and boot leather.
>
> The army that was starving and barefoot in the spring now holds all of northern Italy in its grip.

**Chunk 2:**
> But the war is not won. The great fortress of Mantua remains under siege, its Austrian garrison slowly starving. And now Field Marshal Alvinczi marches south with twenty-eight thousand men to break the siege and drive the French into the sea.

**Chunk 3:**
> General Joubert's division — your division — holds the plateau above the village of Rivoli, where the Adige valley opens onto the plains of northern Italy. Ten thousand men against twenty-eight thousand.
>
> If the line breaks here, Mantua is relieved and the campaign is lost.

**Chunk 4:**
> You are a soldier of the 14th demi-brigade de ligne. You have been told to hold this ground. You have been told that Bonaparte rides through the night to take command, and that Masséna's division marches behind him.
>
> Until they arrive, the plateau is yours to hold.

**Choice:** `Make Camp` — "The plateau awaits."

---

## 2. Pre-Battle Camp: Scripted Events

### 2a. Austrian Campfires

*Triggers at 6 actions remaining.*

> The fog has settled thick over the plateau, rolling up from the Adige gorge. The sentries have vanished into the grey. Sounds are muffled and strange — a cough becomes a footstep, the wind becomes a whispered order.
>
> But out there, on the ridges to the north — dim orange ghosts. Austrian campfires, smeared through the murk. They flicker and shift like something not quite real. How many? Impossible to say. The fog won't tell you. The not knowing is the worst part.

#### Choice 1: Steady the nervous
*"Find the right words. Keep the fear from spreading. [Charisma check]"*

- **Check:** Charisma, difficulty +15

**Success:**
> "Fires," you say, loud enough for the men nearby. "That's all they are. Fires. And tomorrow we'll put them out." A few men laugh — short, nervous laughs. But the tension breaks, just a little. Enough.

- Morale +3, Soldier Rep +2

**Failure:**
> "They're just campfires," you say, but your voice comes out thin. No one laughs. A few men glance at you and look away. The fires keep burning.

- Morale -1

#### Choice 2: Try to count them
*"Study the fires. How many columns? [Awareness check]"*

- **Check:** Awareness, difficulty -15

**Success:**
> You study the fires carefully, tracing their spread across the ridgeline. Five distinct clusters. Five columns, approaching from different directions. You report it to the sergeant. "Good eyes," Duval says. Information that might matter tomorrow.

- Morale +1, Officer Rep +3

**Failure:**
> You try to count the fires but they blur together into a single carpet of light. Three columns? Five? Twenty? The darkness gives no answers. You stare until your eyes ache, but the ridges keep their secrets.

- Morale -2

---

### 2b. Officer's Briefing

*Triggers at 4 actions remaining.*

> Captain Leclerc gathers the company around a fire. He draws lines in the dirt with his sword. "The Austrians will come from the north. Three columns, maybe four. We hold this plateau. We hold it or we die on it." He looks up. "I need men for the front rank."

#### Choice 1: Volunteer for front rank
*"Step forward. Where the danger is greatest. [Valor check]"*

- **Check:** Valor

**Success:**
> You step forward. Leclerc looks at you. "Good man."
>
> Behind you, a movement. Pierre steps up, quiet and steady, taking his place at your shoulder. Then — Jean-Baptiste. Pale, jaw tight, but standing. He doesn't look at you. He doesn't need to.
>
> The front rank. Where the first volley hits. Where the bayonets meet. You volunteered. They followed.

- Sets `frontRank = true` (+15% return fire in Part 1)
- Morale +2, Soldier Rep +3, Officer Rep +3, Leclerc relationship +5

**Failure:**
> You step forward, but your voice catches. Leclerc looks at you for a long moment. "Courage is not the absence of fear, soldier. It is mastery of it. Take the front rank."
>
> Pierre is already beside you — he would have volunteered anyway. Then Jean-Baptiste stumbles forward, hands shaking, refusing to meet anyone's eyes. But he is there. Your legs feel like water. But you are in the front rank. All three of you.

- Sets `frontRank = true` (+15% return fire in Part 1)
- Morale -3, Soldier Rep +1, Officer Rep +1, Leclerc relationship +3

#### Choice 2: Stay quiet
*"The front rank is for the brave or the foolish."*

> Others volunteer. You stay silent. The captain's eyes pass over you without stopping. Relief and shame in equal measure. The front rank fills without you. Tomorrow you will stand in the second file. Safer. Quieter.

- Morale -3

---

### 2c. The Night Before

*Triggers at 2 actions remaining. Cinematic overlay, no choices.*

**Title:** THE NIGHT BEFORE

> The 14th demi-brigade bivouacs on the plateau above the Adige. The January night is bitter. The fog still clings to the plateau, muffling the camp in grey.

> You find a spot near a dying fire. Someone passes a heel of bread. Someone else is sharpening a bayonet, the scrape of steel steady as a heartbeat. The veterans don't talk about the odds. The conscripts can't stop talking about them.

> Then the wind shifts. Slowly at first, then all at once, the fog tears apart like a curtain.

> And there they are. Campfires. Not dozens — thousands. Covering the slopes of Monte Baldo, filling the valleys, spreading from the Adige to Lake Garda like a second sky. Every one of them a squad, a company, a column. The plateau goes silent. Every man sees it. No one needs to say what it means.

> They are many. And they are close.

---

### 2d. Bonaparte Rides Past

*Triggers at 1 action remaining.*

> A stir runs through the camp. Hooves on frozen ground. Bonaparte himself rides past the fires of the 14th, grey coat, plain hat, that sharp profile lit by the flames. He does not stop. He does not speak. But every man straightens as he passes. The general sees everything. Everyone knows it.

#### Choice 1: Stand tall
*"Let him see a soldier ready for tomorrow."*

> You stand straight. Musket grounded. Eyes forward. Bonaparte's gaze sweeps over you — or maybe it doesn't. It doesn't matter. You stood like a soldier when the general rode past. The men around you noticed.

- Morale +3, Soldier Rep +1, Napoleon Rep +2

#### Choice 2: Keep your head down
*"Attention from generals is rarely good."*

> You keep low, face turned to the fire. The general passes. No one notices you. That was the point. But something nags — a missed moment, a chance to be seen. The feeling fades. Survival is its own reward.

- No stat changes

---

## 3. Pre-Battle Camp: Random Events

*40% chance to trigger after each camp activity. 3 events in the pool.*

### 3a. Pierre's Story

> Pierre is sitting apart from the others, staring into the fire. His face is unreadable. He has been at Arcole, at Lodi, at a dozen fights whose names you barely know. He has not spoken all evening. But there is something in his silence tonight that is different. Heavier.

#### Choice 1: Listen
*"Sit beside him. Wait for him to speak."*

> You sit beside him. Minutes pass. The fire shifts. Finally: "At Arcole, I watched my brother die on the bridge. Bayonet through the chest. Took him two hours." He says nothing else. Neither do you. But when you leave, he puts a hand on your shoulder. Brief. Heavy.

- Morale +2, Pierre relationship +6

#### Choice 2: Ask about Arcole
*"Draw him out. [Charisma check]"*

- **Check:** Charisma

**Success:**
> "Tell me about Arcole," you say. Pierre is quiet for a long time. Then he talks — not the version the officers tell, but the real one. The confusion, the fear, the bridge that kept filling with dead. "We held," he says at the end. "That's what matters." His voice is steady. Yours is steadier for hearing it.

- Morale +3, Valor +1, Pierre relationship +8

**Failure:**
> "Tell me about—" Pierre cuts you off with a look. "No." The silence afterward is heavier than the darkness. You leave him to his fire and his ghosts.

- Morale -1, Pierre relationship -3

---

### 3b. Short Rations

> The quartermaster distributes what passes for supper: a quarter-loaf of hard bread, a sliver of cheese, a cup of thin broth. It is not enough. It was never going to be enough. Jean-Baptiste stares at your portion. He has already finished his own.

#### Choice 1: Accept your share
*"Eat what you are given. A soldier endures."*

> You eat your share slowly, making each bite last. The bread is hard. The cheese is harder. But it is fuel, and tomorrow you will burn through all of it. A soldier eats what he is given and is grateful.

- No stat changes

#### Choice 2: Share with Jean-Baptiste
*"Give him half your bread. [Constitution check]"*

- **Check:** Constitution

**Success:**
> You break your bread in half and push it across to Jean-Baptiste. He stares at it, then at you. "I can't—" "Eat it." He eats. Your stomach aches through the night, but your constitution holds. The boy won't forget.

- Morale +2, Soldier Rep +2, Jean-Baptiste relationship +8

**Failure:**
> You give half your bread to Jean-Baptiste. He takes it gratefully. Your stomach protests through the night. By dawn you are light-headed and weak. Generosity and wisdom are not always the same thing.

- Morale -1, Stamina -5, Jean-Baptiste relationship +6

---

### 3c. Jean-Baptiste's Fear

> You find Jean-Baptiste behind the supply wagon, sitting in the dark. His hands are shaking.
>
> "I can't do it," he whispers. "Tomorrow. The line. I can't."
>
> He's not the only one thinking it. He's just the only one saying it out loud.

#### Choice 1: Reassure him
*"You can. You will. Stay beside me." [Charisma check]*

- **Check:** Charisma

**Success:**
> "You can. You will. Stay beside me tomorrow and do what I do." Your voice is steadier than you feel. Jean-Baptiste looks at you. The shaking slows. Stops. "Beside you," he repeats. "I can do that." He believes you. Now you have to be worthy of that belief.

- Morale +3, Jean-Baptiste relationship +10

**Failure:**
> You try to reassure him but the words ring hollow. He can hear the doubt in your voice. "You're afraid too," he says. It is not a question. You leave him behind the wagon, and the dark feels darker.

- Morale -5, Jean-Baptiste relationship +2

#### Choice 2: Tell him the truth
*"Everyone's afraid. The brave ones just march anyway." [Valor check]*

- **Check:** Valor

**Success:**
> "Everyone's afraid," you say. "Pierre is afraid. Duval is afraid. The difference is they march anyway." Jean-Baptiste is quiet for a long time. "The brave ones just march anyway," he repeats. It is not comfort. It is something harder and more useful. Truth.

- Morale +2, Jean-Baptiste relationship +5, Pierre relationship +2

**Failure:**
> "Everyone's afraid," you say. But the words come out wrong — too blunt, too hard. Jean-Baptiste flinches like you struck him. "So there's no hope then," he whispers. You meant to be honest. Instead you made it worse.

- Morale -2, Jean-Baptiste relationship -2, Pierre relationship +2

#### Choice 3: Say nothing
*"Sit with him in the dark. Sometimes presence is enough."*

> You sit beside him in the dark. You don't speak. Neither does he. The shaking continues for a while, then gradually eases. When he finally stands up, he touches your arm briefly. Sometimes presence is enough. Sometimes it is everything.

- Morale +2, Jean-Baptiste relationship +6

---

## 4. Opening Beat

*"Fate Beckons..." splash, then cinematic overlay. Plays when player clicks "Begin" to start the battle.*

**Title:** BATTLE OF RIVOLI
**Subtitle:** *14 January 1797*

> Dawn on the Rivoli plateau. January cold cuts through your patched coat. The 14th stands in the second line, muskets loaded, waiting. The mountains fill the horizon — and somewhere in those gorges, twenty-eight thousand Austrians are moving.

> Gunfire erupts on the right flank. Not the steady crash of volleys — ragged, sudden, too early. The battle has begun before anyone expected it.

> To your left, Pierre checks his flint. Arcole veteran. Steady hands. To your right, Jean-Baptiste grips his musket like a drowning man grips driftwood.

> The drums roll. The 14th advances through the broken ground — vineyards, stone walls, churned earth — toward the sound of the guns.

> "Present arms! First volley on my command!"

**Choice:** `Take your place in the line` — "The drums are rolling. The 14th advances."

---

## 5. Part 1: The Line (Volleys 1-4)

### Per-Volley Scripted Narratives

#### Volley 1 (120 paces)

| Step | Captain's Order / Narrative | Events |
|------|-----------------------------|--------|
| PRESENT | "Present arms. 120 paces." | — |
| FIRE | "Feu!" The captain's sword drops. | "First volley hit." Morale +2 |
| ENDURE | "Return fire." | "Fighting on the right." Morale -4 (sounds of battle), -2 (under fire), +2 (drums steady). Neighbour contagion. |

#### Volley 2 (80 paces)

| Step | Captain's Order / Narrative | Events |
|------|-----------------------------|--------|
| PRESENT | "Present. 80 paces." | — |
| FIRE | "FIRE!" The word tears down the line. | "Man killed nearby." Morale -3. Line integrity -3. |
| ENDURE | "Return fire." | Morale -3 (enemy close), +2 (drums hold). Neighbour contagion. |

*JB Crisis auto-resolves at Volley 2 based on (charisma + valor) / 2.*

---

### 5a. Wounded Sergeant (after Volley 2)

*"Fate Beckons..." splash, then cinematic overlay.*

**Title:** THE WOUNDED SERGEANT

> At fifty paces, the Austrian volley tears through the line. Sergeant Duval — the granite-faced NCO who has held the section together since dawn — takes a ball in the thigh.
>
> He goes down hard. His spontoon clatters against the stones. For a moment, his face shows nothing — just surprise, as if he'd tripped on a vine root. Then the pain hits and he grabs his leg with both hands.
>
> "Sergeant's down!" The cry ripples through the section. Men glance sideways. The drummer falters for half a beat before the rhythm reasserts itself.
>
> Captain Leclerc is thirty paces to the left, dealing with a gap in the line where an entire file went down. He hasn't seen. The section — your section — is without its NCO.
>
> The line wavers. Men look to each other. Someone must act.

*Sets `ncoPresent = false` for remainder of battle. All choices cost -15 stamina.*

#### Choice 1: Take the sergeant's place
*"Pick up his spontoon. Give orders. You are not an NCO — but someone must be. [Valor + Charisma check]"*

- **Check:** Combined (valor + charisma) / 2, difficulty -5

**Success:**
> You don't think. You move. Duval's spontoon is in your hand before you've made a decision — the weight of it strange, an NCO's weapon, not a private's.
>
> "SECTION! HOLD THE LINE!" Your voice cuts through the smoke. Where did that come from?
>
> Men turn. They see you — a private with a sergeant's spontoon, standing where Duval stood, giving orders you have no right to give. And somehow, impossibly, they listen.
>
> The line steadies. The drums pick up. Pierre, blood on his sleeve, gives you a look that is half-surprise, half-respect.
>
> Duval, being dragged to the rear by a pair of privates, manages through gritted teeth: "Not bad, soldier. Not bad at all."

- Morale +8, Valor +3, Soldier Rep +8, Officer Rep +15
- Line integrity +5
- **Grace earned (+1)**

**Failure:**
> You grab Duval's spontoon and stand. "SECTION! HOLD—"
>
> Your voice cracks. The command comes out thin, uncertain — a private playing at sergeant. Men glance at you, then look away. The authority isn't there. Not yet.
>
> But you tried. You stood up when no one else did. Pierre meets your eye and nods. The line holds — not because of your command, but because you showed them someone was willing to try.
>
> It's not nothing.

- Morale -3, Soldier Rep +3, Officer Rep +5

#### Choice 2: Rally the men around you
*"You can't replace Duval. But you can shout, hold your section, keep the men beside you steady. [Charisma check]"*

- **Check:** Charisma

**Success:**
> You can't replace Duval. You're no NCO. But you can be loud.
>
> "HOLD TOGETHER! THE SERGEANT'S BEING TENDED! HOLD!"
>
> The men on either side of you hear it. They see you standing, musket level, voice steady. The fear doesn't go away — it never goes away — but the panic that was building in the section eases. Just enough.
>
> The line steadies. Not because of orders. Because someone refused to be silent.

- Morale +5, Soldier Rep +3

**Failure:**
> "HOLD! HOLD THE—"
>
> Your shout is swallowed by the crash of the next volley. The men around you don't hear, or don't listen. You're just another private screaming in the smoke.
>
> The line holds anyway — barely — through momentum and drill and the fact that running is as terrifying as staying.

- Morale -1

#### Choice 3: Keep your head down
*"Not your job. Not your rank. Survive the next two volleys and let the officers sort it out."*

> Duval goes down. Men look around for leadership. You look at your musket. Your boots. The cartridge box.
>
> Not your job. Not your rank. A private does not give orders. A private survives.
>
> The section finds its own equilibrium — men shuffling, the rear rank closing up, Pierre barking instructions through gritted teeth because someone has to. The line holds without you. You are part of the furniture.
>
> No one notices your silence. That is its own kind of verdict.

- Morale -2, Soldier Rep -3, Officer Rep -5

*Auto-play resumes with Volleys 3-4.*

---

#### Volley 3 (50 paces)

| Step | Captain's Order / Narrative | Events |
|------|-----------------------------|--------|
| PRESENT | "Present. 50 paces." | If Pierre alive: "Pierre hit. Shoulder. Still fighting." Morale -6, Pierre wounded. |
| FIRE | "FIRE!" At fifty paces, the captain's voice is raw. | — |
| ENDURE | "Return fire. Men fall." | "Artillery silent. Too close." / "Left flank under pressure." Morale -5, line integrity -5. "Leclerc: 'Steady, Fourteenth!'" Morale +4. Morale -4 (close range). |

#### Volley 4 (25 paces)

| Step | Captain's Order / Narrative | Events |
|------|-----------------------------|--------|
| PRESENT | "Present. 25 paces. Last volley." | "Enemy charging. Left flank breaking." Morale -4 (charging), -3 (flank breaking). |
| FIRE | "Tirez! Dernière salve!" Point blank. | — |
| ENDURE | "Fix bayonets." | "Bayonets fixed." If Pierre alive: "Pierre fixes bayonet. Still fighting." Morale +2. Morale -5 (point blank). |

---

### 5b. Fix Bayonets (after Volley 4)

*"Fate Beckons..." splash, then cinematic overlay.*

**Title:** FIX BAYONETS

*Conditional NCO line:*
- If NCO present: "Sergeant Duval's voice cuts through the chaos: 'Fourteenth! BAYONETS!'"
- If NCO absent: "The sergeant's place is empty — his spontoon lies where it fell. But the drill does not need a voice. Every man knows what comes next."

> The last volley tears through the Austrian ranks at twenty-five paces. Point blank. The smoke has barely cleared when the drums change their beat — not the steady rhythm of the line, but something faster. Urgent. Ancient.
>
> The pas de charge.
>
> [NCO status]
>
> Bayonets rasp from scabbards up and down the line. Steel clicks onto muzzles. Your musket becomes a spear.

*Conditional Pierre line:*
- If alive + wounded: "Pierre, blood soaking through his sleeve, fixes his bayonet one-handed. His teeth are clenched. His eyes are steady. The veteran has been here before."
- If alive + not wounded: "Pierre fixes his bayonet with the calm precision of a man who has done this a hundred times. He catches your eye. Nods once."
- If dead: "Pierre's place in the line is empty. Don't look. Don't think about it. Fix your bayonet."

*Jean-Baptiste (always):*
> Jean-Baptiste fixes his bayonet. His hands shake — but he does it. He looks at you once, a look that says everything, and faces front. He will not break.

> And then the left flank crumbles. You see it happen — white coats pouring through the gap where the companies to your left were standing a moment ago. The ordered line dissolves. Walled gardens and vineyard terraces become individual battlefields. The 14th is no longer a firing line.
>
> It is a collection of men with bayonets, standing in the broken ground of Rivoli, about to fight for their lives.
>
> Captain Leclerc's voice, one final time: "FOURTEENTH! EN AVANT!"

#### Choice: Fix bayonets
*"The drill has carried you this far. Steel to steel. This is what the bayonet is for."*

> You fix your bayonet. The steel slides home with a click that is louder than any volley.
>
> The Austrian column hits what is left of the line. Not as a formation — as a wave. Men crash into men across the broken ground. Musket butts, bayonets, fists, teeth. The 14th fights in the vineyards, among the stone walls, in the spaces between the living and the dead.
>
> You are in it now. No more volleys. No more drill. Just the weight of the man in front of you and the point of your bayonet and the will to survive.

- Morale +3

*Transitions to Terrain Melee.*

---

## 6. Terrain Melee

*4 opponents, sequential resolution. See SYSTEMS.md for full combat mechanics.*

**Event Narrative:**
> --- MELEE ---
>
> The ordered line is gone. This is knives and teeth and the will to survive in the vineyards of Rivoli.

---

## 7. The Battery (after Terrain Melee)

*"Fate Beckons..." splash, then cinematic overlay.*

**Title:** THE BATTERY

> The 14th fights on. Ground is taken, lost, taken again across the broken terrain of the plateau. Vineyards become killing grounds. Walled gardens become fortresses held for minutes, then lost.
>
> Through the chaos, you hear it — the crack of artillery, closer than before, firing in the wrong direction. The Austrians have overrun one of your batteries. French guns turned against French troops.
>
> Over the cacophony, Captain Leclerc's voice rings out — hoarse, furious, alive with defiance:
>
> "FOURTEENTH! Will you let them take your guns?!"
>
> You catch Pierre's eye across the press of bodies. Blood on his sleeve, bayonet steady. A glimmer of something — not madness, not despair. Valor. The real thing.

#### Choice 1: Charge the battery
*"Heed the captain's call. Charge into the teeth of your own guns to take them back."*

> You don't think. Your legs move. Pierre is beside you — blood on his sleeve, bayonet level — and you are running, both of you, across the open ground toward the battery.
>
> The guns fire. Your own guns. Canister tears the air around you — men fall to your left and right. But you are still running, and Pierre is still running, and the captain is somewhere behind you screaming the Fourteenth forward.
>
> The Austrian gunners see you coming. Some reach for short swords. Others try to turn the guns. Too late. Too slow.
>
> You are among them.

- Morale +5
- Sets `batteryCharged = true`

*Transitions to Battery Melee (3 opponents).*

**Battery Event Narrative:**
> --- THE BATTERY ---
>
> The redoubt is chaos. Overturned caissons, scattered rammers, the acrid reek of powder. The guns loom like iron beasts. French guns. Your guns. Time to take them back.

#### Choice 2: Hold back
*"Let braver souls lead. You've done enough."*

> You hesitate. Your legs don't move. Pierre glances back at you — just a glance, no judgment in it, not yet — and then he's gone, charging with the others toward the battery.
>
> You watch them go. Captain Leclerc. Pierre. Men whose names you know. Men whose names you don't. They run across the open ground and the guns fire and men fall and they keep running.
>
> The battery is retaken. You see it happen from fifty paces back. The tricolour goes up over the guns. A cheer rises from the smoke.
>
> You were not part of it.
>
> You tell yourself you made the right choice. You will keep telling yourself that.

- Morale -3, Soldier Rep -5
- Sets `batteryCharged = false`

*Skips Battery Melee, transitions directly to Masséna.*

---

## 8. Masséna's Arrival (after Battery)

*"Fate Beckons..." splash, then cinematic overlay.*

**Title:** MASSÉNA'S ARRIVAL

> The sound comes from the south — drums. Not Austrian drums. French drums, beating the pas de charge, growing louder. Through the haze of powder smoke, you see them: fresh troops in blue coats, formed lines, bayonets glinting. Thousands of them.
>
> Masséna's division slams into the Austrian flank like a fist. The columns that have been pressing the plateau stagger, turn, try to reform against this new threat. For the first time since dawn, the pressure on the 14th eases.

*Conditional Pierre status:*
- If alive + wounded: "Pierre leans against a gun carriage, his shoulder bound with a strip torn from someone's coat. The blood has soaked through. He catches your eye and nods once. Still here."
- If alive + not wounded: "Pierre sits on an upturned caisson, cleaning his bayonet with methodical strokes. Steady hands. Steady eyes."
- If dead: "Pierre's place in the line is empty. You don't look at the spot where he fell."

*Jean-Baptiste (always):*
> Jean-Baptiste is pale but upright. He checks his flint with hands that barely shake. Whatever you said to him during the second volley — it held. He's still a soldier.

> Captain Leclerc walks the line. His coat is torn, his face is black with powder, but his voice is steady: "Five minutes, Fourteenth. Reform. Reload. This isn't over — Vukassovich is coming from the gorges with fresh columns. But we have five minutes. Use them."
>
> Five minutes. What do you do?

#### Choice 1: Tend your wounds
*"Bind your cuts, drink water, catch your breath. You need your body to hold together for what's coming."*

> You find a wall and lean against it. The stone is cold. Good. You tear a strip from a dead man's shirt — no time for squeamishness — and bind the worst of it. Your shoulder. Your side where something grazed you during the melee.
>
> The water in your canteen is lukewarm and tastes of metal. You drink anyway. Your hands stop shaking, just a little.
>
> Five minutes. Not enough. But something.

- Health +15, Stamina +30, Morale +3

#### Choice 2: Check on your comrades
*"Find Pierre and Jean-Baptiste. See who's still standing. The line needs its people more than its muskets."*

*Pierre scene varies:*
- If alive + wounded: "You find Pierre first. He's binding his own shoulder, one-handed, teeth gripping the bandage end. You kneel and help. He doesn't thank you. He doesn't need to. 'You did well today,' he says quietly. From Pierre, that's a medal."
  - Left neighbour morale +10
- If alive + not wounded: "Pierre nods when he sees you. 'Still standing,' he says. 'Both of us.' He offers his canteen. You drink. The simple kindness of it nearly undoes you."
- If dead: "Pierre's place is empty. You stand where he stood this morning and the silence is deafening."

*Jean-Baptiste (always):*
> Jean-Baptiste looks up when you approach. He's afraid — of course he's afraid — but he meets your eyes. "I won't break," he says. You believe him. Mostly.

- Stamina +15, Morale +8, Soldier Rep +3

#### Choice 3: Scavenge ammunition
*"Strip cartridges from the dead. Check your flint. Make sure your musket is ready. Cold and practical."*

> You go among the dead. It doesn't bother you the way it should. Fingers find cartridge boxes, pry them open, stuff the paper cylinders into your own pouch. Twenty rounds. Thirty. Enough.
>
> You check your flint. Replace it with a sharper one from a man who won't need it anymore. The musket is clean. Loaded. Ready.
>
> Cold work. Necessary work. The dead don't mind.

- Morale +2
- Musket loaded, aim bonus for Part 2

#### Transition Narrative (all choices):

> The five minutes are over. Captain Leclerc's voice: "FOURTEENTH! Form line! They're coming again!"
>
> From the east, through the gorges of the Adige, fresh Austrian columns emerge — Vukassovich's corps, twenty thousand strong. The men who just fought through hell must now fight again.
>
> Masséna's attack bought time. Not victory. The battle is entering its second act.
>
> "Present arms!"

*Transitions to Part 2. Enemy resets to fresh column at 100 paces.*

---

## 9. Part 2: Hold the Line (Volleys 5-7)

#### Volley 5 (100 paces)

| Step | Captain's Order / Narrative | Events |
|------|-----------------------------|--------|
| PRESENT | "Present. 100 paces. Fresh column." | "Vukassovich guns open." Morale -5. "Massena still fighting." Morale +3. |
| FIRE | "Feu!" | — |
| ENDURE | "Return fire. Fresh muskets." | "Reuss attacks the Pontare." Morale -4. Morale -2 (tired, fresh enemy), +2 (drums). If Pierre alive: "Pierre reloads beside you." Morale +2. |

#### Volley 6 (60 paces)

| Step | Captain's Order / Narrative | Events |
|------|-----------------------------|--------|
| PRESENT | "Present. 60 paces. Right flank open." | "Pontare fallen. Right flank exposed." Morale -6, line integrity -5. "Leclerc: 'Hold the line!'" Morale +3. |
| FIRE | "FIRE!" | — |
| ENDURE | "Return fire. Surrounded." | "Lusignan at Affi. Surrounded." Morale -8. If Pierre alive: "Pierre: 'We've been in worse.'" Morale +3. Morale -3 (close range, exhausted). |

#### Volley 7 (40 paces)

| Step | Captain's Order / Narrative | Events |
|------|-----------------------------|--------|
| PRESENT | "Present. 40 paces. Last volley." | "Men breaking in the rear." Morale -5, line integrity -8. |
| FIRE | "TIREZ!" | — |
| ENDURE | "Bonaparte on the ridge. Counterattack ordered." | "Bonaparte on the ridge. Counterattack ordered." Morale +10. "Leclerc: 'To the ridge!'" Morale +5. Morale -4 (close range). |

---

## 10. The Gorge (after Part 2)

*"Fate Beckons..." splash, then cinematic overlay.*

**Title:** THE GORGE

> On the ridge above the plateau, a small figure on a grey horse. Even through the smoke and chaos, every man in the line knows who it is. Bonaparte.
>
> He's been there since dawn, watching, calculating, moving his pieces across this frozen chessboard. Now he moves the last one.
>
> An aide-de-camp gallops down from the ridge, horse white with lather. The orders carry down the line like fire along a powder trail:
>
> "Every man, every gun to the ridge! The counterattack goes in NOW!"
>
> Captain Leclerc turns to the 14th. His voice is raw, half-gone, but it carries:
>
> "FOURTEENTH! To the ridge! We finish this!"
>
> Around you, the survivors of two phases of hell straighten their backs. The drums change their beat — not the steady rhythm of the line, but the pas de charge. The advance.
>
> Bonaparte is ordering the counterattack. The gorge must be sealed. And the 14th is going.

#### Choice: To the ridge
*"Follow the captain. Follow Bonaparte. Follow the drums. One more time."*

> You shoulder your musket. Your legs move. Around you, the remnants of the 14th demi-brigade move with you — battered, bloodied, exhausted, and advancing.
>
> The drums beat the charge. Not retreating. Not holding. Advancing.
>
> Bonaparte watches from the ridge as his army — what is left of it — surges forward. The gorge awaits.

- Morale +5

#### Gorge Arrival Narrative:

> The ridge. You reach it gasping, legs burning, and look down.
>
> The gorge of the Adige opens below — a narrow defile carved through the mountains, its walls steep and unforgiving. And packed into that gorge, shoulder to shoulder, white coats crushed together like cattle in a pen: the Austrian retreat.
>
> Thousands of them. Columns that cannot deploy, cannot form line, cannot fight. They can only push forward into the trap or try to climb walls that offer no purchase. Their officers scream orders that no one can follow.
>
> Captain Leclerc reaches the ridge beside you. He looks down. His face is unreadable.
>
> "FOURTEENTH! Fire at will!"
>
> The order is not a volley command. It is permission to kill.

*Transitions to Part 3.*

---

## 11. Part 3: The Gorge (Volleys 8-11)

*Auto-play pauses each volley for target selection. No ENDURE step — one-sided fire.*

### Target Options

| Target | Description | Accuracy | On Hit | On Miss |
|--------|-------------|----------|--------|---------|
| **Target the Column** | "Fire into the packed ranks below. Easy target. Devastating." | 0.60 + musketry/500 + awareness/500 | "Hit. Column." Morale +2, enemy -5 | "Fired into column." Morale +1 |
| **Target an Officer** | "Pick out the man with the gorget and sash. Harder shot — bigger effect." | 0.30 + musketry/300 + awareness/400 | "Hit. Officer down." Morale +5, enemy -3 | "Missed officer." Morale -1 |
| **Target the Ammo Wagon** | "The powder wagon, tilted on the gorge road. One good hit..." | 0.15 + musketry/250 + awareness/350 | "Hit wagon. [Wagon damage: X%]" Morale +3. At 100%: "WAGON DETONATION. The gorge erupts." Morale +15, enemy -30 | "Missed wagon." |
| **Show Mercy** | "Lower your musket. These men are already beaten. The line fires without you." | — | — | — |

### Target Action Narratives

**Column:**
> You aim into the packed ranks. At this range, into that mass, you can hardly miss. You pick a point in the white-coated column and hold steady.

**Officers:**
> You scan the gorge for the gorget, the sash, the man waving a sword. There — an officer trying to rally his men. You settle the front sight on him and hold your breath.

**Wagon:**
> The ammunition wagon. Tilted on the gorge road, horses dead in the traces. You can see the powder kegs through the shattered sideboards. One good hit and...

**Show Mercy:**
> You lower your musket. The men around you fire — the line pours its volley into the gorge — but your finger stays off the trigger.
>
> These men are beaten. They are dying in a trap. You will not add to it.
>
> No one notices. Or if they notice, no one says anything. Not here. Not now.

- Morale +3 (compassion), Morale -2 (disobedience)

### Per-Volley Events

#### Volley 8

| Step | Narrative | Events |
|------|-----------|--------|
| PRESENT | "Fire at will. Gorge below." | — |
| FIRE | "Fire at will!" | — |
| ENDURE | "Scattered return fire from below." | "Men surrendering below. Column still advancing." If Pierre alive: "Pierre: 'Butcher's work.' Reloads anyway." Morale -1. |

#### Volley 9

| Step | Narrative | Events |
|------|-----------|--------|
| PRESENT | "Reload. More targets below." | — |
| FIRE | "Again!" | — |
| ENDURE | "Screams from below." | "Screams from below." Morale -3. If awareness > 40: "A boy among the dying." Morale -2. |

#### Volley 10

| Step | Narrative | Events |
|------|-----------|--------|
| PRESENT | "Column breaking. Wagon visible." | — |
| FIRE | "Fire!" | — |
| ENDURE | "Wounded call for help." | "Cries for help. Some men stop firing." Morale -4. If player showed mercy: "You showed mercy." Morale +3. |

#### Volley 11

| Step | Narrative | Events |
|------|-----------|--------|
| PRESENT | "Last column. Wagon exposed." | — |
| FIRE | "Final volley!" | — |
| ENDURE | "Silence. It's over." | If wagon not detonated: Scripted artillery detonation. "Artillery hits wagon. DETONATION." Wagon = 100, enemy -30, morale +10. If already detonated: "The gorge is silent. White flags." Morale +3. |

---

## 12. The Aftermath (after Part 3)

*"Fate Beckons..." splash, then cinematic overlay.*

**Title:** THE AFTERMATH

*Conditional status lines woven into the narrative:*

**Pierre status:**
- If alive + wounded: "Pierre sits on a rock, binding his shoulder one-handed. Blood has soaked through three layers of bandage. He catches your eye and nods once. Still here."
- If alive + not wounded: "Pierre sets down his musket and sits on a rock. He does not look down into the gorge. His hands are steady. His eyes are not."
- If dead: "Pierre's place in the line is empty. You don't look at the spot where he fell. You can't."

**Jean-Baptiste (always):**
> Jean-Baptiste stands at the ridge's edge, musket grounded, staring at the gorge. He is pale but upright. Whatever you said to him during the second volley held. He made it through.

**Battery status:** "Retook the battery by bayonet." / "Held the line while others charged the battery."

**Wagon status:** "is a smoking crater, timbers scattered across the gorge floor" / "sits untouched amid the wreckage, its powder kegs intact"

**Full narrative:**
> The gorge is silent.
>
> Below, white flags hang from musket barrels. The ammunition wagon [wagon status]. The Austrian column has ceased to exist.
>
> But the battle is not over — not everywhere. From the ridge, you hear it: the thunder of hooves on the frozen plateau. Leclerc's chasseurs à cheval — just a few hundred horsemen — sweep into the Austrian centre like a scythe through wheat. The exhausted white-coated columns, spread out and disordered after hours of fighting, break at the first sight of cavalry.
>
> The rout spreads faster than the horsemen can ride. Alvinczi himself — the Austrian commander who thought himself on the cusp of victory an hour ago — joins the undignified race to the rear.
>
> Word passes down the ridge like a spark along a fuse: Lusignan's column — the force at Affi that had the whole army convinced they were surrounded — has been cut off by General Rey. They are surrendering in their thousands.
>
> The Battle of Rivoli is won.
>
> The 14th demi-brigade held the plateau through dawn. [Battery status.] Endured Vukassovich's fresh columns when the right flank broke. And sealed the gorge.
>
> [Pierre status]
>
> [Jean-Baptiste status]
>
> Captain Leclerc sheathes his sword. His hand is steady now. "The 14th will reform. Take what rest you can. We march at dusk."

#### Choice 1: Help the wounded
*"Descend into the gorge. Tend to Austrian wounded. Show mercy where none was asked for."*

> You descend into the gorge.
>
> The smell hits first — powder, blood, the animal stench of fear. Austrian wounded lie among the dead, calling in languages you don't understand. But "water" sounds the same in any tongue.
>
> You kneel beside a man in a white coat. He flinches — then sees your canteen. His eyes fill with something you will never forget.

*If player showed mercy during gorge:*
> You showed mercy on the ridge. Now you show it here. It does not undo what happened. Nothing will. But it is something.

*Pierre line:*
- If alive: "Pierre watches you from the ridge. Says nothing. But when you climb back up, he nods. Once. That is enough."
- If dead: "When you climb back up, the ridge feels emptier than before. Pierre would have understood."

- Stamina -30, Morale +8, Soldier Rep +5

#### Choice 2: Find your comrades
*"Search for Pierre, Jean-Baptiste, the men you stood beside. See who survived."*

> You go looking for the living.

*Pierre scene:*
- If alive + wounded: "You find Pierre first. He's binding his own shoulder, one-handed, teeth gripping the bandage end. You kneel and help. He doesn't thank you. He doesn't need to. 'You did well today,' he says quietly. From Pierre, that's a medal."
- If alive + not wounded: "Pierre nods when he sees you. 'Still standing,' he says. 'Both of us.' He offers his canteen. You drink. The simple kindness of it nearly undoes you."
- If dead: "You go to where Pierre fell. Someone has covered his face with his coat. You stand there for a long time. There is nothing to say. There is nothing to do. But you stand there anyway."

*Jean-Baptiste (always):*
> Jean-Baptiste looks up when you approach. He's afraid — of course he's afraid — but he meets your eyes. "I didn't break," he says. You grip his shoulder. "No. You didn't."

> The 14th is smaller now. The faces that are missing will never come back. But the faces that remain — they look at you, and you look at them, and something passes between you that has no name.
>
> You survived Rivoli together. That is a bond that will never break.

- Stamina +30, Morale +5
- If Pierre alive: Pierre relationship +10
- If JB alive: JB relationship +10

#### Choice 3: Sit down
*"Your legs stop working. The musket slides from your fingers. You sit on the ridge and stare."*

> You sit down.
>
> Not a decision. Your legs simply stop working. The musket slides from your fingers and clatters on the frozen ground. You sit on the ridge, knees drawn up, and stare at the gorge below.
>
> The sounds of victory wash over you — distant cheers, the cavalry horns, voices calling in triumph. None of it reaches you. Not really. You are somewhere else. Somewhere between the first volley at dawn and the last volley into the gorge.

*Pierre line:*
- If alive: "Pierre sits beside you. Says nothing. His shoulder touches yours. That is all. That is everything. After a while — minutes, hours, you cannot say — his voice: 'Time to go, lad.' You pick up your musket. You stand. You walk."
- If dead: "No one sits beside you. Pierre would have. That thought is the one that nearly breaks you. After a while — minutes, hours, you cannot say — you pick up your musket. You stand. You walk. Because there is nothing else to do."

- Health +10, Stamina +45, Morale +3

#### Closing Narrative (all choices):

> The drums beat assembly. The 14th reforms — what is left of it. Men fall in by habit, finding their places in a line that has too many gaps. The officers count heads. The sergeants mark the dead.
>
> The Battle of Rivoli is over. The cost is written in the faces of the men who paid it. But the 14th held. Through dawn, through the battery, through the gorge. They held.
>
> Whatever comes next, you will carry this day with you forever.

*Battle outcome: `gorge_victory`. Transitions to post-battle camp.*

---

## 13. Post-Battle Camp

*6 actions. Same activity categories as pre-battle. Post-battle random events are not yet implemented.*
