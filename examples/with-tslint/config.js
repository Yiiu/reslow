const tslintPlugins = require('../../plugins/tslint/build').default

module.exports = {
  plugins: [tslintPlugins()]
}
