module.exports = {
  plugins: [
    (_, webpackConfig) => {
      webpackConfig.module.rules.unshift({
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'tslint-loader',
        enforce: 'pre',
        options: {
          emitErrors: true,
        }
      });
      return webpackConfig;
    }
  ]
}