# Camp Activities

All shared camp activity text from `src/core/campActivities.ts`, `src/core/passeDix.ts`, and `src/types/camp.ts`. Forage and socialize narratives are battle-specific and referenced accordingly.

---

## REST

**Category description:** *Rest your body and mind.*
**Stamina cost:** 0

---

### Lay About

> You wrap yourself in your greatcoat and lean against a tree. The fire crackles. For a moment, the war is far away.

**Effects:** Stamina +20 (weather bonus: +5 clear, -5 rain) + floor(Endurance/20) | Morale +3 | Health +5

---

### Bathe

> The river is black and fast and freezing. You plunge in before you can think better of it. The shock drives everything else out of your head — the war, the cold, the fear. You emerge gasping, raw, alive.

**Effects:** Stamina +30 | Morale +5 | Health +8

---

### Pray

> You close your eyes and speak to God. You ask for courage. You ask to not let down the men beside you. The silence that answers is not empty. It is patient.

**Result text:** *(see Stat Result Flavor Text below — Valor success)*

**Effects:** Valor +1 | Stamina +10 | Morale +7 | Health +3

---

## EXERCISE

**Category description:** *Physical training.*
**Stamina cost:** 10

Each exercise trains two physical stats independently. Each stat is rolled against target = (100 - statValue). Any pass = success narrative; both fail = fail narrative.

---

### Haul
**Stats trained:** Strength + Endurance

**Success narrative:**
> You shoulder a water barrel from the stream and carry it uphill to camp. And again. Your arms shake. You're getting stronger.

**Fail narrative:**
> You shoulder a water barrel from the stream and carry it uphill to camp. And again. Your arms shake. You're not getting any stronger.

**Effects:** Stamina -10 | Morale +2 (both pass), 0 (one pass), -1 (both fail) | Each stat: +1 on pass

---

### Wrestle
**Stats trained:** Strength + Constitution

**Success narrative:**
> You grapple with a comrade behind the supply wagons. Your body learns to absorb punishment and dish it out. You're getting stronger.

**Fail narrative:**
> You grapple with a comrade behind the supply wagons. Your body fails you. You're not getting any stronger.

**Effects:** Stamina -10 | Morale +2 (both pass), 0 (one pass), -1 (both fail) | Each stat: +1 on pass

---

### Run
**Stats trained:** Endurance + Constitution

**Success narrative:**
> You run the camp perimeter, boots pounding frozen ground. You find a rhythm, a second wind. You're getting better.

**Fail narrative:**
> You run the camp perimeter, boots pounding frozen ground. You tire quickly. You're not getting any better.

**Effects:** Stamina -10 | Morale +2 (both pass), 0 (one pass), -1 (both fail) | Each stat: +1 on pass

---

## ARMS TRAINING

**Category description:** *Hone your combat skills.*
**Stamina cost:** 10

Training uses diminishing returns: target = min(maxChance, max(0, (cap - statValue) * 2)). If stat >= cap, the capped narrative plays and no gain is possible.

### Tier Configs

| Tier | Cap | Rep Required | Rep Field | Max Chance |
|------|-----|-------------|-----------|------------|
| Solo | 50 | 0 | soldierRep | 80 |
| Comrades | 70 | 20 | soldierRep | 85 |
| Officers | 85 | 50 | officerRep | 90 |

---

### Solo Tier

#### Dry Fire Drill
**Stat:** Musketry (cap 50)
**UI description:** *Practice the loading sequence alone.*

**Success narrative:**
> You find a quiet spot and run the drill alone. Bite cartridge. Pour. Ram. Prime. Present. Again. Again. You're getting better.

**Fail narrative:**
> You find a quiet spot and run the drill alone. Bite cartridge. Pour. Ram. Prime. Present. Again. Again. You're not getting any better.

**Capped narrative:**
> You find a quiet spot and run the drill alone. Bite cartridge. Pour. Ram. Prime. Present. Again. Again. You've learned all you can on your own.

**Capped result text:** *Musketry capped. Nothing more to learn here.*

