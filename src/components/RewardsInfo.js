import React from "react";

const RewardsInfo = () => {
  return (
    <div className="rewards-info">
      <h3>Rewards Program Rules</h3>
      <ul>
        <li>2 points for every dollar spent over $100</li>
        <li>1 point for every dollar spent between $50-$100</li>
        <li>No points for purchases under $50</li>
        <li>Decimal amounts are handled using floor function</li>
      </ul>
    </div>
  );
};

export default RewardsInfo;


