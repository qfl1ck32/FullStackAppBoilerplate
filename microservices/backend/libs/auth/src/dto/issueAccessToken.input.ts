import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class IssueAccessTokenInput {
  @Field(() => String)
  refreshToken: string;
}
