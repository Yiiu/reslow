import * as fs from 'fs-extra';
import * as _ from 'lodash';
import * as Config from 'webpack-chain';
import * as merge from 'webpack-merge';

import paths from './config/paths';

import { getOptions } from './options';
import DefaultOptions, { AppOptionPlugin } from './options/default';
import Scripts from './scripts';

export type Command = 'start' | 'build';

export interface IArgs {
  npm?: boolean;
  spa?: boolean;
  mode?: string;
  open?: boolean;
  analyze?: boolean;
  plugin?: boolean;
}

const webpackMerge = merge;

export default class Service {
  public projectOptions!: DefaultOptions;
  public webpackChainFns: AppOptionPlugin<Config>[] = [];
  public webpackRawConfigFns: AppOptionPlugin[] = [];
  public webpackConfig: any;

  public script = new Scripts(this);

  constructor() {}

  public resolveChainableWebpackConfig (isServer: boolean, args: IArgs) {
    const chainableConfig = new Config();
    // apply chains
    this.webpackChainFns.forEach(fn => fn({ isServer, args }, chainableConfig));
    return chainableConfig;
  }

  public resolveWebpackConfig = (
    webpackConfig: any = {},
    isServer: boolean,
    args: IArgs,
  ) => {
    const chainableConfig = this.resolveChainableWebpackConfig(isServer, args);
    let config = chainableConfig.toConfig();
    const original = config;
    config = webpackMerge(webpackConfig, original);
    this.webpackRawConfigFns.forEach((fn) => {
      if (typeof fn === 'function') {
        config = (fn as any)({ isServer, args }, config);
      } else if ((fn as any) instanceof Object) {
        config = webpackMerge(config, fn);
      }
    });
    if (config !== original) {
      cloneRuleNames(
        config.module && config.module.rules,
        original.module && original.module.rules
      );
    }
    return config;
  }

  public run = (command: Command, args: IArgs) => {
    this.projectOptions = getOptions(this.getUserOptions(), args);
    if (this.projectOptions.chainWebpack) {
      this.webpackChainFns.push(this.projectOptions.chainWebpack);
    }
    if (this.projectOptions.plugins instanceof Array) {
      this.projectOptions.plugins.forEach((plugin) => {
        if (typeof plugin === 'string') {
          const completePluginName = `radish-plugin-${plugin}`;
          const fn = require(`${process.cwd()}/node_modules/${completePluginName}`).default;
          if (fn) {
            this.webpackRawConfigFns.push(fn);
          } else {
            throw new Error(`Unable to find '${completePluginName}`);
          }
        } else if (typeof plugin === 'function') {
          this.webpackRawConfigFns.push(plugin);
        }
      });
    }
    if (this.projectOptions.configureWebpack) {
      this.webpackRawConfigFns.push(this.projectOptions.configureWebpack);
    }
    this.script.run(command, args);
  }

  public create = (projectName: string, args: IArgs) => {
    this.script.create(projectName, args);
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

function cloneRuleNames(to: any, from: any) {
  if (!to || !from) {
    return;
  }
  from.forEach((r: any, i: number) => {
    if (to[i]) {
      Object.defineProperty(to[i], '__ruleNames', {
        value: r.__ruleNames
      });
      cloneRuleNames(to[i].oneOf, r.oneOf);
    }
  });
}
