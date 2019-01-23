import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { loadableReady } from '@loadable/component'

import './index.css';

import App from './App';

const isDevelop = process.env.NODE_ENV === 'development';

const ReactHotLoader = isDevelop
  ? require('react-hot-loader').AppContainer
  : ({ children }: any) => React.Children.only(children);

export const render = (Component: typeof App) => {
  let hydrate: ReactDOM.Renderer;
  if (process.env.SSR === undefined) {
    hydrate = ReactDOM.render;
  } else {
    hydrate = ReactDOM.hydrate;
  }
  loadableReady(() => {
    hydrate(
      <App />
      ,
      document.getElementById('root') as HTMLElement
    );
  })
};

if (module.hot) {
  module.hot.accept()
}

render(App);
