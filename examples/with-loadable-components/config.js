const LoadablePlugin = require('@loadable/webpack-plugin')

module.exports = {
  chainWebpack: ({ isServer }, config) => {
    if (!isServer) {
      config
        .plugin('loadable-components')
        .use(LoadablePlugin, [{
          // outputAsset: false,
        }])
    }
  }
}
