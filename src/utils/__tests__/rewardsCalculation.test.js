import {
  calculateTransactionPoints,
  getUniqueMonthsAndYears,
  calculateMonthlyRewards,
  calculateTotalRewards,
  generateMonthlyRewardsData,
  getMonthName,
} from '../../utils/rewardsCalculation';

describe('calculateTransactionPoints', () => {
  it('returns 0 for amounts <= 50', () => {
    expect(calculateTransactionPoints(0)).toBe(0);
    expect(calculateTransactionPoints(49.99)).toBe(0);
    expect(calculateTransactionPoints(50)).toBe(0);
  });

  it('handles decimals between 50 and 100 using floor', () => {
    expect(calculateTransactionPoints(50.2)).toBe(0);
    expect(calculateTransactionPoints(99.9)).toBe(49);
    expect(calculateTransactionPoints(100)).toBe(50);
  });

  it('awards 50 for just over 100 due to floor', () => {
    expect(calculateTransactionPoints(100.2)).toBe(50);
    expect(calculateTransactionPoints(100.4)).toBe(50);
  });

  it('calculates points over 100 correctly', () => {
    // 50 for the 50-100 band, plus 2 per dollar over 100
    expect(calculateTransactionPoints(120)).toBe(50 + 40);
    expect(calculateTransactionPoints(150.4)).toBe(50 + Math.floor((150.4 - 100) * 2));
  });
});

describe('month/year utilities', () => {
  const tx = [
    { customerId: 1, amount: 120, date: '2023-12-15' },
    { customerId: 1, amount: 80, date: '2024-01-05' },
    { customerId: 2, amount: 160, date: '2024-02-10' },
  ];

  it('extracts unique months across year boundaries in order', () => {
    const res = getUniqueMonthsAndYears(tx);
    expect(res).toEqual([
      { month: 11, year: 2023 },
      { month: 0, year: 2024 },
      { month: 1, year: 2024 },
    ]);
  });

  it('gets month names', () => {
    expect(getMonthName(0)).toBe('January');
    expect(getMonthName(11)).toBe('December');
  });
});

describe('aggregation', () => {
  const transactions = [
    { customerId: 1, amount: 120.2, date: '2023-12-15' },
    { customerId: 1, amount: 180.5, date: '2024-01-22' },
    { customerId: 1, amount: 90.75, date: '2024-02-08' },
    { customerId: 2, amount: 250.3, date: '2024-02-03' },
  ];
  const customers = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
  ];

  it('calculates monthly rewards by customer and month/year', () => {
    const decPoints = calculateMonthlyRewards(transactions, 1, 11, 2023);
    const janPoints = calculateMonthlyRewards(transactions, 1, 0, 2024);
    const febPointsUser2 = calculateMonthlyRewards(transactions, 2, 1, 2024);

    expect(decPoints).toBe(calculateTransactionPoints(120.2));
    expect(janPoints).toBe(calculateTransactionPoints(180.5));
    expect(febPointsUser2).toBe(calculateTransactionPoints(250.3));
  });

  it('calculates total rewards by customer', () => {
    const total1 = calculateTotalRewards(transactions, 1);
    const total2 = calculateTotalRewards(transactions, 2);
    const expected1 =
      calculateTransactionPoints(120.2) +
      calculateTransactionPoints(180.5) +
      calculateTransactionPoints(90.75);
    const expected2 = calculateTransactionPoints(250.3);
    expect(total1).toBe(expected1);
    expect(total2).toBe(expected2);
  });

  it('generates monthly rewards data matching unique months', () => {
    const data = generateMonthlyRewardsData(transactions, customers);
    const months = getUniqueMonthsAndYears(transactions);
    // Expect customers x months rows
    expect(data.length).toBe(customers.length * months.length);
  });
});


