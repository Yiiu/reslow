import * as React from 'react';
import { Helmet } from 'react-helmet';

import '@styles/index.less';
export interface IHtmlProps {
  markup: string;
  js: string[];
  style: string[];
}

export default class Html extends React.PureComponent<IHtmlProps> {
  public render() {
    const { markup, js, style } = this.props;
    const helmet = Helmet.renderStatic();
    const htmlAttrs = helmet.htmlAttributes.toComponent();
    const bodyAttrs = helmet.bodyAttributes.toComponent();
    // const aaaa = require('/public/static/style/main.css')
    return (
      <html {...htmlAttrs}>
        <head>
          {helmet.title.toComponent()}
          {helmet.meta.toComponent()}
          {helmet.link.toComponent()}
          <link rel="stylesheet" type="text/css" href="/public/static/style/main.css" />
          {
            style.map(v => (
              <link key={v} rel="stylesheet" type="text/css" href={v} />
            ))
          }
        </head>
        <body {...bodyAttrs}>
          <div id="root" dangerouslySetInnerHTML={{__html: markup}} />
          {
            js.map(v => (
              <script key={v} src={v} />
            ))
          }
          <script src="/public/static/chunks/app.js" />
        </body>
      </html>
    );
  }
}
