import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';

import {
  Entity,
  Mix,
  createCollection,
} from '@app/collections/collections.class';
import { Role } from '@app/permissions/defs';

export class UserPassword {
  hash: string;

  isEnabled: boolean;

  requiresEmailValidation: boolean;

  emailVerificationToken?: string;
}

@ObjectType()
@Schema()
export class User extends Mix(Entity) {
  @Field(() => String)
  @Prop()
  firstName: string;

  @Field(() => String)
  @Prop()
  lastName: string;

  @Field(() => String)
  @Prop()
  username: string;

  @Field(() => String)
  @Prop()
  email: string;

  @Field(() => [Role])
  roles: Role[];

  @Prop()
  password: UserPassword;
}

registerEnumType(Role, { name: 'Role' });

export class UsersCollection extends createCollection(User) {}
