import React, { Component } from 'react';

class TodoButton extends Component {
    handleClick = () => {
        this.props.onClick(this.props.value);
    }

    render() {
        return (
            <button
                className={`btn rbc-btn ${this.props.active ? 'rbc-btn-active' : 'rbc-btn-inactive'}`}
                onClick={this.handleClick}
            >
                {this.props.label}
            </button>
        )
    }
}

export default TodoButton;
