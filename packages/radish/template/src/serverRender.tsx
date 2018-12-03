// import * as fs from 'fs';
// import * as requireFromString from 'require-from-string';
// import * as WebpackHotMiddleware from 'webpack-hot-middleware';

import * as React from 'react';
import { renderToString } from 'react-dom/server';
import App from './app/App';

const assets = require('../__server/asset-manifest.json');

export default async (req: any) => {
  const markup = renderToString(<App />);
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
        <script src="${assets['main.js']}" defer crossorigin></script>
    </body>
    </html>
  `;
};
