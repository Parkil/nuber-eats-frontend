import React from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {Login} from "../pages/login";
import {CreateAccount} from "../pages/create.account";
import {NotFound} from "../pages/404";

/*
  <Route path="/"> 는 [/] 이 포함된 모든 페이지를 의미한다
  <Route path="/" exact>는 [/] 만 포함된 페이지를 의미한다
 */

export const LoggedOutRouter = () => {
  return <Router>
    <Switch>
      <Route path="/create-account">
        <CreateAccount/>
      </Route>
      <Route path="/" exact>
        <Login/>
      </Route>
      <Route>
        <NotFound/>
      </Route>
    </Switch>
  </Router>;
};
