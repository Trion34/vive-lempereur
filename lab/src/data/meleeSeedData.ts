import type { MeleeEncounterModule, LabOpponentTemplate, LabAllyTemplate, LabWaveEvent } from '../types/meleeLabTypes';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

let _counter = 0;
function seedUid(): string {
  return `ml-seed-${(++_counter).toString(36)}`;
}

function opp(
  name: string, type: LabOpponentTemplate['type'],
  health: [number, number], stamina: [number, number],
  strength: number, description: string,
): LabOpponentTemplate {
  return { id: seedUid(), name, type, health, stamina, strength, description, notes: '' };
}

function ally(
  name: string, npcId: string,
  health: [number, number], stamina: [number, number],
  strength: number, elan: number, personality: LabAllyTemplate['personality'],
  description: string,
): LabAllyTemplate {
  return { id: seedUid(), name, type: 'named', npcId, health, stamina, strength, elan, personality, description, notes: '' };
}

/* ------------------------------------------------------------------ */
/*  Seed encounters — transcribed from game data                       */
/* ------------------------------------------------------------------ */

export function createSeedEncounters(): MeleeEncounterModule[] {
  _counter = 0; // Reset for deterministic IDs
  const ts = new Date().toISOString();

  // --- Rivoli Terrain ---
  const terrainOpponents: LabOpponentTemplate[] = [
    opp('Austrian conscript', 'conscript', [70, 85], [160, 200], 40,
      "He stumbles through the vineyard wall, white coat torn on the stones. Wide-eyed, shaking. His bayonet weaves like a drunk's sword."),
    opp('Austrian conscript', 'conscript', [65, 80], [150, 190], 40,
      'Another white coat scrambles over the low wall. Young \u2014 impossibly young. His musket is longer than he is tall. He screams as he comes.'),
    opp('Austrian line infantryman', 'line', [80, 95], [180, 240], 50,
      'A career soldier pushes through the gap in the stone wall. Calm enough. Steel levelled, feet planted among the vines. He knows the drill.'),
    opp('Austrian veteran', 'veteran', [95, 115], [200, 260], 65,
      'This one is different. Steady hands, dead eyes, a scar across his jaw from some forgotten battle. He steps over the vineyard wall without hurrying.'),
  ];

  // --- Rivoli Battery (solo) ---
  const batteryOpponents: LabOpponentTemplate[] = [
    opp('Austrian infantry guard', 'line', [80, 95], [180, 240], 50,
      'Infantry assigned to hold the captured battery. He stands between you and the guns, bayonet level. Professional. Determined.'),
    opp('Austrian grenadier', 'veteran', [90, 110], [200, 260], 60,
      'A grenadier from the assault column. Tall, bearskin cap, sabre-bayonet. He fights with the economy of a man who has done this many times before.'),
    opp('Austrian infantry guard', 'line', [75, 90], [170, 220], 48,
      'Another white-coat, fighting to hold the redoubt. Younger than the first. Just as stubborn.'),
    opp('Austrian battery sergeant', 'sergeant', [100, 125], [220, 280], 75,
      'The sergeant who led the assault. A big man with the calm of someone who has stormed positions before. He holds a cavalry sabre. He will not give up these guns.'),
  ];

  // --- Rivoli Battery Skirmish (with allies + waves) ---
  const skirmishOpponents: LabOpponentTemplate[] = [
    opp('Austrian infantry guard', 'line', [80, 95], [180, 240], 50,
      'Infantry assigned to hold the captured battery. Professional.'),
    opp('Austrian grenadier', 'veteran', [90, 110], [200, 260], 60,
      'A grenadier. Tall, bearskin cap, sabre-bayonet.'),
    opp('Austrian infantry guard', 'line', [75, 90], [170, 220], 48,
      'Another white-coat fighting to hold the redoubt. Younger.'),
    opp('Austrian battery sergeant', 'sergeant', [100, 125], [220, 280], 75,
      'The sergeant who led the assault. A big man with a cavalry sabre.'),
  ];

  const pierreAlly = ally('Pierre', 'pierre', [75, 90], [180, 220], 50, 45, 'aggressive',
    'Pierre fights beside you \u2014 blood on his sleeve, bayonet steady. An Arcole veteran.');
  const jbAlly = ally('Jean-Baptiste', 'jean-baptiste', [60, 75], [140, 180], 38, 30, 'cautious',
    'Jean-Baptiste is pale, bayonet shaking \u2014 but here. He came.');

  const skirmishWaves: LabWaveEvent[] = [
    {
      id: seedUid(), atRound: 3, action: 'add_ally',
      allyTemplateId: pierreAlly.id, newMaxEnemies: 0,
      conditionNpcAlive: 'pierre',
      narrative: 'Pierre crashes through the smoke beside you, bayonet levelled. "Didn\'t think I\'d let you have all the fun?"',
      notes: '',
    },
    {
      id: seedUid(), atRound: 5, action: 'add_ally',
      allyTemplateId: jbAlly.id, newMaxEnemies: 0,
      conditionNpcAlive: 'jean-baptiste',
      narrative: 'Jean-Baptiste appears at your shoulder, pale-faced, bayonet shaking \u2014 but here. He came.',
      notes: '',
    },
    {
      id: seedUid(), atRound: 7, action: 'increase_max_enemies',
      allyTemplateId: '', newMaxEnemies: 3,
      conditionNpcAlive: '',
      narrative: 'More Austrians pour in from the far side of the redoubt. The fight thickens.',
      notes: '',
    },
  ];

  // --- Voltri Pegli Hills ---
  const pegliOpponents: LabOpponentTemplate[] = [
    opp('Austrian conscript', 'conscript', [55, 70], [140, 180], 35,
      'A young Austrian stumbles through the olive grove, white coat snagged on branches. Wide-eyed, bayonet wavering. This is his first fight too.'),
    opp('Austrian conscript', 'conscript', [50, 65], [130, 170], 33,
      "Another white coat scrambles over the stone wall. He's breathing hard from the climb. His musket is almost as tall as he is."),
    opp('Austrian line infantryman', 'line', [70, 85], [160, 210], 45,
      'A steadier man pushes through the scrub. Not a conscript \u2014 a professional. He plants his feet among the olive roots and levels his bayonet.'),
  ];

  // --- Gauntlet (v2 test encounter) ---
  const gauntletOpponents: LabOpponentTemplate[] = [
    opp('Austrian conscript', 'conscript', [60, 75], [150, 190], 38,
      'A shaking conscript. Easy prey \u2014 but his bayonet can still draw blood.'),
    opp('Austrian line soldier', 'line', [80, 95], [180, 230], 50,
      'A steady professional. He reads the fight, punishes mistakes.'),
    opp('Austrian veteran', 'veteran', [95, 110], [200, 260], 62,
      'Scarred and patient. He watches your patterns and adapts.'),
    opp('Austrian sergeant', 'sergeant', [105, 125], [230, 280], 72,
      'The sergeant. Pride in every movement. He will not yield easily.'),
  ];

  const gauntletAlly = ally('Pierre', 'pierre', [70, 85], [170, 210], 48, 42, 'aggressive',
    'Pierre fights at your side \u2014 aggressive, fearless, sometimes reckless.');

  const gauntletWaves: LabWaveEvent[] = [
    {
      id: seedUid(), atRound: 4, action: 'increase_max_enemies',
      allyTemplateId: '', newMaxEnemies: 3,
      conditionNpcAlive: '',
      narrative: 'More white coats push through the smoke. The fight widens.',
      notes: '',
    },
  ];

  return [
    {
      id: 'seed-gauntlet',
      name: 'Gauntlet (V2 Test)',
      description: 'Full-spectrum test: escalating enemies (conscript \u2192 sergeant), ally support, wave escalation at R4. Tests momentum, riposte, stamina regen, kill refund, and AI reactivity.',
      tags: ['test', 'v2', 'gauntlet'],
      context: 'terrain' as const,
      notes: 'Designed for v2 system testing. 2 active enemies \u2192 3 at round 4. Pierre joins from start. Exercises all v2 mechanics.',
      maxExchanges: 20,
      initialActiveEnemies: 2,
      maxActiveEnemies: 2,
      opponents: gauntletOpponents,
      allies: [gauntletAlly],
      waveEvents: gauntletWaves,
      createdAt: ts,
      updatedAt: ts,
    },
    {
      id: 'seed-terrain',
      name: 'Rivoli: Terrain Melee',
      description: 'Broken ground fighting in the vineyards of Rivoli. Stone walls, terraces, individual combat.',
      tags: ['rivoli', 'terrain'],
      context: 'terrain',
      notes: 'First melee encounter. Solo combat, one opponent at a time.',
      maxExchanges: 12,
      initialActiveEnemies: 1,
      maxActiveEnemies: 1,
      opponents: terrainOpponents,
      allies: [],
      waveEvents: [],
      createdAt: ts,
      updatedAt: ts,
    },
    {
      id: 'seed-battery',
      name: 'Rivoli: Battery Solo',
      description: 'Retaking the overrun French battery. Solo assault without Pierre.',
      tags: ['rivoli', 'battery'],
      context: 'battery',
      notes: 'Battery assault — solo path (player did not charge). One opponent at a time.',
      maxExchanges: 10,
      initialActiveEnemies: 1,
      maxActiveEnemies: 1,
      opponents: batteryOpponents,
      allies: [],
      waveEvents: [],
      createdAt: ts,
      updatedAt: ts,
    },
    {
      id: 'seed-battery-skirmish',
      name: 'Rivoli: Battery Skirmish',
      description: 'Battery assault with allies. Pierre (R3) and JB (R5) join. Enemies increase (R7).',
      tags: ['rivoli', 'battery', 'waves'],
      context: 'battery',
      notes: 'Full battery assault with ally waves. Pierre joins at round 3, JB at round 5. Enemies increase to 3 at round 7.',
      maxExchanges: 20,
      initialActiveEnemies: 2,
      maxActiveEnemies: 2,
      opponents: skirmishOpponents,
      allies: [pierreAlly, jbAlly],
      waveEvents: skirmishWaves,
      createdAt: ts,
      updatedAt: ts,
    },
    {
      id: 'seed-pegli',
      name: 'Voltri: Pegli Hills',
      description: 'Tutorial melee on the Pegli heights. Olive groves and stone walls.',
      tags: ['voltri', 'tutorial', 'skirmish'],
      context: 'skirmish',
      notes: 'Tutorial encounter — lower intensity, gentler introduction. Voltri garrison.',
      maxExchanges: 8,
      initialActiveEnemies: 1,
      maxActiveEnemies: 1,
      opponents: pegliOpponents,
      allies: [],
      waveEvents: [],
      createdAt: ts,
      updatedAt: ts,
    },
  ];
}
