import { blameable } from '@app/collections/behaviours/blameable.behaviour.function';
import { softdeletable } from '@app/collections/behaviours/softdeletable.behaviour.function';
import { Timestampable } from '@app/collections/behaviours/timestampable.behaviour';
import { AddBehaviour } from '@app/collections/behaviours/utils';
import { Collection, Combine, Entity } from '@app/collections/collections';
import {
  Field,
  ObjectType,
  Prop,
  Relations,
  Schema,
} from '@app/collections/collections.decorators';
import { ObjectId } from '@app/collections/defs';
import { createEntity } from '@app/collections/utils';
import { Id } from '@app/graphql/defs';
import { Language } from '@app/i18n/defs';
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

  @Field(() => Language)
  preferredLanguage: Language;

  @Prop()
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
export class User extends Combine(DBUser, Timestampable) {
  @Field(() => String)
  fullName: String;

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

  @Field(() => Id, { nullable: true })
  @Prop()
  deletedByUserId?: ObjectId;

  @Field(() => User, { nullable: true })
  deletedByUser?: User;

  /**
   * Blameable
   */

  @Field(() => Id, { nullable: true })
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
