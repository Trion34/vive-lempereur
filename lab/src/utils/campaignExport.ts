import type { CampaignChapter, ChapterNode, CampEventData, NPCAssignment } from '../stores/campaignEditorStore';
import type { CampaignDef, CampaignNode, VNSceneDef, DeclarativeForcedEventConfig, DeclarativeRandomEventConfig } from '@game/data/campaigns/types';
import { CampEventCategory, NPCRole, MilitaryRank } from '@game/types';
import type { NumericStatKey, AttributeId } from '@game/types';

export type { NPCAssignment } from '../stores/campaignEditorStore';

/* ------------------------------------------------------------------ */
/*  TypeScript scaffold generation                                     */
/* ------------------------------------------------------------------ */

export interface ExportResult {
  typescript: string;
  warnings: string[];
  stats: { camps: number; interludes: number; battles: number; totalNodes: number };
}

export function generateCampaignDefScaffold(
  chapters: CampaignChapter[],
  campaignId: string,
  campaignTitle: string,
  campEvents?: Record<string, CampEventData>,
): ExportResult {
  const warnings: string[] = [];
  const allNodes = chapters.flatMap((ch) => ch.nodes);
  const stats = {
    camps: allNodes.filter((n) => n.type === 'camp').length,
    interludes: allNodes.filter((n) => n.type === 'interlude').length,
    battles: allNodes.filter((n) => n.type === 'battle').length,
    totalNodes: allNodes.filter((n) => n.type !== 'line-combat' && n.type !== 'vn').length,
  };

  // Check for warnings
  for (const ch of chapters) {
    for (const n of ch.nodes) {
      if (n.type === 'camp' && !n.details.actions) {
        warnings.push(`Camp node "${n.label}" (${n.id}) is missing "actions" detail`);
      }
    }
    // Check consecutive same-type nodes
    for (let i = 0; i < ch.nodes.length - 1; i++) {
      if (ch.nodes[i].type === ch.nodes[i + 1].type) {
        warnings.push(
          `Consecutive ${ch.nodes[i].type} nodes in Ch.${ch.number}: "${ch.nodes[i].label}" and "${ch.nodes[i + 1].label}"`,
        );
      }
    }
  }

  // Check interludes without adjacent battles
  for (const ch of chapters) {
    for (let i = 0; i < ch.nodes.length; i++) {
      const n = ch.nodes[i];
      if (n.type !== 'interlude') continue;
      const prev = ch.nodes[i - 1];
      const next = ch.nodes[i + 1];
      const hasBattleNeighbour = (prev?.type === 'battle') || (next?.type === 'battle');
      if (!hasBattleNeighbour) {
        // Also check cross-chapter neighbours
        const chIdx = chapters.indexOf(ch);
        const prevChNodes = chIdx > 0 ? chapters[chIdx - 1].nodes : [];
        const prevChLast = prevChNodes.length > 0 ? prevChNodes[prevChNodes.length - 1] : undefined;
        const nextChFirst = chIdx < chapters.length - 1 ? chapters[chIdx + 1].nodes[0] : undefined;
        if (i === 0 && prevChLast?.type === 'battle') continue;
        if (i === ch.nodes.length - 1 && nextChFirst?.type === 'battle') continue;
        if (!hasBattleNeighbour) {
          warnings.push(`Interlude "${n.label}" (${n.id}) has no adjacent battle node`);
        }
      }
    }
  }

  // Build sequence
  const sequence = allNodes.map((n) => nodeToSequenceEntry(n)).filter((s): s is string => s !== null);

  // Build camp configs
  const campConfigs: string[] = [];
  for (const n of allNodes) {
    if (n.type !== 'camp') continue;
    campConfigs.push(generateCampConfigStub(n, campEvents?.[n.id]));
  }

  // Build interlude defs
  const interludeDefs: string[] = [];
  for (let ni = 0; ni < allNodes.length; ni++) {
    const n = allNodes[ni];
    if (n.type !== 'interlude') continue;
    // Prefer explicit fromBattle/toBattle from node details, fall back to auto-detected
    const fromBattle = (typeof n.details.fromBattle === 'string' && n.details.fromBattle)
      ? n.details.fromBattle : findAdjacentBattle(allNodes, ni, 'before');
    const toBattle = (typeof n.details.toBattle === 'string' && n.details.toBattle)
      ? n.details.toBattle : findAdjacentBattle(allNodes, ni, 'after');
    interludeDefs.push(generateInterludeStub(n, fromBattle, toBattle));
  }

  // Assemble TypeScript
  const lines: string[] = [];
  lines.push(`import { registerCampaignDef } from '../registry';`);
  lines.push(`import type { CampaignDef } from '../types';`);
  lines.push(`import { CampEventCategory } from '../../types';`);
  lines.push(``);
  lines.push(`// Generated from Campaign Editor`);
  lines.push(`// Campaign: ${escapeStr(campaignTitle)}`);
  lines.push(`// ${stats.totalNodes} nodes (${stats.camps} camps, ${stats.interludes} interludes, ${stats.battles} battles)`);
  lines.push(``);
  lines.push(`const CAMPAIGN: CampaignDef = {`);
  lines.push(`  id: '${escapeStr(campaignId)}',`);
  lines.push(`  title: '${escapeStr(campaignTitle)}',`);
  lines.push(``);
  lines.push(`  // TODO: Define NPC templates`);
  lines.push(`  npcs: [],`);
  lines.push(``);
  lines.push(`  sequence: [`);
  for (const entry of sequence) {
    lines.push(`    ${entry},`);
  }
  lines.push(`  ],`);
  lines.push(``);
  lines.push(`  camps: {`);
  for (const cfg of campConfigs) {
    lines.push(cfg);
  }
  lines.push(`  },`);
  lines.push(``);
  lines.push(`  interludes: {`);
  for (const def of interludeDefs) {
    lines.push(def);
  }
  lines.push(`  },`);
  lines.push(``);
  lines.push(`  // TODO: Define replacement pool`);
  lines.push(`  replacementPool: [],`);
  lines.push(`};`);
  lines.push(``);
  lines.push(`registerCampaignDef(CAMPAIGN);`);

  return { typescript: lines.join('\n'), warnings, stats };
}

