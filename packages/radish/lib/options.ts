import paths from './config/paths';

export default {
  host: 'localhost',
  port: '3000',
  autoDll: {
    vendor: ['react-dom', 'react'],
    polyfills: []
  },
  clientIndexJs: paths.appClientIndexJs,
  serverIndexJs: paths.appServerIndexJs,
};
