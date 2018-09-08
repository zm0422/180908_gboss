import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter,HashRouter,Route,Switch} from 'react-router-dom';
import {Provider} from 'react-redux';
import store from './redux/store';

import Login from './containers/login/login'
import Register from './containers/register/register'
import Dashboard from './containers/dashboard/dashboard'


ReactDOM.render((
  <Provider store={store}>
    <HashRouter>
      <Switch>
        <Route path="/login" component={Login}/>
        <Route path="/register" component={Register}/>
        <Route  component={Dashboard}/>
      </Switch>
    </HashRouter>
  </Provider>
), document.getElementById('root'))