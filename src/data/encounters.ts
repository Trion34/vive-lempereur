import type { BattleState, ChargeChoice } from '../types';
import { ChargeChoiceId } from '../types';

// ============================================================
// Encounter definition — what the player sees (narrative + choices)
// Resolve functions live in core/charge.ts (state mutations)
// ============================================================

interface EncounterDef {
  id: number;
  getNarrative: (state: BattleState) => string;
  getChoices: (state: BattleState) => ChargeChoice[];
}

// ------------------------------------------------------------
// 1 — Battery
// ------------------------------------------------------------
const BATTERY: EncounterDef = {
  id: 1,
  getNarrative: (_state) =>
    `The 14th fights on. Ground is taken, lost, taken again across the broken terrain of the plateau. Vineyards become killing grounds. Walled gardens become fortresses held for minutes, then lost.

Through the chaos, you hear it \u2014 the Austrians have overrun one of your batteries. French guns turning against French troops.

Over the cacophony, Captain Leclerc's voice rings out \u2014 hoarse, furious, alive with defiance:

"FOURTEENTH! Will you let them take your guns?!"

You catch Pierre's eye across the press of bodies. Blood on his sleeve, bayonet steady. A glimmer of something \u2014 not madness or despair. Valor. The real thing.`,

  getChoices: (_state) => [
    {
      id: ChargeChoiceId.ChargeBattery,
      label: 'Charge the battery',
      description:
        "Heed the captain's call. Charge into the teeth of your own guns to take them back.",
      available: true,
    },
    {
      id: ChargeChoiceId.HoldBack,
      label: 'Hold back',
      description: "Let braver souls lead. You've done enough.",
      available: true,
    },
  ],
};

// ------------------------------------------------------------
// 2 — Masséna
// ------------------------------------------------------------
const MASSENA: EncounterDef = {
  id: 2,
  getNarrative: (state) => {
    const pierreStatus = state.line.leftNeighbour?.alive
      ? "Pierre leans against a broken wall, his shoulder bound with a strip torn from someone's coat. The blood has soaked through. He catches your eye and nods once. Still here."
      : "Pierre's place in the line is empty. You don't look at the spot where he fell.";

    const jbStatus = state.line.rightNeighbour?.alive
      ? "Jean-Baptiste is pale but upright. He checks his flint with hands that barely shake anymore. He's become a soldier."
      : 'Jean-Baptiste\'s place is empty. You do not let yourself think about it.';

    return `The sound comes from the south \u2014 drums. Not Austrian drums. French drums, beating the pas de charge, growing louder. Through the haze of powder smoke, you see them: fresh troops in blue coats, formed lines, bayonets glinting. Thousands of them.

Mass\u00e9na's division slams into the Austrian flank like a fist. The columns that have been pressing the plateau stagger, turn, try to reform against this new threat. For the first time since dawn, the pressure on the 14th eases.

${pierreStatus}

${jbStatus}

Captain Leclerc walks the line. His coat is torn, his face is black with powder, but his voice is steady: "Five minutes, Fourteenth. Reform. Reload. This isn't over."

Five minutes. What do you do?`;
  },

  getChoices: (_state) => [
    {
      id: ChargeChoiceId.TendWounds,
      label: 'Tend your wounds',
      description:
        "Bind your cuts, drink water, catch your breath. You need your body to hold together for what's coming.",
      available: true,
    },
    {
      id: ChargeChoiceId.CheckComrades,
      label: 'Check on your comrades',
      description:
        "Find Pierre and Jean-Baptiste. See who's still standing. The line needs its people more than its muskets.",
      available: true,
    },
    {
      id: ChargeChoiceId.FollowTheScreams,
      label: 'Follow the screaming',
      description: 'Someone is hurt. You can hear it. Your feet are already moving.',
      available: true,
    },
  ],
};

// ------------------------------------------------------------
// 3 — Gorge
// ------------------------------------------------------------
const GORGE: EncounterDef = {
  id: 3,
  getNarrative: (_state) =>
    `On the ridge above the plateau, a small figure on a grey horse. Even through the smoke and chaos, every man in the line knows who it is. Bonaparte.

He's been there since dawn, watching, calculating, moving his pieces across this frozen chessboard. Now he moves the last one.

An aide-de-camp gallops down from the ridge. The orders carry down the line like fire along a powder trail:

"Every man, every gun to the ridge! The counterattack goes in NOW!"

Captain Leclerc turns to the 14th. His voice is raw, half-gone, but it carries:

"FOURTEENTH! To the ridge! We finish this!"

Around you, the survivors of two phases of hell straighten their backs. The drums change their beat \u2014 not the steady rhythm of the line, but the pas de charge. The advance.

Bonaparte is ordering the counterattack. The gorge must be sealed. And the 14th is going.`,

  getChoices: (_state) => [
    {
      id: ChargeChoiceId.AcceptOrder,
      label: 'To the ridge',
      description: 'Follow the captain. Follow Bonaparte. Follow the drums. One more time.',
      available: true,
    },
  ],
};

