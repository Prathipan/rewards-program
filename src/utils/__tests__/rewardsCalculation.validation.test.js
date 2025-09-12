import { calculateTransactionPoints } from '../../utils/rewardsCalculation';

describe('calculateTransactionPoints - validation', () => {
  test('returns 0 for negative amounts', () => {
    expect(calculateTransactionPoints(-1)).toBe(0);
    expect(calculateTransactionPoints(-100.5)).toBe(0);
  });

  test('returns 0 for NaN and non-finite inputs', () => {
    expect(calculateTransactionPoints(NaN)).toBe(0);
    expect(calculateTransactionPoints('not a number')).toBe(0);
    expect(calculateTransactionPoints(Infinity)).toBe(0);
    expect(calculateTransactionPoints(-Infinity)).toBe(0);
  });

  test('coerces numeric strings and computes correctly', () => {
    expect(calculateTransactionPoints('100')).toBe(50);
    expect(calculateTransactionPoints('120.0')).toBe(50 + 40);
  });
});




