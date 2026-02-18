# Balance Simulation

Runs N full combat scenarios per player profile and reports survival rates, average HP/stamina/morale at each phase transition, kill counts, and ally death rates.

## Usage

```bash
npx tsx tools/balance-sim.ts [runs=1000]
```

## Phases Simulated

Each run plays through the full combat gauntlet in order:

1. **Volleys** (7 total, Parts 1+2) — Return fire hits, graduated valor rolls (morale swing), passive morale drain (range-based, valor-scaled), critical fail wounds, stamina drain. Line integrity degrades over volleys, making valor checks harder.
2. **Terrain Melee** (4 opponents, 1 active at a time) — Sequential melee with full combat resolution: hit rolls, body part targeting, stamina/fatigue, stun, injuries. 12-round cap.
3. **Battery Skirmish** (6 opponents, 2+ active, with allies) — Pierre joins round 3, JB joins round 5, max active enemies increases to 3 at round 7. 20-round cap.

A **Fresh Battery Benchmark** also runs the battery skirmish in isolation at full HP to measure battery difficulty independent of attrition.

## Player AI

All profiles use the same AI (`choosePlayerAction`). Behavior is driven by current state:
- Shoots if musket loaded (opening shot)
- Catches breath if stamina < 15%
- Reloads when safe (opponent stunned or low HP)
- Morale gates actions: Breaking = guard/respite only, Wavering = thrust/guard/respite/shoot/reload only
- Otherwise mixes bayonet thrust, aggressive lunge, butt strike, feint, and guard based on random weighted selection

## Profiles

All profiles use identical AI — only stats and grace differ.

| # | Name | Élan | Str | End | Con | Musk | Valor | Grace | Description |
|---|------|------|-----|-----|-----|------|-------|-------|-------------|
| 1 | Default | 35 | 40 | 40 | 45 | 35 | 40 | 0 | Raw starting stats, zero Glory spent, no camp training |
| 2 | Low Stats | 20 | 30 | 30 | 35 | 20 | 25 | 0 | Below defaults — bad allocation or penalties |
| 3 | Invested | 55 | 50 | 50 | 55 | 50 | 55 | 0 | Smart Glory spending + camp training |
| 4 | Expert | 75 | 60 | 60 | 65 | 70 | 70 | 0 | Near ceiling — many Glory-earning runs + maxed training |
| 5 | Glass Cannon | 70 | 65 | 25 | 30 | 60 | 40 | 0 | All offense, no survivability |
| 6 | Tank | 25 | 30 | 70 | 70 | 30 | 55 | 0 | All survivability, no offense |
| 7 | Default + 2 Grace | 35 | 40 | 40 | 45 | 35 | 40 | 2 | Raw starting stats with 2 extra lives |
| 8 | Invested + 1 Grace | 55 | 50 | 50 | 55 | 50 | 55 | 1 | Invested stats with 1 extra life |
| 9 | Invested + 2 Grace | 55 | 50 | 50 | 55 | 50 | 55 | 2 | Invested stats with 2 extra lives |

### Character Creation Reference

| Stat | Default | Min | Max | Step (per Glory) |
|------|---------|-----|-----|------------------|
| Musketry | 35 | 20 | 70 | 5 |
| Élan | 35 | 20 | 70 | 5 |
| Strength | 40 | 20 | 70 | 5 |
| Endurance | 40 | 20 | 70 | 5 |
| Constitution | 45 | 20 | 70 | 5 |
| Valor | 40 | 10 | 80 | 5 |

Starting Glory: 10 (= 50 stat points to distribute).

### What Each Stat Does in Combat

- **Élan** — Melee hit chance (+élan/120), block (+élan/400), dodge (+élan/400)
- **Strength** — Melee damage (0.75 + str/200), butt strike stamina drain and stun chance
- **Endurance** — Stamina pool size (30 + 1.5×end), max fatigue
- **Constitution** — Health pool size (30 + 1.5×con)
- **Musketry** — Shoot hit chance, gorge targeting, musket loading
- **Valor** — Volley morale checks (graduated 4-tier roll), morale recovery efficiency, passive drain resistance (1 - valor/200)
- **Grace** — Extra lives (restore to 50% HP/morale/stamina on death)

## Output

Each profile prints:
- **Volley survival %** — with avg HP, stamina, and morale after volleys
- **Terrain survival %** — with avg HP after and avg kills out of 4
- **Battery survival %** — with avg kills out of 6, Pierre/JB death rates
- **Overall survival %** — survived all three phases

Target rates: ~35% default, ~65% invested, ~85% expert.

## Editing Profiles

Profiles are defined in `tools/balance-sim.ts` in the `PROFILES` array (search for `const PROFILES`). Each profile is a `StatProfile` object:

```typescript
{ name: 'Profile Name', elan: 35, strength: 40, endurance: 40, constitution: 45, musketry: 35, valor: 40, grace: 0 }
```

Update this file and this readme together when changing profiles.
