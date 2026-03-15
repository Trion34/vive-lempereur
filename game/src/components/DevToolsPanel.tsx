import React, { useState, useEffect } from 'react';
import { JumpTab } from './devtools/JumpTab';
import { PlayerTab } from './devtools/PlayerTab';
import { BattleTab } from './devtools/BattleTab';
import { ActionsTab } from './devtools/ActionsTab';
import { AudioTab } from './devtools/AudioTab';

const TABS = ['jump', 'player', 'battle', 'actions', 'audio'] as const;

export function DevToolsPanel() {
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('jump');

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && e.shiftKey && e.key === 'D') ||
        (e.key === '`' && !e.ctrlKey && !e.altKey)
      ) {
        e.preventDefault();
        setVisible((v) => !v);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  if (!visible) return null;

  const onClose = () => setVisible(false);

  return React.createElement(
    'div',
    {
      className: 'dev-overlay',
      style: { display: 'flex' },
      onClick: (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) setVisible(false);
      },
    },
    React.createElement(
      'div',
      { className: 'dev-panel' },
      // Header
      React.createElement(
        'div',
        { className: 'dev-header' },
        React.createElement('span', null, 'Dev Tools'),
        React.createElement(
          'button',
          { className: 'dev-close', onClick: () => setVisible(false) },
          '\u00d7',
        ),
      ),
      // Tabs
      React.createElement(
        'div',
        { className: 'dev-tabs' },
        ...TABS.map((t) =>
          React.createElement(
            'button',
            {
              key: t,
              className: `dev-tab${activeTab === t ? ' active' : ''}`,
              onClick: () => setActiveTab(t),
            },
            t.charAt(0).toUpperCase() + t.slice(1),
          ),
        ),
      ),
      // Content
      React.createElement(
        'div',
        { className: 'dev-content' },
        activeTab === 'jump' && React.createElement(JumpTab, { onClose }),
        activeTab === 'player' && React.createElement(PlayerTab, null),
        activeTab === 'battle' && React.createElement(BattleTab, null),
        activeTab === 'actions' && React.createElement(ActionsTab, { onClose }),
        activeTab === 'audio' && React.createElement(AudioTab, null),
      ),
    ),
  );
}
