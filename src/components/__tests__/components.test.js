
import { render, screen } from '@testing-library/react';
import MonthlyRewardsTable from '../../components/tables/MonthlyRewardsTable';
import TotalRewardsTable from '../../components/tables/TotalRewardsTable';
import TransactionList from '../../components/tables/TransactionList';

// Mock the FilterBar component
jest.mock('../../components/FilterBar', () => {
  return function MockFilterBar() {
    return <div data-testid="filter-bar">Filter Bar Mock</div>;
  };
});

const transactions = [
  { id: 1, customerId: 1, customerName: 'John Doe', amount: 120.2, date: '2023-12-15', product: 'Electronics' },
  { id: 2, customerId: 2, customerName: 'Jane Smith', amount: 85.5, date: '2023-12-20', product: 'Decor' },
  { id: 3, customerId: 1, customerName: 'John Doe', amount: 200.75, date: '2023-12-25', product: 'Console' },
];

const customers = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
];

describe('Components render basic structures', () => {
  test('MonthlyRewardsTable renders headers and rows', () => {
    render(<MonthlyRewardsTable transactions={transactions} customers={customers} />);
    expect(screen.getByText('User Monthly Rewards')).toBeInTheDocument();
    expect(screen.getByText('Reward Points')).toBeInTheDocument();
  });

  test('TotalRewardsTable renders headers and rows', () => {
    render(<TotalRewardsTable transactions={transactions} customers={customers} />);
    expect(screen.getByText('Total Rewards')).toBeInTheDocument();
    expect(screen.getByText('Customer Name')).toBeInTheDocument();
  });

  test('TransactionList renders transactions', () => {
    render(<TransactionList transactions={transactions} />);
    expect(screen.getByText('Transactions')).toBeInTheDocument();
    expect(screen.getByText('Reward Points')).toBeInTheDocument();
  });
});

describe('Components render filter bars', () => {
  test('MonthlyRewardsTable renders filter bar', () => {
    render(<MonthlyRewardsTable transactions={transactions} customers={customers} />);
    expect(screen.getByTestId('filter-bar')).toBeInTheDocument();
  });

  test('TotalRewardsTable renders filter bar', () => {
    render(<TotalRewardsTable transactions={transactions} customers={customers} />);
    expect(screen.getByTestId('filter-bar')).toBeInTheDocument();
  });

  test('TransactionList renders filter bar', () => {
    render(<TransactionList transactions={transactions} />);
    expect(screen.getByTestId('filter-bar')).toBeInTheDocument();
  });
});


