import React from 'react';
import { useLabStore } from './stores/labStore';
import { labRoutes } from './labRoutes';

export function LabToolLayout({ children }: { children: React.ReactNode }) {
  const currentPage = useLabStore((s) => s.currentPage);
  const goHome = useLabStore((s) => s.goHome);

  const route = labRoutes.find((r) => r.id === currentPage);
  const title = route?.label ?? '';

  return (
    <div className="lab-tool-layout">
      <header className="lab-tool-header">
        <button className="lab-back-btn" onClick={goHome}>
          &larr; Home
        </button>
        <h1>{title}</h1>
      </header>
      <div className="lab-tool-content">{children}</div>
    </div>
  );
}
