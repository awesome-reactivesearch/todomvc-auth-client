// Based on: https://github.com/tastejs/todomvc/blob/gh-pages/examples/react/js/app.jsx

import React, { Component } from 'react';
import {
  ReactiveBase,
  ReactiveList,
  TextField,
  ToggleButton,
} from '@appbaseio/reactivesearch';

import TodoItem from './todoItem';
import TodoFooter from './todoFooter';

import './todomvc.scss';

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;
const ALL_TODOS = 'all';
const ACTIVE_TODOS = 'active';
const COMPLETED_TODOS = 'completed';

class TodoApp extends Component {
  constructor (props) {
    super(props);
    this.state = {
      nowShowing: ALL_TODOS,
      editing: null,
      newTodo: ''
    }
    this.onData = this.onData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.clearCompleted = this.clearCompleted.bind(this);
  }

  componentDidMount () {
    let setState = this.setState;
    let router = Router({
      '/': setState.bind(this, {nowShowing: ALL_TODOS}),
      '/active': setState.bind(this, {nowShowing: ACTIVE_TODOS}),
      '/completed': setState.bind(this, {nowShowing: COMPLETED_TODOS})
    });
    router.init('/')
  }

  handleChange (newTodo) {
    this.setState({ newTodo })
  }

  handleNewTodoKeyDown (event) {
    if (event.keyCode !== ENTER_KEY) {
      return
    }
    event.preventDefault();
    const val = this.state.newTodo.trim();
    if (val) {
      this.props.model.addTodo(val);
      this.setState({newTodo: ''})
    }
  }

  toggleAll (event) {
    let checked = event.target.checked;
    this.props.model.toggleAll(checked)
  }

  toggle (todoToToggle) {
    this.props.model.toggle(todoToToggle)
  }

  destroy (todo) {
    this.props.model.destroy(todo)
  }

  edit (todo) {
    // this.setState({editing: todo.id})
  }

  save (todoToSave, text) {
    this.props.model.save(todoToSave, text);
    // this.setState({editing: null})
  }

  cancel () {
    // this.setState({editing: null})
  }

  clearCompleted () {
    this.props.model.clearCompleted()
  }

  customQuery(value) {
		return {
			query: {
				match_all: {}
			}
		};
	}

  onData(data) {
    console.log('onData: ', data);
    let todo = data._source;
			return (
        <TodoItem
          key={todo.id}
          todo={{...todo}}
          onToggle={this.toggle.bind(this, todo)}
          onDestroy={this.destroy.bind(this, todo)}
          onSave={this.save.bind(this, todo)}
        />
      );
	}

  render () {
    let footer,
        main,
        todos = this.props.model.todos;
    // let shownTodos = todos.filter((todo) => {
    //   switch (this.state.nowShowing) {
    //     case ACTIVE_TODOS:
    //       return !todo.completed;
    //     case COMPLETED_TODOS:
    //       return todo.completed;
    //     default:
    //       return true
    //   }
    // }, this);
    //
    // let todoItems = shownTodos.map((todo) => {
    //   return (
    //     <TodoItem
    //       key={todo.id}
    //       todo={{...todo}}
    //       onToggle={this.toggle.bind(this, todo)}
    //       onDestroy={this.destroy.bind(this, todo)}
    //       onEdit={this.edit.bind(this, todo)}
    //       editing={this.state.editing === todo.id}
    //       onSave={this.save.bind(this, todo)}
    //       onCancel={this.cancel.bind(this)}
    //     />
    //   )
    // }, this);
    //

    let activeTodoCount = todos.reduce((accum, todo) => {
      return todo.completed ? accum : accum + 1
    }, 0);

    let completedCount = todos.length - activeTodoCount;

    if (activeTodoCount || completedCount) {
      footer =
        <TodoFooter
          count={activeTodoCount}
          completedCount={completedCount}
          nowShowing={this.state.nowShowing}
          onClearCompleted={this.clearCompleted.bind(this)}
        />
    }

    return (
      <ReactiveBase
				app="todomvc"
				credentials="kDoV3s5Xk:4994cac6-00a3-4179-b159-b0adbfdde34b"
        type="todo_reactjs"
			>
        <header className="header">
          <h1>todos</h1>
          <TextField
            componentId="NewTodoSensor"
            dataField="title"
            className="new-todo-container"
            placeholder="What needs to be done?"
            onKeyDown={this.handleNewTodoKeyDown.bind(this)}
            onValueChange={this.handleChange.bind(this)}
            defaultSelected={this.state.newTodo}
          />
        </header>

        <section className="main">
          <input
            className="toggle-all"
            type="checkbox"
            onChange={this.toggleAll.bind(this)}
            checked={activeTodoCount === 0}
          />
          <ul className="todo-list">
            <ReactiveList
              stream={true}
              react={{
                or: ["FiltersSensor"]
              }}
              scrollOnTarget={window}
              showResultStats={false}
              pagination={false}
              onData={this.onData}
            />
          </ul>
        </section>
        {footer}
      </ReactiveBase>
    )
  }
}

export default TodoApp;
