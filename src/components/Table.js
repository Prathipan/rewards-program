import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';

const Table = ({
  columns,
  data,
  className,
  getRowKey,
  pageSize = 10,
  initialPage = 1,
  initialSort
}) => {
  const [sortKey, setSortKey] = useState(initialSort?.key || null);
  const [sortDirection, setSortDirection] = useState(initialSort?.direction || 'asc');
  const [page, setPage] = useState(initialPage);

  const columnByKey = useMemo(() => {
    const map = new Map();
    columns.forEach((c) => map.set(c.key, c));
    return map;
  }, [columns]);

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    const column = columnByKey.get(sortKey);
    if (!column) return data;
    const accessor = column.sortAccessor || ((row) => row[column.key]);
    const copy = [...data];
    copy.sort((a, b) => {
      const va = accessor(a);
      const vb = accessor(b);
      if (va == null && vb == null) return 0;
      if (va == null) return sortDirection === 'asc' ? -1 : 1;
      if (vb == null) return sortDirection === 'asc' ? 1 : -1;
      if (typeof va === 'number' && typeof vb === 'number') {
        return sortDirection === 'asc' ? va - vb : vb - va;
      }
      const sa = String(va).toLowerCase();
      const sb = String(vb).toLowerCase();
      if (sa < sb) return sortDirection === 'asc' ? -1 : 1;
      if (sa > sb) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return copy;
  }, [data, sortKey, sortDirection, columnByKey]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const paginatedData = useMemo(() => sortedData.slice(start, end), [sortedData, start, end]);

  const onHeaderClick = (key, sortable) => {
    if (sortable === false) return;
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
    setPage(1);
  };

  return (
    <>
      <table className={className}>
        <thead>
          <tr>
            {columns.map((column) => {
              const isSorted = sortKey === column.key;
              const ariaSort = isSorted ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none';
              const sortable = column.sortable !== false;
              return (
                <th
                  key={column.key}
                  className={column.headerClassName}
                  aria-sort={ariaSort}
                  onClick={() => onHeaderClick(column.key, sortable)}
                  style={sortable ? { cursor: 'pointer' } : undefined}
                >
                  {column.header}
                  {isSorted ? (sortDirection === 'asc' ? ' ▲' : ' ▼') : ''}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, rowIndex) => (
            <tr key={getRowKey ? getRowKey(row, start + rowIndex) : start + rowIndex}>
              {columns.map((column) => (
                <td key={column.key} className={column.cellClassName}>
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="table-pagination">
        <button type="button" disabled={currentPage <= 1} onClick={() => setPage(1)}>« First</button>
        <button type="button" disabled={currentPage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>‹ Prev</button>
        <span className="table-page-info">Page {currentPage} of {totalPages}</span>
        <button type="button" disabled={currentPage >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next ›</button>
        <button type="button" disabled={currentPage >= totalPages} onClick={() => setPage(totalPages)}>Last »</button>
      </div>
    </>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    header: PropTypes.node.isRequired,
    headerClassName: PropTypes.string,
    cellClassName: PropTypes.string,
    render: PropTypes.func,
    sortable: PropTypes.bool,
    sortAccessor: PropTypes.func
  })).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  className: PropTypes.string,
  getRowKey: PropTypes.func,
  pageSize: PropTypes.number,
  initialPage: PropTypes.number,
  initialSort: PropTypes.shape({
    key: PropTypes.string.isRequired,
    direction: PropTypes.oneOf(['asc', 'desc']).isRequired
  })
};

export default Table;


