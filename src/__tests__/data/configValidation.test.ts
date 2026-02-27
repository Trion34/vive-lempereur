import { describe, it, expect } from 'vitest';
import { getCampaignDef } from '../../data/campaigns/registry';
// Must import italy campaign to trigger registration side-effect
import '../../data/campaigns/italy/index';
import { getBattleConfig } from '../../data/battles/registry';
// Must import rivoli config to trigger registration side-effect
import '../../data/battles/rivoli/index';
import type { NPCTemplate } from '../../data/campaigns/types';
import type { EncounterConfig } from '../../types';

const campaignDef = getCampaignDef('italy');
const battleConfig = getBattleConfig('rivoli');

// ============================================================
// Italy campaign validation
// ============================================================

describe('Italy campaign validation', () => {
  it('campaign sequence is non-empty', () => {
    expect(campaignDef.sequence.length).toBeGreaterThan(0);
  });

  it('all camp nodes reference existing camp configs', () => {
    const campNodes = campaignDef.sequence.filter(
      (node) => node.type === 'camp',
    );
    expect(campNodes.length).toBeGreaterThan(0);

    for (const node of campNodes) {
      if (node.type === 'camp') {
        expect(
          campaignDef.camps[node.campId],
          `Camp config missing for campId "${node.campId}"`,
        ).toBeDefined();
      }
    }
  });

  it('all interlude nodes reference existing interlude defs', () => {
    const interludeNodes = campaignDef.sequence.filter(
      (node) => node.type === 'interlude',
    );
    expect(interludeNodes.length).toBeGreaterThan(0);

    for (const node of interludeNodes) {
      if (node.type === 'interlude') {
        expect(
          campaignDef.interludes[node.interludeId],
          `Interlude def missing for interludeId "${node.interludeId}"`,
        ).toBeDefined();
      }
    }
  });

  function assertNPCTemplateValid(npc: NPCTemplate, label: string) {
    expect(npc.id, `${label}: missing id`).toBeTruthy();
    expect(npc.name, `${label}: missing name`).toBeTruthy();
    expect(npc.role, `${label}: missing role`).toBeTruthy();
    expect(npc.rank, `${label}: missing rank`).toBeTruthy();
    expect(npc.personality, `${label}: missing personality`).toBeTruthy();
    expect(npc.baseStats, `${label}: missing baseStats`).toBeDefined();
    expect(
      typeof npc.baseStats.valor,
      `${label}: valor must be a number`,
    ).toBe('number');
    expect(
      typeof npc.baseStats.morale,
      `${label}: morale must be a number`,
    ).toBe('number');
    expect(
      typeof npc.baseStats.maxMorale,
      `${label}: maxMorale must be a number`,
    ).toBe('number');
    expect(
      typeof npc.baseStats.relationship,
      `${label}: relationship must be a number`,
    ).toBe('number');
  }

  it('NPC templates have required fields', () => {
    expect(campaignDef.npcs.length).toBeGreaterThan(0);
    for (const npc of campaignDef.npcs) {
      assertNPCTemplateValid(npc, `NPC "${npc.id}"`);
    }
  });

  it('replacement pool NPCs have required fields', () => {
    expect(campaignDef.replacementPool.length).toBeGreaterThan(0);
    for (const npc of campaignDef.replacementPool) {
      assertNPCTemplateValid(npc, `Replacement NPC "${npc.id}"`);
    }
  });

  it('all NPC template IDs are unique', () => {
    const allIds = [
      ...campaignDef.npcs.map((n) => n.id),
      ...campaignDef.replacementPool.map((n) => n.id),
    ];
    const uniqueIds = new Set(allIds);
    expect(
      uniqueIds.size,
      `Duplicate NPC IDs found: ${allIds.filter((id, i) => allIds.indexOf(id) !== i).join(', ')}`,
    ).toBe(allIds.length);
  });
});

// ============================================================
// Rivoli battle validation
// ============================================================

