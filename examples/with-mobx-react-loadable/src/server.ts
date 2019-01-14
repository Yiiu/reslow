
import * as express from 'express';
import * as http from 'http';
import * as path from 'path';
import * as Loadable from 'react-loadable';
import * as favicon from 'serve-favicon';

let serverRender = require('./serverRender').default;

const app = express();

const httpServer = http.createServer(app);

if (module.hot) {
  module.hot.accept(() => {
    console.log('🔁  HMR Reloading...');
  });
  module.hot.accept('./serverRender', () => {
    console.log('🔁  HMR Reloading `./serverRender`...');
    try {
      serverRender = require('./serverRender').default;
    } catch (error) {
      console.error(error);
    }
  });
  console.info('✅  Server-side HMR Enabled!');
}

Loadable.preloadAll().then(() => {
  httpServer.listen(process.env.PORT as any, process.env.HOST as any, (err: any) => {
    if (err) {
      console.error(err);
    } else {
      console.info(`\n\n 💂 Listening at http://${process.env.HOST}:${process.env.PORT}\n`);
    }
  });
});

app.use(favicon(path.join(process.env.APP_PUBLIC_DIR as any, '/favicon.ico')));
app.use('/public', express.static(process.env.APP_PUBLIC_DIR as any));
app.get('*', async (req, res) => {
  res.send(await serverRender(req));
});
