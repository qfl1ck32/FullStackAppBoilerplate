import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class EndUsersTodosCreateInput {
  @Field(() => String)
  title: string;
}
