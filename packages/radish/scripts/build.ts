process.env.NODE_ENV = 'production';

import chalk from 'chalk';
import * as fs from 'fs-extra';
import * as webpack from 'webpack';
import paths from '../config/paths';
import webpackConfigs, { IAppConfig } from '../config/webpack/index';

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

const main = async () => {
  const fileSizes = await measureFileSizesBeforeBuild(paths.appBuild);
  fs.emptyDirSync(paths.appBuild);
  build(fileSizes)
    .then(({ stats, previousFileSizes, warnings }) => {
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

const build = async (previousFileSizes) => {
  let config: IAppConfig = {};
  if (await fs.existsSync(paths.appConfig)) {
    try {
      config = require(paths.appConfig);
    } catch (e) {
      clearConsole();
      console.error('Invalid razzle.config.js file.', e);
      process.exit(1);
    }
  }
  const clientConfig = webpackConfigs({
      dev: false,
      isServer: false
    }, config) as any;
  const serverConfig = webpackConfigs({
      dev: false,
      isServer: true
    }, config) as any;
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
      if (process.env.SSR) {
        serverMultiCompiler.run((serverErr, serverStats) => {
          let serverMessages;
          if (err) {
            if (!err.message) {
              return reject(err);
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

main();
