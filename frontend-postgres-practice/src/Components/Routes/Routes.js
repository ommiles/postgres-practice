import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Pages from '../Pages';

export const Routes = () => {
  return (
    <div className='App'>
      <Switch>
        <Route path='/signup' component={Pages.Signup} />
        <Route path='/login' component={Pages.Login} />
        <Route exact path='/' component={Pages.Home} />
      </Switch>
    </div>
  );
};
