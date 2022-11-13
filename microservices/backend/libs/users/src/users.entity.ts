import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';

import { blameable } from '@app/collections/behaviours/blameable.behaviour.function';
import { softdeletable } from '@app/collections/behaviours/softdeletable.behaviour.function';
import { Timestampable } from '@app/collections/behaviours/timestampable.behaviour';
import { AddBehaviour } from '@app/collections/behaviours/utils';
import { Entity, Mix } from '@app/collections/collections.class';
import { ObjectId } from '@app/collections/defs';
import { Role } from '@app/permissions/defs';

export class UserPassword {
  hash: string;

  isEnabled: boolean;

  requiresEmailValidation: boolean;

  emailVerificationToken?: string;
}

@ObjectType()
@Schema()
@AddBehaviour(blameable)
@AddBehaviour(softdeletable)
export class User extends Mix(Entity, Timestampable) {
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

  // TODO: we have to manually assign blameable and softdeletable, sadly,
  // because of circular dependency

  /**
   * Softdeletable
   */
  @Field(() => Boolean, { nullable: true })
  @Prop()
  isDeleted?: boolean;

  @Field(() => Date, { nullable: true })
  @Prop()
  deletedAt?: Date;

  @Field(() => ID, { nullable: true })
  @Prop()
  deletedByUserId?: ObjectId;

  @Field(() => User, { nullable: true })
  deletedByUser?: User;

  /**
   * Blameable
   */
  @Field(() => ID, { nullable: true })
  @Prop()
  createdByUserId?: ObjectId;

  @Field(() => User, { nullable: true })
  createdByUser?: User;
}

// TODO: this should happen in another place, because you might wanna change "Role".
// Same goes for the users collection
registerEnumType(Role, { name: 'Role' });