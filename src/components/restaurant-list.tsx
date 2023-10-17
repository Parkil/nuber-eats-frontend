import React, {useState} from "react";
import {gql, useQuery} from "@apollo/client";
import {RestaurantsPageQuery, RestaurantsPageQueryVariables} from "../__graphql_type/type";
import {RestaurantListRow} from "./restaurant-list-row";

interface IRestaurantListProps {
  query?: string;
}

export const RestaurantList: React.FC<IRestaurantListProps> = ({query}) => {

  const [pageNum, setPageNum] = useState(1);

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
        page: pageNum,
        ...(query && { query }) //query 가 존재할때만 query 값을 지정
      }
    }
  });

  const onNextPageClick = () => {
    setPageNum((current) => current + 1);
  }

  const onPrevPageClick = () => {
    setPageNum((current) => current - 1);
  }

  return (
    <>
      {!loading &&
        <div className="max-w-screen-2xl mx-auto mt-16 pb-20">
          <div className="justify-around max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-x-5 gap-y-10">
              {data?.allRestaurants.results?.map(restaurant =>
                <RestaurantListRow key={restaurant.id} coverImg={restaurant.coverImg} name={restaurant.name}
                                   categoryName={restaurant.category.name} id={restaurant.id}/>)
              }
            </div>
            <div className="grid grid-cols-3 text-center max-w-md items-center mx-auto mt-10">
              {pageNum > 1 ?
                (<button onClick={onPrevPageClick}
                        className="focus:outline-none font-medium text-2xl">&larr;</button>)
                : <div></div>
              }
              <span>
                Page {pageNum} of {data?.allRestaurants.totalPages}
              </span>
              {pageNum !== data?.allRestaurants.totalPages ?
                (<button onClick={onNextPageClick}
                        className="focus:outline-none font-medium text-2xl">&rarr;</button>)
                : <div></div>
              }
            </div>
          </div>
        </div>
      }
    </>
  )
}