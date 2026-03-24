import { describe, it, expect } from 'vitest';
import {
  getBattleConfig,
  tryGetBattleConfig,
  registerBattleConfig,
} from '../../data/battles/registry';
import type { BattleConfig } from '../../data/battles/types';

// Import battle configs to register them
import '../../data/battles/rivoli/index';
import '../../data/battles/voltri/index';

describe('battleRegistry', () => {
  describe('getBattleConfig', () => {
    it('returns registered rivoli config', () => {
      const config = getBattleConfig('rivoli');
      expect(config.id).toBe('rivoli');
    });

    it('returns registered voltri config', () => {
      const config = getBattleConfig('voltri');
      expect(config.id).toBe('voltri');
    });

    it('throws for unknown battle', () => {
      expect(() => getBattleConfig('nonexistent')).toThrow('Unknown battle: nonexistent');
    });
  });

  describe('tryGetBattleConfig', () => {
    it('returns config for registered battle', () => {
      const config = tryGetBattleConfig('rivoli');
      expect(config).toBeDefined();
      expect(config!.id).toBe('rivoli');
    });

    it('returns undefined for unknown battle', () => {
      const config = tryGetBattleConfig('nonexistent');
      expect(config).toBeUndefined();
    });
  });

  describe('registerBattleConfig', () => {
    it('registers a new battle config and retrieves it', () => {
      const testConfig = { id: 'test-battle-reg' } as unknown as BattleConfig;

      registerBattleConfig(testConfig);
      const retrieved = getBattleConfig('test-battle-reg');
      expect(retrieved).toBe(testConfig);
    });

    it('overwrites existing config with same id', () => {
      const first = { id: 'test-overwrite' } as unknown as BattleConfig;
      const second = { id: 'test-overwrite', meta: { title: 'Updated' } } as unknown as BattleConfig;

      registerBattleConfig(first);
      registerBattleConfig(second);
      expect(getBattleConfig('test-overwrite')).toBe(second);
    });
  });
});
