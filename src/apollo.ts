import {ApolloClient, InMemoryCache, makeVar} from '@apollo/client';

// apollo reactive field 설정 (변경 가능)
export const isLoggedInVar = makeVar(false);

export const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql', // nuber-eats-backend의 url을 사용
  cache: new InMemoryCache({
    typePolicies: { // local only field 설정 (graphql 과 상관없이 브라우저에서만 사용되는 field - 자체로는 변경이 불가능)
      Query: {
        fields: {
          isLoggedIn: {
            read() {
              return isLoggedInVar();
            },
          }
        }
      }
    }
  }),
});