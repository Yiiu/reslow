import chalk from 'chalk';
import * as spawn from 'cross-spawn';
import * as fs from 'fs-extra';
import * as path from 'path';

export default async (projectName: string, data: any) => {
  const cwd = process.cwd();
  const inCurrent = projectName === '.';
  const name = inCurrent ? path.relative('../', cwd) : projectName;
  const targetDir = path.resolve(cwd, projectName || '.');

  const templatePath = path.resolve(__dirname, '../../template');

  console.log(`\n Creating a new React app in ${chalk.green(targetDir)}. \n`);
  if (fs.existsSync(targetDir)) {
    console.log('error');
  } else {
    await fs.ensureDirSync(targetDir);
    await fs.copySync(templatePath, targetDir);
    process.chdir(targetDir);
    const command = 'npm';
    const args = [
      'install',
      '--loglevel',
      'error',
    ];
    const child = spawn(command, args, { stdio: 'inherit' });
    console.log(' Installing packages. This might take a couple of minutes.');
    console.log();
    child.on('close', code => {
      if (code !== 0) {
        console.log('error');
        return;
      }
      console.log();
      console.log(`Success! Created ${chalk.green(name)} at ${chalk.green(targetDir)}`);
      console.log('Inside that directory, you can run several commands:');
      console.log();
      console.log(chalk.cyan(`  npm start`));
      console.log('    Starts the development server.');
      console.log();
      console.log(chalk.cyan(`  npm 'run build`));
      console.log('    Bundles the app into static files for production.');
      console.log();
      console.log('We suggest that you begin by typing:');
      console.log();
      console.log(chalk.cyan('  cd'), name);
      console.log(`  ${chalk.cyan(`npm start`)}`);
    });
  }
};
