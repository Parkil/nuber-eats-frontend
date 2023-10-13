import React from "react";
import {gql, useQuery} from "@apollo/client";
import {RestaurantsPageQueryQuery, RestaurantsPageQueryQueryVariables} from "../../__graphql_type/type";

export const Restaurants = () => {
  document.title = 'Restaurants | Nuber';

  //1개의 query 에서 여러개의 query 를 합쳐서 호출하는것도 가능
  const RESTAURANTS_QUERY = gql`
    query restaurantsPageQuery($restaurantsInput: RestaurantsInput!) {
      allCategories {
        ok
        error
        categories {
          id
          name
          coverImg
          slug
          restaurantCount
        }
      }
      
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
  } = useQuery<RestaurantsPageQueryQuery, RestaurantsPageQueryQueryVariables>(RESTAURANTS_QUERY, {
    variables: {
      restaurantsInput: {
        page: 1
      }
    }
  });

  // link 를 이용해서 해당 페이지로 간다고 해서 변경이 없는 component 가 rerendering 되지는 않는다
  return (
    <div>
      <form className="bg-gray-800 w-full py-40 flex items-center justify-center">
        <input type="Search" className="input rounded-md border-0 w-3/12" placeholder="Search Restaurants..."/>
      </form>
      {!loading &&
        <div className="max-w-screen-2xl mx-auto mt-8">
          <div className="flex justify-around max-w-xs mx-auto">
            {data?.allCategories.categories?.map(category =>
              <div key={category.name} className="flex flex-col items-center cursor-pointer">
                <div className="w-14 h-14 bg-cover hover:bg-gray-100 rounded-full" style={{backgroundImage: `url(${category.coverImg})`}}></div>
                <span className="text-sm text-center font-bold mt-1">{category.name}</span>
              </div>
            )}
          </div>
        </div>
      }
    </div>
  );
}