import React from 'react';
import PropTypes from 'prop-types';
import { generateTotalRewardsData } from '../utils/rewardsCalculation';


const TotalRewardsTable = ({ transactions, customers }) => {
  const totalRewardsData = generateTotalRewardsData(transactions, customers);

  return (
    <div className="rewards-table-container">
      <h2>Total Rewards</h2>
      <div className="table-wrapper">
        <table className="rewards-table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Reward Points</th>
            </tr>
          </thead>
          <tbody>
            {totalRewardsData.map((reward, index) => (
              <tr key={`total-${reward.customerName}`}>
                <td className="customer-name">{reward.customerName}</td>
                <td className="points-cell total-points">{reward.rewardPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

TotalRewardsTable.propTypes = {
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

export default TotalRewardsTable;
