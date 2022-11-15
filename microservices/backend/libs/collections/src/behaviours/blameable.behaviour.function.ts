import type { Blameable } from './blameable.behaviour';

import { BehaviourFunction, BlameableBehaviourOptions } from '../defs';
import { BeforeInsertEvent } from '../events/before-insert.event';
import { UserMissingException } from '../exceptions/user-missing.exception';

export const blameable: BehaviourFunction<
  Blameable,
  BlameableBehaviourOptions
> = (
  options = {
    shouldThrowErrorWhenMissingUserId: true,
  },
) => {
  return (collection) => {
    const listener = async (event: BeforeInsertEvent<Blameable>) => {
      const { payload } = event;

      const { document, context } = payload;

      if (!context?.userId) {
        if (options.shouldThrowErrorWhenMissingUserId) {
          throw new UserMissingException();
        }
      }

      document.createdByUserId = context?.userId;
    };

    return collection.eventManager.addListener(BeforeInsertEvent, listener);
  };
};
