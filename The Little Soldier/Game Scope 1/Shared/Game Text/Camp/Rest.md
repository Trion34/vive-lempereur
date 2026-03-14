# Rest Activities

> Source: `src/core/campActivities.ts`, `src/ui/campPhase.ts`

## Category Flavor
>A few hours off your feet could do you good.

---

## Lay About
**Button:** "Lay About"
**Description:** "Sleep, sit by the fire, do nothing."

### Variant 1
> You wrap yourself in your greatcoat and lean against a tree. The fire crackles. For a moment, the war is far away.



**Effect:** Stamina +20, Morale +3, Health +5 (weather bonus: clear +5, rain -5)

---

## Bathe
**Button:** "Bathe"
**Description:** "Wade into the Adige. Freezing, but you'll feel like a new man."
**Lock:** "Available in [N] action(s)"

### Variant 1
> The river is black and fast and freezing. You plunge in before you can think better of it. The shock drives everything else out of your head — the war, the cold, the fear. You emerge gasping, raw, alive.


**Effect:** Stamina +30, Morale +5, Health +8

---

## Pray
**Button:** "Pray"
**Description:** "Find a quiet place. Say the words you remember."
**Lock:** "Already prayed this camp"


### Variant 1
> You close your eyes and speak to God. You ask for courage. You ask to not let down the men beside you. The silence that answers is not empty. It is patient.

**Effect:** Stamina +10, Morale +7, Health +3, Valor +1

### Stat Result Text (Valor)
**Success:** "Your nerve steadies. Valor +1"
**Fail:** "The fear remains. Valor —"
