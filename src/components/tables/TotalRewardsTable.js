import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { generateTotalRewardsData, filterTotalRewardsByName } from '../../utils/rewardsCalculation';
import DataGridTable from '../DataGridTable';
import FilterBar from '../FilterBar';


const TotalRewardsTable = ({ transactions, customers }) => {
  const [nameFilter, setNameFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const totalRewardsData = useMemo(() => {
    return generateTotalRewardsData(transactions, customers);
  }, [transactions, customers]);

  const filteredTotalRewardsData = useMemo(() => {
    return filterTotalRewardsByName(totalRewardsData, nameFilter);
  }, [totalRewardsData, nameFilter]);

  const columns = [
    { key: 'customerName', header: 'Customer Name', headerClassName: undefined, cellClassName: 'customer-name', sortable: true },
    { key: 'rewardPoints', header: 'Reward Points', cellClassName: 'points-cell total-points', sortable: true, render: (r) => r.rewardPoints }
  ];

  return (
    <div className="rewards-table-container">
      <h2>Total Rewards</h2>
      <FilterBar
        nameFilter={nameFilter}
        onNameFilterChange={setNameFilter}
        startDate={startDate}
        onStartDateChange={setStartDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
        showDateRange={false}
        placeholder="Search by customer name..."
      />
      <div className="table-wrapper">
        <DataGridTable
          className="rewards-table"
          columns={columns}
          data={filteredTotalRewardsData}
          getRowKey={(r) => `total-${r.customerName}`}
          pageSize={10}
          initialSort={{ key: 'rewardPoints', direction: 'desc' }}
        />
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
