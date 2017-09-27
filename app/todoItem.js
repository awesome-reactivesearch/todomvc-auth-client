// Based on: https://github.com/tastejs/todomvc/blob/gh-pages/examples/react/js/todoItem.jsx

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import { TextField } from '@appbaseio/reactivesearch';

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;

class TodoItem extends Component {

  constructor (props) {
    super(props);
    this.state = {
      editText: '',
      editing: false,
      autoFocus: false
    }
  }

  handleBlur (event) {
    // console.log("blurr");
  }

  handleSubmit (event) {
    // console.log('handleSubmit', event);
    let val = this.state.editText.trim();
    if (val) {
      this.props.onSave(val);
      this.setState({
        editText: val,
        editing: false
      })
    } else {
      this.props.onDestroy()
    }
  }

  onBlur () {
    // console.log('onBlur');
    this.setState({
      editText: '',
      editing: false
    })
  }

  handleEdit () {
    this.setState({
      editText: this.props.todo.title,
      editing: true
    })
  }

  handleKeyDown (event) {
    if (event.which === ESCAPE_KEY) {
      this.setState({
        editText: this.props.todo.title,
        editing: false
      })
    } else if (event.which === ENTER_KEY) {
      this.handleSubmit(event)
    }
  }

  handleChange (value) {
    if (this.state.editing) {
      this.setState({ editText: value })
    }
  }

  getInitialState () {
    return {editText: this.props.todo.title}
  }

  /**
  * Safely manipulate the DOM after updating the state when invoking
  * `this.props.onEdit()` in the `handleEdit` method above.
  * For more info refer to notes at https://facebook.github.io/react/docs/component-api.html#setstate
  * and https://facebook.github.io/react/docs/component-specs.html#updating-componentdidupdate
  */
  componentDidUpdate (prevProps, prevState) {
    if (!prevState.editing && this.state.editing) {
      // console.log("Setting focus");
      this.setState({ autoFocus: true });
      // let node = ReactDOM.findDOMNode(this.refs.editField);
      // node.focus();
      // node.setSelectionRange(node.value.length, node.value.length)
    }
  }

  render () {
    // console.log("render: autoFocus state", this.state.autoFocus);
    return (
      <li className={classNames({
        completed: this.props.todo.completed,
        editing: this.state.editing
      })}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={this.props.todo.completed}
          onChange={this.props.onToggle}
        />
        <label onDoubleClick={this.handleEdit.bind(this)}>
          {this.props.todo.title}
        </label>
        <button className="destroy" onClick={this.props.onDestroy} />
      </div>
      <TextField
        autoFocus={this.state.autoFocus}
        componentId="EditSensor"
        dataField="name"
        className="edit-todo-container"
        defaultSelected={this.state.editText}
        onBlur={this.handleBlur.bind(this)}
        onKeyDown={this.handleKeyDown.bind(this)}
        onValueChange={this.handleChange.bind(this)}
      />
    </li>
  )
}
}

export default TodoItem;
