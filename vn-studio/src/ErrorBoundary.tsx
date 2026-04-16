import React from 'react';

interface State { error: Error | null }

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[VN Studio] Error caught:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '2rem', color: '#d4c8b0', background: '#1a1612', height: '100vh', overflow: 'auto', fontFamily: 'monospace' }}>
          <h1 style={{ color: '#c45544', marginBottom: '1rem' }}>VN Studio crashed</h1>
          <pre style={{ color: '#d4c8b0', whiteSpace: 'pre-wrap' }}>{this.state.error.message}</pre>
          <pre style={{ color: '#8a8070', fontSize: '0.85rem', marginTop: '1rem', whiteSpace: 'pre-wrap' }}>{this.state.error.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
