import * as httpProxyMiddleware from 'http-proxy-middleware';
import * as Config from 'webpack-chain';

import paths from '../../config/paths';
import { IArgs } from '../../Service';

export interface IPluginOptions {
  isServer: boolean;
  args: IArgs;
}

export interface IProxyOptions {
  [key: string]: httpProxyMiddleware.Config;
}

export type AppOptionPlugin<T = any> = (options: IPluginOptions, webpackConfig: T) => T | T;

export default class Options {
  public ssr = true;
  public host = 'localhost';
  public hardSource = false;
  public analyze = false;
  public port = '3000';
  public devPort = '3001';
  public noTs = false;
  public electron = false;
  public quiet = true;
  public css = {
    cssModules: true
  };
  public autoDll = {
    vendor: ['react-dom', 'react'],
    polyfills: []
  };
  public proxy?: IProxyOptions;
  public clientIndexJs = paths.appClientIndexJs;
  public serverIndexJs = paths.appServerIndexJs;
  public chainWebpack?: AppOptionPlugin<Config>;
  public plugins?: AppOptionPlugin[];
  public configureWebpack?: AppOptionPlugin;
}
