import React from 'react';
import {BrowserRouter as Router, Redirect, Switch} from "react-router-dom";
import {Restaurants} from "../pages/client/restaurants";
import {Header} from "../components/header";
import {useMe} from "../hooks/use.me";
import {ConfirmEmail} from "../pages/user/confirm.email";
import {EditProfile} from "../pages/user/edit.profile";
import {Search} from "../pages/client/search";
import {Category} from "../pages/client/category";
import {Restaurant} from "../pages/client/restaurant";
import {SetRoute} from "../components/set.route";
import {MyRestaurants} from "../pages/owner/my.restaurants";
import {AddRestaurant} from "../pages/owner/add.restaurant";

const clientRoutes = [
  {
    path: '/',
    component: <Restaurants/>
  },
  {
    path: '/search',
    component: <Search/>
  },
  {
    path: '/category/:slug',
    component: <Category/>
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
    path: '/add-restaurant',
    component: <AddRestaurant/>
  },
  {
    path: '/',
    component: <MyRestaurants/>
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
        {data.me.role === 'Client' && <SetRoute routeInfo={clientRoutes}/>}
        {data.me.role === 'Owner' && <SetRoute routeInfo={restaurantRoutes}/>}
        <SetRoute routeInfo={commonRoutes}/>
        <Redirect to="/" />
      </Switch>
    </Router>
  );
};
