import React, { useState, useMemo, useEffect } from 'react';

/* ------------------------------------------------------------------ */
/*  Opponent / Ally / Encounter Data                                   */
/* ------------------------------------------------------------------ */

interface OpponentDef {
  name: string;
  type: string;
  health: [number, number];
  stamina: [number, number];
  strength: number;
  description: string;
  source: string;
  encounter: string;
}

interface AllyDef {
  id: string;
  name: string;
  type: string;
  health: [number, number];
  stamina: [number, number];
  strength: number;
  elan: number;
  personality: string;
  description: string;
  encounter: string;
}

interface EncounterDef {
  id: string;
  battle: string;
  context: string;
  opponentCount: number;
  allyCount: number;
  maxExchanges: number;
  initialActive: number;
  maxActive: number;
  hasWaveEvents: boolean;
  description: string;
}

const OPPONENTS: OpponentDef[] = [
  // Rivoli Terrain
  { name: 'Austrian conscript', type: 'conscript', health: [70, 85], stamina: [160, 200], strength: 40, description: 'He stumbles through the vineyard wall, white coat torn. Wide-eyed, shaking.', source: 'Rivoli', encounter: 'terrain' },
  { name: 'Austrian conscript', type: 'conscript', health: [65, 80], stamina: [150, 190], strength: 40, description: 'Another white coat scrambles over the low wall. Young — impossibly young.', source: 'Rivoli', encounter: 'terrain' },
  { name: 'Austrian line infantryman', type: 'line', health: [80, 95], stamina: [180, 240], strength: 50, description: 'A career soldier pushes through the gap. Calm enough. Steel levelled.', source: 'Rivoli', encounter: 'terrain' },
  { name: 'Austrian veteran', type: 'veteran', health: [95, 115], stamina: [200, 260], strength: 65, description: 'Steady hands, dead eyes, a scar across his jaw. He steps over the wall without hurrying.', source: 'Rivoli', encounter: 'terrain' },
  // Rivoli Battery
  { name: 'Austrian infantry guard', type: 'line', health: [80, 95], stamina: [180, 240], strength: 50, description: 'Infantry assigned to hold the captured battery. Professional.', source: 'Rivoli', encounter: 'battery' },
  { name: 'Austrian grenadier', type: 'veteran', health: [90, 110], stamina: [200, 260], strength: 60, description: 'A grenadier. Tall, bearskin cap, sabre-bayonet.', source: 'Rivoli', encounter: 'battery' },
  { name: 'Austrian infantry guard', type: 'line', health: [75, 90], stamina: [170, 220], strength: 48, description: 'Another white-coat fighting to hold the redoubt. Younger.', source: 'Rivoli', encounter: 'battery' },
  { name: 'Austrian battery sergeant', type: 'sergeant', health: [100, 125], stamina: [220, 280], strength: 75, description: 'The sergeant who led the assault. A big man with a cavalry sabre.', source: 'Rivoli', encounter: 'battery' },
  // Voltri Pegli Hills
  { name: 'Austrian conscript', type: 'conscript', health: [55, 70], stamina: [140, 180], strength: 35, description: 'A young Austrian stumbles through the olive grove. This is his first fight too.', source: 'Voltri', encounter: 'pegli_hills' },
  { name: 'Austrian conscript', type: 'conscript', health: [50, 65], stamina: [130, 170], strength: 33, description: "He's breathing hard from the climb. His musket is almost as tall as he is.", source: 'Voltri', encounter: 'pegli_hills' },
  { name: 'Austrian line infantryman', type: 'line', health: [70, 85], stamina: [160, 210], strength: 45, description: 'Not a conscript — a professional. Feet planted among the olive roots.', source: 'Voltri', encounter: 'pegli_hills' },
];

const ALLIES: AllyDef[] = [
  { id: 'pierre', name: 'Pierre', type: 'named', health: [75, 90], stamina: [180, 220], strength: 50, elan: 45, personality: 'aggressive', description: 'Pierre fights beside you — blood on his sleeve, bayonet steady.', encounter: 'battery_skirmish' },
  { id: 'jean-baptiste', name: 'Jean-Baptiste', type: 'named', health: [60, 75], stamina: [140, 180], strength: 38, elan: 30, personality: 'cautious', description: 'Jean-Baptiste is pale, bayonet shaking — but here.', encounter: 'battery_skirmish' },
];

