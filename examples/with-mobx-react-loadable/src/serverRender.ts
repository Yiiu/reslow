import * as fs from 'fs';
import * as path from 'path';
// import * as requireFromString from 'require-from-string';
// import * as WebpackHotMiddleware from 'webpack-hot-middleware';

import appRender from './app/server';

export default async (req: any) => {
  const loadable = JSON.parse(
    fs.readFileSync(path.join(process.env.APP_PUBLIC_DIR as any, 'react-loadable.json')).toString()
  );
  const manifest = JSON.parse(
    fs.readFileSync(path.join(process.env.APP_PUBLIC_DIR as any, 'asset-manifest.json')).toString()
  );
  return appRender(req, loadable, manifest);
};
