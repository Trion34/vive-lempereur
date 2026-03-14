import { describe, it, expect, afterEach } from 'vitest';
import {
  getCampaignDef,
  registerCampaignDef,
  pushDevOverride,
  clearDevOverride,
  hasDevOverride,
} from '../../data/campaigns/registry';
import type { CampaignDef } from '../../data/campaigns/types';

// Import italy campaign to register it
import '../../data/campaigns/italy/index';

const MOCK_DEF: CampaignDef = {
  id: 'test-campaign',
  title: 'Test Campaign',
  npcs: [],
  sequence: [],
  camps: {},
  interludes: {},
  replacementPool: [],
};

describe('campaignRegistry', () => {
  afterEach(() => {
    clearDevOverride('test-campaign');
    clearDevOverride('italy');
  });

  it('getCampaignDef returns registered campaign', () => {
    const def = getCampaignDef('italy');
    expect(def.id).toBe('italy');
    expect(def.title).toContain('Italian');
  });

  it('getCampaignDef throws for unknown campaign', () => {
    expect(() => getCampaignDef('nonexistent')).toThrow('Unknown campaign: nonexistent');
  });

  it('pushDevOverride takes priority over registered def', () => {
    const override: CampaignDef = {
      ...MOCK_DEF,
      id: 'italy',
      title: 'Dev Override Title',
    };
    pushDevOverride(override);
    const def = getCampaignDef('italy');
    expect(def.title).toBe('Dev Override Title');
  });

  it('clearDevOverride restores original', () => {
    const override: CampaignDef = {
      ...MOCK_DEF,
      id: 'italy',
      title: 'Dev Override Title',
    };
    pushDevOverride(override);
    clearDevOverride('italy');
    const def = getCampaignDef('italy');
    expect(def.title).toContain('Italian');
  });

  it('hasDevOverride returns correct state', () => {
    expect(hasDevOverride('italy')).toBe(false);
    pushDevOverride({ ...MOCK_DEF, id: 'italy' });
    expect(hasDevOverride('italy')).toBe(true);
    clearDevOverride('italy');
    expect(hasDevOverride('italy')).toBe(false);
  });
});
