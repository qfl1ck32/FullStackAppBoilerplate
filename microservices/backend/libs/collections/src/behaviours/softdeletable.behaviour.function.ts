import type { Softdeletable } from './softdeletable.behaviour';

import { BehaviourFunction, SoftdeletableBehaviourOptions } from '../defs';
import { AfterDeleteEvent } from '../events/after-delete.event';
import { BeforeDeleteEvent } from '../events/before-delete.event';
import { UserMissingException } from '../exceptions/user-missing.exception';

import { DeleteResult } from 'mongodb';

export const softdeletable: BehaviourFunction<
  Softdeletable,
  SoftdeletableBehaviourOptions
> = (
  behavioursOptions = {
    shouldThrowErrorWhenMissingUserId: true,
  },
) => {
  return (collection) => {
    collection.deleteOne = async (filter, options = {}) => {
      const { context, ...mongoOptions } = options;

      if (!context?.userId) {
        if (behavioursOptions.shouldThrowErrorWhenMissingUserId) {
          throw new UserMissingException();
        }
      }

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

      if (!context?.userId) {
        if (behavioursOptions.shouldThrowErrorWhenMissingUserId) {
          throw new UserMissingException();
        }
      }

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
};
