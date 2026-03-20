/* ------------------------------------------------------------------ */
/*  SandboxMeleeActions — store-free clone of game's MeleeActions      */
/*  Fully controlled: all state managed by parent MeleeSandbox.        */
/* ------------------------------------------------------------------ */

import React, { useCallback } from 'react';
import type { BattleState, MeleeState } from '@game/types';
import {
  MeleeStance,
  MeleeActionId,
  BodyPart,
  MoraleThreshold,
} from '@game/types';
import { getMeleeActions, calcHitChance } from '@game/core/melee';

/* ------------------------------------------------------------------ */
/*  Hotkey display map                                                 */
/* ------------------------------------------------------------------ */

const HOTKEY_MAP: Record<string, string> = {
  [MeleeActionId.BayonetThrust]: 'Q',
  [MeleeActionId.AggressiveLunge]: 'W',
  [MeleeActionId.ButtStrike]: 'E',
  [MeleeActionId.Feint]: 'R',
  [MeleeActionId.Shoot]: 'T',
  [MeleeActionId.Guard]: 'A',
  [MeleeActionId.Respite]: 'S',
  [MeleeActionId.SecondWind]: 'D',
  [MeleeActionId.Reload]: 'F',
  [MeleeActionId.UseCanteen]: '1',
};

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface SandboxMeleeActionsProps {
  battleState: BattleState;
  meleeState: MeleeState;
  stance: MeleeStance;
  selectedAction: MeleeActionId | null;
  showingInventory: boolean;
  onAction: (action: MeleeActionId, bodyPart?: BodyPart) => void;
  onFlee: () => void;
  onSetStance: (s: MeleeStance) => void;
  onSetSelectedAction: (a: MeleeActionId | null) => void;
  onSetShowingInventory: (v: boolean) => void;
}

