
export default (config: any = {}) => {
  return (_: any, webpackConfig: any) => {
    webpackConfig.module.rules.unshift({
      test: /\.tsx?$/,
      exclude: /node_modules/,
      loader: 'tslint-loader',
      enforce: 'pre',
      options: {
        emitErrors: true,
        formattersDirectory: 'node_modules/custom-tslint-formatters/formatters',
        formatter: 'grouped',
        ...config.options
      }
    });
    webpackConfig.tslint = {
      formattersDirectory: 'node_modules/custom-tslint-formatters/formatters',
      formatter: 'grouped'
    }
    return webpackConfig;
  }
};
