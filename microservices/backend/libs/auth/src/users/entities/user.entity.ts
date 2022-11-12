import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';

import { Timestampable } from '@app/collections/behaviours/timestampable.behaviour';
import { Entity, Mix } from '@app/collections/collections.class';
import { Role } from '@app/permissions/defs';

export class UserPassword {
  hash: string;

  isEnabled: boolean;

  requiresEmailValidation: boolean;

  emailVerificationToken?: string;
}

@ObjectType()
@Schema()
export class User extends Entity {
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

// TODO: this should happen in another place, because you might wanna change "Role".
// Same goes for the users collection
registerEnumType(Role, { name: 'Role' });
