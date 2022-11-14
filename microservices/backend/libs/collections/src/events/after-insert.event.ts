import { Event } from '@app/event-manager/event.class';

import { Collection } from '../collections.class';
import { Context } from '../defs';

import { InsertOneResult, OptionalUnlessRequiredId } from 'mongodb';

export class AfterInsertEvent<
  DBEntityType,
  EntityType = DBEntityType,
> extends Event<{
  collection: Collection<DBEntityType, EntityType>;

  context?: Context;

  document: Partial<OptionalUnlessRequiredId<DBEntityType>>;

  insertResult: InsertOneResult<DBEntityType>;
}> {}