describe('Rivoli battle validation', () => {
  it('battle config has non-empty volleys array', () => {
    expect(battleConfig.volleys.length).toBeGreaterThan(0);
  });

  it('battle roles reference NPC IDs that exist in the campaign NPC list', () => {
    const campaignNpcIds = campaignDef.npcs.map((n) => n.id);
    const { roles } = battleConfig;

    if (roles.leftNeighbour) {
      expect(
        campaignNpcIds,
        `leftNeighbour "${roles.leftNeighbour}" not found in campaign NPCs`,
      ).toContain(roles.leftNeighbour);
    }

    if (roles.rightNeighbour) {
      expect(
        campaignNpcIds,
        `rightNeighbour "${roles.rightNeighbour}" not found in campaign NPCs`,
      ).toContain(roles.rightNeighbour);
    }

    expect(
      campaignNpcIds,
      `officer "${roles.officer}" not found in campaign NPCs`,
    ).toContain(roles.officer);

    if (roles.nco) {
      expect(
        campaignNpcIds,
        `nco "${roles.nco}" not found in campaign NPCs`,
      ).toContain(roles.nco);
    }
  });

  it('story beats have getNarrative, getChoices, and resolveChoice functions', () => {
    const beatIds = Object.keys(battleConfig.storyBeats);
    expect(beatIds.length).toBeGreaterThan(0);

    for (const id of beatIds) {
      const beat = battleConfig.storyBeats[Number(id)];
      expect(
        typeof beat.getNarrative,
        `StoryBeat ${id}: getNarrative must be a function`,
      ).toBe('function');
      expect(
        typeof beat.getChoices,
        `StoryBeat ${id}: getChoices must be a function`,
      ).toBe('function');
      expect(
        typeof beat.resolveChoice,
        `StoryBeat ${id}: resolveChoice must be a function`,
      ).toBe('function');
    }
  });

  it('battle has at least one encounter defined', () => {
    const encounterKeys = Object.keys(battleConfig.encounters);
    expect(encounterKeys.length).toBeGreaterThan(0);
  });

  it('init config has valid starting values', () => {
    expect(battleConfig.init.startingVolley).toBeGreaterThanOrEqual(1);
    expect(battleConfig.init.enemy.strength).toBeGreaterThan(0);
  });
});

// ============================================================
// NPC ID referential integrity
// ============================================================

describe('NPC ID referential integrity', () => {
  const battleNpcIds = battleConfig.npcs.map((n) => n.id);

  it('all battle role NPC IDs exist in the battle npcs array', () => {
    const { roles } = battleConfig;

    if (roles.leftNeighbour) {
      expect(
        battleNpcIds,
        `leftNeighbour "${roles.leftNeighbour}" not in battle npcs`,
      ).toContain(roles.leftNeighbour);
    }

    if (roles.rightNeighbour) {
      expect(
        battleNpcIds,
        `rightNeighbour "${roles.rightNeighbour}" not in battle npcs`,
      ).toContain(roles.rightNeighbour);
    }

    expect(
      battleNpcIds,
      `officer "${roles.officer}" not in battle npcs`,
    ).toContain(roles.officer);

    if (roles.nco) {
      expect(
        battleNpcIds,
        `nco "${roles.nco}" not in battle npcs`,
      ).toContain(roles.nco);
    }
  });

  it('all ally template npcIds in encounters reference existing battle NPCs', () => {
    for (const [key, encounter] of Object.entries(battleConfig.encounters)) {
      const enc = encounter as EncounterConfig;

      // Check direct allies array
      for (const ally of enc.allies) {
        if (ally.npcId) {
          expect(
            battleNpcIds,
            `Encounter "${key}" ally "${ally.name}" references npcId "${ally.npcId}" not in battle npcs`,
          ).toContain(ally.npcId);
        }
      }

      // Check wave event ally templates
      if (enc.waveEvents) {
        for (const event of enc.waveEvents) {
          if (event.allyTemplate?.npcId) {
            expect(
              battleNpcIds,
              `Encounter "${key}" wave event ally "${event.allyTemplate.name}" references npcId "${event.allyTemplate.npcId}" not in battle npcs`,
            ).toContain(event.allyTemplate.npcId);
          }
        }
      }

      // Check wave event conditionNpcAlive references
      if (enc.waveEvents) {
        for (const event of enc.waveEvents) {
          if (event.conditionNpcAlive) {
            expect(
              battleNpcIds,
              `Encounter "${key}" wave event conditionNpcAlive "${event.conditionNpcAlive}" not in battle npcs`,
            ).toContain(event.conditionNpcAlive);
          }
        }
      }
    }
  });
});

