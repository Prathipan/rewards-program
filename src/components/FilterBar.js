import React from 'react';
import PropTypes from 'prop-types';

const FilterBar = ({ 
  nameFilter, 
  onNameFilterChange, 
  startDate, 
  onStartDateChange, 
  endDate, 
  onEndDateChange,
  showDateRange = true,
  placeholder = "Search by name..."
}) => {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label htmlFor="name-filter" className="filter-label">
          Search by Name:
        </label>
        <input
          id="name-filter"
          type="text"
          value={nameFilter}
          onChange={(e) => onNameFilterChange(e.target.value)}
          placeholder={placeholder}
          className="filter-input"
        />
      </div>
      
      {showDateRange && (
        <>
          <div className="filter-group">
            <label htmlFor="start-date" className="filter-label">
              Start Date:
            </label>
            <input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="filter-input"
            />
          </div>
          
          <div className="filter-group">
            <label htmlFor="end-date" className="filter-label">
              End Date:
            </label>
            <input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="filter-input"
            />
          </div>
        </>
      )}
      
      <div className="filter-actions">
        <button 
          onClick={() => {
            onNameFilterChange('');
            onStartDateChange('');
            onEndDateChange('');
          }}
          className="clear-filters-btn"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

FilterBar.propTypes = {
  nameFilter: PropTypes.string.isRequired,
  onNameFilterChange: PropTypes.func.isRequired,
  startDate: PropTypes.string.isRequired,
  onStartDateChange: PropTypes.func.isRequired,
  endDate: PropTypes.string.isRequired,
  onEndDateChange: PropTypes.func.isRequired,
  showDateRange: PropTypes.bool,
  placeholder: PropTypes.string
};

export default FilterBar;