**Effects:** Stamina -10 | Morale +1 (success), -1 (fail), 0 (capped) | Musketry +1 on success

---

#### Shadow Drill
**Stat:** Elan (cap 50)
**UI description:** *Bayonet forms against an imaginary foe.*

**Success narrative:**
> You practice bayonet forms alone — thrust, parry, strike. The bayonet feels lighter, faster, more like an extension of your arm. Your skills sharpen.

**Fail narrative:**
> You practice bayonet forms alone — thrust, parry, strike. Your movements are heavy, slow. You're not getting any better.

**Capped narrative:**
> You practice bayonet forms alone — thrust, parry, strike. You've learned all you can on your own.

**Capped result text:** *Elan capped. Nothing more to learn here.*

**Effects:** Stamina -10 | Morale +1 (success), -1 (fail), 0 (capped) | Elan +1 on success

---

### Comrades Tier (requires Soldier Rep >= 20)

#### Squad Volleys
**Stat:** Musketry (cap 70)
**UI description:** *Volley drill with the section.*

**Success narrative:**
> The section lines up and runs volley drill together. The shared discipline sharpens everyone. You're getting better.

**Fail narrative:**
> The section lines up and runs volley drill together. Your contributions are sub par. You're not getting better.

**Capped narrative:**
> The section lines up and runs volley drill together. The squad drill is crisp and professional. Your skills demand elite training.

**Capped result text:** *Musketry capped. Nothing more to learn here.*

**Effects:** Stamina -10 | Morale +1 (success), -1 (fail), 0 (capped) | Musketry +1 on success

---

#### Sparring
**Stat:** Elan (cap 70)
**UI description:** *Wooden bayonets, dueling.*

**Success narrative:**
> You spar with one of your fellow soldiers. Your weapon feels lighter. You're getting better.

**Fail narrative:**
> You spar with one of your fellow soldiers. The bruises will heal. You're not getting any better.

**Capped narrative:**
> You spar with one of your fellow soldiers. Your movements are deft and surefooted. Your skills demand elite training.

**Capped result text:** *Elan capped. Nothing more to learn here.*

**Effects:** Stamina -10 | Morale +1 (success), -1 (fail), 0 (capped) | Elan +1 on success

---

### Officers Tier (requires Officer Rep >= 50)

#### Marksman Instruction
**Stat:** Musketry (cap 85)
**UI description:** *Elite musketry training.*

**Success narrative:**
> The Lieutenant corrects your form. "You waste movement here. And here." He adjusts your grip, your elbow, the angle of the ramrod. Small things. You're getting better.

**Fail narrative:**
> The Lieutenant corrects your form. "Better. Again." But today your hands refuse to unlearn what they know. You're not getting any better.

**Capped narrative:**
> The Lieutenant watches you load and fire. He says nothing for a long time. "I have nothing more to teach you," he says finally. You are truly a master musketeer.

**Capped result text:** *Musketry capped. Nothing more to learn here.*

**Effects:** Stamina -10 | Morale +1 (success), -1 (fail), 0 (capped) | Musketry +1 on success

---

#### Salle d'Armes
**Stat:** Elan (cap 85)
**UI description:** *Formal fencing instruction.*

**Success narrative:**
> The Captain agrees to train you. What follows is humbling and instructive in equal measure. You're getting better.

**Fail narrative:**
> The Captain puts you through the formal positions — tierce, quarte, sixte. Your feet tangle. "Again. Slower." "Again!" The lesson is long and the progress invisible. You're not getting any better.

**Capped narrative:**
> The Captain salutes you. "You have the makings of a master swordsman," he says. The rest you must learn in battle.

**Capped result text:** *Elan capped. Nothing more to learn here.*

**Effects:** Stamina -10 | Morale +1 (success), -1 (fail), 0 (capped) | Elan +1 on success

---

## DUTIES

**Category description:** *Drill, scout, or volunteer.*
**Stamina cost:** 10

---

### Forage

**Check:** Awareness (Standard difficulty)

**Success result text:**
> You brought something back. The lads remember who fed them.

