import React from 'react';
import ReactDOM from 'react-dom';

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
      <Component />
    </ReactHotLoader>
    ,
    document.getElementById('root')
  );
};

if (module.hot) {
  module.hot.accept(() => {
    const { App: NewApp } = require('./App.tsx');
    render(NewApp);
  });
}

// if (!isDevelop) {
//   (() => {
//     if ('serviceWorker' in navigator) {
//       navigator.serviceWorker.register('/service-worker.js');
//     }
//   })();
// }

render(App);
