import { Event } from '@root/event-manager/event.class';

import { Collection } from '../collections/collection.class';
import { Context } from '../defs';

import { InsertOneResult, OptionalUnlessRequiredId } from 'mongodb';

export class AfterInsertEvent<T = any> extends Event<{
  collection: Collection<T>;

  context?: Context;

  document: OptionalUnlessRequiredId<T>;

  insertResult: InsertOneResult<T>;
}> {}