**Fail result text:**
> Nothing to show for it. At least you went.

**Effects (success):** Soldier Rep +3 | Stamina -10 | Health +5 | Morale +2
**Effects (fail):** Soldier Rep +1 | Stamina -10 | Health +0 | Morale -1

#### Rivoli Forage Text
*Source: `src/data/battles/rivoli/camp.ts`*

**Success variants:**
> You find a root cellar half-buried in snow behind an abandoned farmhouse. Frozen turnips, a sack of chestnuts, a clay jug of vinegar. Not much — but the men cheer when you come back.

> A skinny chicken, hiding in the ruins of a barn. You wring its neck before it can squawk. Tonight, the section eats.

> Firewood. Real firewood — dry oak, stacked under a collapsed shed roof. You drag back as much as you can carry. The fire burns properly for the first time in days.

**Fail variants:**
> Nothing. Frozen fields picked clean by every army that has passed this way. You come back empty-handed, boots soaked through, fingers blue.

> You range further than you should, alone on the mountainside. The wind cuts through your coat. There is nothing here. There was never anything here.

> An abandoned village, already stripped. Every cupboard bare, every root cellar emptied. You kick through the snow for an hour and find nothing but frozen mud.

#### Voltri Forage Text
*Source: `src/data/battles/voltri/camp.ts`*

**Success variants:**
> You find a fisherman's cache behind a collapsed wall near the harbour. Dried sardines, a sack of olives, a clay jug of rough wine. The men cheer when you come back.

> A garden behind an abandoned villa, half-wild but still bearing. You fill your haversack with onions and herbs. Tonight the soup has flavour.

> Driftwood on the beach — dry, salt-crusted, burns hot. You haul back enough to keep the fire going all night. The section sleeps warm for once.

**Fail variants:**
> Nothing. The town has been picked clean by every regiment that has garrisoned here. You come back empty-handed, boots wet from the surf.

> You range along the coast road, hoping for a farm or a garden. Nothing but scrub and stone. The Ligurian coast is beautiful and barren.

> A promising path up the hillside leads to a stripped orchard. Every tree bare, every root dug up. Someone was here before you.

---

### Check Equipment

**Check:** Musketry (Standard difficulty)

**Success narrative:**
> Strip. Clean. Oil. Sharpen. The Charleville gleams. So do you.

**Success result text:**
> Equipment ready. Morale +2

**Fail narrative:**
> The lock spring is weak. The uniform is beyond patching. Adequate. Not good.

**Fail result text:**
> Adequate. Nothing more.

**Effects:** Stamina -10 | Morale +2 (success), 0 (fail)

---

### Volunteer for Duty

One of 4 random tasks is assigned. Each has a stat check and success/fail outcomes.

#### Sentry Duty
**Check:** Awareness (Standard difficulty)

**Activity text:**
> You draw sentry duty on the perimeter.

**Success result:**
> SENTRY DUTY — The cold is brutal, but you keep your eyes open. Every shadow could be Austrian scouts. Hours pass. Your vigilance is noted by the returning patrol corporal. You made a good impression.
>
> Awareness check: PASSED
> Officer Rep +3

**Fail result:**
> SENTRY DUTY — The cold seeps through your coat. Your eyes grow heavy. You jerk awake at a sound — nothing. Or was it? The corporal finds you shivering, half conscious. He says nothing. His look says enough. You made a bad impression.
>
> Awareness check: FAILED
> Officer Rep -2 | Morale -2

**Effects (success):** Officer Rep +3 | Stamina -12 | Morale 0
**Effects (fail):** Officer Rep -2 | Stamina -12 | Morale -2

---

#### Scout the Ground
**Check:** Awareness (Standard difficulty)

**Activity text:**
> A corporal picks you for a patrol of the plateau.

**Success result:**
> SCOUT THE GROUND — Stone walls. Ravines. Frozen vineyards. You map it in your mind — reporting your findings to the corporal with meticulous detail. He nods at your observations. You made a good impression.
>
> Awareness check: PASSED
> Officer Rep +2 | Morale +1

