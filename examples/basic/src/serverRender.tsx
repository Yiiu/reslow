import * as path from 'path';
import * as fs from 'fs';
// import * as requireFromString from 'require-from-string';
// import * as WebpackHotMiddleware from 'webpack-hot-middleware';

import * as React from 'react';
import App from './app/App';
import { renderToString } from 'react-dom/server';


export default async (req: any) => {
  const markup = renderToString(<App />);
  const assets = JSON.parse(
    fs.readFileSync(path.join(process.env.APP_PUBLIC_DIR as any, 'asset-manifest.json')).toString()
  );
  return `
    <!doctype html>
    <html lang="">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charSet='utf-8' />
        <title>Welcome to Radish</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${
          assets['main.css']
            ? `<link rel="stylesheet" href="${assets['main.css']}">`
            : ''
        } 
    </head>
    <body>
        <div id="root">${markup}</div>
        <script src="${assets['vendor.js']}" defer></script>
        <script src="${assets['main.js']}" defer></script>
    </body>
    </html>
  `;
};
