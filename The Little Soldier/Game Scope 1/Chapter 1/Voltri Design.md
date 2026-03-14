# Demo 2.0 — Voltri Design

> Initial design sketch for the v2.0 demo. Five phases, each building on the last. The demo IS Chapter 1 — no throwaway content.

---

## Phase 1: Garrison at Voltri (Camp Lite)

Not the full 16-action camp from Rivoli. More like 6-8 actions. You're a green soldier in a garrison nobody cares about. The mood is boredom, hunger, beauty, and unease.

- Roll call. Your sergent counts heads. Two men deserted last night.
- Activities: guard duty, foraging, fatigue details, campfire socializing. Simpler than Rivoli's umbrella system — fewer choices because you're a Private with no authority.
- 2-3 scripted events that establish your companions and the setting:

### Campfire Scene
Meet your file-mates. Establish the camaraderie. A veteran tells stories about Toulon. Someone complains about the bread. Someone debates the Revolution. This is where the player bonds with NPCs.

### The Coast at Night
The beauty of the Ligurian setting. The Mediterranean, the olive groves. The irony of starving in paradise. Maybe a quiet character moment — homesickness, a letter you can't write because you're illiterate.

### Smoke on the Heights
Austrian campfires spotted in the mountains. The sergent says it's probably nothing. The tension ratchets up.

### The Interruption
Ends abruptly: drums, shouting, a breathless runner. The Austrians are coming through the pass. Everyone to arms.

**Why this works**: It's short, it establishes the world and your companions, and the interruption creates urgency. The player doesn't get bored in camp because the attack cuts it short.

---

## Phase 2: Battle of Voltri (Tutorial Combat)

2-3 volleys of auto-play line combat. You're a Private — no agency, pure cinematic. But the UI is teaching you: here's PRESENT, here's FIRE, here's ENDURE, here's LOAD. You're learning the rhythm.

### Volley 1
First time under fire. The shock of it. Grenzer sharpshooters on the heights. A man in your file goes down. Valor check — did you hold steady or flinch?

### Volley 2
The Austrians press harder. Uhlans spotted on the road behind you. The sense of encirclement. Your formation takes real casualties. Personal damage rolls — you might get hit.

### Scripted Event: The Retreat Order
Cervoni orders withdrawal. No choice — you're pulling back. But HOW you pull back matters. Maybe a brief moment: do you help a wounded comrade (Strength check, costs stamina, builds reputation) or keep moving (saves stamina, nobody blames you)?

### Optional: Brief Melee
A very brief melee encounter — bayonets at a hilltop position, 2-3 rounds max. Just enough to introduce the melee system without a full arena fight. Or save melee for Montenotte and keep Voltri purely as a line combat tutorial.

### What Carries Forward
Your health, morale, and stamina at the end of the battle become your starting condition for the retreat. A player who flinched has lower morale. A player who got hit has lower health. A player who helped a comrade has lower stamina but higher reputation.

---

## Phase 3: The Retreat to Savona (Skill Check Gauntlet)

This is the **new mechanic** — nothing like this exists in the current game. A series of 5-6 encounters on the 40km coastal road, each testing different stats. The player's condition from the battle affects their chances.

The structure: each encounter is a short narrative beat + a stat check + consequences. Think Oregon Trail meets a roguelike event system. Quick, punchy, no long reading.

### Possible Encounters (pick 4-5 per run, some random)

**The March** (Endurance)
Can you keep up the pace? Fail = stamina drain, fall behind, risk getting cut off.

**Austrian Patrol** (Awareness)
Uhlans on the road ahead. Did you spot them in time? Pass = your group detours. Fail = ambush, take damage.

**The Wounded Man** (Strength + choice)
A comrade can't walk. Carry him (Str check, burns stamina, reputation gain) or leave him (morale cost, but you're fresher)?

**The Cliff Path** (Valor)
The coastal road is exposed. A shortcut through the hills is faster but steep and dark. Valor check to take the risk. High reward if you pass.

**Foraging** (Awareness)
You haven't eaten all day. Spot an abandoned farmhouse with food? Pass = health/stamina recovery. Fail = wasted time, nothing found.

