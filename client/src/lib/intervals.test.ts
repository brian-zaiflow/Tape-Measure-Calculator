import { describe, it, expect } from 'vitest';
import type { ImperialMeasurement } from '@/types';
import {
  parseInput,
  toDecimalInches,
  toImperialMeasurement,
  formatImperialMeasurement,
} from './fraction-math';

/**
 * Tests for the single even-spacing interval feature used by client/src/pages/intervals.tsx.
 */

type EvenSpacingResult = {
  marks: ImperialMeasurement[];
  spacing: number;
  span: number;
  warning?: string;
};

function calculateEvenSpacing(
  totalLength: string,
  edgeOffset: string,
  itemCount: number
): EvenSpacingResult {
  const totalParsed = parseInput(totalLength);
  const offsetParsed = parseInput(edgeOffset);

  if (!totalParsed || !offsetParsed) {
    throw new Error('Failed to parse input');
  }

  const totalInches = toDecimalInches(totalParsed);
  const offsetInches = toDecimalInches(offsetParsed);

  if (itemCount < 2) {
    return {
      marks: [],
      spacing: 0,
      span: 0,
      warning: 'Enter at least 2 items to calculate even spacing.',
    };
  }

  if (offsetInches * 2 >= totalInches) {
    return {
      marks: [],
      spacing: 0,
      span: 0,
      warning: 'Edge offset is too large. It must be less than half the total length.',
    };
  }

  const firstPosition = offsetInches;
  const lastPosition = totalInches - offsetInches;
  const span = lastPosition - firstPosition;
  const spacing = span / (itemCount - 1);

  const marks: ImperialMeasurement[] = [];
  for (let i = 0; i < itemCount; i++) {
    const position = firstPosition + spacing * i;
    marks.push(toImperialMeasurement(position));
  }

  return { marks, spacing, span };
}

describe('Even Spacing Calculator', () => {
  it('places 5 items on a 30 3/8" board with 2" offsets', () => {
    const result = calculateEvenSpacing('30 3/8"', '2"', 5);

    expect(result.span).toBe(26.375);
    expect(result.spacing).toBe(6.59375);
    expect(result.marks).toHaveLength(5);
    expect(result.marks.map(formatImperialMeasurement)).toEqual([
      '2"',
      '8 5/8"',
      '15 3/16"',
      '21 13/16"',
      '28 3/8"',
    ]);
  });

  it('places 3 items on a 48" board with 2" offsets', () => {
    const result = calculateEvenSpacing('48"', '2"', 3);

    expect(result.span).toBe(44);
    expect(result.spacing).toBe(22);
    expect(result.marks.map(formatImperialMeasurement)).toEqual([
      '2"',
      '24"',
      '46"',
    ]);
  });

  it('rejects feet notation for total length', () => {
    expect(parseInput('8\'')).toBeNull();
  });

  it('handles fractional total length and offset', () => {
    const result = calculateEvenSpacing('48 1/2"', '1 1/4"', 4);

    expect(result.span).toBe(46);
    expect(result.spacing).toBeCloseTo(15.333333, 4);
    expect(result.marks).toHaveLength(4);
    expect(formatImperialMeasurement(result.marks[0])).toBe('1 1/4"');
    expect(formatImperialMeasurement(result.marks[3])).toBe('47 1/4"');
  });

  it('handles the minimum of 2 items', () => {
    const result = calculateEvenSpacing('24"', '3"', 2);

    expect(result.spacing).toBe(18);
    expect(result.marks.map(formatImperialMeasurement)).toEqual([
      '3"',
      '21"',
    ]);
  });

  it('warns when item count is less than 2', () => {
    const result = calculateEvenSpacing('24"', '3"', 1);

    expect(result.marks).toHaveLength(0);
    expect(result.warning).toBe('Enter at least 2 items to calculate even spacing.');
  });

  it('warns when offset is too large', () => {
    const result = calculateEvenSpacing('24"', '12"', 4);

    expect(result.marks).toHaveLength(0);
    expect(result.warning).toBe('Edge offset is too large. It must be less than half the total length.');
  });
});
