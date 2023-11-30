import {ApolloClient, createHttpLink, InMemoryCache, makeVar, split} from '@apollo/client';
import {LOCAL_STORAGE_TOKEN} from "./constant/constant";
import {setContext} from "@apollo/client/link/context";
import {WebSocketLink} from "@apollo/client/link/ws";
import {getMainDefinition} from "@apollo/client/utilities";

const token = localStorage.getItem(LOCAL_STORAGE_TOKEN);

// apollo reactive field 설정 (변경 가능)
// Boolean(token) - token 값이 null 이면 false 아니면 true
export const isLoggedInVar = makeVar(Boolean(token));
export const tokenVar = makeVar(token);

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql', // nuber-eats-backend의 url을 사용
});

// websocket 설정
const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options : {
    reconnect: true,
    connectionParams: {
      'x-jwt': tokenVar() ?? '',
    }
  }
})

// graphql 실행시 jwt token 을 실어서 보내도록 설정
const authLink = setContext((_, {headers}) => {
  return {
    headers: {
      ...headers,
      'x-jwt': tokenVar() ?? '',
    }
  }
});

// 조건에 따라서 http, websocket link 를 겸용으로 사용하도록 변경
const splitLink = split(({query}) =>  {
  const definition = getMainDefinition(query);
  return (
    definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
  )
}, wsLink, authLink.concat(httpLink));

export const client = new ApolloClient({
  link: splitLink,
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
