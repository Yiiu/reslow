import React, { Component } from 'react';
import { hot } from 'react-hot-loader/root';

import logo from './logo.svg';
import style from './App.css';

class App extends Component {
  render() {
    return (
      <div className={style.App}>
        <header className={style['App-header']}>
          <img src={logo} className={style['App-logo']} alt="logo" />
          <p>
            Editss <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className={style['App-link']}
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default hot(App);
