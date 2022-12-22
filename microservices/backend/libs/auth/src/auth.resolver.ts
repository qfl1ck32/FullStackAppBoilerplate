import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { ObjectId } from '@app/collections/defs';
import { GetUserId } from '@app/graphql/graphql.decorators';
import { User } from '@app/users/users';

import { IssueAccessTokenInput } from './dto/issueAccessToken.input';
import { LoginUserInput, LoginUserResponse } from './dto/login.input';
import { RegisterUserInput } from './dto/register.input';

import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Boolean)
  async register(
    @Args({ type: () => RegisterUserInput, name: 'input' })
    input: RegisterUserInput,
  ) {
    await this.authService.register(input);

    return true;
  }

  @Mutation(() => LoginUserResponse)
  async login(
    @Args({ type: () => LoginUserInput, name: 'input' }) input: LoginUserInput,
  ) {
    return this.authService.login(input);
  }

  @Query(() => String)
  async issueAccessToken(
    @Args({ type: () => IssueAccessTokenInput, name: 'input' })
    input: IssueAccessTokenInput,
  ) {
    return this.authService.issueAccessToken(input);
  }

  @Query(() => User)
  async getMe(@GetUserId() userId: ObjectId) {
    return this.authService.getMe(userId);
  }
}
