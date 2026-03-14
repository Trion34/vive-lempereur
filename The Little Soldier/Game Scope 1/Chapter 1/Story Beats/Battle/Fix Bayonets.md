# Fix Bayonets

**Type:** Story beat (chargeEncounter=10, VoltriFixBayonets)
**Trigger:** After Volley 2

---

## Narrative

> The Austrians are done exchanging volleys. A column of white coats surges up the slope, bayonets levelled, drums beating the charge.
>
> Sergeant Morin's voice: "FIX BAYONETS!"
>
> Steel rasps from scabbards. Clicks on muzzles. Your musket becomes a spear.
>
> The man beside you curses as his hands slip. You get yours done on the first try.
>
> They're coming up the hill. Through the olive groves. Scrambling over the stone walls. You can see their faces now.

## Choice

### Fix bayonets
*Steel on steel. They're coming up the hill.*

> You fix your bayonet. The steel clicks home.
>
> The Austrian column hits the French position. Men crash into men among the olive trees and stone walls. Musket butts, bayonets, fists. The neat volley line dissolves into a dozen private battles.
>
> You are in it now.

- Morale +3: "The rush of close combat"
- Transitions to Pegli Hills melee (MeleeContext.Skirmish)

## Arena Introduction

> --- SKIRMISH ---
>
> The hilltop is chaos. Olive trees and stone walls break the fighting into knots of struggling men.

## Mechanics
- Single choice (no branching — this is a transition beat)
- Creates melee state with `pegli_hills` encounter
- 3 opponents: 2 Austrian conscripts + 1 line infantryman
- maxExchanges: 8 (shorter than Rivoli's 12)
- No ally reinforcements (solo melee — tutorial)
