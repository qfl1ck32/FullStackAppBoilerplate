import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';

import { User } from '@app/users/users';

import { softdeletable } from './softdeletable.behaviour.function';
import { AddBehaviour } from './utils';

import { Relations } from '../collections.decorators';
import { ObjectId } from '../defs';

import { decorate } from 'ts-mixer';

@decorate(ObjectType())
@decorate(Schema())
@decorate(
  AddBehaviour(softdeletable, {
    shouldThrowErrorWhenMissingUserId: true,
  }),
)
@decorate(
  Relations<Softdeletable>()
    .add({
      field: 'deletedByUser',
      fieldId: 'deletedByUserId',
      to: () => User,
    })
    .build(),
)
export class Softdeletable {
  @decorate(Field(() => Boolean, { nullable: true }))
  @decorate(Prop())
  isDeleted?: boolean;

  @decorate(Field(() => Date, { nullable: true }))
  @decorate(Prop())
  deletedAt?: Date;

  @decorate(Field(() => ID, { nullable: true }))
  @decorate(Prop())
  deletedByUserId?: ObjectId;

  @decorate(Field(() => User, { nullable: true }))
  deletedByUser?: User;
}
