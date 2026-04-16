import React from 'react';
import { createRoot } from 'react-dom/client';
import { VNStudioApp } from './VNStudioApp';
import { ErrorBoundary } from './ErrorBoundary';
import '../../game/src/styles/features/vn.css';
import './vn-studio.css';

const root = document.getElementById('vn-studio-root');
if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <ErrorBoundary>
        <VNStudioApp />
      </ErrorBoundary>
    </React.StrictMode>
  );
}
