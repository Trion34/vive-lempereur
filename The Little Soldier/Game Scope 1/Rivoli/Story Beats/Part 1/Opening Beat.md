# Opening Beat

**Type:** Opening cinematic (showOpeningBeat)
**Trigger:** After clicking "March to Battle" from camp

---

## Splash
Fate Beckons...

## Cinematic

**Title:** BATTLE OF RIVOLI
**Subtitle:** 14 January 1797

## Narrative
Dawn on the Rivoli plateau. January cold cuts through your patched coat. The 14th stands in the second line, muskets loaded, waiting. The mountains fill the horizon — and somewhere in those gorges, twenty-eight thousand Austrians are moving.

Gunfire erupts on the right flank. Not the steady crash of volleys — ragged, sudden, too early. The battle has begun before anyone expected it.

To your left, Pierre checks his flint. Arcole veteran. Steady hands. To your right, Jean-Baptiste grips his musket like a drowning man grips driftwood.

The drums roll. The 14th advances through the broken ground — vineyards, stone walls, churned earth — toward the sound of the guns.

"Present arms! First volley on my command!"

## Choices

### Take your place in the line
*"The drums are rolling. The 14th advances."*

Transitions to Line Part 1 (auto-play volleys begin).

## Mechanics
- Splash text "Fate Beckons..." displays first, click to proceed
- Cinematic overlay with typewriter text, split by paragraph
- Single choice — no branching
- Sets `showOpeningBeat: false` in uiStore
- Resets `lastRenderedTurn` and sets `phaseLogStart` for line phase
- Source: `openingNarrative()` in `src/core/battle.ts` (line 25)
