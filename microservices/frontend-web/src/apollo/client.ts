import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  Observable,
  from,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

import {
  getAccessToken,
  getRefreshToken,
  onRefreshTokenExpired,
  setAccessToken,
} from '@root/auth/auth';
import env from '@root/env';
import { ExceptionCode } from '@root/globals/exception-codes';
import {
  IssueAccessTokenDocument,
  IssueAccessTokenQuery,
  IssueAccessTokenQueryVariables,
} from '@root/gql/operations';

const httpLink = new HttpLink({
  uri: env.GRAPHQL_URI,
});

const authLink = setContext((_, previousContext) => {
  const { headers } = previousContext;

  const accessToken = getAccessToken();

  return {
    headers: {
      ...headers,

      authorization: accessToken ? `Bearer ${accessToken}` : null,
    },
  };
});

const errorLink = onError(({ forward, operation, graphQLErrors = [] }) => {
  const expiredJwtError = graphQLErrors.find(
    (err) => err.code === ExceptionCode.EXPIRED_JWT,
  );

  if (expiredJwtError) {
    // TODO: type safety
    if (expiredJwtError.path?.[0] === 'issueAccessToken') {
      onRefreshTokenExpired();

      return;
    }

    return new Observable((observer) => {
      client
        .query<IssueAccessTokenQuery, IssueAccessTokenQueryVariables>({
          query: IssueAccessTokenDocument,

          variables: {
            input: {
              refreshToken: getRefreshToken() as string,
            },
          },
        })
        .then((response) => {
          const accessToken = response.data.issueAccessToken;

          setAccessToken(accessToken);

          return forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          });
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }
});

const client = new ApolloClient({
  cache: new InMemoryCache(),

  ssrMode: true,

  link: from([errorLink, authLink, httpLink]),
});

export default client;
