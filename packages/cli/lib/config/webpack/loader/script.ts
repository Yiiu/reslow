import * as path from 'path';

import paths from '../../paths';

export interface IScriptLoaderConfig {
  isServer: boolean;
}

export default (_: IScriptLoaderConfig) => {
  return {
    test: /\.(js|mjs|jsx|ts|tsx)$/,
    exclude: /node_modules/,
    use: [
      {
        loader: require.resolve('cache-loader'),
        options: {
          cacheDirectory: path.join(paths.appNodeModules, 'node_modules/.cache/babel-loader')
        }
      },
      {
        loader: require.resolve('babel-loader'),
        options: {
          babelrc: true,
          configFile: false,
          cacheDirectory: true,
          presets: [
            [
              require.resolve('@babel/preset-typescript'),
              {
                isTSX: true,
                allExtensions: true
              }
            ],
            require.resolve('@babel/preset-env'),
            require.resolve('@babel/preset-react'),
          ],
          plugins: [
            require.resolve('@babel/plugin-transform-runtime'),
            require.resolve('@babel/plugin-syntax-dynamic-import'),
            require.resolve('@babel/plugin-proposal-object-rest-spread'),
            [
              require.resolve('@babel/plugin-proposal-decorators'),
              {
                legacy: true
              }
            ],
            [require.resolve('@babel/plugin-proposal-class-properties'), { loose: true }],
            require.resolve('@babel/plugin-proposal-json-strings'),
            require.resolve('@babel/plugin-proposal-function-bind'),
            require.resolve('react-hot-loader/babel'),
            require.resolve('react-loadable/babel')
          ],
        },
      },
    ],
  };
};
