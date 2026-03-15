import React from 'react';

export function ArtLabPage() {
  return (
    <div className="art-lab">
      <div className="art-lab-toolbar">
        <span className="art-lab-toolbar-label">Art Lab</span>
      </div>
      <div className="art-lab-preview-area" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Scene gallery removed during monorepo split. Art Lab will be rebuilt with the Asset Studio.
        </p>
      </div>
    </div>
  );
}
