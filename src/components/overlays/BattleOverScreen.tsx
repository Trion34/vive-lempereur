import React from 'react';
import type { BattleState } from '../../types';
import type { GameState } from '../../types';

interface BattleOverScreenProps {
  battleState: BattleState;
  gameState: GameState;
  onRestart: () => void;
  onContinueCredits: () => void;
}

function getTitles(name: string, batteryCharged: boolean): Record<string, string> {
  return {
    victory: `${name} \u2014 Victory`,
    survived: `${name} Survived`,
    rout: `${name} Broke`,
    defeat: `${name} \u2014 Killed in Action`,
    cavalry_victory: `${name} \u2014 Cavalry Charge Victory`,
    part1_complete: batteryCharged
      ? `${name} \u2014 The Battery is Yours`
      : `${name} \u2014 The Fourteenth Holds`,
    part2_gorge_setup: `${name} \u2014 To the Ridge`,
    gorge_victory: `${name} \u2014 The Gorge`,
  };
}

function getTexts(phase: string, batteryCharged: boolean): Record<string, string> {
  return {
    victory:
      'The plateau is yours. The last Austrian line breaks and flees down the gorges of the Adige, white coats vanishing into the frozen valley below. The drums fall silent. For the first time in hours, you can hear the wind.\n\nYou stood when others would have broken. The men around you \u2014 what is left of them \u2014 lean on their muskets and stare at the field. Nobody cheers. Not yet. The ground is covered with the fallen of both armies, French blue and Austrian white together in the January mud.\n\nSomewhere behind the ridge, Bonaparte watches. He will call this a great victory. The gazettes in Paris will celebrate. But here, on the plateau, among the men who held the line, there is only silence and the slow realisation that you are still alive.\n\nRivoli is won. The price is written in the faces of the men who paid it.',
    survived:
      "Hands drag you from the press. Sergeant Duval, blood on his face, shoving you toward the rear. \"Enough, lad. You've done enough.\"\n\nYou stumble back through the wreckage of the line \u2014 broken muskets, torn cartridge boxes, men sitting in the mud with blank stares. The battle goes on without you. You can hear it: the clash of steel, the screaming, the drums still beating the pas de charge.\n\nYou survived Rivoli. Not gloriously. Not like the stories they'll tell in Paris. You survived it the way most men survive battles \u2014 by enduring what no one should have to endure, and then being pulled out before it killed you.\n\nYour hands won't stop shaking. They won't stop for a long time.",
    rout: "You ran. The bayonet dropped from fingers that couldn't grip anymore, and your legs carried you away \u2014 stumbling over the dead, sliding on frozen ground, down the slope and away from the guns.\n\nYou are not alone. Others run with you, men whose courage broke at the same moment yours did. Nobody speaks. Nobody looks at each other.\n\nBehind you, the battle goes on. The line holds without you \u2014 or it doesn't. You don't look back to find out. The shame will come later, in quiet moments, for the rest of your life. Right now there is only the animal need to breathe, to move, to live.\n\nYou survived Rivoli. That word will taste like ashes every time you say it.",
    defeat:
      phase === 'melee' || phase === 'storybeat'
        ? 'The steel finds you. A moment of pressure, then fire, then cold. You go down in the press of bodies, in the mud and the blood, on this frozen plateau above the Adige.\n\nThe sky is very blue. The sounds of battle fade \u2014 the crash of volleys, the drums, the screaming \u2014 all of it pulling away like a tide going out. Someone steps over you. Then another.\n\nYou came to Rivoli as a soldier of the Republic. You fought beside Pierre, beside Jean-Baptiste, beside men whose names you barely learned. You held the line as long as you could.\n\nThe 14th of January, 1797. The plateau. The cold. The white coats coming through the smoke.\n\nThis is where your war ends.'
        : "The ball finds you. No warning \u2014 just a punch in the chest that drives the air from your lungs and drops you where you stand. The musket clatters from your hands.\n\nThe sky above the Adige valley is pale January blue. Around you, the volley line fires on without you \u2014 three hundred muskets thundering, the smoke rolling thick and white. Someone shouts your name. You cannot answer.\n\nYou came to Rivoli to hold the line. You stood in the dawn cold, shoulder to shoulder with men you'd known for weeks or hours. You did your duty.\n\nThe drums are still beating. The battle goes on. But not for you.\n\nThe 14th of January, 1797. This is where your war ends.",
    cavalry_victory:
      'The thunder comes from behind \u2014 hooves on frozen ground, hundreds of them, a sound that shakes the plateau itself. The chasseurs \u00e0 cheval pour over the ridge in a wave of green coats and flashing sabres.\n\nThe Austrians see them too late. The cavalry hits their flank like a hammer on glass. The white-coated line \u2014 that terrible, advancing line that has been trying to kill you for the last hour \u2014 shatters. Men throw down their muskets and run.\n\nYou stand among the wreckage, bayonet still raised, chest heaving. Around you, the survivors of the demi-brigade stare as the cavalry sweeps the field. Nobody speaks. The relief is too enormous for words.\n\nBonaparte timed it perfectly. He always does. The chasseurs finish what the infantry started \u2014 what you started, standing in the line on this frozen plateau since dawn.\n\nRivoli is won. You held long enough.',
    part1_complete: batteryCharged
      ? 'The battery is yours. French guns, retaken by French bayonets. The tricolour goes up over the smoking pieces and a ragged cheer rises from the men of the 14th.\n\nPierre is beside you, blood still seeping through the makeshift bandage on his shoulder. He leans on his musket and watches the gunners wrestle the pieces around to face the Austrian columns. "Not bad," he says. "For a conscript."\n\nJean-Baptiste is alive. Somehow. He sits against a wheel of the nearest gun, staring at nothing. His bayonet is red. He will never be the same boy who gripped his musket like driftwood at dawn.\n\nThe guns roar again \u2014 this time in the right direction. Canister tears into the white-coated columns still pressing the plateau. The Austrians falter. The 14th demi-brigade held its ground, retook its guns, and turned the tide.\n\nThe battle of Rivoli is not over. But Part 1 is.\n\nYou survived. You fought. And when the captain called, you charged.'
      : "The battery is retaken \u2014 by other men. You watched from fifty paces back as Captain Leclerc led the charge, as Pierre ran with blood on his sleeve, as men whose courage you could not match threw themselves at the guns.\n\nThe tricolour goes up. The cheer rises. You are not part of it.\n\nJean-Baptiste is beside you. He didn't charge either. Neither of you speaks. There is nothing to say.\n\nThe guns roar again, turned back on the Austrians. The 14th held its ground. The battery is retaken. The battle goes on.\n\nBut you will remember this moment. The moment you chose safety over glory. The moment Pierre looked back and you weren't there.\n\nPart 1 is over. You survived. That will have to be enough.",
    part2_gorge_setup:
      'The 14th moves out. What is left of it.\n\nYou march toward the ridge \u2014 toward Bonaparte, toward the gorge, toward whatever comes next. Your musket weighs more than it did at dawn. Your legs move because there is no alternative. The drums beat the advance.\n\nAround you, the survivors of seven volleys and a bayonet charge climb the slope. Pierre is beside you, blood-soaked but upright. Jean-Baptiste somewhere behind, still carrying his musket, still in the line. Captain Leclerc ahead, sword drawn, leading what remains.\n\nBelow the ridge, the gorge opens \u2014 a narrow defile where the Adige carves through the mountains. Somewhere down there, the Austrian retreat will become a rout. Or the French advance will become a massacre.\n\nBonaparte watches from above. He has seen the 14th hold the plateau. He has seen the battery retaken. Now he sends them into the gorge.\n\nThe battle of Rivoli is not over. But for now, the 14th has done enough. More than enough.\n\nWhat comes next will be written in the gorge.',
    gorge_victory:
      'The gorge is silent. The Austrian column \u2014 ten thousand men who marched into this defile with drums beating and colours flying \u2014 has ceased to exist. The gorge floor is carpeted with the wreckage of an army: abandoned muskets, shattered wagons, white coats stained red.\n\nThe 14th descends from the ridge. Not charging. Not advancing. Just walking, slowly, through the aftermath of what they have done. Men step carefully among the fallen. Some offer water to Austrian wounded. Others cannot look.\n\nPierre stands at the edge of the crater where the ammunition wagon was. He says nothing. His face says everything.\n\nCaptain Leclerc finds you. His sword is sheathed. His eyes are old. "You did your duty, soldier," he says. The words should comfort. They don\'t.\n\nOn the ridge above, Bonaparte is already dictating dispatches. Rivoli is a victory. A decisive victory. The Italian campaign is won. The name will echo through history.\n\nBut here, in the gorge, among the men who made that victory possible, there is no celebration. There is only the silence of the living standing among the dead, and the knowledge that what happened here today will follow them forever.\n\nThe Battle of Rivoli is over. You survived it. All of it.',
  };
}

