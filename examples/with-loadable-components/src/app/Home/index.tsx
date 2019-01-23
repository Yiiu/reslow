import React, { Component } from 'react';
import { RouteComponentProps } from '@reach/router';

import style from './styles.css';
import logo from './logo.svg';

export default class Home extends Component<RouteComponentProps> {
  public render() {
    return (
      <div>
        <h2>Home</h2>
        <img src={logo} className={style['App-logo']} alt="logo" />
      </div>
    );
  }
}
