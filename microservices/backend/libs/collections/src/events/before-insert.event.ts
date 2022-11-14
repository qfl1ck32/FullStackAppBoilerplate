import { Event } from '@app/event-manager/event.class';

import { Collection } from '../collections.class';
import { Context } from '../defs';

import { OptionalUnlessRequiredId } from 'mongodb';

export class BeforeInsertEvent<
  DBEntityType,
  EntityType = DBEntityType,
> extends Event<{
  collection: Collection<DBEntityType, EntityType>;

  document: Partial<OptionalUnlessRequiredId<DBEntityType>>;

  context?: Context;
}> {}
