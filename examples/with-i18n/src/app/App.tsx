import React, { Component } from 'react';
import { Trans, withNamespaces, I18nContextValues } from 'react-i18next';

import style from './App.css';
import logo from './logo.svg';
import i18n from 'src/i18n';

export interface IProps extends I18nContextValues {}

class App extends Component<IProps> {
  public render() {
    const changeLanguage = (lng: string) => {
      i18n.changeLanguage(lng);
    }
    return (
      <div className={style.App}>
        <header className={style['App-header']}>
          <img src={logo} className={style['App-logo']} alt="logo" />
          <p>
            <Trans i18nKey="message.reactGuide">
              Edit <code>src/App.tsx</code> and save to reload.
            </Trans>
          </p>
          {
            this.props.lng === 'en' ?
            <button onClick={() => changeLanguage('zh')}>zh</button> :
            <button onClick={() => changeLanguage('en')}>en</button>
          }
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
export default withNamespaces()(App as any);
