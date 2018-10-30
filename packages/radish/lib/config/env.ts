import { IAppConfig } from '../scripts/index';
import paths from './paths';

const NODE_ENV = process.env.NODE_ENV;
if (!NODE_ENV) {
  throw new Error(
    'The NODE_ENV environment variable is required but was not specified.'
  );
}

const REACT_APP = /^REACT_APP_/i;

export const getEnv = (isServer: boolean, options: IAppConfig, publicUrl: string) => {
  const raw = Object.keys(process.env)
    .filter(key => REACT_APP.test(key))
    .reduce(
      (env, key) => {
        env[key] = process.env[key];
        return env;
      },
      {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT || options.port || '3000',
        HOST: process.env.HOST || options.host || 'localhost',
        SSR: process.env.SSR,
        BUILD_TARGET: isServer ? 'server' : 'client',
        CLIENT_PUBLIC_PATH: process.env.CLIENT_PUBLIC_PATH,
        PUBLIC_URL: publicUrl,
        APP_PUBLIC_DIR: paths.appBuildPublic
      } as NodeJS.ProcessEnv
    );
  process.env = {
    ...process.env,
    ...raw
  };
  const stringified = {
    'process.env': Object.keys(process.env).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key]);
      return env;
    }, {} as NodeJS.ProcessEnv),
  };
  return {
    raw: {
      ...process.env
    },
    stringified
  };
};
