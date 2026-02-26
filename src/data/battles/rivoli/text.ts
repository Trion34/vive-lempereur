import type { BattleMeta, OpeningConfig, OutcomeConfig } from '../types';

// ============================================================
// RIVOLI BATTLE METADATA
// ============================================================

export const RIVOLI_META: BattleMeta = {
  title: 'BATTLE OF RIVOLI',
  date: '14 January 1797',
  playerUnit: '14th Demi-Brigade de Ligne',
  enemyUnit: 'Austrian Column (Alvinczy)',
  historicalNote:
    "The Battle of Rivoli, 14\u201315 January 1797, ended Austria's fourth and final attempt to relieve the besieged fortress of Mantua. General Joubert held the plateau above the Adige with some 10,000 men against Alvinczy's 28,000 until Bonaparte arrived with reinforcements, including Mass\u00e9na's division. The Austrian defeat cost over 14,000 killed, wounded, and captured. The victory secured French control of northern Italy and forced Austria to sue for peace, ending the War of the First Coalition.",
};

// ============================================================
// OPENING CINEMATIC
// ============================================================

export const RIVOLI_OPENING: OpeningConfig = {
  narrative: `Dawn on the Rivoli plateau. January cold cuts through your patched coat. The 14th stands in the second line, muskets loaded, waiting. The mountains fill the horizon \u2014 and somewhere in those gorges, twenty-eight thousand Austrians are moving.

Gunfire erupts on the right flank. Not the steady crash of volleys \u2014 ragged, sudden, too early. The battle has begun before anyone expected it.

To your left, Pierre checks his flint. Arcole veteran. Steady hands. To your right, Jean-Baptiste grips his musket like a drowning man grips driftwood.

The drums roll. The 14th advances through the broken ground \u2014 vineyards, stone walls, churned earth \u2014 toward the sound of the guns.

"Present arms! First volley on my command!"`,
  splashText: 'Fate Beckons...',
  choiceLabel: 'Take your place in the line',
  choiceDesc: 'The drums are rolling. The 14th advances.',
};

// ============================================================
// OUTCOME TEXT (per battle-over ending)
// ============================================================

