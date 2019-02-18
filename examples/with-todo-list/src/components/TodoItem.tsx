import * as React from 'react'
import classNames from 'classnames'
import { observer } from 'mobx-react';
import { observable } from 'mobx';

import TodoModel from 'src/models/todoModel';
import { ENTER_KEY, ESCAPE_KEY } from 'src/constants';

export interface ITodoItemProps {
  todo: TodoModel
}

@observer
export default class TodoItem extends React.Component<ITodoItemProps> {
  @observable editText = ''
  @observable todoBeingEdited?: TodoModel = undefined
  get isBeingEdited() {
    return this.todoBeingEdited === this.props.todo
  }

  handleEdit = () => {
    const todo = this.props.todo;
    this.todoBeingEdited = todo
    this.editText = todo.title;
    (this.refs.editField as HTMLInputElement).focus();
    console.log(this.refs.editField)
  }
  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.editText = e.target.value.trim()
  }
  handleSubmit = (e?: React.ChangeEvent<HTMLInputElement>) => {
    if (this.editText) {
      this.props.todo.setTitle(this.editText)
    }
    this.todoBeingEdited = undefined
  }
  handleKeyDown = (event : React.KeyboardEvent) => {
    if (event.keyCode === ENTER_KEY) {
      this.handleSubmit();
    } else if (event.keyCode === ESCAPE_KEY) {
      this.editText = ''
      this.todoBeingEdited = undefined
    }
  }
  render() {
    const { todo } = this.props;
    return (
      <li className={classNames({
        completed: todo.completed,
        editing: this.isBeingEdited
      })}>
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={todo.completed}
            onChange={() => todo.toggle()}
          />
          <label onDoubleClick={this.handleEdit}>
            {todo.title}
          </label>
          <button className="destroy" onClick={() => todo.remove()} />
        </div>
        <input
          ref="editField"
          className="edit"
          value={this.editText}
          onBlur={this.handleSubmit}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
        />
      </li>
    )
  }
}
