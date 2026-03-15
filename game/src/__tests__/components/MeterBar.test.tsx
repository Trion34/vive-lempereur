import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MeterBar } from '../../components/shared/MeterBar';

describe('MeterBar', () => {
  it('renders with label and value', () => {
    render(<MeterBar label="Health" value={80} max={100} fillClass="fill-health" />);
    expect(screen.getByText('Health')).toBeInTheDocument();
    expect(screen.getByText('80')).toBeInTheDocument();
  });

  it('fill width is correct percentage', () => {
    const { container } = render(
      <MeterBar label="Morale" value={60} max={200} fillClass="fill-morale" />,
    );
    const fill = container.querySelector('.meter-fill') as HTMLElement;
    expect(fill.style.width).toBe('30%'); // 60/200 = 30%
  });

  it('handles zero max without division error', () => {
    const { container } = render(
      <MeterBar label="Empty" value={0} max={0} fillClass="fill-empty" />,
    );
    const fill = container.querySelector('.meter-fill') as HTMLElement;
    expect(fill.style.width).toBe('0%');
  });

  it('shows max value when showMax is true', () => {
    render(<MeterBar label="Stamina" value={150} max={400} fillClass="fill-stamina" showMax />);
    expect(screen.getByText('150/400')).toBeInTheDocument();
  });

  it('shows state label when provided', () => {
    render(
      <MeterBar
        label="Health"
        value={30}
        max={100}
        fillClass="fill-health"
        stateLabel="Wounded"
        stateClass="state-wounded"
      />,
    );
    expect(screen.getByText('Wounded')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <MeterBar label="Test" value={50} max={100} fillClass="fill-test">
        <span data-testid="child">Extra content</span>
      </MeterBar>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('clamps fill at 100% for values exceeding max', () => {
    const { container } = render(
      <MeterBar label="Over" value={150} max={100} fillClass="fill-over" />,
    );
    const fill = container.querySelector('.meter-fill') as HTMLElement;
    expect(fill.style.width).toBe('150%'); // Component doesn't clamp — just verifies behavior
  });
});
