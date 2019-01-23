<%_ if (framework === 'koa') { _%>
import Koa from 'koa';
import serve from 'koa-static';
import mount from 'koa-mount';
import helmet from 'koa-helmet';
import Router from 'koa-router';
<%_ } else if (framework === 'express') { _%>
import * as express from 'express';
<%_ } _%>

let serverRender = require('./serverRender.tsx').default;

<%_ if (framework === 'koa') { _%>
const router = new Router();
<%_ } else if (framework === 'express') { _%>
const app = express.default();
<%_ } _%>

if (module.hot) {
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

<%_ if (framework === 'koa') { _%>
const app = new Koa();
app
  .use(helmet())
  .use(mount('/public', serve(process.env.APP_PUBLIC_DIR!)))
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(process.env.PORT);
<%_ } else if (framework === 'express') { _%>
app.listen(process.env.PORT!, process.env.HOST!, (err: any) => {
  if (err) {
    console.error(err);
  } else {
    console.info(`\n\n 💂  Listening at http://${process.env.HOST}:${process.env.PORT}\n`);
  }
});
app.use('/public', express.static(process.env.APP_PUBLIC_DIR!));
app.get('*', async (req: express.Request, res: express.Response) => {
  res.send(await serverRender(req));
});
<%_ } _%>
