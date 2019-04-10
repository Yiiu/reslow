import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './index.css';
import { setConfig } from 'react-hot-loader'
import App from './App';

type TypeNodeModuleWithHotReload = NodeModule & {hot?: any};

const isDevelop = process.env.NODE_ENV === 'development';

setConfig({ errorReporter: () => null })

// const ReactHotLoader = isDevelop
//   ? require('react-hot-loader').AppContainer
//   : ({ children }: any) => React.Children.only(children);

export const render = (Component: typeof App) => {
  ReactDOM.render(
    // <ReactHotLoader>
      <Component />
    // </ReactHotLoader>
    ,
    document.getElementById('root') as HTMLElement
  );
};
const moduleWithHotReload = module as TypeNodeModuleWithHotReload;

if (moduleWithHotReload.hot) {
  moduleWithHotReload.hot.accept(() => {
    const { App: NewApp } = require('./App');
    render(NewApp);
  });
}
if (!isDevelop) {
  (function() {
    if('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js');
    }
  })();
}

render(App);
