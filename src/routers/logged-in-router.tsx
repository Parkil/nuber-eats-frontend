import React from 'react';
import {gql, useQuery} from "@apollo/client";
import {MeQuery, MeQueryVariables} from "../__graphql_type/type";

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
    <div>
      <h1>{data.me.role}</h1>
    </div>
  );
};