import React, { useState, useMemo, useEffect } from 'react';
import { useMeleeLabStore } from '../stores/meleeLabStore';
import { EncounterEditor } from '../components/melee-lab/EncounterEditor';
import { EncounterPreview } from '../components/melee-lab/EncounterPreview';
import { MeleeSandbox } from '../components/melee-lab/MeleeSandbox';
import { useToast } from '../components/line-battle/useToast';

/* ------------------------------------------------------------------ */
/*  Melee Formulas (preserved from original read-only page)            */
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
  tier: string; threshold: number; hitPenalty: number; damagePenalty: number; dodgePenalty: number; color: string;
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
/*  Encounter Library sidebar                                          */
/* ------------------------------------------------------------------ */

function EncounterLibrary({ onRun }: { onRun: (id: string) => void }) {
  const {
    encounters, selectedEncounterId, selectEncounter,
    createEncounter, deleteEncounter, duplicateEncounter,
    importEncounter, exportEncounter, undo, redo, undoStack, redoStack,
  } = useMeleeLabStore();
  const [showImport, setShowImport] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const toast = useToast();

  return (
    <div className="lb-module-library">
      {toast.el}
      <div className="lb-library-header">
        <span className="lb-library-title">Encounters</span>
        <span className="lb-library-count">{encounters.length}</span>
      </div>
      <div className="lb-library-actions">
        <button className="lb-lib-btn" onClick={() => createEncounter()}>+ New</button>
        <button className="lb-lib-btn" onClick={() => setShowImport(!showImport)}>Import</button>
        <button className="lb-lib-btn" disabled={undoStack.length === 0} onClick={undo} title="Undo">&#x21A9;</button>
        <button className="lb-lib-btn" disabled={redoStack.length === 0} onClick={redo} title="Redo">&#x21AA;</button>
      </div>
      {showImport && (
        <div className="lb-import-panel">
          <textarea value={importJson} onChange={(e) => setImportJson(e.target.value)} placeholder="Paste encounter JSON..." />
          <button onClick={() => {
            if (importEncounter(importJson)) {
              setImportJson('');
              setShowImport(false);
              toast.show('Encounter imported');
            } else {
              toast.show('Invalid JSON');
            }
          }}>Import</button>
        </div>
      )}
      <div className="lb-library-list">
        {encounters.map((enc) => (
          <div key={enc.id}
            className={`lb-library-item${selectedEncounterId === enc.id ? ' active' : ''}`}
            onClick={() => selectEncounter(enc.id)}>
            <div className="lb-library-item-name">{enc.name}</div>
            <div className="lb-library-item-meta">
              <span className="lb-library-item-mode">{enc.context}</span>
              <span className="lb-library-item-volleys">{enc.opponents.length}O {enc.allies.length}A</span>
              {enc.tags.slice(0, 2).map((t) => <span key={t} className="lb-library-item-tag">{t}</span>)}
            </div>
            <div className="lb-library-item-actions">
              <button title="Run encounter" className={enc.opponents.length === 0 ? 'lb-btn-disabled' : ''} onClick={(e) => { e.stopPropagation(); if (enc.opponents.length > 0) onRun(enc.id); }}>{'\u25B6'}</button>
              <button title="Duplicate" onClick={(e) => { e.stopPropagation(); duplicateEncounter(enc.id); }}>D</button>
              <button title="Export to clipboard" onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(exportEncounter(enc.id));
                toast.show('Copied to clipboard');
              }}>E</button>
              {pendingDelete === enc.id ? (
                <>
                  <button className="lb-confirm-delete" onClick={(e) => { e.stopPropagation(); deleteEncounter(enc.id); setPendingDelete(null); }}>Yes</button>
                  <button onClick={(e) => { e.stopPropagation(); setPendingDelete(null); }}>No</button>
                </>
              ) : (
                <button title="Delete" onClick={(e) => { e.stopPropagation(); setPendingDelete(enc.id); }}>&times;</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Reference View — Formulas + Actions (preserved)                    */
/* ------------------------------------------------------------------ */

function ReferenceView() {
  const [fStr, setFStr] = useState(40);
  const [fElan, setFElan] = useState(35);
  const [fFatigue, setFFatigue] = useState(0);

  const currentFatigueTier = useMemo(() => {
    for (let i = FATIGUE_TIERS.length - 1; i >= 0; i--) {
      if (fFatigue >= FATIGUE_TIERS[i].threshold) return FATIGUE_TIERS[i];
    }
    return FATIGUE_TIERS[0];
  }, [fFatigue]);

  return (
    <div className="ml-reference">
      {/* Formulas */}
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

          <div className="lb-formula-card lb-formula-wide">
            <h4 className="lb-formula-card-title">Fatigue Tiers</h4>
            <table className="mg-payout-table">
              <thead>
                <tr><th>Tier</th><th>Threshold</th><th>Hit Penalty</th><th>Dmg Penalty</th><th>Dodge Penalty</th></tr>
              </thead>
              <tbody>
                {FATIGUE_TIERS.map((t) => (
                  <tr key={t.tier} style={t.tier === currentFatigueTier.tier ? { background: 'rgba(184, 150, 62, 0.1)' } : {}}>
                    <td style={{ color: t.color, fontWeight: 600 }}>{t.tier}</td>
                    <td>{t.threshold}+</td>
                    <td>{t.hitPenalty > 0 ? `-${(t.hitPenalty * 100).toFixed(0)}%` : '\u2014'}</td>
                    <td>{t.damagePenalty > 0 ? `-${(t.damagePenalty * 100).toFixed(0)}%` : '\u2014'}</td>
                    <td>{t.dodgePenalty > 0 ? `-${(t.dodgePenalty * 100).toFixed(0)}%` : '\u2014'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Actions */}
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
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

type MLView = 'encounters' | 'reference' | 'sandbox';

export function MeleeLabPage() {
  const [view, setView] = useState<MLView>('encounters');
  const [sandboxEncounterId, setSandboxEncounterId] = useState<string | null>(null);
  const { encounters, selectedEncounterId, selectEncounter, loadEncounters } = useMeleeLabStore();

  useEffect(() => {
    loadEncounters();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedEncounter = useMemo(
    () => encounters.find((e) => e.id === selectedEncounterId) ?? null,
    [encounters, selectedEncounterId],
  );

  const sandboxEncounter = useMemo(
    () => encounters.find((e) => e.id === sandboxEncounterId) ?? null,
    [encounters, sandboxEncounterId],
  );

  const handleRunEncounter = (id: string) => {
    const enc = encounters.find((e) => e.id === id);
    if (enc && enc.opponents.length > 0) {
      selectEncounter(id);
      setSandboxEncounterId(id);
      setView('sandbox');
    }
  };

  // Sandbox view takes over the full page
  if (view === 'sandbox' && sandboxEncounter) {
    return (
      <div className="ml-page ml-page-sandbox">
        <MeleeSandbox
          key={sandboxEncounter.id}
          encounter={sandboxEncounter}
          onExit={() => setView('encounters')}
        />
      </div>
    );
  }

  return (
    <div className="ml-page">
      <div className="art-lab-toolbar">
        {(['encounters', 'reference'] as const).map((v) => (
          <button
            key={v}
            className={`art-lab-filter-btn${view === v ? ' active' : ''}`}
            onClick={() => setView(v)}
          >
            {v === 'encounters' ? 'Encounters' : 'Reference'}
          </button>
        ))}
      </div>

      <div className="ml-content">
        {view === 'encounters' && (
          <div className="ml-encounters-view">
            <EncounterLibrary onRun={handleRunEncounter} />
            <div className="ml-editor-main">
              {selectedEncounter ? (
                <div className="ml-editor-split">
                  <EncounterEditor key={selectedEncounter.id} encounter={selectedEncounter} />
                  <EncounterPreview encounter={selectedEncounter} />
                </div>
              ) : (
                <div className="si-empty">
                  {encounters.length === 0
                    ? 'No encounters yet. Click "+ New" to create one.'
                    : 'Select an encounter from the library to edit.'}
                </div>
              )}
            </div>
          </div>
        )}

        {view === 'reference' && <ReferenceView />}
      </div>
    </div>
  );
}
