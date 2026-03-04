import React from 'react';
import { useLabStore } from '../store/labStore';

export function VolleyLog() {
  const volleyLog = useLabStore((s) => s.volleyLog);

  if (volleyLog.length === 0) return null;

  return (
    <div className="lab-volley-log">
      <h3 className="lab-right-title">Volley Log</h3>
      <div className="lab-volley-log-entries">
        {volleyLog.map((entry, i) => (
          <div key={i} className="lab-volley-log-entry">{entry}</div>
        ))}
      </div>
    </div>
  );
}
