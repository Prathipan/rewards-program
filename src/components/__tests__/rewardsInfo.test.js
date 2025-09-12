
import { render, screen } from '@testing-library/react';
import RewardsInfo from '../../components/RewardsInfo';

describe('RewardsInfo', () => {
  test('renders rules list', () => {
    render(<RewardsInfo />);
    expect(screen.getByText('Rewards Program Rules')).toBeInTheDocument();
    expect(screen.getByText('2 points for every dollar spent over $100')).toBeInTheDocument();
    expect(screen.getByText('1 point for every dollar spent between $50-$100')).toBeInTheDocument();
    expect(screen.getByText('No points for purchases under $50')).toBeInTheDocument();
  });
});




