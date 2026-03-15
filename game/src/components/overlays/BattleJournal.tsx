import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../shared/LogEntry';

interface BattleJournalEntry {
  turn: number;
  type: string;
  text: string;
}

interface BattleJournalProps {
  log: BattleJournalEntry[];
  visible: boolean;
  onClose: () => void;
}

export function BattleJournal({ log, visible, onClose }: BattleJournalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when opened or log changes
  useEffect(() => {
    if (visible && scrollRef.current) {
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      });
    }
  }, [visible, log.length]);

  if (!visible) return null;

  const entries: React.ReactNode[] = [];
  for (let i = 0; i < log.length; i++) {
    const entry = log[i];
    // Insert turn separator before narrative entries when turn changes
    if (i > 0 && entry.turn > log[i - 1]?.turn && entry.type === 'narrative') {
      entries.push(<hr key={`sep-${i}`} className="log-separator" />);
      entries.push(
        <div key={`marker-${i}`} className="turn-marker">
          {`\u2014 Turn ${entry.turn} \u2014`}
        </div>,
      );
    }
    entries.push(<LogEntry key={`entry-${i}`} type={entry.type} text={entry.text} />);
  }

  return (
    <div className="journal-overlay" id="journal-overlay" style={{ display: 'flex' }}>
      <div className="journal-content">
        <button className="overlay-close" id="btn-journal-close" onClick={onClose}>
          &times;
        </button>
        <div className="journal-scroll" id="journal-scroll" ref={scrollRef}>
          {entries}
        </div>
      </div>
    </div>
  );
}
