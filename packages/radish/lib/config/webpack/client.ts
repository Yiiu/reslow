import * as CopyWebpackPlugin from 'copy-webpack-plugin';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import * as OptimizeCssAssetsWebpackPlugin from 'optimize-css-assets-webpack-plugin';
import * as path from 'path';
import { ReactLoadablePlugin } from 'react-loadable/webpack';
import * as SWPrecacheWebpackPlugin from 'sw-precache-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import * as ManifestPlugin from 'webpack-manifest-plugin';
import * as merge from 'webpack-merge';

import Service, { IArgs } from '../../Service';
import paths from '../paths';
import baseConfig from './base';

const AutoDllPlugin = require('autodll-webpack-plugin');
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');
const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');

const dev = process.env.NODE_ENV === 'development';

export default (service: Service, args: IArgs) => {
  const { projectOptions } = service;
  const { host, clientIndexJs, autoDll, devPort, proxy, analyze, ssr } = projectOptions;
  const clientConfig = {
    entry: [
      dev && `webpack-dev-server/client?http://${host}:${devPort}`,
      dev && 'webpack/hot/only-dev-server',
      dev && 'react-hot-loader/patch',
      clientIndexJs
    ].filter(Boolean),
    output: {
      path: path.join(paths.appBuildSrc, ''),
      filename: 'static/chunks/app.[hash].js',
      libraryTarget: 'jsonp',
      chunkFilename: 'static/chunks/[name].[contenthash].js',
    },
    devServer: {
      proxy,
      quiet: true,
      compress: true,
      host: process.env.HOST,
      port: devPort,
      historyApiFallback: {
        disableDotRule: true
      },
      watchOptions: {
        ignored: /node_modules/,
      },
      inline: true,
      hot: true,
      overlay: true,
      clientLogLevel: 'none',
      contentBase: paths.appBuildSrc,
      publicPath: ssr ? '/__server' : '/',
      before(app: any) {
        app.use(errorOverlayMiddleware());
      },
    },
    plugins: [
      !dev && new OptimizeCssAssetsWebpackPlugin({
        cssProcessorOptions: {
          safe: true,
          discardComments: {
            removeAll: true
          }
        }
      }),
      !ssr && new HtmlWebpackPlugin({
        inject: true,
        template: paths.appHtml,
      }),
      !ssr && new InterpolateHtmlPlugin(HtmlWebpackPlugin, {
        PUBLIC_URL: ''
      }),
      dev && ssr && new AutoDllPlugin({
        debug: true,
        inject: true,
        filename: '[name].js',
        entry: {
          vendor: autoDll.vendor || [],
          polyfills: autoDll.polyfills || [],
        }
      }),
      ssr && new ReactLoadablePlugin({
        filename: path.join(paths.appBuildSrc, 'react-loadable.json'),
      }),
      ssr && new ManifestPlugin({
        fileName: 'asset-manifest.json',
        writeToFileEmit: true
      }),
      new MiniCssExtractPlugin({
        filename: 'static/style/[name].css',
        chunkFilename: 'static/style/[id].css',
      }),
      new CopyWebpackPlugin([{
        from: paths.appPublic,
      }]),
      new SWPrecacheWebpackPlugin({
        cacheId: 'client',
        dontCacheBustUrlsMatching: false,
        filename: 'service-worker.js',
        minify: true,
      } as any),
      analyze && new BundleAnalyzerPlugin({
        defaultSizes: 'gzip',
        generateStatsFile: true,
      }),
      new ModuleNotFoundPlugin(paths.appPath),
      new CaseSensitivePathsPlugin(),
      new WatchMissingNodeModulesPlugin(paths.appNodeModules),
    ].filter(Boolean)
  };
  return merge(baseConfig(false, service, args) as any, clientConfig as any);
};
