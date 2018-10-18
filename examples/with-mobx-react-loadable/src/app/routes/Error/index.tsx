import * as React from 'react';
import { Helmet } from 'react-helmet';

export default () => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>404</title>
      </Helmet>
      <div style={{ textAlign: 'center', fontSize: 42 }}>404</div>
    </div>
  );
};
