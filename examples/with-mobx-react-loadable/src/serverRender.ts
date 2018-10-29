// import * as fs from 'fs';
// import * as requireFromString from 'require-from-string';
// import * as WebpackHotMiddleware from 'webpack-hot-middleware';

import appRender from './app/server';

export default async (req: any) => {
  const loadable = await require('../__server/react-loadable.json');
  const manifest = await require('../__server/asset-manifest.json');
  return appRender(req, loadable, manifest);
};
