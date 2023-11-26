import React from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {Restaurants} from "../pages/client/restaurants";
import {Header} from "../components/header";
import {useMe} from "../hooks/use.me";
import {ConfirmEmail} from "../pages/user/confirm.email";
import {EditProfile} from "../pages/user/edit.profile";
import {Restaurant} from "../pages/client/restaurant";
import {SetRoute} from "../components/set.route";
import {MyRestaurants} from "../pages/owner/my.restaurants";
import {AddRestaurant} from "../pages/owner/add.restaurant";
import {MyRestaurant} from "../pages/owner/my.restaurant";
import {AddDish} from "../pages/owner/add.dish";
import {NotFound} from "../pages/404";

const clientRoutes = [
  {
    path: '/',
    component: <Restaurants/>
  },
  {
    path: '/category/:slug',
    component: <Restaurants/>
  },
  {
    path: '/restaurant/:id',
    component: <Restaurant/>
  },
]

const commonRoutes = [
  {
    path: '/confirm',
    component: <ConfirmEmail/>
  },
  {
    path: '/edit-profile',
    component: <EditProfile/>
  },
]

const restaurantRoutes = [
  {
    path: '/',
    component: <MyRestaurants/>
  },
  {
    path: '/add-restaurant',
    component: <AddRestaurant/>
  },
  {
    path: '/restaurant/:id',
    component: <MyRestaurant/>
  },
  {
    path: '/restaurant/:id/add-dish',
    component: <AddDish/>
  },
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
        {data.me.role === 'Owner' && <SetRoute routeInfo={[...restaurantRoutes, ...commonRoutes]}/>}
        {data.me.role === 'Client' && <SetRoute routeInfo={[...clientRoutes, ...commonRoutes]}/>}
        <Route>
          <NotFound/>
        </Route>
      </Switch>
    </Router>
  );
};
