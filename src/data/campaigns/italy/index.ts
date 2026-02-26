import { MilitaryRank, NPCRole } from '../../../types/enums';
import { registerCampaignDef } from '../registry';
import type { CampaignDef } from '../types';

export const ITALY_CAMPAIGN: CampaignDef = {
  id: 'italy',
  title: 'The Italian Campaign, 1796\u20131797',
  battles: [
    {
      battleId: 'montenotte',
      title: 'Battle of Montenotte',
      subtitle: 'April 12, 1796 \u2014 The first victory',
      implemented: false,
    },
    {
      battleId: 'lodi',
      title: 'Battle of Lodi',
      subtitle: 'May 10, 1796 \u2014 The bridge at Lodi',
      implemented: false,
    },
    {
      battleId: 'castiglione',
      title: 'Battle of Castiglione',
      subtitle: 'August 5, 1796 \u2014 Wurmser\u2019s first offensive',
      implemented: false,
    },
    {
      battleId: 'arcole',
      title: 'Battle of Arcole',
      subtitle: 'November 15\u201317, 1796 \u2014 Three days on the bridge',
      implemented: false,
    },
    {
      battleId: 'rivoli',
      title: 'Battle of Rivoli',
      subtitle: 'January 14\u201315, 1797 \u2014 The decisive blow',
      implemented: true,
    },
    {
      battleId: 'mantua',
      title: 'Siege of Mantua',
      subtitle: 'February 2, 1797 \u2014 The fortress falls',
      implemented: false,
    },
  ],

  interludes: {
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
