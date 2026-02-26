import type { BattleConfig } from './types';

/**
 * Validates a BattleConfig for structural correctness.
 * Returns an array of error messages (empty = valid).
 */
export function validateBattleConfig(config: BattleConfig): string[] {
  const errors: string[] = [];

  // --- Volley indices in script segments must be within bounds ---
  const volleyCount = config.volleys.length;
  for (const seg of config.script) {
    if (seg.type === 'volleys') {
      if (seg.startIdx < 0 || seg.startIdx >= volleyCount) {
        errors.push(
          `Volley segment startIdx ${seg.startIdx} out of bounds (${volleyCount} volleys)`,
        );
      }
      if (seg.endIdx < seg.startIdx) {
        errors.push(
          `Volley segment endIdx ${seg.endIdx} < startIdx ${seg.startIdx}`,
        );
      }
      if (seg.endIdx >= volleyCount) {
        errors.push(
          `Volley segment endIdx ${seg.endIdx} out of bounds (${volleyCount} volleys)`,
        );
      }
    }
  }

  // --- All story beat IDs in script must exist in storyBeats ---
  for (const seg of config.script) {
    if (seg.type === 'story_beat') {
      if (!(seg.id in config.storyBeats)) {
        errors.push(`Script references story beat ${seg.id} which is not defined`);
      }
    }
  }

  // --- All encounter keys in script must exist in encounters ---
  for (const seg of config.script) {
    if (seg.type === 'melee') {
      if (!(seg.encounterKey in config.encounters)) {
        errors.push(
          `Script references encounter '${seg.encounterKey}' which is not defined`,
        );
      }
    }
  }

  // --- NPC role IDs must exist in the NPC list ---
  const npcIds = new Set(config.npcs.map((n) => n.id));
  const { roles } = config;
  if (roles.leftNeighbour && !npcIds.has(roles.leftNeighbour)) {
    errors.push(`Role leftNeighbour references unknown NPC '${roles.leftNeighbour}'`);
  }
  if (roles.rightNeighbour && !npcIds.has(roles.rightNeighbour)) {
    errors.push(`Role rightNeighbour references unknown NPC '${roles.rightNeighbour}'`);
  }
  if (!npcIds.has(roles.officer)) {
    errors.push(`Role officer references unknown NPC '${roles.officer}'`);
  }
  if (roles.nco && !npcIds.has(roles.nco)) {
    errors.push(`Role nco references unknown NPC '${roles.nco}'`);
  }

  // --- Meta must be present ---
  if (!config.meta.title) errors.push('Missing meta.title');
  if (!config.meta.date) errors.push('Missing meta.date');

  // --- Opening must be present ---
  if (!config.opening.narrative) errors.push('Missing opening.narrative');

  // --- At least one volley ---
  if (volleyCount === 0) errors.push('No volleys defined');

  return errors;
}
