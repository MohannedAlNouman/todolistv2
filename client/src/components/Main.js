import React from "react";
import {Switch, Route} from "react-router-dom";

import Home from "../pages/Home";
import MyLists from "../pages/MyLists";
import CreateList from "../pages/CreateList";
import Settings from "../pages/Settings";
import About from "../pages/About";

const Main = () => {
  return (
    <Switch>
      <Route exact path="/" component={Home}></Route>
      <Route exact path="/MyLists" component={MyLists}></Route>
      <Route exact path="/CreateList" component={CreateList}></Route>
      <Route exact path="/Settings" component={Settings}></Route>
      <Route exact path="/About" component={About}></Route>
    </Switch>
  );
};

export default Main;
