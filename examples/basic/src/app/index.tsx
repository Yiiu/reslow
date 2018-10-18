import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './App';

type TypeNodeModuleWithHotReload = NodeModule & {hot?: any};

const isDevelop = process.env.NODE_ENV === 'development';

const ReactHotLoader = isDevelop
  ? require('react-hot-loader').AppContainer
  : ({ children }: any) => React.Children.only(children);

export const render = (Component: typeof App) => {
  let hydrate: ReactDOM.Renderer;
  console.log(process.env);
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
    document.getElementById('root') as HTMLElement
  );
};
const moduleWithHotReload = module as TypeNodeModuleWithHotReload;

if (moduleWithHotReload.hot) {
  moduleWithHotReload.hot.accept(() => {
    const {App: NewApp} = require('./App.tsx');
    render(NewApp);
  });
  // moduleWithHotReload.hot.accept('./stores', () => {
  //   const data = require('./stores');
  //   console.log(data);
  // });
}

render(App);
