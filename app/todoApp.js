// Based on: https://github.com/tastejs/todomvc/blob/gh-pages/examples/react/js/app.jsx

import React, { Component } from 'react';
import {
  ReactiveBase,
  DataController,
  ResultList,
  TextField,
  ToggleButton,
} from '@appbaseio/reactivesearch';

import TodoItem from './todoItem';
import TodoFooter from './todoFooter';

import './style.scss';

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
    // let router = Router({
    //   '/': () => {debugger},
    //   '/active': () => {debugger},
    //   '/completed': () => {debugger}
    // })
    let router = Router({
      '/': setState.bind(this, {nowShowing: ALL_TODOS}),
      '/active': setState.bind(this, {nowShowing: ACTIVE_TODOS}),
      '/completed': setState.bind(this, {nowShowing: COMPLETED_TODOS})
    });
    router.init('/')
  }

  handleChange (newTodo) {
    this.setState({ newTodo: newTodo })
  }

  handleNewTodoKeyDown (event) {
    if (event.keyCode !== ENTER_KEY) {
      return
    }
    console.log('handleNewTodoKeyDown:', this.state.newTodo);
    event.preventDefault();
    const val = this.state.newTodo.trim();
    if (val) {
      console.log('addTodo');
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
    console.log('saving', text, todoToSave);
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

  onData(todo) {
    console.log('onData: ', todo);
		const result = {
			desc: (
        <TodoItem
          key={todo.id}
          todo={{...todo}}
          onToggle={this.toggle.bind(this, todo)}
          onDestroy={this.destroy.bind(this, todo)}
          // onEdit={this.edit.bind(this, todo)}
          // editing={this.state.editing === todo.id}
          onSave={this.save.bind(this, todo)}
          onCancel={this.cancel.bind(this)}
        />
      ),
		};
		return result;
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
				app="todomvc_debug"
				credentials="FaGR2mgH8:913c77f0-8d2f-455b-9742-3b54717a529a"
        type="todo_reactjs"
			>
        <header className="header">
          <h1>todos</h1>
          <TextField
            componentId="NameTextSensor"
            dataField="name"
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
            <ResultList
              componentId="ResultList01"
              stream={false}
              react={{
                or: ["Filters"]
              }}
              scrollOnTarget={window}
              onData={this.onData}
              showResultStats={false}
              pagination={false}
            />
          </ul>
        </section>
        {footer}
      </ReactiveBase>
    )
  }
}

export default TodoApp;
