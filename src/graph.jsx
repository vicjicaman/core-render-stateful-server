import fetch from 'node-fetch';
import {ApolloClient} from 'apollo-client';
import {ApolloLink} from 'apollo-link';
import {HttpLink} from 'apollo-link-http';
import {InMemoryCache, IntrospectionFragmentMatcher} from 'apollo-cache-inmemory';
import {getOperationAST} from 'graphql';

// docker-compose exec app bash
// node ./FragmentGenerator.jsx
/*import introspectionQueryResultData from '../fragmentTypes.json';
const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData
});*/

export default({uri, req}) => ({
  graph: new ApolloClient({
    ssrMode: true,
    link: new HttpLink({
      uri,
      credentials: 'include',
      fetch: fetch,
      headers: {
        cookie: req.header('Cookie')
      }
    }), // 'http://graph:3000/graphql'
    cache: new InMemoryCache(/* { fragmentMatcher } */)
  })
});
