// Based on: https://github.com/tastejs/todomvc/blob/gh-pages/examples/react/js/todoModel.js

import Appbase from 'appbase-js';

import Utils from './utils';

const ES_TYPE = 'todo_reactjs';

class TodoModel {
  constructor (key) {
    this.key = key;
    this.todos = [];
    this.onChanges = [];
    this.appbaseRef = new Appbase({
      url: 'https://scalr.api.appbase.io',
      app: 'todomvc',
      credentials: 'kQSlRKaSv:a081eec0-b85f-4953-a3d0-c18f94b26de4'
    });

    this.appbaseRef.search({
      type: ES_TYPE,
      size: 1000,
      body: {
        query: {
          match_all: {}
        }
      }
    }).on('data', ({hits: {hits = []} = {}} = {}) => {
      this.todos = hits.map(({_source = {}} = {}) => _source);
      this.inform();
      console.log("search, match: ", hits)
    }).on('error', (error) => {
      console.log("caught a search error: ", error)
    });

    this.appbaseRef.searchStream({
      type: ES_TYPE,
      body: {
        query: {
          match_all: {}
        }
      }
    }).on('data', (stream) => {
      let {
        _deleted,
        _source
      } = stream;

      if (_deleted) {
        this.todos = this.todos.filter(function (candidate) {
          return candidate.id !== _source.id
        })
      } else if (_source) {
        const todo = this.todos.find(({id}) => id == _source.id);
        todo ? Object.assign(todo, _source) : this.todos.unshift(_source)
      }

      // this.todos = hits.map(({_source = {}} = {}) => _source)
      this.inform();
      console.log("searchStream, new match: ", stream)
    }).on('error', (error) => {
      console.log("caught a searchStream, error: ", error)
    })
  }

  subscribe (onChange) {
    this.onChanges.push(onChange)
  }

  inform () {
    // Utils.store(this.key, this.todos)
    // this.todos = [...this.todos]
    this.onChanges.forEach((cb) => { cb() })
  }

  addTodo (title) {
    const id = Utils.uuid();
    const jsonObject = {
      id,
      title,
      completed: false,
      createdAt: Date.now()
    };

    // optimistic logic
    this.todos = [jsonObject].concat(this.todos);
    this.inform();

    // broadcast all changes
    this.appbaseRef.index({
      type: ES_TYPE,
      id: id,
      body: jsonObject
    }).on('data', function(response) {
      console.log(response)
    }).on('error', function(error) {
      console.log(error)
    })
  }

  toggleAll (checked) {
    // Note: it's usually better to use immutable data structures since they're
    // easier to reason about and React works very well with them. That's why
    // we use map() and filter() everywhere instead of mutating the array or
    // todo items themselves.
    this.todos = this.todos.map((todo) => ({
      ...todo,
      completed: checked
    }));
    this.inform();

    // broadcast all changes
    this.todos.forEach((todo) => {
      this.appbaseRef.index({
        type: ES_TYPE,
        id: todo.id,
        body: todo
      })
    })
  }

  toggle (todoToToggle) {

    // optimistic logic
    this.todos = this.todos.map((todo) => {
      return todo !== todoToToggle ? todo : {
        ...todo,
        completed: !todo.completed
      }
    });
    this.inform();

    // broadcast all changes
    this.appbaseRef.index({
      type: ES_TYPE,
      id: todoToToggle.id,
      body: {
        ...todoToToggle,
        completed: !todoToToggle.completed
      }
    }).on('data', function(response) {
      console.log(response)
    }).on('error', function(error) {
      console.log(error)
    })
  };

  destroy (todo) {
    // optimistic logic
    this.todos = this.todos.filter((candidate) => {
      return candidate !== todo
    });
    this.inform();

    // broadcast all changes
    this.appbaseRef.delete({
      type: ES_TYPE,
      id: todo.id
    }).on('data', function(response) {
      console.log(response)
    }).on('error', function(error) {
      console.log(error)
    })
  }

  save (todoToSave, text) {
    // optimistic logic
    this.todos = this.todos.map((todo) => {
      return todo !== todoToSave ? todo : {
        ...todo,
        title: text
      }
    });
    this.inform();

    // broadcast all changes
    this.appbaseRef.index({
      type: ES_TYPE,
      id: todoToSave.id,
      body: {
        ...todoToSave,
        title: text
      }
    }).on('data', function(response) {
      console.log(response)
    }).on('error', function(error) {
      console.log(error)
    })
  }

  clearCompleted () {
    let completed = this.todos.filter((todo) => todo.completed);

    // optimistic logic
    this.todos = this.todos.filter((todo) => !todo.completed);
    this.inform();

    // broadcast all changes
    completed.forEach((todo) => {
      this.appbaseRef.delete({
        type: ES_TYPE,
        id: todo.id
      })
    })
  }
}

export default TodoModel;
