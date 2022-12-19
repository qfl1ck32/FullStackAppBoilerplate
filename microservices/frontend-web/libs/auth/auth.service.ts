import { ApolloClient } from '@libs/apollo/apollo.client';
import { AuthTokenService } from '@libs/auth-token/auth-token.service';
import { Inject, Injectable } from '@libs/di/decorators';
import { StateService } from '@libs/state/state.service';

import {
  LoginUserDocument,
  LoginUserInput,
  LoginUserMutation,
  LoginUserMutationVariables,
  RegisterUserDocument,
  RegisterUserInput,
  RegisterUserMutation,
  RegisterUserMutationVariables,
} from '@root/gql/operations';
import { NotificationService } from '@root/services/notification/notification.service';

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

    return true;
  }

  public async register(input: RegisterUserInput) {
    const response = await this.apolloClient.mutate<
      RegisterUserMutation,
      RegisterUserMutationVariables
    >({
      mutation: RegisterUserDocument,
      variables: {
        input,
      },
    });
  }
}
