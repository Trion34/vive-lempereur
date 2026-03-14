# Volley Narratives

> Source: `src/core/scriptedVolleys.ts`, `src/core/battle.ts`

## Opening Narrative (Before Volleys)
> Dawn on the Rivoli plateau. January cold cuts through your patched coat. The 14th stands in the second line, muskets loaded, waiting. The mountains fill the horizon — twenty-eight thousand Austrians approach. 
>
> Gunfire erupts on the right flank. The battle has begun earlier than anticipated. 
>
> To your left, Pierre checks his flint. Arcole veteran. Steady hands. To your right, Jean-Baptiste grips his musket nervously.
>
> The drums roll. The Austrians advance through the broken ground — vineyards, stone walls, churned earth — This is it.
>
> "Present arms!"

---

## Part 1 Volleys (120 → 80 → 50 → 25 paces)

### Volley 1 — 120 Paces (First Exchange)
**Present:** "Present arms. 120 paces."
**Fire Order:** "Feu!"
**Endure:** "Return fire."

**Scripted Events:**
- FIRE: "First volley hit." (+2 morale)
- ENDURE: "Fighting on the right." (-4 morale)

### Volley 2 — 80 Paces (The Test)
**Present:** "Present. 80 paces."
**Fire Order:** "FIRE!"
**Endure:** "Return fire."

**Scripted Events:**
- FIRE: "Man killed nearby." (-3 morale, line integrity -3)
- ENDURE: Range pressure (-3), drums (+2), neighbour contagion

### Volley 3 — 50 Paces (The Storm)
**Present:** "Present. 50 paces."
**Fire Order:** "FIRE!"
**Endure:** "Return fire. Men fall."

**Scripted Events:**
- PRESENT: "Pierre hit. Shoulder. Still fighting." (-6 morale, Pierre wounded)
- ENDURE: "Artillery silent. Too close." / "Left flank under pressure." (-5 morale) / Leclerc: "Steady, Fourteenth!" (+4 morale)

### Volley 4 — 25 Paces (Point Blank)
**Present:** "Present. 25 paces. Last volley."
**Fire Order:** "Tirez!"
**Endure:** "Fix bayonets."

**Scripted Events:**
- PRESENT: "Enemy charging. Left flank breaking." (-7 morale combined)
- ENDURE: "Bayonets fixed." / "Pierre fixes bayonet. Still fighting." (+2 morale)

---

## Part 2 Volleys (100 → 60 → 40 paces)

### Volley 5 — 100 Paces (Fresh Column)
**Present:** "Present. 100 paces. Fresh column."
**Fire Order:** "Feu!"
**Endure:** "Return fire. Fresh muskets."

**Scripted Events:**
- PRESENT: "Vukassovich guns open." (-5 morale) / "Masséna still fighting." (+3 morale)
- ENDURE: "Reuss attacks the Pontare." (-4 morale) / "Pierre reloads beside you." (+2 contagion)

### Volley 6 — 60 Paces (Pontare Fallen)
**Present:** "Present. 60 paces. Right flank open."
**Fire Order:** "FIRE!"
**Endure:** "Return fire. Surrounded."

**Scripted Events:**
- PRESENT: "Pontare fallen. Right flank exposed." (-6 morale) / Leclerc: "Hold the line!" (+3 morale)
- ENDURE: "Lusignan at Affi. Surrounded." (-8 morale) / Pierre: "We've been in worse." (+3 contagion)

### Volley 7 — 40 Paces (Desperate)
**Present:** "Present. 40 paces. Last volley."
**Fire Order:** "TIREZ!"
**Endure:** "Bonaparte on the ridge. Counterattack ordered."

**Scripted Events:**
- PRESENT: "Men breaking in the rear." (-5 morale, line integrity -8)
- ENDURE: "Bonaparte on the ridge. Counterattack ordered." (+10 morale) / Leclerc: "To the ridge!" (+5 morale)

---

## Fire Outcome Narratives (All Volleys 1–7)

| Outcome | Text |
|---------|------|
| Hit + Seen | "Hit. Target down." |
| Hit + Unseen | "Fired. Result unknown." |
| Miss + Seen | "Miss." |
| Miss + Unseen | "Fired." |
| Snap Shot | "Snap shot. Wild." |

---

## Line Integrity Roll
**French win:** "Line holds."
**Austrian win:** "Line wavers. Gaps open."

---

## Valor Check Display
**Great Success:** "STEELED" (+5 morale)
**Pass:** "HELD STEADY" (+2 morale)
**Fail:** "SHAKEN" (-3 morale)
**Critical Fail:** "NEARLY BROKE" (-6 morale, 20% minor wound chance)

---

## Load Results
**Success:** "Loaded."
**Fumble + Recovery:** "Fumbled reload." → "Reloaded."

---

## Turn Narrative Fragments
- "Present arms."
- "Ready to fire."
- "Endure."
- "Loading."
- "[N] down." (casualties)
- "Hands unsteady." (Shaken)
- "Want to run." (Wavering)
- "Can't stop shaking." (Breaking)

---

## Crisis Narratives (Random Path)

### Crisis Turn 1 (Charging)
> They're coming. The pas de charge. A hundred voices screaming. Bayonets catch the light.
>
> This is the moment. Everything you've endured was leading here.

### Crisis Turn 1 (Non-Charging)
> The pattern shatters. The battle accelerates toward its conclusion.
>
> What happens now depends on what you have left.

### Crisis Turn 2
> Bayonets levelled. The line surges. Steel meets steel.
>
> Your body knows what's coming.

### Crisis Peak
> The crisis reaches its peak.

### Phase Transition Text
- "THEY'RE CHARGING! Bayonets levelled. The pas de charge. This is it."
- "The line is dissolving. Too many gaps. Too many dead."
- '"FIX BAYONETS!" This isn't a firefight anymore.'
- "You can't stay here. Everything screams to run."
