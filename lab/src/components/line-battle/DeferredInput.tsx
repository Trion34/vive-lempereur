import React, { useState, useEffect } from 'react';

/**
 * Text input that uses local state and commits to the store on blur or unmount.
 * Prevents undo stack spam and re-renders during typing.
 * Uses commitRef so the cleanup always calls the latest onCommit callback.
 */
export function DeferredInput({ value, onCommit, ...props }: {
  value: string;
  onCommit: (v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'onBlur'>) {
  const [local, setLocal] = useState(value);
  const localRef = React.useRef(local);
  const valueRef = React.useRef(value);
  const commitRef = React.useRef(onCommit);
  localRef.current = local;
  valueRef.current = value;
  commitRef.current = onCommit;

  useEffect(() => { setLocal(value); }, [value]);

  // Flush pending edits on unmount — uses refs so callback is always current
  useEffect(() => {
    return () => {
      if (localRef.current !== valueRef.current) commitRef.current(localRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <input {...props} type="text" value={local}
      onChange={(e) => setLocal(e.target.value)}
      onBlur={() => { if (local !== value) onCommit(local); }} />
  );
}

export function DeferredTextarea({ value, onCommit, ...props }: {
  value: string;
  onCommit: (v: string) => void;
} & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange' | 'onBlur'>) {
  const [local, setLocal] = useState(value);
  const localRef = React.useRef(local);
  const valueRef = React.useRef(value);
  const commitRef = React.useRef(onCommit);
  localRef.current = local;
  valueRef.current = value;
  commitRef.current = onCommit;

  useEffect(() => { setLocal(value); }, [value]);

  // Flush pending edits on unmount — uses refs so callback is always current
  useEffect(() => {
    return () => {
      if (localRef.current !== valueRef.current) commitRef.current(localRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <textarea {...props} value={local}
      onChange={(e) => setLocal(e.target.value)}
      onBlur={() => { if (local !== value) onCommit(local); }} />
  );
}
