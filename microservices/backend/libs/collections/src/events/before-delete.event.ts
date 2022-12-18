import { Event } from '@app/event-manager/event';

import { Collection } from '../collections';
import { Context, Filter } from '../defs';

export class BeforeDeleteEvent<
  DBEntityType,
  EntityType = DBEntityType,
> extends Event<{
  collection: Collection<DBEntityType, EntityType>;

  context?: Context;

  filter: Filter<EntityType>;
}> {}
