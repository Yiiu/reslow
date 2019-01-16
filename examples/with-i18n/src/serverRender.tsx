import * as fs from 'fs';
import * as path from 'path';
import { I18nextProvider } from 'react-i18next';
import * as React from 'react';
// import * as requireFromString from 'require-from-string';
// import * as WebpackHotMiddleware from 'webpack-hot-middleware';

import { renderToString } from 'react-dom/server';
import App from './app/App';
import i18n from 'i18next';

export default async (req: any, i18n: i18n.i18n) => {
  const markup = renderToString(
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  );
  const assets = JSON.parse(
    fs.readFileSync(path.join(process.env.APP_PUBLIC_DIR as any, 'asset-manifest.json')).toString()
  );
  const initialI18nStore = {};
  i18n.languages.forEach(l => {
    initialI18nStore[l] = req.i18n.services.resourceStore.data[l];
  });
  const initialLanguage = req.i18n.language;
  return `
    <!doctype html>
    <html lang="">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charSet='utf-8' />
        <title>Welcome to Razzle</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${
          assets['main.css']
            ? `<link rel="stylesheet" href="${assets['main.css']}">`
            : ''
        }
    </head>
    <body>
        <div id="root">${markup}</div>
        <script src="${assets['vendor.js']}" defer crossorigin></script>
        <script src="${assets['main.js']}" defer crossorigin></script>
        <script>
          window.initialI18nStore = JSON.parse('${JSON.stringify(initialI18nStore)}');
          window.initialLanguage = '${initialLanguage}';
        </script>
    </body>
    </html>
  `;
};
