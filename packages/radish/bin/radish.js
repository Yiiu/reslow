#!/usr/bin/env node

'use strict';
const program = require('commander');
const chalk = require('chalk');

program
  .version(require('../package.json').version)

program
  .command('create <project-name>')
  .option("-s, --spa", "SPA mode and disables server side rendering")
  .option("-p, --plugin", "plugin template")
  .description('run dev create')
  .action((name, args) => {
    process.env.NODE_ENV = 'production';
    const Service = require('../build/lib/Service').default;
    const service = new Service();
    service.create(name, args);
  })

program
  .command('start')
  .description('run dev server')
  // .option("-m, --mode <mode>", "specify env mode")
  .option("-s, --spa", "SPA mode and disables server side rendering")
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
  // .option("-m, --mode <mode>", "Which start mode to use")
  .option("-s, --spa", "SPA mode and disables server side rendering")
  .option("-a, --analyze", "launch the bundle analyzer")
  .action((args) => {
    process.env.NODE_ENV = 'production';
    const Service = require('../build/lib/Service').default;
    const service = new Service();
    service.run('build', args)
  });

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

program.parse(process.argv);
