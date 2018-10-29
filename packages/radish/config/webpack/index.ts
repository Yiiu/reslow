import * as path from 'path';
import * as fs from 'fs';

import * as AutoDllPlugin from 'autodll-webpack-plugin';
import * as webpack from 'webpack';

import * as CaseSensitivePathPlugin from 'case-sensitive-paths-webpack-plugin';
import * as FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import * as merge from 'webpack-merge';
import * as WebpackBar from 'webpackbar';
import * as WriteFilePlugin from 'write-file-webpack-plugin';

import clientPlugins from './plugins/client';
import serverPlugins from './plugins/server';

import { getEnv } from '../env';

import paths from '../paths';

import scriptLoader from './loader/script';
import styleLoader from './loader/style';

import { IAppConfig } from '../../scripts/index';

const appDirectory = fs.realpathSync(process.cwd());
const nodePath = (process.env.NODE_PATH || '')
  .split(path.delimiter)
  .filter(folder => folder && !path.isAbsolute(folder))
  .map(folder => path.resolve(appDirectory, folder))
  .join(path.delimiter);

export default (dev: boolean, isServer: boolean, appConfig: IAppConfig) => {
  const config: IAppConfig = {
    plugins: [],
    clientIndexJs: paths.appClientIndexJs,
    serverIndexJs: paths.appServerIndexJs,
    ...appConfig
  };
  const webpackMode = dev ? 'development' : 'production';
  const publicPath = '/public/';
  const dotenv = getEnv(isServer, config, '');
  let webpackConfig = {
    mode: webpackMode,
    devtool: 'source-map',
    name: isServer ? 'server' : 'client',
    target: isServer ? 'node' : 'web',
    context: process.cwd(),
    cache: true,
    output: {
      path: path.join(paths.appBuildSrc, isServer ? 'server' : ''),
      filename: isServer ? 'server.js' : (dev ? 'static/chunks/app.js' : 'static/chunks/app.[hash].js'),
      publicPath,
      libraryTarget: isServer ? 'commonjs2' : 'jsonp',
      hotUpdateChunkFilename: 'static/webpack/[id].[hash].hot-update.js',
      hotUpdateMainFilename: 'static/webpack/[hash].hot-update.json',
      chunkFilename: isServer ? '[name].[contenthash].js' : 'static/chunks/[name].[contenthash].js',
    },
    // performance: {
    //   hints: false
    // },
    resolveLoader: {
      modules: [
        path.resolve(__dirname, '../../../node_modules'),
        paths.appNodeModules,
      ],
    },
    resolve: {
      extensions: ['.wasm', '.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        'webpack-hot-middleware/client': require.resolve('webpack-hot-middleware/client')
      },
      modules: [
        path.resolve(__dirname, '../../../node_modules'),
        paths.appNodeModules
      ].concat(
        // It is guaranteed to exist because we tweak it in `env.js`
        nodePath.split(path.delimiter).filter(Boolean)
      ),
      plugins: [
        new TsconfigPathsPlugin({
          // configFile: paths.appTsconfig
        }),
      ]
    },
    module: {
      rules: [
        styleLoader({ isServer }),
        scriptLoader({ isServer }),
        {
          exclude: [/\.(js|jsx|mjs|tsx?)$/, /\.html$/, /\.json$/, /\.css|less$/],
          loader: require.resolve('file-loader'),
          options: {
            name: 'static/media/[name].[hash:8].[ext]',
          },
        },
      ]
    },
    plugins: [
      // dev && !isServer && new AutoDllPlugin({
      //   filename: '[name]_[hash].js',
      //   entry: {
      //     dll: [
      //       'react',
      //       'react-dom'
      //     ]
      //   }
      // }),
      new webpack.DefinePlugin(dotenv.stringified),
      new webpack.NamedModulesPlugin(),
      new WebpackBar({
        minimal: false,
        compiledIn: false,
        // profile: true,
        name: isServer ? 'server' : 'client'
      }),
      dev && new FriendlyErrorsWebpackPlugin(),
      dev && new webpack.HotModuleReplacementPlugin(),
      dev && !isServer && new FriendlyErrorsWebpackPlugin(),
      dev && new CaseSensitivePathPlugin(),
      dev && config.ssr && new WriteFilePlugin({
        exitOnErrors: false,
        log: false,
        // required not to cache removed files
        useHashIndex: false
      }),
    ].filter(Boolean)
  };
  config.plugins!.push(clientPlugins);
  config.plugins!.push(serverPlugins);
  config.plugins!.forEach(plugin => {
    if (typeof(plugin) === 'function') {
      webpackConfig = plugin(
        webpackConfig,
        { ...config, dev, isServer },
        dotenv
      );
    } else if (typeof(plugin) === 'string') {
      const radishPlugin = require(`radish-plugin-${plugin}`).default;
      if (!radishPlugin) {
        throw new Error(`Unable to find '${plugin}`);
      }
      webpackConfig = radishPlugin(
        webpackConfig,
        { ...config, dev, isServer },
        dotenv
      );
    }
  });
  if (config.configureWebpack) {
    webpackConfig = merge(config.configureWebpack, (webpackConfig as any)) as any;
  }

  if (config.modify) {
    webpackConfig = config.modify<typeof webpackConfig>(webpackConfig, { ...config, dev, isServer }, dotenv);
  }
  return webpackConfig;
};
