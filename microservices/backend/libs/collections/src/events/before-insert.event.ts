import { Event } from '@app/event-manager/event.class';

import { Collection } from '../collections.class';
import { Context } from '../defs';

import { OptionalUnlessRequiredId } from 'mongodb';

export class BeforeInsertEvent<T = any> extends Event<{
  collection: Collection<T>;
  document: Partial<OptionalUnlessRequiredId<T>>;
  context?: Context;
}> {}
