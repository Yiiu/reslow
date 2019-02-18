import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { ENTER_KEY, ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from './constants';
import todoStore from './store/todoStore';
import { observable } from 'mobx';
import TodoFooter from './components/TodoFooter';
import TodoList from './components/TodoList';

@observer
export default class App extends Component {
  @observable value = ''
  @observable checked = false
  @observable nowShowing = ALL_TODOS

  get todos() {
    switch (this.nowShowing) {
      case ALL_TODOS:
        return todoStore.todos
  
      case ACTIVE_TODOS:
        return todoStore.activeTodo
  
      case COMPLETED_TODOS:
        return todoStore.completedTodo
  
      default:
        return todoStore.todos
    }
  }

  handleNewTodoKeyDown = (event : React.KeyboardEvent) => {
    if (event.keyCode !== ENTER_KEY || this.value === '') {
      return;
    }
    event.preventDefault();
    todoStore.addTodo(this.value)
    this.value = ''
  }

  onCheckedChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.checked = event.target.checked
    todoStore.toggleAll(this.checked)
  }
  
  mainRender = () => {
    if (todoStore.todos.length) {
      return (
        <section className="main">
          <input
            id="toggle-all"
            className="toggle-all"
            type="checkbox"
            checked={this.checked}
            onChange={this.onCheckedChanged}
          />
          <label
            htmlFor="toggle-all"
          >
            Mark all as complete
          </label>
          <TodoList todos={this.todos} />
        </section>
      )
    } else {
      return null
    }
  }
  render() {
    return (
      <div>
        <header className="header">
          <h1>todos</h1>
          <input
            value={this.value}
            ref="newField"
            className="new-todo"
            placeholder="What needs to be done?"
            onKeyDown={this.handleNewTodoKeyDown }
            autoFocus={true}
            onChange={e => this.value = e.target.value}
          />
        </header>
        {this.mainRender()}
        {
          todoStore.todos.length > 0 &&
          <TodoFooter
            todoStore={todoStore}
            nowShowing={this.nowShowing}
            onShowingChanged={value => this.nowShowing = value}
          />
        }
      </div>
    );
  }
}
