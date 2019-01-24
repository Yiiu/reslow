module.exports = {
  ssr: false,
  <%_ if (!isTypescript) { _%>
  clientIndexJs: './src/index.tsx'
  <%_ } else { _%>
  clientIndexJs: './src/index.js'
  <%_ } _%>
}
