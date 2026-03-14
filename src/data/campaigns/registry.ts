import type { CampaignDef } from './types';

const CAMPAIGN_DEFS: Record<string, CampaignDef> = {};
const DEV_OVERRIDES: Record<string, CampaignDef> = {};

export function getCampaignDef(id: string): CampaignDef {
  if (DEV_OVERRIDES[id]) return DEV_OVERRIDES[id];
  const def = CAMPAIGN_DEFS[id];
  if (!def) throw new Error(`Unknown campaign: ${id}`);
  return def;
}

export function registerCampaignDef(def: CampaignDef): void {
  CAMPAIGN_DEFS[def.id] = def;
}

export function pushDevOverride(def: CampaignDef): void {
  DEV_OVERRIDES[def.id] = def;
}

export function clearDevOverride(id: string): void {
  delete DEV_OVERRIDES[id];
}

export function hasDevOverride(id: string): boolean {
  return id in DEV_OVERRIDES;
}
