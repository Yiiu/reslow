import chalk from 'chalk';
import * as fs from 'fs-extra';
import * as webpack from 'webpack';

import paths from '../config/paths';
import clientWebpackConfig from '../config/webpack/client';
import serverWebpackConfig from '../config/webpack/server';

import Service, { IArgs } from '../Service';

const FileSizeReporter = require('react-dev-utils/FileSizeReporter');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const printBuildError = require('react-dev-utils/printBuildError');

const measureFileSizesBeforeBuild =
  FileSizeReporter.measureFileSizesBeforeBuild;
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;

const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

export default async (service: Service, args: IArgs) => {

  const fileSizes = await measureFileSizesBeforeBuild(paths.appBuild);
  fs.emptyDirSync(paths.appBuild);
  build(fileSizes, service, args)
    .then(({ stats, previousFileSizes, warnings }) => {
      if (warnings.length) {
        console.log(chalk.yellow('Compiled with warnings.\n'));
        console.log(warnings.join('\n\n'));
        console.log(
          // tslint:disable-next-line:prefer-template
          '\nSearch for the ' +
            chalk.underline(chalk.yellow('keywords')) +
            ' to learn more about each warning.'
        );
        console.log(
          // tslint:disable-next-line:prefer-template
          'To ignore, add ' +
            chalk.cyan('// eslint-disable-next-line') +
            ' to the line before.\n'
        );
      } else {
        console.log(chalk.green('Compiled successfully.\n'));
      }

      console.log('File sizes after gzip:\n');
      printFileSizesAfterBuild(
        stats,
        previousFileSizes,
        paths.appBuild,
        WARN_AFTER_BUNDLE_GZIP_SIZE,
        WARN_AFTER_CHUNK_GZIP_SIZE
      );
      console.log();
      console.log(chalk.green('build successfully.\n'));
    })
    .catch((err) => {
      console.log(chalk.red('Failed to compile.\n'));
      printBuildError(err);
      process.exit(1);
    });
};

const build = async (
  previousFileSizes: any, service: Service, args: IArgs,
): Promise<any> => {

  const clientConfig = clientWebpackConfig(service, args);
  const serverConfig = serverWebpackConfig(service, args);
  const clientMultiCompiler = webpack(clientConfig as any) as any;
  const serverMultiCompiler = webpack(serverConfig as any) as any;
  const [data] = await Promise.all([
    webpackCompiler(clientMultiCompiler),
    webpackCompiler(serverMultiCompiler)
  ]);
  return {
    previousFileSizes,
    config: clientConfig,
    ...data,
  };
};

function webpackCompiler(compiler: any) {
  return new Promise((resolve, reject) => {
    compiler.run((err: any, stats: any) => {
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
      if (messages.errors.length) {
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (messages.errors.length > 1) {
          messages.errors.length = 1;
        }
        return reject(new Error(messages.errors.join('\n\n')));
      }
      const resolveArgs = {
        stats,
        warnings: messages.warnings,
      };
      return resolve(resolveArgs);
    });
  });
}
