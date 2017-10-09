import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Router } from 'react-router-dom';

import TodoModel from './todoModel';
import TodoApp from './todoApp';
import Callback from './Callback';
import Auth from './auth';
import history from './history';

const auth = new Auth();

const handleAuthentication = (nextState, replace) => {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    auth.handleAuthentication();
  }
}

let model = new TodoModel('react-todos');

let render = () => {
  ReactDOM.render(
    <Router history={history} component={TodoApp}>
      <div>
        <Route path="/" render={(props) => <TodoApp model={model} auth={auth} {...props} />} />
        <Route path="/callback" render={(props) => {
            handleAuthentication(props);
            return <Callback {...props} />
          }}
        />
      </div>
    </Router>,
    document.getElementsByClassName('todoapp')[0]
  )
};

model.subscribe(render);
render();
