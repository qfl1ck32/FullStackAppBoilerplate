import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';

import { User } from '@app/users/users.entity';

import { blameable } from './blameable.behaviour.function';
import { AddBehaviour } from './utils';

import { Relations } from '../collections.decorators';
import { ObjectId } from '../defs';

import { decorate } from 'ts-mixer';

@decorate(ObjectType())
@decorate(Schema())
@decorate(
  Relations<Blameable>()
    .add({
      field: 'createdByUser',
      fieldId: 'createdByUserId',
      to: () => User,
    })
    .build(),
)
@decorate(AddBehaviour(blameable()))
export class Blameable {
  @decorate(Field(() => ID))
  @decorate(Prop())
  createdByUserId: ObjectId;

  @decorate(Field(() => User))
  createdByUser: User;
}
