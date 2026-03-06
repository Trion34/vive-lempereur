import { MilitaryRank, NPCRole } from '../../../types';
import { registerCampaignDef } from '../registry';
import type { CampaignDef } from '../types';
import {
  RIVOLI_CAMP_META,
  RIVOLI_PRE_BATTLE_FORCED_EVENTS,
  RIVOLI_RANDOM_EVENTS,
} from '../../battles/rivoli/camp';

export const ITALY_NPC_TEMPLATES: CampaignDef['npcs'] = [
  {
    id: 'pierre',
    name: 'Pierre',
    role: NPCRole.Neighbour,
    rank: MilitaryRank.Private,
    personality: 'A veteran of Arcole and Lodi. Quiet, steady, unshakeable.',
    socializeNarrative: `Pierre is quiet as always, but tonight he shares his tobacco. "You did well today," he says. From him, that's a speech.`,
    baseStats: { valor: 55, morale: 90, maxMorale: 100, relationship: 60 },
  },
  {
    id: 'jean-baptiste',
    name: 'Jean-Baptiste',
    role: NPCRole.Neighbour,
    rank: MilitaryRank.Private,
    personality: 'A young conscript from a bakery in Lyon. Nervous but loyal.',
    socializeNarrative: `Jean-Baptiste talks rapidly about home \u2014 the bakery, the river, his sister's cat. You listen. Sometimes listening is enough.`,
    baseStats: { valor: 20, morale: 70, maxMorale: 85, relationship: 40 },
  },
  {
    id: 'duval',
    name: 'Sergeant Duval',
    role: NPCRole.NCO,
    rank: MilitaryRank.Sergeant,
    personality: 'A grizzled NCO who has seen too many campaigns. Fair but demanding.',
    socializeNarrative: `Sergeant Duval grumbles about the rations, the officers, the war. But there's a grudging warmth underneath. "At least you're not useless," he says.`,
    baseStats: { valor: 65, morale: 95, maxMorale: 100, relationship: 20 },
  },
  {
    id: 'leclerc',
    name: 'Captain Leclerc',
    role: NPCRole.Officer,
    rank: MilitaryRank.Captain,
    personality: 'An ambitious officer who dreams of glory. Charismatic but self-serving.',
    socializeNarrative: `Captain Leclerc speaks of glory and promotion. His eyes shine in the firelight. "We'll make captain yet," he says. He means himself, but includes you in the dream.`,
    baseStats: { valor: 60, morale: 90, maxMorale: 100, relationship: 30 },
  },
];

