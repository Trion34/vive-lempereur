# Lab Development Plan

## Core Philosophy

The Lab is an **authoring workbench**, not a debug viewer. Every lab is a tool for designing, building, and iterating on pieces of the game. When the user and Claude sit down to work on an NPC, a story beat, a melee encounter, or a camp scene — the Lab is where that happens.

Each lab should have:
- **Browse/gallery view** — see everything that exists in that domain
- **Detail/edit view** — click in, see full context, modify
- **Good layout** — all relevant info visible at once, no scrolling through code files
- **Live preview where applicable** — see how changes look in-game
- **UI mode** (where applicable) — render the actual game screen in sandbox, iterate on layout/styling

Data flows from game data files (`src/data/`, `src/core/`) into the Lab for display. Editing capabilities will write back to data files over time, but Phase 1 focuses on well-structured read views + live interaction as the foundation.

---

## Categories & Labs (12 total)

### Combat (2)

#### Line Battle Lab
- **Purpose:** Design, test, and author line battle encounters
- **UI mode:** Render actual line battle screen (Panorama, DrillIndicator, LineStatus, EnemyPanel, NarrativeScroll, VolleyAnimation) in sandbox. Tweak layout/styling.
- **Battle authoring:** Design new line battles from scratch — set volley count, ranges, pacing, narrative events per volley, scripted events (e.g. wounded NCO, Pierre injury). Place finished battles into campaign chapters.
- **Data mode:** Browse/edit volley definitions, test auto-play sequences step-by-step
- **Formula calculators:** Load success, fire accuracy, return fire chance, line integrity rolls, graduated valor distributions
- **Controls:** Pick battle part (1/2/3), pick starting volley, set player stats with sliders, run auto-play or step volley-by-volley
- **Data sources:** `src/data/battles/*/volleys.ts`, `src/core/volleys/`, `src/core/morale.ts`

#### Melee Lab
- **Purpose:** Design, test, and author melee encounters
- **UI mode:** Render actual melee screen (SkirmishField, CombatantCards, MeleeActions, FatigueRadial) in sandbox. Tweak layout/styling.
- **Battle authoring:** Create new encounters from scratch — pick opponents from template library, set wave timing, define ally arrivals and conditions (e.g. "Pierre joins round 3 if alive"), configure arena context (terrain/battery/skirmish). Place finished encounters into campaign.
- **Data mode:** Browse/edit encounter configs, opponent templates (AI type, stats, names), ally templates, wave definitions
- **Testing:** Step through combat round-by-round, see AI decision tree at each step, hit calc breakdowns, fatigue accumulation
- **Formula view:** Hit chance calculator with stat sliders, damage ranges by body part, stance modifiers, fatigue tier debuffs
- **Data sources:** `src/core/melee/`, `src/data/battles/*/encounters.ts`

---

### Narrative (4)

#### Story Beat Preview
- **Purpose:** Author and test narrative sequences
- **UI mode:** Render the actual cinematic overlay (parchment, typewriter text, choice buttons) in sandbox. Tweak timing, styling, layout.
- **Authoring:** Write/edit narrative text, set typewriter timing, define choices and their consequences (stat checks, reputation changes, branching)
- **Browse:** Gallery of all existing story beats across all chapters, organized by battle/chapter
- **Preview:** Play through a beat with full typewriter animation, test choices, see branching paths
- **Data sources:** `src/data/battles/*/storyBeats.ts`, cinematic overlay system

#### NPC Browser
- **Purpose:** Author and manage all NPCs in the game
- **Gallery view:** Grid of NPC cards (portrait placeholder + name + role/unit)
- **Detail view:** Full panel with description, stats, story role, relationships, which battles/camps they appear in, socialize dialogue, portrait
- **Authoring:** Create new NPCs, edit existing ones, define relationships, assign to chapters
- **Data source:** `src/data/campaigns/` (NPC templates, roster definitions)
- **Phase 1:** Well-structured read view pulling from actual game data
- **Future:** Edit fields that write back to data files

#### Campaign Viewer (includes Sequence Builder)
- **Purpose:** Master blueprint for the entire game. Design campaign structure at every level.
- **Russian doll model — 3 zoom levels:**
  - **Campaign level:** Full war overview. Major arcs and branching paths visible. E.g. "Italian Campaign 1796-97" with 13 chapter nodes.
  - **Chapter level:** Node sequence within a chapter. See: prologue → camp → line → story beat → melee → etc. Rearrange, add, remove, replace nodes (swap a melee for a line battle, add a camp, insert a story beat).
  - **Node level:** Individual node config. Camp: action count, activities, events, NPC roster. Line: volley sequence. Melee: encounter config. Story beat: narrative text, choices.
