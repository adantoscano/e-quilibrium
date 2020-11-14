import React from 'react';
import { HashRouter, Switch, Route } from "react-router-dom";

import Device from './components/Device';

export default function App() {
  return(
    <HashRouter>
      <Switch>
        <Route path="/screen">
          <Device />
        </Route>
        <Route path="/">
          <Device />
        </Route>
      </Switch>
    </HashRouter>
  )
}
