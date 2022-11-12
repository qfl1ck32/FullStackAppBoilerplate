import { Event } from '@root/event-manager/event.class';

import { Collection } from '../../collections/collections.class';
import { Context } from '../defs';

import { DeleteResult, Filter } from 'mongodb';

export class AfterDeleteEvent<T = any> extends Event<{
  collection: Collection<T>;

  context?: Context;

  filter: Filter<T>;

  deleteResult: DeleteResult;
}> {}
