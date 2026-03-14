# Rivoli Part 2 Volleys (5-7)

**Phase:** PHASE 3: HOLD THE LINE
**Battle Part:** 2

Fresh Austrian column. Enemy resets to full strength at 100 paces.

---

## Volley 5 — 100 paces

**Fire Order (from text.ts):** "FIRE!" Again. The new column at a hundred paces.

### Drill Steps

**Present:**
> Present. 100 paces. Fresh column.

**Fire Order:**
> "Feu!"

**Fire Hit:**
> Hit. Target down.

**Fire Miss:**
> Miss.

**Endure:**
> Return fire. Fresh muskets.

### Events

**On Present step:**
> Vukassovich guns open.

- Morale -5: "Vukassovich's artillery resumes" (event)

> Masséna still fighting.

- Morale +3: "Masséna's presence steadies the line" (recovery)

**On Endure step:**
> Reuss attacks the Pontare.

- Morale -4: "Reuss attacking the Pontare" (event)
- Morale -2: "Under fire — tired arms, fresh enemy" (passive)
- Morale +2: "The drums steady the line" (recovery)

> Pierre reloads beside you. *(if Pierre alive)*

- If Pierre alive: Morale +2: "[Pierre] holds the line" (contagion)

---

## Volley 6 — 60 paces

**Fire Order (from text.ts):** "FIRE!" Sixty paces. The right flank exposed.

### Drill Steps

**Present:**
> Present. 60 paces. Right flank open.

**Fire Order:**
> "FIRE!"

**Fire Hit:**
> Hit. Target down.

**Fire Miss:**
> Miss.

**Endure:**
> Return fire. Surrounded.

### Events

**On Present step:**
> Pontare fallen. Right flank exposed.

- Morale -6: "The Pontare has fallen — right flank exposed" (event)
- Line integrity -5

> Leclerc: "Hold the line!" *(if officer alive)*

- Morale +3: "Captain rallies the line" (recovery) *(if officer alive)*

**On Endure step:**
> Lusignan at Affi. Surrounded.

- Morale -8: "Surrounded — Lusignan at Affi" (event)

> Pierre: "We've been in worse." *(if Pierre alive)*

- If Pierre alive: Morale +3: "Pierre: 'We've been in worse'" (contagion)
- Morale -3: "Under fire at close range — exhausted" (passive)

---

## Volley 7 — 40 paces

**Fire Order (from text.ts):** "FIRE!" Forty paces. The last volley.

### Drill Steps

**Present:**
> Present. 40 paces. Last volley.

**Fire Order:**
> "TIREZ!"

**Fire Hit:**
> Hit. Target down.

**Fire Miss:**
> Miss.

**Endure:**
> Bonaparte on the ridge. Counterattack ordered.

### Events

**On Present step:**
> Men breaking in the rear.

- Morale -5: "Men breaking in the rear" (event)
- Line integrity -8

**On Endure step:**
> Bonaparte on the ridge. Counterattack ordered.

- Morale +10: "Napoleon orders the counterattack" (recovery)

> Leclerc: "To the ridge!" *(if officer alive)*

- Morale +5: "Captain: 'To the ridge!'" (recovery) *(if officer alive)*
- Morale -4: "Under fire at close range" (passive)
