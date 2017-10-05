/***************************************************
 * Please note that I’m sharing the credential here.
 * Feel free to use it while you’re learning.
 * After that, use your own credential.
 * Doing so, others can have the same advantage and
 * learn as quick as you learned too.
 * Thanks in advance!!!
***************************************************/

// Based on: http://todomvc.com/examples/react/#/

import React from "react";
import ReactDOM from "react-dom";

import TodoModel from "./todoModel";
import TodoApp from "./todoApp";

let model = new TodoModel("react-todos");

let render = () => {
  ReactDOM.render(
    <TodoApp model={model}/>,
    document.getElementsByClassName("todoapp")[0]
  )
};

model.subscribe(render);
render();
