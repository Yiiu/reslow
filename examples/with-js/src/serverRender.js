import fs from 'fs';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './app/App';

export default async (req) => {
  const markup = renderToString(<App />);
  const assets = JSON.parse(
    fs.readFileSync(path.join(process.env.APP_PUBLIC_DIR, 'asset-manifest.json')).toString()
  );
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
    </body>
    </html>
  `;
};
