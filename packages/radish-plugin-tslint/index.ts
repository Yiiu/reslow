export default (webpackConfig) => {
  webpackConfig.module.rules.ushift({
    test: /\.tsx?$/,
    exclude: /node_modules/,
    loader: 'tslint-loader',
    enforce: 'pre'
  })
  return webpackConfig;
}