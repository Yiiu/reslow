module.exports = {
  serverIndexJs: './src/server.ts',
  clientIndexJs: './src/app/index.tsx',
  autoDll: {
    vendor: [
      'react',
      'react-dom',
      'react-router',
      'react-router-dom',
      'mobx',
      'mobx-react',
      'history'
    ]
  },
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
        .options({
          emitErrors: true,
        })
        .end()
  }
}
