import type { CampaignDef } from './types';

const CAMPAIGN_DEFS: Record<string, CampaignDef> = {};

const LAB_CAMPAIGN_STORAGE_KEY = 'lab_test_campaign';

export function getCampaignDef(id: string): CampaignDef {
  const def = CAMPAIGN_DEFS[id];
  if (def) return def;

  // Check localStorage for lab-pushed campaigns (cross-tab handoff)
  try {
    const stored = localStorage.getItem(LAB_CAMPAIGN_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as CampaignDef;
      if (parsed.id === id) {
        CAMPAIGN_DEFS[id] = parsed;
        return parsed;
      }
    }
  } catch { /* ignore parse errors */ }

  throw new Error(`Unknown campaign: ${id}`);
}

export function registerCampaignDef(def: CampaignDef): void {
  CAMPAIGN_DEFS[def.id] = def;
}

/**
 * Persist a campaign def to localStorage for cross-tab access.
 * Used by the lab's "Test Campaign" feature.
 */
export function persistCampaignDef(def: CampaignDef): void {
  CAMPAIGN_DEFS[def.id] = def;
  try {
    localStorage.setItem(LAB_CAMPAIGN_STORAGE_KEY, JSON.stringify(def));
  } catch { /* storage full — skip */ }
}
