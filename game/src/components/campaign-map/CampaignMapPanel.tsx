import React from 'react';
import { HistoricalItalyTheaterMap } from './HistoricalItalyTheaterMap';

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
              <p className="campaign-map-panel__subtitle">
                Theatre of Operations — Northern Italy, 1796–97
              </p>
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
              <HistoricalItalyTheaterMap />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
