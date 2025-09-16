import React from "react";
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";

const DataGridTable = ({
  columns,
  data,
  className,
  getRowKey,
  pageSize = 10,
  initialSort,
}) => {
  const muiColumns = columns.map((col) => ({
    field: col.field || col.key,
    headerName: col.headerName || col.header || String(col.key),
    flex: 1,
    headerClassName: col.headerClassName,
    cellClassName: col.cellClassName,
    sortable: col.sortable !== false,
    sortComparator: col.sortComparator || (col.sortAccessor 
      ? (v1, v2, param1, param2) => {
          try {
            const row1 = param1.api.getRow(param1.id);
            const row2 = param2.api.getRow(param2.id);
            const value1 = col.sortAccessor(row1 || {});
            const value2 = col.sortAccessor(row2 || {});
            
            if (typeof value1 === 'number' && typeof value2 === 'number') {
              return value1 - value2;
            }
            if (typeof value1 === 'string' && typeof value2 === 'string') {
              return value1.localeCompare(value2);
            }
            if (value1 < value2) return -1;
            if (value1 > value2) return 1;
            return 0;
          } catch (e) {
            return 0;
          }
        }
      : undefined),
    valueGetter: col.sortAccessor
      ? (params) => {
          const row = params && params.row ? params.row : undefined;
          try {
            return col.sortAccessor(row || {});
          } catch (e) {
            return null;
          }
        }
      : undefined,
    renderCell: col.render
      ? (params) => {
          const row = params && params.row ? params.row : undefined;
          try {
            return col.render(row || {});
          } catch (e) {
            return null;
          }
        }
      : undefined,
  }));

  const rows = data.map((row, index) => ({
    id: getRowKey ? getRowKey(row, index) : index,
    ...row,
  }));

  const sortModel = initialSort
    ? [{ field: initialSort.key, sort: initialSort.direction }]
    : [];

  return (
    <div style={{ width: "100%" }} className={className}>
      <DataGrid
        autoHeight
        rows={rows}
        columns={muiColumns}
        pageSizeOptions={[5, 10, 25, 50, 100]}
        initialState={{
          pagination: { paginationModel: { pageSize, page: 0 } },
          sorting: { sortModel },
        }}
        disableRowSelectionOnClick
      />
    </div>
  );
};

DataGridTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      header: PropTypes.node.isRequired,
      headerClassName: PropTypes.string,
      cellClassName: PropTypes.string,
      render: PropTypes.func,
      sortable: PropTypes.bool,
      sortAccessor: PropTypes.func,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  className: PropTypes.string,
  getRowKey: PropTypes.func,
  pageSize: PropTypes.number,
  initialSort: PropTypes.shape({
    key: PropTypes.string.isRequired,
    direction: PropTypes.oneOf(["asc", "desc"]).isRequired,
  }),
};

export default DataGridTable;
