import { Event } from '@app/event-manager/event';

import { Collection } from '../collections';
import { Context, OptionalUnlessRequiredId } from '../defs';

import { InsertOneResult } from 'mongodb';

export class AfterInsertEvent<
  DBEntityType,
  EntityType = DBEntityType,
> extends Event<{
  collection: Collection<DBEntityType, EntityType>;

  context?: Context;

  document: Partial<OptionalUnlessRequiredId<DBEntityType>>;

  insertResult: InsertOneResult<DBEntityType>;
}> {}
