import { App } from './src/App';
import { rootSelector } from './src/rootSelector';

import React from 'react';
import ReactDom from 'react-dom';

const body = document.body;

ReactDom.render(
  <App />,
  body.querySelector(rootSelector),
);
