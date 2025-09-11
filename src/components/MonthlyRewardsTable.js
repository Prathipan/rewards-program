import React from 'react';
import PropTypes from 'prop-types';
import { generateMonthlyRewardsData } from '../utils/rewardsCalculation';

const MonthlyRewardsTable = ({ transactions, customers }) => {
  const monthlyRewardsData = generateMonthlyRewardsData(transactions, customers);

  return (
    <div className="rewards-table-container">
      <h2>User Monthly Rewards</h2>
      <div className="table-wrapper">
        <table className="rewards-table">
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>Name</th>
              <th>Month</th>
              <th>Year</th>
              <th>Reward Points</th>
            </tr>
          </thead>
          <tbody>
            {monthlyRewardsData.map((reward, index) => (
              <tr key={`${reward.customerId}-${reward.month}-${reward.year}`}>
                <td className="customer-id">{reward.customerId}</td>
                <td className="customer-name">{reward.name}</td>
                <td className="month-cell">{reward.month}</td>
                <td className="year-cell">{reward.year}</td>
                <td className="points-cell">{reward.rewardPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

MonthlyRewardsTable.propTypes = {
  transactions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    customerId: PropTypes.number.isRequired,
    customerName: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    product: PropTypes.string.isRequired
  })).isRequired,
  customers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  })).isRequired
};

export default MonthlyRewardsTable;
