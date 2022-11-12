import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';

import { User } from '@app/auth/users/entities/user.entity';

import { AddBehaviour } from './utils';

import { BehaviourFunction, ObjectId } from '../defs';
import { AfterDeleteEvent } from '../events/after-delete.event';
import { BeforeDeleteEvent } from '../events/before-delete.event';

import { DeleteResult } from 'mongodb';
import { decorate } from 'ts-mixer';

const softdeletable: BehaviourFunction<Softdeletable> = (collection) => {
  collection.deleteOne = async (filter, options = {}) => {
    const { context, ...mongoOptions } = options;

    await collection.eventManager.emit(
      new BeforeDeleteEvent({
        collection,
        context,
        filter,
      }),
    );

    const updateResult = await collection.updateOne(
      filter,
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date(),
          deletedByUserId: context?.userId,
        },
      },
      mongoOptions,
    );

    const { acknowledged, modifiedCount } = updateResult;

    const deleteResult = {
      acknowledged,
      deletedCount: modifiedCount,
    } as DeleteResult;

    await collection.eventManager.emit(
      new AfterDeleteEvent({
        collection,
        context,
        filter,
        deleteResult,
      }),
    );

    return deleteResult;
  };

  collection.findOneAndDelete = async (filter, options = {}) => {
    const { context, ...mongoOptions } = options;

    await collection.eventManager.emit(
      new BeforeDeleteEvent({
        collection,
        context,
        filter,
      }),
    );

    const modifyResult = await collection.findOneAndUpdate(
      filter,
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date(),
          deletedByUserId: context?.userId,
        },
      },
      mongoOptions,
    );

    await collection.eventManager.emit(
      new AfterDeleteEvent({
        collection,
        context,
        filter,
        deleteResult: {
          acknowledged: Boolean(modifyResult.ok),
          deletedCount: 1,
        },
      }),
    );

    return modifyResult;
  };
};

@decorate(ObjectType())
@decorate(Schema())
@decorate(AddBehaviour(softdeletable))
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