function nodeToSequenceEntry(node: ChapterNode): string | null {
  switch (node.type) {
    case 'interlude': return `{ type: 'interlude', interludeId: '${escapeStr(node.id)}' }`;
    case 'camp': return `{ type: 'camp', campId: '${escapeStr(node.id)}' }`;
    case 'battle': return `{ type: 'battle', battleId: '${escapeStr(node.id)}' }`;
    case 'vn': return `{ type: 'vn', sceneId: '${escapeStr(node.id)}' }`;
    case 'line-combat': return null; // Lab-only — not part of game CampaignNode type
  }
}

function generateCampConfigStub(node: ChapterNode, eventData?: CampEventData): string {
  const actions = typeof node.details.actions === 'number' ? node.details.actions : 12;
  const weather = typeof node.details.weather === 'string' ? node.details.weather : 'clear';
  const supply = typeof node.details.supply === 'string' ? node.details.supply : 'adequate';
  const lines = [
    `    '${escapeStr(node.id)}': {`,
    `      id: '${escapeStr(node.id)}',`,
    `      title: '${escapeStr(node.label)}',`,
    `      actionsTotal: ${actions},`,
    `      weather: '${escapeStr(weather)}',`,
    `      supplyLevel: '${escapeStr(supply)}',`,
    `      openingNarrative: '', // TODO: Write opening narrative`,
  ];

  if (eventData && eventData.forcedEvents.length > 0) {
    lines.push(`      // --- Forced Events (${eventData.forcedEvents.length} declarative) ---`);
    lines.push(`      forcedEvents: [`);
    for (const evt of eventData.forcedEvents) {
      lines.push(`        { kind: 'declarative', id: '${escapeStr(evt.id)}', triggerAt: ${evt.triggerAt}, event: {`);
      lines.push(`          id: '${escapeStr(evt.id)}', title: '${escapeStr(evt.title)}',`);
      lines.push(`          category: CampEventCategory.${capitalize(evt.category)},`);
      lines.push(`          narrative: '${escapeStr(evt.narrative)}',`);
      lines.push(`          choices: [${evt.choices.map((c) => `{ id: '${escapeStr(c.id)}', label: '${escapeStr(c.label)}', description: '${escapeStr(c.description)}', pass: { narrative: '' } }`).join(', ')}],`);
      lines.push(`        } },`);
    }
    lines.push(`      ],`);
  } else {
    lines.push(`      forcedEvents: [],`);
  }

  if (eventData && eventData.randomEvents.length > 0) {
    lines.push(`      randomEventChance: ${eventData.randomEventChance},`);
    lines.push(`      randomEvents: [`);
    for (const evt of eventData.randomEvents) {
      lines.push(`        { kind: 'declarative', id: '${escapeStr(evt.id)}', weight: ${evt.weight}, event: {`);
      lines.push(`          id: '${escapeStr(evt.id)}', title: '${escapeStr(evt.title)}',`);
      lines.push(`          category: CampEventCategory.${capitalize(evt.category)},`);
      lines.push(`          narrative: '${escapeStr(evt.narrative)}',`);
      lines.push(`          choices: [${evt.choices.map((c) => `{ id: '${escapeStr(c.id)}', label: '${escapeStr(c.label)}', description: '${escapeStr(c.description)}', pass: { narrative: '' } }`).join(', ')}],`);
      lines.push(`        } },`);
    }
    lines.push(`      ],`);
  } else {
    lines.push(`      randomEvents: [],`);
  }

  lines.push(`    },`);
  return lines.join('\n');
}

