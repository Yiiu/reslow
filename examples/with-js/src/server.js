
import express from 'express';

let serverRender = require('./serverRender.js').default;

const app = express();

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

app.listen(process.env.PORT, process.env.HOST, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.info(`\n\n 💂  Listening at http://${process.env.HOST}:${process.env.PORT}\n`);
  }
});
app.use('/public', express.static(process.env.APP_PUBLIC_DIR));
app.get('*', async (req, res) => {
  res.send(await serverRender(req));
});
