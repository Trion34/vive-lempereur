# Rivoli Battery

**Story Beat 1 — THE BATTERY**
Triggers after terrain melee (chargeEncounter = 1)

---

## Narrative

> The 14th fights on. Ground is taken, lost, taken again across the broken terrain of the plateau. Vineyards become killing grounds. Walled gardens become fortresses held for minutes, then lost.
>
> Through the chaos, you hear it — the Austrians have overrun one of your batteries. French guns turning against French troops.
>
> Over the cacophony, Captain Leclerc's voice rings out — hoarse, furious, alive with defiance:
>
> "FOURTEENTH! Will you let them take your guns?!"
>
> You catch Pierre's eye across the press of bodies. Blood on his sleeve, bayonet steady. A glimmer of something — not madness or despair. Valor. The real thing.

---

## Choices

### Choice A: "Charge the battery"

*Heed the captain's call. Charge into the teeth of your own guns to take them back.*

> You don't think. Your legs move. Pierre is beside you — blood on his sleeve, bayonet level — and you are running, both of you, across the open ground toward the battery.
>
> Muskets fire from the battery as the Austrians mount a defense of the captured battery. Chaos erupts as you rush implacably forward. You lose track of Pierre and JB in the cacophony but soon you're in the fray. You must fight for your life.

- Morale +5: "The rush of the charge"
- Sets `batteryCharged = true`
- Transitions to Battery Melee

**Arena introduction:**

> --- THE BATTERY ---
>
> The redoubt is chaos. Overturned caissons, scattered rammers, the acrid reek of powder. The guns loom like iron beasts. French guns. Your guns. Time to take them back.

---

### Choice B: "Hold back"

*Let braver souls lead. You've done enough.*

> You hesitate. Your legs don't move. Pierre glances back at you — just a glance, no judgment in it — and then he's gone, charging with the others toward the battery.
>
> You watch them go. Captain Leclerc. Pierre. Men whose names you know. Men whose names you don't. They run across the blood soaked ground. Some fall, some disappear through billows of acrid smoke.
>
> The battery is retaken. You see it happen from fifty paces back. The tricolour goes up over the guns. You tell yourself you made the right choice.

- Morale -3: "Shame — you held back"
- soldierRep -5
- Sets `batteryCharged = false`
- Transitions directly to Story Beat 2: Masséna (skips Battery Melee)
