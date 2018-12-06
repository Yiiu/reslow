module.exports = {
  proxy: {
    '/users': {
      target: 'http://jsonplaceholder.typicode.com/users/',
      pathRewrite: {'^/users': '/'},
      changeOrigin: true
    }
  }
}