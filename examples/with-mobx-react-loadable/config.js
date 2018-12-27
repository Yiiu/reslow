const tslintPlugin = require('@reslow/plugin-tslint').default;

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
  plugins: [
    tslintPlugin()
  ]
}
