import React from 'react';

export interface CampaignMapPanelProps {
  onClose?: () => void;
}

export function CampaignMapPanel({ onClose }: CampaignMapPanelProps) {
  return (
    <div className="campaign-map-overlay" onClick={onClose}>
      <div
        className="campaign-map-overlay__panel"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="campaign-map-panel">
          <div className="campaign-map-panel__header">
            <div>
              <h2 className="campaign-map-panel__title">Campaign Map</h2>
            </div>
            {onClose && (
              <button
                type="button"
                className="campaign-map-panel__close"
                onClick={onClose}
                aria-label="Close campaign map"
              >
                x
              </button>
            )}
          </div>
          <div className="campaign-map-panel__body">
            <div className="campaign-map-panel__map">
              <img
                src="/assets/campaign-map.png"
                alt="Italian Campaign, 1796-1797"
                className="campaign-map-panel__image"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
