import React, {useState} from "react"
import {gql, useQuery} from "@apollo/client";
import {RESTAURANT_FRAGMENT} from "../../constant/fragments";
import {MyRestaurantsPageQuery, MyRestaurantsPageQueryVariables} from "../../__graphql_type/type";
import {Link} from "react-router-dom";

export const MY_RESTAURANTS_QUERY = gql`
  query myRestaurantsPage($restaurantsInput: SearchRestaurantsInput!) {
    findRestaurantsByOwner(input: $restaurantsInput) {
      ok
      error
      totalPages
      totalItems
      searchResult {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`

export const MyRestaurants = () => {
  document.title = 'My Restaurants | Nuber';

  const [query, setQuery] = useState('222')
  const [pageNum, setPageNum] = useState(1)

  const {data, loading} = useQuery<MyRestaurantsPageQuery, MyRestaurantsPageQueryVariables>(MY_RESTAURANTS_QUERY, {
    variables: {
      restaurantsInput: {
        page: pageNum,
        query: query,
      }
    },
  })

  console.log(data, loading)

  return (
    <div>
      <div className="max-w-screen-2xl mx-auto mt-32">
        <h2 className="text-4xl font-medium mb-10">My Restaurants</h2>
        {data?.findRestaurantsByOwner.ok && data.findRestaurantsByOwner.searchResult.length === 0 && (
          <>
            <h4 className="text-xl mb-5">You have no restaurants.</h4>
            <Link
              className="link"
              to="/add-restaurant"
            >
              Create one &rarr;
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
