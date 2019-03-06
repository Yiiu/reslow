import * as fs from 'fs';
import * as path from 'path';
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { ServerLocation } from '@reach/router'
import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server'

import App from './app/App';

export default async (ctx: any) => {
  const manifest = JSON.parse(
    fs.readFileSync(path.join(process.env.APP_PUBLIC_DIR as any, 'asset-manifest.json')).toString()
  );
  const stats = JSON.parse(
    fs.readFileSync(path.join(process.env.APP_PUBLIC_DIR as any, 'loadable-stats.json')).toString()
  );
  const extractor = new ChunkExtractor({
    stats
  })
  const markup = renderToString(
    <ChunkExtractorManager extractor={extractor}>
      <ServerLocation url={ctx.request.url}>
        <App />
      </ServerLocation>
    </ChunkExtractorManager>
  );
  return `
    <!doctype html>
    <html lang="">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charSet='utf-8' />
        <title>Welcome to React</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${extractor.getLinkTags()}
        ${extractor.getStyleTags()}
    </head>
    <body>
        <div id="root">${markup}</div>
        <script async="" data-chunk="main" src="${manifest['vendor.js']}"></script>
        ${extractor.getScriptTags()}
    </body>
    </html>
  `;
};
