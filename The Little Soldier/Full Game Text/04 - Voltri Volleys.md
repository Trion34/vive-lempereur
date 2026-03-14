# Voltri Volleys
*The Pegli Heights — 2 volleys*

## Volley 1 — 150 Paces

### Fire Order
> "Feu!" Sergeant Morin's voice cuts through the wind.

### Present
> Present arms. 150 paces. The Austrians are climbing the slope.

### Endure
> Return fire from the olive groves.

### Fire Hit
> Hit. An Austrian stumbles and falls among the olive trees.

### Fire Miss
> Miss. The ball clips branches overhead.

### Events

**On Fire step:**
> First volley crashes out. Smoke rolls across the hillside.
- Morale +3 "First volley — the musket does its work"

**On Endure step:**
- Morale -2 "Under fire for the first time"
- Morale +2 "Sergeant Morin steadies the section"

### Config
- fireAccuracyBase: 0.15
- perceptionBase: 0.1
- enemyReturnFireChance: 0.1
- enemyReturnFireDamage: [5, 10]

---

## Volley 2 — 100 Paces

### Fire Order
> "FIRE!" The line erupts.

### Present
> Present. 100 paces. They keep coming.

### Endure
> Austrian return fire tears through the position.

### Fire Hit
> Hit. Target down in the scrub.

### Fire Miss
> Miss. The smoke makes it hard to see.

### Events

**On Fire step:**
> The second volley hits home. White coats stumble in the olive groves.
- Morale +2 "Good shooting — Austrians falter"

**On Endure step:**
> Austrian return fire. Ball hits the man two files over.
- Morale -4 "Man killed in the section"
- Morale -2 "Under fire at closer range"
- lineIntegrity -4

### Config
- fireAccuracyBase: 0.25
- perceptionBase: 0.2
- enemyReturnFireChance: 0.18
- enemyReturnFireDamage: [7, 13]
