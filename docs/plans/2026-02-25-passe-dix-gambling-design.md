# TLS-16: Passe-dix Gambling Mini-Game Design

## Summary

Add a playable Passe-dix (campfire dice) mini-game to the camp phase, unlocking the existing "Gamble" button under Socialize. Players bet reputation on dice rolls in a historically authentic 1790s soldiers' game.

## Game Rules

**Passe-dix** ("pass ten"): Roll 3 dice. Total > 10 = "Passe" (over wins). Total <= 10 = "Manque" (under wins).

## Flow

1. Player clicks "Gamble" in Socialize menu (currently locked)
2. CampActionPanel renders Passe-dix sub-view (same pattern as Check Equipment, Write Letter)
3. Player selects stake tier: Low / Medium / High
4. Player clicks "PASSE" (over 10) or "MANQUE" (under 10)
5. Three dice animate and resolve
6. Result: narrative text + reputation/morale changes
7. 1 camp action consumed, returns to Socialize

## Stakes

| Tier | Rep Win | Rep Lose | Morale Win | Morale Lose |
|------|---------|----------|------------|-------------|
| Low  | +1      | 0        | +2         | -1          |
| Med  | +3      | -1       | +4         | -2          |
| High | +5      | -3       | +6         | -4          |

## Cheating Detection

Existing awareness check (d100 vs awareness, Hard difficulty). On a loss, if the check passes, the player detects cheating and walks away with no penalty.

## Architecture

### Core Logic (`src/core/passeDix.ts`)
- `rollPasseDix()`: Roll 3 dice, return values and total
- `resolvePasseDix(player, camp, stake, bet)`: Full resolution with narratives
- Pure functions, no UI concerns

### UI (`src/components/camp/CampActionPanel.tsx`)
- New `campActionSub === 'gamble'` branch
- Stake selection buttons, Passe/Manque bet buttons, dice display, result text
- Dice animation via CSS keyframes (no animation libraries)

### Wiring
- Unlock the "Gamble" button (remove `locked: true`)
- Add `CampActivityId.Gamble` case to `resolvePreBattleActivity`
- `handleCampActivity` already handles the result flow

## Files to Modify

1. `src/core/passeDix.ts` (NEW) - Game logic
2. `src/core/preBattleCamp.ts` - Add Gamble case to dispatch
3. `src/components/camp/CampActionPanel.tsx` - Passe-dix sub-view UI
4. `src/styles/phases/camp.css` - Dice and stake styling
5. `src/__tests__/core/passeDix.test.ts` (NEW) - Core logic tests
6. `src/__tests__/components/CampGamble.test.tsx` (NEW) - Component tests
