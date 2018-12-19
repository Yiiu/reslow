import * as path from 'path';
import * as webpack from 'webpack';
import * as merge from 'webpack-merge';

const StartServerPlugin = require('start-server-webpack-plugin');

import Service, { IArgs } from '../../Service';
import paths from '../paths';
import baseConfig from './base';

const dev = process.env.NODE_ENV === 'development';

export default (service: Service, args: IArgs) => {
  const serverConfig = {
    name: 'server',
    target: 'node',
    entry: [
      dev && 'webpack/hot/poll?1000',
      service.projectOptions.serverIndexJs
    ].filter(Boolean),
    node: {
      __console: false,
      __dirname: false,
      __filename: false,
    },
    output: {
      path: path.join(paths.appBuildSrc, 'server'),
      filename: 'server.js',
      libraryTarget: 'commonjs2',
      chunkFilename: '[name].[contenthash].js'
    },
    plugins: [
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
      new webpack.BannerPlugin({
        banner: `require("source-map-support").install();`,
        entryOnly: false,
        include: [
          'server.js',
        ],
        raw: true,
      }),
      new StartServerPlugin({
        name: 'server.js',
        nodeArgs: ['-r', require.resolve('source-map-support/register')],
      }),
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
    ]
  };
  return merge(baseConfig(true, service, args) as any, serverConfig as any);
};
