module.exports = {
  proxy: {
    '/api': {
      target: 'https://swapi.co/api/',
      pathRewrite: {'^/api': '/'},
      changeOrigin: true
    }
  }
}