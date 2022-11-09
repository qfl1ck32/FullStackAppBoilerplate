import { Event } from '@root/event-manager/event.class';

import { Collection } from '../collections/collection.class';
import { Context } from '../defs';

import { Filter, UpdateFilter } from 'mongodb';

export class BeforeUpdateEvent<T = any> extends Event<{
  collection: Collection<T>;

  filter: Filter<T>;

  update: UpdateFilter<T>;

  context?: Context;
}> {}
