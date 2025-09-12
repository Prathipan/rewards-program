
/**
 * Calculates reward points for a single transaction amount.
 *
 * Business rules:
 * - Invalid, non-finite, NaN, or negative amounts yield 0 points
 * - No points for the first $50
 * - 1 point per dollar between $50 and $100 (exclusive of $50)
 * - 2 points per dollar over $100, plus the 50 points from the previous band
 * - Decimals are handled with Math.floor to avoid over-crediting fractions
 *   (e.g., 100.2 and 100.4 both yield 50)
 *
 * @param {number|string} amount Amount of the transaction
 * @returns {number} Reward points for the transaction amount
 */
export const calculateTransactionPoints = (amount) => {
  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount) || Number.isNaN(numericAmount) || numericAmount < 0) return 0;
  if (numericAmount <= 50) return 0;
  if (numericAmount <= 100) return Math.floor(numericAmount - 50);
  return Math.floor(50 + (numericAmount - 100) * 2);
};

/**
 * Derives a sorted list of unique month/year pairs present in the data.
 *
 * @param {Array<{date: string}>} transactions List of transactions
 * @returns {Array<{month: number, year: number}>} Unique month/year pairs sorted ascending
 */
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

/**
 * Sums all reward points for a given customer across transactions.
 *
 * @param {Array<{customerId: number, amount: number}>} transactions List of transactions
 * @param {number} customerId Customer identifier to aggregate by
 * @returns {number} Total reward points for the customer
 */
export const calculateTotalRewards = (transactions, customerId) =>
  transactions
    .filter((t) => t.customerId === customerId)
    .reduce((sum, t) => sum + calculateTransactionPoints(t.amount), 0);

/**
 * Returns a unique list of customers derived from transactions.
 *
 * @param {Array<{customerId: number, customerName: string}>} transactions List of transactions
 * @returns {Array<{id: number, name: string}>} Unique customers
 */
export const getUniqueCustomers = (transactions) =>
  transactions
    .reduce((acc, t) => {
      return acc.find((c) => c.id === t.customerId)
        ? acc
        : acc.concat({ id: t.customerId, name: t.customerName });
    }, []);

/**
 * Converts a month index (0-11) to its English month name.
 *
 * @param {number} monthIndex Zero-based month index (0 = January)
 * @returns {string} Month name
 */
export const getMonthName = (monthIndex) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[monthIndex];
};

/**
 * Returns a new array of transactions sorted by descending date.
 *
 * @param {Array<{date: string}>} transactions List of transactions
 * @returns {Array} New array sorted by most recent first
 */
export const sortTransactionsByDate = (transactions) =>
  [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

/**
 * Calculates total reward points for a specific customer within a given month/year.
 *
 * @param {Array<{customerId: number, amount: number, date: string}>} transactions List of transactions
 * @param {number} customerId Customer identifier
 * @param {number} month Zero-based month index to filter by
 * @param {number} year Four-digit year to filter by
 * @returns {number} Total reward points in the specified period
 */
export const calculateMonthlyRewards = (transactions, customerId, month, year) =>
  transactions
    .filter((t) => {
      const d = new Date(t.date);
      return t.customerId === customerId && d.getMonth() === month && d.getFullYear() === year;
    })
    .reduce((sum, t) => sum + calculateTransactionPoints(t.amount), 0);

/**
 * Builds tabular data of monthly reward points for each customer and month/year pair.
 *
 * @param {Array} transactions List of transactions
 * @param {Array<{id: number, name: string}>} customers List of customers
 * @returns {Array<{customerId: number, name: string, month: string, year: number, rewardPoints: number}>}
 *   One row per customer per month/year present in the data
 */
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

/**
 * Builds total rewards per customer across all transactions.
 *
 * @param {Array} transactions List of transactions
 * @param {Array<{id: number, name: string}>} customers List of customers
 * @returns {Array<{customerName: string, rewardPoints: number}>} Total reward points per customer
 */
export const generateTotalRewardsData = (transactions, customers) =>
  customers.map((customer) => ({
    customerName: customer.name,
    rewardPoints: calculateTotalRewards(transactions, customer.id),
  }));

/**
 * Filters transactions by customer name (case-insensitive partial match).
 *
 * @param {Array} transactions List of transactions
 * @param {string} nameFilter Name to search for
 * @returns {Array} Filtered transactions
 */
export const filterTransactionsByName = (transactions, nameFilter) => {
  if (!nameFilter || nameFilter.trim() === '') return transactions;
  
  const searchTerm = nameFilter.toLowerCase().trim();
  return transactions.filter(transaction => 
    transaction.customerName.toLowerCase().includes(searchTerm)
  );
};

/**
 * Filters transactions by date range.
 *
 * @param {Array} transactions List of transactions
 * @param {string} startDate Start date (YYYY-MM-DD format)
 * @param {string} endDate End date (YYYY-MM-DD format)
 * @returns {Array} Filtered transactions
 */
export const filterTransactionsByDateRange = (transactions, startDate, endDate) => {
  if (!startDate && !endDate) return transactions;
  
  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    if (start && end) {
      return transactionDate >= start && transactionDate <= end;
    } else if (start) {
      return transactionDate >= start;
    } else if (end) {
      return transactionDate <= end;
    }
    
    return true;
  });
};

/**
 * Filters transactions by both name and date range.
 *
 * @param {Array} transactions List of transactions
 * @param {string} nameFilter Name to search for
 * @param {string} startDate Start date (YYYY-MM-DD format)
 * @param {string} endDate End date (YYYY-MM-DD format)
 * @returns {Array} Filtered transactions
 */
export const filterTransactions = (transactions, nameFilter, startDate, endDate) => {
  let filtered = filterTransactionsByName(transactions, nameFilter);
  filtered = filterTransactionsByDateRange(filtered, startDate, endDate);
  return filtered;
};

/**
 * Filters monthly rewards data by customer name.
 *
 * @param {Array} monthlyData List of monthly rewards data
 * @param {string} nameFilter Name to search for
 * @returns {Array} Filtered monthly rewards data
 */
export const filterMonthlyRewardsByName = (monthlyData, nameFilter) => {
  if (!nameFilter || nameFilter.trim() === '') return monthlyData;
  
  const searchTerm = nameFilter.toLowerCase().trim();
  return monthlyData.filter(item => 
    item.name.toLowerCase().includes(searchTerm)
  );
};

/**
 * Filters total rewards data by customer name.
 *
 * @param {Array} totalData List of total rewards data
 * @param {string} nameFilter Name to search for
 * @returns {Array} Filtered total rewards data
 */
export const filterTotalRewardsByName = (totalData, nameFilter) => {
  if (!nameFilter || nameFilter.trim() === '') return totalData;
  
  const searchTerm = nameFilter.toLowerCase().trim();
  return totalData.filter(item => 
    item.customerName.toLowerCase().includes(searchTerm)
  );
};

