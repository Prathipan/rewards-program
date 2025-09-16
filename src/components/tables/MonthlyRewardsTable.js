import React, { useState, useMemo } from "react";

import PropTypes from "prop-types";
import {
  generateMonthlyRewardsData,
  filterTransactions,
} from "../../utils/rewardsCalculation";
import DataGridTable from "../DataGridTable";
import FilterBar from "../FilterBar";

const MonthlyRewardsTable = ({ transactions, customers }) => {
  const [nameFilter, setNameFilter] = useState("");
  const [startDate, setStartDate] = useState(null); // Dayjs object or null
  const [endDate, setEndDate] = useState(null); // Dayjs object or null

  // Filter transactions by name and date first
  const filteredTransactions = useMemo(() => {
    return filterTransactions(
      transactions,
      nameFilter,
      startDate ? startDate.format("YYYY-MM-DD") : "",
      endDate ? endDate.format("YYYY-MM-DD") : ""
    );
  }, [transactions, nameFilter, startDate, endDate]);

  // Generate monthly rewards data from filtered transactions
  const monthlyRewardsData = useMemo(() => {
    return generateMonthlyRewardsData(filteredTransactions, customers);
  }, [filteredTransactions, customers]);

  const columns = [
    {
      key: "customerId",
      header: "Customer ID",
      headerClassName: undefined,
      cellClassName: "customer-id",
      sortable: true,
    },
    {
      key: "name",
      header: "Name",
      cellClassName: "customer-name",
      sortable: true,
    },
    {
      key: "monthYear",
      header: "Month",
      cellClassName: "month-cell",
      sortable: true,
      render: (r) => `${r.month} ${r.year}`,
      sortAccessor: (r) => {
        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        const monthIndex = monthNames.indexOf(r.month);
        return r.year * 100 + (monthIndex + 1);
      },
    },
    {
      key: "rewardPoints",
      header: "Reward Points",
      cellClassName: "points-cell",
      sortable: true,
      render: (r) => r.rewardPoints,
    },
  ];

  return (
    <div className="rewards-table-container">
      <h2>User Monthly Rewards</h2>
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
          className="rewards-table"
          columns={columns}
          data={monthlyRewardsData}
          getRowKey={(r) => `${r.customerId}-${r.month}-${r.year}`}
          pageSize={10}
          initialSort={{ key: "year", direction: "desc" }}
        />
      </div>
    </div>
  );
};

MonthlyRewardsTable.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      customerId: PropTypes.number.isRequired,
      customerName: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired,
      product: PropTypes.string.isRequired,
    })
  ).isRequired,
  customers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default MonthlyRewardsTable;
