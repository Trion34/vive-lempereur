import React from 'react';
import ReactDOM from 'react-dom/client';
import { LabRoot } from './LabRoot';
import './styles/index.css';

const rootEl = document.getElementById('lab-root');
if (!rootEl) throw new Error('Missing #lab-root element');

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <LabRoot />
  </React.StrictMode>,
);
