import {observable, action, autorun} from 'mobx';
import { TodoStore } from 'src/store/todoStore';


export default class TodoModel {
	store: TodoStore;
	id: string;
	@observable title: string;
  @observable completed: boolean;
  constructor(store: TodoStore, id: string, title: string, completed: boolean) {
    this.store = store
    this.id = id
    this.title = title
    this.completed = completed
  }
  @action
  toggle = (completed?: boolean) => {
    if (completed !== undefined) {
      this.completed = completed
    } else {
      this.completed = !this.completed
    }
  }
  @action
  remove = () => {
    this.store.todos.remove(this)
  }
  @action
  setTitle = (title: string) => {
    this.title = title
  }
}