function generateInterludeStub(node: ChapterNode, fromBattle: string, toBattle: string): string {
  const lines = [
    `    '${escapeStr(node.id)}': {`,
    `      fromBattle: '${escapeStr(fromBattle)}',`,
    `      toBattle: '${escapeStr(toBattle)}',`,
    `      narrative: [], // TODO: Write narrative chunks`,
    `      splashText: '${escapeStr(node.label)}',`,
    `    },`,
  ];
  return lines.join('\n');
}

function findAdjacentBattle(nodes: ChapterNode[], index: number, direction: 'before' | 'after'): string {
  const step = direction === 'before' ? -1 : 1;
  for (let i = index + step; i >= 0 && i < nodes.length; i += step) {
    if (nodes[i].type === 'battle') return nodes[i].id;
  }
  return '';
}

function escapeStr(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/* ------------------------------------------------------------------ */
/*  Runtime campaign builder (lab → game data at runtime)              */
/* ------------------------------------------------------------------ */

const CATEGORY_MAP: Record<string, CampEventCategory> = {
  disease: CampEventCategory.Disease,
  desertion: CampEventCategory.Desertion,
  weather: CampEventCategory.Weather,
  supply: CampEventCategory.Supply,
  interpersonal: CampEventCategory.Interpersonal,
  orders: CampEventCategory.Orders,
  rumour: CampEventCategory.Rumour,
};

const ROLE_MAP: Record<string, NPCRole> = {
  NCO: NPCRole.NCO,
  Officer: NPCRole.Officer,
  Neighbour: NPCRole.Neighbour,
};

const RANK_MAP: Record<string, MilitaryRank> = {
  private: MilitaryRank.Private,
  corporal: MilitaryRank.Corporal,
  sergeant: MilitaryRank.Sergeant,
  lieutenant: MilitaryRank.Lieutenant,
  captain: MilitaryRank.Captain,
};

/**
 * Build a runtime CampaignDef from lab editor data.
 * Used for live testing — lab pushes this to the game's campaign registry.
 */
export function buildRuntimeCampaignDef(
  campaignId: string,
  campaignTitle: string,
  chapters: CampaignChapter[],
  npcs: NPCAssignment[],
  interludeNarratives: Record<string, { chunks: string[]; splashText: string }>,
  campEvents: Record<string, CampEventData>,
  vnScenes?: Record<string, VNSceneDef>,
): CampaignDef {
  const allNodes = chapters.flatMap((ch) => ch.nodes);

  // Build sequence
  const sequence: CampaignNode[] = [];
  for (const n of allNodes) {
    const entry = nodeToRuntimeEntry(n);
    if (entry) sequence.push(entry);
  }

  // Build camps
  const camps: CampaignDef['camps'] = {};
  for (const n of allNodes) {
    if (n.type !== 'camp') continue;
    const actions = typeof n.details.actions === 'number' ? n.details.actions : 12;
    const weather = typeof n.details.weather === 'string' ? n.details.weather : 'clear';
    const supply = typeof n.details.supply === 'string' ? n.details.supply : 'adequate';
    const eventData = campEvents[n.id];

    camps[n.id] = {
      id: n.id,
      title: n.label,
      actionsTotal: actions,
      weather: weather as 'clear' | 'rain' | 'snow' | 'cold',
      supplyLevel: supply as 'abundant' | 'adequate' | 'scarce' | 'critical',
      openingNarrative: n.description || '',
      forcedEvents: eventData ? eventData.forcedEvents.map((e) => blueprintToDeclarativeForced(e)) : [],
      randomEvents: eventData ? eventData.randomEvents.map((e) => blueprintToDeclarativeRandom(e)) : [],
      randomEventChance: eventData?.randomEventChance ?? 0.4,
    };
  }

  // Build interludes
  const interludes: CampaignDef['interludes'] = {};
  for (let ni = 0; ni < allNodes.length; ni++) {
    const n = allNodes[ni];
    if (n.type !== 'interlude') continue;
    const fromBattle = findAdjacentBattle(allNodes, ni, 'before');
    const toBattle = findAdjacentBattle(allNodes, ni, 'after');
    const narrativeData = interludeNarratives[n.id];
    interludes[n.id] = {
      fromBattle,
      toBattle,
      narrative: narrativeData?.chunks ?? [],
      splashText: narrativeData?.splashText ?? n.label,
    };
  }

  // Build NPC templates
  const npcTemplates = npcs
    .filter((a) => a.status === 'active')
    .map((a) => ({
      id: a.npcId,
      name: a.name,
      role: ROLE_MAP[a.role] ?? NPCRole.Neighbour,
      rank: RANK_MAP[a.rank] ?? MilitaryRank.Private,
      personality: a.personality,
      socializeNarrative: a.socializeNarrative || undefined,
      baseStats: a.baseStats,
    }));

  const replacementPool = npcs
    .filter((a) => a.status === 'replaced')
    .map((a) => ({
      id: a.npcId,
      name: a.name,
      role: ROLE_MAP[a.role] ?? NPCRole.Neighbour,
      rank: RANK_MAP[a.rank] ?? MilitaryRank.Private,
      personality: a.personality,
      baseStats: a.baseStats,
    }));

  return {
    id: campaignId,
    title: campaignTitle,
    npcs: npcTemplates,
    sequence,
    camps,
    interludes,
    vnScenes,
    replacementPool,
  };
}

function nodeToRuntimeEntry(node: ChapterNode): CampaignNode | null {
  switch (node.type) {
    case 'interlude': return { type: 'interlude', interludeId: node.id };
    case 'camp': return { type: 'camp', campId: node.id };
    case 'battle': return { type: 'battle', battleId: node.id };
    case 'vn': return { type: 'vn', sceneId: node.id };
    case 'line-combat': return null;
  }
}

function blueprintToDeclarativeForced(
  bp: CampEventData['forcedEvents'][number],
): DeclarativeForcedEventConfig {
  return {
    kind: 'declarative',
    id: bp.id,
    triggerAt: bp.triggerAt,
    event: {
      id: bp.id,
      title: bp.title,
      category: CATEGORY_MAP[bp.category] ?? CampEventCategory.Interpersonal,
      narrative: bp.narrative,
      choices: bp.choices.map((c) => ({
        id: c.id,
        label: c.label,
        description: c.description,
        statCheck: c.statCheck
          ? { stat: c.statCheck.stat as NumericStatKey, difficulty: c.statCheck.difficulty }
          : undefined,
        lock: c.lock
          ? {
              requireAttribute: c.lock.requireAttribute as AttributeId | undefined,
              requireSous: c.lock.requireSous,
              lockedMessage: c.lock.lockedMessage,
            }
          : undefined,
        pass: c.pass
          ? {
              narrative: c.pass.narrative,
              statChanges: c.pass.statChanges as Partial<Record<NumericStatKey, number>> | undefined,
              moraleChange: c.pass.moraleChange,
              staminaChange: c.pass.staminaChange,
              healthChange: c.pass.healthChange,
              sousChange: c.pass.sousChange,
              virtueChange: c.pass.virtueChange,
              npcRelationshipChanges: c.pass.npcRelationshipChanges,
              flagChanges: c.pass.flagChanges,
              playerFields: c.pass.playerFields as Partial<Record<'frontRank', boolean>> | undefined,
            }
          : { narrative: '' },
        fail: c.fail
          ? {
              narrative: c.fail.narrative,
              statChanges: c.fail.statChanges as Partial<Record<NumericStatKey, number>> | undefined,
              moraleChange: c.fail.moraleChange,
              staminaChange: c.fail.staminaChange,
              healthChange: c.fail.healthChange,
              sousChange: c.fail.sousChange,
              virtueChange: c.fail.virtueChange,
              npcRelationshipChanges: c.fail.npcRelationshipChanges,
              flagChanges: c.fail.flagChanges,
              playerFields: c.fail.playerFields as Partial<Record<'frontRank', boolean>> | undefined,
            }
          : undefined,
      })),
    },
  };
}

function blueprintToDeclarativeRandom(
  bp: CampEventData['randomEvents'][number],
): DeclarativeRandomEventConfig {
  const forced = blueprintToDeclarativeForced({ ...bp, triggerAt: 0 });
  return {
    kind: 'declarative',
    id: forced.id,
    weight: bp.weight,
    event: forced.event,
  };
}

