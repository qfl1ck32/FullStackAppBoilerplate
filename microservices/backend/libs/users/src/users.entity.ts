import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';

import { blameable } from '@app/collections/behaviours/blameable.behaviour.function';
import { softdeletable } from '@app/collections/behaviours/softdeletable.behaviour.function';
import { Timestampable } from '@app/collections/behaviours/timestampable.behaviour';
import { AddBehaviour } from '@app/collections/behaviours/utils';
import { Collection, Entity, Mix } from '@app/collections/collections.class';
import { Relations } from '@app/collections/collections.decorators';
import { ObjectId } from '@app/collections/defs';
import { createEntity } from '@app/collections/utils';
import { Role } from '@app/permissions/defs';

export class UserPassword {
  hash: string;

  isEnabled: boolean;

  requiresEmailValidation: boolean;

  emailVerificationToken?: string;
}

export class DBUser extends Entity {
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

@ObjectType()
@Schema()
@AddBehaviour(blameable)
@AddBehaviour(softdeletable)
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

// TODO: this should happen in another place, because you might wanna change "Role".
// Same goes for the users collection
registerEnumType(Role, { name: 'Role' });

export const UserEntity = createEntity({
  database: DBUser,
  relational: User,
});

export type UsersCollection = Collection<DBUser, User>;
