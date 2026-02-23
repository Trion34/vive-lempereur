import React from 'react';
import type { PlayerCharacter, Player } from '../../types';

interface InventoryPanelProps {
  player: PlayerCharacter;
  battlePlayer: Player | null;
  visible: boolean;
  onClose: () => void;
}

function conditionColor(pct: number): string {
  if (pct >= 75) return 'var(--health-high)';
  if (pct >= 40) return 'var(--morale-mid)';
  return 'var(--morale-crit)';
}

function ConditionBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="inventory-condition">
      <span className="inventory-condition-label">{label}</span>
      <div className="inventory-condition-track">
        <span
          className="inventory-condition-fill"
          style={{ width: `${value}%`, background: conditionColor(value) }}
        />
      </div>
    </div>
  );
}

interface InventoryItemProps {
  icon: string;
  name: string;
  desc: string;
  condition?: { label: string; value: number };
  status?: string;
}

function InventoryItem({ icon, name, desc, condition, status }: InventoryItemProps) {
  return (
    <div className="inventory-item">
      <span className="inventory-icon">{icon}</span>
      <div className="inventory-details">
        <div className="inventory-name">{name}</div>
        <div className="inventory-desc">{desc}</div>
        {condition && <ConditionBar label={condition.label} value={condition.value} />}
        {status && <div className="inventory-status">{status}</div>}
      </div>
    </div>
  );
}

export function InventoryPanel({ player, battlePlayer, visible, onClose }: InventoryPanelProps) {
  if (!visible) return null;

  const inBattle = !!battlePlayer;

  const musketStatus = inBattle
    ? battlePlayer.musketLoaded
      ? '\u25cf Loaded'
      : '\u25cb Empty'
    : undefined;

  const cartridgeStatus = inBattle ? '~40 remaining' : undefined;

  const canteenLeft = inBattle ? 3 - battlePlayer.canteenUses : 3;
  const canteenStatus = inBattle
    ? `${canteenLeft} drink${canteenLeft !== 1 ? 's' : ''} left`
    : undefined;

  return (
    <div
      className="inventory-overlay"
      id="inventory-overlay"
      style={{ display: 'flex' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="inventory-panel">
        <button className="overlay-close" id="btn-inventory-close" onClick={onClose}>
          &times;
        </button>
        <div className="inventory-content" id="inventory-content">
          <InventoryItem
            icon={'\ud83d\udd2b'}
            name="Charleville M1777"
            desc=".69 calibre smoothbore musket"
            condition={{ label: 'Condition', value: player.equipment.musketCondition }}
            status={musketStatus}
          />
          <InventoryItem
            icon={'\ud83d\udde1\ufe0f'}
            name="Socket Bayonet"
            desc="17-inch triangular blade"
          />
          <InventoryItem
            icon={'\ud83c\udf92'}
            name="Cartridge Pouch"
            desc="Paper cartridges with ball &amp; powder"
            status={cartridgeStatus}
          />
          <InventoryItem
            icon={'\ud83e\uded7'}
            name="Canteen"
            desc="Tin water flask"
            status={canteenStatus}
          />
          <InventoryItem
            icon={'\ud83c\udf3d'}
            name="Uniform"
            desc="14th Demi-brigade, blue coat &amp; white facings"
            condition={{ label: 'Condition', value: player.equipment.uniformCondition }}
          />
          <InventoryItem
            icon={'\ud83e\uddf3'}
            name="Kit"
            desc="Pack, bedroll, rations"
          />
        </div>
      </div>
    </div>
  );
}
