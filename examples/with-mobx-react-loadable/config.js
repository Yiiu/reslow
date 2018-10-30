module.exports = {
  serverIndexJs: './src/server.ts',
  clientIndexJs: './src/app/index.tsx',
  // plugins: [
  //   'tslint'
  // ],
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loader: 'tslint-loader',
          enforce: 'pre'
        }
      ]
    }
  }
}