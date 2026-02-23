import React, { useCallback } from 'react';
import type { BattleState, MeleeState } from '../../types';
import {
  MeleeStance,
  MeleeActionId,
  BodyPart,
  MoraleThreshold,
} from '../../types';
import { getMeleeActions, calcHitChance } from '../../core/melee';
import { useUiStore } from '../../stores/uiStore';

// --- Hotkey display map ---

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

// --- Props ---

interface MeleeActionsProps {
  battleState: BattleState;
  meleeState: MeleeState;
  onAction: (action: MeleeActionId, bodyPart?: BodyPart) => void;
  onFlee: () => void;
}

export function MeleeActions({ battleState, meleeState, onAction, onFlee }: MeleeActionsProps) {
  const {
    meleeStance,
    meleeSelectedAction,
    meleeShowingInventory,
    meleeHotkeysVisible,
    setMeleeStance,
    setMeleeSelectedAction,
    setMeleeShowingInventory,
  } = useUiStore();

  const ms = meleeState;
  const player = battleState.player;

  // --- Body part picker ---
  if (ms.selectingTarget && meleeSelectedAction) {
    return (
      <BodyPartPicker
        battleState={battleState}
        meleeState={ms}
        selectedAction={meleeSelectedAction}
        hotkeysVisible={meleeHotkeysVisible}
        stance={meleeStance}
        onSelect={(bp) => {
          onAction(meleeSelectedAction, bp);
        }}
        onBack={() => {
          setMeleeSelectedAction(null);
          ms.selectingTarget = false;
        }}
      />
    );
  }

  // --- Inventory sub-panel ---
  if (meleeShowingInventory) {
    return (
      <InventoryPanel
        canteenLeft={3 - player.canteenUses}
        hotkeysVisible={meleeHotkeysVisible}
        onUseCanteen={() => {
          setMeleeShowingInventory(false);
          onAction(MeleeActionId.UseCanteen);
        }}
        onBack={() => setMeleeShowingInventory(false)}
      />
    );
  }

  // --- Main action grid ---
  return (
    <div className="hud-actions" id="arena-actions">
      <StanceBar
        currentStance={meleeStance}
        hotkeysVisible={meleeHotkeysVisible}
        onSetStance={setMeleeStance}
      />
      <ActionGrid
        battleState={battleState}
        meleeState={ms}
        hotkeysVisible={meleeHotkeysVisible}
        onAction={onAction}
        onOpenBodyPart={(actionId) => {
          setMeleeSelectedAction(actionId);
          ms.selectingTarget = true;
        }}
        onOpenInventory={() => setMeleeShowingInventory(true)}
        onFlee={onFlee}
      />
    </div>
  );
}

// --- StanceBar ---

function StanceBar({
  currentStance,
  hotkeysVisible,
  onSetStance,
}: {
  currentStance: MeleeStance;
  hotkeysVisible: boolean;
  onSetStance: (s: MeleeStance) => void;
}) {
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
          {hotkeysVisible && <kbd className="hotkey-badge">{keys[i]}</kbd>}
        </button>
      ))}
    </div>
  );
}

// --- ActionGrid ---

