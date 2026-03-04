import React from 'react';
import { createRoot } from 'react-dom/client';

import '@src/styles/variables.css';
import '@src/styles/base.css';
import '@src/styles/features/battlefield.css';
import '@src/styles/dev.css';

import './styles/lab-layout.css';
import './styles/lab-controls.css';
import './styles/lab-engagement.css';
import './styles/lab-renderers.css';

import { Lab } from './Lab';

createRoot(document.getElementById('root')!).render(<Lab />);
