process.env.NODE_ENV = 'production';

import chalk from 'chalk';
import * as fs from 'fs-extra';
import * as webpack from 'webpack';
import paths from '../config/paths';
import webpackConfigs from '../config/webpack/index';

import { IAppConfig } from './index';

const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const FileSizeReporter = require('react-dev-utils/FileSizeReporter');
const clearConsole = require('react-dev-utils/clearConsole');
// const printHostingInstructions = require('react-dev-utils/printHostingInstructions');

const measureFileSizesBeforeBuild =
  FileSizeReporter.measureFileSizesBeforeBuild;
// const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;
// const useYarn = fs.existsSync(paths.yarnLockFile);

const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

export default async (appConfig: IAppConfig) => {
  const fileSizes = await measureFileSizesBeforeBuild(paths.appBuild);
  fs.emptyDirSync(paths.appBuild);
  build(fileSizes, appConfig)
    .then(({ warnings }) => {
      if (warnings.length) {
        console.log(chalk.yellow('Compiled with warnings.\n'));
        console.log(warnings.join('\n\n'));
        console.log(
          '\n Search for the ' +
            chalk.underline(chalk.yellow('keywords')) +
            ' to learn more about each warning.'
        );
        console.log(
          'To ignore, add ' +
            chalk.cyan('// eslint-disable-next-line') +
            ' to the line before.\n'
        );
      } else {
        console.log(chalk.green('Compiled successfully.\n'));
      }
      console.log('File sizes after gzip:\n');
      // printFileSizesAfterBuild(
      //   stats,
      //   previousFileSizes,
      //   paths.appBuild,
      //   WARN_AFTER_BUNDLE_GZIP_SIZE,
      //   WARN_AFTER_CHUNK_GZIP_SIZE
      // );
    })
    .catch(err => {
      if (err && err.message) {
        console.log(err.message);
      }
      process.exit(1);
    });
};

const build = async (previousFileSizes, config: IAppConfig): Promise<any> => {
  const clientConfig = webpackConfigs(false, false, config);
  const serverConfig = webpackConfigs(false, true, config);
  const clientMultiCompiler = webpack(clientConfig as any) as any;
  const serverMultiCompiler = webpack(serverConfig as any) as any;
  return new Promise((resolve, reject) => {
    clientMultiCompiler.run((err, stats) => {
      let messages;
      if (err) {
        if (!err.message) {
          return reject(err);
        }
        messages = formatWebpackMessages({
          errors: [err.message],
          warnings: [],
        });
      } else {
        messages = formatWebpackMessages(
          stats.toJson({ all: false, warnings: true, errors: true })
        );
      }
      if (config.ssr) {
        serverMultiCompiler.run((serverErr, serverStats) => {
          let serverMessages;
          if (serverErr) {
            if (!serverErr.message) {
              return reject(serverErr);
            }
            serverMessages = formatWebpackMessages({
              errors: [serverErr.message],
              warnings: [],
            });
          } else {
            serverMessages = formatWebpackMessages(
              serverStats.toJson({ all: false, warnings: true, errors: true })
            );
          }
          const resolveArgs = {
            stats: serverStats,
            previousFileSizes,
            warnings: serverMessages.warnings,
          };
          return resolve(resolveArgs);
        });
      }
    });
  });
};
