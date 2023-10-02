import React from 'react';
import {gql, useQuery} from "@apollo/client";
import {MeQuery, MeQueryVariables} from "../__graphql_type/type";
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import {Restaurants} from "../pages/client/restaurants";

const ClientRoutes = [
  <Route key="main" path="/" exact>
    <Restaurants/>
  </Route>,
]

export const LoggedInRouter = () => {
  const ME_QUERY = gql`
    query me {
      me {
        id
        email
        role
        emailVerified
      }
    }
  `;

  const {data, loading, error} = useQuery<MeQuery, MeQueryVariables>(ME_QUERY, {});

  if (!data || loading || error) {
    return(
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );
  }

  return (
    <Router>
      <Switch>
        {data.me.role === 'Client' && ClientRoutes}
        <Redirect to="/" />
      </Switch>
    </Router>
  );
};