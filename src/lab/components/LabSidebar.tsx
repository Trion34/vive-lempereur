import React from 'react';
import { useLabStore } from '../stores/labStore';
import { categoryOrder, categoryLabels } from '../labRoutes';

export function LabSidebar() {
  const selectedCategory = useLabStore((s) => s.selectedCategory);
  const setCategory = useLabStore((s) => s.setCategory);

  return (
    <nav className="lab-sidebar">
      <div className="lab-sidebar-title">
        <span className="lab-sidebar-title-main">The Little Soldier</span>
        <span className="lab-sidebar-title-sub">Lab</span>
      </div>
      <button
        className={`lab-nav-btn${selectedCategory === null ? ' active' : ''}`}
        onClick={() => setCategory(null)}
      >
        Home
      </button>
      {categoryOrder.map((cat) => (
        <button
          key={cat}
          className={`lab-nav-btn${selectedCategory === cat ? ' active' : ''}`}
          onClick={() => setCategory(cat)}
        >
          {categoryLabels[cat]}
        </button>
      ))}
    </nav>
  );
}
