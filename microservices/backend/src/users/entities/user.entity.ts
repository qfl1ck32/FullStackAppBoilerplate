import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';

import {
  Blameable,
  Timestampable,
  WithBehaviours,
} from '@root/database/collections/collection.behaviours';
import { Collection } from '@root/database/collections/collection.class';
import { ObjectId } from '@root/database/defs';
import { Role } from '@root/roles/roles.enum';

import { Document } from 'mongoose';
import { Mixin } from 'ts-mixer';

export type UserDocument = User & Document<ObjectId>;

export type UsersCollection = Collection<User>;

export class UserPassword {
  hash: string;

  isEnabled: boolean;

  requiresEmailValidation: boolean;

  emailVerificationToken?: string;
}

@ObjectType()
@Schema()
export class User extends WithBehaviours(Blameable, Timestampable) {
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

const x = new User();
