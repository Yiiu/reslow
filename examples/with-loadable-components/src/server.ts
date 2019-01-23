import Koa from 'koa';
import serve from 'koa-static';
import mount from 'koa-mount';
import helmet from 'koa-helmet';
import Router from 'koa-router';

let serverRender = require('./serverRender.tsx').default;

const router = new Router();

if (module.hot) {
  module.hot.accept(() => {
    console.log('🔁  HMR Reloading');
  });
  module.hot.accept('./serverRender', () => {
    console.log('🔁  HMR Reloading `./serverRender`...');
    try {
      serverRender = require('./serverRender.tsx').default;
    } catch (error) {
      console.error(error);
    }
  });
  console.info('✅  Server-side HMR Enabled!');
}

router
  .get('/*', async (ctx) => {
    ctx.body = await serverRender(ctx);
  })

const app = new Koa();
app
  .use(helmet())
  .use(mount('/public', serve(process.env.APP_PUBLIC_DIR!)))
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(process.env.PORT);
