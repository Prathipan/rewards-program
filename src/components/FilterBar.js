
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import PropTypes from "prop-types";

import dayjs from "dayjs";

const FilterBar = ({
  nameFilter,
  onNameFilterChange,
  startDate, 
  onStartDateChange,
  endDate, 
  onEndDateChange,
  showDateRange = true,
  placeholder = "Search by name...",
}) => {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        
        <TextField
          label="Search by Name"
          variant="outlined"
          size="small"
          value={nameFilter}
          onChange={(e) => onNameFilterChange(e.target.value)}
          placeholder={placeholder}
          sx={{ mr: 2 }}
        />
      </div>

      {showDateRange && (
        <>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="filter-group">
              <DatePicker
                label="Start Date"
                value={
                  startDate &&
                  typeof startDate === "object" &&
                  typeof startDate.isValid === "function"
                    ? startDate
                    : startDate
                    ? dayjs(startDate)
                    : null
                }
                onChange={(newValue) => {
                  onStartDateChange(newValue);
                }}
                renderInput={(params) => (
                  <TextField {...params} className="filter-input" />
                )}
                slotProps={{ textField: { size: "small", sx: { mr: 2 } } }}
              />
            </div>
            <div className="filter-group">
              <DatePicker
                label="End Date"
                value={
                  endDate &&
                  typeof endDate === "object" &&
                  typeof endDate.isValid === "function"
                    ? endDate
                    : endDate
                    ? dayjs(endDate)
                    : null
                }
                onChange={(newValue) => {
                  onEndDateChange(newValue);
                }}
                renderInput={(params) => (
                  <TextField {...params} className="filter-input" />
                )}
                slotProps={{ textField: { size: "small", sx: { mr: 2 } } }}
              />
            </div>
          </LocalizationProvider>
        </>
      )}

      <div className="filter-actions">
        <button
          onClick={() => {
            onNameFilterChange("");
            onStartDateChange(null);
            onEndDateChange(null);
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
  startDate: PropTypes.object,
  onStartDateChange: PropTypes.func.isRequired,
  endDate: PropTypes.object,
  onEndDateChange: PropTypes.func.isRequired,
  showDateRange: PropTypes.bool,
  placeholder: PropTypes.string,
};

export default FilterBar;
