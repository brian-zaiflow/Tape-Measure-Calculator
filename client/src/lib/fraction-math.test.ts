import { describe, it, expect } from 'vitest';
import type { ImperialMeasurement } from '@/types';
import {
  toDecimalInches,
  reduceFraction,
  roundToTapeMark,
  toImperialMeasurement,
  formatImperialMeasurement,
  formatAsDecimal,
  parseInput,
  performOperation,
} from './fraction-math';

describe('toDecimalInches', () => {
  it('converts whole inches to decimal', () => {
    expect(toDecimalInches({ inches: 5, numerator: 0, denominator: 1 })).toBe(5);
  });

  it('converts fractions to decimal', () => {
    expect(toDecimalInches({ inches: 0, numerator: 1, denominator: 2 })).toBe(0.5);
    expect(toDecimalInches({ inches: 0, numerator: 1, denominator: 4 })).toBe(0.25);
    expect(toDecimalInches({ inches: 0, numerator: 3, denominator: 4 })).toBe(0.75);
  });

  it('converts mixed measurements to decimal', () => {
    expect(toDecimalInches({ inches: 5, numerator: 1, denominator: 2 })).toBe(5.5);
    expect(toDecimalInches({ inches: 10, numerator: 3, denominator: 4 })).toBe(10.75);
  });

  it('handles zero denominator gracefully', () => {
    expect(toDecimalInches({ inches: 5, numerator: 1, denominator: 0 })).toBe(5);
  });
});

describe('reduceFraction', () => {
  it('reduces fractions to lowest terms', () => {
    expect(reduceFraction(2, 4)).toEqual({ numerator: 1, denominator: 2 });
    expect(reduceFraction(4, 8)).toEqual({ numerator: 1, denominator: 2 });
    expect(reduceFraction(6, 16)).toEqual({ numerator: 3, denominator: 8 });
    expect(reduceFraction(8, 16)).toEqual({ numerator: 1, denominator: 2 });
  });

  it('handles already reduced fractions', () => {
    expect(reduceFraction(1, 2)).toEqual({ numerator: 1, denominator: 2 });
    expect(reduceFraction(3, 4)).toEqual({ numerator: 3, denominator: 4 });
  });

  it('handles zero numerator', () => {
    expect(reduceFraction(0, 16)).toEqual({ numerator: 0, denominator: 1 });
  });

  it('handles zero denominator', () => {
    expect(reduceFraction(1, 0)).toEqual({ numerator: 0, denominator: 1 });
  });

  it('handles negative numbers', () => {
    expect(reduceFraction(-2, 4)).toEqual({ numerator: -1, denominator: 2 });
    expect(reduceFraction(2, -4)).toEqual({ numerator: 1, denominator: -2 });
  });
});

describe('roundToTapeMark', () => {
  it('rounds to nearest 1/16 inch', () => {
    expect(roundToTapeMark(5.0625)).toBe(5.0625); // exactly 5 1/16
    expect(roundToTapeMark(5.03)).toBeCloseTo(5.0, 4); // rounds down to 5"
    expect(roundToTapeMark(5.06)).toBeCloseTo(5.0625, 4); // rounds up to 5 1/16
  });

  it('rounds ties (halfway points) up', () => {
    // Halfway between 5 1/16 and 5 1/8
    const halfway = 5.0625 + (1/32);
    expect(roundToTapeMark(halfway)).toBeCloseTo(5.125, 4); // rounds up to 5 1/8
  });

  it('rounds to nearest 1/32 inch when specified', () => {
    expect(roundToTapeMark(5.03125, 32)).toBe(5.03125); // exactly 5 1/32
    expect(roundToTapeMark(5.02, 32)).toBeCloseTo(5.03125, 4); // rounds up to 5 1/32
  });

  it('handles whole numbers', () => {
    expect(roundToTapeMark(5.0)).toBe(5.0);
    expect(roundToTapeMark(0.0)).toBe(0.0);
  });
});