function formatParagraphs(text: string): React.ReactNode[] {
  return text.split('\n\n').map((p, i) => <p key={i}>{p}</p>);
}

export function BattleOverScreen({
  battleState,
  gameState,
  onRestart,
  onContinueCredits,
}: BattleOverScreenProps) {
  if (!battleState.battleOver) return null;

  const name = battleState.player.name;
  const outcome = battleState.outcome;
  const isGorgeVictory = outcome === 'gorge_victory';

  const titles = getTitles(name, battleState.batteryCharged);
  const texts = getTexts(battleState.phase, battleState.batteryCharged);

  const title = titles[outcome] || 'Battle Over';
  const endText = texts[outcome] || '';

  const meleeKills = battleState.meleeState?.killCount || 0;

  const gorgeStats =
    outcome === 'gorge_victory'
      ? `Wagon detonated: ${battleState.wagonDamage >= 100 ? 'Yes' : 'No'}\nMercy shown: ${battleState.gorgeMercyCount} time${battleState.gorgeMercyCount !== 1 ? 's' : ''}`
      : '';

  return (
    <div className="battle-over-overlay" id="battle-over">
      <div className="battle-over-content">
        <h2 id="battle-over-title">
          {title}
        </h2>
        {formatParagraphs(endText)}

        <div
          className="battle-stats"
          id="battle-stats"
          style={{ display: isGorgeVictory ? 'none' : '' }}
          dangerouslySetInnerHTML={{
            __html: `
              Turns survived: ${battleState.turn}<br>
              Final morale: ${Math.round(battleState.player.morale)} (${battleState.player.moraleThreshold})<br>
              Valor: ${battleState.player.valor}<br>
              Health: ${Math.round(battleState.player.health)}% | Stamina: ${Math.round(battleState.player.stamina)}%<br>
              Volleys fired: ${battleState.volleysFired}<br>
              ${meleeKills > 0 ? `Melee kills: ${meleeKills}<br>` : ''}
              ${gorgeStats ? gorgeStats.split('\n').map((l) => `${l}<br>`).join('') : ''}
              Enemy strength: ${Math.round(battleState.enemy.strength)}%<br>
              Line integrity: ${Math.round(battleState.line.lineIntegrity)}%<br>
            `,
          }}
        />

        <div
          className="historical-note"
          id="historical-note"
          style={{ display: isGorgeVictory ? 'none' : '' }}
        >
          <hr className="historical-divider" />
          <p className="historical-title">Historical Note</p>
          <p>
            The Battle of Rivoli, 14{'\u2013'}15 January 1797, ended Austria&apos;s fourth and final
            attempt to relieve the besieged fortress of Mantua. General Joubert held the plateau above
            the Adige with some 10,000 men against Alvinczy&apos;s 28,000 until Bonaparte arrived with
            reinforcements, including Mass{'\u00e9'}na&apos;s division. The Austrian defeat cost over
            14,000 killed, wounded, and captured. The victory secured French control of northern Italy
            and forced Austria to sue for peace, ending the War of the First Coalition.
          </p>
        </div>

        <div className="battle-over-buttons">
          <button
            className="btn-restart"
            id="btn-restart"
            style={{ display: isGorgeVictory ? 'none' : '' }}
            onClick={onRestart}
          >
            Restart
          </button>
          <button
            className="btn-restart"
            id="btn-continue-credits"
            style={{ display: isGorgeVictory ? 'inline-block' : 'none' }}
            onClick={onContinueCredits}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
