
import * as express from 'express';
import * as path from 'path';
import * as fs from 'fs';
import Backend from 'i18next-node-fs-backend';
import i18nextMiddleware from 'i18next-express-middleware';

import i18n from './i18n';

let serverRender = require('./serverRender.tsx').default;

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath: string) => path.resolve(appDirectory, relativePath);
const appSrc = resolveApp('src');

const app = express.default();

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

app.listen(process.env.PORT as any, process.env.HOST as any, (err: any) => {
  if (err) {
    console.error(err);
  } else {
    console.info(`\n\n 💂  Listening at http://${process.env.HOST}:${process.env.PORT}\n`);
  }
});

i18n
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init(
    {
      backend: {
        loadPath: `${appSrc}/locales/{{lng}}/{{ns}}.json`,
        addPath: `${appSrc}/locales/{{lng}}/{{ns}}.missing.json`,
      },
      detection: {
        order: ['querystring', 'cookie'],
        caches: ['cookie']
      },
    },
    () => {
      app.use(i18nextMiddleware.handle(i18n));
      app.use('/public', express.static(process.env.APP_PUBLIC_DIR as any));
      app.use('/locales', express.static(`${appSrc}/locales`));
      app.get('*', async (req: express.Request, res: express.Response) => {
        res.send(await serverRender(req, (req as any).i18n as i18n.i18n));
      });
    }
  )