export const RIVOLI_OUTCOMES: Record<string, OutcomeConfig> = {
  victory: {
    title: 'Victory',
    narrative:
      'The plateau is yours. The last Austrian line breaks and flees down the gorges of the Adige, white coats vanishing into the frozen valley below. The drums fall silent. For the first time in hours, you can hear the wind.\n\nYou stood when others would have broken. The men around you \u2014 what is left of them \u2014 lean on their muskets and stare at the field. Nobody cheers. Not yet. The ground is covered with the fallen of both armies, French blue and Austrian white together in the January mud.\n\nSomewhere behind the ridge, Bonaparte watches. He will call this a great victory. The gazettes in Paris will celebrate. But here, on the plateau, among the men who held the line, there is only silence and the slow realisation that you are still alive.\n\nRivoli is won. The price is written in the faces of the men who paid it.',
  },
  survived: {
    title: 'Survived',
    narrative:
      "Hands drag you from the press. Sergeant Duval, blood on his face, shoving you toward the rear. \"Enough, lad. You've done enough.\"\n\nYou stumble back through the wreckage of the line \u2014 broken muskets, torn cartridge boxes, men sitting in the mud with blank stares. The battle goes on without you. You can hear it: the clash of steel, the screaming, the drums still beating the pas de charge.\n\nYou survived Rivoli. Not gloriously. Not like the stories they'll tell in Paris. You survived it the way most men survive battles \u2014 by enduring what no one should have to endure, and then being pulled out before it killed you.\n\nYour hands won't stop shaking. They won't stop for a long time.",
  },
  rout: {
    title: 'Broke',
    narrative:
      "You ran. The bayonet dropped from fingers that couldn't grip anymore, and your legs carried you away \u2014 stumbling over the dead, sliding on frozen ground, down the slope and away from the guns.\n\nYou are not alone. Others run with you, men whose courage broke at the same moment yours did. Nobody speaks. Nobody looks at each other.\n\nBehind you, the battle goes on. The line holds without you \u2014 or it doesn't. You don't look back to find out. The shame will come later, in quiet moments, for the rest of your life. Right now there is only the animal need to breathe, to move, to live.\n\nYou survived Rivoli. That word will taste like ashes every time you say it.",
  },
  defeat_melee: {
    title: 'Killed in Action',
    narrative:
      "The steel finds you. A moment of pressure, then fire, then cold. You go down in the press of bodies, in the mud and the blood, on this frozen plateau above the Adige.\n\nThe sky is very blue. The sounds of battle fade \u2014 the crash of volleys, the drums, the screaming \u2014 all of it pulling away like a tide going out. Someone steps over you. Then another.\n\nYou came to Rivoli as a soldier of the Republic. You fought beside Pierre, beside Jean-Baptiste, beside men whose names you barely learned. You held the line as long as you could.\n\nThe 14th of January, 1797. The plateau. The cold. The white coats coming through the smoke.\n\nThis is where your war ends.",
  },
  defeat_line: {
    title: 'Killed in Action',
    narrative:
      "The ball finds you. No warning \u2014 just a punch in the chest that drives the air from your lungs and drops you where you stand. The musket clatters from your hands.\n\nThe sky above the Adige valley is pale January blue. Around you, the volley line fires on without you \u2014 three hundred muskets thundering, the smoke rolling thick and white. Someone shouts your name. You cannot answer.\n\nYou came to Rivoli to hold the line. You stood in the dawn cold, shoulder to shoulder with men you'd known for weeks or hours. You did your duty.\n\nThe drums are still beating. The battle goes on. But not for you.\n\nThe 14th of January, 1797. This is where your war ends.",
  },
  cavalry_victory: {
    title: 'Cavalry Charge Victory',
    narrative:
      "The thunder comes from behind \u2014 hooves on frozen ground, hundreds of them, a sound that shakes the plateau itself. The chasseurs \u00e0 cheval pour over the ridge in a wave of green coats and flashing sabres.\n\nThe Austrians see them too late. The cavalry hits their flank like a hammer on glass. The white-coated line \u2014 that terrible, advancing line that has been trying to kill you for the last hour \u2014 shatters. Men throw down their muskets and run.\n\nYou stand among the wreckage, bayonet still raised, chest heaving. Around you, the survivors of the demi-brigade stare as the cavalry sweeps the field. Nobody speaks. The relief is too enormous for words.\n\nBonaparte timed it perfectly. He always does. The chasseurs finish what the infantry started \u2014 what you started, standing in the line on this frozen plateau since dawn.\n\nRivoli is won. You held long enough.",
  },
  part1_complete_charged: {
    title: 'The Battery is Yours',
    narrative:
      "The battery is yours. French guns, retaken by French bayonets. The tricolour goes up over the smoking pieces and a ragged cheer rises from the men of the 14th.\n\nPierre is beside you, blood still seeping through the makeshift bandage on his shoulder. He leans on his musket and watches the gunners wrestle the pieces around to face the Austrian columns. \"Not bad,\" he says. \"For a conscript.\"\n\nJean-Baptiste is alive. Somehow. He sits against a wheel of the nearest gun, staring at nothing. His bayonet is red. He will never be the same boy who gripped his musket like driftwood at dawn.\n\nThe guns roar again \u2014 this time in the right direction. Canister tears into the white-coated columns still pressing the plateau. The Austrians falter. The 14th demi-brigade held its ground, retook its guns, and turned the tide.\n\nThe battle of Rivoli is not over. But Part 1 is.\n\nYou survived. You fought. And when the captain called, you charged.",
  },
  part1_complete_uncharged: {
    title: 'The Fourteenth Holds',
    narrative:
      "The battery is retaken \u2014 by other men. You watched from fifty paces back as Captain Leclerc led the charge, as Pierre ran with blood on his sleeve, as men whose courage you could not match threw themselves at the guns.\n\nThe tricolour goes up. The cheer rises. You are not part of it.\n\nJean-Baptiste is beside you. He didn't charge either. Neither of you speaks. There is nothing to say.\n\nThe guns roar again, turned back on the Austrians. The 14th held its ground. The battery is retaken. The battle goes on.\n\nBut you will remember this moment. The moment you chose safety over glory. The moment Pierre looked back and you weren't there.\n\nPart 1 is over. You survived. That will have to be enough.",
  },
  part2_gorge_setup: {
    title: 'To the Ridge',
    narrative:
      "The 14th moves out. What is left of it.\n\nYou march toward the ridge \u2014 toward Bonaparte, toward the gorge, toward whatever comes next. Your musket weighs more than it did at dawn. Your legs move because there is no alternative. The drums beat the advance.\n\nAround you, the survivors of seven volleys and a bayonet charge climb the slope. Pierre is beside you, blood-soaked but upright. Jean-Baptiste somewhere behind, still carrying his musket, still in the line. Captain Leclerc ahead, sword drawn, leading what remains.\n\nBelow the ridge, the gorge opens \u2014 a narrow defile where the Adige carves through the mountains. Somewhere down there, the Austrian retreat will become a rout. Or the French advance will become a massacre.\n\nBonaparte watches from above. He has seen the 14th hold the plateau. He has seen the battery retaken. Now he sends them into the gorge.\n\nThe battle of Rivoli is not over. But for now, the 14th has done enough. More than enough.\n\nWhat comes next will be written in the gorge.",
  },
  gorge_victory: {
    title: 'The Gorge',
    narrative:
      'The gorge is silent. The Austrian column \u2014 ten thousand men who marched into this defile with drums beating and colours flying \u2014 has ceased to exist. The gorge floor is carpeted with the wreckage of an army: abandoned muskets, shattered wagons, white coats stained red.\n\nThe 14th descends from the ridge. Not charging. Not advancing. Just walking, slowly, through the aftermath of what they have done. Men step carefully among the fallen. Some offer water to Austrian wounded. Others cannot look.\n\nPierre stands at the edge of the crater where the ammunition wagon was. He says nothing. His face says everything.\n\nCaptain Leclerc finds you. His sword is sheathed. His eyes are old. "You did your duty, soldier," he says. The words should comfort. They don\'t.\n\nOn the ridge above, Bonaparte is already dictating dispatches. Rivoli is a victory. A decisive victory. The Italian campaign is won. The name will echo through history.\n\nBut here, in the gorge, among the men who made that victory possible, there is no celebration. There is only the silence of the living standing among the dead, and the knowledge that what happened here today will follow them forever.\n\nThe Battle of Rivoli is over. You survived it. All of it.',
  },
};

