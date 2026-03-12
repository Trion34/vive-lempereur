import React from 'react';
import { useLabStore } from '../stores/labStore';
import { labRoutes, categoryLabels, categoryOrder } from '../labRoutes';

export function HomePage() {
  const setPage = useLabStore((s) => s.setPage);
  const selectedCategory = useLabStore((s) => s.selectedCategory);

  const categories = selectedCategory
    ? [selectedCategory]
    : categoryOrder;

  return (
    <div className="lab-home">
      <p className="lab-home-intro">
        Development workbench for building and testing game content.
      </p>
      {categories.map((cat) => {
        const routes = labRoutes.filter((r) => r.category === cat);
        return (
          <div key={cat} className="lab-home-section">
            <h2 className="lab-home-section-title">{categoryLabels[cat]}</h2>
            <div className="lab-tool-grid">
              {routes.map((route) => (
                <button
                  key={route.id}
                  className="lab-tool-card"
                  onClick={() => setPage(route.id)}
                >
                  <span className="lab-tool-icon">{route.icon}</span>
                  <span className="lab-tool-name">{route.label}</span>
                  <span className="lab-tool-desc">{route.description}</span>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
