

import { logApiStart, logApiSuccess, logApiError } from '../utils/logger';

export const fetchTransactions = async () => {
  const resource = '/transactions.json';
  try {
    logApiStart('fetchTransactions', { resource });
    const response = await fetch(resource, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    logApiSuccess('fetchTransactions', { count: data.length });
    return data;
  } catch (err) {
    logApiError('fetchTransactions', err);
    throw err;
  }
};


