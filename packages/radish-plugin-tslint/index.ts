
export default (webpackConfig: any) => {
  webpackConfig.module.rules.unshift({
    test: /\.tsx?$/,
    exclude: /node_modules/,
    loader: 'tslint-loader',
    enforce: 'pre'
  });
  return webpackConfig;
};
