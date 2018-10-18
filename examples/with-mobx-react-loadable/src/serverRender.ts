// import * as fs from 'fs';
// import * as requireFromString from 'require-from-string';
// import * as WebpackHotMiddleware from 'webpack-hot-middleware';

import appRender from './app/server';

export default async (req: any) => {
  const a = await require('../__server/react-loadable.json');
  return appRender(req, a);
};
