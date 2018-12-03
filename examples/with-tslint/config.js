module.exports = {
  chainWebpack(_, config) {
    config.module
      .rule('tslint')
        .test(/\.tsx?$/)
        .pre()
        .exclude
          .add(/node_modules/)
          .end()
        .use('tslint')
          .loader('tslint-loader')
          .options({
            emitErrors: true,
          });
  }
}