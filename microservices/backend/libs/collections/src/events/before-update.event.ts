import { Event } from '@app/event-manager/event.class';

import { Collection } from '../collections.class';
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
