import { useState, useCallback } from 'react';
import React from 'react';

export function useToast() {
  const [msg, setMsg] = useState<string | null>(null);
  const show = useCallback((text: string) => {
    setMsg(text);
    setTimeout(() => setMsg(null), 1500);
  }, []);
  const el = msg ? React.createElement('div', { className: 'lb-toast' }, msg) : null;
  return { show, el };
}