- **Branching:** Based on player choices AND battle results. Lost battle = death/restart unless narratively lost.
- **Editing model:** Visual changes in the Lab → ask Claude to implement in actual game code
- **Phase 1:** Read-only visualization of existing Italy campaign (13 chapters). Zoom in from campaign → chapter → node → config.
- **Data sources:** `src/data/campaigns/italy/`, `src/data/battles/`, `ITALY-CAMPAIGN.md`

#### Visual Novel Lab
- **Purpose:** Design and prototype the visual novel dialogue system from scratch
- **This is a NEW system** — doesn't exist in the game yet. The Lab is where it gets invented.
- **The VN system will be a huge part of the player experience** — primary way players interact with NPCs and experience story. Essential to the RPG side of this roguelike text-based RPG.
- **UI prototyping:** Experiment with layouts — portrait placement, dialogue box styling, choice presentation, background scenes, character expressions/poses. Must match the game's aesthetic (dark palette, EB Garamond, parchment accents, period feel).
- **Authoring:** Write dialogue trees, set character expressions/poses, assign backgrounds, define branching paths
- **Preview:** Play through a VN scene as the player would see it, with full animations/transitions
- **Phase 1:** Prototype canvas — iterate heavily on layout and feel. Multiple approaches before settling. **Do NOT stop iterating** — keep refining until you cannot improve it further or the user returns.
- **Design direction:** Classic VN elements adapted for Napoleonic aesthetic. Details TBD through iteration.
- **This is the crown jewel** — the most important lab. Spend the most time here. Design a real, working VN engine: data format for dialogue trees, branching logic, character expression system, background scene system, and a polished renderer. Then iterate on the visual design endlessly.

---

### Systems (4)

#### Camp Lab
- **Purpose:** Design camp phases — activities, events, UI layout
- **UI mode:** Render actual camp screen in sandbox — scene art, activity panels, portrait, action counter, event popups. Tweak layout/styling/interactions.
- **Data mode:** Browse/edit all activities by category (Rest/Exercise/Arms Training/Duties/Socialize), sub-activities, stat check outcomes, reputation effects, flavor text
- **Event authoring:** Create/edit camp events — trigger conditions, narrative text, choices, stat consequences
- **Stat check simulator:** Pick stat, set difficulty, roll repeatedly, see success distribution curves
- **Reputation gates:** Visualize what unlocks at each rep threshold (soldierRep, officerRep, napoleonRep)
- **Data sources:** `src/core/camp.ts`, `src/core/campActivities.ts`, `src/data/battles/*/camp.ts`

#### Minigame Lab
- **Purpose:** Minigame authoring platform — create, configure, and test mini-games
- **Existing:** Playable Passe-Dix — pick stakes, bet, roll, see outcomes. Probability display showing odds, cheating detection rates.
- **Authoring:** Design new mini-games from scratch — define rules, configure parameters, test balance
- **UI mode:** How each mini-game looks in-game, iterate on styling and interactions
- **Browse:** Gallery of all mini-games with their rules and parameters
- **Multiple games planned** — Passe-Dix is just the first. Lab should accommodate different game types.
- **Data sources:** `src/core/passeDix.ts`, future mini-game modules

#### Audio Lab
- **Purpose:** Music/SFX authoring and audition
- **Music section:** Play/stop each track, crossfade controls, volume slider
- **SFX section:** Play each pooled sound (volley, hit, miss, block, musket, ricochet), volume control
- **Synth sandbox:** Migrated from testScreen.ts — click sound candidates, waveform parameters
- **Grows organically** as sound/music library expands
- **Data sources:** `src/music.ts`, `src/audio.ts`, `src/components/devtools/testScreen.ts`

#### Art Lab
- **Purpose:** Build and iterate SVG art — camp scenes, panoramas, visual assets
- **Component gallery:** Render existing SVG components (CampSceneArt, VoltriSceneArt, Panorama, BattlefieldView) with parameter controls
- **Scene workspace:** Preview area for building/iterating new SVG scenes
- **Camp scene authoring:** Primary workspace for creating the 13 chapter camp backdrops (see SVG section)
- **Visual asset browser:** See all art assets in one place
- **Data sources:** `src/components/camp/`, `src/components/line/Panorama.tsx`, `src/components/line/BattlefieldView.tsx`

---

### Data & State (2)

