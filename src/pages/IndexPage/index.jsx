import React from 'react';
import { render } from 'react-dom';

import IndexPage from './IndexPage';
import './index.css';

render(<IndexPage />, window.document.querySelector('#app-container'));

if (module.hot) module.hot.accept();
