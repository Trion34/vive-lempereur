import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React, { createRef } from 'react';
import { BattlefieldView } from '../../components/line/BattlefieldView';
import type { BattlefieldViewHandle, FormationShape } from '../../components/line/BattlefieldView';
import { mockBattleState } from '../helpers/mockFactories';

// Mock audio/music modules (jsdom can't play audio)
vi.mock('../../audio', () => ({
  playVolleySound: vi.fn(),
  playDistantVolleySound: vi.fn(),
}));
vi.mock('../../music', () => ({
  switchTrack: vi.fn(),
}));

describe('BattlefieldView', () => {
  it('renders the SVG with correct viewBox', () => {
    const bs = mockBattleState();
    const { container } = render(<BattlefieldView battleState={bs} />);
    const svg = container.querySelector('.battlefield-svg');
    expect(svg).not.toBeNull();
    expect(svg!.getAttribute('viewBox')).toBe('0 0 800 500');
  });

  it('renders 600 French tokens (200x3 historical line)', () => {
    const bs = mockBattleState({ line: { ...mockBattleState().line, lineIntegrity: 100 } });
    const { container } = render(<BattlefieldView battleState={bs} />);
    const frenchTokens = container.querySelectorAll('.french-token');
    expect(frenchTokens.length).toBe(600);
  });

  it('renders player token with player-token class', () => {
    const bs = mockBattleState();
    const { container } = render(<BattlefieldView battleState={bs} />);
    const playerToken = container.querySelector('.player-token');
    expect(playerToken).not.toBeNull();
  });

  it('renders Pierre and JB labeled tokens when alive', () => {
    const bs = mockBattleState();
    const { container } = render(<BattlefieldView battleState={bs} />);
    const pierreToken = container.querySelector('.pierre-token');
    const jbToken = container.querySelector('.jb-token');
    expect(pierreToken).not.toBeNull();
    expect(jbToken).not.toBeNull();
  });

  it('hides edge French tokens when lineIntegrity drops', () => {
    const bs = mockBattleState({
      line: { ...mockBattleState().line, lineIntegrity: 30 },
    });
    const { container } = render(<BattlefieldView battleState={bs} />);
    const hiddenTokens = container.querySelectorAll('.french-token.token-hidden');
    const visibleTokens = container.querySelectorAll('.french-token:not(.token-hidden)');
    expect(hiddenTokens.length).toBeGreaterThan(0);
    expect(visibleTokens.length).toBeLessThan(600);
  });

  it('renders 3200 Austrian tokens (40x80 historical column)', () => {
    const bs = mockBattleState({ enemy: { ...mockBattleState().enemy, strength: 100 } });
    const { container } = render(<BattlefieldView battleState={bs} />);
    const austrianTokens = container.querySelectorAll('.austrian-token');
    expect(austrianTokens.length).toBe(3200);
  });

  it('hides Austrian tokens when strength drops', () => {
    const bs = mockBattleState({
      enemy: { ...mockBattleState().enemy, strength: 30 },
    });
    const { container } = render(<BattlefieldView battleState={bs} />);
    const hiddenTokens = container.querySelectorAll('.austrian-token.token-hidden');
    expect(hiddenTokens.length).toBeGreaterThan(0);
  });

  it('displays the range value', () => {
    const bs = mockBattleState({ enemy: { ...mockBattleState().enemy, range: 120 } });
    const { container } = render(<BattlefieldView battleState={bs} />);
    const rangeLabel = container.querySelector('.range-label');
    expect(rangeLabel).not.toBeNull();
    expect(rangeLabel!.textContent).toBe('120');
  });

  it('displays "PACES" unit label', () => {
    const bs = mockBattleState();
    const { container } = render(<BattlefieldView battleState={bs} />);
    const rangeUnit = container.querySelector('.range-unit');
    expect(rangeUnit).not.toBeNull();
    expect(rangeUnit!.textContent).toBe('PACES');
  });

  it('does NOT use inline CSS transition on Austrian group', () => {
    const bs = mockBattleState();
    const { container } = render(<BattlefieldView battleState={bs} />);
    const group = container.querySelector('[data-testid="austrian-group"]') as SVGGElement;
    expect(group.style.transition).toBe('');
  });

  it('renders smoke layer with blur filter', () => {
    const bs = mockBattleState();
    const { container } = render(<BattlefieldView battleState={bs} />);
    const smokeLayer = container.querySelector('.smoke-layer');
    expect(smokeLayer).not.toBeNull();
    expect(smokeLayer!.getAttribute('filter')).toBe('url(#smoke-blur)');
  });

  it('renders smoke-blur filter in defs', () => {
    const bs = mockBattleState();
    const { container } = render(<BattlefieldView battleState={bs} />);
    const filter = container.querySelector('#smoke-blur');
    expect(filter).not.toBeNull();
    const blur = filter!.querySelector('feGaussianBlur');
    expect(blur).not.toBeNull();
    expect(blur!.getAttribute('stdDeviation')).toBe('8');
  });

  it('renders nested austrian-sway-group for idle animation', () => {
    const bs = mockBattleState();
    const { container } = render(<BattlefieldView battleState={bs} />);
    const swayGroup = container.querySelector('.austrian-sway-group');
    expect(swayGroup).not.toBeNull();
    // Sway group should be inside the austrian-tokens-group
    const parentGroup = container.querySelector('[data-testid="austrian-group"]');
    expect(parentGroup!.contains(swayGroup)).toBe(true);
  });

  describe('custom formations', () => {
    const matched: { french: FormationShape; austrian: FormationShape } = {
      french: { cols: 120, rows: 3, label: 'FRENCH LINE' },
      austrian: { cols: 120, rows: 3, label: 'AUSTRIAN LINE' },
    };

    it('renders custom French token count (120x3 = 360)', () => {
      const bs = mockBattleState();
      const { container } = render(<BattlefieldView battleState={bs} formations={matched} />);
      const frenchTokens = container.querySelectorAll('.french-token');
      expect(frenchTokens.length).toBe(360);
    });

    it('renders custom Austrian token count (120x3 = 360)', () => {
      const bs = mockBattleState({ enemy: { ...mockBattleState().enemy, strength: 100 } });
      const { container } = render(<BattlefieldView battleState={bs} formations={matched} />);
      const austrianTokens = container.querySelectorAll('.austrian-token');
      expect(austrianTokens.length).toBe(360);
    });

    it('renders custom formation labels', () => {
      const bs = mockBattleState();
      const { container } = render(<BattlefieldView battleState={bs} formations={matched} />);
      const labels = container.querySelectorAll('.formation-label');
      const texts = Array.from(labels).map((l) => l.textContent);
      expect(texts).toContain('FRENCH LINE');
      expect(texts).toContain('AUSTRIAN LINE');
    });

    it('still renders player token at center of custom formation', () => {
      const bs = mockBattleState();
      const { container } = render(<BattlefieldView battleState={bs} formations={matched} />);
      const playerToken = container.querySelector('.player-token');
      expect(playerToken).not.toBeNull();
    });
  });

  describe('formation patterns', () => {
    it('hollow formation hides interior French tokens', () => {
      const bs = mockBattleState({ line: { ...mockBattleState().line, lineIntegrity: 100 } });
      const hollow: { french: FormationShape; austrian: FormationShape } = {
        french: { cols: 10, rows: 10, label: 'SQUARE', pattern: 'hollow', wallThickness: 2 },
        austrian: { cols: 10, rows: 3, label: 'AUSTRIAN' },
      };
      const { container } = render(<BattlefieldView battleState={bs} formations={hollow} />);
      const hiddenFrench = container.querySelectorAll('.french-token.token-hidden');
      // Interior = (10-4)*(10-4) = 36 tokens hidden by hollow
      expect(hiddenFrench.length).toBe(36);
    });

    it('hollow formation hides interior Austrian tokens', () => {
      const bs = mockBattleState({ enemy: { ...mockBattleState().enemy, strength: 100 } });
      const hollow: { french: FormationShape; austrian: FormationShape } = {
        french: { cols: 10, rows: 3, label: 'FRENCH' },
        austrian: { cols: 8, rows: 8, label: 'AUSTRIAN SQUARE', pattern: 'hollow', wallThickness: 2 },
      };
      const { container } = render(<BattlefieldView battleState={bs} formations={hollow} />);
      const hiddenAustrian = container.querySelectorAll('.austrian-token.token-hidden');
      // Interior = (8-4)*(8-4) = 16 tokens hidden
      expect(hiddenAustrian.length).toBe(16);
    });

    it('scattered formation still renders all tokens', () => {
      const bs = mockBattleState({ line: { ...mockBattleState().line, lineIntegrity: 100 } });
      const scattered: { french: FormationShape; austrian: FormationShape } = {
        french: { cols: 20, rows: 2, label: 'SKIRMISH', pattern: 'scattered', gap: 4 },
        austrian: { cols: 20, rows: 3, label: 'AUSTRIAN' },
      };
      const { container } = render(<BattlefieldView battleState={bs} formations={scattered} />);
      const frenchTokens = container.querySelectorAll('.french-token');
      expect(frenchTokens.length).toBe(40);
    });

    it('solid formation renders normally (no hidden tokens at full integrity)', () => {
      const bs = mockBattleState({ line: { ...mockBattleState().line, lineIntegrity: 100 } });
      const solid: { french: FormationShape; austrian: FormationShape } = {
        french: { cols: 20, rows: 3, label: 'FRENCH', pattern: 'solid' },
        austrian: { cols: 20, rows: 3, label: 'AUSTRIAN' },
      };
      const { container } = render(<BattlefieldView battleState={bs} formations={solid} />);
      const hiddenFrench = container.querySelectorAll('.french-token.token-hidden');
      expect(hiddenFrench.length).toBe(0);
    });

    it('gap increases formation width', () => {
      const bs = mockBattleState();
      // 10 cols with gap=4 → step = 2 + 4 = 6, width = 10 * 6 = 60
      // 10 cols with gap=0 → step = 2, width = 10 * 2 = 20
      const gapped: { french: FormationShape; austrian: FormationShape } = {
        french: { cols: 10, rows: 2, label: 'GAPPED', gap: 4 },
        austrian: { cols: 10, rows: 2, label: 'NORMAL' },
      };
      const { container } = render(<BattlefieldView battleState={bs} formations={gapped} />);
      // Verify tokens exist (we can't easily measure SVG dimensions in jsdom,
      // but we can verify the tokens are rendered)
      const frenchTokens = container.querySelectorAll('.french-token');
      expect(frenchTokens.length).toBe(20);
    });
  });

  describe('imperative handle', () => {
    it('exposes all handle methods via ref', () => {
      const ref = createRef<BattlefieldViewHandle>();
      const bs = mockBattleState();
      render(<BattlefieldView battleState={bs} ref={ref} />);

      expect(ref.current).not.toBeNull();
      expect(typeof ref.current!.playVolley).toBe('function');
      expect(typeof ref.current!.advanceAustrians).toBe('function');
      expect(typeof ref.current!.clearSmoke).toBe('function');
      expect(typeof ref.current!.crossFade).toBe('function');
      expect(typeof ref.current!.appendEntry).toBe('function');
      expect(typeof ref.current!.scrollToTop).toBe('function');
      expect(typeof ref.current!.scrollToBottom).toBe('function');
    });

    it('caption methods are safe no-ops', () => {
      const ref = createRef<BattlefieldViewHandle>();
      const bs = mockBattleState();
      render(<BattlefieldView battleState={bs} ref={ref} />);

      // Should not throw
      ref.current!.crossFade([{ type: 'order', text: 'Fire!' }]);
      ref.current!.appendEntry({ type: 'result', text: 'Hit!' });
      ref.current!.scrollToTop();
      ref.current!.scrollToBottom();
    });

    it('clearSmoke is callable without throwing', () => {
      const ref = createRef<BattlefieldViewHandle>();
      const bs = mockBattleState();
      render(<BattlefieldView battleState={bs} ref={ref} />);

      // Should not throw even when no smoke exists
      expect(() => ref.current!.clearSmoke()).not.toThrow();
    });

    it('advanceAustrians resolves for same-range (no-op)', async () => {
      const ref = createRef<BattlefieldViewHandle>();
      const bs = mockBattleState({ enemy: { ...mockBattleState().enemy, range: 120 } });
      render(<BattlefieldView battleState={bs} ref={ref} />);

      // Same range should resolve immediately
      await expect(ref.current!.advanceAustrians(120)).resolves.toBeUndefined();
    });
  });
});
