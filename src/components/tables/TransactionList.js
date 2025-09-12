import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { calculateTransactionPoints, sortTransactionsByDate, filterTransactions } from '../../utils/rewardsCalculation';
import DataGridTable from '../DataGridTable';
import FilterBar from '../FilterBar';

const TransactionList = ({ transactions }) => {
  const [nameFilter, setNameFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredTransactions = useMemo(() => {
    const filtered = filterTransactions(transactions, nameFilter, startDate, endDate);
    return sortTransactionsByDate(filtered);
  }, [transactions, nameFilter, startDate, endDate]);

  const columns = [
    { key: 'id', header: 'Transaction ID', headerClassName: undefined, cellClassName: 'transaction-id', sortable: true },
    { key: 'customerName', header: 'Customer Name', cellClassName: 'customer-name', sortable: true },
    { key: 'date', header: 'Purchase Date', cellClassName: 'date-cell', sortable: true, sortAccessor: (t) => new Date(t.date).getTime(), render: (t) => new Date(t.date).toLocaleDateString() },
    { key: 'product', header: 'Product Purchased', cellClassName: 'product-cell', sortable: true },
    { key: 'amount', header: 'Price', cellClassName: 'amount-cell', sortable: true, sortAccessor: (t) => t.amount, render: (t) => `$${t.amount.toFixed(2)}` },
    { key: 'points', header: 'Reward Points', cellClassName: 'points-cell', sortable: true, sortAccessor: (t) => calculateTransactionPoints(t.amount), render: (t) => calculateTransactionPoints(t.amount) }
  ];

  return (
    <div className="transaction-list-container">
      <h2>Transactions</h2>
      <FilterBar
        nameFilter={nameFilter}
        onNameFilterChange={setNameFilter}
        startDate={startDate}
        onStartDateChange={setStartDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
        showDateRange={true}
        placeholder="Search by customer name..."
      />
      <div className="table-wrapper">
        <DataGridTable
          className="transaction-table"
          columns={columns}
          data={filteredTransactions}
          getRowKey={(t) => t.id}
          pageSize={10}
          initialSort={{ key: 'date', direction: 'desc' }}
        />
      </div>
    </div>
  );
};

TransactionList.propTypes = {
  transactions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    customerId: PropTypes.number.isRequired,
    customerName: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    product: PropTypes.string.isRequired
  })).isRequired
};

export default TransactionList;
