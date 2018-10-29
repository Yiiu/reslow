import * as fs from 'fs-extra';

import paths from '../config/paths';
import build from './build';
import create from './create';
import start from './start';

interface IAppOptions {
  isServer: boolean;
  dev: boolean;
}

export type AppPluginConfig = IAppConfig & IAppOptions;

export type IAppConfigPlugin = <T>(webpackConfig: T, config: AppPluginConfig, dotenv: any) => any;

export interface IServiceOptions {
  ssr?: boolean;
  mode?: string;
  open?: boolean;
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
  public options: IAppConfig;

  public initOptions: IAppConfig = {
    port: process.env.PORT || '3000',
    host: process.env.HOST || 'localhost'
  };

  constructor(options: IServiceOptions) {
    this.options = {
      ...options,
      ...this.initOptions
    };
  }

  public start = () => {
    start(this.options);
  }

  public build = () => {
    build(this.options);
  }

  public create = (projectName: string) => {
    create(projectName, {});
  }

  public initConfig = async () => {
    if (fs.existsSync(paths.appConfig)) {
      try {
        const config = require(paths.appConfig);
        this.options = {
          ...this.options,
          ...config
        };
      } catch (e) {
        console.error('Invalid config.js file.', e);
        process.exit(1);
      }
    }
  }
}
