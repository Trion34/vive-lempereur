import React from 'react';
import { createRoot } from 'react-dom/client';

import '@src/styles/variables.css';
import '@src/styles/base.css';
import '@src/styles/features/battlefield.css';
import '@src/styles/dev.css';
import './lab.css';

import { Lab } from './Lab';

createRoot(document.getElementById('root')!).render(<Lab />);
