#!/usr/bin/env node

'use strict';
const program = require('commander');

const Service = require('../build/scripts').default;


program
  .version('0.1.0')
  .option('-C, --chdir <path>', 'change the working directory')
  .option('-c, --config <path>', 'set config path. defaults to ./deploy.conf')
  .option('-T, --no-tests', 'ignore test hook');

program
  .command('start')
  .description('run dev server')
  .option("-m, --mode <mode>", "Which start mode to use")
  .option("-s, --ssr", "Use ssr")
  .action(async ({
    ssr = false,
    mode
  }) => {
    const service = new Service({ ssr, mode });
    await service.initConfig()
    service.start()
  });

program
  .command('build')
  .description('run build')
  .option("-m, --mode <mode>", "Which start mode to use")
  .option("-s, --ssr", "Use ssr")
  .action(async ({
    ssr = false,
    mode
  }) => {
    const service = new Service({ ssr, mode });
    await service.initConfig()
    service.build()
  });

program.parse(process.argv);
