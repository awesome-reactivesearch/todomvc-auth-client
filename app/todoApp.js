// Based on: https://github.com/tastejs/todomvc/blob/gh-pages/examples/react/js/app.jsx

import React, { Component } from "react";
import {
  ReactiveBase,
  ReactiveList,
  TextField,
  ToggleButton
} from "@appbaseio/reactivesearch";

import Utils from "./utils";
import TodoItem from "./todoItem";
import TodoFooter from "./todoFooter";

import "./todomvc.scss";
import "./style.scss";

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;
const ALL_TODOS = "all";
const ACTIVE_TODOS = "active";
const COMPLETED_TODOS = "completed";

class TodoApp extends Component {
  constructor (props) {
    super(props);
    this.state = {
      nowShowing: ALL_TODOS,
      editing: null,
      newTodo: ""
    }
    this.onAllData = this.onAllData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.clearCompleted = this.clearCompleted.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
  }

  handleChange (newTodo) {
    if (!this.props.auth.isAuthenticated()) {
      return;
    }
    this.setState({ newTodo })
  }

  handleToggle (e) {
    this.setState({
      nowShowing: e[0].value
    });
  }

  handleNewTodoKeyDown (event) {
    if (!this.props.auth.isAuthenticated()) {
      return;
    }
    if (event.keyCode !== ENTER_KEY) {
      return
    }
    event.preventDefault();
    const val = this.state.newTodo.trim();
    if (val) {
      this.props.model.addTodo(val);
      this.setState({newTodo: ""})
    }
  }

  toggleAll (event) {
    if (!this.props.auth.isAuthenticated()) {
      return;
    }
    let checked = event.target.checked;
    this.props.model.toggleAll(checked)
  }

  toggle (todoToToggle) {
    if (!this.props.auth.isAuthenticated()) {
      return;
    }
    this.props.model.toggle(todoToToggle)
  }

  destroy (todo) {
    if (!this.props.auth.isAuthenticated()) {
      return;
    }
    this.props.model.destroy(todo)
  }

  save (todoToSave, text) {
    if (!this.props.auth.isAuthenticated()) {
      return;
    }
    this.props.model.save(todoToSave, text);
  }

  clearCompleted () {
    if (!this.props.auth.isAuthenticated()) {
      return;
    }
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
    // merging all streaming and historic data
    let todosData = Utils.mergeTodos(data);

    if (this.state.nowShowing !== ALL_TODOS) {
      todosData = todosData.filter(({ _source: todo }) => todo.completed === (this.state.nowShowing === COMPLETED_TODOS));
    }

    // sorting todos based on creation time
    todosData = todosData.sort(function(a, b) {
      return a._source.createdAt - b._source.createdAt;
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
        handleToggle={this.handleToggle}
      />
    }
    const { auth } = this.props;

    return (
      // Please use your own credentials here
      <ReactiveBase
        app="todomvc-auth"
        credentials="pVPf3rRLj:61fd73c0-3660-44db-8309-77d9d35d64cc"
        type="todo_reactjs"
        >
          <header className="header">
            <h1>todos</h1>
            {
              auth.isAuthenticated() ?
                <p className="auth-text"><a className="auth-link" onClick={auth.logout}>logout</a></p> :
                <p className="auth-text">Please <a className="auth-link" onClick={auth.login}>login</a> to modify todos</p>
            }
            <TextField
              componentId="NewTodoSensor"
              dataField="title"
              className="new-todo-container"
              placeholder="What needs to be done?"
              onKeyDown={this.handleNewTodoKeyDown.bind(this)}
              onValueChange={this.handleChange.bind(this)}
              defaultSelected={this.state.newTodo}
              autoFocus={true}
            />
          </header>

          <section className="main">
            <input
              className="toggle-all"
              type="checkbox"
              onChange={this.toggleAll.bind(this)}
              checked={activeTodoCount === 0}
            />
            <ul className="todo-list" key={this.state.nowShowing}>
              <ReactiveList
                stream={true}
                react={{
                  or: ["FiltersSensor", this.state.nowShowing]
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
