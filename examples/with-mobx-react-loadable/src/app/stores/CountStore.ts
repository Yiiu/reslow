import { observable } from 'mobx';

export class CountStore {
  @observable
  public count: number = 12322;

  public addCount = () => {
    this.count++;
  }

  public reduceCount = () => {
    this.count--;
  }
}