const ITALY_CAMPAIGN: CampaignDef = {
  id: 'italy',
  title: 'The Italian Campaign, 1796\u20131797',

  npcs: ITALY_NPC_TEMPLATES,

  sequence: [
    { type: 'interlude', interludeId: 'italy-prologue' },
    { type: 'camp', campId: 'eve-of-rivoli' },
    { type: 'battle', battleId: 'rivoli' },
    { type: 'camp', campId: 'after-rivoli' },
    { type: 'interlude', interludeId: 'rivoli-mantua' },
    { type: 'battle', battleId: 'mantua' },
  ],

  camps: {
    'eve-of-rivoli': {
      id: 'eve-of-rivoli',
      title: 'Eve of Rivoli',
      actionsTotal: RIVOLI_CAMP_META.actionsTotal,
      weather: RIVOLI_CAMP_META.weather,
      supplyLevel: RIVOLI_CAMP_META.supplyLevel,
      openingNarrative: RIVOLI_CAMP_META.openingNarrative,
      forcedEvents: RIVOLI_PRE_BATTLE_FORCED_EVENTS,
      randomEvents: RIVOLI_RANDOM_EVENTS,
    },
    'after-rivoli': {
      id: 'after-rivoli',
      title: 'After Rivoli',
      actionsTotal: 8,
      weather: 'cold',
      supplyLevel: 'scarce',
      openingNarrative:
        'The guns have fallen silent. The plateau is yours, but the cost is written in blood and exhaustion. The wounded are carried to the surgeons. The dead are gathered. There is no celebration — only the grim satisfaction of survival.',
      forcedEvents: [],
      randomEvents: [],
    },
  },

  interludes: {
    'italy-prologue': {
      fromBattle: '',
      toBattle: 'rivoli',
      narrative: [
        'Italy. January, 1797.',

        'For ten months, General Bonaparte has led the Army of Italy on a campaign that has stunned Europe. Montenotte. Lodi. Castiglione. Arcole. Each victory bought with blood and boot leather.\n\n' +
          'The army that was starving and barefoot in the spring now holds all of northern Italy in its grip.',

        'But the war is not won. The great fortress of Mantua remains under siege, its Austrian garrison slowly starving. And now Field Marshal Alvinczi marches south with twenty-eight thousand men to break the siege and drive the French into the sea.',

        'General Joubert\u2019s division \u2014 your division \u2014 holds the plateau above the village of Rivoli, where the Adige valley opens onto the plains of northern Italy. Ten thousand men against twenty-eight thousand.\n\n' +
          'If the line breaks here, Mantua is relieved and the campaign is lost.',

        'You are a soldier of the 14th demi-brigade de ligne. Bonaparte rides through the night to take command. Mass\u00e9na\u2019s division marches behind him.\n\n' +
          'Until they arrive, the plateau is yours to hold.',
      ],
      splashText: 'The Italian Campaign',
    },
    'montenotte-lodi': {
      fromBattle: 'montenotte',
      toBattle: 'lodi',
      narrative: [
        'The Austrians reeled from Montenotte, but General Bonaparte allowed no rest. The army pressed eastward through Piedmont, forcing Sardinia to sue for peace within a fortnight.',
        'Word spread through the ranks: a bridge at Lodi guarded the road to Milan. The Austrians had massed their rearguard there, daring the French to cross under fire.',
        'Your company marched through the spring rain, boots caked with Piedmontese mud. Somewhere ahead, cannon echoed across the Po valley.',
      ],
      splashText: 'The March to Lodi',
    },
    'lodi-castiglione': {
      fromBattle: 'lodi',
      toBattle: 'castiglione',
      narrative: [
        'Milan fell without a fight. The army billeted in Lombardy through the summer, but the war was far from over. Austria sent General Wurmser south with fresh troops to relieve the besieged fortress of Mantua.',
        'Bonaparte split his forces to meet the threat. Your regiment received orders to march south along Lake Garda toward Castiglione.',
        'The heat was murderous. Men fell out of the column daily. Those who remained tightened their belts and checked their flints.',
      ],
      splashText: 'Summer in Lombardy',
    },
    'castiglione-arcole': {
      fromBattle: 'castiglione',
      toBattle: 'arcole',
      narrative: [
        'Wurmser had been beaten, but not broken. He regrouped and thrust south again, this time through the Brenta valley. Bonaparte raced to intercept.',
        'Autumn came early to northern Italy. The marshes around Arcole turned to sodden ground, criss-crossed by dykes and narrow bridges. The Austrians held the village, and the only approach was a causeway swept by grapeshot.',
        'Three days of fighting lay ahead. Three days of crossing and re-crossing that accursed bridge.',
      ],
      splashText: 'The Road to Arcole',
    },
    'arcole-rivoli': {
      fromBattle: 'arcole',
      toBattle: 'rivoli',
      narrative: [
        'Winter settled over the camps. Wurmser was bottled up in Mantua, but Austria dispatched yet another army under General Alvinczy. This time they came from the north, through the Adige valley.',
        'Bonaparte chose the plateau above Rivoli to make his stand. The ground favoured defence \u2014 high ridges commanding the approaches, with the river at the enemy\u2019s back.',
        'On the eve of battle you cleaned your musket for the fifth time and tried to sleep. Tomorrow would decide everything.',
      ],
      splashText: 'Winter on the Adige',
    },
    'rivoli-mantua': {
      fromBattle: 'rivoli',
      toBattle: 'mantua',
      narrative: [
        'The Austrians broke at Rivoli. Alvinczy\u2019s army scattered into the mountains, leaving thousands of prisoners and dozens of guns behind.',
        'Bonaparte did not pause. He turned the army south toward Mantua, where Wurmser\u2019s garrison was starving. With Alvinczy defeated, no relief could reach them.',
        'The siege tightened. It was only a matter of time.',
      ],
      splashText: 'The Fall of Mantua',
    },
  },

  replacementPool: [
    {
      id: 'girard',
      name: 'Girard',
      role: NPCRole.Neighbour,
      rank: MilitaryRank.Private,
      personality: 'A quiet conscript from Lyon, steady under fire but slow to warm to strangers.',
      baseStats: { valor: 30, morale: 70, maxMorale: 100, relationship: 20 },
    },
    {
      id: 'moreau',
      name: 'Moreau',
      role: NPCRole.Neighbour,
      rank: MilitaryRank.Private,
      personality: 'A former seminary student who found his calling with a musket. Pious and brave.',
      baseStats: { valor: 35, morale: 80, maxMorale: 100, relationship: 30 },
    },
    {
      id: 'thibault',
      name: 'Thibault',
      role: NPCRole.Neighbour,
      rank: MilitaryRank.Private,
      personality: 'A wiry Gascon with a sharp tongue and sharper bayonet. Fiercely loyal once trust is earned.',
      baseStats: { valor: 45, morale: 75, maxMorale: 100, relationship: 10 },
    },
    {
      id: 'renard',
      name: 'Sergeant Renard',
      role: NPCRole.NCO,
      rank: MilitaryRank.Sergeant,
      personality: 'An old campaigner from the Rhine army. Fair-minded but expects discipline.',
      baseStats: { valor: 55, morale: 90, maxMorale: 100, relationship: 25 },
    },
  ],
};

// Auto-register on import
registerCampaignDef(ITALY_CAMPAIGN);
