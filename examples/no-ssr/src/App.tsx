import React, { Component } from 'react';
import style from './main.css';
import logo from './logo.svg';

export default class App extends Component {
  public render() {
    return (
      <div className={style.App}>
        <header className={style['App-header']}>
          <img src={logo} className={style['App-logo']} alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className={style['App-link']}
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* {a} */}
            Learn React
          </a>
        </header>
      </div>
    );
  }
}
