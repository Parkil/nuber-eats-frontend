import React from 'react';
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import {Restaurants} from "../pages/client/restaurants";
import {Header} from "../components/header";
import {useMe} from "../hooks/useMe";
import {ConfirmEmail} from "../pages/user/confirm-email";
import {EditProfile} from "../pages/user/edit-profile";
import {Search} from "../pages/client/search";
import {Category} from "../pages/client/category";

const ClientRoutes = [
  <Route key="main" path="/" exact>
    <Restaurants/>
  </Route>,
  <Route key="confirm" path="/confirm" exact>
    <ConfirmEmail/>
  </Route>,
  <Route key="editProfile" path="/edit-profile" exact>
    <EditProfile/>
  </Route>,
  <Route key="search" path="/search" exact>
    <Search/>
  </Route>,
  <Route key="category" path="/category/:slug">
    <Category/>
  </Route>
]

export const LoggedInRouter = () => {

  const {data, loading, error} = useMe();

  if (!data || loading || error) {
    return(
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );
  }

  return (
    <Router>
      <Header/>
      <Switch>
        {data.me.role === 'Client' && ClientRoutes}
        <Redirect to="/" />
      </Switch>
    </Router>
  );
};
