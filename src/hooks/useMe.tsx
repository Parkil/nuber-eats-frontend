import {gql, useQuery} from "@apollo/client";
import {MeQuery, MeQueryVariables} from "../__graphql_type/type";

/*
  apollo 에서 한번 실행한 결과는 caching 하고 있다가 동일한 파라메터로 API 를 호출시 신규로 호출하는게
  아니라 caching 된 결과값을 그대로 반환
 */
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
export const useMe = () => {
  return useQuery<MeQuery, MeQueryVariables>(ME_QUERY, {});
}