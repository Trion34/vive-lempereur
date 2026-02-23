import React from 'react';
import { getVolume, setVolume, isMuted, toggleMute } from '../../music';
import { Section, Row, NumberInput, Checkbox, useForceUpdate } from './helpers';

export function AudioTab() {
  const [, bump] = useForceUpdate();

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(Section, { label: 'Music' }),
    React.createElement(
      Row,
      { label: 'Volume' },
      React.createElement(NumberInput, {
        value: getVolume() * 100,
        min: 0,
        max: 100,
        onChange: (v) => {
          setVolume(v / 100);
          bump();
        },
      }),
    ),
    React.createElement(
      Row,
      { label: 'Muted' },
      React.createElement(Checkbox, {
        checked: isMuted(),
        onChange: () => {
          toggleMute();
          // Sync the header mute button
          const muteBtn = document.getElementById('btn-mute');
          if (muteBtn) muteBtn.classList.toggle('muted', isMuted());
          bump();
        },
      }),
    ),
  );
}
