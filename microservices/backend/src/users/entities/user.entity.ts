import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';

import {
  Blameable,
  Softdeletable,
  Timestampable,
} from '@root/collections/collections.behaviours';
import {
  Entity,
  Mix,
  createCollection,
} from '@root/collections/collections.class';
import { Role } from '@root/roles/roles.enum';

export class UserPassword {
  hash: string;

  isEnabled: boolean;

  requiresEmailValidation: boolean;

  emailVerificationToken?: string;
}

@ObjectType()
@Schema()
export class User extends Mix(Entity, Blameable, Timestampable, Softdeletable) {
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
