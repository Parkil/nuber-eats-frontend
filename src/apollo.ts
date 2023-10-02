import {ApolloClient, createHttpLink, InMemoryCache, makeVar} from '@apollo/client';
import {LOCAL_STORAGE_TOKEN} from "./constant/constant";
import {setContext} from "@apollo/client/link/context";

const token = localStorage.getItem(LOCAL_STORAGE_TOKEN);

// apollo reactive field 설정 (변경 가능)
// Boolean(token) - token 값이 null 이면 false 아니면 true
export const isLoggedInVar = makeVar(Boolean(token));
export const tokenVar = makeVar(token);

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql', // nuber-eats-backend의 url을 사용
});

const authLink = setContext((_, {headers}) => {
  return {
    headers: {
      ...headers,
      'x-jwt': tokenVar() ?? '',
    }
  }
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: { // local only field 설정 (graphql 과 상관없이 브라우저에서만 사용되는 field - 자체로는 변경이 불가능)
      Query: {
        fields: {
          isLoggedIn: {
            read() {
              return isLoggedInVar();
            },
          },
          token: {
            read() {
              return tokenVar();
            },
          }
        }
      }
    }
  }),
});