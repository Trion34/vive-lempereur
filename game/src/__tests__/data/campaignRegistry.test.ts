import { describe, it, expect, beforeEach } from 'vitest';
import {
  getCampaignDef,
  registerCampaignDef,
  persistCampaignDef,
} from '../../data/campaigns/registry';
import type { CampaignDef } from '../../data/campaigns/types';

// Import italy campaign to register it
import '../../data/campaigns/italy/index';

describe('campaignRegistry', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('getCampaignDef returns registered campaign', () => {
    const def = getCampaignDef('italy');
    expect(def.id).toBe('italy');
    expect(def.title).toContain('Italian');
  });

  it('getCampaignDef throws for unknown campaign', () => {
    expect(() => getCampaignDef('nonexistent')).toThrow('Unknown campaign: nonexistent');
  });

  describe('persistCampaignDef', () => {
    it('persists campaign to localStorage and makes it retrievable', () => {
      const testDef = { id: 'test-persist', title: 'Test Campaign', sequence: [] } as unknown as CampaignDef;
      persistCampaignDef(testDef);

      // Should be retrievable from the in-memory registry
      expect(getCampaignDef('test-persist')).toBe(testDef);
    });

    it('stores campaign JSON in localStorage', () => {
      const testDef = { id: 'test-ls', title: 'LS Campaign', sequence: [] } as unknown as CampaignDef;
      persistCampaignDef(testDef);

      const stored = localStorage.getItem('lab_test_campaign');
      expect(stored).not.toBeNull();
      const parsed = JSON.parse(stored!);
      expect(parsed.id).toBe('test-ls');
    });

    it('getCampaignDef falls back to localStorage for lab-pushed campaigns', () => {
      const testDef = { id: 'lab-only', title: 'Lab Campaign', sequence: [] } as unknown as CampaignDef;
      localStorage.setItem('lab_test_campaign', JSON.stringify(testDef));

      // Not in registry, but should be found via localStorage fallback
      const retrieved = getCampaignDef('lab-only');
      expect(retrieved.id).toBe('lab-only');
    });

    it('getCampaignDef ignores localStorage if id does not match', () => {
      const testDef = { id: 'other-campaign' } as unknown as CampaignDef;
      localStorage.setItem('lab_test_campaign', JSON.stringify(testDef));

      expect(() => getCampaignDef('wrong-id')).toThrow('Unknown campaign: wrong-id');
    });
  });
});
