import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useLabStore } from '../stores/labStore';

/* ------------------------------------------------------------------ */
/*  Volley Definition Data (mirrors battle volley configs)             */
/* ------------------------------------------------------------------ */

interface VolleyDef {
  range: number;
  fireAccuracyBase: number;
  perceptionBase: number;
  enemyReturnFireChance: number;
  enemyReturnFireDamage: [number, number];
  enemyLineDamage: number;
  frontRankBonus?: number;
  fatalChance?: number;
}

interface VolleyDisplayData {
  index: number;
  battle: string;
  part: number;
  range: number;
  def: VolleyDef;
  narratives: { fireOrder: string; present: string; endure: string };
}

const RIVOLI_VOLLEYS: VolleyDisplayData[] = [
  { index: 1, battle: 'Rivoli', part: 1, range: 120, def: { range: 120, fireAccuracyBase: 0.20, perceptionBase: 0.15, enemyReturnFireChance: 0.15, enemyReturnFireDamage: [8, 14], enemyLineDamage: 6, frontRankBonus: 0.15, fatalChance: 0 }, narratives: { fireOrder: '"Feu!"', present: 'Present arms. 120 paces.', endure: 'Return fire.' } },
  { index: 2, battle: 'Rivoli', part: 1, range: 80, def: { range: 80, fireAccuracyBase: 0.35, perceptionBase: 0.30, enemyReturnFireChance: 0.25, enemyReturnFireDamage: [10, 18], enemyLineDamage: 10, frontRankBonus: 0.15, fatalChance: 0 }, narratives: { fireOrder: '"FIRE!"', present: 'Present. 80 paces.', endure: 'Return fire.' } },
  { index: 3, battle: 'Rivoli', part: 1, range: 50, def: { range: 50, fireAccuracyBase: 0.50, perceptionBase: 0.70, enemyReturnFireChance: 0.40, enemyReturnFireDamage: [14, 24], enemyLineDamage: 15, frontRankBonus: 0.15, fatalChance: 0.12 }, narratives: { fireOrder: '"FIRE!"', present: 'Present. 50 paces.', endure: 'Return fire. Men fall.' } },
  { index: 4, battle: 'Rivoli', part: 1, range: 25, def: { range: 25, fireAccuracyBase: 0.70, perceptionBase: 0.95, enemyReturnFireChance: 0.50, enemyReturnFireDamage: [16, 28], enemyLineDamage: 20, frontRankBonus: 0.15, fatalChance: 0.12 }, narratives: { fireOrder: '"Tirez!"', present: 'Present. 25 paces. Last volley.', endure: 'Fix bayonets.' } },
  { index: 5, battle: 'Rivoli', part: 2, range: 100, def: { range: 100, fireAccuracyBase: 0.30, perceptionBase: 0.20, enemyReturnFireChance: 0.20, enemyReturnFireDamage: [8, 14], enemyLineDamage: 8 }, narratives: { fireOrder: '"Feu!"', present: 'Present. 100 paces. Fresh column.', endure: 'Return fire. Fresh muskets.' } },
  { index: 6, battle: 'Rivoli', part: 2, range: 60, def: { range: 60, fireAccuracyBase: 0.45, perceptionBase: 0.40, enemyReturnFireChance: 0.30, enemyReturnFireDamage: [10, 20], enemyLineDamage: 12 }, narratives: { fireOrder: '"FIRE!"', present: 'Present. 60 paces. Right flank open.', endure: 'Return fire. Surrounded.' } },
  { index: 7, battle: 'Rivoli', part: 2, range: 40, def: { range: 40, fireAccuracyBase: 0.60, perceptionBase: 0.80, enemyReturnFireChance: 0.45, enemyReturnFireDamage: [14, 26], enemyLineDamage: 16 }, narratives: { fireOrder: '"TIREZ!"', present: 'Present. 40 paces. Last volley.', endure: 'Bonaparte on the ridge.' } },
  { index: 8, battle: 'Rivoli', part: 3, range: 200, def: { range: 200, fireAccuracyBase: 0.50, perceptionBase: 0.90, enemyReturnFireChance: 0.02, enemyReturnFireDamage: [3, 6], enemyLineDamage: 10 }, narratives: { fireOrder: '"Fire at will!"', present: 'Fire at will. Gorge below.', endure: 'Scattered return fire.' } },
  { index: 9, battle: 'Rivoli', part: 3, range: 200, def: { range: 200, fireAccuracyBase: 0.50, perceptionBase: 0.90, enemyReturnFireChance: 0.03, enemyReturnFireDamage: [3, 6], enemyLineDamage: 10 }, narratives: { fireOrder: '"Again!"', present: 'Reload. More targets below.', endure: 'Screams from below.' } },
  { index: 10, battle: 'Rivoli', part: 3, range: 200, def: { range: 200, fireAccuracyBase: 0.50, perceptionBase: 0.90, enemyReturnFireChance: 0.05, enemyReturnFireDamage: [3, 6], enemyLineDamage: 8 }, narratives: { fireOrder: '"Fire!"', present: 'Column breaking. Wagon visible.', endure: 'Wounded call for help.' } },
  { index: 11, battle: 'Rivoli', part: 3, range: 200, def: { range: 200, fireAccuracyBase: 0.50, perceptionBase: 0.90, enemyReturnFireChance: 0.05, enemyReturnFireDamage: [3, 6], enemyLineDamage: 8 }, narratives: { fireOrder: '"Final volley!"', present: 'Last column. Wagon exposed.', endure: "Silence. It's over." } },
];