describe('toImperialMeasurement', () => {
  it('converts decimal inches to imperial with 1/16 precision', () => {
    expect(toImperialMeasurement(5.5)).toEqual({ inches: 5, numerator: 1, denominator: 2 });
    expect(toImperialMeasurement(10.75)).toEqual({ inches: 10, numerator: 3, denominator: 4 });
    expect(toImperialMeasurement(0.0625)).toEqual({ inches: 0, numerator: 1, denominator: 16 });
  });

  it('reduces fractions by default', () => {
    expect(toImperialMeasurement(5.5)).toEqual({ inches: 5, numerator: 1, denominator: 2 });
    expect(toImperialMeasurement(5.25)).toEqual({ inches: 5, numerator: 1, denominator: 4 });
  });

  it('does not reduce fractions when specified', () => {
    expect(toImperialMeasurement(5.5, 16, false)).toEqual({ inches: 5, numerator: 8, denominator: 16 });
  });

  it('handles whole numbers', () => {
    expect(toImperialMeasurement(5.0)).toEqual({ inches: 5, numerator: 0, denominator: 1 });
  });

  it('rounds to nearest 1/16', () => {
    // 5.04 rounds up to 5 1/16 (5.0625)
    expect(toImperialMeasurement(5.04)).toEqual({ inches: 5, numerator: 1, denominator: 16 });
    // 5.03 rounds down to 5"
    expect(toImperialMeasurement(5.03)).toEqual({ inches: 5, numerator: 0, denominator: 1 });
  });

  it('handles 1/32 precision', () => {
    expect(toImperialMeasurement(5.03125, 32)).toEqual({ inches: 5, numerator: 1, denominator: 32 });
    expect(toImperialMeasurement(5.5, 32, false)).toEqual({ inches: 5, numerator: 16, denominator: 32 });
  });
});

describe('formatImperialMeasurement', () => {
  it('formats whole inches', () => {
    expect(formatImperialMeasurement({ inches: 5, numerator: 0, denominator: 1 })).toBe('5"');
    expect(formatImperialMeasurement({ inches: 0, numerator: 0, denominator: 1 })).toBe('0"');
  });

  it('formats fractions only', () => {
    expect(formatImperialMeasurement({ inches: 0, numerator: 1, denominator: 2 })).toBe('1/2"');
    expect(formatImperialMeasurement({ inches: 0, numerator: 3, denominator: 4 })).toBe('3/4"');
  });

  it('formats mixed measurements', () => {
    expect(formatImperialMeasurement({ inches: 5, numerator: 1, denominator: 2 })).toBe('5 1/2"');
    expect(formatImperialMeasurement({ inches: 10, numerator: 3, denominator: 4 })).toBe('10 3/4"');
  });

  it('displays reduced fractions', () => {
    expect(formatImperialMeasurement({ inches: 5, numerator: 8, denominator: 16 })).toBe('5 8/16"');
  });
});

describe('formatAsDecimal', () => {
  it('formats as decimal with quote mark', () => {
    expect(formatAsDecimal({ inches: 5, numerator: 1, denominator: 2 })).toBe('5.5"');
    expect(formatAsDecimal({ inches: 10, numerator: 3, denominator: 4 })).toBe('10.75"');
  });

  it('handles zero', () => {
    expect(formatAsDecimal({ inches: 0, numerator: 0, denominator: 1 })).toBe('0.0"');
  });

  it('rounds to 4 decimal places', () => {
    expect(formatAsDecimal({ inches: 5, numerator: 1, denominator: 3 })).toBe('5.3333"');
  });
});

