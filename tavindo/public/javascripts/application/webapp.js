import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { Provider } from 'react-redux';

import Main from './pages/main.js';
import Home from './pages/home.js';
import Login from './pages/login.js';
import MapContainer from './components/map.container';
import EstacoesContainer from './components/estacoes.container';

import store from './utils/store';

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route component={Main}>
        <Route path="/" component={Home}>
          <IndexRoute component={MapContainer} />
          <Route path="/estacoes" component={EstacoesContainer} />
        </Route>
        <Route path="/login" component={Login} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app'));