#### State Inspector
- **Purpose:** Craft and test game states — build specific scenarios for testing
- **Tree viewer:** Expandable/collapsible tree for full GameState/BattleState/CampState (like browser devtools)
- **JSON export/import:** Copy state to clipboard, paste in a custom state to set up scenarios
- **Inline editing:** Click a value, change it, see effect
- **Phase 1:** Tree viewer + JSON export/import
- **Future:** Quick presets ("fresh game", "mid-battle Part 1", "camp with 4 actions left")

#### Save Manager
- **Purpose:** Manage saves and profiles
- **Profile viewer:** All 3 profiles, glory, last played
- **localStorage browser:** All game keys, raw values, sizes
- **Edit/delete:** Modify glory, clear profiles
- **Import/export:** Copy full save to clipboard, paste one in

---

## SVG Camp Scene Backdrops

### Art Direction
- Style matches existing `CampSceneArt` (Rivoli) and `VoltriSceneArt` (Voltri)
- Atmospheric, moody, hand-crafted SVG
- 800x400 viewBox, `preserveAspectRatio="xMidYMid slice"`
- Layered: sky → distant features → mid-ground → ground → campfire/soldiers → atmospheric overlays
- Animated elements: fire flicker, sparks, stars twinkle, smoke wisps, water shimmer
- Dark palette with warm fire/glow accents
- Each scene should feel distinct — unique time of day, weather, terrain, mood
- Existing scenes are 250-600 lines of SVG — new scenes should match that detail level

### Existing Scenes (improve)
- **CampSceneArt** (Rivoli, Ch.11): Night mountain camp. Stars, crescent moon, distant campfires across hills, central campfire with 4 soldier silhouettes, musket tripods. Deep blue-black sky.
- **VoltriSceneArt** (Ch.1 partial): Dawn hillside overlooking coastal town. Sunrise over sea, fading stars, town with lit windows, church bell tower, olive trees, dying campfire embers.

### New Scenes (11)

| Ch | Title | Setting | Time | Key Visual Elements | Mood |
|----|-------|---------|------|---------------------|------|
| 1 | Army of Italy | Nice, coastal garrison | Overcast dusk | Ragged camp near coast, broken shoes/gear, thin blankets, Mediterranean in background, grey skies, distant city walls | Bleak, hungry, restless |
| 2 | Montenotte | Mountain ravine | Night, rain/fog | Steep ravines, fog drifting through trees, small fires in a narrow valley, rain streaks, dark mountains looming | Tense, first-battle nerves |
| 3 | Mondovì | Fertile Piedmont plain | Warm evening | Open plain below mountains, plunder visible (food, wine barrels), warmer tones, farmland, distant village | Relief mixed with moral unease |
| 4 | Lodi | River bank (Po) | Dusk | Wide river, pontoon bridge in distance, artillery silhouettes, evening sky reflected in water | Anticipation, esprit de corps |
| 5 | Milan | Urban garrison | Summer night | Italian architecture, elegant buildings, military camp in a piazza, warm lamplight from windows, trees | Uneasy occupation |
| 6 | Mantua Siege | Marshland | Oppressive midday haze | Malarial marsh, fortress silhouette in heat haze, stagnant water, sickly yellow-green atmosphere, few wilting trees | Suffocating, diseased |
| 7 | Castiglione | Lake Garda hillside | Hot twilight | Lake visible, defensive positions, exhausted troops, summer heat haze, smoke from distant fires | Desperate endurance |
| 8 | Bassano | Brenta valley | Autumn dusk | Mountain valley, river winding below, autumn foliage turning, fast-moving clouds | Momentum, mountain pursuit |
| 9 | Caldiero | Muddy field | Rain, grey daylight | Driving rain, mud everywhere, tattered uniforms, broken equipment, bare trees, darkest palette of all scenes | Despair, defeat |
| 10 | Arcole | Marsh/causeway | November dawn, cold | Flat marshland, narrow causeway into mist, bare willows, frost, thin ice on water, pale cold light | Grim determination |
| 12 | Fall of Mantua | Outside fortress walls | Winter morning | Fortress walls/gates, distant surrendering column, winter bare trees, grey sky, worn victors | Somber victory |
| 13 | March on Vienna | Alpine road | Spring dawn | Mountain pass opening to green valley, spring flowers, confident army on move, Alpine peaks with snow | Forward momentum, hope |

### SVG Iteration Strategy
1. Create initial scene (~200-400 lines of SVG)
2. Render in browser (Art Lab or standalone HTML test page)
3. Take screenshot, analyze composition/mood/color balance
4. Iterate: adjust gradients, refine silhouettes, add/adjust animations, improve atmospheric depth
5. Compare against reference scenes (CampSceneArt/VoltriSceneArt quality bar)
6. Repeat steps 2-5 for **10-20 full cycles per scene** — do NOT stop early
7. Focus on: layered depth, atmospheric gradients, animated details, mood accuracy
8. Never settle — keep iterating until the scene genuinely matches or exceeds reference quality

