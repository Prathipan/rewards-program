import React from 'react';
import PropTypes from 'prop-types';
import { calculateTransactionPoints, sortTransactionsByDate } from '../utils/rewardsCalculation';

const TransactionList = ({ transactions }) => {
  const sortedTransactions = sortTransactionsByDate(transactions);

  return (
    <div className="transaction-list-container">
      <h2>Transactions</h2>
      <div className="table-wrapper">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Customer Name</th>
              <th>Purchase Date</th>
              <th>Product Purchased</th>
              <th>Price</th>
              <th>Reward Points</th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.map(transaction => {
              const points = calculateTransactionPoints(transaction.amount);
              const formattedDate = new Date(transaction.date).toLocaleDateString();
              const formattedAmount = `$${transaction.amount.toFixed(2)}`;

              return (
                <tr key={transaction.id}>
                  <td className="transaction-id">{transaction.id}</td>
                  <td className="customer-name">{transaction.customerName}</td>
                  <td className="date-cell">{formattedDate}</td>
                  <td className="product-cell">{transaction.product}</td>
                  <td className="amount-cell">{formattedAmount}</td>
                  <td className="points-cell">{points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
