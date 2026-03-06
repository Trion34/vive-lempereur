import type { CampaignDef } from './types';

const CAMPAIGN_DEFS: Record<string, CampaignDef> = {};

export function getCampaignDef(id: string): CampaignDef {
  const def = CAMPAIGN_DEFS[id];
  if (!def) throw new Error(`Unknown campaign: ${id}`);
  return def;
}

export function registerCampaignDef(def: CampaignDef): void {
  CAMPAIGN_DEFS[def.id] = def;
}
