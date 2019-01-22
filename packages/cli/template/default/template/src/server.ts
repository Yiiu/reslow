<% if (framework === 'koa') { %>import Koa from 'koa';
import serve from 'koa-static';
import mount from 'koa-mount';
import helmet from 'koa-helmet';
import Router from 'koa-router';
<% } else if (framework === 'express') { %>import * as express from 'express';
<% } %>
let serverRender = require('./serverRender.tsx').default;
<% if (framework === 'koa') { %>const router = new Router();
<% } else if (framework === 'express') { %>const app = express.default();
<% } %>
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

<% if (framework === 'koa') { %>const app = new Koa();
app
  .use(helmet())
  .use(mount('/public', serve(process.env.APP_PUBLIC_DIR!)))
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(process.env.PORT);
<% } else if (framework === 'express') { %>app.listen(process.env.PORT as any, process.env.HOST as any, (err: any) => {
  if (err) {
    console.error(err);
  } else {
    console.info(`\n\n 💂  Listening at http://${process.env.HOST}:${process.env.PORT}\n`);
  }
});
app.use('/public', express.static(process.env.APP_PUBLIC_DIR as any));
app.get('*', async (req: express.Request, res: express.Response) => {
  res.send(await serverRender(req));
});
<% } %>
