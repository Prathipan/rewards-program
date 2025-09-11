import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { fetchTransactions } from "./data/service";
import { getUniqueCustomers } from "./utils/rewardsCalculation";
import { logApiStart, logApiSuccess, logApiError } from "./utils/logger";
import MonthlyRewardsTable from "./components/MonthlyRewardsTable";
import TotalRewardsTable from "./components/TotalRewardsTable";
import TransactionList from "./components/TransactionList";
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
  const [appState, setAppState] = useState({
    transactions: [],
    customers: [],
    loading: true,
    error: null,
  });

  const loadTransactionData = useCallback(async () => {
    try {
      logApiStart('loadTransactionData');
      setAppState((prevState) => ({
        ...prevState,
        loading: true,
        error: null,
      }));

      const transactionData = await fetchTransactions();
      const customerData = getUniqueCustomers(transactionData);

      logApiSuccess('loadTransactionData', {
        transactionCount: transactionData.length,
        customerCount: customerData.length
      });
      setAppState({
        transactions: transactionData,
        customers: customerData,
        loading: false,
        error: null,
      });
    } catch (err) {
      logApiError('loadTransactionData', err);
      setAppState((prevState) => ({
        ...prevState,
        loading: false,
        error: "Failed to load transaction data. Please try again.",
      }));
    }
  }, []);

  const handleRetry = useCallback(() => {
    loadTransactionData();
  }, [loadTransactionData]);

  // Load data on component mount
  useEffect(() => {
    loadTransactionData();
  }, [loadTransactionData]);

  const { transactions, customers, loading, error } = appState;

    if (loading) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>Customer Rewards Program</h1>
        </header>
        <main className="app-main">
          <LoadingSpinner message="Loading transaction data..." />
        </main>
      </div>
    );
  }

    if (error) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>Customer Rewards Program</h1>
        </header>
        <main className="app-main">
          <div className="error-container">
            <h2>Error</h2>
            <p>{error}</p>
            <button onClick={handleRetry} className="retry-button">
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Customer Rewards Program</h1>
      </header>

      <main className="app-main">
        <div className="rewards-info">
          <h3>Rewards Program Rules</h3>
          <ul>
            <li>2 points for every dollar spent over $100</li>
            <li>1 point for every dollar spent between $50-$100</li>
            <li>No points for purchases under $50</li>
            <li>Decimal amounts are handled using floor function</li>
          </ul>
        </div>

        <MonthlyRewardsTable
          transactions={transactions}
          customers={customers}
        />

        <TotalRewardsTable transactions={transactions} customers={customers} />

        <TransactionList transactions={transactions} />
      </main>
    </div>
  );
}

export default App;
