
export default (config: any = {}) => {
  return (_: any, webpackConfig: any) => {
    webpackConfig.module.rules.unshift({
      test: /\.tsx?$/,
      exclude: /node_modules/,
      loader: 'tslint-loader',
      enforce: 'pre',
      options: {
        emitErrors: true,
        ...config.options
      }
    });
    return webpackConfig;
  }
};
