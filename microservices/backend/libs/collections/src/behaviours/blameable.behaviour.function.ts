import type { Blameable } from './blameable.behaviour';

import { BehaviourFunction, BlameableBehaviourOptions } from '../defs';
import { BeforeInsertEvent } from '../events/before-insert.event';
import { UserMissingException } from '../exceptions/user-missing.exception';

export const blameable: BehaviourFunction<
  Blameable,
  BlameableBehaviourOptions
> = (options) => {
  return (collection) => {
    const listener = async (event: BeforeInsertEvent<Blameable>) => {
      const { payload } = event;

      // TODO: any other way to do this?
      if (payload.collection !== collection) return;

      const { document, context } = payload;

      if (!context?.userId) {
        if (options.shouldThrowErrorWhenMissingUserId) {
          throw new UserMissingException();
        }
      }

      document.createdByUserId = context?.userId;
    };

    // TODO: then, does it make sense to have it here as local?
    return collection.localEventManager.addListener(
      BeforeInsertEvent,
      listener,
    );
  };
};
