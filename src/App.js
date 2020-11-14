import React from 'react';
import { HashRouter, Switch, Route } from "react-router-dom";

import Device from './components/Device';
import Screen from './components/Screen';

export default function App() {
  return(
    <HashRouter>
      <Switch>
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
