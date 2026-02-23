import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorBoundary } from '../../components/ErrorBoundary';

function ThrowingChild({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) throw new Error('Test explosion');
  return <div>All good</div>;
}

// Suppress React error boundary console noise in test output
beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <ThrowingChild shouldThrow={false} />
      </ErrorBoundary>,
    );
    expect(screen.getByText('All good')).toBeInTheDocument();
  });

  it('renders fallback UI on child error', () => {
    render(
      <ErrorBoundary>
        <ThrowingChild shouldThrow={true} />
      </ErrorBoundary>,
    );
    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    expect(screen.getByText('The Little Soldier')).toBeInTheDocument();
    expect(screen.getByText('Try to Continue')).toBeInTheDocument();
    expect(screen.getByText('Restart Game')).toBeInTheDocument();
  });

  it('shows error details when toggled', async () => {
    render(
      <ErrorBoundary>
        <ThrowingChild shouldThrow={true} />
      </ErrorBoundary>,
    );
    await userEvent.click(screen.getByText('Show Details'));
    expect(screen.getByText(/Test explosion/)).toBeInTheDocument();
    expect(screen.getByText('Hide Details')).toBeInTheDocument();
  });

  it('Restart clears storage and reloads', async () => {
    const removeItem = vi.spyOn(Storage.prototype, 'removeItem');
    const reload = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload },
      writable: true,
    });

    render(
      <ErrorBoundary>
        <ThrowingChild shouldThrow={true} />
      </ErrorBoundary>,
    );
    await userEvent.click(screen.getByText('Restart Game'));
    expect(removeItem).toHaveBeenCalledWith('napoleonic_save');
    expect(reload).toHaveBeenCalled();
    removeItem.mockRestore();
  });

  it('Continue re-renders children', async () => {
    // First render: throws. After continue, we need to not throw.
    // We use a key trick: ErrorBoundary resets state, children re-render.
    let shouldThrow = true;
    function ConditionalThrow() {
      if (shouldThrow) throw new Error('boom');
      return <div>Recovered</div>;
    }

    render(
      <ErrorBoundary>
        <ConditionalThrow />
      </ErrorBoundary>,
    );
    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();

    // Stop throwing before clicking continue
    shouldThrow = false;
    await userEvent.click(screen.getByText('Try to Continue'));
    expect(screen.getByText('Recovered')).toBeInTheDocument();
  });
});
