import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';

import { blameable } from '@app/collections/behaviours/blameable.behaviour.function';
import { softdeletable } from '@app/collections/behaviours/softdeletable.behaviour.function';
import { Timestampable } from '@app/collections/behaviours/timestampable.behaviour';
import { AddBehaviour } from '@app/collections/behaviours/utils';
import { Collection, Entity, Mix } from '@app/collections/collections.class';
import {
  MixField,
  MixObjectType,
  MixProp,
  MixSchema,
  Relations,
} from '@app/collections/collections.decorators';
import { ObjectId } from '@app/collections/defs';
import { createEntity } from '@app/collections/utils';
import { Language } from '@app/i18n/defs';
import { Role } from '@app/permissions/defs';

export class UserPassword {
  hash: string;

  isEnabled: boolean;

  requiresEmailValidation: boolean;

  emailVerificationToken?: string;
}

@MixObjectType()
@MixSchema()
export class DBUser extends Entity {
  @MixField(() => String)
  @MixProp()
  firstName: string;

  @MixField(() => String)
  @MixProp()
  lastName: string;

  @MixField(() => String)
  @MixProp()
  username: string;

  @MixField(() => String)
  @MixProp()
  email: string;

  @MixField(() => [Role])
  roles: Role[];

  @MixField(() => Language)
  preferredLanguage: Language;

  @MixProp()
  password: UserPassword;
}

@ObjectType()
@Schema()
@AddBehaviour(blameable, {
  shouldThrowErrorWhenMissingUserId: false,
})
@AddBehaviour(softdeletable, {
  shouldThrowErrorWhenMissingUserId: true,
})
@Relations<User>()
  .add({
    field: 'deletedByUser',
    fieldId: 'deletedByUserId',
    to: () => User,
  })
  .add({
    field: 'createdByUser',
    fieldId: 'createdByUserId',
    to: () => User,
  })
  .build()
export class User extends Mix(DBUser, Timestampable) {
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

export const UserEntity = createEntity({
  database: DBUser,
  relational: User,
});

export type UsersCollection = Collection<DBUser, User>;
