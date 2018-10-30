import * as fs from 'fs-extra';
import * as Config from 'webpack-chain';
import * as merge from 'webpack-merge';

// import * as commander from 'commander';
import paths from './config/paths';

import Script from './scripts';

export interface IPluginObject {
  [key: string]: any;
}

export type Command = 'start' | 'build';

export interface IPluginOptions {
  isServer: boolean;
  args: IArgs;
}

export type AppConfigPlugin<T> = (options: IPluginOptions, webpackConfig: T) => T;

export type ConfigureWebpack = IPluginObject | AppConfigPlugin<IPluginObject>;
export interface IArgs {
  ssr?: boolean;
  mode?: string;
  open?: boolean;
}

export interface IProjectOptions {
  configureWebpack?: ConfigureWebpack;
  clientIndexJs: string;
  serverIndexJs: string;
  chainWebpack?: AppConfigPlugin<Config>;
  port?: string;
  host?: string;
}

export default class Service {
  public projectOptions!: IProjectOptions;
  public webpackChainFns: Array<AppConfigPlugin<Config>> = [];
  public webpackRawConfigFns: ConfigureWebpack[] = [];
  public webpackConfig: any;

  public script = new Script(this);

  constructor() {
    // this.options = {
    //   ...options,
    //   ...this.initOptions
    // };
  }

  public resolveChainableWebpackConfig (isServer: boolean, args: IArgs) {
    const chainableConfig = new Config();
    // apply chains
    this.webpackChainFns.forEach(fn => fn({ isServer, args }, chainableConfig));
    return chainableConfig;
  }

  public resolveWebpackConfig = (
    webpackConfig: any = {},
    isServer: boolean,
    args: IArgs
  ) => {
    const chainableConfig = this.resolveChainableWebpackConfig(isServer, args);

    let config = merge(webpackConfig, chainableConfig.toConfig());
    this.webpackRawConfigFns.forEach(fn => {
      if (typeof fn === 'function') {
        const res = (fn as any)({ isServer, args }, config);
        if (res) {
          config = merge(config, res);
        }
      } else if (fn) {
        config = merge(config, fn);
      }
    });
    return config;
  }

  public run = (command: Command, args: IArgs) => {
    this.projectOptions = this.getUserOptions();
    if (this.projectOptions.chainWebpack) {
      this.webpackChainFns.push(this.projectOptions.chainWebpack);
    }
    if (this.projectOptions.configureWebpack) {
      this.webpackRawConfigFns.push(this.projectOptions.configureWebpack);
    }
    this.script.run(command, args);
  }

  public create = (projectName: string, args: IArgs) => {
    this.script.create(projectName);
  }

  public getUserOptions = () => {
    const initConfig = {
      host: 'localhost',
      port: '3000',
      clientIndexJs: paths.appClientIndexJs,
      serverIndexJs: paths.appServerIndexJs
    };
    if (fs.existsSync(paths.appConfig)) {
      try {
        const config = require(paths.appConfig);
        return {...initConfig, ...config};
      } catch (e) {
        console.error('Invalid config.js file.', e);
        process.exit(1);
      }
    }
  }
}
