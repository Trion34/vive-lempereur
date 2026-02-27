import React, { useState, useCallback, useRef, useEffect } from 'react';
import { loadGame } from '../../core/persistence';
import { useGameStore } from '../../stores/gameStore';

interface NameStepProps {
  onNameConfirmed: (name: string) => void;
  onSettingsClick: () => void;
}

export function NameStep({ onNameConfirmed, onSettingsClick }: NameStepProps) {
  const [name, setName] = useState('John');
  const hasSave = useRef(!!loadGame()).current;
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle continue — loadSavedGame() sets gameState/phase in the store;
  // AppRoot subscribes reactively and routes to the correct page.
  const handleContinue = useCallback(() => {
    useGameStore.getState().loadSavedGame();
  }, []);

  const handleConfirm = useCallback(() => {
    const trimmed = name.trim();
    if (!trimmed) {
      inputRef.current?.focus();
      return;
    }
    onNameConfirmed(trimmed);
  }, [name, onNameConfirmed]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleConfirm();
    },
    [handleConfirm],
  );

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="intro-step" id="intro-name-step">
      <label className="intro-label" htmlFor="intro-name-input">
        What is your name, soldier?
      </label>
      <input
        ref={inputRef}
        type="text"
        id="intro-name-input"
        className="intro-input"
        placeholder="Enter your name..."
        maxLength={24}
        autoComplete="off"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className="intro-buttons">
        <button className="intro-btn" id="btn-intro-confirm" onClick={handleConfirm}>
          New Game
        </button>
        {hasSave && (
          <button
            className="intro-btn btn-secondary"
            id="btn-intro-continue"
            onClick={handleContinue}
          >
            Continue
          </button>
        )}
      </div>
      <button className="intro-btn intro-btn-settings" id="btn-intro-settings" onClick={onSettingsClick}>
        Settings
      </button>
    </div>
  );
}
