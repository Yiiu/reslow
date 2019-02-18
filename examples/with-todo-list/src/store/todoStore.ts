/// <reference path="../interfaces.d.ts"/>

import { observable, action, computed, IObservableArray } from 'mobx'
import TodoModel from 'src/models/todoModel';
import { uuid } from 'src/utils';

export class TodoStore {
  @observable todos = ([] as any) as IObservableArray<TodoModel>

  get activeTodo() {
    return this.todos.filter(todo => !todo.completed)
  }

  get completedTodo() {
    return this.todos.filter(todo => todo.completed)
  }

  @action addTodo = (title: string) => {
    this.todos.push(new TodoModel(this, uuid(), title, false));
  }
  @action clearCompleted = () => {
    this.todos = this.todos.filter(
      todo => !todo.completed
    ) as IObservableArray<TodoModel>;
  }
  @action toggleAll = (checked : boolean) => {
    this.todos.forEach(
      todo => todo.toggle(checked)
    );
  }
}

export default new TodoStore()
