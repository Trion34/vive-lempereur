import React from 'react';

export function Section({ label }: { label: string }) {
  return React.createElement('div', { className: 'dev-section' }, label);
}

export function Row({ label, children }: { label: string; children?: React.ReactNode }) {
  return React.createElement(
    'div',
    { className: 'dev-row' },
    React.createElement('span', { className: 'dev-label' }, label),
    children,
  );
}

export function Badge({ text }: { text: string }) {
  return React.createElement('span', { className: 'dev-state-badge' }, text);
}

export function ActionBtn({
  label,
  cls,
  onClick,
}: {
  label: string;
  cls?: string;
  onClick: () => void;
}) {
  return React.createElement(
    'button',
    { className: `dev-action-btn ${cls || ''}`, onClick },
    label,
  );
}

export function NumberInput({
  value,
  min,
  max,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return React.createElement(
    'div',
    { style: { display: 'flex', alignItems: 'center', gap: '6px', flex: 1 } },
    React.createElement('input', {
      type: 'range',
      className: 'dev-slider',
      min,
      max,
      value: Math.round(value),
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(Number(e.target.value)),
    }),
    React.createElement('input', {
      type: 'number',
      className: 'dev-input',
      min,
      max,
      value: Math.round(value),
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        onChange(Math.max(min, Math.min(max, Number(e.target.value)))),
    }),
  );
}

export function Checkbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return React.createElement('input', {
    type: 'checkbox',
    className: 'dev-checkbox',
    checked,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.checked),
  });
}

export function Select({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return React.createElement(
    'select',
    {
      className: 'dev-select',
      value,
      onChange: (e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value),
    },
    ...options.map((o) => React.createElement('option', { key: o, value: o }, o)),
  );
}

/** Simple forceUpdate hook: call bump() to trigger re-render */
export function useForceUpdate(): [number, () => void] {
  const [tick, setTick] = React.useState(0);
  return [tick, () => setTick((t) => t + 1)];
}
