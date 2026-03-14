# Rivoli Part 3 Volleys (8-11) — The Gorge

**Phase:** PHASE 4: THE GORGE
**Battle Part:** 3

Firing down into the gorge at 200 paces. Minimal return fire. Player selects targets during Present step (see "19 - Rivoli Gorge.md" for target descriptions).

---

## Volley 8 — 200 paces

**Fire Order (from text.ts):** "Fire at will!"

### Drill Steps

**Present:**
> Fire at will. Gorge below.

**Fire Order:**
> "Fire at will!"

**Fire Hit:**
> Hit. Gorge.

**Fire Miss:**
> Miss.

**Endure:**
> Scattered return fire from below.

### Events

**On Endure step:**
> Men surrendering below. Column still advancing.

> Pierre: "Butcher's work." Reloads anyway. *(if Pierre alive)*

- Morale -1: "Minimal return fire — but the horror begins" (passive)

---

## Volley 9 — 200 paces

**Fire Order (from text.ts):** "Again!"

### Drill Steps

**Present:**
> Reload. More targets below.

**Fire Order:**
> "Again!"

**Fire Hit:**
> Hit. Gorge.

**Fire Miss:**
> Miss.

**Endure:**
> Screams from below.

### Events

**On Endure step:**
> Screams from below.

- Morale -3: "The sound of trapped men dying" (event)

> A boy among the dying. *(if player Awareness > 40)*

- Morale -2: "A boy among the dying" (event) *(if player Awareness > 40)*

---

## Volley 10 — 200 paces

**Fire Order (from text.ts):** "Fire!"

### Drill Steps

**Present:**
> Column breaking. Wagon visible.

**Fire Order:**
> "Fire!"

**Fire Hit:**
> Hit. Gorge.

**Fire Miss:**
> Miss.

**Endure:**
> Wounded call for help.

### Events

**On Endure step:**
> Cries for help. Some men stop firing.

- Morale -4: "This is no longer battle — it's slaughter" (event)

> You showed mercy. *(if gorgeMercyCount > 0)*

- Morale +3: "At least you showed mercy" (recovery) *(if gorgeMercyCount > 0)*

---

## Volley 11 — 200 paces (Final Volley)

**Fire Order (from text.ts):** "Final volley!"

### Drill Steps

**Present:**
> Last column. Wagon exposed.

**Fire Order:**
> "Final volley!"

**Fire Hit:**
> Hit. Gorge.

**Fire Miss:**
> Miss.

**Endure:**
> Silence. It's over.

### Events

**On Endure step:**

**If wagon has NOT detonated yet (wagonDamage < cap):**
> Artillery hits wagon. DETONATION.

- Wagon damage set to cap
- Massive enemy strength reduction
- Morale +10: "The ammunition wagon detonates — artillery hit" (event)

**If wagon has already detonated:**
> The gorge is silent. White flags.

- Morale +3: "The gorge falls silent" (recovery)

*(After Volley 11, transitions to Story Beat 4: The Aftermath)*
