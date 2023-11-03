import React from "react";
import {Link, useParams} from "react-router-dom";
import {gql, useQuery} from "@apollo/client";
import {RESTAURANT_FRAGMENT} from "../../constant/fragments";
import {FindRestaurantQuery, FindRestaurantQueryVariables} from "../../__graphql_type/type";

interface IRestaurantParams {
  id: string;
}

export const FIND_RESTAURANT_QUERY = gql`
 query findRestaurant($restaurantInput: RestaurantInput!) {
  findRestaurant(input: $restaurantInput) {
    ok
    error
    restaurant {
      ...RestaurantParts
    }
  }
}
${RESTAURANT_FRAGMENT}
`;

export const Restaurant = () =>  {
  const {id} = useParams<IRestaurantParams>()

  const {data, loading} = useQuery<FindRestaurantQuery, FindRestaurantQueryVariables>(FIND_RESTAURANT_QUERY, {
    variables: {
      restaurantInput: {
        restaurantId: +id
      }
    }
  })

  return (
    <>
      {!loading &&
        <div>
          <div style={{backgroundImage: `url(${data?.findRestaurant.restaurant?.coverImg})`}} className="bg-gray-800 py-48 bg-center bg-cover">
            <div className="bg-white w-3/12 py-8 px-5 xl:px-0">
              <h4 className="text-4xl mb-3">{data?.findRestaurant.restaurant?.name}</h4>
              <Link to={`/category/${data?.findRestaurant.restaurant?.category.slug}`}><h5 className="text-sm font-light mb-2">{data?.findRestaurant.restaurant?.category.name}</h5></Link>
              <h6 className="text-sm font-light">{data?.findRestaurant.restaurant?.address}</h6>
            </div>
          </div>
        </div>
      }
    </>
  );
}