const ENCOUNTERS: EncounterDef[] = [
  { id: 'terrain', battle: 'Rivoli', context: 'Terrain', opponentCount: 4, allyCount: 0, maxExchanges: 12, initialActive: 1, maxActive: 1, hasWaveEvents: false, description: 'Broken ground fighting in the vineyards of Rivoli. Stone walls, terraces, individual combat.' },
  { id: 'battery', battle: 'Rivoli', context: 'Battery', opponentCount: 4, allyCount: 0, maxExchanges: 10, initialActive: 1, maxActive: 1, hasWaveEvents: false, description: 'Retaking the overrun French battery. Solo assault without Pierre.' },
  { id: 'battery_skirmish', battle: 'Rivoli', context: 'Battery', opponentCount: 4, allyCount: 2, maxExchanges: 20, initialActive: 2, maxActive: 2, hasWaveEvents: true, description: 'Battery assault with allies. Pierre (R3) and JB (R5) join. Enemies increase (R7).' },
  { id: 'pegli_hills', battle: 'Voltri', context: 'Skirmish', opponentCount: 3, allyCount: 0, maxExchanges: 8, initialActive: 1, maxActive: 1, hasWaveEvents: false, description: 'Tutorial melee on the Pegli heights. Olive groves and stone walls.' },
];

/* ------------------------------------------------------------------ */
/*  Melee Formulas                                                     */
/* ------------------------------------------------------------------ */

function calcMeleeDamage(strength: number): number {
  return 0.75 + strength / 200;
}

function calcHitChance(elan: number): number {
  return 0.5 + elan / 200;
}

function calcBlockChance(elan: number): number {
  return 0.2 + elan / 400;
}

function calcDodgeChance(elan: number): number {
  return 0.1 + elan / 400;
}

interface FatigueTierInfo {
  tier: string;
  threshold: number;
  hitPenalty: number;
  damagePenalty: number;
  dodgePenalty: number;
  color: string;
}

const FATIGUE_TIERS: FatigueTierInfo[] = [
  { tier: 'Fresh', threshold: 0, hitPenalty: 0, damagePenalty: 0, dodgePenalty: 0, color: 'var(--health-high)' },
  { tier: 'Winded', threshold: 25, hitPenalty: 0.05, damagePenalty: 0.05, dodgePenalty: 0.05, color: 'var(--stamina-mid)' },
  { tier: 'Fatigued', threshold: 50, hitPenalty: 0.10, damagePenalty: 0.10, dodgePenalty: 0.10, color: 'var(--accent-gold)' },
  { tier: 'Exhausted', threshold: 75, hitPenalty: 0.20, damagePenalty: 0.15, dodgePenalty: 0.15, color: 'var(--accent-red-bright)' },
];

const MELEE_ACTIONS = [
  { id: 'bayonet_thrust', name: 'Bayonet Thrust', type: 'attack', staminaCost: 8, fatigueCost: 5, description: 'Standard attack. Reliable damage.' },
  { id: 'aggressive_lunge', name: 'Aggressive Lunge', type: 'attack', staminaCost: 15, fatigueCost: 10, description: 'High damage, leaves you open.' },
  { id: 'butt_strike', name: 'Butt Strike', type: 'attack', staminaCost: 10, fatigueCost: 7, description: 'Stun attempt. Low damage.' },
  { id: 'feint', name: 'Feint', type: 'attack', staminaCost: 6, fatigueCost: 4, description: 'Setup for next attack bonus.' },
  { id: 'guard', name: 'Guard', type: 'defense', staminaCost: 4, fatigueCost: 2, description: 'Defensive stance. Bonus to block.' },
  { id: 'respite', name: 'Respite', type: 'recovery', staminaCost: 0, fatigueCost: -8, description: 'Catch breath. Reduce fatigue.' },
  { id: 'shoot', name: 'Shoot', type: 'attack', staminaCost: 5, fatigueCost: 3, description: 'Fire loaded musket. One shot.' },
  { id: 'reload', name: 'Reload', type: 'utility', staminaCost: 8, fatigueCost: 5, description: 'Reload musket. Takes a round.' },
  { id: 'second_wind', name: 'Second Wind', type: 'recovery', staminaCost: -20, fatigueCost: 0, description: 'Recover stamina. Once per encounter.' },
  { id: 'use_canteen', name: 'Use Canteen', type: 'recovery', staminaCost: -15, fatigueCost: -5, description: 'Drink water. Limited uses.' },
];