**Night Terror** (Valor)
Sounds in the darkness. Hoofbeats? Wind? Your nerves are shot. Valor check to stay calm. Fail = morale hit, maybe you bolt and get separated.

**The Stragglers** (Charisma)
You find a group of lost soldiers from another company. Rally them to join you (Charisma check, reputation gain) or keep moving?

### Why This Works
Every stat matters. Character creation choices have immediate, tangible consequences. Each run is different because the encounters are partially randomized. And it's *fast* — each encounter is a paragraph of text and a single roll, not a long camp activity.

---

## Phase 4: Savona (Brief Camp / Pivot Point)

You arrive at Savona. The army is assembling. This is a short breather — maybe 3-4 actions:

### Rest and Recover
Heal based on your remaining condition. This is where Grace could be introduced if the player is near death.

### Napoleon's Proclamation
A cinematic story beat. You hear the speech — "Soldiers, you are naked, ill-fed!" — but experienced through your character's eyes. Not a history lesson, just a moment. The mood shifts. Something is different about this general.

### Assignment to Your Unit
You get folded into a proper demi-brigade (the 14th? or whichever unit the full game uses). You meet your new companions — the Pierre and JB equivalents for this chapter.

### The March Inland
Orders come. You're heading into the mountains. The campaign begins.

---

## Phase 5: Montenotte (The Real Battle — Demo Climax)

This is where the demo earns its ending. Voltri was the tutorial. The retreat tested your stats. Now you fight for real.

- Full line combat: 4+ volleys, the current auto-play system at full intensity
- Higher stakes: you can actually die here (Grace check if you have it)
- Story beats woven in: Rampon's "Here, we must conquer or die!" — but you experience it from the ranks, not as exposition
- A real melee: bayonet charge after the Austrian line breaks
- **The victory**: Napoleon's first win. The army's first win. YOUR first win. After the humiliation of Voltri, this is catharsis.

Demo ends with the aftermath: you're standing on the field, exhausted but alive. The mountains stretch ahead. The campaign has only just begun.

*"To be continued in Chapter 2..."*

---

## The Roguelike Loop

When you die (at Voltri, on the retreat, or at Montenotte), you start over with a new character. Glory earned carries forward. Each run through Voltri is slightly different because of random retreat encounters and stat-dependent outcomes. The game is designed to be replayed — a 20-30 minute demo loop that rewards experimentation with different stat builds.

---

## Key Design Principles

- **The history is the backdrop, not the content.** The player doesn't need to know Beaulieu's strategic reasoning — they just need to know that one morning, the Austrians came, and everything went to hell.
- **Scripted defeat, real consequences.** The player can't win Voltri — but HOW they lose affects everything that follows.
- **Every stat matters.** The retreat gauntlet gives every stat build a moment to shine.
- **Punchy, not lecturing.** Each encounter is a paragraph + a roll + consequences. No walls of text.
- **Demo = Chapter 1.** Nothing here is throwaway. It all leads into the full game.

---

## Systems Reuse from Demo 1.0

| System | Reuse? | Notes |
|--------|--------|-------|
| Profile / Glory / Grace | Yes | Unchanged |
| Character Creation (stats) | Yes | Same 9 stats, same allocation |
| Camp Phase | Partial | Simplified — fewer actions, different activities for garrison life |
| Line Combat (auto-play) | Yes | Same drill step system, fewer volleys at Voltri, full at Montenotte |
| Melee | Yes | Brief at Voltri (optional), full at Montenotte |
| Story Beats / Cinematics | Yes | Same overlay system, new narrative content |
| Retreat Gauntlet | **New** | Skill check encounter system — needs to be built |
| Music / SFX | Yes | New tracks for Voltri setting? |

---

## Open Questions

- [ ] Which demi-brigade is the player in? (51st and 75th were at Voltri historically. 14th was in Augereau's division — player could transfer after retreat?)
- [ ] How many companions, and who? (Need equivalents of Pierre/JB for the opening chapter)
- [ ] Does the brief melee at Voltri happen, or save melee intro for Montenotte?
- [ ] How does the retreat gauntlet UI work? (Cinematic overlay? New page type? Card-based encounters?)
- [ ] Does the demo end at Montenotte, or continue to Dego/Mondovi?
- [ ] Save continuity — does a completed demo save carry into the full game?
