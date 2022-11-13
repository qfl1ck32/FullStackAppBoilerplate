import { Blameable } from './blameable.behaviour';

import { BehaviourFunction } from '../defs';
import { BeforeInsertEvent } from '../events/before-insert.event';
import { UserMissingException } from '../exceptions/user-missing.exception';

export const blameable: BehaviourFunction = (collection) => {
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
