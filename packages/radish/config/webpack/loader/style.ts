import * as autoprefixer from 'autoprefixer';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';

export interface IStyleLoaderConfig {
  isServer: boolean;
}

export default ({
  isServer = false
}: IStyleLoaderConfig) => {
  return {
    test: /\.css|less$/,
    use: [
      !isServer && {
        loader: require.resolve('extracted-loader')
      },
      !isServer && {
        loader: MiniCssExtractPlugin.loader,
      },
      {
        loader: require.resolve(`css-loader${isServer ? '/locals' : ''}`),
        options: {
          importLoaders: 1,
          modules: true,
          localIdentName: '[local]_[hash:base64:8]'
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
              browsers: [
                '>1%',
                'last 4 versions',
                'Firefox ESR',
                'not ie < 9', // React doesn't support IE8 anyway
              ],
              flexbox: 'no-2009',
            }),
          ],
        },
      },
      {
        loader: require.resolve('less-loader'),
        // options: {
        //   modifyVars: theme
        // }
      }
    ].filter(Boolean)
  };
};
