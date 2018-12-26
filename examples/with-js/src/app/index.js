import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './index.css';

import App from './App';

const isDevelop = process.env.NODE_ENV === 'development';

const ReactHotLoader = isDevelop
  ? require('react-hot-loader').AppContainer
  : ({ children }) => React.Children.only(children);

export const render = (Component) => {
  let hydrate;
  if (process.env.SSR === undefined) {
    hydrate = ReactDOM.render;
  } else {
    hydrate = ReactDOM.hydrate;
  }
  hydrate(
    <ReactHotLoader>
      <App />
    </ReactHotLoader>
    ,
    document.getElementById('root')
  );
};
const moduleWithHotReload = module;

if (moduleWithHotReload.hot) {
  moduleWithHotReload.hot.accept(() => {
    const { App: NewApp } = require('./App');
    render(NewApp);
  });
}

render(App);