**Fail result:**
> SCOUT THE GROUND — The darkness and cold defeat you. Every ravine looks the same. You stumble back to camp with nothing useful to report. The corporal's disdain is evident. You made a bad impression.
>
> Awareness check: FAILED
> Officer Rep -1 | Morale -1

**Effects (success):** Officer Rep +2 | Stamina -10 | Morale +1
**Effects (fail):** Officer Rep -1 | Stamina -10 | Morale -1

---

#### Carry Dispatches
**Check:** Endurance (Standard difficulty)

**Activity text:**
> You're sent running dispatches between officer positions.

**Success result:**
> CARRY DISPATCHES — Across the frozen plateau in the dark, following paths you can barely see. But you find each position, deliver each message, and return. The lieutenant acknowledges you with a cool nod. You made a good impression.
>
> Endurance check: PASSED
> Officer Rep +2

**Fail result:**
> CARRY DISPATCHES — The plateau is dark and confusing. You take a wrong turn, double back, arrive late. The officer snatches the dispatch without a word. You made a bad impression.
>
> Endurance check: FAILED
> Officer Rep -1 | Morale -1

**Effects (success):** Officer Rep +2 | Stamina -15 | Morale 0
**Effects (fail):** Officer Rep -1 | Stamina -15 | Morale -1

---

#### Dig Positions
**Check:** Strength (Standard difficulty)

**Activity text:**
> You're put on entrenchment detail.

**Success result:**
> DIG POSITIONS — Piling stones, digging shallow trenches in the frozen earth. Your hands crack and bleed. Your hard work makes a real difference. You made a good impression.
>
> Strength check: PASSED
> Officer Rep +1 | Soldier Rep +1

**Fail result:**
> DIG POSITIONS — The ground is frozen iron. Your tools bounce off it. Hours of labor for inches of trench. The sergeant looks at the result and says, "That wouldn't stop a goat." You made a bad impression.
>
> Strength check: FAILED
> Soldier Rep -1 | Morale -1

**Effects (success):** Officer Rep +1 | Soldier Rep +1 | Stamina -18 | Morale 0
**Effects (fail):** Soldier Rep -1 | Stamina -18 | Morale -1

---

## SOCIALIZE

**Category description:** *Sit with a comrade by the fire.*
**Stamina cost:** 5

---

### NPC Conversation (Shared Logic)

**Check:** Charisma (Standard difficulty)

**Success narrative (fallback):**
> You share a quiet evening with {NPC name}. The bond between soldiers grows.

*(Per-NPC socialize narratives are battle-specific — see below.)*

**Fail narrative:**
> You try to strike up conversation with {NPC name}, but the words come out wrong. An awkward silence. You excuse yourself.

**Dead NPC narrative:**
> {NPC name} is gone. You sit by the fire and stare at the empty place where he used to sit.

**No target narrative:**
> You sit by the fire alone. No one to talk to tonight.

**Effects (success):** Stamina -5 | Morale +3 | Relationship +8
**Effects (fail):** Stamina -5 | Morale 0 | Relationship -2
**Effects (dead/missing):** Stamina -5 | Morale -1

#### Rivoli Socialize Narratives
*Source: `src/data/battles/rivoli/camp.ts`*

**Pierre:**
> Pierre is quiet as always, but tonight he shares his tobacco. "You did well today," he says. From him, that's a speech.

**Jean-Baptiste:**
> Jean-Baptiste talks rapidly about home — the bakery, the river, his sister's cat. You listen. Sometimes listening is enough.

**Duval:**
> Sergeant Duval grumbles about the rations, the officers, the war. But there's a grudging warmth underneath. "At least you're not useless," he says.

**Leclerc:**
> Captain Leclerc speaks of glory and promotion. His eyes shine in the firelight. "We'll make captain yet," he says. He means himself, but includes you in the dream.

#### Voltri Socialize Narratives
*Source: `src/data/battles/voltri/camp.ts`*

