// import { createBrowserHistory } from 'history';

import {
  COUNT_ROUTER,
  // STORE_ROUTER
} from '@constants/stores';

import { CountStore } from './CountStore';
// import { RouterStore } from './RouterStore';

export const createStore = () => {
  // const history = createBrowserHistory();

  // const routerStore = new RouterStore(history);
  const countStore = new CountStore();

  return {
    // [STORE_ROUTER]: routerStore,
    [COUNT_ROUTER]: countStore
  };
};

export interface IStores {
  // [STORE_ROUTER]: RouterStore;
  [COUNT_ROUTER]: CountStore;
}

export {
  // RouterStore,
  CountStore
};
