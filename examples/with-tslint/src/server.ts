
import * as express from 'express';

let serverRender = require('./serverRender.tsx').default;

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
  console.log(process.env.APP_PUBLIC_DIR);
  console.info('✅  Server-side HMR Enabled!');
}

app.listen(process.env.PORT as any, process.env.HOST as any, (err: any) => {
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
