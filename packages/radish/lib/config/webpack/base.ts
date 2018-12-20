import * as CaseSensitivePathPlugin from 'case-sensitive-paths-webpack-plugin';
import * as FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';
import * as fs from 'fs';
import * as path from 'path';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import * as webpack from 'webpack';
import * as WebpackBar from 'webpackbar';

const WriteFilePlugin = require('write-file-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');

import paths from '../paths';

import Service, { IArgs } from '../../Service';
import { getEnv } from '../env';
import scriptLoader from './loader/script';
import styleLoader from './loader/style';

const appDirectory = fs.realpathSync(process.cwd());
const nodePath = (process.env.NODE_PATH || '')
  .split(path.delimiter)
  .filter(folder => folder && !path.isAbsolute(folder))
  .map(folder => path.resolve(appDirectory, folder))
  .join(path.delimiter);

const dev = process.env.NODE_ENV === 'development';

export default (isServer: boolean, service: Service, args: IArgs) => {
  const { projectOptions } = service;
  const dotenv = getEnv(isServer, projectOptions, '');

  const webpackMode = process.env.NODE_ENV;

  let webpackConfig = {
    mode: webpackMode as any,
    devtool: 'source-map',
    context: process.cwd(),
    cache: true,
    output: {
      publicPath: args.ssr ? '/public/' : '/',
      hotUpdateChunkFilename: 'static/webpack/[id].[hash].hot-update.js',
      hotUpdateMainFilename: 'static/webpack/[hash].hot-update.json',
    },
    optimization: !dev ? {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all'
          }
        }
      }
    } : {},
    resolveLoader: {
      modules: [
        path.resolve(__dirname, '../../../node_modules'),
        paths.appNodeModules,
      ],
    },
    resolve: {
      extensions: ['.wasm', '.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        'webpack-hot-middleware/client': require.resolve('webpack-hot-middleware/client'),
      },
      modules: [
        path.resolve(__dirname, '../../../../node_modules'),
        paths.appNodeModules,
      ].concat(
        // It is guaranteed to exist because we tweak it in `env.js`
        nodePath.split(path.delimiter).filter(Boolean),
      ),
      plugins: [
        new TsconfigPathsPlugin({
          // configFile: paths.appTsconfig
        }),
      ],
    },
    module: {
      rules: [
        {
          oneOf: [
            styleLoader({ isServer }),
            scriptLoader({ isServer }),
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              loader: require.resolve('url-loader'),
              options: {
                limit: 10000,
                name: 'static/media/[name].[hash:8].[ext]',
              },
            },
            {
              exclude: [/\.(js|jsx|mjs|tsx?)$/, /\.html$/, /\.json$/],
              loader: require.resolve('file-loader'),
              options: {
                name: 'static/media/[name].[hash:8].[ext]',
              },
            },
          ]
        }
      ],
    },
    plugins: [
      new CircularDependencyPlugin({
        exclude: /node_modules/
      }),
      new webpack.DefinePlugin(dotenv.stringified),
      new webpack.NamedModulesPlugin(),
      new WebpackBar({
        minimal: false,
        compiledIn: false,
        // profile: true,
        name: isServer ? 'server' : 'client',
      }),
      dev && new FriendlyErrorsWebpackPlugin(),
      dev && new webpack.HotModuleReplacementPlugin(),
      dev && new CaseSensitivePathPlugin(),
      dev && args.ssr && new WriteFilePlugin({
        exitOnErrors: false,
        log: false,
        // required not to cache removed files
        useHashIndex: false,
      }),
    ].filter(Boolean)
  };
  webpackConfig = service.resolveWebpackConfig(webpackConfig, isServer, args) as any;
  return webpackConfig;
};
