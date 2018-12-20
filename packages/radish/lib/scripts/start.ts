import chalk from 'chalk';
import * as webpack from 'webpack';

import clientWebpackConfig from '../config/webpack/client';
import serverWebpackConfig from '../config/webpack/server';

import Service, { IArgs } from '../Service';

const DevServer = require('webpack-dev-server');

export default async (service: Service, args: IArgs) => {
  const { projectOptions } = service;
  const clientConfig = clientWebpackConfig(service, args);
  const serverConfig = serverWebpackConfig(service, args);
  const clientCompiler = webpack(clientConfig as any);
  const serverCompiler = webpack(serverConfig as any);

  if (args.ssr) {
    serverCompiler.watch({}, () => {});
  }
  const clientDevServer = new DevServer(clientCompiler, (clientConfig as any).devServer);
  clientDevServer.listen(args.ssr ? projectOptions.devPort : projectOptions.port, (err: any) => {
    if (err) {
      console.error(chalk.red(err));
    }
  });
};
