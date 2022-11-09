import { Event } from '@root/event-manager/event.class';

import { Collection } from '../collections/collection.class';
import { Context } from '../defs';

import { OptionalUnlessRequiredId } from 'mongodb';

export class BeforeInsertEvent<T = any> extends Event<{
  collection: Collection<T>;
  document: OptionalUnlessRequiredId<T>;
  context?: Context;
}> {}
