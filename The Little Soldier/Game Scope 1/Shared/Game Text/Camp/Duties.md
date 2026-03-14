# Duties

> Source: `src/core/campActivities.ts`, `src/ui/campPhase.ts`, `src/core/preBattleCamp.ts`

## Category Flavor
> The army runs on routine. There is always something that needs doing — and someone has to do it.

---

## Forage
**Button:** "Forage"
**Description:** "Take a detail into the countryside. Find what you can."
**Check:** Awareness (Standard)

### Success (3 variants)
> You find a root cellar half-buried in snow behind an abandoned farmhouse. Frozen turnips, a sack of chestnuts, a clay jug of vinegar. Not much — but the men cheer when you come back.

> A skinny chicken, hiding in the ruins of a barn. You wring its neck before it can squawk. Tonight, the section eats.

> Firewood. Real firewood — dry oak, stacked under a collapsed shed roof. You drag back as much as you can carry. The fire burns properly for the first time in days.

**Result:** You brought something back. The lads remember who fed them.

### Fail (3 variants)
> Nothing. Frozen fields picked clean by every army that has passed this way. You come back empty-handed, boots soaked through, fingers blue.

> You range further than you should, alone on the mountainside. The wind cuts through your coat. There is nothing here. There was never anything here.

> An abandoned village, already stripped. Every cupboard bare, every root cellar emptied. You kick through the snow for an hour and find nothing but frozen mud.

**Result:** Nothing to show for it. At least you went.

**Effect:** Success: Soldier Rep +3, Health +5, Morale +2, Stamina -10. Fail: Soldier Rep +1, Morale -1, Stamina -10.

---

## Check Equipment
**Button:** "Check Equipment"
**Description:** "Strip and clean the musket. Sharpen the bayonet."

*Opens sub-menu: MAINTAIN EQUIPMENT*

### Success
> Strip. Clean. Oil. Sharpen. The Charleville gleams. So do you.
> Equipment ready. Morale +2

### Fail
> The lock spring is weak. The uniform is beyond patching. Adequate. Not good.
> Adequate. Nothing more.

**Sub-options (Coming Soon):**
- Musket & Bayonet — "Strip, clean, and oil the lock. Sharpen the bayonet."
- Mend Uniform — "Patch holes, re-stitch seams, polish buttons."

---

## Volunteer for Duty
**Button:** "Volunteer for Duty"
**Description:** "Make yourself useful."

*Randomly assigns one of four tasks:*

### Sentry Duty
**Assignment:** "You draw sentry duty on the perimeter."

**Success:**
> SENTRY DUTY — The cold is brutal, but you keep your eyes open. Every shadow could be Austrian scouts. Hours pass. Your vigilance is noted by the returning patrol corporal. You made a good impression.

**Fail:**
> SENTRY DUTY — The cold seeps through your coat. Your eyes grow heavy. You jerk awake at a sound — nothing. Or was it? The corporal finds you shivering, half conscious. He says nothing. His look says enough. You made a bad impression.

### Scout the Ground
**Assignment:** "A corporal picks you for a patrol of the plateau."

**Success:**
> SCOUT THE GROUND — Stone walls. Ravines. Frozen vineyards. You map it in your mind — reporting your findings to the corporal with meticulous detail. He nods at your observations. You made a good impression.

**Fail:**
> SCOUT THE GROUND — The darkness and cold defeat you. Every ravine looks the same. You stumble back to camp with nothing useful to report. The corporal's disdain is evident. You made a bad impression.

### Carry Dispatches
**Assignment:** "You're sent running dispatches between officer positions."

**Success:**
> CARRY DISPATCHES — Across the frozen plateau in the dark, following paths you can barely see. But you find each position, deliver each message, and return. The lieutenant acknowledges you with a cool nod. You made a good impression.

**Fail:**
> CARRY DISPATCHES — The plateau is dark and confusing. You take a wrong turn, double back, arrive late. The officer snatches the dispatch without a word. You made a bad impression.

### Dig Positions
**Assignment:** "You're put on entrenchment detail."

**Success:**
> DIG POSITIONS — Piling stones, digging shallow trenches in the frozen earth. Your hands crack and bleed. Your hard work makes a real difference. You made a good impression.

**Fail:**
> DIG POSITIONS — The ground is frozen iron. Your tools bounce off it. Hours of labor for inches of trench. The sergeant looks at the result and says, "That wouldn't stop a goat." You made a bad impression.

---

## Tend the Wounded (Locked)
**Button:** "Tend the Wounded"
**Description:** "Help the surgeon. Grim work, but someone must."
**Lock:** "Coming soon"
