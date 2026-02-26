import type { BattleConfig } from './types';

const BATTLE_CONFIGS: Record<string, BattleConfig> = {};

export function getBattleConfig(id: string): BattleConfig {
  const config = BATTLE_CONFIGS[id];
  if (!config) throw new Error(`Unknown battle: ${id}`);
  return config;
}

export function registerBattleConfig(config: BattleConfig): void {
  BATTLE_CONFIGS[config.id] = config;
}