// ------------------------------------------------------------
// 4 — Aftermath
// ------------------------------------------------------------
const AFTERMATH: EncounterDef = {
  id: 4,
  getNarrative: (state) => {
    const pierreAlive = state.line.leftNeighbour?.alive;

    const pierreLine = pierreAlive
      ? 'Pierre sits on a rock, binding his shoulder one-handed. Blood has soaked through three layers of bandage. He catches your eye and nods once. Still here.'
      : 'Pierre\u2019s place in the line is empty. You don\u2019t look at the spot where he fell. You can\u2019t.';

    const jbLine = state.line.rightNeighbour?.alive
      ? 'Jean-Baptiste stands at the ridge\u2019s edge, musket grounded, staring at the gorge. He is pale but upright. Whatever you said to him during the second volley held. He made it through.'
      : 'Jean-Baptiste is not at the ridge. He fell at the battery. Someone will tell his family. Someone must.';

    const batteryLine = state.batteryCharged
      ? 'Retook the battery by bayonet.'
      : 'Held the line while others charged the battery.';

    return `Victory.

The Austrian column is defeated.

But the battle is not over \u2014 not everywhere. From the ridge, you hear it: the thunder of hooves on the frozen plateau. Leclerc\u2019s chasseurs \u00e0 cheval \u2014 just a few hundred horsemen \u2014 sweep into the Austrian centre like a scythe through wheat. The exhausted white-coated columns, spread out and disordered after hours of fighting, break at the first sight of cavalry.

The rout spreads faster than the horsemen can ride. Alvinczi himself \u2014 the Austrian commander who thought himself on the cusp of victory an hour ago \u2014 joins the undignified race to the rear.

Word passes down the ridge like a spark along a fuse: Lusignan\u2019s column \u2014 the force at Affi that had the whole army convinced they were surrounded \u2014 has been cut off by General Rey. They are surrendering in their thousands.

The Battle of Rivoli is won.

The 14th demi-brigade held the plateau through dawn. ${batteryLine} Endured Vukassovich\u2019s fresh columns when the right flank broke. And sealed the gorge.

${pierreLine}

${jbLine}

Captain Leclerc sheathes his sword. His hand is steady now. \u201CThe 14th will reform. Take what rest you can. We march at dusk.\u201D`;
  },

  getChoices: (_state) => [
    {
      id: ChargeChoiceId.HelpWounded,
      label: 'Help the wounded',
      description:
        'Descend into the gorge. Tend to Austrian wounded. Mercy and humanity for its own sake.',
      available: true,
    },
    {
      id: ChargeChoiceId.FindComrades,
      label: 'Find your comrades',
      description: 'Search for Pierre, Jean-Baptiste, the men you stood beside. See who survived.',
      available: true,
    },
    {
      id: ChargeChoiceId.SitDown,
      label: 'Sit down',
      description:
        'Your legs stop working. The musket slides from your fingers. You sit on the ridge and stare.',
      available: true,
    },
  ],
};

// ------------------------------------------------------------
// 5 — Wounded Sergeant
// ------------------------------------------------------------
const WOUNDED_SERGEANT: EncounterDef = {
  id: 5,
  getNarrative: (_state) =>
    `At fifty paces, the Austrian volley tears through the line. Sergeant Duval \u2014 the granite-faced NCO who has held the section together since dawn \u2014 takes a ball in the thigh.

He goes down hard. His spontoon clatters against the stones. For a moment, his face shows nothing \u2014 just surprise, as if he'd tripped on a vine root. Then the pain hits and he grabs his leg with both hands.

"Sergeant's down!" The cry ripples through the section.

Captain Leclerc is thirty paces to the left, dealing with a gap in the line where an entire file went down. He hasn't seen. The section \u2014 your section \u2014 is without its NCO.

The line wavers. Men look to each other. Someone must act.`,

  getChoices: (_state) => [
    {
      id: ChargeChoiceId.TakeCommand,
      label: "Take the sergeant's place",
      description:
        'Pick up his spontoon. Give orders. You are not an NCO \u2014 but someone must be. [Valor + Charisma check]',
      available: true,
    },
    {
      id: ChargeChoiceId.RallyTheLine,
      label: 'Rally the men around you',
      description:
        "You can't replace Duval. But you can shout, hold your section, keep the men beside you steady. [Charisma check]",
      available: true,
    },
    {
      id: ChargeChoiceId.KeepYourHead,
      label: 'Keep your head down',
      description:
        'Not your job. Not your rank. Survive the next two volleys and let the officers sort it out.',
      available: true,
    },
  ],
};

// ------------------------------------------------------------
// 6 — Melee Transition
// ------------------------------------------------------------
const MELEE_TRANSITION: EncounterDef = {
  id: 6,
  getNarrative: (_state) =>
    `The last volley tears through the Austrian ranks at twenty-five paces. Point blank. The smoke has barely cleared when the drums change their beat \u2014 The pas de charge.

Bayonets rasp from scabbards up and down the line. Steel clicks onto muzzles. Your musket becomes a spear.

Pierre, blood soaking through his sleeve, fixes his bayonet one-handed. His teeth are clenched. His eyes are steady. The veteran has been here before.

Jean-Baptiste fixes his bayonet. His hands shake \u2014 but he does it.

And then the left flank crumbles. You see it happen \u2014 white coats pouring through the gap where the companies to your left were standing a moment ago. The ordered line dissolves. Walled gardens and vineyard terraces become individual battlefields. The 14th is no longer a firing line.

It is a collection of men with bayonets, standing in the broken ground of Rivoli, about to fight for their lives.

Captain Leclerc's voice, one final time: "FOURTEENTH! EN AVANT!"`,

  getChoices: (_state) => [
    {
      id: ChargeChoiceId.FixBayonets,
      label: 'Fix bayonets',
      description: 'Steel on steel.',
      available: true,
    },
  ],
};

// ============================================================
// Exported array — ordered by id
// ============================================================
export const ENCOUNTER_DEFS: EncounterDef[] = [
  BATTERY,
  MASSENA,
  GORGE,
  AFTERMATH,
  WOUNDED_SERGEANT,
  MELEE_TRANSITION,
];
