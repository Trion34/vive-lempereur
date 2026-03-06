import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppRoot } from './AppRoot';
import { ErrorBoundary } from './components/ErrorBoundary';
import './styles/index.css';

// Add fixed-resolution class before first render so body.fixed-resolution CSS
// (overflow:hidden, flex centering) applies immediately. The actual #game sizing
// happens in AppRoot via useLayoutEffect (before first paint).
document.body.classList.add('fixed-resolution');

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Missing #root element');

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppRoot />
    </ErrorBoundary>
  </React.StrictMode>,
);
