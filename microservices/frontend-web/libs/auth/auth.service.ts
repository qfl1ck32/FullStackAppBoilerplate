import { ApolloClient } from '@libs/apollo/apollo.client';
import { AuthTokenService } from '@libs/auth-token/auth-token.service';
import { Inject, Injectable } from '@libs/di/decorators';
import { StateService } from '@libs/state/state.service';

import {
  GetMeDocument,
  GetMeQuery,
  GetMeQueryVariables,
  LoginUserDocument,
  LoginUserInput,
  LoginUserMutation,
  LoginUserMutationVariables,
  RegisterUserDocument,
  RegisterUserInput,
  RegisterUserMutation,
  RegisterUserMutationVariables,
} from '@root/gql/operations';

import { AuthServiceState } from './defs';

@Injectable()
export class AuthService extends StateService<AuthServiceState, any> {
  constructor(
    @Inject() protected readonly authTokenService: AuthTokenService,
    @Inject() protected readonly apolloClient: ApolloClient,
  ) {
    super();

    this.setState({
      isAuthenticated: false,
      isLoading: false,
      user: undefined,
    });
  }

  public async login(input: LoginUserInput) {
    const response = await this.apolloClient.mutate<
      LoginUserMutation,
      LoginUserMutationVariables
    >({
      mutation: LoginUserDocument,
      variables: {
        input,
      },
    });

    const { accessToken, refreshToken } = response.data.login;

    this.authTokenService.accessToken = accessToken;
    this.authTokenService.refreshToken = refreshToken;

    await this.getMe();

    return true;
  }

  public async register(input: RegisterUserInput) {
    await this.apolloClient.mutate<
      RegisterUserMutation,
      RegisterUserMutationVariables
    >({
      mutation: RegisterUserDocument,
      variables: {
        input,
      },
    });
  }

  public async getMe() {
    const { data } = await this.apolloClient.query<
      GetMeQuery,
      GetMeQueryVariables
    >({
      query: GetMeDocument,
    });

    this.updateState({
      user: data.getMe,
    });
  }
}
