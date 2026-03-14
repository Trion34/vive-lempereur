import type { CampaignChapter, ChapterNode, NPCAssignment, CampEventData } from '../stores/campaignEditorStore';
import type { CampaignDef, CampaignNode, CampConfig, InterludeDef, NPCTemplate } from '../../data/campaigns/types';

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
    totalNodes: allNodes.length,
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
  const sequence = allNodes.map((n) => nodeToSequenceEntry(n));

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

function nodeToSequenceEntry(node: ChapterNode): string {
  switch (node.type) {
    case 'interlude': return `{ type: 'interlude', interludeId: '${escapeStr(node.id)}' }`;
    case 'camp': return `{ type: 'camp', campId: '${escapeStr(node.id)}' }`;
    case 'battle': return `{ type: 'battle', battleId: '${escapeStr(node.id)}' }`;
    case 'vn': return `{ type: 'vn', vnId: '${escapeStr(node.id)}' }`;
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
    lines.push(`      // --- Forced Events (${eventData.forcedEvents.length} blueprints) ---`);
    lines.push(`      // TODO: Implement getEvent() and resolveChoice() for each`);
    lines.push(`      forcedEvents: [`);
    for (const evt of eventData.forcedEvents) {
      lines.push(`        // "${escapeStr(evt.title)}" [${evt.category}] triggers at ${evt.triggerAt} actions remaining`);
      lines.push(`        // Choices: ${evt.choices.map((c) => c.label).join(', ') || 'none'}`);
      lines.push(`        { id: '${escapeStr(evt.id)}', triggerAt: ${evt.triggerAt}, getEvent: () => ({ /* TODO */ }), resolveChoice: () => ({ /* TODO */ }) },`);
    }
    lines.push(`      ],`);
  } else {
    lines.push(`      forcedEvents: [], // TODO: Define forced events`);
  }

  if (eventData && eventData.randomEvents.length > 0) {
    lines.push(`      // --- Random Events (${eventData.randomEvents.length} blueprints, chance: ${eventData.randomEventChance}) ---`);
    lines.push(`      randomEventChance: ${eventData.randomEventChance},`);
    lines.push(`      randomEvents: [`);
    for (const evt of eventData.randomEvents) {
      lines.push(`        // "${escapeStr(evt.title)}" [${evt.category}] weight: ${evt.weight}`);
      lines.push(`        // Choices: ${evt.choices.map((c) => c.label).join(', ') || 'none'}`);
      lines.push(`        { id: '${escapeStr(evt.id)}', weight: ${evt.weight}, getEvent: () => ({ /* TODO */ }), resolveChoice: () => ({ /* TODO */ }) },`);
    }
    lines.push(`      ],`);
  } else {
    lines.push(`      randomEvents: [], // TODO: Define random events`);
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

/* ------------------------------------------------------------------ */
/*  Runtime CampaignDef builder (for push-to-game)                     */
/* ------------------------------------------------------------------ */

export function buildRuntimeCampaignDef(
  chapters: CampaignChapter[],
  campaignId: string,
  campaignTitle: string,
  interludeNarratives: Record<string, { chunks: string[]; splashText: string }>,
  npcAssignments: NPCAssignment[],
): CampaignDef {
  const allNodes = chapters.flatMap((ch) => ch.nodes);

  const sequence: CampaignNode[] = allNodes.map((n) => {
    switch (n.type) {
      case 'interlude': return { type: 'interlude' as const, interludeId: n.id };
      case 'camp': return { type: 'camp' as const, campId: n.id };
      case 'battle': return { type: 'battle' as const, battleId: n.id };
      case 'vn': return { type: 'interlude' as const, interludeId: n.id }; // VN maps to interlude for now
    }
  });

  const camps: Record<string, CampConfig> = {};
  for (const n of allNodes) {
    if (n.type !== 'camp') continue;
    camps[n.id] = {
      id: n.id,
      title: n.label,
      actionsTotal: typeof n.details.actions === 'number' ? n.details.actions : 12,
      weather: (typeof n.details.weather === 'string' ? n.details.weather : 'clear') as CampConfig['weather'],
      supplyLevel: (typeof n.details.supply === 'string' ? n.details.supply : 'adequate') as CampConfig['supplyLevel'],
      openingNarrative: '',
      forcedEvents: [],
      randomEvents: [],
    };
  }

  const interludes: Record<string, InterludeDef> = {};
  for (let i = 0; i < allNodes.length; i++) {
    const n = allNodes[i];
    if (n.type !== 'interlude') continue;
    const narrativeData = interludeNarratives[n.id];
    // Prefer explicit fromBattle/toBattle from node details, fall back to auto-detected
    const fromBattle = (typeof n.details.fromBattle === 'string' && n.details.fromBattle)
      ? n.details.fromBattle : findAdjacentBattle(allNodes, i, 'before');
    const toBattle = (typeof n.details.toBattle === 'string' && n.details.toBattle)
      ? n.details.toBattle : findAdjacentBattle(allNodes, i, 'after');
    interludes[n.id] = {
      fromBattle,
      toBattle,
      narrative: narrativeData?.chunks ?? [],
      splashText: narrativeData?.splashText ?? n.label,
    };
  }

  const rankMap: Record<string, NPCTemplate['rank']> = {
    Private: 'private' as NPCTemplate['rank'],
    Corporal: 'corporal' as NPCTemplate['rank'],
    Sergeant: 'sergeant' as NPCTemplate['rank'],
    Lieutenant: 'lieutenant' as NPCTemplate['rank'],
    Captain: 'captain' as NPCTemplate['rank'],
  };

  const roleMap: Record<string, NPCTemplate['role']> = {
    NCO: 'nco' as NPCTemplate['role'],
    Officer: 'officer' as NPCTemplate['role'],
    Neighbour: 'neighbour' as NPCTemplate['role'],
  };

  const npcs: NPCTemplate[] = npcAssignments
    .filter((a) => a.status === 'active')
    .map((a) => ({
      id: a.npcId,
      name: a.name,
      role: roleMap[a.role] ?? ('neighbour' as NPCTemplate['role']),
      rank: rankMap[a.rank ?? 'Private'] ?? ('private' as NPCTemplate['rank']),
      personality: a.personality ?? '',
      socializeNarrative: a.socializeNarrative ?? undefined,
      baseStats: a.baseStats ?? { valor: 40, morale: 80, maxMorale: 100, relationship: 30 },
    }));

  return {
    id: campaignId,
    title: campaignTitle,
    npcs,
    sequence,
    camps,
    interludes,
    replacementPool: [],
  };
}
