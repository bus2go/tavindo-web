import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { Provider } from 'react-redux';
import $ from 'jquery';

import Main from './pages/main.js';
import Home from './pages/home.js';
import Login from './pages/login.js';
import Users from './pages/users.js';

import store from './utils/store';

$(document).ready(function() {
  ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={Main}>
        <IndexRoute component={Home} />
        <Route path="/home" component={Home} />
        <Route path="/users" component={Users} />
        <Route path="/login" component={Login} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app'));
});