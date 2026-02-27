import React, { useCallback, useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { useUiStore } from '../../stores/uiStore';
import { CampActivityId, ARMS_TRAINING_TIERS } from '../../types';
import type { PlayerCharacter, NPC, CampState } from '../../types';
import { STAKE_CONFIG, type PasseDixStake } from '../../core/passeDix';

// ── Types ──

interface ActionOption {
  id: string;
  name: string;
  desc: string;
  locked: boolean;
  lockReason: string;
  detail?: string;
}

interface ActionTierGroup {
  label: string;
  tier: 'solo' | 'comrades' | 'officers';
  locked: boolean;
  repReq: string;
  repMet: boolean;
  cap: number;
  options: ActionOption[];
}

interface CategoryData {
  title: string;
  flavor: string;
  options?: ActionOption[];
  tiers?: ActionTierGroup[];
}

// ── Helpers to build category data ──

function getOptionsForCategory(
  categoryId: string,
  player: PlayerCharacter,
  npcs: NPC[],
  camp: CampState,
): CategoryData {
  switch (categoryId) {
    case CampActivityId.Rest:
      return {
        title: 'REST',
        flavor:
          'A few hours off your feet could do you good.',
        options: [
          {
            id: 'lay_about',
            name: 'Lay About',
            desc: 'Sleep, sit by the fire, do nothing.',
            locked: false,
            lockReason: '',
          },
          {
            id: 'bathe',
            name: 'Bathe',
            desc: "Wade into the Adige. Freezing, but you'll feel like a new man.",
            locked: camp.batheCooldown > 0,
            lockReason: `Available in ${camp.batheCooldown} action${camp.batheCooldown !== 1 ? 's' : ''}`,
          },
          {
            id: 'pray',
            name: 'Pray',
            desc: 'Find a quiet place. Say the words you remember.',
            locked: camp.prayedThisCamp,
            lockReason: 'Already prayed this camp',
          },
        ],
      };

    case CampActivityId.Exercise:
      return {
        title: 'EXERCISE',
        flavor:
          'The body is a soldier\u2019s first weapon.',
        options: [
          {
            id: 'haul',
            name: 'Haul',
            desc: 'Find something heavy. Move it somewhere else.',
            locked: false,
            lockReason: '',
            detail: 'Strength + Endurance',
          },
          {
            id: 'wrestle',
            name: 'Wrestle',
            desc: 'Grapple with a comrade. Builds power and toughness.',
            locked: false,
            lockReason: '',
            detail: 'Strength + Constitution',
          },
          {
            id: 'run',
            name: 'Run',
            desc: 'Run the perimeter. Lungs and legs.',
            locked: false,
            lockReason: '',
            detail: 'Endurance + Constitution',
          },
        ],
      };

    case CampActivityId.Duties:
      return {
        title: 'DUTIES',
        flavor:
          'The army runs on routine. There is always something that needs doing \u2014 and someone has to do it.',
        options: [
          {
            id: 'forage',
            name: 'Forage',
            desc: 'Take a detail into the countryside. Find what you can.',
            locked: false,
            lockReason: '',
          },
          {
            id: 'check_equipment',
            name: 'Check Equipment',
            desc: 'Strip and clean the musket. Sharpen the bayonet.',
            locked: false,
            lockReason: '',
          },
          {
            id: 'volunteer',
            name: 'Volunteer for Duty',
            desc: 'Make yourself useful.',
            locked: false,
            lockReason: '',
          },
          {
            id: 'tend_wounded',
            name: 'Tend the Wounded',
            desc: 'Help the surgeon. Grim work, but someone must.',
            locked: true,
            lockReason: 'Coming soon',
          },
        ],
      };

    case CampActivityId.Socialize: {
      const aliveNpcs = npcs.filter((n) => n.alive);
      const options: ActionOption[] = aliveNpcs.map((npc) => {
        const relLabel =
          npc.relationship > 20 ? 'Friendly' : npc.relationship < -20 ? 'Hostile' : 'Neutral';
        return {
          id: npc.id,
          name: npc.name,
          desc: `${npc.role} \u2014 ${relLabel}`,
          locked: false,
          lockReason: '',
        };
      });
      options.push({
        id: 'write_letter',
        name: 'Write a Letter',
        desc: 'Put quill to paper. Stay connected to those far away.',
        locked: false,
        lockReason: '',
      });
      options.push({
        id: 'gamble',
        name: 'Gamble',
        desc: 'Dice by the fire. Passe-dix.',
        locked: false,
        lockReason: '',
      });
      return {
        title: 'SOCIALIZE',
        flavor:
          'The men around the fire are the closest thing to family you have out here. A word, a joke, a shared silence \u2014 it all matters.',
        options,
      };
    }

    case CampActivityId.ArmsTraining: {
      const tierData: ActionTierGroup[] = [
        {
          label: 'Solo Training',
          tier: 'solo',
          locked: false,
          repReq: '',
          repMet: true,
          cap: ARMS_TRAINING_TIERS.solo.cap,
          options: [
            {
              id: 'solo_musketry',
              name: 'Dry Fire Drill',
              desc: 'Practice the loading sequence alone.',
              locked: false,
              lockReason: '',
              detail: `Musketry (cap ${ARMS_TRAINING_TIERS.solo.cap})`,
            },
            {
              id: 'solo_elan',
              name: 'Shadow Drill',
              desc: 'Bayonet forms against an imaginary foe.',
              locked: false,
              lockReason: '',
              detail: `\u00c9lan (cap ${ARMS_TRAINING_TIERS.solo.cap})`,
            },
          ],
        },
        {
          label: 'Train with Comrades',
          tier: 'comrades',
          locked: player.soldierRep < ARMS_TRAINING_TIERS.comrades.repRequired,
          repReq: `Soldier Rep ${ARMS_TRAINING_TIERS.comrades.repRequired}`,
          repMet: player.soldierRep >= ARMS_TRAINING_TIERS.comrades.repRequired,
          cap: ARMS_TRAINING_TIERS.comrades.cap,
          options: [
            {
              id: 'comrades_musketry',
              name: 'Squad Volleys',
              desc: 'Volley drill with the section.',
              locked: false,
              lockReason: '',
              detail: `Musketry (cap ${ARMS_TRAINING_TIERS.comrades.cap})`,
            },
            {
              id: 'comrades_elan',
              name: 'Sparring',
              desc: 'Wooden bayonets, dueling.',
              locked: false,
              lockReason: '',
              detail: `\u00c9lan (cap ${ARMS_TRAINING_TIERS.comrades.cap})`,
            },
          ],
        },
        {
          label: 'Train with Officers',
          tier: 'officers',
          locked: player.officerRep < ARMS_TRAINING_TIERS.officers.repRequired,
          repReq: `Officer Rep ${ARMS_TRAINING_TIERS.officers.repRequired}`,
          repMet: player.officerRep >= ARMS_TRAINING_TIERS.officers.repRequired,
          cap: ARMS_TRAINING_TIERS.officers.cap,
          options: [
            {
              id: 'officers_musketry',
              name: 'Marksman Instruction',
              desc: 'Elite musketry training.',
              locked: false,
              lockReason: '',
              detail: `Musketry (cap ${ARMS_TRAINING_TIERS.officers.cap})`,
            },
            {
              id: 'officers_elan',
              name: "Salle d'Armes",
              desc: 'Formal fencing instruction.',
              locked: false,
              lockReason: '',
              detail: `\u00c9lan (cap ${ARMS_TRAINING_TIERS.officers.cap})`,
            },
          ],
        },
      ];
      return {
        title: 'ARMS TRAINING',
        flavor: 'Steel is only as strong as the hand that wields it.',
        tiers: tierData,
      };
    }

    default:
      return { title: categoryId.toUpperCase(), flavor: '', options: [] };
  }
}

function getEquipmentOptions(player: PlayerCharacter): ActionOption[] {
  const eq = player.equipment;
  return [
    {
      id: 'musket',
      name: 'Musket & Bayonet',
      desc: 'Strip, clean, and oil the lock. Sharpen the bayonet.',
      locked: true,
      lockReason: 'Coming soon',
      detail: `Condition: ${eq.musketCondition}%`,
    },
    {
      id: 'uniform',
      name: 'Mend Uniform',
      desc: 'Patch holes, re-stitch seams, polish buttons.',
      locked: true,
      lockReason: 'Coming soon',
      detail: `Condition: ${eq.uniformCondition}%`,
    },
  ];
}

// ── Action button component ──

interface ActionButtonProps {
  opt: ActionOption;
  onClick: () => void;
}

function ActionButton({ opt, onClick }: ActionButtonProps) {
  return (
    <button
      className="action-btn camp-activity-btn"
      style={opt.locked ? { opacity: 0.4, pointerEvents: 'none' } : undefined}
      onClick={opt.locked ? undefined : onClick}
    >
      <span className="action-name">{opt.name}</span>
      <span className="action-desc">{opt.desc}</span>
      {opt.detail && <span className="camp-action-stat-detail">{opt.detail}</span>}
      {opt.locked && opt.lockReason && (
        <span className="camp-action-lock-reason">{opt.lockReason}</span>
      )}
    </button>
  );
}

// ── Text column content ──

interface TextColumnProps {
  text: string;
  changes?: string[];
}

function TextColumn({ text, changes }: TextColumnProps) {
  return (
    <div className="camp-action-result">
      <div
        className="camp-action-result-text"
        dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, '<br>') }}
      />
      {changes && changes.length > 0 && (
        <div
          className="camp-action-result-changes"
          dangerouslySetInnerHTML={{ __html: changes.join(' &nbsp; ') }}
        />
      )}
    </div>
  );
}

