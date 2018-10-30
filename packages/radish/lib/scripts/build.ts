import chalk from 'chalk';
import * as fs from 'fs-extra';
import * as webpack from 'webpack';
import paths from '../config/paths';
import webpackConfigs from '../config/webpack/index';

import Service, { IArgs } from '../Service';

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

export default async (service: Service, args: IArgs) => {

  const fileSizes = await measureFileSizesBeforeBuild(paths.appBuild);
  fs.emptyDirSync(paths.appBuild);
  build(fileSizes, service, args)
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

const build = async (
  previousFileSizes: any, service: Service, args: IArgs
): Promise<any> => {
  const { projectOptions } = service;

  const clientConfig = webpackConfigs(false, service, args);
  const serverConfig = webpackConfigs(true, service, args);
  const clientMultiCompiler = webpack(clientConfig as any) as any;
  const serverMultiCompiler = webpack(serverConfig as any) as any;
  return new Promise((resolve, reject) => {
    clientMultiCompiler.run((err: any, stats: any) => {
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
      if (args.ssr) {
        serverMultiCompiler.run((serverErr: any, serverStats: any) => {
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
