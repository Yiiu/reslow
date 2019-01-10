import { Request } from 'express';
import * as React from 'react';
import * as Loadable from 'react-loadable';
import { getBundles } from 'react-loadable/webpack';
import { StaticRouter } from 'react-router';

import { Provider } from 'mobx-react';
import { renderToString } from 'react-dom/server';

import App from '@containers';
import Html from '@containers/Html';

import { createStore } from '@stores';

interface IBundle {
  id: number;
  name: string;
  file: string;
}
interface IStats {
  [key: string]: IBundle[];
}

interface IManifest {
  [key: string]: string;
}

export default (req: Request, stats: IStats, manifest: IManifest) => {
  const modules: string[] = [];
  const newStores = createStore();
  const markup = renderToString(
    <StaticRouter location={req.url} context={{}}>
      <Provider { ...newStores }>
        <Loadable.Capture report={moduleName => modules.push(moduleName)}>
          <App />
        </Loadable.Capture>
      </Provider>
    </StaticRouter>
  );
  const bundles = getBundles((stats as any), modules);
  const js = bundles
    .filter(bundle => bundle && bundle.file.endsWith('.js'))
    .map(bundle => {
      return `/public/${bundle.file}`;
    });
  const style = bundles
    .filter(bundle => bundle && bundle.file.endsWith('.css'))
    .map(bundle => {
      return `/public/${bundle.file}`;
    });
  js.push(manifest['vendor.js']);
  js.push(manifest['main.js']);
  style.push(manifest['main.css']);
  return renderToString(
    <Html markup={markup} js={js} style={style} />
  );
};
