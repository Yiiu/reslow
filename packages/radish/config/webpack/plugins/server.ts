// import * as path from 'path';
import * as StartServerPlugin from 'start-server-webpack-plugin';
// import paths from '../../paths';

import { IPluginsConfig } from '../index';

export default (
  webpackConfig: any,
  { isServer, dev, serverIndexJs }: IPluginsConfig
) => {
  if (isServer) {
    if (dev) {
      webpackConfig.plugins.push(
        new StartServerPlugin({
          name: 'server.js',
          nodeArgs: ['-r', 'source-map-support/register'],
        })
      );
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
