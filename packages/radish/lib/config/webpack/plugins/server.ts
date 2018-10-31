// import * as path from 'path';
// import paths from '../../paths';

// import { AppPluginConfig } from '../../../scripts/index';

const StartServerPlugin = require('start-server-webpack-plugin');

export default (
  {
    isServer,
    serverIndexJs,
  }: any,
  webpackConfig: any,
) => {
  const dev = process.env.NODE_ENV === 'development';

  if (isServer) {
    if (dev) {
      // webpackConfig.plugins.push(
      //   new StartServerPlugin({
      //     name: 'server.js',
      //     nodeArgs: ['-r', require.resolve('source-map-support/register')],
      //   }),
      // );
    }
    webpackConfig.node = {
      __console: false,
      __dirname: false,
      __filename: false,
    };
    webpackConfig.entry = [serverIndexJs];
    if (dev) {
      webpackConfig.entry.unshift('webpack/hot/poll?1000');
    }
  }
  return webpackConfig;
};
