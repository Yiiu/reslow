import chalk from 'chalk';
import * as spawn from 'cross-spawn';
import * as fs from 'fs-extra';
import * as inquirer from 'inquirer';
import * as path from 'path';

const cwd = process.cwd();

export interface ICreateOptions {
  template?: string;
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
    // this.useYarn = this.shouldUseYarn();
    this.useYarn = false;
    this.getInfo(this.projectName);
  }

  public getInfo = (projectName: string) => {
    this.inCurrent = projectName === '.';
    this.name = this.inCurrent ? path.relative('../', cwd) : projectName;
    this.targetDir = path.resolve(cwd, projectName || '.');
    this.templatePath = this.options.template || path.resolve(__dirname, '../../../../template');
  }

  public create = async () => {
    const { targetDir } = this;
    console.log(`\n Creating a new React app in ${chalk.green(targetDir)}. \n`);
    await this.ensureDir();
  }

  public ensureDir = async () => {
    const { targetDir, templatePath, name, inCurrent } = this;
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
    fs.emptyDirSync(targetDir);
    fs.copySync(templatePath, targetDir);
    this.installModules();
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
      args = ['add', '--exact'];
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
    const allDependencies = [
      '@types/react',
      '@types/react-dom',
      '@types/react',
      '@types/express',
      'react-dom',
      'react',
      'radish-server',
      'express',
      'react-hot-loader',
    ];
    return allDependencies;
  }
}
