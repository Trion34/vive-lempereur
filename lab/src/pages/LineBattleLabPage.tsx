import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useLabStore } from '../stores/labStore';
import { useLineCombatStore, createDefaultReturnFire, createDefaultStamina } from '../stores/lineCombatStore';
import type { LabVolleyEntry, LabVolleyDef, LineCombatModule } from '../types/lineCombatTypes';

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
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function gameVolleyToLabEntry(v: VolleyDisplayData): LabVolleyEntry {
  return {
    id: '',
    def: {
      range: v.def.range,
      fireAccuracyBase: v.def.fireAccuracyBase,
      perceptionBase: v.def.perceptionBase,
      enemyReturnFireChance: v.def.enemyReturnFireChance,
      enemyReturnFireDamage: [...v.def.enemyReturnFireDamage],
      enemyLineDamage: v.def.enemyLineDamage,
    },
    narratives: {
      present: v.narratives.present,
      fireOrder: v.narratives.fireOrder,
      endure: v.narratives.endure,
      fireHit: ['Hit. Target down.'],
      fireMiss: ['Miss.'],
    },
    returnFire: {
      frontRankBonus: v.def.frontRankBonus ?? 0.15,
      fatalChance: v.def.fatalChance ?? 0,
    },
    stamina: createDefaultStamina(),
    notes: `Imported from ${v.battle} Volley ${v.index}`,
    eventDescription: '',
  };
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
/*  Volley detail panel (read-only, for Volley Browser tab)            */
/* ------------------------------------------------------------------ */

function VolleyDetail({ volley, onImport, importLabel }: { volley: VolleyDisplayData; onImport?: () => void; importLabel?: string }) {
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

      {onImport && (
        <button className="lb-import-btn" onClick={onImport}>{importLabel ?? 'Import to Module'}</button>
      )}

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

      <div className="lb-detail-section">
        <h4 className="lb-detail-section-title">Combat Formulas</h4>
        <div className="lb-formula-grid">
          <StatBarChart label="Load Success" value={loadSuccess} color="var(--health-high)" />
          <StatBarChart label="Fire Accuracy" value={fireAcc} color="var(--accent-gold)" />
          <StatBarChart label="Return Fire" value={returnFire} color="var(--accent-red-bright)" />
          <StatBarChart label="Fatal Chance" value={d.fatalChance ?? 0} color="var(--accent-red)" />
        </div>
      </div>

      <div className="lb-detail-section">
        <h4 className="lb-detail-section-title">Enemy Parameters</h4>
        <div className="lb-param-grid">
          <div className="lb-param">
            <span className="lb-param-label">Return Fire Chance</span>
            <span className="lb-param-val">{(d.enemyReturnFireChance * 100).toFixed(0)}%</span>
          </div>
          <div className="lb-param">
            <span className="lb-param-label">Return Fire Damage</span>
            <span className="lb-param-val">{d.enemyReturnFireDamage[0]}&ndash;{d.enemyReturnFireDamage[1]}</span>
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
  { type: 'volleys', label: 'Volleys 1\u20132', detail: '120\u219280 paces' },
  { type: 'story_beat', label: 'Wounded Sergeant', detail: '3 choices' },
  { type: 'volleys', label: 'Volleys 3\u20134', detail: '50\u219225 paces' },
  { type: 'story_beat', label: 'Fix Bayonets', detail: '1 choice' },
  { type: 'melee', label: 'Terrain Melee', detail: '4 opponents' },
  { type: 'story_beat', label: 'The Battery', detail: 'Charge/Hold' },
  { type: 'melee', label: 'Battery Skirmish', detail: 'Allies join' },
  { type: 'setup', label: 'Part 2 Setup', detail: 'Fresh enemy' },
  { type: 'volleys', label: 'Volleys 5\u20137', detail: '100\u219240 paces' },
  { type: 'story_beat', label: "Mass\u00e9na's Arrival", detail: '3 choices' },
  { type: 'setup', label: 'Part 3 Setup', detail: 'Gorge phase' },
  { type: 'story_beat', label: 'The Gorge', detail: '1 choice' },
  { type: 'volleys', label: 'Volleys 8\u201311', detail: 'Target selection' },
  { type: 'story_beat', label: 'The Aftermath', detail: '3 choices' },
];

const VOLTRI_SCRIPT: ScriptSegment[] = [
  { type: 'volleys', label: 'Volleys 1\u20132', detail: '150\u2192100 paces' },
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
/*  Number input helper                                                */
/* ------------------------------------------------------------------ */

function NumInput({ label, value, onChange, min = 0, max = 1000, step = 1 }: {
  label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number;
}) {
  return (
    <label className="lb-num-input">
      <span>{label}</span>
      <input type="number" value={value} min={min} max={max} step={step}
        onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}

/* ------------------------------------------------------------------ */
/*  Text input with local state — commits on blur (avoids undo spam)   */
/* ------------------------------------------------------------------ */

function DeferredInput({ value, onCommit, ...props }: {
  value: string;
  onCommit: (v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'onBlur'>) {
  const [local, setLocal] = useState(value);
  const localRef = React.useRef(local);
  const valueRef = React.useRef(value);
  localRef.current = local;
  valueRef.current = value;

  useEffect(() => { setLocal(value); }, [value]);

  // Flush pending edits on unmount
  useEffect(() => {
    return () => {
      if (localRef.current !== valueRef.current) onCommit(localRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <input {...props} type="text" value={local}
      onChange={(e) => setLocal(e.target.value)}
      onBlur={() => { if (local !== value) onCommit(local); }} />
  );
}

function DeferredTextarea({ value, onCommit, ...props }: {
  value: string;
  onCommit: (v: string) => void;
} & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange' | 'onBlur'>) {
  const [local, setLocal] = useState(value);
  const localRef = React.useRef(local);
  const valueRef = React.useRef(value);
  localRef.current = local;
  valueRef.current = value;

  useEffect(() => { setLocal(value); }, [value]);

  // Flush pending edits on unmount
  useEffect(() => {
    return () => {
      if (localRef.current !== valueRef.current) onCommit(localRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <textarea {...props} value={local}
      onChange={(e) => setLocal(e.target.value)}
      onBlur={() => { if (local !== value) onCommit(local); }} />
  );
}

/* ------------------------------------------------------------------ */
/*  Toast feedback helper                                              */
/* ------------------------------------------------------------------ */

function useToast() {
  const [msg, setMsg] = useState<string | null>(null);
  const show = useCallback((text: string) => {
    setMsg(text);
    setTimeout(() => setMsg(null), 1500);
  }, []);
  const el = msg ? <div className="lb-toast">{msg}</div> : null;
  return { show, el };
}

/* ------------------------------------------------------------------ */
/*  Volley Editor (Phase 2) — full field editing                       */
/* ------------------------------------------------------------------ */

function VolleyEditor({ moduleId, volley }: { moduleId: string; volley: LabVolleyEntry }) {
  const { updateVolley } = useLineCombatStore();

  const updateDef = useCallback((patch: Partial<LabVolleyDef>) => {
    updateVolley(moduleId, volley.id, { def: { ...volley.def, ...patch } });
  }, [moduleId, volley.id, volley.def, updateVolley]);

  const updateNarrative = useCallback((key: string, value: string | string[]) => {
    updateVolley(moduleId, volley.id, { narratives: { ...volley.narratives, [key]: value } });
  }, [moduleId, volley.id, volley.narratives, updateVolley]);

  return (
    <div className="lb-volley-editor">
      <h4 className="lb-detail-section-title">Combat Parameters</h4>
      <div className="lb-editor-grid">
        <NumInput label="Range (paces)" value={volley.def.range} onChange={(v) => updateDef({ range: v })} min={10} max={300} />
        <NumInput label="Accuracy" value={volley.def.fireAccuracyBase} onChange={(v) => updateDef({ fireAccuracyBase: v })} min={0} max={1} step={0.01} />
        <NumInput label="Perception" value={volley.def.perceptionBase} onChange={(v) => updateDef({ perceptionBase: v })} min={0} max={1} step={0.01} />
        <NumInput label="Return Fire %" value={volley.def.enemyReturnFireChance} onChange={(v) => updateDef({ enemyReturnFireChance: v })} min={0} max={1} step={0.01} />
        <NumInput label="Ret Dmg Min" value={volley.def.enemyReturnFireDamage[0]} onChange={(v) => updateDef({ enemyReturnFireDamage: [v, volley.def.enemyReturnFireDamage[1]] })} />
        <NumInput label="Ret Dmg Max" value={volley.def.enemyReturnFireDamage[1]} onChange={(v) => updateDef({ enemyReturnFireDamage: [volley.def.enemyReturnFireDamage[0], v] })} />
        <NumInput label="Line Damage" value={volley.def.enemyLineDamage} onChange={(v) => updateDef({ enemyLineDamage: v })} />
      </div>

      <h4 className="lb-detail-section-title">Return Fire</h4>
      <div className="lb-editor-grid">
        <NumInput label="Front Rank Bonus" value={volley.returnFire.frontRankBonus} onChange={(v) => updateVolley(moduleId, volley.id, { returnFire: { ...volley.returnFire, frontRankBonus: v } })} min={0} max={1} step={0.01} />
        <NumInput label="Fatal Chance" value={volley.returnFire.fatalChance} onChange={(v) => updateVolley(moduleId, volley.id, { returnFire: { ...volley.returnFire, fatalChance: v } })} min={0} max={1} step={0.01} />
      </div>

      <h4 className="lb-detail-section-title">Stamina</h4>
      <div className="lb-editor-grid">
        <NumInput label="Cost" value={volley.stamina.cost} onChange={(v) => updateVolley(moduleId, volley.id, { stamina: { ...volley.stamina, cost: v } })} />
        <NumInput label="Recovery" value={volley.stamina.recovery} onChange={(v) => updateVolley(moduleId, volley.id, { stamina: { ...volley.stamina, recovery: v } })} />
      </div>

      <h4 className="lb-detail-section-title">Narratives</h4>
      <div className="lb-editor-narratives">
        <label className="lb-editor-field">
          <span className="lb-narrative-step">PRESENT</span>
          <DeferredInput value={volley.narratives.present} onCommit={(v) => updateNarrative('present', v)} />
        </label>
        <label className="lb-editor-field">
          <span className="lb-narrative-step">FIRE</span>
          <DeferredInput value={volley.narratives.fireOrder} onCommit={(v) => updateNarrative('fireOrder', v)} />
        </label>
        <label className="lb-editor-field">
          <span className="lb-narrative-step">ENDURE</span>
          <DeferredInput value={volley.narratives.endure} onCommit={(v) => updateNarrative('endure', v)} />
        </label>
        <label className="lb-editor-field">
          <span className="lb-narrative-step">HIT</span>
          <div className="lb-array-editor">
            {volley.narratives.fireHit.map((txt, i) => (
              <div key={i} className="lb-array-row">
                <DeferredInput value={txt} onCommit={(v) => {
                  const arr = [...volley.narratives.fireHit];
                  arr[i] = v;
                  updateNarrative('fireHit', arr);
                }} />
                {volley.narratives.fireHit.length > 1 && (
                  <button className="lb-array-remove" onClick={() => {
                    updateNarrative('fireHit', volley.narratives.fireHit.filter((_, j) => j !== i));
                  }}>&times;</button>
                )}
              </div>
            ))}
            <button className="lb-array-add" onClick={() => updateNarrative('fireHit', [...volley.narratives.fireHit, ''])}>+ Add</button>
          </div>
        </label>
        <label className="lb-editor-field">
          <span className="lb-narrative-step">MISS</span>
          <div className="lb-array-editor">
            {volley.narratives.fireMiss.map((txt, i) => (
              <div key={i} className="lb-array-row">
                <DeferredInput value={txt} onCommit={(v) => {
                  const arr = [...volley.narratives.fireMiss];
                  arr[i] = v;
                  updateNarrative('fireMiss', arr);
                }} />
                {volley.narratives.fireMiss.length > 1 && (
                  <button className="lb-array-remove" onClick={() => {
                    updateNarrative('fireMiss', volley.narratives.fireMiss.filter((_, j) => j !== i));
                  }}>&times;</button>
                )}
              </div>
            ))}
            <button className="lb-array-add" onClick={() => updateNarrative('fireMiss', [...volley.narratives.fireMiss, ''])}>+ Add</button>
          </div>
        </label>
      </div>

      <h4 className="lb-detail-section-title">Event Intent</h4>
      <DeferredTextarea className="lb-editor-textarea" value={volley.eventDescription} placeholder="Describe what should happen during this volley (for Claude to implement as code)..."
        onCommit={(v) => updateVolley(moduleId, volley.id, { eventDescription: v })} />

      <h4 className="lb-detail-section-title">Designer Notes</h4>
      <DeferredTextarea className="lb-editor-textarea lb-editor-textarea-sm" value={volley.notes} placeholder="Internal notes..."
        onCommit={(v) => updateVolley(moduleId, volley.id, { notes: v })} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Module Editor (Phase 1 + Phase 2)                                  */
/* ------------------------------------------------------------------ */

function ModuleEditor({ module }: { module: LineCombatModule }) {
  const {
    updateModule, selectedVolleyId, selectVolley,
    addVolley, removeVolley, reorderVolley, duplicateVolley,
  } = useLineCombatStore();
  const [tagInput, setTagInput] = useState('');

  const activeVolley = useMemo(
    () => module.volleys.find((v) => v.id === selectedVolleyId) ?? null,
    [module.volleys, selectedVolleyId],
  );

  return (
    <div className="lb-module-editor">
      {/* Module metadata */}
      <div className="lb-module-meta">
        <label className="lb-editor-field">
          <span>Name</span>
          <DeferredInput value={module.name} onCommit={(v) => updateModule(module.id, { name: v })} />
        </label>
        <label className="lb-editor-field">
          <span>Description</span>
          <DeferredInput value={module.description} onCommit={(v) => updateModule(module.id, { description: v })} />
        </label>
        <div className="lb-editor-row">
          <label className="lb-editor-field lb-editor-field-sm">
            <span>Mode</span>
            <select value={module.mode} onChange={(e) => updateModule(module.id, { mode: e.target.value as 'standard' | 'gorge' })}>
              <option value="standard">Standard</option>
              <option value="gorge">Gorge</option>
            </select>
          </label>
          <div className="lb-editor-field lb-editor-field-sm">
            <span>Tags</span>
            <div className="lb-tags">
              {module.tags.map((tag) => (
                <span key={tag} className="lb-tag">
                  {tag}
                  <button onClick={() => updateModule(module.id, { tags: module.tags.filter((t) => t !== tag) })}>&times;</button>
                </span>
              ))}
              <input type="text" className="lb-tag-input" placeholder="+ tag" value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && tagInput.trim()) {
                    if (!module.tags.includes(tagInput.trim())) {
                      updateModule(module.id, { tags: [...module.tags, tagInput.trim()] });
                    }
                    setTagInput('');
                  }
                }} />
            </div>
          </div>
        </div>
      </div>

      {/* State hints */}
      <details className="lb-hints-section">
        <summary className="lb-detail-section-title">State Hints</summary>
        <div className="lb-editor-grid">
          <NumInput label="Enemy Str Min" value={module.stateHints.expectedEnemyStrength[0]}
            onChange={(v) => updateModule(module.id, { stateHints: { ...module.stateHints, expectedEnemyStrength: [v, module.stateHints.expectedEnemyStrength[1]] } })} />
          <NumInput label="Enemy Str Max" value={module.stateHints.expectedEnemyStrength[1]}
            onChange={(v) => updateModule(module.id, { stateHints: { ...module.stateHints, expectedEnemyStrength: [module.stateHints.expectedEnemyStrength[0], v] } })} />
          <NumInput label="Health Min" value={module.stateHints.expectedPlayerHealth[0]}
            onChange={(v) => updateModule(module.id, { stateHints: { ...module.stateHints, expectedPlayerHealth: [v, module.stateHints.expectedPlayerHealth[1]] } })} />
          <NumInput label="Health Max" value={module.stateHints.expectedPlayerHealth[1]}
            onChange={(v) => updateModule(module.id, { stateHints: { ...module.stateHints, expectedPlayerHealth: [module.stateHints.expectedPlayerHealth[0], v] } })} />
        </div>
        <div className="lb-editor-row">
          <label className="lb-editor-field lb-editor-field-sm">
            <span>NCO Present</span>
            <select value={module.stateHints.ncoPresent === null ? 'null' : String(module.stateHints.ncoPresent)}
              onChange={(e) => updateModule(module.id, { stateHints: { ...module.stateHints, ncoPresent: e.target.value === 'null' ? null : e.target.value === 'true' } })}>
              <option value="null">Don't care</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </label>
          <label className="lb-editor-field lb-editor-field-sm">
            <span>Artillery</span>
            <select value={module.stateHints.artilleryActive === null ? 'null' : String(module.stateHints.artilleryActive)}
              onChange={(e) => updateModule(module.id, { stateHints: { ...module.stateHints, artilleryActive: e.target.value === 'null' ? null : e.target.value === 'true' } })}>
              <option value="null">Don't care</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </label>
        </div>
        <label className="lb-editor-field">
          <span>Entry Notes</span>
          <DeferredInput value={module.stateHints.entryNotes}
            onCommit={(v) => updateModule(module.id, { stateHints: { ...module.stateHints, entryNotes: v } })} />
        </label>
        <label className="lb-editor-field">
          <span>Exit Notes</span>
          <DeferredInput value={module.stateHints.exitNotes}
            onCommit={(v) => updateModule(module.id, { stateHints: { ...module.stateHints, exitNotes: v } })} />
        </label>
      </details>

      {/* Volley list + editor */}
      <div className="lb-detail-section-title">Volleys ({module.volleys.length})</div>
      <div className="lb-volley-editor-layout">
        <div className="lb-volley-list">
          {module.volleys.map((v, i) => (
            <div key={v.id}
              className={`lb-volley-list-item${selectedVolleyId === v.id ? ' active' : ''}`}
              onClick={() => selectVolley(v.id)}>
              <span className="lb-volley-list-num">{i + 1}.</span>
              <span className="lb-volley-list-range">{v.def.range}p</span>
              <span className="lb-volley-list-narr">{v.narratives.present.slice(0, 30)}</span>
              <span className="lb-volley-list-actions">
                <button title="Move up" disabled={i === 0} onClick={(e) => { e.stopPropagation(); reorderVolley(module.id, v.id, 'up'); }}>&uarr;</button>
                <button title="Move down" disabled={i === module.volleys.length - 1} onClick={(e) => { e.stopPropagation(); reorderVolley(module.id, v.id, 'down'); }}>&darr;</button>
                <button title="Duplicate" onClick={(e) => { e.stopPropagation(); duplicateVolley(module.id, v.id); }}>D</button>
                <button title="Delete" onClick={(e) => { e.stopPropagation(); removeVolley(module.id, v.id); }}>&times;</button>
              </span>
            </div>
          ))}
          <button className="lb-add-volley-btn" onClick={() => addVolley(module.id, selectedVolleyId ?? undefined)}>
            + Add Volley
          </button>
        </div>

        <div className="lb-volley-detail-panel">
          {activeVolley ? (
            <VolleyEditor key={activeVolley.id} moduleId={module.id} volley={activeVolley} />
          ) : (
            <div className="si-empty">
              {module.volleys.length === 0
                ? 'No volleys yet. Click "+ Add Volley" to create one.'
                : 'Select a volley to edit.'}
            </div>
          )}
        </div>
      </div>

      {/* Module notes */}
      <div className="lb-detail-section-title">Module Notes</div>
      <DeferredTextarea className="lb-editor-textarea" value={module.notes} placeholder="Design notes for this module..."
        onCommit={(v) => updateModule(module.id, { notes: v })} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Module Library sidebar                                             */
/* ------------------------------------------------------------------ */

function ModuleLibrary() {
  const {
    modules, selectedModuleId, selectModule,
    createModule, deleteModule, duplicateModule,
    importModule, exportModule, undo, redo, undoStack, redoStack,
  } = useLineCombatStore();
  const [showImport, setShowImport] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const toast = useToast();

  return (
    <div className="lb-module-library">
      {toast.el}
      <div className="lb-library-header">
        <span className="lb-library-title">Modules</span>
        <span className="lb-library-count">{modules.length}</span>
      </div>
      <div className="lb-library-actions">
        <button className="lb-lib-btn" onClick={() => createModule()}>+ New</button>
        <button className="lb-lib-btn" onClick={() => setShowImport(!showImport)}>Import</button>
        <button className="lb-lib-btn" disabled={undoStack.length === 0} onClick={undo} title="Undo">&#x21A9;</button>
        <button className="lb-lib-btn" disabled={redoStack.length === 0} onClick={redo} title="Redo">&#x21AA;</button>
      </div>
      {showImport && (
        <div className="lb-import-panel">
          <textarea value={importJson} onChange={(e) => setImportJson(e.target.value)} placeholder="Paste module JSON..." />
          <button onClick={() => {
            if (importModule(importJson)) {
              setImportJson('');
              setShowImport(false);
              toast.show('Module imported');
            } else {
              toast.show('Invalid JSON');
            }
          }}>Import</button>
        </div>
      )}
      <div className="lb-library-list">
        {modules.map((m) => (
          <div key={m.id}
            className={`lb-library-item${selectedModuleId === m.id ? ' active' : ''}`}
            onClick={() => selectModule(m.id)}>
            <div className="lb-library-item-name">{m.name}</div>
            <div className="lb-library-item-meta">
              <span className="lb-library-item-mode">{m.mode}</span>
              <span className="lb-library-item-volleys">{m.volleys.length}V</span>
              {m.tags.slice(0, 2).map((t) => <span key={t} className="lb-library-item-tag">{t}</span>)}
            </div>
            <div className="lb-library-item-actions">
              <button title="Duplicate" onClick={(e) => { e.stopPropagation(); duplicateModule(m.id); }}>D</button>
              <button title="Export to clipboard" onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(exportModule(m.id));
                toast.show('Copied to clipboard');
              }}>E</button>
              {pendingDelete === m.id ? (
                <>
                  <button className="lb-confirm-delete" onClick={(e) => { e.stopPropagation(); deleteModule(m.id); setPendingDelete(null); }}>Yes</button>
                  <button onClick={(e) => { e.stopPropagation(); setPendingDelete(null); }}>No</button>
                </>
              ) : (
                <button title="Delete" onClick={(e) => { e.stopPropagation(); setPendingDelete(m.id); }}>&times;</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

type LBTab = 'modules' | 'volleys' | 'formulas' | 'script';
type FilterBattle = 'all' | 'Rivoli' | 'Voltri';
type FilterPart = 'all' | 1 | 2 | 3;

function volleyKey(volley: VolleyDisplayData): string {
  return `${volley.battle}:${volley.part}:${volley.index}`;
}

export function LineBattleLabPage() {
  const [tab, setTab] = useState<LBTab>('modules');
  const [filterBattle, setFilterBattle] = useState<FilterBattle>('all');
  const [filterPart, setFilterPart] = useState<FilterPart>('all');
  const [selectedVolleyKey, setSelectedVolleyKey] = useState<string | null>(null);
  const [scriptBattle, setScriptBattle] = useState<'Rivoli' | 'Voltri'>('Rivoli');
  const { launchConfig, clearLaunchConfig } = useLabStore();

  const { modules, selectedModuleId, loadModules, selectModule, importVolleyFromGame } = useLineCombatStore();

  // Load modules on mount
  useEffect(() => {
    loadModules();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle cross-launch from campaign editor
  useEffect(() => {
    if (launchConfig?.sourceNodeId) {
      const label = String(launchConfig.sourceNodeId);
      if (label.includes('rivoli')) setFilterBattle('Rivoli');
      else if (label.includes('voltri')) setFilterBattle('Voltri');

      if (typeof launchConfig.parts === 'number') {
        const p = launchConfig.parts as number;
        if (p >= 1 && p <= 3) setFilterPart(p as 1 | 2 | 3);
      }

      // Cross-launch from campaign editor with moduleId
      if (typeof launchConfig.moduleId === 'string') {
        setTab('modules');
        selectModule(launchConfig.moduleId);
      }

      clearLaunchConfig();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedModule = useMemo(
    () => modules.find((m) => m.id === selectedModuleId) ?? null,
    [modules, selectedModuleId],
  );

  const filteredVolleys = useMemo(() => {
    return ALL_VOLLEYS.filter((v) => {
      if (filterBattle !== 'all' && v.battle !== filterBattle) return false;
      if (filterPart !== 'all' && v.part !== filterPart) return false;
      return true;
    });
  }, [filterBattle, filterPart]);

  useEffect(() => {
    if (filteredVolleys.length === 0) {
      if (selectedVolleyKey !== null) setSelectedVolleyKey(null);
      return;
    }
    if (!selectedVolleyKey || !filteredVolleys.some((volley) => volleyKey(volley) === selectedVolleyKey)) {
      setSelectedVolleyKey(volleyKey(filteredVolleys[0]));
    }
  }, [filteredVolleys, selectedVolleyKey]);

  const activeVolley = useMemo(
    () => filteredVolleys.find((volley) => volleyKey(volley) === selectedVolleyKey) ?? null,
    [filteredVolleys, selectedVolleyKey],
  );

  const browserToast = useToast();

  const handleImportToModule = useCallback((v: VolleyDisplayData) => {
    if (!selectedModuleId) return;
    importVolleyFromGame(selectedModuleId, gameVolleyToLabEntry(v));
    browserToast.show('Volley imported');
  }, [selectedModuleId, importVolleyFromGame, browserToast]);

  const importButtonLabel = useMemo(() => {
    if (!selectedModule) return undefined;
    const short = selectedModule.name.length > 20
      ? selectedModule.name.slice(0, 18) + '\u2026'
      : selectedModule.name;
    return `Import to ${short}`;
  }, [selectedModule]);

  // Formula calculator state
  const [fMusketry, setFMusketry] = useState(35);
  const [fValor, setFValor] = useState(40);
  const [fEndurance, setFEndurance] = useState(40);

  const tabLabels: Record<LBTab, string> = {
    modules: 'Modules',
    volleys: 'Volley Browser',
    formulas: 'Formula Calculator',
    script: 'Battle Script',
  };

  return (
    <div className="lb-page">
      <div className="art-lab-toolbar">
        {(['modules', 'volleys', 'formulas', 'script'] as LBTab[]).map((t) => (
          <button
            key={t}
            className={`art-lab-filter-btn${tab === t ? ' active' : ''}`}
            onClick={() => setTab(t)}
          >
            {tabLabels[t]}
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
        {/* ========== MODULES TAB ========== */}
        {tab === 'modules' && (
          <div className="lb-modules-layout">
            <ModuleLibrary />
            <div className="lb-module-editor-wrap">
              {selectedModule ? (
                <ModuleEditor key={selectedModule.id} module={selectedModule} />
              ) : (
                <div className="si-empty">Select a module or create a new one.</div>
              )}
            </div>
          </div>
        )}

        {/* ========== VOLLEY BROWSER TAB ========== */}
        {tab === 'volleys' && (
          <div className="lb-volley-layout">
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
                      className={`lb-volley-row${selectedVolleyKey === volleyKey(v) ? ' active' : ''}`}
                      onClick={() => setSelectedVolleyKey(volleyKey(v))}
                    >
                      <td>{v.index}</td>
                      <td>{v.battle}</td>
                      <td>{v.part}</td>
                      <td>{v.range}p</td>
                      <td>{(v.def.fireAccuracyBase * 100).toFixed(0)}%</td>
                      <td>{(v.def.enemyReturnFireChance * 100).toFixed(0)}%</td>
                      <td>{v.def.enemyReturnFireDamage[0]}&ndash;{v.def.enemyReturnFireDamage[1]}</td>
                      <td>{v.def.enemyLineDamage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="lb-detail-panel">
              {activeVolley ? (
                <>
                  {browserToast.el}
                  <VolleyDetail
                    volley={activeVolley}
                    onImport={selectedModuleId ? () => handleImportToModule(activeVolley) : undefined}
                    importLabel={importButtonLabel}
                  />
                </>
              ) : (
                <div className="si-empty">Select a volley to view details and formulas.</div>
              )}
            </div>
          </div>
        )}

        {/* ========== FORMULA CALCULATOR TAB ========== */}
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

        {/* ========== BATTLE SCRIPT TAB ========== */}
        {tab === 'script' && <ScriptVisualizer battle={scriptBattle} />}
      </div>
    </div>
  );
}
