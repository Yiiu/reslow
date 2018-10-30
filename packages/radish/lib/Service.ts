import * as fs from 'fs-extra';
import * as Config from 'webpack-chain';
import * as merge from 'webpack-merge';

// import * as commander from 'commander';
import paths from './config/paths';

import Script from './scripts';

interface IAppOptions {
  isServer: boolean;
  dev: boolean;
}

export type Command = 'start' | 'build';

export type AppPluginConfig = IAppConfig & IAppOptions;

export type IAppConfigPlugin = <T>(webpackConfig: T, config: AppPluginConfig, dotenv: any) => any;

export interface IServiceOptions {
  ssr?: boolean;
  mode?: string;
  open?: boolean;
}

export interface IArgs {
  ssr?: boolean;
  mode?: string;
  open?: boolean;
}

export interface IProjectOptions {
  configureWebpack?: any;
  plugins?: IAppConfigPlugin[];
  chainWebpack?: () => {};
}

export interface IAppConfig extends IServiceOptions {
  configureWebpack?: any;
  plugins?: IAppConfigPlugin[];
  hotPort?: string;
  hotHost?: string;
  port?: string;
  host?: string;
  modify?: IAppConfigPlugin;
  serverIndexJs?: string;
  clientIndexJs?: string;
  mode?: string;
}

export default class Service {
  public projectOptions!: IProjectOptions;
  public webpackChainFns: any[] = [];
  public webpackRawConfigFns: any[] = [];

  public script = new Script(this);

  public initOptions: IAppConfig = {
    port: process.env.PORT || '3000',
    host: process.env.HOST || 'localhost'
  };

  constructor(options: IServiceOptions) {
    // this.options = {
    //   ...options,
    //   ...this.initOptions
    // };
  }

  public resolveChainableWebpackConfig () {
    const chainableConfig = new Config();
    // apply chains
    this.webpackChainFns.forEach(fn => fn(chainableConfig));
    return chainableConfig;
  }

  public resolveWebpackConfig (chainableConfig = this.resolveChainableWebpackConfig()) {
    let config = chainableConfig.toConfig();
    // apply raw config fns
    this.webpackRawConfigFns.forEach(fn => {
      if (typeof fn === 'function') {
        // function with optional return value
        const res = fn({}, config);
        if (res) {
          config = merge(config, res);
        }
      } else if (fn) {
        // merge literal values
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
    if (fs.existsSync(paths.appConfig)) {
      try {
        const config = require(paths.appConfig);
        return config;
      } catch (e) {
        console.error('Invalid config.js file.', e);
        process.exit(1);
      }
    }
  }
}
