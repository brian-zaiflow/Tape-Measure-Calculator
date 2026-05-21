import type { ImperialMeasurement } from "@/types";

// Convert imperial measurement to decimal inches
export function toDecimalInches(measurement: ImperialMeasurement): number {
  const fractionInches = measurement.denominator !== 0
    ? measurement.numerator / measurement.denominator
    : 0;
  return measurement.inches + fractionInches;
}

// Greatest common divisor for fraction reduction
function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

// Reduce a fraction to lowest terms
export function reduceFraction(numerator: number, denominator: number): { numerator: number; denominator: number } {
  if (denominator === 0) return { numerator: 0, denominator: 1 };
  if (numerator === 0) return { numerator: 0, denominator: 1 };
  
  const divisor = gcd(numerator, denominator);
  return {
    numerator: numerator / divisor,
    denominator: denominator / divisor,
  };
}

// Round to nearest tape mark (1/16 or 1/32 inch)
// Ties (halfway points) round up, following construction practice
export function roundToTapeMark(decimalInches: number, precision: 16 | 32 = 16): number {
  const increment = 1 / precision;
  // Use Math.floor + 0.5 to always round ties up
  return Math.floor((decimalInches / increment) + 0.5) * increment;
}

// Convert decimal inches back to imperial measurement
export function toImperialMeasurement(
  decimalInches: number,
  precision: 16 | 32 = 16,
  reduceToLowestTerms: boolean = true
): ImperialMeasurement {
  // Round to specified precision
  const rounded = roundToTapeMark(decimalInches, precision);

  const wholeInches = Math.floor(rounded);
  const fractionPart = rounded - wholeInches;

  // Convert fraction to specified denominator
  const parts = Math.round(fractionPart * precision);

  let numerator: number = parts;
  let denominator: number = precision;

  // Reduce the fraction if requested
  if (numerator > 0 && reduceToLowestTerms) {
    const reduced = reduceFraction(numerator, denominator);
    numerator = reduced.numerator;
    denominator = reduced.denominator;
  } else if (numerator === 0) {
    numerator = 0;
    denominator = 1;
  }

  return {
    inches: wholeInches,
    numerator,
    denominator,
  };
}

// Format imperial measurement for display (always reduced fractions)
export function formatImperialMeasurement(measurement: ImperialMeasurement): string {
  const { inches, numerator, denominator } = measurement;

  let parts: string[] = [];

  // Handle zero case
  if (inches === 0 && numerator === 0) {
    return '0"';
  }

  // Add inches
  if (inches !== 0) {
    parts.push(`${inches}`);
  }

  // Add fraction (already reduced by toImperialMeasurement)
  if (numerator !== 0) {
    parts.push(`${numerator}/${denominator}`);
  }

  // Build result with quote mark at the end
  if (parts.length === 0) {
    return '0"';
  }

  return parts.join(' ') + '"';
}

// Format imperial measurement as decimal
export function formatAsDecimal(measurement: ImperialMeasurement): string {
  const decimalInches = toDecimalInches(measurement);

  // Handle zero case
  if (decimalInches === 0) {
    return '0.0"';
  }

  // Round to 4 decimal places for display
  const rounded = Math.round(decimalInches * 10000) / 10000;
  return `${rounded}"`;
}

// Parse input string to imperial measurement (inches and fractions only)
export function parseInput(input: string): ImperialMeasurement | null {
  if (!input.trim()) return null;

  const cleaned = input.replace(/\s+/g, ' ').trim();

  // Pattern 1: whole inches with fraction (e.g., "2 1/2"")
  const wholeWithFractionMatch = cleaned.match(/^(\d+)\s+(\d+)\/(\d+)"$/);
  if (wholeWithFractionMatch) {
    const inches = parseInt(wholeWithFractionMatch[1]);
    const numerator = parseInt(wholeWithFractionMatch[2]);
    const denominator = parseInt(wholeWithFractionMatch[3]);

    if (denominator !== 0) {
      const reduced = reduceFraction(numerator, denominator);
      return { inches, numerator: reduced.numerator, denominator: reduced.denominator };
    }
  }

  // Pattern 2: just fraction (e.g., "1/2"")
  const fractionOnlyMatch = cleaned.match(/^(\d+)\/(\d+)"$/);
  if (fractionOnlyMatch) {
    const numerator = parseInt(fractionOnlyMatch[1]);
    const denominator = parseInt(fractionOnlyMatch[2]);

    if (denominator !== 0) {
      const reduced = reduceFraction(numerator, denominator);
      return { inches: 0, numerator: reduced.numerator, denominator: reduced.denominator };
    }
  }

  // Pattern 3: whole inches only (e.g., "2"")
  const wholeOnlyMatch = cleaned.match(/^(\d+)"$/);
  if (wholeOnlyMatch) {
    const inches = parseInt(wholeOnlyMatch[1]);
    return { inches, numerator: 0, denominator: 1 };
  }

  // Pattern 4: decimal with quote (e.g., "5.625"")
  const decimalWithQuoteMatch = cleaned.match(/^(\d+\.?\d*)"$/);
  if (decimalWithQuoteMatch) {
    const decimalValue = parseFloat(decimalWithQuoteMatch[1]);
    if (!isNaN(decimalValue)) {
      // Convert decimal inches to imperial measurement with current precision (default 16)
      // Note: precision will be applied by the caller (calculator) based on user settings
      return toImperialMeasurement(decimalValue, 16, true);
    }
  }

  // Pattern 5: plain decimal without quote (e.g., "5.625")
  const plainDecimalMatch = cleaned.match(/^(\d+\.\d+)$/);
  if (plainDecimalMatch) {
    const decimalValue = parseFloat(plainDecimalMatch[1]);
    if (!isNaN(decimalValue)) {
      return toImperialMeasurement(decimalValue, 16, true);
    }
  }

  // Pattern 6: plain whole number without quote (e.g., "2")
  const plainNumberMatch = cleaned.match(/^(\d+)$/);
  if (plainNumberMatch) {
    const inches = parseInt(plainNumberMatch[1]);
    return { inches, numerator: 0, denominator: 1 };
  }

  return null;
}

// Perform arithmetic operations
export function performOperation(
  left: ImperialMeasurement,
  right: ImperialMeasurement,
  operation: 'add' | 'subtract' | 'multiply' | 'divide',
  precision: 16 | 32 = 16,
  reduceToLowestTerms: boolean = true
): ImperialMeasurement {
  const leftDecimal = toDecimalInches(left);
  const rightDecimal = toDecimalInches(right);

  let result: number;

  switch (operation) {
    case 'add':
      result = leftDecimal + rightDecimal;
      break;
    case 'subtract':
      result = leftDecimal - rightDecimal;
      break;
    case 'multiply':
      result = leftDecimal * rightDecimal;
      break;
    case 'divide':
      if (rightDecimal === 0) {
        throw new Error('Cannot divide by zero');
      }
      result = leftDecimal / rightDecimal;
      break;
    default:
      result = leftDecimal;
  }

  return toImperialMeasurement(result, precision, reduceToLowestTerms);
}
