import chalk from 'chalk';
import * as spawn from 'cross-spawn';
import * as fs from 'fs-extra';
import * as inquirer from 'inquirer';
import * as path from 'path';

import { promiseLogger } from '../../utils/promiseLogger';

const cwd = process.cwd();

export interface ICreateOptions {
  template?: string;
  spa?: boolean;
  plugin?: boolean;
}

export default class Create {

  public projectName: string;
  public options: ICreateOptions;
  public name!: string;
  public targetDir!: string;
  public inCurrent!: boolean;
  public templatePath!: string;

  public useYarn: boolean;

  constructor(projectName: string, options: ICreateOptions = {}) {
    this.projectName = projectName;
    this.options = options;
    this.useYarn = this.shouldUseYarn();
    this.getInfo(this.projectName);
  }

  public getInfo = (projectName: string) => {
    this.inCurrent = projectName === '.';
    this.name = this.inCurrent ? path.relative('../', cwd) : projectName;
    this.targetDir = path.resolve(cwd, projectName || '.');
    this.getTemplatePath();
  }

  public getTemplatePath = () => {
    const dir = path.join(__dirname, '../../../../');
    if (this.options.template) {
      this.templatePath = this.options.template;
    } else {
      if (this.options.spa) {
        this.templatePath = path.join(dir, 'template/spa');
      } else {
        this.templatePath = path.join(dir, 'template/default');
      }
      if (this.options.plugin) {
        this.templatePath = path.join(dir, 'template/plugin');
      }
    }
    if (!fs.existsSync(this.templatePath)) {
      console.error(`\n ${chalk.red('no template')} \n`);
      process.exit(1);
    }
  }

  public copyTemplate = async () => {
    const { targetDir, templatePath } = this;
    // console.log(targetDir);
    await fs.emptyDir(targetDir);
    await fs.copy(templatePath, targetDir);
  }

  public create = async () => {
    const { targetDir } = this;
    console.log(`\n Creating a new React app in ${chalk.green(targetDir)}. \n`);
    await promiseLogger(await this.ensureDir(), 'Check the create folder.');
    await promiseLogger(this.copyTemplate(), 'Copy template folder.');
    this.installModules();
  }

  public ensureDir = async () => {
    const { targetDir, name, inCurrent } = this;
    if (fs.existsSync(targetDir)) {
      console.log(
        ` Uh oh! Looks like there's already a directory called ${chalk.red(
          name,
        )}.`,
      );
      if (inCurrent) {
        const { ok } = await inquirer.prompt<{ok: boolean}>({
          type: 'confirm',
          name: 'ok',
          message: 'Generate project in current directory?',
        });
        if (!ok) {
          return false;
        }
      } else {
        const { ok } = await inquirer.prompt<{ok: boolean}>({
          type: 'confirm',
          name: 'ok',
          message: 'The folder already exists, is it deleted?',
        });
        if (!ok) {
          return false;
        }
      }
    }
  }

  public shouldUseYarn = () => {
    try {
      spawn.sync('yarnpkg --version', { stdio: 'ignore' });
      return true;
    } catch (e) {
      return false;
    }
  }

  public installModules = () => {
    const { targetDir, useYarn, name, inCurrent } = this;
    const dependencies = this.getInstallPackage();
    process.chdir(targetDir);
    let command: string;
    let args: string[];
    if (useYarn) {
      command = 'yarnpkg';
      args = ['add'];
      if (dependencies.length > 0) {
        args.push('--exact');
      }
      args = [...args, ...dependencies];
      args.push('--cwd');
      args.push(targetDir);
    } else {
      command = 'npm';
      args = [
        'install',
        '--save',
        '--save-exact',
        '--loglevel',
        'error',
      ].concat(dependencies);
    }
    const child = spawn(command, args, { stdio: 'inherit' });
    console.log(`\n ${chalk.green('Installing packages.')} This might take a couple of minutes.\n`);
    child.on('close', (code) => {
      if (code !== 0) {
        console.log(chalk.red(`error: ${command} ${args.join(' ')}`));
        return;
      }
      console.log();
      console.log(`Success! Created ${chalk.green(name)} at ${chalk.green(targetDir)}`);
      console.log('Inside that directory, you can run several commands:');
      console.log();
      console.log(chalk.cyan(`  ${useYarn ? 'yarn' : 'npm'} start`));
      console.log('    Starts the development server.');
      console.log();
      console.log(
        chalk.cyan(
          `  ${useYarn ? 'yarn' : 'npm'} ${useYarn ? '' : 'run'} build`,
        ),
      );
      console.log('    Bundles the app into static files for production.');
      console.log();
      console.log('We suggest that you begin by typing:');
      console.log();
      if (!inCurrent) {
        console.log(chalk.cyan('  cd'), name);
      }
      console.log(`  ${chalk.cyan(`${useYarn ? 'yarn' : 'npm'} start`)}\n`);
    });
  }

  public getInstallPackage = () => {
    let allDependencies = [
      '@types/react',
      '@types/react-dom',
      'react-dom',
      'react',
      '@reslow/cli',
      'react-hot-loader',
    ];
    if (!this.options.spa) {
      allDependencies = allDependencies.concat(['@types/express', 'express']);
    } else {
      allDependencies.unshift('@types/node');
    }
    if (this.options.plugin) {
      return [];
    }
    return allDependencies;
  }
}
