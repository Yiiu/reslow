export default {
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 8001,
  build: '__server',
  clientBuild: '__server/client'
};
