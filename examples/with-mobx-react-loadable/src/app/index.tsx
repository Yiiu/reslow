import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Loadable from 'react-loadable';
import { BrowserRouter as Router } from 'react-router-dom';

import { Provider } from 'mobx-react';

import App from '@containers';
// import registerServiceWorker from './registerServiceWorker';

import './styles/index.less';

import { createStore, IStores } from '@stores';

type TypeNodeModuleWithHotReload = NodeModule & {hot?: any};

type TypeWindowWithStore = Window & {__STORE: IStores};

const isDevelop = process.env.NODE_ENV === 'development';

const windowWithStore = window as TypeWindowWithStore;

const ReactHotLoader = isDevelop
  ? require('react-hot-loader').AppContainer
  : ({ children }: any) => React.Children.only(children);

export const render = (Component: typeof App) => {
  const store = (() => {
    const oldStores = windowWithStore.__STORE;
    if (oldStores) {
      return oldStores;
    } else {
      const newStores = createStore();
      if (isDevelop) {
        windowWithStore.__STORE = newStores;
      }
      return newStores;
    }
  })();
  let hydrate: ReactDOM.Renderer;
  if (!!process.env.SSR) {
    hydrate = ReactDOM.render;
  } else {
    hydrate = ReactDOM.hydrate;
  }
  Loadable.preloadReady().then(() => {
    hydrate(
      <ReactHotLoader>
        <Router>
          <Provider { ...store }>
            <App />
          </Provider>
        </Router>
      </ReactHotLoader>
      ,
      document.getElementById('root') as HTMLElement
    );
  });
};
const moduleWithHotReload = module as TypeNodeModuleWithHotReload;

if (moduleWithHotReload.hot) {
  moduleWithHotReload.hot.accept(() => {
    const {App: NewApp} = require('./containers/App.tsx');
    render(NewApp);
  });
  // moduleWithHotReload.hot.accept('./stores', () => {
  //   const data = require('./stores');
  //   console.log(data);
  // });
}

render(App);
// (() => {
//   if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
//     navigator.serviceWorker.register('/service-worker.js');
//   }
// })();