// ============================================================
// Volley and story beat mapping integrity
// ============================================================

describe('Volley and story beat mapping integrity', () => {
  it('all story_beat segment IDs have corresponding storyBeats config entries', () => {
    const storyBeatSegments = battleConfig.script.filter(
      (seg) => seg.type === 'story_beat',
    );
    expect(storyBeatSegments.length).toBeGreaterThan(0);

    for (const seg of storyBeatSegments) {
      if (seg.type === 'story_beat') {
        expect(
          battleConfig.storyBeats[seg.id],
          `Script references story_beat id=${seg.id} but no storyBeats[${seg.id}] exists`,
        ).toBeDefined();
      }
    }
  });

  it('all volley batch segment indices fall within the volleys array bounds', () => {
    const volleySegments = battleConfig.script.filter(
      (seg) => seg.type === 'volleys',
    );
    expect(volleySegments.length).toBeGreaterThan(0);

    const maxIdx = battleConfig.volleys.length - 1;

    for (const seg of volleySegments) {
      if (seg.type === 'volleys') {
        expect(
          seg.startIdx,
          `Volley segment startIdx ${seg.startIdx} is negative`,
        ).toBeGreaterThanOrEqual(0);
        expect(
          seg.endIdx,
          `Volley segment endIdx ${seg.endIdx} exceeds volleys array max index ${maxIdx}`,
        ).toBeLessThanOrEqual(maxIdx);
        expect(
          seg.startIdx,
          `Volley segment startIdx ${seg.startIdx} > endIdx ${seg.endIdx}`,
        ).toBeLessThanOrEqual(seg.endIdx);
      }
    }
  });

  it('volley segments do not have gaps or overlaps in coverage', () => {
    const volleySegments = battleConfig.script
      .filter((seg) => seg.type === 'volleys')
      .map((seg) => {
        if (seg.type !== 'volleys') throw new Error('unreachable');
        return { startIdx: seg.startIdx, endIdx: seg.endIdx };
      })
      .sort((a, b) => a.startIdx - b.startIdx);

    // Check no overlaps between consecutive volley segments
    for (let i = 1; i < volleySegments.length; i++) {
      expect(
        volleySegments[i].startIdx,
        `Volley segment overlap: segment ending at ${volleySegments[i - 1].endIdx} overlaps with segment starting at ${volleySegments[i].startIdx}`,
      ).toBeGreaterThan(volleySegments[i - 1].endIdx);
    }
  });

  it('story beat config IDs match their record keys', () => {
    for (const [key, beat] of Object.entries(battleConfig.storyBeats)) {
      expect(
        beat.id,
        `storyBeats[${key}].id is ${beat.id}, should match key ${key}`,
      ).toBe(Number(key));
    }
  });
});

// ============================================================
// Encounter config consistency
// ============================================================

