import {
  ApolloCache,
  ApolloQueryResult,
  ApolloClient as BaseApolloClient,
  DefaultContext,
  MutationOptions,
  OperationVariables,
  QueryOptions,
} from '@apollo/client';
import { HttpLink, InMemoryCache, Observable, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { AuthTokenService } from '@libs/auth-token/auth-token.service';
import { Inject, Injectable } from '@libs/di/decorators';

import env from '@root/env';
import { ExceptionCode } from '@root/globals/exception-codes';
import {
  IssueAccessTokenDocument,
  IssueAccessTokenQuery,
  IssueAccessTokenQueryVariables,
} from '@root/gql/operations';

import { FetchResult } from './defs';

@Injectable()
export class ApolloClient extends BaseApolloClient<any> {
  constructor(@Inject() protected readonly authTokenService: AuthTokenService) {
    super({
      cache: new InMemoryCache(),

      ssrMode: true,
    });

    this.setLink(from([this.errorLink, this.authLink, this.httpLink]));
  }

  private get errorLink() {
    return onError(
      ({ forward, operation, graphQLErrors = [], networkError }) => {
        const expiredJwtError = graphQLErrors.find(
          (err) => err.code === ExceptionCode.EXPIRED_JWT,
        );

        if (networkError) {
          console.log({ networkError });
        }

        if (expiredJwtError) {
          // TODO: type safety
          if (expiredJwtError.path?.[0] === 'issueAccessToken') {
            this.authTokenService.onRefreshTokenExpired();

            return;
          }

          return new Observable((observer) => {
            this.query<IssueAccessTokenQuery, IssueAccessTokenQueryVariables>({
              query: IssueAccessTokenDocument,

              variables: {
                input: {
                  refreshToken: this.authTokenService.refreshToken,
                },
              },
            })
              .then((response) => {
                const accessToken = response.data.issueAccessToken;

                this.authTokenService.accessToken = accessToken;

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
      },
    );
  }

  private get authLink() {
    return setContext((_, previousContext) => {
      const { headers } = previousContext;

      const accessToken = this.authTokenService.accessToken;

      return {
        headers: {
          ...headers,

          authorization: accessToken ? `Bearer ${accessToken}` : null,
        },
      };
    });
  }

  private get httpLink() {
    return new HttpLink({
      uri: env.GRAPHQL_URI,
    });
  }

  public query<T = any, TVariables = OperationVariables>(
    options: QueryOptions<TVariables, T>,
  ): Promise<ApolloQueryResult<T>> {
    return super.query(options);
  }

  public mutate<
    TData = any,
    TVariables = OperationVariables,
    TContext = DefaultContext,
    TCache extends ApolloCache<any> = ApolloCache<any>,
  >(
    options: MutationOptions<TData, TVariables, TContext, ApolloCache<any>>,
  ): Promise<FetchResult<TData, Record<string, any>, Record<string, any>>> {
    // @ts-ignore Types :D
    return super.mutate(options);
  }
}
