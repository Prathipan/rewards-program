

// Calculates reward points for a single transaction amount.
// Uses Math.floor for decimal handling to ensure 100.2 and 100.4 both yield 50.
export const calculateTransactionPoints = (amount) => {
  if (amount <= 50) return 0;
  if (amount <= 100) return Math.floor(amount - 50);
  return Math.floor(50 + (amount - 100) * 2);
};


// Returns a sorted array of unique {month, year} pairs present in transactions.
export const getUniqueMonthsAndYears = (transactions) => {
  return transactions
    .reduce((acc, txn) => {
      const d = new Date(txn.date);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      return acc.includes(key) ? acc : acc.concat(key);
    }, [])
    .map((key) => {
      const [year, month] = key.split('-').map(Number);
      return { month, year };
    })
    .sort((a, b) => (a.year !== b.year ? a.year - b.year : a.month - b.month));
};

export const calculateTotalRewards = (transactions, customerId) =>
  transactions
    .filter((t) => t.customerId === customerId)
    .reduce((sum, t) => sum + calculateTransactionPoints(t.amount), 0);

// Derives unique customers from transactions in a pure manner.
export const getUniqueCustomers = (transactions) =>
  transactions
    .reduce((acc, t) => {
      return acc.find((c) => c.id === t.customerId)
        ? acc
        : acc.concat({ id: t.customerId, name: t.customerName });
    }, []);

export const getMonthName = (monthIndex) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[monthIndex];
};

// Returns a new array of transactions sorted by descending date (no mutation).
export const sortTransactionsByDate = (transactions) =>
  [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));


// Calculates total points for a customer within a specific month and year.
export const calculateMonthlyRewards = (transactions, customerId, month, year) =>
  transactions
    .filter((t) => {
      const d = new Date(t.date);
      return t.customerId === customerId && d.getMonth() === month && d.getFullYear() === year;
    })
    .reduce((sum, t) => sum + calculateTransactionPoints(t.amount), 0);


// Builds an array of monthly reward rows for each customer and month/year pair.
export const generateMonthlyRewardsData = (transactions, customers) => {
  const monthsAndYears = getUniqueMonthsAndYears(transactions);
  return customers.flatMap((customer) =>
    monthsAndYears.map(({ month, year }) => ({
      customerId: customer.id,
      name: customer.name,
      month: getMonthName(month),
      year,
      rewardPoints: calculateMonthlyRewards(transactions, customer.id, month, year),
    }))
  );
};

// Builds total rewards per customer across all transactions.
export const generateTotalRewardsData = (transactions, customers) =>
  customers.map((customer) => ({
    customerName: customer.name,
    rewardPoints: calculateTotalRewards(transactions, customer.id),
  }));

