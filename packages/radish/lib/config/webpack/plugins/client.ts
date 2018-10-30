import * as CopyWebpackPlugin from 'copy-webpack-plugin';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import * as path from 'path';
import { ReactLoadablePlugin } from 'react-loadable/webpack';
import * as SWPrecacheWebpackPlugin from 'sw-precache-webpack-plugin';
import * as ManifestPlugin from 'webpack-manifest-plugin';
import paths from '../../paths';

const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');

import { AppPluginConfig } from '../../../scripts/index';

export default (
  webpackConfig: any,
  {
    isServer,
    dev,
    ssr,
    port,
    host,
    clientIndexJs
  }: AppPluginConfig,
  dotenv: any
) => {
  const hostPort = parseInt(port + '', 10) + (ssr ? 1 : 0);
  if (!isServer) {
    webpackConfig.entry = [
      clientIndexJs
    ];
    if (dev) {
      webpackConfig.entry.unshift(
        `webpack-hot-middleware/client?reload=true&path=http://${host}:${hostPort}/__webpack_hmr`
      );
      webpackConfig.devServer = {
        compress: true,
        host: dotenv.raw.HOST,
        port: hostPort,
        watchOptions: {
          ignored: /node_modules/,
        },
        contentBase: paths.appBuildSrc,
        publicPath: '/__server',
        before(app: any) {
          app.use(errorOverlayMiddleware());
        },
      };
    }
    if (!ssr) {
      webpackConfig.output.publicPath = '/';
      webpackConfig.plugins.unshift(
        new HtmlWebpackPlugin({
          inject: true,
          template: paths.appHtml,
        }),
      );
      webpackConfig.plugins.unshift(
        new InterpolateHtmlPlugin(HtmlWebpackPlugin, dotenv.raw),
      );
    } else {
      webpackConfig.plugins.push(
        new ReactLoadablePlugin({
          filename: path.join(paths.appBuildSrc, 'react-loadable.json'),
        })
      );
    }
    webpackConfig.plugins.push(
      new MiniCssExtractPlugin({
        filename: 'static/style/[name].css',
        chunkFilename: 'static/style/[id].css'
      })
    );
    webpackConfig.plugins.push(
      new ManifestPlugin({
        fileName: 'asset-manifest.json',
        publicPath: webpackConfig.output.publicPath
      })
    );
    webpackConfig.plugins.push(
      new CopyWebpackPlugin([{
        from: paths.appPublic
      }])
    );
    webpackConfig.plugins.push(
      new SWPrecacheWebpackPlugin({
        cacheId: 'client',
        dontCacheBustUrlsMatching: false,
        filename: 'service-worker.js',
        minify: true
      } as any)
    );
  }
  return webpackConfig;
};
