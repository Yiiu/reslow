/// <reference path="../interfaces.d.ts"/>

import * as React from 'react'
import TodoItem from './TodoItem';
import TodoModel from 'src/models/todoModel';
import { observer } from 'mobx-react';

export interface ITodoListProps {
  todos: TodoModel[]
}

@observer
export default class TodoList extends React.Component<ITodoListProps> {
  render() {
    return (
      <ul className="todo-list">
        {
          this.props.todos.map(todo => (
            <TodoItem key={todo.id} todo={todo} />
          ))
        }
      </ul>
    )
  }
}
