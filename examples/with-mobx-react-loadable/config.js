module.exports = {
  serverIndexJs: './src/server.ts',
  clientIndexJs: './src/app/index.tsx',
  // plugins: [
  //   'tslint'
  // ],
  chainWebpack(_, config) {
    config.module
      .rule('tslint')
      .test(/\.tsx?$/)
      .pre()
      .exclude
        .add(/node_modules/)
        .end()
      .use('tslint-loader')
        .loader('tslint-loader')
        .end()
  }
}