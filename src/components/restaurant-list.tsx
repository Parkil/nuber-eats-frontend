import React from "react";
import {gql, useQuery} from "@apollo/client";
import {RestaurantsPageQuery, RestaurantsPageQueryVariables} from "../__graphql_type/type";

export const RestaurantList: React.FC = () => {

  const RESTAURANTS_QUERY = gql`
    query restaurantsPage($restaurantsInput: RestaurantsInput!) {
      allRestaurants(input: $restaurantsInput) {
        ok
        error
        totalPages
        totalItems
        results {
          id
          name
          coverImg
          category {
            name
          }
          address
          isPromoted
        }
      }
    }
  `;

  const {
    data,
    loading
  } = useQuery<RestaurantsPageQuery, RestaurantsPageQueryVariables>(RESTAURANTS_QUERY, {
    variables: {
      restaurantsInput: {
        page: 1
      }
    }
  });

  console.log(data, loading);

  return (
    <>
      {!loading &&
        <div className="max-w-screen-2xl mx-auto mt-8">
          <div className="justify-around max-w-4xl mx-auto">
            <div className="grid grid-cols-3 gap-x-5 gap-y-10">
              {data?.allRestaurants.results?.map(restaurant =>
                <div key={restaurant.id}>
                  <div style={{backgroundImage: `url(${restaurant.coverImg})`}} className="bg-red-500 bg-cover bg-center mb-3 py-28"></div>
                  <h3 className="text-xl font-medium">{restaurant.name}</h3>
                  <span className="border-t-2 border-gray-200">{restaurant.category.name}</span>
                </div>)
              }
            </div>
          </div>
        </div>
      }
    </>
  )
}