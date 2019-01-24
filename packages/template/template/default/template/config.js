module.exports = {
  <%_ if (!isTypescript) { _%>
  noTs: true,
  serverIndexJs: './src/server.js',
  clientIndexJs: './src/app/index.jsx'
  <%_ } _%>
}
