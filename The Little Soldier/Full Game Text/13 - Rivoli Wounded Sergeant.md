# Rivoli Wounded Sergeant

**Story Beat 5 — THE WOUNDED SERGEANT**
Triggers between Volleys 2 and 3 (chargeEncounter = 5)

---

## Narrative

> At fifty paces, the Austrian volley tears through the line. Sergeant Duval — the granite-faced NCO who has held the section together since dawn — takes a ball in the thigh.
>
> He goes down hard. His spontoon clatters against the stones. For a moment, his face shows nothing — just surprise, as if he'd tripped on a vine root. Then the pain hits and he grabs his leg with both hands.
>
> "Sergeant's down!" The cry ripples through the section.
>
> Captain Leclerc is thirty paces to the left, dealing with a gap in the line where an entire file went down. He hasn't seen. The section — your section — is without its NCO.
>
> The line wavers. Men look to each other. Someone must act.

**All choices set:** `ncoPresent = false`, Stamina -15

---

## Choices

### Choice A: "Take the sergeant's place"

*Pick up his spontoon. Give orders. You are not an NCO — but someone must be. [Valor + Charisma check]*

**If passed:**

> You don't think. You move. Duval's spontoon is in your hand before you've made a decision — the weight of it strange, an NCO's weapon, not a private's.
>
> "SECTION! HOLD THE LINE!" Your voice cuts through the smoke. Where did that come from? [Valor: (roll) vs (target) — passed]
>
> Men turn. They see you — a private with a sergeant's spontoon, standing where Duval stood, giving orders you have no right to give.
>
> The line steadies. Pierre, blood on his sleeve, gives you a look that is half-surprise, half-respect.

- Morale +8: "You took command — the section holds"
- soldierRep +8, officerRep +15
- Valor +3
- Line integrity +5
- **Grace earned (+1 Grace)**

> Your courage has earned the favour of fate. [+1 Grace]

**If failed:**

> You grab Duval's spontoon and stand. "SECTION! HOLD—" [Valor: (roll) vs (target) — failed]
>
> Your voice cracks. The command comes out thin, uncertain — a private playing at sergeant. Men glance at you, then look away. At least you tried.

- Morale -3: "You tried — not enough authority"
- soldierRep +3, officerRep +5

---

### Choice B: "Rally the men around you"

*You can't replace Duval. But you can shout, hold your section, keep the men beside you steady. [Charisma check]*

**If passed:**

> You can't replace Duval. You're no NCO. But you can be loud.
>
> "HOLD TOGETHER! THE SERGEANT'S BEING TENDED! HOLD!" [Charisma: (roll) vs (target) — passed]
>
> The men on either side of you hear it. The panic that was building in the section eases. Just enough.
>
> The line steadies. Survivors will remember your courage, your voice.

- Morale +5: "You rallied your section"
- soldierRep +3

**If failed:**

> "HOLD! HOLD THE—" [Charisma: (roll) vs (target) — failed]
>
> Your shout is swallowed by the crash of the next volley. The men around you don't hear, or don't listen. You're just another private screaming in the smoke.
>
> The line holds anyway — barely.

- Morale -1: "Your voice was lost in the noise"

---

### Choice C: "Keep your head down"

*Not your job. Not your rank. Survive the next two volleys and let the officers sort it out.*

> Duval goes down. Men look around for leadership. You do the same. Not your job. Not your rank. A private does not give orders. A private survives.
>
> Pierre barks instructions through gritted teeth because someone has to. No one notices your silence. That is its own kind of verdict.

- Morale -2: "You kept quiet when the section needed a voice"
- soldierRep -3, officerRep -5