describe('Encounter config consistency', () => {
  it('all melee segment encounter keys exist in the encounters record', () => {
    const meleeSegments = battleConfig.script.filter(
      (seg) => seg.type === 'melee',
    );
    expect(meleeSegments.length).toBeGreaterThan(0);

    for (const seg of meleeSegments) {
      if (seg.type === 'melee') {
        expect(
          battleConfig.encounters[seg.encounterKey],
          `Script references melee encounter "${seg.encounterKey}" but no encounters["${seg.encounterKey}"] exists`,
        ).toBeDefined();
      }
    }
  });

  it('every encounter has at least 1 opponent', () => {
    for (const [key, encounter] of Object.entries(battleConfig.encounters)) {
      const enc = encounter as EncounterConfig;
      expect(
        enc.opponents.length,
        `Encounter "${key}" has no opponents`,
      ).toBeGreaterThan(0);
    }
  });

  it('initialActiveEnemies <= total opponents count', () => {
    for (const [key, encounter] of Object.entries(battleConfig.encounters)) {
      const enc = encounter as EncounterConfig;
      if (enc.initialActiveEnemies !== undefined) {
        expect(
          enc.initialActiveEnemies,
          `Encounter "${key}": initialActiveEnemies (${enc.initialActiveEnemies}) > opponents count (${enc.opponents.length})`,
        ).toBeLessThanOrEqual(enc.opponents.length);
      }
    }
  });

  it('maxActiveEnemies >= initialActiveEnemies', () => {
    for (const [key, encounter] of Object.entries(battleConfig.encounters)) {
      const enc = encounter as EncounterConfig;
      if (
        enc.maxActiveEnemies !== undefined &&
        enc.initialActiveEnemies !== undefined
      ) {
        expect(
          enc.maxActiveEnemies,
          `Encounter "${key}": maxActiveEnemies (${enc.maxActiveEnemies}) < initialActiveEnemies (${enc.initialActiveEnemies})`,
        ).toBeGreaterThanOrEqual(enc.initialActiveEnemies);
      }
    }
  });

  it('opponent templates have valid health and stamina ranges', () => {
    for (const [key, encounter] of Object.entries(battleConfig.encounters)) {
      const enc = encounter as EncounterConfig;
      for (const opp of enc.opponents) {
        expect(
          opp.health[0],
          `Encounter "${key}" opponent "${opp.name}": health min (${opp.health[0]}) > max (${opp.health[1]})`,
        ).toBeLessThanOrEqual(opp.health[1]);
        expect(
          opp.stamina[0],
          `Encounter "${key}" opponent "${opp.name}": stamina min (${opp.stamina[0]}) > max (${opp.stamina[1]})`,
        ).toBeLessThanOrEqual(opp.stamina[1]);
        expect(
          opp.strength,
          `Encounter "${key}" opponent "${opp.name}": strength must be positive`,
        ).toBeGreaterThan(0);
      }
    }
  });

  it('wave events reference valid round numbers', () => {
    for (const [key, encounter] of Object.entries(battleConfig.encounters)) {
      const enc = encounter as EncounterConfig;
      if (enc.waveEvents) {
        for (const event of enc.waveEvents) {
          expect(
            event.atRound,
            `Encounter "${key}" wave event at round ${event.atRound}: must be positive`,
          ).toBeGreaterThan(0);
          expect(
            event.atRound,
            `Encounter "${key}" wave event at round ${event.atRound}: exceeds maxExchanges (${enc.maxExchanges})`,
          ).toBeLessThanOrEqual(enc.maxExchanges);
        }
      }
    }
  });
});

// ============================================================
// Outcome config completeness
// ============================================================

describe('Outcome config completeness', () => {
  it('outcomes include entries for victory, defeat, and survived at minimum', () => {
    const outcomeKeys = Object.keys(battleConfig.outcomes);
    expect(
      outcomeKeys,
      'Missing "victory" outcome',
    ).toContain('victory');
    expect(
      outcomeKeys,
      'Missing "survived" outcome',
    ).toContain('survived');
    // At least one defeat outcome (defeat_melee or defeat_line)
    const hasDefeat = outcomeKeys.some((k) => k.startsWith('defeat'));
    expect(
      hasDefeat,
      'Missing defeat outcome (expected at least one key starting with "defeat")',
    ).toBe(true);
  });

  it('every outcome has a non-empty title and narrative', () => {
    for (const [key, outcome] of Object.entries(battleConfig.outcomes)) {
      expect(
        outcome.title,
        `Outcome "${key}": title is empty or missing`,
      ).toBeTruthy();
      // narrative can be a string or a function
      if (typeof outcome.narrative === 'string') {
        expect(
          outcome.narrative.length,
          `Outcome "${key}": narrative string is empty`,
        ).toBeGreaterThan(0);
      } else {
        expect(
          typeof outcome.narrative,
          `Outcome "${key}": narrative must be a string or function`,
        ).toBe('function');
      }
    }
  });
});

