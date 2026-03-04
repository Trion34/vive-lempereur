import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppRoot } from './AppRoot';
import { ErrorBoundary } from './components/ErrorBoundary';
import { applyResolution } from './utils/resolution';
import { useSettingsStore } from './stores/settingsStore';
import './styles/index.css';

// Apply resolution synchronously before first render to prevent layout flash
applyResolution(useSettingsStore.getState().resolution);

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Missing #root element');

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppRoot />
    </ErrorBoundary>
  </React.StrictMode>,
);
