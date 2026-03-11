import { describe, it, expect } from 'vitest';
import { Formation } from '../../types';
import {
  FORMATION_SHAPES,
  FORMATION_INFO,
  getFormationShape,
  isHollowTokenVisible,
  getScatteredOffset,
  toFormationShape,
} from '../../core/formations';

describe('formations', () => {
  describe('FORMATION_SHAPES', () => {
    it('has all 4 formation types', () => {
      expect(Object.keys(FORMATION_SHAPES)).toHaveLength(4);
      expect(FORMATION_SHAPES[Formation.Line]).toBeDefined();
      expect(FORMATION_SHAPES[Formation.Column]).toBeDefined();
      expect(FORMATION_SHAPES[Formation.Square]).toBeDefined();
      expect(FORMATION_SHAPES[Formation.Skirmish]).toBeDefined();
    });

    it('Line is wide and thin', () => {
      const s = FORMATION_SHAPES[Formation.Line];
      expect(s.cols).toBe(120);
      expect(s.rows).toBe(3);
      expect(s.pattern).toBe('solid');
    });

    it('Column is narrow and deep', () => {
      const s = FORMATION_SHAPES[Formation.Column];
      expect(s.cols).toBe(12);
      expect(s.rows).toBe(30);
      expect(s.pattern).toBe('solid');
    });

    it('Square is hollow', () => {
      const s = FORMATION_SHAPES[Formation.Square];
      expect(s.cols).toBe(20);
      expect(s.rows).toBe(18);
      expect(s.pattern).toBe('hollow');
      expect(s.wallThickness).toBe(3);
    });

    it('Skirmish is scattered with gap', () => {
      const s = FORMATION_SHAPES[Formation.Skirmish];
      expect(s.cols).toBe(60);
      expect(s.rows).toBe(2);
      expect(s.pattern).toBe('scattered');
      expect(s.gap).toBe(4);
    });
  });

  describe('FORMATION_INFO', () => {
    it('has 4 entries with required fields', () => {
      expect(FORMATION_INFO).toHaveLength(4);
      for (const info of FORMATION_INFO) {
        expect(info.id).toBeDefined();
        expect(info.name).toBeTruthy();
        expect(info.description).toBeTruthy();
        expect(info.icon).toBeTruthy();
      }
    });

    it('covers all formation types', () => {
      const ids = FORMATION_INFO.map((i) => i.id);
      expect(ids).toContain(Formation.Line);
      expect(ids).toContain(Formation.Column);
      expect(ids).toContain(Formation.Square);
      expect(ids).toContain(Formation.Skirmish);
    });
  });

  describe('getFormationShape', () => {
    it('returns correct config for each formation', () => {
      expect(getFormationShape(Formation.Line)).toBe(FORMATION_SHAPES[Formation.Line]);
      expect(getFormationShape(Formation.Column)).toBe(FORMATION_SHAPES[Formation.Column]);
      expect(getFormationShape(Formation.Square)).toBe(FORMATION_SHAPES[Formation.Square]);
      expect(getFormationShape(Formation.Skirmish)).toBe(FORMATION_SHAPES[Formation.Skirmish]);
    });
  });

  describe('isHollowTokenVisible', () => {
    // 6x6 grid with wall thickness 2
    const rows = 6, cols = 6, wall = 2;

    it('tokens on edges are visible', () => {
      // Top edge
      expect(isHollowTokenVisible(0, 3, rows, cols, wall)).toBe(true);
      expect(isHollowTokenVisible(1, 3, rows, cols, wall)).toBe(true);
      // Bottom edge
      expect(isHollowTokenVisible(4, 3, rows, cols, wall)).toBe(true);
      expect(isHollowTokenVisible(5, 3, rows, cols, wall)).toBe(true);
      // Left edge
      expect(isHollowTokenVisible(3, 0, rows, cols, wall)).toBe(true);
      expect(isHollowTokenVisible(3, 1, rows, cols, wall)).toBe(true);
      // Right edge
      expect(isHollowTokenVisible(3, 4, rows, cols, wall)).toBe(true);
      expect(isHollowTokenVisible(3, 5, rows, cols, wall)).toBe(true);
    });

    it('interior tokens are not visible', () => {
      expect(isHollowTokenVisible(2, 2, rows, cols, wall)).toBe(false);
      expect(isHollowTokenVisible(3, 3, rows, cols, wall)).toBe(false);
      expect(isHollowTokenVisible(2, 3, rows, cols, wall)).toBe(false);
      expect(isHollowTokenVisible(3, 2, rows, cols, wall)).toBe(false);
    });

    it('corners are visible', () => {
      expect(isHollowTokenVisible(0, 0, rows, cols, wall)).toBe(true);
      expect(isHollowTokenVisible(0, 5, rows, cols, wall)).toBe(true);
      expect(isHollowTokenVisible(5, 0, rows, cols, wall)).toBe(true);
      expect(isHollowTokenVisible(5, 5, rows, cols, wall)).toBe(true);
    });

    it('wall thickness 0 hides everything', () => {
      expect(isHollowTokenVisible(0, 0, 4, 4, 0)).toBe(false);
      expect(isHollowTokenVisible(2, 2, 4, 4, 0)).toBe(false);
    });

    it('wall thickness >= half makes all visible', () => {
      // 4x4 with wall=2 — every token is within 2 of an edge
      expect(isHollowTokenVisible(0, 0, 4, 4, 2)).toBe(true);
      expect(isHollowTokenVisible(1, 1, 4, 4, 2)).toBe(true);
    });
  });

  describe('getScatteredOffset', () => {
    it('returns deterministic offsets', () => {
      const a = getScatteredOffset(3, 7);
      const b = getScatteredOffset(3, 7);
      expect(a.dx).toBe(b.dx);
      expect(a.dy).toBe(b.dy);
    });

    it('different positions give different offsets', () => {
      const a = getScatteredOffset(0, 0);
      const b = getScatteredOffset(1, 1);
      // Extremely unlikely to be equal for different inputs
      expect(a.dx !== b.dx || a.dy !== b.dy).toBe(true);
    });

    it('offsets are within expected range', () => {
      for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
          const { dx, dy } = getScatteredOffset(r, c);
          expect(dx).toBeGreaterThanOrEqual(-1.5);
          expect(dx).toBeLessThanOrEqual(1.5);
          expect(dy).toBeGreaterThanOrEqual(-1.5);
          expect(dy).toBeLessThanOrEqual(1.5);
        }
      }
    });
  });

  describe('toFormationShape', () => {
    it('converts config to FormationShape with all fields', () => {
      const config = FORMATION_SHAPES[Formation.Square];
      const shape = toFormationShape(config);
      expect(shape.cols).toBe(20);
      expect(shape.rows).toBe(18);
      expect(shape.label).toBe('FRENCH SQUARE');
      expect(shape.pattern).toBe('hollow');
      expect(shape.gap).toBe(0);
      expect(shape.wallThickness).toBe(3);
    });

    it('allows label override', () => {
      const config = FORMATION_SHAPES[Formation.Line];
      const shape = toFormationShape(config, 'CUSTOM LABEL');
      expect(shape.label).toBe('CUSTOM LABEL');
    });
  });
});
