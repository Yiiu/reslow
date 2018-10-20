process.env.NODE_ENV = 'development';
import * as historyApiFallback from 'connect-history-api-fallback';
import * as express from 'express';
import * as path from 'path';
import * as webpack from 'webpack';
import * as WebpackDevMiddleware from 'webpack-dev-middleware';
import webpackConfigs from '../config/webpack/index';

import { IAppConfig } from './index';

const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const openBrowser = require('react-dev-utils/openBrowser');

import paths from '../config/paths';

const app = express();

export default async (config: IAppConfig) => {
  const port = parseInt(config.port, 10) + (config.ssr ? 1 : 0);
  const host = process.env.HOST ? process.env.HOST : (config.host || 'localhost');
  const DIST_DIR = path.join(paths.appBuildSrc);
  const clientConfig = webpackConfigs(true, false, config);
  const serverConfig = webpackConfigs(true, true, config);
  const webpackConfig = [
    clientConfig
  ];
  if (config.ssr) {
    webpackConfig.push(serverConfig);
  }
  const multiCompiler = webpack(webpackConfig as any);

  const devMiddleware = WebpackDevMiddleware(multiCompiler, {
    publicPath: clientConfig.output.publicPath,
    logLevel: 'silent',
    historyApiFallback: true
  } as any);
  app.use(require('webpack-hot-middleware')((multiCompiler as any).compilers[0], {}));
  app.use(historyApiFallback());
  app.use(devMiddleware);
  app.use(express.static(DIST_DIR));
  app.listen(port, () => {
    // if (openBrowser('http://localhost:3000')) {
    //   console.log('The browser tab has been opened!');
    // }
    console.log(`hot server ${host} at ${port}`);
  });
};
