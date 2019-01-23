import React, { Component } from 'react';
import loadable from '@loadable/component'
import { Router, Link, RouteComponentProps } from '@reach/router'

const Home = loadable(() => import('./Home'))
const Info = loadable(() => import('./Info'))

const No: React.SFC<RouteComponentProps> = () => (
  <h1>404</h1>
)

export default class App extends Component {
  public render() {
    return (
      <>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/info">Info</Link>
        </nav>
        <Router>
          <No default/>
          <Home path="/"/>
          <Info path="/info"/>
        </Router>
      </>
    );
  }
}
