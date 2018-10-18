// import * as fs from 'fs';
// import * as requireFromString from 'require-from-string';
// import * as WebpackHotMiddleware from 'webpack-hot-middleware';

import * as React from 'react';
import App from './app/App';
import { renderToString } from 'react-dom/server';

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
    </head>
    <body>
        <div id="root">${markup}</div>    
        <script src="${assets['main.js']}" defer crossorigin></script>
    </body>
    </html>
  `;
};
