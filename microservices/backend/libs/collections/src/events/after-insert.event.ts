import { Event } from '@app/event-manager/event.class';

import { Collection } from '../collections.class';
import { Context } from '../defs';

import { InsertOneResult, OptionalUnlessRequiredId } from 'mongodb';

export class AfterInsertEvent<T = any> extends Event<{
  collection: Collection<T>;

  context?: Context;

  document: Partial<OptionalUnlessRequiredId<T>>;

  insertResult: InsertOneResult<T>;
}> {}