// ── Passe-dix gambling sub-panel ──

const STAKE_KEYS: PasseDixStake[] = ['low', 'medium', 'high'];

const PASSE_DIX_FLAVOR =
  'Passe-dix. Three dice on the drumhead. Call the total \u2014 over ten or under. Simple as a musket ball.';

interface PasseDixPanelProps {
  onActivity: (activityId: CampActivityId, subId?: string) => void;
  onBack: () => void;
  textContent: string;
  textChanges?: string[];
}

function PasseDixPanel({ onActivity, onBack, textContent, textChanges }: PasseDixPanelProps) {
  const [selectedStake, setSelectedStake] = useState<PasseDixStake>('medium');
  const campActionResult = useUiStore((s) => s.campActionResult);

  const handleBet = useCallback(
    (bet: 'passe' | 'manque') => {
      onActivity(CampActivityId.Gamble, `${selectedStake}:${bet}`);
    },
    [onActivity, selectedStake],
  );

  const hasResult = !!campActionResult;

  return (
    <div className="camp-action-panel" id="camp-action-panel" style={{ display: 'flex' }}>
      <div className="camp-panel-choices">
        <div className="camp-action-header">PASSE-DIX</div>

        {!hasResult && (
          <>
            <div className="passe-dix-section-label">STAKE</div>
            <div className="passe-dix-stakes">
              {STAKE_KEYS.map((key) => {
                const cfg = STAKE_CONFIG[key];
                return (
                  <button
                    key={key}
                    className={`passe-dix-stake-btn${selectedStake === key ? ' selected' : ''}`}
                    onClick={() => setSelectedStake(key)}
                  >
                    <span className="passe-dix-stake-name">{cfg.label}</span>
                    <span className="passe-dix-stake-detail">
                      Win +{cfg.repWin} / Lose {cfg.repLose || '0'} rep
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="passe-dix-section-label">CALL</div>
            <div className="passe-dix-bets">
              <button
                className="passe-dix-bet-btn passe-dix-bet-passe"
                onClick={() => handleBet('passe')}
              >
                <span className="passe-dix-bet-name">Passe</span>
                <span className="passe-dix-bet-detail">Over 10</span>
              </button>
              <button
                className="passe-dix-bet-btn passe-dix-bet-manque"
                onClick={() => handleBet('manque')}
              >
                <span className="passe-dix-bet-name">Manque</span>
                <span className="passe-dix-bet-detail">10 or under</span>
              </button>
            </div>
          </>
        )}

        <button className="camp-action-back" onClick={onBack}>
          BACK
        </button>
      </div>

      <div className="camp-panel-text">
        <TextColumn
          text={hasResult ? textContent : PASSE_DIX_FLAVOR}
          changes={hasResult ? textChanges : undefined}
        />
      </div>
    </div>
  );
}

// ── Main component ──

interface CampActionPanelProps {
  categoryId: CampActivityId;
  onActivity: (activityId: CampActivityId, subId?: string) => void;
}

export function CampActionPanel({ categoryId, onActivity }: CampActionPanelProps) {
  const gameState = useGameStore((s) => s.gameState);
  const campActionResult = useUiStore((s) => s.campActionResult);
  const campActionSub = useUiStore((s) => s.campActionSub);
  const setCampActionSub = useUiStore((s) => s.setCampActionSub);

  if (!gameState || !gameState.campState) return null;

  const player = gameState.player;
  const npcs = gameState.npcs;
  const camp = gameState.campState;
  const data = getOptionsForCategory(categoryId, player, npcs, camp);

  // Determine text column content
  let textContent: string;
  let textChanges: string[] | undefined;

  if (campActionResult) {
    textContent = campActionResult.text;
    textChanges = campActionResult.changes;
  } else if (campActionSub === 'write_letter') {
    textContent =
      'You grip the quill. The page stares back. You never learned. You fold the paper and put it away.';
  } else {
    textContent = data.flavor;
  }

  // ── Sub-menu: Duties > Check Equipment ──
  if (campActionSub === 'check_equipment') {
    return (
      <div className="camp-action-panel" id="camp-action-panel" style={{ display: 'flex' }}>
        <div className="camp-panel-choices">
          <div className="camp-action-header">MAINTAIN EQUIPMENT</div>
          {getEquipmentOptions(player).map((opt) => (
            <ActionButton key={opt.id} opt={opt} onClick={() => {}} />
          ))}
          <button
            className="camp-action-back"
            onClick={() => setCampActionSub(null)}
          >
            BACK
          </button>
        </div>
        <div className="camp-panel-text">
          <TextColumn text={textContent} changes={textChanges} />
        </div>
      </div>
    );
  }

  // ── Sub-menu: Socialize > Write a Letter ──
  if (campActionSub === 'write_letter') {
    return (
      <div className="camp-action-panel" id="camp-action-panel" style={{ display: 'flex' }}>
        <div className="camp-panel-choices">
          <div className="camp-action-header">WRITE A LETTER</div>
          <button
            className="camp-action-back"
            onClick={() => setCampActionSub(null)}
          >
            BACK
          </button>
        </div>
        <div className="camp-panel-text">
          <TextColumn text={textContent} changes={textChanges} />
        </div>
      </div>
    );
  }

  // ── Sub-menu: Socialize > Gamble (Passe-dix) ──
  if (campActionSub === 'gamble') {
    return (
      <PasseDixPanel
        onActivity={onActivity}
        onBack={() => setCampActionSub(null)}
        textContent={textContent}
        textChanges={textChanges}
      />
    );
  }

  // ── Main category view ──
  return (
    <div className="camp-action-panel" id="camp-action-panel" style={{ display: 'flex' }}>
      <div className="camp-panel-choices">
        <div className="camp-action-header">{data.title}</div>

        {/* Arms Training uses tiered layout */}
        {data.tiers && data.tiers.map((tierGroup) => (
          <React.Fragment key={tierGroup.tier}>
            <div className={`camp-action-tier-header${tierGroup.locked ? ' locked' : ''}`}>
              <span className="camp-action-tier-label">{tierGroup.label}</span>
              {tierGroup.repReq && (
                <span className={`camp-action-tier-req${tierGroup.repMet ? ' met' : ''}`}>
                  {tierGroup.locked ? 'Requires ' : ''}
                  {tierGroup.repReq}
                  {tierGroup.repMet ? ' \u2713' : ''}
                </span>
              )}
              <span className="camp-action-tier-cap">Cap: {tierGroup.cap}</span>
            </div>
            {tierGroup.options.map((opt) => {
              const isLocked = tierGroup.locked || opt.locked;
              return (
                <ActionButton
                  key={opt.id}
                  opt={{ ...opt, locked: isLocked }}
                  onClick={() => onActivity(CampActivityId.ArmsTraining, opt.id)}
                />
              );
            })}
          </React.Fragment>
        ))}

        {/* Standard options layout */}
        {!data.tiers && data.options && data.options.map((opt) => {
          let handler: () => void;

          if (categoryId === CampActivityId.Socialize) {
            if (opt.id === 'write_letter') {
              handler = () => setCampActionSub('write_letter');
            } else if (opt.id === 'gamble') {
              handler = () => setCampActionSub('gamble');
            } else {
              handler = () => {
                const npc = npcs.find((n) => n.id === opt.id);
                const name = npc ? npc.name : opt.name;
                useUiStore.getState().setCampActionResult({
                  text: `${name} doesn't have anything to say to you right now.`,
                  changes: [],
                });
              };
            }
          } else if (categoryId === CampActivityId.Duties && opt.id === 'check_equipment') {
            handler = () => setCampActionSub('check_equipment');
          } else {
            handler = () => onActivity(categoryId, opt.id);
          }

          return <ActionButton key={opt.id} opt={opt} onClick={handler} />;
        })}
      </div>

      <div className="camp-panel-text">
        <TextColumn text={textContent} changes={textChanges} />
      </div>
    </div>
  );
}
