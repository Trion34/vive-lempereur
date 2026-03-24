import type { BattleConfig } from './types';

const BATTLE_CONFIGS: Record<string, BattleConfig> = {};

export function getBattleConfig(id: string): BattleConfig {
  const config = BATTLE_CONFIGS[id];
  if (!config) throw new Error(`Unknown battle: ${id}`);
  return config;
}

export function tryGetBattleConfig(id: string): BattleConfig | undefined {
  return BATTLE_CONFIGS[id];
}

/** Validate battle script references at registration time. */
function validateBattleScript(config: BattleConfig): void {
  if (!config.script?.length) return;
  const errors: string[] = [];
  const encounterKeys = new Set(Object.keys(config.encounters ?? {}));
  const storyBeatIds = new Set(Object.keys(config.storyBeats ?? {}).map(Number));
  const volleys = config.volleys ?? [];
  const maxVolleyIdx = volleys.length - 1;

  for (let i = 0; i < config.script.length; i++) {
    const seg = config.script[i];
    switch (seg.type) {
      case 'volleys':
        if (seg.startIdx < 0 || seg.endIdx < seg.startIdx) {
          errors.push(`script[${i}]: invalid volley range ${seg.startIdx}-${seg.endIdx}`);
        }
        if (volleys.length > 0 && seg.endIdx > maxVolleyIdx) {
          errors.push(`script[${i}]: endIdx ${seg.endIdx} exceeds max volley index ${maxVolleyIdx}`);
        }
        break;
      case 'melee':
        if (!encounterKeys.has(seg.encounterKey)) {
          errors.push(`script[${i}]: melee encounterKey "${seg.encounterKey}" not found in encounters [${[...encounterKeys].join(', ')}]`);
        }
        break;
      case 'story_beat':
        if (!storyBeatIds.has(seg.id)) {
          errors.push(`script[${i}]: story_beat id ${seg.id} not found in storyBeats [${[...storyBeatIds].join(', ')}]`);
        }
        break;
    }
  }

  if (errors.length > 0) {
    console.error(`[registerBattleConfig] Validation errors for battle "${config.id}":\n  ${errors.join('\n  ')}`);
  }
}

export function registerBattleConfig(config: BattleConfig): void {
  validateBattleScript(config);
  BATTLE_CONFIGS[config.id] = config;
}