---

## Implementation Order

### Phase A: Lab Infrastructure (do first)
| Priority | Task | Complexity | Notes |
|----------|------|-----------|-------|
| A1 | Art Lab | Medium | Must exist for SVG iteration. Component gallery + preview area. |
| A2 | State Inspector | Medium | Tree viewer + JSON export/import. |
| A3 | Save Manager | Low-Medium | localStorage browser + profile editor. |
| A4 | Audio Lab | Low-Medium | Migrate testScreen.ts + music/SFX controls. |

### Phase B: Data-Driven Labs
| Priority | Task | Complexity | Notes |
|----------|------|-----------|-------|
| B1 | NPC Browser | Medium | Gallery + detail from existing game data. |
| B2 | Campaign Viewer | High | Hierarchical campaign → chapter → node viewer. Phase 1 read-only. |
| B3 | Camp Lab | Medium-High | Activity browser + stat sim + UI sandbox. |

### Phase C: Interactive / Authoring Labs
| Priority | Task | Complexity | Notes |
|----------|------|-----------|-------|
| C1 | Minigame Lab | Medium | Playable Passe-Dix + authoring framework. |
| C2 | Story Beat Preview | High | Cinematic renderer + text editor + browse gallery. |
| C3 | Line Battle Lab | High | Volley sim + formula display + battle authoring + UI sandbox. |
| C4 | Melee Lab | High | Combat sim + AI stepper + encounter authoring + UI sandbox. |

### Phase D: New System Design
| Priority | Task | Complexity | Notes |
|----------|------|-----------|-------|
| D1 | Visual Novel Lab | Very High | Brand new system. Design actual working VN engine. Iterate endlessly — never stop improving. Core RPG system. |

### SVG Work (runs in parallel with all phases)
- **Improve existing:** CampSceneArt (Rivoli), VoltriSceneArt (Voltri/Ch.1)
- **Create 11 new scenes:** Ch.1-10, Ch.12-13 (Ch.11 = Rivoli existing)
- Each scene gets 10-20 iteration cycles with screenshot review — never settle
- SVG agents work independently of lab implementation agents

---

## Autonomous Execution Notes

- Work through Phases A → B → C → D in order
- SVG scene agents run in parallel throughout
- Each lab: implement → `npx tsc --noEmit` → `npx vite build` → `npx vitest run` → Playwright verify
- Write tests for all store logic and data transforms
- For ambiguous design decisions: build the simplest useful version, document alternatives
- For SVG: iterate visually using Playwright screenshots, compare against reference scenes
- **Commit periodically** to `demo-2.0` branch — after each major lab or SVG scene
- Update completion tracking below as work progresses
- Read this file at the start of each agent task for context
- **NEVER STOP WORKING** — keep iterating, improving, building until the user returns
- When a lab is "done", go back and improve it. When an SVG is "done", iterate more.
- NPC Browser: pull from existing codebase data (there isn't a ton, but use what exists)
- Campaign Viewer: parse real Italy campaign structure from `ITALY-CAMPAIGN.md` and `src/data/campaigns/`
- Visual Novel Lab: design an actual working VN engine, not just a shell. Iterate endlessly.

### Completion Tracking

| Task | Status | Notes |
|------|--------|-------|
| Art Lab | TODO | |
| State Inspector | TODO | |
| Save Manager | TODO | |
| Audio Lab | TODO | |
| NPC Browser | TODO | |
| Campaign Viewer | TODO | |
| Camp Lab | TODO | |
| Minigame Lab | TODO | |
| Story Beat Preview | TODO | |
| Line Battle Lab | TODO | |
| Melee Lab | TODO | |
| Visual Novel Lab | TODO | |
| SVG: Rivoli improve | TODO | |
| SVG: Voltri improve | TODO | |
| SVG: Ch.1 Nice | TODO | |
| SVG: Ch.2 Montenotte | TODO | |
| SVG: Ch.3 Mondovì | TODO | |
| SVG: Ch.4 Lodi | TODO | |
| SVG: Ch.5 Milan | TODO | |
| SVG: Ch.6 Mantua Siege | TODO | |
| SVG: Ch.7 Castiglione | TODO | |
| SVG: Ch.8 Bassano | TODO | |
| SVG: Ch.9 Caldiero | TODO | |
| SVG: Ch.10 Arcole | TODO | |
| SVG: Ch.12 Mantua Fall | TODO | |
| SVG: Ch.13 Vienna March | TODO | |
