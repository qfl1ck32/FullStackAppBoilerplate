import { Field, InputType } from '@nestjs/graphql';

import { IsEmail, MinLength } from 'class-validator';

@InputType()
export class RegisterUserInput {
  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String, { nullable: true })
  username?: string;

  @Field(() => String)
  @MinLength(8)
  password: string;
}
