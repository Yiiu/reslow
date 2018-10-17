import * as fs from 'fs';
import * as path from 'path';
import config from './index';

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath: string) => path.resolve(appDirectory, relativePath);

export default {
  dotenv: resolveApp('.env'),
  appSrc: resolveApp('src'),
  appPackageJson: resolveApp('package.json'),
  appClientIndexJs: resolveApp('src/app/index.tsx'),
  appServerIndexJs: resolveApp('src/server.ts'),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('public/index.html'),
  appNodeModules: resolveApp('node_modules'),
  appStyles: resolveApp('src/app/styles'),
  appBuild: config.build,
  appBuildPublic: resolveApp(`${config.build}`),
  appBuildSrc: resolveApp(config.build),
  appTsconfig: resolveApp('tsconfig.json'),
  appBuildClient: resolveApp(config.clientBuild),
  appConfig: resolveApp('config.js')
};
