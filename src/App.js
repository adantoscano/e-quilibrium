import React from 'react';
import { HashRouter, Switch, Route } from "react-router-dom";

import Device from './components/Device';
import Screen from './components/Screen';
import List from './components/List';

export default function App() {
  return(
    <HashRouter>
      <Switch>
        <Route path="/list">
          <List />
        </Route>
        <Route path="/screen">
          <Screen />
        </Route>
        <Route path="/">
          <Device />
        </Route>
      </Switch>
    </HashRouter>
  )
}