const VOLTRI_VOLLEYS: VolleyDisplayData[] = [
  { index: 1, battle: 'Voltri', part: 1, range: 150, def: { range: 150, fireAccuracyBase: 0.15, perceptionBase: 0.10, enemyReturnFireChance: 0.10, enemyReturnFireDamage: [5, 10], enemyLineDamage: 4, frontRankBonus: 0.10, fatalChance: 0 }, narratives: { fireOrder: '"Feu!" Sergeant Morin\'s voice.', present: 'Present arms. 150 paces.', endure: 'Return fire from the olive groves.' } },
  { index: 2, battle: 'Voltri', part: 1, range: 100, def: { range: 100, fireAccuracyBase: 0.25, perceptionBase: 0.20, enemyReturnFireChance: 0.18, enemyReturnFireDamage: [7, 13], enemyLineDamage: 6, frontRankBonus: 0.10, fatalChance: 0 }, narratives: { fireOrder: '"FIRE!" The line erupts.', present: 'Present. 100 paces.', endure: 'Return fire. Ball hits nearby.' } },
];

const ALL_VOLLEYS = [...RIVOLI_VOLLEYS, ...VOLTRI_VOLLEYS];

/* ------------------------------------------------------------------ */
/*  Formula calculators                                                */
/* ------------------------------------------------------------------ */

function calcLoadSuccess(musketry: number): number {
  return Math.min(0.95, 0.5 + musketry / 200);
}

function calcFireAccuracy(base: number, musketry: number): number {
  return Math.min(0.95, base + musketry / 400);
}

function calcReturnFireChance(base: number, frontRank: boolean, bonus: number): number {
  return Math.min(0.95, base + (frontRank ? bonus : 0));
}

function calcGraduatedValor(valor: number): { great: number; pass: number; fail: number; critical: number } {
  const mod = 1 - valor / 200;
  const great = Math.min(0.3, valor / 200);
  const critical = Math.max(0.05, 0.2 * mod);
  const pass = Math.min(0.7, 0.4 + valor / 300);
  const fail = Math.max(0, 1 - great - pass - critical);
  return { great, pass, fail, critical };
}

/* ------------------------------------------------------------------ */
/*  Bar chart component                                                */
/* ------------------------------------------------------------------ */

