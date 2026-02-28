import React, { useState, useRef, useCallback } from 'react';
import { createNewGame } from '@src/core/gameLoop';
import { BattlefieldView } from '@src/components/line/BattlefieldView';
import { SandboxControls } from '@src/components/sandbox/SandboxControls';
import { FORMATION_SHAPES, toFormationShape } from '@src/core/formations';
import { FORMATION_INFO } from '@src/core/formations';
import { Formation } from '@src/types';
import type { BattlefieldViewHandle, FormationShape } from '@src/components/line/BattlefieldView';
import type { GameState } from '@src/types';

const DEFAULT_AUSTRIAN: FormationShape = { cols: 40, rows: 80, label: 'AUSTRIAN COL.' };

export function Lab() {
  const [gameState, setGameState] = useState<GameState>(() => createNewGame());
  const [, setTick] = useState(0);
  const [formation, setFormation] = useState<Formation>(Formation.Line);
  const bfRef = useRef<BattlefieldViewHandle>(null);

  const forceUpdate = useCallback(() => setTick((t) => t + 1), []);

  const handleReset = useCallback(() => {
    setGameState(createNewGame());
  }, []);

  const frenchShape = toFormationShape(FORMATION_SHAPES[formation]);
  const formations = { french: frenchShape, austrian: DEFAULT_AUSTRIAN };

  const bs = gameState.battleState;
  if (!bs) return <div style={{ padding: 24, color: '#888' }}>No battle state</div>;

  return (
    <div className="lab-root">
      <div className="lab-left">
        <div className="lab-viewport">
          <BattlefieldView
            ref={bfRef}
            battleState={bs}
            formations={formations}
          />
        </div>

        <div className="lab-btn-bar">
          <button
            className="lab-btn french"
            onClick={() => bfRef.current?.playVolley('french')}
          >
            French Volley
          </button>
          <button
            className="lab-btn austrian"
            onClick={() => bfRef.current?.playVolley('austrian')}
          >
            Austrian Volley
          </button>
          <button
            className="lab-btn"
            onClick={() => {
              const newRange = Math.max(25, bs.enemy.range - 20);
              bs.enemy.range = newRange;
              forceUpdate();
              bfRef.current?.advanceAustrians(newRange);
            }}
          >
            Advance Austrians
          </button>
          <button
            className="lab-btn"
            onClick={() => bfRef.current?.clearSmoke()}
          >
            Clear Smoke
          </button>

          <div className="lab-formation-picker">
            <label>Formation:</label>
            {FORMATION_INFO.map((fi) => (
              <button
                key={fi.id}
                className={`lab-formation-btn${formation === fi.id ? ' active' : ''}`}
                onClick={() => setFormation(fi.id)}
                title={fi.description}
              >
                {fi.icon} {fi.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="lab-right">
        <h3 className="lab-right-title">Controls</h3>
        <SandboxControls
          gameState={gameState}
          onUpdate={forceUpdate}
          onReset={handleReset}
          onStartAutoPlay={() => {}}
          battlefieldRef={bfRef}
        />
      </div>
    </div>
  );
}
