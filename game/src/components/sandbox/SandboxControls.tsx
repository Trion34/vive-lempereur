import React, { useState } from 'react';
import type { GameState, BattleState } from '../../types';
import { DrillStep, Formation } from '../../types';
import type { BattlefieldViewHandle } from '../line/BattlefieldView';

interface SandboxControlsProps {
  gameState: GameState;
  onUpdate: () => void;
  onReset: () => void;
  onStartAutoPlay: () => void;
  onChangeSetup?: () => void;
  battlefieldRef: React.RefObject<BattlefieldViewHandle | null>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="sandbox-section">
      <div className="sandbox-section-header" onClick={() => setOpen(!open)}>
        <span>{open ? '\u25BE' : '\u25B8'} {title}</span>
      </div>
      {open && <div className="sandbox-section-body">{children}</div>}
    </div>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="sandbox-slider-row">
      <span className="dev-label">{label}</span>
      <input
        type="range"
        className="dev-slider"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <span className="dev-val">{Math.round(value)}</span>
    </div>
  );
}

export function SandboxControls({
  gameState,
  onUpdate,
  onReset,
  onStartAutoPlay,
  onChangeSetup,
}: SandboxControlsProps) {
  const bs = gameState.battleState!;
  const { player, enemy, line } = bs;

  const mutate = (fn: (bs: BattleState) => void) => {
    fn(bs);
    onUpdate();
  };

  return (
    <div className="sandbox-controls">
      {onChangeSetup && (
        <button className="dev-action-btn sandbox-change-setup-btn" onClick={onChangeSetup}>
          &larr; Change Setup
        </button>
      )}
      <Section title="Player">
        <SliderRow
          label="Health"
          value={player.health}
          min={0}
          max={player.maxHealth}
          onChange={(v) => mutate((s) => { s.player.health = v; })}
        />
        <SliderRow
          label="Morale"
          value={player.morale}
          min={0}
          max={player.maxMorale}
          onChange={(v) => mutate((s) => { s.player.morale = v; })}
        />
        <SliderRow
          label="Stamina"
          value={player.stamina}
          min={0}
          max={player.maxStamina}
          onChange={(v) => mutate((s) => { s.player.stamina = v; })}
        />
        <div className="dev-row">
          <span className="dev-label">Grace</span>
          <button className="dev-action-btn" style={{ width: 30 }}
            onClick={() => mutate(() => { if (gameState.player.grace > 0) gameState.player.grace--; })}
          >-</button>
          <span className="dev-val">{gameState.player.grace}</span>
          <button className="dev-action-btn" style={{ width: 30 }}
            onClick={() => mutate(() => { gameState.player.grace++; })}
          >+</button>
        </div>
        <div className="dev-row">
          <span className="dev-label">Musket</span>
          <label>
            <input
              type="checkbox"
              className="dev-checkbox"
              checked={player.musketLoaded}
              onChange={(e) => mutate((s) => { s.player.musketLoaded = e.target.checked; })}
            />
            {' '}Loaded
          </label>
        </div>
        <div className="dev-row">
          <span className="dev-label">Front Rank</span>
          <label>
            <input
              type="checkbox"
              className="dev-checkbox"
              checked={player.frontRank}
              onChange={(e) => mutate((s) => { s.player.frontRank = e.target.checked; })}
            />
            {' '}Yes
          </label>
        </div>
      </Section>

      <Section title="Enemy">
        <SliderRow
          label="Range"
          value={enemy.range}
          min={25}
          max={200}
          step={5}
          onChange={(v) => mutate((s) => { s.enemy.range = v; })}
        />
        <SliderRow
          label="Strength"
          value={enemy.strength}
          min={0}
          max={100}
          onChange={(v) => mutate((s) => { s.enemy.strength = v; })}
        />
        <SliderRow
          label="Integrity"
          value={enemy.lineIntegrity}
          min={0}
          max={100}
          onChange={(v) => mutate((s) => { s.enemy.lineIntegrity = v; })}
        />
        <div className="dev-row">
          <span className="dev-label">Morale</span>
          <select
            className="dev-select"
            value={enemy.morale}
            onChange={(e) => mutate((s) => { s.enemy.morale = e.target.value; })}
          >
            <option value="advancing">Advancing</option>
            <option value="steady">Steady</option>
            <option value="wavering">Wavering</option>
            <option value="routing">Routing</option>
          </select>
        </div>
        <div className="dev-row">
          <span className="dev-label">Quality</span>
          <select
            className="dev-select"
            value={enemy.quality}
            onChange={(e) => mutate((s) => { s.enemy.quality = e.target.value; })}
          >
            <option value="conscript">Conscript</option>
            <option value="line">Line</option>
            <option value="grenadier">Grenadier</option>
            <option value="elite">Elite</option>
          </select>
        </div>
        <div className="dev-row">
          <span className="dev-label">Artillery</span>
          <label>
            <input
              type="checkbox"
              className="dev-checkbox"
              checked={enemy.artillery}
              onChange={(e) => mutate((s) => { s.enemy.artillery = e.target.checked; })}
            />
            {' '}Active
          </label>
        </div>
        <div className="dev-row">
          <span className="dev-label">Cavalry</span>
          <label>
            <input
              type="checkbox"
              className="dev-checkbox"
              checked={enemy.cavalryThreat}
              onChange={(e) => mutate((s) => { s.enemy.cavalryThreat = e.target.checked; })}
            />
            {' '}Threat
          </label>
        </div>
      </Section>

      <Section title="The Line">
        <SliderRow
          label="Integrity"
          value={line.lineIntegrity}
          min={0}
          max={100}
          onChange={(v) => mutate((s) => { s.line.lineIntegrity = v; })}
        />
        <div className="dev-row">
          <span className="dev-label">Morale</span>
          <select
            className="dev-select"
            value={line.lineMorale}
            onChange={(e) => mutate((s) => { s.line.lineMorale = e.target.value; })}
          >
            <option value="resolute">Resolute</option>
            <option value="steady">Steady</option>
            <option value="shaken">Shaken</option>
            <option value="wavering">Wavering</option>
          </select>
        </div>
        <div className="dev-row">
          <span className="dev-label">NCO</span>
          <label>
            <input
              type="checkbox"
              className="dev-checkbox"
              checked={line.ncoPresent}
              onChange={(e) => mutate((s) => { s.line.ncoPresent = e.target.checked; })}
            />
            {' '}Present
          </label>
        </div>
        {line.leftNeighbour && (
          <div className="dev-row">
            <span className="dev-label">Pierre</span>
            <label>
              <input
                type="checkbox"
                className="dev-checkbox"
                checked={line.leftNeighbour.wounded}
                onChange={(e) => mutate((s) => {
                  if (s.line.leftNeighbour) s.line.leftNeighbour.wounded = e.target.checked;
                })}
              />
              {' '}Wounded
            </label>
          </div>
        )}
        {line.rightNeighbour && (
          <div className="dev-row">
            <span className="dev-label">JB</span>
            <label>
              <input
                type="checkbox"
                className="dev-checkbox"
                checked={line.rightNeighbour.wounded}
                onChange={(e) => mutate((s) => {
                  if (s.line.rightNeighbour) s.line.rightNeighbour.wounded = e.target.checked;
                })}
              />
              {' '}Wounded
            </label>
          </div>
        )}
      </Section>

      <Section title="Battle">
        <div className="dev-row">
          <span className="dev-label">French Formation</span>
          <select
            className="dev-select"
            value={bs.formation}
            onChange={(e) => mutate((s) => { s.formation = e.target.value as Formation; })}
          >
            <option value={Formation.Line}>Line</option>
            <option value={Formation.Column}>Column</option>
            <option value={Formation.Square}>Square</option>
            <option value={Formation.Skirmish}>Skirmish</option>
          </select>
        </div>
        <div className="dev-row">
          <span className="dev-label">Formation Chosen</span>
          <label>
            <input
              type="checkbox"
              className="dev-checkbox"
              checked={bs.formationChosen}
              onChange={(e) => mutate((s) => { s.formationChosen = e.target.checked; })}
            />
            {' '}Yes
          </label>
        </div>
        <div className="dev-row">
          <span className="dev-label">Part</span>
          <select
            className="dev-select"
            value={bs.ext.battlePart}
            onChange={(e) => mutate((s) => { s.ext.battlePart = Number(e.target.value) as 1 | 2 | 3; })}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>
        </div>
        <div className="dev-row">
          <span className="dev-label">Volley</span>
          <input
            type="number"
            className="dev-input"
            min={1}
            max={11}
            value={bs.scriptedVolley}
            onChange={(e) => mutate((s) => { s.scriptedVolley = Number(e.target.value); })}
          />
        </div>
        <div className="dev-row">
          <span className="dev-label">Drill Step</span>
          <select
            className="dev-select"
            value={bs.drillStep}
            onChange={(e) => mutate((s) => { s.drillStep = e.target.value as DrillStep; })}
          >
            <option value={DrillStep.Present}>Present</option>
            <option value={DrillStep.Fire}>Fire</option>
            <option value={DrillStep.Endure}>Endure</option>
            <option value={DrillStep.Load}>Load</option>
          </select>
        </div>
      </Section>

      <Section title="Actions">
        <div className="dev-btn-group">
          <button className="dev-action-btn success" onClick={onStartAutoPlay}>
            Start Auto-Play
          </button>
          <button className="dev-action-btn danger" onClick={onReset}>
            Reset State
          </button>
        </div>
      </Section>
    </div>
  );
}
