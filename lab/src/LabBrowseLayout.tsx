import React from 'react';
import { LabSidebar } from './components/LabSidebar';

export function LabBrowseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="lab-browse-layout">
      <LabSidebar />
      <main className="lab-browse-main">
        {children}
      </main>
    </div>
  );
}
