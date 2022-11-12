import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';

import { User } from '@app/auth/users/entities/user.entity';
import { UserMissingException } from '@app/collections/exceptions/user-missing.exception';

import { AddBehaviour } from './utils';

import { BehaviourFunction, ObjectId } from '../defs';
import { BeforeInsertEvent } from '../events/before-insert.event';

import { decorate } from 'ts-mixer';

const blameable: BehaviourFunction = (collection) => {
  const listener = async (event: BeforeInsertEvent<Blameable>) => {
    const { payload } = event;

    const { document, context } = payload;

    if (!context?.userId) {
      throw new UserMissingException();
    }

    const { userId } = context;

    document.createdByUserId = userId;
  };

  return collection.eventManager.addListener(BeforeInsertEvent, listener);
};

@decorate(ObjectType())
@decorate(Schema())
@decorate(AddBehaviour(blameable))
export class Blameable {
  @decorate(Field(() => ID))
  @decorate(Prop())
  createdByUserId: ObjectId;

  @decorate(Field(() => User))
  createdByUser?: User;
}
