import React, { useState, useMemo } from "react";

import PropTypes from "prop-types";
import {
  generateMonthlyRewardsData,
  filterTransactions,
  filterMonthlyRewardsByName,
} from "../../utils/rewardsCalculation";
import DataGridTable from "../DataGridTable";
import FilterBar from "../FilterBar";

const MonthlyRewardsTable = ({ transactions, customers }) => {
  const [nameFilter, setNameFilter] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null); 


  // Filter transactions by date only (not by name)
  const dateFilteredTransactions = useMemo(() => {
    return filterTransactions(
      transactions,
      "", 
      startDate ? startDate.format("YYYY-MM-DD") : "",
      endDate ? endDate.format("YYYY-MM-DD") : ""
    );
  }, [transactions, startDate, endDate]);

  // Generate monthly rewards data from date-filtered transactions
  const unfilteredMonthlyRewardsData = useMemo(() => {
    return generateMonthlyRewardsData(dateFilteredTransactions, customers);
  }, [dateFilteredTransactions, customers]);

  //  Filter the monthly rewards data by name
  const monthlyRewardsData = useMemo(() => {
    return filterMonthlyRewardsByName(unfilteredMonthlyRewardsData, nameFilter);
  }, [unfilteredMonthlyRewardsData, nameFilter]);


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
      render : (r)=> r.name,
      sortAccessor: (r) => {
        return r.name?.toLowerCase() || "";
      }
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