function ActionGrid({
  battleState,
  meleeState,
  hotkeysVisible,
  onAction,
  onOpenBodyPart,
  onOpenInventory,
  onFlee,
}: {
  battleState: BattleState;
  meleeState: MeleeState;
  hotkeysVisible: boolean;
  onAction: (action: MeleeActionId, bodyPart?: BodyPart) => void;
  onOpenBodyPart: (action: MeleeActionId) => void;
  onOpenInventory: () => void;
  onFlee: () => void;
}) {
  const actions = getMeleeActions(battleState);
  const byId = (id: MeleeActionId) => actions.find((a) => a.id === id);

  // Determine which actions need the body-part picker
  const needsTarget = (id: MeleeActionId) =>
    id === MeleeActionId.BayonetThrust ||
    id === MeleeActionId.AggressiveLunge ||
    id === MeleeActionId.Shoot;

  function makeBtn(action: { id: MeleeActionId; label: string; available: boolean } | undefined, style: string) {
    if (!action) return null;
    const hotkey = HOTKEY_MAP[action.id];
    const isImmediate = !needsTarget(action.id);

    return (
      <button
        key={action.id}
        className={`action-btn melee-flat ${style}`}
        style={!action.available ? { opacity: 0.4, pointerEvents: 'none' } : undefined}
        onClick={() => {
          if (isImmediate) {
            onAction(action.id);
          } else {
            onOpenBodyPart(action.id);
          }
        }}
      >
        <span className="action-name">{action.label}</span>
        {hotkey && hotkeysVisible && <kbd className="hotkey-badge">{hotkey}</kbd>}
      </button>
    );
  }

  // Row 1: Attacks
  const attackBtns = [
    makeBtn(byId(MeleeActionId.Shoot), 'melee-attack'),
    makeBtn(byId(MeleeActionId.BayonetThrust), 'melee-attack'),
    makeBtn(byId(MeleeActionId.AggressiveLunge), 'melee-attack'),
    makeBtn(byId(MeleeActionId.ButtStrike), 'melee-attack'),
    makeBtn(byId(MeleeActionId.Feint), 'melee-attack'),
  ].filter(Boolean);

  // Row 2: Defense & Recovery
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

      {/* Inventory row */}
      <div className="action-row">
        <button className="action-btn melee-flat melee-item" onClick={onOpenInventory}>
          <span className="action-name">Inventory</span>
          {hotkeysVisible && <kbd className="hotkey-badge">I</kbd>}
        </button>
      </div>

      {/* Flee button at Breaking morale */}
      {battleState.player.moraleThreshold === MoraleThreshold.Breaking && (
        <button className="action-btn fumble-action" onClick={onFlee}>
          <span className="action-name">Flee</span>
          {hotkeysVisible && <kbd className="hotkey-badge">X</kbd>}
          <span className="action-desc">You can't take any more. Drop everything and run.</span>
        </button>
      )}
    </div>
  );
}

// --- BodyPartPicker ---

function BodyPartPicker({
  battleState,
  meleeState,
  selectedAction,
  hotkeysVisible,
  stance,
  onSelect,
  onBack,
}: {
  battleState: BattleState;
  meleeState: MeleeState;
  selectedAction: MeleeActionId;
  hotkeysVisible: boolean;
  stance: MeleeStance;
  onSelect: (bp: BodyPart) => void;
  onBack: () => void;
}) {
  const pl = battleState.player;

  const hitFor = useCallback((bp: BodyPart) => {
    const skill = selectedAction === MeleeActionId.Shoot ? pl.musketry : pl.elan;
    const pct = calcHitChance(
      skill,
      pl.morale,
      pl.maxMorale,
      stance,
      selectedAction,
      bp,
      meleeState.playerRiposte,
      pl.fatigue,
      pl.maxFatigue,
    );
    return Math.round(pct * 100);
  }, [pl, stance, selectedAction, meleeState.playerRiposte]);

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
          {hotkeysVisible && <kbd className="hotkey-badge">Esc</kbd>}
        </button>

        <div className="body-target-grid">
          {parts.map((p, i) => {
            const pct = hitFor(p.id);
            return (
              <button key={p.id} className="body-target-btn" onClick={() => onSelect(p.id)}>
                <span className="body-target-label">{p.label}</span>
                {hotkeysVisible && <kbd className="hotkey-badge">{bpKeys[i]}</kbd>}
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

// --- InventoryPanel ---

function InventoryPanel({
  canteenLeft,
  hotkeysVisible,
  onUseCanteen,
  onBack,
}: {
  canteenLeft: number;
  hotkeysVisible: boolean;
  onUseCanteen: () => void;
  onBack: () => void;
}) {
  return (
    <div className="hud-actions" id="arena-actions">
      <div id="arena-actions-grid">
        <button className="action-btn action-back" onClick={onBack}>
          <span className="action-name">{'\u2190'} Back</span>
          {hotkeysVisible && <kbd className="hotkey-badge">Esc</kbd>}
        </button>

        <div className="melee-step-label">Items</div>

        <button
          className="action-btn melee-flat melee-item"
          style={canteenLeft <= 0 ? { opacity: 0.4, pointerEvents: 'none' } : undefined}
          onClick={onUseCanteen}
        >
          <span className="action-name">Drink Canteen ({canteenLeft} left)</span>
          {hotkeysVisible && <kbd className="hotkey-badge">1</kbd>}
          <span className="action-desc">Restore health. Opponent gets a free attack.</span>
        </button>
      </div>
    </div>
  );
}
