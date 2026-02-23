import React from 'react';
import type { PlayerCharacter, Player } from '../../types';

interface CharacterPanelProps {
  player: PlayerCharacter;
  battlePlayer: Player | null;
  volleysFired: number;
  visible: boolean;
  onClose: () => void;
}

function StatusRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="status-row">
      <span className="status-key">{label}</span>
      <span className="status-val">{value}</span>
    </div>
  );
}

export function CharacterPanel({
  player,
  battlePlayer,
  volleysFired,
  visible,
  onClose,
}: CharacterPanelProps) {
  if (!visible) return null;

  const inBattle = !!battlePlayer;

  return (
    <div className="char-overlay" id="char-overlay" style={{ display: 'flex' }}>
      <div className="char-content">
        <button className="overlay-close" id="btn-char-close" onClick={onClose}>
          &times;
        </button>
        <div className="char-stats" id="char-stats">
          <StatusRow label="Name" value={player.name} />
          <StatusRow label="Rank" value={player.rank} />
          <StatusRow label="Valor" value={player.valor} />
          <StatusRow label="Musketry" value={player.musketry} />
          <StatusRow label="\u00c9lan" value={player.elan} />
          <StatusRow label="Strength" value={player.strength} />
          <StatusRow label="Endurance" value={player.endurance} />
          <StatusRow label="Constitution" value={player.constitution} />
          <StatusRow label="Charisma" value={player.charisma} />
          <StatusRow label="Intelligence" value={player.intelligence} />
          <StatusRow label="Awareness" value={player.awareness} />
          <StatusRow label="Soldier Rep" value={player.soldierRep} />
          <StatusRow label="Officer Rep" value={player.officerRep} />
          <StatusRow label="Napoleon Rep" value={player.napoleonRep} />
          {inBattle && (
            <>
              <hr style={{ borderColor: 'var(--text-dim)', margin: '8px 0' }} />
              <StatusRow
                label="Morale"
                value={`${Math.round(battlePlayer.morale)} / ${battlePlayer.maxMorale}`}
              />
              <StatusRow
                label="Health"
                value={`${Math.round(battlePlayer.health)} / ${battlePlayer.maxHealth}`}
              />
              <StatusRow
                label="Stamina"
                value={`${Math.round(battlePlayer.stamina)} / ${battlePlayer.maxStamina}`}
              />
              <StatusRow label="Volleys Fired" value={volleysFired} />
            </>
          )}
        </div>
        <div className="char-inventory" id="char-inventory">
          {inBattle ? (
            <>
              <StatusRow
                label="Musket"
                value={`Charleville M1777 \u2014 ${battlePlayer.musketLoaded ? 'Loaded' : 'Empty'}`}
              />
              <StatusRow label="Bayonet" value="17-inch socket" />
              <StatusRow label="Cartridges" value="~40 remaining" />
              <StatusRow
                label="Canteen"
                value={`${3 - battlePlayer.canteenUses} drinks left`}
              />
              <StatusRow label="Kit" value="Pack, bedroll, rations" />
            </>
          ) : (
            <>
              <StatusRow label="Musket" value="Charleville M1777" />
              <StatusRow label="Bayonet" value="17-inch socket" />
              <StatusRow label="Kit" value="Pack, bedroll, rations" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
