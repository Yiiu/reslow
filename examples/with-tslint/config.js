const tslintPlugins = require('../../packages/radish-plugin-tslint/build').default

module.exports = {
  plugins: [tslintPlugins()]
}