function StatBarChart({ label, value, max = 1, color, format = 'pct' }: { label: string; value: number; max?: number; color: string; format?: 'pct' | 'num' }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="lb-bar-row">
      <span className="lb-bar-label">{label}</span>
      <div className="lb-bar-track">
        <div className="lb-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="lb-bar-val">{format === 'pct' ? `${(value * 100).toFixed(1)}%` : value.toFixed(1)}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Volley detail panel                                                */
/* ------------------------------------------------------------------ */

function VolleyDetail({ volley }: { volley: VolleyDisplayData }) {
  const [musketry, setMusketry] = useState(35);
  const [valor, setValor] = useState(40);
  const [frontRank, setFrontRank] = useState(false);

  const d = volley.def;
  const loadSuccess = calcLoadSuccess(musketry);
  const fireAcc = calcFireAccuracy(d.fireAccuracyBase, musketry);
  const returnFire = calcReturnFireChance(d.enemyReturnFireChance, frontRank, d.frontRankBonus ?? 0);
  const valorDist = calcGraduatedValor(valor);

  return (
    <div className="lb-detail">
      <div className="lb-detail-header">
        <span className="lb-detail-battle">{volley.battle}</span>
        <span className="lb-detail-title">Volley {volley.index} — {volley.range} paces</span>
        <span className="lb-detail-part">Part {volley.part}</span>
      </div>

      {/* Narratives */}
      <div className="lb-detail-section">
        <h4 className="lb-detail-section-title">Drill Narratives</h4>
        <div className="lb-narrative-grid">
          <div className="lb-narrative-item">
            <span className="lb-narrative-step">PRESENT</span>
            <span className="lb-narrative-text">{volley.narratives.present}</span>
          </div>
          <div className="lb-narrative-item">
            <span className="lb-narrative-step">FIRE</span>
            <span className="lb-narrative-text">{volley.narratives.fireOrder}</span>
          </div>
          <div className="lb-narrative-item">
            <span className="lb-narrative-step">ENDURE</span>
            <span className="lb-narrative-text">{volley.narratives.endure}</span>
          </div>
        </div>
      </div>

      {/* Stat sliders */}
      <div className="lb-detail-section">
        <h4 className="lb-detail-section-title">Player Stats</h4>
        <div className="lb-slider-group">
          <label className="lb-slider">
            <span>Musketry</span>
            <input type="range" min={0} max={100} value={musketry} onChange={(e) => setMusketry(Number(e.target.value))} />
            <span className="lb-slider-val">{musketry}</span>
          </label>
          <label className="lb-slider">
            <span>Valor</span>
            <input type="range" min={0} max={100} value={valor} onChange={(e) => setValor(Number(e.target.value))} />
            <span className="lb-slider-val">{valor}</span>
          </label>
          <label className="lb-slider-check">
            <input type="checkbox" checked={frontRank} onChange={(e) => setFrontRank(e.target.checked)} />
            <span>Front Rank</span>
          </label>
        </div>
      </div>

      {/* Combat formulas */}
      <div className="lb-detail-section">
        <h4 className="lb-detail-section-title">Combat Formulas</h4>
        <div className="lb-formula-grid">
          <StatBarChart label="Load Success" value={loadSuccess} color="var(--health-high)" />
          <StatBarChart label="Fire Accuracy" value={fireAcc} color="var(--accent-gold)" />
          <StatBarChart label="Return Fire" value={returnFire} color="var(--accent-red-bright)" />
          <StatBarChart label="Fatal Chance" value={d.fatalChance ?? 0} color="var(--accent-red)" />
        </div>
      </div>

      {/* Enemy parameters */}
      <div className="lb-detail-section">
        <h4 className="lb-detail-section-title">Enemy Parameters</h4>
        <div className="lb-param-grid">
          <div className="lb-param">
            <span className="lb-param-label">Return Fire Chance</span>
            <span className="lb-param-val">{(d.enemyReturnFireChance * 100).toFixed(0)}%</span>
          </div>
          <div className="lb-param">
            <span className="lb-param-label">Return Fire Damage</span>
            <span className="lb-param-val">{d.enemyReturnFireDamage[0]}–{d.enemyReturnFireDamage[1]}</span>
          </div>
          <div className="lb-param">
            <span className="lb-param-label">Line Damage</span>
            <span className="lb-param-val">{d.enemyLineDamage}</span>
          </div>
          <div className="lb-param">
            <span className="lb-param-label">Perception Base</span>
            <span className="lb-param-val">{(d.perceptionBase * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>

      {/* Valor distribution */}
      <div className="lb-detail-section">
        <h4 className="lb-detail-section-title">Graduated Valor Distribution</h4>
        <div className="lb-formula-grid">
          <StatBarChart label="Great Success" value={valorDist.great} color="var(--accent-gold)" />
          <StatBarChart label="Pass" value={valorDist.pass} color="var(--health-high)" />
          <StatBarChart label="Fail" value={valorDist.fail} color="var(--accent-red-bright)" />
          <StatBarChart label="Critical Fail" value={valorDist.critical} color="var(--accent-red)" />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Battle script visualizer                                           */
/* ------------------------------------------------------------------ */

interface ScriptSegment {
  type: string;
  label: string;
  detail: string;
}

const RIVOLI_SCRIPT: ScriptSegment[] = [
  { type: 'volleys', label: 'Volleys 1–2', detail: '120→80 paces' },
  { type: 'story_beat', label: 'Wounded Sergeant', detail: '3 choices' },
  { type: 'volleys', label: 'Volleys 3–4', detail: '50→25 paces' },
  { type: 'story_beat', label: 'Fix Bayonets', detail: '1 choice' },
  { type: 'melee', label: 'Terrain Melee', detail: '4 opponents' },
  { type: 'story_beat', label: 'The Battery', detail: 'Charge/Hold' },
  { type: 'melee', label: 'Battery Skirmish', detail: 'Allies join' },
  { type: 'setup', label: 'Part 2 Setup', detail: 'Fresh enemy' },
  { type: 'volleys', label: 'Volleys 5–7', detail: '100→40 paces' },
  { type: 'story_beat', label: "Masséna's Arrival", detail: '3 choices' },
  { type: 'setup', label: 'Part 3 Setup', detail: 'Gorge phase' },
  { type: 'story_beat', label: 'The Gorge', detail: '1 choice' },
  { type: 'volleys', label: 'Volleys 8–11', detail: 'Target selection' },
  { type: 'story_beat', label: 'The Aftermath', detail: '3 choices' },
];

const VOLTRI_SCRIPT: ScriptSegment[] = [
  { type: 'volleys', label: 'Volleys 1–2', detail: '150→100 paces' },
  { type: 'story_beat', label: 'Fix Bayonets', detail: '1 choice' },
  { type: 'melee', label: 'Pegli Hills', detail: '3 opponents' },
  { type: 'story_beat', label: 'Line Breaks', detail: '2 choices' },
  { type: 'story_beat', label: 'Coastal Road', detail: 'Branching' },
  { type: 'story_beat', label: 'Dawn at Savona', detail: '2 choices' },
];

function ScriptVisualizer({ battle }: { battle: 'Rivoli' | 'Voltri' }) {
  const script = battle === 'Rivoli' ? RIVOLI_SCRIPT : VOLTRI_SCRIPT;
  return (
    <div className="lb-script">
      <h3 className="cl-section-title">{battle} Battle Script</h3>
      <div className="lb-script-flow">
        {script.map((seg, i) => (
          <React.Fragment key={i}>
            <div className={`lb-script-node lb-script-${seg.type}`}>
              <span className="lb-script-type">{seg.type.replace('_', ' ')}</span>
              <span className="lb-script-label">{seg.label}</span>
              <span className="lb-script-detail">{seg.detail}</span>
            </div>
            {i < script.length - 1 && <div className="lb-script-arrow">&darr;</div>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

type LBTab = 'volleys' | 'formulas' | 'script';
type FilterBattle = 'all' | 'Rivoli' | 'Voltri';
type FilterPart = 'all' | 1 | 2 | 3;

export function LineBattleLabPage() {
  const [tab, setTab] = useState<LBTab>('volleys');
  const [filterBattle, setFilterBattle] = useState<FilterBattle>('all');
  const [filterPart, setFilterPart] = useState<FilterPart>('all');
  const [selectedVolley, setSelectedVolley] = useState<number | null>(null);
  const [scriptBattle, setScriptBattle] = useState<'Rivoli' | 'Voltri'>('Rivoli');
  const { launchConfig, clearLaunchConfig } = useLabStore();

  useEffect(() => {
    if (launchConfig?.sourceNodeId) {
      const label = String(launchConfig.sourceNodeId);
      if (label.includes('rivoli')) setFilterBattle('Rivoli');
      else if (label.includes('voltri')) setFilterBattle('Voltri');

      // Apply volleys and parts filters from cross-launch
      if (typeof launchConfig.parts === 'number') {
        const p = launchConfig.parts as number;
        if (p >= 1 && p <= 3) setFilterPart(p as 1 | 2 | 3);
      }
      clearLaunchConfig();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredVolleys = useMemo(() => {
    return ALL_VOLLEYS.filter((v) => {
      if (filterBattle !== 'all' && v.battle !== filterBattle) return false;
      if (filterPart !== 'all' && v.part !== filterPart) return false;
      return true;
    });
  }, [filterBattle, filterPart]);

  const activeVolley = useMemo(
    () => ALL_VOLLEYS.find((v) => v.index === selectedVolley && (filterBattle === 'all' || v.battle === filterBattle)) ?? null,
    [selectedVolley, filterBattle],
  );

  // Formula calculator state
  const [fMusketry, setFMusketry] = useState(35);
  const [fValor, setFValor] = useState(40);
  const [fEndurance, setFEndurance] = useState(40);

  return (
    <div className="lb-page">
      <div className="art-lab-toolbar">
        {(['volleys', 'formulas', 'script'] as LBTab[]).map((t) => (
          <button
            key={t}
            className={`art-lab-filter-btn${tab === t ? ' active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t === 'volleys' ? 'Volley Browser' : t === 'formulas' ? 'Formula Calculator' : 'Battle Script'}
          </button>
        ))}
        {tab === 'volleys' && (
          <>
            <span className="art-lab-toolbar-divider" />
            <span className="art-lab-toolbar-label">Battle:</span>
            {(['all', 'Rivoli', 'Voltri'] as FilterBattle[]).map((f) => (
              <button
                key={f}
                className={`art-lab-filter-btn${filterBattle === f ? ' active' : ''}`}
                onClick={() => setFilterBattle(f)}
              >
                {f === 'all' ? 'All' : f}
              </button>
            ))}
            <span className="art-lab-toolbar-divider" />
            <span className="art-lab-toolbar-label">Part:</span>
            {(['all', 1, 2, 3] as FilterPart[]).map((p) => (
              <button
                key={String(p)}
                className={`art-lab-filter-btn${filterPart === p ? ' active' : ''}`}
                onClick={() => setFilterPart(p)}
              >
                {p === 'all' ? 'All' : `Part ${p}`}
              </button>
            ))}
            <span className="art-lab-count">{filteredVolleys.length} volleys</span>
          </>
        )}
        {tab === 'script' && (
          <>
            <span className="art-lab-toolbar-divider" />
            {(['Rivoli', 'Voltri'] as const).map((b) => (
              <button
                key={b}
                className={`art-lab-filter-btn${scriptBattle === b ? ' active' : ''}`}
                onClick={() => setScriptBattle(b)}
              >
                {b}
              </button>
            ))}
          </>
        )}
      </div>

      <div className="lb-content">
        {tab === 'volleys' && (
          <div className="lb-volley-layout">
            {/* Volley table */}
            <div className="lb-volley-table-wrap">
              <table className="lb-volley-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Battle</th>
                    <th>Part</th>
                    <th>Range</th>
                    <th>Accuracy</th>
                    <th>Return Fire</th>
                    <th>Dmg</th>
                    <th>Line Dmg</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVolleys.map((v) => (
                    <tr
                      key={`${v.battle}-${v.index}`}
                      className={`lb-volley-row${selectedVolley === v.index && (filterBattle === 'all' || v.battle === filterBattle) ? ' active' : ''}`}
                      onClick={() => setSelectedVolley(v.index)}
                    >
                      <td>{v.index}</td>
                      <td>{v.battle}</td>
                      <td>{v.part}</td>
                      <td>{v.range}p</td>
                      <td>{(v.def.fireAccuracyBase * 100).toFixed(0)}%</td>
                      <td>{(v.def.enemyReturnFireChance * 100).toFixed(0)}%</td>
                      <td>{v.def.enemyReturnFireDamage[0]}–{v.def.enemyReturnFireDamage[1]}</td>
                      <td>{v.def.enemyLineDamage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Detail panel */}
            <div className="lb-detail-panel">
              {activeVolley ? (
                <VolleyDetail volley={activeVolley} />
              ) : (
                <div className="si-empty">Select a volley to view details and formulas.</div>
              )}
            </div>
          </div>
        )}

        {tab === 'formulas' && (
          <div className="lb-formulas">
            <div className="lb-formula-controls">
              <h3 className="cl-section-title">Player Stat Inputs</h3>
              <label className="lb-slider">
                <span>Musketry</span>
                <input type="range" min={0} max={100} value={fMusketry} onChange={(e) => setFMusketry(Number(e.target.value))} />
                <span className="lb-slider-val">{fMusketry}</span>
              </label>
              <label className="lb-slider">
                <span>Valor</span>
                <input type="range" min={0} max={100} value={fValor} onChange={(e) => setFValor(Number(e.target.value))} />
                <span className="lb-slider-val">{fValor}</span>
              </label>
              <label className="lb-slider">
                <span>Endurance</span>
                <input type="range" min={0} max={100} value={fEndurance} onChange={(e) => setFEndurance(Number(e.target.value))} />
                <span className="lb-slider-val">{fEndurance}</span>
              </label>
            </div>

            <div className="lb-formula-results">
              <div className="lb-formula-card">
                <h4 className="lb-formula-card-title">Load Success</h4>
                <span className="lb-formula-card-formula">0.5 + musketry/200</span>
                <span className="lb-formula-card-result">{(calcLoadSuccess(fMusketry) * 100).toFixed(1)}%</span>
              </div>
              <div className="lb-formula-card">
                <h4 className="lb-formula-card-title">Stamina Pool</h4>
                <span className="lb-formula-card-formula">30 + 1.5 &times; endurance</span>
                <span className="lb-formula-card-result">{(30 + 1.5 * fEndurance).toFixed(0)}</span>
              </div>
              <div className="lb-formula-card">
                <h4 className="lb-formula-card-title">Valor Modifier</h4>
                <span className="lb-formula-card-formula">1 - valor/200</span>
                <span className="lb-formula-card-result">{(1 - fValor / 200).toFixed(3)}</span>
              </div>

              <div className="lb-formula-card lb-formula-wide">
                <h4 className="lb-formula-card-title">Graduated Valor Distribution</h4>
                {(() => {
                  const d = calcGraduatedValor(fValor);
                  return (
                    <div className="lb-formula-grid">
                      <StatBarChart label="Great" value={d.great} color="var(--accent-gold)" />
                      <StatBarChart label="Pass" value={d.pass} color="var(--health-high)" />
                      <StatBarChart label="Fail" value={d.fail} color="var(--accent-red-bright)" />
                      <StatBarChart label="Critical" value={d.critical} color="var(--accent-red)" />
                    </div>
                  );
                })()}
              </div>

              <div className="lb-formula-card lb-formula-wide">
                <h4 className="lb-formula-card-title">Fire Accuracy by Range</h4>
                <div className="lb-formula-grid">
                  {[200, 150, 120, 100, 80, 60, 50, 40, 25].map((range) => {
                    const base = range >= 150 ? 0.15 : range >= 100 ? 0.25 : range >= 80 ? 0.35 : range >= 60 ? 0.45 : range >= 50 ? 0.50 : range >= 40 ? 0.60 : 0.70;
                    return <StatBarChart key={range} label={`${range}p`} value={calcFireAccuracy(base, fMusketry)} color="var(--accent-gold)" />;
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'script' && <ScriptVisualizer battle={scriptBattle} />}
      </div>
    </div>
  );
}
