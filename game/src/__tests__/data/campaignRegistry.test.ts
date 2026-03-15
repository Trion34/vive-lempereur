import { describe, it, expect } from 'vitest';
import {
  getCampaignDef,
} from '../../data/campaigns/registry';

// Import italy campaign to register it
import '../../data/campaigns/italy/index';

describe('campaignRegistry', () => {
  it('getCampaignDef returns registered campaign', () => {
    const def = getCampaignDef('italy');
    expect(def.id).toBe('italy');
    expect(def.title).toContain('Italian');
  });

  it('getCampaignDef throws for unknown campaign', () => {
    expect(() => getCampaignDef('nonexistent')).toThrow('Unknown campaign: nonexistent');
  });
});
