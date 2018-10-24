
import * as fs from 'fs';

import * as express from 'express';
import * as path from 'path';
import * as Loadable from 'react-loadable';
import * as favicon from 'serve-favicon';

let serverRender = require('./serverRender').default;

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath: string) => path.resolve(appDirectory, relativePath);

const app = express();

if ((module as any).hot) {
  (module as any).hot.accept(() => {
    console.log('🔁  HMR Reloading...');
  });
  (module as any).hot.accept('./serverRender', () => {
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
  app.listen(process.env.PORT as any, process.env.HOST as any, (err: any) => {
    if (err) {
      console.error(err);
    } else {
      console.info(`\n\n 💂  Listening at http://${process.env.HOST}:${process.env.PORT}\n`);
    }
  });
});

app.use(favicon(path.join(resolveApp('public/favicon.ico'))));
app.use('/public', express.static(resolveApp('__server')));
app.get('/service-worker.js', (req, res) => {
  res.set({ 'Content-Type': 'application/javascript; charset=utf-8' });
  res.send(fs.readFileSync(resolveApp('__server/service-worker.js')));
});
app.get('*', async (req, res) => {
  res.send(await serverRender(req));
});
