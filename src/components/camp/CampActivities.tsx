import type { CampActivity } from '../../types';

interface CampActivitiesProps {
  activities: CampActivity[];
  activeCategory: string | null;
  onSelectCategory: (id: string | null) => void;
}

export function CampActivities({ activities, activeCategory, onSelectCategory }: CampActivitiesProps) {
  return (
    <div className="camp-activities-grid" id="camp-activities-grid">
      {activities.map((act) => {
        const isActive = activeCategory === act.id;
        return (
          <button
            key={act.id}
            className={`action-btn camp-activity-btn${isActive ? ' active' : ''}`}
            style={!act.available ? { opacity: 0.4, pointerEvents: 'none' } : undefined}
            onClick={() => {
              if (!act.available) return;
              if (activeCategory === act.id) {
                onSelectCategory(null);
              } else {
                onSelectCategory(act.id);
              }
            }}
          >
            <span className="action-name">{act.name}</span>
            <span className="action-desc">{act.description}</span>
            {act.staminaCost > 0 && (
              <span className="camp-activity-cost">Stamina: -{act.staminaCost}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
