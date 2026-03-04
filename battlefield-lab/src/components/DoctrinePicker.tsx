import React from 'react';
import { DOCTRINE_INFO } from '../engagement';
import { useLabStore, ALL_DOCTRINES } from '../store/labStore';

export function DoctrinePicker() {
  const doctrine = useLabStore((s) => s.engagement.austrianDoctrine);
  const updateEngagement = useLabStore((s) => s.updateEngagement);

  return (
    <div className="lab-doctrine-picker">
      <h3 className="lab-right-title">Austrian Doctrine</h3>
      <div className="lab-doctrine-row">
        {ALL_DOCTRINES.map((d) => (
          <button
            key={d}
            className={`lab-doctrine-btn${doctrine === d ? ' active' : ''}`}
            onClick={() => updateEngagement(() => ({ austrianDoctrine: d }))}
            title={DOCTRINE_INFO[d].description}
          >
            {DOCTRINE_INFO[d].label}
          </button>
        ))}
      </div>
    </div>
  );
}
