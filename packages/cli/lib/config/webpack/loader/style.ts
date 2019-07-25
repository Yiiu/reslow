import * as autoprefixer from 'autoprefixer';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';

export interface IStyleLoaderConfig {
  isServer: boolean;
  css: {
    cssModules: boolean
  };
}

export default (
  {
    isServer = false,
    css
  }: IStyleLoaderConfig,
  isModules = false
) => {
  let exclude;
  let include;
  let modules;
  if (isModules) {
    include = /node_modules/;
  } else {
    if (css.cssModules) {
      modules = {
        localIdentName: '[local]_[hash:base64:8]',
      };
    }
    exclude = /node_modules/;
  }
  return {
    exclude,
    include,
    test: /\.css|less$/,
    use: [
      !isServer && {
        loader: require.resolve('extracted-loader'),
      },
      !isServer && {
        loader: MiniCssExtractPlugin.loader,
      },
      {
        loader: require.resolve('css-loader'),
        options: {
          modules,
          importLoaders: 1,
          onlyLocals: isServer,
        },
      },
      {
        loader: require.resolve('postcss-loader'),
        options: {
          // Necessary for external CSS imports to work
          // https://github.com/facebookincubator/create-react-app/issues/2677
          ident: 'postcss',
          plugins: () => [
            require('postcss-flexbugs-fixes'),
            autoprefixer({
              overrideBrowserslist: [
                '>1%',
                'last 4 versions',
                'Firefox ESR',
                'not ie < 9', // React doesn't support IE8 anyway
              ],
              flexbox: 'no-2009',
            } as any),
          ],
        },
      },
      {
        loader: require.resolve('less-loader'),
        // options: {
        //   modifyVars: theme
        // }
      },
    ].filter(Boolean),
  };
};
