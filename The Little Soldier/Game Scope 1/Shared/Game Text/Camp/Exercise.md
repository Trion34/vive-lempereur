# Exercise Activities

> Source: `src/core/campActivities.ts`, `src/ui/campPhase.ts`

## Category Flavor
> The body is a soldier's first weapon.

---

## Haul
**Button:** "Haul"
**Description:** "Find something heavy. Move it somewhere else."
**Detail:** Strength + Endurance

### Success
> You shoulder a water barrel from the stream and carry it uphill to camp. And again. Your arms  shake. You're getting stronger.

### Fail
> You shoulder a water barrel from the stream and carry it uphill to camp. And again. Your arms  shake. You're not getting any stronger.

---

## Wrestle
**Button:** "Wrestle"
**Description:** "Grapple with a comrade. Builds power and toughness."
**Detail:** Strength + Constitution

### Success
> You grapple with a comrade behind the supply wagons. Your body learns to absorb punishment and dish it out. You're getting stronger.

### Fail
> You grapple with a comrade behind the supply wagons. Your body fails you. You're not getting any stronger.

---

## Run
**Button:** "Run"
**Description:** "Run the perimeter. Lungs and legs."
**Detail:** Endurance + Constitution

### Success
> You run the camp perimeter, boots pounding frozen ground. You find a rhythm, a second wind. You're getting better.

### Fail
> You run the camp perimeter, boots pounding frozen ground. You tire quickly. You're not getting any better.
---

## Stat Result Flavor Text

| Stat | Success | Fail |
|------|---------|------|
| Strength | "The weight feels lighter." | "Your muscles won't cooperate." |
| Endurance | "Second wind." | "Your lungs give out." |
| Constitution | "Your body hardens." | "The body won't toughen." |
| Musketry | "Your hands remember." | "Your hands fumble." |
| Élan | "The blade feels natural." | "The motions stay stiff." |
| Awareness | "You see what others miss." | "Nothing stands out." |
| Valor | "Your nerve steadies." | "The fear remains." |

**Format:** "[Flavor text] [Stat Label] +1" or "[Flavor text] [Stat Label] —"
