import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class LoginUserInput {
  @Field(() => String)
  usernameOrEmail: string;

  @Field(() => String)
  password: string;
}

@ObjectType()
export class LoginUserResponse {
  @Field(() => String)
  accessToken: string;

  @Field(() => String)
  refreshToken: string;
}
