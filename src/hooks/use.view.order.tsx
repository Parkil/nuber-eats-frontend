import {gql, useQuery} from "@apollo/client";
import {ViewOrderQuery, ViewOrderQueryVariables} from "../__graphql_type/type";
import {FULL_ORDER_FRAGMENT} from "../constant/fragments";

const VIEW_ORDER_QUERY = gql`
  query viewOrder($viewOrderInput: ViewOrderInput!) {
    viewOrder(input: $viewOrderInput) {
      ok
      error
      orderInfo {
        ...FullOrderParts
      }
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

export const useViewOrder = (orderId: number) => {
  return useQuery<ViewOrderQuery, ViewOrderQueryVariables>(VIEW_ORDER_QUERY, {
    variables : {
      viewOrderInput: {
        orderId
      }
    }
  });
}
