import { Event } from '@app/event-manager/event';

import { Collection } from '../collections';
import { Context, Filter, UpdateFilter } from '../defs';

export class BeforeUpdateEvent<
  DBEntityType,
  EntityType = DBEntityType,
> extends Event<{
  collection: Collection<DBEntityType, EntityType>;

  filter: Filter<EntityType>;

  update: UpdateFilter<DBEntityType>;

  context?: Context;
}> {}
