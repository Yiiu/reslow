process.env.NODE_ENV = 'development';
import * as historyApiFallback from 'connect-history-api-fallback';
import * as express from 'express';
import * as path from 'path';
import * as webpack from 'webpack';
import * as WebpackDevMiddleware from 'webpack-dev-middleware';
import webpackConfigs from '../config/webpack/index';

import { IAppConfig } from './index';

// const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const openBrowser = require('react-dev-utils/openBrowser');

import paths from '../config/paths';

const app = express();

export default async (config: IAppConfig) => {
  const port = parseInt(config.port + '', 10) + (config.ssr ? 1 : 0);
  const host = process.env.HOST ? process.env.HOST : (config.host || 'localhost');
  const DIST_DIR = path.join(paths.appBuildSrc);
  const clientConfig = webpackConfigs(true, false, config);
  const serverConfig = webpackConfigs(true, true, config);
  const clientCompiler = webpack(clientConfig as any);
  const serverCompiler = webpack(serverConfig as any);
  const serverListen = () => {
    app.listen(port, () => {
      if (config.open) {
        openBrowser('http://localhost:3000');
      }
      if (config.ssr) {
        console.info(`hot server at http://${host}:${port}\n`);
      } else {
        console.info(`\n\n 💂  Listening at http://${host}:${port}\n`);
      }
    });
  };
  clientCompiler.hooks.afterEmit.tap('clientDone', () => {
    if (config.ssr) {
      serverCompiler.watch({},
        stats => {}
      );
    }
    serverListen();
  });
  const devMiddleware = WebpackDevMiddleware(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    logLevel: 'silent',
    historyApiFallback: true
  } as any);
  app.use(require('webpack-hot-middleware')((clientCompiler as any), {}));
  app.use(historyApiFallback());
  app.use(devMiddleware);
  app.use(express.static(DIST_DIR));
};
