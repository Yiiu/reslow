import * as path from 'path';

// import * as AutoDllPlugin from 'autodll-webpack-plugin';
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

export type IAppConfigPlugin = <T>(webpackConfig: T, config: IConfig, dotenv: any) => any;

export interface IAppConfig {
  configureWebpack?: any;
  plugins?: IAppConfigPlugin[];
  hotPort?: string;
  hotHost?: string;
  port?: string;
  host?: string;
  modify?: IAppConfigPlugin;
  serverIndexJs?: string;
  clientIndexJs?: string;
}

export interface IConfig {
  dev: boolean;
  isServer: boolean;
  ssr?: boolean;
}

export type IPluginsConfig = IConfig & IAppConfig

export default (
  baseConfig: IConfig,
  appConfig: IAppConfig
) => {
  const config = {
    dev: false,
    isServer: false,
    ssr: !!process.env.SSR,
    ...baseConfig
  };
  appConfig = {
    plugins: [],
    ...appConfig
  }
  const webpackMode = config.dev ? 'development' : 'production';
  const publicPath = '/public/';
  const dotenv = getEnv(config.isServer, {
    plugins: appConfig.plugins,
    configureWebpack: appConfig.configureWebpack,
    modify: appConfig.modify,
  }, '');
  let webpackConfig = {
    mode: webpackMode,
    devtool: 'source-map',
    name: config.isServer ? 'server' : 'client',
    target: config.isServer ? 'node' : 'web',
    cache: true,
    output: {
      path: path.join(paths.appBuildSrc, config.isServer ? 'server' : ''),
      filename: config.isServer ? 'server.js' : 'static/chunks/app.js',
      publicPath,
      libraryTarget: config.isServer ? 'commonjs2' : 'jsonp',
      hotUpdateChunkFilename: 'static/webpack/[id].[hash].hot-update.js',
      hotUpdateMainFilename: 'static/webpack/[hash].hot-update.json',
      chunkFilename: config.isServer ? '[name].[contenthash].js' : 'static/chunks/[name].[contenthash].js',
    },
    // performance: {
    //   hints: false
    // },
    resolve: {
      extensions: ['.wasm', '.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        'styles': paths.appStyles
      },
      plugins: [
        new TsconfigPathsPlugin({
          // configFile: paths.appTsconfig
        }),
      ]
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loader: 'tslint-loader',
          enforce: 'pre'
        },
        styleLoader({ isServer: config.isServer }),
        scriptLoader({ isServer: config.isServer }),
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
      // new AutoDllPlugin(),
      new webpack.DefinePlugin(dotenv.stringified),
      new webpack.NamedModulesPlugin(),
      new WebpackBar({
        name: config.isServer ? 'server' : 'client'
      }),
      config.dev && new FriendlyErrorsWebpackPlugin(),
      config.dev && new webpack.HotModuleReplacementPlugin(),
      config.dev && new CaseSensitivePathPlugin(),
      config.dev && !!process.env.SSR && new WriteFilePlugin({
        exitOnErrors: false,
        log: false,
        // required not to cache removed files
        useHashIndex: false
      })
    ].filter(Boolean)
  };
  appConfig.plugins.push(clientPlugins);
  appConfig.plugins.push(serverPlugins);
  appConfig.plugins.forEach(plugin => {
    if (typeof(plugin) === 'function') {
      webpackConfig = plugin(webpackConfig, { ...config, ...appConfig }, dotenv);
    }
  });
  if (appConfig.configureWebpack) {
    webpackConfig = merge(appConfig.configureWebpack, (webpackConfig as any));
  }
  if (appConfig.modify) {
    webpackConfig = appConfig.modify<typeof webpackConfig>(webpackConfig, { ...config, ...appConfig }, dotenv);
  }
  return webpackConfig;
};
