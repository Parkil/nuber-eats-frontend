import React from "react";
import {Link, useParams} from "react-router-dom";
import {gql, useQuery} from "@apollo/client";
import {DISH_FRAGMENT, RESTAURANT_FRAGMENT} from "../../constant/fragments";
import {OwnerRestaurantQuery, OwnerRestaurantQueryVariables} from "../../__graphql_type/type";

interface IRestaurantParams {
  id: string;
}

export const OWNER_RESTAURANT_QUERY = gql`
  query ownerRestaurant($ownerRestaurantInput: OwnerRestaurantInput!) {
    ownerRestaurant(input: $ownerRestaurantInput){
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
      }
    }
  } 
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
`;

export const MyRestaurant = () => {
  const {id} = useParams<IRestaurantParams>()

  const {data, loading} = useQuery<OwnerRestaurantQuery, OwnerRestaurantQueryVariables>(OWNER_RESTAURANT_QUERY, {
    variables: {
      ownerRestaurantInput: {
        id: +id
      }
    }
  })

  return (
    <>
      {
        !loading && <div>
          <div className="bg-gray-700 py-28 bg-center bg-cover"
               style={{backgroundImage: `url(${data?.ownerRestaurant.restaurant?.coverImg})`}}></div>
          <div className="container mt-10">
            <h2 className="text-4xl font-medium mb-10">{data?.ownerRestaurant.restaurant?.name ?? 'Loading ...'}</h2>
            <Link to={`/restaurant/${id}/add-dish`} className="mr-8 text-white bg-gray-800 py-3 px-10">
              Add Dish &rarr;
            </Link>
            <Link to={``} className="mr-8 text-white bg-lime-800 py-3 px-10">
              Buy Promotion &rarr;
            </Link>
          </div>
          <div className="mt-10">
            {data?.ownerRestaurant.restaurant?.menu.length === 0 ? <h4 className="text-xl mb-5">Please a Update Dish</h4> : <h4>요리111</h4>}
          </div>
        </div>
      }
    </>
  )
}
