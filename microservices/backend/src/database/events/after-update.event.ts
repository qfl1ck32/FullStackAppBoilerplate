import { Event } from '@root/event-manager/event.class';

import { Collection } from '../collections/collection.class';
import { Context } from '../defs';

import { Filter, UpdateFilter, UpdateResult } from 'mongodb';

export class AfterUpdateEvent<T = any> extends Event<{
  collection: Collection<T>;
  context?: Context;

  filter: Filter<T>;

  update: UpdateFilter<T>;

  updateResult: UpdateResult;
}> {}