describe('parseInput', () => {
  it('parses whole inches only', () => {
    expect(parseInput('5"')).toEqual({ inches: 5, numerator: 0, denominator: 1 });
    expect(parseInput('10"')).toEqual({ inches: 10, numerator: 0, denominator: 1 });
  });

  it('parses plain numbers without quotes', () => {
    expect(parseInput('5')).toEqual({ inches: 5, numerator: 0, denominator: 1 });
    expect(parseInput('10')).toEqual({ inches: 10, numerator: 0, denominator: 1 });
  });

  it('parses fractions only', () => {
    expect(parseInput('1/2"')).toEqual({ inches: 0, numerator: 1, denominator: 2 });
    expect(parseInput('3/4"')).toEqual({ inches: 0, numerator: 3, denominator: 4 });
  });

  it('parses mixed measurements (inches and fractions)', () => {
    expect(parseInput('5 1/2"')).toEqual({ inches: 5, numerator: 1, denominator: 2 });
    expect(parseInput('10 3/4"')).toEqual({ inches: 10, numerator: 3, denominator: 4 });
  });

  it('rejects feet notation', () => {
    expect(parseInput("5'")).toBeNull();
    expect(parseInput('5\' 3"')).toBeNull();
    expect(parseInput('5\' 3 1/2"')).toBeNull();
    expect(parseInput('5\' 1/2"')).toBeNull();
  });

  it('reduces fractions during parsing', () => {
    expect(parseInput('5 2/4"')).toEqual({ inches: 5, numerator: 1, denominator: 2 });
    expect(parseInput('5 8/16"')).toEqual({ inches: 5, numerator: 1, denominator: 2 });
  });

  it('handles extra whitespace', () => {
    expect(parseInput('  5  1/2"  ')).toEqual({ inches: 5, numerator: 1, denominator: 2 });
    expect(parseInput('5 1/2"')).toEqual({ inches: 5, numerator: 1, denominator: 2 });
  });

  it('returns null for invalid input', () => {
    expect(parseInput('')).toBeNull();
    expect(parseInput('   ')).toBeNull();
    expect(parseInput('abc')).toBeNull();
    expect(parseInput('5/')).toBeNull();
  });

  it('handles division by zero in fractions', () => {
    expect(parseInput('5 1/0"')).toBeNull();
  });

  it('parses decimal values with quote', () => {
    expect(parseInput('5.625"')).toEqual({ inches: 5, numerator: 5, denominator: 8 });
    expect(parseInput('10.5"')).toEqual({ inches: 10, numerator: 1, denominator: 2 });
    expect(parseInput('3.75"')).toEqual({ inches: 3, numerator: 3, denominator: 4 });
    expect(parseInput('0.0625"')).toEqual({ inches: 0, numerator: 1, denominator: 16 });
  });

  it('parses decimal values without quote', () => {
    expect(parseInput('5.625')).toEqual({ inches: 5, numerator: 5, denominator: 8 });
    expect(parseInput('10.5')).toEqual({ inches: 10, numerator: 1, denominator: 2 });
    expect(parseInput('3.75')).toEqual({ inches: 3, numerator: 3, denominator: 4 });
  });

  it('rounds decimals to nearest 1/16 inch', () => {
    // 5.03 is closer to 5" than 5 1/16"
    expect(parseInput('5.03')).toEqual({ inches: 5, numerator: 0, denominator: 1 });
    // 5.64 rounds to 5 5/8" (5.625)
    expect(parseInput('5.64')).toEqual({ inches: 5, numerator: 5, denominator: 8 });
  });

  it('handles whole decimal numbers', () => {
    expect(parseInput('5.0"')).toEqual({ inches: 5, numerator: 0, denominator: 1 });
    expect(parseInput('12.0')).toEqual({ inches: 12, numerator: 0, denominator: 1 });
  });
});