export function SandboxMeleeActions({
  battleState, meleeState, stance, selectedAction, showingInventory,
  onAction, onFlee, onSetStance, onSetSelectedAction, onSetShowingInventory,
}: SandboxMeleeActionsProps) {
  const ms = meleeState;

  // Body part picker — driven by selectedAction state, not meleeState mutation
  if (selectedAction) {
    return (
      <BodyPartPicker
        battleState={battleState}
        meleeState={ms}
        selectedAction={selectedAction}
        stance={stance}
        onSelect={(bp) => {
          onAction(selectedAction, bp);
        }}
        onBack={() => {
          onSetSelectedAction(null);
        }}
      />
    );
  }

  // Inventory sub-panel
  if (showingInventory) {
    return (
      <InventoryPanel
        canteenLeft={3 - battleState.player.canteenUses}
        onUseCanteen={() => {
          onSetShowingInventory(false);
          onAction(MeleeActionId.UseCanteen);
        }}
        onBack={() => onSetShowingInventory(false)}
      />
    );
  }

  return (
    <div className="hud-actions" id="arena-actions">
      <StanceBar currentStance={stance} onSetStance={onSetStance} />
      <ActionGrid
        battleState={battleState}
        stance={stance}
        onAction={onAction}
        onOpenBodyPart={(actionId) => {
          onSetSelectedAction(actionId);
        }}
        onOpenInventory={() => onSetShowingInventory(true)}
        onFlee={onFlee}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  StanceBar                                                          */
/* ------------------------------------------------------------------ */

function StanceBar({
  currentStance, onSetStance,
}: { currentStance: MeleeStance; onSetStance: (s: MeleeStance) => void }) {
  const stances: { id: MeleeStance; label: string; cls: string }[] = [
    { id: MeleeStance.Aggressive, label: 'Aggressive', cls: 'aggressive' },
    { id: MeleeStance.Balanced, label: 'Balanced', cls: 'balanced' },
    { id: MeleeStance.Defensive, label: 'Defensive', cls: 'defensive' },
  ];
  const keys = ['1', '2', '3'];

  return (
    <div className="stance-toggle-bar">
      {stances.map((s, i) => (
        <button
          key={s.id}
          className={`stance-toggle-btn ${s.cls}${currentStance === s.id ? ' active' : ''}`}
          onClick={() => onSetStance(s.id)}
        >
          {s.label}
          <kbd className="hotkey-badge">{keys[i]}</kbd>
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ActionGrid                                                         */
/* ------------------------------------------------------------------ */

function ActionGrid({
  battleState, stance, onAction, onOpenBodyPart, onOpenInventory, onFlee,
}: {
  battleState: BattleState;
  stance: MeleeStance;
  onAction: (action: MeleeActionId, bodyPart?: BodyPart) => void;
  onOpenBodyPart: (action: MeleeActionId) => void;
  onOpenInventory: () => void;
  onFlee: () => void;
}) {
  const actions = getMeleeActions(battleState, stance);
  const byId = (id: MeleeActionId) => actions.find((a) => a.id === id);

  const needsTarget = (id: MeleeActionId) =>
    id === MeleeActionId.BayonetThrust ||
    id === MeleeActionId.AggressiveLunge ||
    id === MeleeActionId.Shoot;

  function makeBtn(action: { id: MeleeActionId; label: string; available: boolean; staminaCost: number; freeStrike: boolean } | undefined, style: string) {
    if (!action) return null;
    const hotkey = HOTKEY_MAP[action.id];
    const isImmediate = !needsTarget(action.id);

    return (
      <button
        key={action.id}
        className={`action-btn melee-flat ${style}`}
        style={!action.available ? { opacity: 0.4, pointerEvents: 'none' } : undefined}
        onClick={() => {
          if (isImmediate) onAction(action.id);
          else onOpenBodyPart(action.id);
        }}
      >
        <span className="action-name">{action.label}</span>
        {action.freeStrike
          ? <span className="action-cost-badge free">FREE</span>
          : <span className={`action-cost-badge${action.staminaCost < 0 ? ' recovery' : ''}`}>
              {action.staminaCost < 0 ? `+${-action.staminaCost}` : action.staminaCost} ST
            </span>
        }
        {hotkey && <kbd className="hotkey-badge">{hotkey}</kbd>}
      </button>
    );
  }

  const attackBtns = [
    makeBtn(byId(MeleeActionId.Shoot), 'melee-attack'),
    makeBtn(byId(MeleeActionId.BayonetThrust), 'melee-attack'),
    makeBtn(byId(MeleeActionId.AggressiveLunge), 'melee-attack'),
    makeBtn(byId(MeleeActionId.ButtStrike), 'melee-attack'),
    makeBtn(byId(MeleeActionId.Feint), 'melee-attack'),
  ].filter(Boolean);

  const defBtns = [
    makeBtn(byId(MeleeActionId.Guard), 'melee-defense'),
    makeBtn(byId(MeleeActionId.Respite), 'melee-utility'),
    makeBtn(byId(MeleeActionId.SecondWind), 'melee-utility'),
    makeBtn(byId(MeleeActionId.Reload), 'melee-utility'),
  ].filter(Boolean);

  return (
    <div id="arena-actions-grid">
      {attackBtns.length > 0 && <div className="action-row">{attackBtns}</div>}
      {defBtns.length > 0 && <div className="action-row">{defBtns}</div>}
      <div className="action-row">
        <button className="action-btn melee-flat melee-item" onClick={onOpenInventory}>
          <span className="action-name">Inventory</span>
          <kbd className="hotkey-badge">I</kbd>
        </button>
      </div>
      {battleState.player.moraleThreshold === MoraleThreshold.Breaking && (
        <button className="action-btn fumble-action" onClick={onFlee}>
          <span className="action-name">Flee</span>
          <kbd className="hotkey-badge">X</kbd>
          <span className="action-desc">You can't take any more. Drop everything and run.</span>
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  BodyPartPicker                                                     */
/* ------------------------------------------------------------------ */

function BodyPartPicker({
  battleState, meleeState, selectedAction, stance, onSelect, onBack,
}: {
  battleState: BattleState;
  meleeState: MeleeState;
  selectedAction: MeleeActionId;
  stance: MeleeStance;
  onSelect: (bp: BodyPart) => void;
  onBack: () => void;
}) {
  const pl = battleState.player;

  const hitFor = useCallback((bp: BodyPart) => {
    const skill = selectedAction === MeleeActionId.Shoot ? pl.musketry : pl.elan;
    const pct = calcHitChance(
      skill, pl.morale, pl.maxMorale, stance, selectedAction,
      bp, meleeState.playerRiposte, pl.fatigue, pl.maxFatigue,
      { momentum: meleeState.playerMomentum ?? 0 },
    );
    return Math.round(pct * 100);
  }, [pl, stance, selectedAction, meleeState.playerRiposte, meleeState.playerMomentum]);

  const parts: { id: BodyPart; label: string; effect: string }[] = [
    { id: BodyPart.Head, label: 'Head', effect: 'Stun + kill chance' },
    { id: BodyPart.Torso, label: 'Torso', effect: '' },
    { id: BodyPart.Arms, label: 'Arms', effect: 'Arm injury' },
    { id: BodyPart.Legs, label: 'Legs', effect: 'Slows opponent' },
  ];
  const bpKeys = ['1', '2', '3', '4'];

  return (
    <div className="hud-actions" id="arena-actions">
      <div id="arena-actions-grid">
        <button className="action-btn action-back" onClick={onBack}>
          <span className="action-name">{'\u2190'} Back</span>
          <kbd className="hotkey-badge">Esc</kbd>
        </button>
        <div className="body-target-grid">
          {parts.map((p, i) => {
            const pct = hitFor(p.id);
            return (
              <button key={p.id} className="body-target-btn" onClick={() => onSelect(p.id)}>
                <span className="body-target-label">{p.label}</span>
                <kbd className="hotkey-badge">{bpKeys[i]}</kbd>
                <span className="body-target-hit">{pct}%</span>
                {p.effect && <span className="body-target-effect">{p.effect}</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  InventoryPanel                                                     */
/* ------------------------------------------------------------------ */

function InventoryPanel({
  canteenLeft, onUseCanteen, onBack,
}: { canteenLeft: number; onUseCanteen: () => void; onBack: () => void }) {
  return (
    <div className="hud-actions" id="arena-actions">
      <div id="arena-actions-grid">
        <button className="action-btn action-back" onClick={onBack}>
          <span className="action-name">{'\u2190'} Back</span>
          <kbd className="hotkey-badge">Esc</kbd>
        </button>
        <div className="melee-step-label">Items</div>
        <button
          className="action-btn melee-flat melee-item"
          style={canteenLeft <= 0 ? { opacity: 0.4, pointerEvents: 'none' } : undefined}
          onClick={onUseCanteen}
        >
          <span className="action-name">Drink Canteen ({canteenLeft} left)</span>
          <kbd className="hotkey-badge">1</kbd>
          <span className="action-desc">Restore health. Opponent gets a free attack.</span>
        </button>
      </div>
    </div>
  );
}
