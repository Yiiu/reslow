#!/usr/bin/env node

'use strict';
const program = require('commander');

program
  .version('0.1.0')
  .option('-C, --chdir <path>', 'change the working directory')
  .option('-c, --config <path>', 'set config path. defaults to ./deploy.conf')
  .option('-T, --no-tests', 'ignore test hook');

program
  .command('create <app-name>')
  .description('run dev create')
  .action((name, args) => {
    const Service = require('../build/lib/Service').default;
    const service = new Service();
    service.create(name, args)
  })

program
  .command('start')
  .description('run dev server')
  .option("-m, --mode <mode>", "specify env mode")
  .option("-s, --ssr", "use server render")
  .option("-o, --open", "open browser on server start")
  .action((args) => {
    process.env.NODE_ENV = 'development';
    const Service = require('../build/lib/Service').default;
    const service = new Service();
    service.run('start', args)
  });

program
  .command('build')
  .description('run build')
  .option("-m, --mode <mode>", "Which start mode to use")
  .option("-s, --ssr", "Use ssr")
  .action((args) => {
    process.env.NODE_ENV = 'production';
    const Service = require('../build/lib/Service').default;
    const service = new Service();
    service.run('build', args)
  });

program.parse(process.argv);
