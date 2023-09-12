import {ApolloClient, InMemoryCache} from '@apollo/client';

export const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql', // nuber-eats-backend의 url을 사용
  cache: new InMemoryCache(),
});