# Rivoli Part 1 Volleys (1-4)

**Phase:** PHASE 1: THE LINE
**Battle Part:** 1

---

## Volley 1 — 120 paces

**Fire Order (from text.ts):** "Feu!" The captain's sword drops.

### Drill Steps

**Present:**
> Present arms. 120 paces.

**Fire Order:**
> "Feu!"

**Fire Hit:**
> Hit. Target down.

**Fire Miss:**
> Miss.

**Endure:**
> Return fire.

### Events

**On Fire step:**
> First volley hit.

- Morale +2: "First volley struck home" (recovery)

**On Endure step:**
> Fighting on the right.

- Morale -4: "Sounds of battle on the right" (event)
- Morale -2: "Under fire at medium range" (passive)
- Morale +2: "The drums steady the line" (recovery)
- If Pierre alive and Steady: Morale +2: "[Pierre] stands firm" (contagion)
- If Pierre alive and Wavering: Morale -3: "[Pierre] stands firm" (contagion)
- If Jean-Baptiste alive and Steady: Morale +2: "[Jean-Baptiste] stands firm" (contagion)
- If Jean-Baptiste alive and Wavering: Morale -3: "[Jean-Baptiste] stands firm" (contagion)

---

## Volley 2 — 80 paces

**Fire Order (from text.ts):** "FIRE!" The word tears down the line.

### Drill Steps

**Present:**
> Present. 80 paces.

**Fire Order:**
> "FIRE!"

**Fire Hit:**
> Hit. Target down.

**Fire Miss:**
> Miss.

**Endure:**
> Return fire.

### Events

**On Fire step:**
> Man killed nearby.

- Morale -3: "Man killed in your section" (event)
- Line integrity -3

**On Endure step:**
- Morale -3: "Enemy at close range" (passive)
- Morale +2: "The drums hold steady" (recovery)
- If Pierre alive: Morale +2: "[Pierre] stands firm" (contagion)

---

## Volley 3 — 50 paces

**Fire Order (from text.ts):** "FIRE!" At fifty paces, the captain's voice is raw.

### Drill Steps

**Present:**
> Present. 50 paces.

**Fire Order:**
> "FIRE!"

**Fire Hit:**
> Hit. Target down.

**Fire Miss:**
> Miss.

**Endure:**
> Return fire. Men fall.

### Events

**On Present step:**
> Pierre hit. Shoulder. Still fighting.

- Morale -6: "Pierre is hit — wounded but fighting" (event)
- Pierre marked as wounded, Pierre morale -15
- Casualties +1
- Officer dismounts (if alive and mounted): "On foot, rallying"

**On Endure step:**
> Artillery silent. Too close.

> Left flank under pressure.

- Morale -5: "Left flank under pressure" (event)
- Line integrity -5

> Leclerc: "Steady, Fourteenth!" *(if officer alive)*

- Morale +4: "Captain rallies the line" (recovery) *(if officer alive)*
- Morale -4: "Enemy at close range" (passive)
- If Pierre alive (wounded): Morale +1: "[Pierre] holds the line" (contagion)
- If Pierre alive (unwounded): Morale +2: "[Pierre] holds the line" (contagion)
- If Jean-Baptiste alive and Steady/Shaken: Morale +1: "[Jean-Baptiste] holds on" (contagion)
- If Jean-Baptiste alive and Wavering+: Morale -2: "[Jean-Baptiste] is trembling" (contagion)

---

## Volley 4 — 25 paces (Point Blank)

**Fire Order (from text.ts):** "Tirez! Dernière salve!" Point blank.

### Drill Steps

**Present:**
> Present. 25 paces. Last volley.

**Fire Order:**
> "Tirez!"

**Fire Hit:**
> Hit. Target down.

**Fire Miss:**
> Miss.

**Endure:**
> Fix bayonets.

### Events

**On Present step:**
> Enemy charging. Left flank breaking.

- Morale -4: "The enemy is charging" (event)
- Morale -3: "Left flank is breaking" (event)
- Enemy morale set to "charging"

**On Endure step:**
> Bayonets fixed.

> Pierre fixes bayonet. Still fighting. *(if Pierre alive)*

- Morale +2: "Pierre's courage" (recovery) *(if Pierre alive)*
- Morale -5: "Point blank — they're right there" (passive)
