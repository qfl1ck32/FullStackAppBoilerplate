import { Event } from '@app/event-manager/event.class';

import { Collection } from '../collections.class';
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
