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
    this.onAllData = this.onAllData.bind(this);
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

  save (todoToSave, text) {
    this.props.model.save(todoToSave, text);
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

  onAllData(data) {
    console.log('onAllData', data);

    let { mode, newData, currentData } = data;
    let todosData = [];

    // streaming data
    if (mode === 'streaming') {
      // todo is deleted
      if (newData && newData._deleted) {
        todosData = currentData.filter(data => data._id !== newData._id)
      } else {
        let _updated = false;
        todosData = currentData.map(data => {
          // todo is updated
          if (data._id === newData._id) {
            _updated = true;
            return newData;
          } else {
            return data;
          }
        })
        // todo is added
        if (!_updated) {
          todosData = currentData;
          todosData.push(newData);
        }
      }
    } else {
      // non-streaming data
      if (Array.isArray(newData) && newData.length > 0) {
        todosData = newData;
      }
    }

    // sorting todos based on creation time
    todosData = todosData.sort(function(a, b) {
      return a._source.createdAt > b._source.createdAt;
    });

    return todosData.map(({ _source: todo }) => {
      return (
        <TodoItem
          key={todo.id}
          todo={{...todo}}
          onToggle={this.toggle.bind(this, todo)}
          onDestroy={this.destroy.bind(this, todo)}
          onSave={this.save.bind(this, todo)}
        />
      );
    }, this);
  }

  render () {
    let footer,
    main,
    todos = this.props.model.todos;

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
                onAllData={this.onAllData}
              />
            </ul>
          </section>
          {footer}
        </ReactiveBase>
      )
    }
  }

  export default TodoApp;
