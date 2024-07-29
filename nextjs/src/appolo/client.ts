import { ApolloClient, InMemoryCache } from '@apollo/client';

// todo - ログイン後のユーザーのidToken使ってリクエストを行う
const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_HASURA_ENDPOINT,
  cache: new InMemoryCache(),
  headers: {
    // 'x-hasura-admin-secret': '',
    // 'Authorization': `Bearer ${idToken}`
  },
});

export default client;
