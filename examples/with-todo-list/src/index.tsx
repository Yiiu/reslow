import * as React from 'react';
import * as ReactDOM from 'react-dom';

import 'todomvc-app-css/index.css'
import 'todomvc-common/base.css'

import App from './App';

const isDevelop = process.env.NODE_ENV === 'development';

const ReactHotLoader = isDevelop
  ? require('react-hot-loader').AppContainer
  : ({ children }: any) => React.Children.only(children);

export const render = (Component: typeof App) => {
  ReactDOM.render(
    <ReactHotLoader>
      <Component />
    </ReactHotLoader>
    ,
    document.getElementsByClassName('todoapp')[0] as HTMLElement
  );
};

if (module.hot) {
  module.hot.accept(() => {
    const { App: NewApp } = require('./App.tsx');
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
