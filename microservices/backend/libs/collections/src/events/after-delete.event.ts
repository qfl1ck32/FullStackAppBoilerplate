import { Event } from '@app/event-manager/event';

import { Collection } from '../collections';
import { Context, Filter } from '../defs';

import { DeleteResult } from 'mongodb';

export class AfterDeleteEvent<
  DBEntityType,
  EntityType = DBEntityType,
> extends Event<{
  collection: Collection<DBEntityType, EntityType>;

  context?: Context;

  filter: Filter<EntityType>;

  deleteResult: DeleteResult;
}> {}
