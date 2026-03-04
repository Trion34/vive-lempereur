import React from 'react';
import { useLabStore } from '../store/labStore';
import { SCENARIOS, SCENARIO_IDS } from '../store/scenarios';

export function ScenarioBar() {
  const activeScenario = useLabStore((s) => s.activeScenario);
  const loadScenario = useLabStore((s) => s.loadScenario);

  return (
    <div className="lab-scenario-bar">
      <span className="lab-scenario-label">Scenarios</span>
      {SCENARIO_IDS.map((id) => (
        <button
          key={id}
          className={`lab-scenario-btn${activeScenario === id ? ' active' : ''}`}
          onClick={() => loadScenario(id)}
          title={SCENARIOS[id].description}
        >
          {SCENARIOS[id].label}
        </button>
      ))}
    </div>
  );
}
