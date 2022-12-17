import { Event } from '@app/event-manager/event.class';

import { Collection } from '../collections.class';
import { Context, Filter, UpdateFilter } from '../defs';

import { UpdateResult } from 'mongodb';

export class AfterUpdateEvent<
  DBEntityType,
  EntityType = DBEntityType,
> extends Event<{
  collection: Collection<DBEntityType, EntityType>;
  context?: Context;

  filter: Filter<EntityType>;

  update: UpdateFilter<DBEntityType>;

  updateResult: UpdateResult;
}> {}
