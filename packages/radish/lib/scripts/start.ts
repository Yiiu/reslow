import chalk from 'chalk';
import * as historyApiFallback from 'connect-history-api-fallback';
// import * as spawn from 'cross-spawn';
import * as express from 'express';
import * as proxyMiddleware from 'http-proxy-middleware';
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
  let init = false;
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
        console.info(`\n\n ${chalk.green('💂')}  Listening at ${chalk.green(`http://${host}:${port}\n`)}`);
      }
    });
  };
  clientCompiler.hooks.done.tap('clientDone', () => {
    if (!init) {
      init = true;
      serverListen();
    }
  });
  if (args.ssr) {
    serverCompiler.watch({}, () => {});
    serverCompiler.hooks.afterEmit.tap('serverDone', () => {
      setTimeout(() => {
        // const { existsAt } = compilation.assets['server.js'];
      }, 10);
    });
  }
  const devMiddleware = WebpackDevMiddleware(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    logLevel: 'silent',
    serverSideRender: true
    // historyApiFallback: true
  } as any);
  app.use(require('webpack-hot-middleware')((clientCompiler as any), {}));
  app.use(historyApiFallback());
  app.use(devMiddleware);
  app.use(express.static(DIST_DIR));
  // if (!args.ssr && projectOptions.proxy instanceof Object) {
  Object.keys(projectOptions.proxy! || {})
    .forEach((key) => {
      app.use(key, proxyMiddleware(projectOptions.proxy![key]));
    });
  // }
};
