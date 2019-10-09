import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './index.css';

import App from './App';

export const render = (Component: typeof App) => {
  let hydrate: ReactDOM.Renderer;
  if (process.env.SSR === undefined) {
    hydrate = ReactDOM.render;
  } else {
    hydrate = ReactDOM.hydrate;
  }
  hydrate(
    <App />
    ,
    document.getElementById('root') as HTMLElement
  );
};

render(App);