// ============================================================
// STORY BEAT LABELS (for BattleHeader)
// ============================================================

export const RIVOLI_STORY_LABELS: Record<number, string> = {
  1: 'THE BATTERY',
  2: "MASS\u00c9NA'S ARRIVAL",
  3: 'THE GORGE',
  4: 'THE AFTERMATH',
  5: 'THE WOUNDED SERGEANT',
  6: 'FIX BAYONETS',
};

export const RIVOLI_ENCOUNTER_TITLES: Record<number, string> = {
  1: 'The Overrun Battery',
  2: "Mass\u00e9na's Division",
  3: 'The Counterattack',
  4: 'The Aftermath',
  5: 'The Wounded Sergeant',
  6: 'Fix Bayonets',
};

// ============================================================
// FIRE ORDERS (for useAutoPlay volley sequences)
// ============================================================

export const RIVOLI_FIRE_ORDERS: Record<number, string> = {
  0: '"Feu!" The captain\'s sword drops.',
  1: '"FIRE!" The word tears down the line.',
  2: '"FIRE!" At fifty paces, the captain\'s voice is raw.',
  3: '"Tirez! Derni\u00e8re salve!" Point blank.',
  4: '"FIRE!" Again. The new column at a hundred paces.',
  5: '"FIRE!" Sixty paces. The right flank exposed.',
  6: '"FIRE!" Forty paces. The last volley.',
};

export const RIVOLI_GORGE_FIRE_ORDERS: Record<number, string> = {
  7: '"Fire at will!"',
  8: '"Again!"',
  9: '"Fire!"',
  10: '"Final volley!"',
};

// ============================================================
// PHASE LABELS (for BattleHeader)
// ============================================================

export const RIVOLI_PHASE_LABELS = {
  line: {
    1: 'PHASE 1: THE LINE',
    2: 'PHASE 3: HOLD THE LINE',
    3: 'PHASE 4: THE GORGE',
  } as Record<number, string>,
  melee: {
    1: 'PHASE 2: MELEE',
    2: 'THE BATTERY CHARGE',
  } as Record<number, string>,
  volleyMaxes: {
    1: 4,
    2: 7,
    3: 11,
  } as Record<number, number>,
};