/* ------------------------------------------------------------------ */
/*  Stat bar component                                                 */
/* ------------------------------------------------------------------ */

function MeleeBar({ label, value, max = 100, color }: { label: string; value: number; max?: number; color: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="ml-bar-row">
      <span className="ml-bar-label">{label}</span>
      <div className="ml-bar-track">
        <div className="ml-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="ml-bar-val">{typeof value === 'number' && value < 1 ? `${(value * 100).toFixed(1)}%` : value}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

type MLTab = 'encounters' | 'opponents' | 'formulas' | 'actions';
type FilterSource = 'all' | 'Rivoli' | 'Voltri';
type FilterType = 'all' | string;

export function MeleeLabPage() {
  const [tab, setTab] = useState<MLTab>('encounters');
  const [filterSource, setFilterSource] = useState<FilterSource>('all');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [selectedEncounter, setSelectedEncounter] = useState<string | null>(null);
  const [selectedOpponent, setSelectedOpponent] = useState<number | null>(null);

  // Formula calculator state
  const [fStr, setFStr] = useState(40);
  const [fElan, setFElan] = useState(35);
  const [fFatigue, setFFatigue] = useState(0);

  const filteredOpponents = useMemo(() => {
    return OPPONENTS.filter((o) => {
      if (filterSource !== 'all' && o.source !== filterSource) return false;
      if (filterType !== 'all' && o.type !== filterType) return false;
      return true;
    });
  }, [filterSource, filterType]);

  useEffect(() => {
    const selected = selectedOpponent !== null ? OPPONENTS[selectedOpponent] : null;
    if (filteredOpponents.length === 0) {
      if (selectedOpponent !== null) setSelectedOpponent(null);
      return;
    }

    if (!selected || !filteredOpponents.includes(selected)) {
      setSelectedOpponent(OPPONENTS.indexOf(filteredOpponents[0]));
    }
  }, [filteredOpponents, selectedOpponent]);

  const opponentTypes = useMemo(() => [...new Set(OPPONENTS.map((o) => o.type))], []);

  const activeEncounter = ENCOUNTERS.find((e) => e.id === selectedEncounter);
  const activeOpponent = selectedOpponent !== null ? OPPONENTS[selectedOpponent] : null;

  // Fatigue tier for formula
  const currentFatigueTier = useMemo(() => {
    for (let i = FATIGUE_TIERS.length - 1; i >= 0; i--) {
      if (fFatigue >= FATIGUE_TIERS[i].threshold) return FATIGUE_TIERS[i];
    }
    return FATIGUE_TIERS[0];
  }, [fFatigue]);

  return (
    <div className="ml-page">
      <div className="art-lab-toolbar">
        {(['encounters', 'opponents', 'formulas', 'actions'] as MLTab[]).map((t) => (
          <button
            key={t}
            className={`art-lab-filter-btn${tab === t ? ' active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t === 'encounters' ? 'Encounters' : t === 'opponents' ? 'Opponents' : t === 'formulas' ? 'Formulas' : 'Actions'}
          </button>
        ))}
        {(tab === 'opponents') && (
          <>
            <span className="art-lab-toolbar-divider" />
            <span className="art-lab-toolbar-label">Source:</span>
            {(['all', 'Rivoli', 'Voltri'] as FilterSource[]).map((f) => (
              <button
                key={f}
                className={`art-lab-filter-btn${filterSource === f ? ' active' : ''}`}
                onClick={() => setFilterSource(f)}
              >
                {f === 'all' ? 'All' : f}
              </button>
            ))}
            <span className="art-lab-toolbar-divider" />
            <span className="art-lab-toolbar-label">Type:</span>
            <button
              className={`art-lab-filter-btn${filterType === 'all' ? ' active' : ''}`}
              onClick={() => setFilterType('all')}
            >All</button>
            {opponentTypes.map((t) => (
              <button
                key={t}
                className={`art-lab-filter-btn${filterType === t ? ' active' : ''}`}
                onClick={() => setFilterType(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
            <span className="art-lab-count">{filteredOpponents.length} opponents</span>
          </>
        )}
      </div>

      <div className="ml-content">
        {/* Encounters tab */}
        {tab === 'encounters' && (
          <div className="ml-enc-layout">
            <div className="ml-enc-list">
              {ENCOUNTERS.map((enc) => (
                <button
                  key={enc.id}
                  className={`ml-enc-card${selectedEncounter === enc.id ? ' active' : ''}`}
                  onClick={() => setSelectedEncounter(enc.id)}
                >
                  <div className="ml-enc-card-header">
                    <span className="ml-enc-card-battle">{enc.battle}</span>
                    <span className="ml-enc-card-context">{enc.context}</span>
                  </div>
                  <span className="ml-enc-card-id">{enc.id.replace(/_/g, ' ')}</span>
                  <div className="ml-enc-card-stats">
                    <span>{enc.opponentCount} opp</span>
                    <span>{enc.allyCount} ally</span>
                    <span>{enc.maxExchanges} rounds</span>
                    {enc.hasWaveEvents && <span className="ml-enc-card-wave">Waves</span>}
                  </div>
                </button>
              ))}
            </div>
            <div className="ml-enc-detail">
              {activeEncounter ? (
                <>
                  <h3 className="npc-detail-name" style={{ textTransform: 'capitalize' }}>{activeEncounter.id.replace(/_/g, ' ')}</h3>
                  <p className="npc-detail-text">{activeEncounter.description}</p>
                  <div className="ml-enc-params">
                    <div className="lb-param"><span className="lb-param-label">Battle</span><span className="lb-param-val">{activeEncounter.battle}</span></div>
                    <div className="lb-param"><span className="lb-param-label">Context</span><span className="lb-param-val">{activeEncounter.context}</span></div>
                    <div className="lb-param"><span className="lb-param-label">Max Exchanges</span><span className="lb-param-val">{activeEncounter.maxExchanges}</span></div>
                    <div className="lb-param"><span className="lb-param-label">Initial Active</span><span className="lb-param-val">{activeEncounter.initialActive}</span></div>
                    <div className="lb-param"><span className="lb-param-label">Max Active</span><span className="lb-param-val">{activeEncounter.maxActive}</span></div>
                    <div className="lb-param"><span className="lb-param-label">Opponents</span><span className="lb-param-val">{activeEncounter.opponentCount}</span></div>
                    <div className="lb-param"><span className="lb-param-label">Allies</span><span className="lb-param-val">{activeEncounter.allyCount}</span></div>
                  </div>

                  {/* Roster preview */}
                  <h4 className="lb-detail-section-title" style={{ marginTop: '1rem' }}>Opponent Roster</h4>
                  <div className="ml-roster">
                    {OPPONENTS.filter((o) => o.encounter === activeEncounter.id || (activeEncounter.id === 'battery_skirmish' && o.encounter === 'battery')).map((o, i) => (
                      <div key={i} className="ml-roster-item">
                        <span className="ml-roster-name">{o.name}</span>
                        <span className={`ml-roster-type ml-type-${o.type}`}>{o.type}</span>
                        <span className="ml-roster-stat">HP {o.health[0]}–{o.health[1]}</span>
                        <span className="ml-roster-stat">STR {o.strength}</span>
                      </div>
                    ))}
                  </div>

                  {activeEncounter.allyCount > 0 && (
                    <>
                      <h4 className="lb-detail-section-title" style={{ marginTop: '1rem' }}>Ally Roster</h4>
                      <div className="ml-roster">
                        {ALLIES.filter((a) => a.encounter === activeEncounter.id).map((a) => (
                          <div key={a.id} className="ml-roster-item ml-roster-ally">
                            <span className="ml-roster-name">{a.name}</span>
                            <span className="ml-roster-type">{a.personality}</span>
                            <span className="ml-roster-stat">HP {a.health[0]}–{a.health[1]}</span>
                            <span className="ml-roster-stat">STR {a.strength}</span>
                            <span className="ml-roster-stat">ELN {a.elan}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {activeEncounter.hasWaveEvents && (
                    <>
                      <h4 className="lb-detail-section-title" style={{ marginTop: '1rem' }}>Wave Events</h4>
                      <div className="ml-waves">
                        <div className="ml-wave-item"><span className="ml-wave-round">R3</span> Pierre joins (if alive) — "Didn't think I'd let you have all the fun?"</div>
                        <div className="ml-wave-item"><span className="ml-wave-round">R5</span> Jean-Baptiste joins (if alive) — pale-faced, bayonet shaking, but here.</div>
                        <div className="ml-wave-item"><span className="ml-wave-round">R7</span> Max enemies increases to 3 — more Austrians pour in.</div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="si-empty">Select an encounter to view details.</div>
              )}
            </div>
          </div>
        )}

        {/* Opponents tab */}
        {tab === 'opponents' && (
          <div className="ml-opp-layout">
            <div className="ml-opp-grid">
              {filteredOpponents.map((opp, i) => (
                <button
                  key={i}
                  className={`ml-opp-card${selectedOpponent === OPPONENTS.indexOf(opp) ? ' active' : ''}`}
                  onClick={() => setSelectedOpponent(OPPONENTS.indexOf(opp))}
                >
                  <div className="ml-opp-card-header">
                    <span className="ml-opp-card-name">{opp.name}</span>
                    <span className={`ml-opp-card-type ml-type-${opp.type}`}>{opp.type}</span>
                  </div>
                  <div className="ml-opp-card-stats">
                    <span>HP {opp.health[0]}–{opp.health[1]}</span>
                    <span>STM {opp.stamina[0]}–{opp.stamina[1]}</span>
                    <span>STR {opp.strength}</span>
                  </div>
                  <span className="ml-opp-card-source">{opp.source} / {opp.encounter.replace(/_/g, ' ')}</span>
                </button>
              ))}
            </div>
            <div className="ml-opp-detail">
              {activeOpponent ? (
                <>
                  <h3 className="npc-detail-name">{activeOpponent.name}</h3>
                  <span className={`ml-opp-type-badge ml-type-${activeOpponent.type}`}>{activeOpponent.type}</span>
                  <p className="npc-detail-narrative" style={{ marginTop: '0.5rem' }}>{activeOpponent.description}</p>
                  <div className="ml-opp-stats">
                    <MeleeBar label="Health" value={activeOpponent.health[1]} color="var(--health-high)" />
                    <MeleeBar label="Min Health" value={activeOpponent.health[0]} color="var(--health-mid)" />
                    <MeleeBar label="Stamina" value={activeOpponent.stamina[1]} max={300} color="var(--stamina-high)" />
                    <MeleeBar label="Min Stamina" value={activeOpponent.stamina[0]} max={300} color="var(--stamina-mid)" />
                    <MeleeBar label="Strength" value={activeOpponent.strength} color="var(--accent-gold)" />
                  </div>
                  <div className="lb-param" style={{ marginTop: '0.5rem' }}>
                    <span className="lb-param-label">Damage Multiplier</span>
                    <span className="lb-param-val">{calcMeleeDamage(activeOpponent.strength).toFixed(3)}x</span>
                  </div>
                </>
              ) : (
                <div className="si-empty">Select an opponent to view details.</div>
              )}
            </div>
          </div>
        )}

        {/* Formulas tab */}
        {tab === 'formulas' && (
          <div className="ml-formulas">
            <div className="lb-formula-controls">
              <h3 className="cl-section-title">Player Stats</h3>
              <label className="lb-slider">
                <span>Strength</span>
                <input type="range" min={0} max={100} value={fStr} onChange={(e) => setFStr(Number(e.target.value))} />
                <span className="lb-slider-val">{fStr}</span>
              </label>
              <label className="lb-slider">
                <span>Elan</span>
                <input type="range" min={0} max={100} value={fElan} onChange={(e) => setFElan(Number(e.target.value))} />
                <span className="lb-slider-val">{fElan}</span>
              </label>
              <label className="lb-slider">
                <span>Fatigue</span>
                <input type="range" min={0} max={100} value={fFatigue} onChange={(e) => setFFatigue(Number(e.target.value))} />
                <span className="lb-slider-val">{fFatigue}</span>
              </label>
              <div className="ml-fatigue-badge" style={{ color: currentFatigueTier.color }}>
                Tier: {currentFatigueTier.tier}
              </div>
            </div>

            <div className="lb-formula-results">
              <div className="lb-formula-card">
                <h4 className="lb-formula-card-title">Melee Damage</h4>
                <span className="lb-formula-card-formula">0.75 + str/200</span>
                <span className="lb-formula-card-result">{calcMeleeDamage(fStr).toFixed(3)}x</span>
              </div>
              <div className="lb-formula-card">
                <h4 className="lb-formula-card-title">Hit Chance</h4>
                <span className="lb-formula-card-formula">0.5 + elan/200 - fatigue penalty</span>
                <span className="lb-formula-card-result">{((calcHitChance(fElan) - currentFatigueTier.hitPenalty) * 100).toFixed(1)}%</span>
              </div>
              <div className="lb-formula-card">
                <h4 className="lb-formula-card-title">Block Chance</h4>
                <span className="lb-formula-card-formula">0.2 + elan/400</span>
                <span className="lb-formula-card-result">{(calcBlockChance(fElan) * 100).toFixed(1)}%</span>
              </div>
              <div className="lb-formula-card">
                <h4 className="lb-formula-card-title">Dodge Chance</h4>
                <span className="lb-formula-card-formula">0.1 + elan/400 - fatigue penalty</span>
                <span className="lb-formula-card-result">{((calcDodgeChance(fElan) - currentFatigueTier.dodgePenalty) * 100).toFixed(1)}%</span>
              </div>

              {/* Fatigue tier table */}
              <div className="lb-formula-card lb-formula-wide">
                <h4 className="lb-formula-card-title">Fatigue Tiers</h4>
                <table className="mg-payout-table">
                  <thead>
                    <tr>
                      <th>Tier</th>
                      <th>Threshold</th>
                      <th>Hit Penalty</th>
                      <th>Dmg Penalty</th>
                      <th>Dodge Penalty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FATIGUE_TIERS.map((t) => (
                      <tr key={t.tier} style={t.tier === currentFatigueTier.tier ? { background: 'rgba(184, 150, 62, 0.1)' } : {}}>
                        <td style={{ color: t.color, fontWeight: 600 }}>{t.tier}</td>
                        <td>{t.threshold}+</td>
                        <td>{t.hitPenalty > 0 ? `-${(t.hitPenalty * 100).toFixed(0)}%` : '—'}</td>
                        <td>{t.damagePenalty > 0 ? `-${(t.damagePenalty * 100).toFixed(0)}%` : '—'}</td>
                        <td>{t.dodgePenalty > 0 ? `-${(t.dodgePenalty * 100).toFixed(0)}%` : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Actions tab */}
        {tab === 'actions' && (
          <div className="ml-actions">
            <h3 className="cl-section-title">Melee Actions</h3>
            <div className="ml-action-grid">
              {MELEE_ACTIONS.map((action) => (
                <div key={action.id} className={`ml-action-card ml-action-${action.type}`}>
                  <div className="ml-action-header">
                    <span className="ml-action-name">{action.name}</span>
                    <span className={`ml-action-type-badge ml-action-type-${action.type}`}>{action.type}</span>
                  </div>
                  <p className="ml-action-desc">{action.description}</p>
                  <div className="ml-action-costs">
                    <span className={`ml-action-cost${action.staminaCost < 0 ? ' ml-action-gain' : ''}`}>
                      {action.staminaCost > 0 ? `-${action.staminaCost}` : action.staminaCost < 0 ? `+${-action.staminaCost}` : '0'} stamina
                    </span>
                    <span className={`ml-action-cost${action.fatigueCost < 0 ? ' ml-action-gain' : ''}`}>
                      {action.fatigueCost > 0 ? `+${action.fatigueCost}` : action.fatigueCost < 0 ? `${action.fatigueCost}` : '0'} fatigue
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
