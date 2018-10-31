import * as historyApiFallback from 'connect-history-api-fallback';
import * as express from 'express';
import * as path from 'path';
import * as webpack from 'webpack';
import * as WebpackDevMiddleware from 'webpack-dev-middleware';

import webpackConfigs from '../config/webpack/index';

import Service, { IArgs } from '../Service';

// const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const openBrowser = require('react-dev-utils/openBrowser');

import paths from '../config/paths';

const app = express();

export default async (service: Service, args: IArgs) => {
  const { projectOptions } = service;

  const port = parseInt(projectOptions.port!.toString(), 10) + (args.ssr ? 1 : 0);
  const host = process.env.HOST ? process.env.HOST : projectOptions.host;

  const DIST_DIR = path.join(paths.appBuildSrc);
  const clientConfig = webpackConfigs(false, service, args);
  const serverConfig = webpackConfigs(true, service, args);
  const clientCompiler = webpack(clientConfig as any);
  const serverCompiler = webpack(serverConfig as any);

  const serverListen = () => {
    app.listen(port, () => {
      if (args.open) {
        openBrowser('http://localhost:3000');
      }
      if (args.ssr) {
        console.info(`hot server at http://${host}:${port}\n`);
      } else {
        console.info(`\n\n 💂  Listening at http://${host}:${port}\n`);
      }
    });
  };
  // clientCompiler.hooks.done.tap('clientDone', () => {
  // });
  if (args.ssr) {
    serverCompiler.watch({}, () => {});
  }

  const devMiddleware = WebpackDevMiddleware(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    logLevel: 'silent',
    // historyApiFallback: true
  } as any);
  app.use(require('webpack-hot-middleware')((clientCompiler as any), {}));
  app.use(historyApiFallback());
  app.use(devMiddleware);
  app.use(express.static(DIST_DIR));
  serverListen();
};
