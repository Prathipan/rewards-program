jest.mock('react-error-boundary');

import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../../components/ErrorBoundary';

const Boom = () => {
  throw new Error('Boom!');
};

describe('ErrorBoundary', () => {
  test('renders fallback when child throws', () => {
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/unexpected error occurred/i)).toBeInTheDocument();
  });

  test('calls onReset when provided', () => {
    const onReset = jest.fn();
    render(
      <ErrorBoundary onReset={onReset}>
        <Boom />
      </ErrorBoundary>
    );
    const btn = screen.getByRole('button', { name: /reload/i });
    fireEvent.click(btn);
    expect(onReset).toHaveBeenCalled();
  });
});


