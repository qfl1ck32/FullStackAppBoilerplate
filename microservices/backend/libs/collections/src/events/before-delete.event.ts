import { Event } from '@app/event-manager/event.class';

import { Collection } from '../collections.class';
import { Context, Filter } from '../defs';

export class BeforeDeleteEvent<
  DBEntityType,
  EntityType = DBEntityType,
> extends Event<{
  collection: Collection<DBEntityType, EntityType>;

  context?: Context;

  filter: Filter<EntityType>;
}> {}
