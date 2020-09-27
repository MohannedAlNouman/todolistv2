import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from '../pages/Home';
import MyLists from '../pages/MyLists';
import CreateList from '../pages/CreateList';

const Main = () => {
  return (
    <Switch>
      <Route exact path='/' component={Home}></Route>
      <Route exact path='/MyLists' component={MyLists}></Route>
      <Route exact path='/CreateList' component={CreateList}></Route>
    </Switch>
  );
}

export default Main;
