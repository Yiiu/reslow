import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './index.css';

import App from './App';

const isDevelop = process.env.NODE_ENV === 'development';

const ReactHotLoader = isDevelop
  ? require('react-hot-loader').AppContainer
  : ({ children }) => React.Children.only(children);

export const render = (Component) => {
  ReactDOM.render(
    <ReactHotLoader>
      <Component />
    </ReactHotLoader>
    ,
    document.getElementById('root')
  );
};

if (module.hot) {
  module.hot.accept(() => {
    const { App: NewApp } = require('./App');
    render(NewApp);
  });
}

if (!isDevelop) {
  (() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js');
    }
  })();
}

render(App);