**Morin:**
> Sergeant Morin shares his pipe and stares at the sea. "I was at Valmy," he says. "The Revolution's first battle. We stood in the rain and the Prussians turned back. I thought the war was over." He laughs, short and bitter.

**Vidal:**
> Lieutenant Vidal is studying a map by candlelight. He acknowledges you with a nod but doesn't look up. "The passes," he mutters. "If they come through the passes..." He trails off. You leave him to his thoughts.

---

### Write a Letter

**Check:** Intelligence (Standard difficulty)

**Success narrative:**
> You write home by candlelight. The words come easily tonight — not the horrors, but the small things. The sunrise over the Alps. The taste of real bread in Verona. The letter feels like a bridge to another world.

**Success result text:**
> A well-written letter. The men respect a man of letters.

**Fail narrative:**
> You try to write, but the words won't come. What do you say? How do you explain any of this? The page stays mostly blank. You seal it anyway.

**Effects (success):** Soldier Rep +2 | Stamina -5 | Morale +5
**Effects (fail):** Stamina -5 | Morale +2

---

### Gamble (Passe-dix)

*Source: `src/core/passeDix.ts`*

Three dice are rolled (3d6). Total > 10 = "Passe"; total <= 10 = "Manque". Player bets passe or manque at a chosen stake level.

#### Stake Levels

| Stake | Label | Rep Win | Rep Lose | Morale Win | Morale Lose |
|-------|-------|---------|----------|------------|-------------|
| Low | Cautious | Soldier Rep +1 | 0 | +2 | -1 |
| Medium | Fair | Soldier Rep +3 | Soldier Rep -1 | +4 | -2 |
| High | Reckless | Soldier Rep +5 | Soldier Rep -3 | +6 | -4 |

All outcomes cost Stamina -5.

#### Win Narratives (random)

> The dice tumble across the drumhead. {dice} — {total}. "{Passe/Manque}!" The men groan and pay up. You pocket your winnings with a grin.

> Three dice clatter on the packed earth. {dice} — {total}. "{Passe/Manque}!" You called it. The pot is yours.

> The firelight catches the ivory as they roll. {dice} — {total}. "{Passe/Manque}!" A cheer goes up from your corner of the fire.

**Win result text:**
> Won the pot. The men remember a winner.

#### Lose Narratives (random)

> The dice tumble: {dice} — {total}. "{Passe/Manque}." Not your call. You push your coins across the drumhead.

> Three dice, three traitors. {dice} — {total}. "{Passe/Manque}." The pot goes the other way. A bad night.

> The dice land: {dice} — {total}. "{Passe/Manque}." You pay up. The fire seems colder now.

**Lose result text:**
> Lost the pot. A bitter evening.

#### Cheating Detection (on loss only)

**Check:** Awareness (Hard difficulty)

> The dice roll: {dice} — {total}. "{Passe/Manque}." You're about to pay when you notice the corporal's thumb. Weighted dice. "I see your game, Corporal." The table goes quiet. You take back your stake.

**Result text:**
> Cheating detected. You walk away with your dignity.

**Effects:** Soldier Rep +1 | Stamina -5 | Morale +1

---

## STAT RESULT FLAVOR TEXT

The `statResultText(stat, gained)` function generates result lines for stat training. Format: `{flavor} {Label} +1` (gained) or `{flavor} {Label} —` (not gained).

| Stat | Success Flavor | Fail Flavor |
|------|---------------|-------------|
| Strength | The weight feels lighter. | Your muscles won't cooperate. |
| Endurance | Second wind. | Your lungs give out. |
| Constitution | Your body hardens. | The body won't toughen. |
| Musketry | Your hands remember. | Your hands fumble. |
| Elan | The blade feels natural. | The motions stay stiff. |
| Awareness | You see what others miss. | Nothing stands out. |
| Valor | Your nerve steadies. | The fear remains. |

### Stat Labels

| Key | Display Label |
|-----|---------------|
| strength | Strength |
| endurance | Endurance |
| constitution | Constitution |
| musketry | Musketry |
| elan | Elan |
| awareness | Awareness |
| valor | Valor |