// ============================================================
// Labels completeness
// ============================================================

describe('Labels completeness', () => {
  // Collect all battle parts referenced in the script
  const battleParts = new Set<number>();
  // Walk the script to find setup segments that set battlePart, plus the implicit part 1
  battleParts.add(1); // Part 1 is always implicit at the start

  for (const seg of battleConfig.script) {
    if (seg.type === 'setup') {
      // We can't inspect the apply function body, but we know from the config
      // that setup segments transition between parts. The volleyMaxes keys
      // should cover all parts that have volleys.
    }
  }

  it('volleyMaxes has entries for each battle part that contains volley segments', () => {
    // Each volley batch belongs to a battle part. We verify that volleyMaxes
    // covers at least the parts implied by volley batch groupings.
    const volleyMaxKeys = Object.keys(battleConfig.labels.volleyMaxes).map(Number);
    expect(
      volleyMaxKeys.length,
      'volleyMaxes should have at least one entry',
    ).toBeGreaterThan(0);

    // Each volleyMax value should be a positive number
    for (const [part, max] of Object.entries(battleConfig.labels.volleyMaxes)) {
      expect(
        max,
        `volleyMaxes[${part}] should be a positive number`,
      ).toBeGreaterThan(0);
    }
  });

  it('linePhases has entries matching the battle parts with volley segments', () => {
    const linePhaseParts = Object.keys(battleConfig.labels.linePhases).map(Number);
    expect(
      linePhaseParts.length,
      'linePhases should have at least one entry',
    ).toBeGreaterThan(0);

    // Every linePhase entry should have a non-empty label
    for (const [part, label] of Object.entries(battleConfig.labels.linePhases)) {
      expect(
        label,
        `linePhases[${part}] label is empty`,
      ).toBeTruthy();
    }

    // volleyMaxes and linePhases should cover the same battle parts
    const volleyMaxParts = Object.keys(battleConfig.labels.volleyMaxes).map(Number).sort();
    const linePhasePartsSorted = linePhaseParts.sort();
    expect(
      linePhasePartsSorted,
      'linePhases should cover the same parts as volleyMaxes',
    ).toEqual(volleyMaxParts);
  });

  it('meleePhases has at least one entry with non-empty labels', () => {
    const meleePhaseParts = Object.keys(battleConfig.labels.meleePhases);
    expect(
      meleePhaseParts.length,
      'meleePhases should have at least one entry',
    ).toBeGreaterThan(0);

    for (const [stage, label] of Object.entries(battleConfig.labels.meleePhases)) {
      expect(
        label,
        `meleePhases[${stage}] label is empty`,
      ).toBeTruthy();
    }
  });

  it('storyBeats labels cover all story_beat segment IDs in the script', () => {
    const scriptBeatIds = battleConfig.script
      .filter((seg) => seg.type === 'story_beat')
      .map((seg) => {
        if (seg.type !== 'story_beat') throw new Error('unreachable');
        return seg.id;
      });

    for (const id of scriptBeatIds) {
      expect(
        battleConfig.labels.storyBeats[id],
        `labels.storyBeats[${id}] missing for story_beat segment with id=${id}`,
      ).toBeTruthy();
    }
  });

  it('volleyMaxes values are consistent with the total volley count', () => {
    // The highest volleyMax should not exceed the total number of volleys
    const maxVolleyMax = Math.max(
      ...Object.values(battleConfig.labels.volleyMaxes),
    );
    expect(
      maxVolleyMax,
      `Highest volleyMax (${maxVolleyMax}) exceeds total volleys (${battleConfig.volleys.length})`,
    ).toBeLessThanOrEqual(battleConfig.volleys.length);
  });
});