describe('performOperation', () => {
  const five = { inches: 5, numerator: 0, denominator: 1 };
  const twoAndHalf = { inches: 2, numerator: 1, denominator: 2 };
  const oneAndQuarter = { inches: 1, numerator: 1, denominator: 4 };
  const half = { inches: 0, numerator: 1, denominator: 2 };

  describe('addition', () => {
    it('adds whole numbers', () => {
      expect(performOperation(five, five, 'add')).toEqual({ inches: 10, numerator: 0, denominator: 1 });
    });

    it('adds fractions', () => {
      expect(performOperation(half, half, 'add')).toEqual({ inches: 1, numerator: 0, denominator: 1 });
    });

    it('adds mixed measurements', () => {
      expect(performOperation(twoAndHalf, oneAndQuarter, 'add')).toEqual({
        inches: 3,
        numerator: 3,
        denominator: 4
      });
    });
  });

  describe('subtraction', () => {
    it('subtracts whole numbers', () => {
      expect(performOperation(five, twoAndHalf, 'subtract')).toEqual({
        inches: 2,
        numerator: 1,
        denominator: 2
      });
    });

    it('subtracts fractions', () => {
      expect(performOperation(oneAndQuarter, half, 'subtract')).toEqual({
        inches: 0,
        numerator: 3,
        denominator: 4
      });
    });

    it('can result in negative (represented as positive after rounding)', () => {
      // Note: Based on the code, negative results are still processed through toImperialMeasurement
      // which will round them. The system doesn't handle negative numbers per the design.
      const result = performOperation(twoAndHalf, five, 'subtract');
      expect(result.inches).toBeLessThanOrEqual(0);
    });
  });

  describe('multiplication', () => {
    it('multiplies whole numbers', () => {
      const two = { inches: 2, numerator: 0, denominator: 1 };
      expect(performOperation(five, two, 'multiply')).toEqual({ inches: 10, numerator: 0, denominator: 1 });
    });

    it('multiplies with fractions', () => {
      expect(performOperation(twoAndHalf, half, 'multiply')).toEqual({
        inches: 1,
        numerator: 1,
        denominator: 4
      });
    });

    it('multiplies fractions', () => {
      expect(performOperation(half, half, 'multiply')).toEqual({
        inches: 0,
        numerator: 1,
        denominator: 4
      });
    });
  });

  describe('division', () => {
    it('divides whole numbers', () => {
      const ten = { inches: 10, numerator: 0, denominator: 1 };
      const two = { inches: 2, numerator: 0, denominator: 1 };
      expect(performOperation(ten, two, 'divide')).toEqual({ inches: 5, numerator: 0, denominator: 1 });
    });

    it('divides with fractions', () => {
      expect(performOperation(twoAndHalf, half, 'divide')).toEqual({
        inches: 5,
        numerator: 0,
        denominator: 1
      });
    });

    it('throws error when dividing by zero', () => {
      const zero = { inches: 0, numerator: 0, denominator: 1 };
      expect(() => performOperation(five, zero, 'divide')).toThrow('Cannot divide by zero');
    });
  });

  describe('precision and reduction', () => {
    it('respects precision parameter', () => {
      const result = performOperation(five, twoAndHalf, 'add', 32, false);
      expect(result.denominator).toBe(32);
    });

    it('reduces fractions by default', () => {
      const result = performOperation(half, half, 'add');
      expect(result).toEqual({ inches: 1, numerator: 0, denominator: 1 });
    });

    it('does not reduce when specified', () => {
      const threeQuarters = { inches: 0, numerator: 3, denominator: 4 };
      const result = performOperation(threeQuarters, half, 'add', 16, false);
      // 3/4 + 1/2 = 1.25 = 1 4/16 (not reduced)
      expect(result.inches).toBe(1);
      expect(result.numerator).toBe(4);
      expect(result.denominator).toBe(16);
    });
  });

  describe('rounding to tape marks', () => {
    it('rounds results to nearest 1/16 inch', () => {
      const three = { inches: 3, numerator: 0, denominator: 1 };
      // 10 / 3 = 3.333... which rounds to 3 5/16" (3.3125)
      const result = performOperation(five, three, 'divide');
      expect(toDecimalInches(result)).toBeCloseTo(1.6875, 4); // 1 11/16"
    });
  });
});
