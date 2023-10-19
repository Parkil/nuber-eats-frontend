import {gql, useQuery} from "@apollo/client";
import {RestaurantsPageQuery, RestaurantsPageQueryVariables} from "../__graphql_type/type";
import {RESTAURANT_FRAGMENT} from "../fragments";

const RESTAURANTS_QUERY = gql`
  query restaurantsPage($restaurantsInput: RestaurantsInput!) {
    allRestaurants(input: $restaurantsInput) {
      ok
      error
      totalPages
      totalItems
      results {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

/*
  useLazyQuery 는 <button onClick={() => runQuery()}>Load greeting</button> 처럼 버튼으로 실행할때에만
  정상적으로 작동하며 이걸 script 상에서 runQuery() 식으로 써버리면 무한 루프가 발생 한다
  apollo api 상에는 skip option(apollo client side 에서만 작동) 이 있으므로 이를 이용하면 될듯
 */
export const useRestaurants = (isSkip: boolean, pageNum: number, query?: string) => {
  return useQuery<RestaurantsPageQuery, RestaurantsPageQueryVariables>(RESTAURANTS_QUERY, {
    variables: {
      restaurantsInput: {
        page: pageNum,
        ...(query && { query }) //query 가 존재할때만 query 값을 지정
      }
    },
    skip: isSkip,
  });
}
