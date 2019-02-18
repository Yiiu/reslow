import React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react';

import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from "../constants";
import { TodoStore } from 'src/store/todoStore';

interface ITodoFooterProps {
  nowShowing: string;
  todoStore: TodoStore
  onShowingChanged(value: string): void
}

@observer
export default class TodoFooter extends React.Component<ITodoFooterProps> {
  renderFilterLink(filterName: string, url: string, caption: string) {
    return (<li>
      <a
        onClick={e => {
          e.preventDefault()
          this.props.onShowingChanged(filterName)
        }}
        className={classNames({selected: this.props.nowShowing === filterName})}
      >
        {caption}
      </a>
    </li>)
  }
  render() {
    var clearButton = null;

    if (this.props.todoStore.completedTodo.length > 0) {
      clearButton = (
        <button
          className="clear-completed"
          onClick={this.props.todoStore.clearCompleted}
        >
          Clear completed
        </button>
      );
    }

    const nowShowing = this.props.nowShowing;
    return (
      <footer className="footer">
        <span className="todo-count">
          <strong>
            {this.props.todoStore.activeTodo.length}
          </strong> {this.props.todoStore.activeTodo.length > 1 ? 'items' : 'item'} left
        </span>
        <ul className="filters">
          {this.renderFilterLink(ALL_TODOS, "", "All")}
          {this.renderFilterLink(ACTIVE_TODOS, "active", "Active")}
          {this.renderFilterLink(COMPLETED_TODOS, "completed", "Completed")}
        </ul>
        {clearButton}
      </footer>
    );
  }
}
