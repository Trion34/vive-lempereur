import React from 'react';
import { deleteSave } from '../core/persistence';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  showDetails: boolean;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false, error: null, showDetails: false };

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  handleContinue = () => {
    this.setState({ hasError: false, error: null, showDetails: false });
  };

  handleRestart = () => {
    deleteSave();
    window.location.reload();
  };

  toggleDetails = () => {
    this.setState((s) => ({ showDetails: !s.showDetails }));
  };

  render() {
    if (this.state.hasError) {
      const { error, showDetails } = this.state;
      return (
        <div className="error-boundary-overlay">
          <div className="error-boundary-content">
            <h1 className="error-boundary-title">The Little Soldier</h1>
            <p className="error-boundary-message">Something went wrong.</p>

            <button className="error-boundary-details-toggle" onClick={this.toggleDetails}>
              {showDetails ? 'Hide Details' : 'Show Details'}
            </button>

            {showDetails && error && (
              <pre className="error-boundary-stack">
                {error.message}
                {error.stack ? `\n\n${error.stack}` : ''}
              </pre>
            )}

            <div className="error-boundary-actions">
              <button className="error-boundary-btn" onClick={this.handleContinue}>
                Try to Continue
              </button>
              <button className="error-boundary-btn error-boundary-btn-restart" onClick={this.handleRestart}>
                Restart Game
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
